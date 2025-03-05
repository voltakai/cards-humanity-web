const { pool } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class CardService {
  async drawBlackCard(gameId) {
    const query = `
      UPDATE game_cards
      SET status = 'in_play'
      WHERE id = (
        SELECT id FROM game_cards
        WHERE game_id = $1 
        AND status = 'in_deck'
        AND card_id IN (
          SELECT id FROM cards WHERE type = 'black'
        )
        ORDER BY RANDOM()
        LIMIT 1
      )
      RETURNING card_id;
    `;

    try {
      const { rows } = await pool.query(query, [gameId]);
      return rows[0];
    } catch (error) {
      console.error('Error drawing black card:', error);
      throw new Error('Failed to draw black card');
    }
  }

  async submitWhiteCard(gameId, playerId, cardId) {
    const query = `
      UPDATE game_cards
      SET status = 'submitted'
      WHERE game_id = $1 
      AND player_id = $2 
      AND card_id = $3
      RETURNING *;
    `;

    try {
      const { rows } = await pool.query(query, [gameId, playerId, cardId]);
      return rows[0];
    } catch (error) {
      console.error('Error submitting white card:', error);
      throw new Error('Failed to submit white card');
    }
  }

  async selectWinner(gameId, cardId) {
    const query = `
      UPDATE game_cards
      SET status = 'won'
      WHERE game_id = $1 AND card_id = $2
      RETURNING player_id;
    `;

    const updateScoreQuery = `
      UPDATE players
      SET score = score + 1
      WHERE id = $1
      RETURNING *;
    `;

    try {
      const { rows } = await pool.query(query, [gameId, cardId]);
      const winnerId = rows[0].player_id;
      const winner = await pool.query(updateScoreQuery, [winnerId]);
      return winner.rows[0];
    } catch (error) {
      console.error('Error selecting winner:', error);
      throw new Error('Failed to select winner');
    }
  }

  async replenishHand(gameId, playerId) {
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
        ORDER BY RANDOM()
        LIMIT 1
      )
      RETURNING *;
    `;

    try {
      const { rows } = await pool.query(query, [playerId, gameId]);
      return rows[0];
    } catch (error) {
      console.error('Error replenishing hand:', error);
      throw new Error('Failed to replenish hand');
    }
  }
}

module.exports = new CardService(); 