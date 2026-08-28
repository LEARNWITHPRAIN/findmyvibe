'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Mail,
  Send,
  ExternalLink,
  Copy,
  Check,
  MessageSquare,
  ShieldAlert,
  Sparkles,
  HelpCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';

export default function ContactPage() {
  const targetEmail = 'findmyvibe.fun@gmail.com';

  const [subject, setSubject] = useState('General Inquiry');
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(targetEmail);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const emailSubjectEncoded = encodeURIComponent(`[FindMyVibe Contact] ${subject} - ${name || 'CSJMU Student'}`);
  const emailBodyText = `Hi FindMyVibe Team,\n\nName: ${name || 'Not provided'}\nRoll No / Department: ${rollNumber || 'Not provided'}\nTopic: ${subject}\n\nMessage:\n${message}\n\n---\nSent from FindMyVibe Student Platform`;
  const emailBodyEncoded = encodeURIComponent(emailBodyText);

  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${targetEmail}&su=${emailSubjectEncoded}&body=${emailBodyEncoded}`;
  const mailtoUrl = `mailto:${targetEmail}?subject=${emailSubjectEncoded}&body=${emailBodyEncoded}`;

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center space-y-3 pt-6">
        <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-semibold">
          <Mail className="w-3.5 h-3.5" /> Direct Student Support
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Contact <span className="bg-gradient-to-r from-purple-400 via-rose-400 to-teal-300 bg-clip-text text-transparent">Find My Vibe</span>
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
          Need verification help, have campus club collaboration ideas, or want to report an issue? We&apos;re here for every CSJMU student.
        </p>
      </div>

      {/* Main Grid: Info + Direct Email Launcher */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Col: Contact Quick Card (5 cols) */}
        <div className="md:col-span-5 space-y-6">
          {/* Email Address Highlight Card */}
          <div className="p-6 rounded-3xl bg-zinc-900/80 border border-zinc-800 shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Official Support Email</h3>
              <p className="text-base font-bold text-white mt-1 break-all select-all font-mono">
                {targetEmail}
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <a
                href={gmailUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-500 hover:to-teal-400 text-white font-bold text-xs shadow-glow-purple flex items-center justify-center gap-2 transition-all"
              >
                <Mail className="w-4 h-4" />
                <span>Open in Gmail</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                type="button"
                onClick={handleCopy}
                className="w-full py-2 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-semibold">Email Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Email Address</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Response Timeline & Guidelines */}
          <div className="p-6 rounded-3xl bg-zinc-950/60 border border-zinc-800/80 space-y-3 text-xs text-zinc-400">
            <div className="flex items-center gap-2 text-zinc-200 font-semibold">
              <Clock className="w-4 h-4 text-teal-400" />
              <span>Response Time</span>
            </div>
            <p className="leading-relaxed">
              We usually respond within <strong>12 to 24 hours</strong>. For urgent moderation or account verification queries, please include your registered email.
            </p>
          </div>
        </div>

        {/* Right Col: Interactive Compose Launcher (7 cols) */}
        <div className="md:col-span-7 bg-zinc-900/70 border border-zinc-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-5">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Draft Your Message
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Fill in your query details and click the button to send directly from your Gmail account.
            </p>
          </div>

          <div className="space-y-4">
            {/* Subject / Category Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Topic / Category <span className="text-rose-400">*</span>
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 focus:outline-none transition-colors"
              >
                <option value="ID Verification Help">ID Verification & Account Help</option>
                <option value="Bug Report or Technical Issue">Bug Report or Technical Glitch</option>
                <option value="Campus Club or Fest Collaboration">Campus Club / Fest Collaboration</option>
                <option value="Safety or Community Moderation">Safety & User Report</option>
                <option value="General Feedback or Suggestion">General Feedback & Suggestions</option>
                <option value="Other Query">Other</option>
              </select>
            </div>

            {/* Name & Roll */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Your Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aryan Singh"
                  className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-purple-500 rounded-xl px-3.5 py-2 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Department / Year
                </label>
                <input
                  type="text"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  placeholder="e.g. UIET CSE 3rd Year"
                  className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-purple-500 rounded-xl px-3.5 py-2 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Message Body */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Your Message <span className="text-rose-400">*</span>
              </label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your query or suggestion in detail..."
                className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-purple-500 rounded-xl p-3 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none transition-colors resize-none"
                required
              />
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <a
                href={gmailUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-rose-500 to-teal-500 hover:from-purple-500 hover:to-teal-400 text-white font-bold text-xs sm:text-sm shadow-glow-purple flex items-center justify-center gap-2 transition-all text-center"
              >
                <Mail className="w-4 h-4" />
                <span>Compose in Gmail Directly</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href={mailtoUrl}
                className="w-full py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium text-xs flex items-center justify-center gap-2 transition-colors text-center"
              >
                <Send className="w-3.5 h-3.5 text-teal-400" />
                <span>Open in Default Mail Client</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Official Legal Disclaimer Box */}
      <div className="p-6 rounded-3xl bg-zinc-950/80 border border-zinc-800 text-zinc-400 space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
          Official Institutional Disclaimer
        </h4>
        <p className="text-xs leading-relaxed">
          Disclaimer: This platform is an independent student community and is not officially affiliated with, endorsed by, or operated by Chhatrapati Shahu Ji Maharaj University (CSJMU). CSJMU is mentioned solely to identify the university community this platform is intended to serve.
        </p>
      </div>
    </div>
  );
}
