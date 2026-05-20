const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");


// GET ALL USERS (admin only ideally)
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password -__v");

    res.json(users);

  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email,dob, gender, password } = req.body;

    // ✅ check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      dob,
      gender,
      password: hashed
    });

    // ✅ don't send password in response
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
       dob: user.dob,
      gender: user.gender,
      role: user.role
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server error" });  

  }
});
// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ msg: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ msg: "Wrong password" });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET
  );

  res.json({ token, role: user.role });
});

// profile

router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    res.json(user);

  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});


// Forgot Password
router.post("/forgot-password", async (req, res) => {
  try {

    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        msg: "User not found",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Save token + expiry
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

    await user.save();

    // Reset URL
    const resetUrl = `https://mothertonguetranslator.com/reset-password/${resetToken}`;

    // Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset",
      html: `
        <h2>Reset Password</h2>
        <p>Click below link to reset password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
      `,
    });

    res.json({
      msg: "Reset email sent successfully",
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      msg: "Server error",
    });
  }
});

// Reset Password
router.post("/reset-password/:token", async (req, res) => {

  try {

    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        msg: "Invalid or expired token",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;

    // Clear reset fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({
      msg: "Password reset successful",
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      msg: "Server error",
    });
  }
});

module.exports = router;