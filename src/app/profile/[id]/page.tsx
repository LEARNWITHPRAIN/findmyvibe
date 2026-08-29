'use client';

import React from 'react';
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
} from 'lucide-react';

export default function ProfileDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { profiles, currentUser } = useAuth();

  const profileId = params?.id as string;
  const profile = profiles.find((p) => p.id === profileId);

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

  return (
    <div className="min-h-[85vh] py-10 px-4 sm:px-6 max-w-3xl mx-auto space-y-6">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Feed
      </button>

      {/* Main Profile Card */}
      <div className="bg-zinc-900/70 border border-zinc-800 rounded-3xl overflow-hidden backdrop-blur-xl shadow-2xl relative">
        {/* Cover Banner */}
        <div className="h-36 sm:h-44 bg-gradient-to-r from-purple-950 via-zinc-900 to-teal-950 relative overflow-hidden border-b border-zinc-800/80">
          <div className="absolute inset-0 bg-dot-grid opacity-40" />
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-zinc-900/80 backdrop-blur-md border border-white/10 text-[11px] font-semibold text-zinc-300 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-teal-400" /> CSJMU Student
            </span>
          </div>
        </div>

        {/* Profile Content */}
        <div className="px-6 sm:px-10 pb-10 pt-0 relative">
          {/* Avatar and Top Actions */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-6">
            <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-3xl overflow-hidden bg-zinc-800 border-4 border-zinc-950 shadow-2xl shrink-0 flex items-center justify-center">
              {isViewerVerified && profile.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  alt={profile.full_name || 'Student'}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-900/60 to-teal-900/60 flex items-center justify-center text-zinc-200 font-extrabold text-3xl">
                  {(profile.full_name || 'U').charAt(0).toUpperCase()}
                </div>
              )}

              {profile.verification_status === 'verified' && (
                <div className="absolute bottom-2 right-2 bg-emerald-500 text-zinc-950 p-1 rounded-full ring-2 ring-zinc-950 shadow-lg z-10">
                  <ShieldCheck className="w-4 h-4 fill-current" />
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {!isSelf && (
                isViewerVerified ? (
                  <Link
                    href={`/messages?user=${profile.id}`}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-500 hover:to-teal-400 text-white font-bold text-xs shadow-glow-purple transition-all flex items-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" /> Message Student
                  </Link>
                ) : (
                  <div className="flex flex-col items-end gap-1">
                    <button
                      type="button"
                      disabled
                      className="px-5 py-2.5 rounded-xl bg-zinc-800 text-zinc-500 border border-zinc-700/60 text-xs font-semibold cursor-not-allowed flex items-center gap-2 opacity-60"
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
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                {profile.full_name}
              </h1>
              {profile.verification_status === 'verified' ? (
                <span className="px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> CSJMU Verified
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400 text-xs font-medium">
                  Unverified
                </span>
              )}
            </div>

            {/* Verified Details vs Restricted Blur */}
            {isViewerVerified ? (
              <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400 pt-1">
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
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center justify-between gap-3 mt-3">
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
