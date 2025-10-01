import React, { useEffect, useMemo, useState } from 'react';
import { getSupabaseClient } from '../supabaseClient';
import { ResponsiveContainer, PieChart, Pie, Tooltip, Cell, Legend } from 'recharts';

/**
 * PUBLIC_INTERFACE
 * ChannelSharePie
 * Displays the distribution of Channel_Used as a pie/donut chart with Ocean Professional styling.
 */
const ChannelSharePie = () => {
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setErr('');
      try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
          .from('Marktet_Data')
          .select('Channel_Used')
          .not('Channel_Used', 'is', null)
          .neq('Channel_Used', '')
          .range(0, 9999);

        if (error) throw error;
        if (!cancelled) setRows(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!cancelled) setErr(e?.message || 'Failed to load channel share.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const data = useMemo(() => {
    const counts = new Map();
    rows.forEach(r => {
      const ch = String(r.Channel_Used ?? 'Unknown').trim() || 'Unknown';
      counts.set(ch, (counts.get(ch) || 0) + 1);
    });
    return Array.from(counts.entries()).map(([name, value]) => ({ name, value }));
  }, [rows]);

  const palette = ['#2563EB', '#F59E0B', '#10B981', '#8B5CF6', '#EF4444', '#06B6D4', '#111827', '#F472B6'];

  return (
    <div
      className="dashboard-card"
      style={{
        background: '#ffffff',
        borderRadius: 12,
        boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
        padding: 16,
        border: '1px solid rgba(17,24,39,0.06)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
        <h2 style={{ margin: 0, fontSize: 18, color: '#111827', fontWeight: 700 }}>Channel Share</h2>
        <span style={{ fontSize: 12, color: '#6B7280' }}>Pie/Donut</span>
      </div>

      {loading && <div style={{ padding: 12, color: '#6B7280' }}>Loading channel share...</div>}
      {!loading && err && <div role="alert" style={{ padding: 12, borderRadius: 8, background: '#FEF2F2', color: '#991B1B', border: '1px solid #FECACA', fontSize: 13 }}>{err}</div>}
      {!loading && !err && data.length === 0 && <div style={{ padding: 12, color: '#6B7280' }}>No data.</div>}

      {!loading && !err && data.length > 0 && (
        <div style={{ width: '100%', height: 320 }}>
          <ResponsiveContainer>
            <PieChart>
              <Tooltip
                contentStyle={{
                  background: '#ffffff',
                  borderRadius: 8,
                  border: '1px solid #E5E7EB',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                  fontSize: 12,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12, color: '#111827' }} />
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={70}
                outerRadius={110}
                paddingAngle={2}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={palette[index % palette.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default ChannelSharePie;
