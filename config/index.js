var express = require('express'),
    bunyan = require('bunyan'),
    favicon = require('serve-favicon'),
    bodyParser = require('body-parser'),
    logger = require('express-logger'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    redisStore = require('connect-redis')(session),
    crypto = require('crypto'),
    path = require('path'),
    entities = require('./entities'),
    passport = require('passport'),
    sockets = require('./sockets'),
    compression = require('compression'),
    queue = require('bull'),
    envConfig = require('./configlist'),
    flash = require('connect-flash'),
    cache = require('redis');


module.exports = function(app, io) {
  //logger initialization
    Logger = bunyan.createLogger({
    name: 'bluecat',
    streams: [
        {
          type: 'rotating-file',
          level: 'info',
          path: app.get('basedir') + '/logs/info.txt',  // log INFO and above to stdout 
          period: '1d',   // daily rotation 
          count: 3        // keep 3 back copies 
        },
        {
          type: 'rotating-file',
          level: 'warn',
          path: app.get('basedir') + '/logs/warns.txt',  // log ERROR and above to a file 
          period: '3d',   // daily rotation 
          count: 3        // keep 3 back copies 
        },
        {
          type: 'rotating-file',
          level: 'error',
          path: app.get('basedir') + '/logs/errors.txt',  // log ERROR and above to a file 
          period: '7d',   // daily rotation 
          count: 3        // keep 3 back copies 
        }
      ]
    });
  if(process.env.NODE_ENV == 'production') {
    console.log = function(msg) {
      Logger.info(msg);
    };
  }

  //cache initialization
  Cache = cache.createClient({host: envConfig.redis_host, port: envConfig.redis_port, auth_pass: envConfig.redis_pass});

  //basic configuration
  app.use(express.static(app.get('basedir') + '/assets'));
  app.set('port', envConfig.port);
  app.set('view engine', envConfig.view_engine);
  app.set('views', app.get('basedir') + '/views');

  //initialization of cache
  Cache.set('socketIdsByUserId', JSON.stringify({}));
  Cache.set('userIdsBySocketId', JSON.stringify({}));

  //favicon
  app.use(favicon(app.get('basedir') + '/assets/images/favicon.ico'));

  //logger
  app.use(logger({path: app.get('basedir') + "/logs/logfile.txt"}));

  //body parser
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  //websocket
  sockets(io);

  // GZIP all assets
  app.use(compression());

  //cookie parser
  app.use(cookieParser());
  //flash message
  app.use(flash());
  //declare db
  entities(function (err, db) {
      if (err) return err;
  });
  //sessions
  app.use(
    session({
      genid: function() {
        var rnd = crypto.randomBytes(16);
        rnd[6] = (rnd[6] & 0x0f) | 0x40;
        rnd[8] = (rnd[8] & 0x3f) | 0x80;
        rnd = rnd.toString('hex').match(/(.{8})(.{4})(.{4})(.{4})(.{12})/);
        rnd.shift();
        return rnd.join('-');
      },
      secret: 'f4b82ae2275628c40b6bf03a00bbe3ab34eb49cf',
      resave: false,
      saveUninitialized: true,
      store: new redisStore({host: envConfig.redis_host, port: envConfig.redis_port, client: Cache })
    })
  );

  //passport
  require('./passport.js')(passport);
  app.use(passport.initialize());
  app.use(passport.session());

  //custom things in controllers
  app.use(function(req, res, next) {
    res.locals.user = req.user;
    res.locals.flash = {};
    
    res.locals.flash.success = req.flash('success');
    res.locals.flash.info = req.flash('info');
    res.locals.flash.error = req.flash('error');

    res.redirectHome = function() {
      var role = req.user.roleCode;
      if(role == 'admin') {
        return res.redirect('/adminDashboard');
      } else if(typeof role != 'undefined') {
        return res.redirect('/dashboard');
      } else {
        return res.redirect('/');
      }
    };
    next();
  });
};