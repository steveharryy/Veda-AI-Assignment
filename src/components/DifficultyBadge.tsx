import React from 'react';

export type DifficultyType = 'Easy' | 'Moderate' | 'Hard' | 'Challenging';

interface DifficultyBadgeProps {
  difficulty: DifficultyType;
}

export const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({ difficulty }) => {
  const getBadgeStyles = () => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Moderate':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Hard':
      case 'Challenging':
        return 'bg-rose-50 text-rose-700 border-rose-100';
      default:
        return 'bg-neutral-50 text-neutral-600 border-neutral-200';
    }
  };

  return (
    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border tracking-wide uppercase select-none ${getBadgeStyles()}`}>
      {difficulty === 'Challenging' ? 'Hard' : difficulty}
    </span>
  );
};
