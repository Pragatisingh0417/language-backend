// controllers/subscriptionController.js

const Subscription = require("../models/Subscription");

const verifyPurchase = async (req, res) => {
  try {
    const userId = req.user.id;

  const { receiptData } = req.body;

    if (!receiptData) { return res.status(400).json({ success: false, message: "Missing purchase data", }); }

    // const purchaseDate = new Date();


let expiresAt = new Date();
expiresAt.setMonth(expiresAt.getMonth() + 1);
   

    const subscription = await Subscription.findOneAndUpdate(
      { user: userId },
      {
        user: userId,
        receiptData,
        // purchaseDate,
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
      isPremium: true,
      expiresAt,
     
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
        isPremium: false,
      });
    }
console.log("expiresAt:", subscription.expiresAt);
console.log("now:", new Date());
const isPremium = subscription.expiresAt > new Date();

    return res.json({
      isPremium,
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