import React, { useMemo } from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';
import useMarketData from '../../../hooks/useMarketData';

/**
 * PUBLIC_INTERFACE
 * ChannelEfficiencyRadar
 * Radar comparing normalized metrics per channel: Conv%, ROI, CTR proxy (Clicks/Impressions).
 */
const ChannelEfficiencyRadar = () => {
  const { filteredRows } = useMarketData();
  const data = useMemo(() => {
    const map = new Map();
    filteredRows.forEach(r => {
      const ch = String(r.Channel_Used || 'Unknown');
      if (!map.has(ch)) map.set(ch, { convs: [], rois: [], clicks: 0, imps: 0 });
      const a = map.get(ch);
      if (Number.isFinite(r.Conversion_Rate)) a.convs.push(r.Conversion_Rate);
      if (Number.isFinite(r.ROI)) a.rois.push(r.ROI);
      if (Number.isFinite(r.Clicks)) a.clicks += r.Clicks;
      if (Number.isFinite(r.Impressions)) a.imps += r.Impressions;
    });
    // Scale each metric to 0-100
    const rows = Array.from(map.entries()).map(([ch, v]) => ({
      Channel: ch,
      Conv: v.convs.length ? v.convs.reduce((a,b)=>a+b,0)/v.convs.length : 0,
      ROI: v.rois.length ? v.rois.reduce((a,b)=>a+b,0)/v.rois.length : 0,
      CTR: v.imps > 0 ? (v.clicks / v.imps) * 100 : 0
    }));
    const maxConv = Math.max(1, ...rows.map(r => r.Conv));
    const maxROI = Math.max(1, ...rows.map(r => r.ROI));
    const maxCTR = Math.max(1, ...rows.map(r => r.CTR));
    return rows.map(r => ({
      subject: r.Channel,
      Conv: (r.Conv / maxConv) * 100,
      ROI: (r.ROI / maxROI) * 100,
      CTR: (r.CTR / maxCTR) * 100,
    }));
  }, [filteredRows]);

  return (
    <div className="dashboard-card" style={{ padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <h3 style={{ margin: 0 }}>Channel Efficiency Radar</h3>
        <span style={{ fontSize: 12, color: '#6B7280' }}>Normalized 0-100</span>
      </div>
      <div style={{ width: '100%', height: 340 }}>
        <ResponsiveContainer>
          <RadarChart data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis angle={30} domain={[0, 100]} />
            <Tooltip />
            <Radar name="Conv" dataKey="Conv" stroke="#2563EB" fill="#2563EB" fillOpacity={0.3} />
            <Radar name="ROI" dataKey="ROI" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.3} />
            <Radar name="CTR" dataKey="CTR" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChannelEfficiencyRadar;
