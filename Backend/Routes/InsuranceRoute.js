const express = require('express');
const router = express.Router();
const {
  createInsurance,
  getInsurances,
  getInsuranceById,
  updateInsurance,
  deleteInsurance
} = require('../Controllers/InsuranceController');

router.post('/', createInsurance);
router.get('/', getInsurances);
router.get('/:id', getInsuranceById);
router.put('/:id', updateInsurance);
router.delete('/:id', deleteInsurance);

module.exports = router;