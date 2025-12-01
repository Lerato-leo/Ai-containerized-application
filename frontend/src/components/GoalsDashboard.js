import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

function GoalsDashboard() {
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

  const analyzeGoals = () => {
    if (!userResults.length) return null;

    const latestResult = userResults[0];
    const monthlySavings = latestResult.metrics.actualMonthlySavings || 
                          (latestResult.metrics.totalIncome - latestResult.metrics.totalExpenses);
    const monthlyIncome = latestResult.metrics.totalIncome;
    const monthlyExpenses = latestResult.metrics.totalExpenses;
    
    // Smart financial goals based on user's actual financial situation
    const commonGoals = [
      { 
        name: 'Emergency Fund (3 months)', 
        amount: monthlyExpenses * 3, 
        category: 'Security',
        priority: 'Critical',
        description: 'Essential safety net to cover unexpected job loss or emergencies',
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
        name: 'Wedding Budget', 
        amount: 100000, 
        category: 'Lifestyle',
        priority: 'Medium',
        description: 'Average cost for a mid-sized wedding in South Africa',
        icon: '💍'
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
        name: 'Retirement Nest Egg', 
        amount: monthlyExpenses * 120, 
        category: 'Retirement',
        priority: 'Critical',
        description: '10 years of living expenses (rule of thumb starter goal)',
        icon: '🏖️'
      },
      { 
        name: 'Investment Portfolio Start', 
        amount: 100000, 
        category: 'Investment',
        priority: 'High',
        description: 'Seed capital for diversified investment portfolio',
        icon: '📈'
      },
    ];

    return commonGoals.map(goal => {
      const monthsToAchieve = monthlySavings > 0 ? Math.ceil(goal.amount / monthlySavings) : null;
      const yearsToAchieve = monthlySavings > 0 ? (goal.amount / monthlySavings / 12).toFixed(1) : null;
      
      // Calculate if achievable within reasonable timeframe
      const isAchievable = monthsToAchieve && monthsToAchieve <= 120; // Within 10 years
      const isNearTerm = monthsToAchieve && monthsToAchieve <= 24; // Within 2 years
      
      // Calculate what increased savings would do
      const with10PercentMore = monthlySavings * 1.1;
      const with20PercentMore = monthlySavings * 1.2;
      const monthsSaved10 = monthlySavings > 0 ? monthsToAchieve - Math.ceil(goal.amount / with10PercentMore) : 0;
      const monthsSaved20 = monthlySavings > 0 ? monthsToAchieve - Math.ceil(goal.amount / with20PercentMore) : 0;
      
      return {
        ...goal,
        monthsToAchieve,
        yearsToAchieve,
        isAchievable,
        isNearTerm,
        monthsSavedWith10PercentIncrease: monthsSaved10,
        monthsSavedWith20PercentIncrease: monthsSaved20
      };
    }).sort((a, b) => {
      // Sort by priority and achievability
      const priorityOrder = { 'Critical': 0, 'High': 1, 'Medium': 2, 'Low': 3 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return (a.monthsToAchieve || 999) - (b.monthsToAchieve || 999);
    });
  };

  const goals = analyzeGoals();

  if (loading) {
    return <div className="dashboard-loading">Loading dashboard...</div>;
  }

  if (!userId) {
    return (
      <div className="dashboard-empty">
        <h2>Goals Planning Dashboard</h2>
        <p>Please create a profile to view your financial goals and timeline.</p>
      </div>
    );
  }

  if (!userResults.length) {
    return (
      <div className="dashboard-empty">
        <h2>Goals Planning Dashboard</h2>
        <p>No data available yet. Complete a financial analysis to see goal projections.</p>
      </div>
    );
  }

  const latestResult = userResults[0];
  const monthlySavings = latestResult.metrics.actualMonthlySavings || 
                         (latestResult.metrics.totalIncome - latestResult.metrics.totalExpenses);
  const savingsRate = latestResult.metrics.savingsRate;
  const monthlyIncome = latestResult.metrics.totalIncome;
  
  // Calculate key insights
  const nearTermGoals = goals ? goals.filter(g => g.isNearTerm).length : 0;
  // eslint-disable-next-line no-unused-vars
  const achievableGoals = goals ? goals.filter(g => g.isAchievable).length : 0;
  const totalGoals = goals ? goals.length : 0;
  
  // Calculate savings increase potential
  // eslint-disable-next-line no-unused-vars
  const potentialSavingsIncrease = monthlySavings > 0 ? monthlyIncome * 0.2 - monthlySavings : monthlyIncome * 0.2;

  return (
    <div className="dashboard">
      <h2>🎯 Smart Goals Planning Dashboard</h2>
      
      <div className="dashboard-intro">
        <p>
          Your personalized goal timeline based on current financial profile. 
          We've prioritized goals by importance and calculated realistic timeframes. 
          See how small changes in savings can dramatically accelerate your progress!
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
          <small>{savingsRate > 15 ? 'Excellent!' : savingsRate > 10 ? 'Good' : 'Needs improvement'}</small>
        </div>
        <div className="summary-card">
          <h4>Near-Term Goals</h4>
          <p className="neutral">
            {nearTermGoals} / {totalGoals}
          </p>
          <small>Achievable within 2 years</small>
        </div>
        <div className="summary-card">
          <h4>Wealth Potential</h4>
          <p className="positive">
            R{(monthlySavings * 12).toLocaleString()}
          </p>
          <small>Annual savings at current rate</small>
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
            <li><strong>Income Boost:</strong> Additional R{Math.abs(monthlySavings).toFixed(2)}/month would balance your budget</li>
          </ul>
          <p style={{marginTop: '1rem', fontWeight: 600}}>
            Once you achieve positive savings, you'll see personalized goal timelines below.
          </p>
        </div>
      ) : (
        <>
          {/* Acceleration Insights */}
          {potentialSavingsIncrease > 0 && (
            <div className="goals-explanation" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none'}}>
              <h3>💡 Acceleration Opportunity</h3>
              <p>
                <strong>Current Pace:</strong> Saving R{monthlySavings.toFixed(2)}/month ({savingsRate.toFixed(1)}% of income)
              </p>
              <p style={{marginTop: '0.75rem'}}>
                <strong>If you increase savings to 20% of income (R{(monthlyIncome * 0.2).toFixed(2)}/month):</strong>
              </p>
              <ul style={{marginTop: '0.5rem', paddingLeft: '1.5rem'}}>
                <li>That's just R{potentialSavingsIncrease.toFixed(2)} more per month</li>
                <li>You'd save R{((monthlyIncome * 0.2) * 12).toLocaleString()} per year instead of R{(monthlySavings * 12).toLocaleString()}</li>
                <li>Most goals would be achieved {((monthlyIncome * 0.2) / monthlySavings).toFixed(1)}x faster!</li>
              </ul>
            </div>
          )}

          {/* Smart Goal Cards */}
          <div className="goals-grid">
            {goals.map((goal, index) => {
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
                      <p style={{fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0'}}>
                        {goal.description}
                      </p>
                    </div>
                    <span className="goal-category" style={{background: priorityColors[goal.priority]}}>
                      {goal.priority}
                    </span>
                  </div>
                  
                  <div className="goal-amount">
                    <span className="goal-label">Target:</span>
                    <span style={{fontSize: '1.5rem', fontWeight: 700}}>R{goal.amount.toLocaleString()}</span>
                  </div>
                  
                  <div className="goal-timeline">
                    {goal.isAchievable ? (
                      <>
                        <div className="timeline-stat">
                          <span className="timeline-number">{goal.monthsToAchieve}</span>
                          <span className="timeline-unit">months</span>
                          <span style={{color: 'var(--text-secondary)', fontSize: '0.9rem', marginLeft: '0.5rem'}}>
                            ({goal.yearsToAchieve} years)
                          </span>
                        </div>
                        
                        {goal.isNearTerm && (
                          <div style={{
                            background: 'rgba(34, 197, 94, 0.1)', 
                            color: '#22c55e', 
                            padding: '0.5rem', 
                            borderRadius: '6px',
                            marginTop: '0.5rem',
                            fontSize: '0.85rem',
                            fontWeight: 600
                          }}>
                            ✓ Achievable within 2 years!
                          </div>
                        )}
                      </>
                    ) : (
                      <div style={{color: 'var(--text-secondary)', fontSize: '0.9rem', padding: '1rem 0'}}>
                        Long-term goal (10+ years at current rate)
                      </div>
                    )}
                  </div>
                  
                  {/* Acceleration Insight */}
                  {goal.monthsSavedWith20PercentIncrease > 0 && (
                    <div className="goal-calculation" style={{background: 'rgba(102, 126, 234, 0.1)', borderColor: '#667eea'}}>
                      <p style={{fontWeight: 600, marginBottom: '0.25rem', color: '#667eea'}}>
                        ⚡ Save {goal.monthsSavedWith20PercentIncrease} months
                      </p>
                      <p style={{fontSize: '0.8rem', color: 'var(--text-secondary)'}}>
                        By increasing savings by 20%, achieve this goal {goal.monthsSavedWith20PercentIncrease} months faster
                      </p>
                    </div>
                  )}
                  
                  {/* Basic calculation */}
                  <div style={{
                    marginTop: '0.75rem', 
                    padding: '0.5rem',
                    background: 'var(--input-bg)',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    color: 'var(--text-secondary)',
                    fontFamily: 'monospace'
                  }}>
                    R{monthlySavings.toFixed(2)}/mo × {goal.monthsToAchieve} mo = R{goal.amount.toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      <div className="dashboard-tips">
        <h3>Smart Actions to Accelerate Your Goals</h3>
        <div className="tips-grid">
          {monthlySavings > 0 && savingsRate < 10 && (
            <div className="tip-card" style={{borderLeft: '4px solid #ef4444'}}>
              <h4>🎯 Priority: Boost Savings Rate</h4>
              <p>
                Your current savings rate is {savingsRate.toFixed(1)}%. Aim for at least 10% (R{(monthlyIncome * 0.1).toFixed(2)}/month). 
                This requires saving just R{((monthlyIncome * 0.1) - monthlySavings).toFixed(2)} more per month.
              </p>
            </div>
          )}
          
          {nearTermGoals > 0 && (
            <div className="tip-card" style={{borderLeft: '4px solid #22c55e'}}>
              <h4>✨ Focus on Near-Term Wins</h4>
              <p>
                You have {nearTermGoals} goal{nearTermGoals !== 1 ? 's' : ''} achievable within 2 years! 
                Prioritize {nearTermGoals === 1 ? 'this' : 'these'} for quick wins that build momentum.
              </p>
            </div>
          )}
          
          <div className="tip-card" style={{borderLeft: '4px solid #3b82f6'}}>
            <h4>🔄 Automate Everything</h4>
            <p>
              Set up automatic transfers of R{monthlySavings > 0 ? monthlySavings.toFixed(2) : (monthlyIncome * 0.1).toFixed(2)} to a high-interest savings account immediately after payday. 
              Banks like Discovery, Capitec, and TymeBank offer competitive rates.
            </p>
          </div>
          
          {achievableGoals < totalGoals && monthlySavings > 0 && (
            <div className="tip-card" style={{borderLeft: '4px solid #f59e0b'}}>
              <h4>⚡ Accelerate Long-Term Goals</h4>
              <p>
                {totalGoals - achievableGoals} goal{totalGoals - achievableGoals !== 1 ? 's' : ''} currently take{totalGoals - achievableGoals === 1 ? 's' : ''} 10+ years. 
                Increasing savings by just 20% would cut years off {totalGoals - achievableGoals === 1 ? 'this timeline' : 'these timelines'}.
              </p>
            </div>
          )}
          
          <div className="tip-card" style={{borderLeft: '4px solid #8b5cf6'}}>
            <h4>📈 Grow Your Income</h4>
            <p>
              Every R1,000 increase in monthly income could add R12,000/year to your savings. 
              Consider upskilling, freelancing, or negotiating a raise to accelerate all goals simultaneously.
            </p>
          </div>
          
          <div className="tip-card" style={{borderLeft: '4px solid #06b6d4'}}>
            <h4>🔍 Track and Optimize</h4>
            <p>
              Review your spending monthly. Identify the top 3 expenses and challenge each one. 
              Can you negotiate better rates, find alternatives, or eliminate non-essentials?
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GoalsDashboard;
