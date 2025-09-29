import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import sensorRouter from "./routes/sensorRouter.js";

const app = express();

// ✅ CORS config
app.use(
  cors({
    origin: ["https://khetmitra.live", "http://localhost:5173"], // allow frontend
    credentials: true, // if you use cookies/tokens
  })
);

app.use(express.json());

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
