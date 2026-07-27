import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { DailyEcoTipWidget } from '../../components/ai/DailyEcoTipWidget';
import { PerformanceAnalysisWidget } from '../../components/ai/PerformanceAnalysisWidget';
import { useNavigate } from 'react-router-dom';
import {
  Bot,
  Send,
  Sparkles,
  BookOpen,
  ChevronRight,
  HelpCircle,
  TrendingUp,
  Compass,
} from 'lucide-react';

interface ChatMessage {
  sender: 'USER' | 'AI';
  text: string;
  relatedTopics?: string[];
  learningTips?: string[];
}

export const AiAssistantPage: React.FC = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'AI',
      text: 'Hello! I am EcoBuddy, your AI Environmental Learning Assistant. Ask me anything about climate change, waste management, renewable energy, or quiz concepts!',
    },
  ]);
  const [isSending, setIsSending] = useState<boolean>(false);

  const [recommendations, setRecommendations] = useState<any>(null);
  const [performance, setPerformance] = useState<any>(null);

  useEffect(() => {
    Promise.all([
      api.get('/ai/recommendations'),
      api.get('/ai/performance-analysis'),
    ])
      .then(([rRes, pRes]) => {
        setRecommendations(rRes.data.data);
        setPerformance(pRes.data.data);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleSendPrompt = async (textToSend?: string) => {
    const queryPrompt = textToSend || prompt;
    if (!queryPrompt.trim() || isSending) return;

    const userMsg: ChatMessage = { sender: 'USER', text: queryPrompt };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setPrompt('');
    setIsSending(true);

    try {
      const res = await api.post('/ai/chat', { prompt: queryPrompt });
      const aiData = res.data.data;
      const aiMsg: ChatMessage = {
        sender: 'AI',
        text: aiData.response,
        relatedTopics: aiData.relatedTopics,
        learningTips: aiData.learningTips,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { sender: 'AI', text: 'Sorry, I ran into an error processing your query. Please try again.' },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const quickPrompts = [
    'Explain the greenhouse effect',
    'How do I reduce single-use plastic?',
    'How do solar panels work?',
    'Tips to improve my quiz scores',
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-900 to-emerald-800 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-emerald-700/60 backdrop-blur-md px-3 py-1 rounded-full text-emerald-200 text-xs font-semibold mb-3 border border-emerald-500/30">
            <Bot className="w-4 h-4" />
            <span>EcoBuddy AI Learning Engine</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">
            AI Environmental Assistant 🤖🌿
          </h1>
          <p className="text-emerald-100 text-sm">
            Ask questions, solve doubts, receive personalized study recommendations, and track your topic mastery.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Chat Assistant & Quick Prompts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Chat Container */}
          <div className="glass-panel rounded-3xl p-6 flex flex-col h-[520px] justify-between space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">EcoBuddy Assistant</h2>
                  <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                    Online & Ready
                  </span>
                </div>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === 'USER' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-lg p-4 rounded-2xl text-sm leading-relaxed ${
                      msg.sender === 'USER'
                        ? 'bg-emerald-600 text-white font-medium rounded-br-none shadow-md shadow-emerald-600/20'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm space-y-3'
                    }`}
                  >
                    <p>{msg.text}</p>

                    {/* Related Topics & Learning Tips Chips */}
                    {msg.sender === 'AI' && (msg.relatedTopics || msg.learningTips) && (
                      <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
                        {msg.relatedTopics && (
                          <div className="flex flex-wrap gap-1.5 items-center">
                            <span className="font-bold text-slate-500 text-[10px] uppercase">Related:</span>
                            {msg.relatedTopics.map((t, i) => (
                              <span key={i} className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md font-semibold text-[11px]">
                                #{t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isSending && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-bl-none text-xs text-slate-400 font-medium flex items-center gap-2">
                    <Bot className="w-4 h-4 text-emerald-600 animate-spin" />
                    <span>EcoBuddy is thinking...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Suggestions */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {quickPrompts.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendPrompt(q)}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-xs font-semibold whitespace-nowrap transition-colors"
                >
                  💡 {q}
                </button>
              ))}
            </div>

            {/* Prompt Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendPrompt();
              }}
              className="flex items-center gap-2 pt-2 border-t border-slate-100"
            >
              <input
                type="text"
                placeholder="Ask EcoBuddy an environmental question..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="submit"
                disabled={isSending || !prompt.trim()}
                className="p-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-md shadow-emerald-600/20 transition-all disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Smart Recommendation & Learning Path Section */}
          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-emerald-600" />
                <h2 className="text-lg font-bold text-slate-900">Personalized Learning Path</h2>
              </div>
              <span className="text-xs font-semibold text-slate-400">AI Tailored</span>
            </div>

            {recommendations?.learningPath && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendations.learningPath.map((rec: any) => (
                  <div
                    key={rec.moduleId}
                    onClick={() => navigate(`/dashboard/modules/${rec.moduleId}`)}
                    className="p-5 rounded-2xl border border-slate-200 hover:border-emerald-500 transition-all cursor-pointer bg-white flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase ${
                          rec.status === 'NEEDS_FOCUS'
                            ? 'bg-rose-100 text-rose-800'
                            : rec.status === 'MASTERED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-teal-100 text-teal-800'
                        }`}>
                          {rec.status.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">{rec.lessonCount} Lessons</span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-base mb-1">{rec.title}</h3>
                      <p className="text-xs text-slate-500 leading-relaxed mb-3">{rec.reason}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-emerald-700 font-bold">
                      <span>Start Learning</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Daily Tip Widget & Performance Analysis */}
        <div className="space-y-6">
          <DailyEcoTipWidget />
          {performance && <PerformanceAnalysisWidget analysis={performance} />}
        </div>
      </div>
    </div>
  );
};
