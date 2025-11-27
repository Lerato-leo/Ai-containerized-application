const express = require("express");
require("dotenv").config();
const routes = require("./src/routes");

const app = express();
app.use(express.json());

// Routes
app.use("/api", routes);

// Health check
app.get("/", (req, res) => {
  res.send({ message: "AI Financial Wellness Coach Backend Running" });
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
