import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Server-only Supabase client (uses service role key).
// Lazily initialised so the module can be imported at build / type-check time
// without throwing when env vars are not yet injected.
// IMPORTANT: Never import this into client components.

let _client: SupabaseClient | null = null;

export function getSupabaseServer(): SupabaseClient {
  if (_client) return _client;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Add them to .env.local (server-only env vars)."
    );
  }

  _client = createClient(url, key);
  return _client;
}
