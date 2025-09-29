const Insurance = require('../Models/Insurance');

const createInsurance = async (req, res) => {
  try {
    const insurance = new Insurance(req.body);
    await insurance.save();
    res.status(201).json(insurance);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getInsurances = async (req, res) => {
  try {
    const insurances = await Insurance.find().populate('patient_id');
    res.json(insurances);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getInsuranceById = async (req, res) => {
  try {
    const insurance = await Insurance.findById(req.params.id).populate('patient_id');
    if (!insurance) return res.status(404).json({ error: 'Insurance not found' });
    res.json(insurance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateInsurance = async (req, res) => {
  try {
    const insurance = await Insurance.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!insurance) return res.status(404).json({ error: 'Insurance not found' });
    res.json(insurance);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteInsurance = async (req, res) => {
  try {
    const insurance = await Insurance.findByIdAndDelete(req.params.id);
    if (!insurance) return res.status(404).json({ error: 'Insurance not found' });
    res.json({ message: 'Insurance deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createInsurance, getInsurances, getInsuranceById, updateInsurance, deleteInsurance };