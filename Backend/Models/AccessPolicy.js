const mongoose = require("mongoose");

const accessPolicySchema = new mongoose.Schema({
    policyID: { type: String, required: true, unique: true},
    role: { type: String, enum: ["Patient", "Doctor", "Admin"], required: true },
    max_attempts: { type: Number, required: true },
    lockout_duration_minutes: { type: Number, required: true }
});

module.exports = mongoose.model("AccessPolicy", accessPolicySchema);