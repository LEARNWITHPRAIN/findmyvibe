'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Profile, Hobby, Message, VerificationStatus } from './types';
import { INITIAL_HOBBIES, INITIAL_MESSAGES, INITIAL_PROFILES } from './mockData';
import { createClient } from './supabase/client';

const ADMIN_EMAIL = 'prakharjain2731@gmail.com';

interface AuthContextType {
  currentUser: Profile | null;
  profiles: Profile[];
  hobbies: Hobby[];
  messages: Message[];
  isLoading: boolean;
  isLogingOut: boolean;
  login: (email: string, pass: string) => Promise<{ error?: string }>;
  signup: (email: string, pass: string) => Promise<{ error?: string; requiresEmailConfirm?: boolean }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  submitVerification: (idCardDataUrl: string) => Promise<void>;
  updateVerificationStatus: (userId: string, status: VerificationStatus) => Promise<void>;
  sendMessage: (receiverId: string, content: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─────────────────────────────────────────────────────────────────────────────
// Helper: load full profile row from Supabase
// ─────────────────────────────────────────────────────────────────────────────
async function fetchProfile(supabase: ReturnType<typeof createClient>, userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*, profile_hobbies(hobby:hobbies(*))')
    .eq('id', userId)
    .single();

  if (error || !data) return null;

  // Flatten nested hobbies join
  const hobbies: Hobby[] = (data.profile_hobbies ?? []).map(
    (ph: { hobby: Hobby }) => ph.hobby
  );

  const isAdmin = (data.email ?? '').toLowerCase() === ADMIN_EMAIL.toLowerCase();

  return { ...data, hobbies, is_admin: isAdmin } as Profile;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helper: load all (non-demo) profiles for discover feed
// ─────────────────────────────────────────────────────────────────────────────
async function fetchAllProfiles(supabase: ReturnType<typeof createClient>): Promise<Profile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*, profile_hobbies(hobby:hobbies(*))');

  if (error || !data) return [];

  return data.map((row: Record<string, unknown>) => {
    const hobbies: Hobby[] = ((row.profile_hobbies as { hobby: Hobby }[]) ?? []).map(
      (ph) => ph.hobby
    );
    const email = (row.email as string) ?? '';
    const isAdmin = email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
    return { ...row, hobbies, is_admin: isAdmin, is_demo: false } as Profile;
  });
}

// ─────────────────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const supabase = createClient();

  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>(INITIAL_PROFILES); // start with demo data, swap on load
  const [hobbies] = useState<Hobby[]>(INITIAL_HOBBIES);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [isLoading, setIsLoading] = useState(true);
  const [isLogingOut, setIsLogingOut] = useState(false);

  // ─── On mount: restore session ────────────────────────────────────────────
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        // 1. Get current session from Supabase cookie
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user && mounted) {
          const profile = await fetchProfile(supabase, session.user.id);
          if (mounted) setCurrentUser(profile);
        }

