let ioInstance = null;

module.exports = {
  init(io) {
    ioInstance = io;
    io.on('connection', (socket) => {
      console.log('Socket client connected:', socket.id);
      socket.on('disconnect', () => {
        console.log('Socket client disconnected:', socket.id);
      });
    });
  },

  sendStep(step) {
    if (ioInstance) {
      ioInstance.emit('step-recorded', step);
    }
  },

  notifyRecordingStart(url) {
    if (ioInstance) {
      ioInstance.emit('recording-started', { url });
    }
  },

  notifyRecordingStop() {
    if (ioInstance) {
      ioInstance.emit('recording-stopped');
    }
  }
};