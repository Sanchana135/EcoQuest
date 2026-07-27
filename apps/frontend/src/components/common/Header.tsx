import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { Leaf, Flame, Award, LogOut, User as UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { NotificationBell } from './NotificationBell';

export const Header: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Branding */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold shadow-sm shadow-emerald-600/30">
          <Leaf className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-bold text-slate-900 text-lg leading-tight">EcoQuest</h1>
          <p className="text-xs text-slate-500 font-medium">
            Environmental Education Platform
          </p>
        </div>
      </div>

      {/* Stats, Notifications & User Info */}
      <div className="flex items-center gap-6">
        {user?.role === 'STUDENT' && (
          <div className="flex items-center gap-4 bg-slate-100/80 px-3 py-1.5 rounded-full border border-slate-200 text-sm font-semibold">
            <div className="flex items-center gap-1.5 text-amber-600">
              <Flame className="w-4 h-4 fill-amber-500" />
              <span>{user.streakDays} Day Streak</span>
            </div>
            <div className="h-4 w-px bg-slate-300" />
            <div className="flex items-center gap-1.5 text-emerald-700">
              <Award className="w-4 h-4" />
              <span>{user.xp} XP</span>
            </div>
            <div className="h-4 w-px bg-slate-300" />
            <span className="bg-emerald-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
              Lvl {user.level}
            </span>
          </div>
        )}

        <div className="flex items-center gap-4 border-l border-slate-200 pl-6">
          <NotificationBell />

          <div className="text-right hidden sm:block">
            <div className="text-sm font-bold text-slate-900">
              {user?.firstName} {user?.lastName}
            </div>
            <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
              {user?.role}
            </div>
          </div>

          <div
            onClick={() => navigate('/dashboard/profile')}
            className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 cursor-pointer hover:ring-2 hover:ring-emerald-500 transition-all"
          >
            <UserIcon className="w-5 h-5" />
          </div>

          <button
            onClick={handleLogout}
            title="Sign Out"
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
