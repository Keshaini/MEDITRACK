// Middleware/requestLogger.js
const requestLogger = (req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
};

module.exports = requestLogger;
const express = require('express');
const router = express.Router();
const authMiddleware = require('../Middlewares/auth');