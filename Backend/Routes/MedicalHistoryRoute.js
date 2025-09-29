const express = require('express');
const router = express.Router();
const {
  createHistory,
  getHistories,
  getHistoryById,
  updateHistory,
  deleteHistory
} = require('../Controllers/MedicalHistoryController');

router.post('/', createHistory);
router.get('/', getHistories);
router.get('/:id', getHistoryById);
router.put('/:id', updateHistory);
router.delete('/:id', deleteHistory);

module.exports = router;