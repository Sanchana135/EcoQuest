import React from 'react';
import { Lock, Award } from 'lucide-react';

interface BadgeItem {
  id: string;
  code: string;
  name: string;
  description: string;
  iconUrl: string;
  category: string;
  isUnlocked: boolean;
  unlockedAt?: string | null;
}

interface BadgeGalleryProps {
  badges: BadgeItem[];
}

export const BadgeGallery: React.FC<BadgeGalleryProps> = ({ badges }) => {
  return (
    <div className="glass-panel p-6 rounded-2xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-emerald-600" />
          <h2 className="text-lg font-bold text-slate-900">Badge Collection & Achievements</h2>
        </div>
        <span className="text-xs font-semibold text-slate-500">
          {badges.filter((b) => b.isUnlocked).length} / {badges.length} Unlocked
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className={`p-4 rounded-2xl border text-center transition-all relative flex flex-col justify-between ${
              badge.isUnlocked
                ? 'bg-white border-emerald-300 shadow-sm hover:shadow-md hover:border-emerald-500'
                : 'bg-slate-100/60 border-slate-200 opacity-60 grayscale'
            }`}
          >
            {!badge.isUnlocked && (
              <div className="absolute top-2 right-2 text-slate-400">
                <Lock className="w-3.5 h-3.5" />
              </div>
            )}

            <div>
              <div className="text-3xl mb-2 flex items-center justify-center h-10">
                {badge.iconUrl}
              </div>
              <h3 className="font-bold text-slate-900 text-xs line-clamp-1">{badge.name}</h3>
              <p className="text-[10px] text-slate-500 mt-1 line-clamp-2 leading-tight">
                {badge.description}
              </p>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] font-bold">
              {badge.isUnlocked ? (
                <span className="text-emerald-700">Unlocked</span>
              ) : (
                <span className="text-slate-400">Locked</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
