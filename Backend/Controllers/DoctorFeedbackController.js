const Feedback = require('../Models/DoctorFeedback');

const createFeedback = async (req, res) => {
  try {
    const feedback = new Feedback(req.body);
    await feedback.save();
    res.status(201).json(feedback);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().populate('doctor_id log_id');
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getFeedbackById = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id).populate('doctor_id log_id');
    if (!feedback) return res.status(404).json({ error: 'Feedback not found' });
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!feedback) return res.status(404).json({ error: 'Feedback not found' });
    res.json(feedback);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);
    if (!feedback) return res.status(404).json({ error: 'Feedback not found' });
    res.json({ message: 'Feedback deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createFeedback, getFeedbacks, getFeedbackById, updateFeedback, deleteFeedback };