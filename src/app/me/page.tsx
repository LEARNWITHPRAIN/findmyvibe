'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/authContext';
import { HobbyBadge } from '@/components/HobbyBadge';
import {
  User,
  GraduationCap,
  Calendar,
  ShieldCheck,
  Clock,
  Camera,
  CheckCircle2,
  Save,
} from 'lucide-react';

export default function MyProfilePage() {
  const { currentUser, hobbies, updateProfile } = useAuth();

  const [fullName, setFullName] = useState(currentUser?.full_name || '');
  const [department, setDepartment] = useState(currentUser?.department || '');
  const [year, setYear] = useState(currentUser?.year || '2');
  const [gender] = useState(currentUser?.gender || 'Prefer not to say');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [selectedHobbyIds, setSelectedHobbyIds] = useState<number[]>(
    currentUser?.hobbies?.map((h) => h.id) || [1, 3]
  );
  const [isSaving, setIsSaving] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);

  const toggleHobby = (hobbyId: number) => {
    setSelectedHobbyIds((prev) =>
      prev.includes(hobbyId) ? prev.filter((id) => id !== hobbyId) : [...prev, hobbyId]
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const selectedHobbies = hobbies.filter((h) => selectedHobbyIds.includes(h.id));

    try {
      await updateProfile({
        full_name: fullName.trim(),
        department: department.trim(),
        year,
        gender,
        bio: bio.trim(),
        hobbies: selectedHobbies,
      });

      setShowSavedToast(true);
      setTimeout(() => setShowSavedToast(false), 3500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const status = currentUser?.verification_status || 'unverified';

  return (
    <div className="min-h-[85vh] py-10 px-4 sm:px-6 max-w-3xl mx-auto space-y-6">
      {/* Toast Notification */}
      {showSavedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-zinc-950 px-4 py-3 rounded-2xl font-bold text-xs shadow-2xl flex items-center gap-2 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4" />
          <span>Profile updated successfully!</span>
        </div>
      )}

      {/* Verification Status Card */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-6 backdrop-blur-xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0 font-bold text-lg">
            {currentUser?.full_name?.charAt(0) || 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-white text-base sm:text-lg">
                {currentUser?.full_name || 'CSJMU Student'}
              </h2>
              {status === 'verified' && (
                <span className="bg-teal-500/20 text-teal-400 border border-teal-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Verified
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-400">
              {currentUser?.email || 'student@csjmu.ac.in'}
            </p>
          </div>
        </div>

        {/* Verification Action */}
        <div>
          {status === 'verified' ? (
            <div className="text-xs text-teal-400 font-semibold flex items-center gap-1.5 bg-teal-950/40 px-3 py-1.5 rounded-xl border border-teal-500/30">
              <ShieldCheck className="w-4 h-4" /> Proctor ID Approved
            </div>
          ) : status === 'pending' ? (
            <Link
              href="/verify-id"
              className="text-xs text-amber-400 font-semibold flex items-center gap-1.5 bg-amber-950/40 px-3 py-1.5 rounded-xl border border-amber-500/30 hover:bg-amber-950/70 transition-colors"
            >
              <Clock className="w-4 h-4 animate-pulse" /> Under Review (Check Status)
            </Link>
          ) : (
            <Link
              href="/verify-id"
              className="text-xs text-white font-bold flex items-center gap-1.5 bg-gradient-to-r from-purple-600 to-teal-500 px-3.5 py-1.5 rounded-xl shadow-glow-purple hover:opacity-90 transition-all"
            >
              <Camera className="w-3.5 h-3.5" /> Upload CSJMU ID
            </Link>
          )}
        </div>
      </div>

      {/* Edit Profile Form */}
      <div className="bg-zinc-900/70 border border-zinc-800 rounded-3xl p-6 sm:p-10 backdrop-blur-xl shadow-2xl">
        <h3 className="text-lg font-black text-white mb-6">Edit Profile Details</h3>

        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Full Name
            </label>
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
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Department / Branch
              </label>
              <div className="relative">
                <GraduationCap className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-purple-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-100 focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Year of Study
              </label>
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
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Bio / Hostel Vibe
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
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
          </div>

          <div className="pt-4 border-t border-zinc-800 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-500 hover:to-teal-400 text-white font-bold text-xs shadow-glow-purple transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving Changes...' : 'Save Profile'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
