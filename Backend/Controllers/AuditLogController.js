const AuditLog = require('../Models/AuditLog');

const createAuditLog = async (req, res) => {
  try {
    const log = new AuditLog(req.body);
    await log.save();
    res.status(201).json(log);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find().populate('user_id');
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAuditLogById = async (req, res) => {
  try {
    const log = await AuditLog.findById(req.params.id).populate('user_id');
    if (!log) return res.status(404).json({ error: 'Audit log not found' });
    res.json(log);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteAuditLog = async (req, res) => {
  try {
    const log = await AuditLog.findByIdAndDelete(req.params.id);
    if (!log) return res.status(404).json({ error: 'Audit log not found' });
    res.json({ message: 'Audit log deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createAuditLog, getAuditLogs, getAuditLogById, deleteAuditLog };