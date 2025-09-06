const express = require("express");
const profileRouter = express.Router();
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");
const { validateProfileEditData } = require("../utils/validation");

// =======================
// ✅ Get profile API
// =======================
profileRouter.get("/view", userAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-__v");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("❌ View Profile Error:", err);
    res.status(500).json({ message: "Error fetching profile" });
  }
});

// =======================
// ✅ Edit profile API
// =======================
profileRouter.patch("/edit", userAuth, async (req, res) => {
  try {
    const updates = req.body || {};

    // ✅ Validate input
    const { error } = validateProfileEditData(updates);
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    // ✅ Apply updates safely
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-__v");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("❌ Edit Profile Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// =======================
// ✅ Delete profile API
// =======================
profileRouter.delete("/delete", userAuth, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.user._id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (err) {
    console.error("❌ Delete Profile Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = profileRouter;
