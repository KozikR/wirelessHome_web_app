var helper = require('../../helper');
var deviceRepository = require('../../repositories/device');
var deviceTypeRepository = require('../../repositories/device_type');
var attributeRepository = require('../../repositories/attribute');

module.exports = {
  socket : null,
  userId : null,
  callback : null,
  on: function (socket) {
    this.socket = socket;
    var self = this;
    this.socket.on('update_devices_list', function (data, callback) {
      var parsedData = JSON.parse(data);
      self.callback = callback;
      helper.getUserIdAndValidate(self.socket, function(userId, err) {
        if(err) {
          Logger.warn(err);
          return self.callback(helper.formatMessage(err));
        }
        self.userId = userId;
        if(data && self.userId) {
          self.loopByDeviceTypes(parsedData.device_types);
        }
      });
    });
  },
  // DEVICE TYPE
  loopByDeviceTypes: function(deviceTypes) {
    var deviceTypesCount = deviceTypes.length;
    var inserted = 0;
    var self = this;
    for(var i = 0; i < deviceTypesCount; i++) {
      var deviceType = deviceTypes[i];

      this.proceedDeviceType(deviceType, function(err) {
        if (err) {
          return self.callback(helper.formatMessage(err));
        }
        if (++inserted == deviceTypesCount) {
          return self.callback(helper.formatMessage('OK', 'success'));
        }
      });
    }
  },
  proceedDeviceType: function (deviceType, cb) {
    var self = this;
    var deviceTypeData = deviceType.settings || null;
    var devicesData = deviceType.devices || null;
    deviceTypeRepository.createOrUpdate(deviceTypeData, self.userId, function(err, deviceTypeId) {
      if(err) {
        return cb('Error during processing device type saving');
      } else {
        if(!deviceTypeId) {
          return cb('Device Type not found in DB');
        }
        if(devicesData.length) {
          self.loopByDevices(devicesData, deviceTypeId, cb);
        } else {
          cb(null);
        }
      }
    });
  },
  
  // DEVICE
  loopByDevices: function (devices, deviceTypeId, cb) {
    var devicesCount = devices.length;
    var inserted = 0;
    var self = this;
    for(var i = 0; i < devicesCount; i++) {
      var device = devices[i];
      this.proceedDevice(device, deviceTypeId, function(err) {
        if (err) {
          return self.callback(err);
        }
        if (++inserted == devicesCount) {
          cb(null);
        }
      });
    }
  },
  proceedDevice: function (device, deviceTypeId, cb) {
    var self = this;
    var deviceData = device.settings || null;
    var attributesData = device.attributes || null;

    if(deviceData.status == "1") {
      deviceData.status = true;
    } else {
      deviceData.status = false;
    }
    if(deviceData.localizationId.length) {
      deviceData.localizationId = parseInt(deviceData.localizationId);
    }
    deviceRepository.createOrUpdate(deviceData, deviceTypeId, function(err, deviceId) {
      if(err) {
        return cb('Error during processing device saving');
      } else {
        if(!deviceId) {
          return cb('Device not found in DB');
        }
        if(attributesData.length) {
          self.loopByAttributes(attributesData, deviceId, cb);
        } else {
          cb(null);
        }
      }
    });
  },
  // ATTRIBUTE
  loopByAttributes: function (attributes, deviceId, cb) {
    var attributesCount = attributes.length;
    var inserted = 0;
    var self = this;
    for(var i = 0; i < attributesCount; i++) {
      var attribute = attributes[i];
      this.proceedAttribute(attribute, deviceId, function(err) {
        if (err) {
          return self.callback(err);
        }
        if (++inserted == attributesCount) {
          cb(null);
        }
      });
    }
  },
  proceedAttribute : function(attribute, deviceId, cb) {
    var self = this;
    var attributeData = attribute.settings || null;
    if(attributeData.isConfigurable == "1") {
      attributeData.isConfigurable = true;
    } else {
      attributeData.isConfigurable = false;
    }
    if(attributeData.minRange.length > 0) {
      attributeData.minRange = parseInt(attributeData.minRange);
    } else {
      attributeData.minRange = 0;
    }
    if(attributeData.maxRange.length > 0) {
      attributeData.maxRange = parseInt(attributeData.maxRange);
    } else {
      attributeData.maxRange = 0;
    }
    attributeRepository.createOrUpdate(attributeData, deviceId, function(err, attributeId) {
      if(err) {
        return cb('Error during processing attribute saving');
      } else {
        if(!attributeId) {
          return cb('Attribute not found in DB');
        }
        return cb(null);
      }
    });
  }
};