'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
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
  ExternalLink,
  Smile,
  Plus,
  X,
} from 'lucide-react';
import { Hobby } from '@/lib/types';

const MAX_PHOTO_BYTES = 5 * 1024 * 1024; // 5 MB

export default function MyProfilePage() {
  const router = useRouter();
  const { currentUser, hobbies, updateProfile, uploadAvatar, isLoading } = useAuth();

  const [fullName, setFullName] = useState('');
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('2');
  const [gender, setGender] = useState('Prefer not to say');
  const [bio, setBio] = useState('');
  const [selectedHobbyIds, setSelectedHobbyIds] = useState<number[]>([]);
  const [customInterests, setCustomInterests] = useState<string[]>([]);
  const [customInputText, setCustomInputText] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
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
      setYear(currentUser.year || '2');
      setGender(currentUser.gender || 'Prefer not to say');
      setBio(currentUser.bio || '');
      setAvatarPreview(currentUser.avatar_url || null);

      if (currentUser.hobbies && currentUser.hobbies.length > 0) {
        const standardIds = currentUser.hobbies
          .filter((h) => typeof h !== 'string' && h.id && h.id < 90)
          .map((h) => (typeof h === 'string' ? 6 : h.id));
        const customNames = currentUser.hobbies
          .filter((h) => typeof h === 'string' || (h.id && h.id >= 90) || (h.id === 6 && h.name !== 'Other'))
          .map((h) => (typeof h === 'string' ? h : h.name));

        setSelectedHobbyIds(standardIds);
        if (customNames.length > 0) {
          setCustomInterests(customNames);
          if (!standardIds.includes(6)) {
            setSelectedHobbyIds((prev) => [...prev, 6]);
          }
        }
      }
    }
  }, [currentUser]);

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
    setIsSaving(true);

    const baseHobbies = hobbies.filter((h) => selectedHobbyIds.includes(h.id) && h.id !== 6);

    const customHobbyObjects: Hobby[] = customInterests.map((ci, idx) => ({
      id: 90 + idx,
      name: ci,
      category: 'Custom',
      color: 'teal' as const,
    }));

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
    } catch (err) {
      console.error(err);
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
  const isOtherSelected = selectedHobbyIds.includes(6);

  return (
    <div className="min-h-[85vh] py-8 px-4 sm:px-6 max-w-3xl mx-auto space-y-6">
      {/* Toast */}
      {showSavedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-zinc-950 px-4 py-3 rounded-2xl font-bold text-xs shadow-2xl flex items-center gap-2 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4" />
          <span>Profile updated successfully!</span>
        </div>
      )}

      {/* Profile Header Card */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-5 sm:p-6 backdrop-blur-xl shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Avatar + Upload */}
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-900/40 to-teal-900/40 border border-zinc-700 overflow-hidden flex items-center justify-center text-zinc-300 font-bold text-2xl">
              {avatarPreview ? (
                <Image src={avatarPreview} alt="Avatar" fill className="object-cover" unoptimized />
              ) : (
                (currentUser.full_name || 'U').charAt(0).toUpperCase()
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingPhoto}
              title="Upload new profile picture"
              className="absolute -bottom-1 -right-1 p-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow-lg transition-all cursor-pointer disabled:opacity-50"
            >
              {isUploadingPhoto ? (
                <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <ImagePlus className="w-3.5 h-3.5" />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handlePhotoSelect}
              className="hidden"
            />
          </div>

          {/* User metadata */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-extrabold text-white text-lg truncate">
                {currentUser.full_name || 'CSJMU Student'}
              </h2>
              {status === 'verified' && (
                <span className="bg-teal-500/20 text-teal-400 border border-teal-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Verified Student
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-400">{currentUser.email}</p>

            {/* Verification CTA */}
            <div className="mt-3">
              {status === 'verified' ? (
                <span className="text-xs text-teal-400 font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" /> ID Approved — Full Access Active
                </span>
              ) : status === 'pending' ? (
                <Link
                  href="/verify-id"
                  className="text-xs text-amber-400 font-semibold flex items-center gap-1.5 hover:underline"
                >
                  <Clock className="w-4 h-4 animate-pulse" /> ID Under Review — Check Status
                </Link>
              ) : (
                <Link
                  href="/verify-id"
                  className="inline-flex text-xs text-white font-bold items-center gap-1.5 bg-gradient-to-r from-purple-600 to-teal-500 px-3.5 py-1.5 rounded-xl shadow-glow-purple hover:opacity-90 transition-all"
                >
                  <Camera className="w-3.5 h-3.5" /> Verify Your ID to Unlock Full Access
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Photo upload error */}
        {photoError && (
          <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs space-y-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{photoError}</span>
            </div>
          </div>
        )}
      </div>

      {/* Edit Profile Form */}
      <div className="bg-zinc-900/70 border border-zinc-800 rounded-3xl p-5 sm:p-8 backdrop-blur-xl shadow-2xl">
        <h3 className="text-lg font-black text-white mb-6">Edit Your Profile</h3>

        <form onSubmit={handleSave} className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-purple-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-100 focus:outline-none transition-colors"
                required
              />
            </div>
          </div>

          {/* Department Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Department / Course</label>
            <DepartmentDropdown value={department} onChange={setDepartment} required />
          </div>

          {/* Year & Gender */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Year of Study</label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-purple-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-100 focus:outline-none transition-colors appearance-none cursor-pointer"
                >
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Gender</label>
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

          {/* Bio */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Bio / Your Vibe</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              placeholder="Tell fellow students about yourself, your hobbies, clubs you're in..."
              className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-purple-500 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* Hobbies Selection */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-2">
              My Hobbies & Interests
            </label>
            <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 flex flex-wrap gap-2">
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
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-rose-500 to-teal-500 hover:from-purple-500 hover:to-teal-400 text-white font-bold text-sm shadow-glow-purple flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
