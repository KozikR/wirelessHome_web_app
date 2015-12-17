var _ = require('lodash');

module.exports = {
  create : function(dataToSave, userId, cb) {
    dataToSave.userId = userId;
    DeviceType.create(dataToSave).then(function(data) {
      cb(null, data.dataValues.deviceTypeId);
    }).catch(function (err) {
      cb(err, null);
    });
  },
  load : function(deviceTypeId, cb) {
    DeviceType.findOne({where: {deviceTypeId: deviceTypeId}}).then(function(deviceType) {
      if(deviceType) {
        cb(null, deviceType);
      } else {
        cb(null, null);
      }
    }).catch(function (err) {
      cb(err, null);
    });
  },
  loadByDeviceTypeCode : function(deviceTypeCode, userId, cb) {
    DeviceType.findOne({where:{deviceTypeCode: deviceTypeCode, userId: userId}}).then(function(deviceType) {
      if(deviceType) {
        cb(null, deviceType);
      } else {
        cb(null, null);
      }
    }).catch(function (err) {
      cb(err, null);
    });
  },
  update : function(dataToSave, id, cb) {
    DeviceType.update(dataToSave, {where:{deviceTypeId: id}}).then(function(affectedRows) {
      cb(null, affectedRows);
    }).catch(function (err) {
      cb(err, null);
    });
  },
  remove : function() {

  },
  createOrUpdate : function(data, userId, cb) {
    var self = this;
    if(data.deviceTypeCode && data.deviceTypeName && userId) {
      self.loadByDeviceTypeCode(data.deviceTypeCode, userId, function(err, deviceType) {
        if(err) {
          cb(err, null);
        } else {
          if(deviceType) {
            var loadedSettings = { 
              deviceTypeCode: deviceType.deviceTypeCode, 
              deviceTypeName: deviceType.deviceTypeName 
            };
            if(!_.isEqual(data, loadedSettings)) {
              self.update(data, deviceType.deviceTypeId, function(err, affectedRows) {
                if(err) {
                  cb(err, null);
                }
              });
            }
            cb(null, deviceType.dataValues.deviceTypeId);
          } else {
            self.create(data, userId, function(err, deviceTypeId) {
              if(err) {
                cb(err, null);
              } else {
                cb(null, deviceTypeId);
              }
            });
          }
        }
      });
    } else {
      cb("Device type code, device type name or userId is missing.", null);
    }
  }
};