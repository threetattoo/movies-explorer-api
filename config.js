require('dotenv').config();

const {
  PORT = 3000,
  MONGODB_URL = 'mongodb://localhost:27017/bitfilmsdb',
  JWT_SECRET = 'dev-secret',
} = process.env;

module.exports = {
  PORT,
  MONGODB_URL,
  JWT_SECRET,
};