const HealthLog = require('../Models/HealthLog');

// ✅ Create a new health log
const createHealthLog = async (req, res) => {
  try {
    // Validation: ensure at least date or one field exists
    if (!req.body.date) {
      return res.status(400).json({ error: 'Date is required' });
    }

    const newLog = new HealthLog({
      date: req.body.date,
      time: req.body.time,
      bloodPressure: req.body.bloodPressure,
      heartRate: req.body.heartRate,
      temperature: req.body.temperature,
      weight: req.body.weight,
      bloodSugar: req.body.bloodSugar,
      oxygenSaturation: req.body.oxygenSaturation,
      symptoms: req.body.symptoms,
      notes: req.body.notes,
      patientId: req.user._id   
      // If you have patient_id later from auth, add: patient_id: req.user?._id
    });

    const savedLog = await newLog.save();
    res.status(201).json(savedLog);
  } catch (err) {
    console.error('Error creating health log:', err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get all health logs
const getHealthLogs = async (req, res) => {
  try {
    const logs = await HealthLog.find({ patientId: req.user._id }).sort({ date: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get a specific log
const getHealthLogById = async (req, res) => {
  try {
    const log = await HealthLog.findOne({ _id: req.params.id, patientId: req.user._id });
    if (!log) return res.status(404).json({ error: 'Health log not found' });
    res.json(log);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update log
const updateHealthLog = async (req, res) => {
  try {
    const updated = await HealthLog.findOneAndUpdate(
      { _id: req.params.id, patientId: req.user._id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Health log not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Delete log
const deleteHealthLog = async (req, res) => {
  try {
    const deleted = await HealthLog.findOneAndDelete({ _id: req.params.id, patientId: req.user._id });
    if (!deleted) return res.status(404).json({ error: 'Health log not found' });
    res.json({ message: 'Health log deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createHealthLog, getHealthLogs, getHealthLogById, updateHealthLog, deleteHealthLog };
