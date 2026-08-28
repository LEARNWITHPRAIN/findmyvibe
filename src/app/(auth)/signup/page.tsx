'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/authContext';
import { Mail, Lock, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

export default function SignUpPage() {
  const { sendMagicLink } = useAuth();

  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setError('Please enter your email.');
      return;
    }

    setLoading(true);
    try {
      const res = await sendMagicLink(cleanEmail);
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
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-3 relative rounded-2xl overflow-hidden shadow-lg border border-white/10">
            <Image src="/logo.jpg" alt="Find My Vibe" fill className="object-cover" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Join Find My Vibe
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Open to all CSJMU students — sign up with any email using Magic Link
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
                We&apos;ve sent a magic link to <strong className="text-teal-400">{email}</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-950/80 border border-purple-500/30 text-xs text-zinc-400 text-left space-y-2">
              <p className="font-semibold text-zinc-200">Next Step:</p>
              <p>
                1. Open your email inbox (and check Spam folder if needed).
              </p>
              <p>
                2. Click the secure link to instantly log in.
              </p>
              <p>
                3. Once verified, you will be automatically redirected to set up your profile and hobbies!
              </p>
            </div>

            <div className="pt-2 border-t border-zinc-800">
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs text-purple-400 hover:text-purple-300 font-semibold"
              >
                Didn&apos;t receive it? Try again
              </button>
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
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Email
              </label>
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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-purple-600 via-rose-500 to-teal-500 hover:from-purple-500 hover:to-teal-400 text-white font-bold text-sm shadow-glow-purple transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Sending link…' : 'Send Magic Link'}
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center pt-4 border-t border-zinc-800">
              <p className="text-xs text-zinc-400">
                Already have an account?{' '}
                <Link href="/login" className="text-teal-400 hover:underline font-semibold">
                  Log in
                </Link>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
