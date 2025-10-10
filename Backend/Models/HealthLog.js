const mongoose = require("mongoose");

const healthLogSchema = new mongoose.Schema({
  userID: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: false 
  },
  log_date: { type: Date, default: Date.now },
  blood_pressure: { type: String },
  heart_rate: { type: Number },
  weight: { type: Number },
  symptoms: { type: String },
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("HealthLog", healthLogSchema);
