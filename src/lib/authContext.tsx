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
  sendMagicLink: (email: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  submitVerification: (idCardDataUrl: string) => Promise<void>;
  updateVerificationStatus: (userId: string, status: VerificationStatus) => Promise<{ success: boolean; error?: string }>;
  sendMessage: (receiverId: string, content: string) => Promise<{ success: boolean; error?: string }>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─────────────────────────────────────────────────────────────────────────────
// Helper: load full profile row from Supabase
// ─────────────────────────────────────────────────────────────────────────────
async function fetchProfile(supabase: ReturnType<typeof createClient>, userId: string): Promise<Profile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*, profile_hobbies(hobby:hobbies(*))')
      .eq('id', userId)
      .single();

    if (error || !data) return null;

    const hobbies: Hobby[] = (data.profile_hobbies ?? []).map(
      (ph: { hobby: Hobby }) => ph.hobby
    );

    const email = (data.email ?? '').toLowerCase();
    const isAdmin = email === ADMIN_EMAIL.toLowerCase();

    return { ...data, hobbies, is_admin: isAdmin, email_verified: true } as Profile;
  } catch (e) {
    console.error('fetchProfile error', e);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Helper: load all profiles for discover feed & admin review
// ─────────────────────────────────────────────────────────────────────────────
async function fetchAllProfiles(supabase: ReturnType<typeof createClient>): Promise<Profile[]> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*, profile_hobbies(hobby:hobbies(*))')
      .order('created_at', { ascending: false });

    if (error || !data) return INITIAL_PROFILES;

    const realProfiles: Profile[] = data.map((row: Record<string, unknown>) => {
      const hobbies: Hobby[] = ((row.profile_hobbies as { hobby: Hobby }[]) ?? []).map(
        (ph) => ph.hobby
      );
      const email = (row.email as string) ?? '';
      const isAdmin = email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
      return { ...row, hobbies, is_admin: isAdmin, is_demo: false, email_verified: true } as Profile;
    });

    return [...realProfiles, ...INITIAL_PROFILES];
  } catch (e) {
    console.error('fetchAllProfiles error', e);
    return INITIAL_PROFILES;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Helper: load user messages
// ─────────────────────────────────────────────────────────────────────────────
async function fetchUserMessages(supabase: ReturnType<typeof createClient>, userId: string): Promise<Message[]> {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('created_at', { ascending: true });

    if (error || !data) return INITIAL_MESSAGES;
    return [...INITIAL_MESSAGES, ...data];
  } catch {
    return INITIAL_MESSAGES;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const supabase = createClient();

  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>(INITIAL_PROFILES);
  const [hobbies] = useState<Hobby[]>(INITIAL_HOBBIES);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [isLoading, setIsLoading] = useState(true);
  const [isLogingOut, setIsLogingOut] = useState(false);

  const refreshSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const profile = await fetchProfile(supabase, session.user.id);
        if (profile) setCurrentUser(profile);
        const msgs = await fetchUserMessages(supabase, session.user.id);
        setMessages(msgs);
      }
      const allProfiles = await fetchAllProfiles(supabase);
      setProfiles(allProfiles);
    } catch (e) {
      console.error('Refresh session error:', e);
    }
  };

  // ─── On mount: restore session ────────────────────────────────────────────
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user && mounted) {
          const profile = await fetchProfile(supabase, session.user.id);
          if (mounted && profile) setCurrentUser(profile);

          const msgs = await fetchUserMessages(supabase, session.user.id);
          if (mounted) setMessages(msgs);
        }

        const allProfiles = await fetchAllProfiles(supabase);
        if (mounted) setProfiles(allProfiles);
      } catch (err) {
        console.error('Session init error:', err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    init();

    // ─── Auth State Listener ──────────────────────────────────────────────────
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (event === 'SIGNED_IN' && session?.user) {
        const profile = await fetchProfile(supabase, session.user.id);
        setCurrentUser(profile);
        const allProfiles = await fetchAllProfiles(supabase);
        setProfiles(allProfiles);
        const msgs = await fetchUserMessages(supabase, session.user.id);
        setMessages(msgs);
      }

      if (event === 'SIGNED_OUT') {
        setCurrentUser(null);
        setProfiles(INITIAL_PROFILES);
        setMessages(INITIAL_MESSAGES);
      }

      if (event === 'TOKEN_REFRESHED' && session?.user) {
        const profile = await fetchProfile(supabase, session.user.id);
        if (profile) setCurrentUser(profile);
      }
    });

    // ─── Realtime Message Subscription ───────────────────────────────────────
    const messageSubscription = supabase
      .channel('public:messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          const newMsg = payload.new as Message;
          setMessages((prev) => {
            if (prev.find(m => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      subscription.unsubscribe();
      messageSubscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Auth actions ──────────────────────────────────────────────────────────

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) {
      return { error: error.message };
    }

    if (data.user) {
      const profile = await fetchProfile(supabase, data.user.id);
      if (profile) setCurrentUser(profile);
    }

    return {};
  };

  const signup = async (email: string, password: string) => {
    const cleanEmail = email.trim().toLowerCase();

    // Check if account already exists with this email
    const { data: existingProfiles } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', cleanEmail)
      .limit(1);

    if (existingProfiles && existingProfiles.length > 0) {
      return { error: 'An account with this email already exists. Please log in.' };
    }

    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      return { error: error.message };
    }

    // Check for duplicate signups where Supabase returns empty identities
    if (data?.user && data.user.identities && data.user.identities.length === 0) {
      return { error: 'An account with this email already exists. Please log in instead.' };
    }

    return { requiresEmailConfirm: true };
  };

  const sendMagicLink = async (email: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const { error } = await supabase.auth.signInWithOtp({
      email: cleanEmail,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      return { error: error.message };
    }
    return {};
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

    const updatedUser = { ...currentUser, ...updates, updated_at: new Date().toISOString() };
    setCurrentUser(updatedUser);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { hobbies: _hobbies, is_demo: _demo, is_admin: _admin, ...safeUpdates } = updates as Record<string, unknown>;

    const { error } = await supabase
      .from('profiles')
      .update({ ...safeUpdates, updated_at: new Date().toISOString() })
      .eq('id', currentUser.id);

    if (error) {
      console.error('Profile update error:', error.message);
    }

    if (updates.hobbies && Array.isArray(updates.hobbies)) {
      await supabase.from('profile_hobbies').delete().eq('profile_id', currentUser.id);
      const rows = (updates.hobbies as Hobby[])
        .filter((h) => typeof h === 'object' && h.id < 90)
        .map((h) => ({ profile_id: currentUser.id, hobby_id: h.id }));
      if (rows.length > 0) {
        await supabase.from('profile_hobbies').insert(rows);
      }
    }

    const allProfiles = await fetchAllProfiles(supabase);
    setProfiles(allProfiles);
  };

  const submitVerification = async (idCardDataUrl: string) => {
    if (!currentUser) return;

    const updated = { ...currentUser, id_card_url: idCardDataUrl, verification_status: 'pending' as VerificationStatus };
    setCurrentUser(updated);

    await supabase
      .from('profiles')
      .update({ id_card_url: idCardDataUrl, verification_status: 'pending' })
      .eq('id', currentUser.id);

    const allProfiles = await fetchAllProfiles(supabase);
    setProfiles(allProfiles);
  };

  const updateVerificationStatus = async (userId: string, status: VerificationStatus) => {
    try {
      // 1. Update in local state immediately
      setProfiles((prev) => prev.map((p) => (p.id === userId ? { ...p, verification_status: status } : p)));
      if (currentUser?.id === userId) {
        setCurrentUser((prev) => (prev ? { ...prev, verification_status: status } : prev));
      }

      // 2. Persist to Supabase
      const { error } = await supabase
        .from('profiles')
        .update({ verification_status: status, updated_at: new Date().toISOString() })
        .eq('id', userId);

      if (error) {
        console.error('Admin update verification status error:', error.message);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (e) {
      console.error('updateVerificationStatus exception:', e);
      return { success: false, error: 'Failed to update verification status.' };
    }
  };

  // ─── Messaging ─────────────────────────────────────────────────────────────

  const sendMessage = async (receiverId: string, content: string) => {
    if (!currentUser) return { success: false, error: 'Please log in first.' };

    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      sender_id: currentUser.id,
      receiver_id: receiverId,
      content: content.trim(),
      created_at: new Date().toISOString(),
    };

    // Optimistic UI update
    setMessages((prev) => [...prev, newMsg]);

    // Check if receiverId is a valid UUID (real user)
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(receiverId);

    if (isUuid) {
      const { error } = await supabase.from('messages').insert({
        sender_id: currentUser.id,
        receiver_id: receiverId,
        content: content.trim(),
      });

      if (error) {
        console.error('Message send error:', error.message);
        return { success: false, error: error.message };
      }
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
        sendMagicLink,
        logout,
        updateProfile,
        submitVerification,
        updateVerificationStatus,
        sendMessage,
        refreshSession,
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
