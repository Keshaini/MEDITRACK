const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
    medicalID: { type: String, required: true, unique: true},
    userID: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    medical_history: { type: Object }, // Can store JSON object
    condition: { type: String },
    text: { type: String }
});

module.exports = mongoose.model("Patient", patientSchema);