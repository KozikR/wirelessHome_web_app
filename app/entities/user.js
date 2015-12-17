var bcrypt = require('bcrypt');

module.exports = function (orm, db) {
  User = db.define('user', {
    userId: { 
      type: orm.INTEGER, 
      primaryKey: true, 
      autoIncrement: true 
    },
    roleId : { 
      type: orm.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Role ID cannot be empty!" },
        isInt: {
          msg: "Role ID must be an integer number!"
        }
      }
    },
    firstname : { 
      type: orm.STRING(100),
      allowNull: false,
      validate : {
        notEmpty: { msg: "Firstname cannot be empty!" },
        len: { 
          args: [1, 100], 
          msg: "Firstname cannot be longer than 100 letters!"
        }
      }
    },
    lastname : { 
      type: orm.STRING(255),
      allowNull: false,
      validate : {
        notEmpty: { msg: "Lastname cannot be empty!" },
        len: { 
          args: [1, 255], 
          msg: "Lastname cannot be longer than 255 letters!"
        }
      }
    },
    password : { 
      type: orm.STRING(60),
      allowNull: false,
      validate : {
        is : {
          args: ["^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8}",'i'], 
          msg: "Password must be at least 8 letters long, have at least 1 lowercase letter, uppercase, number and special character!"
        }
      }
    },
    email : { 
      type: orm.STRING(255),
      allowNull: false,
      validate : {
        notEmpty: { msg: "Email cannot be empty!" },
        len: { 
          args: [1, 255], 
          msg: "Email cannot be longer than 255 letters!"
        },
        isEmail: { msg: "This email address has wrong format!" },
      }
    },
    isActive : { 
      type: orm.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    registerIp : { 
      type: orm.STRING(255)
    },
    //This email address is currently in our system
  },
  {
    classMethods: {
      encryptPassword: function (user) {
        if (!user.password) return '';
        try {
          var salt = bcrypt.genSaltSync(11);
          return bcrypt.hashSync(user.password, salt);
        } catch (err) {
          return '';
        }
      },
      validPassword: function (user, password) {
        if(bcrypt.compareSync(password, user.password)) {
          return true;
        }

        return false;
      }
    },
    indexes : [{
      unique: true,
      fields : ['Email', 'RegisterIp']
    }]
  });

  function beforeSave(user) {
    if(typeof user.password != 'undefined') {
      user.password = User.encryptPassword(user);
    }
  }

  User.beforeCreate(function(user, options) {
    beforeSave(user);
  });
  User.beforeUpdate(function(user, options) {
    beforeSave(user);
  });
};