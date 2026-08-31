'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import {
  Compass,
  MessageSquare,
  ShieldCheck,
  User,
  LogOut,
  Menu,
  X,
  Layers,
  Info,
  MessageSquarePlus,
  Mail,
  Lock,
  FileText,
} from 'lucide-react';
import { FeedbackModal } from './FeedbackModal';

const ADMIN_EMAIL = 'prakharjain2731@gmail.com';

export default function Navbar() {
  const pathname = usePathname();
  const { currentUser, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  const isActive = (path: string) => pathname === path;
  const isAdmin = currentUser?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          {/* 1. Left: Brand Logo & Name */}
          <div className="flex items-center gap-2.5 shrink-0">
            <Link href={currentUser ? '/discover' : '/'} className="flex items-center gap-2 sm:gap-2.5 group">
              <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl overflow-hidden ring-1 ring-white/10 group-hover:ring-purple-500/50 transition-all shadow-glow-purple shrink-0">
                <Image
                  src="/logo.jpg"
                  alt="Find My Vibe Logo"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <span className="text-sm sm:text-lg font-black tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent group-hover:from-purple-300 group-hover:to-teal-300 transition-all hidden xs:inline">
                Find My Vibe
              </span>
            </Link>
          </div>

          {/* 2. Center: 3 Primary Navigation Buttons (Discover, Messages, Profile with Avatar) */}
          {currentUser && (
            <nav
              className="flex items-center p-1 rounded-2xl bg-zinc-900/90 border border-zinc-800/90 shadow-lg backdrop-blur-xl gap-0.5 sm:gap-1.5 mx-auto"
              aria-label="Main Navigation"
            >
              {/* Discover Tab */}
              <Link
                href="/discover"
                className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive('/discover')
                    ? 'bg-gradient-to-r from-purple-500/25 via-purple-600/20 to-teal-500/25 border border-purple-500/40 text-white shadow-glow-purple/20 scale-[1.02]'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60 font-medium'
                }`}
                title="Discover Students"
              >
                <Compass className={`w-4 h-4 transition-transform duration-300 ${isActive('/discover') ? 'text-purple-400 scale-110' : ''}`} />
                <span className="hidden sm:inline">Discover</span>
              </Link>

              {/* Messages Tab */}
              <Link
                href="/messages"
                className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive('/messages')
                    ? 'bg-gradient-to-r from-purple-500/25 via-teal-500/25 to-teal-600/20 border border-teal-500/40 text-white shadow-glow-teal/20 scale-[1.02]'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60 font-medium'
                }`}
                title="Messages"
              >
                <MessageSquare className={`w-4 h-4 transition-transform duration-300 ${isActive('/messages') ? 'text-teal-400 scale-110' : ''}`} />
                <span className="hidden sm:inline">Messages</span>
              </Link>

              {/* Profile Tab (Instagram style avatar) */}
              <Link
                href="/me"
                className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive('/me')
                    ? 'bg-gradient-to-r from-rose-500/25 via-purple-500/25 to-purple-600/20 border border-rose-500/40 text-white shadow-glow-purple/20 scale-[1.02]'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60 font-medium'
                }`}
                title="My Profile"
              >
                {currentUser.avatar_url ? (
                  <div className={`relative w-4 h-4 sm:w-5 sm:h-5 rounded-full overflow-hidden shrink-0 transition-all ${
                    isActive('/me') ? 'ring-2 ring-rose-400 ring-offset-1 ring-offset-zinc-950 scale-105' : 'ring-1 ring-zinc-700'
                  }`}>
                    <Image
                      src={currentUser.avatar_url}
                      alt={currentUser.full_name || 'Profile'}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gradient-to-br from-purple-500 to-teal-400 text-zinc-950 flex items-center justify-center font-bold text-[9px] sm:text-[10px] shrink-0 ${
                    isActive('/me') ? 'ring-2 ring-rose-400 ring-offset-1 ring-offset-zinc-950 scale-105' : ''
                  }`}>
                    {(currentUser.full_name || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="hidden sm:inline">Profile</span>
              </Link>
            </nav>
          )}

          {/* 3. Right: Quick Auth on Desktop + 3 Lines Menu Toggle on all devices */}
          <div className="flex items-center gap-2 shrink-0">
            {!currentUser && (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-900 rounded-lg transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="hidden sm:inline-flex px-3 py-1.5 text-xs font-semibold bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-500 hover:to-teal-400 text-white rounded-lg shadow-glow-purple transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* 3 Lines Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 border border-zinc-800/80 transition-colors cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown (Secondary utilities only — Discover, Messages & Profile live in the Bottom Nav) */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-800 bg-zinc-950/95 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-1 max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain shadow-2xl animate-in slide-in-from-top-2 duration-200">
          <Link
            href="/verify-id"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              isActive('/verify-id') ? 'bg-zinc-800 text-white' : 'text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            Verify My ID
          </Link>

          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              isActive('/about') ? 'bg-zinc-800 text-white' : 'text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <Info className="w-4 h-4 text-purple-400" />
            About Community
          </Link>

          <Link
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              isActive('/contact') ? 'bg-zinc-800 text-white' : 'text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <Mail className="w-4 h-4 text-teal-400" />
            Contact Us
          </Link>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              setFeedbackOpen(true);
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-200 hover:bg-zinc-900 transition-colors text-left cursor-pointer"
          >
            <MessageSquarePlus className="w-4 h-4 text-teal-400" />
            Give Feedback / Report Bug
          </button>

          <Link
            href="/privacy"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              isActive('/privacy') ? 'bg-zinc-800 text-white' : 'text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <Lock className="w-4 h-4 text-teal-400" />
            Privacy Policy
          </Link>

          <Link
            href="/terms"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              isActive('/terms') ? 'bg-zinc-800 text-white' : 'text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <FileText className="w-4 h-4 text-purple-400" />
            Terms & Conditions
          </Link>

          {isAdmin && (
            <Link
              href="/admin/verifications"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-purple-300 hover:bg-purple-950/40"
            >
              <Layers className="w-4 h-4 text-purple-400" />
              Admin Panel
            </Link>
          )}

          {currentUser ? (
            <div className="pt-2 border-t border-zinc-800">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-rose-400 hover:bg-rose-950/30 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-zinc-800 flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-zinc-300 bg-zinc-900 hover:bg-zinc-800 transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-teal-500 shadow-glow-purple"
              >
                Sign Up Free
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Reusable Feedback Modal triggered from Navbar */}
      <FeedbackModal isOpen={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
    </header>
  );
}
export { Navbar };
