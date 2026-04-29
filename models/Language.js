const mongoose = require("mongoose");

const languageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true, // ✅ prevents case duplicates
    },

    code: {
      type: String,
      required: true,
      unique: true, // ✅ DB-level protection
      lowercase: true,
      trim: true,
    },

    locale: {
      type: String,
      required: true,
      trim: true,
    },

    flag: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Language", languageSchema);