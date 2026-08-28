'use client';

import React from 'react';
import Link from 'next/link';
import {
  Lock,
  ShieldCheck,
  Eye,
  Trash2,
  Database,
  Mail,
  Server,
  Key,
} from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center space-y-3 pt-6">
        <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-semibold">
          <Lock className="w-3.5 h-3.5" /> Privacy First • Student Centric
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
          Last updated: August 2026 • How Find My Vibe protects your student data and identity.
        </p>
      </div>

      {/* Prominent ID Privacy Pledge Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-teal-950/40 via-zinc-900 to-purple-950/40 border border-teal-500/40 shadow-xl space-y-3">
        <div className="flex items-center gap-2 text-teal-400 font-bold text-sm">
          <ShieldCheck className="w-5 h-5 text-teal-400" />
          <span>Our Student ID Privacy Guarantee</span>
        </div>
        <p className="text-sm sm:text-base font-semibold text-white leading-relaxed">
          &ldquo;Your university ID is collected only to verify your student status. It will not be publicly displayed or used for other purposes. After verification, the uploaded ID will be deleted.&rdquo;
        </p>
      </div>

      {/* Detailed Sections */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 sm:p-10 backdrop-blur-xl shadow-2xl space-y-8 text-xs sm:text-sm text-zinc-300 leading-relaxed">
        {/* 1. What We Collect */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-purple-400" /> 1. Information We Collect
          </h2>
          <p>
            We collect only the essential information needed to help students discover and chat with batchmates:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-zinc-400">
            <li><strong>Account Email & Authentication Data:</strong> Required for secure login and account recovery via Supabase Auth.</li>
            <li><strong>Student Profile Details:</strong> Your name, department, year of study, gender, short bio, and chosen hobby chips.</li>
            <li><strong>Verification Selfie with ID:</strong> A temporary photo submitted strictly to confirm you are an enrolled CSJMU student.</li>
            <li><strong>Direct Messages:</strong> Content of text messages you exchange with other verified students on the platform.</li>
          </ul>
        </section>

        {/* 2. How ID Cards are Handled */}
        <section className="space-y-3 p-5 rounded-2xl bg-zinc-950/70 border border-teal-500/20">
          <h2 className="text-base sm:text-lg font-bold text-teal-300 flex items-center gap-2">
            <Key className="w-4 h-4 text-teal-400" /> 2. Strict ID Card Security & Auto-Deletion
          </h2>
          <p>
            We understand the sensitivity of student identification documents. Here is how your ID is safeguarded:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-zinc-300">
            <li><strong>Never Public:</strong> Your uploaded ID is stored in a private, encrypted storage vault (`id-verifications`) and is <strong>never displayed on your profile</strong> or accessible by other students.</li>
            <li><strong>Admin-Only Review:</strong> Only authorized student moderators review the image to match your roll number and department.</li>
            <li><strong>Deletion After Review:</strong> Once your profile status is marked as verified or rejected, the uploaded ID image is deleted.</li>
          </ul>
        </section>

        {/* 3. Messaging Privacy & RLS */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-teal-400" /> 3. Messaging Privacy & Row-Level Security
          </h2>
          <p>
            All direct messages on Find My Vibe are secured by database-level <strong>Row-Level Security (RLS)</strong> policies. Only the sender and the designated recipient have permissions to read conversation history. Unverified users and unauthorized third parties cannot access private chat rooms.
          </p>
        </section>

        {/* 4. No Third-Party Selling */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Eye className="w-4 h-4 text-rose-400" /> 4. Zero Data Selling or Ad Tracking
          </h2>
          <p>
            Find My Vibe is a non-commercial, student-created platform. We <strong>do not sell, rent, or monetize your personal data</strong> with advertisers, data brokers, or external commercial organizations.
          </p>
        </section>

        {/* 5. Account & Data Deletion Rights */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Trash2 className="w-4 h-4 text-amber-400" /> 5. Your Rights & Account Deletion
          </h2>
          <p>
            You have full control over your profile. You can edit your bio, hobbies, and year anytime from your profile settings. If you wish to delete your entire account and all associated messages permanently, email us at{' '}
            <a href="mailto:findmyvibe.fun@gmail.com" className="text-teal-400 underline font-mono">
              findmyvibe.fun@gmail.com
            </a>{' '}
            and your data will be wiped within 24 hours.
          </p>
        </section>

        {/* 6. Institutional Disclaimer */}
        <section className="space-y-2 p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 text-zinc-400">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
            Institutional Disclaimer
          </h3>
          <p className="text-xs leading-relaxed">
            Disclaimer: This platform is an independent student community and is not officially affiliated with, endorsed by, or operated by Chhatrapati Shahu Ji Maharaj University (CSJMU). CSJMU is mentioned solely to identify the university community this platform is intended to serve.
          </p>
        </section>

        {/* 7. Contact */}
        <section className="space-y-2 pt-4 border-t border-zinc-800">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Mail className="w-4 h-4 text-teal-400" /> 7. Privacy Questions
          </h2>
          <p>
            For privacy inquiries, security feedback, or data requests, contact us at{' '}
            <a href="mailto:findmyvibe.fun@gmail.com" className="text-teal-400 underline font-mono">
              findmyvibe.fun@gmail.com
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}
