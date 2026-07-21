import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  "placeholder-anon-key";

/**
 * Supabase client untuk dipakai di Server Components.
 * Berbeda dengan `supabase.js`, client ini tidak mengakses
 * browser APIs sehingga aman di lingkungan Node.js.
 */
export const supabaseServer = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Di server, kita tidak perlu session management
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});
