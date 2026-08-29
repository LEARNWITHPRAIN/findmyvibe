'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { HobbyBadge } from '@/components/HobbyBadge';
import { DepartmentDropdown } from '@/components/DepartmentDropdown';
import {
  User,
  Calendar,
  Building2,
  Sparkles,
  ArrowRight,
  Mail,
  Plus,
  X,
  Smile,
} from 'lucide-react';
import { Hobby } from '@/lib/types';

export default function OnboardingPage() {
  const router = useRouter();
  const { currentUser, hobbies, updateProfile, isLoading } = useAuth();

  const [fullName, setFullName] = useState('');
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('1');
  const [gender, setGender] = useState('Prefer not to say');
  const [bio, setBio] = useState('');
  const [selectedHobbyIds, setSelectedHobbyIds] = useState<number[]>([1, 3]);
  const [customInterests, setCustomInterests] = useState<string[]>([]);
  const [customInputText, setCustomInputText] = useState('');
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
        const standardIds = currentUser.hobbies
          .filter((h) => typeof h !== 'string' && h.id && h.id < 90)
          .map((h) => (typeof h === 'string' ? 6 : h.id));
        const customNames = currentUser.hobbies
          .filter((h) => typeof h === 'string' || (h.id && h.id >= 90) || (h.id === 6 && h.name !== 'Other'))
          .map((h) => (typeof h === 'string' ? h : h.name));

        setSelectedHobbyIds(standardIds.length > 0 ? standardIds : [1, 3]);
        if (customNames.length > 0) {
          setCustomInterests(customNames);
          if (!standardIds.includes(6)) {
            setSelectedHobbyIds((prev) => [...prev, 6]);
          }
        }
      }
    }
  }, [currentUser, isLoading, router]);

  const toggleHobby = (hobbyId: number) => {
    setSelectedHobbyIds((prev) =>
      prev.includes(hobbyId) ? prev.filter((id) => id !== hobbyId) : [...prev, hobbyId]
    );
  };

  const handleAddCustomInterest = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = customInputText.trim();
    if (!clean) return;
    if (!customInterests.some((ci) => ci.toLowerCase() === clean.toLowerCase())) {
      setCustomInterests((prev) => [...prev, clean]);
    }
    setCustomInputText('');
  };

  const handleRemoveCustomInterest = (nameToRemove: string) => {
    setCustomInterests((prev) => prev.filter((name) => name !== nameToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const baseHobbies = hobbies.filter((h) => selectedHobbyIds.includes(h.id) && h.id !== 6);

    // Build custom hobbies list
    const customHobbyObjects: Hobby[] = customInterests.map((ci, idx) => ({
      id: 90 + idx,
      name: ci,
      category: 'Custom',
      color: 'teal' as const,
    }));

    // If Other is selected but no custom chips added, include basic 'Other'
    if (selectedHobbyIds.includes(6) && customHobbyObjects.length === 0) {
      customHobbyObjects.push({
        id: 6,
        name: customInputText.trim() || 'Other',
        category: 'General',
        color: 'teal' as const,
      });
    }

    const finalHobbies: Hobby[] = [...baseHobbies, ...customHobbyObjects];

    try {
      await updateProfile({
        full_name: fullName.trim() || (currentUser?.email ? currentUser.email.split('@')[0] : 'CSJMU Student'),
        department: department.trim() || 'CSJMU',
        year,
        gender,
        college: 'CSJMU',
        bio: bio.trim() || 'Excited to connect with batchmates across CSJMU campus!',
        hobbies: finalHobbies,
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
          <a
            href="/login"
            className="inline-block py-2.5 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-teal-500 text-white font-bold text-xs shadow-glow-purple"
          >
            Go to Log In
          </a>
        </div>
      </div>
    );
  }

  const OTHER_HOBBY_ID = 6;
  const isOtherSelected = selectedHobbyIds.includes(OTHER_HOBBY_ID);

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

          {/* Department Searchable Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Department / Course <span className="text-rose-400">*</span>
            </label>
            <DepartmentDropdown value={department} onChange={setDepartment} required />
          </div>

          {/* Year & Gender Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Year of Study <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
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

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Select Gender <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Smile className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-purple-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-100 focus:outline-none transition-colors appearance-none cursor-pointer"
                >
                  <option value="Male">👦 Male</option>
                  <option value="Female">👧 Female</option>
                  <option value="Other">🏳️‍🌈 Other</option>
                  <option value="Prefer not to say">🤐 Prefer not to say</option>
                </select>
              </div>
            </div>
          </div>

          {/* University (locked) */}
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

            {/* Custom "Other" Interest Creator */}
            {isOtherSelected && (
              <div className="mt-4 p-4 rounded-2xl bg-zinc-950/80 border border-teal-500/30 space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-teal-300">
                    ✏️ Add Custom Interests / Hobbies:
                  </label>
                  <span className="text-[11px] text-zinc-400">Type & click Add</span>
                </div>

                {/* Input with Add button */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customInputText}
                    onChange={(e) => setCustomInputText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomInterest();
                      }
                    }}
                    placeholder="e.g. Photography, Chess, Anime, Robotics, Badminton..."
                    maxLength={40}
                    className="flex-1 bg-zinc-900 border border-zinc-700 focus:border-teal-400 rounded-xl px-3.5 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddCustomInterest()}
                    disabled={!customInputText.trim()}
                    className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 transition-all disabled:opacity-40 cursor-pointer shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>

                {/* Added Custom Chips */}
                {customInterests.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <p className="text-[11px] text-zinc-400 font-semibold">Your Custom Tags:</p>
                    <div className="flex flex-wrap gap-2">
                      {customInterests.map((interest) => (
                        <span
                          key={interest}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40 text-xs font-semibold"
                        >
                          <span>{interest}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveCustomInterest(interest)}
                            className="p-0.5 rounded-full hover:bg-teal-500/40 text-teal-200 hover:text-white"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {selectedHobbyIds.length === 0 && customInterests.length === 0 && (
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
              disabled={loading || (selectedHobbyIds.length === 0 && customInterests.length === 0) || !department.trim()}
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
