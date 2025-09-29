
const express = require('express');
const router = express.Router();
const {
  createAttempt,
  getAttempts,
  getAttemptById
} = require('../Controllers/LoginAttemptCtrl');

router.post('/', createAttempt);
router.get('/', getAttempts);
router.get('/:id', getAttemptById);

module.exports = router;
