module.exports = function (orm, db) {
  Value = db.define('value', {
    valueId : { 
      type: orm.INTEGER, 
      primaryKey: true, 
      autoIncrement: true 
    },
    attributeId : { 
      type: orm.INTEGER,
      validate: {
        notEmpty: { msg: "Attribute ID cannot be empty!" },
        isInt: {
          msg: "Attribute ID must be an integer number!"
        }
      }
    },
    value : { 
      type: orm.STRING(255),
      validate : {
        notEmpty: { msg: "Value cannot be empty!" },
        len: { 
          args: [1, 255], 
          msg: "Value cannot be longer than 100 letters!"
        }
      }
    }
  });
};