const logger = require('../utils/logger');

const errorHandler = (err, req, res, _next) => {
  let statusCode = err.statusCode ;
  let message    = err.message  ;

  // Sequelize validation error
  if (err.name === 'SequelizeValidationError') {
    statusCode = 400;
    message    = err.errors.map(e => e.message).join(', ');
  }

  // Sequelize unique constraint
  if (err.name === 'SequelizeUniqueConstraintError') {
    statusCode = 409;
    message    = 'Record already exists';
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message    = 'Invalid token';
  }

  if (process.env.NODE_ENV === 'development') {
    logger.error(`[${req.method}] ${req.path} → ${statusCode}: ${message}`);
    logger.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
