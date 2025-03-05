const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.type === 'validation') {
    return res.status(400).json({
      error: 'Validation Error',
      message: err.message
    });
  }

  if (err.type === 'auth') {
    return res.status(401).json({
      error: 'Authentication Error',
      message: err.message
    });
  }

  return res.status(500).json({
    error: 'Internal Server Error',
    message: 'Something went wrong'
  });
};

module.exports = errorHandler; 