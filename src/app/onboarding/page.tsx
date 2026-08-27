'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { HobbyBadge } from '@/components/HobbyBadge';
import {
  User,
  GraduationCap,
  Calendar,
  Building2,
  Sparkles,
  ArrowRight,
  Mail,
} from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const { currentUser, hobbies, updateProfile, isLoading } = useAuth();

  const [fullName, setFullName] = useState('');
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('1');
  const [gender, setGender] = useState('Prefer not to say');
  const [bio, setBio] = useState('');
  const [selectedHobbyIds, setSelectedHobbyIds] = useState<number[]>([1, 3]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoading && !currentUser) {
      router.push('/login');
    }
    if (currentUser) {
      if (currentUser.full_name) setFullName(currentUser.full_name);
      if (currentUser.department) setDepartment(currentUser.department);
      if (currentUser.year) setYear(currentUser.year);
      if (currentUser.gender) setGender(currentUser.gender);
      if (currentUser.bio) setBio(currentUser.bio);
      if (currentUser.hobbies && currentUser.hobbies.length > 0) {
        setSelectedHobbyIds(currentUser.hobbies.map((h) => h.id));
      }
    }
  }, [currentUser, isLoading, router]);

  const toggleHobby = (hobbyId: number) => {
    setSelectedHobbyIds((prev) =>
      prev.includes(hobbyId) ? prev.filter((id) => id !== hobbyId) : [...prev, hobbyId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const selectedHobbies = hobbies.filter((h) => selectedHobbyIds.includes(h.id));

    try {
      await updateProfile({
        full_name: fullName.trim() || 'CSJMU Student',
        department: department.trim() || 'UIET - CSJMU',
        year,
        gender,
        college: 'CSJMU',
        bio: bio.trim() || 'Excited to connect with batchmates across CSJMU campus!',
        hobbies: selectedHobbies,
      });

      router.push('/verify-id');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 rounded-xl border-2 border-purple-500/50 border-t-purple-400 animate-spin" />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-8 text-center space-y-4">
          <div className="w-14 h-14 bg-rose-500/20 text-rose-400 rounded-2xl flex items-center justify-center mx-auto">
            <Mail className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-white">Email Verification Required</h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Please check your email and click the verification link before setting up your student profile.
          </p>
          <Link
            href="/login"
            className="inline-block py-2.5 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-teal-500 text-white font-bold text-xs shadow-glow-purple"
          >
            Go to Log In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[88vh] py-12 px-4 sm:px-6 max-w-2xl mx-auto">
      <div className="bg-zinc-900/70 border border-zinc-800 rounded-3xl p-6 sm:p-10 backdrop-blur-xl shadow-2xl relative">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Step 1 of 2: Profile Setup
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Complete Your Student Profile
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Tell your CSJMU batchmates what you study and what vibes you love.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Full Name <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Aarav Sharma"
                className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-purple-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none transition-colors"
                required
              />
            </div>
          </div>

          {/* Department & Year Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Department / Course <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <GraduationCap className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. Computer Science (UIET)"
                  className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-purple-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Year of Study <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-purple-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-100 focus:outline-none transition-colors appearance-none cursor-pointer"
                >
                  <option value="1">1st Year (Fresher)</option>
                  <option value="2">2nd Year (Sophomore)</option>
                  <option value="3">3rd Year (Junior)</option>
                  <option value="4">4th Year (Senior / Final)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Gender & College Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-purple-500 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none transition-colors appearance-none cursor-pointer"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                University (Locked)
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-teal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value="CSJMU (Kanpur)"
                  disabled
                  className="w-full bg-zinc-950/40 border border-zinc-800 text-zinc-400 rounded-xl pl-10 pr-4 py-2.5 text-sm cursor-not-allowed font-medium"
                />
              </div>
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Short Bio / Vibe
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="e.g. Hall 4 resident, into music, coding projects & evening badminton!"
              rows={3}
              className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-purple-500 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* Hobbies / Interests Multi-select */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-zinc-300">
                Select Your Hobbies & Interests <span className="text-rose-400">*</span>
              </label>
              <span className="text-[11px] text-zinc-500">Pick as many as you like</span>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 flex flex-wrap gap-2.5">
              {hobbies.map((hobby) => {
                const isSelected = selectedHobbyIds.includes(hobby.id);
                return (
                  <HobbyBadge
                    key={hobby.id}
                    hobby={hobby}
                    size="md"
                    selected={isSelected}
                    onClick={() => toggleHobby(hobby.id)}
                  />
                );
              })}
            </div>
            {selectedHobbyIds.length === 0 && (
              <p className="text-[11px] text-rose-400 mt-1.5">
                Please select at least 1 hobby or interest.
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
            <p className="text-xs text-zinc-500 hidden sm:block">
              Next: Verify your CSJMU ID card
            </p>

            <button
              type="submit"
              disabled={loading || selectedHobbyIds.length === 0}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-rose-500 to-teal-500 hover:from-purple-500 hover:to-teal-400 text-white font-bold text-sm shadow-glow-purple transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <span>Save & Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
