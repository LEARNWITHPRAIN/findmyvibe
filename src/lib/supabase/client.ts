import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  // Check if valid URL is provided
  const isValidUrl = supabaseUrl.startsWith('http://') || supabaseUrl.startsWith('https://');

  if (!isValidUrl || supabaseAnonKey.includes('placeholder')) {
    // Return standard client with safe dummy URL to avoid crashing before env is set
    return createBrowserClient(
      'https://findmyvibe-csjmu.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy'
    );
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
