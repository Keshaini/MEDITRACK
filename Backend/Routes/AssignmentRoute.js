const express = require('express');
const router = express.Router();
const auth = require('../Middlewares/auth');
const {
  getMyDoctors,
  getMyPatients,
  createAssignment,
  getAllAssignments,
  updateAssignmentStatus,
  deleteAssignment,
  getAssignmentById
} = require('../Controllers/AssignmentController');

// Patient routes
router.get('/my-doctors', auth, getMyDoctors);

// Doctor routes
router.get('/my-patients', auth, getMyPatients);

// Admin routes
router.post('/assign', auth, createAssignment);
router.get('/all', auth, getAllAssignments);
router.put('/:id/status', auth, updateAssignmentStatus);
router.delete('/:id', auth, deleteAssignment);

// Shared routes
router.get('/:id', auth, getAssignmentById);

module.exports = router;