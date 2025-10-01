import React, { useMemo } from 'react';
import KPICard from '../../KPICard';
import useMarketData from '../../../hooks/useMarketData';

/**
 * PUBLIC_INTERFACE
 * ROIBox
 * Shows min/median/max ROI info in compact KPI cards.
 */
const ROIBox = () => {
  const { filteredRows } = useMarketData();
  const stats = useMemo(() => {
    const vals = filteredRows.map(r => r.ROI).filter(Number.isFinite).sort((a,b)=>a-b);
    if (!vals.length) return { min: 0, med: 0, max: 0 };
    const min = vals[0];
    const max = vals[vals.length - 1];
    const mid = Math.floor(vals.length / 2);
    const med = vals.length % 2 ? vals[mid] : (vals[mid - 1] + vals[mid]) / 2;
    return { min, med, max };
  }, [filteredRows]);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
      <KPICard label="ROI Min" value={stats.min.toFixed(2)} />
      <KPICard label="ROI Median" value={stats.med.toFixed(2)} accent="#10B981" />
      <KPICard label="ROI Max" value={stats.max.toFixed(2)} accent="#8B5CF6" />
    </div>
  );
};

export default ROIBox;
