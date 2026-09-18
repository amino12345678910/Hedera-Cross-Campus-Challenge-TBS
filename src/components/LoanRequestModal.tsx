import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  AlertCircle, 
  ArrowRight, 
  Cpu, 
  Layers, 
  Coins, 
  Calendar, 
  Briefcase, 
  FileCheck2, 
  Info
} from 'lucide-react';
import { 
  UserProfile, 
  FinancialEvent, 
  LoanApplication, 
  AIEvidenceExplanation 
} from '../types';
import { AIExplainerService } from '../services/aiExplainerService';

interface LoanRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  events: FinancialEvent[];
  loan: LoanApplication;
  onSubmitLoan: (loan: LoanApplication) => void;
  onProceedToLender: () => void;
}

export const LoanRequestModal: React.FC<LoanRequestModalProps> = ({
  isOpen,
  onClose,
  profile,
  events,
  loan,
  onSubmitLoan,
  onProceedToLender
}) => {
  const [stage, setStage] = useState<'FORM' | 'ANALYZING' | 'AI_EXPLAINED'>(
    loan.status === 'ANALYZED' || loan.status === 'LENDER_REVIEW' || loan.status === 'APPROVED'
      ? 'AI_EXPLAINED'
      : 'FORM'
  );

  const [amount, setAmount] = useState(loan.amount);
  const [purpose, setPurpose] = useState(loan.purpose);
  const [termDays, setTermDays] = useState(loan.termDays);
  const [analyzingStep, setAnalyzingStep] = useState(0);

  if (!isOpen) return null;

  const handleStartAnalysis = () => {
    setStage('ANALYZING');
    setAnalyzingStep(1);

    setTimeout(() => setAnalyzingStep(2), 400);
    setTimeout(() => setAnalyzingStep(3), 800);
    setTimeout(() => {
      const updatedLoan: LoanApplication = {
        ...loan,
        amount,
        purpose,
        termDays,
        monthlyRepayment: Math.round(amount / (termDays / 30)),
        status: 'ANALYZED',
        submittedAt: new Date().toISOString()
      };
      onSubmitLoan(updatedLoan);
      setStage('AI_EXPLAINED');
    }, 1300);
  };

  const aiExplanation: AIEvidenceExplanation = AIExplainerService.generateExplanation(
    profile,
    events,
    { ...loan, amount, purpose, termDays }
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden">
        
        {/* Modal Top Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">Request Undercollateralized Financing</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Transparent evidence analysis powered by Hedera verifiable history
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-400 hover:text-slate-700 border border-slate-200 transition-colors shadow-xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[78vh] overflow-y-auto">
          
          {/* STAGE 1: LOAN CONFIGURATION FORM */}
          {stage === 'FORM' && (
            <div className="space-y-5 text-slate-700">
              
              <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200 text-xs text-blue-950 flex items-start space-x-3">
                <Info className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  TrustLine enables zero-collateral financing for students and freelancers by letting institutional micro-lenders audit cryptographic evidence directly rather than relying on conventional credit score agencies.
                </p>
              </div>

              {/* Amount */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800">
                  Requested Amount (TND)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-lg font-bold font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 shadow-xs"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                    TND
                  </div>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 px-1">
                  <span>Standard micro-credit tranche: 500 – 2,000 TND</span>
                  <span className="text-emerald-700 font-semibold">Demo preset: 1,000 TND</span>
                </div>
              </div>

              {/* Purpose */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800">
                  Financing Purpose
                </label>
                <input
                  type="text"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="e.g. Laptop for freelance work"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 shadow-xs"
                />
              </div>

              {/* Term & Collateral Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200">
                  <div className="text-[11px] font-semibold text-slate-500 flex items-center space-x-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Loan Term</span>
                  </div>
                  <div className="text-base font-bold text-slate-900 mt-1">
                    {termDays} Days (3 Months)
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 font-medium">
                    ~{Math.round(amount / (termDays / 30))} TND / month
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200">
                  <div className="text-[11px] font-semibold text-emerald-800 flex items-center space-x-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Required Collateral</span>
                  </div>
                  <div className="text-base font-bold text-emerald-700 mt-1">
                    None (0 TND)
                  </div>
                  <div className="text-[11px] text-emerald-600 mt-0.5 font-medium">
                    Reputation-backed
                  </div>
                </div>
              </div>

              {/* Borrower Qualification Snapshot */}
              <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 space-y-2.5">
                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500">
                  Observable Credentials Attached to Request
                </span>
                <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                    <div className="text-slate-500 text-[10px] font-medium">Verified Events</div>
                    <div className="font-bold text-slate-900 mt-0.5">14 on Hedera</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                    <div className="text-slate-500 text-[10px] font-medium">On-Time Rate</div>
                    <div className="font-bold text-emerald-700 mt-0.5">90.9% (10/11)</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                    <div className="text-slate-500 text-[10px] font-medium">Defaults</div>
                    <div className="font-bold text-emerald-700 mt-0.5">0 Defaults</div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* STAGE 2: LIVE AUDIT & REASONING ANIMATION */}
          {stage === 'ANALYZING' && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-6">
              <div className="relative w-20 h-20">
                <div className="w-20 h-20 rounded-full border-4 border-slate-200 border-t-emerald-600 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Cpu className="w-8 h-8 text-purple-600" />
                </div>
              </div>

              <div className="space-y-2 max-w-md">
                <h4 className="text-base font-bold text-slate-900">
                  Interpreting Observable Evidence...
                </h4>
                <p className="text-xs text-slate-500">
                  {analyzingStep === 1 && "Connecting to Hedera Topic 0.0.592811..."}
                  {analyzingStep === 2 && "Checking 12 repayment obligations against default policy..."}
                  {analyzingStep >= 3 && "Verifying cashflow coverage across 3 income sources..."}
                </p>
              </div>

              <div className="w-full max-w-sm space-y-2.5 text-left text-xs font-mono text-slate-500">
                <div className={`flex items-center space-x-2 ${analyzingStep >= 1 ? 'text-emerald-700 font-bold' : 'text-slate-400'}`}>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>14 events verified on Hedera Consensus Service</span>
                </div>
                <div className={`flex items-center space-x-2 ${analyzingStep >= 2 ? 'text-emerald-700 font-bold' : 'text-slate-400'}`}>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>11 completed obligations, 0 defaults verified</span>
                </div>
                <div className={`flex items-center space-x-2 ${analyzingStep >= 3 ? 'text-emerald-700 font-bold' : 'text-slate-400'}`}>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Debt service burden conforms to policy thresholds</span>
                </div>
              </div>
            </div>
          )}

          {/* STAGE 3: AI-STYLE EVIDENCE ANALYSIS PANEL */}
          {stage === 'AI_EXPLAINED' && (
            <div className="space-y-5 animate-fade-in">
              
              {/* Verdict Header Banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-start justify-between gap-4">
                <div className="flex items-start space-x-3.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center shrink-0 mt-0.5 text-emerald-700">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                      Policy Decision Recommendation
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 mt-0.5">
                      {aiExplanation.headline}
                    </h4>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-white text-emerald-800 border border-emerald-200 whitespace-nowrap shadow-xs">
                  Match: {aiExplanation.confidenceScore}%
                </span>
              </div>

              {/* Exact Required Summary Reasoning */}
              <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 space-y-2">
                <div className="flex items-center space-x-2 text-xs font-bold text-purple-700">
                  <Cpu className="w-4 h-4" />
                  <span>AI Evidence Copilot Assessment:</span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed font-normal">
                  &ldquo;{aiExplanation.summary}&rdquo;
                </p>
              </div>

              {/* Concrete Timeline Evidence Citations */}
              <div className="space-y-2.5">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Concrete Evidence Citations
                </span>

                <div className="space-y-2">
                  {aiExplanation.concreteEvidenceCitations.map((cit, idx) => (
                    <div 
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200 text-xs flex items-start space-x-3"
                    >
                      {cit.type === 'positive' && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      )}
                      {cit.type === 'warning' && (
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <div className="font-bold text-slate-900">{cit.title}</div>
                        <div className="text-slate-500 text-[11px] mt-0.5 leading-relaxed">{cit.details}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Policy Boundary Validation Table */}
              <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs">
                <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-800">
                  Undercollateralized Policy Bounds Audit
                </div>
                <div className="divide-y divide-slate-100 text-xs">
                  {aiExplanation.policyBoundsCheck.map((rule, idx) => (
                    <div key={idx} className="p-3.5 flex items-center justify-between gap-4">
                      <div>
                        <div className="text-slate-800 font-semibold">{rule.rule}</div>
                        <div className="text-[11px] text-slate-500">Criteria: {rule.threshold}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-emerald-700 font-bold">{rule.actual}</div>
                        <span className="inline-flex items-center text-[10px] text-emerald-700 font-semibold">
                          <CheckCircle2 className="w-3 h-3 mr-0.5" /> PASS
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Critical Principle Callout */}
              <div className="p-4 rounded-xl bg-purple-50/80 border border-purple-200 text-xs text-purple-950 flex items-start space-x-2.5">
                <Info className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <span className="font-bold text-purple-900">Auditable Decision Guarantee:</span>{' '}
                  Notice that the engine never declares subjective &ldquo;trustworthiness&rdquo; or computes an opaque credit score. It evaluates verified historical repayments and mathematical cashflow boundaries.
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between p-5 border-t border-slate-100 bg-slate-50/50">
          {stage === 'FORM' ? (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-slate-500 hover:text-slate-800 text-xs font-semibold"
              >
                Cancel
              </button>

              <button
                onClick={handleStartAnalysis}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs flex items-center space-x-2 transition-all"
              >
                <span>Request Financing</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          ) : stage === 'AI_EXPLAINED' ? (
            <>
              <button
                onClick={() => setStage('FORM')}
                className="px-4 py-2 rounded-xl text-slate-500 hover:text-slate-800 text-xs font-semibold"
              >
                Modify Application
              </button>

              <button
                onClick={onProceedToLender}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-xs flex items-center space-x-2 transition-all"
              >
                <span>Proceed to Lender Review Terminal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          ) : null}
        </div>

      </div>
    </div>
  );
};

