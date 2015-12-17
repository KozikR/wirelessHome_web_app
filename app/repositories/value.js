var _ = require('lodash');
var helper = require('../helper');

module.exports = {
  create : function(dataToSave, attributeId, cb) {
    dataToSave.attributeId = attributeId;
    Value.create(dataToSave).then(function(data) {
      cb(null, data.dataValues.valueId);
    }).catch(function (err) {
      cb(err, null);
    });
  },
};