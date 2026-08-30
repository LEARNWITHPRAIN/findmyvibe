'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { HobbyBadge } from '@/components/HobbyBadge';
import { INITIAL_PROFILES, INITIAL_HOBBIES } from '@/lib/mockData';
import {
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Zap,
  Users,
} from 'lucide-react';

// Landing page uses STATIC demo data — never real user accounts
const DEMO_PROFILES = INITIAL_PROFILES.slice(0, 3);

export default function LandingPage() {
  const router = useRouter();
  const { currentUser, isLoading } = useAuth();
  const [selectedHobby, setSelectedHobby] = useState<string | null>(null);

  // If user is already logged in, redirect directly into the app (e.g. /discover)
  useEffect(() => {
    if (!isLoading && currentUser) {
      router.replace('/discover');
    }
  }, [currentUser, isLoading, router]);

  const filteredProfiles = selectedHobby
    ? DEMO_PROFILES.filter((p) => p.hobbies?.some((h) => (typeof h === 'string' ? h === selectedHobby : h.name === selectedHobby)))
    : DEMO_PROFILES;

  if (isLoading || currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0B]">
        <div className="w-10 h-10 rounded-xl border-2 border-purple-500/50 border-t-purple-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-[#0A0A0B]">
      {/* Ambient background glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-purple-600/20 via-coral-500/15 to-teal-400/20 blur-[120px] pointer-events-none -z-0" />
      <div className="absolute top-80 right-0 w-96 h-96 bg-teal-500/10 blur-[140px] pointer-events-none -z-0" />
      <div className="absolute top-[600px] left-0 w-96 h-96 bg-purple-600/10 blur-[140px] pointer-events-none -z-0" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-dot-grid opacity-30 pointer-events-none" />

      {/* Hero Section */}
      <section className="relative z-10 pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center flex flex-col items-center">
        {/* Exclusive Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-800 text-xs font-semibold text-zinc-300 shadow-xl mb-8 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
          <span className="text-teal-400 font-bold">Unofficial Student Network</span>
          <span className="text-zinc-500">•</span>
          <span className="text-zinc-200">Hostellers, Day Scholars & All CSJMU Students</span>
        </div>

        {/* Mascot Logo Visual Highlight */}
        <div className="relative mb-6">
          <div className="w-24 h-24 sm:w-28 sm:h-28 relative rounded-3xl overflow-hidden shadow-2xl shadow-purple-500/20 border-2 border-white/10 p-1 bg-zinc-950">
            <Image
              src="/logo.jpg"
              alt="Find My Vibe Mascot"
              fill
              className="object-cover rounded-2xl"
              priority
            />
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.1] mb-6">
          Connect with people like you at{' '}
          <span className="bg-gradient-to-r from-purple-400 via-rose-400 to-teal-300 bg-clip-text text-transparent">
            CSJMU Campus.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl text-zinc-400 max-w-2xl font-normal leading-relaxed mb-10">
          An unofficial peer community for all CSJMU students — match with batchmates across hostels & daily commutes who share your niche hobbies, form hackathon squads, and build lifelong friendships safely.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link
            href="/signup"
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-sm sm:text-base text-white bg-gradient-to-r from-purple-600 via-rose-500 to-teal-500 hover:from-purple-500 hover:to-teal-400 shadow-glow-purple transition-all duration-200 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
          >
            <span>Get Started — It&apos;s Free</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/login"
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-semibold text-sm sm:text-base text-zinc-300 bg-zinc-900/80 hover:bg-zinc-800 hover:text-white border border-zinc-800 transition-all flex items-center justify-center gap-2"
          >
            <span>Log In</span>
          </Link>
        </div>

        {/* Trust Stats Row */}
        <div className="grid grid-cols-3 gap-4 sm:gap-12 mt-16 pt-10 border-t border-zinc-800/80 w-full max-w-3xl">
          <div className="flex flex-col items-center text-center">
            <div className="text-2xl sm:text-3xl font-black text-white flex items-center gap-1">
              <span>100%</span>
              <ShieldCheck className="w-5 h-5 text-teal-400" />
            </div>
            <p className="text-[11px] sm:text-xs text-zinc-500 mt-1">ID Verified Members</p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="text-2xl sm:text-3xl font-black text-rose-400 flex items-center gap-1">
              <Users className="w-5 h-5" />
              <span>All</span>
            </div>
            <p className="text-[11px] sm:text-xs text-zinc-500 mt-1">CSJMU Students Welcome</p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="text-2xl sm:text-3xl font-black text-purple-400 flex items-center gap-1">
              <span>6+</span>
              <Sparkles className="w-5 h-5 text-purple-400" />
            </div>
            <p className="text-[11px] sm:text-xs text-zinc-500 mt-1">Hobby Categories</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-zinc-900">
        <div className="text-center max-w-xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-purple-400 mb-3">
            <Zap className="w-3.5 h-3.5" /> Simple 4-Step Onboarding
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            How Find My Vibe Works
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-2">
            Built exclusively for verified CSJMU students — keeping the community authentic.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {/* Step 1 */}
          <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center font-black text-sm mb-4">
                01
              </div>
              <h3 className="font-bold text-white text-base mb-2">Sign Up</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Register with any email to create your student profile.
              </p>
            </div>
            <span className="text-[10px] text-zinc-500 font-mono mt-4">Email Auth</span>
          </div>

          {/* Step 2 */}
          <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center font-black text-sm mb-4">
                02
              </div>
              <h3 className="font-bold text-white text-base mb-2">Snap Your CSJMU ID</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Submit a selfie holding your university ID card for admin verification.
              </p>
            </div>
            <span className="text-[10px] text-zinc-500 font-mono mt-4">Encrypted Storage</span>
          </div>

          {/* Step 3 */}
          <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center font-black text-sm mb-4">
                03
              </div>
              <h3 className="font-bold text-white text-base mb-2">Pick Your Vibe</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Select your hobbies: Music, Gaming, Coding, Cricket, Anime, and 35+ more.
              </p>
            </div>
            <span className="text-[10px] text-zinc-500 font-mono mt-4">Multi-select Chips</span>
          </div>

          {/* Step 4 */}
          <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-black text-sm mb-4">
                04
              </div>
              <h3 className="font-bold text-white text-base mb-2">Connect & Chat</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Unlock full profiles, see who shares your interests on campus, and direct chat!
              </p>
            </div>
            <span className="text-[10px] text-zinc-500 font-mono mt-4">Direct Text Chat</span>
          </div>
        </div>
      </section>

      {/* Demo Discovery Preview Section */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-zinc-900">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-teal-400 mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Preview — Demo Profiles
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Discover Batchmates by Passion
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              This is a preview with demo accounts. Sign up to see real student profiles.
            </p>
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap gap-1.5 max-w-xl">
            <button
              onClick={() => setSelectedHobby(null)}
              className={`px-3 py-1 text-xs font-semibold rounded-full border transition-all ${
                selectedHobby === null
                  ? 'bg-white text-zinc-950 border-white font-bold'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              All Vibes
            </button>
            {INITIAL_HOBBIES.slice(0, 10).map((h) => (
              <HobbyBadge
                key={h.id}
                hobby={h}
                size="sm"
                selected={selectedHobby === h.name}
                onClick={() => setSelectedHobby(selectedHobby === h.name ? null : h.name)}
              />
            ))}
          </div>
        </div>

        {/* Demo Profile Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredProfiles.map((profile) => (
            <div
              key={profile.id}
              className="group relative rounded-2xl bg-zinc-900/60 border border-zinc-800 overflow-hidden"
            >
              {/* DEMO Badge */}
              <div className="absolute top-3 left-3 z-10 bg-amber-500 text-zinc-950 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-lg tracking-wide">
                DEMO
              </div>

              <div className="p-5 pt-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-zinc-800 border border-zinc-700 shrink-0">
                    {profile.avatar_url ? (
                      <Image
                        src={profile.avatar_url}
                        alt={profile.full_name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-300 font-bold text-lg">
                        {profile.full_name.charAt(0)}
                      </div>
                    )}
                    {profile.verification_status === 'verified' && (
                      <div className="absolute bottom-0.5 right-0.5 bg-emerald-500 p-0.5 rounded-full ring-1 ring-zinc-900">
                        <ShieldCheck className="w-3 h-3 text-zinc-950" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-zinc-100 text-sm truncate">{profile.full_name}</div>
                    <div className="text-[11px] text-zinc-400 truncate">{profile.department}</div>
                  </div>
                </div>
                {profile.bio && (
                  <p className="text-xs text-zinc-400 line-clamp-2 mb-3">{profile.bio}</p>
                )}
                <div className="flex flex-wrap gap-1.5">
                  {profile.hobbies?.map((hobby) => (
                    <HobbyBadge
                      key={typeof hobby === 'string' ? hobby : hobby.id}
                      hobby={hobby}
                      size="sm"
                    />
                  ))}
                </div>
              </div>

              <div className="px-5 py-3 border-t border-zinc-800/80 bg-zinc-950/40 flex items-center justify-between">
                <span className="text-[11px] text-zinc-500">CSJMU Campus</span>
                <Link
                  href="/signup"
                  className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
                >
                  Sign up to connect <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-500 hover:to-teal-400 text-white font-bold text-sm shadow-glow-purple transition-all"
          >
            <span>Join & See Real Students</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
