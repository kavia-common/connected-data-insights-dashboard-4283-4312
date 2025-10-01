import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import useMarketData from '../../../hooks/useMarketData';
import { toDateKey } from '../../../utils/dataUtils';

/**
 * PUBLIC_INTERFACE
 * CTRTrend
 * Shows CTR over time: sum(Clicks)/sum(Impressions) * 100 by Date.
 */
const CTRTrend = () => {
  const { filteredRows } = useMarketData();
  const data = useMemo(() => {
    const map = new Map();
    filteredRows.forEach(r => {
      const d = toDateKey(r.Date) || 'Unknown';
      const clicks = Number.isFinite(r.Clicks) ? r.Clicks : 0;
      const imps = Number.isFinite(r.Impressions) ? r.Impressions : 0;
      if (!map.has(d)) map.set(d, { clicks: 0, imps: 0 });
      const agg = map.get(d);
      agg.clicks += clicks;
      agg.imps += imps;
    });
    return Array.from(map.entries())
      .map(([date, { clicks, imps }]) => ({
        date,
        ctr: imps > 0 ? (clicks / imps) * 100 : 0
      }))
      .sort((a, b) => String(a.date).localeCompare(String(b.date)));
  }, [filteredRows]);

  return (
    <div className="dashboard-card" style={{ padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <h3 style={{ margin: 0 }}>CTR Trend</h3>
        <span style={{ fontSize: 12, color: '#6B7280' }}>Clicks/Impressions</span>
      </div>
      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
            <CartesianGrid stroke="#E5E7EB" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip contentStyle={{ background: '#fff', borderRadius: 8, border: '1px solid #E5E7EB' }} />
            <Line dataKey="ctr" name="CTR %" stroke="#F59E0B" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CTRTrend;
