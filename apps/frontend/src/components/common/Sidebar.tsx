import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import {
  LayoutDashboard,
  BookOpen,
  HelpCircle,
  Users,
  Bot,
  BarChart3,
  Award,
  ShieldCheck,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user } = useAuthStore();

  const getNavLinks = () => {
    switch (user?.role) {
      case 'STUDENT':
        return [
          { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { to: '/dashboard/modules', label: 'Learning Modules', icon: BookOpen },
          { to: '/dashboard/quizzes', label: 'Quizzes', icon: HelpCircle },
          { to: '/dashboard/ai-assistant', label: 'AI Assistant', icon: Bot },
          { to: '/dashboard/reports', label: 'Reports & Progress', icon: BarChart3 },
          { to: '/dashboard/certificates', label: 'Certificates', icon: Award },
        ];
      case 'TEACHER':
        return [
          { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
          { to: '/dashboard/modules', label: 'Curriculum Modules', icon: BookOpen },
          { to: '/dashboard/quizzes', label: 'Question Bank & Quizzes', icon: HelpCircle },
          { to: '/dashboard/ai-assistant', label: 'AI Assistant', icon: Bot },
          { to: '/dashboard/reports', label: 'Class Analytics & Reports', icon: BarChart3 },
          { to: '/dashboard/certificates', label: 'Certificates Registry', icon: Award },
        ];
      case 'ADMIN':
        return [
          { to: '/dashboard', label: 'Admin Overview', icon: LayoutDashboard },
          { to: '/dashboard/modules', label: 'Manage Modules', icon: BookOpen },
          { to: '/dashboard/quizzes', label: 'Manage Quizzes', icon: HelpCircle },
          { to: '/dashboard/users', label: 'User Management', icon: Users },
          { to: '/dashboard/ai-assistant', label: 'AI Assistant', icon: Bot },
          { to: '/dashboard/reports', label: 'Platform Analytics', icon: BarChart3 },
          { to: '/dashboard/certificates', label: 'Issued Certificates', icon: Award },
        ];
      default:
        return [{ to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }];
    }
  };

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between">
      <div className="space-y-6">
        <div className="px-3 text-xs font-bold uppercase tracking-wider text-slate-500">
          Navigation
        </div>
        <nav className="space-y-1">
          {getNavLinks().map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                      : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/50">
        <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs mb-1">
          <ShieldCheck className="w-4 h-4" />
          <span>EcoQuest Platform</span>
        </div>
        <p className="text-[11px] text-slate-400">
          Analytics, Certificates & AI Learning Platform
        </p>
      </div>
    </aside>
  );
};
