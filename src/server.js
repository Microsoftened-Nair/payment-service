require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const { authenticateToken } = require("./middleware/auth");
const paymentRoutes = require("./routes/payment");

const app = express();

// Standard middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Health probe endpoint (unauthenticated)
app.get("/health", (req, res) => {
  res.json({
    status: "HEALTHY",
    service: "payment-service",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// Protected payment endpoints
app.use("/api/payments", authenticateToken, paymentRoutes);

module.exports = app;
