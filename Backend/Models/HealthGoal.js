const mongoose = require("mongoose");

const healthGoalSchema = new mongoose.Schema({
    goalID: { type: String, required: true, unique: true},
    userID: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    goal_type: { type: String, required: true },
    target_value: { type: String },
    start_date: { type: Date, required: true },
    end_date: { type: Date },
    status: { type: String, enum: ["Ongoing", "Completed", "Failed"], default: "Ongoing" }
});

module.exports = mongoose.model("HealthGoal", healthGoalSchema);