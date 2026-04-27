const mongoose = require("mongoose");

const languageSchema = new mongoose.Schema({
  name: String,
  code: String,
   locale: String,   // ✅ ADD THIS
  flag: String
});

module.exports = mongoose.model("Language", languageSchema);
