'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/lib/authContext';
import { Profile, VerificationStatus } from '@/lib/types';
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
} from 'lucide-react';

const ADMIN_EMAIL = 'prakharjain2731@gmail.com';

export default function AdminVerificationsPage() {
  const { profiles, updateVerificationStatus, currentUser } = useAuth();
  const [selectedProfileForReview, setSelectedProfileForReview] = useState<Profile | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'verified' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  // === ADMIN ACCESS GATE ===
  const isAdmin = currentUser?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

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


  const handleAction = async (userId: string, status: VerificationStatus, studentName: string) => {
    await updateVerificationStatus(userId, status);
    setActionSuccessMessage(
      `Marked ${studentName} as ${status.toUpperCase()}`
    );
    if (selectedProfileForReview?.id === userId) {
      setSelectedProfileForReview((prev) => (prev ? { ...prev, verification_status: status } : null));
    }
    setTimeout(() => setActionSuccessMessage(null), 4000);
  };

  const pendingCount = profiles.filter((p) => p.verification_status === 'pending').length;
  const verifiedCount = profiles.filter((p) => p.verification_status === 'verified').length;
  const rejectedCount = profiles.filter((p) => p.verification_status === 'rejected').length;

  const filteredList = profiles.filter((p) => {
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

  return (
    <div className="min-h-screen py-6 sm:py-10 px-3.5 sm:px-6 max-w-6xl mx-auto space-y-6 sm:space-y-8">
      {/* Toast Alert */}
      {actionSuccessMessage && (
        <div className="fixed top-20 right-4 sm:right-6 z-50 bg-purple-600 text-white px-4 py-2.5 rounded-2xl text-xs font-bold shadow-2xl flex items-center gap-2 animate-in slide-in-from-top-4">
          <Sparkles className="w-4 h-4" />
          <span>{actionSuccessMessage}</span>
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
                  {selectedProfileForReview.email || 'student@csjmu.ac.in'}
                </span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px]">College</span>
                <span className="font-semibold text-teal-400">CSJMU Kanpur</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px]">Year / Dept</span>
                <span className="font-semibold text-zinc-200">
                  Year {selectedProfileForReview.year}
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
                  handleAction(selectedProfileForReview.id, 'rejected', selectedProfileForReview.full_name)
                }
                className="w-full sm:w-auto justify-center px-4 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold text-xs border border-rose-500/30 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" /> Reject ID
              </button>

              <button
                type="button"
                onClick={() =>
                  handleAction(selectedProfileForReview.id, 'verified', selectedProfileForReview.full_name)
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
            CSJMU ID Verification Queue
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Review live camera student ID snapshots, cross-reference department details, and grant verified status.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-zinc-900/60 border border-amber-500/30 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-zinc-400">Pending Review</span>
            <div className="text-2xl font-black text-amber-400 mt-1">{pendingCount}</div>
          </div>
          <Clock className="w-8 h-8 text-amber-400/40" />
        </div>

        <div className="bg-zinc-900/60 border border-teal-500/30 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-zinc-400">Verified Students</span>
            <div className="text-2xl font-black text-teal-400 mt-1">{verifiedCount}</div>
          </div>
          <ShieldCheck className="w-8 h-8 text-teal-400/40" />
        </div>

        <div className="bg-zinc-900/60 border border-rose-500/30 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-zinc-400">Rejected / Needs Fix</span>
            <div className="text-2xl font-black text-rose-400 mt-1">{rejectedCount}</div>
          </div>
          <ShieldAlert className="w-8 h-8 text-rose-400/40" />
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filterStatus === 'all'
                ? 'bg-purple-600 text-white shadow-glow-purple'
                : 'bg-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            All ({profiles.length})
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filterStatus === 'pending'
                ? 'bg-amber-500 text-zinc-950 font-bold'
                : 'bg-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setFilterStatus('verified')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filterStatus === 'verified'
                ? 'bg-teal-500 text-zinc-950 font-bold'
                : 'bg-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            Verified ({verifiedCount})
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

      {/* Submissions Table / Cards */}
      <div className="bg-zinc-900/70 border border-zinc-800 rounded-3xl overflow-hidden shadow-xl divide-y divide-zinc-800/80">
        {filteredList.map((profile) => (
          <div
            key={profile.id}
            className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-zinc-800/40 transition-colors"
          >
            {/* Student Info */}
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-zinc-800 border border-zinc-700/80 shrink-0 overflow-hidden flex items-center justify-center font-bold text-xs relative">
                {profile.avatar_url ? (
                  <Image src={profile.avatar_url} alt={profile.full_name || 'Student'} fill className="object-cover" unoptimized />
                ) : (
                  <span>{(profile.full_name || 'U').charAt(0).toUpperCase()}</span>
                )}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
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
                </div>

                <div className="text-xs text-zinc-400 flex items-center gap-3 mt-1 truncate">
                  <span>{profile.department}</span>
                  <span>•</span>
                  <span>Year {profile.year}</span>
                  <span>•</span>
                  <span className="text-zinc-500">{profile.email || 'CSJMU'}</span>
                </div>
              </div>
            </div>

            {/* Actions: View ID & Quick Approve / Reject */}
            <div className="flex items-center gap-2 self-end sm:self-center">
              {profile.id_card_url ? (
                <button
                  type="button"
                  onClick={() => setSelectedProfileForReview(profile)}
                  className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-teal-400" />
                  <span>Inspect ID Photo</span>
                </button>
              ) : (
                <span className="text-[11px] text-zinc-500 italic px-2">No ID uploaded</span>
              )}

              {profile.verification_status !== 'verified' && (
                <button
                  type="button"
                  onClick={() => handleAction(profile.id, 'verified', profile.full_name)}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-1 shadow-sm cursor-pointer"
                  title="Approve ID"
                >
                  <Check className="w-3.5 h-3.5" /> Approve
                </button>
              )}

              {profile.verification_status !== 'rejected' && (
                <button
                  type="button"
                  onClick={() => handleAction(profile.id, 'rejected', profile.full_name)}
                  className="px-3.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-bold transition-all flex items-center gap-1 border border-rose-500/30 cursor-pointer"
                  title="Reject ID"
                >
                  <X className="w-3.5 h-3.5" /> Reject
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
