const express = require('express');
const router = express.Router();
const {
  createAuditLog,
  getAuditLogs,
  getAuditLogById,
  deleteAuditLog
} = require('../Controllers/AuditLogController');

router.post('/', createAuditLog);
router.get('/', getAuditLogs);
router.get('/:id', getAuditLogById);
router.delete('/:id', deleteAuditLog);

module.exports = router;