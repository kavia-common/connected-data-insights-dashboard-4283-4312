# Supabase Integration

This frontend uses Supabase to load the `Marktet_Data` table and display extensive analyses (30+ widgets), including:
- Time trends (conversion, clicks, impressions, CTR, ROI, rolling averages)
- Category breakdowns (channel, audience, segment, language, location, campaign type)
- Correlations and scatter views
- Efficiency and radar visualizations
- Funnel approximation
- Matrix/heatmap-like breakdowns
- Data table and KPI cards

## Environment Variables

Create a `.env` file in `dashboard_frontend/`:

REACT_APP_SUPABASE_URL=<your-supabase-url>
REACT_APP_SUPABASE_KEY=<your-supabase-anon-key>

These variables are used by `src/supabaseClient.js`.

## Data Requirements

Table: `Marktet_Data`  
Columns:
- Campaign_ID (bigint PK)
- Company (text)
- Campaign_Type (text)
- Target_Audience (text)
- Duration (text)
- Channel_Used (text)
- Conversion_Rate (float)
- Acquisition_Cost (text/currency-like)
- ROI (float)
- Location (text)
- Language (text)
- Clicks (bigint)
- Impressions (bigint)
- Engagement_Score (bigint)
- Customer_Segment (text)
- Date (text/date-like)

The frontend attempts to parse numeric text; Date is normalized to YYYY-MM-DD if parseable.

## Row Level Security (RLS)

If RLS is enabled (default), ensure the anon role can SELECT from `Marktet_Data`:
- Create a SELECT policy for anon or expose views with SELECT permissions.

Without an appropriate policy, the frontend will show permission errors.

## Handling Large Datasets

For large tables, prefer server-side aggregation:
- Create pre-aggregated views or RPCs (e.g., per-channel daily summaries).
- The app currently fetches up to ~20k rows for client-side aggregation via `useMarketData`.

Example aggregated view:
```sql
create or replace view market_audience_channel_counts as
select
  coalesce("Target_Audience",'Unknown') as target_audience,
  coalesce("Channel_Used",'Unknown') as channel_used,
  count(*) as cnt
from "Marktet_Data"
group by 1,2;
```

## Files

- `src/supabaseClient.js` — singleton Supabase client.
- `src/hooks/useMarketData.js` — global load & filter state.
- `src/utils/dataUtils.js` — parsing & aggregation utilities.
- `src/components/ChartGrid.jsx` — grid layout helper.
- `src/components/KPICard.jsx` — KPI summary card.
- `src/components/analytics/` — 30+ modular widgets.
- `src/components/MarketDataTable.jsx` — paginated table.
- `src/App.js` — header, sidebar filters, grid sections with navigation.

## Styling

Ocean Professional: blue/amber accents, gradient highlights, subtle shadows, rounded corners, minimalist and responsive.
