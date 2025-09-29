const express = require('express');
const router = express.Router();
const {
  createPolicy,
  getPolicies,
  getPolicyById,
  updatePolicy,
  deletePolicy
} = require('../Controllers/AccessPolController');

router.post('/', createPolicy);
router.get('/', getPolicies);
router.get('/:id', getPolicyById);
router.put('/:id', updatePolicy);
router.delete('/:id', deletePolicy);

module.exports = router;