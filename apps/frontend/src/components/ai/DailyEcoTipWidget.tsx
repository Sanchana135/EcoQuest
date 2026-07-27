import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Lightbulb, Sparkles, RefreshCw } from 'lucide-react';

export const DailyEcoTipWidget: React.FC = () => {
  const [tipData, setTipData] = useState<any>(null);
  const [showSuggestion, setShowSuggestion] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchTip = () => {
    setIsLoading(true);
    api.get('/ai/daily-tip')
      .then((res) => setTipData(res.data.data))
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchTip();
  }, []);

  if (isLoading) {
    return <div className="glass-panel p-6 rounded-2xl text-xs text-slate-400">Loading daily eco tip...</div>;
  }

  const activeTip = showSuggestion ? tipData?.suggestionTip : tipData?.dailyTip;

  if (!activeTip) return null;

  return (
    <div className="glass-panel p-6 rounded-2xl space-y-4 border-l-4 border-l-emerald-500 relative overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 block">
              {showSuggestion ? 'Eco Suggestion' : 'Daily Eco Tip'}
            </span>
            <h3 className="text-sm font-bold text-slate-900">{activeTip.category}</h3>
          </div>
        </div>

        <button
          onClick={() => setShowSuggestion(!showSuggestion)}
          title="Toggle Daily Tip / Suggestion"
          className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Switch Tip</span>
        </button>
      </div>

      <p className="text-sm font-semibold text-slate-800 leading-relaxed">
        "{activeTip.tipText}"
      </p>

      <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-xs text-slate-500">
        <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
        <span><strong className="text-slate-700">Impact:</strong> {activeTip.impactDescription}</span>
      </div>
    </div>
  );
};
