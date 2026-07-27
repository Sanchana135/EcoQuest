import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Leaf, ShieldCheck, UserCheck, GraduationCap, Shield } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch {
      // Handled by store error state
    }
  };

  const handleQuickDemoLogin = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('Password123!');
    try {
      await login(demoEmail, 'Password123!');
      navigate('/dashboard');
    } catch {
      // Handled by store error state
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center py-12 px-6 lg:px-8 relative overflow-hidden">
      {/* Background Glow Accents */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-600 shadow-xl shadow-emerald-600/30 mb-4">
          <Leaf className="w-9 h-9 text-white" />
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-white">EcoQuest</h2>
        <p className="mt-2 text-sm text-slate-400">
          Environmental Education Platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="bg-slate-800/90 backdrop-blur-xl py-8 px-6 shadow-2xl rounded-2xl border border-slate-700/80 sm:px-10">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm font-medium">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@ecoquest.edu"
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Quick Demo Selector */}
          <div className="mt-8 pt-6 border-t border-slate-700/80">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>Quick Demo Sign-In</span>
              <span className="text-[10px] text-emerald-400 font-normal">Pre-seeded Accounts</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('student@ecoquest.edu')}
                className="p-2.5 bg-slate-900/60 hover:bg-slate-700/80 border border-slate-700 rounded-xl text-left transition-all flex flex-col gap-1 group"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                  <GraduationCap className="w-4 h-4" />
                  <span>Student</span>
                </div>
                <div className="text-[10px] text-slate-400 truncate">student@ecoquest.edu</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('teacher@ecoquest.edu')}
                className="p-2.5 bg-slate-900/60 hover:bg-slate-700/80 border border-slate-700 rounded-xl text-left transition-all flex flex-col gap-1 group"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-sky-400">
                  <UserCheck className="w-4 h-4" />
                  <span>Teacher</span>
                </div>
                <div className="text-[10px] text-slate-400 truncate">teacher@ecoquest.edu</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('admin@ecoquest.edu')}
                className="p-2.5 bg-slate-900/60 hover:bg-slate-700/80 border border-slate-700 rounded-xl text-left transition-all flex flex-col gap-1 group"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-purple-400">
                  <Shield className="w-4 h-4" />
                  <span>Admin</span>
                </div>
                <div className="text-[10px] text-slate-400 truncate">admin@ecoquest.edu</div>
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-500 mt-6 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          Role-Based Access & JWT Authentication Enforced
        </p>
      </div>
    </div>
  );
};
