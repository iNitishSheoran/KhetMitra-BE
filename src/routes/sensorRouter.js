import express from "express";
import Sensor from "../models/Sensor.js";

const router = express.Router();

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

export default router;
