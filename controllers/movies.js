const Movie = require('../models/movie');

const ExistingDataError = require('../errors/existing-data-error');
const IncorrectDataError = require('../errors/incorrect-data-error');
const NotFoundError = require('../errors/not-found-error');
const ForbiddenError = require('../errors/forbidden-error');

const {
  VALIDATION_ERROR,
  BAD_MOVIE_INFO,
  MOVIE_ALREADY_EXIST,
  MOVIE_NOT_FOUND_BY_ID,
  CANT_DELETE_MOVIE,
  MOVIE_SUCCESSFULLY_DELETED,
} = require('../utils/constants');

const getMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .then((movies) => {
      res.status(200).send(movies);
    })
    .catch(next);
};

const createMovie = (req, res, next) => {
  const owner = req.user._id;
  Movie.create({ owner, ...req.body })
    .then((movie) => {
      res.status(201).send(movie);
    })
    .catch((err) => {
      if (err.name === VALIDATION_ERROR) {
        next(new IncorrectDataError(BAD_MOVIE_INFO));
      } else if (err.code === 11000) {
        next(new ExistingDataError(MOVIE_ALREADY_EXIST));
      } else {
        next(err);
      }
    });
};

const deleteMovie = (req, res, next) => {
  const owner = req.user._id;
  const { movieId } = req.params;
  Movie.findById(movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError(MOVIE_NOT_FOUND_BY_ID);
      }
      if (movie.owner.toString() !== owner) {
        throw new ForbiddenError(CANT_DELETE_MOVIE);
      } else {
        Movie.findByIdAndDelete(movieId)
          .then(() => {
            res.status(200).send(MOVIE_SUCCESSFULLY_DELETED);
          })
          .catch(next);
      }
    })
    .catch(next);
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
