import React, { useState } from 'react';
import axios from 'axios';
import './FinancialAnalyzer.css';

function FinancialAnalyzer() {
  const [incomeInputs, setIncomeInputs] = useState(['']);
  const [expenseInputs, setExpenseInputs] = useState(['']);
  const [goals, setGoals] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addIncomeField = () => {
    setIncomeInputs([...incomeInputs, '']);
  };

  const addExpenseField = () => {
    setExpenseInputs([...expenseInputs, '']);
  };

  const handleIncomeChange = (index, value) => {
    const newInputs = [...incomeInputs];
    newInputs[index] = value;
    setIncomeInputs(newInputs);
  };

  const handleExpenseChange = (index, value) => {
    const newInputs = [...expenseInputs];
    newInputs[index] = value;
    setExpenseInputs(newInputs);
  };

  const removeIncomeField = (index) => {
    const newInputs = incomeInputs.filter((_, i) => i !== index);
    setIncomeInputs(newInputs.length ? newInputs : ['']);
  };

  const removeExpenseField = (index) => {
    const newInputs = expenseInputs.filter((_, i) => i !== index);
    setExpenseInputs(newInputs.length ? newInputs : ['']);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const income = incomeInputs
        .filter(val => val !== '')
        .map(val => parseFloat(val));
      
      const expenses = expenseInputs
        .filter(val => val !== '')
        .map(val => parseFloat(val));

      if (income.length === 0 || expenses.length === 0) {
        throw new Error('Please enter at least one income and one expense value');
      }

      const response = await axios.post('/api/analyze', {
        income,
        expenses,
        goals: goals || undefined
      });

      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to analyze financial data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="financial-analyzer">
      <h2>AI-Powered Financial Analysis</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Income Sources</h3>
          {incomeInputs.map((value, index) => (
            <div key={index} className="input-group">
              <input
                type="number"
                step="0.01"
                placeholder={`Income source ${index + 1} (Rands)`}
                value={value}
                onChange={(e) => handleIncomeChange(index, e.target.value)}
                required={index === 0}
              />
              {incomeInputs.length > 1 && (
                <button type="button" onClick={() => removeIncomeField(index)} className="remove-btn">
                  Remove
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addIncomeField} className="add-btn">
            Add Income Source
          </button>
        </div>

        <div className="form-section">
          <h3>Expenses</h3>
          {expenseInputs.map((value, index) => (
            <div key={index} className="input-group">
              <input
                type="number"
                step="0.01"
                placeholder={`Expense ${index + 1} (Rands)`}
                value={value}
                onChange={(e) => handleExpenseChange(index, e.target.value)}
                required={index === 0}
              />
              {expenseInputs.length > 1 && (
                <button type="button" onClick={() => removeExpenseField(index)} className="remove-btn">
                  Remove
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addExpenseField} className="add-btn">
            Add Expense
          </button>
        </div>

        <div className="form-section">
          <h3>Financial Goals (Optional)</h3>
          <textarea
            placeholder="e.g., Save for retirement, Buy a house, Pay off debt..."
            value={goals}
            onChange={(e) => setGoals(e.target.value)}
            rows="3"
          />
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

          <div className="ai-advice">
            <h3>AI Recommendations</h3>
            <div className="advice-content">
              {typeof result.aiAdvice === 'string' 
                ? result.aiAdvice 
                : JSON.stringify(result.aiAdvice, null, 2)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FinancialAnalyzer;
