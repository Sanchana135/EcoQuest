import React from 'react';
import { Trophy, Award, Flame, User as UserIcon } from 'lucide-react';

interface LeaderboardItem {
  rank: number;
  id: string;
  name: string;
  avatarUrl?: string | null;
  level: number;
  xp: number;
  streakDays: number;
}

interface LeaderboardWidgetProps {
  items: LeaderboardItem[];
  currentUserId?: string;
}

export const LeaderboardWidget: React.FC<LeaderboardWidgetProps> = ({ items, currentUserId }) => {
  return (
    <div className="glass-panel p-6 rounded-2xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          <h2 className="text-lg font-bold text-slate-900">Leaderboard Standings</h2>
        </div>
        <span className="text-xs font-semibold text-slate-400">Top Performers</span>
      </div>

      <div className="divide-y divide-slate-100">
        {items.map((item) => {
          const isCurrentUser = item.id === currentUserId;

          let rankBadge = (
            <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-center">
              #{item.rank}
            </span>
          );

          if (item.rank === 1) {
            rankBadge = (
              <span className="w-7 h-7 rounded-lg bg-amber-500 text-white text-xs font-extrabold flex items-center justify-center shadow-sm">
                🥇
              </span>
            );
          } else if (item.rank === 2) {
            rankBadge = (
              <span className="w-7 h-7 rounded-lg bg-slate-300 text-slate-800 text-xs font-extrabold flex items-center justify-center shadow-sm">
                🥈
              </span>
            );
          } else if (item.rank === 3) {
            rankBadge = (
              <span className="w-7 h-7 rounded-lg bg-amber-700 text-white text-xs font-extrabold flex items-center justify-center shadow-sm">
                🥉
              </span>
            );
          }

          return (
            <div
              key={item.id}
              className={`py-3 px-3 rounded-xl flex items-center justify-between transition-colors ${
                isCurrentUser ? 'bg-emerald-50 border border-emerald-200' : 'hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                {rankBadge}
                <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold">
                  {item.name[0]}
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <span>{item.name}</span>
                    {isCurrentUser && (
                      <span className="bg-emerald-600 text-white text-[10px] px-1.5 py-0.2 rounded font-semibold">
                        You
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">Lvl {item.level}</div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-bold">
                <div className="flex items-center gap-1 text-amber-600">
                  <Flame className="w-3.5 h-3.5 fill-amber-500" />
                  <span>{item.streakDays}d</span>
                </div>
                <div className="flex items-center gap-1 text-emerald-700 font-extrabold min-w-[70px] justify-end">
                  <Award className="w-3.5 h-3.5" />
                  <span>{item.xp} XP</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
