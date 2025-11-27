const { aiFinancialInsights, calculateFinancialMetrics } = require("./services");

exports.analyzeFinancialData = async (req, res, next) => {
  try {
    const { income, expenses, goals } = req.body;

    if (!income || !expenses) {
      return res.status(400).json({ error: "Income and expenses are required" });
    }

    // 1. Calculate financial health metrics
    const metrics = calculateFinancialMetrics(income, expenses);

    // 2. Ask AI for recommendations based on metrics
    const aiResponse = await aiFinancialInsights(metrics, goals);

    res.json({
      success: true,
      metrics,
      aiAdvice: aiResponse,
    });

  } catch (err) {
    next(err);
  }
};

exports.getSummary = (req, res) => {
  const { income, expenses } = req.body;

  const totalIncome = income.reduce((a, b) => a + b, 0);
  const totalExpenses = expenses.reduce((a, b) => a + b, 0);

  res.json({
    totalIncome,
    totalExpenses,
    balance: totalIncome - totalExpenses
  });
};
