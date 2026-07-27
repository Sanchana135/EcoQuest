import React from 'react';
import { CheckCircle2, XCircle, HelpCircle } from 'lucide-react';

interface QuestionCardProps {
  questionIndex: number;
  totalQuestions: number;
  question: {
    id: string;
    text: string;
    type: string;
    options: string[];
    points: number;
  };
  selectedOption: string;
  onSelectOption: (option: string) => void;
  isReviewMode?: boolean;
  reviewResult?: {
    selectedOption: string;
    correctOption: string;
    isCorrect: boolean;
    explanation?: string | null;
  };
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  questionIndex,
  totalQuestions,
  question,
  selectedOption,
  onSelectOption,
  isReviewMode = false,
  reviewResult,
}) => {
  return (
    <div className="glass-panel p-6 rounded-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
          Question {questionIndex + 1} of {totalQuestions}
        </span>
        <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
          {question.points} Points
        </span>
      </div>

      {/* Question Text */}
      <h3 className="text-lg font-bold text-slate-900 leading-snug">
        {question.text}
      </h3>

      {/* Options List */}
      <div className="space-y-3">
        {question.options.map((option, idx) => {
          const letter = String.fromCharCode(65 + idx);
          const isSelected = selectedOption === option;

          let optionStyle = 'border-slate-200 bg-white hover:border-emerald-500 hover:bg-slate-50 text-slate-700';

          if (isReviewMode && reviewResult) {
            const isCorrectOption = option.trim().toLowerCase() === reviewResult.correctOption.trim().toLowerCase();
            const isUserSelected = option.trim().toLowerCase() === reviewResult.selectedOption.trim().toLowerCase();

            if (isCorrectOption) {
              optionStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
            } else if (isUserSelected && !reviewResult.isCorrect) {
              optionStyle = 'border-rose-500 bg-rose-50 text-rose-900 font-semibold';
            } else {
              optionStyle = 'border-slate-200 bg-slate-50 opacity-60 text-slate-500';
            }
          } else if (isSelected) {
            optionStyle = 'border-emerald-600 bg-emerald-50/80 text-emerald-950 font-bold ring-2 ring-emerald-500/20';
          }

          return (
            <button
              key={idx}
              disabled={isReviewMode}
              onClick={() => onSelectOption(option)}
              className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition-all ${optionStyle}`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-7 h-7 rounded-lg text-xs font-extrabold flex items-center justify-center border ${
                  isSelected || (isReviewMode && option.trim().toLowerCase() === reviewResult?.correctOption.trim().toLowerCase())
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : 'bg-slate-100 border-slate-200 text-slate-600'
                }`}>
                  {letter}
                </span>
                <span className="text-sm font-medium">{option}</span>
              </div>

              {isReviewMode && reviewResult && (
                <div>
                  {option.trim().toLowerCase() === reviewResult.correctOption.trim().toLowerCase() && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  )}
                  {option.trim().toLowerCase() === reviewResult.selectedOption.trim().toLowerCase() &&
                    !reviewResult.isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-600" />
                    )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation in Review Mode */}
      {isReviewMode && reviewResult?.explanation && (
        <div className="mt-4 p-4 rounded-xl bg-slate-100/80 border border-slate-200 text-xs text-slate-700 space-y-1">
          <div className="font-bold flex items-center gap-1.5 text-slate-900">
            <HelpCircle className="w-4 h-4 text-emerald-600" />
            <span>Explanation:</span>
          </div>
          <p className="leading-relaxed">{reviewResult.explanation}</p>
        </div>
      )}
    </div>
  );
};
