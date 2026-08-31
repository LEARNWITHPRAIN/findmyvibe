'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/authContext';
import {
  ShieldAlert,
  Clock,
  ArrowRight,
  Camera,
  ShieldCheck,
  Sparkles,
  Users,
  X,
  CheckCircle2,
} from 'lucide-react';

export function VerificationBanner() {
  const { currentUser } = useAuth();
  const [showCongratsModal, setShowCongratsModal] = useState(false);

  useEffect(() => {
    if (currentUser && currentUser.verification_status === 'verified') {
      const storageKey = `fmv_verified_celebrated_${currentUser.id}`;
      const hasCelebrated = localStorage.getItem(storageKey);
      if (!hasCelebrated) {
        setShowCongratsModal(true);
      }
    }
  }, [currentUser]);

  const handleDismissCongrats = () => {
    if (currentUser) {
      localStorage.setItem(`fmv_verified_celebrated_${currentUser.id}`, 'true');
    }
    setShowCongratsModal(false);
  };

  if (!currentUser) return null;

  return (
    <>
      {/* Congrats Popup Modal for newly verified students */}
      {showCongratsModal && currentUser.verification_status === 'verified' && (
        <div className="fixed inset-0 z-[100] bg-zinc-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fade-in">
          <div className="relative w-full max-w-lg bg-zinc-900 border border-teal-500/40 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl shadow-teal-500/10 text-center space-y-5 sm:space-y-6 overflow-hidden max-h-[92dvh] overflow-y-auto">
            {/* Ambient Glow */}
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

            {/* Close icon */}
            <button
              onClick={handleDismissCongrats}
              className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Shield / Success Icon */}
            <div className="relative mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-teal-500/20 to-purple-500/20 border-2 border-teal-400/50 flex items-center justify-center text-teal-400 shadow-glow-teal">
              <ShieldCheck className="w-8 h-8 sm:w-10 sm:h-10 animate-bounce" />
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-zinc-950 p-1 rounded-full ring-2 ring-zinc-900">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/40 mb-2">
                🎉 ID Verification Approved
              </div>
              <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight">
                Congratulations, {currentUser.full_name || 'Student'}!
              </h2>
              <p className="text-xs sm:text-sm text-zinc-300 mt-2 leading-relaxed">
                Your CSJMU Student ID has been verified by the campus proctor. Your profile is now 100% authentic and verified.
              </p>
            </div>

            {/* Unlocked Features List */}
            <div className="bg-zinc-950/70 border border-zinc-800/80 rounded-2xl p-3.5 sm:p-4 text-left space-y-2.5 sm:space-y-3">
              <div className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Unlocked Features:
              </div>
              <div className="space-y-2 text-xs text-zinc-300">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <span><strong>Full Profiles:</strong> View student photos, courses & years without locks.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <span><strong>Direct Chat Active:</strong> Message batchmates and collaborate for campus clubs.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <span><strong>Verified Badge:</strong> Green verification badge displayed on your profile card.</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2.5 sm:gap-3">
              <Link
                href="/discover"
                onClick={handleDismissCongrats}
                className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-purple-600 via-rose-500 to-teal-500 hover:from-purple-500 hover:to-teal-400 text-white font-bold text-xs sm:text-sm shadow-glow-purple flex items-center justify-center gap-2 transition-all"
              >
                <Users className="w-4 h-4" />
                <span>Explore Campus Feed</span>
              </Link>
              <button
                onClick={handleDismissCongrats}
                className="py-2.5 sm:py-3 px-5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Verification status header banners */}
      {currentUser.verification_status === 'pending' && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-3.5 sm:px-4 py-2.5">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs sm:text-sm">
            <div className="flex items-center gap-2 text-amber-300 font-medium">
              <Clock className="w-4 h-4 shrink-0 text-amber-400 animate-pulse" />
              <span>
                Your CSJMU ID card is currently <strong>Under Review</strong> by campus admins.
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-zinc-400 self-end sm:self-auto">
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
      )}

      {(currentUser.verification_status === 'unverified' || currentUser.verification_status === 'rejected') && (
        <div className="bg-gradient-to-r from-rose-950/50 via-purple-950/40 to-teal-950/50 border-b border-purple-500/30 px-3.5 sm:px-4 py-2.5">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs sm:text-sm">
            <div className="flex items-center gap-2 text-zinc-200">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
              <span>
                You are browsing in <strong>Restricted Mode</strong>. Verify your CSJMU ID to unlock photos, departments & direct messaging.
              </span>
            </div>
            <Link
              href="/verify-id"
              className="self-stretch sm:self-auto justify-center bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-500 hover:to-teal-400 text-white text-xs font-semibold px-3 py-2 sm:py-1.5 rounded-lg flex items-center gap-1.5 shadow-glow-purple transition-all active:scale-95 text-center"
            >
              <Camera className="w-3.5 h-3.5" />
              Verify My CSJMU ID
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
