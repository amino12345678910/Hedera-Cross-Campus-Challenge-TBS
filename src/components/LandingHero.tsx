import React from 'react';
import { 
  ArrowRight, 
  ShieldCheck, 
  Layers, 
  Cpu, 
  FileKey2, 
  CheckCircle2, 
  TrendingUp, 
  Zap,
  Building2,
  Lock,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Activity
} from 'lucide-react';
import { HEDERA_TOPIC_ID } from '../services/mockData';
import { HederaNetworkStatus } from '../types';

interface LandingHeroProps {
  onExplorePassport: () => void;
  onOpenLenderView: () => void;
  onOpenVerifyModal: () => void;
  networkStatus?: HederaNetworkStatus;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onExplorePassport,
  onOpenLenderView,
  onOpenVerifyModal,
  networkStatus
}) => {
  const isLive = networkStatus?.isLive ?? true;
  const topicId = networkStatus?.topicId || HEDERA_TOPIC_ID;

  return (
    <div className="relative overflow-hidden pt-4 pb-12 lg:pt-8 lg:pb-16 space-y-16">
      
      {/* Top Hero Section: Asymmetrical 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        
        {/* Left Column: Value Proposition & CTAs */}
        <div className="lg:col-span-7 space-y-6 text-left">
          
          {/* Micro Pill Badge */}
          <div className="inline-flex items-center space-x-2.5 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-xs text-emerald-900 shadow-xs">
            <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-emerald-600 animate-pulse' : 'bg-amber-500'}`} />
            <span className="font-semibold text-emerald-950">TrustLine Protocol</span>
            <span className="text-emerald-300">/</span>
            <span className="text-emerald-800 font-mono text-[11px] font-bold">
              {isLive ? 'LIVE • HEDERA TESTNET' : 'SIMULATED • DEMO FALLBACK'}
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
            Financial behavior you can prove.
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl font-normal">
            TrustLine turns verified financial activity into a portable, independently verifiable credential for people with limited conventional credit history.
          </p>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={onExplorePassport}
              className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm shadow-md flex items-center justify-center space-x-2 transition-all hover:translate-y-[-1px]"
            >
              <span>Explore Credit Passport</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenLenderView}
              className="px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-medium text-sm border border-slate-200 hover:border-slate-300 flex items-center justify-center space-x-2 transition-all shadow-xs"
            >
              <Building2 className="w-4 h-4 text-slate-500" />
              <span>Lender Review Terminal</span>
            </button>
          </div>

          {/* Value Micro-Pills */}
          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium">
            <span className="flex items-center space-x-1.5 text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Evidence-Based Financing</span>
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center space-x-1.5 text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>100% Observable Evidence</span>
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center space-x-1.5 text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Hedera Consensus Finality</span>
            </span>
          </div>

        </div>

        {/* Right Column: Live Interactive Dossier & Telemetry Card */}
        <div className="lg:col-span-5">
          <div className="relative rounded-2xl bg-white border border-slate-200/90 p-6 shadow-xl space-y-5 overflow-hidden">
            
            {/* Card Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Verifiable Passport Dossier</h3>
                  <p className="text-[11px] text-slate-500">Subject: Ahmed Ben Ali</p>
                </div>
              </div>

              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                ACTIVE v1.0
              </span>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-3 gap-2 text-center font-mono">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] text-slate-500 uppercase font-medium">Audited Events</span>
                <p className="text-lg font-bold text-slate-900 mt-0.5">14</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] text-slate-500 uppercase font-medium">On-Time Rate</span>
                <p className="text-lg font-bold text-emerald-600 mt-0.5">90.9%</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] text-slate-500 uppercase font-medium">Defaults</span>
                <p className="text-lg font-bold text-emerald-600 mt-0.5">0</p>
              </div>
            </div>

            {/* Hedera Cryptographic Anchor Preview */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-600 font-sans font-semibold">Hedera Consensus Anchor</span>
                <span className={`font-semibold flex items-center space-x-1 ${isLive ? 'text-emerald-700' : 'text-amber-700'}`}>
                  <Activity className="w-3 h-3 text-emerald-600" />
                  <span>{isLive ? 'LIVE TESTNET ANCHOR' : 'SIMULATED ANCHOR'}</span>
                </span>
              </div>
              <div className="text-[11px] text-slate-600 flex justify-between">
                <span>Topic ID:</span>
                <span className="text-slate-900 font-semibold">{topicId}</span>
              </div>
              <div className="text-[11px] text-slate-600 flex justify-between">
                <span>Canonical Hash:</span>
                <span className="text-emerald-700 font-semibold truncate max-w-[170px]">
                  4a9f3b7d8e2c1109a8b7...
                </span>
              </div>
            </div>

            {/* Interactive Preview Trigger */}
            <div className="pt-1 flex items-center justify-between">
              <button
                onClick={onExplorePassport}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center justify-center space-x-2 transition-colors border border-slate-200"
              >
                <span>Inspect Verified Claims</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* Live Presentation Flow Stepper (Integrated & Modern) */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                End-to-End Live Hackathon Flow
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600 font-mono font-semibold">
                TBS 2026
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Follow Ahmed Ben Ali&apos;s complete lifecycle: from a student with limited credit history to funded borrower with on-chain reputation update.
            </p>
          </div>

          <button
            onClick={onOpenVerifyModal}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-semibold flex items-center space-x-1.5 transition-colors whitespace-nowrap self-start sm:self-auto"
          >
            <Zap className="w-3.5 h-3.5 text-emerald-600" />
            <span>Query Topic {HEDERA_TOPIC_ID}</span>
          </button>
        </div>

        {/* 4 Interactive Flow Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          
          <div 
            onClick={onExplorePassport}
            className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 hover:bg-white cursor-pointer transition-all shadow-xs group"
          >
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-mono text-slate-400 group-hover:text-emerald-600 font-bold">01</span>
              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100/70 px-2 py-0.5 rounded">14 Events</span>
            </div>
            <p className="text-xs font-bold text-slate-900">Credit Passport</p>
            <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
              Audits tuition, utilities, and 3 verified freelance income streams.
            </p>
          </div>

          <div 
            onClick={onOpenVerifyModal}
            className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 hover:bg-white cursor-pointer transition-all shadow-xs group"
          >
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-mono text-slate-400 group-hover:text-emerald-600 font-bold">02</span>
              <span className="text-[10px] text-slate-700 font-bold bg-slate-200/80 px-2 py-0.5 rounded">HCS Ledger</span>
            </div>
            <p className="text-xs font-bold text-slate-900">Hedera Consensus</p>
            <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
              Consensus timestamps and running hashes prove tamper-evident order.
            </p>
          </div>

          <div 
            onClick={onExplorePassport}
            className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 hover:bg-white cursor-pointer transition-all shadow-xs group"
          >
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-mono text-slate-400 group-hover:text-emerald-600 font-bold">03</span>
              <span className="text-[10px] text-slate-700 font-bold bg-slate-200/80 px-2 py-0.5 rounded">Deterministic</span>
            </div>
            <p className="text-xs font-bold text-slate-900">AI Evidence Copilot</p>
            <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
              Explains policy adherence citing exact timeline evidence.
            </p>
          </div>

          <div 
            onClick={onOpenLenderView}
            className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 hover:bg-white cursor-pointer transition-all shadow-xs group"
          >
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-mono text-slate-400 group-hover:text-blue-600 font-bold">04</span>
              <span className="text-[10px] text-blue-700 font-bold bg-blue-100/70 px-2 py-0.5 rounded">HSCS Contract</span>
            </div>
            <p className="text-xs font-bold text-slate-900">Lender Approval & Repay</p>
            <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
              Smart contract locks agreement and updates reputation v1.0 → v2.0 upon repayment.
            </p>
          </div>

        </div>
      </div>

      {/* 4 Architectural Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all">
          <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center mb-3.5 text-blue-600">
            <FileKey2 className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-slate-900">Portable Identity</h4>
          <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
            Decentralized credentials allow borrowers to transport verified reliability across lenders.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-3.5 text-emerald-600">
            <Layers className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-slate-900">Hedera HCS Proofs</h4>
          <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
            Financial events anchored to public Hedera Consensus topics with cryptographic running hashes.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all">
          <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center mb-3.5 text-purple-600">
            <Cpu className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-slate-900">AI Evidence Copilot</h4>
          <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
            AI cites observable evidence against transparent policies—never a black-box scoring algorithm.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all">
          <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center mb-3.5 text-amber-600">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-slate-900">Smart Contract Execution</h4>
          <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
            Agreements and installment repayments are executed on Hedera Smart Contract Service.
          </p>
        </div>

      </div>

    </div>
  );
};
