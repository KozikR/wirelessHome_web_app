module.exports = function (orm, db) {
  Device = db.define('device', {
    deviceId : { 
      type: orm.INTEGER, 
      primaryKey: true, 
      autoIncrement: true 
    },
    deviceTypeId : { 
      type: orm.INTEGER,
      validate: {
        isInt: {
          msg: "Device Type ID must be an integer number!"
        }
      }
    },
    deviceUuid : { 
      type: orm.STRING(100),
      validate : {
        notEmpty: { msg: "Device UUID cannot be empty!" },
        len: { 
          args: [1, 100], 
          msg: "Device UUID cannot be longer than 100 letters!"
        }
      }
    },
    deviceName : { 
      type: orm.STRING(255),
      validate : {
        notEmpty: { msg: "Device Name cannot be empty!" },
        len: { 
          args: [1, 255], 
          msg: "Device Name cannot be longer than 255 letters!"
        }
      }
    },
    localizationId  : { 
      type: orm.INTEGER 
    },
    status : { 
      type: orm.BOOLEAN,
      validate: { 
        isIn: {
          args: [[true, false]],
          msg: "Status must be a boolean!"
        }
      },
      defaultValue: false
    },
  }, {
    indexes : [{
      unique: true,
      fields : ['deviceUuid']
    }]
  });
};