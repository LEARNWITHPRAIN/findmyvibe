'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Profile, Hobby, Message, VerificationStatus } from './types';
import { INITIAL_PROFILES, INITIAL_HOBBIES, INITIAL_MESSAGES } from './mockData';
import { createClient } from './supabase/client';

const ADMIN_EMAIL = 'prakharjain2731@gmail.com';

interface AuthContextType {
  currentUser: Profile | null;
  profiles: Profile[];
  hobbies: Hobby[];
  messages: Message[];
  isLoading: boolean;
  isLogingOut: boolean;
  isSupabaseConfigured: boolean;
  login: (email: string, pass: string) => Promise<{ error?: string }>;
  signup: (email: string, pass: string) => Promise<{ error?: string; requiresEmailConfirm?: boolean }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  submitVerification: (idCardDataUrl: string) => Promise<void>;
  updateVerificationStatus: (userId: string, status: VerificationStatus) => Promise<void>;
  sendMessage: (receiverId: string, content: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_USER = 'fmv_current_user';
const LOCAL_STORAGE_KEY_PROFILES = 'fmv_profiles';
const LOCAL_STORAGE_KEY_MESSAGES = 'fmv_messages';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>(INITIAL_PROFILES);
  const [hobbies] = useState<Hobby[]>(INITIAL_HOBBIES);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [isLoading, setIsLoading] = useState(true);
  const [isLogingOut, setIsLogingOut] = useState(false);
  const [isSupabaseConfigured, setIsSupabaseConfigured] = useState(false);

  // Initialize state from local storage or defaults
  useEffect(() => {
    try {
      const storedProfiles = localStorage.getItem(LOCAL_STORAGE_KEY_PROFILES);
      const storedMessages = localStorage.getItem(LOCAL_STORAGE_KEY_MESSAGES);
      const storedUser = localStorage.getItem(LOCAL_STORAGE_KEY_USER);

      if (storedProfiles) {
        setProfiles(JSON.parse(storedProfiles));
      } else {
        localStorage.setItem(LOCAL_STORAGE_KEY_PROFILES, JSON.stringify(INITIAL_PROFILES));
      }

      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      } else {
        localStorage.setItem(LOCAL_STORAGE_KEY_MESSAGES, JSON.stringify(INITIAL_MESSAGES));
      }

      // Only restore a real (non-demo) user session
      if (storedUser) {
        const parsed: Profile = JSON.parse(storedUser);
        // Don't auto-restore demo accounts
        if (!parsed.is_demo) {
          setCurrentUser(parsed);
        } else {
          // Clear stale demo session
          localStorage.removeItem(LOCAL_STORAGE_KEY_USER);
          setCurrentUser(null);
        }
      } else {
        // No stored session — start as logged-out guest
        setCurrentUser(null);
      }

      // Check if real Supabase credentials are configured
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (
        supabaseUrl &&
        supabaseUrl.startsWith('http') &&
        !supabaseUrl.includes('placeholder') &&
        supabaseAnonKey &&
        !supabaseAnonKey.includes('placeholder')
      ) {
        setIsSupabaseConfigured(true);
      }
    } catch (e) {
      console.error('Error loading initial session', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save changes to localStorage helper
  const persistUser = (user: Profile | null) => {
    setCurrentUser(user);
    if (user) {
      localStorage.setItem(LOCAL_STORAGE_KEY_USER, JSON.stringify(user));
      // Also update in profiles list (only for real users)
      if (!user.is_demo) {
        setProfiles((prev) => {
          const index = prev.findIndex((p) => p.id === user.id);
          const next = index >= 0 ? [...prev.slice(0, index), user, ...prev.slice(index + 1)] : [user, ...prev];
          localStorage.setItem(LOCAL_STORAGE_KEY_PROFILES, JSON.stringify(next));
          return next;
        });
      }
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY_USER);
    }
  };

  const login = async (email: string, _pass: string) => {
    // 1. If Supabase is connected, attempt auth
    if (isSupabaseConfigured) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.auth.signInWithPassword({ email, password: _pass });
        if (error) return { error: error.message };
        if (data.user) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*, hobbies:profile_hobbies(hobby:hobbies(*))')
            .eq('id', data.user.id)
            .single();

          if (profileData) {
            const isAdmin = profileData.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
            persistUser({ ...profileData, is_admin: isAdmin });
            return {};
          }
        }
      } catch (err: unknown) {
        console.warn('Supabase login failed, using fallback:', err);
      }
    }

    // 2. Demo fallback login — create a fresh real (non-demo) user
    const isAdmin = email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
    const newUser: Profile = {
      id: `usr_real_${Date.now()}`,
      full_name: email.split('@')[0].replace('.', ' '),
      department: 'CSJMU',
      year: '1',
      gender: 'Prefer not to say',
      college: 'CSJMU',
      email_verified: true,
      verification_status: 'unverified',
      is_admin: isAdmin,
      is_demo: false,
      created_at: new Date().toISOString(),
      email,
      hobbies: [],
    };

    persistUser(newUser);
    return {};
  };

