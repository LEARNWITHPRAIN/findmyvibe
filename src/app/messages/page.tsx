'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import {
  MessageSquare,
  Send,
  Lock,
  ShieldCheck,
  Search,
  Camera,
  Edit2,
  Trash2,
  Check,
  X,
  ArrowLeft,
  Users,
  MoreVertical,
  Flag,
  UserX,
  UserCheck,
  User,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';

const REPORT_REASONS = [
  { id: 'harassment', label: 'Harassment or Bullying', desc: 'Disrespectful messages, threats, or unwanted contact' },
  { id: 'inappropriate', label: 'Inappropriate / Explicit Content', desc: 'Offensive language, NSFW content, or misconduct' },
  { id: 'spam', label: 'Spam or Commercial Promotion', desc: 'Unsolicited advertising, scam links, or bots' },
  { id: 'impersonation', label: 'Fake Account / Impersonation', desc: 'Pretending to be someone else or fake university ID' },
  { id: 'safety', label: 'Safety Threat or Hate Speech', desc: 'Violence, discrimination, or immediate campus harm' },
  { id: 'other', label: 'Other Concern', desc: 'Any other violation of CSJMU community guidelines' },
];

function MessagesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const targetUserId = searchParams.get('user');

  const {
    currentUser,
    profiles,
    messages,
    blockedUsers,
    sendMessage,
    editMessage,
    deleteMessage,
    blockUser,
    unblockUser,
    reportUser,
    isLoading,
  } = useAuth();

  const [activePartnerId, setActivePartnerId] = useState<string | null>(null);
  const [mobileShowChat, setMobileShowChat] = useState<boolean>(false);
  const [messageText, setMessageText] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [editingMsgId, setEditingMsgId] = useState<string | null>(null);
  const [editInputText, setEditInputText] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState<string>(REPORT_REASONS[0].label);
  const [reportDetails, setReportDetails] = useState('');
  const [alsoBlockOnReport, setAlsoBlockOnReport] = useState(true);
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close 3-dots menu on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auth guard
  useEffect(() => {
    if (!isLoading && !currentUser) {
      router.push('/login');
    }
  }, [currentUser, isLoading, router]);

  const isVerified = currentUser?.verification_status === 'verified';

  useEffect(() => {
    if (targetUserId && targetUserId !== currentUser?.id) {
      setActivePartnerId(targetUserId);
      setMobileShowChat(true);
    } else if (!activePartnerId && profiles.length > 0) {
      const other = profiles.find((p) => p.id !== currentUser?.id);
      if (other) setActivePartnerId(other.id);
    }
  }, [targetUserId, currentUser?.id, profiles, activePartnerId]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activePartnerId]);

  const activePartner = profiles.find((p) => p.id === activePartnerId);

  // Block states
  const iBlockedPartner = Boolean(
    currentUser &&
    activePartnerId &&
    blockedUsers.some((b) => b.blocker_id === currentUser.id && b.blocked_id === activePartnerId)
  );

  const partnerBlockedMe = Boolean(
    currentUser &&
    activePartnerId &&
    blockedUsers.some((b) => b.blocker_id === activePartnerId && b.blocked_id === currentUser.id)
  );

  const isPartnerBanned = Boolean(activePartner?.is_banned);

  // Filter messages for current conversation
  const threadMessages = messages.filter(
    (m) =>
      (m.sender_id === currentUser?.id && m.receiver_id === activePartnerId) ||
      (m.sender_id === activePartnerId && m.receiver_id === currentUser?.id)
  );

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSelectPartner = (id: string) => {
    setActivePartnerId(id);
    setMobileShowChat(true);
    setMenuOpen(false);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !activePartnerId || iBlockedPartner || partnerBlockedMe || isPartnerBanned) return;

    const text = messageText;
    setMessageText('');
    setIsSending(true);
    try {
      const res = await sendMessage(activePartnerId, text);
      if (res?.error) {
        showToast(res.error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  const handleStartEdit = (msgId: string, currentContent: string) => {
    setEditingMsgId(msgId);
    setEditInputText(currentContent);
  };

  const handleSaveEdit = async (msgId: string) => {
    if (!editInputText.trim()) return;
    await editMessage(msgId, editInputText.trim());
    setEditingMsgId(null);
    setEditInputText('');
  };

  const handleCancelEdit = () => {
    setEditingMsgId(null);
    setEditInputText('');
  };

  const handleDelete = async (msgId: string) => {
    if (window.confirm('Unsend this message? It will be removed for everyone.')) {
      await deleteMessage(msgId);
    }
  };

  const handleConfirmBlock = async () => {
    if (!activePartnerId) return;
    setShowBlockModal(false);
    setMenuOpen(false);
    await blockUser(activePartnerId);
    showToast(`Blocked ${activePartner?.full_name || 'student'}. They cannot message you.`);
  };

  const handleUnblock = async () => {
    if (!activePartnerId) return;
    setMenuOpen(false);
    await unblockUser(activePartnerId);
    showToast(`Unblocked ${activePartner?.full_name || 'student'}.`);
  };

  const handleSubmitReport = async () => {
    if (!activePartnerId || !reportReason) return;
    setIsSubmittingReport(true);
    try {
      await reportUser(activePartnerId, reportReason, reportDetails, alsoBlockOnReport);
      setShowReportModal(false);
      setMenuOpen(false);
      setReportDetails('');
      showToast('Report submitted. Our campus proctor team will review this shortly.');
    } catch (e) {
      console.error(e);
      showToast('Failed to submit report. Please try again.');
    } finally {
      setIsSubmittingReport(false);
    }
  };

  const activeFilteredProfiles = profiles.filter(
    (p) =>
      p.id !== currentUser?.id &&
      (searchFilter ? (p.full_name || '').toLowerCase().includes(searchFilter.toLowerCase()) : true)
  );

  return (
    <div className="h-[calc(100dvh-4.1rem)] w-full flex flex-col overflow-hidden bg-zinc-950 select-none">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 sm:right-6 z-50 bg-zinc-900 border border-purple-500/50 text-white px-4 py-3 rounded-2xl text-xs font-bold shadow-2xl flex items-center gap-2 animate-in slide-in-from-top-4">
          <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Instagram-style Block Confirmation Modal */}
      {showBlockModal && activePartner && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150 text-center">
            <div className="w-14 h-14 rounded-3xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
              <UserX className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">
                Block {activePartner.full_name}?
              </h3>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                They won&apos;t be able to message you or view your profile in chat. They won&apos;t be notified that you blocked them. You can unblock anytime.
              </p>
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <button
                type="button"
                onClick={handleConfirmBlock}
                className="w-full py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-950/40 transition-colors cursor-pointer"
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

      {/* Instagram-style Report Modal */}
      {showReportModal && activePartner && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-md w-full p-5 sm:p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150 max-h-[92dvh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
                  <Flag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-sm sm:text-base">
                    Report {activePartner.full_name}
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

              {/* Extra context textarea */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Additional Details / Evidence (Optional)
                </label>
                <textarea
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  placeholder="Share any messages, dates, or specific incidents to help campus proctors investigate..."
                  rows={3}
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-purple-500 rounded-2xl p-3 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none transition-colors"
                />
              </div>

              {/* Also block toggle */}
              <label className="flex items-center gap-2.5 p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={alsoBlockOnReport}
                  onChange={(e) => setAlsoBlockOnReport(e.target.checked)}
                  className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 bg-zinc-950 border-zinc-700"
                />
                <span className="text-xs text-zinc-300 font-medium">
                  Also block <strong>{activePartner.full_name}</strong> and prevent further messages
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

      <div className="flex-1 flex overflow-hidden w-full h-full max-w-[1600px] mx-auto border-x border-zinc-800/80">
        
        {/* Left: Conversations Sidebar */}
        <div
          className={`w-full md:w-80 lg:w-96 border-r border-zinc-800 flex flex-col bg-zinc-950 shrink-0 ${
            mobileShowChat ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Sidebar Header */}
          <div className="p-4 border-b border-zinc-800/80 bg-zinc-900/40">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-black text-white text-base flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-teal-400" />
                <span>Messages</span>
              </h2>
              {isVerified ? (
                <span className="text-[10px] bg-teal-500/20 text-teal-300 px-2.5 py-0.5 rounded-full font-bold border border-teal-500/40">
                  Verified Chat
                </span>
              ) : (
                <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2.5 py-0.5 rounded-full font-bold border border-rose-500/40">
                  Read Only
                </span>
              )}
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search CSJMU students..."
                className="w-full bg-zinc-900 border border-zinc-800 focus:border-purple-500 rounded-xl pl-9 pr-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Student list */}
          <div className="flex-1 overflow-y-auto divide-y divide-zinc-900/60 custom-scrollbar">
            {activeFilteredProfiles.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-16 px-4 text-center space-y-2">
                <Users className="w-8 h-8 text-zinc-700 mx-auto" />
                <p className="text-xs text-zinc-400 font-semibold">No students found</p>
                <p className="text-[11px] text-zinc-600 max-w-[200px]">
                  Explore batchmates in Discover and start chatting!
                </p>
                <Link href="/discover" className="text-xs text-teal-400 hover:text-teal-300 font-semibold mt-2 inline-block">
                  Go to Discover →
                </Link>
              </div>
            ) : (
              activeFilteredProfiles.map((profile) => {
                const isSelected = profile.id === activePartnerId;
                const isBlocked = blockedUsers.some(
                  (b) =>
                    (b.blocker_id === currentUser?.id && b.blocked_id === profile.id) ||
                    (b.blocker_id === profile.id && b.blocked_id === currentUser?.id)
                );
                const isBanned = profile.is_banned;

                const lastMsg = [...messages]
                  .reverse()
                  .find(
                    (m) =>
                      (m.sender_id === profile.id && m.receiver_id === currentUser?.id) ||
                      (m.sender_id === currentUser?.id && m.receiver_id === profile.id)
                  );

                return (
                  <button
                    key={profile.id}
                    onClick={() => handleSelectPartner(profile.id)}
                    className={`w-full p-3.5 text-left flex items-center gap-3 transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-zinc-900 border-l-4 border-purple-500 text-white'
                        : 'hover:bg-zinc-900/50 text-zinc-300'
                    }`}
                  >
                    <div className="relative w-11 h-11 rounded-2xl overflow-hidden bg-zinc-800 shrink-0 flex items-center justify-center font-bold text-xs">
                      {isVerified && profile.avatar_url ? (
                        <Image src={profile.avatar_url} alt={profile.full_name || 'Student'} fill className="object-cover" unoptimized />
                      ) : (
                        <span>{(profile.full_name || 'U').charAt(0).toUpperCase()}</span>
                      )}
                      {profile.verification_status === 'verified' && !isBanned && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-zinc-950 z-10" />
                      )}
                      {isBanned && (
                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-rose-600 rounded-full ring-2 ring-zinc-950 z-10 flex items-center justify-center text-[8px] text-white font-bold" title="Account Suspended">
                          !
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-bold text-xs text-white truncate flex items-center gap-1.5">
                          {profile.full_name || 'CSJMU Student'}
                          {isBlocked && (
                            <span className="text-[9px] bg-zinc-800 text-zinc-400 px-1.5 py-0.2 rounded border border-zinc-700">
                              Blocked
                            </span>
                          )}
                          {isBanned && (
                            <span className="text-[9px] bg-rose-500/20 text-rose-400 px-1.5 py-0.2 rounded border border-rose-500/40">
                              Suspended
                            </span>
                          )}
                        </span>
                        {lastMsg && (
                          <span className="text-[10px] text-zinc-500 shrink-0">
                            {new Date(lastMsg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-400 truncate">
                        {isBanned
                          ? 'Account suspended'
                          : isBlocked
                          ? 'Conversation blocked'
                          : lastMsg
                          ? lastMsg.content
                          : profile.department || 'CSJMU Student'}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Active Chat Thread Window */}
        <div
          className={`flex-1 flex flex-col bg-zinc-950/80 overflow-hidden ${
            !mobileShowChat ? 'hidden md:flex' : 'flex'
          }`}
        >
          {activePartner ? (
            <>
              {/* Chat Thread Header */}
              <div className="p-3.5 sm:p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/60 backdrop-blur-md shrink-0 relative">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Mobile Back Button */}
                  <button
                    type="button"
                    onClick={() => setMobileShowChat(false)}
                    className="md:hidden p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>

                  <div className="relative w-10 h-10 rounded-2xl overflow-hidden bg-zinc-800 flex items-center justify-center font-bold text-xs shrink-0">
                    {isVerified && activePartner.avatar_url ? (
                      <Image src={activePartner.avatar_url} alt={activePartner.full_name || 'Student'} fill className="object-cover" unoptimized />
                    ) : (
                      <span>{(activePartner.full_name || 'U').charAt(0).toUpperCase()}</span>
                    )}
                    {activePartner.verification_status === 'verified' && !isPartnerBanned && (
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-zinc-950 z-10" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="font-extrabold text-white text-sm truncate">
                        {activePartner.full_name || 'CSJMU Student'}
                      </h3>
                      {activePartner.verification_status === 'verified' && !isPartnerBanned && (
                        <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
                      )}
                      {iBlockedPartner && (
                        <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full font-bold border border-rose-500/40">
                          Blocked by you
                        </span>
                      )}
                      {isPartnerBanned && (
                        <span className="text-[10px] bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded-full font-bold border border-rose-500/40">
                          Account Suspended
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-zinc-400 truncate">
                      {isVerified
                        ? `${activePartner.department || 'CSJMU'} ${activePartner.year ? `• Year ${activePartner.year}` : ''}`
                        : 'CSJMU Student'}
                    </p>
                  </div>
                </div>

                {/* Right Actions & 3-dots Instagram Menu */}
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/profile/${activePartner.id}`}
                    className="hidden sm:inline-flex text-xs font-semibold text-purple-400 hover:text-purple-300 px-3 py-1.5 rounded-xl hover:bg-purple-950/40 transition-colors shrink-0"
                  >
                    View Profile →
                  </Link>

                  {/* 3-dots Instagram Action Menu */}
                  <div className="relative" ref={menuRef}>
                    <button
                      type="button"
                      onClick={() => setMenuOpen(!menuOpen)}
                      className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer border border-transparent hover:border-zinc-700"
                      title="More Options"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {menuOpen && (
                      <div className="absolute right-0 top-full mt-2 w-52 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl p-1.5 z-40 animate-in fade-in-50 zoom-in-95 duration-100 divide-y divide-zinc-800/80">
                        <div className="p-1">
                          <Link
                            href={`/profile/${activePartner.id}`}
                            onClick={() => setMenuOpen(false)}
                            className="w-full px-3 py-2 text-xs text-zinc-200 hover:text-white hover:bg-zinc-900 rounded-xl flex items-center gap-2.5 transition-colors"
                          >
                            <User className="w-3.5 h-3.5 text-purple-400" />
                            <span>View Full Profile</span>
                          </Link>
                        </div>

                        <div className="p-1 space-y-0.5">
                          {iBlockedPartner ? (
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
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Messages History List */}
              <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-3.5 custom-scrollbar">
                {threadMessages.length > 0 ? (
                  threadMessages.map((msg) => {
                    const isMine = msg.sender_id === currentUser?.id;
                    const isEditing = editingMsgId === msg.id;

                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col group ${isMine ? 'items-end' : 'items-start'}`}
                      >
                        {isEditing ? (
                          <div className="w-full max-w-md bg-zinc-900 border border-purple-500/60 rounded-2xl p-3 shadow-2xl space-y-2.5">
                            <input
                              type="text"
                              value={editInputText}
                              onChange={(e) => setEditInputText(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveEdit(msg.id);
                                if (e.key === 'Escape') handleCancelEdit();
                              }}
                              autoFocus
                              className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-zinc-100 focus:outline-none focus:border-teal-400"
                            />
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={handleCancelEdit}
                                className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5" /> Cancel
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSaveEdit(msg.id)}
                                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-teal-500 text-white text-xs font-bold flex items-center gap-1 shadow-sm cursor-pointer"
                              >
                                <Check className="w-3.5 h-3.5" /> Save
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="relative flex items-center gap-2 group/bubble">
                            {/* Action Buttons for own messages */}
                            {isMine && !iBlockedPartner && !partnerBlockedMe && (
                              <div className="opacity-80 sm:opacity-0 group-hover/bubble:opacity-100 transition-opacity flex items-center gap-1 bg-zinc-900 border border-zinc-800 px-1.5 py-1 rounded-xl shadow-lg shrink-0">
                                <button
                                  type="button"
                                  onClick={() => handleStartEdit(msg.id, msg.content)}
                                  title="Edit message"
                                  className="p-1.5 rounded-lg text-zinc-400 hover:text-purple-300 hover:bg-zinc-800 transition-colors cursor-pointer"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDelete(msg.id)}
                                  title="Unsend / Delete message"
                                  className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}

                            <div
                              className={`max-w-[85vw] sm:max-w-md rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                                isMine
                                  ? 'bg-gradient-to-r from-purple-600 to-teal-600 text-white rounded-br-none shadow-md'
                                  : 'bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-bl-none shadow-sm'
                              }`}
                            >
                              {msg.content}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 mt-1 px-1">
                          <span>
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {msg.updated_at && (
                            <span className="text-[9px] text-zinc-600 italic">(edited)</span>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-20 text-zinc-500 space-y-3">
                    <div className="w-12 h-12 rounded-3xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto text-purple-400">
                      <MessageSquare className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-bold text-zinc-300">No messages yet with {activePartner.full_name}.</p>
                    <p className="text-[11px] text-zinc-500 max-w-xs mx-auto">
                      Send a message to connect and match vibes on CSJMU campus!
                    </p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input Bottom Bar or Blocked/Suspended Banner */}
              <div className="p-3 sm:p-4 border-t border-zinc-800 bg-zinc-900/80 backdrop-blur-md shrink-0">
                {isPartnerBanned ? (
                  <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-3 text-xs text-rose-300">
                    <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                    <span>
                      <strong>Account Suspended:</strong> This student account was banned by campus administrators for violating community safety standards.
                    </span>
                  </div>
                ) : iBlockedPartner ? (
                  <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-zinc-300">
                      <UserX className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>You have blocked this student. Unblock them to continue chatting.</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleUnblock}
                      className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
                    >
                      <UserCheck className="w-3.5 h-3.5" /> Unblock Student
                    </button>
                  </div>
                ) : partnerBlockedMe ? (
                  <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center gap-3 text-xs text-zinc-400">
                    <Lock className="w-4 h-4 text-zinc-500 shrink-0" />
                    <span>You cannot reply to this conversation.</span>
                  </div>
                ) : isVerified ? (
                  <form onSubmit={handleSend} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder={`Message ${activePartner.full_name || 'student'}...`}
                      className="flex-1 bg-zinc-950 border border-zinc-800 focus:border-purple-500 rounded-2xl px-4 py-3 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none transition-colors"
                    />
                    <button
                      type="submit"
                      disabled={isSending || !messageText.trim()}
                      className="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-500 hover:to-teal-400 text-white text-xs font-bold shadow-glow-purple transition-all disabled:opacity-40 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span className="hidden sm:inline">Send</span>
                    </button>
                  </form>
                ) : (
                  <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-rose-300">
                      <Lock className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>
                        <strong>Messaging locked:</strong> Verify your CSJMU student ID card to start chatting.
                      </span>
                    </div>
                    <Link
                      href="/verify-id"
                      className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow transition-colors flex items-center gap-1.5 shrink-0"
                    >
                      <Camera className="w-3.5 h-3.5" /> Verify ID Now
                    </Link>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-zinc-500">
              <div className="w-16 h-16 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-3 text-zinc-600">
                <MessageSquare className="w-8 h-8" />
              </div>
              <h3 className="font-extrabold text-zinc-200 text-sm">Select a Conversation</h3>
              <p className="text-xs text-zinc-500 max-w-xs mt-1">
                Choose a CSJMU student from the list on the left to start chatting.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={
      <div className="h-[calc(100dvh-4rem)] flex items-center justify-center text-zinc-400 text-xs">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <MessagesContent />
    </Suspense>
  );
}

