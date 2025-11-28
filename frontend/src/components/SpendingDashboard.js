import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

function SpendingDashboard() {
  const [userId] = useState(localStorage.getItem('userId') || '');
  const [userResults, setUserResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      loadUserResults();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const loadUserResults = async () => {
    try {
      const response = await axios.get(`/api/users/${userId}/results`);
      setUserResults(response.data.results);
    } catch (err) {
      console.error('Failed to load results:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateSpendingTrends = () => {
    if (!userResults.length) return null;

    const categoryTotals = {};
    const monthlySpending = [];

    userResults.forEach(result => {
      if (result.metrics.expensesByCategory) {
        Object.entries(result.metrics.expensesByCategory).forEach(([category, amount]) => {
          categoryTotals[category] = (categoryTotals[category] || 0) + amount;
        });
      }
      monthlySpending.push({
        date: new Date(result.date).toLocaleDateString(),
        total: result.metrics.totalExpenses
      });
    });

    return { categoryTotals, monthlySpending };
  };

  const trends = calculateSpendingTrends();

  if (loading) {
    return <div className="dashboard-loading">Loading dashboard...</div>;
  }

  if (!userId) {
    return (
      <div className="dashboard-empty">
        <h2>Spending Analysis Dashboard</h2>
        <p>Please create a profile to view your spending trends and insights.</p>
      </div>
    );
  }

  if (!userResults.length) {
    return (
      <div className="dashboard-empty">
        <h2>Spending Analysis Dashboard</h2>
        <p>No spending data available yet. Complete a financial analysis to see your trends.</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h2>Spending Analysis Dashboard</h2>
      
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Total Analyses</h3>
          <p className="dashboard-stat">{userResults.length}</p>
        </div>

        <div className="dashboard-card">
          <h3>Average Monthly Spending</h3>
          <p className="dashboard-stat">
            R{(userResults.reduce((sum, r) => sum + r.metrics.totalExpenses, 0) / userResults.length).toFixed(2)}
          </p>
        </div>

        <div className="dashboard-card">
          <h3>Average Savings Rate</h3>
          <p className="dashboard-stat">
            {(userResults.reduce((sum, r) => sum + r.metrics.savingsRate, 0) / userResults.length).toFixed(1)}%
          </p>
        </div>

        <div className="dashboard-card">
          <h3>Latest Analysis</h3>
          <p className="dashboard-stat">{new Date(userResults[0].date).toLocaleDateString()}</p>
        </div>
      </div>

      {trends && trends.categoryTotals && (
        <div className="dashboard-section">
          <h3>Spending by Category</h3>
          <div className="category-breakdown-dashboard">
            {Object.entries(trends.categoryTotals)
              .sort((a, b) => b[1] - a[1])
              .map(([category, total]) => {
                const totalSpending = Object.values(trends.categoryTotals).reduce((sum, val) => sum + val, 0);
                const percentage = ((total / totalSpending) * 100).toFixed(1);
                return (
                  <div key={category} className="category-bar">
                    <div className="category-bar-header">
                      <span className="category-name">{category}</span>
                      <span className="category-amount">R{total.toFixed(2)} ({percentage}%)</span>
                    </div>
                    <div className="category-bar-track">
                      <div 
                        className="category-bar-fill" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {trends && trends.monthlySpending && (
        <div className="dashboard-section">
          <h3>Spending History</h3>
          <div className="spending-history">
            {trends.monthlySpending.map((record, index) => (
              <div key={index} className="spending-record">
                <span className="spending-date">{record.date}</span>
                <span className="spending-amount">R{record.total.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SpendingDashboard;
