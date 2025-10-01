import { createClient } from "@supabase/supabase-js";

/**
 * PUBLIC_INTERFACE
 * getSupabaseClient
 * Returns a singleton Supabase client instance configured via environment variables.
 * Required env vars:
 *  - REACT_APP_SUPABASE_URL
 *  - REACT_APP_SUPABASE_KEY
 */
let supabase = null;

// PUBLIC_INTERFACE
export function getSupabaseClient() {
  /** Returns the initialized Supabase client or initializes it on first call. */
  if (supabase) return supabase;

  const url = process.env.REACT_APP_SUPABASE_URL;
  const anonKey = process.env.REACT_APP_SUPABASE_KEY;

  if (!url || !anonKey) {
    // Provide clear guidance for env configuration without crashing the app
    // eslint-disable-next-line no-console
    console.warn(
      "Supabase env vars are not set. Please configure REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_KEY in your .env file."
    );
  }

  supabase = createClient(url || "", anonKey || "");
  return supabase;
}
