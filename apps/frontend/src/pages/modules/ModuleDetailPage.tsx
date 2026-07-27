import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { BookOpen, HelpCircle, ArrowLeft, CheckCircle2, ChevronRight, PlayCircle, Image as ImageIcon } from 'lucide-react';

export const ModuleDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [moduleData, setModuleData] = useState<any>(null);
  const [activeLessonIndex, setActiveLessonIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    api.get(`/modules/${id}`)
      .then((res) => {
        setModuleData(res.data.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return <div className="text-center py-12 text-slate-400">Loading lesson content...</div>;
  }

  if (!moduleData) {
    return <div className="text-center py-12 text-rose-500 font-semibold">Module not found.</div>;
  }

  const activeLesson = moduleData.lessons?.[activeLessonIndex];
  const activeQuiz = moduleData.quizzes?.[0];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Back Button & Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/dashboard/modules')}
          className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Modules</span>
        </button>

        {activeQuiz && (
          <button
            onClick={() => navigate(`/dashboard/quizzes/${activeQuiz.id}`)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-md shadow-emerald-600/20"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Take Module Quiz ({activeQuiz.questions?.length || 0} Questions)</span>
          </button>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lesson Outline Sidebar */}
        <div className="space-y-4">
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded">
              {moduleData.category}
            </span>
            <h2 className="font-extrabold text-slate-900 text-xl">{moduleData.title}</h2>
            <p className="text-xs text-slate-500 leading-relaxed">{moduleData.description}</p>
          </div>

          <div className="glass-panel p-4 rounded-2xl space-y-2">
            <div className="px-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Lessons Outline ({moduleData.lessons?.length || 0})
            </div>
            {moduleData.lessons?.map((lesson: any, idx: number) => (
              <div
                key={lesson.id}
                onClick={() => setActiveLessonIndex(idx)}
                className={`p-3 rounded-xl cursor-pointer flex items-center justify-between transition-all ${
                  activeLessonIndex === idx
                    ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/20'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium'
                }`}
              >
                <div className="flex items-center gap-3 text-xs">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] ${
                    activeLessonIndex === idx ? 'bg-white text-emerald-700' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {idx + 1}
                  </div>
                  <span className="truncate max-w-[180px]">{lesson.title}</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </div>
            ))}
          </div>
        </div>

        {/* Active Lesson Content Viewer */}
        <div className="lg:col-span-2 space-y-6">
          {activeLesson ? (
            <div className="glass-panel p-8 rounded-3xl space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                  Lesson {activeLessonIndex + 1} of {moduleData.lessons.length}
                </span>
                <h1 className="text-2xl font-extrabold text-slate-900 mt-1">{activeLesson.title}</h1>
              </div>

              {/* Lesson Media Player (Video or Image) */}
              {activeLesson.videoUrl && (
                <div className="rounded-2xl overflow-hidden shadow-lg bg-black aspect-video">
                  <iframe
                    src={activeLesson.videoUrl}
                    title={activeLesson.title}
                    className="w-full h-full border-0"
                    allowFullScreen
                  />
                </div>
              )}

              {activeLesson.imageUrl && !activeLesson.videoUrl && (
                <div className="rounded-2xl overflow-hidden shadow-md max-h-72">
                  <img
                    src={activeLesson.imageUrl}
                    alt={activeLesson.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Lesson Content Markdown Text */}
              <div className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-700 whitespace-pre-line">
                {activeLesson.content}
              </div>

              {/* Lesson Footer Navigation */}
              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <button
                  disabled={activeLessonIndex === 0}
                  onClick={() => setActiveLessonIndex((prev) => prev - 1)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-30"
                >
                  Previous Lesson
                </button>

                {activeLessonIndex < moduleData.lessons.length - 1 ? (
                  <button
                    onClick={() => setActiveLessonIndex((prev) => prev + 1)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all"
                  >
                    Next Lesson →
                  </button>
                ) : (
                  activeQuiz && (
                    <button
                      onClick={() => navigate(`/dashboard/quizzes/${activeQuiz.id}`)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Complete & Take Quiz</span>
                    </button>
                  )
                )}
              </div>
            </div>
          ) : (
            <div className="glass-panel p-8 rounded-3xl text-center text-slate-400">
              Select a lesson from the outline to begin.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
