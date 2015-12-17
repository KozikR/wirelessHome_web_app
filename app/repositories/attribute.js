var _ = require('lodash');

module.exports = {
  create : function(dataToSave, deviceId, cb) {
    dataToSave.deviceId = deviceId;
    Attribute.create(dataToSave).then(function(data) {
      cb(null, data.dataValues.attributeId);
    }).catch(function (err) {
      cb(err, null);
    });
  },
  load : function(attributeId, cb) {
    Attribute.findOne({where: {attributeId: attributeId}}).then(function(attribute) {
      if(attribute) {
        cb(null, attribute);
      } else {
        cb(null, null);
      }
    }).catch(function (err) {
      cb(err, null);
    });
  },
  loadByDeviceUuid : function(attributeCode, deviceId, cb) {
    Attribute.findOne({where:{attributeCode: attributeCode, deviceId: deviceId}}).then(function(attribute) {
      if(attribute) {
        cb(null, attribute);
      } else {
        cb(null, null);
      }
    }).catch(function (err) {
      cb(err, null);
    });
  },
  update : function(dataToSave, id, cb) {
    Attribute.update(dataToSave, {where:{attributeId: id}}).then(function(affectedRows) {
      cb(null, affectedRows);
    }).catch(function (err) {
      cb(err, null);
    });
  },
  remove : function() {

  },
  createOrUpdate : function(data, deviceId, cb) {
    var self = this;
    if(data.attributeCode && data.attributeName && deviceId) {
      self.loadByDeviceUuid(data.attributeCode, deviceId, function(err, attribute) {
        if(err) {
          cb(err, null);
        } else {
          if(attribute) {
            var loadedSettings = { 
              attributeCode: attribute.attributeCode, 
              attributeName: attribute.attributeName, 
              isConfigurable: attribute.isConfigurable,
              input: attribute.input,
              options: attribute.options,
              minRange: attribute.minRange,
              maxRange: attribute.maxRange,
            };
            if(!_.isEqual(data, loadedSettings)) {

              self.update(data, attribute.attributeId, function(err, affectedRows) {
                if(err) {
                  cb(err, null);
                }
              });
            }
            cb(null, attribute.dataValues.attributeId);
          } else {
            self.create(data, deviceId, function(err, attributeId) {
              if(err) {
                cb(err, null);
              } else {
                cb(null, attributeId);
              }
            });
          }
        }
      });
    } else {
      cb("Atribute code, attribute name or device id is missing.", null);
    }
  }
};