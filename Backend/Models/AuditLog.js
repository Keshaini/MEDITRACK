const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema({
    auditID: { type: String, required: true, unique: true},
    userID: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    description: { type: String }
});

module.exports = mongoose.model("AuditLog", auditLogSchema);