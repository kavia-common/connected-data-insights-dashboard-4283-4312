import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import DashboardChart from './components/DashboardChart';
import AudienceChannelTrends from './components/AudienceChannelTrends';
import ChannelSharePie from './components/ChannelSharePie';
import AudienceScatter from './components/AudienceScatter';
import MarketDataTable from './components/MarketDataTable';
import ChartGrid from './components/ChartGrid';
import useMarketData from './hooks/useMarketData';
import {
  KPIOverview,
  ConversionRateTrend,
  ImpressionsTrend,
  ClicksTrend,
  CTRTrend,
  ROITrend,
  ChannelPerformanceBar,
  AudienceConversionBar,
  SegmentROIBar,
  LocationLanguageHeatmap,
  ChannelShareDonut,
  CampaignTypeSharePie,
  AcquisitionCostHistogram,
  ConversionVsROIScatter,
  ClicksVsImpressionsScatter,
  EngagementVsROIScatter,
  ChannelEfficiencyRadar,
  AudienceChannelMatrix,
  SegmentChannelStacked,
  LanguageShareBar,
  LocationShareBar,
  CampaignTypePerformance,
  FunnelClicksToConversions,
  ROIByLocationBar,
  ROIByChannelBar,
  ConversionByChannelBar,
  ConversionByAudienceBar,
  EngagementByChannelBar,
  EngagementByAudienceBar,
  DailyVolumeArea,
  Rolling7DayAvgLine,
  ROIBox,
  CorrelationMatrixMini
} from './components/analytics/index';

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

  // Filters state lives here and passed down through useMarketData hook consumers
  const { filters, allChannels, allAudiences, allSegments, allLocations, allLanguages } = useMarketData();

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
    { id: 'breakdowns', label: 'Breakdowns' },
    { id: 'correlations', label: 'Correlations' },
    { id: 'efficiency', label: 'Efficiency' },
    { id: 'matrices', label: 'Matrices' },
    { id: 'funnel', label: 'Funnel' },
    { id: 'tables', label: 'Tables' },
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
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            placeholder="Search..."
            value={filters.search}
            onChange={(e) => filters.setSearch(e.target.value)}
            style={{
              border: '1px solid #E5E7EB',
              borderRadius: 8,
              padding: '8px 10px',
              fontSize: 14,
              outline: 'none'
            }}
          />
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            style={{ backgroundColor: '#2563EB' }}
          >
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
        </div>
      </header>

      {/* Layout grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '260px 1fr',
          gap: 16,
          padding: 16,
          maxWidth: 1480,
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
          <nav style={{ display: 'grid', gap: 8, marginBottom: 12 }}>
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

          <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 6 }}>Filters</div>
          <div style={{ display: 'grid', gap: 8 }}>
            <label style={{ fontSize: 12, color: '#374151' }}>
              Channel
              <select
                value={filters.channelFilter}
                onChange={(e) => filters.setChannelFilter(e.target.value)}
                style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #E5E7EB', marginTop: 4 }}
              >
                <option>All</option>
                {allChannels.map(ch => <option key={ch}>{ch}</option>)}
              </select>
            </label>
            <label style={{ fontSize: 12, color: '#374151' }}>
              Audience
              <select
                value={filters.audienceFilter}
                onChange={(e) => filters.setAudienceFilter(e.target.value)}
                style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #E5E7EB', marginTop: 4 }}
              >
                <option>All</option>
                {allAudiences.map(a => <option key={a}>{a}</option>)}
              </select>
            </label>
            <label style={{ fontSize: 12, color: '#374151' }}>
              Segment
              <select
                value={filters.segmentFilter}
                onChange={(e) => filters.setSegmentFilter(e.target.value)}
                style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #E5E7EB', marginTop: 4 }}
              >
                <option>All</option>
                {allSegments.map(s => <option key={s}>{s}</option>)}
              </select>
            </label>
            <label style={{ fontSize: 12, color: '#374151' }}>
              Location
              <select
                value={filters.locationFilter}
                onChange={(e) => filters.setLocationFilter(e.target.value)}
                style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #E5E7EB', marginTop: 4 }}
              >
                <option>All</option>
                {allLocations.map(l => <option key={l}>{l}</option>)}
              </select>
            </label>
            <label style={{ fontSize: 12, color: '#374151' }}>
              Language
              <select
                value={filters.languageFilter}
                onChange={(e) => filters.setLanguageFilter(e.target.value)}
                style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #E5E7EB', marginTop: 4 }}
              >
                <option>All</option>
                {allLanguages.map(l => <option key={l}>{l}</option>)}
              </select>
            </label>
          </div>

          <div style={{ marginTop: 12, padding: 10, borderTop: '1px dashed #e5e7eb', fontSize: 12, color: '#6B7280' }}>
            REACT_APP_SUPABASE_URL/KEY must be set in .env
          </div>
        </aside>

        {/* Main content */}
        <main style={{ display: 'grid', gap: 16 }}>
          {activeView === 'overview' && (
            <>
              <KPIOverview />
              <ChartGrid columns={2}>
                <DashboardChart />
                <ChannelShareDonut />
              </ChartGrid>
              <ChartGrid columns={3}>
                <ConversionRateTrend />
                <ImpressionsTrend />
                <ClicksTrend />
              </ChartGrid>
              <ChartGrid columns={3}>
                <CTRTrend />
                <ROITrend />
                <ROIBox />
              </ChartGrid>
            </>
          )}

          {activeView === 'trends' && (
            <>
              <AudienceChannelTrends />
              <ChartGrid columns={2}>
                <DailyVolumeArea />
                <Rolling7DayAvgLine />
              </ChartGrid>
            </>
          )}

          {activeView === 'breakdowns' && (
            <>
              <ChartGrid columns={2}>
                <ChannelPerformanceBar />
                <AudienceConversionBar />
              </ChartGrid>
              <ChartGrid columns={2}>
                <SegmentROIBar />
                <CampaignTypePerformance />
              </ChartGrid>
              <ChartGrid columns={2}>
                <LanguageShareBar />
                <LocationShareBar />
              </ChartGrid>
              <ChartGrid columns={2}>
                <ROIByLocationBar />
                <ROIByChannelBar />
              </ChartGrid>
              <ChartGrid columns={2}>
                <ConversionByChannelBar />
                <ConversionByAudienceBar />
              </ChartGrid>
              <ChartGrid columns={2}>
                <EngagementByChannelBar />
                <EngagementByAudienceBar />
              </ChartGrid>
              <ChartGrid columns={2}>
                <AcquisitionCostHistogram />
                <CampaignTypeSharePie />
              </ChartGrid>
            </>
          )}

          {activeView === 'correlations' && (
            <>
              <ChartGrid columns={2}>
                <ConversionVsROIScatter />
                <ClicksVsImpressionsScatter />
              </ChartGrid>
              <ChartGrid columns={2}>
                <EngagementVsROIScatter />
                <CorrelationMatrixMini />
              </ChartGrid>
            </>
          )}

          {activeView === 'efficiency' && (
            <>
              <ChartGrid columns={2}>
                <ChannelEfficiencyRadar />
                <AudienceScatter />
              </ChartGrid>
              <ChartGrid columns={2}>
                <ChannelSharePie />
                <FunnelClicksToConversions />
              </ChartGrid>
            </>
          )}

          {activeView === 'matrices' && (
            <>
              <ChartGrid columns={1}>
                <AudienceChannelMatrix />
              </ChartGrid>
              <ChartGrid columns={1}>
                <LocationLanguageHeatmap />
              </ChartGrid>
            </>
          )}

          {activeView === 'funnel' && (
            <>
              <FunnelClicksToConversions />
            </>
          )}

          {activeView === 'tables' && (
            <>
              <MarketDataTable />
            </>
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
