# Market_Data Analyses & Visualization Guide

This guide outlines recommended analytical views for the `Marktet_Data` table and how they map to the dashboard components.

Assumed core fields:
- Target_Audience (text)
- Channel_Used (text)
- Optional time-like fields: Date / Event_Date / Created_At / created_at / Timestamp

Primary analyses implemented:
1) Audience vs Channels (Grouped Bar)
   - File: src/components/DashboardChart.jsx
   - Purpose: Compare counts of Channel_Used per Target_Audience.
   - Notes: Client-side aggregation limited to 10k rows; recommend a server-side aggregated view in Supabase for large datasets.

2) Channel Usage Trends (Line)
   - File: src/components/AudienceChannelTrends.jsx
   - Purpose: Visualize how channel usage changes over time.
   - Time Field: Attempts to infer from common date columns; falls back to synthetic index if none found.

3) Channel Share (Pie/Donut)
   - File: src/components/ChannelSharePie.jsx
   - Purpose: Show overall distribution of Channel_Used as percent of total.

4) Audience vs Channel Bubble (Scatter)
   - File: src/components/AudienceScatter.jsx
   - Purpose: Visualize the association between audience categories and channels with bubble size as frequency.

5) Data Table
   - File: src/components/MarketDataTable.jsx
   - Purpose: Inspect raw rows with simple pagination.

Styling:
- Ocean Professional (Modern):
  - Primary: #2563EB
  - Secondary: #F59E0B
  - Background: #f9fafb
  - Surface: #ffffff
  - Text: #111827
  - Use subtle shadows and rounded corners.

Performance tips:
- Prefer server-side aggregated views for large datasets. Example:
  create or replace view market_audience_channel_counts as
  select
    coalesce("Target_Audience",'Unknown') as target_audience,
    coalesce("Channel_Used",'Unknown') as channel_used,
    count(*) as cnt
  from "Marktet_Data"
  group by 1,2;

- For trend analysis, a date column is helpful; consider adding Created_At or Date to your table.

Extensibility:
- Add filters (audience, channel, date range) as controlled inputs in the header or sidebar.
- Add drill-down routes per audience or per channel as separate views.
- Add KPIs cards (total rows, unique audiences, unique channels) above charts.
