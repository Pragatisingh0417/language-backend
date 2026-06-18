// routes/subscriptionRoutes.js

const router = require("express").Router();

const {
  verifyPurchase,
  getMyPlan,
} = require("../controllers/subscriptionController");

const auth = require("../middleware/auth");

router.post("/verify", auth, verifyPurchase);

router.get("/my-plan", auth, getMyPlan);

module.exports = router;