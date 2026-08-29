'use client';

import React, { useState, useEffect, useRef } from 'react';
import { GraduationCap, ChevronDown, Search, X } from 'lucide-react';

export const CSJMU_COURSES = [
  // Engineering & Technology
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
  { group: 'Science', name: 'B.Sc combinations (Physics / Maths / IT / Geography)' },
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
  // Postgraduate (PG)
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
  // Diploma / Certificate
  { group: 'Diploma / Certificate', name: 'PG Diploma Data Science & Machine Learning' },
  { group: 'Diploma / Certificate', name: 'PG Diploma Journalism & Mass Communication' },
  { group: 'Diploma / Certificate', name: 'PG Diploma Guidance & Counselling' },
  { group: 'Diploma / Certificate', name: 'Diploma Mechanical Engineering' },
  { group: 'Diploma / Certificate', name: 'Diploma Chemical Engineering' },
  { group: 'Diploma / Certificate', name: 'Diploma Electrical Engineering' },
  { group: 'Diploma / Certificate', name: 'Diploma Metallurgy & Material Technology' },
  { group: 'Diploma / Certificate', name: 'Diploma Pharmacy' },
  { group: 'Diploma / Certificate', name: 'Diploma Food Production' },
  { group: 'Diploma / Certificate', name: 'Diploma Front Office' },
  { group: 'Diploma / Certificate', name: 'Diploma Food & Beverage Service' },
  { group: 'Diploma / Certificate', name: 'Diploma Interior Design' },
  { group: 'Diploma / Certificate', name: 'Diploma Kathak' },
  { group: 'Diploma / Certificate', name: 'Certificate Social Media' },
  { group: 'Diploma / Certificate', name: 'Certificate TV Journalism' },
  { group: 'Diploma / Certificate', name: 'Certificate Graphic Design' },
  { group: 'Diploma / Certificate', name: 'Certificate Photography' },
  { group: 'Diploma / Certificate', name: 'Certificate Garbh Sanskar' },
];

interface DepartmentDropdownProps {
  value: string;
  onChange: (val: string) => void;
  required?: boolean;
}

export function DepartmentDropdown({ value, onChange, required }: DepartmentDropdownProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  
  // Check if current value matches one of the preset courses
  const isPreset = CSJMU_COURSES.some((c) => c.name.toLowerCase() === (value || '').toLowerCase());
  const [isManualOther, setIsManualOther] = useState(Boolean(value && !isPreset));
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value && !isPreset) {
      setIsManualOther(true);
    }
  }, [value, isPreset]);

  // Close dropdown on outside click
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
    ? CSJMU_COURSES.filter((d) => d.name.toLowerCase().includes(search.toLowerCase()))
    : CSJMU_COURSES;

  const grouped: Record<string, string[]> = {};
  for (const d of filtered) {
    if (!grouped[d.group]) grouped[d.group] = [];
    grouped[d.group].push(d.name);
  }

  const handleSelect = (name: string) => {
    setIsManualOther(false);
    onChange(name);
    setOpen(false);
    setSearch('');
  };

  const handleChooseOther = () => {
    setIsManualOther(true);
    onChange('');
    setOpen(false);
    setSearch('');
  };

  return (
    <div ref={dropdownRef} className="relative space-y-2">
      {!isManualOther ? (
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="w-full bg-zinc-950/80 border border-zinc-800 hover:border-zinc-700 focus:border-purple-500 rounded-xl pl-10 pr-10 py-2.5 text-sm text-left transition-colors flex items-center justify-between cursor-pointer"
          >
            <GraduationCap className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <span className={value ? 'text-zinc-100 font-medium' : 'text-zinc-500'}>
              {value || 'Select your Course / Department'}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-zinc-400 absolute right-3.5 top-1/2 -translate-y-1/2 transition-transform duration-200 ${
                open ? 'rotate-180 text-purple-400' : ''
              }`}
            />
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="relative">
            <GraduationCap className="w-4 h-4 text-teal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Type your custom course / department name..."
              autoFocus
              required={required}
              className="w-full bg-zinc-950/90 border border-teal-500/50 focus:border-teal-400 rounded-xl pl-10 pr-10 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none transition-colors"
            />
            <button
              type="button"
              onClick={() => {
                setIsManualOther(false);
                onChange('');
              }}
              title="Back to courses list"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[11px] text-zinc-500 flex items-center justify-between">
            <span>Manual Department Entry</span>
            <button
              type="button"
              onClick={() => {
                setIsManualOther(false);
                onChange('');
                setOpen(true);
              }}
              className="text-purple-400 hover:underline font-semibold"
            >
              ← Choose from CSJMU list
            </button>
          </p>
        </div>
      )}

      {open && (
        <div className="absolute z-50 top-full mt-1 w-full bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
          {/* Search box */}
          <div className="p-2.5 border-b border-zinc-800 bg-zinc-950/80 sticky top-0 z-10">
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search courses (e.g. CSE, MBA, B.Sc, BCA)..."
                autoFocus
                className="w-full bg-zinc-900 border border-zinc-700 focus:border-purple-500 rounded-xl pl-9 pr-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Courses list */}
          <div className="max-h-60 overflow-y-auto divide-y divide-zinc-800/50">
            {Object.keys(grouped).length === 0 ? (
              <div className="p-4 text-center text-xs text-zinc-500">
                No matching courses found.
              </div>
            ) : (
              Object.entries(grouped).map(([group, names]) => (
                <div key={group}>
                  <div className="px-3.5 py-1.5 text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider bg-zinc-950/90 sticky top-0 flex items-center justify-between">
                    <span>{group}</span>
                    <span className="text-zinc-600 font-normal">({names.length})</span>
                  </div>
                  <div className="py-1">
                    {names.map((name) => {
                      const isSelected = value === name;
                      return (
                        <button
                          key={name}
                          type="button"
                          onClick={() => handleSelect(name)}
                          className={`w-full text-left px-4 py-2 text-xs transition-colors flex items-center justify-between ${
                            isSelected
                              ? 'bg-purple-600/20 text-teal-300 font-bold'
                              : 'text-zinc-200 hover:bg-zinc-800 hover:text-white'
                          }`}
                        >
                          <span>{name}</span>
                          {isSelected && <span className="text-teal-400 text-xs">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))
            )}

            {/* Other manual option */}
            <div className="p-2 bg-zinc-950/90 border-t border-zinc-800">
              <button
                type="button"
                onClick={handleChooseOther}
                className="w-full text-left px-3 py-2 text-xs rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 font-bold transition-colors flex items-center justify-between"
              >
                <span>✏️ Other (Type custom course manually)</span>
                <span className="text-[10px] text-purple-400 uppercase tracking-wider">Custom</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
