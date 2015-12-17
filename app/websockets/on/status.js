var helper = require('../../helper');
var deviceRepository = require('../../repositories/device');

module.exports = {
  socket : null,
  userId : null,
  callback : null,
  on: function (socket) {
    this.socket = socket;
    var self = this;

    socket.on('devices_status', function(data, callback) {
      var parsedData = JSON.parse(data);
      self.callback = callback;
      var statuses = parsedData.statuses;
      helper.getUserIdAndValidate(self.socket, function(userId, err) {
        if(err) {
          Logger.warn(err);
          return self.callback(helper.formatMessage(err));
        }
        self.userId = userId;
        if(statuses && self.userId) {
          self.loopByStatuses(statuses);
        }
      });
    });
  },

  loopByStatuses : function(statuses) {
    var statusesCount = statuses.length;
    var inserted = 0;
    var self = this;
    for(var i = 0; i < statusesCount; i++) {
      var status = statuses[i];

      this.updateStatus(status, function(err) {
        if (err) {
          Logger.warn(err);
          return self.callback(helper.formatMessage(err));
        }
        if (++inserted == statusesCount) {
          return self.callback(helper.formatMessage('OK', 'success'));
        }
      });
    }
  },
  updateStatus : function(status, cb) {
    var self = this;
    Device.find({where: {deviceUuid: status.deviceUuid}, include: [{model: DeviceType, where:{userId: self.userId}}]}).then(function(device) {
      if(device) {
        if(status.status == "1") {
          status.status = true;
        } else {
          status.status = false;
        }

        deviceRepository.update(status, device.deviceId, function(affectedRows, err) {
          if(err) {
            return cb(err);
          }
          cb(null);

        });
      } else {
        return cb('Device with UUID: '+ status.deviceUuid + ' does not exist in our system');
      }
    }).catch(function (err) {
      Logger.warn(err);  
      return cb('Error during updating status');
    });
  }
};