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
    // Exclude current user from the discover grid
    if (currentUser && profile.id === currentUser.id) return false;

    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const fullName = (profile.full_name || '').toLowerCase();
      const dept = (profile.department || '').toLowerCase();
      const bio = (profile.bio || '').toLowerCase();
      const nameMatch = fullName.includes(q);
      const deptMatch = isVerified && dept.includes(q);
      const bioMatch = bio.includes(q);
      if (!nameMatch && !deptMatch && !bioMatch) return false;
    }

    // Hobby match
    if (selectedHobby) {
      const hasHobby = profile.hobbies?.some((h) =>
        typeof h === 'string' ? h === selectedHobby : h?.name === selectedHobby
      );
      if (!hasHobby) return false;
    }

    // Year match
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
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-semibold mb-2">
            <Compass className="w-3.5 h-3.5" /> CSJMU Campus Feed
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Discover Your Campus Vibe
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Connect with CSJMU batchmates sharing your hobbies, projects, and sports.
          </p>
        </div>

        {/* Verification Status Pill */}
        <div className="flex items-center gap-3">
          {isVerified ? (
            <div className="px-3.5 py-2 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>
                <strong>Verified View:</strong> Full profiles & messaging active
              </span>
            </div>
          ) : (
            <Link
              href="/verify-id"
              className="px-3.5 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 hover:bg-rose-500/20 transition-colors"
            >
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>
                <strong>Restricted View:</strong> Verify ID to unlock full photos
              </span>
            </Link>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 sm:p-5 space-y-4">
        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              isVerified
                ? 'Search students by name, hobby, or department (e.g. Coding, UIET, Dancing)...'
                : 'Search students by name or hobby...'
            }
            className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-purple-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none transition-colors"
          />
        </div>

        {/* Hobby and Year Filter Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
          {/* Hobby Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-zinc-400 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3 text-purple-400" /> Vibes:
            </span>
            <button
              onClick={() => setSelectedHobby(null)}
              className={`px-3 py-1 text-xs font-semibold rounded-full border transition-all ${
                selectedHobby === null
                  ? 'bg-white text-zinc-950 border-white font-bold'
                  : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              All Vibes
            </button>
            {hobbies.map((hobby) => (
              <HobbyBadge
                key={hobby.id}
                hobby={hobby}
                size="sm"
                selected={selectedHobby === hobby.name}
                onClick={() => setSelectedHobby(selectedHobby === hobby.name ? null : hobby.name)}
              />
            ))}
          </div>

          {/* Year selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500">Year:</span>
            <select
              value={selectedYear || ''}
              onChange={(e) => setSelectedYear(e.target.value || null)}
              className="bg-zinc-950 border border-zinc-800 text-zinc-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-purple-500"
            >
              <option value="">All Years</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Profile Grid Results */}
      {filteredProfiles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfiles.map((profile) => (
            <StudentCard key={profile.id} profile={profile} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 rounded-3xl bg-zinc-900/30 border border-zinc-800/80">
          <Users className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-zinc-300">No students match your filter</h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
            Try clearing the search query or selecting a different hobby tag.
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
