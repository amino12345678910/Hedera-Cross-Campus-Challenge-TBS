import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingHero } from './components/LandingHero';
import { CreditPassport } from './components/CreditPassport';
import { EventTimeline } from './components/EventTimeline';
import { HederaVerifyModal } from './components/HederaVerifyModal';
import { LoanRequestModal } from './components/LoanRequestModal';
import { LenderReviewView } from './components/LenderReviewView';
import { ApprovalSuccessModal } from './components/ApprovalSuccessModal';
import { CredentialModal } from './components/CredentialModal';
import { CredentialVerifierView } from './components/CredentialVerifierView';
import { ReputationUpdatedBanner } from './components/ReputationUpdatedBanner';
import { JudgeDemoModal } from './components/JudgeDemoModal';

import { initialProfile, initialEvents } from './services/mockData';
import { ReliabilityService } from './services/reliabilityService';
import { LoanService } from './services/loanService';
import { HederaService } from './services/hederaService';
import { CredentialService } from './services/credentialService';
import { 
  FinancialEvent, 
  LoanApplication, 
  UserProfile, 
  HederaNetworkStatus,
  TrustLineCredential
} from './types';
import { 
  ShieldCheck, 
  RotateCcw, 
  ChevronRight, 
  CheckCircle2, 
  Play, 
  AlertCircle,
  X
} from 'lucide-react';

