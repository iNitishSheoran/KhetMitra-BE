import express from "express";
import mongoose from "mongoose";
import cors from "cors"; // ✅ CORS import
import sensorRouter from "./routes/sensorRouter.js";

const app = express();

// ✅ Middleware
app.use(express.json());
app.use(cors()); // ✅ Allow frontend requests

// ✅ MongoDB connect
mongoose.connect("mongodb://127.0.0.1:27017/sensors");
mongoose.connection.on("connected", () => {
  console.log("✅ Database connected");
});
mongoose.connection.on("error", (err) => {
  console.error("❌ Database error:", err);
});

// ✅ Routes
app.use("/sensor", sensorRouter);

const PORT = 2713;
app.listen(PORT, () => {
  console.log(`🚀 Server listening on ${PORT}`);
});

export default app;
