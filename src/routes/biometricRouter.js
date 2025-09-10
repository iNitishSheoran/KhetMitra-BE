const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// ====== User/biometric schema ======
const BiometricSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  biometric: { type: Boolean, default: true },
  sensorModel: { type: String },
  sensorTemplateId: { type: Number },
  createdAt: { type: Date, default: Date.now },
});

const BiometricUser = mongoose.model("BiometricUser", BiometricSchema);

// ====== POST /api/signup-biometric ======
router.post("/signup-biometric", async (req, res) => {
  try {
    const { name, email, biometric, sensorModel, sensorTemplateId } = req.body;

    // Simple validation
    if (!name || !email || sensorTemplateId === undefined) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    // Save to DB
    const user = new BiometricUser({
      name,
      email,
      biometric,
      sensorModel,
      sensorTemplateId,
    });

    await user.save();

    return res.status(201).json({ success: true, id: user._id });
  } catch (err) {
    console.error("Error saving biometric user:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
