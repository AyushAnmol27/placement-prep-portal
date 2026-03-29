const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Too many auth attempts, please try again later.' },
});

const codeLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { message: 'Code execution rate limit exceeded.' },
});

module.exports = { apiLimiter, authLimiter, codeLimiter };
