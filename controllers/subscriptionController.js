// controllers/subscriptionController.js

const Subscription = require("../models/Subscription");

const verifyPurchase = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      productId,
      receiptData,
     
    } = req.body;

    if (!productId || !receiptData) {
      return res.status(400).json({
        success: false,
        message: "Missing purchase data",
      });
    }

    const purchaseDate = new Date();
    let expiresAt = new Date();

    if (productId === "com.mothertongue.monthly") {
      expiresAt.setMonth(expiresAt.getMonth() + 1);
    }

    if (productId === "com.mothertongue.yearly") {
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    }

    const subscription = await Subscription.findOneAndUpdate(
      { user: userId },
      {
        user: userId,
        productId,
        // transactionId,
        receiptData,
        purchaseDate,
        expiresAt,
        active: true,
      },
      {
        upsert: true,
        new: true,
      }
    );

    return res.json({
      success: true,
      active: true,
      expiresAt,
      subscription,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMyPlan = async (req, res) => {
  try {
    const userId = req.user.id;

    const subscription = await Subscription.findOne({
      user: userId,
    });

    if (!subscription) {
      return res.json({
        active: false,
      });
    }

    const active = subscription.expiresAt > new Date();

    return res.json({
      active,
    //   productId: subscription.productId,
      expiresAt: subscription.expiresAt,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  verifyPurchase,
  getMyPlan,
};