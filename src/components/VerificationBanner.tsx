'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/authContext';
import { ShieldAlert, Clock, ArrowRight, Camera } from 'lucide-react';

export function VerificationBanner() {
  const { currentUser } = useAuth();

  if (!currentUser) return null;

  if (currentUser.verification_status === 'verified') {
    return null; // Verified users get clean UI
  }

  if (currentUser.verification_status === 'pending') {
    return (
      <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-sm">
          <div className="flex items-center gap-2 text-amber-300 font-medium">
            <Clock className="w-4 h-4 shrink-0 text-amber-400 animate-pulse" />
            <span>
              Your CSJMU ID card is currently <strong>Under Review</strong> by campus admins.
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-zinc-400">
            <span>Restricted preview active</span>
            <Link
              href="/verify-id"
              className="text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-4 inline-flex items-center gap-1"
            >
              View submission <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-rose-950/50 via-purple-950/40 to-teal-950/50 border-b border-purple-500/30 px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-sm">
        <div className="flex items-center gap-2 text-zinc-200">
          <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
          <span>
            You are browsing in <strong>Restricted Mode</strong>. Verify your CSJMU ID to unlock photos, departments & direct messaging.
          </span>
        </div>
        <Link
          href="/verify-id"
          className="shrink-0 bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-500 hover:to-teal-400 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-glow-purple transition-all active:scale-95"
        >
          <Camera className="w-3.5 h-3.5" />
          Verify My CSJMU ID
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
