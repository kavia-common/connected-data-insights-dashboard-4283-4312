import React, { useEffect, useMemo, useState } from 'react';
import { getSupabaseClient } from '../supabaseClient';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, Tooltip, CartesianGrid, ZAxis } from 'recharts';

/**
 * PUBLIC_INTERFACE
 * AudienceScatter
 * Encodes Target_Audience and Channel_Used into categorical numerical axes and plots frequency as bubble size.
 */
const AudienceScatter = () => {
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
          .select('Target_Audience, Channel_Used')
          .not('Channel_Used', 'is', null)
          .not('Target_Audience', 'is', null)
          .range(0, 9999);
        if (error) throw error;
        if (!cancelled) setRows(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!cancelled) setErr(e?.message || 'Failed to load scatter data.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const { data, xTicks, yTicks } = useMemo(() => {
    const audienceList = [];
    const channelList = [];
    const audIdx = new Map();
    const chIdx = new Map();
    const counts = new Map();

    rows.forEach(r => {
      const a = (String(r.Target_Audience ?? 'Unknown').trim() || 'Unknown');
      const c = (String(r.Channel_Used ?? 'Unknown').trim() || 'Unknown');
      if (!audIdx.has(a)) { audIdx.set(a, audienceList.length); audienceList.push(a); }
      if (!chIdx.has(c)) { chIdx.set(c, channelList.length); channelList.push(c); }
      const key = `${a}||${c}`;
      counts.set(key, (counts.get(key) || 0) + 1);
    });

    const points = Array.from(counts.entries()).map(([key, value]) => {
      const [a, c] = key.split('||');
      return {
        x: audIdx.get(a),
        y: chIdx.get(c),
        z: value,
        a,
        c
      };
    });

    return {
      data: points,
      xTicks: audienceList.map((_, i) => i),
      yTicks: channelList.map((_, i) => i),
      xLabels: audienceList,
      yLabels: channelList
    };
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
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
        <h2 style={{ margin: 0, fontSize: 18, color: '#111827', fontWeight: 700 }}>
          Audience vs Channel (Bubble)
        </h2>
        <span style={{ fontSize: 12, color: '#6B7280' }}>Scatter/Bubble</span>
      </div>

      {loading && <div style={{ padding: 12, color: '#6B7280' }}>Loading scatter...</div>}
      {!loading && err && <div role="alert" style={{ padding: 12, borderRadius: 8, background: '#FEF2F2', color: '#991B1B', border: '1px solid #FECACA', fontSize: 13 }}>{err}</div>}
      {!loading && !err && data.length === 0 && <div style={{ padding: 12, color: '#6B7280' }}>No data.</div>}

      {!loading && !err && data.length > 0 && (
        <div style={{ width: '100%', height: 320 }}>
          <ResponsiveContainer>
            <ScatterChart margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
              <defs>
                <linearGradient id="gridScatter" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity={0.08} />
                  <stop offset="100%" stopColor="#9CA3AF" stopOpacity={0.04} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="url(#gridScatter)" />
              <XAxis
                type="number"
                dataKey="x"
                name="Audience"
                tick={{ fontSize: 12 }}
                domain={['auto', 'auto']}
                allowDecimals={false}
              />
              <YAxis
                type="number"
                dataKey="y"
                name="Channel"
                tick={{ fontSize: 12 }}
                domain={['auto', 'auto']}
                allowDecimals={false}
              />
              <ZAxis dataKey="z" range={[80, 400]} />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                formatter={(val, name, props) => {
                  if (name === 'z') return [val, 'Count'];
                  return [val, name];
                }}
                labelFormatter={() => ''}
                contentStyle={{
                  background: '#ffffff',
                  borderRadius: 8,
                  border: '1px solid #E5E7EB',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                  fontSize: 12,
                }}
              />
              <Scatter data={data} fill="#2563EB" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default AudienceScatter;
