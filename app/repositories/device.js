var _ = require('lodash');

module.exports = {
  create : function(dataToSave, deviceTypeId, cb) {
    dataToSave.deviceTypeId = deviceTypeId;
    Device.create(dataToSave).then(function(data) {
      cb(null, data.dataValues.deviceId);
    }).catch(function (err) {
      cb(err, null);
    });
  },
  load : function(deviceId, cb) {
    Device.findOne({where: {deviceId: deviceId}}).then(function(device) {
      if(device) {
        cb(null, device);
      } else {
        cb(null, null);
      }
    }).catch(function (err) {
      cb(err, null);
    });
  },
  loadByDeviceUuid : function(deviceUuid, deviceTypeId, cb) {
    Device.findOne({where:{deviceUuid: deviceUuid, deviceTypeId: deviceTypeId}}).then(function(device) {
      if(device) {
        cb(null, device);
      } else {
        cb(null, null);
      }
    }).catch(function (err) {
      cb(err, null);
    });
  },
  update : function(dataToSave, id, cb) {
    Device.update(dataToSave, {where:{deviceId: id}}).then(function(affectedRows) {
      cb(null, affectedRows);
    }).catch(function (err) {
      cb(err, null);
    });
  },
  remove : function() {

  },
  createOrUpdate : function(data, deviceTypeId, cb) {
    var self = this;
    if(data.deviceUuid && data.deviceName && deviceTypeId) {
      self.loadByDeviceUuid(data.deviceUuid, deviceTypeId, function(err, device) {
        if(err) {
          cb(err, null);
        } else {
          if(device) {
            var loadedSettings = { 
              deviceUuid: device.deviceUuid, 
              deviceName: device.deviceName,
              localizationId: device.localizationId,
              status: device.status
            };
            if(!_.isEqual(data, loadedSettings)) {

              self.update(data, device.deviceId, function(err, affectedRows) {
                if(err) {
                  cb(err, null);
                }
              });
            }
            cb(null, device.dataValues.deviceId);
          } else {
            self.create(data, deviceTypeId, function(err, deviceId) {
              if(err) {
                cb(err, null);
              } else {
                cb(null, deviceId);
              }
            });
          }
        }
      });
    } else {
      cb("Device UUID, device name or Device Type ID is missing.", null);
    }
  }
};