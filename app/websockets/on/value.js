var helper = require('../../helper');
var valueRepository = require('../../repositories/value');

module.exports = {
  socket : null,
  userId : null,
  callback : null,
  on: function (socket) {
    this.socket = socket;
    var self = this;

    socket.on('update_device_value', function(data, callback) {
      var parsedData = JSON.parse(data);
      self.callback = callback;
      var values = parsedData.values;
      helper.getUserIdAndValidate(self.socket, function(userId, err) {
        if(err) {
          Logger.warn(err);
          return self.callback(helper.formatMessage(err));
        }
        self.userId = userId;
        if(values && self.userId) {
          self.loopByValues(values);
        }
      });
    });
  },

  loopByValues : function(values) {
    var valuesCount = values.length;
    var inserted = 0;
    var self = this;
    for(var i = 0; i < valuesCount; i++) {
      var value = values[i];

      self.addValue(value, function(err) {
        if (err) {
          Logger.warn(err);  
          return self.callback(helper.formatMessage(err));
        }
        if (++inserted == valuesCount) {
          return self.callback(helper.formatMessage('OK', 'success'));
        }
      });
    }
  },
  addValue : function(value, cb) {
    var self = this;
    Attribute.find({where: {attributeCode: value.attributeCode}, include: [{model: Device, where:{deviceUuid: value.deviceUuid}, include: [{model: DeviceType, where:{userId: self.userId}}]}]}).then(function(attribute) {
      if(attribute) {
        var attributeId = attribute.attributeId;
        if(value.createdAt.length === 0) {
          delete value.createdAt;
        } else {
          value.createdAt = new Date(value.createdAt*1000);
        }
        valueRepository.create(value, attributeId, function(err, valueId) {
          if (err) {
            return cb(err);
          }
          cb(null);
        });
      } else {
        return cb('Attribute with code: '+ value.attributeCode + ' does not exist in our system');
      }
    }).catch(function (err) {
      Logger.warn(err);  
      return cb('Error during adding value');
    });
  }
};