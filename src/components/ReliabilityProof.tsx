import React from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  Layers, 
  TrendingUp, 
  ShieldCheck,
  CalendarCheck,
  Coins
} from 'lucide-react';
import { ReliabilityMetrics } from '../types';

interface ReliabilityProofProps {
  metrics: ReliabilityMetrics;
  onOpenVerifyModal: () => void;
}

export const ReliabilityProof: React.FC<ReliabilityProofProps> = ({
  metrics,
  onOpenVerifyModal
}) => {
  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm relative overflow-hidden">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase tracking-wider">
              Observable Evidence Model
            </span>
            <span className="text-xs text-slate-500 font-mono font-medium">Hedera HCS Anchored</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1.5 flex items-center space-x-2">
            <span>Proof of Financial Reliability</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl leading-relaxed">
            Observable behavioral record derived from 14 tamper-evident chronological events. 
            No speculative scoring algorithms.
          </p>
        </div>

        {/* Prototype Score Indicator Card */}
        <div className="flex items-center space-x-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200 self-start sm:self-auto shadow-2xs">
          <div className="text-right">
            <div className="flex items-baseline justify-end space-x-1">
              <span className="text-2xl font-bold text-emerald-700 tracking-tight font-mono">
                {metrics.reliabilityScore}
              </span>
              <span className="text-xs font-semibold text-slate-400">/100</span>
            </div>
            <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              {metrics.scoreLabel}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-100/70 border border-emerald-200 flex items-center justify-center text-emerald-700">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Mandatory Disclaimer Box */}
      <div className="mt-5 p-4 rounded-xl bg-amber-50 border border-amber-200/80 text-xs text-amber-900 flex items-start space-x-3">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold text-amber-950">Transparent Methodology:</span>{' '}
          This score is a prototype indicator derived strictly from observable ledger evidence (90.9% on-time fulfillment, 0 defaults, and verified recurring inflows). It is not an arbitrary AI-generated score; all underlying transactions are audited below.
        </div>
      </div>

      {/* 4 Core Verifiable Proof Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-6">
        
        {/* On-Time Rate */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 hover:bg-white transition-all shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">On-Time Fulfillment</span>
            <CalendarCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-slate-900 font-mono">{metrics.onTimeRate}%</span>
            <span className="text-xs text-slate-500 font-mono font-medium">(10 / 11 obligations)</span>
          </div>
          <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
            Consistent on-time settlement across university fees, utilities, and micro-loans.
          </p>
        </div>

        {/* Default Record */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 hover:bg-white transition-all shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Default Record</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-emerald-700 font-mono">0 Defaults</span>
            <span className="text-xs text-slate-500 font-mono font-medium">(0.0%)</span>
          </div>
          <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
            Zero uncollected balances or write-offs across 14 consecutive recorded events.
          </p>
        </div>

        {/* Total Repaid Volume */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 hover:bg-white transition-all shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Completed Obligations</span>
            <Coins className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-slate-900 font-mono">3,160 TND</span>
            <span className="text-xs text-slate-500 font-mono font-medium">(11 obligations)</span>
          </div>
          <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
            Successfully concluded 1,200 TND tuition, 6 micro-loans, rent, and utility commitments.
          </p>
        </div>

        {/* Verified Inflow */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 hover:bg-white transition-all shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Verified Inflow</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-slate-900 font-mono">2,900 TND</span>
            <span className="text-xs text-slate-500 font-mono font-medium">(3 sources)</span>
          </div>
          <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
            Multi-client freelance retainers averaging 2,250 TND / month.
          </p>
        </div>

      </div>

      {/* Evidence Granularity Audit Row */}
      <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
        <div className="flex items-center space-x-3 text-slate-600">
          <div className="w-8 h-8 rounded-lg bg-emerald-100/80 border border-emerald-200 flex items-center justify-center shrink-0 text-emerald-700">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-slate-900">Tamper-Proof Audit Trail:</span>{' '}
            All 14 events are serialized with sequential consensus timestamps on Hedera Consensus Service.
          </div>
        </div>

        <button
          onClick={onOpenVerifyModal}
          className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold border border-slate-200 text-xs flex items-center space-x-2 transition-colors whitespace-nowrap shadow-xs"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Verify Evidence on Hedera</span>
        </button>
      </div>

    </div>
  );
};
