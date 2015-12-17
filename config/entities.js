var sequelizeOrm = require('sequelize'),
    fs = require('fs'),
    envConfig = require('./configlist');

var connection = null;

function syncRole(role) {
  Role.findOne({where: role}).then(function(roleElement) {
    if(roleElement === null) {
      Role.create(role);
    }
  });
}

function syncDb(db) {
  var roles = [
    {roleId: "1", roleCode: "admin", roleName: "Administrator"},
    {roleId: "2", roleCode: "user", roleName: "User"}
  ];

  db.sync().then(function() {
    createRelations(function() {
      var rolesCount = roles.length;
      for(var i = 0; i < rolesCount; i++) {
        syncRole(roles[i]);
      }

      var user = {firstname: 'Admin', lastname: 'Admin', password: envConfig.adminPass, email: envConfig.adminEmail, roleId: 1, isActive: 1};
      User.findOne({where: {email: envConfig.adminEmail}}).then(function(roleElement) {
        if(roleElement === null) {
          User.create(user);
        }
      });
    });
  });
}

function createRelations(fn) {
  //user relations
  User.hasOne(Role, {foreignKey: 'roleId', constraints: true});
  User.belongsTo(Role, {foreignKey: 'roleId', constraints: true});
  //User.hasMany(DeviceType, {foreignKey: 'deviceTypeId', constraints: true});
  //User.belongsTo(DeviceType, {foreignKey: 'userId', constraints: true});
  
  DeviceType.hasMany(Device, {foreignKey: 'deviceTypeId', constraints: true});
  DeviceType.belongsTo(Device, {foreignKey: 'deviceTypeId', constraints: true});

  Device.hasMany(Attribute, {foreignKey: 'deviceId', constraints: true});
  Device.belongsTo(Attribute, {foreignKey: 'deviceId', constraints: true});
  Device.hasOne(DeviceType, {foreignKey: 'deviceTypeId', constraints: true});
  Device.belongsTo(DeviceType, {foreignKey: 'deviceTypeId', constraints: true});

  Attribute.hasMany(Value, {foreignKey: 'attributeId', constraints: true});
  Attribute.belongsTo(Value, {foreignKey: 'attributeId', constraints: true});
  Attribute.hasOne(Device, {foreignKey: 'deviceId', constraints: true});
  Attribute.belongsTo(Device, {foreignKey: 'deviceId', constraints: true});

  return fn();
}

function setup(db, cb) {
  fs.readdirSync('./app/entities').forEach(function (file) {
    if(file.substr(-3) == '.js') {
        require('../app/entities/' + file)(sequelizeOrm, db);
    }
  });
  syncDb(db);
  return cb(null, db);
}

module.exports = function (cb) {
  if (connection) return cb(null, connection);
  var db = new sequelizeOrm(
    envConfig.db_name, 
    envConfig.db_user, 
    envConfig.db_pass, 
    envConfig.db_options
  );
    setup(db, cb);
};