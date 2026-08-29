import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function createClient() {
  const cookieStore = cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  const isValidUrl = supabaseUrl.startsWith('http://') || supabaseUrl.startsWith('https://');

  return createServerClient(
    isValidUrl ? supabaseUrl : 'https://nhfkftmuayfpipahrnwu.supabase.co',
    supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5oZmtmdG11YXlmcGlwYWhybnd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc3NTc1MTUsImV4cCI6MjEwMzMzMzUxNX0.q1vDAsxCdpQwvPxQTHQ6FrUhVd5n7BK51n45O5hueU4',
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // Handle set from Server Component
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch {
            // Handle remove from Server Component
          }
        },
      },
    }
  );
}
