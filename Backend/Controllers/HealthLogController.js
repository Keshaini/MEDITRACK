const HealthLog = require('../Models/HealthLog');

const createHealthLog = async (req, res) => {
  try {
    const log = new HealthLog(req.body);
    await log.save();
    res.status(201).json(log);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getHealthLogs = async (req, res) => {
  try {
    const logs = await HealthLog.find().populate('patient_id');
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getHealthLogById = async (req, res) => {
  try {
    const log = await HealthLog.findById(req.params.id).populate('patient_id');
    if (!log) return res.status(404).json({ error: 'HealthLog not found' });
    res.json(log);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateHealthLog = async (req, res) => {
  try {
    const log = await HealthLog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!log) return res.status(404).json({ error: 'HealthLog not found' });
    res.json(log);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteHealthLog = async (req, res) => {
  try {
    const log = await HealthLog.findByIdAndDelete(req.params.id);
    if (!log) return res.status(404).json({ error: 'HealthLog not found' });
    res.json({ message: 'HealthLog deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createHealthLog, getHealthLogs, getHealthLogById, updateHealthLog, deleteHealthLog };