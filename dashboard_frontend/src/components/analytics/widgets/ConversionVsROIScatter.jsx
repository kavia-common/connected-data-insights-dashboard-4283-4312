import React, { useMemo } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import useMarketData from '../../../hooks/useMarketData';
import { pearsonCorrelation } from '../../../utils/dataUtils';

/**
 * PUBLIC_INTERFACE
 * ConversionVsROIScatter
 * Scatter between Conversion_Rate and ROI with correlation annotation.
 */
const ConversionVsROIScatter = () => {
  const { filteredRows } = useMarketData();
  const { data, corr } = useMemo(() => {
    const pts = filteredRows
      .filter(r => Number.isFinite(r.Conversion_Rate) && Number.isFinite(r.ROI))
      .map(r => ({ x: r.Conversion_Rate, y: r.ROI }));
    const corr = pearsonCorrelation(pts.map(p => p.x), pts.map(p => p.y));
    return { data: pts, corr };
  }, [filteredRows]);

  return (
    <div className="dashboard-card" style={{ padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, alignItems: 'baseline' }}>
        <h3 style={{ margin: 0 }}>Conversion vs ROI</h3>
        <span style={{ fontSize: 12, color: '#6B7280' }}>r = {corr == null ? 'n/a' : corr.toFixed(2)}</span>
      </div>
      <div style={{ width: '100%', height: 280 }}>
        <ResponsiveContainer>
          <ScatterChart margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
            <CartesianGrid stroke="#E5E7EB" />
            <XAxis dataKey="x" name="Conversion %" tick={{ fontSize: 12 }} />
            <YAxis dataKey="y" name="ROI" tick={{ fontSize: 12 }} />
            <Tooltip contentStyle={{ background: '#fff', borderRadius: 8, border: '1px solid #E5E7EB' }} />
            <Scatter data={data} fill="#2563EB" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ConversionVsROIScatter;
