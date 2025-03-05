// SECURITY ISSUE: Never hardcode credentials like this in production!
// These should be in environment variables
const ADMIN_CREDENTIALS = {
  username: process.env.ADMIN_USERNAME || 'admin',
  password: process.env.ADMIN_PASSWORD || 'admin'
};

module.exports = ADMIN_CREDENTIALS; 