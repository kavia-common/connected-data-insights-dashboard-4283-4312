import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import useMarketData from '../../../hooks/useMarketData';
import { histogramBuckets } from '../../../utils/dataUtils';

/**
 * PUBLIC_INTERFACE
 * AcquisitionCostHistogram
 * Histogram of Acquisition_Cost (parsed numeric).
 */
const AcquisitionCostHistogram = () => {
  const { filteredRows } = useMarketData();
  const data = useMemo(() => {
    const values = filteredRows.map(r => r.Acquisition_Cost).filter(v => typeof v === 'number' && isFinite(v));
    return histogramBuckets(values, 12);
  }, [filteredRows]);

  return (
    <div className="dashboard-card" style={{ padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <h3 style={{ margin: 0 }}>Acquisition Cost Distribution</h3>
        <span style={{ fontSize: 12, color: '#6B7280' }}>Histogram</span>
      </div>
      <div style={{ width: '100%', height: 280 }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 8, right: 16, bottom: 32, left: 0 }}>
            <CartesianGrid stroke="#E5E7EB" vertical={false} />
            <XAxis dataKey="bucket" tick={{ fontSize: 11 }} interval={0} angle={-20} textAnchor="end" height={60} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip contentStyle={{ background: '#fff', borderRadius: 8, border: '1px solid #E5E7EB' }} />
            <Bar dataKey="count" fill="#2563EB" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AcquisitionCostHistogram;
