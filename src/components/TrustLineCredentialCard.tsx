import React from 'react';
import { 
  FileCheck2, 
  ShieldCheck, 
  ExternalLink, 
  Download, 
  QrCode, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  Hash,
  Share2
} from 'lucide-react';
import { TrustLineCredential, HederaNetworkStatus } from '../types';

interface TrustLineCredentialCardProps {
  credential: TrustLineCredential;
  networkStatus?: HederaNetworkStatus;
  onViewCredential: () => void;
  onVerifyCredential: () => void;
  onDownloadCredential: () => void;
}

export const TrustLineCredentialCard: React.FC<TrustLineCredentialCardProps> = ({
  credential,
  networkStatus,
  onViewCredential,
  onVerifyCredential,
  onDownloadCredential
}) => {
  const isLive = networkStatus?.isLive ?? false;

  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm relative overflow-hidden">
      
      {/* Subtle top border accent */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500" />

      {/* Card Top Ribbon */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shadow-xs">
            <FileCheck2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">TrustLine Credential</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-100 text-slate-700 border border-slate-200 uppercase tracking-wide">
                Portable Credential
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Portable, tamper-evident credential anchored to Hedera Consensus Service
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            <span>STATUS: {credential.status}</span>
          </span>
        </div>
      </div>

      {/* Main Credential Body Grid */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Left: Credential Metadata */}
        <div className="space-y-3.5 p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              Holder Identifier
            </span>
            <div className="text-sm font-bold text-slate-900 mt-0.5">{credential.holder}</div>
            <div className="text-[11px] font-mono text-slate-500 truncate">{credential.holderDid}</div>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              Credential Type
            </span>
            <div className="text-xs font-semibold text-emerald-700 mt-0.5">
              Proof of Financial Reliability
            </div>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              Issued By
            </span>
            <div className="text-xs font-semibold text-slate-800 mt-0.5">{credential.issuerName}</div>
            <div className="text-[10px] font-mono text-slate-500 truncate">{credential.issuer}</div>
          </div>

          <div className="pt-2 border-t border-slate-200">
            <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              Cryptographic Hash (SHA-256)
            </div>
            <div className="font-mono text-[11px] text-slate-700 truncate mt-0.5 bg-white p-2 rounded-lg border border-slate-200 font-semibold" title={credential.credentialHash}>
              {credential.credentialHash}
            </div>
          </div>
        </div>

        {/* Center: The Observable Evidence Claims Grid */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
          
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="text-[11px] text-slate-500 font-medium">Verified Events</div>
            <div className="text-xl font-bold text-slate-900 font-mono mt-1">
              {credential.claims.verifiedEvents}
            </div>
            <div className="text-[10px] text-emerald-700 font-medium mt-0.5">HCS timestamped</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="text-[11px] text-slate-500 font-medium">Completed Obligations</div>
            <div className="text-xl font-bold text-emerald-700 font-mono mt-1">
              {credential.claims.completedObligations}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Satisfied in full</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="text-[11px] text-slate-500 font-medium">On-Time Settlements</div>
            <div className="text-xl font-bold text-emerald-700 font-mono mt-1">
              {credential.claims.onTimeObligations}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">90.9% on-time record</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="text-[11px] text-slate-500 font-medium">Late Settlements</div>
            <div className="text-xl font-bold text-amber-700 font-mono mt-1">
              {credential.claims.lateObligations}
            </div>
            <div className="text-[10px] text-amber-700/80 mt-0.5">4 days late (cured)</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="text-[11px] text-slate-500 font-medium">Defaults & Arrears</div>
            <div className="text-xl font-bold text-emerald-700 font-mono mt-1">
              {credential.claims.defaults}
            </div>
            <div className="text-[10px] text-emerald-700 font-medium mt-0.5">Zero write-offs</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="text-[11px] text-slate-500 font-medium">Verified Income Sources</div>
            <div className="text-xl font-bold text-purple-700 font-mono mt-1">
              {credential.claims.verifiedIncomeSources}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">3 active clients</div>
          </div>

          {/* Hedera Anchor Status Strip */}
          <div className="col-span-2 sm:col-span-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-slate-700 font-medium">
                Hedera HCS Anchor: Topic <code className="text-emerald-800 font-mono font-semibold">{credential.hederaAnchor.topicId}</code> (Seq #{credential.hederaAnchor.sequenceNumber})
              </span>
            </div>
            <span className="text-[11px] font-mono font-semibold text-slate-600">
              {isLive ? 'LIVE HEDERA TESTNET' : 'DEMO MODE'}
            </span>
          </div>

        </div>

      </div>

      {/* Card Action Buttons */}
      <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-2 text-xs text-slate-600">
          <span className="font-semibold text-slate-800">Core Principle:</span>
          <span>&ldquo;TrustLine does not ask you to trust our AI. It lets you verify the evidence.&rdquo;</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onDownloadCredential}
            className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs border border-slate-200 flex items-center space-x-1.5 transition-all shadow-xs"
            title="Download portable credential as verifiable JSON file"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>

          <button
            onClick={onVerifyCredential}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs border border-slate-200 flex items-center space-x-1.5 transition-all shadow-xs"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Verify Credential</span>
          </button>

          <button
            onClick={onViewCredential}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-md flex items-center space-x-1.5 transition-all hover:translate-y-[-1px]"
          >
            <span>View Credential</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};
