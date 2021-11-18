const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const AuthorizationError = require('../errors/authorization-error');

const {
  WRONG_EMAIL_FORMAT,
  WRONG_USER_DATA,
  WEAK_PASSWORD,
} = require('../utils/constants');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
      message: WRONG_EMAIL_FORMAT,
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
    validate: {
      validator(password) {
        return validator.isStrongPassword(password);
      },
      message: WEAK_PASSWORD,
    },
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
});

userSchema.statics.findUserByCredentials = function findUser(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthorizationError(WRONG_USER_DATA);
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new AuthorizationError(WRONG_USER_DATA);
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
