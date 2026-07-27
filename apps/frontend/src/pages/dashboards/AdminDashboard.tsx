import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { ShieldCheck, Users, BookOpen, HelpCircle, UserPlus } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    api.get('/users')
      .then((res) => setUsers(res.data.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="space-y-8">
      {/* Admin Banner */}
      <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-400/30 mb-3">
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Console</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-2">
              System Management & Overview
            </h1>
            <p className="text-slate-400 text-sm">
              Manage platform users, monitor curriculum access, and view system metrics.
            </p>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">{users.length || 3} Users</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Registered Accounts</div>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">2 Modules</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Curriculum Active</div>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">2 Quizzes</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Assessment Bank</div>
          </div>
        </div>
      </div>

      {/* User Directory Table */}
      <div className="glass-panel rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">User Directory</h2>
            <p className="text-xs text-slate-500">Registered students, teachers, and admins</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-100/80 text-xs font-semibold uppercase text-slate-500 tracking-wider">
              <tr>
                <th className="px-4 py-3 rounded-l-xl">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Level / Stats</th>
                <th className="px-4 py-3 rounded-r-xl">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3 font-semibold text-slate-900">
                    {u.firstName} {u.lastName}
                  </td>
                  <td className="px-4 py-3 text-slate-500">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className="bg-slate-100 text-slate-800 text-xs font-semibold px-2 py-0.5 rounded uppercase">
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600">
                    {u.role === 'STUDENT' ? `Lvl ${u.level} • ${u.xp} XP` : 'N/A'}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
