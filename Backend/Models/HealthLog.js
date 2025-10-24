const mongoose = require("mongoose");

const healthLogSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now }, 
  time: { type: String },
  bloodPressure: { type: String },
  heartRate: { type: Number },
  temperature: { type: Number },
  weight: { type: Number },
  bloodSugar: { type: Number },
  oxygenSaturation: { type: Number },
  symptoms: { type: String },
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("HealthLog", healthLogSchema);
