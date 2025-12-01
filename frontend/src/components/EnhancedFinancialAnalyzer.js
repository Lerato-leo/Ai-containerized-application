import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './EnhancedFinancialAnalyzer.css';

const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Business', 'Investments', 'Rental', 'Other'];
const EXPENSE_CATEGORIES = ['Housing', 'Food', 'Transportation', 'Healthcare', 'Entertainment', 'Utilities', 'Debt', 'Savings', 'Other'];
const GOAL_CATEGORIES = ['Emergency Fund', 'Retirement', 'House Purchase', 'Debt Payoff', 'Education', 'Travel', 'Investment', 'Other'];

function EnhancedFinancialAnalyzer() {
  const [userId, setUserId] = useState(localStorage.getItem('userId') || '');
  const [userName, setUserName] = useState(localStorage.getItem('userName') || '');
  const [email, setEmail] = useState('');
  const [showUserSetup, setShowUserSetup] = useState(!userId);
  const [isLoginMode, setIsLoginMode] = useState(true);

  const [incomeInputs, setIncomeInputs] = useState([{ name: '', category: 'Salary', amount: '' }]);
  const [expenseInputs, setExpenseInputs] = useState([{ name: '', category: 'Housing', amount: '' }]);
  const [goals, setGoals] = useState([{ category: 'Emergency Fund', description: '' }]);

  const [result, setResult] = useState(null);
  const [userResults, setUserResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  const loadUserResults = useCallback(async () => {
    try {
      if (!userId) return;
      const response = await axios.get(`/api/users/${userId}/results`);
      setUserResults(response.data.results || []);
    } catch (err) {
      console.error('Failed to load results:', err);
      setUserResults([]);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      loadUserResults();
    }
  }, [userId, loadUserResults]);

  const loginUser = async () => {
    try {
      if (!email.trim()) {
        setError('Email is required');
        return;
      }
      const response = await axios.post('/api/users/login', { email });
      const user = response.data.user;
      setUserId(user.id);
      setUserName(user.name);
      localStorage.setItem('userId', user.id);
      localStorage.setItem('userName', user.name);
      setShowUserSetup(false);
      setError(null);
      loadUserResults();
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.error || 'Failed to login');
    }
  };

  const createUser = async () => {
    try {
      if (!userName.trim() || !email.trim()) {
        setError('Name and email are required');
        return;
      }
      const response = await axios.post('/api/users', { name: userName, email });
      const newUser = response.data.user;
      setUserId(newUser.id);
      setUserName(newUser.name);
      localStorage.setItem('userId', newUser.id);
      localStorage.setItem('userName', newUser.name);
      setShowUserSetup(false);
      setError(null);
      loadUserResults();
    } catch (err) {
      console.error('Create user error:', err);
      setError(err.response?.data?.error || 'Failed to create user profile');
    }
  };

  const loadResult = async (result) => {
    setIncomeInputs(result.income || []);
    setExpenseInputs(result.expenses || []);
    setResult(result);
    setShowHistory(false);
  };

  const deleteResult = async (resultId) => {
    try {
      await axios.delete(`/api/results/${resultId}`);
      setUserResults(userResults.filter(r => r.id !== resultId));
      setError(null);
    } catch (err) {
      setError('Failed to delete result');
    }
  };

  const addIncomeField = () => {
    setIncomeInputs([...incomeInputs, { name: '', category: 'Salary', amount: '' }]);
  };

  const addExpenseField = () => {
    setExpenseInputs([...expenseInputs, { name: '', category: 'Housing', amount: '' }]);
  };

  const addGoalField = () => {
    setGoals([...goals, { category: 'Other', description: '' }]);
  };

  const handleIncomeChange = (index, field, value) => {
    const newInputs = [...incomeInputs];
    newInputs[index][field] = value;
    setIncomeInputs(newInputs);
  };

  const handleExpenseChange = (index, field, value) => {
    const newInputs = [...expenseInputs];
    newInputs[index][field] = value;
    setExpenseInputs(newInputs);
  };

  const handleGoalChange = (index, field, value) => {
    const newGoals = [...goals];
    newGoals[index][field] = value;
    setGoals(newGoals);
  };

  const removeIncomeField = (index) => {
    const newInputs = incomeInputs.filter((_, i) => i !== index);
    setIncomeInputs(newInputs.length ? newInputs : [{ name: '', category: 'Salary', amount: '' }]);
  };

  const removeExpenseField = (index) => {
    const newInputs = expenseInputs.filter((_, i) => i !== index);
    setExpenseInputs(newInputs.length ? newInputs : [{ name: '', category: 'Housing', amount: '' }]);
  };

  const removeGoalField = (index) => {
    const newGoals = goals.filter((_, i) => i !== index);
    setGoals(newGoals.length ? newGoals : [{ category: 'Emergency Fund', description: '' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const income = incomeInputs
        .filter(item => item.amount !== '')
        .map(item => ({
          name: item.name || 'Unnamed',
          category: item.category,
          amount: parseFloat(item.amount)
        }));

      const expenses = expenseInputs
        .filter(item => item.amount !== '')
        .map(item => ({
          name: item.name || 'Unnamed',
          category: item.category,
          amount: parseFloat(item.amount)
        }));

      const goalsData = goals
        .filter(g => g.description)
        .map(g => `${g.category}: ${g.description}`)
        .join('; ');

      if (income.length === 0 || expenses.length === 0) {
        throw new Error('Please enter at least one income and one expense');
      }

      const response = await axios.post('/api/analyze', {
        income,
        expenses,
        goals: goalsData,
        userId: userId || undefined,
        userName,
        saveResult: !!userId
      });

      setResult(response.data);
      if (userId) {
        loadUserResults();
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to analyze financial data');
    } finally {
      setLoading(false);
    }
  };

  if (showUserSetup) {
    return (
      <div className="user-setup">
        <h2>{isLoginMode ? 'Welcome Back' : 'Create Your Profile'}</h2>
        <p>{isLoginMode ? 'Login to access your saved financial analyses' : 'Set up your profile to save and track your financial analyses'}</p>

        {error && <div className="error-message">{error}</div>}

        <div className="form-section">
          {!isLoginMode && (
            <input
              type="text"
              placeholder="Your Name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            onClick={isLoginMode ? loginUser : createUser}
            className="submit-btn"
            disabled={isLoginMode ? !email : (!userName || !email)}
          >
            {isLoginMode ? 'Login' : 'Create Profile'}
          </button>

          <div className="auth-toggle">
            <button onClick={() => { setIsLoginMode(!isLoginMode); setError(null); }} className="link-btn">
              {isLoginMode ? "Don't have an account? Register" : 'Already have an account? Login'}
            </button>
          </div>

          <button onClick={() => setShowUserSetup(false)} className="link-btn">
            Skip for now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="enhanced-financial-analyzer">
      <div className="user-bar">
        {userId ? (
          <>
            <span>{userName}</span>
            <button onClick={() => setShowHistory(!showHistory)} className="history-btn">
              History ({userResults.length})
            </button>
          </>
        ) : (
          <button onClick={() => setShowUserSetup(true)} className="link-btn">
            Create Profile to Save Results
          </button>
        )}
      </div>

      {showHistory && userId && (
        <div className="history-panel">
          <h3>Your Financial History</h3>
          {userResults.length === 0 ? (
            <p>No saved results yet</p>
          ) : (
            <div className="history-list">
              {userResults.map((result) => (
                <div key={result.id} className="history-item">
                  <div className="history-info">
                    <strong>{new Date(result.date).toLocaleDateString()}</strong>
                    <span>Savings: {result.metrics.savingsRate.toFixed(1)}%</span>
                  </div>
                  <div className="history-actions">
                    <button onClick={() => loadResult(result)} className="load-btn">Load</button>
                    <button onClick={() => deleteResult(result.id)} className="delete-btn">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <h2>AI-Powered Financial Analysis</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Income Sources</h3>
          {incomeInputs.map((input, index) => (
            <div key={index} className="input-row">
              <input
                type="text"
                placeholder="Name (e.g., Monthly Salary)"
                value={input.name}
                onChange={(e) => handleIncomeChange(index, 'name', e.target.value)}
              />
              <select
                value={input.category}
                onChange={(e) => handleIncomeChange(index, 'category', e.target.value)}
              >
                {INCOME_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <input
                type="number"
                step="0.01"
                placeholder="Amount (Rands)"
                value={input.amount}
                onChange={(e) => handleIncomeChange(index, 'amount', e.target.value)}
                required={index === 0}
              />
              {incomeInputs.length > 1 && (
                <button type="button" onClick={() => removeIncomeField(index)} className="remove-btn">Remove</button>
              )}
            </div>
          ))}
          <button type="button" onClick={addIncomeField} className="add-btn">Add Income Source</button>
        </div>

        <div className="form-section">
          <h3>Expenses</h3>
          {expenseInputs.map((input, index) => (
            <div key={index} className="input-row">
              <input
                type="text"
                placeholder="Name (e.g., Rent, Groceries)"
                value={input.name}
                onChange={(e) => handleExpenseChange(index, 'name', e.target.value)}
              />
              <select
                value={input.category}
                onChange={(e) => handleExpenseChange(index, 'category', e.target.value)}
              >
                {EXPENSE_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <input
                type="number"
                step="0.01"
                placeholder="Amount (Rands)"
                value={input.amount}
                onChange={(e) => handleExpenseChange(index, 'amount', e.target.value)}
                required={index === 0}
              />
              {expenseInputs.length > 1 && (
                <button type="button" onClick={() => removeExpenseField(index)} className="remove-btn">Remove</button>
              )}
            </div>
          ))}
          <button type="button" onClick={addExpenseField} className="add-btn">Add Expense</button>
        </div>

        <div className="form-section">
          <h3>Financial Goals</h3>
          {goals.map((goal, index) => (
            <div key={index} className="input-row">
              <select
                value={goal.category}
                onChange={(e) => handleGoalChange(index, 'category', e.target.value)}
              >
                {GOAL_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <input
                type="text"
                placeholder="Description (e.g., Save R10,000 for emergency fund)"
                value={goal.description}
                onChange={(e) => handleGoalChange(index, 'description', e.target.value)}
                style={{ flex: 2 }}
              />
              {goals.length > 1 && (
                <button type="button" onClick={() => removeGoalField(index)} className="remove-btn">Remove</button>
              )}
            </div>
          ))}
          <button type="button" onClick={addGoalField} className="add-btn">Add Goal</button>
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Analyzing...' : 'Analyze My Finances'}
        </button>
      </form>

      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && (
        <div className="results">
          <h2>Financial Analysis Results</h2>
          {result.saved && <p className="saved-badge">Result saved to your history</p>}

          <div className="metrics-grid">
            <div className="metric-card">
              <h4>Total Income</h4>
              <p className="value">R{result.metrics.totalIncome.toFixed(2)}</p>
            </div>
            <div className="metric-card">
              <h4>Total Expenses</h4>
              <p className="value">R{result.metrics.totalExpenses.toFixed(2)}</p>
            </div>
            <div className="metric-card">
              <h4>Savings Rate</h4>
              <p className={`value ${result.metrics.savingsRate > 0 ? 'positive' : 'negative'}`}>
                {result.metrics.savingsRate.toFixed(2)}%
              </p>
            </div>
            <div className="metric-card">
              <h4>Status</h4>
              <p className={`value ${result.metrics.overspending ? 'negative' : 'positive'}`}>
                {result.metrics.overspending ? 'Overspending' : 'Healthy'}
              </p>
            </div>
          </div>

          {result.metrics.incomeByCategory && (
            <div className="category-breakdown">
              <h3>Income by Category</h3>
              <div className="category-grid">
                {Object.entries(result.metrics.incomeByCategory).map(([category, amount]) => (
                  <div key={category} className="category-item income-cat">
                    <span>{category}</span>
                    <strong>R{amount.toFixed(2)}</strong>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.metrics.expensesByCategory && (
            <div className="category-breakdown">
              <h3>Expenses by Category</h3>
              <div className="category-grid">
                {Object.entries(result.metrics.expensesByCategory).map(([category, amount]) => (
                  <div key={category} className="category-item expense-cat">
                    <span>{category}</span>
                    <strong>R{amount.toFixed(2)}</strong>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="ai-advice">
            <h3>AI Recommendations</h3>
            <div className="advice-content">
              {result.aiAdvice}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EnhancedFinancialAnalyzer;
