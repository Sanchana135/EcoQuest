import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Layers, Search, ChevronRight, PlayCircle } from 'lucide-react';

export const ModuleListPage: React.FC = () => {
  const [modules, setModules] = useState<any[]>([]);
  const [category, setCategory] = useState<string>('ALL');
  const [search, setSearch] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    const query = category !== 'ALL' ? `?category=${encodeURIComponent(category)}` : '';
    api.get(`/modules${query}`)
      .then((res) => setModules(res.data.data))
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, [category]);

  const categories = ['ALL', 'Climate Change', 'Waste Management', 'Renewable Energy', 'Biodiversity'];

  const filteredModules = modules.filter((m) =>
    m.title.toLowerCase().includes(search.toLowerCase()) ||
    m.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <span className="bg-emerald-700/60 backdrop-blur-md px-3 py-1 rounded-full text-emerald-200 text-xs font-semibold border border-emerald-500/30">
            Curriculum & Quests
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight mt-3 mb-2">
            Environmental Learning Library 📚
          </h1>
          <p className="text-emerald-100 text-sm">
            Explore interactive lessons, video lectures, and real-world sustainability concepts.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Categories */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                category === cat
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search modules..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Module Grid */}
      {isLoading ? (
        <div className="text-center py-12 text-slate-400 text-sm">Loading learning modules...</div>
      ) : filteredModules.length === 0 ? (
        <div className="text-center py-12 glass-panel rounded-2xl text-slate-500">
          No learning modules found matching your query.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.map((mod) => (
            <div
              key={mod.id}
              onClick={() => navigate(`/dashboard/modules/${mod.id}`)}
              className="glass-panel rounded-2xl overflow-hidden hover:border-emerald-500 hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                {/* Module Image Thumbnail */}
                <div className="h-44 bg-slate-200 relative overflow-hidden">
                  <img
                    src={mod.imageUrl || 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&w=800&q=80'}
                    alt={mod.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-md">
                    {mod.category}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-bold text-slate-900 text-lg mb-2 group-hover:text-emerald-600 transition-colors">
                    {mod.title}
                  </h3>
                  <p className="text-slate-600 text-xs line-clamp-3 mb-4 leading-relaxed">
                    {mod.description}
                  </p>
                </div>
              </div>

              <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 font-semibold">
                <span className="flex items-center gap-1.5 text-emerald-700">
                  <BookOpen className="w-4 h-4" />
                  {mod._count?.lessons || 1} Lessons
                </span>
                <span className="flex items-center gap-1 text-emerald-600 group-hover:translate-x-1 transition-transform">
                  Start Learning <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
