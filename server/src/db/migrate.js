const { Pool } = require('pg');
const fs = require('fs').promises;
const path = require('path');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function migrate() {
  try {
    // Create tables
    const schemaSQL = await fs.readFile(
      path.join(__dirname, 'schema.sql'),
      'utf8'
    );

    await pool.query(schemaSQL);
    console.log('Migration completed successfully');

    // Seed initial data if needed
    const seedSQL = await fs.readFile(
      path.join(__dirname, 'seeds', 'cards.sql'),
      'utf8'
    );

    await pool.query(seedSQL);
    console.log('Seed data inserted successfully');

  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrate(); 