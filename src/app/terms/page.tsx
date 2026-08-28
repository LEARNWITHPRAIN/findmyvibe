'use client';

import React from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  Users,
  Lock,
  Mail,
  Scale,
} from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center space-y-3 pt-6">
        <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-semibold">
          <Scale className="w-3.5 h-3.5" /> Community Guidelines & Rules
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Terms & Conditions
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
          Last updated: August 2026 • Rules for a safe, authentic, and respectful student community.
        </p>
      </div>

      {/* Prominent Institutional Disclaimer Banner */}
      <div className="p-6 rounded-3xl bg-zinc-900/90 border border-zinc-800 shadow-xl space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" /> Institutional Affiliation Notice
        </h3>
        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
          <strong>Disclaimer:</strong> This platform is an independent student community and is not officially affiliated with, endorsed by, or operated by Chhatrapati Shahu Ji Maharaj University (CSJMU). CSJMU is mentioned solely to identify the university community this platform is intended to serve.
        </p>
      </div>

      {/* Content Sections */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 sm:p-10 backdrop-blur-xl shadow-2xl space-y-8 text-xs sm:text-sm text-zinc-300 leading-relaxed">
        {/* 1. Acceptance */}
        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <span className="text-purple-400">1.</span> Acceptance of Terms
          </h2>
          <p>
            By creating an account, accessing, or using <strong>Find My Vibe</strong> (findmyvibe.fun), you agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree to these terms, please do not use the platform.
          </p>
        </section>

        {/* 2. Eligibility & Community Scope */}
        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <span className="text-teal-400">2.</span> Student Eligibility
          </h2>
          <p>
            Find My Vibe is exclusively built for all currently enrolled students of CSJMU Kanpur. This includes:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-zinc-400">
            <li>Hostel residents (Hall 1, Hall 2, Hall 3, Hall 4, etc.)</li>
            <li>Day scholars and commuting students across Kanpur and surrounding areas</li>
            <li>Students from all university departments, institutes (UIET, Pharmacy, Management, Biotech, etc.), and degree programs</li>
          </ul>
        </section>

        {/* 3. Student ID Verification & Deletion Policy */}
        <section className="space-y-2 p-5 rounded-2xl bg-zinc-950/70 border border-teal-500/20">
          <h2 className="text-base sm:text-lg font-bold text-teal-300 flex items-center gap-2">
            <Lock className="w-4 h-4 text-teal-400" /> 3. Student ID Verification & Deletion
          </h2>
          <p className="font-semibold text-zinc-200">
            &ldquo;Your university ID is collected only to verify your student status. It will not be publicly displayed or used for other purposes. After verification, the uploaded ID will be deleted.&rdquo;
          </p>
          <p className="text-zinc-400 text-xs mt-2">
            Users must submit authentic proof of enrollment. Providing fraudulent, altered, or another individual&apos;s ID card constitutes an immediate, permanent ban from the network.
          </p>
        </section>

        {/* 4. Code of Conduct */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-rose-400" /> 4. Community Code of Conduct
          </h2>
          <p>
            To maintain a positive and supportive campus environment, all members must adhere to the following principles:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800">
              <strong className="text-zinc-100 block mb-1">✓ Be Respectful & Kind</strong>
              Treat all batchmates, regardless of gender, branch, year, or background, with genuine respect.
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800">
              <strong className="text-rose-400 block mb-1">✗ Zero Tolerance for Harassment</strong>
              Stalking, bullying, hate speech, explicit content, or unsolicited inappropriate messaging will result in instant account termination.
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800">
              <strong className="text-rose-400 block mb-1">✗ No Impersonation or Fake Profiles</strong>
              You may not pretend to be another student, university authority, or faculty member.
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800">
              <strong className="text-rose-400 block mb-1">✗ No Commercial Spam or Promotion</strong>
              Do not use student chat rooms for unsolicited advertising, paid promotional spam, or unauthorized sales.
            </div>
          </div>
        </section>

        {/* 5. Direct Messaging */}
        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <span className="text-purple-400">5.</span> Messaging & Safety
          </h2>
          <p>
            Direct messaging is only unlocked for students with verified CSJMU IDs to protect our members. Users are responsible for the content they send. If you experience abusive behavior, please contact support immediately with screenshots for instant action.
          </p>
        </section>

        {/* 6. Account Termination */}
        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" /> 6. Account Suspension & Bans
          </h2>
          <p>
            The student administration team reserves the right to suspend, reject, or permanently delete any profile that breaches these community guidelines or poses a safety risk to the student network.
          </p>
        </section>

        {/* 7. Contact Info */}
        <section className="space-y-2 pt-4 border-t border-zinc-800">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Mail className="w-4 h-4 text-teal-400" /> 7. Contact for Moderation & Questions
          </h2>
          <p>
            If you have questions regarding these terms or wish to report a violation, email us directly at{' '}
            <a href="mailto:findmyvibe.fun@gmail.com" className="text-teal-400 underline font-mono">
              findmyvibe.fun@gmail.com
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}
