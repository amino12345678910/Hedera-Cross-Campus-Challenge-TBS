import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Info
} from 'lucide-react';
import { LoanApplication, HederaNetworkStatus } from '../types';
import { HederaService } from '../services/hederaService';

interface ApprovalSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  loan: LoanApplication;
  onViewPassport: () => void;
  networkStatus?: HederaNetworkStatus;
}

export const ApprovalSuccessModal: React.FC<ApprovalSuccessModalProps> = ({
  isOpen,
  onClose,
  loan,
  onViewPassport,
  networkStatus
}) => {
  useEffect(() => {
    if (isOpen) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#059669', '#10B981', '#3B82F6', '#9333EA']
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isLive = networkStatus?.isLive ?? false;
  const contractId = networkStatus?.contractId || loan.contractId || HederaService.SMART_CONTRACT_ID;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden">
        
        {/* Subtle Accent Line */}
        <div className="h-1.5 w-full bg-emerald-600" />

        {/* Modal Content */}
        <div className="p-6 sm:p-8 space-y-6 text-center text-slate-700">
          
          {/* Big Check Icon */}
          <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-xs">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div>
            <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
              isLive 
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                : 'bg-purple-50 text-purple-800 border border-purple-200'
            }`}>
              {isLive ? 'Smart Contract Execution (Hedera Testnet)' : 'Smart Contract Execution (Demo Fallback)'}
            </span>
            <h3 className="text-2xl font-bold text-slate-900 mt-2 tracking-tight">
              Loan Approved & Facility Allocated
            </h3>
            <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
              1,000 TND undercollateralized facility approved for {loan.borrowerName || 'Ahmed Ben Ali'}.
            </p>
          </div>

          {/* Contract Notice */}
          <div className={`p-4 rounded-xl text-xs text-left flex items-start space-x-2.5 ${
            isLive 
              ? 'bg-emerald-50/80 border border-emerald-200 text-emerald-950' 
              : 'bg-purple-50/80 border border-purple-200 text-purple-950'
          }`}>
            <Info className={`w-4 h-4 shrink-0 mt-0.5 ${isLive ? 'text-emerald-700' : 'text-purple-700'}`} />
            <div className="leading-relaxed">
              <span className="font-bold">
                {isLive ? 'Hedera Testnet Execution:' : 'Protocol Demonstration:'}
              </span>{' '}
              {isLive 
                ? `Loan agreement created and funded on the TrustLineVault contract (${contractId}) using Hedera Smart Contract Service (HSCS).`
                : 'In this fallback mode, loan disbursement is simulated for demonstration without modifying live testnet state.'}
            </div>
          </div>

          {/* Hedera Smart Contract Service Execution Details */}
          <div className="rounded-xl bg-slate-50/80 border border-slate-200 p-4 text-left space-y-2.5 text-xs font-mono">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-slate-600 text-[11px] font-sans font-bold">
                Hedera Smart Contract Service (HSCS)
              </span>
              <span className={`text-[10px] font-bold ${isLive ? 'text-emerald-700' : 'text-purple-700'}`}>
                {isLive ? 'MODE: LIVE TESTNET EXECUTION' : 'MODE: SIMULATED DEMO FALLBACK'}
              </span>
            </div>

            <div className="flex items-center justify-between text-slate-600">
              <span>Target Contract:</span>
              <span className="text-slate-900 font-bold">{contractId}</span>
            </div>

            <div className="flex items-center justify-between text-slate-600">
              <span>Facility Amount:</span>
              <span className="text-emerald-700 font-bold">{loan.amount.toLocaleString()} TND (~{loan.principalHbar || 5} HBAR)</span>
            </div>

            <div className="flex items-center justify-between text-slate-600">
              <span>Borrower Account:</span>
              <span className="text-slate-900 font-medium">{networkStatus?.borrowerIdMasked || '0.0.10581166'} ({loan.borrowerName || 'Ahmed Ben Ali'})</span>
            </div>

            <div className="flex items-center justify-between text-slate-600">
              <span>{isLive ? 'Hedera Tx ID:' : 'Simulated EVM Tx:'}</span>
              <span className="text-blue-700 font-semibold truncate max-w-[200px]">
                {loan.contractTxHash || (isLive ? '0.0.10572773@consensus' : '0x8f7a9c1e3b5d2f4a6b8c...')}
              </span>
            </div>

            <div className="flex items-center justify-between text-slate-600">
              <span>Consensus Finality:</span>
              <span className="text-slate-900 font-bold">&lt; 2.1 seconds</span>
            </div>
          </div>

          {/* Reputation Passport Update Highlight */}
          <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs text-left flex items-start space-x-3">
            <Sparkles className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div className="text-emerald-950 leading-relaxed">
              <span className="font-bold text-emerald-900">Reputation Loop Activated:</span>{' '}
              As Ahmed repays the 3 monthly installments (~333 TND/mo), each settlement is anchored to Hedera HCS to increase his borrowing capacity for future tranches.
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onViewPassport}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors flex items-center justify-center space-x-2 shadow-xs"
            >
              <span>View Updated Credit Passport</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors border border-slate-300 shadow-xs"
            >
              Close
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

