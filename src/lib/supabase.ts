import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('[Supabase Config] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const SUPABASE_EDGE_API_URL = `${supabaseUrl}/functions/v1/voyagecraft-api`;
export const JWT_SECRET = import.meta.env.VITE_JWT_SECRET || '';

export const ADMIN_EMAILS: string[] = (import.meta.env.VITE_ADMIN_EMAILS || '')
  .split(',')
  .map((e: string) => e.trim().toLowerCase())
  .filter(Boolean);

export function isConfiguredAdmin(email: string): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.trim().toLowerCase());
}
