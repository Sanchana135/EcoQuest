import React from 'react';
import { Sparkles, CheckCircle, X } from 'lucide-react';

interface BadgeUnlockedModalProps {
  badges: Array<{
    id: string;
    name: string;
    description: string;
    iconUrl: string;
  }>;
  onClose: () => void;
}

export const BadgeUnlockedModal: React.FC<BadgeUnlockedModalProps> = ({ badges, onClose }) => {
  if (!badges || badges.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-emerald-500/50 text-white rounded-3xl p-8 max-w-md w-full text-center relative shadow-2xl shadow-emerald-500/20 space-y-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon */}
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
          <Sparkles className="w-8 h-8 animate-bounce" />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Achievement Unlocked!
          </span>
          <h2 className="text-2xl font-extrabold mt-1 text-white">Congratulations!</h2>
        </div>

        {/* Badge List */}
        <div className="space-y-4 max-h-60 overflow-y-auto pr-1">
          {badges.map((b) => (
            <div
              key={b.id || b.name}
              className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700/80 flex items-center gap-4 text-left"
            >
              <div className="text-4xl">{b.iconUrl || '🏆'}</div>
              <div>
                <h3 className="font-bold text-white text-base">{b.name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed mt-0.5">{b.description}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 transition-all text-sm"
        >
          Claim Achievement
        </button>
      </div>
    </div>
  );
};
