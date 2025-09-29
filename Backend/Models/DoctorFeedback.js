const mongoose = require("mongoose");

const doctorFeedbackSchema = new mongoose.Schema({
    feedbackID: { type: String, required: true, unique: true},
    log_id: { type: mongoose.Schema.Types.ObjectId, ref: "HealthLog", required: true },
    userID: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    feedback_text: { type: String, required: true },
    rating: { type: Number },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("DoctorFeedback", doctorFeedbackSchema);