import express from "express";
import Sensor from "../models/Sensor.js";

const router = express.Router();

// ✅ Save sensor data (ESP से आता है)
router.post("/", async (req, res) => {
  try {
    const data = {
      soilTemp: req.body.soilTemp,
      soilMoist: req.body.soilMoist,
      soilPH: req.body.soilPH,
      nitrogen: req.body.nitrogen,
      phosphorus: req.body.phosphorus,
      potassium: req.body.potassium,
      bmpTemp: req.body.bmpTemp,
      pressure: req.body.pressure,
      altitude: req.body.altitude,
      ds18b20Temp: req.body.ds18b20Temp,
      rain: req.body.rain,
      ldr: req.body.ldr,
      button: req.body.button,
      voltage: req.body.voltage,
    };

    const sensor = new Sensor(data);
    await sensor.save();

    console.log("📥 Sensor Data:", data);
    res.status(201).json({ message: "Data saved", data });
  } catch (err) {
    console.error("❌ Error saving sensor data:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Get latest sensor data (Frontend के लिए)
router.get("/latest", async (req, res) => {
  try {
    const latest = await Sensor.findOne().sort({ createdAt: -1 }); // ✅ latest doc
    if (!latest) {
      return res.json({ success: false, message: "No data found" });
    }
    res.json({ success: true, data: latest });
  } catch (err) {
    console.error("❌ Error fetching latest sensor data:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

export default router;
