module.exports = {
  formatMessage: function(messages, level) {
    var errors = {};
    var msgLevel = 'errors';
    var levels = ['notices', 'success', 'warnings', 'errors'];
    if(levels.indexOf(level) > -1) {
      msgLevel = level; 
    }
    errors[msgLevel] = [];
    if(typeof messages.errors === 'undefined') {
      errors[msgLevel].push(messages);
    } else {
      var errorsCount = messages.errors.length;
      for(var i = 0; i < errorsCount; i++) {
        errors[msgLevel].push(messages.errors[i].message);
      } 
    }

    return errors;
  },

  getUserIdAndValidate : function(socket, callback) {
    var self = this;
    Cache.get('userIdsBySocketId', function(err, userIdsBySocketId) {
      userIdsBySocketId = JSON.parse(userIdsBySocketId);
      var userId = (userIdsBySocketId[socket.id]);
      if(userId) {
        callback(userId, null);
      } else {
        return callback(null,'User not found in connections');
      }
    });
  }
};