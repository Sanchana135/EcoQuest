import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { api } from '../../services/api';
import { Users, GraduationCap, BookOpen, CheckCircle, PlusCircle, ArrowUpRight } from 'lucide-react';

export const TeacherDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [classes, setClasses] = useState<any[]>([]);

  useEffect(() => {
    api.get('/classes')
      .then((res) => setClasses(res.data.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10">
          <span className="bg-sky-500/20 text-sky-300 text-xs font-semibold px-3 py-1 rounded-full border border-sky-400/30">
            Faculty & Educator Hub
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight mt-3 mb-2">
            Welcome, Educator {user?.lastName}! 🎓
          </h1>
          <p className="text-slate-400 text-sm">
            Manage your classroom rosters, assign environmental learning modules, and track student completion rates.
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">{classes.length || 1} Classes</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Classroom Sections</div>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">28 Students</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Enrolled Pupils</div>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">84% Avg Score</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Quiz Performance</div>
          </div>
        </div>
      </div>

      {/* Classroom List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">My Assigned Classes</h2>
          <button className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-emerald-600/20">
            <PlusCircle className="w-4 h-4" />
            <span>Create Class</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {classes.map((cls) => (
            <div key={cls.id} className="glass-panel p-6 rounded-2xl border border-slate-200 hover:border-emerald-500 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2 py-0.5 rounded">
                    Code: {cls.code}
                  </span>
                  <h3 className="font-bold text-slate-900 text-lg mt-1">{cls.name}</h3>
                  <p className="text-xs text-slate-500">{cls.gradeLevel}</p>
                </div>
                <ArrowUpRight className="w-5 h-5 text-slate-400" />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span>Roster: {cls._count?.enrollments || 1} Enrolled</span>
                <span className="text-emerald-600 font-semibold cursor-pointer hover:underline">
                  Manage Roster & Assignments →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
