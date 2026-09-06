'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/lib/authContext';
import { Profile, VerificationStatus, ReportStatus } from '@/lib/types';
import {
  ShieldCheck,
  ShieldAlert,
  Check,
  X,
  Eye,
  Clock,
  Layers,
  Search,
  Lock,
  Sparkles,
  Flag,
  UserX,
  UserCheck,
  ArrowRight,
} from 'lucide-react';

const ADMIN_EMAIL = 'prakharjain2731@gmail.com';

type AdminTab = 'verifications' | 'reports' | 'users';

export default function AdminVerificationsPage() {
  const {
    profiles,
    reports,
    updateVerificationStatus,
    banUser,
    unbanUser,
    updateReportStatus,
    currentUser,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<AdminTab>('verifications');
  const [selectedProfileForReview, setSelectedProfileForReview] = useState<Profile | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'verified' | 'rejected'>('all');
  const [reportFilter, setReportFilter] = useState<'all' | 'pending' | 'resolved' | 'dismissed'>('all');
  const [userFilter, setUserFilter] = useState<'all' | 'banned' | 'active'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  // Ban Modal State
  const [banningUser, setBanningUser] = useState<Profile | null>(null);
  const [banReasonInput, setBanReasonInput] = useState('Violation of student network community guidelines.');
  const [isProcessingBan, setIsProcessingBan] = useState(false);

  // === ADMIN ACCESS GATE ===
  const isAdmin = currentUser?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  const showToast = (msg: string) => {
    setActionSuccessMessage(msg);
    setTimeout(() => setActionSuccessMessage(null), 4000);
  };

  if (!isAdmin) {
    return (
      <div className="min-h-[88vh] flex flex-col items-center justify-center px-4 text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
          <Lock className="w-10 h-10" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-white mb-2">Access Denied</h1>
          <p className="text-sm text-zinc-400 max-w-sm mx-auto">
            This admin panel is restricted. Only authorised administrators can access this page.
          </p>
        </div>
        <Link
          href="/discover"
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-teal-500 text-white font-bold text-sm shadow-glow-purple"
        >
          Back to Discover
        </Link>
      </div>
    );
  }

  const handleVerificationAction = async (userId: string, status: VerificationStatus, studentName: string) => {
    await updateVerificationStatus(userId, status);
    showToast(`Marked ${studentName} as ${status.toUpperCase()}`);
    if (selectedProfileForReview?.id === userId) {
      setSelectedProfileForReview((prev) => (prev ? { ...prev, verification_status: status } : null));
    }
  };

  const handleConfirmBan = async () => {
    if (!banningUser) return;
    setIsProcessingBan(true);
    try {
      await banUser(banningUser.id, banReasonInput);
      showToast(`Suspended / Banned ${banningUser.full_name} from the platform.`);
      setBanningUser(null);
    } catch {
      showToast('Failed to ban user.');
    } finally {
      setIsProcessingBan(false);
    }
  };

  const handleUnban = async (user: Profile) => {
    if (window.confirm(`Unban ${user.full_name}? Their access will be restored.`)) {
      await unbanUser(user.id);
      showToast(`Unbanned ${user.full_name}. Account is now active.`);
    }
  };

  const handleReportStatusChange = async (reportId: string, status: ReportStatus, reportedName: string) => {
    await updateReportStatus(reportId, status);
    showToast(`Report on ${reportedName} marked as ${status.toUpperCase()}.`);
  };

  // Stats Counters
  const pendingCount = profiles.filter((p) => p.verification_status === 'pending').length;
  const verifiedCount = profiles.filter((p) => p.verification_status === 'verified').length;
  const rejectedCount = profiles.filter((p) => p.verification_status === 'rejected').length;
  const bannedCount = profiles.filter((p) => p.is_banned).length;
  const pendingReportsCount = reports.filter((r) => r.status === 'pending').length;

  // Filtered Lists
  const filteredVerificationList = profiles.filter((p) => {
    if (filterStatus !== 'all' && p.verification_status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const fullName = (p.full_name || '').toLowerCase();
      const dept = (p.department || '').toLowerCase();
      const email = (p.email || '').toLowerCase();
      return fullName.includes(q) || dept.includes(q) || email.includes(q);
    }
    return true;
  });

  const filteredReportsList = reports.filter((r) => {
    if (reportFilter !== 'all' && r.status !== reportFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const repName = (r.reporter?.full_name || '').toLowerCase();
      const targetName = (r.reported?.full_name || '').toLowerCase();
      const reason = (r.reason || '').toLowerCase();
      return repName.includes(q) || targetName.includes(q) || reason.includes(q);
    }
    return true;
  });

  const filteredUsersList = profiles.filter((p) => {
    if (userFilter === 'banned' && !p.is_banned) return false;
    if (userFilter === 'active' && p.is_banned) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const fullName = (p.full_name || '').toLowerCase();
      const dept = (p.department || '').toLowerCase();
      const email = (p.email || '').toLowerCase();
      return fullName.includes(q) || dept.includes(q) || email.includes(q);
    }
    return true;
  });

  return (
    <div className="min-h-screen py-6 sm:py-10 px-3.5 sm:px-6 max-w-6xl mx-auto space-y-6 sm:space-y-8">
      {/* Toast Alert */}
      {actionSuccessMessage && (
        <div className="fixed top-20 right-4 sm:right-6 z-50 bg-purple-600 text-white px-4 py-2.5 rounded-2xl text-xs font-bold shadow-2xl flex items-center gap-2 animate-in slide-in-from-top-4">
          <Sparkles className="w-4 h-4" />
          <span>{actionSuccessMessage}</span>
        </div>
      )}

      {/* Ban Reason Prompt Modal */}
      {banningUser && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                <UserX className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-white text-base">
                  Ban Student: {banningUser.full_name}
                </h3>
                <p className="text-xs text-zinc-400">
                  {banningUser.department} • {banningUser.email}
                </p>
              </div>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              Banning this user will immediately revoke their messaging access, suspend their profile, and prevent them from using campus features.
            </p>

            <div>
              <label className="block text-xs font-bold text-zinc-200 mb-1.5">
                Official Ban Reason (shown on suspension notice)
              </label>
              <textarea
                value={banReasonInput}
                onChange={(e) => setBanReasonInput(e.target.value)}
                rows={3}
                placeholder="e.g. Repeated harassment in direct messages, fake identity card submitted..."
                className="w-full bg-zinc-900 border border-zinc-800 focus:border-rose-500 rounded-2xl p-3 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setBanningUser(null)}
                className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold border border-zinc-800"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isProcessingBan || !banReasonInput.trim()}
                onClick={handleConfirmBan}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg transition-all disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
              >
                {isProcessingBan ? 'Banning…' : 'Confirm Ban & Suspend'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ID Detail Inspection Modal */}
      {selectedProfileForReview && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl sm:rounded-3xl max-w-2xl w-full p-4 sm:p-6 space-y-5 sm:space-y-6 shadow-2xl relative max-h-[92dvh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold shrink-0">
                  🪪
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-white text-sm sm:text-base truncate">
                    CSJMU ID Inspection: {selectedProfileForReview.full_name}
                  </h3>
                  <p className="text-xs text-zinc-400 truncate">
                    {selectedProfileForReview.department} • Year {selectedProfileForReview.year}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedProfileForReview(null)}
                className="text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-zinc-800 shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* ID Card Display */}
            <div className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 flex items-center justify-center">
              {selectedProfileForReview.id_card_url ? (
                selectedProfileForReview.id_card_url.startsWith('data:') ? (
                  <img
                    src={selectedProfileForReview.id_card_url}
                    alt="Student ID Card"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="relative w-full h-full">
                    <Image
                      src={selectedProfileForReview.id_card_url}
                      alt="Student ID Card"
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                )
              ) : (
                <div className="text-center p-6 text-zinc-500">
                  <ShieldAlert className="w-10 h-10 mx-auto mb-2 text-amber-400 opacity-60" />
                  <p className="text-xs">No physical ID image uploaded yet.</p>
                </div>
              )}
            </div>

            {/* Info details */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 bg-zinc-900/60 p-3 sm:p-3.5 rounded-2xl text-xs">
              <div>
                <span className="text-zinc-500 block text-[10px]">Student Email</span>
                <span className="font-semibold text-zinc-200 truncate block">
                  {selectedProfileForReview.email || 'student@csjMU.ac.in'}
                </span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px]">College</span>
                <span className="font-semibold text-teal-400">CSJMU Kanpur</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px]">Year / Dept</span>
                <span className="font-semibold text-zinc-200">
                  Year {selectedProfileForReview.year || '1'}
                </span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px]">Current Status</span>
                <span className="font-semibold capitalize text-purple-400">
                  {selectedProfileForReview.verification_status}
                </span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3 pt-2">
              <button
                type="button"
                onClick={() =>
                  handleVerificationAction(selectedProfileForReview.id, 'rejected', selectedProfileForReview.full_name)
                }
                className="w-full sm:w-auto justify-center px-4 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold text-xs border border-rose-500/30 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" /> Reject ID
              </button>

              <button
                type="button"
                onClick={() =>
                  handleVerificationAction(selectedProfileForReview.id, 'verified', selectedProfileForReview.full_name)
                }
                className="w-full sm:w-auto justify-center px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs shadow-lg flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Check className="w-4 h-4" /> Approve & Verify
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-zinc-800/80 pb-5 sm:pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-semibold mb-2">
            <Layers className="w-3.5 h-3.5" /> Proctor Portal
          </div>
          <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight">
            CSJMU Safety &amp; Administration Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Review student ID cards, inspect &ldquo;who reported whom&rdquo; moderation logs, and manage user bans.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4">
        <div className="bg-zinc-900/60 border border-amber-500/30 rounded-2xl p-4 sm:p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-zinc-400">Pending IDs</span>
            <div className="text-xl sm:text-2xl font-black text-amber-400 mt-1">{pendingCount}</div>
          </div>
          <Clock className="w-7 h-7 sm:w-8 sm:h-8 text-amber-400/40" />
        </div>

        <div className="bg-zinc-900/60 border border-rose-500/30 rounded-2xl p-4 sm:p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-zinc-400">User Reports</span>
            <div className="text-xl sm:text-2xl font-black text-rose-400 mt-1">{pendingReportsCount}</div>
          </div>
          <Flag className="w-7 h-7 sm:w-8 sm:h-8 text-rose-400/40" />
        </div>

        <div className="bg-zinc-900/60 border border-purple-500/30 rounded-2xl p-4 sm:p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-zinc-400">Banned Accounts</span>
            <div className="text-xl sm:text-2xl font-black text-purple-400 mt-1">{bannedCount}</div>
          </div>
          <UserX className="w-7 h-7 sm:w-8 sm:h-8 text-purple-400/40" />
        </div>

        <div className="bg-zinc-900/60 border border-teal-500/30 rounded-2xl p-4 sm:p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-zinc-400">Verified Students</span>
            <div className="text-xl sm:text-2xl font-black text-teal-400 mt-1">{verifiedCount}</div>
          </div>
          <ShieldCheck className="w-7 h-7 sm:w-8 sm:h-8 text-teal-400/40" />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-zinc-800 gap-2 sm:gap-4 overflow-x-auto">
        <button
          type="button"
          onClick={() => {
            setActiveTab('verifications');
            setSearchQuery('');
          }}
          className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all shrink-0 cursor-pointer ${
            activeTab === 'verifications'
              ? 'border-purple-500 text-purple-400'
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>ID Verifications</span>
          {pendingCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-amber-500 text-zinc-950 font-black text-[10px]">
              {pendingCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('reports');
            setSearchQuery('');
          }}
          className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all shrink-0 cursor-pointer ${
            activeTab === 'reports'
              ? 'border-rose-500 text-rose-400'
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          <Flag className="w-4 h-4" />
          <span>User Reports &amp; Safety</span>
          {pendingReportsCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white font-black text-[10px]">
              {pendingReportsCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('users');
            setSearchQuery('');
          }}
          className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all shrink-0 cursor-pointer ${
            activeTab === 'users'
              ? 'border-teal-500 text-teal-400'
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          <UserX className="w-4 h-4" />
          <span>Student Ban Management</span>
          {bannedCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-300 font-black text-[10px]">
              {bannedCount} Banned
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: ID VERIFICATIONS */}
      {activeTab === 'verifications' && (
        <div className="space-y-4">
          {/* Filter & Search */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                  filterStatus === 'all'
                    ? 'bg-purple-600 text-white shadow-glow-purple'
                    : 'bg-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                All ({profiles.length})
              </button>
              <button
                onClick={() => setFilterStatus('pending')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                  filterStatus === 'pending'
                    ? 'bg-amber-500 text-zinc-950 font-bold'
                    : 'bg-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                Pending ({pendingCount})
              </button>
              <button
                onClick={() => setFilterStatus('verified')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                  filterStatus === 'verified'
                    ? 'bg-teal-500 text-zinc-950 font-bold'
                    : 'bg-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                Verified ({verifiedCount})
              </button>
              <button
                onClick={() => setFilterStatus('rejected')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                  filterStatus === 'rejected'
                    ? 'bg-rose-500 text-white font-bold'
                    : 'bg-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                Rejected ({rejectedCount})
              </button>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search student or email..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Submissions List */}
          <div className="bg-zinc-900/70 border border-zinc-800 rounded-3xl overflow-hidden shadow-xl divide-y divide-zinc-800/80">
            {filteredVerificationList.length === 0 ? (
              <div className="p-12 text-center text-zinc-500 text-xs">
                No ID submissions found matching this filter.
              </div>
            ) : (
              filteredVerificationList.map((profile) => (
                <div
                  key={profile.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-zinc-800/40 transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-800 border border-zinc-700/80 shrink-0 overflow-hidden flex items-center justify-center font-bold text-xs relative">
                      {profile.avatar_url ? (
                        <Image src={profile.avatar_url} alt={profile.full_name || 'Student'} fill className="object-cover" unoptimized />
                      ) : (
                        <span>{(profile.full_name || 'U').charAt(0).toUpperCase()}</span>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-white text-sm truncate">
                          {profile.full_name || 'CSJMU Student'}
                        </h3>
                        {profile.verification_status === 'verified' && (
                          <span className="bg-teal-500/20 text-teal-400 border border-teal-500/40 text-[10px] font-bold px-2 py-0.2 rounded-full">
                            Verified
                          </span>
                        )}
                        {profile.verification_status === 'pending' && (
                          <span className="bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px] font-bold px-2 py-0.2 rounded-full animate-pulse">
                            Pending Review
                          </span>
                        )}
                        {profile.verification_status === 'rejected' && (
                          <span className="bg-rose-500/20 text-rose-400 border border-rose-500/40 text-[10px] font-bold px-2 py-0.2 rounded-full">
                            Rejected
                          </span>
                        )}
                        {profile.verification_status === 'unverified' && (
                          <span className="bg-zinc-800 text-zinc-400 border border-zinc-700 text-[10px] font-bold px-2 py-0.2 rounded-full">
                            Unverified
                          </span>
                        )}
                        {profile.is_banned && (
                          <span className="bg-rose-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded">
                            BANNED
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-zinc-400 flex items-center gap-2 sm:gap-3 mt-1 truncate">
                        <span>{profile.department}</span>
                        <span>•</span>
                        <span>Year {profile.year || '1'}</span>
                        <span>•</span>
                        <span className="text-zinc-500">{profile.email || 'CSJMU'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {profile.id_card_url ? (
                      <button
                        type="button"
                        onClick={() => setSelectedProfileForReview(profile)}
                        className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-teal-400" />
                        <span>Inspect ID</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-zinc-500 italic px-2">No ID image</span>
                    )}

                    {profile.verification_status !== 'verified' && (
                      <button
                        type="button"
                        onClick={() => handleVerificationAction(profile.id, 'verified', profile.full_name)}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-1 shadow-sm cursor-pointer"
                        title="Approve ID"
                      >
                        <Check className="w-3.5 h-3.5" /> Approve
                      </button>
                    )}

                    {profile.verification_status !== 'rejected' && (
                      <button
                        type="button"
                        onClick={() => handleVerificationAction(profile.id, 'rejected', profile.full_name)}
                        className="px-3.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-bold transition-all flex items-center gap-1 border border-rose-500/30 cursor-pointer"
                        title="Reject ID"
                      >
                        <X className="w-3.5 h-3.5" /> Reject
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 2: USER REPORTS ("WHO REPORTED WHOM") */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          {/* Filter & Search */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
              <button
                onClick={() => setReportFilter('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                  reportFilter === 'all'
                    ? 'bg-purple-600 text-white shadow-glow-purple'
                    : 'bg-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                All Reports ({reports.length})
              </button>
              <button
                onClick={() => setReportFilter('pending')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                  reportFilter === 'pending'
                    ? 'bg-rose-500 text-white font-bold'
                    : 'bg-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                Pending Review ({pendingReportsCount})
              </button>
              <button
                onClick={() => setReportFilter('resolved')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                  reportFilter === 'resolved'
                    ? 'bg-teal-500 text-zinc-950 font-bold'
                    : 'bg-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                Resolved ({reports.filter((r) => r.status === 'resolved').length})
              </button>
              <button
                onClick={() => setReportFilter('dismissed')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                  reportFilter === 'dismissed'
                    ? 'bg-zinc-700 text-white font-bold'
                    : 'bg-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                Dismissed ({reports.filter((r) => r.status === 'dismissed').length})
              </button>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search reporter, reported, or reason..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Reports Feed */}
          <div className="space-y-3.5">
            {filteredReportsList.length === 0 ? (
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-12 text-center text-zinc-500 text-xs">
                <Flag className="w-10 h-10 mx-auto mb-2 text-zinc-700" />
                <p className="font-bold text-zinc-400">No reports found.</p>
                <p className="text-[11px] text-zinc-600 mt-1">Student misconduct and message reports will appear here.</p>
              </div>
            ) : (
              filteredReportsList.map((report) => {
                const reporter = report.reporter || profiles.find((p) => p.id === report.reporter_id);
                const reported = report.reported || profiles.find((p) => p.id === report.reported_id);
                const isReportedBanned = reported?.is_banned;

                return (
                  <div
                    key={report.id}
                    className="bg-zinc-900/70 border border-zinc-800 rounded-3xl p-4 sm:p-5 space-y-4 hover:border-zinc-700 transition-colors shadow-xl"
                  >
                    {/* Header with Status & Timestamp */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800/80 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 font-bold text-xs border border-rose-500/30 flex items-center gap-1.5">
                          <Flag className="w-3.5 h-3.5 text-rose-400" />
                          {report.reason}
                        </span>

                        {report.status === 'pending' && (
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold text-[11px] border border-amber-500/40">
                            Pending Review
                          </span>
                        )}
                        {report.status === 'resolved' && (
                          <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-semibold text-[11px] border border-teal-500/40">
                            Resolved
                          </span>
                        )}
                        {report.status === 'dismissed' && (
                          <span className="px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-400 font-semibold text-[11px] border border-zinc-700">
                            Dismissed
                          </span>
                        )}
                      </div>

                      <span className="text-zinc-500 text-[11px]">
                        {new Date(report.created_at).toLocaleString()}
                      </span>
                    </div>

                    {/* WHO REPORTED WHOM VISUAL CARDS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 items-center">
                      {/* Left: Reporter */}
                      <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-2xl p-3.5 flex items-center gap-3">
                        <div className="relative w-11 h-11 rounded-xl bg-zinc-800 overflow-hidden flex items-center justify-center font-bold text-xs shrink-0">
                          {reporter?.avatar_url ? (
                            <Image src={reporter.avatar_url} alt="Reporter" fill className="object-cover" unoptimized />
                          ) : (
                            <span>{(reporter?.full_name || 'U').charAt(0).toUpperCase()}</span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-purple-400 block mb-0.5">
                            Reported By
                          </span>
                          <h4 className="font-bold text-white text-xs truncate">
                            {reporter?.full_name || 'CSJMU Student'}
                          </h4>
                          <p className="text-[11px] text-zinc-400 truncate">
                            {reporter?.department || 'Student'} • {reporter?.email || 'N/A'}
                          </p>
                        </div>
                      </div>

                      {/* Right: Target Reported Student */}
                      <div className="bg-zinc-950/60 border border-rose-950/50 rounded-2xl p-3.5 flex items-center justify-between gap-3 relative">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="relative w-11 h-11 rounded-xl bg-zinc-800 overflow-hidden flex items-center justify-center font-bold text-xs shrink-0">
                            {reported?.avatar_url ? (
                              <Image src={reported.avatar_url} alt="Reported" fill className="object-cover" unoptimized />
                            ) : (
                              <span>{(reported?.full_name || 'U').charAt(0).toUpperCase()}</span>
                            )}
                            {isReportedBanned && (
                              <div className="absolute inset-0 bg-rose-950/80 flex items-center justify-center text-[9px] text-white font-black">
                                BAN
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-rose-400 block mb-0.5">
                              Reported User (Target)
                            </span>
                            <h4 className="font-bold text-white text-xs truncate flex items-center gap-1.5">
                              {reported?.full_name || 'Unknown Student'}
                              {isReportedBanned && (
                                <span className="text-[9px] bg-rose-600 text-white px-1 rounded">BANNED</span>
                              )}
                            </h4>
                            <p className="text-[11px] text-zinc-400 truncate">
                              {reported?.department || 'Student'} • {reported?.email || 'N/A'}
                            </p>
                          </div>
                        </div>

                        {reported && (
                          <Link
                            href={`/profile/${reported.id}`}
                            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors shrink-0"
                            title="View Profile"
                          >
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        )}
                      </div>
                    </div>

                    {/* Details / Notes */}
                    {report.details && (
                      <div className="bg-zinc-950/50 rounded-2xl p-3 border border-zinc-800/80 text-xs text-zinc-300">
                        <span className="font-bold text-zinc-400 block mb-1">Reporter&apos;s Statement:</span>
                        <p className="italic text-zinc-300">&ldquo;{report.details}&rdquo;</p>
                      </div>
                    )}

                    {/* Admin Actions Bar */}
                    <div className="flex flex-wrap items-center justify-end gap-2 pt-1 border-t border-zinc-800/60">
                      {reported && (
                        isReportedBanned ? (
                          <button
                            type="button"
                            onClick={() => handleUnban(reported)}
                            className="px-3.5 py-1.5 rounded-xl bg-teal-600/20 hover:bg-teal-600/30 text-teal-300 border border-teal-500/30 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <UserCheck className="w-3.5 h-3.5 text-teal-400" /> Unban {reported.full_name.split(' ')[0]}
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setBanningUser(reported);
                              setBanReasonInput(`Reported for: ${report.reason}. ${report.details || ''}`);
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <UserX className="w-3.5 h-3.5" /> Ban {reported.full_name.split(' ')[0]}
                          </button>
                        )
                      )}

                      {report.status !== 'resolved' && (
                        <button
                          type="button"
                          onClick={() => handleReportStatusChange(report.id, 'resolved', reported?.full_name || 'student')}
                          className="px-3.5 py-1.5 rounded-xl bg-teal-600/20 hover:bg-teal-600/30 text-teal-300 border border-teal-500/30 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5 text-teal-400" /> Mark Resolved
                        </button>
                      )}

                      {report.status !== 'dismissed' && (
                        <button
                          type="button"
                          onClick={() => handleReportStatusChange(report.id, 'dismissed', reported?.full_name || 'student')}
                          className="px-3.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" /> Dismiss
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 3: STUDENT BAN & USER MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          {/* Filter & Search */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => setUserFilter('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                  userFilter === 'all'
                    ? 'bg-purple-600 text-white shadow-glow-purple'
                    : 'bg-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                All Students ({profiles.length})
              </button>
              <button
                onClick={() => setUserFilter('banned')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                  userFilter === 'banned'
                    ? 'bg-rose-500 text-white font-bold'
                    : 'bg-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                Banned / Suspended ({bannedCount})
              </button>
              <button
                onClick={() => setUserFilter('active')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                  userFilter === 'active'
                    ? 'bg-teal-500 text-zinc-950 font-bold'
                    : 'bg-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                Active ({profiles.length - bannedCount})
              </button>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search student or email..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Student Directory Table */}
          <div className="bg-zinc-900/70 border border-zinc-800 rounded-3xl overflow-hidden shadow-xl divide-y divide-zinc-800/80">
            {filteredUsersList.length === 0 ? (
              <div className="p-12 text-center text-zinc-500 text-xs">
                No students match your filter.
              </div>
            ) : (
              filteredUsersList.map((user) => (
                <div
                  key={user.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-zinc-800/40 transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-800 border border-zinc-700/80 shrink-0 overflow-hidden flex items-center justify-center font-bold text-xs relative">
                      {user.avatar_url ? (
                        <Image src={user.avatar_url} alt={user.full_name || 'Student'} fill className="object-cover" unoptimized />
                      ) : (
                        <span>{(user.full_name || 'U').charAt(0).toUpperCase()}</span>
                      )}
                      {user.is_banned && (
                        <div className="absolute inset-0 bg-rose-950/80 flex items-center justify-center text-[9px] text-white font-black">
                          BAN
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-white text-sm truncate">
                          {user.full_name || 'CSJMU Student'}
                        </h3>
                        {user.is_banned ? (
                          <span className="bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-bold px-2 py-0.2 rounded-full">
                            Banned / Suspended
                          </span>
                        ) : (
                          <span className="bg-teal-500/20 text-teal-300 border border-teal-500/40 text-[10px] font-bold px-2 py-0.2 rounded-full">
                            Active Account
                          </span>
                        )}
                        {user.verification_status === 'verified' && (
                          <span className="bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-bold px-2 py-0.2 rounded-full">
                            Verified
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-zinc-400 flex items-center gap-2 sm:gap-3 mt-1 truncate">
                        <span>{user.department || 'Student'}</span>
                        <span>•</span>
                        <span>Year {user.year || '1'}</span>
                        <span>•</span>
                        <span className="text-zinc-500">{user.email || 'CSJMU'}</span>
                      </div>

                      {user.is_banned && user.ban_reason && (
                        <p className="text-[11px] text-rose-400/90 mt-1 italic">
                          Ban reason: {user.ban_reason}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions: Ban / Unban & View */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <Link
                      href={`/profile/${user.id}`}
                      className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold transition-colors"
                    >
                      View Profile
                    </Link>

                    {user.is_banned ? (
                      <button
                        type="button"
                        onClick={() => handleUnban(user)}
                        className="px-4 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <UserCheck className="w-3.5 h-3.5" /> Unban Student
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setBanningUser(user)}
                        className="px-4 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/40 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <UserX className="w-3.5 h-3.5" /> Ban Student
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
