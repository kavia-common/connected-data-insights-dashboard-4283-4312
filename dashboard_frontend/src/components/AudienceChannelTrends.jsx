import React, { useEffect, useMemo, useState } from 'react';
import { getSupabaseClient } from '../supabaseClient';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

/**
 * PUBLIC_INTERFACE
 * AudienceChannelTrends
 * Renders a line chart of Channel_Used frequency trend over an inferred time dimension (Date or Created_At).
 * If a date column isn't present, it falls back to a categorical index to visualize distribution.
 *
 * Fields tried:
 *  - Preferred: Date, date, Event_Date, Created_At, created_at, Timestamp
 *  - Fallback: index (synthetic)
 */
const AudienceChannelTrends = () => {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const dateCandidates = ['Date', 'date', 'Event_Date', 'Created_At', 'created_at', 'Timestamp'];

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
          .from('Marktet_Data')
          .select(`${['Target_Audience', 'Channel_Used', ...dateCandidates].join(',')}`)
          .not('Channel_Used', 'is', null)
          .not('Target_Audience', 'is', null)
          .range(0, 4999);

        if (error) throw error;
        if (!cancelled) setRows(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!cancelled) setError(e?.message || 'Failed to load trend data.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const { data, seriesKeys, xKey, note } = useMemo(() => {
    // pick existing date col
    const dateKey = dateCandidates.find(k => rows.some(r => r[k] != null)) || null;

    if (!rows.length) {
      return { data: [], seriesKeys: [], xKey: 'x', note: dateKey ? '' : 'No date column found. Using synthetic index.' };
    }

    // Normalize time variable
    let mapped = [];
    if (dateKey) {
      mapped = rows.map((r) => {
        let d = r[dateKey];
        // try to format into yyyy-mm-dd for grouping
        try {
          const date = new Date(d);
          if (!isNaN(date.getTime())) {
            const iso = date.toISOString().slice(0, 10);
            return { ...r, __x: iso };
          }
        } catch {}
        return { ...r, __x: String(d) };
      });
    } else {
      mapped = rows.map((r, idx) => ({ ...r, __x: String(idx + 1) }));
    }

    // Aggregate counts per x and per channel
    const map = new Map();
    const channels = new Set();
    mapped.forEach((r) => {
      const x = r.__x;
      const ch = String(r.Channel_Used ?? 'Unknown');
      channels.add(ch);
      if (!map.has(x)) map.set(x, {});
      const acc = map.get(x);
      acc[ch] = (acc[ch] || 0) + 1;
    });

    const xVals = Array.from(map.keys()).sort();
    const channelArr = Array.from(channels);
    const dataset = xVals.map((x) => {
      const row = { [dateKey ? dateKey : 'Index']: x };
      const acc = map.get(x);
      channelArr.forEach((c) => { row[c] = acc[c] || 0; });
      return row;
    });

    return {
      data: dataset,
      seriesKeys: channelArr,
      xKey: dateKey ? dateKey : 'Index',
      note: dateKey ? '' : 'No date column found. Using synthetic index.'
    };
  }, [rows]);

  const palette = ['#2563EB', '#F59E0B', '#10B981', '#8B5CF6', '#EF4444', '#06B6D4', '#111827'];

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
        <h2 style={{ margin: 0, fontSize: 18, color: '#111827', fontWeight: 700 }}>
          Channel Usage Trends
        </h2>
        <span style={{ fontSize: 12, color: '#6B7280' }}>Line chart</span>
      </div>

      {loading && <div style={{ padding: 12, color: '#6B7280' }}>Loading trend data...</div>}
      {!loading && error && (
        <div role="alert" style={{ padding: 12, borderRadius: 8, background: '#FEF2F2', color: '#991B1B', border: '1px solid #FECACA', fontSize: 13 }}>
          {error}
        </div>
      )}
      {!loading && !error && data.length === 0 && (
        <div style={{ padding: 12, color: '#6B7280' }}>No trend data available.</div>
      )}
      {!loading && !error && data.length > 0 && (
        <>
          <div style={{ width: '100%', height: 320 }}>
            <ResponsiveContainer>
              <LineChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
                <defs>
                  <linearGradient id="gridTrend" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#2563EB" stopOpacity={0.08} />
                    <stop offset="100%" stopColor="#9CA3AF" stopOpacity={0.04} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="url(#gridTrend)" vertical={false} />
                <XAxis dataKey={xKey} tick={{ fontSize: 12 }} axisLine={{ stroke: '#E5E7EB' }} tickLine={false} />
                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} axisLine={{ stroke: '#E5E7EB' }} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: '#ffffff',
                    borderRadius: 8,
                    border: '1px solid #E5E7EB',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                    fontSize: 12,
                  }}
                  cursor={{ stroke: 'rgba(37,99,235,0.4)', strokeWidth: 1 }}
                />
                <Legend wrapperStyle={{ fontSize: 12, color: '#111827' }} />
                {seriesKeys.map((k, idx) => (
                  <Line key={k} type="monotone" dataKey={k} name={k} stroke={palette[idx % palette.length]} strokeWidth={2} dot={false} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
          {note && <div style={{ marginTop: 8, fontSize: 12, color: '#9CA3AF' }}>{note}</div>}
        </>
      )}
    </div>
  );
};

export default AudienceChannelTrends;
