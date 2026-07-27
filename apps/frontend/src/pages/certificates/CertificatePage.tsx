import React, { useEffect, useState, useRef } from 'react';
import { api } from '../../services/api';
import { Award, Download, Printer, ShieldCheck, Sparkles, CheckCircle } from 'lucide-react';

export const CertificatePage: React.FC = () => {
  const [certificates, setCertificates] = useState<any[]>([]);
  const [selectedCert, setSelectedCert] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const certRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsLoading(true);
    api.get('/certificates/my-certificates')
      .then((res) => {
        const certs = res.data.data;
        setCertificates(certs);
        if (certs.length > 0) setSelectedCert(certs[0]);
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <span className="bg-amber-500/20 text-amber-300 text-xs font-semibold px-3 py-1 rounded-full border border-amber-400/30">
              Official Verification
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight mt-3 mb-2">
              Certificate Wallet 🎓
            </h1>
            <p className="text-slate-400 text-sm">
              Official certificates of achievement issued upon completing environmental learning modules.
            </p>
          </div>
          {selectedCert && (
            <button
              onClick={handlePrint}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-3 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-emerald-600/30 print:hidden"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-slate-400 text-sm">Loading certificate records...</div>
      ) : certificates.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
            <Award className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">No Certificates Earned Yet</h2>
          <p className="text-slate-500 text-xs max-w-md mx-auto">
            Complete and pass your first quiz assessment in any environmental learning module to automatically issue your official certificate!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Certificate Selector List */}
          <div className="space-y-3 print:hidden">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Issued Certificates ({certificates.length})
            </h2>
            {certificates.map((cert) => (
              <div
                key={cert.id}
                onClick={() => setSelectedCert(cert)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  selectedCert?.id === cert.id
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 border-emerald-600 font-bold'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-emerald-500'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Award className="w-6 h-6 shrink-0" />
                  <div>
                    <div className="text-sm line-clamp-1">{cert.title}</div>
                    <div className={`text-[10px] ${selectedCert?.id === cert.id ? 'text-emerald-100' : 'text-slate-400'}`}>
                      Code: {cert.code}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Printable Official Certificate View */}
          {selectedCert && (
            <div className="lg:col-span-2">
              <div
                ref={certRef}
                className="bg-white border-8 border-amber-600/80 p-10 rounded-3xl shadow-2xl relative space-y-6 text-center print:border-4 print:shadow-none"
              >
                {/* Gold Seal Emblem */}
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 text-white flex items-center justify-center mx-auto shadow-lg shadow-amber-600/30">
                  <Sparkles className="w-10 h-10" />
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-amber-700">
                    Official EcoQuest Credential
                  </span>
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    {selectedCert.title}
                  </h2>
                </div>

                <p className="text-xs text-slate-500 italic">This is to certify that</p>

                <div className="text-2xl font-extrabold text-emerald-800 border-b border-slate-200 inline-block pb-1 px-8">
                  {selectedCert.user?.firstName || 'Student'} {selectedCert.user?.lastName || ''}
                </div>

                <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
                  has successfully demonstrated environmental literacy, completed interactive sustainability quests, and passed accredited assessment modules on the EcoQuest Platform.
                </p>

                <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                  <div className="text-left">
                    <span className="block font-bold text-slate-800">Verification Code:</span>
                    <span className="font-mono text-emerald-700 font-bold text-[11px]">{selectedCert.code}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Verified Academic Record</span>
                  </div>

                  <div className="text-right">
                    <span className="block font-bold text-slate-800">Issue Date:</span>
                    <span>{new Date(selectedCert.issuedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
