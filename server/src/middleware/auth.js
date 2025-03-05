const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcrypt');
const ADMIN_CREDENTIALS = require('../config/auth');

// Rate limiting for login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per IP
  message: { error: 'Too many login attempts, please try again later' }
});

// Token verification middleware
const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret', (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Invalid token' });
      }
      req.adminUser = decoded;
      next();
    });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Admin authentication middleware
const adminAuth = [loginLimiter, verifyToken];

module.exports = { adminAuth, verifyToken }; 