        // 2. Load all real profiles for discover feed
        const { data: { session: sess } } = await supabase.auth.getSession();
        if (sess && mounted) {
          const allProfiles = await fetchAllProfiles(supabase);
          if (mounted && allProfiles.length > 0) {
            setProfiles(allProfiles);
          }
        }
      } catch (err) {
        console.error('Session init error:', err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    init();

    // 3. Listen for auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (event === 'SIGNED_IN' && session?.user) {
        const profile = await fetchProfile(supabase, session.user.id);
        setCurrentUser(profile);

        // Reload discover feed
        const allProfiles = await fetchAllProfiles(supabase);
        if (allProfiles.length > 0) setProfiles(allProfiles);
      }

      if (event === 'SIGNED_OUT') {
        setCurrentUser(null);
        setProfiles(INITIAL_PROFILES); // revert to demo data when logged out
      }

      if (event === 'TOKEN_REFRESHED' && session?.user) {
        const profile = await fetchProfile(supabase, session.user.id);
        setCurrentUser(profile);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Auth actions ──────────────────────────────────────────────────────────

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return {};
  };

  const signup = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) return { error: error.message };
    return { requiresEmailConfirm: true };
  };

  const logout = async () => {
    setIsLogingOut(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    await supabase.auth.signOut();
    setCurrentUser(null);
    setIsLogingOut(false);
    router.push('/');
  };

  // ─── Profile actions ───────────────────────────────────────────────────────

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!currentUser) return;

    // Optimistic update
    const updatedUser = { ...currentUser, ...updates, updated_at: new Date().toISOString() };
    setCurrentUser(updatedUser);

    // Persist to Supabase — exclude computed/joined fields
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { hobbies: _hobbies, is_demo: _demo, ...safeUpdates } = updates as Record<string, unknown>;

    const { error } = await supabase
      .from('profiles')
      .update({ ...safeUpdates, updated_at: new Date().toISOString() })
      .eq('id', currentUser.id);

    if (error) {
      console.error('Profile update error:', error.message);
    }

    // If hobbies changed, sync profile_hobbies join table
    if (updates.hobbies && Array.isArray(updates.hobbies)) {
      // Delete existing
      await supabase.from('profile_hobbies').delete().eq('profile_id', currentUser.id);
      // Re-insert
      const rows = (updates.hobbies as Hobby[])
        .filter((h) => typeof h === 'object' && h.id < 90) // skip custom "Other" pseudo-hobbies
        .map((h) => ({ profile_id: currentUser.id, hobby_id: h.id }));
      if (rows.length > 0) {
        await supabase.from('profile_hobbies').insert(rows);
      }
    }
  };

  const submitVerification = async (idCardDataUrl: string) => {
    if (!currentUser) return;

    const updated = { ...currentUser, id_card_url: idCardDataUrl, verification_status: 'pending' as VerificationStatus };
    setCurrentUser(updated);

    await supabase
      .from('profiles')
      .update({ id_card_url: idCardDataUrl, verification_status: 'pending' })
      .eq('id', currentUser.id);
  };

  const updateVerificationStatus = async (userId: string, status: VerificationStatus) => {
    setProfiles((prev) => prev.map((p) => (p.id === userId ? { ...p, verification_status: status } : p)));
    if (currentUser?.id === userId) {
      setCurrentUser((prev) => prev ? { ...prev, verification_status: status } : prev);
    }

    await supabase
      .from('profiles')
      .update({ verification_status: status })
      .eq('id', userId);
  };

  // ─── Messaging ─────────────────────────────────────────────────────────────

  const sendMessage = async (receiverId: string, content: string) => {
    if (!currentUser) return { success: false, error: 'Please log in first.' };

    if (currentUser.verification_status !== 'verified') {
      return { success: false, error: 'Verify your CSJMU ID to start messaging.' };
    }

    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      sender_id: currentUser.id,
      receiver_id: receiverId,
      content: content.trim(),
      created_at: new Date().toISOString(),
    };

    // Optimistic UI update
    setMessages((prev) => [...prev, newMsg]);

    const { error } = await supabase.from('messages').insert({
      sender_id: currentUser.id,
      receiver_id: receiverId,
      content: content.trim(),
    });

    if (error) {
      console.error('Message send error:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        profiles,
        hobbies,
        messages,
        isLoading,
        isLogingOut,
        login,
        signup,
        logout,
        updateProfile,
        submitVerification,
        updateVerificationStatus,
        sendMessage,
      }}
    >
      {/* Logout Loading Overlay */}
      {isLogingOut && (
        <div className="fixed inset-0 z-[9999] bg-zinc-950/95 backdrop-blur-md flex flex-col items-center justify-center gap-4">
          <div className="w-14 h-14 rounded-2xl border-2 border-purple-500/50 border-t-purple-400 animate-spin" />
          <p className="text-zinc-300 text-sm font-semibold tracking-wide animate-pulse">Signing you out…</p>
        </div>
      )}
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
