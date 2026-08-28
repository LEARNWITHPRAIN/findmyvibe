'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FeedbackModal } from './FeedbackModal';
import {
  MessageSquarePlus,
  Mail,
  ShieldCheck,
  Heart,
  ExternalLink,
  Users,
  Compass,
  FileText,
  Lock,
  Sparkles,
} from 'lucide-react';

export function Footer() {
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  return (
    <>
      <footer className="border-t border-zinc-800/80 bg-zinc-950/90 text-zinc-400 text-xs mt-auto relative z-10">
        {/* Top Glowing Border Accent */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Main Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 mb-12">
            {/* Column 1: Brand & Student Initiative (5 cols) */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative w-8 h-8 rounded-xl overflow-hidden ring-1 ring-white/10 shadow-glow-purple">
                  <Image
                    src="/logo.jpg"
                    alt="Find My Vibe"
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="text-base font-black text-white tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                  Find My Vibe
                </span>
                <span className="px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-[10px] font-bold uppercase tracking-wider">
                  Unofficial Student Network
                </span>
              </div>

              <p className="text-zinc-400 text-xs leading-relaxed max-w-md">
                An independent peer connection network built by students, for all CSJMU students — whether you&apos;re a hosteller, residential campus resident, or day scholar. Match vibes, form hackathon squads, and vibe check safely.
              </p>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setFeedbackOpen(true)}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-semibold transition-all hover:scale-[1.02] cursor-pointer"
                >
                  <MessageSquarePlus className="w-3.5 h-3.5" />
                  <span>Give Feedback / Request Feature</span>
                </button>

                <a
                  href="mailto:findmyvibe.fun@gmail.com"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-medium transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-teal-400" />
                  <span>findmyvibe.fun@gmail.com</span>
                </a>
              </div>
            </div>

            {/* Column 2: Navigation (2 cols) */}
            <div className="md:col-span-2 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200">
                Explore
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/discover" className="hover:text-white transition-colors flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-purple-400" />
                    <span>Discover Students</span>
                  </Link>
                </li>
                <li>
                  <Link href="/messages" className="hover:text-white transition-colors flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-teal-400" />
                    <span>Direct Chat</span>
                  </Link>
                </li>
                <li>
                  <Link href="/verify-id" className="hover:text-white transition-colors flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Student Verification</span>
                  </Link>
                </li>
                <li>
                  <Link href="/signup" className="hover:text-white transition-colors flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                    <span>Join Community</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: About & Community (2 cols) */}
            <div className="md:col-span-2 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200">
                Community
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => setFeedbackOpen(true)}
                    className="hover:text-white text-left transition-colors cursor-pointer"
                  >
                    Feedback & Bugs
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: Legal & Trust (3 cols) */}
            <div className="md:col-span-3 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200">
                Privacy & Trust
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-teal-400" />
                    <span>Privacy Policy</span>
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white transition-colors flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-purple-400" />
                    <span>Terms & Conditions</span>
                  </Link>
                </li>
              </ul>

              <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-[11px] text-zinc-400 space-y-1 mt-3">
                <div className="font-semibold text-zinc-300 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-400" /> ID Privacy Guarantee
                </div>
                <p className="leading-normal text-[10.5px]">
                  Uploaded Student IDs are used strictly for status verification and are securely deleted right after review.
                </p>
              </div>
            </div>
          </div>

          {/* Official Disclaimer Box */}
          <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 mb-8">
            <p className="text-[11px] leading-relaxed text-zinc-400">
              <strong className="text-zinc-300">Disclaimer:</strong> This platform is an independent student community and is not officially affiliated with, endorsed by, or operated by Chhatrapati Shahu Ji Maharaj University (CSJMU). CSJMU is mentioned solely to identify the university community this platform is intended to serve.
            </p>
          </div>

          {/* Bottom Row */}
          <div className="pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              <span>© {new Date().getFullYear()} Find My Vibe • Built with <Heart className="w-3 h-3 text-rose-500 inline fill-current" /> by CSJMU Students</span>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/terms" className="hover:text-zinc-300 transition-colors">
                Terms
              </Link>
              <span>•</span>
              <Link href="/privacy" className="hover:text-zinc-300 transition-colors">
                Privacy
              </Link>
              <span>•</span>
              <Link href="/contact" className="hover:text-zinc-300 transition-colors">
                Contact
              </Link>
              <span>•</span>
              <button
                onClick={() => setFeedbackOpen(true)}
                className="text-purple-400 hover:text-purple-300 font-semibold transition-colors cursor-pointer"
              >
                Feedback
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Reusable Feedback Modal */}
      <FeedbackModal isOpen={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
    </>
  );
}
