'use client';

import React, { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { HobbyBadge } from '@/components/HobbyBadge';
import { DepartmentDropdown } from '@/components/DepartmentDropdown';
import {
  User,
  Calendar,
  ShieldCheck,
  Clock,
  Camera,
  CheckCircle2,
  Save,
  AlertCircle,
  ImagePlus,
  Smile,
  Plus,
  X,
  Sparkles,
  ArrowRight,
  Search,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Hobby } from '@/lib/types';
import { INITIAL_HOBBIES, POPULAR_HOBBY_NAMES } from '@/lib/mockData';

const MAX_PHOTO_BYTES = 5 * 1024 * 1024; // 5 MB

function MyProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isSetupFlow = searchParams.get('setup') === '1';
  const isEmailVerifiedRedirect = searchParams.get('verified') === '1';

  const { currentUser, updateProfile, uploadAvatar, isLoading } = useAuth();

  const [fullName, setFullName] = useState('');
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('2');
  const [gender, setGender] = useState('Male');
  const [bio, setBio] = useState('');
  const [selectedHobbyNames, setSelectedHobbyNames] = useState<string[]>([]);
  const [customHobbies, setCustomHobbies] = useState<string[]>([]);
  const [hobbySearchQuery, setHobbySearchQuery] = useState('');
  const [customInputText, setCustomInputText] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auth guard
  useEffect(() => {
    if (!isLoading && !currentUser) {
      router.push('/login');
    }
  }, [currentUser, isLoading, router]);

  // Sync form state from currentUser
  useEffect(() => {
    if (currentUser) {
      setFullName(currentUser.full_name || '');
      setDepartment(currentUser.department || '');
      setYear(currentUser.year || '1');
      setGender(currentUser.gender || 'Male');
      setBio(currentUser.bio || '');
      setAvatarPreview(currentUser.avatar_url || null);

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
  }, [currentUser]);

  // Combine all available hobbies
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

    const popularSet = new Set(POPULAR_HOBBY_NAMES);
    const defaultList = [...POPULAR_HOBBY_NAMES];

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
    const raw = (customName || hobbySearchQuery).trim();
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

    setHobbySearchQuery('');
  };

  const handleRemoveCustomHobby = (nameToRemove: string) => {
    setCustomHobbies((prev) => prev.filter((n) => n !== nameToRemove));
    setSelectedHobbyNames((prev) => prev.filter((n) => n !== nameToRemove));
  };

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoError(null);

    if (file.size > MAX_PHOTO_BYTES) {
      setPhotoError(
        `Photo is ${(file.size / (1024 * 1024)).toFixed(1)} MB — must be under 5 MB.`
      );
      return;
    }

    setIsUploadingPhoto(true);
    try {
      const res = await uploadAvatar(file);
      if (res.error) {
        setPhotoError(res.error);
      } else if (res.url) {
        setAvatarPreview(res.url);
        await updateProfile({ avatar_url: res.url });
        setShowSavedToast(true);
        setTimeout(() => setShowSavedToast(false), 3500);
      }
    } catch (err) {
      console.error(err);
      setPhotoError('Failed to upload photo.');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!fullName.trim()) {
      setFormError('Full Name is mandatory.');
      return;
    }
    if (!department.trim()) {
      setFormError('Department / Course is mandatory. Please select your course.');
      return;
    }
    if (!year) {
      setFormError('Year of Study is mandatory.');
      return;
    }
    if (!gender) {
      setFormError('Gender selection is mandatory.');
      return;
    }
    if (selectedHobbyNames.length === 0) {
      setFormError('Please select at least 1 hobby or vibe tag.');
      return;
    }

    setIsSaving(true);

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
        full_name: fullName.trim(),
        department: department.trim(),
        year,
        gender,
        bio: bio.trim(),
        hobbies: finalHobbies,
        ...(avatarPreview ? { avatar_url: avatarPreview } : {}),
      });

      setShowSavedToast(true);
      setTimeout(() => setShowSavedToast(false), 3500);

      if (isSetupFlow) {
        router.push('/verify-id');
      }
    } catch (err) {
      console.error(err);
      setFormError('Failed to save profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 rounded-xl border-2 border-purple-500/50 border-t-purple-400 animate-spin" />
      </div>
    );
  }

  const status = currentUser.verification_status;
  const isSearchActive = Boolean(hobbySearchQuery.trim());
  const hasZeroMatches = isSearchActive && visibleHobbyNames.length === 0;

  return (
    <div className="min-h-[85vh] py-6 sm:py-8 px-3.5 sm:px-6 max-w-3xl mx-auto space-y-5 sm:space-y-6">
      {/* Setup / Verification Banner */}
      {(isSetupFlow || isEmailVerifiedRedirect) && (
        <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-purple-950/80 via-zinc-900 to-teal-950/80 border border-teal-500/40 shadow-xl flex items-start gap-3.5 animate-in fade-in slide-in-from-top-4">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300 shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white">
              {isEmailVerifiedRedirect ? 'Email Verified Successfully! 🎉' : 'Complete Your Student Profile'}
            </h3>
            <p className="text-xs text-zinc-300 mt-0.5 leading-relaxed">
              Please fill out all mandatory fields below (Name, Department, Year, Gender, and at least 1 Interest) to join the CSJMU network.
            </p>
          </div>
        </div>
      )}

      {/* Toast */}
      {showSavedToast && (
        <div className="fixed bottom-6 left-4 right-4 sm:left-auto sm:right-6 max-w-sm sm:max-w-md mx-auto z-50 bg-emerald-500 text-zinc-950 px-4 py-3 rounded-2xl font-bold text-xs shadow-2xl flex items-center gap-2 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Profile saved successfully!</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-zinc-800 pb-5 sm:pb-6">
        <div>
          <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight">
            My Campus Profile
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Manage your student profile details and hobbies visible to fellow students.
          </p>
        </div>

        {/* Verification Pill */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {status === 'verified' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-teal-400" /> CSJMU Verified
            </span>
          )}
          {status === 'pending' && (
            <Link
              href="/verify-id"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold hover:bg-amber-500/20 transition-colors"
            >
              <Clock className="w-4 h-4 text-amber-400" /> ID Under Review
            </Link>
          )}
          {(status === 'unverified' || status === 'rejected') && (
            <Link
              href="/verify-id"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold hover:bg-rose-500/20 transition-colors"
            >
              <AlertCircle className="w-4 h-4 text-rose-400" />
              {status === 'rejected' ? 'Verification Rejected — Retry' : 'Upload ID to Verify'}
            </Link>
          )}
        </div>
      </div>

      {/* Main Profile Card */}
      <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl sm:rounded-3xl p-4 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6 sm:space-y-8">
        {/* Photo Upload Section */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-zinc-800">
          <div className="relative group">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden border-2 border-purple-500/40 bg-zinc-950 flex items-center justify-center relative shadow-glow-purple/20">
              {avatarPreview ? (
                <Image
                  src={avatarPreview}
                  alt={fullName || 'Avatar'}
                  fill
                  className="object-cover"
                  sizes="112px"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-900/40 to-teal-900/40 text-zinc-400">
                  <User className="w-10 h-10 text-zinc-500" />
                  <span className="text-[10px] text-zinc-500 mt-1 font-medium">No Photo</span>
                </div>
              )}

              {/* Upload spinner */}
              {isUploadingPhoto && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>

            {/* Change photo button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingPhoto}
              className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow-lg transition-transform active:scale-90 cursor-pointer"
              title="Upload new photo"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 text-center sm:text-left space-y-2">
            <h2 className="text-base font-bold text-white">Profile Photo</h2>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-md">
              Upload a clear picture of yourself so CSJMU batchmates recognize you on the campus discover feed.
            </p>
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start pt-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoSelect}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingPhoto}
                className="px-3.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ImagePlus className="w-3.5 h-3.5 text-purple-400" />
                <span>{avatarPreview ? 'Change Photo' : 'Upload Photo'}</span>
              </button>
              {avatarPreview && (
                <button
                  type="button"
                  onClick={async () => {
                    setAvatarPreview(null);
                    await updateProfile({ avatar_url: null });
                  }}
                  className="px-3 py-1.5 rounded-xl bg-zinc-800/60 hover:bg-rose-500/20 text-xs font-medium text-zinc-400 hover:text-rose-400 transition-colors cursor-pointer"
                >
                  Remove
                </button>
              )}
            </div>
            {photoError && <p className="text-xs text-rose-400 font-medium">{photoError}</p>}
          </div>
        </div>

        {/* Error Alert */}
        {formError && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{formError}</span>
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSave} className="space-y-6">
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

          {/* Department Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Department / Course <span className="text-rose-400">*</span>
            </label>
            <DepartmentDropdown value={department} onChange={setDepartment} required />
          </div>

          {/* Year & Gender */}
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
                  required
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
                Gender <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Smile className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-purple-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-100 focus:outline-none transition-colors appearance-none cursor-pointer"
                  required
                >
                  <option value="Male">👦 Male</option>
                  <option value="Female">👧 Female</option>
                  <option value="Other">🏳️‍🌈 Other</option>
                  <option value="Prefer not to say">🤐 Prefer not to say</option>
                </select>
              </div>
            </div>
          </div>

          {/* Bio (Optional) */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Bio / Your Vibe <span className="text-zinc-500 font-normal">(Optional)</span>
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              placeholder="Tell fellow CSJMU batchmates about yourself, campus clubs, startup ideas..."
              className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-purple-500 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* Hobbies Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-semibold text-zinc-300">
                  My Hobbies & Interests <span className="text-rose-400">*</span>
                </label>
                <span className="text-[11px] text-zinc-500">Pick 1 to 3 vibes</span>
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

              {/* Expand / Collapse Button */}
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

            {/* Custom tags list */}
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
          </div>

          <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
            {isSetupFlow ? (
              <p className="text-xs text-zinc-500 hidden sm:block">
                Next: Submit student ID for verification
              </p>
            ) : (
              <Link href="/discover" className="text-xs text-zinc-400 hover:text-white">
                ← Back to Discover
              </Link>
            )}

            <button
              type="submit"
              disabled={isSaving || !fullName.trim() || !department.trim() || selectedHobbyNames.length === 0}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-rose-500 to-teal-500 hover:from-purple-500 hover:to-teal-400 text-white font-bold text-sm shadow-glow-purple flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isSaving ? (
                <span>Saving Profile...</span>
              ) : isSetupFlow ? (
                <>
                  <span>Save & Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Profile Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function MyProfilePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 rounded-xl border-2 border-purple-500/50 border-t-purple-400 animate-spin" />
      </div>
    }>
      <MyProfileContent />
    </Suspense>
  );
}
