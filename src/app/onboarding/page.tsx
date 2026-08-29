'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  Search,
  ChevronDown,
  X,
} from 'lucide-react';

// ─── All CSJMU Departments ──────────────────────────────────────────────────
const DEPARTMENTS = [
  // UG Engineering & Technology
  { group: 'Engineering & Technology', name: 'B.Tech CSE' },
  { group: 'Engineering & Technology', name: 'B.Tech CSE (Artificial Intelligence)' },
  { group: 'Engineering & Technology', name: 'B.Tech Information Technology' },
  { group: 'Engineering & Technology', name: 'B.Tech Electronics & Communication Engineering' },
  { group: 'Engineering & Technology', name: 'B.Tech Mechanical Engineering' },
  { group: 'Engineering & Technology', name: 'B.Tech Chemical Engineering' },
  { group: 'Engineering & Technology', name: 'B.Tech Materials Science & Metallurgical Engineering' },
  { group: 'Engineering & Technology', name: 'BCA' },
  { group: 'Engineering & Technology', name: 'B.Voc Fashion Technology' },
  { group: 'Engineering & Technology', name: 'B.Voc Interior Design' },
  // Science
  { group: 'Science', name: 'B.Sc (Hons.) Physics' },
  { group: 'Science', name: 'B.Sc (Hons.) Chemistry' },
  { group: 'Science', name: 'B.Sc (Hons.) Mathematics' },
  { group: 'Science', name: 'B.Sc (Hons.) Agriculture' },
  { group: 'Science', name: 'B.Sc Biotechnology' },
  { group: 'Science', name: 'B.Sc (Hons.) Biotechnology' },
  { group: 'Science', name: 'B.Sc Biological Sciences' },
  { group: 'Science', name: 'B.Sc Biochemistry / Botany / Zoology' },
  { group: 'Science', name: 'B.Sc Microbiology' },
  { group: 'Science', name: 'B.Sc Physics / Maths / CS combinations' },
  // Management & Commerce
  { group: 'Management & Commerce', name: 'BBA' },
  { group: 'Management & Commerce', name: 'B.Com (Hons.)' },
  // Law
  { group: 'Law', name: 'B.A. LL.B. (Hons.)' },
  { group: 'Law', name: 'B.B.A. LL.B. (Hons.)' },
  // Arts & Social Sciences
  { group: 'Arts & Social Sciences', name: 'B.A. (Hons.) Economics' },
  { group: 'Arts & Social Sciences', name: 'B.A. (Hons.) Psychology' },
  { group: 'Arts & Social Sciences', name: 'B.A. (Hons.) Sociology' },
  { group: 'Arts & Social Sciences', name: 'B.A. (Hons.) English' },
  { group: 'Arts & Social Sciences', name: 'B.A. Journalism & Mass Communication' },
  { group: 'Arts & Social Sciences', name: 'BSW' },
  { group: 'Arts & Social Sciences', name: 'B.Lib.I.Sc.' },
  // Health Sciences
  { group: 'Health Sciences', name: 'B.Sc Human Nutrition' },
  { group: 'Health Sciences', name: 'B.Sc Medical Laboratory Technology' },
  { group: 'Health Sciences', name: 'B.Sc Medical Microbiology' },
  { group: 'Health Sciences', name: 'B.Sc Yoga' },
  { group: 'Health Sciences', name: 'BPT' },
  { group: 'Health Sciences', name: 'B.Optom.' },
  { group: 'Health Sciences', name: 'BMRIT' },
  { group: 'Health Sciences', name: 'B.Pharm.' },
  { group: 'Health Sciences', name: 'BHMCT' },
  // Creative/Performing Arts
  { group: 'Creative & Performing Arts', name: 'BFA Applied Art' },
  { group: 'Creative & Performing Arts', name: 'BFA Painting' },
  { group: 'Creative & Performing Arts', name: 'BFA Sculpture' },
  { group: 'Creative & Performing Arts', name: 'BPA Kathak' },
  // Education
  { group: 'Education', name: 'B.Ed.' },
  { group: 'Education', name: 'B.P.Ed.' },
  { group: 'Education', name: 'B.P.E.S.' },
  // PG
  { group: 'Postgraduate (PG)', name: 'M.Tech CSE' },
  { group: 'Postgraduate (PG)', name: 'MCA' },
  { group: 'Postgraduate (PG)', name: 'M.Sc Computer Science' },
  { group: 'Postgraduate (PG)', name: 'M.Sc Chemistry' },
  { group: 'Postgraduate (PG)', name: 'M.Sc Industrial Chemistry' },
  { group: 'Postgraduate (PG)', name: 'M.Sc Mathematics' },
  { group: 'Postgraduate (PG)', name: 'M.Sc Physics' },
  { group: 'Postgraduate (PG)', name: 'M.Sc Human Nutrition' },
  { group: 'Postgraduate (PG)', name: 'M.Sc Medical Laboratory Technology' },
  { group: 'Postgraduate (PG)', name: 'M.Sc Yoga' },
  { group: 'Postgraduate (PG)', name: 'MPT' },
  { group: 'Postgraduate (PG)', name: 'MBA' },
  { group: 'Postgraduate (PG)', name: 'MBA Part-time' },
  { group: 'Postgraduate (PG)', name: 'MA Psychology' },
  { group: 'Postgraduate (PG)', name: 'MA Hindu Studies' },
  { group: 'Postgraduate (PG)', name: 'MA Journalism & Mass Communication' },
  { group: 'Postgraduate (PG)', name: 'MSW' },
  { group: 'Postgraduate (PG)', name: 'M.Lib.I.Sc.' },
  { group: 'Postgraduate (PG)', name: 'LL.M.' },
  { group: 'Postgraduate (PG)', name: 'Integrated M.Sc Electronics' },
  // Diploma
  { group: 'Diploma / PG Diploma / Certificate', name: 'PG Diploma Data Science & Machine Learning' },
  { group: 'Diploma / PG Diploma / Certificate', name: 'PG Diploma Journalism & Mass Communication' },
  { group: 'Diploma / PG Diploma / Certificate', name: 'PG Diploma Guidance & Counselling' },
  { group: 'Diploma / PG Diploma / Certificate', name: 'Diploma Mechanical Engineering' },
  { group: 'Diploma / PG Diploma / Certificate', name: 'Diploma Chemical Engineering' },
  { group: 'Diploma / PG Diploma / Certificate', name: 'Diploma Electrical Engineering' },
  { group: 'Diploma / PG Diploma / Certificate', name: 'Diploma Metallurgy & Material Technology' },
  { group: 'Diploma / PG Diploma / Certificate', name: 'Diploma Pharmacy' },
  { group: 'Diploma / PG Diploma / Certificate', name: 'Diploma Food Production' },
  { group: 'Diploma / PG Diploma / Certificate', name: 'Diploma Front Office' },
  { group: 'Diploma / PG Diploma / Certificate', name: 'Diploma Food & Beverage Service' },
  { group: 'Diploma / PG Diploma / Certificate', name: 'Diploma Interior Design' },
  { group: 'Diploma / PG Diploma / Certificate', name: 'Diploma Kathak' },
  { group: 'Diploma / PG Diploma / Certificate', name: 'Certificate Social Media' },
  { group: 'Diploma / PG Diploma / Certificate', name: 'Certificate TV Journalism' },
  { group: 'Diploma / PG Diploma / Certificate', name: 'Certificate Graphic Design' },
  { group: 'Diploma / PG Diploma / Certificate', name: 'Certificate Photography' },
  { group: 'Diploma / PG Diploma / Certificate', name: 'Certificate Garbh Sanskar' },
];

