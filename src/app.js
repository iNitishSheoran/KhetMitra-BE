// app.js
const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
require("dotenv").config();

app.use(
  require("cors")({
    origin: [
      "http://localhost:5173", // dev frontend (vite)
      // add your deployed FE domain in production e.g. "https://your-fe.com"
    ],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

// routes
const authRouter = require("./routes/authRouter");
app.use("/", authRouter);

const authCheckRouter = require("./routes/authCheckRouter");
app.use("/auth", authCheckRouter);

const helpRouter = require("./routes/helpRouter");
app.use("/help", helpRouter);

const cropRouter = require("./routes/cropRouter");
app.use("/crop", cropRouter);

const cultivationRouter = require("./routes/cultivationRouter");
app.use("/cultivation", cultivationRouter);

const profileRouter = require("./routes/profileRouter");
app.use("/profile", profileRouter);

// ✅ new sensor router
const sensorRouter = require("./routes/sensorRouter");
app.use("/sensor", sensorRouter);

const PORT = process.env.PORT || 2713;
connectDB()
  .then(() => {
    console.log("Database connected");
    app.listen(PORT, "0.0.0.0", () =>
      console.log(`Server listening on ${PORT}`)
    );
  })
  .catch((err) => console.error("DB connection failed:", err));
