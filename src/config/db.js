import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const anonKey = process.env.SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !anonKey || !serviceKey) {
  throw new Error("Missing Supabase environment variables");
}

/**
 * 🔐 Public client (anon)
 * Used for normal reads
 */
export const supabase = createClient(supabaseUrl, anonKey);

/**
 * 🔥 Admin client (service role)
 * Used for uploads, inserts, admin ops
 */
export const supabaseAdmin = createClient(supabaseUrl, serviceKey);