  const signup = async (email: string, _pass: string) => {
    if (isSupabaseConfigured) {
      try {
        const supabase = createClient();
        const { error } = await supabase.auth.signUp({
          email,
          password: _pass,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) return { error: error.message };
        return { requiresEmailConfirm: true };
      } catch (err: unknown) {
        console.warn('Supabase signup fallback:', err);
      }
    }

    // Demo signup — new real (non-demo) user
    const isAdmin = email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
    const newUser: Profile = {
      id: `usr_real_${Date.now()}`,
      full_name: email.split('@')[0].replace('.', ' '),
      department: 'CSJMU',
      year: '1',
      gender: 'Prefer not to say',
      college: 'CSJMU',
      email_verified: false,
      verification_status: 'unverified',
      is_admin: isAdmin,
      is_demo: false,
      created_at: new Date().toISOString(),
      email,
      hobbies: [],
    };

    persistUser(newUser);
    return { requiresEmailConfirm: true };
  };

  const logout = async () => {
    setIsLogingOut(true);
    if (isSupabaseConfigured) {
      const supabase = createClient();
      await supabase.auth.signOut();
    }
    // Wait for 1.5 seconds to show loading, then clear
    await new Promise((resolve) => setTimeout(resolve, 1500));
    persistUser(null);
    setIsLogingOut(false);
    router.push('/');
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates, updated_at: new Date().toISOString() };
    persistUser(updated);

    if (isSupabaseConfigured) {
      try {
        const supabase = createClient();
        await supabase.from('profiles').update(updates).eq('id', currentUser.id);
      } catch (err) {
        console.error('Supabase profile update error:', err);
      }
    }
  };

  const submitVerification = async (idCardDataUrl: string) => {
    if (!currentUser) return;
    const updated: Profile = {
      ...currentUser,
      id_card_url: idCardDataUrl,
      verification_status: 'pending',
    };
    persistUser(updated);

    if (isSupabaseConfigured) {
      try {
        const supabase = createClient();
        await supabase.from('profiles').update({
          id_card_url: idCardDataUrl,
          verification_status: 'pending',
        }).eq('id', currentUser.id);
      } catch (err) {
        console.error('Supabase verification submission error:', err);
      }
    }
  };

  const updateVerificationStatus = async (userId: string, status: VerificationStatus) => {
    setProfiles((prev) => {
      const next = prev.map((p) => (p.id === userId ? { ...p, verification_status: status } : p));
      localStorage.setItem(LOCAL_STORAGE_KEY_PROFILES, JSON.stringify(next));
      return next;
    });

    if (currentUser?.id === userId) {
      persistUser({ ...currentUser, verification_status: status });
    }

    if (isSupabaseConfigured) {
      try {
        const supabase = createClient();
        await supabase.from('profiles').update({ verification_status: status }).eq('id', userId);
      } catch (err) {
        console.error('Supabase update verification status error:', err);
      }
    }
  };

  const sendMessage = async (receiverId: string, content: string) => {
    if (!currentUser) {
      return { success: false, error: 'Please login first' };
    }

    if (currentUser.verification_status !== 'verified') {
      return { success: false, error: 'Verify your ID to start messaging other students.' };
    }

    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      sender_id: currentUser.id,
      receiver_id: receiverId,
      content: content.trim(),
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => {
      const next = [...prev, newMsg];
      localStorage.setItem(LOCAL_STORAGE_KEY_MESSAGES, JSON.stringify(next));
      return next;
    });

    if (isSupabaseConfigured) {
      try {
        const supabase = createClient();
        await supabase.from('messages').insert({
          sender_id: currentUser.id,
          receiver_id: receiverId,
          content: content.trim(),
        });
      } catch (err) {
        console.error('Supabase message error:', err);
      }
    }

    return { success: true };
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        profiles,
        hobbies,
        messages,
        isLoading,
        isLogingOut,
        isSupabaseConfigured,
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
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
