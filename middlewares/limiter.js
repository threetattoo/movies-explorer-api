const expressRateLimit = require('express-rate-limit');

const limiter = expressRateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

module.exports = limiter;
