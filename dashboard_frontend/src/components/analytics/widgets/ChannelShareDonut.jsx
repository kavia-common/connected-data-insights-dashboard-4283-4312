import React, { useMemo } from 'react';
import { PieChart, Pie, Tooltip, Cell, Legend, ResponsiveContainer } from 'recharts';
import useMarketData from '../../../hooks/useMarketData';

/**
 * PUBLIC_INTERFACE
 * ChannelShareDonut
 * Donut chart of Channel_Used share (distinct from existing simple pie by data source/filter integration).
 */
const ChannelShareDonut = () => {
  const { filteredRows } = useMarketData();
  const data = useMemo(() => {
    const counts = new Map();
    filteredRows.forEach(r => {
      const ch = String(r.Channel_Used || 'Unknown');
      counts.set(ch, (counts.get(ch) || 0) + 1);
    });
    return Array.from(counts.entries()).map(([name, value]) => ({ name, value }));
  }, [filteredRows]);

  const palette = ['#2563EB', '#F59E0B', '#10B981', '#8B5CF6', '#EF4444', '#06B6D4', '#111827', '#F472B6'];

  return (
    <div className="dashboard-card" style={{ padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <h3 style={{ margin: 0 }}>Channel Share (Filtered)</h3>
        <span style={{ fontSize: 12, color: '#6B7280' }}>Donut</span>
      </div>
      <div style={{ width: '100%', height: 280 }}>
        <ResponsiveContainer>
          <PieChart>
            <Tooltip contentStyle={{ background: '#fff', borderRadius: 8, border: '1px solid #E5E7EB' }} />
            <Legend />
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={70} outerRadius={110} paddingAngle={2}>
              {data.map((entry, i) => <Cell key={i} fill={palette[i % palette.length]} />)}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChannelShareDonut;
