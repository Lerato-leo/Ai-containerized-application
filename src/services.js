const axios = require("axios");
require("dotenv").config();

// Simple financial metric calculator
exports.calculateFinancialMetrics = (income, expenses) => {
  const totalIncome = income.reduce((sum, x) => sum + x, 0);
  const totalExpenses = expenses.reduce((sum, x) => sum + x, 0);

  return {
    totalIncome,
    totalExpenses,
    savingsRate: ((totalIncome - totalExpenses) / totalIncome) * 100,
    overspending: totalExpenses > totalIncome,
  };
};

// AI Recommendations
exports.aiFinancialInsights = async (metrics, goals) => {
  const prompt = `
  Analyze this financial profile:
  - Total Income: ${metrics.totalIncome}
  - Total Expenses: ${metrics.totalExpenses}
  - Savings Rate: ${metrics.savingsRate}%
  - Overspending: ${metrics.overspending}

  User goals: ${goals || "None provided"}

  Provide:
  - A short analysis
  - 3 personalized recommendations
  - One warning (if applicable)
  `;

  const response = await axios.post(
    process.env.AI_API_URL,
    {
      inputs: prompt,
    },
    {
      headers: { Authorization: `Bearer ${process.env.AI_API_KEY}` }
    }
  );

  return response.data.generated_text || response.data;
};
