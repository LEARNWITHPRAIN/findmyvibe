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
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <Link href={currentUser ? '/discover' : '/'} className="flex items-center gap-2.5 group">
              <div className="relative w-9 h-9 rounded-xl overflow-hidden ring-1 ring-white/10 group-hover:ring-purple-500/50 transition-all shadow-glow-purple">
                <Image
                  src="/logo.jpg"
                  alt="Find My Vibe Logo"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-lg font-black tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent group-hover:from-purple-300 group-hover:to-teal-300 transition-all">
                  Find My Vibe
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/discover"
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isActive('/discover')
                  ? 'bg-zinc-800 text-white shadow-inner'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
              }`}
            >
              <Compass className="w-4 h-4 text-purple-400" />
              Discover
            </Link>

            <Link
              href="/messages"
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isActive('/messages')
                  ? 'bg-zinc-800 text-white shadow-inner'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-teal-400" />
              Messages
            </Link>

            <Link
              href="/verify-id"
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isActive('/verify-id')
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              ID Verification
            </Link>

            <Link
              href="/about"
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isActive('/about')
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
              }`}
            >
              <Info className="w-3.5 h-3.5 text-purple-400" />
              About
            </Link>

            <button
              onClick={() => setFeedbackOpen(true)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-all cursor-pointer"
            >
              <MessageSquarePlus className="w-3.5 h-3.5 text-teal-400" />
              Feedback
            </button>

            {/* Admin link — only for the admin account */}
            {isAdmin && (
              <Link
                href="/admin/verifications"
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isActive('/admin/verifications')
                    ? 'bg-purple-950/60 border border-purple-500/50 text-purple-300'
                    : 'text-zinc-500 hover:text-purple-400 hover:bg-purple-950/20'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                Admin Review
              </Link>
            )}
          </nav>

          {/* Right: User Controls */}
          <div className="hidden md:flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/me"
                  className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs font-semibold text-zinc-200 transition-colors"
                >
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-500 to-teal-400 text-zinc-950 flex items-center justify-center font-bold text-xs overflow-hidden">
                    {currentUser.avatar_url ? (
                      <Image src={currentUser.avatar_url} alt={currentUser.full_name} width={24} height={24} className="object-cover w-full h-full" unoptimized />
                    ) : (
                      currentUser.full_name?.charAt(0) || 'U'
                    )}
                  </div>
                  <span className="max-w-[100px] truncate">{currentUser.full_name}</span>
                  {currentUser.verification_status === 'verified' && (
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                  )}
                </Link>

                <button
                  onClick={() => logout()}
                  className="p-2 rounded-xl text-zinc-400 hover:text-rose-400 hover:bg-zinc-900 transition-colors"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3.5 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-900 rounded-lg transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-3.5 py-1.5 text-xs font-semibold bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-500 hover:to-teal-400 text-white rounded-lg shadow-glow-purple transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
