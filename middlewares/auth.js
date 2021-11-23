const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;
const { JWT_SECRET_DEV } = require('../config');
const { AuthorizationError } = require('../errors/authorization-error');
const { AUTHORIZATION_ERROR_MESSAGE } = require('../utils/constants');

const auth = (req, res, next) => {
  const cookie = req.cookies;

  if (!cookie) {
    throw new AuthorizationError(AUTHORIZATION_ERROR_MESSAGE);
  }
  const token = cookie.jwt;

  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : JWT_SECRET_DEV);
  } catch (err) {
    throw new AuthorizationError(AUTHORIZATION_ERROR_MESSAGE);
  }

  req.user = payload;

  next();
};

module.exports = auth;
