'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
  Search,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Hobby } from '@/lib/types';
import { INITIAL_HOBBIES, POPULAR_HOBBY_NAMES } from '@/lib/mockData';

export default function OnboardingPage() {
  const router = useRouter();
  const { currentUser, updateProfile, isLoading } = useAuth();

  const [fullName, setFullName] = useState('');
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('1');
  const [gender, setGender] = useState('Prefer not to say');
  const [bio, setBio] = useState('');
  const [selectedHobbyNames, setSelectedHobbyNames] = useState<string[]>(['Music', 'Coding']);
  const [customHobbies, setCustomHobbies] = useState<string[]>([]);
  const [hobbySearchQuery, setHobbySearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [customInputText, setCustomInputText] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
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
        const standardNames = INITIAL_HOBBIES.map((h) => h.name);
        const userHobbyNames = currentUser.hobbies
          .map((h) => (typeof h === 'string' ? h : h?.name))
          .filter((name): name is string => Boolean(name && name !== 'Other'));

        const customNames = userHobbyNames.filter(
          (name) => !standardNames.some((sn) => sn.toLowerCase() === name.toLowerCase())
        );

        if (customNames.length > 0) {
          setCustomHobbies(customNames);
        }

        if (userHobbyNames.length > 0) {
          setSelectedHobbyNames(userHobbyNames.slice(0, 3));
        }
      }
    }
  }, [currentUser, isLoading, router]);

  // Combine all available hobbies (standard 40 + any user added custom hobbies)
  const allAvailableHobbyNames = useMemo(() => {
    const standardNames = INITIAL_HOBBIES.map((h) => h.name);
    const uniqueCustom = customHobbies.filter(
      (c) => !standardNames.some((sn) => sn.toLowerCase() === c.toLowerCase())
    );
    return [...standardNames, ...uniqueCustom];
  }, [customHobbies]);

  // Filtered hobbies for rendering
  const visibleHobbyNames = useMemo(() => {
    const search = hobbySearchQuery.trim().toLowerCase();

    if (search) {
      return allAvailableHobbyNames.filter((name) => name.toLowerCase().includes(search));
    }

    if (isExpanded) {
      return allAvailableHobbyNames;
    }

    // Default view: 16 popular hobbies + any currently selected hobby outside the 16
    const popularSet = new Set(POPULAR_HOBBY_NAMES);
    const defaultList = [...POPULAR_HOBBY_NAMES];

    // Ensure all selected hobbies stay visible even when collapsed
    selectedHobbyNames.forEach((name) => {
      if (!popularSet.has(name)) {
        defaultList.push(name);
      }
    });

    return defaultList;
  }, [hobbySearchQuery, isExpanded, allAvailableHobbyNames, selectedHobbyNames]);

  const toggleHobby = (name: string) => {
    setSelectedHobbyNames((prev) => {
      if (prev.includes(name)) {
        return prev.filter((n) => n !== name);
      }
      if (prev.length >= 3) {
        return prev;
      }
      return [...prev, name];
    });
  };

  const handleAddCustomHobby = (customName?: string) => {
    const raw = (customName || customInputText).trim();
    if (!raw) return;
    const clean = raw.slice(0, 35);

    if (!customHobbies.some((c) => c.toLowerCase() === clean.toLowerCase())) {
      setCustomHobbies((prev) => [...prev, clean]);
    }

    setSelectedHobbyNames((prev) => {
      if (prev.includes(clean)) return prev;
      if (prev.length >= 3) return prev;
      return [...prev, clean];
    });

    setCustomInputText('');
    setHobbySearchQuery('');
  };

  const handleRemoveCustomHobby = (nameToRemove: string) => {
    setCustomHobbies((prev) => prev.filter((n) => n !== nameToRemove));
    setSelectedHobbyNames((prev) => prev.filter((n) => n !== nameToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedHobbyNames.length === 0) return;

    setLoading(true);

    // Build Hobby objects
    const finalHobbies: Hobby[] = selectedHobbyNames.slice(0, 3).map((name, idx) => {
      const standard = INITIAL_HOBBIES.find(
        (h) => h.name.toLowerCase() === name.toLowerCase()
      );
      if (standard) return standard;
      return {
        id: 100 + idx,
        name,
        category: 'Custom',
        color: 'teal' as const,
      };
    });

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

  const isSearchActive = Boolean(hobbySearchQuery.trim());
  const hasZeroMatches = isSearchActive && visibleHobbyNames.length === 0;

  return (
    <div className="min-h-[88vh] py-6 sm:py-12 px-3.5 sm:px-6 max-w-2xl mx-auto">
      <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl sm:rounded-3xl p-4 sm:p-10 backdrop-blur-xl shadow-2xl relative">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-semibold mb-2.5">
            <Sparkles className="w-3.5 h-3.5" /> Step 1 of 2: Profile Setup
          </div>
          <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight">
            Complete Your Student Profile
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Tell your CSJMU batchmates what you study and what vibes you love.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
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

          {/* Hobbies / Pick Your Vibe Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-semibold text-zinc-300">
                  Pick Your Vibe (Hobbies & Interests) <span className="text-rose-400">*</span>
                </label>
                <span className="text-[11px] text-zinc-500">Choose 1 to 3 hobbies that best represent you</span>
              </div>
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full border transition-colors ${
                  selectedHobbyNames.length === 3
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    : selectedHobbyNames.length > 0
                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                    : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                }`}
              >
                {selectedHobbyNames.length} / 3 selected
              </span>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={hobbySearchQuery}
                onChange={(e) => setHobbySearchQuery(e.target.value)}
                placeholder="Search your hobby..."
                className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-purple-500 rounded-xl pl-10 pr-9 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none transition-colors"
              />
              {hobbySearchQuery && (
                <button
                  type="button"
                  onClick={() => setHobbySearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Chip Grid Container */}
            <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80">
              <div className="flex flex-wrap gap-2 transition-all duration-300">
                {visibleHobbyNames.map((name) => {
                  const isSelected = selectedHobbyNames.includes(name);
                  const isDisabled = selectedHobbyNames.length >= 3 && !isSelected;

                  return (
                    <HobbyBadge
                      key={name}
                      hobby={name}
                      size="md"
                      selected={isSelected}
                      disabled={isDisabled}
                      onClick={() => toggleHobby(name)}
                    />
                  );
                })}

                {/* Explicit + Other / Custom Chip */}
                <button
                  type="button"
                  onClick={() => setShowCustomInput(!showCustomInput)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full border transition-all duration-200 cursor-pointer ${
                    showCustomInput
                      ? 'bg-teal-500/20 text-teal-300 border-teal-500/50 shadow-glow-teal font-semibold'
                      : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Other</span>
                </button>
              </div>

              {/* Inline Custom Hobby Input Drawer (toggled by + Other or 0 search results) */}
              {(showCustomInput || hasZeroMatches) && (
                <div className="mt-3.5 p-3.5 rounded-xl bg-zinc-900/90 border border-teal-500/40 space-y-2.5 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-teal-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                      <span>{hasZeroMatches ? 'Hobby not found — add it yourself:' : 'Add Your Custom Vibe / Hobby:'}</span>
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowCustomInput(false)}
                      className="text-zinc-500 hover:text-zinc-300 text-xs p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customInputText || (hasZeroMatches ? hobbySearchQuery : '')}
                      onChange={(e) => {
                        setCustomInputText(e.target.value);
                        if (hasZeroMatches) setHobbySearchQuery(e.target.value);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCustomHobby(customInputText || hobbySearchQuery);
                        }
                      }}
                      placeholder="e.g. Robotics, Chess, Formula 1, UI/UX..."
                      maxLength={35}
                      className="flex-1 bg-zinc-950 border border-zinc-700 focus:border-teal-400 rounded-xl px-3.5 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => handleAddCustomHobby(customInputText || hobbySearchQuery)}
                      disabled={!(customInputText.trim() || hobbySearchQuery.trim()) || selectedHobbyNames.length >= 3}
                      className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 transition-all disabled:opacity-40 cursor-pointer shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Expand / Collapse Button (shown when not actively searching) */}
              {!isSearchActive && (
                <div className="mt-3 pt-3 border-t border-zinc-800/60 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors cursor-pointer"
                  >
                    <span>
                      {isExpanded
                        ? 'Show fewer hobbies'
                        : `Show more hobbies (${INITIAL_HOBBIES.length - POPULAR_HOBBY_NAMES.length} more)`}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <span className="text-[11px] text-zinc-500">
                    {selectedHobbyNames.length >= 3
                      ? 'Limit reached (3/3)'
                      : `Can pick ${3 - selectedHobbyNames.length} more`}
                  </span>
                </div>
              )}
            </div>

            {/* Custom tags list (if any custom hobbies exist) */}
            {customHobbies.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <p className="text-[11px] text-zinc-400 font-semibold">Your Custom Hobbies:</p>
                <div className="flex flex-wrap gap-1.5">
                  {customHobbies.map((custom) => {
                    const isSelected = selectedHobbyNames.includes(custom);
                    return (
                      <span
                        key={custom}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                          isSelected
                            ? 'bg-teal-500/20 text-teal-300 border-teal-500/40'
                            : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                        }`}
                      >
                        <span
                          className="cursor-pointer hover:underline"
                          onClick={() => toggleHobby(custom)}
                        >
                          {isSelected && '✓ '}
                          {custom}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveCustomHobby(custom)}
                          className="p-0.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-rose-400 transition-colors"
                          title="Remove custom hobby"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {selectedHobbyNames.length === 0 && (
              <p className="text-[11px] text-rose-400 mt-1">
                Please select at least 1 hobby or interest to continue.
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
              disabled={loading || selectedHobbyNames.length === 0 || !department.trim()}
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
