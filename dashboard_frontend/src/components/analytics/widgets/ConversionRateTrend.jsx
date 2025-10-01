import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import useMarketData from '../../../hooks/useMarketData';
import { toDateKey } from '../../../utils/dataUtils';

/**
 * PUBLIC_INTERFACE
 * ConversionRateTrend
 * Shows average Conversion_Rate over time (by Date if present).
 */
const ConversionRateTrend = () => {
  const { filteredRows } = useMarketData();
  const data = useMemo(() => {
    const map = new Map();
    filteredRows.forEach(r => {
      const k = toDateKey(r.Date) || 'Unknown';
      const v = Number.isFinite(r.Conversion_Rate) ? r.Conversion_Rate : null;
      if (!map.has(k)) map.set(k, []);
      if (v != null) map.get(k).push(v);
    });
    const points = Array.from(map.entries()).map(([k, arr]) => ({
      date: k,
      avg: arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0
    }));
    return points.sort((a, b) => String(a.date).localeCompare(String(b.date)));
  }, [filteredRows]);

  return (
    <div className="dashboard-card" style={{ padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <h3 style={{ margin: 0 }}>Conversion Rate Trend</h3>
        <span style={{ fontSize: 12, color: '#6B7280' }}>Avg by Date</span>
      </div>
      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
            <CartesianGrid stroke="#E5E7EB" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip contentStyle={{ background: '#fff', borderRadius: 8, border: '1px solid #E5E7EB' }} />
            <Line type="monotone" dataKey="avg" name="Avg Conversion %" stroke="#2563EB" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ConversionRateTrend;
