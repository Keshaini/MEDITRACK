const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'completed'],
    default: 'active'
  },
  notes: {
    type: String
  },
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'  // Admin who assigned
  }
}, { timestamps: true });

// Prevent duplicate assignments
assignmentSchema.index({ patientId: 1, doctorId: 1 }, { unique: true });

module.exports = mongoose.model('Assignment', assignmentSchema);