'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { Compass, MessageCircle, User } from 'lucide-react';

export function BottomNavbar() {
  const pathname = usePathname();
  const { currentUser, isLoading } = useAuth();

  // ONLY render when user is signed in and NOT on landing page or auth pages
  if (isLoading || !currentUser) return null;
  if (pathname === '/' || pathname === '/login' || pathname === '/signup' || pathname === '/auth/callback') {
    return null;
  }

  const isDiscoverActive = pathname === '/discover';
  const isMessagesActive = pathname.startsWith('/messages');
  const isProfileActive = pathname === '/me' || (currentUser && pathname === `/profile/${currentUser.id}`);

  return (
    <div
      className="fixed bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-50 w-[min(94%,420px)] pointer-events-auto select-none"
      role="navigation"
      aria-label="Bottom Navigation"
    >
      <nav className="relative flex items-center justify-between p-1.5 rounded-3xl bg-zinc-950/85 backdrop-blur-2xl border border-zinc-800/90 shadow-[0_10px_35px_rgba(0,0,0,0.65),0_0_1px_1px_rgba(255,255,255,0.06)] ring-1 ring-white/5 transition-all duration-300">
        {/* Glow ambient background behind the navigation bar */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-600/10 via-rose-500/10 to-teal-500/10 pointer-events-none blur-xl -z-10" />

        {/* 1. Discover Tab */}
        <Link
          href="/discover"
          className={`relative flex-1 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-2 sm:py-2.5 px-3 rounded-2xl transition-all duration-300 group cursor-pointer ${
            isDiscoverActive
              ? 'bg-gradient-to-r from-purple-500/20 via-purple-600/15 to-teal-500/20 border border-purple-500/40 text-white shadow-[0_0_20px_rgba(168,85,247,0.25)] font-bold scale-[1.02]'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60 font-medium'
          }`}
          aria-current={isDiscoverActive ? 'page' : undefined}
        >
          <div className="relative flex items-center justify-center">
            <Compass
              className={`w-5 h-5 sm:w-5 sm:h-5 transition-transform duration-300 ${
                isDiscoverActive
                  ? 'text-purple-400 scale-110'
                  : 'group-hover:scale-110 group-hover:text-purple-300'
              }`}
            />
            {isDiscoverActive && (
              <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-purple-400 animate-pulse sm:hidden" />
            )}
          </div>
          <span className="text-[11px] sm:text-xs tracking-tight">Discover</span>
        </Link>

        {/* 2. Messages Tab */}
        <Link
          href="/messages"
          className={`relative flex-1 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-2 sm:py-2.5 px-3 rounded-2xl transition-all duration-300 group cursor-pointer ${
            isMessagesActive
              ? 'bg-gradient-to-r from-purple-500/20 via-teal-500/20 to-teal-600/15 border border-teal-500/40 text-white shadow-[0_0_20px_rgba(20,184,166,0.25)] font-bold scale-[1.02]'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60 font-medium'
          }`}
          aria-current={isMessagesActive ? 'page' : undefined}
        >
          <div className="relative flex items-center justify-center">
            <MessageCircle
              className={`w-5 h-5 sm:w-5 sm:h-5 transition-transform duration-300 ${
                isMessagesActive
                  ? 'text-teal-400 scale-110'
                  : 'group-hover:scale-110 group-hover:text-teal-300'
              }`}
            />
            {isMessagesActive && (
              <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-teal-400 animate-pulse sm:hidden" />
            )}
          </div>
          <span className="text-[11px] sm:text-xs tracking-tight">Messages</span>
        </Link>

        {/* 3. Profile Tab (Instagram-Style Avatar) */}
        <Link
          href="/me"
          className={`relative flex-1 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-2 sm:py-2.5 px-3 rounded-2xl transition-all duration-300 group cursor-pointer ${
            isProfileActive
              ? 'bg-gradient-to-r from-rose-500/20 via-purple-500/20 to-purple-600/15 border border-rose-500/40 text-white shadow-[0_0_20px_rgba(244,63,94,0.25)] font-bold scale-[1.02]'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60 font-medium'
          }`}
          aria-current={isProfileActive ? 'page' : undefined}
        >
          <div className="relative flex items-center justify-center">
            {currentUser?.avatar_url ? (
              <div
                className={`relative w-5 h-5 sm:w-6 sm:h-6 rounded-full overflow-hidden transition-all duration-300 ${
                  isProfileActive
                    ? 'ring-2 ring-rose-400 ring-offset-2 ring-offset-zinc-950 scale-105'
                    : 'ring-1 ring-zinc-700 group-hover:ring-zinc-500 group-hover:scale-105'
                }`}
              >
                <Image
                  src={currentUser.avatar_url}
                  alt={currentUser.full_name || 'Profile'}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ) : currentUser ? (
              <div
                className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br from-purple-600 via-rose-500 to-teal-500 text-white font-black text-[10px] sm:text-xs flex items-center justify-center transition-all duration-300 ${
                  isProfileActive
                    ? 'ring-2 ring-rose-400 ring-offset-2 ring-offset-zinc-950 scale-105 shadow-glow-purple'
                    : 'ring-1 ring-zinc-700 group-hover:scale-105'
                }`}
              >
                {(currentUser.full_name || 'U').charAt(0).toUpperCase()}
              </div>
            ) : (
              <User
                className={`w-5 h-5 sm:w-5 sm:h-5 transition-transform duration-300 ${
                  isProfileActive
                    ? 'text-rose-400 scale-110'
                    : 'group-hover:scale-110 group-hover:text-rose-300'
                }`}
              />
            )}
            {isProfileActive && (
              <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-rose-400 animate-pulse sm:hidden" />
            )}
          </div>
          <span className="text-[11px] sm:text-xs tracking-tight">Profile</span>
        </Link>
      </nav>
    </div>
  );
}
