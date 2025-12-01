const express = require("express");
const router = express.Router();
const { 
  analyzeFinancialData, 
  getSummary, 
  getHealthReport,
  createUser,
  loginUser,
  getUsers,
  deleteUser,
  getUserResults,
  getResult,
  deleteResult,
  getAllResults
} = require("./controllers");

// Financial Analysis Endpoints
router.post("/analyze", analyzeFinancialData);
router.post("/summary", getSummary);
router.post("/health-report", getHealthReport);

// User Management Endpoints
router.post("/users", createUser);
router.post("/users/login", loginUser);
router.get("/users", getUsers);
router.delete("/users/:userId", deleteUser);

// Result Management Endpoints
router.get("/users/:userId/results", getUserResults);
router.get("/results", getAllResults);
router.get("/results/:resultId", getResult);
router.delete("/results/:resultId", deleteResult);

module.exports = router;
