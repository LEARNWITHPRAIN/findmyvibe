'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { Mail, Lock, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const callbackError = searchParams.get('error');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await login(email, password);
      if (res.error) {
        setError(res.error);
      } else {
        if (res.isProfileComplete === false) {
          router.push('/me?setup=1');
        } else {
          router.push('/discover');
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-zinc-900/70 border border-zinc-800 rounded-2xl sm:rounded-3xl p-5 sm:p-8 backdrop-blur-xl shadow-2xl relative z-10">
      <div className="text-center mb-6 sm:mb-8">
        <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 relative rounded-2xl overflow-hidden shadow-lg border border-white/10">
          <Image src="/logo.jpg" alt="Find My Vibe" fill className="object-cover" />
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">Welcome Back</h1>
        <p className="text-xs text-zinc-400 mt-1">Log in to your Find My Vibe account</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        {callbackError === null && searchParams.get('verified') === '1' && (
          <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Email verified! You can now log in.</span>
          </div>
        )}

        {callbackError === 'auth_callback_failed' && (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>The email link expired or was already used. Please log in directly below.</span>
          </div>
        )}

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

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-500 hover:to-teal-400 text-white font-bold text-sm shadow-glow-purple transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          {loading ? 'Signing in...' : 'Sign In'}
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="text-center pt-4 border-t border-zinc-800">
          <p className="text-xs text-zinc-400">
            Don&apos;t have an account yet?{' '}
            <Link href="/signup" className="text-purple-400 hover:underline font-semibold">Sign up free</Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 relative">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-teal-500/15 blur-[120px] pointer-events-none" />
      <Suspense fallback={<div className="w-10 h-10 rounded-xl border-2 border-purple-500/50 border-t-purple-400 animate-spin" />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
