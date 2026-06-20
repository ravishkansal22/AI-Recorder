const browserService = require('./browserService');
const socketService = require('./socketService');

let session = {
  isRecording: false,
  url: '',
  steps: []
};

module.exports = {
  async startSession(url) {
    if (session.isRecording) {
      await this.stopSession();
    }
    session = {
      isRecording: true,
      url,
      steps: []
    };
    
    socketService.notifyRecordingStart(url);

    try {
      await browserService.launchBrowser(url, (event) => {
        // Callback when a step is captured from browser
        const step = {
          id: Date.now().toString() + Math.random().toString().slice(2, 6),
          type: event.type,
          details: event.details,
          param: event.param,
          selfHealed: event.selfHealed
        };
        session.steps.push(step);
        socketService.sendStep(step);
      });
    } catch (err) {
      session.isRecording = false;
      throw err;
    }
  },

  async stopSession() {
    if (!session.isRecording) return;
    session.isRecording = false;
    await browserService.closeBrowser();
    socketService.notifyRecordingStop();
  },

  getSessionStatus() {
    return {
      isRecording: session.isRecording,
      url: session.url,
      stepsCount: session.steps.length
    };
  }
};