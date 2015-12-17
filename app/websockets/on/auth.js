var passport = require('passport');
var helper = require('../../helper');

module.exports = {
  socket : null,
  cb: null,
  on: function (socket) {
    this.socket = socket;
    var self = this;
    socket.on('authorization', function (data, callback) {
      var parsedData = JSON.parse(data);
      var email = parsedData.email;
      var password = parsedData.password;
      if(email && password) {
        User.findOne({where: {email: email}, include: [{ model: Role }]}).then(function(user) {
          if(!user) {
            return callback(helper.formatMessage("User not found"));
          }

          if(!User.validPassword(user, password)) {
            return callback(helper.formatMessage("Password is wrong"));
          } else {
            if(!user.isActive) {
              return callback(helper.formatMessage("Account created. Please wait for contact from our support."));
            }
            if(user.dataValues.role.dataValues.roleCode != 'admin') {
              self.__deleteOldCache(user.userId, function() {
                self.__auth(user.userId);
                return callback(helper.formatMessage("OK", 'success'));
              });
            } else {
              return callback(helper.formatMessage("Your account doesn't have permission to login to our system. Please contact with our support."));
            }
          }
        }).catch(function (err) {
          return callback(helper.formatMessage(err));
        });
      } else {
        return callback(helper.formatMessage("Email or password is missing"));
      }
    });
  },
  __auth : function (userId) {
    var self = this;
    Cache.get('socketIdsByUserId', function(err, socketIdsByUserId) {
      socketIdsByUserId = JSON.parse(socketIdsByUserId);
      Cache.get('userIdsBySocketId', function(err, userIdsBySocketId) {
        userIdsBySocketId = JSON.parse(userIdsBySocketId);
        socketIdsByUserId[userId] = self.socket.id;
        userIdsBySocketId[self.socket.id] = userId;
        Cache.set('socketIdsByUserId', JSON.stringify(socketIdsByUserId));
        Cache.set('userIdsBySocketId', JSON.stringify(userIdsBySocketId));
      });
    });
  },
  __deleteOldCache: function (userId, cb) {
    Cache.get('socketIdsByUserId', function(err, socketIdsByUserId) {
      socketIdsByUserId = JSON.parse(socketIdsByUserId);
      var oldSocket = socketIdsByUserId[userId];
      if(typeof oldSocket != 'undefined') {
        Cache.get('userIdsBySocketId', function(err, userIdsBySocketId) {
          userIdsBySocketId = JSON.parse(userIdsBySocketId);
          delete socketIdsByUserId[userId];
          delete userIdsBySocketId[oldSocket];
          Cache.set('socketIdsByUserId', JSON.stringify(socketIdsByUserId));
          Cache.set('userIdsBySocketId', JSON.stringify(userIdsBySocketId));
          cb();
        });
      } else {
          cb();
      }
    });
  }
};