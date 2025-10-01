import React from 'react';

/**
 * PUBLIC_INTERFACE
 * ChartGrid
 * A simple responsive grid layout wrapper to arrange charts and KPI cards.
 */
const ChartGrid = ({ columns = 3, gap = 16, children, style = {} }) => {
  const templateColumns = typeof columns === 'number' ? `repeat(${columns}, 1fr)` : columns;
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: templateColumns,
        gap,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default ChartGrid;
