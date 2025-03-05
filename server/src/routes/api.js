const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const logger = require('../utils/logger');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// GET /api/packs - Get all card packs
router.get('/packs', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM card_packs');
    res.json(result.rows);
  } catch (error) {
    logger.error('Error fetching card packs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/cards/:packId - Get cards for a specific pack
router.get('/cards/:packId', async (req, res) => {
  try {
    const { packId } = req.params;
    const result = await pool.query(
      'SELECT * FROM cards WHERE pack_id = $1',
      [packId]
    );
    res.json(result.rows);
  } catch (error) {
    logger.error('Error fetching cards:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/health - Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// POST /api/games - Create a new game
router.post('/games', async (req, res) => {
  try {
    const { name, hostId, maxPlayers = 8, packIds = [] } = req.body;
    
    const result = await pool.query(
      'INSERT INTO games (name, host_id, max_players, pack_ids, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, hostId, maxPlayers, packIds, 'waiting']
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    logger.error('Error creating game:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/games - Get list of active games
router.get('/games', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM games WHERE status != $1 ORDER BY created_at DESC',
      ['completed']
    );
    res.json(result.rows);
  } catch (error) {
    logger.error('Error fetching games:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
router.use((err, req, res, next) => {
  logger.error('API Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = router; 