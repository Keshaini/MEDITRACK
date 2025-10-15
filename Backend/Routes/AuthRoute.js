// routes/AuthRoute.js
const express = require('express');
const router = express.Router();
const { register, login, getProfile } = require('../Controllers/AuthController');
const auth = require('../Middlewares/auth');
const User = require('../Models/User'); 

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

// ✅ GET /api/auth/profile (protected route)
router.get('/profile', auth, getProfile);

module.exports = router;
