const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
   userID: { type: String, required: true, unique: true},
   username: { type: String, required: true, unique: true },
   password: { type: String, required: true },
   email: { type: String, required: true, unique: true },
   dob: { type: Date },
   role: { type: String, enum: ["Patient", "Doctor", "Admin"], required: true },
   account_status: { type: String, enum: ["Active", "Inactive", "Locked"], default: "Active" },
   created_at: { type: Date, default: Date.now } 
});

module.exports = mongoose.model("User", userSchema);