const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { validateUser, User } = require("../models/User");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../middlewares/verifyToken");

// Update User
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  const validationResult = validateUser(req.body);
  if (validationResult) {
    return res.status(400).json({ message: validationResult });
  }

  try {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          email: req.body.email,
          username: req.body.username,
          password: req.body.password,
          isAdmin: req.body.isAdmin,
        },
      },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ message: "Server error during update." });
  }
});

// Get All Users (admin only)
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (err) {
    console.error("Get Users Error:", err);
    res.status(500).json({ message: "Failed to retrieve users." });
  }
});

// Get User by ID
router.get("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Get User Error:", error);

    // Optional: handle invalid ObjectId
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    res.status(500).json({
      message: "Something went wrong while fetching the user",
    });
  }
});

// Delete User
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const check = await User.findById(req.params.id);
    if (check) {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "User deleted" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Something went wrong while deleting the user" });
  }
});

module.exports = router;
