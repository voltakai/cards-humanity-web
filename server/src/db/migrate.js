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
    console.log('Starting schema migration...');
    const schemaSQL = await fs.readFile(
      path.join(__dirname, 'schema.sql'),
      'utf8'
    );

    await pool.query(schemaSQL);
    console.log('Schema migration completed successfully');

    // Seed initial data
    console.log('Starting data seeding...');
    const seedSQL = await fs.readFile(
      path.join(__dirname, 'seeds', 'cards.sql'),
      'utf8'
    );

    await pool.query(seedSQL);
    console.log('Seed data inserted successfully');

  } catch (error) {
    console.error('Migration failed:', error);
    // Log additional details if available
    if (error.detail) console.error('Error detail:', error.detail);
    if (error.hint) console.error('Error hint:', error.hint);
    if (error.where) console.error('Error location:', error.where);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Add error handling for unhandled rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled rejection:', error);
  process.exit(1);
});

migrate(); 