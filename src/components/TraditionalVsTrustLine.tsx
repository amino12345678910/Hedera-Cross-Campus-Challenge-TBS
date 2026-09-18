import React from 'react';
import { 
  Building2, 
  Database, 
  ArrowRight, 
  ShieldCheck, 
  FileCheck2, 
  Layers, 
  Sparkles,
  Lock,
  Globe2
} from 'lucide-react';

export const TraditionalVsTrustLine: React.FC = () => {
  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm relative overflow-hidden">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 uppercase tracking-wider">
          Paradigm Shift
        </span>
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
          Your financial reputation should belong to you.
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
          Traditional credit bureaus trap your history in closed silos. TrustLine replaces opaque gatekeepers with a portable, verifiable credential you own.
        </p>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl mx-auto">
        
        {/* Traditional Model */}
        <div className="p-5 sm:p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-slate-400" />
              Traditional Model
            </span>
            <span className="text-[10px] font-mono font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
              Siloed & Locked
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 text-center sm:text-left py-1">
            <div className="p-3 rounded-xl bg-white border border-slate-200 w-full sm:w-auto shadow-2xs">
              <div className="text-xs font-bold text-slate-800">Borrower</div>
              <div className="text-[10px] text-slate-400 mt-0.5">No portable proof</div>
            </div>

            <ArrowRight className="w-3.5 h-3.5 text-slate-400 hidden sm:block shrink-0" />

            <div className="p-3 rounded-xl bg-white border border-slate-200 w-full sm:w-auto shadow-2xs">
              <div className="text-xs font-bold text-slate-800 flex items-center justify-center sm:justify-start gap-1">
                <Database className="w-3.5 h-3.5 text-slate-400" />
                <span>Bank Database</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Opaque proprietary score</div>
            </div>

            <ArrowRight className="w-3.5 h-3.5 text-slate-400 hidden sm:block shrink-0" />

            <div className="p-3 rounded-xl bg-white border border-slate-200 w-full sm:w-auto shadow-2xs">
              <div className="text-xs font-bold text-slate-800 flex items-center justify-center sm:justify-start gap-1">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Single Decision</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Lost if you switch banks</div>
            </div>
          </div>

          <p className="text-[11px] text-slate-600 leading-relaxed pt-1">
            If you change banks or cross borders, your credit history vanishes. Students and freelancers with real payment discipline start from zero.
          </p>
        </div>

        {/* TrustLine Model */}
        <div className="p-5 sm:p-6 rounded-xl bg-emerald-50/40 border border-emerald-200 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-emerald-200/80">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              TrustLine Model
            </span>
            <span className="text-[10px] font-mono font-semibold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded border border-emerald-300">
              Portable & Verifiable
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 text-center sm:text-left py-1">
            <div className="p-3 rounded-xl bg-white border border-emerald-200/80 w-full sm:w-auto shadow-2xs">
              <div className="text-xs font-bold text-slate-900">Borrower</div>
              <div className="text-[10px] text-emerald-700 font-medium mt-0.5">Owns their data</div>
            </div>

            <ArrowRight className="w-3.5 h-3.5 text-emerald-600 hidden sm:block shrink-0" />

            <div className="p-3 rounded-xl bg-white border border-emerald-200/80 w-full sm:w-auto shadow-2xs">
              <div className="text-xs font-bold text-slate-900 flex items-center justify-center sm:justify-start gap-1">
                <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Portable Credential</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Verifiable claims</div>
            </div>

            <ArrowRight className="w-3.5 h-3.5 text-emerald-600 hidden sm:block shrink-0" />

            <div className="p-3 rounded-xl bg-white border border-emerald-200/80 w-full sm:w-auto shadow-2xs">
              <div className="text-xs font-bold text-slate-900 flex items-center justify-center sm:justify-start gap-1">
                <Globe2 className="w-3.5 h-3.5 text-blue-600" />
                <span>Any Lender Audits</span>
              </div>
              <div className="text-[10px] text-emerald-700 font-medium mt-0.5">Verified via HCS</div>
            </div>
          </div>

          <p className="text-[11px] text-slate-700 leading-relaxed pt-1">
            Ahmed carries his verified reputation anywhere. Any micro-lender, landlord, or employer can independently verify the cryptographic hash against Hedera without calling a credit bureau.
          </p>
        </div>

      </div>

    </div>
  );
};
