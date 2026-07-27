import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { api } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { BadgeGallery } from '../../components/gamification/BadgeGallery';
import { LeaderboardWidget } from '../../components/gamification/LeaderboardWidget';
import {
  Flame,
  Award,
  BookOpen,
  Target,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  XCircle,
  History,
  TrendingUp,
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [gamification, setGamification] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [quizAttempts, setQuizAttempts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      api.get('/gamification/overview'),
      api.get('/modules'),
      api.get('/quizzes/my-attempts'),
    ])
      .then(([gRes, mRes, aRes]) => {
        setGamification(gRes.data.data);
        setModules(mRes.data.data);
        setQuizAttempts(aRes.data.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  const levelInfo = gamification?.levelInfo || {
    level: user?.level || 1,
    currentLevelXP: user?.xp || 0,
    nextLevelXP: 100,
    xpInCurrentLevel: 0,
    xpRequiredForNextLevel: 100,
    progressPercentage: 0,
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-emerald-900/20">
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-emerald-700/60 backdrop-blur-md px-3 py-1 rounded-full text-emerald-200 text-xs font-semibold mb-4 border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>EcoQuest Gamified Student Hub</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">
            Welcome back, {user?.firstName}! 🌿
          </h1>
          <p className="text-emerald-100 text-sm leading-relaxed">
            You are Level {levelInfo.level} with {gamification?.xp || user?.xp || 0} total XP (Rank #{gamification?.rank || 'Unranked'}). Keep your {gamification?.streakDays || user?.streakDays || 0}-day streak alive by completing a quest today!
          </p>
        </div>
      </div>

      {/* Gamification Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Streak Card */}
        <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
            <Flame className="w-6 h-6 fill-amber-500" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">
              {gamification?.streakDays || user?.streakDays || 0} Days
            </div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Daily Streak
            </div>
          </div>
        </div>

        {/* XP Card */}
        <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">
              {gamification?.xp || user?.xp || 0} XP
            </div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total XP Earned
            </div>
          </div>
        </div>

        {/* Level Card & Progress */}
        <div className="glass-panel p-6 rounded-2xl space-y-2 col-span-1 md:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase">Current Tier</span>
                <div className="text-lg font-extrabold text-slate-900">Level {levelInfo.level}</div>
              </div>
            </div>

            <div className="text-right text-xs font-bold text-slate-600">
              <span>{levelInfo.xpInCurrentLevel} / {levelInfo.xpRequiredForNextLevel} XP</span>
              <span className="text-slate-400 block text-[10px]">to Level {levelInfo.level + 1}</span>
            </div>
          </div>

          {/* Level Progress Bar */}
          <div className="space-y-1">
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-purple-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${levelInfo.progressPercentage}%` }}
              />
            </div>
            <div className="text-[10px] text-right text-slate-400 font-semibold">
              {levelInfo.progressPercentage}% Progress
            </div>
          </div>
        </div>
      </div>

      {/* Badges Collection Section */}
      {gamification?.badges && (
        <BadgeGallery badges={gamification.badges} />
      )}

      {/* Main Grid: Modules & Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Modules Section */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Enrolled Learning Modules</h2>
            <button
              onClick={() => navigate('/dashboard/modules')}
              className="text-xs font-semibold text-emerald-600 hover:underline flex items-center gap-1"
            >
              Browse All <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {isLoading ? (
            <div className="text-slate-400 text-xs py-6">Loading modules...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {modules.slice(0, 2).map((mod) => (
                <div
                  key={mod.id}
                  onClick={() => navigate(`/dashboard/modules/${mod.id}`)}
                  className="glass-panel p-6 rounded-2xl hover:border-emerald-500/50 transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-md">
                        {mod.category}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">{mod._count?.lessons || 1} Lessons</span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-lg mb-2 group-hover:text-emerald-600 transition-colors">
                      {mod.title}
                    </h3>
                    <p className="text-slate-600 text-xs mb-4 line-clamp-2 leading-relaxed">
                      {mod.description}
                    </p>
                  </div>
                  <div className="pt-2 flex items-center justify-between text-xs text-emerald-700 font-bold">
                    <span>Start Quest</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Leaderboard Widget */}
        <div>
          {gamification?.leaderboard && (
            <LeaderboardWidget
              items={gamification.leaderboard}
              currentUserId={user?.id}
            />
          )}
        </div>
      </div>

      {/* Quiz Attempt History Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-emerald-700" />
            <h2 className="text-xl font-bold text-slate-900">Quiz Assessment History</h2>
          </div>
          <button
            onClick={() => navigate('/dashboard/quizzes')}
            className="text-xs font-semibold text-emerald-600 hover:underline flex items-center gap-1"
          >
            Take More Quizzes <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {quizAttempts.length === 0 ? (
          <div className="glass-panel p-8 rounded-2xl text-center text-slate-500 text-sm">
            You haven't completed any quizzes yet. Take your first quiz to earn XP and unlock badges!
          </div>
        ) : (
          <div className="glass-panel rounded-2xl overflow-hidden border border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-100/80 text-xs font-semibold uppercase text-slate-500 tracking-wider">
                  <tr>
                    <th className="px-6 py-3.5">Quiz Assessment</th>
                    <th className="px-6 py-3.5">Score</th>
                    <th className="px-6 py-3.5">Percentage</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5">Completed Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {quizAttempts.map((attempt) => (
                    <tr key={attempt.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-900">
                        {attempt.quiz?.title || 'Environmental Quiz'}
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-800">
                        {attempt.score} / {attempt.maxScore} pts
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-800">
                        {attempt.percentage}%
                      </td>
                      <td className="px-6 py-4">
                        {attempt.passed ? (
                          <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Passed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 bg-rose-100 text-rose-800 text-xs font-bold px-3 py-1 rounded-full">
                            <XCircle className="w-3.5 h-3.5 text-rose-600" />
                            Needs Review
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-400">
                        {new Date(attempt.completedAt).toLocaleDateString()} at{' '}
                        {new Date(attempt.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
