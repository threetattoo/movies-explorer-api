const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { errorHandler } = require('./middlewares/errorHandler');
const limiter = require('./middlewares/limiter');
const ALLOWED_CORS = require('./utils/cors-options');
const {
  PORT_DEV,
  MONGODB_URL_DEV,
} = require('./config');

const router = require('./routes/index');

const app = express();

app.use(cors({
  origin: ALLOWED_CORS,
}));

const { NODE_ENV, PORT = PORT_DEV, MONGODB_URL } = process.env;

app.use(helmet());

mongoose.connect(NODE_ENV === 'production' ? MONGODB_URL : MONGODB_URL_DEV, {
  useNewUrlParser: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(requestLogger);
app.use(limiter);

app.use('/', router);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`); /* eslint-disable-line no-console */
});
