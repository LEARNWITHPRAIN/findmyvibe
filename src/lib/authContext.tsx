'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Profile, Hobby, Message, VerificationStatus } from './types';
import { INITIAL_PROFILES, INITIAL_HOBBIES, INITIAL_MESSAGES } from './mockData';
import { createClient } from './supabase/client';

interface AuthContextType {
  currentUser: Profile | null;
  profiles: Profile[];
  hobbies: Hobby[];
  messages: Message[];
  isLoading: boolean;
  isSupabaseConfigured: boolean;
  login: (email: string, pass: string) => Promise<{ error?: string }>;
  signup: (email: string, pass: string) => Promise<{ error?: string; requiresEmailConfirm?: boolean }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  submitVerification: (idCardDataUrl: string) => Promise<void>;
  updateVerificationStatus: (userId: string, status: VerificationStatus) => Promise<void>;
  sendMessage: (receiverId: string, content: string) => Promise<{ success: boolean; error?: string }>;
  switchDemoRole: (role: 'unverified' | 'pending' | 'verified' | 'admin') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_USER = 'fmv_current_user';
const LOCAL_STORAGE_KEY_PROFILES = 'fmv_profiles';
const LOCAL_STORAGE_KEY_MESSAGES = 'fmv_messages';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>(INITIAL_PROFILES);
  const [hobbies] = useState<Hobby[]>(INITIAL_HOBBIES);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [isLoading, setIsLoading] = useState(true);
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

      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      } else {
        // Default initial session: Aarav (verified) or demo student
        const defaultUser: Profile = {
          ...INITIAL_PROFILES[0],
          is_admin: true, // Default to admin toggle available for full inspection
        };
        setCurrentUser(defaultUser);
        localStorage.setItem(LOCAL_STORAGE_KEY_USER, JSON.stringify(defaultUser));
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
      // Also update in profiles list
      setProfiles((prev) => {
        const index = prev.findIndex((p) => p.id === user.id);
        const next = index >= 0 ? [...prev.slice(0, index), user, ...prev.slice(index + 1)] : [user, ...prev];
        localStorage.setItem(LOCAL_STORAGE_KEY_PROFILES, JSON.stringify(next));
        return next;
      });
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
          // Fetch profile
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*, hobbies:profile_hobbies(hobby:hobbies(*))')
            .eq('id', data.user.id)
            .single();

          if (profileData) {
            persistUser(profileData);
            return {};
          }
        }
      } catch (err: unknown) {
        console.warn('Supabase login failed, using fallback:', err);
      }
    }

    // 2. Demo fallback login
    const existing = profiles.find((p) => p.email?.toLowerCase() === email.toLowerCase()) || {
      id: `usr_${Date.now()}`,
      full_name: email.split('@')[0],
      department: 'Computer Science (UIET)',
      year: '2',
      gender: 'Other',
      college: 'CSJMU',
      email_verified: true,
      verification_status: 'unverified' as VerificationStatus,
      is_admin: email.includes('admin'),
      created_at: new Date().toISOString(),
      email,
      hobbies: [INITIAL_HOBBIES[2]],
    };

    persistUser(existing);
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

    // Demo signup
    const newUser: Profile = {
      id: `usr_${Date.now()}`,
      full_name: email.split('@')[0],
      department: 'UIET - CSJMU',
      year: '1',
      gender: 'Prefer not to say',
      college: 'CSJMU',
      email_verified: false,
      verification_status: 'unverified',
      is_admin: false,
      created_at: new Date().toISOString(),
      email,
      hobbies: [],
    };

    persistUser(newUser);
    return { requiresEmailConfirm: true };
  };

  const logout = async () => {
    if (isSupabaseConfigured) {
      const supabase = createClient();
      await supabase.auth.signOut();
    }
    persistUser(null);
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
        // Update profile verification status
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

  // Demo Switcher Helper for instant test verification flows
  const switchDemoRole = (role: 'unverified' | 'pending' | 'verified' | 'admin') => {
    if (!currentUser) return;
    let updated: Profile;
    if (role === 'unverified') {
      updated = {
        ...currentUser,
        verification_status: 'unverified',
        is_admin: false,
        id_card_url: null,
      };
    } else if (role === 'pending') {
      updated = {
        ...currentUser,
        verification_status: 'pending',
        is_admin: false,
        id_card_url: 'https://images.unsplash.com/photo-1589386417686-0d34b5903d23?w=600&auto=format&fit=crop&q=80',
      };
    } else if (role === 'verified') {
      updated = {
        ...currentUser,
        verification_status: 'verified',
        is_admin: false,
      };
    } else {
      updated = {
        ...currentUser,
        verification_status: 'verified',
        is_admin: true,
      };
    }
    persistUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        profiles,
        hobbies,
        messages,
        isLoading,
        isSupabaseConfigured,
        login,
        signup,
        logout,
        updateProfile,
        submitVerification,
        updateVerificationStatus,
        sendMessage,
        switchDemoRole,
      }}
    >
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
