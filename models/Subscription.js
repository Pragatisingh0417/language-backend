const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    productId: {
      type: String,
      required: true,
    },

    planName: String,

    platform: {
      type: String,
      default: "ios",
    },

    transactionId: String,

    receiptData: String,

    active: {
      type: Boolean,
      default: true,
    },

    purchaseDate: Date,

    expiresAt: Date,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Subscription",
  subscriptionSchema
);