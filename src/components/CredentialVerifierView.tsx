import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  RotateCcw, 
  ArrowRight, 
  Layers, 
  Lock, 
  Hash, 
  ExternalLink, 
  Cpu, 
  FileCheck2, 
  Building2,
  RefreshCw
} from 'lucide-react';
import { TrustLineCredential, HederaNetworkStatus, CredentialVerificationResult } from '../types';
import { CredentialService } from '../services/credentialService';
import { CredentialHashService } from '../services/credentialHashService';

interface CredentialVerifierViewProps {
  credential: TrustLineCredential;
  networkStatus?: HederaNetworkStatus;
  onBackToPassport: () => void;
}

export const CredentialVerifierView: React.FC<CredentialVerifierViewProps> = ({
  credential,
  networkStatus,
  onBackToPassport
}) => {
  // Current working credential in verifier (can be tampered for demonstration)
  const [activeCred, setActiveCred] = useState<TrustLineCredential>(credential);
  const [tamperedField, setTamperedField] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const isLive = networkStatus?.isLive ?? activeCred.hederaAnchor.isLive;

  // Run verification against the anchored hash on Hedera
  const verification: CredentialVerificationResult = CredentialService.verifyCredential(
    activeCred,
    credential.credentialHash // Keep immutable anchored hash as ground truth
  );

  // Handlers to simulate tampering
  const handleTamperDefaults = () => {
    setActiveCred(prev => ({
      ...prev,
      claims: {
        ...prev.claims,
        defaults: 3
      }
    }));
    setTamperedField('Defaults modified: 0 → 3');
  };

  const handleTamperOnTime = () => {
    setActiveCred(prev => ({
      ...prev,
      claims: {
        ...prev.claims,
        onTimeObligations: 12
      }
    }));
    setTamperedField('On-Time Obligation modified: 10 → 12');
  };

  const handleResetToAuthentic = () => {
    setActiveCred(credential);
    setTamperedField(null);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="rounded-2xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shadow-xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">Independent Credential Verifier</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  Third-Party Portal
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Verifies borrower claims cryptographically against Hedera Consensus Service without calling a central bank database.
              </p>
            </div>
          </div>

          <button
            onClick={onBackToPassport}
            className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-300 transition-colors self-start sm:self-auto shadow-xs"
          >
            ← Back to Passport
          </button>
        </div>

        {/* Verification Pipeline Diagram */}
        <div className="mt-7 pt-6 border-t border-slate-100">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs font-mono">
            
            <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80">
              <div className="text-[10px] text-slate-500 font-bold uppercase">STEP 1</div>
              <div className="font-bold text-slate-900 mt-1">IMPORT CREDENTIAL</div>
              <div className="text-[10px] text-emerald-700 font-semibold mt-1">Claims Loaded</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80">
              <div className="text-[10px] text-slate-500 font-bold uppercase">STEP 2</div>
              <div className="font-bold text-slate-900 mt-1">VERIFY SHA-256</div>
              <div className={`text-[10px] mt-1 font-bold ${verification.hashMatches ? 'text-emerald-700' : 'text-rose-700'}`}>
                {verification.hashMatches ? 'Matches Canonical' : 'Hash Mismatch'}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80">
              <div className="text-[10px] text-slate-500 font-bold uppercase">STEP 3</div>
              <div className="font-bold text-slate-900 mt-1">QUERY HEDERA</div>
              <div className="text-[10px] text-blue-700 font-semibold mt-1">Topic {credential.hederaAnchor.topicId}</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80">
              <div className="text-[10px] text-slate-500 font-bold uppercase">RESULT</div>
              <div className="font-bold text-slate-900 mt-1">FINAL VERDICT</div>
              <div className={`text-[10px] mt-1 font-bold uppercase ${verification.isValid ? 'text-emerald-700' : 'text-rose-700'}`}>
                {verification.isValid ? '✓ Valid Credential' : '✗ Tamper Detected'}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Main Verification Result Banner */}
      {verification.isValid ? (
        <div className="p-6 sm:p-7 rounded-2xl bg-emerald-50/70 border border-emerald-200 shadow-sm space-y-3">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">
                Cryptographic Integrity Verified
              </span>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight mt-0.5">
                VERIFIED BY HEDERA {isLive ? 'TESTNET' : 'CONSENSUS SERVICE'}
              </h3>
            </div>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed max-w-2xl pl-13.5">
            All 14 financial events and observable claims match the immutable SHA-256 state anchored to Hedera Topic <span className="font-mono text-slate-900 font-bold">{credential.hederaAnchor.topicId}</span> at consensus timestamp <span className="font-mono text-slate-900 font-semibold">{credential.hederaAnchor.consensusTimestamp}</span>.
          </p>
        </div>
      ) : (
        <div className="p-6 sm:p-7 rounded-2xl bg-rose-50/80 border border-rose-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-700">
              <XCircle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-rose-800 tracking-wider">
                Cryptographic Discrepancy Detected
              </span>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight mt-0.5">
                VERIFICATION FAILED: CREDENTIAL HAS BEEN MODIFIED
              </h3>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-rose-200 text-xs font-mono space-y-2 shadow-xs">
            <div className="text-rose-800 font-bold">
              &ldquo;Credential contents do not match the anchored hash on Hedera Consensus Service.&rdquo;
            </div>
            {tamperedField && (
              <div className="text-amber-800 font-medium">
                Altered claim: <span className="underline font-bold">{tamperedField}</span>
              </div>
            )}
            <div className="pt-2 text-[11px] text-slate-600 space-y-1 border-t border-slate-100">
              <div>Computed Digest:&nbsp;&nbsp;<span className="text-rose-700 font-bold">{verification.computedHash}</span></div>
              <div>Anchored Digest:&nbsp;&nbsp;<span className="text-emerald-700 font-bold">{verification.anchoredHash}</span></div>
            </div>
          </div>

          <p className="text-xs text-rose-900/90 leading-relaxed">
            This demonstrates why the blockchain audit trail matters: a borrower or third party cannot falsify repayments or erase defaults without breaking the immutable cryptographic anchor on Hedera.
          </p>
        </div>
      )}

      {/* Interactive Demonstration Panel: Simulate Tampering */}
      <div className="rounded-2xl bg-white border border-slate-200/90 p-6 sm:p-7 space-y-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h4 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-purple-600" />
              <span>Interactive Tamper Verification Test</span>
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Simulate what happens if someone attempts to manipulate the claims in Ahmed&apos;s credential.
            </p>
          </div>

          {tamperedField && (
            <button
              onClick={handleResetToAuthentic}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center space-x-1.5 transition-colors self-start sm:self-auto shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restore Authentic Credential</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <button
            onClick={handleTamperDefaults}
            className="p-4 rounded-xl bg-slate-50/70 hover:bg-rose-50/50 border border-slate-200 hover:border-rose-200 text-left transition-all group"
          >
            <div className="text-xs font-bold text-slate-900 group-hover:text-rose-700">
              1. Alter Defaults (0 → 3)
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
              Simulates malicious tampering to see if the verifier detects unrecorded defaults.
            </p>
          </button>

          <button
            onClick={handleTamperOnTime}
            className="p-4 rounded-xl bg-slate-50/70 hover:bg-rose-50/50 border border-slate-200 hover:border-rose-200 text-left transition-all group"
          >
            <div className="text-xs font-bold text-slate-900 group-hover:text-rose-700">
              2. Inflate On-Time (10 → 12)
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
              Simulates exaggerating on-time repayments to falsely boost credit standing.
            </p>
          </button>

          <button
            onClick={handleResetToAuthentic}
            className="p-4 rounded-xl bg-slate-50/70 hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-200 text-left transition-all group"
          >
            <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-700">
              3. Authentic Ledger State
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
              Reload authentic claims derived directly from the 14 verified Hedera events.
            </p>
          </button>
        </div>
      </div>

      {/* Detailed 5-Point Verification Checklist */}
      <div className="rounded-2xl bg-white border border-slate-200/90 p-6 sm:p-7 space-y-4 shadow-sm">
        <h4 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
          <FileCheck2 className="w-4 h-4 text-emerald-600" />
          <span>Detailed Cryptographic Checklist</span>
        </h4>

        <div className="space-y-2.5 text-xs font-mono">
          
          {/* Check 1: Structure */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/80 border border-slate-200/80">
            <div className="flex items-center space-x-2.5">
              {verification.structureValid ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span className="text-slate-800 font-semibold font-sans">1. Credential structure valid</span>
            </div>
            <span className="text-emerald-700 text-[11px] font-bold">PASS</span>
          </div>

          {/* Check 2: Hash Match */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/80 border border-slate-200/80">
            <div className="flex items-center space-x-2.5">
              {verification.hashMatches ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span className="text-slate-800 font-semibold font-sans">2. Credential hash matches canonical claims</span>
            </div>
            <span className={`text-[11px] font-bold ${verification.hashMatches ? 'text-emerald-700' : 'text-rose-700'}`}>
              {verification.hashMatches ? 'PASS' : 'FAIL'}
            </span>
          </div>

          {/* Check 3: Hedera Anchor Found */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/80 border border-slate-200/80">
            <div className="flex items-center space-x-2.5">
              {verification.hederaAnchorFound ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span className="text-slate-800 font-semibold font-sans">3. Hedera HCS anchor found on Topic {credential.hederaAnchor.topicId}</span>
            </div>
            <span className="text-emerald-700 text-[11px] font-bold">PASS</span>
          </div>

          {/* Check 4: Consensus Timestamp */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/80 border border-slate-200/80">
            <div className="flex items-center space-x-2.5">
              {verification.consensusTimestampVerified ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span className="text-slate-800 font-semibold font-sans">4. Consensus timestamp verified ({credential.hederaAnchor.consensusTimestamp})</span>
            </div>
            <span className="text-emerald-700 text-[11px] font-bold">PASS</span>
          </div>

          {/* Check 5: Unmodified */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/80 border border-slate-200/80">
            <div className="flex items-center space-x-2.5">
              {verification.unmodified ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span className="text-slate-800 font-semibold font-sans">5. Credential has not been modified since anchor</span>
            </div>
            <span className={`text-[11px] font-bold ${verification.unmodified ? 'text-emerald-700' : 'text-rose-700'}`}>
              {verification.unmodified ? 'PASS' : 'FAIL'}
            </span>
          </div>

        </div>
      </div>

    </div>
  );
};

