import React, { useState, useEffect } from 'react';
import './App.css';
import DashboardChart from './components/DashboardChart';

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState('light');

  // Effect to apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="App" style={{ background: '#f9fafb', minHeight: '100vh' }}>
      {/* Header */}
      <header
        style={{
          background: '#ffffff',
          borderBottom: '1px solid rgba(17,24,39,0.06)',
          padding: '12px 20px',
          position: 'sticky',
          top: 0,
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 8px 24px rgba(0,0,0,0.04)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'linear-gradient(135deg, rgba(37,99,235,0.9), rgba(37,99,235,0.5))',
              boxShadow: '0 6px 20px rgba(37,99,235,0.35)',
            }}
          />
          <h1 style={{ margin: 0, fontSize: 18, color: '#111827' }}>
            Connected Data Insights
          </h1>
        </div>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          style={{ backgroundColor: '#2563EB' }}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </header>

      {/* Layout grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '240px 1fr',
          gap: 16,
          padding: 16,
          maxWidth: 1400,
          margin: '0 auto',
        }}
      >
        {/* Sidebar */}
        <aside
          style={{
            background: '#ffffff',
            borderRadius: 12,
            border: '1px solid rgba(17,24,39,0.06)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
            padding: 12,
            height: 'fit-content',
          }}
        >
          <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 8 }}>
            Navigation
          </div>
          <nav style={{ display: 'grid', gap: 8 }}>
            {['Dashboard', 'Datasets', 'Insights', 'Settings'].map((item) => (
              <button
                key={item}
                style={{
                  textAlign: 'left',
                  padding: '10px 12px',
                  borderRadius: 10,
                  border: '1px solid rgba(17,24,39,0.06)',
                  background: item === 'Dashboard' ? 'rgba(37,99,235,0.06)' : '#fff',
                  color: item === 'Dashboard' ? '#1E3A8A' : '#111827',
                  cursor: 'pointer',
                }}
              >
                {item}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main style={{ display: 'grid', gap: 16 }}>
          <DashboardChart />
        </main>
      </div>
    </div>
  );
}

export default App;
