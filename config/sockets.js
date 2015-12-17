var fs = require('fs');
var socketEmit = require('../app/websockets/emit');

module.exports = function (io) {
  io.on('connection', function (socket) {
    fs.readdirSync('./app/websockets/on').forEach(function (file) {
      if(file.substr(-3) == '.js') {
          websocket = require('../app/websockets/on/' + file);
          websocket.on(socket);
        }
    });
  });
  socketEmit.emit(io);
};
