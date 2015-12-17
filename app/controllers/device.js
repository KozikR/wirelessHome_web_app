var _ = require('lodash');
var helper = require('../helper');
var passport = require('passport');
var sequelizeOrm = require('sequelize');

module.exports = {
  index: function(req, res, next) {
    res.render('device/manage/index');
  },
  manage: function(req, res, next) {
    var userId = req.user.userId;
    DeviceType.findAll({where: {userId:userId}}).then(function(deviceTypes) {
      var elements = {};
      var returnsCount = deviceTypes.length;
      for(var i = 0; i < returnsCount; i++) {
        elements[i] = deviceTypes[i].dataValues;
      }
      res.locals.deviceMenuElements= elements;
      next();
    }).catch(function(err) {
      Logger.warn(err);
      res.locals.deviceMenuElements = {};
      next();
    });
  },
  view: function(req, res, next) {
    var deviceTypeId = req.params.deviceTypeId;
    Device.findAll({where: {deviceTypeId:deviceTypeId}, include:[{model: Attribute, include: [{model: Value, where: {valueId: sequelizeOrm.literal(" `attributes.values`.`valueId` = (SELECT valueId FROM `values` WHERE attributeId =  `attributes.values`.`attributeId` ORDER BY createdAt DESC LIMIT 1)")}, attributes: { include: ['attributeId', 'value'] }}]}]}).then(function(devices) {
      var elements = {};
      var returnsCount = devices.length;
      for(var i = 0; i < returnsCount; i++) {
        elements[i] = devices[i].dataValues;
      }
      res.render('device/manage/view', {devices: elements});
    }).catch(function(err) {
      Logger.warn(err);
      res.render('device/manage/view', {devices: {}});
    });
  },
};