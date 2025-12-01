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
      <header className="app-header">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '2rem' }}>
            <div>
              <h1 className="app-title">AI Financial Wellness Coach</h1>
              <p className="app-subtitle">The world of financial freedom</p>
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
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
        </div>
      </header>

      <nav className="app-nav">
        <div className="nav-buttons">
          <button 
            className={`nav-button ${activeTab === 'analyzer' ? 'active' : ''}`}
            onClick={() => setActiveTab('analyzer')}
          >
            📊 Enhanced Analysis
          </button>
          <button 
            className={`nav-button ${activeTab === 'summary' ? 'active' : ''}`}
            onClick={() => setActiveTab('summary')}
          >
            📋 Quick Summary
          </button>
          <button 
            className={`nav-button ${activeTab === 'spending' ? 'active' : ''}`}
            onClick={() => setActiveTab('spending')}
          >
            💳 Spending Dashboard
          </button>
          <button 
            className={`nav-button ${activeTab === 'goals' ? 'active' : ''}`}
            onClick={() => setActiveTab('goals')}
          >
            🎯 Goals Dashboard
          </button>
        </div>
      </nav>

      <main className="container">
        {activeTab === 'analyzer' && <EnhancedFinancialAnalyzer />}
        {activeTab === 'summary' && <FinancialSummary />}
        {activeTab === 'spending' && <SpendingDashboard />}
        {activeTab === 'goals' && <GoalsDashboard />}
      </main>

      <footer style={{ background: '#fff', color: '#64748b', textAlign: 'center', padding: '1.5rem', marginTop: 'auto', borderTop: '1px solid #e2e8f0' }}>
        <p>© 2025 AI Financial Wellness Coach | Powered by SyntaxNova</p>
      </footer>
    </div>
  );
}

export default App;
