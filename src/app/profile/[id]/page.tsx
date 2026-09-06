'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/authContext';
import { HobbyBadge } from '@/components/HobbyBadge';
import {
  ShieldCheck,
  Lock,
  MessageSquare,
  ArrowLeft,
  GraduationCap,
  Building2,
  Calendar,
  MapPin,
  Camera,
  MoreVertical,
  Flag,
  UserX,
  UserCheck,
  X,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';

const REPORT_REASONS = [
  { id: 'harassment', label: 'Harassment or Bullying', desc: 'Disrespectful messages, threats, or unwanted contact' },
  { id: 'inappropriate', label: 'Inappropriate / Explicit Content', desc: 'Offensive language, NSFW content, or misconduct' },
  { id: 'spam', label: 'Spam or Commercial Promotion', desc: 'Unsolicited advertising, scam links, or bots' },
  { id: 'impersonation', label: 'Fake Account / Impersonation', desc: 'Pretending to be someone else or fake university ID' },
  { id: 'safety', label: 'Safety Threat or Hate Speech', desc: 'Violence, discrimination, or immediate campus harm' },
  { id: 'other', label: 'Other Concern', desc: 'Any other violation of CSJMU community guidelines' },
];

export default function ProfileDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { profiles, currentUser, blockedUsers, blockUser, unblockUser, reportUser } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState<string>(REPORT_REASONS[0].label);
  const [reportDetails, setReportDetails] = useState('');
  const [alsoBlockOnReport, setAlsoBlockOnReport] = useState(true);
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const profileId = params?.id as string;
  const profile = profiles.find((p) => p.id === profileId);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  if (!profile) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <h2 className="text-xl font-bold text-white mb-2">Student Profile Not Found</h2>
        <p className="text-xs text-zinc-400 mb-6">
          The requested profile does not exist or has been removed.
        </p>
        <Link
          href="/discover"
          className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200"
        >
          Back to Discover
        </Link>
      </div>
    );
  }

  const isViewerVerified = currentUser?.verification_status === 'verified';
  const isSelf = currentUser?.id === profile.id;
  const isBlockedByMe = Boolean(
    currentUser &&
    blockedUsers.some((b) => b.blocker_id === currentUser.id && b.blocked_id === profile.id)
  );
  const isBanned = Boolean(profile.is_banned);

  const handleConfirmBlock = async () => {
    setShowBlockModal(false);
    setMenuOpen(false);
    await blockUser(profile.id);
    showToast(`Blocked ${profile.full_name}.`);
  };

  const handleUnblock = async () => {
    setMenuOpen(false);
    await unblockUser(profile.id);
    showToast(`Unblocked ${profile.full_name}.`);
  };

  const handleSubmitReport = async () => {
    if (!reportReason) return;
    setIsSubmittingReport(true);
    try {
      await reportUser(profile.id, reportReason, reportDetails, alsoBlockOnReport);
      setShowReportModal(false);
      setMenuOpen(false);
      setReportDetails('');
      showToast('Report submitted. Our campus proctor team will review this shortly.');
    } catch {
      showToast('Failed to submit report.');
    } finally {
      setIsSubmittingReport(false);
    }
  };

  return (
    <div className="min-h-[85vh] py-6 sm:py-10 px-3.5 sm:px-6 max-w-3xl mx-auto space-y-5 sm:space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-4 sm:right-6 z-50 bg-zinc-900 border border-purple-500/50 text-white px-4 py-3 rounded-2xl text-xs font-bold shadow-2xl flex items-center gap-2 animate-in slide-in-from-top-4">
          <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Block Confirmation Modal */}
      {showBlockModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150 text-center">
            <div className="w-14 h-14 rounded-3xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
              <UserX className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">
                Block {profile.full_name}?
              </h3>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                They won&apos;t be able to message you or view your profile in chat. They won&apos;t be notified that you blocked them.
              </p>
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <button
                type="button"
                onClick={handleConfirmBlock}
                className="w-full py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg transition-colors cursor-pointer"
              >
                Block Student
              </button>
              <button
                type="button"
                onClick={() => setShowBlockModal(false)}
                className="w-full py-2.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-semibold text-xs border border-zinc-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-md w-full p-5 sm:p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150 max-h-[92dvh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
                  <Flag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-sm sm:text-base">
                    Report {profile.full_name}
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    Confidential report to CSJMU proctors
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowReportModal(false)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-zinc-200">
                Why are you reporting this student?
              </label>
              <div className="space-y-2">
                {REPORT_REASONS.map((r) => {
                  const isSelected = reportReason === r.label;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setReportReason(r.label)}
                      className={`w-full p-3 rounded-2xl text-left border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                        isSelected
                          ? 'bg-purple-950/40 border-purple-500/70 text-white'
                          : 'bg-zinc-900/60 border-zinc-800 text-zinc-300 hover:bg-zinc-900 hover:border-zinc-700'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-xs text-zinc-100 mb-0.5">{r.label}</div>
                        <div className="text-[11px] text-zinc-400 leading-snug">{r.desc}</div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected ? 'border-purple-400 bg-purple-500 text-white' : 'border-zinc-600'
                      }`}>
                        {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Additional Details / Incident Notes (Optional)
                </label>
                <textarea
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  placeholder="Share details to assist proctor investigation..."
                  rows={3}
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-purple-500 rounded-2xl p-3 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none transition-colors"
                />
              </div>

              <label className="flex items-center gap-2.5 p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={alsoBlockOnReport}
                  onChange={(e) => setAlsoBlockOnReport(e.target.checked)}
                  className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 bg-zinc-950 border-zinc-700"
                />
                <span className="text-xs text-zinc-300 font-medium">
                  Also block <strong>{profile.full_name}</strong> from contacting you
                </span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setShowReportModal(false)}
                className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold border border-zinc-800"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmittingReport || !reportReason}
                onClick={handleSubmitReport}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg transition-all disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
              >
                {isSubmittingReport ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Submitting…</span>
                  </>
                ) : (
                  <>
                    <Flag className="w-3.5 h-3.5" />
                    <span>Submit Report</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Back Button & Top Options */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Feed
        </button>

        {!isSelf && (
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 border border-zinc-800 transition-colors cursor-pointer"
              title="Options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl p-1.5 z-40 animate-in fade-in-50 zoom-in-95 duration-100">
                {isBlockedByMe ? (
                  <button
                    type="button"
                    onClick={handleUnblock}
                    className="w-full px-3 py-2 text-xs text-teal-300 hover:text-teal-200 hover:bg-teal-950/30 rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-teal-400" />
                    <span>Unblock Student</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      setShowBlockModal(true);
                    }}
                    className="w-full px-3 py-2 text-xs text-rose-300 hover:text-rose-200 hover:bg-rose-950/30 rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                  >
                    <UserX className="w-3.5 h-3.5 text-rose-400" />
                    <span>Block Student</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    setShowReportModal(true);
                  }}
                  className="w-full px-3 py-2 text-xs text-amber-300 hover:text-amber-200 hover:bg-amber-950/30 rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                >
                  <Flag className="w-3.5 h-3.5 text-amber-400" />
                  <span>Report Student</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Profile Card */}
      <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl sm:rounded-3xl overflow-hidden backdrop-blur-xl shadow-2xl relative">
        {/* Cover Banner */}
        <div className="h-32 sm:h-44 bg-gradient-to-r from-purple-950 via-zinc-900 to-teal-950 relative overflow-hidden border-b border-zinc-800/80">
          <div className="absolute inset-0 bg-dot-grid opacity-40" />
          <div className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 flex items-center gap-2">
            <span className="px-2.5 sm:px-3 py-1 rounded-full bg-zinc-900/80 backdrop-blur-md border border-white/10 text-[10px] sm:text-[11px] font-semibold text-zinc-300 flex items-center gap-1.5">
              <MapPin className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-teal-400" /> CSJMU Student
            </span>
          </div>
        </div>

        {/* Profile Content */}
        <div className="px-4 sm:px-10 pb-8 sm:pb-10 pt-0 relative">
          {/* Avatar and Top Actions */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-14 sm:-mt-20 mb-6">
            <div className="relative w-24 h-24 sm:w-36 sm:h-36 rounded-2xl sm:rounded-3xl overflow-hidden bg-zinc-800 border-4 border-zinc-950 shadow-2xl shrink-0 flex items-center justify-center">
              {isViewerVerified && profile.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  alt={profile.full_name || 'Student'}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : isViewerVerified ? (
                <div className="w-full h-full bg-gradient-to-br from-purple-900/60 to-teal-900/60 flex items-center justify-center text-zinc-200 font-extrabold text-2xl sm:text-3xl">
                  {(profile.full_name || 'U').charAt(0).toUpperCase()}
                </div>
              ) : (
                /* Unverified viewer — blurred lock overlay */
                <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex flex-col items-center justify-center gap-1.5 text-center p-3">
                  <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-amber-400" />
                  <span className="text-[9px] sm:text-[10px] text-zinc-400 leading-tight font-medium">
                    Verify CSJMU ID<br />to view photo
                  </span>
                </div>
              )}

              {profile.verification_status === 'verified' && !isBanned && (
                <div className="absolute bottom-1.5 right-1.5 sm:bottom-2 sm:right-2 bg-emerald-500 text-zinc-950 p-0.5 sm:p-1 rounded-full ring-2 ring-zinc-950 shadow-lg z-10">
                  <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {isBanned ? (
                <div className="px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>Account Suspended</span>
                </div>
              ) : isBlockedByMe ? (
                <button
                  type="button"
                  onClick={handleUnblock}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <UserCheck className="w-4 h-4" /> Unblock Student
                </button>
              ) : !isSelf && (
                isViewerVerified ? (
                  <Link
                    href={`/messages?user=${profile.id}`}
                    className="w-full sm:w-auto justify-center px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-500 hover:to-teal-400 text-white font-bold text-xs shadow-glow-purple transition-all flex items-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" /> Message Student
                  </Link>
                ) : (
                  <div className="flex flex-col items-start sm:items-end gap-1 w-full sm:w-auto">
                    <button
                      type="button"
                      disabled
                      className="w-full sm:w-auto justify-center px-5 py-2.5 rounded-xl bg-zinc-800 text-zinc-500 border border-zinc-700/60 text-xs font-semibold cursor-not-allowed flex items-center gap-2 opacity-60"
                    >
                      <Lock className="w-3.5 h-3.5 text-amber-500" /> Messaging Locked
                    </button>
                    <span className="text-[10px] text-zinc-500">
                      Verify CSJMU ID to enable chat
                    </span>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Name & Badges */}
          <div className="space-y-1 mb-6">
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              <h1 className="text-xl sm:text-3xl font-black text-white">
                {profile.full_name}
              </h1>
              {isBanned ? (
                <span className="px-2.5 sm:px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[11px] sm:text-xs font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" /> Suspended
                </span>
              ) : profile.verification_status === 'verified' ? (
                <span className="px-2.5 sm:px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-[11px] sm:text-xs font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> CSJMU Verified
                </span>
              ) : (
                <span className="px-2.5 sm:px-3 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400 text-[11px] sm:text-xs font-medium">
                  Unverified
                </span>
              )}
            </div>


            {/* Verified Details vs Restricted Blur */}
            {isViewerVerified ? (
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-zinc-400 pt-1.5">
                <div className="flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-purple-400" />
                  <span>{profile.department || 'CSJMU Campus'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-teal-400" />
                  <span>{profile.year ? `${profile.year}th Year` : 'Student'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-rose-400" />
                  <span>{profile.college}</span>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-3">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    Department, Year of study & Avatar are locked in restricted mode.
                  </span>
                </div>
                <Link
                  href="/verify-id"
                  className="shrink-0 text-xs font-bold underline underline-offset-4 text-amber-400 hover:text-amber-300 flex items-center gap-1"
                >
                  <Camera className="w-3 h-3" /> Verify Now
                </Link>
              </div>
            )}
          </div>

          {/* Bio */}
          {profile.bio && (
            <div className="mb-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
                About & Vibe
              </h3>
              <p className="text-sm text-zinc-300 leading-relaxed bg-zinc-950/40 p-4 rounded-2xl border border-zinc-800/80">
                {profile.bio}
              </p>
            </div>
          )}

          {/* Hobbies & Interests */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2.5">
              Hobbies & Interests
            </h3>
            <div className="flex flex-wrap gap-2">
              {profile.hobbies && profile.hobbies.length > 0 ? (
                profile.hobbies.map((hobby) => (
                  <HobbyBadge key={typeof hobby === 'string' ? hobby : hobby.id} hobby={hobby} size="md" />
                ))
              ) : (
                <span className="text-xs text-zinc-500 italic">No hobbies specified</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
