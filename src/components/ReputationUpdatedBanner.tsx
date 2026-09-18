import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  X, 
  ExternalLink, 
  CheckCircle2, 
  TrendingUp 
} from 'lucide-react';
import { TrustLineCredential } from '../types';

interface ReputationUpdatedBannerProps {
  previousHash: string;
  currentCredential: TrustLineCredential;
  onDismiss: () => void;
  onViewCredential: () => void;
}

export const ReputationUpdatedBanner: React.FC<ReputationUpdatedBannerProps> = ({
  previousHash,
  currentCredential,
  onDismiss,
  onViewCredential
}) => {
  return (
    <div className="rounded-2xl bg-emerald-50/80 border border-emerald-200 p-5 sm:p-6 shadow-sm relative overflow-hidden animate-fade-in text-slate-800">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center shrink-0 text-emerald-700 shadow-xs">
            <TrendingUp className="w-5 h-5" />
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                TrustLine Reputation Updated
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white text-emerald-800 border border-emerald-200 shadow-xs">
                CREDENTIAL v{currentCredential.version} ANCHORED
              </span>
            </div>
            <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
              Successful on-chain repayment was recorded on Hedera. Ahmed&apos;s verifiable claims have been longitudinally updated without overwriting historical consensus records.
            </p>
          </div>
        </div>

        <button
          onClick={onDismiss}
          className="p-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-400 hover:text-slate-700 border border-slate-200 transition-colors shadow-xs"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Cryptographic Hash Provenance Progression */}
      <div className="mt-4 p-3.5 rounded-xl bg-white border border-emerald-200/80 grid grid-cols-1 md:grid-cols-5 items-center gap-3 text-xs font-mono shadow-xs">
        <div className="md:col-span-2 space-y-1">
          <span className="text-[10px] text-slate-500 uppercase font-bold font-sans">Previous Credential Hash:</span>
          <div className="text-[11px] text-slate-600 truncate bg-slate-50 p-2 rounded-lg border border-slate-200" title={previousHash}>
            {previousHash}
          </div>
        </div>

        <div className="flex items-center justify-center text-emerald-700 font-bold">
          <ArrowRight className="w-4 h-4 hidden md:block" />
          <span className="md:hidden text-[10px] uppercase text-emerald-700">Upgraded to →</span>
        </div>

        <div className="md:col-span-2 space-y-1">
          <span className="text-[10px] text-emerald-800 uppercase font-bold font-sans">New Credential Hash (Anchored):</span>
          <div className="text-[11px] text-emerald-700 font-bold truncate bg-emerald-50/60 p-2 rounded-lg border border-emerald-200" title={currentCredential.credentialHash}>
            {currentCredential.credentialHash}
          </div>
        </div>
      </div>

      {/* Claims Delta & Actions */}
      <div className="mt-4 pt-3.5 border-t border-emerald-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-4 text-slate-600">
          <div className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Completed Obligations: <strong className="text-slate-900 font-mono font-bold">{currentCredential.claims.completedObligations}</strong></span>
          </div>
          <div className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>On-Time: <strong className="text-emerald-700 font-mono font-bold">{currentCredential.claims.onTimeObligations}</strong></span>
          </div>
          <div className="flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
            <span>HCS Topic: <strong className="text-slate-900 font-mono font-bold">{currentCredential.hederaAnchor.topicId}</strong></span>
          </div>
        </div>

        <button
          onClick={onViewCredential}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors self-start sm:self-auto shadow-xs"
        >
          View Credential v{currentCredential.version}
        </button>
      </div>

    </div>
  );
};

