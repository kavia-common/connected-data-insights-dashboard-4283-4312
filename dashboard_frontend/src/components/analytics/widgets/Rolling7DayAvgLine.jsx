import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import useMarketData from '../../../hooks/useMarketData';
import { toDateKey } from '../../../utils/dataUtils';

/**
 * PUBLIC_INTERFACE
 * Rolling7DayAvgLine
 * Rolling average Clicks over 7-day window.
 */
const Rolling7DayAvgLine = () => {
  const { filteredRows } = useMarketData();
  const data = useMemo(() => {
    const map = new Map();
    filteredRows.forEach(r => {
      const d = toDateKey(r.Date);
      const clicks = Number.isFinite(r.Clicks) ? r.Clicks : 0;
      const key = d || 'Unknown';
      map.set(key, (map.get(key) || 0) + clicks);
    });
    const arr = Array.from(map.entries()).map(([date, clicks]) => ({ date, clicks }))
      .sort((a, b) => String(a.date).localeCompare(String(b.date)));
    // Rolling 7-day
    const out = arr.map((_, i) => {
      const start = Math.max(0, i - 6);
      const slice = arr.slice(start, i + 1);
      const avg = slice.length ? slice.reduce((sum, r) => sum + r.clicks, 0) / slice.length : 0;
      return { date: arr[i].date, avg };
    });
    return out;
  }, [filteredRows]);

  return (
    <div className="dashboard-card" style={{ padding: 16 }}>
      <div style={{display:'flex', justifyContent:'space-between', marginBottom:8}}>
        <h3 style={{ margin: 0 }}>Rolling 7-day Avg Clicks</h3>
        <span style={{ fontSize: 12, color: '#6B7280' }}>Smoothed</span>
      </div>
      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
            <CartesianGrid stroke="#E5E7EB" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip contentStyle={{ background: '#fff', borderRadius: 8, border: '1px solid #E5E7EB' }} />
            <Line dataKey="avg" stroke="#111827" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Rolling7DayAvgLine;
