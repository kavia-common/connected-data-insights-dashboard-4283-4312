import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';
import useMarketData from '../../../hooks/useMarketData';

/**
 * PUBLIC_INTERFACE
 * SegmentChannelStacked
 */
const SegmentChannelStacked = () => {
  const { filteredRows } = useMarketData();
  const data = useMemo(() => {
    const segs = new Map();
    const channels = new Set();
    filteredRows.forEach(r => {
      const s = String(r.Customer_Segment || 'Unknown');
      const c = String(r.Channel_Used || 'Unknown');
      channels.add(c);
      if (!segs.has(s)) segs.set(s, {});
      segs.get(s)[c] = (segs.get(s)[c] || 0) + 1;
    });
    const chs = Array.from(channels);
    const arr = Array.from(segs.entries()).map(([seg, obj]) => {
      const row = { Segment: seg };
      chs.forEach(c => (row[c] = obj[c] || 0));
      return row;
    });
    return { arr, chs };
  }, [filteredRows]);

  const palette = ['#2563EB', '#F59E0B', '#10B981', '#8B5CF6', '#EF4444', '#06B6D4', '#111827', '#F472B6'];

  return (
    <div className="dashboard-card" style={{ padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <h3 style={{ margin: 0 }}>Segment x Channel</h3>
        <span style={{ fontSize: 12, color: '#6B7280' }}>Stacked</span>
      </div>
      <div style={{ width: '100%', height: 320 }}>
        <ResponsiveContainer>
          <BarChart data={data.arr} margin={{ top: 8, right: 16, bottom: 48, left: 0 }}>
            <CartesianGrid stroke="#E5E7EB" vertical={false} />
            <XAxis dataKey="Segment" tick={{ fontSize: 12 }} interval={0} angle={-20} textAnchor="end" height={60} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip contentStyle={{ background: '#fff', borderRadius: 8, border: '1px solid #E5E7EB' }} />
            <Legend />
            {data.chs.map((c, idx) => (
              <Bar key={c} dataKey={c} stackId="s" fill={palette[idx % palette.length]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SegmentChannelStacked;
