import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import useMarketData from '../../../hooks/useMarketData';
import { toDateKey } from '../../../utils/dataUtils';

/**
 * PUBLIC_INTERFACE
 * ClicksTrend
 * Shows total Clicks over time by Date.
 */
const ClicksTrend = () => {
  const { filteredRows } = useMarketData();
  const data = useMemo(() => {
    const map = new Map();
    filteredRows.forEach(r => {
      const k = toDateKey(r.Date) || 'Unknown';
      const v = Number.isFinite(r.Clicks) ? r.Clicks : 0;
      map.set(k, (map.get(k) || 0) + v);
    });
    return Array.from(map.entries())
      .map(([date, total]) => ({ date, total }))
      .sort((a, b) => String(a.date).localeCompare(String(b.date)));
  }, [filteredRows]);

  return (
    <div className="dashboard-card" style={{ padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <h3 style={{ margin: 0 }}>Clicks Trend</h3>
        <span style={{ fontSize: 12, color: '#6B7280' }}>Sum by Date</span>
      </div>
      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer>
          <AreaChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
            <defs>
              <linearGradient id="clkGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity={0.25}/>
                <stop offset="100%" stopColor="#10B981" stopOpacity={0.02}/>
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#E5E7EB" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip contentStyle={{ background: '#fff', borderRadius: 8, border: '1px solid #E5E7EB' }} />
            <Area dataKey="total" name="Clicks" stroke="#10B981" fill="url(#clkGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ClicksTrend;
