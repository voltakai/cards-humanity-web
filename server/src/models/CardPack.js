const { pool } = require('../config/database');

class CardPack {
  static async getAvailablePacks() {
    const query = `
      SELECT 
        id,
        name,
        description,
        category,
        is_base_pack,
        card_count,
        theme_tags,
        maturity_rating
      FROM card_packs
      ORDER BY is_base_pack DESC, name ASC
    `;
    
    const { rows } = await pool.query(query);
    return rows;
  }
}

module.exports = CardPack; 