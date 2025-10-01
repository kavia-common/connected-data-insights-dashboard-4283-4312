# Supabase Integration

This frontend uses Supabase to load the `Marktet_Data` table and display a chart of Target_Audience vs Channel_Used.

## Environment Variables

Create a `.env` file in `dashboard_frontend/` by copying `.env.example`:

REACT_APP_SUPABASE_URL=<your-supabase-url>
REACT_APP_SUPABASE_KEY=<your-supabase-anon-key>

These variables are used by `src/supabaseClient.js`.

## Data Requirements

Table: `Marktet_Data`  
Columns required (text/varchar recommended):
- `Target_Audience`
- `Channel_Used`

The chart aggregates the count of rows per Channel_Used within each Target_Audience and renders a grouped bar chart.

## Row Level Security (RLS)

If RLS is enabled (default), ensure the anon role can SELECT from `Marktet_Data`:

Example permissive policy:
1. Enable RLS on the table (if not already).
2. Create a policy like:
   - Name: allow_select_marktet_data
   - Action: SELECT
   - Using expression: true

Without an appropriate SELECT policy the frontend will report a permission error and cannot show data.

## Handling Large Datasets

For large tables (e.g., ~194k rows), consider server-side aggregation to reduce bandwidth:
- Create a view that groups the data:

```sql
create or replace view market_audience_channel_counts as
select
  coalesce("Target_Audience",'Unknown') as target_audience,
  coalesce("Channel_Used",'Unknown') as channel_used,
  count(*) as cnt
from "Marktet_Data"
group by 1,2;
```

- Grant SELECT on the view and create an RLS policy for it (if needed).
- Update the frontend to read from the view and pivot on `cnt`.

The current frontend caps the sample to 10,000 rows and aggregates client-side.

## Files

- `src/supabaseClient.js` — initializes and exports a singleton Supabase client.
- `src/components/DashboardChart.jsx` — fetches and renders the chart, with better diagnostics (count and errors) and a safe range cap.
- `src/App.js` — modern layout with header, sidebar, and main dashboard area.

## Styling

The layout follows the Ocean Professional style with subtle shadows, rounded corners, and blue accents.
