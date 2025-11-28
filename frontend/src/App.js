import React, { useState, useEffect } from 'react';
import './App.css';
import EnhancedFinancialAnalyzer from './components/EnhancedFinancialAnalyzer';
import FinancialSummary from './components/FinancialSummary';
import SpendingDashboard from './components/SpendingDashboard';
import GoalsDashboard from './components/GoalsDashboard';

function App() {
  const [activeTab, setActiveTab] = useState('analyzer');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('userId'));

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Check for login state changes
  useEffect(() => {
    const checkLoginState = () => {
      setIsLoggedIn(!!localStorage.getItem('userId'));
    };
    
    // Check initially and on storage changes
    window.addEventListener('storage', checkLoginState);
    
    // Also check periodically for same-tab changes
    const interval = setInterval(checkLoginState, 1000);
    
    return () => {
      window.removeEventListener('storage', checkLoginState);
      clearInterval(interval);
    };
  }, []);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out? Your data is saved and you can log back in anytime.')) {
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      setIsLoggedIn(false);
      setActiveTab('analyzer');
      window.location.reload();
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
          <div className="header-title">
            <h1>AI Financial Wellness Coach</h1>
            <p>The world of financial freedom</p>
          </div>
          <div className="header-controls">
            <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
              <span className="theme-icon">{theme === 'light' ? '🌙' : '☀️'}</span>
              <span className="theme-label">{theme === 'light' ? 'Dark' : 'Light'}</span>
            </button>
            {isLoggedIn && (
              <button className="logout-btn" onClick={handleLogout} title="Logout">
                <span className="logout-icon">⎋</span>
                <span className="logout-label">Logout</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="tab-navigation">
        <button 
          className={activeTab === 'analyzer' ? 'active' : ''}
          onClick={() => setActiveTab('analyzer')}
        >
          Enhanced Analysis
        </button>
        <button 
          className={activeTab === 'summary' ? 'active' : ''}
          onClick={() => setActiveTab('summary')}
        >
          Quick Summary
        </button>
        <button 
          className={activeTab === 'spending' ? 'active' : ''}
          onClick={() => setActiveTab('spending')}
        >
          Spending Dashboard
        </button>
        <button 
          className={activeTab === 'goals' ? 'active' : ''}
          onClick={() => setActiveTab('goals')}
        >
          Goals Dashboard
        </button>
      </div>

      <main className="App-main">
        {activeTab === 'analyzer' && <EnhancedFinancialAnalyzer />}
        {activeTab === 'summary' && <FinancialSummary />}
        {activeTab === 'spending' && <SpendingDashboard />}
        {activeTab === 'goals' && <GoalsDashboard />}
      </main>

      <footer className="App-footer">
        <p>© 2025 AI Financial Wellness Coach | Powered by SyntaxNova</p>
      </footer>
    </div>
  );
}

export default App;
