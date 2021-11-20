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

movies.get('/movies', getMovies);
movies.post('/movies', movieValidation, createMovie);
movies.delete('/movies/:movieId', removeMovieValidation, deleteMovie);


module.exports = moviesRouter;