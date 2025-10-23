const Assignment = require('../Models/Assignment');
const User = require('../Models/User');

// ✅ Patient: Get my assigned doctors
const getMyDoctors = async (req, res) => {
  try {
    if (req.user.role !== 'patient') {
      return res.status(403).json({ error: 'Only patients can access this' });
    }

    const assignments = await Assignment.find({ 
      patientId: req.user._id,
      status: 'active'
    })
    .populate('doctorId', 'firstName lastName email phone phoneNumber specialization hospitalName address')
    .populate('assignedBy', 'firstName lastName')
    .sort({ assignedDate: -1 });

    res.status(200).json(assignments);
  } catch (error) {
    console.error('❌ Error fetching assigned doctors:', error);
    res.status(500).json({ error: 'Failed to fetch assigned doctors' });
  }
};

// ✅ Doctor: Get my assigned patients
const getMyPatients = async (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ error: 'Only doctors can access this' });
    }

    const assignments = await Assignment.find({ 
      doctorId: req.user._id,
      status: 'active'
    })
    .populate('patientId', 'firstName lastName email phone phoneNumber age gender')
    .sort({ assignedDate: -1 });

    res.status(200).json(assignments);
  } catch (error) {
    console.error('❌ Error fetching assigned patients:', error);
    res.status(500).json({ error: 'Failed to fetch assigned patients' });
  }
};

// ✅ Admin: Create new assignment
const createAssignment = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can assign doctors to patients' });
    }

    const { patientId, doctorId, notes } = req.body;

    // Validate patient exists and is a patient
    const patient = await User.findOne({ _id: patientId, role: 'patient' });
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    // Validate doctor exists and is a doctor
    const doctor = await User.findOne({ _id: doctorId, role: 'doctor' });
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    // Check if assignment already exists
    const existingAssignment = await Assignment.findOne({ patientId, doctorId });
    if (existingAssignment) {
      // Update existing assignment to active
      existingAssignment.status = 'active';
      existingAssignment.assignedDate = new Date();
      existingAssignment.notes = notes;
      existingAssignment.assignedBy = req.user._id;
      await existingAssignment.save();
      
      const populated = await Assignment.findById(existingAssignment._id)
        .populate('patientId', 'firstName lastName email')
        .populate('doctorId', 'firstName lastName email specialization');

      return res.status(200).json({
        message: 'Assignment updated successfully',
        assignment: populated
      });
    }

    // Create new assignment
    const assignment = new Assignment({
      patientId,
      doctorId,
      notes,
      assignedBy: req.user._id
    });

    await assignment.save();

    const populatedAssignment = await Assignment.findById(assignment._id)
      .populate('patientId', 'firstName lastName email')
      .populate('doctorId', 'firstName lastName email specialization');

    res.status(201).json({
      message: 'Doctor assigned to patient successfully',
      assignment: populatedAssignment
    });

  } catch (error) {
    console.error('❌ Error creating assignment:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'This doctor is already assigned to this patient' });
    }
    res.status(500).json({ error: 'Failed to create assignment' });
  }
};

// ✅ Admin: Get all assignments
const getAllAssignments = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can view all assignments' });
    }

    const assignments = await Assignment.find()
      .populate('patientId', 'firstName lastName email')
      .populate('doctorId', 'firstName lastName email specialization')
      .populate('assignedBy', 'firstName lastName')
      .sort({ assignedDate: -1 });

    res.status(200).json(assignments);
  } catch (error) {
    console.error('❌ Error fetching assignments:', error);
    res.status(500).json({ error: 'Failed to fetch assignments' });
  }
};

// ✅ Admin: Update assignment status
const updateAssignmentStatus = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can update assignments' });
    }

    const { status } = req.body;
    
    if (!['active', 'inactive', 'completed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const assignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
    .populate('patientId', 'firstName lastName email')
    .populate('doctorId', 'firstName lastName email specialization');

    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    res.status(200).json({
      message: 'Assignment status updated successfully',
      assignment
    });

  } catch (error) {
    console.error('❌ Error updating assignment:', error);
    res.status(500).json({ error: 'Failed to update assignment' });
  }
};

// ✅ Admin: Delete assignment
const deleteAssignment = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can delete assignments' });
    }

    const assignment = await Assignment.findByIdAndDelete(req.params.id);

    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    res.status(200).json({ message: 'Assignment deleted successfully' });

  } catch (error) {
    console.error('❌ Error deleting assignment:', error);
    res.status(500).json({ error: 'Failed to delete assignment' });
  }
};

// ✅ Get assignment by ID
const getAssignmentById = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate('patientId', 'firstName lastName email phone')
      .populate('doctorId', 'firstName lastName email specialization')
      .populate('assignedBy', 'firstName lastName');

    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    // Check authorization
    if (req.user.role === 'patient' && assignment.patientId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (req.user.role === 'doctor' && assignment.doctorId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.status(200).json(assignment);
  } catch (error) {
    console.error('❌ Error fetching assignment:', error);
    res.status(500).json({ error: 'Failed to fetch assignment' });
  }
};

module.exports = {
  getMyDoctors,
  getMyPatients,
  createAssignment,
  getAllAssignments,
  updateAssignmentStatus,
  deleteAssignment,
  getAssignmentById
};