export function App() {
  const [currentTab, setCurrentTab] = useState<'landing' | 'passport' | 'verifier' | 'lender'>('landing');
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [events, setEvents] = useState<FinancialEvent[]>(initialEvents);
  const [loan, setLoan] = useState<LoanApplication>(() => LoanService.getActiveLoan());
  const [networkStatus, setNetworkStatus] = useState<HederaNetworkStatus>({
    isLive: false,
    topicId: HederaService.DEFAULT_TOPIC_ID,
    network: 'testnet',
    reason: 'Checking testnet credentials...'
  });

  // Longitudinal Credential Reputation State
  const [previousCredentialHash, setPreviousCredentialHash] = useState<string | null>(null);
  const [showReputationUpdatedBanner, setShowReputationUpdatedBanner] = useState<boolean>(false);
  const [isSimulatedDefaultMode, setIsSimulatedDefaultMode] = useState<boolean>(false);

  // Safety & Notification State
  const [resetNotification, setResetNotification] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modals state
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [selectedVerifyEvent, setSelectedVerifyEvent] = useState<FinancialEvent | undefined>();
  const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
  const [isApprovalSuccessOpen, setIsApprovalSuccessOpen] = useState(false);
  const [isCredentialModalOpen, setIsCredentialModalOpen] = useState(false);
  const [isJudgeDemoOpen, setIsJudgeDemoOpen] = useState(false);

  // Observable metrics computed deterministically from events
  const metrics = ReliabilityService.calculateMetrics(events);

  // Portable Credential State
  const [credential, setCredential] = useState<TrustLineCredential>(() => 
    CredentialService.createCredential(
      initialProfile, 
      initialEvents, 
      ReliabilityService.calculateMetrics(initialEvents), 
      false, 
      HederaService.DEFAULT_TOPIC_ID
    )
  );

  // Check Hedera live status on mount
  useEffect(() => {
    HederaService.checkNetworkStatus().then((status) => {
      setNetworkStatus(status);
      setCredential(prev => ({
        ...prev,
        hederaAnchor: {
          ...prev.hederaAnchor,
          topicId: status.topicId || prev.hederaAnchor.topicId,
          isLive: status.isLive
        }
      }));
    });
  }, []);

  // Handlers
  const handleOpenVerifyModal = (event?: FinancialEvent) => {
    setSelectedVerifyEvent(event);
    setIsVerifyModalOpen(true);
  };

  const handleOpenLoanModal = () => {
    setIsLoanModalOpen(true);
  };

  const handleOpenCredentialModal = () => {
    setIsCredentialModalOpen(true);
  };

  const handleVerifyCredential = () => {
    setCurrentTab('verifier');
  };

  const handleDownloadCredential = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(credential, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `trustline-credential-v${credential.version}-${credential.holder.toLowerCase().replace(/\s+/g, '-')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleAnchorCredential = async () => {
    try {
      const updated = await CredentialService.anchorCredentialToHcs(credential, networkStatus.topicId);
      setCredential(updated);
    } catch (err: any) {
      setErrorMessage(`HCS Anchoring failed: ${err.message || err}`);
    }
  };

  const handleSubmitLoan = (updatedLoan: LoanApplication) => {
    setLoan(updatedLoan);
    LoanService.saveLoan(updatedLoan);
  };

  const handleProceedToLender = () => {
    setIsLoanModalOpen(false);
    setCurrentTab('lender');
  };

  /**
   * REAL HEDERA TESTNET LOAN APPROVAL & FUNDING
   */
  const handleApproveLoan = async () => {
    setErrorMessage(null);
    try {
      const res = await HederaService.executeLoanAgreementOnSmartContract(
        loan,
        profile.hederaAccountId,
        credential.credentialHash
      );

      const approvedLoan: LoanApplication = {
        ...loan,
        status: 'ACTIVE',
        approvedAt: new Date().toISOString(),
        contractId: res.contractId,
        smartContractAddress: res.contractAddressEVM,
        contractTxHash: res.transactionHash,
        loanIdOnChain: 'TL-2026-0001',
        onChainStatus: 'ACTIVE',
        installmentsPaid: 0,
        repayments: []
      };
      setLoan(approvedLoan);
      LoanService.saveLoan(approvedLoan);

      // Update Ahmed's profile obligations count (12 -> 13)
      setProfile(prev => ({
        ...prev,
        repaymentObligations: prev.repaymentObligations + 1
      }));

      setIsApprovalSuccessOpen(true);
    } catch (err: any) {
      setErrorMessage(`Loan approval failed on Hedera: ${err?.message || err}. Business state was not modified.`);
    }
  };

  /**
   * 🌟 CORE PRODUCT LOOP: REAL ON-CHAIN REPAYMENT & REPUTATION UPDATE
   */
  const handlePayInstallment = async () => {
    setErrorMessage(null);
    const nextInstallment = (loan.installmentsPaid || 0) + 1;

    try {
      const res = await HederaService.repayLoanInstallmentOnChain(
        loan.loanIdOnChain || 'TL-2026-0001',
        loan.installmentAmountHbar || 1.67
      );

      if (!res.success) {
        throw new Error('Hedera transaction receipt indicated failure');
      }

      const repaymentRecord = {
        installmentNumber: nextInstallment,
        amountTND: loan.monthlyRepayment || 333,
        amountHbar: loan.installmentAmountHbar || 1.67,
        txHash: res.transactionId,
        date: new Date().toISOString().split('T')[0],
        isLive: res.isLive,
        explorerUrl: res.explorerUrl
      };

      const newInstallmentsPaid = nextInstallment;
      const isFullyRepaid = newInstallmentsPaid >= (loan.installmentCount || 3);

      const updatedLoan: LoanApplication = {
        ...loan,
        installmentsPaid: newInstallmentsPaid,
        status: isFullyRepaid ? 'REPAID' : 'ACTIVE',
        onChainStatus: isFullyRepaid ? 'REPAID' : 'ACTIVE',
        repayments: [...(loan.repayments || []), repaymentRecord]
      };
      setLoan(updatedLoan);
      LoanService.saveLoan(updatedLoan);

      // 1. Add confirmed financial event to Ahmed's timeline
      const newEventNum = events.length + 1;
      const newEvent: FinancialEvent = {
        id: `evt-${newEventNum < 10 ? '0' : ''}${newEventNum}`,
        title: `TrustLine Loan Installment #${nextInstallment}`,
        category: 'MICRO_LOAN',
        amount: 333,
        currency: 'TND',
        date: new Date().toISOString().split('T')[0],
        isObligation: true,
        status: 'PAID_ON_TIME',
        counterparty: 'TBS Community Fund',
        description: `Installment #${nextInstallment} of 3 settled via Hedera TrustLineVault smart contract (${res.transactionId}).`,
        proof: {
          topicId: networkStatus.topicId || HederaService.DEFAULT_TOPIC_ID,
          sequenceNumber: 1530 + newEventNum,
          consensusTimestamp: `${Date.now() / 1000}.48192019`,
          formattedTimestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
          transactionId: res.transactionId,
          runningHash: '7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d',
          messageHash: 'b2a10987654321fedcba0987654321abcdef4a9f3b7d8e2c1109a8b7e6f5d4c3',
          submitterAccountId: networkStatus.operatorIdMasked || HederaService.ORACLE_ACCOUNT_ID,
          explorerUrl: res.explorerUrl,
          isLiveVerified: res.isLive
        }
      };

      const updatedEvents = [...events, newEvent];
      setEvents(updatedEvents);

      // 2. Update Ahmed's profile: completedObligations +1, onTimeObligations +1
      const updatedProfile: UserProfile = {
        ...profile,
        verifiedFinancialEvents: profile.verifiedFinancialEvents + 1,
        completedObligations: profile.completedObligations + 1,
        onTimeObligations: profile.onTimeObligations + 1
      };
      setProfile(updatedProfile);

      // 3. Recompute metrics
      const updatedMetrics = ReliabilityService.calculateMetrics(updatedEvents);

      // 4. Longitudinal Credential Update: v1.0 -> v2.0
      const oldHash = credential.credentialHash;
      const newCred = await CredentialService.createNewCredentialVersion(
        credential,
        updatedProfile,
        updatedMetrics,
        nextInstallment,
        networkStatus.topicId
      );

      setCredential(newCred);
      setPreviousCredentialHash(oldHash);
      setShowReputationUpdatedBanner(true);
    } catch (err: any) {
      setErrorMessage(`Repayment transaction failed: ${err?.message || err}. State not updated.`);
    }
  };

  const handleSimulateDefault = () => {
    setIsSimulatedDefaultMode(true);
  };

  const handleResetSimulatedDefault = () => {
    setIsSimulatedDefaultMode(false);
  };

  const handleAnchorNewLiveEvent = async () => {
    const newEventNumber = events.length + 1;
    const newEvent: FinancialEvent = {
      id: `evt-${newEventNumber < 10 ? '0' : ''}${newEventNumber}`,
      title: 'DevSprint Freelance Milestone Payment',
      category: 'INCOME',
      amount: 450,
      currency: 'TND',
      date: new Date().toISOString().split('T')[0],
      isObligation: false,
      status: 'VERIFIED',
      counterparty: 'Hyperion Labs Tunis',
      description: 'Milestone delivery for mobile responsive component module attested by client.',
      proof: {
        topicId: networkStatus.topicId || HederaService.DEFAULT_TOPIC_ID,
        sequenceNumber: 1520 + newEventNumber,
        consensusTimestamp: `${Date.now() / 1000}.591024912`,
        formattedTimestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
        transactionId: `${HederaService.ORACLE_ACCOUNT_ID}@${Math.floor(Date.now() / 1000) - 1}.109281`,
        runningHash: '9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
        messageHash: '4a9f3b7d8e2c1109a8b7e6f5d4c3b2a10987654321fedcba0987654321abcdef',
        submitterAccountId: networkStatus.operatorIdMasked || HederaService.ORACLE_ACCOUNT_ID,
        explorerUrl: `https://hashscan.io/testnet/topic/${networkStatus.topicId || HederaService.DEFAULT_TOPIC_ID}`
      }
    };

    const realProof = await HederaService.anchorEvidence(newEvent, networkStatus.topicId);
    newEvent.proof = realProof;

    setEvents(prev => [...prev, newEvent]);
    setProfile(prev => ({
      ...prev,
      verifiedFinancialEvents: prev.verifiedFinancialEvents + 1
    }));
  };

  const handleResetDemo = () => {
    const fresh = LoanService.resetLoan();
    setLoan(fresh);
    setProfile(initialProfile);
    setEvents(initialEvents);
    const freshCred = CredentialService.createCredential(
      initialProfile, 
      initialEvents, 
      ReliabilityService.calculateMetrics(initialEvents), 
      networkStatus.isLive, 
      networkStatus.topicId
    );
    setCredential(freshCred);
    setPreviousCredentialHash(null);
    setShowReputationUpdatedBanner(false);
    setIsSimulatedDefaultMode(false);
    setErrorMessage(null);
    setResetNotification('Local demo state has been reset. Note: Transactions previously submitted to Hedera Testnet remain permanently recorded on-chain.');
    setTimeout(() => setResetNotification(null), 5000);
    setCurrentTab('landing');
    setIsLoanModalOpen(false);
    setIsVerifyModalOpen(false);
    setIsApprovalSuccessOpen(false);
    setIsCredentialModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-900 flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenVerifyModal={() => handleOpenVerifyModal()}
        onOpenJudgeDemo={() => setIsJudgeDemoOpen(true)}
        onResetDemo={handleResetDemo}
        activeLoanStatus={loan.status}
        networkStatus={networkStatus}
      />

      {/* Rehearsal Reset Toast Notification */}
      {resetNotification && (
        <div className="bg-blue-50 border-b border-blue-200 px-4 py-3 text-xs text-blue-900 flex items-center justify-between animate-fade-in">
          <div className="max-w-7xl mx-auto flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="font-medium">{resetNotification}</span>
          </div>
          <button onClick={() => setResetNotification(null)} className="text-blue-500 hover:text-blue-800">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Transaction Error Notification */}
      {errorMessage && (
        <div className="bg-rose-50 border-b border-rose-200 px-4 py-3 text-xs text-rose-900 flex items-center justify-between animate-fade-in">
          <div className="max-w-7xl mx-auto flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span className="font-semibold">{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)} className="text-rose-500 hover:text-rose-800">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Guided Hackathon Presentation Stepper Banner */}
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 py-2.5 shadow-xs sticky top-[73px] z-30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          
          <div className="flex items-center space-x-2.5">
            <span className={`w-2 h-2 rounded-full ${networkStatus.isLive ? 'bg-emerald-600 animate-pulse' : 'bg-amber-500'}`} />
            <span className="font-bold text-slate-900">Live Presentation Stepper:</span>
            <span className="text-slate-500 font-medium">
              {networkStatus.isLive ? 'Live Hedera Testnet' : 'Demo Fallback Mode'}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
            
            {/* Step 1 */}
            <button
              onClick={() => setCurrentTab('landing')}
              className={`px-3 py-1 rounded-lg transition-all flex items-center space-x-1.5 text-xs font-semibold ${
                currentTab === 'landing'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span className={`text-[10px] font-mono ${currentTab === 'landing' ? 'text-emerald-400' : 'text-slate-400'}`}>1.</span>
              <span>Overview</span>
            </button>

            <ChevronRight className="w-3 h-3 text-slate-300" />

            {/* Step 2 */}
            <button
              onClick={() => setCurrentTab('passport')}
              className={`px-3 py-1 rounded-lg transition-all flex items-center space-x-1.5 text-xs font-semibold ${
                currentTab === 'passport'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span className="text-[10px] font-mono text-emerald-600">2.</span>
              <span>Credit Passport</span>
            </button>

            <ChevronRight className="w-3 h-3 text-slate-300" />

            {/* Step 3 */}
            <button
              onClick={() => handleOpenCredentialModal()}
              className="px-3 py-1 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center space-x-1.5 text-xs font-semibold"
            >
              <span className="text-[10px] font-mono text-emerald-600">3.</span>
              <span>Credential v{credential.version}</span>
            </button>

            <ChevronRight className="w-3 h-3 text-slate-300" />

            {/* Step 4 */}
            <button
              onClick={() => setCurrentTab('verifier')}
              className={`px-3 py-1 rounded-lg transition-all flex items-center space-x-1.5 text-xs font-semibold ${
                currentTab === 'verifier'
                  ? 'bg-purple-50 text-purple-800 border border-purple-200 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span className="text-[10px] font-mono text-purple-600">4.</span>
              <span>Independent Verifier</span>
            </button>

            <ChevronRight className="w-3 h-3 text-slate-300" />

            {/* Step 5 */}
            <button
              onClick={() => handleOpenLoanModal()}
              className="px-3 py-1 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center space-x-1.5 text-xs font-semibold"
            >
              <span className="text-[10px] font-mono text-blue-600">5.</span>
              <span>Request 1,000 TND</span>
            </button>

            <ChevronRight className="w-3 h-3 text-slate-300" />

            {/* Step 6 */}
            <button
              onClick={() => setCurrentTab('lender')}
              className={`px-3 py-1 rounded-lg transition-all flex items-center space-x-1.5 text-xs font-semibold ${
                currentTab === 'lender'
                  ? 'bg-blue-50 text-blue-800 border border-blue-200 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span className="text-[10px] font-mono text-blue-600">6.</span>
              <span>Lender Decision & Repay</span>
              {loan.status === 'APPROVED' || loan.status === 'ACTIVE' ? (
                <CheckCircle2 className="w-3 h-3 text-emerald-600 ml-1" />
              ) : null}
            </button>

            {/* Judge Mode Quick Launch */}
            <span className="text-slate-300 mx-1">•</span>
            <button
              onClick={() => setIsJudgeDemoOpen(true)}
              className="px-3 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold flex items-center space-x-1.5 border border-emerald-200 transition-colors shadow-xs text-xs"
            >
              <Play className="w-2.5 h-2.5 fill-emerald-700 text-emerald-700" />
              <span>Judge Mode</span>
            </button>

          </div>

        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        
        {/* Longitudinal Reputation Updated Banner */}
        {showReputationUpdatedBanner && previousCredentialHash && (
          <ReputationUpdatedBanner
            previousHash={previousCredentialHash}
            currentCredential={credential}
            onDismiss={() => setShowReputationUpdatedBanner(false)}
            onViewCredential={() => {
              setShowReputationUpdatedBanner(false);
              setIsCredentialModalOpen(true);
            }}
          />
        )}

        {/* VIEW 1: LANDING HERO */}
        {currentTab === 'landing' && (
          <LandingHero
            onExplorePassport={() => setCurrentTab('passport')}
            onOpenLenderView={() => setCurrentTab('lender')}
            onOpenVerifyModal={() => handleOpenVerifyModal()}
          />
        )}

        {/* VIEW 2: CREDIT PASSPORT & TIMELINE */}
        {currentTab === 'passport' && (
          <div className="space-y-12">
            <CreditPassport
              profile={profile}
              metrics={metrics}
              credential={credential}
              networkStatus={networkStatus}
              onRequestLoan={handleOpenLoanModal}
              onOpenVerifyModal={() => handleOpenVerifyModal()}
              onViewCredential={handleOpenCredentialModal}
              onVerifyCredential={handleVerifyCredential}
              onDownloadCredential={handleDownloadCredential}
              activeLoanStatus={loan.status}
            />

            <EventTimeline
              events={events}
              onOpenVerifyModal={handleOpenVerifyModal}
            />
          </div>
        )}

        {/* VIEW 3: INDEPENDENT CREDENTIAL VERIFIER */}
        {currentTab === 'verifier' && (
          <CredentialVerifierView
            credential={credential}
            networkStatus={networkStatus}
            onBackToPassport={() => setCurrentTab('passport')}
          />
        )}

        {/* VIEW 4: LENDER TERMINAL & ON-CHAIN LIFECYCLE */}
        {currentTab === 'lender' && (
          <div className="space-y-10">
            <LenderReviewView
              profile={profile}
              events={events}
              loan={loan}
              networkStatus={networkStatus}
              onApproveLoan={handleApproveLoan}
              onPayInstallment={handlePayInstallment}
              onSimulateDefault={handleSimulateDefault}
              onResetSimulatedDefault={handleResetSimulatedDefault}
              isSimulatedDefaultMode={isSimulatedDefaultMode}
              onOpenEvidenceAudit={() => {
                setCurrentTab('passport');
              }}
              onOpenHederaTopic={() => handleOpenVerifyModal()}
            />

            {/* Embedded Audit Timeline for Lender */}
            <div className="pt-6 border-t border-slate-200">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                Underlying Hedera Event Stream Audited by Lender
              </h4>
              <EventTimeline
                events={events}
                onOpenVerifyModal={handleOpenVerifyModal}
              />
            </div>
          </div>
        )}

      </main>

      {/* Interactive Modals */}
      <CredentialModal
        isOpen={isCredentialModalOpen}
        onClose={() => setIsCredentialModalOpen(false)}
        credential={credential}
        networkStatus={networkStatus}
        onOpenVerifier={() => {
          setIsCredentialModalOpen(false);
          setCurrentTab('verifier');
        }}
        onAnchorCredential={handleAnchorCredential}
      />

      <HederaVerifyModal
        isOpen={isVerifyModalOpen}
        onClose={() => setIsVerifyModalOpen(false)}
        selectedEvent={selectedVerifyEvent}
        allEvents={events}
        networkStatus={networkStatus}
        onAnchorNewLiveEvent={handleAnchorNewLiveEvent}
      />

      <LoanRequestModal
        isOpen={isLoanModalOpen}
        onClose={() => setIsLoanModalOpen(false)}
        profile={profile}
        events={events}
        loan={loan}
        onSubmitLoan={handleSubmitLoan}
        onProceedToLender={handleProceedToLender}
      />

      <ApprovalSuccessModal
        isOpen={isApprovalSuccessOpen}
        onClose={() => setIsApprovalSuccessOpen(false)}
        loan={loan}
        networkStatus={networkStatus}
        onViewPassport={() => {
          setIsApprovalSuccessOpen(false);
          setCurrentTab('lender');
        }}
      />

      <JudgeDemoModal
        isOpen={isJudgeDemoOpen}
        onClose={() => setIsJudgeDemoOpen(false)}
        onNavigateTab={(tab) => setCurrentTab(tab)}
        onOpenCredentialModal={() => setIsCredentialModalOpen(true)}
        onOpenLoanModal={() => setIsLoanModalOpen(true)}
      />

      {/* Modern Hackathon Footer */}
      <footer className="border-t border-slate-200/80 bg-white mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-slate-900">TrustLine Protocol</span>
            <span>•</span>
            <span className="font-medium">Hedera Cross Campus Challenge 2026 @ TBS</span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="font-mono text-[11px] text-slate-600">
              {networkStatus.isLive 
                ? `Testnet Topic: ${networkStatus.topicId} | Vault: ${networkStatus.contractId || 'TrustLineVault'}`
                : `Topic: ${HederaService.DEFAULT_TOPIC_ID} (Demo Fallback)`}
            </span>
            <span>•</span>
            <button
              onClick={handleResetDemo}
              className="text-slate-600 hover:text-slate-900 font-semibold flex items-center space-x-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset State</span>
            </button>
          </div>

        </div>
      </footer>

    </div>
  );
}

export default App;

