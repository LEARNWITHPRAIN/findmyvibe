'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  MessageSquarePlus,
  X,
  Send,
  Mail,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  Bug,
  ShieldCheck,
  Smile,
} from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES = [
  { id: 'Feature Suggestion', label: 'Idea / Feature', icon: Sparkles, color: 'purple' },
  { id: 'Bug Report', label: 'Bug / Issue', icon: Bug, color: 'rose' },
  { id: 'Safety & Trust', label: 'Safety & Trust', icon: ShieldCheck, color: 'teal' },
  { id: 'General Vibe', label: 'General Feedback', icon: Smile, color: 'amber' },
];

export function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [category, setCategory] = useState('Feature Suggestion');
  const [message, setMessage] = useState('');
  const [nameOrRoll, setNameOrRoll] = useState('');
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const targetEmail = 'findmyvibe.fun@gmail.com';
  const emailSubject = encodeURIComponent(`[FindMyVibe Feedback] ${category}`);
  const emailBodyText = `Hi FindMyVibe Team,\n\nCategory: ${category}\nFrom: ${nameOrRoll.trim() || 'Anonymous Student'}\n\nFeedback / Message:\n${message.trim()}\n\n---\nSent from FindMyVibe Student Platform`;
  const emailBodyEncoded = encodeURIComponent(emailBodyText);

  // Direct Gmail web compose link
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${targetEmail}&su=${emailSubject}&body=${emailBodyEncoded}`;
  // Native mailto fallback
  const mailtoUrl = `mailto:${targetEmail}?subject=${emailSubject}&body=${emailBodyEncoded}`;

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(targetEmail);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleOpenGmail = () => {
    window.open(gmailUrl, '_blank', 'noopener,noreferrer');
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md p-4 sm:p-6 overflow-y-auto flex items-start justify-center"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl p-5 sm:p-8 shadow-2xl shadow-purple-500/10 my-auto shrink-0 animate-in fade-in zoom-in-95 duration-200">
        {/* Ambient glow */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button — prominent, z-20 to be above glows */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 hover:text-white flex items-center justify-center transition-colors shadow-lg cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-semibold mb-3">
            <MessageSquarePlus className="w-3.5 h-3.5" /> Built by Students, For Students
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Share Your Feedback & Vibes
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 leading-relaxed">
            Have an idea to make campus connections better, spotted a bug, or want a new hobby tag? Let the student dev team know!
          </p>
        </div>

        {/* Category Selector */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-zinc-300 mb-2">
            Select Feedback Topic
          </label>
          <div className="grid grid-cols-2 gap-2">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = category === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                    isSelected
                      ? 'bg-purple-500/20 border-purple-500 text-white font-bold shadow-glow-purple'
                      : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-purple-400' : 'text-zinc-500'}`} />
                  <span className="text-xs truncate">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Optional Name / Department */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
            Your Name / Department <span className="text-zinc-500 font-normal">(Optional)</span>
          </label>
          <input
            type="text"
            value={nameOrRoll}
            onChange={(e) => setNameOrRoll(e.target.value)}
            placeholder="e.g. Priyanshu, UIET CSE 2nd Year"
            className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-purple-500 rounded-xl px-3.5 py-2 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none transition-colors"
          />
        </div>

        {/* Message Input */}
        <div className="mb-5">
          <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
            Your Message / Suggestion <span className="text-rose-400">*</span>
          </label>
          <textarea
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us what you loved, what broke, or what features you want next on FindMyVibe..."
            className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-purple-500 rounded-xl p-3 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none transition-colors resize-none"
            required
          />
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Main Gmail Redirect Button */}
          <button
            type="button"
            onClick={handleOpenGmail}
            disabled={!message.trim()}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-rose-500 to-teal-500 hover:from-purple-500 hover:to-teal-400 text-white font-bold text-xs sm:text-sm shadow-glow-purple flex items-center justify-center gap-2 transition-all disabled:opacity-40 cursor-pointer"
          >
            <Mail className="w-4 h-4" />
            <span>Send Directly via Gmail</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          {/* Secondary Action Row: Default Mail Client & Copy Email */}
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-zinc-800/80 text-xs">
            <a
              href={mailtoUrl}
              className="text-zinc-400 hover:text-zinc-200 inline-flex items-center gap-1.5 py-1.5 px-2.5 rounded-lg hover:bg-zinc-800 transition-colors"
            >
              <Send className="w-3.5 h-3.5 text-teal-400" />
              <span>Use Default Mail App</span>
            </a>

            <button
              type="button"
              onClick={handleCopyEmail}
              className="text-zinc-400 hover:text-zinc-200 inline-flex items-center gap-1.5 py-1.5 px-2.5 rounded-lg hover:bg-zinc-800 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Email Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-purple-400" />
                  <span>Copy {targetEmail}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
