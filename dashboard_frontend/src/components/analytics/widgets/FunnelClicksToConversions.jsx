import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import useMarketData from '../../../hooks/useMarketData';

/**
 * PUBLIC_INTERFACE
 * FunnelClicksToConversions
 * Approximates funnel: Impressions -> Clicks -> Conversions (Impressions * CTR, Clicks * Avg Conv%).
 */
const FunnelClicksToConversions = () => {
  const { filteredRows } = useMarketData();
  const data = useMemo(() => {
    const sumImpr = filteredRows.map(r => r.Impressions || 0).reduce((a,b)=>a+b,0);
    const sumClicks = filteredRows.map(r => r.Clicks || 0).reduce((a,b)=>a+b,0);
    const convs = filteredRows
      .map(r => (Number.isFinite(r.Clicks) && Number.isFinite(r.Conversion_Rate)) ? (r.Clicks * (r.Conversion_Rate/100)) : 0)
      .reduce((a,b)=>a+b,0);
    return [
      { stage: 'Impressions', value: sumImpr },
      { stage: 'Clicks', value: sumClicks },
      { stage: 'Conversions (est)', value: Math.round(convs) }
    ];
  }, [filteredRows]);

  return (
    <div className="dashboard-card" style={{ padding: 16 }}>
      <div style={{display:'flex', justifyContent:'space-between', marginBottom:8}}>
        <h3 style={{ margin: 0 }}>Funnel: Impressions → Clicks → Conversions</h3>
        <span style={{ fontSize: 12, color: '#6B7280' }}>Aggregate</span>
      </div>
      <div style={{ width: '100%', height: 240 }}>
        <ResponsiveContainer>
          <BarChart data={data} layout="vertical" margin={{ top: 8, right: 16, bottom: 8, left: 40 }}>
            <CartesianGrid stroke="#E5E7EB" />
            <XAxis type="number" tick={{ fontSize: 12 }} />
            <YAxis dataKey="stage" type="category" tick={{ fontSize: 12 }} />
            <Tooltip contentStyle={{ background: '#fff', borderRadius: 8, border: '1px solid #E5E7EB' }} />
            <Bar dataKey="value" fill="#2563EB" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FunnelClicksToConversions;
