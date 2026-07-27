import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { HelpCircle, Clock, CheckCircle2, Play, Award } from 'lucide-react';

export const QuizListPage: React.FC = () => {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [myAttempts, setMyAttempts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    Promise.all([api.get('/quizzes'), api.get('/quizzes/my-attempts')])
      .then(([qRes, aRes]) => {
        setQuizzes(qRes.data.data);
        setMyAttempts(aRes.data.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  const getBestAttempt = (quizId: string) => {
    const attempts = myAttempts.filter((a) => a.quizId === quizId);
    if (attempts.length === 0) return null;
    return attempts.reduce((max, curr) => (curr.score > max.score ? curr : max), attempts[0]);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <span className="bg-sky-500/20 text-sky-300 text-xs font-semibold px-3 py-1 rounded-full border border-sky-400/30">
            Assessment Engine
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight mt-3 mb-2">
            Environmental Literacy Quizzes 📝
          </h1>
          <p className="text-slate-400 text-sm">
            Test your sustainability knowledge, review explanations, and earn module completion scores.
          </p>
        </div>
      </div>

      {/* Quizzes List */}
      {isLoading ? (
        <div className="text-center py-12 text-slate-400">Loading quizzes...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quizzes.map((quiz) => {
            const bestAttempt = getBestAttempt(quiz.id);
            return (
              <div
                key={quiz.id}
                className="glass-panel p-6 rounded-2xl border border-slate-200 hover:border-emerald-500 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded">
                      {quiz.category || 'Environmental Science'}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-slate-500 font-semibold">
                      <Clock className="w-3.5 h-3.5" />
                      {Math.round(quiz.timeLimitSec / 60)} Mins
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-lg mb-1">{quiz.title}</h3>
                  <p className="text-xs text-slate-500 mb-4">Module: {quiz.moduleTitle}</p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  {bestAttempt ? (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Best Score: {bestAttempt.score}/{bestAttempt.maxScore} ({bestAttempt.percentage}%)</span>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400 font-medium">Not attempted yet</span>
                  )}

                  <button
                    onClick={() => navigate(`/dashboard/quizzes/${quiz.id}`)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-emerald-600/20"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>{bestAttempt ? 'Retake Quiz' : 'Start Quiz'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
