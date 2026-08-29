import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  const isValidUrl = supabaseUrl.startsWith('http://') || supabaseUrl.startsWith('https://');

  return createBrowserClient(
    isValidUrl ? supabaseUrl : 'https://nhfkftmuayfpipahrnwu.supabase.co',
    supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5oZmtmdG11YXlmcGlwYWhybnd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc3NTc1MTUsImV4cCI6MjEwMzMzMzUxNX0.q1vDAsxCdpQwvPxQTHQ6FrUhVd5n7BK51n45O5hueU4'
  );
}
