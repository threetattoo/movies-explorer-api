const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const { IncorrectDataError } = require('../errors/incorrect-data-error');
const { WRONG_URL_FORMAT } = require('../utils/constants');
/*
const urlValidation = (url) => {
  const val = validator.isURL(url, { protocols: ['http', 'https'], require_protocol: true });
  if (!val) {
    throw new IncorrectDataError({WRONG_URL_FORMAT});
  }
};
*/
const isURL = require('validator/lib/isURL');

const urlValidation = (value) => {
  if (!isURL(value)) {
    throw new CelebrateError(`${value} ${BAD_URL}`);
  }
  return value;
};

const signupValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const idValidation = celebrate({
  params: Joi.object().keys({
    _id: Joi.string().alphanum().length(24).hex(),
  }),
});

const userInfoValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required().min(2).max(30),
  }),
});

const movieValidation = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().custom(urlValidation).required(),
    trailer: Joi.string().custom(urlValidation).required(),
    thumbnail: Joi.string().custom(urlValidation).required(),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

const removeMovieValidation = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().required().length(24),
  }),
});

module.exports = {
  signupValidation,
  loginValidation,
  idValidation,
  userInfoValidation,
  movieValidation,
  removeMovieValidation,
};
