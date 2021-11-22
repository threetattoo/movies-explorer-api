const moviesRouter = require('express').Router();

const {
  movieValidation,
  removeMovieValidation,
} = require('../middlewares/validation');

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

moviesRouter.get('/movies', getMovies);
moviesRouter.post('/movies', movieValidation, createMovie);
moviesRouter.delete('/movies/:movieId', removeMovieValidation, deleteMovie);

module.exports = moviesRouter;
