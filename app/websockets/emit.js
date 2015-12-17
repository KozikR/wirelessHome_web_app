var queue = require('bull');

module.exports.emit = function(io) {
  var emits = queue('emits');
  emits.process(function(job, done) {
    var data = job.data;
    if(!data.userId || !data.emitName || data.emitData) {
      done(Error('User ID, emit name or emit data are missing'));
    } else {
      var socketId = socketIdsByUserId[data.userId];
      if(typeof socket == 'undefined') {
        done(Error('Workstation of user '+ data.userId +'is not connected to system'));
      } else {
        io.sockets.socket(socketId).emit(data.emitName, data.emitData);
      }
    }
  });

  emits.on('failed', function(job, err){
    Loggel.error(err);
    throw (err);
  });
};