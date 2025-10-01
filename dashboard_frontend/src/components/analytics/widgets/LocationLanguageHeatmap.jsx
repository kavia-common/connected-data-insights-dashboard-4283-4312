import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import useMarketData from '../../../hooks/useMarketData';

/**
 * PUBLIC_INTERFACE
 * LocationLanguageHeatmap
 * Approximates a heatmap by stacking Languages for each Location.
 */
const LocationLanguageHeatmap = () => {
  const { filteredRows } = useMarketData();
  const data = useMemo(() => {
    const locMap = new Map();
    const langs = new Set();
    filteredRows.forEach(r => {
      const loc = String(r.Location || 'Unknown');
      const lang = String(r.Language || 'Unknown');
      langs.add(lang);
      if (!locMap.has(loc)) locMap.set(loc, {});
      locMap.get(loc)[lang] = (locMap.get(loc)[lang] || 0) + 1;
    });
    const languages = Array.from(langs);
    const arr = Array.from(locMap.entries()).map(([loc, obj]) => {
      const row = { Location: loc };
      languages.forEach(l => (row[l] = obj[l] || 0));
      return row;
    });
    return { data: arr, languages };
  }, [filteredRows]);

  const palette = ['#2563EB', '#F59E0B', '#10B981', '#8B5CF6', '#EF4444', '#06B6D4', '#111827', '#F472B6'];

  return (
    <div className="dashboard-card" style={{ padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <h3 style={{ margin: 0 }}>Location vs Language (Heatmap)</h3>
        <span style={{ fontSize: 12, color: '#6B7280' }}>Stacked proxy</span>
      </div>
      <div style={{ width: '100%', height: 340 }}>
        <ResponsiveContainer>
          <BarChart data={data.data} margin={{ top: 8, right: 16, bottom: 48, left: 0 }}>
            <CartesianGrid stroke="#E5E7EB" vertical={false} />
            <XAxis dataKey="Location" tick={{ fontSize: 12 }} interval={0} angle={-20} textAnchor="end" height={60} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip contentStyle={{ background: '#fff', borderRadius: 8, border: '1px solid #E5E7EB' }} />
            <Legend />
            {data.languages.map((l, idx) => (
              <Bar key={l} dataKey={l} stackId="h" fill={palette[idx % palette.length]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LocationLanguageHeatmap;
