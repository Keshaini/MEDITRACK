const Goal = require('../Models/HealthGoal');

const createGoal = async (req, res) => {
  try {
    const goal = new Goal(req.body);
    await goal.save();
    res.status(201).json(goal);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find().populate('patient_id');
    res.json(goals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getGoalById = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id).populate('patient_id');
    if (!goal) return res.status(404).json({ error: 'Goal not found' });
    res.json(goal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!goal) return res.status(404).json({ error: 'Goal not found' });
    res.json(goal);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findByIdAndDelete(req.params.id);
    if (!goal) return res.status(404).json({ error: 'Goal not found' });
    res.json({ message: 'Goal deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createGoal, getGoals, getGoalById, updateGoal, deleteGoal };