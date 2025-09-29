const MedicalHistory = require('../Models/MedicalHistory');

const createHistory = async (req, res) => {
  try {
    const history = new MedicalHistory(req.body);
    await history.save();
    res.status(201).json(history);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getHistories = async (req, res) => {
  try {
    const histories = await MedicalHistory.find().populate('patient_id');
    res.json(histories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getHistoryById = async (req, res) => {
  try {
    const history = await MedicalHistory.findById(req.params.id).populate('patient_id');
    if (!history) return res.status(404).json({ error: 'Medical history not found' });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateHistory = async (req, res) => {
  try {
    const history = await MedicalHistory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!history) return res.status(404).json({ error: 'Medical history not found' });
    res.json(history);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteHistory = async (req, res) => {
  try {
    const history = await MedicalHistory.findByIdAndDelete(req.params.id);
    if (!history) return res.status(404).json({ error: 'Medical history not found' });
    res.json({ message: 'Medical history deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createHistory, getHistories, getHistoryById, updateHistory, deleteHistory };