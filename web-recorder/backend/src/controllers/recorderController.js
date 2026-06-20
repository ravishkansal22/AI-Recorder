const recordingService = require('../services/recordingService');

module.exports = {
  async start(req, res) {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }
    try {
      await recordingService.startSession(url);
      res.json({ success: true, message: 'Recording started' });
    } catch (err) {
      console.error('Failed to start recording session:', err);
      res.status(500).json({ error: err.message });
    }
  },

  async stop(req, res) {
    try {
      await recordingService.stopSession();
      res.json({ success: true, message: 'Recording stopped' });
    } catch (err) {
      console.error('Failed to stop recording session:', err);
      res.status(500).json({ error: err.message });
    }
  },

  status(req, res) {
    const status = recordingService.getSessionStatus();
    res.json(status);
  }
};