var _ = require('lodash');

module.exports = {
  create : function(dataToSave, cb) {
    User.create(dataToSave).then(function(data) {
      cb(null, data.dataValues.userId);
    }).catch(function (err) {
      cb(err, null);
    });
  },
  load : function(userId, cb) {
    User.findOne({where: {userId: userId}}).then(function(device) {
      if(device) {
        cb(null, device);
      } else {
        cb(null, null);
      }
    }).catch(function (err) {
      cb(err, null);
    });
  },
  update : function(dataToSave, userId, cb) {
    User.update(dataToSave, {where:{userId: userId}}).then(function(affectedRows) {
      cb(null, affectedRows);
    }).catch(function (err) {
      cb(err, null);
    });
  },
  remove : function() {

  },
};