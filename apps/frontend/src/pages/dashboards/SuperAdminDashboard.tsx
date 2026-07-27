import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Building2, Activity, ShieldCheck, Plus, ExternalLink } from 'lucide-react';

export const SuperAdminDashboard: React.FC = () => {
  const [institutions, setInstitutions] = useState<any[]>([]);

  useEffect(() => {
    api.get('/institutions')
      .then((res) => setInstitutions(res.data.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="space-y-8">
      {/* Super Admin Top Banner */}
      <div className="bg-slate-950 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl border border-slate-800">
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <span className="bg-purple-500/20 text-purple-300 text-xs font-semibold px-3 py-1 rounded-full border border-purple-400/30">
              Platform Master Console
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight mt-3 mb-2">
              EcoQuest Ecosystem Oversight
            </h1>
            <p className="text-slate-400 text-sm">
              Global multi-tenant governance, subscription lifecycle, and system telemetry monitoring.
            </p>
          </div>
          <button className="bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-purple-600/30">
            <Plus className="w-4 h-4" />
            <span>Onboard New Tenant</span>
          </button>
        </div>
      </div>

      {/* Global KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">{institutions.length || 1} Tenants</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Institutions</div>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">99.98% Uptime</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">System Health</div>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-600 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">Isolation Active</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Security Engine Status</div>
          </div>
        </div>
      </div>

      {/* Tenants Table */}
      <div className="glass-panel rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Registered Institutions & Tenants</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-100/80 text-xs font-semibold uppercase text-slate-500 tracking-wider">
              <tr>
                <th className="px-4 py-3 rounded-l-xl">Institution Name</th>
                <th className="px-4 py-3">Slug / Subdomain</th>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">Users</th>
                <th className="px-4 py-3 rounded-r-xl">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {institutions.map((inst) => (
                <tr key={inst.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3 font-semibold text-slate-900">{inst.name}</td>
                  <td className="px-4 py-3 text-slate-500">{inst.slug}.ecoquest.app</td>
                  <td className="px-4 py-3">
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2 py-0.5 rounded">
                      {inst.subscriptionPlan}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs font-semibold text-slate-700">
                    {inst.activeStudentsCount} Users
                  </td>
                  <td className="px-4 py-3 text-xs text-purple-600 font-semibold cursor-pointer hover:underline flex items-center gap-1">
                    Manage Tenant <ExternalLink className="w-3.5 h-3.5" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
