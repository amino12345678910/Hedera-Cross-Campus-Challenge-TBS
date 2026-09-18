import React from 'react';
import { 
  UserProfile, 
  ReliabilityMetrics,
  TrustLineCredential,
  HederaNetworkStatus
} from '../types';
import { ReliabilityProof } from './ReliabilityProof';
import { TrustLineCredentialCard } from './TrustLineCredentialCard';
import { TraditionalVsTrustLine } from './TraditionalVsTrustLine';
import { 
  ShieldCheck, 
  Briefcase, 
  MapPin, 
  Wallet,
  Sparkles,
  CreditCard,
  History,
  FileCheck,
  Clock,
  Ban,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface CreditPassportProps {
  profile: UserProfile;
  metrics: ReliabilityMetrics;
  credential: TrustLineCredential;
  networkStatus?: HederaNetworkStatus;
  onRequestLoan: () => void;
  onOpenVerifyModal: () => void;
  onViewCredential: () => void;
  onVerifyCredential: () => void;
  onDownloadCredential: () => void;
  activeLoanStatus: string;
}

export const CreditPassport: React.FC<CreditPassportProps> = ({
  profile,
  metrics,
  credential,
  networkStatus,
  onRequestLoan,
  onOpenVerifyModal,
  onViewCredential,
  onVerifyCredential,
  onDownloadCredential,
  activeLoanStatus
}) => {
  return (
    <div className="space-y-8">
      
      {/* Profile Dossier Header */}
      <div className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* User Info */}
          <div className="flex items-start sm:items-center space-x-4">
            <div className="relative">
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-slate-100 shadow-sm"
              />
              <div 
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-600 border-2 border-white flex items-center justify-center shadow-xs"
                title="Identity & DID Verified"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-white" strokeWidth={3} />
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  {profile.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Verified Passport
                </span>
              </div>
              <p className="text-sm text-slate-600 mt-1 flex items-center gap-2">
                <span className="font-medium text-slate-700">{profile.occupation}</span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center text-slate-500">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  {profile.location}
                </span>
              </p>
              
              <div className="flex flex-wrap items-center gap-2 mt-3 text-xs font-mono text-slate-600">
                <span className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200">
                  ID: <span className="text-slate-900 font-semibold">{profile.nationalIdMasked}</span>
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-1.5">
                  <Wallet className="w-3.5 h-3.5 text-emerald-600" />
                  Hedera: <span className="text-slate-900 font-semibold">{profile.hederaAccountId}</span>
                </span>
                <span className="hidden sm:inline-block px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-500 truncate max-w-xs" title={profile.portableDid}>
                  {profile.portableDid}
                </span>
              </div>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <button
              onClick={onOpenVerifyModal}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-semibold text-xs border border-slate-200 flex items-center justify-center space-x-2 transition-all shadow-xs"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Verify Evidence</span>
            </button>

            <button
              onClick={onRequestLoan}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-md flex items-center justify-center space-x-2 transition-all hover:translate-y-[-1px]"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Request 1,000 TND Financing</span>
            </button>
          </div>

        </div>

        {/* The Exact 8 Profile Metrics */}
        <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="text-[11px] font-medium text-slate-500 flex items-center space-x-1">
              <CreditCard className="w-3 h-3 text-amber-600" />
              <span>Credit History</span>
            </div>
            <div className="mt-1 text-sm font-bold text-amber-700">
              {profile.conventionalCreditHistory}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Traditional score</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="text-[11px] font-medium text-slate-500 flex items-center space-x-1">
              <History className="w-3 h-3 text-emerald-600" />
              <span>Verified History</span>
            </div>
            <div className="mt-1 text-sm font-bold text-slate-900">
              {profile.verifiedFinancialEvents} events
            </div>
            <div className="text-[10px] text-emerald-700 font-medium mt-0.5">HCS timestamped</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="text-[11px] font-medium text-slate-500 flex items-center space-x-1">
              <FileCheck className="w-3 h-3 text-blue-600" />
              <span>Obligations</span>
            </div>
            <div className="mt-1 text-sm font-bold text-slate-900">
              {profile.repaymentObligations}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Tracked debts</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="text-[11px] font-medium text-slate-500 flex items-center space-x-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>Completed</span>
            </div>
            <div className="mt-1 text-sm font-bold text-emerald-700">
              {profile.completedObligations}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">100% satisfied</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="text-[11px] font-medium text-slate-500 flex items-center space-x-1">
              <Clock className="w-3 h-3 text-emerald-600" />
              <span>On-Time</span>
            </div>
            <div className="mt-1 text-sm font-bold text-emerald-700">
              {profile.onTimeObligations}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Prompt settlements</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="text-[11px] font-medium text-slate-500 flex items-center space-x-1">
              <AlertCircle className="w-3 h-3 text-amber-600" />
              <span>Late</span>
            </div>
            <div className="mt-1 text-sm font-bold text-amber-700">
              {profile.lateObligations}
            </div>
            <div className="text-[10px] text-amber-700/80 mt-0.5">4 days late (cured)</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="text-[11px] font-medium text-slate-500 flex items-center space-x-1">
              <Ban className="w-3 h-3 text-emerald-600" />
              <span>Defaults</span>
            </div>
            <div className="mt-1 text-sm font-bold text-emerald-700">
              {profile.defaults}
            </div>
            <div className="text-[10px] text-emerald-700 font-medium mt-0.5">Zero write-offs</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="text-[11px] font-medium text-slate-500 flex items-center space-x-1">
              <Briefcase className="w-3 h-3 text-purple-600" />
              <span>Income Sources</span>
            </div>
            <div className="mt-1 text-sm font-bold text-purple-700">
              {profile.verifiedIncomeSources}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Independent streams</div>
          </div>

        </div>
      </div>

      {/* 1. CORE DIFFERENTIATOR: TrustLine Credential Card */}
      <TrustLineCredentialCard
        credential={credential}
        networkStatus={networkStatus}
        onViewCredential={onViewCredential}
        onVerifyCredential={onVerifyCredential}
        onDownloadCredential={onDownloadCredential}
      />

      {/* 2. Educational Shift: Traditional vs TrustLine */}
      <TraditionalVsTrustLine />

      {/* 3. Proof of Financial Reliability Component */}
      <ReliabilityProof 
        metrics={metrics} 
        onOpenVerifyModal={onOpenVerifyModal} 
      />

      {/* 4. Income Streams Breakdown */}
      <div className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-purple-600" />
              <span>Verified Inflow Sources ({profile.verifiedIncomeSources})</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Cashflows independently attested through bank wires and platform payouts.
            </p>
          </div>
          <span className="text-xs font-mono font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 self-start sm:self-auto">
            Avg Inflow: 2,250 TND / mo
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {profile.incomesList.map((inc, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{inc.source}</span>
                  <span className="text-[10px] text-slate-500 font-mono">Since {inc.verifiedSince}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">{inc.type}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-baseline justify-between">
                <span className="text-[11px] text-slate-500 font-medium">Monthly Volume</span>
                <span className="text-sm font-bold text-emerald-700 font-mono">~{inc.monthlyAvg} TND</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
