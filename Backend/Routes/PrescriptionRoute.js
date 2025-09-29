const express = require('express');
const router = express.Router();
const {
  createPrescription,
  getPrescriptions,
  getPrescriptionById,
  updatePrescription,
  deletePrescription
} = require('../Controllers/PrescriptionController');

router.post('/', createPrescription);
router.get('/', getPrescriptions);
router.get('/:id', getPrescriptionById);
router.put('/:id', updatePrescription);
router.delete('/:id', deletePrescription);

module.exports = router;