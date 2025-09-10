// src/routes/biometricRouter.js
const express = require("express");
const router = express.Router();
const User = require("../models/user");

/**
 * Helper: find user by id | emailId | phoneNumber
 */
async function findUser({ userId, emailId, phoneNumber }) {
  if (userId) return await User.findById(userId);
  if (emailId) return await User.findOne({ emailId });
  if (phoneNumber) return await User.findOne({ phoneNumber });
  return null;
}

/**
 * POST /api/biometric/enroll
 * body: { userId/emailId/phoneNumber, sensorModel, sensorTemplateId }
 * - Stores biometric metadata in user.biometric
 */
router.post("/biometric/enroll", async (req, res) => {
  try {
    const { userId, emailId, phoneNumber, sensorModel, sensorTemplateId } = req.body;
    if (!sensorModel || !sensorTemplateId) {
      return res.status(400).json({ success: false, message: "sensorModel and sensorTemplateId required" });
    }

    const user = await findUser({ userId, emailId, phoneNumber });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    user.biometric = {
      used: true,
      sensorModel,
      sensorTemplateId,
      enrolledAt: new Date(),
    };

    await user.save();
    return res.json({ success: true, message: "Biometric enrolled", userId: user._id });
  } catch (err) {
    console.error("biometric/enroll error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

/**
 * POST /api/biometric/verify
 * body: { userId/emailId/phoneNumber, sensorTemplateId }
 * - Compares provided templateId to user's stored templateId
 */
router.post("/biometric/verify", async (req, res) => {
  try {
    const { userId, emailId, phoneNumber, sensorTemplateId } = req.body;
    if (!sensorTemplateId) return res.status(400).json({ success: false, message: "sensorTemplateId required" });

    const user = await findUser({ userId, emailId, phoneNumber });
    if (!user || !user.biometric || !user.biometric.used) {
      return res.status(404).json({ success: false, message: "User or biometric enrollment not found" });
    }

    if (user.biometric.sensorTemplateId === sensorTemplateId) {
      return res.json({ success: true, message: "Biometric verified", userId: user._id });
    } else {
      return res.status(401).json({ success: false, message: "Biometric mismatch" });
    }
  } catch (err) {
    console.error("biometric/verify error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

/**
 * DELETE /api/biometric/delete
 * body: { userId/emailId/phoneNumber }
 * - Removes biometric metadata from DB (it does NOT delete template on the sensor)
 */
router.delete("/biometric/delete", async (req, res) => {
  try {
    const { userId, emailId, phoneNumber } = req.body;
    const user = await findUser({ userId, emailId, phoneNumber });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    user.biometric = { used: false };
    await user.save();
    return res.json({ success: true, message: "Biometric removed from DB (please also delete template on sensor if needed)" });
  } catch (err) {
    console.error("biometric/delete error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

/**
 * GET /api/biometric/user/:id
 * - Admin/dev helper: returns user's biometric metadata
 */
router.get("/biometric/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("fullName emailId phoneNumber biometric");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    return res.json({ success: true, user });
  } catch (err) {
    console.error("biometric/user error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
