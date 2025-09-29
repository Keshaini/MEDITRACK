const mongoose = require("mongoose");

const loginAttemptSchema = new mongoose.Schema({
    attemptID: { type: String, required: true, unique: true},
    useriD: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    attempt_time: { type: Date, default: Date.now },
    success: { type: Boolean, default: false },
    ip_address: { type: String },
    user_agent: { type: String }
});

module.exports = mongoose.model("LoginAttempt", loginAttemptSchema);