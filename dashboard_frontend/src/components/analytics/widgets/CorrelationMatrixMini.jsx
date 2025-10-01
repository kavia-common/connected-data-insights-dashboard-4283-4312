import React, { useMemo } from 'react';
import useMarketData from '../../../hooks/useMarketData';
import { pearsonCorrelation } from '../../../utils/dataUtils';

/**
 * PUBLIC_INTERFACE
 * CorrelationMatrixMini
 * Displays a small correlation matrix for [Conversion_Rate, ROI, Clicks, Impressions, Engagement_Score]
 * Values range [-1,1], colored badges.
 */
const CorrelationMatrixMini = () => {
  const { filteredRows } = useMarketData();
  const metrics = ['Conversion_Rate', 'ROI', 'Clicks', 'Impressions', 'Engagement_Score'];

  const matrix = useMemo(() => {
    const series = {};
    metrics.forEach(m => {
      series[m] = filteredRows.map(r => {
        const v = r[m];
        return Number.isFinite(v) ? v : null;
      });
    });
    // align non-null indices
    const aligned = {};
    metrics.forEach(m1 => {
      aligned[m1] = {};
      metrics.forEach(m2 => {
        const x = [];
        const y = [];
        for (let i = 0; i < filteredRows.length; i++) {
          const a = series[m1][i];
          const b = series[m2][i];
          if (a != null && b != null && isFinite(a) && isFinite(b)) {
            x.push(a); y.push(b);
          }
        }
        aligned[m1][m2] = pearsonCorrelation(x, y);
      });
    });
    return aligned;
  }, [filteredRows]);

  const colorForVal = (v) => {
    if (v == null) return '#9CA3AF';
    if (v > 0.6) return '#10B981';
    if (v > 0.3) return '#2563EB';
    if (v > 0) return '#60A5FA';
    if (v < -0.6) return '#EF4444';
    if (v < -0.3) return '#F59E0B';
    if (v < 0) return '#FBBF24';
    return '#9CA3AF';
    };

  return (
    <div className="dashboard-card" style={{ padding: 16, overflowX: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <h3 style={{ margin: 0 }}>Correlation Matrix (Mini)</h3>
        <span style={{ fontSize: 12, color: '#6B7280' }}>Pearson r</span>
      </div>
      <table style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ padding: 8 }} />
            {metrics.map(m => <th key={m} style={{ padding: 8, fontSize: 12, color: '#374151', textAlign: 'left' }}>{m}</th>)}
          </tr>
        </thead>
        <tbody>
          {metrics.map(row => (
            <tr key={row}>
              <td style={{ padding: 8, fontSize: 12, color: '#374151', fontWeight: 600 }}>{row}</td>
              {metrics.map(col => {
                const v = matrix[row]?.[col];
                return (
                  <td key={col} style={{ padding: 6 }}>
                    <span style={{
                      display: 'inline-block',
                      minWidth: 48,
                      textAlign: 'center',
                      fontSize: 12,
                      borderRadius: 6,
                      border: '1px solid rgba(17,24,39,0.06)',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                      color: '#111827',
                      background: '#fff'
                    }}>
                      <span style={{
                        display: 'inline-block',
                        width: 8,
                        height: 8,
                        borderRadius: 999,
                        background: colorForVal(v),
                        marginRight: 6,
                        verticalAlign: 'middle'
                      }} />
                      {v == null ? 'n/a' : v.toFixed(2)}
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CorrelationMatrixMini;
