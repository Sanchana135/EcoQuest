import React from 'react';
import { TrendingUp, CheckCircle, AlertTriangle, Lightbulb } from 'lucide-react';

interface TopicItem {
  category: string;
  attemptsCount: number;
  avgScore: number;
  status: 'STRONG' | 'NEEDS_IMPROVEMENT';
}

interface PerformanceAnalysisProps {
  analysis: {
    totalQuizzes: number;
    passedQuizzes: number;
    passRate: number;
    avgPercentage: number;
    topicBreakdown: TopicItem[];
    suggestions: string[];
  };
}

export const PerformanceAnalysisWidget: React.FC<PerformanceAnalysisProps> = ({ analysis }) => {
  if (!analysis) return null;

  return (
    <div className="glass-panel p-6 rounded-2xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-600" />
          <h2 className="text-lg font-bold text-slate-900">Student Performance Analysis</h2>
        </div>
        <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2.5 py-1 rounded-full">
          Pass Rate: {analysis.passRate}%
        </span>
      </div>

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
          <div className="text-xl font-extrabold text-slate-900">{analysis.totalQuizzes}</div>
          <div className="text-[10px] text-slate-500 font-semibold uppercase">Total Quizzes</div>
        </div>
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
          <div className="text-xl font-extrabold text-emerald-600">{analysis.passedQuizzes}</div>
          <div className="text-[10px] text-slate-500 font-semibold uppercase">Passed</div>
        </div>
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
          <div className="text-xl font-extrabold text-purple-600">{analysis.avgPercentage}%</div>
          <div className="text-[10px] text-slate-500 font-semibold uppercase">Avg Score</div>
        </div>
      </div>

      {/* Category Strengths Breakdown */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Category Mastery Breakdown
        </h3>
        {analysis.topicBreakdown.length === 0 ? (
          <p className="text-xs text-slate-400">No quiz attempts recorded yet.</p>
        ) : (
          analysis.topicBreakdown.map((t) => (
            <div key={t.category} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-800">{t.category}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] ${
                  t.status === 'STRONG' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  {t.avgScore}% • {t.status === 'STRONG' ? 'Mastered' : 'Needs Focus'}
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    t.status === 'STRONG' ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${t.avgScore}%` }}
                />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Improvement Suggestions */}
      {analysis.suggestions && analysis.suggestions.length > 0 && (
        <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 text-xs text-emerald-950 space-y-2">
          <div className="font-bold flex items-center gap-1.5 text-emerald-900">
            <Lightbulb className="w-4 h-4 text-emerald-700" />
            <span>AI Improvement Suggestions</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-slate-700">
            {analysis.suggestions.map((s, idx) => (
              <li key={idx}>{s}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
