import React from 'react';
import { Hobby } from '@/lib/types';
import { clsx } from 'clsx';
import { Check } from 'lucide-react';

interface HobbyBadgeProps {
  hobby: Hobby | string;
  size?: 'sm' | 'md' | 'lg';
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

const colorMap: Record<string, { bg: string; text: string; border: string; glow?: string }> = {
  // Music & Audio
  Music: { bg: 'bg-purple-500/15 hover:bg-purple-500/25', text: 'text-purple-300', border: 'border-purple-500/30' },
  Bollywood: { bg: 'bg-rose-500/15 hover:bg-rose-500/25', text: 'text-rose-300', border: 'border-rose-500/30' },
  'Hip-Hop': { bg: 'bg-fuchsia-500/15 hover:bg-fuchsia-500/25', text: 'text-fuchsia-300', border: 'border-fuchsia-500/30' },
  'K-Pop': { bg: 'bg-pink-500/15 hover:bg-pink-500/25', text: 'text-pink-300', border: 'border-pink-500/30' },
  Singing: { bg: 'bg-violet-500/15 hover:bg-violet-500/25', text: 'text-violet-300', border: 'border-violet-500/30' },

  // Gaming
  Gaming: { bg: 'bg-teal-500/15 hover:bg-teal-500/25', text: 'text-teal-300', border: 'border-teal-500/30' },
  BGMI: { bg: 'bg-amber-500/15 hover:bg-amber-500/25', text: 'text-amber-300', border: 'border-amber-500/30' },
  'Free Fire': { bg: 'bg-orange-500/15 hover:bg-orange-500/25', text: 'text-orange-300', border: 'border-orange-500/30' },
  Valorant: { bg: 'bg-red-500/15 hover:bg-red-500/25', text: 'text-red-300', border: 'border-red-500/30' },

  // Entertainment
  Anime: { bg: 'bg-indigo-500/15 hover:bg-indigo-500/25', text: 'text-indigo-300', border: 'border-indigo-500/30' },
  Movies: { bg: 'bg-purple-500/15 hover:bg-purple-500/25', text: 'text-purple-300', border: 'border-purple-500/30' },
  'Web Series': { bg: 'bg-cyan-500/15 hover:bg-cyan-500/25', text: 'text-cyan-300', border: 'border-cyan-500/30' },

  // Sports & Fitness
  Cricket: { bg: 'bg-emerald-500/15 hover:bg-emerald-500/25', text: 'text-emerald-300', border: 'border-emerald-500/30' },
  Football: { bg: 'bg-lime-500/15 hover:bg-lime-500/25', text: 'text-lime-300', border: 'border-lime-500/30' },
  Badminton: { bg: 'bg-sky-500/15 hover:bg-sky-500/25', text: 'text-sky-300', border: 'border-sky-500/30' },
  Basketball: { bg: 'bg-orange-500/15 hover:bg-orange-500/25', text: 'text-orange-300', border: 'border-orange-500/30' },
  Gym: { bg: 'bg-rose-500/15 hover:bg-rose-500/25', text: 'text-rose-300', border: 'border-rose-500/30' },
  Calisthenics: { bg: 'bg-teal-500/15 hover:bg-teal-500/25', text: 'text-teal-300', border: 'border-teal-500/30' },
  Running: { bg: 'bg-amber-500/15 hover:bg-amber-500/25', text: 'text-amber-300', border: 'border-amber-500/30' },
  Cycling: { bg: 'bg-emerald-500/15 hover:bg-emerald-500/25', text: 'text-emerald-300', border: 'border-emerald-500/30' },

  // Tech & Business
  Coding: { bg: 'bg-teal-500/15 hover:bg-teal-500/25', text: 'text-teal-300', border: 'border-teal-500/30' },
  AI: { bg: 'bg-blue-500/15 hover:bg-blue-500/25', text: 'text-blue-300', border: 'border-blue-500/30' },
  Startups: { bg: 'bg-purple-500/15 hover:bg-purple-500/25', text: 'text-purple-300', border: 'border-purple-500/30' },
  Entrepreneurship: { bg: 'bg-indigo-500/15 hover:bg-indigo-500/25', text: 'text-indigo-300', border: 'border-indigo-500/30' },

  // Creative & Arts
  Photography: { bg: 'bg-cyan-500/15 hover:bg-cyan-500/25', text: 'text-cyan-300', border: 'border-cyan-500/30' },
  'Video Editing': { bg: 'bg-violet-500/15 hover:bg-violet-500/25', text: 'text-violet-300', border: 'border-violet-500/30' },
  'Content Creation': { bg: 'bg-pink-500/15 hover:bg-pink-500/25', text: 'text-pink-300', border: 'border-pink-500/30' },
  Drawing: { bg: 'bg-amber-500/15 hover:bg-amber-500/25', text: 'text-amber-300', border: 'border-amber-500/30' },
  Dancing: { bg: 'bg-rose-500/15 hover:bg-rose-500/25', text: 'text-rose-300', border: 'border-rose-500/30' },
  Fashion: { bg: 'bg-fuchsia-500/15 hover:bg-fuchsia-500/25', text: 'text-fuchsia-300', border: 'border-fuchsia-500/30' },

  // Lifestyle & Outdoors
  Reading: { bg: 'bg-sky-500/15 hover:bg-sky-500/25', text: 'text-sky-300', border: 'border-sky-500/30' },
  Travelling: { bg: 'bg-teal-500/15 hover:bg-teal-500/25', text: 'text-teal-300', border: 'border-teal-500/30' },
  Food: { bg: 'bg-orange-500/15 hover:bg-orange-500/25', text: 'text-orange-300', border: 'border-orange-500/30' },
  Cooking: { bg: 'bg-amber-500/15 hover:bg-amber-500/25', text: 'text-amber-300', border: 'border-amber-500/30' },
  'Café Hopping': { bg: 'bg-rose-500/15 hover:bg-rose-500/25', text: 'text-rose-300', border: 'border-rose-500/30' },
  Trekking: { bg: 'bg-emerald-500/15 hover:bg-emerald-500/25', text: 'text-emerald-300', border: 'border-emerald-500/30' },

  // Mindset & Social
  'Self Improvement': { bg: 'bg-teal-500/15 hover:bg-teal-500/25', text: 'text-teal-300', border: 'border-teal-500/30' },
  Psychology: { bg: 'bg-purple-500/15 hover:bg-purple-500/25', text: 'text-purple-300', border: 'border-purple-500/30' },
  'Making New Friends': { bg: 'bg-pink-500/15 hover:bg-pink-500/25', text: 'text-pink-300', border: 'border-pink-500/30' },
  'Deep Conversations': { bg: 'bg-indigo-500/15 hover:bg-indigo-500/25', text: 'text-indigo-300', border: 'border-indigo-500/30' },

  // Generic fallback / custom
  Other: { bg: 'bg-emerald-500/15 hover:bg-emerald-500/25', text: 'text-emerald-300', border: 'border-emerald-500/30' },
  '+ Other': { bg: 'bg-emerald-500/15 hover:bg-emerald-500/25', text: 'text-emerald-300', border: 'border-emerald-500/30' },
  '+ Custom': { bg: 'bg-teal-500/15 hover:bg-teal-500/25', text: 'text-teal-300', border: 'border-teal-500/30' },
};

// Fallback palette for custom tags
const FALLBACK_PALETTES = [
  { bg: 'bg-purple-500/15 hover:bg-purple-500/25', text: 'text-purple-300', border: 'border-purple-500/30' },
  { bg: 'bg-teal-500/15 hover:bg-teal-500/25', text: 'text-teal-300', border: 'border-teal-500/30' },
  { bg: 'bg-rose-500/15 hover:bg-rose-500/25', text: 'text-rose-300', border: 'border-rose-500/30' },
  { bg: 'bg-amber-500/15 hover:bg-amber-500/25', text: 'text-amber-300', border: 'border-amber-500/30' },
  { bg: 'bg-cyan-500/15 hover:bg-cyan-500/25', text: 'text-cyan-300', border: 'border-cyan-500/30' },
];

function getTheme(name: string) {
  if (colorMap[name]) return colorMap[name];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % FALLBACK_PALETTES.length;
  return FALLBACK_PALETTES[index];
}

export function HobbyBadge({ hobby, size = 'md', selected, disabled, onClick }: HobbyBadgeProps) {
  const name = typeof hobby === 'string' ? hobby : hobby.name;
  const currentTheme = getTheme(name);

  const sizeClasses = {
    sm: 'px-2.5 py-0.5 text-xs gap-1',
    md: 'px-3 py-1 text-xs font-medium gap-1.5',
    lg: 'px-4 py-2 text-sm font-medium gap-2',
  };

  const isClickable = !!onClick && !disabled;

  return (
    <button
      type="button"
      onClick={isClickable ? onClick : undefined}
      disabled={disabled || !onClick}
      className={clsx(
        'inline-flex items-center rounded-full border transition-all duration-200 select-none text-left',
        sizeClasses[size],
        selected
          ? 'bg-gradient-to-r from-purple-600 to-teal-500 text-white border-transparent shadow-glow-purple font-semibold scale-[1.02]'
          : `${currentTheme.bg} ${currentTheme.text} ${currentTheme.border}`,
        disabled && !selected && 'opacity-35 cursor-not-allowed filter grayscale-[20%]',
        isClickable && 'cursor-pointer hover:scale-[1.02] active:scale-95'
      )}
    >
      {selected ? (
        <Check className={clsx('stroke-[2.5]', size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5')} />
      ) : (
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      )}
      <span>{name}</span>
    </button>
  );
}
