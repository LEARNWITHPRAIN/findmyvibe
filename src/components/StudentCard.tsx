'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Profile } from '@/lib/types';
import { useAuth } from '@/lib/authContext';
import { HobbyBadge } from './HobbyBadge';
import { ShieldCheck, Lock, MessageSquare, ArrowUpRight, GraduationCap, MapPin, Clock } from 'lucide-react';

interface StudentCardProps {
  profile: Profile;
}

export function StudentCard({ profile }: StudentCardProps) {
  const { currentUser } = useAuth();
  const isViewerVerified = currentUser?.verification_status === 'verified';
  const isSelf = currentUser?.id === profile.id;

  return (
    <div className="group relative rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-950/20 flex flex-col justify-between overflow-hidden">
      {/* Top ambient color glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all pointer-events-none" />

      {/* Card Header & Avatar */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3.5">
            {/* Avatar Container */}
            <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-zinc-800 border border-zinc-700/80 flex items-center justify-center shrink-0">
              {isViewerVerified && profile.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  alt={profile.full_name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-900/40 via-zinc-800 to-teal-900/40 flex items-center justify-center text-zinc-300 font-bold text-lg">
                  {profile.full_name.charAt(0).toUpperCase()}
                </div>
              )}

              {/* Status indicator on avatar */}
              {profile.verification_status === 'verified' && (
                <div
                  className="absolute bottom-1 right-1 bg-emerald-500 text-zinc-950 p-0.5 rounded-full ring-2 ring-zinc-900 z-10"
                  title="CSJMU Verified Student"
                >
                  <ShieldCheck className="w-3.5 h-3.5 fill-current" />
                </div>
              )}
            </div>

            {/* Name and Basic Info */}
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <Link
                  href={`/profile/${profile.id}`}
                  className="font-bold text-zinc-100 hover:text-purple-400 text-base truncate transition-colors flex items-center gap-1"
                >
                  {profile.full_name}
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400" />
                </Link>
                {profile.verification_status === 'verified' && (
                  <span className="bg-teal-500/10 border border-teal-500/30 text-teal-400 text-[10px] font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Verified
                  </span>
                )}
                {(profile.verification_status === 'unverified' || profile.verification_status === 'rejected') && (
                  <span className="bg-zinc-800 border border-zinc-700 text-zinc-500 text-[10px] font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                    <Lock className="w-3 h-3 text-amber-500" /> Unverified
                  </span>
                )}
                {profile.verification_status === 'pending' && (
                  <span className="bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Pending
                  </span>
                )}
              </div>

              {/* Department & Year (Verified vs Locked) */}
              {isViewerVerified ? (
                <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1 truncate">
                  <GraduationCap className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                  <span className="truncate">
                    {profile.year ? `${profile.year}${getOrdinal(profile.year)} Year` : 'Student'} • {profile.department || 'CSJMU'}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs text-zinc-500 mt-1">
                  <Lock className="w-3 h-3 text-amber-500/80 shrink-0" />
                  <span className="italic">Dept & Year locked (Verify to view)</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bio (Truncated for clean look) */}
        {profile.bio && (
          <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2 mb-4">
            {profile.bio}
          </p>
        )}

        {/* Hobbies / Interests Chips */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mb-2">Interests & Vibe</p>
          <div className="flex flex-wrap gap-1.5">
            {profile.hobbies && profile.hobbies.length > 0 ? (
              profile.hobbies.map((hobby) => (
                <HobbyBadge key={typeof hobby === 'string' ? hobby : hobby.id} hobby={hobby} size="sm" />
              ))
            ) : (
              <span className="text-xs text-zinc-600 italic">No hobbies added yet</span>
            )}
          </div>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="px-5 py-3.5 border-t border-zinc-800/80 bg-zinc-950/40 flex items-center justify-between gap-3">
        <span className="text-[11px] text-zinc-500 flex items-center gap-1">
          <MapPin className="w-3 h-3 text-zinc-600" /> CSJMU Campus
        </span>

        <div className="flex items-center gap-2">
          <Link
            href={`/profile/${profile.id}`}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            Profile
          </Link>

          {!isSelf && (
            isViewerVerified ? (
              <Link
                href={`/messages?user=${profile.id}`}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-500 hover:to-teal-400 text-white shadow-sm flex items-center gap-1.5 transition-all"
              >
                <MessageSquare className="w-3.5 h-3.5" /> Chat
              </Link>
            ) : (
              <button
                type="button"
                disabled
                title="Verify your CSJMU ID to start messaging"
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-800/80 text-zinc-500 border border-zinc-700/50 cursor-not-allowed flex items-center gap-1.5 opacity-60"
              >
                <Lock className="w-3 h-3 text-amber-500" /> Message
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}

function getOrdinal(n: string) {
  if (n === '1') return 'st';
  if (n === '2') return 'nd';
  if (n === '3') return 'rd';
  return 'th';
}
