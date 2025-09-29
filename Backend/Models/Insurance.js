const mongoose = require("mongoose");

const insuranceSchema = new mongoose.Schema({
    insuranceID: { type: String, required: true, unique: true},
    userID: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    provider_name: { type: String, required: true },
    policy_no: { type: String, required: true, unique: true },
    coverage_details: { type: String },
    valid_till: { type: Date}
});

module.exports = mongoose.model("Insurance", insuranceSchema);