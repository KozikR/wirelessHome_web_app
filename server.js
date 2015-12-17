var express = require('express'),
    http = require('http'),
    app = module.exports.app = express(),
    server = http.createServer(app),
    io = require('socket.io').listen(server),
    config = require('./config/index'),
    router = require('./config/routes');

try {
  app.set('basedir', __dirname);
  config(app, io);
  router(app);
  server.listen(app.get('port'));
} catch (error) {
  Logger.error(error);
}
