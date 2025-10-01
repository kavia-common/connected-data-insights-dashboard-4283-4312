import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';
import useMarketData from '../../../hooks/useMarketData';

/**
 * PUBLIC_INTERFACE
 * AudienceConversionBar
 * Shows average Conversion Rate by Target_Audience and count.
 */
const AudienceConversionBar = () => {
  const { filteredRows } = useMarketData();
  const data = useMemo(() => {
    const map = new Map();
    filteredRows.forEach(r => {
      const a = String(r.Target_Audience || 'Unknown');
      if (!map.has(a)) map.set(a, { convs: [], count: 0 });
      if (Number.isFinite(r.Conversion_Rate)) map.get(a).convs.push(r.Conversion_Rate);
      map.get(a).count += 1;
    });
    return Array.from(map.entries()).map(([aud, { convs, count }]) => ({
      Audience: aud,
      'Avg Conversion %': convs.length ? convs.reduce((x, y) => x + y, 0) / convs.length : 0,
      'Campaigns': count
    }));
  }, [filteredRows]);

  return (
    <div className="dashboard-card" style={{ padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <h3 style={{ margin: 0 }}>Audience Conversion</h3>
        <span style={{ fontSize: 12, color: '#6B7280' }}>Avg and Count</span>
      </div>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 8, right: 16, bottom: 48, left: 0 }}>
            <CartesianGrid stroke="#E5E7EB" vertical={false} />
            <XAxis dataKey="Audience" tick={{ fontSize: 12 }} interval={0} angle={-20} textAnchor="end" height={60} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip contentStyle={{ background: '#fff', borderRadius: 8, border: '1px solid #E5E7EB' }} />
            <Legend />
            <Bar dataKey="Avg Conversion %" fill="#2563EB" />
            <Bar dataKey="Campaigns" fill="#06B6D4" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AudienceConversionBar;
