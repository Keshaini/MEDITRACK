const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  appointmentID: { type: String, required: true, unique: true},  
  userID: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  appointment_datetime: { type: Date, required: true },
  status: { type: String, enum: ["Scheduled", "Completed", "Cancelled"], default: "Scheduled" },
  channel: { type: String },
  notes: { type: String }
});

module.exports = mongoose.model("Appointment", appointmentSchema);