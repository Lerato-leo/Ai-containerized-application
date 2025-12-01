import React, { useState } from 'react';
import axios from 'axios';
import './FinancialSummary.css';

function FinancialSummary() {
  const [incomeInputs, setIncomeInputs] = useState(['']);
  const [expenseInputs, setExpenseInputs] = useState(['']);
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

      const response = await axios.post('/api/summary', {
        income,
        expenses
      });

      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to get summary');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="financial-summary">
      <h2>Quick Financial Summary</h2>
      
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

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Calculating...' : 'Get Summary'}
        </button>
      </form>

      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && (
        <div className="results">
          <h2>Summary</h2>
          
          <div className="summary-grid">
            <div className="summary-card income">
              <h4>Total Income</h4>
              <p className="value">R{result.totalIncome.toFixed(2)}</p>
            </div>
            <div className="summary-card expense">
              <h4>Total Expenses</h4>
              <p className="value">R{result.totalExpenses.toFixed(2)}</p>
            </div>
            <div className={`summary-card balance ${result.balance >= 0 ? 'positive' : 'negative'}`}>
              <h4>Balance</h4>
              <p className="value">R{result.balance.toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FinancialSummary;
