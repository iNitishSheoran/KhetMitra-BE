// routes/sensorRouter.js
const express = require("express");
const router = express.Router();

let lastMoisture = 0; // store latest value

// GET latest moisture
router.get("/moisture", (req, res) => {
  res.json({ moisture: lastMoisture });
});

// POST new moisture (from ESP32)
router.post("/moisture", (req, res) => {
  const { moisture } = req.body;
  if (typeof moisture === "number") {
    lastMoisture = moisture;
    return res.json({ success: true, moisture });
  }
  res.status(400).json({ success: false, message: "Invalid data" });
});

module.exports = router;
