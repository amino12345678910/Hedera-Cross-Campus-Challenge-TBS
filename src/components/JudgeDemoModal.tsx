import React, { useState } from 'react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Play, 
  ShieldCheck, 
  RotateCcw
} from 'lucide-react';

interface JudgeDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: 'landing' | 'passport' | 'verifier' | 'lender') => void;
  onOpenCredentialModal: () => void;
  onOpenLoanModal: () => void;
}

interface DemoStep {
  step: number;
  phase: string;
  cue: string;
  detail: string;
  tabTarget?: 'landing' | 'passport' | 'verifier' | 'lender';
  actionLabel: string;
  actionType: 'NAV_LANDING' | 'NAV_PASSPORT' | 'OPEN_CREDENTIAL' | 'NAV_VERIFIER' | 'OPEN_LOAN' | 'NAV_LENDER';
}

const STEPS: DemoStep[] = [
  {
    step: 1,
    phase: 'The Problem',
    cue: 'Ahmed has limited conventional credit history.',
    detail: 'Traditional banks reject young professionals because credit bureaus operate in closed silos.',
    tabTarget: 'landing',
    actionLabel: 'View Overview & Problem',
    actionType: 'NAV_LANDING'
  },
  {
    step: 2,
    phase: 'Evidence Layer',
    cue: '14 verified financial events anchored to Hedera.',
    detail: '11 completed obligations, 10 on-time settlements, 0 defaults, and 3 verified income streams.',
    tabTarget: 'passport',
    actionLabel: 'Inspect Ahmed\'s Credit Passport',
    actionType: 'NAV_PASSPORT'
  },
  {
    step: 3,
    phase: 'Portable Credential',
    cue: 'Portable proof of financial reliability (W3C spirit).',
    detail: 'Canonical claims hashed with deterministic SHA-256 and anchored to HCS Topic.',
    actionLabel: 'Open Credential Dossier & QR',
    actionType: 'OPEN_CREDENTIAL'
  },
  {
    step: 4,
    phase: 'Trust & Tamper Proof',
    cue: 'Tamper one field → verification immediately fails.',
    detail: 'Simulate altering defaults (0 → 3); the cryptographic hash mismatch proves why Hedera consensus matters.',
    tabTarget: 'verifier',
    actionLabel: 'Open Independent Verifier',
    actionType: 'NAV_VERIFIER'
  },
  {
    step: 5,
    phase: 'Financing Request',
    cue: '1,000 TND financing request with AI Evidence Copilot.',
    detail: 'Transparent AI explains policy compliance using observable evidence without opaque black-box scoring.',
    actionLabel: 'Open 1,000 TND Financing Form',
    actionType: 'OPEN_LOAN'
  },
  {
    step: 6,
    phase: 'On-Chain Execution',
    cue: 'Loan created & funded on Hedera Testnet smart contract.',
    detail: 'TrustLineVault.sol locks the agreement and transfers testnet HBAR demonstration funds.',
    tabTarget: 'lender',
    actionLabel: 'Go to Lender Review Terminal',
    actionType: 'NAV_LENDER'
  },
  {
    step: 7,
    phase: 'Real Repayment',
    cue: 'Real Testnet transaction routes installment to lender.',
    detail: 'Installment #1 settled on-chain; Hedera transaction receipt confirms monotonic execution.',
    tabTarget: 'lender',
    actionLabel: 'View Repayment Section',
    actionType: 'NAV_LENDER'
  },
  {
    step: 8,
    phase: 'Reputation Loop',
    cue: 'Longitudinal Credential v1.0 → v2.0 anchored to Hedera.',
    detail: 'New financial event is recorded, completed obligations increment to 12, and a new hash is anchored.',
    tabTarget: 'passport',
    actionLabel: 'Inspect Updated Credential v2.0',
    actionType: 'NAV_PASSPORT'
  }
];

export const JudgeDemoModal: React.FC<JudgeDemoModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  onOpenCredentialModal,
  onOpenLoanModal
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (!isOpen) return null;

  const current = STEPS[currentStepIndex];

  const handleExecuteAction = () => {
    switch (current.actionType) {
      case 'NAV_LANDING':
        onNavigateTab('landing');
        break;
      case 'NAV_PASSPORT':
        onNavigateTab('passport');
        break;
      case 'OPEN_CREDENTIAL':
        onOpenCredentialModal();
        break;
      case 'NAV_VERIFIER':
        onNavigateTab('verifier');
        break;
      case 'OPEN_LOAN':
        onOpenLoanModal();
        break;
      case 'NAV_LENDER':
        onNavigateTab('lender');
        break;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shadow-xs">
              <Play className="w-4 h-4 fill-emerald-600 text-emerald-600" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-bold text-slate-900">Judge Demo Mode</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  90-Second Walkthrough
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">Step {current.step} of 8: {current.phase}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-400 hover:text-slate-700 border border-slate-200 transition-colors shadow-xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 text-slate-700">
          
          {/* Progress Indicator */}
          <div className="flex items-center justify-between gap-1.5">
            {STEPS.map((s, idx) => (
              <button
                key={s.step}
                onClick={() => setCurrentStepIndex(idx)}
                className={`h-1.5 flex-1 rounded-full transition-all ${
                  idx === currentStepIndex
                    ? 'bg-emerald-600'
                    : idx < currentStepIndex
                    ? 'bg-emerald-200'
                    : 'bg-slate-100'
                }`}
                title={`Step ${s.step}: ${s.phase}`}
              />
            ))}
          </div>

          {/* Presenter Cue Card */}
          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 space-y-2">
            <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-800">
              Presenter Cue:
            </span>
            <div className="text-sm font-bold text-slate-900 leading-snug">
              &ldquo;{current.cue}&rdquo;
            </div>
            <p className="text-xs text-slate-600 leading-relaxed pt-1">
              {current.detail}
            </p>
          </div>

          {/* Primary Action Button */}
          <button
            onClick={handleExecuteAction}
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center justify-center space-x-2 transition-colors shadow-xs"
          >
            <span>{current.actionLabel}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between p-4 border-t border-slate-100 bg-slate-50/50 text-xs">
          <button
            onClick={() => setCurrentStepIndex(prev => Math.max(0, prev - 1))}
            disabled={currentStepIndex === 0}
            className="px-3.5 py-1.5 rounded-xl bg-white text-slate-700 font-medium hover:bg-slate-100 disabled:opacity-40 flex items-center space-x-1 transition-colors border border-slate-200 shadow-xs"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <span className="text-slate-500 font-mono text-[11px] font-semibold">
            {currentStepIndex + 1} / 8
          </span>

          <button
            onClick={() => setCurrentStepIndex(prev => Math.min(STEPS.length - 1, prev + 1))}
            disabled={currentStepIndex === STEPS.length - 1}
            className="px-3.5 py-1.5 rounded-xl bg-white text-slate-700 font-medium hover:bg-slate-100 disabled:opacity-40 flex items-center space-x-1 transition-colors border border-slate-200 shadow-xs"
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};

