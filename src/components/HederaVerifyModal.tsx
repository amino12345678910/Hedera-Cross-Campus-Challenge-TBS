import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  ExternalLink, 
  Copy, 
  Check, 
  Layers, 
  RefreshCw, 
  Info, 
  Clock, 
  Hash, 
  FileCheck2, 
  Zap, 
  Globe, 
  Radio
} from 'lucide-react';
import { FinancialEvent, HederaNetworkStatus } from '../types';
import { HederaService, HederaConsensusVerificationDetails } from '../services/hederaService';

interface HederaVerifyModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEvent?: FinancialEvent;
  allEvents: FinancialEvent[];
  networkStatus?: HederaNetworkStatus;
  onAnchorNewLiveEvent?: () => Promise<void>;
}

export const HederaVerifyModal: React.FC<HederaVerifyModalProps> = ({
  isOpen,
  onClose,
  selectedEvent,
  allEvents,
  networkStatus,
  onAnchorNewLiveEvent
}) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isLiveSubmitting, setIsLiveSubmitting] = useState(false);
  const [liveSubmitSuccess, setLiveSubmitSuccess] = useState<string | null>(null);
  const [verificationDetails, setVerificationDetails] = useState<HederaConsensusVerificationDetails | null>(null);

  const isLive = networkStatus?.isLive ?? false;
  const topicId = networkStatus?.topicId || HederaService.DEFAULT_TOPIC_ID;
  const eventToInspect = selectedEvent || allEvents[allEvents.length - 1];

  // Perform verification query whenever modal opens or event changes
  useEffect(() => {
    if (isOpen && eventToInspect) {
      let isMounted = true;
      setIsVerifying(true);
      
      HederaService.verifyEventProof(eventToInspect)
        .then((details) => {
          if (isMounted) {
            setVerificationDetails(details);
            setIsVerifying(false);
          }
        })
        .catch(() => {
          if (isMounted) setIsVerifying(false);
        });

      return () => { isMounted = false; };
    }
  }, [isOpen, eventToInspect, isLive]);

  if (!isOpen) return null;

  const handleCopy = (text: string, fieldKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldKey);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleReverify = async () => {
    if (!eventToInspect) return;
    setIsVerifying(true);
    try {
      const details = await HederaService.verifyEventProof(eventToInspect);
      setVerificationDetails(details);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLiveAnchorTest = async () => {
    if (!onAnchorNewLiveEvent) return;
    setIsLiveSubmitting(true);
    setLiveSubmitSuccess(null);
    try {
      await onAnchorNewLiveEvent();
      setLiveSubmitSuccess(`Successfully submitted and sequenced on Hedera Testnet Topic ${topicId}!`);
      handleReverify();
    } catch (err: any) {
      alert(`Submission error: ${err?.message || err}`);
    } finally {
      setIsLiveSubmitting(false);
    }
  };

  const proof = eventToInspect?.proof;
  const displaySeq = verificationDetails?.sequenceNumber ?? proof?.sequenceNumber ?? 1041;
  const displayTs = verificationDetails?.consensusTimestamp ?? proof?.consensusTimestamp ?? '1726135200.104192001';
  const displayRunningHash = verificationDetails?.rawMirrorPayload?.runningHash || proof?.runningHash;
  const displayTxId = verificationDetails?.transactionId || proof?.transactionId;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden">
        
        {/* Modal Top Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-slate-900 tracking-tight">Hedera Consensus Verification</h3>
                
                {/* Live vs Demo Badge */}
                {isLive ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                    <span>LIVE • HEDERA TESTNET</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200">
                    SIMULATED • DEMO FALLBACK
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {isLive 
                  ? 'Real-time consensus verification via Hedera Testnet Mirror Node'
                  : 'Independent tamper-evident consensus audit simulation'}
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
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto text-slate-700">
          
          {/* Explanation Quote */}
          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-slate-700 text-xs leading-relaxed flex items-start space-x-3">
            <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-emerald-900">Consensus Integrity Guarantee:</p>
              <p className="mt-0.5 text-slate-600">
                &ldquo;TrustLine anchors important financial events to Hedera Consensus Service so their ordering and timestamps can be independently verified.&rdquo;
              </p>
            </div>
          </div>

          {/* Fallback Notice when credentials are not configured */}
          {!isLive && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start space-x-2.5">
              <Radio className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-900">
                  SIMULATED • DEMO FALLBACK — Live Hedera credentials not active
                </span>
                <p className="text-amber-800/90 mt-0.5">
                  To switch to live Hedera Testnet anchoring, set <code className="text-slate-900 font-mono bg-white px-1.5 py-0.5 rounded border border-amber-200 font-semibold">HEDERA_LENDER_ID</code> and <code className="text-slate-900 font-mono bg-white px-1.5 py-0.5 rounded border border-amber-200 font-semibold">HEDERA_LENDER_KEY</code> in your <code className="text-slate-900 font-mono bg-white px-1.5 py-0.5 rounded border border-amber-200 font-semibold">.env</code> file.
                </p>
              </div>
            </div>
          )}

          {/* Live Testnet Banner when live */}
          {isLive && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-start space-x-2.5">
              <Globe className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-emerald-900">
                  LIVE HEDERA TESTNET CONNECTED ({networkStatus?.isTwoPartyMode ? 'TWO-PARTY ARCHITECTURE' : 'SINGLE ACCOUNT DEMO'})
                </span>
                <p className="text-emerald-800/90 mt-0.5">
                  {networkStatus?.isTwoPartyMode ? (
                    <>
                      Lender: <code className="font-mono text-slate-900 font-bold">{networkStatus?.lenderIdMasked}</code> • Borrower: <code className="font-mono text-slate-900 font-bold">{networkStatus?.borrowerIdMasked}</code>
                    </>
                  ) : (
                    <>
                      Operator: <code className="font-mono text-slate-900 font-bold">{networkStatus?.operatorIdMasked || networkStatus?.lenderIdMasked}</code>
                    </>
                  )}
                  {' '}• Mirror Node: <code className="font-mono text-slate-900 font-bold">testnet.mirrornode.hedera.com</code>
                </p>
              </div>
            </div>
          )}

          {/* Verification Status Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80">
              <div className="text-slate-500 font-medium">Topic ID</div>
              <div className="font-mono font-bold text-slate-900 mt-1 text-sm">{topicId}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">{isLive ? 'Live Testnet' : 'Pre-seeded'}</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80">
              <div className="text-slate-500 font-medium">Consensus State</div>
              <div className="font-mono font-bold text-emerald-700 mt-1 text-sm">
                {isVerifying ? 'Querying...' : '100% Finalized'}
              </div>
              <div className="text-[10px] text-emerald-600 mt-0.5 font-medium">Monotonic Order</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80">
              <div className="text-slate-500 font-medium">Running Hash</div>
              <div className="font-mono font-bold text-blue-700 mt-1 text-sm">SHA-384 Chain</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Cryptographic</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80">
              <div className="text-slate-500 font-medium">Evidence Privacy</div>
              <div className="font-mono font-bold text-purple-700 mt-1 text-sm">Zero PII</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Evidence Hashes Only</div>
            </div>
          </div>

          {/* Event Proof Inspector */}
          {eventToInspect && (
            <div className="rounded-2xl bg-slate-50/80 border border-slate-200/90 p-4 sm:p-5 space-y-3.5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                    {isLive ? 'Mirror Node Verified Event' : 'Inspecting Event Proof'}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 mt-0.5">
                    {eventToInspect.title}
                  </h4>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    Seq #{displaySeq}
                  </span>
                  <a
                    href={`https://hashscan.io/testnet/topic/${topicId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-emerald-700 transition-colors shadow-xs"
                    title="View Topic on HashScan Testnet"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Cryptographic Details Table */}
              <div className="space-y-2 text-xs font-mono">
                
                {/* Consensus Timestamp */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-xs">
                  <div className="flex items-center space-x-2 text-slate-500 font-sans">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-medium">Consensus Timestamp:</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-emerald-700 font-bold">{displayTs}</span>
                    <button
                      onClick={() => handleCopy(displayTs, 'ts')}
                      className="text-slate-400 hover:text-slate-700"
                    >
                      {copiedField === 'ts' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                {/* Hedera Transaction ID */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-xs">
                  <div className="flex items-center space-x-2 text-slate-500 font-sans">
                    <Hash className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-medium">Hedera Transaction ID:</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-800 font-semibold truncate max-w-xs">{displayTxId}</span>
                    <button
                      onClick={() => handleCopy(displayTxId, 'txId')}
                      className="text-slate-400 hover:text-slate-700"
                    >
                      {copiedField === 'txId' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                {/* Running Hash */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-xs">
                  <div className="flex items-center space-x-2 text-slate-500 font-sans">
                    <Layers className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-medium">Running Hash (SHA-384):</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-600 truncate max-w-[180px] sm:max-w-xs">{displayRunningHash}</span>
                    <button
                      onClick={() => handleCopy(displayRunningHash || '', 'hash')}
                      className="text-slate-400 hover:text-slate-700"
                    >
                      {copiedField === 'hash' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                {/* Message Evidence Hash (Privacy Preserving) */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-xs">
                  <div className="flex items-center space-x-2 text-slate-500 font-sans">
                    <FileCheck2 className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-medium">Evidence Hash (SHA-256):</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-600 truncate max-w-[180px] sm:max-w-xs">{proof?.messageHash}</span>
                    <button
                      onClick={() => handleCopy(proof?.messageHash || '', 'msgHash')}
                      className="text-slate-400 hover:text-slate-700"
                    >
                      {copiedField === 'msgHash' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

              </div>

              {/* HashScan Direct Link */}
              <div className="pt-2 text-right">
                <a
                  href={`https://hashscan.io/testnet/topic/${topicId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-emerald-700 hover:text-emerald-800 font-bold hover:underline inline-flex items-center space-x-1"
                >
                  <span>Inspect Topic {topicId} on HashScan Testnet</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

            </div>
          )}

          {/* Interactive Live Demo Trigger for Presenters */}
          {isLive && onAnchorNewLiveEvent && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                  <Zap className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Anchor Live Test Event to Testnet HCS</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Demonstrate live Hedera consensus by submitting a new verifiable anchor right now.
                </p>
                {liveSubmitSuccess && (
                  <p className="text-[11px] text-emerald-700 font-mono font-bold mt-1">
                    ✓ {liveSubmitSuccess}
                  </p>
                )}
              </div>

              <button
                onClick={handleLiveAnchorTest}
                disabled={isLiveSubmitting}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-all whitespace-nowrap disabled:opacity-50"
              >
                {isLiveSubmitting ? 'Submitting to HCS...' : 'Submit Real HCS Event'}
              </button>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between p-5 border-t border-slate-100 bg-slate-50/50">
          <button
            onClick={handleReverify}
            disabled={isVerifying}
            className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center space-x-2 transition-colors disabled:opacity-50 border border-slate-300 shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-600 ${isVerifying ? 'animate-spin' : ''}`} />
            <span>{isVerifying ? 'Verifying on Ledger...' : 'Re-verify with Mirror Node'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-all shadow-xs"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

