const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');
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
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new AuthorizationError(AUTHORIZATION_ERROR_MESSAGE);
  }

  req.user = payload;

  next();
};

module.exports = auth;
