const express = require('express');
const router = express.Router();
const auth = require('../Middlewares/auth');
const {
  createHealthLog,
  getHealthLogs,
  getHealthLogById,
  updateHealthLog,
  deleteHealthLog,
  getDashboardHealthSummary
} = require('../Controllers/HealthLogController');

// Apply auth middleware to all protected routes
router.post('/', auth, createHealthLog);
router.get('/', auth, getHealthLogs);
router.get('/:id', auth, getHealthLogById);
router.put('/:id', auth, updateHealthLog);
router.delete('/:id', auth, deleteHealthLog);
router.get('/summary/dashboard', auth, getDashboardHealthSummary);

module.exports = router;
