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

// Initialize Express app
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

// Make io accessible to routes
app.locals.io = io;

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

// Basic root route
app.get('/', (req, res) => {
  res.json({
    message: 'Cards Against Humanity API Server',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

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