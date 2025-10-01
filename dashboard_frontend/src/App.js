import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import DashboardChart from './components/DashboardChart';
import AudienceChannelTrends from './components/AudienceChannelTrends';
import ChannelSharePie from './components/ChannelSharePie';
import AudienceScatter from './components/AudienceScatter';
import MarketDataTable from './components/MarketDataTable';

// PUBLIC_INTERFACE
function App() {
  /**
   * This is the main application component rendering the Ocean Professional styled dashboard.
   * It contains:
   * - Header with theme toggle
   * - Sidebar navigation to switch between analytical views
   * - Main area where charts and tables render
   */
  const [theme, setTheme] = useState('light');
  const [activeView, setActiveView] = useState('overview');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const navItems = useMemo(() => ([
    { id: 'overview', label: 'Overview' },
    { id: 'trends', label: 'Trends' },
    { id: 'channel-share', label: 'Channel Share' },
    { id: 'audience-scatter', label: 'Audience Scatter' },
    { id: 'table', label: 'Data Table' },
    { id: 'settings', label: 'Settings' },
  ]), []);

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
          <div>
            <h1 style={{ margin: 0, fontSize: 18, color: '#111827' }}>
              Connected Data Insights
            </h1>
            <div style={{ fontSize: 12, color: '#6B7280' }}>Ocean Professional</div>
          </div>
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
            position: 'sticky',
            top: 76,
            alignSelf: 'start'
          }}
        >
          <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 8 }}>
            Navigation
          </div>
          <nav style={{ display: 'grid', gap: 8 }}>
            {navItems.map(({ id, label }) => {
              const active = id === activeView;
              return (
                <button
                  key={id}
                  onClick={() => setActiveView(id)}
                  style={{
                    textAlign: 'left',
                    padding: '10px 12px',
                    borderRadius: 10,
                    border: '1px solid rgba(17,24,39,0.06)',
                    background: active ? 'rgba(37,99,235,0.06)' : '#fff',
                    color: active ? '#1E3A8A' : '#111827',
                    cursor: 'pointer',
                    transition: 'all .2s ease',
                  }}
                >
                  {label}
                </button>
              );
            })}
          </nav>
          <div style={{ marginTop: 12, padding: 10, borderTop: '1px dashed #e5e7eb', fontSize: 12, color: '#6B7280' }}>
            REACT_APP_SUPABASE_URL/KEY must be set in .env
          </div>
        </aside>

        {/* Main content */}
        <main style={{ display: 'grid', gap: 16 }}>
          {activeView === 'overview' && (
            <>
              <DashboardChart />
              <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '1fr 1fr' }}>
                <ChannelSharePie />
                <AudienceScatter />
              </div>
            </>
          )}

          {activeView === 'trends' && (
            <AudienceChannelTrends />
          )}

          {activeView === 'channel-share' && (
            <ChannelSharePie />
          )}

          {activeView === 'audience-scatter' && (
            <AudienceScatter />
          )}

          {activeView === 'table' && (
            <MarketDataTable />
          )}

          {activeView === 'settings' && (
            <div className="dashboard-card" style={{ padding: 16 }}>
              <h2 style={{ marginTop: 0 }}>Settings</h2>
              <p style={{ margin: '8px 0', color: '#4B5563' }}>
                Configure your environment variables in a .env file at the project root (dashboard_frontend):
              </p>
              <pre style={{ background: '#F3F4F6', padding: 12, borderRadius: 8, overflowX: 'auto' }}>
REACT_APP_SUPABASE_URL=&lt;your-url&gt;
REACT_APP_SUPABASE_KEY=&lt;your-anon-key&gt;
              </pre>
              <p style={{ margin: '8px 0', color: '#4B5563' }}>
                Ensure RLS policies allow SELECT for anon or use a service role in a secure backend.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
