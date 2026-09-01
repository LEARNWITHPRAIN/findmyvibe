'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { StudentCard } from '@/components/StudentCard';
import { HobbyBadge } from '@/components/HobbyBadge';
import {
  Search,
  Compass,
  ShieldCheck,
  ShieldAlert,
  Users,
  Filter,
  ChevronDown,
} from 'lucide-react';

export default function DiscoverPage() {
  const router = useRouter();
  const { profiles, hobbies, currentUser, isLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHobby, setSelectedHobby] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);

  // Auth guard — redirect to login if not logged in
  useEffect(() => {
    if (!isLoading && !currentUser) {
      router.push('/login');
    }
  }, [currentUser, isLoading, router]);

  const isVerified = currentUser?.verification_status === 'verified';

  // Show only real (non-demo) profiles in the discover feed
  const realProfiles = profiles.filter((p) => !p.is_demo);

  // Filter profiles based on search, hobby, and year
  const filteredProfiles = realProfiles.filter((profile) => {
    if (currentUser && profile.id === currentUser.id) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const fullName = (profile.full_name || '').toLowerCase();
      const dept = (profile.department || '').toLowerCase();
      const bio = (profile.bio || '').toLowerCase();
      const nameMatch = fullName.includes(q);
      const deptMatch = isVerified && dept.includes(q);
      const bioMatch = bio.includes(q);
      const hobbyMatch = profile.hobbies?.some((h) =>
        (typeof h === 'string' ? h : h?.name || '').toLowerCase().includes(q)
      );
      if (!nameMatch && !deptMatch && !bioMatch && !hobbyMatch) return false;
    }

    if (selectedHobby) {
      const hasHobby = profile.hobbies?.some((h) =>
        typeof h === 'string' ? h === selectedHobby : h?.name === selectedHobby
      );
      if (!hasHobby) return false;
    }

    if (selectedYear) {
      if (profile.year !== selectedYear) return false;
    }

    return true;
  });

  if (isLoading || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 rounded-xl border-2 border-purple-500/50 border-t-purple-400 animate-spin" />
      </div>
    );
  }

  return (
    /* pb-28 leaves room for the fixed bottom nav bar */
    <div className="w-full max-w-2xl mx-auto px-3.5 sm:px-5 pt-5 pb-28 space-y-4">

      {/* ── Page Title ── */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-[11px] font-semibold mb-1.5">
          <Compass className="w-3 h-3" /> CSJMU Campus Feed
        </div>
        <h1 className="text-lg font-black text-white tracking-tight leading-tight">
          Discover Your Campus Vibe
        </h1>
        <p className="text-[11px] text-zinc-400 mt-0.5">
          Connect with CSJMU batchmates who share your interests.
        </p>
      </div>

      {/* ── Verification pill ── */}
      {isVerified ? (
        <div className="w-full px-3 py-2 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-300 text-[11px] flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
          <span><strong>Verified View:</strong> Full profiles &amp; messaging active</span>
        </div>
      ) : (
        <Link
          href="/verify-id"
          className="w-full px-3 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[11px] flex items-center gap-2 hover:bg-rose-500/20 transition-colors"
        >
          <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
          <span><strong>Restricted View:</strong> Verify ID to unlock full photos &amp; chat</span>
        </Link>
      )}

      {/* ── Search + Filters ── */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-3 space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, hobby, course…"
            className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-purple-500 rounded-xl pl-9 pr-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none transition-colors"
          />
        </div>

        {/* Vibe chips — horizontal scroll with right fade affordance */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5 flex items-center gap-1">
            <Filter className="w-3 h-3 text-purple-400" /> Filter by Vibe
          </p>
          <div className="relative">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
              <button
                onClick={() => setSelectedHobby(null)}
                className={`px-3 py-1 text-[11px] font-semibold rounded-full border transition-all shrink-0 cursor-pointer ${
                  selectedHobby === null
                    ? 'bg-white text-zinc-950 border-white'
                    : 'bg-zinc-950 text-zinc-400 border-zinc-700 hover:border-zinc-600'
                }`}
              >
                All
              </button>
              {hobbies.map((hobby) => (
                <div key={hobby.id} className="shrink-0">
                  <HobbyBadge
                    hobby={hobby}
                    size="sm"
                    selected={selectedHobby === hobby.name}
                    onClick={() => setSelectedHobby(selectedHobby === hobby.name ? null : hobby.name)}
                  />
                </div>
              ))}
              <div className="w-8 shrink-0" aria-hidden="true" />
            </div>
            {/* Right fade affordance */}
            <div
              className="pointer-events-none absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-zinc-900 to-transparent"
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Year filter */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-zinc-500 shrink-0">Year:</span>
          <div className="relative">
            <select
              value={selectedYear || ''}
              onChange={(e) => setSelectedYear(e.target.value || null)}
              className="appearance-none bg-zinc-950 border border-zinc-800 text-zinc-300 text-xs rounded-lg pl-2.5 pr-6 py-1.5 focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              <option value="">All Years</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-500" />
          </div>

          {/* Active filter count badge */}
          {(selectedHobby || selectedYear || searchQuery) && (
            <button
              onClick={() => { setSearchQuery(''); setSelectedHobby(null); setSelectedYear(null); }}
              className="ml-auto text-[11px] text-rose-400 hover:text-rose-300 font-semibold transition-colors shrink-0"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* ── Profile Grid ── */}
      {filteredProfiles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {filteredProfiles.map((profile) => (
            <StudentCard key={profile.id} profile={profile} />
          ))}
        </div>
      ) : (
        <div className="text-center py-14 px-4 rounded-2xl bg-zinc-900/30 border border-zinc-800/80">
          <Users className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-zinc-300">No students match your filter</h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-xs mx-auto">
            Try clearing the search or selecting a different vibe.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedHobby(null);
              setSelectedYear(null);
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
