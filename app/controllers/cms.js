module.exports = {
  home : function (req, res, next) {
    res.render('index');
  },
  dashboard : function (req, res, next) {
    var userId = req.user.userId;
    DeviceType.findAll({where: {userId:userId}, include:[{model: Device}]}).then(function(deviceTypes) {
      var elements = {};
      var returnsCount = deviceTypes.length;
      for(var i = 0; i < returnsCount; i++) {
        elements[i] = deviceTypes[i].dataValues;
      }
      res.render('cms/dashboard', {deviceTypes: elements});
    }).catch(function(err) {
      Logger.warn(err);
      res.render('cms/dashboard', {deviceTypes: {}});
    });
  },
  adminDashboard : function (req, res, next) {
    res.render('index');  
  }
};