const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
   // Personal Information
   firstName: { type: String, required: true },
   lastName: { type: String, required: true },
   email: { type: String, required: true, unique: true },
   password: { type: String, required: true },
   phone: { type: String, required: true },
   dateOfBirth: { type: Date, required: true },
   gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
   
   // Role
   role: { type: String, enum: ["patient", "doctor", "admin"], required: true, default: "patient" },
   
   // Patient-specific fields
   address: { type: String },
   bloodGroup: { type: String },
   emergencyContact: { type: String },
   
   // Doctor-specific fields
   specialization: { type: String },
   licenseNumber: { type: String },
   
   // Account status
   accountStatus: { type: String, enum: ["Active", "Inactive", "Locked"], default: "Active" },
   
   // Timestamps
   createdAt: { type: Date, default: Date.now },
   updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field before saving
userSchema.pre('save', function(next) {
   this.updatedAt = Date.now();
   next();
});

module.exports = mongoose.model("User", userSchema);

