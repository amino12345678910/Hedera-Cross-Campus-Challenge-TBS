import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  ArrowRight, 
  Cpu, 
  Lock, 
  Layers, 
  Info,
  Globe,
  ExternalLink,
  CreditCard
} from 'lucide-react';
import { 
  UserProfile, 
  FinancialEvent, 
  LoanApplication,
  HederaNetworkStatus
} from '../types';
import { HederaService } from '../services/hederaService';
import { LoanRepaymentSection } from './LoanRepaymentSection';

interface LenderReviewViewProps {
  profile: UserProfile;
  events: FinancialEvent[];
  loan: LoanApplication;
  networkStatus?: HederaNetworkStatus;
  onApproveLoan: () => Promise<void>;
  onPayInstallment: () => Promise<void>;
  onSimulateDefault: () => void;
  onResetSimulatedDefault: () => void;
  isSimulatedDefaultMode: boolean;
  onOpenEvidenceAudit: () => void;
  onOpenHederaTopic: () => void;
}

export const LenderReviewView: React.FC<LenderReviewViewProps> = ({
  profile,
  events,
  loan,
  networkStatus,
  onApproveLoan,
  onPayInstallment,
  onSimulateDefault,
  onResetSimulatedDefault,
  isSimulatedDefaultMode,
  onOpenEvidenceAudit,
  onOpenHederaTopic
}) => {
  const [isApproving, setIsApproving] = useState(false);

  const isLive = networkStatus?.isLive ?? false;
  const contractId = networkStatus?.contractId || loan.contractId || '0.0.681944';
  const topicId = networkStatus?.topicId || HederaService.DEFAULT_TOPIC_ID;
  const isApproved = loan.status === 'APPROVED' || loan.status === 'ACTIVE' || loan.status === 'REPAID';

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      await onApproveLoan();
    } finally {
      setIsApproving(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Terminal Header */}
      <div className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-2xs">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-slate-900">Lender Review Terminal</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                  Institutional Portal
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                TBS Community Micro-Credit Fund • Undercollateralized Decision & Settlement Terminal
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className={`px-3 py-1.5 rounded-xl border text-[11px] font-mono font-semibold flex items-center space-x-1.5 shadow-2xs ${
              isLive 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                : 'bg-amber-50 border-amber-200 text-amber-800'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-emerald-600 animate-pulse' : 'bg-amber-500'}`} />
              <span>Network: {isLive ? 'LIVE TESTNET' : 'DEMO MODE'}</span>
            </div>

            <button
              onClick={onOpenHederaTopic}
              className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-slate-900 flex items-center space-x-1.5 transition-colors shadow-2xs"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span className="font-mono font-semibold">Topic: {topicId}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Loan Dossier Card */}
      <div className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm">
        
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8 pb-8 border-b border-slate-100">
          
          {/* Left: Borrower Snapshot */}
          <div className="space-y-4 max-w-md">
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500">
              Borrower Dossier
            </span>

            <div className="flex items-center space-x-4">
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-100 shadow-sm"
              />
              <div>
                <h3 className="text-xl font-bold text-slate-900">{profile.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{profile.occupation} • {profile.location}</p>
                <div className="mt-1 flex items-center space-x-2 text-xs font-mono">
                  <span className="text-slate-500">Hedera:</span>
                  <span className="text-emerald-700 font-bold">{profile.hederaAccountId}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Financing Request Details */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 w-full lg:w-96 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Financing Request</span>
              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 font-mono text-[10px] font-bold">
                1,000 TND
              </span>
            </div>

            <div className="text-2xl font-black text-slate-900 font-mono">
              1,000 TND
            </div>
            <div className="text-[11px] text-emerald-700 font-mono font-semibold">
              TESTNET settlement: ~{loan.principalHbar} HBAR demonstration funds
            </div>

            <div className="space-y-1.5 text-xs text-slate-600 pt-3 border-t border-slate-200/80">
              <div className="flex justify-between">
                <span>Purpose:</span>
                <span className="text-slate-900 font-semibold">{loan.purpose}</span>
              </div>
              <div className="flex justify-between">
                <span>Term:</span>
                <span className="text-slate-900 font-semibold">{loan.termDays} days ({loan.installmentCount} installments)</span>
              </div>
              <div className="flex justify-between">
                <span>Monthly Installment:</span>
                <span className="text-slate-900 font-semibold">~{loan.monthlyRepayment} TND (~{loan.installmentAmountHbar} HBAR)</span>
              </div>
              <div className="flex justify-between">
                <span>Collateral:</span>
                <span className="text-emerald-700 font-bold">None (Evidence-Backed)</span>
              </div>
            </div>
          </div>

        </div>

        {/* 4 Crucial Observable Metrics */}
        <div className="mt-8">
          <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500">
            Observable Evidence Audit
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-3">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-xs text-slate-500 font-medium">Scheduled Obligations</div>
              <div className="text-2xl font-bold text-slate-900 font-mono mt-1">
                {profile.repaymentObligations}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Total scheduled debts</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-xs text-slate-500 font-medium">Completed</div>
              <div className="text-2xl font-bold text-emerald-700 font-mono mt-1">
                {profile.completedObligations}
              </div>
              <div className="text-[11px] text-emerald-700 font-medium mt-1">11 obligations fully settled</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-xs text-slate-500 font-medium">On-Time Settlements</div>
              <div className="text-2xl font-bold text-emerald-700 font-mono mt-1">
                {profile.onTimeObligations}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">90.9% on-time record</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-xs text-slate-500 font-medium">Defaults & Arrears</div>
              <div className="text-2xl font-bold text-emerald-700 font-mono mt-1">
                {profile.defaults}
              </div>
              <div className="text-[11px] text-emerald-700 font-medium mt-1">Zero uncollected losses</div>
            </div>
          </div>
        </div>

        {/* Transparent Policy Reasoner Box */}
        <div className="mt-6 p-5 rounded-2xl bg-purple-50/70 border border-purple-200">
          <div className="flex items-center space-x-2 text-xs font-bold text-purple-900 mb-2">
            <Cpu className="w-4 h-4 text-purple-700" />
            <span>Automated Evidence Policy Assessment</span>
          </div>
          <p className="text-xs sm:text-sm text-purple-950 leading-relaxed font-normal">
            &ldquo;TrustLine found 14 verified financial events. 11 repayment obligations were completed. 10 were completed on time. No defaults were detected. The requested repayment burden (~337 TND/mo) is supported by ~2,250 TND/mo verified freelance inflows and falls within the prototype&apos;s policy limits.&rdquo;
          </p>
        </div>

        {/* Action Buttons / Approval Controls */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={onOpenEvidenceAudit}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold border border-slate-200 flex items-center justify-center space-x-2 transition-all shadow-xs"
          >
            <Layers className="w-4 h-4 text-blue-600" />
            <span>Review Evidence (14 Events)</span>
          </button>

          {!isApproved ? (
            <button
              onClick={handleApprove}
              disabled={isApproving}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-md flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
            >
              {isApproving ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Executing Hedera Testnet Contract...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>{isLive ? 'Approve on Hedera Testnet' : 'Approve Loan (Demo Mode)'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          ) : (
            <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-4 py-2.5 rounded-xl border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>LOAN CONTRACT CREATED & FUNDED</span>
            </div>
          )}
        </div>

      </div>

      {/* Active Loan Confirmation Card */}
      {isApproved && (
        <div className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm relative overflow-hidden animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  LOAN ACTIVE ON HEDERA
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                Hedera Smart Contract Service (HSCS) • TrustLineVault.sol
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-emerald-700 font-semibold font-mono">
              <span className="flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Contract Created</span>
              </span>
              <span className="flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Loan Funded</span>
              </span>
              <span className="flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Transaction Confirmed</span>
              </span>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] text-slate-500 uppercase font-medium">Loan Identifier</div>
              <div className="text-sm font-semibold text-slate-900 mt-1">
                {loan.loanIdOnChain || `TL-2026-${loan.id.slice(-4)}`}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] text-slate-500 uppercase font-medium">Smart Contract</div>
              <div className="text-sm font-semibold text-emerald-700 mt-1 font-mono">
                {contractId}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] text-slate-500 uppercase font-medium">Disbursement Transaction</div>
              <div className="text-xs text-slate-700 truncate mt-1" title={loan.contractTxHash}>
                {loan.contractTxHash || '0.0.482910@1741953600.109281'}
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-xs text-slate-500">
              Autonomous micro-credit executed on Hedera Testnet EVM
            </span>

            <a
              href={`https://hashscan.io/testnet/contract/${contractId}`}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-emerald-700 hover:text-emerald-800 text-xs font-semibold flex items-center space-x-1.5 border border-slate-200 transition-colors shadow-2xs self-start sm:self-auto"
            >
              <span>View on HashScan</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}

      {/* 🌟 REPAYMENT & INSTALLMENT LIFECYCLE (Active when loan is approved) */}
      {isApproved && (
        <LoanRepaymentSection
          loan={loan}
          networkStatus={networkStatus}
          onPayInstallment={onPayInstallment}
          onSimulateDefault={onSimulateDefault}
          onResetSimulatedDefault={onResetSimulatedDefault}
          isSimulatedDefaultMode={isSimulatedDefaultMode}
        />
      )}

    </div>
  );
};
