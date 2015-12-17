var _ = require('lodash');
var helper = require('../helper');
var sequelizeOrm = require('sequelize');
var passport = require('passport');
var userRepository = require('../repositories/user');

module.exports = {
  index : function (req, res, next) {
    User.findAll({include: [{ model: Role }], attributes: { exclude: ['password'] }, raw: true}).then(function(users) {
      res.render('user/index', {users: users});
    }).catch(function(err) {
      Logger.warn(err);
      res.render('user/index', {users: {}});
    });

  },
  login : function (req, res, next) {
    res.render('user/login');

  },
  join : function (req, res, next) {
    res.render('user/join');
  },
  create : function (req, res, next) {
    var params = _.pick(req.body, 'firstname', 'lastname', 'password', 'confirm_password', 'email', 'confirm_email');
    var role = _.pick(req.body, 'roleId');
    params.roleId = role.roleId || 2;
    params.registerIp = req.ip;

    if(params.password != params.confirm_password) {
      return res.status(400).send(helper.formatMessage("Passwords are not same!"));
    }
    if(params.email != params.confirm_email) {
      return res.status(400).send(helper.formatMessage("Emails are not same!"));
    }
    User.create(params).then(function() {
      return res.status(200).send(helper.formatMessage("Account created. Please wait for contact from our support", 'success'));
    }).catch(sequelizeOrm.ValidationError, function (err) {
      return res.status(400).send(helper.formatMessage(err));
    });
  },
  edit : function (req, res, next) {
    User.findOne({where: {userId: req.params.id}, include: [{ model: Role }], attributes: { exclude: ['password'] }, raw: true}).then(function(user) {
      Role.findAll({raw: true}).then(function(roles) {
        if(user && roles) {
          return res.render('user/edit', {user: user, roles: roles});
        }
        req.flash('error', 'User or roles not found!');
        res.redirect('back');
      }).catch(function(err) {
        Logger.warn(err);
        req.flash('error', 'Error during loading roles!');
        res.redirect('back');
      });
    }).catch(function(err) {
      Logger.warn(err);
      req.flash('error', 'Error during loading user!');
      res.redirect('back');
    });
  },
  update : function (req, res, next) {
    var userId = req.params.id;
    userRepository.load(userId, function(err, user) {
      if(err || !user) {
        Logger.warn(err);
        req.flash('error', 'User not found!');
        res.redirect('back');
      }
      var dataToSave = user.dataValues;
      var params = _.pick(req.body, 'firstname', 'lastname', 'password', 'confirm_password', 'email', 'changepass', 'roleId', 'isActive');
      
      if(typeof params.changepass != 'undefined') {
        if(params.password.length !== 0 || params.confirm_password.length !== 0) {
          if(params.password === params.confirm_password) {
            params.password = User.encryptPassword(params);
            dataToSave = params;
          } else {
            req.flash('error', "Passwords are not same!");
            res.redirect('back');
          }
        } else {
          req.flash('error', "Password is missing!");
          res.redirect('back');
        }
      } else {
        delete params.password;
        dataToSave = params;
      }
      userRepository.update(dataToSave, userId, function(err, affectedRows) {
        if(err) {
          Logger.warn(err);
          req.flash('error', 'User not found!');
          res.redirect('back');
        }
        req.flash('success', 'User data updated!');
        if(req.user.roleCode == 'admin') {
          res.redirect('/user/index');
        } else {
          res.redirect('/user/view/'+userId);
        }
      });
    });
  },
  delete : function (req, res, next) {
    User.destroy({where: {userId: req.params.id}}).then(function(removedRows){
      if(removedRows > 0) {
        req.flash('success', "User with ID " +req.params.id+ " was removed");
        res.redirect('back');
      } else {
        req.flash('success', 'User not found!');
        res.redirect('back');
      }
    }).catch(function(err) {
      Logger.warn(err);
      req.flash('error', 'Error during removing user!');
      res.redirect('back');
    });
  },
  view : function (req, res, next) {
    res.render('index');
  },
  authentication : function (req, res, next) {
    passport.authenticate('local-login', function(err, user, info) {
      if ((err)) {
        return res.status(400).send(helper.formatMessage(err));
      }
      if((!user)) {
        return res.status(400).send(helper.formatMessage("User not found!"));
      }
      req.logIn(user, function(err) {
        if (err) return res.status(400).send(helper.formatMessage(err));
        res.redirectHome();
      });
    })(req, res);
  },
  logout : function (req, res, next) {
    req.logout();
    res.redirect('/');
  }
};