import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';
import useMarketData from '../../../hooks/useMarketData';

/**
 * PUBLIC_INTERFACE
 * CampaignTypePerformance
 * Average Conv%, ROI, Engagement per Campaign_Type
 */
const CampaignTypePerformance = () => {
  const { filteredRows } = useMarketData();
  const data = useMemo(() => {
    const map = new Map();
    filteredRows.forEach(r => {
      const t = String(r.Campaign_Type || 'Unknown');
      if (!map.has(t)) map.set(t, { conv: [], roi: [], eng: [] });
      if (Number.isFinite(r.Conversion_Rate)) map.get(t).conv.push(r.Conversion_Rate);
      if (Number.isFinite(r.ROI)) map.get(t).roi.push(r.ROI);
      if (Number.isFinite(r.Engagement_Score)) map.get(t).eng.push(r.Engagement_Score);
    });
    return Array.from(map.entries()).map(([t, v]) => ({
      Type: t,
      'Avg Conv%': v.conv.length ? v.conv.reduce((a,b)=>a+b,0)/v.conv.length : 0,
      'Avg ROI': v.roi.length ? v.roi.reduce((a,b)=>a+b,0)/v.roi.length : 0,
      'Avg Engagement': v.eng.length ? v.eng.reduce((a,b)=>a+b,0)/v.eng.length : 0,
    }));
  }, [filteredRows]);

  return (
    <div className="dashboard-card" style={{ padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <h3 style={{ margin: 0 }}>Campaign Type Performance</h3>
        <span style={{ fontSize: 12, color: '#6B7280' }}>Averages</span>
      </div>
      <div style={{ width: '100%', height: 320 }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 8, right: 16, bottom: 48, left: 0 }}>
            <CartesianGrid stroke="#E5E7EB" vertical={false} />
            <XAxis dataKey="Type" tick={{ fontSize: 12 }} interval={0} angle={-20} textAnchor="end" height={60} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip contentStyle={{ background: '#fff', borderRadius: 8, border: '1px solid #E5E7EB' }} />
            <Legend />
            <Bar dataKey="Avg Conv%" fill="#2563EB" />
            <Bar dataKey="Avg ROI" fill="#F59E0B" />
            <Bar dataKey="Avg Engagement" fill="#10B981" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CampaignTypePerformance;
