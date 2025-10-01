import React, { useEffect, useMemo, useState } from 'react';
import { getSupabaseClient } from '../supabaseClient';

/**
 * PUBLIC_INTERFACE
 * MarketDataTable
 * Shows tabular Market_Data with basic pagination. Columns are inferred from first row.
 */
const MarketDataTable = () => {
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const pageSize = 20;

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setErr('');
      try {
        const supabase = getSupabaseClient();
        const start = page * pageSize;
        const end = start + pageSize - 1;

        const { data, error, count } = await supabase
          .from('Marktet_Data')
          .select('*', { count: 'exact' })
          .range(start, end);

        if (error) throw error;
        if (!cancelled) setRows(Array.isArray(data) ? data : []);
        if (!cancelled && count === 0) setErr('No rows in Marktet_Data.');
      } catch (e) {
        if (!cancelled) setErr(e?.message || 'Failed to load table.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [page]);

  const columns = useMemo(() => {
    if (rows.length === 0) return [];
    return Object.keys(rows[0]);
  }, [rows]);

  return (
    <div
      className="dashboard-card"
      style={{
        background: '#ffffff',
        borderRadius: 12,
        boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
        padding: 16,
        border: '1px solid rgba(17,24,39,0.06)',
        overflowX: 'auto'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
        <h2 style={{ margin: 0, fontSize: 18, color: '#111827', fontWeight: 700 }}>Market_Data Table</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setPage(p => Math.max(0, p - 1))} className="theme-toggle" style={{ padding: '6px 10px', background: '#2563EB' }}>Prev</button>
          <button onClick={() => setPage(p => p + 1)} className="theme-toggle" style={{ padding: '6px 10px', background: '#2563EB' }}>Next</button>
        </div>
      </div>

      {loading && <div style={{ padding: 12, color: '#6B7280' }}>Loading rows...</div>}
      {!loading && err && <div role="alert" style={{ padding: 12, borderRadius: 8, background: '#FEF2F2', color: '#991B1B', border: '1px solid #FECACA', fontSize: 13 }}>{err}</div>}

      {!loading && !err && rows.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={c} style={{ textAlign: 'left', fontSize: 12, color: '#374151', padding: '10px 12px', background: '#F3F4F6', borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #E5E7EB' }}>
                {columns.map((c) => (
                  <td key={c} style={{ fontSize: 13, color: '#111827', padding: '10px 12px', borderTop: '1px solid #F3F4F6' }}>
                    {String(r[c] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {!loading && !err && rows.length === 0 && (
        <div style={{ padding: 12, color: '#6B7280' }}>No rows on this page.</div>
      )}
    </div>
  );
};

export default MarketDataTable;
