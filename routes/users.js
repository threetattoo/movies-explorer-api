const usersRouter = require('express').Router();

const {
  idValidation,
  userInfoValidation,
} = require('../middlewares/validation');

const {
  getCurrentUser,
  updateCurrentUser,
} = require('../controllers/users');

userRouter.get('/users/me', idValidation, getCurrentUser);
userRouter.patch('/users/me', userInfoValidation, updateCurrentUser);

module.exports = usersRouter;
