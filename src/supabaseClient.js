import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = url && anonKey ? createClient(url, anonKey) : null;

if (!supabase) {
  console.warn(
    "Supabase not configured — add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env to enable it."
  );
}
