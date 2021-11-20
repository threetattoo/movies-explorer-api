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
    .catch((err) => {
      throw new NotFoundError(err.message);
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
        throw new IncorrectDataError(BAD_MOVIE_INFO);
      } else if (err.code === 11000) {
        throw new ExistingDataError(MOVIE_ALREADY_EXIST);
      }
    })
    .catch(next);
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
          .then((deletedMovie) => {
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
