require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const { connectDB } = require("./utils/db");

const app = express();

// Trust first proxy
app.set('trust proxy', 1);

// Middleware
app.use(cors({
  origin: "http://localhost:4444", // Frontend development URL
  withCredentials: true,               // Allow cookies to be sent
}));

app.use(bodyParser.json({ limit: "5mb" }));

// Database Connection
connectDB();

// Routes
app.use("/auth", authRoutes);
app.use("/auth/profile", profileRoutes);

module.exports = app;