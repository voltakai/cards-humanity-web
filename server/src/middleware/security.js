// Security middleware
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

// Rate limiting configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// CORS configuration
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};

module.exports = {
  helmet: helmet(),
  cors: cors(corsOptions),
  rateLimit: limiter
}; 