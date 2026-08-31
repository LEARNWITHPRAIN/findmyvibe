'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FeedbackModal } from '@/components/FeedbackModal';
import {
  Sparkles,
  ShieldCheck,
  Heart,
  GraduationCap,
  Lock,
  ArrowRight,
  Send,
} from 'lucide-react';

export default function AboutPage() {
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  return (
    <div className="min-h-screen py-8 sm:py-12 px-3.5 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-10 sm:space-y-16">
      {/* Hero Banner */}
      <div className="text-center space-y-3 sm:space-y-4 pt-4 sm:pt-6">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" /> Built by Students • For Students
        </div>
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
          Welcome to <span className="bg-gradient-to-r from-purple-400 via-rose-400 to-teal-300 bg-clip-text text-transparent">Find My Vibe</span>
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          An unofficial, student-created community designed to connect every student across Chhatrapati Shahu Ji Maharaj University (CSJMU) — hostellers, residential campus students, and day scholars alike.
        </p>
      </div>

      {/* Mascot & Mission Section */}
      <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl sm:rounded-3xl p-5 sm:p-10 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center">
          <div className="md:col-span-4 flex flex-col items-center text-center">
            <div className="relative w-28 h-28 sm:w-44 sm:h-44 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl shadow-purple-500/20 border-2 border-white/10 bg-zinc-950 p-1 mb-3 sm:mb-4">
              <Image
                src="/logo.jpg"
                alt="Find My Vibe Logo"
                fill
                className="object-cover rounded-xl sm:rounded-2xl"
              />
            </div>
            <span className="text-xs font-bold text-zinc-300">Community Mascot</span>
            <span className="text-[11px] text-teal-400">Connecting Campus Vibes</span>
          </div>

          <div className="md:col-span-8 space-y-3 sm:space-y-4 text-center md:text-left">
            <h2 className="text-lg sm:text-2xl font-bold text-white tracking-tight">
              Why We Built Find My Vibe
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              CSJMU is a massive university campus with thousands of energetic students studying across UIET, Pharmacy, Management, Biotech, Arts, and Law. Yet, finding someone who shares your exact niche interests — whether that&apos;s late-night competitive programming, classical dance rehearsals for Spandan fest, gym partnerships, or weekend acoustic jamming — was purely left to chance.
            </p>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              We built <strong>Find My Vibe</strong> to eliminate awkward cold intros and help verified batchmates find each other based on genuine hobbies, passions, and departments.
            </p>
          </div>
        </div>
      </div>

      {/* 3 Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-zinc-900/50 border border-zinc-800 space-y-2.5 sm:space-y-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-white">1. 100% Inclusive for All CSJMU</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Whether you stay in campus hostels (Hall 1-4), reside locally in Kanpur, or travel as a day scholar every day — this platform belongs to every enrolled student.
          </p>
        </div>

        <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-zinc-900/50 border border-zinc-800 space-y-2.5 sm:space-y-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-white">2. Verified & Safe</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Only verified students can view full profiles and start chats. No outsiders or spam bots. Your ID card is collected solely for verification and deleted immediately after review.
          </p>
        </div>

        <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-zinc-900/50 border border-zinc-800 space-y-2.5 sm:space-y-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center">
            <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-white">3. By Students, Non-Profit</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Maintained by student volunteers passionate about tech, design, and campus life. Free forever with no ads or paid paywalls.
          </p>
        </div>
      </div>

      {/* ID Privacy Transparency Commitment */}
      <div className="p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-teal-950/40 via-zinc-900 to-purple-950/40 border border-teal-500/30 space-y-3 sm:space-y-4">
        <div className="flex items-center gap-2.5 text-teal-400 font-bold text-xs sm:text-sm">
          <Lock className="w-4 h-4" />
          <span>Our Strict Student ID & Privacy Policy</span>
        </div>
        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
          &ldquo;Your university ID is collected only to verify your student status. It will not be publicly displayed or used for other purposes. After verification, the uploaded ID will be deleted.&rdquo;
        </p>
        <div className="flex flex-wrap items-center gap-4 pt-1 sm:pt-2">
          <Link
            href="/privacy"
            className="text-xs font-semibold text-teal-400 hover:text-teal-300 underline underline-offset-4"
          >
            Read Full Privacy Policy →
          </Link>
          <Link
            href="/terms"
            className="text-xs font-semibold text-purple-400 hover:text-purple-300 underline underline-offset-4"
          >
            Read Terms & Community Guidelines →
          </Link>
        </div>
      </div>

      {/* Official Legal Disclaimer Box */}
      <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-zinc-950/80 border border-zinc-800 text-zinc-400 space-y-2">
        <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-zinc-300">
          Official Institutional Disclaimer
        </h4>
        <p className="text-xs leading-relaxed">
          Disclaimer: This platform is an independent student community and is not officially affiliated with, endorsed by, or operated by Chhatrapati Shahu Ji Maharaj University (CSJMU). CSJMU is mentioned solely to identify the university community this platform is intended to serve.
        </p>
      </div>

      {/* CTA Section */}
      <div className="text-center py-4 sm:py-6 space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-white">Ready to discover your campus squad?</h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/signup"
            className="w-full sm:w-auto justify-center px-8 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-rose-500 to-teal-500 hover:from-purple-500 hover:to-teal-400 text-white font-bold text-sm shadow-glow-purple flex items-center gap-2 transition-all"
          >
            <span>Create Your Account Free</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <button
            onClick={() => setFeedbackOpen(true)}
            className="w-full sm:w-auto justify-center px-6 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-semibold text-sm transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Send className="w-4 h-4 text-teal-400" />
            <span>Send Feedback to Devs</span>
          </button>
        </div>
      </div>

      <FeedbackModal isOpen={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
    </div>
  );
}
