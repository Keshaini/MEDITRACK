const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
   // Auto-generated User ID
   userID: { 
      type: String, 
      unique: true,
      sparse: true 
   },
   
   // Personal Information
   name: { type: String, required: true }, // Changed from firstName/lastName
   firstName: { type: String },
   lastName: { type: String },
   email: { type: String, required: true, unique: true, lowercase: true },
   password: { type: String, required: true },
   phone: { type: String, required: true },
   dateOfBirth: { type: Date, required: true },
   gender: { type: String, enum: ["Male", "Female", "Other"] },
   
   // Role
   role: { 
      type: String, 
      enum: ["patient", "doctor", "admin"], 
      required: true, 
      default: "patient" 
   },
   
   // Patient-specific fields
   address: { type: String },
   bloodGroup: { type: String },
   emergencyContact: { type: String },
   
   // Doctor-specific fields
   specialization: { type: String },
   licenseNumber: { type: String },
   experience: { type: Number },
   qualification: { type: String },
   
   // Account status
   accountStatus: { 
      type: String, 
      enum: ["Active", "Inactive", "Locked"], 
      default: "Active" 
   },
   
   // Verification status (for doctors)
   verificationStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending"
   },
   
   // Timestamps
   createdAt: { type: Date, default: Date.now },
   updatedAt: { type: Date, default: Date.now },
   lastLogin: { type: Date }
});

// Pre-save middleware
userSchema.pre('save', async function(next) {
   // Update timestamp
   this.updatedAt = Date.now();
   
   // Generate userID if not exists
   if (!this.userID) {
      const prefix = this.role === 'patient' ? 'P' : this.role === 'doctor' ? 'D' : 'A';
      const randomNum = Math.floor(100000 + Math.random() * 900000);
      this.userID = `${prefix}${randomNum}`;
   }
   
   // Split name into firstName and lastName if provided
   if (this.name && !this.firstName && !this.lastName) {
      const nameParts = this.name.split(' ');
      this.firstName = nameParts[0];
      this.lastName = nameParts.slice(1).join(' ') || nameParts[0];
   }
   
   // Hash password if modified
   if (this.isModified('password')) {
      this.password = await bcrypt.hash(this.password, 10);
   }
   
   next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
   return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);