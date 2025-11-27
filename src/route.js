const express = require("express");
const router = express.Router();
const { analyzeFinancialData, getSummary } = require("./controllers");

// Endpoint: Analyze user's financial habits
router.post("/analyze", analyzeFinancialData);

// Simple endpoint: financial summary
router.post("/summary", getSummary);

module.exports = router;
