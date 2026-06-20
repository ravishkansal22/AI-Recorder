import axios from 'axios';

const API_BASE = window.location.hostname === 'localhost'
  ? 'http://localhost:5000/api'
  : `http://${window.location.hostname}:5000/api`;

export const api = {
  async startRecording(url) {
    const res = await axios.post(`${API_BASE}/recording/start`, { url });
    return res.data;
  },

  async stopRecording() {
    const res = await axios.post(`${API_BASE}/recording/stop`);
    return res.data;
  },

  async getStatus() {
    const res = await axios.get(`${API_BASE}/recording/status`);
    return res.data;
  }
};
