import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';
import useMarketData from '../../../hooks/useMarketData';

/**
 * PUBLIC_INTERFACE
 * ChannelPerformanceBar
 * Bar comparing per-channel avg Conversion Rate and avg ROI.
 */
const ChannelPerformanceBar = () => {
  const { filteredRows } = useMarketData();
  const data = useMemo(() => {
    const map = new Map();
    filteredRows.forEach(r => {
      const ch = String(r.Channel_Used || 'Unknown');
      if (!map.has(ch)) map.set(ch, { convs: [], rois: [] });
      if (Number.isFinite(r.Conversion_Rate)) map.get(ch).convs.push(r.Conversion_Rate);
      if (Number.isFinite(r.ROI)) map.get(ch).rois.push(r.ROI);
    });
    return Array.from(map.entries()).map(([name, { convs, rois }]) => ({
      Channel: name,
      'Avg Conversion %': convs.length ? convs.reduce((a, b) => a + b, 0) / convs.length : 0,
      'Avg ROI': rois.length ? rois.reduce((a, b) => a + b, 0) / rois.length : 0,
    }));
  }, [filteredRows]);

  return (
    <div className="dashboard-card" style={{ padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <h3 style={{ margin: 0 }}>Channel Performance</h3>
        <span style={{ fontSize: 12, color: '#6B7280' }}>Avg Conv% & ROI</span>
      </div>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 8, right: 16, bottom: 32, left: 0 }}>
            <CartesianGrid stroke="#E5E7EB" vertical={false} />
            <XAxis dataKey="Channel" tick={{ fontSize: 12 }} interval={0} angle={-20} textAnchor="end" height={60} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip contentStyle={{ background: '#fff', borderRadius: 8, border: '1px solid #E5E7EB' }} />
            <Legend />
            <Bar dataKey="Avg Conversion %" fill="#2563EB" />
            <Bar dataKey="Avg ROI" fill="#F59E0B" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChannelPerformanceBar;
