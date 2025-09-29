const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema({
  prescriptionID: { type: String, required: true, unique: true},
  appointmentID: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment", required: true },
  userID: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date_issued: { type: Date, default: Date.now },
  instructions: { type: String }
});

module.exports = mongoose.model("Prescription", prescriptionSchema);