require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const securityMiddleware = require('./middleware/security');
const { apiLimiter } = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const apiRoutes = require('./routes/api');
const gameHandlers = require('./socket/gameHandlers');

const app = express();
const server = http.createServer(app);

// Socket.io setup
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply security middleware
app.use(securityMiddleware.helmet);
app.use(securityMiddleware.cors);
app.use(securityMiddleware.rateLimit);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Apply rate limiting to all routes
app.use(apiLimiter);

// API routes
app.use('/api', apiRoutes);

// Socket.io event handlers
io.on('connection', (socket) => {
  logger.info(`Socket connected: ${socket.id}`);
  gameHandlers(io, socket);
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/build', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message}`);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error'
    }
  });
});

module.exports = { app, server }; 