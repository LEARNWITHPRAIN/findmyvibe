import React from 'react';
import { Hobby } from '@/lib/types';
import { clsx } from 'clsx';

interface HobbyBadgeProps {
  hobby: Hobby | string;
  size?: 'sm' | 'md' | 'lg';
  selected?: boolean;
  onClick?: () => void;
}

export function HobbyBadge({ hobby, size = 'md', selected, onClick }: HobbyBadgeProps) {
  const name = typeof hobby === 'string' ? hobby : hobby.name;

  // Determine vibrant accent color based on name hash
  const colorMap: Record<string, { bg: string; text: string; border: string; glow: string }> = {
    Dancing: {
      bg: 'bg-rose-500/15 hover:bg-rose-500/25',
      text: 'text-rose-400',
      border: 'border-rose-500/30',
      glow: 'shadow-[0_0_12px_rgba(244,63,94,0.3)]',
    },
    Singing: {
      bg: 'bg-purple-500/15 hover:bg-purple-500/25',
      text: 'text-purple-400',
      border: 'border-purple-500/30',
      glow: 'shadow-[0_0_12px_rgba(168,85,247,0.3)]',
    },
    Coding: {
      bg: 'bg-teal-500/15 hover:bg-teal-500/25',
      text: 'text-teal-400',
      border: 'border-teal-500/30',
      glow: 'shadow-[0_0_12px_rgba(45,212,191,0.3)]',
    },
    Fitness: {
      bg: 'bg-amber-500/15 hover:bg-amber-500/25',
      text: 'text-amber-400',
      border: 'border-amber-500/30',
      glow: 'shadow-[0_0_12px_rgba(245,158,11,0.3)]',
    },
    Athletics: {
      bg: 'bg-indigo-500/15 hover:bg-indigo-500/25',
      text: 'text-indigo-400',
      border: 'border-indigo-500/30',
      glow: 'shadow-[0_0_12px_rgba(99,102,241,0.3)]',
    },
    Other: {
      bg: 'bg-emerald-500/15 hover:bg-emerald-500/25',
      text: 'text-emerald-400',
      border: 'border-emerald-500/30',
      glow: 'shadow-[0_0_12px_rgba(52,211,153,0.3)]',
    },
  };

  const currentTheme = colorMap[name] || colorMap.Other;

  const sizeClasses = {
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-xs font-medium',
    lg: 'px-4 py-2 text-sm font-medium',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={clsx(
        'inline-flex items-center rounded-full border transition-all duration-200 select-none',
        sizeClasses[size],
        selected
          ? 'bg-gradient-to-r from-purple-600 to-teal-500 text-white border-transparent shadow-glow-purple font-semibold scale-105'
          : `${currentTheme.bg} ${currentTheme.text} ${currentTheme.border}`,
        onClick && 'cursor-pointer active:scale-95'
      )}
    >
      <span className="mr-1.5 inline-block w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {name}
    </button>
  );
}
