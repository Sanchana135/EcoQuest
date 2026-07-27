import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { QuestionCard } from '../../components/quiz/QuestionCard';
import { BadgeUnlockedModal } from '../../components/gamification/BadgeUnlockedModal';
import { Clock, ArrowLeft, CheckCircle2, XCircle, Award, RotateCcw, Sparkles } from 'lucide-react';

export const QuizRunnerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Runner state: 'PREVIEW' | 'ATTEMPT' | 'RESULT'
  const [phase, setPhase] = useState<'PREVIEW' | 'ATTEMPT' | 'RESULT'>('PREVIEW');

  // Attempt State
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState<number>(300);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Result State
  const [result, setResult] = useState<any>(null);
  const [unlockedBadgesPopup, setUnlockedBadgesPopup] = useState<any[]>([]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsLoading(true);
    api.get(`/quizzes/${id}`)
      .then((res) => {
        const q = res.data.data;
        setQuiz(q);
        setTimeLeft(q.timeLimitSec || 300);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load quiz details');
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  // Timer logic for ATTEMPT phase
  useEffect(() => {
    if (phase === 'ATTEMPT') {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase]);

  const handleStartQuiz = () => {
    setAnswers({});
    setCurrentIndex(0);
    setTimeLeft(quiz?.timeLimitSec || 300);
    setPhase('ATTEMPT');
  };

  const handleSelectOption = (questionId: string, option: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const handleSubmitQuiz = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsSubmitting(true);

    const payloadAnswers = quiz.questions.map((q: any) => ({
      questionId: q.id,
      selectedOption: answers[q.id] || '',
    }));

    try {
      const res = await api.post(`/quizzes/${id}/submit`, { answers: payloadAnswers });
      const resData = res.data.data;
      setResult(resData);
      setPhase('RESULT');

      if (resData.newlyUnlockedBadges && resData.newlyUnlockedBadges.length > 0) {
        setUnlockedBadgesPopup(resData.newlyUnlockedBadges);
      }
    } catch (err: any) {
      console.error(err);
      setError('Failed to submit quiz attempt');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAutoSubmit = () => {
    handleSubmitQuiz();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return <div className="text-center py-12 text-slate-400">Loading quiz assessment...</div>;
  }

  if (error || !quiz) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-rose-600 font-semibold">{error || 'Quiz not found'}</p>
        <button
          onClick={() => navigate('/dashboard/quizzes')}
          className="text-xs font-bold text-emerald-600 underline"
        >
          Back to Quiz Directory
        </button>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentIndex];
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Achievement Unlock Popup */}
      {unlockedBadgesPopup.length > 0 && (
        <BadgeUnlockedModal
          badges={unlockedBadgesPopup}
          onClose={() => setUnlockedBadgesPopup([])}
        />
      )}

      {/* Top Header Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/dashboard/quizzes')}
          className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Quizzes</span>
        </button>

        {phase === 'ATTEMPT' && (
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full font-mono text-sm font-bold shadow-sm ${
            timeLeft < 60 ? 'bg-rose-500 text-white animate-pulse' : 'bg-slate-900 text-emerald-400'
          }`}>
            <Clock className="w-4 h-4" />
            <span>Time Remaining: {formatTime(timeLeft)}</span>
          </div>
        )}
      </div>

      {/* PHASE 1: PREVIEW / READY SCREEN */}
      {phase === 'PREVIEW' && (
        <div className="glass-panel p-8 rounded-3xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
              Environmental Assessment
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-1">{quiz.title}</h1>
            <p className="text-slate-500 text-sm mt-1">Module: {quiz.moduleTitle}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto pt-2">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="text-xl font-bold text-slate-900">{quiz.questions.length}</div>
              <div className="text-xs text-slate-500 font-semibold uppercase">Questions</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="text-xl font-bold text-slate-900">{Math.round(quiz.timeLimitSec / 60)} Mins</div>
              <div className="text-xs text-slate-500 font-semibold uppercase">Time Limit</div>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={handleStartQuiz}
              className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-600/30 transition-all"
            >
              Start Quiz Assessment
            </button>
          </div>
        </div>
      )}

      {/* PHASE 2: ATTEMPT SCREEN */}
      {phase === 'ATTEMPT' && (
        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-600 h-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / quiz.questions.length) * 100}%` }}
            />
          </div>

          {/* Active Question */}
          <QuestionCard
            questionIndex={currentIndex}
            totalQuestions={quiz.questions.length}
            question={currentQuestion}
            selectedOption={answers[currentQuestion.id] || ''}
            onSelectOption={(option) => handleSelectOption(currentQuestion.id, option)}
          />

          {/* Navigation & Controls */}
          <div className="flex items-center justify-between pt-2">
            <button
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((prev) => prev - 1)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-30"
            >
              Previous Question
            </button>

            <span className="text-xs font-semibold text-slate-400">
              Answered {answeredCount} of {quiz.questions.length}
            </span>

            {currentIndex < quiz.questions.length - 1 ? (
              <button
                onClick={() => setCurrentIndex((prev) => prev + 1)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all"
              >
                Next Question →
              </button>
            ) : (
              <button
                disabled={isSubmitting}
                onClick={handleSubmitQuiz}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20 disabled:opacity-50"
              >
                {isSubmitting ? 'Calculating Score...' : 'Submit Quiz'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* PHASE 3: RESULT SCREEN */}
      {phase === 'RESULT' && result && (
        <div className="space-y-8">
          {/* Summary Score Card */}
          <div className="glass-panel p-8 rounded-3xl text-center space-y-4">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto text-3xl font-extrabold shadow-lg ${
              result.passed
                ? 'bg-emerald-100 text-emerald-700 shadow-emerald-600/20'
                : 'bg-rose-100 text-rose-700 shadow-rose-600/20'
            }`}>
              {result.passed ? <CheckCircle2 className="w-10 h-10" /> : <XCircle className="w-10 h-10" />}
            </div>

            <div>
              <span className={`text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full ${
                result.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {result.passed ? 'Passed - Target Achieved' : 'Needs Review - Retake Recommended'}
              </span>
              <h1 className="text-3xl font-extrabold text-slate-900 mt-3">
                Score: {result.score} / {result.maxScore} ({result.percentage}%)
              </h1>
              <div className="flex items-center justify-center gap-3 text-xs text-emerald-700 font-bold mt-2">
                <span className="flex items-center gap-1 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  <Sparkles className="w-3.5 h-3.5" />
                  + {result.awardedXP || 0} XP Earned!
                </span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-center gap-4">
              <button
                onClick={handleStartQuiz}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retake Quiz</span>
              </button>
              <button
                onClick={() => navigate('/dashboard/quizzes')}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all"
              >
                Back to All Quizzes
              </button>
            </div>
          </div>

          {/* Question Breakdown with Explanations */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Detailed Answer Review</h2>
            {quiz.questions.map((q: any, idx: number) => {
              const breakdownItem = result.breakdown.find((b: any) => b.questionId === q.id);
              return (
                <QuestionCard
                  key={q.id}
                  questionIndex={idx}
                  totalQuestions={quiz.questions.length}
                  question={q}
                  selectedOption={breakdownItem?.selectedOption || ''}
                  onSelectOption={() => {}}
                  isReviewMode={true}
                  reviewResult={breakdownItem}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
