module.exports = function (orm, db) {
  Attribute = db.define('attribute', {
    attributeId : { 
      type: orm.INTEGER, 
      primaryKey: true, 
      autoIncrement: true 
    },
    attributeCode : { 
      type: orm.STRING(100),
      validate : {
        notEmpty: { msg: "Attribute Code cannot be empty!" },
        len: { 
          args: [1, 100], 
          msg: "Attribute Code cannot be longer than 100 letters!"
        }
      }
    },
    attributeName : { 
      type: orm.STRING(255),
      validate : {
        notEmpty: { msg: "Attribute Name cannot be empty!" },
        len: { 
          args: [1, 255], 
          msg: "Attribute Name cannot be longer than 100 letters!"
        }
      }
    },
    deviceId : { 
      type: orm.INTEGER,
      validate: {
        notEmpty: { msg: "Device ID cannot be empty!" },
        isInt: {
          msg: "Device ID must be an integer number!"
        }
      }
    },
    isConfigurable : { 
      type: orm.BOOLEAN,
      validate: { 
        isIn: {
          args: [[true, false]],
          msg: "isConfigurable must be a boolean!"
        }
      },
      defaultValue: false
    },
    input : { 
      type: orm.ENUM("input", "dropdown", "checkbox", "color-picker", "slider"),
      validate: {
        notEmpty: { msg: "Attribute input cannot be empty!" },
        isIn: {
          args: [["","input", "dropdown", "checkbox", "color-picker", "slider"]],
          msg: "Your input type is wrong!"
        }
      }
    },
    suffixText : { 
      type: orm.STRING(255),
      validate : {
        len: { 
          args: [0, 255], 
          msg: "Suffix text cannot be longer than 255 letters!"
        }
      }
    },
    options : { 
      type: orm.TEXT,
    },
    minRange : { 
      type: orm.INTEGER,
      validate : {
        isInt: { msg: "minRange must be an integer!"}
      }
    },
    maxRange : { 
      type: orm.INTEGER,
      validate : {
        isInt: { msg: "maxRange must be an integer!"}
      }
    }
  }, {
    indexes : [{
      unique: true,
      fields : ['attributeCode']
    }]
  }
  );

};