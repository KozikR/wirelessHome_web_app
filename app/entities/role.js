module.exports = function (orm, db) {
  Role = db.define('role', {
    roleId : { 
      type: orm.INTEGER, 
      primaryKey: true, 
      autoIncrement: true 
    },
    roleCode : { 
      type: orm.STRING(100),
      validate : {
        notEmpty: { msg: "Role Code cannot be empty!" },
        len: { 
          args: [1, 100], 
          msg: "Role Code cannot be longer than 100 letters!"
        }
      }
    },
    roleName : { 
      type: orm.STRING(255),
      validate : {
        notEmpty: { msg: "Role Name cannot be empty!" },
        len: { 
          args: [1, 255], 
          msg: "Role Name cannot be longer than 100 letters!"
        }
      }
    }
  },
  {
    indexes : [{
      unique: true,
      fields : ['roleCode']
    }]
  }
  );
 
};