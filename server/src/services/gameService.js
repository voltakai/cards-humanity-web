const { pool } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class GameService {
  async createGame() {
    const gameId = uuidv4();
    const query = 'INSERT INTO games (id) VALUES ($1) RETURNING *';
    
    try {
      const { rows } = await pool.query(query, [gameId]);
      return rows[0];
    } catch (error) {
      console.error('Error creating game:', error);
      throw new Error('Failed to create game');
    }
  }

  async getGame(gameId) {
    const query = `
      SELECT 
        g.*,
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
      WHERE g.id = $1
      GROUP BY g.id
    `;

    try {
      const { rows } = await pool.query(query, [gameId]);
      return rows[0];
    } catch (error) {
      console.error('Error getting game:', error);
      throw new Error('Failed to get game');
    }
  }

  async addPlayer(gameId, username) {
    const query = `
      INSERT INTO players (id, game_id, username)
      VALUES ($1, $2, $3)
      RETURNING *
    `;

    try {
      const { rows } = await pool.query(query, [uuidv4(), gameId, username]);
      return rows[0];
    } catch (error) {
      console.error('Error adding player:', error);
      throw new Error('Failed to add player');
    }
  }

  async removePlayer(gameId, playerId) {
    const query = 'DELETE FROM players WHERE game_id = $1 AND id = $2';

    try {
      await pool.query(query, [gameId, playerId]);
    } catch (error) {
      console.error('Error removing player:', error);
      throw new Error('Failed to remove player');
    }
  }

  async updateGameStatus(gameId, status) {
    const query = 'UPDATE games SET status = $1 WHERE id = $2 RETURNING *';

    try {
      const { rows } = await pool.query(query, [status, gameId]);
      return rows[0];
    } catch (error) {
      console.error('Error updating game status:', error);
      throw new Error('Failed to update game status');
    }
  }

  async dealCards(gameId, playerId) {
    const CARDS_PER_HAND = 10;
    
    const query = `
      UPDATE game_cards
      SET player_id = $1, status = 'in_hand'
      WHERE id IN (
        SELECT id FROM game_cards
        WHERE game_id = $2 
        AND status = 'in_deck'
        AND card_id IN (
          SELECT id FROM cards WHERE type = 'white'
        )
        LIMIT $3
      )
      RETURNING *
    `;

    try {
      const { rows } = await pool.query(query, [playerId, gameId, CARDS_PER_HAND]);
      return rows;
    } catch (error) {
      console.error('Error dealing cards:', error);
      throw new Error('Failed to deal cards');
    }
  }

  async selectNextCardCzar(gameId) {
    const query = `
      UPDATE players
      SET is_card_czar = CASE 
        WHEN id = (
          SELECT id FROM players 
          WHERE game_id = $1 
          AND NOT is_card_czar 
          ORDER BY created_at ASC 
          LIMIT 1
        )
        THEN true
        ELSE false
      END
      WHERE game_id = $1
      RETURNING *
    `;

    try {
      const { rows } = await pool.query(query, [gameId]);
      return rows.find(player => player.is_card_czar);
    } catch (error) {
      console.error('Error selecting card czar:', error);
      throw new Error('Failed to select card czar');
    }
  }
}

module.exports = new GameService(); 