// routes/authRouter.js
const express = require("express");
const authRouter = express.Router();
const { validateSignUpData } = require("../utils/validation.js");
const User = require("../models/user.js");
const bcrypt = require("bcrypt");
const { userAuth } = require("../middlewares/auth.js");

// Cookie options helper (dev vs prod)
const getCookieOptions = () => {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProd, // true in production (HTTPS), false in local dev
    sameSite: isProd ? "None" : "Lax", // None required for cross-site in prod
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days (match JWT expiry)
  };
};

// SIGNUP
authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({ firstName, lastName, emailId, password: passwordHash });
    const savedUser = await user.save();

    const token = await savedUser.getJWT();
    res.cookie("token", token, getCookieOptions());

    res.status(201).json({
      success: true,
      message: "User added successfully",
      user: {
        _id: savedUser._id,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        emailId: savedUser.emailId,
      },
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message || "Error saving the user" });
  }
});

// LOGIN
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId });
    if (!user) throw new Error("Invalid credentials");

    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) throw new Error("Incorrect Password");

    const token = await user.getJWT();
    res.cookie("token", token, getCookieOptions());

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        emailId: user.emailId,
      },
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message || "Error logging in" });
  }
});

// GET CURRENT USER (protected)
authRouter.get("/user", userAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("firstName lastName emailId");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const isAdmin = user.emailId === process.env.ADMIN_EMAIL;

    res.json({
      success: true,
      fullName: `${user.firstName} ${user.lastName || ""}`.trim(),
      emailId: user.emailId,
      profileImage: null,
      isAdmin,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch user" });
  }
});

// LOGOUT
authRouter.post("/logout", (req, res) => {
  const isProd = process.env.NODE_ENV === "production";
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "None" : "Lax",
    path: "/",
  });

  res.json({ success: true, message: "Logout successful" });
});

module.exports = authRouter;
