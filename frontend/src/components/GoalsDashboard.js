import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

function GoalsDashboard() {
  const [userId] = useState(localStorage.getItem('userId') || '');
  const [userResults, setUserResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      if (response.data && response.data.results && Array.isArray(response.data.results)) {
        setUserResults(response.data.results);
      } else {
        setUserResults([]);
      }
      setError(null);
    } catch (err) {
      console.error('Failed to load results:', err);
      setError('Failed to load goals data. Please try again.');
      setUserResults([]);
    } finally {
      setLoading(false);
    }
  };

  const analyzeGoals = () => {
    if (!userResults || !userResults.length) return null;

    try {
      const latestResult = userResults[0];
      const monthlySavings = latestResult.metrics?.actualMonthlySavings ||
        (parseFloat(latestResult.metrics?.totalIncome || 0) - parseFloat(latestResult.metrics?.totalExpenses || 0));
      const monthlyExpenses = parseFloat(latestResult.metrics?.totalExpenses || 0);
      const monthlyIncome = parseFloat(latestResult.metrics?.totalIncome || 0);

      // Smart financial goals based on user's actual financial situation
      const commonGoals = [
        {
          name: 'Emergency Fund (3 months)',
          amount: monthlyExpenses * 3,
          category: 'Security',
          priority: 'Critical',
          description: 'Essential safety net for unexpected job loss or emergencies',
          icon: '🛡️'
        },
        {
          name: 'Emergency Fund (6 months)',
          amount: monthlyExpenses * 6,
          category: 'Security',
          priority: 'High',
          description: 'Full financial security buffer for major life disruptions',
          icon: '🛡️'
        },
        {
          name: 'House Down Payment (10%)',
          amount: 500000,
          category: 'Property',
          priority: 'Medium',
          description: 'R500k deposit on R5M property (typical middle-class home)',
          icon: '🏠'
        },
        {
          name: 'House Down Payment (20%)',
          amount: 1000000,
          category: 'Property',
          priority: 'Medium',
          description: 'R1M deposit for better interest rates and no bond insurance',
          icon: '🏠'
        },
        {
          name: 'New Vehicle',
          amount: 250000,
          category: 'Transport',
          priority: 'Medium',
          description: 'Mid-range reliable vehicle or deposit for newer car',
          icon: '🚗'
        },
        {
          name: 'Dream Vacation',
          amount: 50000,
          category: 'Lifestyle',
          priority: 'Low',
          description: 'International trip or luxury local getaway',
          icon: '✈️'
        },
        {
          name: 'Education Fund',
          amount: monthlyIncome * 12,
          category: 'Education',
          priority: 'High',
          description: 'One year of tertiary education or skills development',
          icon: '🎓'
        },
        {
          name: 'Investment Portfolio',
          amount: 100000,
          category: 'Investment',
          priority: 'High',
          description: 'Seed capital for diversified investment portfolio',
          icon: '📈'
        },
      ];

      return commonGoals.map(goal => {
        const monthsToAchieve = monthlySavings > 0 ? Math.ceil(goal.amount / monthlySavings) : null;
        const yearsToAchieve = monthsToAchieve ? (monthsToAchieve / 12).toFixed(1) : null;
        const isAchievable = monthsToAchieve && monthsToAchieve <= 120; // Within 10 years
        const isNearTerm = monthsToAchieve && monthsToAchieve <= 24; // Within 2 years

        return {
          ...goal,
          monthsToAchieve,
          yearsToAchieve,
          isAchievable,
          isNearTerm
        };
      }).sort((a, b) => {
        const priorityOrder = { 'Critical': 0, 'High': 1, 'Medium': 2, 'Low': 3 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        return (a.monthsToAchieve || 999) - (b.monthsToAchieve || 999);
      });
    } catch (e) {
      console.error('Error analyzing goals:', e);
      return null;
    }
  };

  const goals = analyzeGoals();

  if (loading) {
    return <div className="dashboard-loading">Loading dashboard...</div>;
  }

  if (error) {
    return (
      <div className="dashboard-empty">
        <h2>🎯 Goals Planning Dashboard</h2>
        <p style={{ color: '#ef4444' }}>{error}</p>
        <button onClick={loadUserResults} style={{ marginTop: '1rem', padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', background: '#667eea', color: 'white', cursor: 'pointer' }}>
          Retry
        </button>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="dashboard-empty">
        <h2>🎯 Goals Planning Dashboard</h2>
        <p>Please create a profile to view your financial goals and timeline.</p>
      </div>
    );
  }

  if (!userResults || !userResults.length) {
    return (
      <div className="dashboard-empty">
        <h2>🎯 Goals Planning Dashboard</h2>
        <p>No data available yet. Complete a financial analysis to see goal projections.</p>
      </div>
    );
  }

  const latestResult = userResults[0];
  const monthlySavings = latestResult.metrics?.actualMonthlySavings ||
    (parseFloat(latestResult.metrics?.totalIncome || 0) - parseFloat(latestResult.metrics?.totalExpenses || 0));
  const savingsRate = parseFloat(latestResult.metrics?.savingsRate || 0);
  const monthlyIncome = parseFloat(latestResult.metrics?.totalIncome || 0);

  const nearTermGoals = goals ? goals.filter(g => g.isNearTerm).length : 0;
  const achievableGoals = goals ? goals.filter(g => g.isAchievable).length : 0;
  const totalGoals = goals ? goals.length : 0;

  return (
    <div className="dashboard">
      <h2>🎯 Smart Goals Planning Dashboard</h2>

      <div className="dashboard-intro">
        <p>
          Your personalized goal timeline based on current financial profile.
          Prioritized by importance and calculated with realistic timeframes.
        </p>
      </div>

      <div className="dashboard-summary">
        <div className="summary-card">
          <h4>Monthly Savings Power</h4>
          <p className={monthlySavings > 0 ? 'positive' : 'negative'}>
            R{Math.abs(monthlySavings).toFixed(2)}
          </p>
          <small>{monthlySavings > 0 ? 'Building wealth' : 'Deficit mode'}</small>
        </div>
        <div className="summary-card">
          <h4>Savings Rate</h4>
          <p className={savingsRate > 15 ? 'positive' : savingsRate > 5 ? 'neutral' : 'negative'}>
            {savingsRate.toFixed(1)}%
          </p>
          <small>{savingsRate > 15 ? 'Excellent!' : savingsRate > 10 ? 'Good' : 'Needs work'}</small>
        </div>
        <div className="summary-card">
          <h4>Near-Term Goals</h4>
          <p className="neutral">
            {nearTermGoals} / {totalGoals}
          </p>
          <small>Achievable within 2 years</small>
        </div>
        <div className="summary-card">
          <h4>Annual Savings</h4>
          <p className="positive">
            R{(monthlySavings * 12).toLocaleString('en-ZA', { maximumFractionDigits: 0 })}
          </p>
          <small>At current rate</small>
        </div>
      </div>

      {monthlySavings <= 0 ? (
        <div className="alert-card">
          <h3>⚠️ Budget Correction Required</h3>
          <p><strong>Current Status:</strong> Spending exceeds income by R{Math.abs(monthlySavings).toFixed(2)}/month</p>
          <p>To start achieving financial goals, you need to create positive cash flow:</p>
          <ul>
            <li><strong>Immediate:</strong> Cut expenses by at least R{Math.abs(monthlySavings).toFixed(2)} to break even</li>
            <li><strong>Target:</strong> Reduce expenses by R{(Math.abs(monthlySavings) + monthlyIncome * 0.1).toFixed(2)} to save 10% of income</li>
          </ul>
          <p style={{ marginTop: '1rem', fontWeight: 600 }}>
            Once you achieve positive savings, you'll see personalized goal timelines below.
          </p>
        </div>
      ) : (
        <>
          {/* Smart Goal Cards */}
          <div className="goals-grid">
            {goals && goals.map((goal, index) => {
              const priorityColors = {
                'Critical': '#ef4444',
                'High': '#f59e0b',
                'Medium': '#3b82f6',
                'Low': '#10b981'
              };

              return (
                <div key={index} className={`goal-card ${goal.isNearTerm ? 'near-term-goal' : ''}`}>
                  <div className="goal-header">
                    <div>
                      <h4>{goal.icon} {goal.name}</h4>
                      <p className="goal-description">
                        {goal.description}
                      </p>
                    </div>
                    <span className="goal-category" style={{ background: priorityColors[goal.priority] }}>
                      {goal.priority}
                    </span>
                  </div>

                  <div className="goal-amount">
                    <span className="goal-label">Target:</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>R{goal.amount.toLocaleString('en-ZA', { maximumFractionDigits: 0 })}</span>
                  </div>

                  <div className="goal-timeline">
                    {goal.isAchievable ? (
                      <>
                        <div className="timeline-stat">
                          <span className="timeline-number">{goal.monthsToAchieve}</span>
                          <span className="timeline-unit">months ({goal.yearsToAchieve} years)</span>
                        </div>

                        {goal.isNearTerm && (
                          <div className="near-term-badge">
                            ✓ Achievable within 2 years!
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="long-term-badge">
                        Long-term goal (10+ years at current rate)
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      <div className="dashboard-tips">
        <h3>💡 Smart Actions to Accelerate Your Goals</h3>
        <div className="tips-grid">
          {monthlySavings > 0 && savingsRate < 10 && (
            <div className="tip-card" style={{ borderLeft: '4px solid #ef4444' }}>
              <h4>🎯 Boost Savings Rate</h4>
              <p>
                Your current savings rate is {savingsRate.toFixed(1)}%. Target 10% (R{(monthlyIncome * 0.1).toFixed(2)}/month).
              </p>
            </div>
          )}

          {nearTermGoals > 0 && (
            <div className="tip-card" style={{ borderLeft: '4px solid #22c55e' }}>
              <h4>✨ Focus on Near-Term Wins</h4>
              <p>
                You have {nearTermGoals} goal{nearTermGoals !== 1 ? 's' : ''} achievable within 2 years! Build momentum.
              </p>
            </div>
          )}

          <div className="tip-card" style={{ borderLeft: '4px solid #3b82f6' }}>
            <h4>🔄 Automate Your Savings</h4>
            <p>
              Set up automatic transfers of R{monthlySavings.toFixed(2)}/month immediately after payday.
            </p>
          </div>

          <div className="tip-card" style={{ borderLeft: '4px solid #8b5cf6' }}>
            <h4>📈 Grow Your Income</h4>
            <p>
              Every R1,000 monthly increase adds R12,000/year to your savings potential.
            </p>
          </div>

          <div className="tip-card" style={{ borderLeft: '4px solid #06b6d4' }}>
            <h4>🔍 Track and Optimize</h4>
            <p>
              Review spending monthly. Challenge your top 3 expenses and find ways to reduce them.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GoalsDashboard;
