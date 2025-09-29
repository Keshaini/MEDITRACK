const AccessPolicy = require('../Models/AccessPolicy');

const createPolicy = async (req, res) => {
  try {
    const policy = new AccessPolicy(req.body);
    await policy.save();
    res.status(201).json(policy);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getPolicies = async (req, res) => {
  try {
    const policies = await AccessPolicy.find();
    res.json(policies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getPolicyById = async (req, res) => {
  try {
    const policy = await AccessPolicy.findById(req.params.id);
    if (!policy) return res.status(404).json({ error: 'Policy not found' });
    res.json(policy);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updatePolicy = async (req, res) => {
  try {
    const policy = await AccessPolicy.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!policy) return res.status(404).json({ error: 'Policy not found' });
    res.json(policy);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deletePolicy = async (req, res) => {
  try {
    const policy = await AccessPolicy.findByIdAndDelete(req.params.id);
    if (!policy) return res.status(404).json({ error: 'Policy not found' });
    res.json({ message: 'Policy deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createPolicy, getPolicies, getPolicyById, updatePolicy, deletePolicy };