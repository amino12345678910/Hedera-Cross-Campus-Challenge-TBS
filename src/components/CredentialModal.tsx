import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { 
  X, 
  FileCheck2, 
  ShieldCheck, 
  Download, 
  Copy, 
  Check, 
  ExternalLink, 
  QrCode, 
  ArrowDown, 
  Lock, 
  Layers, 
  Info, 
  Share2,
  Calendar,
  Cpu,
  Globe2
} from 'lucide-react';
import { TrustLineCredential, HederaNetworkStatus } from '../types';

interface CredentialModalProps {
  isOpen: boolean;
  onClose: () => void;
  credential: TrustLineCredential;
  networkStatus?: HederaNetworkStatus;
  onOpenVerifier: () => void;
  onAnchorCredential?: () => Promise<void>;
}

export const CredentialModal: React.FC<CredentialModalProps> = ({
  isOpen,
  onClose,
  credential,
  networkStatus,
  onOpenVerifier,
  onAnchorCredential
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isAnchoring, setIsAnchoring] = useState(false);

  const isLive = networkStatus?.isLive ?? credential.hederaAnchor.isLive;

  useEffect(() => {
    if (isOpen) {
      // Generate QR Code containing compact verifiable payload
      const qrPayload = JSON.stringify({
        id: credential.id,
        holder: credential.holder,
        hash: credential.credentialHash,
        topic: credential.hederaAnchor.topicId,
        seq: credential.hederaAnchor.sequenceNumber,
        ts: credential.hederaAnchor.consensusTimestamp
      });

      QRCode.toDataURL(qrPayload, {
        width: 240,
        margin: 1.5,
        color: {
          dark: '#0f172a',
          light: '#ffffff'
        }
      }).then(url => {
        setQrDataUrl(url);
      }).catch(err => {
        console.error('QR code generation error:', err);
      });
    }
  }, [isOpen, credential]);

  if (!isOpen) return null;

  const handleCopy = (text: string, fieldKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldKey);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleDownload = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(credential, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `trustline-credential-${credential.holder.toLowerCase().replace(/\s+/g, '-')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleAnchorNow = async () => {
    if (!onAnchorCredential) return;
    setIsAnchoring(true);
    try {
      await onAnchorCredential();
    } finally {
      setIsAnchoring(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shadow-xs">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-slate-900 tracking-tight">TrustLine Verifiable Credential</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Portable Credential
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Proof of Financial Reliability • Tamper-evident HCS Anchor
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
        <div className="p-6 space-y-6 max-h-[78vh] overflow-y-auto">
          
          {/* Conceptual Flow: Privacy & Cryptographic Integrity */}
          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 space-y-3">
            <div className="flex items-start space-x-2 text-xs text-slate-600">
              <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <span className="font-bold text-slate-900">Zero Personal Data on Blockchain:</span>{' '}
                &ldquo;This credential does not contain Ahmed&apos;s private financial records. It contains verifiable claims derived from those records.&rdquo;
              </p>
            </div>

            {/* Visual Architecture Pipeline */}
            <div className="pt-2 border-t border-slate-200 grid grid-cols-5 items-center text-center gap-1 text-[11px] font-mono">
              <div className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 shadow-xs">
                <Lock className="w-3.5 h-3.5 mx-auto mb-1 text-slate-400" />
                <span className="font-semibold">PRIVATE DATA</span>
              </div>
              <div className="text-slate-400 font-bold">→</div>
              <div className="p-2 rounded-lg bg-white border border-slate-200 text-slate-800 shadow-xs">
                <Cpu className="w-3.5 h-3.5 mx-auto mb-1 text-purple-600" />
                <span className="font-semibold">EVIDENCE ENGINE</span>
              </div>
              <div className="text-slate-400 font-bold">→</div>
              <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 mx-auto mb-1 text-emerald-700" />
                <span>HCS ANCHOR</span>
              </div>
            </div>
          </div>

          {/* Dossier & QR Code Split Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Left 2 Cols: Details & Claims */}
            <div className="md:col-span-2 space-y-4 text-xs font-mono">
              
              <div className="space-y-2 p-4 rounded-xl bg-slate-50/80 border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Credential ID:</span>
                  <span className="text-slate-900 font-bold">{credential.id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Holder:</span>
                  <span className="text-slate-900 font-bold">{credential.holder}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Holder Identifier:</span>
                  <span className="text-slate-600 truncate max-w-[200px]" title={credential.holderDid}>
                    {credential.holderDid}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Issuer:</span>
                  <span className="text-emerald-700 font-bold">{credential.issuerName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Status:</span>
                  <span className="text-emerald-700 font-bold">ACTIVE</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Issued:</span>
                  <span className="text-slate-800 font-semibold">{credential.issuedAt.split('T')[0]}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Validity:</span>
                  <span className="text-slate-800 font-semibold">1 Year (until {credential.expiresAt.split('T')[0]})</span>
                </div>
              </div>

              {/* Cryptographic SHA-256 Hash Box */}
              <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1.5 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 text-[11px]">
                  <span className="uppercase font-bold text-slate-600 font-sans">Canonical SHA-256 Hash:</span>
                  <button
                    onClick={() => handleCopy(credential.credentialHash, 'hash')}
                    className="text-slate-500 hover:text-slate-900 flex items-center space-x-1 font-sans"
                  >
                    {copiedField === 'hash' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span className="font-semibold">{copiedField === 'hash' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-emerald-700 font-mono break-all select-all font-semibold">
                  {credential.credentialHash}
                </div>
              </div>

              {/* Claims Snapshot */}
              <div className="grid grid-cols-3 gap-2.5 text-center">
                <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200">
                  <div className="text-[10px] text-slate-500 font-medium">Events Audited</div>
                  <div className="text-base font-bold text-slate-900 mt-0.5">{credential.claims.verifiedEvents}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200">
                  <div className="text-[10px] text-slate-500 font-medium">On-Time Rate</div>
                  <div className="text-base font-bold text-emerald-700 mt-0.5">
                    {Math.round((credential.claims.onTimeObligations / credential.claims.completedObligations) * 100)}%
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200">
                  <div className="text-[10px] text-slate-500 font-medium">Default History</div>
                  <div className="text-base font-bold text-emerald-700 mt-0.5">{credential.claims.defaults} Defaults</div>
                </div>
              </div>

            </div>

            {/* Right 1 Col: Hedera HCS Anchor & QR Code */}
            <div className="flex flex-col justify-between p-4 rounded-xl bg-slate-50/80 border border-slate-200 text-center">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-600 tracking-wider">
                  Hedera HCS Anchor
                </span>

                <div className="mt-2.5 text-xs font-mono text-left space-y-1.5 p-3 rounded-xl bg-white border border-slate-200 shadow-xs">
                  <div className="text-slate-500 flex justify-between">
                    <span>Topic:</span>
                    <span className="text-emerald-700 font-bold">{credential.hederaAnchor.topicId}</span>
                  </div>
                  <div className="text-slate-500 flex justify-between">
                    <span>Sequence:</span>
                    <span className="text-slate-900 font-bold">#{credential.hederaAnchor.sequenceNumber}</span>
                  </div>
                  <div className="text-slate-500 flex justify-between">
                    <span>Network:</span>
                    <span className={isLive ? "text-emerald-700 font-bold" : "text-amber-700 font-bold"}>
                      {isLive ? 'TESTNET (LIVE)' : 'DEMO MODE'}
                    </span>
                  </div>
                </div>

                {/* QR Code Container */}
                <div className="mt-4 flex flex-col items-center">
                  <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-sm">
                    {qrDataUrl ? (
                      <img src={qrDataUrl} alt="Credential QR Code" className="w-36 h-36 rounded-lg" />
                    ) : (
                      <div className="w-36 h-36 flex items-center justify-center text-slate-400">
                        <QrCode className="w-8 h-8 opacity-50" />
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 mt-2 flex items-center gap-1 font-mono font-medium">
                    <QrCode className="w-3 h-3 text-emerald-700" />
                    <span>Scan to Verify Locally</span>
                  </span>
                </div>
              </div>

              {/* HashScan Topic Link */}
              <div className="pt-3 border-t border-slate-200 mt-4">
                <a
                  href={credential.hederaAnchor.explorerUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-emerald-700 hover:text-emerald-800 font-bold hover:underline inline-flex items-center space-x-1"
                >
                  <span>Inspect on HashScan</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

          </div>

        </div>

        {/* Modal Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-6 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownload}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center space-x-2 transition-colors border border-slate-300 shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-emerald-700" />
              <span>Download Credential (JSON)</span>
            </button>

            {isLive && onAnchorCredential && (
              <button
                onClick={handleAnchorNow}
                disabled={isAnchoring}
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center space-x-2 transition-colors border border-slate-300 disabled:opacity-50 shadow-xs"
              >
                <Layers className={`w-3.5 h-3.5 text-emerald-700 ${isAnchoring ? 'animate-spin' : ''}`} />
                <span>{isAnchoring ? 'Anchoring...' : 'Anchor to HCS'}</span>
              </button>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                onClose();
                onOpenVerifier();
              }}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors flex items-center space-x-2 shadow-xs"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Open Independent Verifier</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

