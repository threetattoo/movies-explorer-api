const usersRouter = require('express').Router();

const {
  idValidation,
  userInfoValidation,
} = require('../middlewares/validation');

const {
  getCurrentUser,
  updateCurrentUser,
} = require('../controllers/users');

usersRouter.get('/users/me', idValidation, getCurrentUser);
usersRouter.patch('/users/me', userInfoValidation, updateCurrentUser);

module.exports = usersRouter;
