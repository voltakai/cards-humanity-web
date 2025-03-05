const Joi = require('joi');

const schemas = {
  username: Joi.string().alphanum().min(3).max(30).required(),
  gameId: Joi.string().uuid().required(),
  cardId: Joi.string().uuid().required(),
  message: Joi.string().min(1).max(500).required()
};

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      const err = new Error(error.details[0].message);
      err.type = 'validation';
      return next(err);
    }
    
    next();
  };
};

module.exports = {
  schemas,
  validate
}; 