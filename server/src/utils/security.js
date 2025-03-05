const xss = require('xss');
const helmet = require('helmet');
const cors = require('cors');

// Input sanitization
const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    return xss(input.trim());
  }
  if (typeof input === 'object' && input !== null) {
    return Object.keys(input).reduce((acc, key) => {
      acc[key] = sanitizeInput(input[key]);
      return acc;
    }, Array.isArray(input) ? [] : {});
  }
  return input;
};

// Security middleware configuration
const securityMiddleware = [
  helmet(),
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", process.env.FRONTEND_URL],
      imgSrc: ["'self'", 'data:', 'blob:'],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"]
    }
  }),
  helmet.hsts({
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }),
  helmet.noSniff(),
  helmet.xssFilter(),
  helmet.frameguard({ action: 'deny' }),
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
];

module.exports = {
  sanitizeInput,
  securityMiddleware
}; 