require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const recorderRoutes = require('./routes/recorderRoutes');
const socketService = require('./services/socketService');

const app = express();
const server = http.createServer(app);

// Enable CORS for frontend development server
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST']
}));

app.use(express.json());

// Routes
app.use('/api/recording', recorderRoutes);

// Socket.io initialization
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

socketService.init(io);

// Basic health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', uptime: process.uptime() });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Script Studio Backend Server running on port ${PORT}`);
});
