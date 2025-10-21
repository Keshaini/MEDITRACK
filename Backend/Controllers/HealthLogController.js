const HealthLog = require('../Models/HealthLog');

// ✅ Create a new health log
const createHealthLog = async (req, res) => {
  try {
    // ✅ Check if user is authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: 'User not authenticated. Please login again.' });
    }

    // Validation: ensure at least date exists
    if (!req.body.date) {
      return res.status(400).json({ error: 'Date is required' });
    }

    console.log('✅ Creating health log for user:', req.user._id);
    console.log('✅ Request body:', req.body);

    const newLog = new HealthLog({
      patientId: req.user._id,  // ✅ Get from authenticated user
      date: req.body.date,
      time: req.body.time,
      bloodPressure: req.body.bloodPressure,
      heartRate: req.body.heartRate,
      temperature: req.body.temperature,
      weight: req.body.weight,
      bloodSugar: req.body.bloodSugar,
      oxygenSaturation: req.body.oxygenSaturation,
      symptoms: req.body.symptoms,
      notes: req.body.notes
    });

    const savedLog = await newLog.save();
    console.log('✅ Health log saved successfully:', savedLog._id);
    
    res.status(201).json(savedLog);
  } catch (err) {
    console.error('❌ Error creating health log:', err);
    res.status(500).json({ 
      error: 'Failed to save health log',
      message: err.message 
    });
  }
};

// ✅ Get all health logs (Role-based access)
const getHealthLogs = async (req, res) => {
  try {
    let query = {};

    // If the logged-in user is a patient, show only their logs
    if (req.user.role === 'patient') {
      query = { patientId: req.user._id };
    }

    // If doctor or admin, show all logs
    const logs = await HealthLog.find(query)
      .populate('patientId', 'firstName lastName email') // show basic patient info
      .sort({ date: -1 });

    res.status(200).json(logs);
  } catch (err) {
    console.error('❌ Error fetching health logs:', err);
    res.status(500).json({ error: 'Failed to fetch health logs' });
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

const getDashboardHealthSummary = async (req, res) => {
  try {
    const logs = await HealthLog.find({ patientId: req.user._id }).sort({ date: -1 });
    const totalLogs = logs.length;
    const recentLogs = logs.slice(0, 5);
    const chartData = logs
      .slice(0, 7)
      .reverse()
      .map(log => ({
        date: log.date,
        heartRate: log.heartRate || 0,
        weight: log.weight || 0,
        bloodPressure: log.bloodPressure || 'N/A',
        temperature: log.temperature || 0,
      }));

    res.status(200).json({
      totalLogs,
      recentLogs,
      chartData,
    });
  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    res.status(500).json({ error: 'Failed to fetch health summary' });
  }
};


module.exports = { createHealthLog, getHealthLogs, getHealthLogById, updateHealthLog, deleteHealthLog, getDashboardHealthSummary };
