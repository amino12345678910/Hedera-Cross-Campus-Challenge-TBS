import React from 'react';
import { 
  ShieldCheck, 
  ExternalLink, 
  RotateCcw, 
  UserCheck, 
  Building2,
  FileCheck2,
  Play,
  Layers,
  Cpu
} from 'lucide-react';
import { HederaNetworkStatus } from '../types';

interface NavbarProps {
  currentTab: 'landing' | 'passport' | 'verifier' | 'lender';
  onSelectTab: (tab: 'landing' | 'passport' | 'verifier' | 'lender') => void;
  onOpenVerifyModal: () => void;
  onOpenJudgeDemo: () => void;
  onResetDemo: () => void;
  activeLoanStatus: string;
  networkStatus?: HederaNetworkStatus;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenVerifyModal,
  onOpenJudgeDemo,
  onResetDemo,
  activeLoanStatus,
  networkStatus
}) => {
  const isLive = networkStatus?.isLive ?? false;
  const topicId = networkStatus?.topicId || '0.0.592811';
  const hasContract = Boolean(networkStatus?.contractId);
  const isTwoParty = Boolean(networkStatus?.isTwoPartyMode ?? (networkStatus?.isDemoAccountMode === false));

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-xl shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Event Tag */}
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => onSelectTab('landing')}>
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-xs transition-transform group-hover:scale-105">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base font-bold tracking-tight text-slate-900">TrustLine</span>
                <span className="px-1.5 py-0.5 text-[9px] font-mono font-semibold tracking-wide rounded bg-slate-100 text-slate-700 border border-slate-200">
                  TBS 2026
                </span>
              </div>
              <p className="text-[10px] text-slate-500 hidden sm:block">
                Hedera Consensus Credit Protocol
              </p>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden md:flex items-center p-1 bg-slate-100/90 rounded-xl border border-slate-200/80 text-xs font-medium space-x-0.5">
            <button
              onClick={() => onSelectTab('landing')}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
                currentTab === 'landing'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Overview</span>
            </button>
            <button
              onClick={() => onSelectTab('passport')}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
                currentTab === 'passport'
                  ? 'bg-white text-emerald-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Credit Passport</span>
            </button>
            <button
              onClick={() => onSelectTab('verifier')}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
                currentTab === 'verifier'
                  ? 'bg-white text-purple-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileCheck2 className="w-3.5 h-3.5 text-slate-600" />
              <span>Independent Verifier</span>
            </button>
            <button
              onClick={() => onSelectTab('lender')}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
                currentTab === 'lender'
                  ? 'bg-white text-blue-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Lender Terminal</span>
              {activeLoanStatus === 'ANALYZED' && (
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              )}
            </button>
          </nav>

          {/* Right Action Bar with Judge Demo & Subsystem Status */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Judge Demo Button */}
            <button
              onClick={onOpenJudgeDemo}
              className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 text-xs font-medium flex items-center space-x-1.5 transition-all shadow-xs"
              title="Open the 90-second Judge Demo presenter guide"
            >
              <Play className="w-3 h-3 text-emerald-600 fill-emerald-600" />
              <span>Judge Demo</span>
            </button>

            {/* Granular Subsystem Status */}
            <button
              onClick={onOpenVerifyModal}
              title={`Network: ${isLive ? 'LIVE' : 'DEMO'} | HCS: ${isLive ? 'LIVE' : 'DEMO'} | Vault: ${hasContract ? 'LIVE' : 'DEMO'} | Account: ${isTwoParty ? 'TWO-PARTY' : 'SINGLE'}`}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs transition-all border shadow-xs ${
                isLive
                  ? 'bg-emerald-50 hover:bg-emerald-100/80 text-emerald-800 border-emerald-200'
                  : 'bg-amber-50 hover:bg-amber-100/80 text-amber-800 border-amber-200'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <div className="flex flex-col text-left leading-tight">
                <span className="text-[9px] uppercase tracking-wider font-bold text-slate-500">
                  {isLive ? (isTwoParty ? 'TESTNET • TWO-PARTY' : 'TESTNET • SINGLE') : 'DEMO MODE'}
                </span>
                <span className="font-semibold font-mono text-[10px]">
                  {isLive ? (hasContract ? 'LIVE HCS + VAULT' : 'LIVE HCS') : 'SIMULATED'}
                </span>
              </div>
              <ExternalLink className="w-3 h-3 text-slate-400 ml-0.5 hidden sm:block" />
            </button>

            {/* Quick Reset Demo Button */}
            <button
              onClick={onResetDemo}
              title="Reset application local demo state"
              className="p-2 rounded-xl bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200 text-xs flex items-center space-x-1 transition-all shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden xl:inline text-[11px] font-medium">Reset</span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
