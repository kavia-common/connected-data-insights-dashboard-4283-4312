-- PURPOSE:
--   Reconcile public."Marktet_Data" schema in Supabase/Postgres to exactly match the provided structure.
--   - Ensure table exists
--   - Ensure columns exist with specified types
--   - Ensure primary key name and column match
--   - Ensure "Date" (capital D) exists; if lowercase 'date' is present, rename to "Date"
--   This script is idempotent and safe to re-run.

-- Target schema:
-- public."Marktet_Data" (
--   "Campaign_ID" bigint not null primary key,
--   "Company" text null,
--   "Campaign_Type" text null,
--   "Target_Audience" text null,
--   "Duration" text null,
--   "Channel_Used" text null,
--   "Conversion_Rate" double precision null,
--   "Acquisition_Cost" text null,
--   "ROI" double precision null,
--   "Location" text null,
--   "Language" text null,
--   "Clicks" bigint null,
--   "Impressions" bigint null,
--   "Engagement_Score" bigint null,
--   "Customer_Segment" text null,
--   "Date" text null,
--   constraint Marktet_Data_pkey primary key ("Campaign_ID")
-- );

-- 1) Create the table if it doesn't exist with correct columns
CREATE TABLE IF NOT EXISTS public."Marktet_Data" (
  "Campaign_ID" bigint PRIMARY KEY,
  "Company" text NULL,
  "Campaign_Type" text NULL,
  "Target_Audience" text NULL,
  "Duration" text NULL,
  "Channel_Used" text NULL,
  "Conversion_Rate" double precision NULL,
  "Acquisition_Cost" text NULL,
  "ROI" double precision NULL,
  "Location" text NULL,
  "Language" text NULL,
  "Clicks" bigint NULL,
  "Impressions" bigint NULL,
  "Engagement_Score" bigint NULL,
  "Customer_Segment" text NULL,
  "Date" text NULL
);

-- 2) Reconcile schema on existing table (case-sensitive column handling, types, and PK)
DO $$
DECLARE
  col_exists_lower boolean;
  col_exists_proper boolean;
  pk_name text;
