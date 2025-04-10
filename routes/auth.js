const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { User, validateUser } = require("../models/User");

/**
 * @desc    Register New User
 * @route   POST /api/auth/register
 * @access  Public
 */
router.post("/register", async (req, res) => {
  const validationError = validateUser(req.body);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "This user is already registered" });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = new User({
      email: req.body.email,
      username: req.body.username,
      password: hashedPassword,
      isAdmin: req.body.isAdmin || false,
    });

    const savedUser = await user.save();
    const { password, ...userData } = savedUser._doc;

    // Create JWT token
    const token = user.generateToken();

    res.status(201).json({ user: userData, token });
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ message: "Server error during registration." });
  }
});

/**
 * @desc    Login User
 * @route   POST /api/auth/login
 * @access  Public
 */
router.post("/login", async (req, res) => {
  const validationError = validateUser(req.body);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const { password, ...userData } = user._doc;

    const token = user.generateToken();

    res.status(200).json({
      ...userData,
      token,
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error during login." });
  }
});

module.exports = router;
