import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import useMarketData from '../../../hooks/useMarketData';

/**
 * PUBLIC_INTERFACE
 * EngagementByAudienceBar
 */
const EngagementByAudienceBar = () => {
  const { filteredRows } = useMarketData();
  const data = useMemo(() => {
    const m = new Map();
    filteredRows.forEach(r => {
      const a = String(r.Target_Audience || 'Unknown');
      if (!m.has(a)) m.set(a, []);
      if (Number.isFinite(r.Engagement_Score)) m.get(a).push(r.Engagement_Score);
    });
    return Array.from(m.entries()).map(([Audience, arr]) => ({
      Audience,
      'Avg Engagement': arr.length ? arr.reduce((x,y)=>x+y,0)/arr.length : 0
    }));
  }, [filteredRows]);

  return (
    <div className="dashboard-card" style={{ padding: 16 }}>
      <div style={{display:'flex', justifyContent:'space-between', marginBottom:8}}>
        <h3 style={{ margin: 0 }}>Engagement by Audience</h3>
        <span style={{ fontSize: 12, color: '#6B7280' }}>Average</span>
      </div>
      <div style={{ width: '100%', height: 280 }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 8, right: 16, bottom: 48, left: 0 }}>
            <CartesianGrid stroke="#E5E7EB" vertical={false} />
            <XAxis dataKey="Audience" tick={{ fontSize: 12 }} interval={0} angle={-20} textAnchor="end" height={60}/>
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip contentStyle={{ background: '#fff', borderRadius: 8, border: '1px solid #E5E7EB' }} />
            <Bar dataKey="Avg Engagement" fill="#EF4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EngagementByAudienceBar;
