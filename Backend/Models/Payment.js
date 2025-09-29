const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    paymentID: { type: String, required: true, unique: true},
    appointmentID: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment", required: true },
    userID: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    insuranceID: { type: mongoose.Schema.Types.ObjectId, ref: "Insurance", required: true },
    amount: { type: Number, required: true },
    method: { type: String, enum: ["Card", "Cash", "Online"], required: true },
    status: { type: String, enum: ["Pending", "Completed", "Failed"], default: "Pending" },
    payment_date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Payment", paymentSchema);