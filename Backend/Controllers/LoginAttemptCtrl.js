const LoginAttempt = require('../Models/LoginAttempt');

const createAttempt = async (req, res) => {
  try {
    const attempt = new LoginAttempt(req.body);
    await attempt.save();
    res.status(201).json(attempt);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getAttempts = async (req, res) => {
  try {
    const attempts = await LoginAttempt.find().populate('user_id');
    res.json(attempts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAttemptById = async (req, res) => {
  try {
    const attempt = await LoginAttempt.findById(req.params.id).populate('user_id');
    if (!attempt) return res.status(404).json({ error: 'Login attempt not found' });
    res.json(attempt);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createAttempt, getAttempts, getAttemptById };