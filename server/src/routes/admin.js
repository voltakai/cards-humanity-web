const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { adminAuth } = require('../middleware/auth');
const rateLimit = require('express-rate-limit');
const { pool } = require('../config/database');
const ADMIN_CREDENTIALS = require('../config/auth');
const { sanitizeInput } = require('../utils/security');

// Rate limiting for login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5 // limit each IP to 5 login attempts per windowMs
});

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ error: 'Missing credentials' });
    }

    // Sanitize input
    const sanitizedUsername = sanitizeInput(username);

    // Check credentials
    if (
      sanitizedUsername === ADMIN_CREDENTIALS.username && 
      password === ADMIN_CREDENTIALS.password
    ) {
      // Generate JWT token
      const token = jwt.sign(
        { username: sanitizedUsername, role: 'admin' },
        process.env.JWT_SECRET || 'fallback_secret',
        { expiresIn: '1h' }
      );

      return res.json({ token });
    }

    return res.status(401).json({ error: 'Invalid credentials' });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Protected admin routes
router.use(adminAuth);

// Verify token endpoint
router.get('/verify', (req, res) => {
  res.json({ valid: true });
});

// Admin settings
router.get('/settings', (req, res) => {
  // ... settings retrieval logic
});

router.put('/settings', (req, res) => {
  // Validate and sanitize input
  const sanitizedSettings = sanitizeInput(req.body);
  // ... settings update logic
});

// Admin routes
router.post('/kick-player', (req, res) => {
  // Implement kick player logic
});

router.delete('/messages/:messageId', (req, res) => {
  // Implement delete message logic
});

router.post('/reset-game/:gameId', (req, res) => {
  // Implement reset game logic
});

// Get all active games
router.get('/games', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT 
        g.id,
        g.status,
        g.created_at,
        json_agg(
          json_build_object(
            'id', p.id,
            'username', p.username,
            'score', p.score,
            'isCardCzar', p.is_card_czar
          )
        ) as players
      FROM games g
      LEFT JOIN players p ON g.id = p.game_id
      WHERE g.status != 'ended'
      GROUP BY g.id
      ORDER BY g.created_at DESC
    `);

    res.json(rows);
  } catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Kick player
router.post('/games/:gameId/kick/:playerId', async (req, res) => {
  const { gameId, playerId } = req.params;

  try {
    await pool.query(
      'DELETE FROM players WHERE game_id = $1 AND id = $2',
      [gameId, playerId]
    );

    // Notify through Socket.IO
    req.app.get('io').to(gameId).emit('playerKicked', { playerId });

    res.json({ message: 'Player kicked successfully' });
  } catch (error) {
    console.error('Error kicking player:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete message
router.delete('/games/:gameId/messages/:messageId', async (req, res) => {
  const { gameId, messageId } = req.params;

  try {
    await pool.query(
      'DELETE FROM messages WHERE game_id = $1 AND id = $2',
      [gameId, messageId]
    );

    // Notify through Socket.IO
    req.app.get('io').to(gameId).emit('messageDeleted', { messageId });

    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Reset game
router.post('/games/:gameId/reset', async (req, res) => {
  const { gameId } = req.params;

  try {
    await pool.query('BEGIN');

    // Reset game state
    await pool.query(
      `UPDATE games 
       SET status = 'waiting', 
           updated_at = CURRENT_TIMESTAMP 
       WHERE id = $1`,
      [gameId]
    );

    // Reset players
    await pool.query(
      `UPDATE players 
       SET score = 0, 
           is_card_czar = false 
       WHERE game_id = $1`,
      [gameId]
    );

    // Reset cards
    await pool.query(
      `UPDATE game_cards 
       SET status = 'in_deck', 
           player_id = NULL 
       WHERE game_id = $1`,
      [gameId]
    );

    await pool.query('COMMIT');

    // Notify through Socket.IO
    req.app.get('io').to(gameId).emit('gameReset');

    res.json({ message: 'Game reset successfully' });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error resetting game:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router; 