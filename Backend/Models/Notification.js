const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    notificationID: { type: String, required: true, unique: true},
    userID: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ["Reminder", "Alert", "Info"], required: true },
    status: { type: String, enum: ["Unread", "Read"], default: "Unread" },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Notification", notificationSchema);