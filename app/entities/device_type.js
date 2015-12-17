module.exports = function (orm, db) {
  DeviceType = db.define('device_type', {
    deviceTypeId    : { 
      type: orm.INTEGER, 
      primaryKey: true, 
      autoIncrement: true 
    },
    userId : { 
      type: orm.INTEGER,
      validate: {
        notEmpty: { msg: "User ID cannot be empty!" },
        isInt: {
          msg: "User ID must be an integer number!"
        }
      }
    },
    deviceTypeCode  : { 
      type: orm.STRING(100),
      validate : {
        notEmpty: { msg: "Device Type Code cannot be empty!" },
        len: { 
          args: [1, 100], 
          msg: "Device type code cannot be longer than 100 letters!"
        }
      }
    },
    deviceTypeName  : { 
      type: orm.STRING(255),
      validate : {
        notEmpty: { msg: "Device Type Name cannot be empty!" },
        len: { 
          args: [1, 255], 
          msg: "Device type name cannot be longer than 255 letters!"
        }
      }
    },
    deviceTypeIconPath : { 
      type: orm.STRING(255),
      validate : {
        len: { 
          args: [0, 255], 
          msg: "Device type Icon path cannot be longer than 255 letters!"
        }
      }
    },
  },
  {
    indexes : [{
      unique: true,
      fields : ['deviceTypeCode']
    }]
  });

};