// ─── Searchable Department Dropdown ─────────────────────────────────────────
function DepartmentDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [isOther, setIsOther] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = search.trim()
    ? DEPARTMENTS.filter((d) => d.name.toLowerCase().includes(search.toLowerCase()))
    : DEPARTMENTS;

  // Group them
  const grouped: Record<string, string[]> = {};
  for (const d of filtered) {
    if (!grouped[d.group]) grouped[d.group] = [];
    grouped[d.group].push(d.name);
  }

  const handleSelect = (name: string) => {
    setIsOther(false);
    onChange(name);
    setOpen(false);
    setSearch('');
  };

  const handleOther = () => {
    setIsOther(true);
    onChange('');
    setOpen(false);
    setSearch('');
  };

  return (
    <div ref={dropdownRef} className="relative">
      {!isOther ? (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-purple-500 rounded-xl pl-10 pr-10 py-2.5 text-sm text-left transition-colors flex items-center gap-2"
        >
          <GraduationCap className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <span className={value ? 'text-zinc-100' : 'text-zinc-600'}>
            {value || 'Select your course / department'}
          </span>
          <ChevronDown className={`w-4 h-4 text-zinc-500 absolute right-3.5 top-1/2 -translate-y-1/2 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
      ) : (
        <div className="relative">
          <GraduationCap className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Type your course / department..."
            autoFocus
            className="w-full bg-zinc-950/80 border border-purple-500/50 focus:border-purple-500 rounded-xl pl-10 pr-10 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none transition-colors"
          />
          <button
            type="button"
            onClick={() => { setIsOther(false); onChange(''); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {open && (
        <div className="absolute z-50 top-full mt-1 w-full bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl overflow-hidden">
          {/* Search inside dropdown */}
          <div className="p-2 border-b border-zinc-800">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search your course..."
                autoFocus
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="max-h-56 overflow-y-auto">
            {Object.entries(grouped).map(([group, names]) => (
              <div key={group}>
                <div className="px-3 py-1.5 text-[10px] font-bold text-zinc-500 uppercase tracking-wider bg-zinc-950/60 sticky top-0">
                  {group}
                </div>
                {names.map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => handleSelect(name)}
                    className={`w-full text-left px-4 py-2 text-xs hover:bg-zinc-800 transition-colors ${value === name ? 'text-teal-400 font-semibold' : 'text-zinc-200'}`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            ))}

            {/* Other option */}
            <div className="border-t border-zinc-800">
              <button
                type="button"
                onClick={handleOther}
                className="w-full text-left px-4 py-2.5 text-xs text-purple-400 hover:bg-purple-950/30 transition-colors font-semibold"
              >
                ✏️ Other — type manually
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Onboarding Page ────────────────────────────────────────────────────
export default function OnboardingPage() {
  const router = useRouter();
  const { currentUser, hobbies, updateProfile, isLoading } = useAuth();

  const [fullName, setFullName] = useState('');
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('1');
  const [gender, setGender] = useState('Prefer not to say');
  const [bio, setBio] = useState('');
  const [selectedHobbyIds, setSelectedHobbyIds] = useState<number[]>([1, 3]);
  const [customInterest, setCustomInterest] = useState('');
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

    const baseHobbies = hobbies.filter((h) => selectedHobbyIds.includes(h.id));
    // If Other selected AND customInterest filled, attach as custom hobby
    const finalHobbies =
      selectedHobbyIds.includes(6) && customInterest.trim()
        ? [...baseHobbies.filter((h) => h.id !== 6), { id: 6, name: customInterest.trim(), color: 'teal' as const }]
        : baseHobbies;

    try {
      await updateProfile({
        full_name: fullName.trim() || 'CSJMU Student',
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
  const hasOtherSelected = selectedHobbyIds.includes(OTHER_HOBBY_ID);

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
            <DepartmentDropdown value={department} onChange={setDepartment} />
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
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-purple-500 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none transition-colors appearance-none cursor-pointer"
              >
                <option value="Male">👦 Male</option>
                <option value="Female">👧 Female</option>
                <option value="Other">🏳️‍🌈 Other</option>
                <option value="Prefer not to say">🤐 Prefer not to say</option>
              </select>
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

            {/* "Other" custom input */}
            {hasOtherSelected && (
              <div className="mt-3">
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Describe your interest ✏️
                </label>
                <input
                  type="text"
                  value={customInterest}
                  onChange={(e) => setCustomInterest(e.target.value)}
                  placeholder="e.g. Photography, Chess, Debate, Robotics..."
                  maxLength={50}
                  className="w-full bg-zinc-950/80 border border-teal-500/40 focus:border-teal-400 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none transition-colors"
                />
                <p className="text-[11px] text-zinc-500 mt-1">
                  This will appear as your custom interest tag on your profile.
                </p>
              </div>
            )}

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
              disabled={loading || selectedHobbyIds.length === 0 || !department.trim()}
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
