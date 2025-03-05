require('dotenv').config();
const { migrate } = require('./migrate');

async function init() {
  try {
    console.log('Starting database initialization...');
    await migrate();
    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
}

init(); 