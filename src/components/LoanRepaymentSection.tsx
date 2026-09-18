import React, { useState } from 'react';
import { 
  CreditCard, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  Clock, 
  RefreshCw, 
  ShieldCheck,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { LoanApplication, HederaNetworkStatus } from '../types';

interface LoanRepaymentSectionProps {
  loan: LoanApplication;
  networkStatus?: HederaNetworkStatus;
  onPayInstallment: () => Promise<void>;
  onSimulateDefault: () => void;
  onResetSimulatedDefault?: () => void;
  isSimulatedDefaultMode?: boolean;
}

export const LoanRepaymentSection: React.FC<LoanRepaymentSectionProps> = ({
  loan,
  networkStatus,
  onPayInstallment,
  onSimulateDefault,
  onResetSimulatedDefault,
  isSimulatedDefaultMode = false
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isLive = networkStatus?.isLive ?? false;

  const handlePayClick = async () => {
    setIsSubmitting(true);
    try {
      await onPayInstallment();
    } finally {
      setIsSubmitting(false);
    }
  };

  const isRepaid = loan.installmentsPaid >= loan.installmentCount || loan.status === 'REPAID';
  const progressPercent = Math.min(100, Math.round((loan.installmentsPaid / loan.installmentCount) * 100));

  return (
    <div className="rounded-2xl bg-white border border-slate-200/90 p-6 sm:p-7 space-y-6 shadow-sm">
      
      {/* Header & Currency Settlement Disclaimer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <CreditCard className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              On-Chain Lending & Installment Lifecycle
            </h3>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
              isRepaid 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : isSimulatedDefaultMode 
                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                : 'bg-blue-50 text-blue-700 border border-blue-200'
            }`}>
              {isRepaid ? 'STATUS: REPAID' : isSimulatedDefaultMode ? 'STATUS: DEFAULTED (DEMO)' : 'STATUS: ACTIVE'}
            </span>
          </div>

          <p className="text-xs text-slate-500 mt-1.5 pl-10.5">
            <strong className="text-slate-800">1,000 TND financing facility</strong> • <span className="text-emerald-700 font-medium">Testnet settlement executed in HBAR equivalent demonstration funds</span>
          </p>
        </div>

        {/* Account Architecture Indicator */}
        {networkStatus?.isTwoPartyMode ? (
          <span className="px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 self-start sm:self-auto shadow-xs">
            TWO-PARTY (Lender: {networkStatus.lenderIdMasked} ➔ Borrower: {networkStatus.borrowerIdMasked})
          </span>
        ) : (
          networkStatus?.isDemoAccountMode && (
            <span className="px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-amber-50 text-amber-800 border border-amber-200 self-start sm:self-auto shadow-xs">
              SINGLE ACCOUNT MODE (Operator acting as both parties)
            </span>
          )
        )}
      </div>

      {/* Repayment Progress Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        
        <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80">
          <div className="text-[11px] font-medium text-slate-500">Total Facility</div>
          <div className="text-base font-bold text-slate-900 font-mono mt-0.5">1,000 TND</div>
          <div className="text-[10px] text-slate-500 font-mono">~{loan.principalHbar} Testnet HBAR</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80">
          <div className="text-[11px] font-medium text-slate-500">Total Installments</div>
          <div className="text-base font-bold text-slate-900 font-mono mt-0.5">{loan.installmentCount} parts</div>
          <div className="text-[10px] text-slate-500">30-day intervals</div>
        </div>

        <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/80">
          <div className="text-[11px] font-medium text-emerald-800">Paid to Date</div>
          <div className="text-base font-bold text-emerald-700 font-mono mt-0.5">
            {loan.installmentsPaid} / {loan.installmentCount}
          </div>
          <div className="text-[10px] text-emerald-600 font-mono font-medium">{progressPercent}% complete</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80">
          <div className="text-[11px] font-medium text-slate-500">Next Installment</div>
          <div className="text-base font-bold text-slate-900 font-mono mt-0.5">
            {isRepaid ? '0 TND' : '337 TND'}
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            {isRepaid ? 'Fully Settled' : `~${loan.installmentAmountHbar} Testnet HBAR`}
          </div>
        </div>

      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-medium text-slate-600">
          <span>Repayment Progress</span>
          <span className="font-mono text-slate-900 font-bold">{loan.installmentsPaid} of {loan.installmentCount} paid</span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-slate-100 border border-slate-200 overflow-hidden">
          <div 
            className="h-full bg-emerald-600 transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Interactive Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        
        {/* Left: Repayment Button */}
        <div>
          {!isRepaid && !isSimulatedDefaultMode ? (
            <button
              onClick={handlePayClick}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Processing Hedera Testnet Settlement...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Pay Next Installment ({loan.installmentAmountHbar} HBAR Testnet)</span>
                </>
              )}
            </button>
          ) : isRepaid ? (
            <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-4 py-2.5 rounded-xl border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>LOAN FULLY REPAID (3/3) • REPUTATION UPGRADED</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-xs font-semibold text-rose-800 bg-rose-50 px-4 py-2.5 rounded-xl border border-rose-200">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>DEMO DEFAULT STATE ACTIVE</span>
            </div>
          )}
        </div>

        {/* Right: Default Simulation Control */}
        <div className="flex items-center space-x-2">
          {isSimulatedDefaultMode ? (
            <button
              onClick={onResetSimulatedDefault}
              className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-300 transition-colors shadow-xs"
            >
              Exit Demo Scenario
            </button>
          ) : !isRepaid && (
            <button
              onClick={onSimulateDefault}
              className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold border border-rose-200 transition-colors flex items-center space-x-1.5 shadow-xs"
              title="Safe demonstration scenario showing how TrustLine handles default without breaking real state"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              <span>Simulate Default (Demo Scenario)</span>
            </button>
          )}
        </div>

      </div>

      {/* Simulated Default Explainer Alert */}
      {isSimulatedDefaultMode && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs space-y-2 animate-fade-in">
          <div className="flex items-center space-x-2 text-rose-800 font-bold">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>DEMO SCENARIO: Missed Repayment Default Policy</span>
          </div>
          <p className="text-rose-900/90 leading-relaxed">
            In an actual default, the lender executes <code className="text-rose-950 font-mono bg-white px-1.5 py-0.5 rounded border border-rose-200">markDefault(loanId, reason)</code> on the TrustLineVault smart contract. The failure event is timestamped to Hedera HCS Topic, incrementing Ahmed&apos;s defaults count from 0 to 1 and preventing uncollateralized loan issuance across the TrustLine network.
          </p>
        </div>
      )}

      {/* On-Chain Repayment History Table */}
      {loan.repayments && loan.repayments.length > 0 && (
        <div className="pt-4 border-t border-slate-100 space-y-2.5">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Confirmed On-Chain Settlements ({loan.repayments.length})
          </div>
          <div className="space-y-2">
            {loan.repayments.map((rep, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 text-xs font-mono">
                <div className="flex items-center space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-slate-900 font-bold">Installment #{rep.installmentNumber}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-emerald-700 font-bold">{rep.amountHbar} HBAR (~{rep.amountTND} TND)</span>
                </div>

                <div className="flex items-center space-x-3 mt-1 sm:mt-0 text-slate-500">
                  <span className="truncate max-w-[180px]" title={rep.txHash}>Tx: {rep.txHash}</span>
                  <a
                    href={rep.explorerUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-700 hover:text-emerald-800 font-semibold hover:underline inline-flex items-center space-x-1 text-[11px]"
                  >
                    <span>HashScan</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

