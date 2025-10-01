import React from 'react';

/**
 * PUBLIC_INTERFACE
 * KPICard
 * Displays a high-level KPI metric with label and optional trend info.
 */
const KPICard = ({ label, value, sublabel, accent = '#2563EB' }) => {
  return (
    <div
      className="dashboard-card"
      style={{
        background: '#ffffff',
        borderRadius: 12,
        border: '1px solid rgba(17,24,39,0.06)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
        padding: 16,
      }}
    >
      <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 800, color: '#111827', letterSpacing: 0.3 }}>
        {value}
      </div>
      {sublabel && (
        <div style={{ fontSize: 12, color: '#111827', opacity: 0.6, marginTop: 6 }}>
          <span
            style={{
              display: 'inline-block',
              width: 8,
              height: 8,
              borderRadius: 999,
              background: accent,
              marginRight: 6,
            }}
          />
          {sublabel}
        </div>
      )}
    </div>
  );
};

export default KPICard;
