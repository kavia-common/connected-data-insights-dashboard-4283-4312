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

## Files

- `src/supabaseClient.js` — initializes and exports a singleton Supabase client.
- `src/components/DashboardChart.jsx` — fetches and renders the chart.
- `src/App.js` — modern layout with header, sidebar, and main dashboard area.

## Styling

The layout follows the Ocean Professional style with subtle shadows, rounded corners, and blue accents.
