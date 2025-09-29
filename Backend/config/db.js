//password : Tgb0DBrCTAiG1ROc
//username : eviyadesilva9_db_user

const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://eviyadesilva9_db_user:Tgb0DBrCTAiG1ROc@cluster0.gupb648.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
    console.log("Connected Successfully ✅");
  } catch (err) {
    console.error("Error connecting to DB ❌", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;