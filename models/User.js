const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
// User Schema
const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      minlength: 5, // ✅ تصحيح
      maxlength: 100,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 3, // ✅ تصحيح
      maxlength: 200,
    },
    password: {
      type: String,
      trim: true,
      minlength: 6,
      maxlength: 100,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// generate token
UserSchema.methods.generateToken = function () {
  return jwt.sign(
    { id: this._id, isAdmin: this.isAdmin },
    process.env.JWT_SECRET, // ✅ Corrected key name
    { expiresIn: "7d" }
  );
};
const User = mongoose.model("User", UserSchema);

function validateUser(user) {
  const errors = {};

  // username
  if ("username" in user) {
    if (typeof user.username !== "string" || user.username.trim().length < 3) {
      errors.username = "Username must be a string with at least 3 characters.";
    }
  }

  // email
  if ("email" in user) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (
      typeof user.email !== "string" ||
      user.email.trim().length < 5 ||
      !emailRegex.test(user.email)
    ) {
      errors.email = "Email must be valid and at least 5 characters.";
    }
  }

  // password
  if ("password" in user) {
    if (typeof user.password !== "string" || user.password.trim().length < 6) {
      errors.password = "Password must be at least 6 characters long.";
    }
  } else {
    errors.password = "password must be";
  }

  return Object.keys(errors).length > 0 ? errors : null;
}

module.exports = { User, validateUser };
