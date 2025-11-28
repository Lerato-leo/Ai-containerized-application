const { aiFinancialInsights, calculateFinancialMetrics } = require("./services");
const db = require("./database");

exports.analyzeFinancialData = async (req, res, next) => {
  try {
    const { income, expenses, goals, userId, userName, saveResult } = req.body;

    // Validate input
    if (!income || !expenses) {
      return res.status(400).json({ error: "Income and expenses are required" });
    }

    // Calculate metrics
    const metrics = calculateFinancialMetrics(income, expenses);

    // Get AI advice
    const aiAdvice = await aiFinancialInsights(metrics, goals);

    // Prepare response
    const response = { success: true, metrics, aiAdvice };

    // Save if requested
    if (saveResult && userId) {
      const result = db.saveResult({
        userId,
        userName: userName || 'Anonymous',
        income: metrics.incomeItems,
        expenses: metrics.expenseItems,
        goals,
        metrics: {
          totalIncome: metrics.totalIncome,
          totalExpenses: metrics.totalExpenses,
          actualMonthlySavings: metrics.actualMonthlySavings,
          savingsRate: metrics.savingsRate,
          overspending: metrics.overspending,
        },
        aiAdvice,
      });
      response.resultId = result.id;
      response.saved = true;
    }

    res.json(response);
  } catch (err) {
    next(err);
  }
};

exports.getSummary = (req, res) => {
  try {
    const { income, expenses } = req.body;

    if (!income || !expenses) {
      return res.status(400).json({ error: "Income and expenses are required" });
    }

    // Handle both array and object formats
    const incomeArray = Array.isArray(income) ? income : [income];
    const expenseArray = Array.isArray(expenses) ? expenses : [expenses];

    const totalIncome = incomeArray.reduce((a, b) => {
      if (typeof b === 'object') return a + (b.amount || 0);
      return a + (typeof b === 'number' ? b : parseFloat(b) || 0);
    }, 0);

    const totalExpenses = expenseArray.reduce((a, b) => {
      if (typeof b === 'object') return a + (b.amount || 0);
      return a + (typeof b === 'number' ? b : parseFloat(b) || 0);
    }, 0);

    res.json({
      success: true,
      totalIncome: parseFloat(totalIncome.toFixed(2)),
      totalExpenses: parseFloat(totalExpenses.toFixed(2)),
      balance: parseFloat((totalIncome - totalExpenses).toFixed(2))
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to calculate summary', details: err.message });
  }
};

exports.getHealthReport = async (req, res, next) => {
  try {
    const { income, expenses, goals } = req.body;

    if (!income || !expenses) {
      return res.status(400).json({ error: "Income and expenses are required" });
    }

    const metrics = calculateFinancialMetrics(income, expenses);

    // Simple health score calculation
    let score = 50;

    // Savings rate impact (0-40 points)
    if (metrics.savingsRate >= 30) score += 40;
    else if (metrics.savingsRate >= 20) score += 30;
    else if (metrics.savingsRate >= 10) score += 20;
    else if (metrics.savingsRate >= 0) score += 10;
    else score -= 20;

    // Income diversity (0-10 points)
    const sources = income.length;
    if (sources >= 3) score += 10;
    else if (sources === 2) score += 5;

    const healthScore = Math.max(0, Math.min(100, score));

    // Status based on score
    const getStatus = (score) => {
      if (score >= 80) return { status: "Excellent", color: "green" };
      if (score >= 60) return { status: "Good", color: "blue" };
      if (score >= 40) return { status: "Fair", color: "yellow" };
      return { status: "Needs Improvement", color: "red" };
    };

    const { status, color } = getStatus(healthScore);

    const monthlyBalance = metrics.totalIncome - metrics.totalExpenses;
    const yearlyProjection = monthlyBalance * 12;

    res.json({
      success: true,
      healthScore,
      status,
      statusColor: color,
      metrics,
      insights: {
        monthlyBalance: monthlyBalance,
        yearlyProjection: yearlyProjection,
        incomeSourceCount: sources,
        expenseCount: expenses.length,
        averageExpense: (metrics.totalExpenses / expenses.length).toFixed(2),
        emergencyFundTarget: (metrics.totalExpenses * 6).toFixed(2)
      }
    });

  } catch (err) {
    next(err);
  }
};

// User Management
exports.createUser = (req, res, next) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    // Check if user already exists
    const existingUser = db.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: "User with this email already exists. Please login instead." });
    }

    const user = db.createUser({ name, email });
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

exports.loginUser = (req, res, next) => {
  try {
    console.log('Login attempt with email:', req.body.email);
    const { email } = req.body;

    if (!email) {
      console.log('Login failed: No email provided');
      return res.status(400).json({ error: "Email is required" });
    }

    const user = db.getUserByEmail(email);
    console.log('User lookup result:', user ? 'Found' : 'Not found');

    if (!user) {
      return res.status(404).json({ error: "No account found with this email. Please register first." });
    }

    console.log('Login successful for user:', user.name);
    res.json({ success: true, user });
  } catch (err) {
    console.error('Login error:', err);
    next(err);
  }
};

exports.getUsers = (req, res, next) => {
  try {
    const users = db.getAllUsers();
    res.json({ success: true, users });
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = (req, res, next) => {
  try {
    const { userId } = req.params;
    const deleted = db.deleteUser(userId);

    if (deleted) {
      res.json({ success: true, message: "User and all results deleted" });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    next(err);
  }
};

// Result Management
exports.getUserResults = (req, res, next) => {
  try {
    const { userId } = req.params;
    const results = db.getUserResults(userId);
    res.json({ success: true, results, count: results.length });
  } catch (err) {
    next(err);
  }
};

exports.getResult = (req, res, next) => {
  try {
    const { resultId } = req.params;
    const result = db.getResult(resultId);

    if (result) {
      res.json({ success: true, result });
    } else {
      res.status(404).json({ error: "Result not found" });
    }
  } catch (err) {
    next(err);
  }
};

exports.deleteResult = (req, res, next) => {
  try {
    const { resultId } = req.params;
    const deleted = db.deleteResult(resultId);

    if (deleted) {
      res.json({ success: true, message: "Result deleted" });
    } else {
      res.status(404).json({ error: "Result not found" });
    }
  } catch (err) {
    next(err);
  }
};

exports.getAllResults = (req, res, next) => {
  try {
    const results = db.getAllResults();
    res.json({ success: true, results, count: results.length });
  } catch (err) {
    next(err);
  }
};
