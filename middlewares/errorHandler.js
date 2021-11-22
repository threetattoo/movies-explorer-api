const {
  SERVER_ERROR,
} = require('../utils/constants');

const errorHandler = (error, req, res, next) => {
  const { statusCode = 500, message } = error;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? SERVER_ERROR
        : message,
    });
  next();
};

module.exports = errorHandler;
