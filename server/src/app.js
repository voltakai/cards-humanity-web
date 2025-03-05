require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const securityMiddleware = require('./utils/security');
const { apiLimiter } = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Apply security middleware
securityMiddleware.forEach(middleware => app.use(middleware));

// Apply rate limiting to all routes
app.use(apiLimiter);

// Routes
app.use('/api/games', require('./routes/games'));
app.use('/api/admin', require('./routes/admin'));

// Error handling
app.use(errorHandler);

// Catch-all route
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

module.exports = app; 