const mongoose = require("mongoose");

const healthLogSchema = new mongoose.Schema({
    logID: { type: String, required: true, unique: true},
    userID: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    log_date: { type: Date, default: Date.now },
    blood_pressure: { type: String },
    heart_rate: { type: Number },
    weight: { type: Number },
    symptoms: { type: String },
    notes: { type: String }
});

module.exports = mongoose.model("HealthLog", healthLogSchema);