const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;
const { JWT_SECRET_DEV } = require('../config');

const { AuthorizationError } = require('../errors/authorization-error');
const { ExistingDataError } = require('../errors/existing-data-error');
const { IncorrectDataError } = require('../errors/incorrect-data-error');
const { NotFoundError } = require('../errors/not-found-error');

const {
  USER_NOT_FOUND,
  EMAIL_ALREADY_EXIST,
  VALIDATION_ERROR,
  USER_NOT_FOUND_BY_ID,
  BAD_USER_UPDATE_REQUEST,
  AUTHORIZATION_ERROR_MESSAGE,
  LOGOUT,
  CASTOM_ERROR,
  BAD_USER_INFO,
  BAD_USER_ID,
} = require('../utils/constants');

const getCurrentUser = (req, res, next) => {
  const id = req.user._id;
  User.findById(id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError({USER_NOT_FOUND_BY_ID});
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === CASTOM_ERROR) {
        throw new IncorrectDataError({BAD_USER_ID});
      } else {
        next(err);
      }
    })
    .catch(next);
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
      res.status(200).send({
        name: user.name,
        _id: user._id,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ExistingDataError({EMAIL_ALREADY_EXIST}));
      }
      if (err.name === VALIDATION_ERROR || err.name === CASTOM_ERROR) {
        next(new IncorrectDataError({BAD_USER_INFO}));
      }
      return next(err);
    });
};

const updateCurrentUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, {
    runValidators: true,
    new: true,
  })
    .then((user) => {
      if (!user) {
        throw new NotFoundError({USER_NOT_FOUND_BY_ID});
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === VALIDATION_ERROR || err.name === CASTOM_ERROR) {
        next(new IncorrectDataError({BAD_USER_UPDATE_REQUEST}));
      } else if (err.code === 11000) {
        next(new ExistingDataError({EMAIL_ALREADY_EXIST}));
      }
      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : JWT_SECRET_DEV,
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true, sameSite: true }).send({ token });
    })
    .catch(() => {
      throw new AuthorizationError({AUTHORIZATION_ERROR_MESSAGE});
    })
    .catch(next);
};

const logout = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError({USER_NOT_FOUND});
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
