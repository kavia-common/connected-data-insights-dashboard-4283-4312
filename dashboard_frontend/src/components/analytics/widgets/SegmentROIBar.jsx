import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import useMarketData from '../../../hooks/useMarketData';

/**
 * PUBLIC_INTERFACE
 * SegmentROIBar
 * Average ROI by Customer_Segment.
 */
const SegmentROIBar = () => {
  const { filteredRows } = useMarketData();
  const data = useMemo(() => {
    const map = new Map();
    filteredRows.forEach(r => {
      const s = String(r.Customer_Segment || 'Unknown');
      if (!map.has(s)) map.set(s, []);
      if (Number.isFinite(r.ROI)) map.get(s).push(r.ROI);
    });
    return Array.from(map.entries()).map(([seg, arr]) => ({
      Segment: seg,
      'Avg ROI': arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0
    }));
  }, [filteredRows]);

  return (
    <div className="dashboard-card" style={{ padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <h3 style={{ margin: 0 }}>ROI by Segment</h3>
        <span style={{ fontSize: 12, color: '#6B7280' }}>Average</span>
      </div>
      <div style={{ width: '100%', height: 280 }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 8, right: 16, bottom: 32, left: 0 }}>
            <CartesianGrid stroke="#E5E7EB" vertical={false} />
            <XAxis dataKey="Segment" tick={{ fontSize: 12 }} interval={0} angle={-20} textAnchor="end" height={60} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip contentStyle={{ background: '#fff', borderRadius: 8, border: '1px solid #E5E7EB' }} />
            <Bar dataKey="Avg ROI" fill="#8B5CF6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SegmentROIBar;
