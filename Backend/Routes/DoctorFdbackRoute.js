const express = require('express');
const router = express.Router();
const {
  createFeedback,
  getFeedbacks,
  getFeedbackById,
  updateFeedback,
  deleteFeedback
} = require('../Controllers/DoctorFeedbackController');

router.post('/', createFeedback);
router.get('/', getFeedbacks);
router.get('/:id', getFeedbackById);
router.put('/:id', updateFeedback);
router.delete('/:id', deleteFeedback);

module.exports = router;