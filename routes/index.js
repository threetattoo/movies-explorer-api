const router = require('express').Router();
const auth = require('../middlewares/auth');
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const { createUser, login, logout } = require('../controllers/users');
const NotFoundError = require('../errors/not-found-error');
const { RESOURCE_NOT_FOUND } = require('../utils/constants');
const { signupValidation, loginValidation } = require('../middlewares/validation');

router.all('/', auth);
router.post('/signin', loginValidation, login);
router.post('/signup', signupValidation, createUser);
router.use(auth);
router.post('/signout', logout);
router.use(auth, usersRouter);
router.use(auth, moviesRouter);

router.use('*', () => {
  throw new NotFoundError(RESOURCE_NOT_FOUND);
});

module.exports = router;
