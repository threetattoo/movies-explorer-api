require('dotenv').config();

const {
  PORT_DEV = 3000,
  MONGODB_URL = 'mongodb://localhost:27017/bitfilmsdb',
  JWT_SECRET_DEV = 'dev-secret',
} = process.env;

module.exports = {
  PORT_DEV,
  MONGODB_URL,
  JWT_SECRET_DEV,
};
