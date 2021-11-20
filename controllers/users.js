//const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const AuthorizationError = require('../errors/authorization-error');
const ExistingDataError = require('../errors/existing-data-error');
const IncorrectDataError = require('../errors/incorrect-data-error');
const NotFoundError = require('../errors/not-found-error');

const { JWT_SECRET } = require('../config');

const {
  USER_NOT_FOUND,
  EMAIL_ALREADY_EXIST,
  VALIDATION_ERROR,
  USER_NOT_FOUND_BY_ID,
  BAD_USER_UPDATE_REQUEST,
  AUTHORIZATION_ERROR,
  LOGOUT,
} = require('../utils/constants');

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(USER_NOT_FOUND);
      }
      return res.send(user);
    })
    .catch((err) => {
      next(err);
    });
};

const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.code === 11000) {
        throw new ExistingDataError(EMAIL_ALREADY_EXIST);
      }
      if (err.name === VALIDATION_ERROR || err.name === CASTOM_ERROR) {
        throw new IncorrectDataError(BAD_USER_INFO);
      }
      return next(err);
    });
};

updateCurrentUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email },
    {
      runValidators: true,
      new: true,
    })
    .then((user) => {
      if (!user) {
        throw new NotFoundError(USER_NOT_FOUND_BY_ID);
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === VALIDATION_ERROR || err.name === CASTOM_ERROR) {
        throw new IncorrectDataError(BAD_USER_UPDATE_REQUEST);
      } else if (err.code === 11000) {
        throw new ExistingDataError(EMAIL_ALREADY_EXIST);
      }
      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id },
        JWT_SECRET, //NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key',
        { expiresIn: '7d' });
      res.cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true, sameSite: true }).send({ token });
    })
    .catch(() => {
      throw new AuthorizationError(AUTHORIZATION_ERROR);
    })
    .catch(next);
};

const logout = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(USER_NOT_FOUND);
      }
      return res.clearCookie('jwt').send({ message: LOGOUT });
    })
    .catch(next);
};

module.exports = {
  getCurrentUser,
  createUser,
  updateCurrentUser,
  login,
  logout,
};