import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  const isValidUrl = supabaseUrl.startsWith('http://') || supabaseUrl.startsWith('https://');

  return createBrowserClient(
    isValidUrl ? supabaseUrl : 'https://nhfkftmuayfpipahrnwu.supabase.co',
    supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy'
  );
}
