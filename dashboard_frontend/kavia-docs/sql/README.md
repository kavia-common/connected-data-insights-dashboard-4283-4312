# Marktet_Data Schema Fix — How to Run

This folder contains a SQL script to reconcile and enforce the required schema for public."Marktet_Data" in your Supabase/Postgres database.

Script:
- 20251001_fix_marktet_data_schema.sql

What it does:
- Creates public."Marktet_Data" if missing with the exact columns and types
- Ensures the primary key constraint name is Marktet_Data_pkey on "Campaign_ID"
- Ensures the "Date" column exists (capital D); if lowercase 'date' exists, it renames it to "Date"
- Adds any missing columns and aligns types where safe (best-effort casts)

Run options:

1) Supabase SQL Editor (Web Console)
- Open your project → SQL → New query
- Paste the contents of 20251001_fix_marktet_data_schema.sql
- Run the query

2) Supabase CLI (logged in and linked to project)
- Save your database connection in the CLI or use `supabase db connect`
- Then:
  supabase db query ./connected-data-insights-dashboard-4283-4312/dashboard_frontend/kavia-docs/sql/20251001_fix_marktet_data_schema.sql

3) psql (direct Postgres connection)
- Ensure you have a connection string to your Supabase Postgres (service role recommended when modifying schema)
- Then:
  psql "$SUPABASE_DB_URL" -f ./connected-data-insights-dashboard-4283-4312/dashboard_frontend/kavia-docs/sql/20251001_fix_marktet_data_schema.sql

Notes:
- This script is idempotent and safe to run multiple times.
- Make sure you have sufficient privileges. For Supabase, use a service role or run in the SQL Editor with appropriate permissions.
- The frontend expects env vars:
  - REACT_APP_SUPABASE_URL
  - REACT_APP_SUPABASE_KEY

After running:
- The dashboard views (trends in particular) will be able to read "Date" (capital D) if present, avoiding case-sensitive column errors.