BEGIN
  -- Detect lowercase 'date' vs proper 'Date'
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='Marktet_Data' AND column_name='date'
  ) INTO col_exists_lower;

  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='Marktet_Data' AND column_name='Date'
  ) INTO col_exists_proper;

  -- If lowercase exists and proper does not, rename
  IF col_exists_lower AND NOT col_exists_proper THEN
    EXECUTE 'ALTER TABLE public."Marktet_Data" RENAME COLUMN "date" TO "Date"';
  END IF;

  -- If neither exists, add proper column
  IF NOT col_exists_lower AND NOT col_exists_proper THEN
    EXECUTE 'ALTER TABLE public."Marktet_Data" ADD COLUMN "Date" text NULL';
  END IF;

  -- Ensure all required columns exist (add if missing) - types per spec
  PERFORM 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Marktet_Data' AND column_name='Campaign_ID';
  IF NOT FOUND THEN EXECUTE 'ALTER TABLE public."Marktet_Data" ADD COLUMN "Campaign_ID" bigint'; END IF;

  PERFORM 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Marktet_Data' AND column_name='Company';
  IF NOT FOUND THEN EXECUTE 'ALTER TABLE public."Marktet_Data" ADD COLUMN "Company" text NULL'; END IF;

  PERFORM 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Marktet_Data' AND column_name='Campaign_Type';
  IF NOT FOUND THEN EXECUTE 'ALTER TABLE public."Marktet_Data" ADD COLUMN "Campaign_Type" text NULL'; END IF;

  PERFORM 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Marktet_Data' AND column_name='Target_Audience';
  IF NOT FOUND THEN EXECUTE 'ALTER TABLE public."Marktet_Data" ADD COLUMN "Target_Audience" text NULL'; END IF;

  PERFORM 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Marktet_Data' AND column_name='Duration';
  IF NOT FOUND THEN EXECUTE 'ALTER TABLE public."Marktet_Data" ADD COLUMN "Duration" text NULL'; END IF;

  PERFORM 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Marktet_Data' AND column_name='Channel_Used';
  IF NOT FOUND THEN EXECUTE 'ALTER TABLE public."Marktet_Data" ADD COLUMN "Channel_Used" text NULL'; END IF;

  PERFORM 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Marktet_Data' AND column_name='Conversion_Rate';
  IF NOT FOUND THEN EXECUTE 'ALTER TABLE public."Marktet_Data" ADD COLUMN "Conversion_Rate" double precision NULL'; END IF;

  PERFORM 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Marktet_Data' AND column_name='Acquisition_Cost';
  IF NOT FOUND THEN EXECUTE 'ALTER TABLE public."Marktet_Data" ADD COLUMN "Acquisition_Cost" text NULL'; END IF;

  PERFORM 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Marktet_Data' AND column_name='ROI';
  IF NOT FOUND THEN EXECUTE 'ALTER TABLE public."Marktet_Data" ADD COLUMN "ROI" double precision NULL'; END IF;

  PERFORM 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Marktet_Data' AND column_name='Location';
  IF NOT FOUND THEN EXECUTE 'ALTER TABLE public."Marktet_Data" ADD COLUMN "Location" text NULL'; END IF;

  PERFORM 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Marktet_Data' AND column_name='Language';
  IF NOT FOUND THEN EXECUTE 'ALTER TABLE public."Marktet_Data" ADD COLUMN "Language" text NULL'; END IF;

  PERFORM 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Marktet_Data' AND column_name='Clicks';
  IF NOT FOUND THEN EXECUTE 'ALTER TABLE public."Marktet_Data" ADD COLUMN "Clicks" bigint NULL'; END IF;

  PERFORM 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Marktet_Data' AND column_name='Impressions';
  IF NOT FOUND THEN EXECUTE 'ALTER TABLE public."Marktet_Data" ADD COLUMN "Impressions" bigint NULL'; END IF;

  PERFORM 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Marktet_Data' AND column_name='Engagement_Score';
  IF NOT FOUND THEN EXECUTE 'ALTER TABLE public."Marktet_Data" ADD COLUMN "Engagement_Score" bigint NULL'; END IF;

  PERFORM 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Marktet_Data' AND column_name='Customer_Segment';
  IF NOT FOUND THEN EXECUTE 'ALTER TABLE public."Marktet_Data" ADD COLUMN "Customer_Segment" text NULL'; END IF;

  -- Ensure primary key exists and has the exact name 'Marktet_Data_pkey' on Campaign_ID
  SELECT constraint_name INTO pk_name
  FROM information_schema.table_constraints
  WHERE table_schema='public' AND table_name='Marktet_Data' AND constraint_type='PRIMARY KEY'
  LIMIT 1;

  IF pk_name IS NULL THEN
    EXECUTE 'ALTER TABLE public."Marktet_Data" ADD CONSTRAINT Marktet_Data_pkey PRIMARY KEY ("Campaign_ID")';
  ELSIF pk_name <> 'Marktet_Data_pkey' THEN
    EXECUTE format('ALTER TABLE public."Marktet_Data" DROP CONSTRAINT %I', pk_name);
    EXECUTE 'ALTER TABLE public."Marktet_Data" ADD CONSTRAINT Marktet_Data_pkey PRIMARY KEY ("Campaign_ID")';
  END IF;

  -- Align types when mismatched (best-effort casts for text columns and Date)
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Marktet_Data' AND column_name='Company' AND data_type <> 'text') THEN
    EXECUTE 'ALTER TABLE public."Marktet_Data" ALTER COLUMN "Company" TYPE text USING "Company"::text';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Marktet_Data' AND column_name='Campaign_Type' AND data_type <> 'text') THEN
    EXECUTE 'ALTER TABLE public."Marktet_Data" ALTER COLUMN "Campaign_Type" TYPE text USING "Campaign_Type"::text';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Marktet_Data' AND column_name='Target_Audience' AND data_type <> 'text') THEN
    EXECUTE 'ALTER TABLE public."Marktet_Data" ALTER COLUMN "Target_Audience" TYPE text USING "Target_Audience"::text';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Marktet_Data' AND column_name='Duration' AND data_type <> 'text') THEN
    EXECUTE 'ALTER TABLE public."Marktet_Data" ALTER COLUMN "Duration" TYPE text USING "Duration"::text';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Marktet_Data' AND column_name='Channel_Used' AND data_type <> 'text') THEN
    EXECUTE 'ALTER TABLE public."Marktet_Data" ALTER COLUMN "Channel_Used" TYPE text USING "Channel_Used"::text';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Marktet_Data' AND column_name='Acquisition_Cost' AND data_type <> 'text') THEN
    EXECUTE 'ALTER TABLE public."Marktet_Data" ALTER COLUMN "Acquisition_Cost" TYPE text USING "Acquisition_Cost"::text';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Marktet_Data' AND column_name='Location' AND data_type <> 'text') THEN
    EXECUTE 'ALTER TABLE public."Marktet_Data" ALTER COLUMN "Location" TYPE text USING "Location"::text';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Marktet_Data' AND column_name='Language' AND data_type <> 'text') THEN
    EXECUTE 'ALTER TABLE public."Marktet_Data" ALTER COLUMN "Language" TYPE text USING "Language"::text';
  END IF;

  -- Ensure Date is text
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Marktet_Data' AND column_name='Date' AND data_type <> 'text') THEN
    EXECUTE 'ALTER TABLE public."Marktet_Data" ALTER COLUMN "Date" TYPE text USING "Date"::text';
  END IF;

END;
$$;
