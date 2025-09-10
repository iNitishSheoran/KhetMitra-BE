// app.js
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors({ origin: "*", credentials: true })); // allow ESP to POST
app.use(bodyParser.json());

// ===== MongoDB connection =====
mongoose.connect("mongodb://127.0.0.1:27017/fingerprintDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected ✅"))
.catch((err) => console.error("MongoDB connection failed:", err));

// ===== Biometric schema =====
const BiometricSchema = new mongoose.Schema({
  name: String,
  email: String,
  biometric: Boolean,
  sensorModel: String,
  sensorTemplateId: Number,
  createdAt: { type: Date, default: Date.now }
});

const BiometricUser = mongoose.model("BiometricUser", BiometricSchema);

// ===== API route for ESP =====
app.post("/api/signup-biometric", async (req, res) => {
  try {
    const { name, email, biometric, sensorModel, sensorTemplateId } = req.body;

    if (!name || !email || sensorTemplateId === undefined)
      return res.status(400).json({ success: false, message: "Missing fields" });

    const user = new BiometricUser({
      name,
      email,
      biometric,
      sensorModel,
      sensorTemplateId,
    });

    await user.save();
    res.status(201).json({ success: true, id: user._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ===== Start server =====
const PORT = 2713;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server running on http://0.0.0.0:${PORT}`)
);
