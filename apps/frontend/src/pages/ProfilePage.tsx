import React from 'react';
import { useAuthStore } from '../store/authStore';
import { Mail, Shield, Award } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user } = useAuthStore();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">User Profile</h1>
        <p className="text-sm text-slate-500 font-medium">Your account identity, user role, and educational performance.</p>
      </div>

      <div className="glass-panel p-8 rounded-3xl space-y-6">
        <div className="flex items-center gap-6 pb-6 border-b border-slate-100">
          <div className="w-20 h-20 rounded-full bg-emerald-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-emerald-600/30">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{user?.firstName} {user?.lastName}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase">
                {user?.role}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <Mail className="w-4 h-4 text-slate-400" />
              <div>
                <div className="text-xs text-slate-400 font-semibold uppercase">Email Address</div>
                <div className="font-semibold text-slate-800">{user?.email}</div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {user?.role === 'STUDENT' && (
              <div className="flex items-center gap-3 text-sm">
                <Award className="w-4 h-4 text-slate-400" />
                <div>
                  <div className="text-xs text-slate-400 font-semibold uppercase">Gamification Stats</div>
                  <div className="font-semibold text-slate-800">
                    Lvl {user.level} • {user.xp} XP • {user.streakDays} Day Streak
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
