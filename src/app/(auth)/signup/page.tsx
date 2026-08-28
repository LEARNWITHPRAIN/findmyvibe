'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/authContext';
import { Mail, Lock, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

export default function SignUpPage() {
  const { signup } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setError('Please enter your email and a password.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await signup(cleanEmail, password);
      if (res.error) {
        setError(res.error);
      } else {
        setSubmitted(true);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong during sign up.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 relative">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/15 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-zinc-900/70 border border-zinc-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-3 relative rounded-2xl overflow-hidden shadow-lg border border-white/10">
            <Image src="/logo.jpg" alt="Find My Vibe" fill className="object-cover" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Join Find My Vibe</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Unofficial student network for all CSJMU hostellers, day scholars & campus residents
          </p>
        </div>

        {submitted ? (
          <div className="text-center py-4 space-y-5 animate-fade-in">
            <div className="w-16 h-16 bg-teal-500/20 border border-teal-500/40 rounded-full flex items-center justify-center mx-auto text-teal-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Check Your Inbox!</h2>
              <p className="text-xs text-zinc-300 leading-relaxed max-w-xs mx-auto mt-2">
                We&apos;ve sent a verification link to <strong className="text-teal-400">{email}</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-950/80 border border-purple-500/30 text-xs text-zinc-400 text-left space-y-2">
              <p className="font-semibold text-zinc-200">Next Steps:</p>
              <p>1. Open your email inbox (check Spam if needed).</p>
              <p>2. Click the confirmation link to verify your account.</p>
              <p>3. Come back and log in with your email and password!</p>
            </div>

            <div className="pt-2 border-t border-zinc-800">
              <Link href="/login" className="text-xs text-purple-400 hover:text-purple-300 font-semibold">
                Already verified? Go to Log In →
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-purple-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-purple-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-purple-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>

            {/* Privacy notice note */}
            <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800 text-[11px] text-zinc-400 space-y-1">
              <p>
                🔒 <strong className="text-zinc-300">Privacy Notice:</strong> Student IDs are collected solely to verify enrolled student status and are deleted immediately after review.
              </p>
              <p className="text-[10px] text-zinc-500">
                By signing up, you agree to our{' '}
                <Link href="/terms" className="text-purple-400 hover:underline">Terms</Link> and{' '}
                <Link href="/privacy" className="text-purple-400 hover:underline">Privacy Policy</Link>.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-purple-600 via-rose-500 to-teal-500 hover:from-purple-500 hover:to-teal-400 text-white font-bold text-sm shadow-glow-purple transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Creating Account...' : 'Create My Account'}
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center pt-4 border-t border-zinc-800">
              <p className="text-xs text-zinc-400">
                Already have an account?{' '}
                <Link href="/login" className="text-teal-400 hover:underline font-semibold">Log in</Link>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
