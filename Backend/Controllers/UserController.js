// Controllers/UserController.js
const User = require('../Models/User');

// Create user (Admin/internal use)
const createUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      dateOfBirth,
      gender,
      address,
      bloodGroup,
      emergencyContact,
      role,
      specialization,
      licenseNumber,
    } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    const user = new User({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password,
      phone,
      dateOfBirth,
      gender,
      address,
      bloodGroup,
      emergencyContact,
      role,
      specialization,
      licenseNumber,
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: user,
    });
  } catch (err) {
    console.error('Create user error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user)
      return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    }).select('-password');
    if (!user)
      return res.status(404).json({ success: false, message: 'User not found' });
    res.json({
      success: true,
      message: 'User updated successfully',
      data: user,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user)
      return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get doctors assigned to a patient
const getMyDoctors = async (req, res) => {
  try {
    // Find the patient and populate the assignedDoctor field
    const patient = await User.findById(req.user._id)
      .populate("assignedDoctor", "firstName lastName email specialization");

    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient not found" });
    }

    if (!patient.assignedDoctor) {
      return res.status(404).json({ success: false, message: "No assigned doctor found" });
    }

    res.json({ success: true, data: patient.assignedDoctor });
  } catch (err) {
    console.error("Error fetching assigned doctors:", err);
    res.status(500).json({ success: false, message: "Server error while fetching assigned doctors" });
  }
};

// Get patients assigned to a specific doctor
const getAssignedPatients = async (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Access denied: Only doctors can view assigned patients.' });
    }

    const patients = await User.find({ assignedDoctor: req.user._id, role: 'patient' }).select('-password');
    res.status(200).json(patients);
  } catch (error) {
    console.error('❌ Error fetching assigned patients:', error);
    res.status(500).json({ message: 'Server error while fetching assigned patients' });
  }
};

module.exports = { createUser, getUsers, getUserById, updateUser, deleteUser, getMyDoctors, getAssignedPatients };
