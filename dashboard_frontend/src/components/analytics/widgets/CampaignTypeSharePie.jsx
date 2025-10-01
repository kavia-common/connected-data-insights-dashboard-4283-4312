import React, { useMemo } from 'react';
import { PieChart, Pie, Tooltip, Cell, Legend, ResponsiveContainer } from 'recharts';
import useMarketData from '../../../hooks/useMarketData';

/**
 * PUBLIC_INTERFACE
 * CampaignTypeSharePie
 * Pie of Campaign_Type distribution.
 */
const CampaignTypeSharePie = () => {
  const { filteredRows } = useMarketData();
  const data = useMemo(() => {
    const m = new Map();
    filteredRows.forEach(r => {
      const t = String(r.Campaign_Type || 'Unknown');
      m.set(t, (m.get(t) || 0) + 1);
    });
    return Array.from(m.entries()).map(([name, value]) => ({ name, value }));
  }, [filteredRows]);

  const palette = ['#2563EB', '#F59E0B', '#10B981', '#8B5CF6', '#EF4444', '#06B6D4', '#111827', '#F472B6'];

  return (
    <div className="dashboard-card" style={{ padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <h3 style={{ margin: 0 }}>Campaign Type Share</h3>
        <span style={{ fontSize: 12, color: '#6B7280' }}>Pie</span>
      </div>
      <div style={{ width: '100%', height: 280 }}>
        <ResponsiveContainer>
          <PieChart>
            <Tooltip contentStyle={{ background: '#fff', borderRadius: 8, border: '1px solid #E5E7EB' }} />
            <Legend />
            <Pie data={data} dataKey="value" nameKey="name" outerRadius={110} paddingAngle={2}>
              {data.map((e, i) => <Cell key={i} fill={palette[i % palette.length]} />)}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CampaignTypeSharePie;
