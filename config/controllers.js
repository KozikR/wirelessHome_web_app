var controllers = {};
var fs = require('fs');
fs.readdirSync('./app/controllers/').forEach(function (file) {
  if(file.substr(-3) == '.js') {
    var name = file.substr(0, file.length -3);
      controllers[name] = require('../app/controllers/' + file);
  }
});

module.exports = controllers;