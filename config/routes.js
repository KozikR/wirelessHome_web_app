var controllers = require('./controllers');
var policies = require('./policies');

module.exports = function (app) {
  //cms
  app.get( '/', controllers.cms.home);
  app.get( '/dashboard', [policies.isAuthenticated, policies.isUser], controllers.cms.dashboard);
  app.get( '/adminDashboard', [policies.isAuthenticated, policies.isAdmin], controllers.cms.adminDashboard);

  //device
  app.get( '/device/manage/*', [policies.isAuthenticated, policies.isUser], controllers.device.manage);
  app.get( '/device/manage/index', [policies.isAuthenticated, policies.isUser], controllers.device.index);
  app.get( '/device/manage/view/:deviceTypeId', [policies.isAuthenticated, policies.isUser], controllers.device.view);

  //user
  app.get('/login', [policies.isNotAuthenticated], controllers.user.login);
  app.get('/join', [policies.isNotAuthenticated], controllers.user.join);
  app.post('/create', controllers.user.create);
  app.get('/logout', controllers.user.logout);
  app.post('/authentication', controllers.user.authentication);
  app.get('/user/index', [policies.isAuthenticated, policies.isAdmin], controllers.user.index);
  app.get('/user/edit/:id', [policies.isAuthenticated, policies.isAdminOrSameUser], controllers.user.edit);
  app.post('/user/delete/:id', [policies.isAuthenticated, policies.isAdmin], controllers.user.delete);
  app.post('/user/update/:id', [policies.isAuthenticated, policies.isAdminOrSameUser], controllers.user.update);
  app.get('/user/view', [policies.isAuthenticated], controllers.user.view);

};