'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import {
  User,
  GraduationCap,
  Calendar,
  ShieldCheck,
  ShieldAlert,
  Clock,
  Camera,
  CheckCircle2,
  Save,
  AlertCircle,
  ImagePlus,
  ExternalLink,
} from 'lucide-react';

const MAX_PHOTO_BYTES = 20 * 1024; // 20 KB

export default function MyProfilePage() {
  const router = useRouter();
  const { currentUser, hobbies, updateProfile, isLoading } = useAuth();

  const [fullName, setFullName] = useState('');
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('2');
  const [bio, setBio] = useState('');
  const [customOther, setCustomOther] = useState('');
  const [selectedHobbyIds, setSelectedHobbyIds] = useState<number[]>([]);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
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
      setBio(currentUser.bio || '');
      setAvatarPreview(currentUser.avatar_url || null);
      setSelectedHobbyIds(currentUser.hobbies?.map((h) => h.id) || []);
    }
  }, [currentUser]);

  const toggleHobby = (hobbyId: number) => {
    setSelectedHobbyIds((prev) =>
      prev.includes(hobbyId) ? prev.filter((id) => id !== hobbyId) : [...prev, hobbyId]
    );
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoError(null);

    if (file.size > MAX_PHOTO_BYTES) {
      setPhotoError(
        `Photo is ${(file.size / 1024).toFixed(1)} KB — must be under 20 KB. Please compress it first.`
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      setAvatarPreview(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const selectedHobbies = hobbies.filter((h) => selectedHobbyIds.includes(h.id));

    // Append custom "Other" text as a pseudo-hobby if filled
    const finalHobbies = customOther.trim()
      ? [...selectedHobbies, { id: 99, name: customOther.trim(), color: 'teal' as const }]
      : selectedHobbies;

    try {
      await updateProfile({
        full_name: fullName.trim(),
        department: department.trim(),
        year,
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

  return (
    <div className="min-h-[85vh] py-8 px-4 sm:px-6 max-w-3xl mx-auto space-y-6">
      {/* Toast */}
      {showSavedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-zinc-950 px-4 py-3 rounded-2xl font-bold text-xs shadow-2xl flex items-center gap-2 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4" />
          <span>Profile updated!</span>
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
                currentUser.full_name?.charAt(0) || 'U'
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-2 -right-2 w-8 h-8 bg-purple-600 hover:bg-purple-500 rounded-xl flex items-center justify-center shadow-lg transition-colors"
              title="Upload profile photo"
            >
              <ImagePlus className="w-4 h-4 text-white" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handlePhotoSelect}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h2 className="font-bold text-white text-lg">{currentUser.full_name || 'Student'}</h2>
              {status === 'verified' && (
                <span className="bg-teal-500/20 text-teal-400 border border-teal-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Verified
                </span>
              )}
              {status === 'pending' && (
                <span className="bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                  <Clock className="w-3 h-3" /> Under Review
                </span>
              )}
              {(status === 'unverified' || status === 'rejected') && (
                <span className="bg-zinc-800 text-zinc-400 border border-zinc-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3 text-amber-500" /> Unverified
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

        {/* Photo upload error + guide */}
        {photoError && (
          <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs space-y-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{photoError}</span>
            </div>
            <div className="flex flex-wrap gap-2 pl-6">
              <a
                href="https://jpeg-optimizer.com/compress-image-to-20kb/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-rose-300 hover:text-white underline underline-offset-2 font-semibold"
              >
                Compress here (jpeg-optimizer.com) <ExternalLink className="w-3 h-3" />
              </a>
              <span className="text-zinc-500">or</span>
              <a
                href="https://share.google/1e8tLX11dRwxiYfGX"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-rose-300 hover:text-white underline underline-offset-2 font-semibold"
              >
                Google compression tool <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}

        {/* Photo upload guide (always visible) */}
        <div className="mt-4 p-3 rounded-xl bg-zinc-950/60 border border-zinc-800 text-xs text-zinc-400">
          <span className="font-semibold text-zinc-300">📸 Photo upload:</span> Max size is{' '}
          <strong className="text-white">20 KB</strong>. If your photo is larger, compress it first at{' '}
          <a
            href="https://jpeg-optimizer.com/compress-image-to-20kb/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-400 hover:underline font-semibold"
          >
            jpeg-optimizer.com
          </a>
          {' '}or{' '}
          <a
            href="https://share.google/1e8tLX11dRwxiYfGX"
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-400 hover:underline font-semibold"
          >
            Google tool
          </a>.
        </div>
      </div>

      {/* Edit Profile Form */}
      <div className="bg-zinc-900/70 border border-zinc-800 rounded-3xl p-5 sm:p-8 backdrop-blur-xl shadow-2xl">
        <h3 className="text-lg font-black text-white mb-6">Edit Your Profile</h3>

        <form onSubmit={handleSave} className="space-y-5">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Department / Branch</label>
              <div className="relative">
                <GraduationCap className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. Computer Science, MBA..."
                  className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-purple-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Year of Study</label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
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
          </div>

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
                const colorMap: Record<string, string> = {
                  coral: isSelected ? 'bg-rose-500 text-white border-rose-500' : 'bg-zinc-900 text-zinc-400 border-zinc-700 hover:border-rose-500/50',
                  purple: isSelected ? 'bg-purple-600 text-white border-purple-600' : 'bg-zinc-900 text-zinc-400 border-zinc-700 hover:border-purple-500/50',
                  teal: isSelected ? 'bg-teal-500 text-zinc-950 border-teal-500' : 'bg-zinc-900 text-zinc-400 border-zinc-700 hover:border-teal-500/50',
                };
                const cls = colorMap[hobby.color || 'teal'] || colorMap.teal;

                return (
                  <button
                    key={hobby.id}
                    type="button"
                    onClick={() => toggleHobby(hobby.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${cls}`}
                  >
                    {hobby.name}
                  </button>
                );
              })}
            </div>

            {/* "Other" custom input — shows when Other (id=6) is selected */}
            {selectedHobbyIds.includes(6) && (
              <div className="mt-2">
                <input
                  type="text"
                  value={customOther}
                  onChange={(e) => setCustomOther(e.target.value)}
                  placeholder="Describe your other interest (e.g. Photography, Chess, Debate...)"
                  maxLength={50}
                  className="w-full bg-zinc-950/80 border border-teal-500/40 focus:border-teal-400 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none transition-colors"
                />
                <p className="text-[11px] text-zinc-500 mt-1">This will appear as your custom interest tag on your profile.</p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-zinc-800 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-500 hover:to-teal-400 text-white font-bold text-xs shadow-glow-purple transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving…' : 'Save Profile'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
