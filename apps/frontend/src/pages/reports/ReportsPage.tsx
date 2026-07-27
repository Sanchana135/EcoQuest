import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { api } from '../../services/api';
import {
  BarChart3,
  TrendingUp,
  Award,
  BookOpen,
  Users,
  CheckCircle,
  AlertTriangle,
  Printer,
  Sparkles,
  ShieldCheck,
  Leaf,
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const { user } = useAuthStore();
  const [reportData, setReportData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    let endpoint = '/reports/student';
    if (user?.role === 'TEACHER') endpoint = '/reports/teacher';
    else if (user?.role === 'ADMIN') endpoint = '/reports/admin';
    else if (user?.role === 'PARENT') endpoint = '/reports/parent';

    api.get(endpoint)
      .then((res) => setReportData(res.data.data))
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, [user]);

  const handleExportReport = () => {
    window.print();
  };

  if (isLoading) {
    return <div className="text-center py-12 text-slate-400 text-sm">Generating analytics & reports...</div>;
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <span className="bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-400/30">
              {user?.role} Analytics & Governance
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight mt-3 mb-2">
              Performance Reports & Analytics 📊
            </h1>
            <p className="text-slate-400 text-sm">
              Comprehensive analytics, student literacy metrics, and exportable reports.
            </p>
          </div>
          <button
            onClick={handleExportReport}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-3 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-emerald-600/30 print:hidden"
          >
            <Printer className="w-4 h-4" />
            <span>Export Report (PDF)</span>
          </button>
        </div>
      </div>

      {/* 1. TEACHER REPORT VIEW */}
      {user?.role === 'TEACHER' && reportData && (
        <div className="space-y-8">
          {/* Teacher KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-600 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-extrabold text-slate-900">{reportData.totalStudents} Students</div>
                <div className="text-xs font-semibold text-slate-500 uppercase">Enrolled Pupils</div>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-extrabold text-slate-900">{reportData.totalClasses} Sections</div>
                <div className="text-xs font-semibold text-slate-500 uppercase">Assigned Classes</div>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-extrabold text-slate-900">82% Class Avg</div>
                <div className="text-xs font-semibold text-slate-500 uppercase">Quiz Accuracy</div>
              </div>
            </div>
          </div>

          {/* Student Roster Performance Table */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Student Progress Roster</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-100 text-xs font-semibold uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-3 rounded-l-xl">Student Name</th>
                    <th className="px-4 py-3">Level / XP</th>
                    <th className="px-4 py-3">Quizzes Taken</th>
                    <th className="px-4 py-3">Average Score</th>
                    <th className="px-4 py-3 rounded-r-xl">Badges</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {reportData.students?.map((s: any) => (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-bold text-slate-900">{s.name}</td>
                      <td className="px-4 py-3 text-xs">Lvl {s.level} • {s.xp} XP</td>
                      <td className="px-4 py-3 text-xs">{s.attemptsCount} Attempts</td>
                      <td className="px-4 py-3 font-semibold text-emerald-700">{s.avgScore}%</td>
                      <td className="px-4 py-3 text-xs font-bold text-purple-600">{s.badgesUnlocked} Badges</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. ADMIN ANALYTICS VIEW */}
      {user?.role === 'ADMIN' && reportData?.platformStats && (
        <div className="space-y-8">
          {/* Admin Platform KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-extrabold text-slate-900">{reportData.platformStats.totalStudents}</div>
                <div className="text-xs font-semibold text-slate-500 uppercase">Total Students</div>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-600 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-extrabold text-slate-900">{reportData.platformStats.totalTeachers}</div>
                <div className="text-xs font-semibold text-slate-500 uppercase">Total Teachers</div>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-extrabold text-slate-900">{reportData.platformStats.totalQuizAttempts}</div>
                <div className="text-xs font-semibold text-slate-500 uppercase">Quiz Attempts</div>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-extrabold text-slate-900">{reportData.platformStats.avgPlatformScore}%</div>
                <div className="text-xs font-semibold text-slate-500 uppercase">Platform Accuracy</div>
              </div>
            </div>
          </div>

          {/* Environmental Impact Metrics */}
          {reportData.environmentalImpact && (
            <div className="glass-panel p-8 rounded-3xl bg-gradient-to-r from-emerald-900 to-teal-950 text-white space-y-6">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                <Leaf className="w-4 h-4" />
                <span>Calculated Environmental Impact</span>
              </div>
              <h2 className="text-2xl font-extrabold">Institutional Eco Footprint Reduction</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md">
                  <div className="text-3xl font-black text-emerald-300">{reportData.environmentalImpact.totalCo2SavedKg} kg</div>
                  <div className="text-xs text-emerald-100 font-semibold mt-1">CO₂ Emissions Offset</div>
                </div>
                <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md">
                  <div className="text-3xl font-black text-sky-300">{reportData.environmentalImpact.plasticBottlesSaved}</div>
                  <div className="text-xs text-sky-100 font-semibold mt-1">Single-Use Plastics Diverted</div>
                </div>
                <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md">
                  <div className="text-3xl font-black text-amber-300">{reportData.environmentalImpact.energyKwhSaved} kWh</div>
                  <div className="text-xs text-amber-100 font-semibold mt-1">Clean Energy Conserved</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. STUDENT & PARENT REPORT VIEW */}
      {(user?.role === 'STUDENT' || user?.role === 'PARENT') && reportData?.metrics && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-extrabold text-slate-900">{reportData.metrics.completedLessonsCount}</div>
                <div className="text-xs font-semibold text-slate-500 uppercase">Lessons Completed</div>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-extrabold text-slate-900">{reportData.metrics.totalBadgesUnlocked} Badges</div>
                <div className="text-xs font-semibold text-slate-500 uppercase">Achievements</div>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-extrabold text-slate-900">{reportData.metrics.avgScore}%</div>
                <div className="text-xs font-semibold text-slate-500 uppercase">Average Quiz Score</div>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-600 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-extrabold text-slate-900">{reportData.metrics.totalCertificatesEarned} Certs</div>
                <div className="text-xs font-semibold text-slate-500 uppercase">Credentials</div>
              </div>
            </div>
          </div>

          {/* AI Recommendation Summary */}
          {reportData.aiSummary && (
            <div className="glass-panel p-6 rounded-2xl space-y-4">
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                <Sparkles className="w-5 h-5" />
                <span>AI Recommendation Summary</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Based on score evaluation, weak categories identified: {reportData.aiSummary.weakCategories?.length > 0 ? reportData.aiSummary.weakCategories.join(', ') : 'None! Excellent mastery across all modules.'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
