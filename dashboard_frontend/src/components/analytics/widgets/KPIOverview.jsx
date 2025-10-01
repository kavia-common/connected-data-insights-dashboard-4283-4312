import React, { useMemo } from 'react';
import useMarketData from '../../../hooks/useMarketData';
import KPICard from '../../KPICard';

/**
 * PUBLIC_INTERFACE
 * KPIOverview
 * Shows top KPIs: Total Campaigns, Unique Companies, Avg Conversion Rate, Avg ROI, Total Clicks, Total Impressions
 */
const KPIOverview = () => {
  const { filteredRows } = useMarketData();

  const { total, companies, avgConv, avgROI, sumClicks, sumImpr } = useMemo(() => {
    const total = filteredRows.length;
    const companies = new Set(filteredRows.map(r => r.Company || 'Unknown')).size;
    const conv = filteredRows.map(r => r.Conversion_Rate).filter(Number.isFinite);
    const roi = filteredRows.map(r => r.ROI).filter(Number.isFinite);
    const avgConv = conv.length ? (conv.reduce((a, b) => a + b, 0) / conv.length) : 0;
    const avgROI = roi.length ? (roi.reduce((a, b) => a + b, 0) / roi.length) : 0;
    const sumClicks = filteredRows.map(r => r.Clicks || 0).reduce((a, b) => a + b, 0);
    const sumImpr = filteredRows.map(r => r.Impressions || 0).reduce((a, b) => a + b, 0);
    return { total, companies, avgConv, avgROI, sumClicks, sumImpr };
  }, [filteredRows]);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 16 }}>
      <KPICard label="Total Campaigns" value={total} sublabel="Filtered scope" />
      <KPICard label="Unique Companies" value={companies} sublabel="Entities" accent="#10B981" />
      <KPICard label="Avg Conversion Rate" value={`${avgConv.toFixed(2)}%`} sublabel="Mean of available" accent="#F59E0B" />
      <KPICard label="Avg ROI" value={avgROI.toFixed(2)} sublabel="Mean of available" accent="#8B5CF6" />
      <KPICard label="Total Clicks" value={sumClicks} sublabel="Aggregate" accent="#06B6D4" />
      <KPICard label="Total Impressions" value={sumImpr} sublabel="Aggregate" accent="#EF4444" />
    </div>
  );
};

export default KPIOverview;
