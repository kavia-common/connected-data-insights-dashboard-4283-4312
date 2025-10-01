import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import useMarketData from '../../../hooks/useMarketData';

/**
 * PUBLIC_INTERFACE
 * LocationShareBar
 */
const LocationShareBar = () => {
  const { filteredRows } = useMarketData();
  const data = useMemo(() => {
    const map = new Map();
    filteredRows.forEach(r => {
      const l = String(r.Location || 'Unknown');
      map.set(l, (map.get(l) || 0) + 1);
    });
    return Array.from(map.entries()).map(([Location, Count]) => ({ Location, Count }));
  }, [filteredRows]);

  return (
    <div className="dashboard-card" style={{ padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <h3 style={{ margin: 0 }}>Location Share</h3>
        <span style={{ fontSize: 12, color: '#6B7280' }}>Count</span>
      </div>
      <div style={{ width: '100%', height: 280 }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 8, right: 16, bottom: 48, left: 0 }}>
            <CartesianGrid stroke="#E5E7EB" vertical={false} />
            <XAxis dataKey="Location" tick={{ fontSize: 12 }} interval={0} angle={-20} textAnchor="end" height={60} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip contentStyle={{ background: '#fff', borderRadius: 8, border: '1px solid #E5E7EB' }} />
            <Bar dataKey="Count" fill="#F59E0B" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LocationShareBar;
