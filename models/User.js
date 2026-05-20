const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  resetPasswordToken: String,
resetPasswordExpires: Date,
  dob: {
    type: Date,
  },

  gender: {
    type: String,
    enum: ["male", "female", "other"], 
  },
  role: { type: String, enum: ["user", "admin"], default: "user" },
plan: {
  type: String,
  enum: ["free", "premium"],
  default: "free"
},
});

module.exports = mongoose.model("User", userSchema);