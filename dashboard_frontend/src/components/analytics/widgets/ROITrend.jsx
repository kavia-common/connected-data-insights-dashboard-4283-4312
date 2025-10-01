import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import useMarketData from '../../../hooks/useMarketData';
import { toDateKey } from '../../../utils/dataUtils';

/**
 * PUBLIC_INTERFACE
 * ROITrend
 * Shows average ROI over time by Date.
 */
const ROITrend = () => {
  const { filteredRows } = useMarketData();
  const data = useMemo(() => {
    const map = new Map();
    filteredRows.forEach(r => {
      const d = toDateKey(r.Date) || 'Unknown';
      const roi = Number.isFinite(r.ROI) ? r.ROI : null;
      if (!map.has(d)) map.set(d, []);
      if (roi != null) map.get(d).push(roi);
    });
    return Array.from(map.entries())
      .map(([date, arr]) => ({ date, roi: arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0 }))
      .sort((a, b) => String(a.date).localeCompare(String(b.date)));
  }, [filteredRows]);

  return (
    <div className="dashboard-card" style={{ padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <h3 style={{ margin: 0 }}>ROI Trend</h3>
        <span style={{ fontSize: 12, color: '#6B7280' }}>Avg by Date</span>
      </div>
      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
            <CartesianGrid stroke="#E5E7EB" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip contentStyle={{ background: '#fff', borderRadius: 8, border: '1px solid #E5E7EB' }} />
            <Line dataKey="roi" name="ROI" stroke="#8B5CF6" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ROITrend;
