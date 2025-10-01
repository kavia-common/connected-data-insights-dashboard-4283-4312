import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import useMarketData from '../../../hooks/useMarketData';

/**
 * PUBLIC_INTERFACE
 * ConversionByChannelBar
 */
const ConversionByChannelBar = () => {
  const { filteredRows } = useMarketData();
  const data = useMemo(() => {
    const m = new Map();
    filteredRows.forEach(r => {
      const c = String(r.Channel_Used || 'Unknown');
      if (!m.has(c)) m.set(c, []);
      if (Number.isFinite(r.Conversion_Rate)) m.get(c).push(r.Conversion_Rate);
    });
    return Array.from(m.entries()).map(([Channel, arr]) => ({
      Channel,
      'Avg Conversion %': arr.length ? arr.reduce((a,b)=>a+b,0)/arr.length : 0
    }));
  }, [filteredRows]);

  return (
    <div className="dashboard-card" style={{ padding: 16 }}>
      <div style={{display:'flex', justifyContent:'space-between', marginBottom:8}}>
        <h3 style={{ margin: 0 }}>Conversion by Channel</h3>
        <span style={{ fontSize: 12, color: '#6B7280' }}>Average</span>
      </div>
      <div style={{ width: '100%', height: 280 }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 8, right: 16, bottom: 48, left: 0 }}>
            <CartesianGrid stroke="#E5E7EB" vertical={false} />
            <XAxis dataKey="Channel" tick={{ fontSize: 12 }} interval={0} angle={-20} textAnchor="end" height={60}/>
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip contentStyle={{ background: '#fff', borderRadius: 8, border: '1px solid #E5E7EB' }} />
            <Bar dataKey="Avg Conversion %" fill="#2563EB" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ConversionByChannelBar;
