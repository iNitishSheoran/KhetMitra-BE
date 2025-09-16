import express from "express";
import mongoose from "mongoose";
import sensorRouter from "./routes/sensorRouter.js";

const app = express();

// ✅ Middleware
app.use(express.json());

// ✅ MongoDB connect
mongoose.connect("mongodb://127.0.0.1:27017/sensors", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
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
