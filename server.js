const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const routes = require("./src/route");

const app = express();

app.use(cors());
app.use(express.json());

// API Routes
app.use("/api", routes);

// Serve static files from React app
app.use(express.static(path.join(__dirname, "public")));

// Health check for API
app.get("/health", (req, res) => {
  res.send({ message: "AI Financial Wellness Coach Backend Running" });
});

// Serve React app for all other routes (must be after API routes)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Error Handler (last middleware)
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(err.status || 500).json({
    error: true,
    message: err.message || "Internal Server Error"
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
