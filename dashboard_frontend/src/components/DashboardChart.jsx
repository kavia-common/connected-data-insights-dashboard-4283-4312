import React, { useEffect, useMemo, useState } from "react";
import { getSupabaseClient } from "../supabaseClient";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

/**
 * PUBLIC_INTERFACE
 * DashboardChart
 * Fetches data from Supabase 'Marktet_Data' table and visualizes 'Target_Audience' and 'Channel_Used'.
 * The chart aggregates counts of Channel_Used within each Target_Audience.
 *
 * Props:
 *  - className?: string - optional CSS class for outer container
 *
 * Returns:
 *  - A responsive grouped bar chart with Ocean Professional theme styling.
 */
const DashboardChart = ({ className = "" }) => {
  const [rawRows, setRawRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Fetch data from Supabase on mount
  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      setLoading(true);
      setErrorMsg("");
      try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
          .from("Marktet_Data")
          .select("Target_Audience, Channel_Used");

        if (error) throw error;
        if (!cancelled) {
          setRawRows(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (!cancelled) {
          setErrorMsg(
            (err && err.message) ||
              "Failed to load data from Supabase. Check credentials and table/columns."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();
    return () => {
      cancelled = true;
    };
  }, []);

  // Transform raw rows into grouped series data
  const { data, channels } = useMemo(() => {
    // Extract unique channels and target audiences
    const audienceMap = new Map();
    const channelSet = new Set();

    rawRows.forEach((row) => {
      const audience = String(row?.Target_Audience || "Unknown");
      const channel = String(row?.Channel_Used || "Unknown");
      channelSet.add(channel);
      if (!audienceMap.has(audience)) {
        audienceMap.set(audience, {});
      }
      const counts = audienceMap.get(audience);
      counts[channel] = (counts[channel] || 0) + 1;
    });

    const channelsArr = Array.from(channelSet);
    const dataArr = Array.from(audienceMap.entries()).map(([audience, counts]) => {
      const base = { Target_Audience: audience };
      channelsArr.forEach((c) => {
        base[c] = counts[c] || 0;
      });
      return base;
    });

    return { data: dataArr, channels: channelsArr };
  }, [rawRows]);

  // Colors aligned to Ocean Professional theme, cycling for multiple channels
  const palette = [
    "#2563EB", // primary
    "#F59E0B", // secondary
    "#10B981",
    "#8B5CF6",
    "#EF4444",
    "#06B6D4",
  ];

  return (
    <div
      className={`dashboard-card ${className}`}
      style={{
        background: "#ffffff",
        borderRadius: 12,
        boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
        padding: 16,
        border: "1px solid rgba(17,24,39,0.06)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: 18,
            color: "#111827",
            fontWeight: 700,
            letterSpacing: 0.2,
          }}
        >
          Audience vs Channels
        </h2>
        <span
          style={{
            fontSize: 12,
            color: "#6B7280",
            background:
              "linear-gradient(90deg, rgba(37,99,235,0.08), rgba(243,244,246,0.6))",
            padding: "4px 8px",
            borderRadius: 999,
            border: "1px solid rgba(37,99,235,0.15)",
          }}
        >
          Ocean Professional
        </span>
      </div>

      {loading && (
        <div
          style={{
            padding: "24px 8px",
            color: "#111827",
            fontSize: 14,
            opacity: 0.7,
          }}
        >
          Loading data...
        </div>
      )}

      {!loading && errorMsg && (
        <div
          role="alert"
          style={{
            padding: 12,
            marginBottom: 8,
            borderRadius: 8,
            background: "#FEF2F2",
            color: "#991B1B",
            border: "1px solid #FECACA",
            fontSize: 13,
          }}
        >
          {errorMsg}
        </div>
      )}

      {!loading && !errorMsg && data.length === 0 && (
        <div
          style={{
            padding: "24px 8px",
            color: "#6B7280",
            fontSize: 14,
          }}
        >
          No data available. Add rows to the Marktet_Data table.
        </div>
      )}

      {!loading && !errorMsg && data.length > 0 && (
        <div style={{ width: "100%", height: 320 }}>
          <ResponsiveContainer>
            <BarChart
              data={data}
              margin={{ top: 8, right: 16, bottom: 8, left: 0 }}
            >
              <defs>
                <linearGradient id="gridGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity={0.08} />
                  <stop offset="100%" stopColor="#9CA3AF" stopOpacity={0.04} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="url(#gridGradient)" vertical={false} />
              <XAxis
                dataKey="Target_Audience"
                stroke="#111827"
                tick={{ fontSize: 12 }}
                axisLine={{ stroke: "#E5E7EB" }}
                tickLine={false}
              />
              <YAxis
                stroke="#111827"
                tick={{ fontSize: 12 }}
                allowDecimals={false}
                axisLine={{ stroke: "#E5E7EB" }}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "#ffffff",
                  borderRadius: 8,
                  border: "1px solid #E5E7EB",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                  fontSize: 12,
                }}
                cursor={{ fill: "rgba(37,99,235,0.06)" }}
              />
              <Legend
                wrapperStyle={{ fontSize: 12, color: "#111827" }}
                iconType="circle"
              />
              {channels.map((ch, idx) => (
                <Bar
                  key={ch}
                  dataKey={ch}
                  name={ch}
                  fill={palette[idx % palette.length]}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default DashboardChart;
