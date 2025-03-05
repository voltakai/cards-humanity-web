const axios = require('axios');

const monitorEndpoints = async () => {
  try {
    // Health check endpoint
    const healthCheck = await axios.get(`${process.env.FRONTEND_URL}/health`);
    console.log('Frontend health:', healthCheck.status === 200 ? 'OK' : 'Failed');

    // API check
    const apiCheck = await axios.get(`${process.env.REACT_APP_API_URL}/health`);
    console.log('Backend health:', apiCheck.status === 200 ? 'OK' : 'Failed');

    // Database check
    const dbCheck = await pool.query('SELECT NOW()');
    console.log('Database health:', dbCheck ? 'OK' : 'Failed');

  } catch (error) {
    console.error('Monitoring error:', error);
  }
};

// Run health checks every 5 minutes
setInterval(monitorEndpoints, 300000); 