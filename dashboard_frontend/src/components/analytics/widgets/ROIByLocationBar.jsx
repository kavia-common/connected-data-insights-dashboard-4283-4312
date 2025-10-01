import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import useMarketData from '../../../hooks/useMarketData';

/**
 * PUBLIC_INTERFACE
 * ROIByLocationBar
 */
const ROIByLocationBar = () => {
  const { filteredRows } = useMarketData();
  const data = useMemo(() => {
    const map = new Map();
    filteredRows.forEach(r => {
      const loc = String(r.Location || 'Unknown');
      if (!map.has(loc)) map.set(loc, []);
      if (Number.isFinite(r.ROI)) map.get(loc).push(r.ROI);
    });
    return Array.from(map.entries()).map(([Location, arr]) => ({
      Location,
      'Avg ROI': arr.length ? arr.reduce((a,b)=>a+b,0)/arr.length : 0
    }));
  }, [filteredRows]);

  return (
    <div className="dashboard-card" style={{ padding: 16 }}>
      <div style={{display:'flex', justifyContent:'space-between', marginBottom:8}}>
        <h3 style={{ margin: 0 }}>ROI by Location</h3>
        <span style={{ fontSize: 12, color: '#6B7280' }}>Average</span>
      </div>
      <div style={{ width: '100%', height: 280 }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 8, right: 16, bottom: 48, left: 0 }}>
            <CartesianGrid stroke="#E5E7EB" vertical={false} />
            <XAxis dataKey="Location" tick={{ fontSize: 12 }} interval={0} angle={-20} textAnchor="end" height={60}/>
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip contentStyle={{ background: '#fff', borderRadius: 8, border: '1px solid #E5E7EB' }} />
            <Bar dataKey="Avg ROI" fill="#8B5CF6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ROIByLocationBar;
