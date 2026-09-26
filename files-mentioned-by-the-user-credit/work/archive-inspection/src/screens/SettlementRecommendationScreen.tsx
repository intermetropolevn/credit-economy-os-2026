import React, { useState } from 'react';
import { useEconomic } from '../context/EconomicContext';
import {
  Cpu,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Scale,
  Sliders,
  DollarSign,
  Layers,
  Sparkles,
  Info,
} from 'lucide-react';

export const SettlementRecommendationScreen: React.FC = () => {
  const { tx, approveSettlement, navigate, triggerSimulatedIntegrityBreach } = useEconomic();
  const [releaseAmount, setReleaseAmount] = useState<number>(tx.aiVerification?.releaseAmount ?? 700);
  const [holdAmount, setHoldAmount] = useState<number>(tx.aiVerification?.holdAmount ?? 300);
  const [isModifying, setIsModifying] = useState<boolean>(false);
  const [operatorSigner, setOperatorSigner] = useState<string>('Sarah Chen (Tier-3 Enterprise Auth)');
  const [validationWarning, setValidationWarning] = useState<string | null>(null);

  const isAlreadySettled = tx.state === 'SETTLED';
  const totalAllocated = releaseAmount + holdAmount;
  const isTrancheBalanced = totalAllocated === tx.escrowBalance;
  const hasValidSigner = operatorSigner.trim().length > 0;
  const feeAmount = tx.platformFee || 20;
  const netProviderDisbursal = Math.max(0, releaseAmount - feeAmount);

  const handleApprove = () => {
    if (isAlreadySettled) {
      setValidationWarning('Cannot settle twice: Transaction is already finalized and settled.');
      return;
    }
    if (!hasValidSigner) {
      setValidationWarning('Human authorization required: Signer name cannot be empty.');
      return;
    }
    if (!isTrancheBalanced) {
      setValidationWarning(`Tranche mismatch: Release (${releaseAmount}) + Hold (${holdAmount}) = ${totalAllocated} CRD, but reserved escrow is ${tx.escrowBalance} CRD.`);
      return;
    }

    setValidationWarning(null);
    approveSettlement(releaseAmount, holdAmount, operatorSigner);
  };

  const handleTrancheModify = (releaseVal: number) => {
    const r = Math.min(Math.max(0, releaseVal), tx.escrowBalance);
    setReleaseAmount(r);
    setHoldAmount(tx.escrowBalance - r);
    setValidationWarning(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#262a35]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#939183] mb-1">
            <span
              onClick={() => navigate(`/transactions/${tx.id}`)}
              className="hover:underline cursor-pointer"
            >
              {tx.id}
            </span>
            <span>/</span>
            <span className="text-[#e4e1a9] font-bold">SETTLEMENT RECOMMENDATION</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#dfe2f0] flex items-center gap-2">
            <Cpu className="w-6 h-6 text-[#c8c58f]" />
            AI Verification Recommendation
          </h1>
          <p className="text-xs text-[#cac7b8] mt-1">
            Settlement recommendation and credit disbursement proposals requiring human review.
          </p>
        </div>

        <button
          onClick={() => navigate(`/transactions/${tx.id}/exception`)}
          className="text-xs font-mono text-[#feb26f] hover:underline self-start sm:self-auto"
        >
          ← Review Clause 4.2 Exception
        </button>
      </div>

      {/* State Transition Delta // Balance Shift Matrix */}
      <div className="bg-[#171b26] border border-[#262a35] rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#262a35]">
          <div>
            <h3 className="text-sm font-bold text-[#dfe2f0]">
              State Transition Delta // Balance Shift Matrix
            </h3>
            <p className="text-[11px] text-[#939183]">
              Deterministic account projections upon execution of proposed settlement
            </p>
          </div>
          <span className="text-[10px] font-mono text-[#c8c58f] bg-[#1b1f2a] px-2.5 py-1 rounded border border-[#262a35]">
            DOUBLE-ENTRY PROJECTION
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 font-mono text-xs">
          <div className="p-3 rounded-lg bg-[#1b1f2a] border border-[#262a35]">
            <div className="text-[#939183] text-[10px]">2010.88 ESCROW</div>
            <div className="text-sm font-bold text-[#dfe2f0] mt-1">
              1,000 → <span className="text-[#feb26f]">{holdAmount} CRD</span>
            </div>
            <div className="text-[10px] text-[#ffb4ab] mt-1">-{releaseAmount} CRD Disbursal</div>
          </div>

          <div className="p-3 rounded-lg bg-[#1b1f2a] border border-[#262a35]">
            <div className="text-[#939183] text-[10px]">1020.14 PROVIDER (ALEX)</div>
            <div className="text-sm font-bold text-[#dfe2f0] mt-1">
              {tx.provider.currentBalance} →{' '}
              <span className="text-[#c8c58f]">
                {tx.provider.currentBalance + releaseAmount - 20} CRD
              </span>
            </div>
            <div className="text-[10px] text-[#c8c58f] mt-1">
              +{releaseAmount - 20} CRD Net (+{releaseAmount} -20 fee)
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#1b1f2a] border border-[#262a35]">
            <div className="text-[#939183] text-[10px]">4050.01 PROTOCOL FEE</div>
            <div className="text-sm font-bold text-[#dfe2f0] mt-1">
              {tx.platform.currentBalance} → <span className="text-[#dfe2f0]">{tx.platform.currentBalance + 20} CRD</span>
            </div>
            <div className="text-[10px] text-[#b8c8de] mt-1">+20 CRD (2.0% routing)</div>
          </div>

          <div className="p-3 rounded-lg bg-[#1b1f2a] border border-[#262a35]">
            <div className="text-[#939183] text-[10px]">1010.42 PAYER (SARAH)</div>
            <div className="text-sm font-bold text-[#dfe2f0] mt-1">
              {tx.payer.currentBalance} → <span className="text-[#dfe2f0]">{tx.payer.currentBalance} CRD</span>
            </div>
            <div className="text-[10px] text-[#939183] mt-1">Unencumbered status quo</div>
          </div>
        </div>
      </div>

      {/* Main 2-Col Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: AI Rationale & Flow Routing Topology */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Recommendation Details */}
          <div className="bg-[#171b26] border border-[#262a35] rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#262a35]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#e4e1a9]" />
                <h3 className="text-sm font-bold text-[#dfe2f0]">
                  AI Verification Analysis
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#e4e1a9]/20 text-[#e4e1a9] border border-[#e4e1a9]/40 font-bold">
                  STEP 6: RELEASE 700 / HOLD 300
                </span>
                <span className="text-xs font-mono font-bold text-[#c8c58f] bg-[#1b1f2a] px-2 py-0.5 rounded border border-[#262a35]">
                  CONFIDENCE: {tx.aiVerification?.confidence || 87}%
                </span>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-[#0a0e18] border border-[#262a35] space-y-3 font-mono text-xs">
              {/* Finding */}
              <div>
                <span className="text-[10px] text-[#939183] uppercase tracking-wider block">FINDING:</span>
                <span className="text-xs font-bold text-[#feb26f]">
                  {tx.aiVerification?.finding || 'Partial fulfillment detected (2 missing motion assets)'}
                </span>
              </div>

              {/* Recommendation */}
              <div className="pt-1 border-t border-[#1b1f2a] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#939183] uppercase tracking-wider block">RECOMMENDATION:</span>
                  <span className="text-xs font-bold text-[#e4e1a9] uppercase">
                    ACTION: {tx.aiVerification?.recommendation || 'release'} (RELEASE {releaseAmount} / HOLD {holdAmount} CRD)
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#c8c58f]/20 text-[#e4e1a9] text-[10px] font-bold">
                  VALIDATED
                </span>
              </div>

              {/* Evidence */}
              <div className="pt-1 border-t border-[#1b1f2a] space-y-1">
                <span className="text-[10px] text-[#939183] uppercase tracking-wider block">INSPECTED EVIDENCE:</span>
                <ul className="space-y-1">
                  {(tx.aiVerification?.evidence || [
                    'Brand logo vector deliverable verified against Clause 2.1 (300 CRD)',
                    'Brand identity guidelines document verified against Clause 2.1',
                    '3 of 5 dynamic social marketing assets verified against Clause 4.2 (400 CRD partial)',
                    'Missing 9:16 vertical motion formats required under Clause 4.2',
                    'Master vector & motion source files held in protective escrow pending Clause 4.2 resolution',
                  ]).map((ev, i) => (
                    <li key={i} className="text-[11px] text-[#dfe2f0] flex items-start gap-1.5 leading-tight">
                      <CheckCircle2 className="w-3 h-3 text-[#c8c58f] shrink-0 mt-0.5" />
                      <span>{ev}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Concise Rationale */}
              <div className="pt-1 border-t border-[#1b1f2a]">
                <span className="text-[10px] text-[#939183] uppercase tracking-wider block mb-1">CONCISE RATIONALE:</span>
                <p className="text-xs font-sans text-[#cac7b8] leading-relaxed italic bg-[#171b26] p-3 rounded border border-[#262a35]">
                  "{tx.aiVerification?.rationale || 'The provider has fulfilled milestones representing 700 of 1,000 credits. The remaining 300 credits should remain in escrow until the missing deliverable is verified or the transaction enters dispute resolution.'}"
                </p>
              </div>

              {/* Tranche breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 text-[11px] font-mono">
                <div className="p-2 rounded bg-[#1b1f2a] border border-[#262a35]">
                  <div className="text-[#939183]">M-1 Brand Identity</div>
                  <div className="text-[#c8c58f] font-bold">300 CRD Release</div>
                  <div className="text-[10px] text-[#939183]">100% verified</div>
                </div>
                <div className="p-2 rounded bg-[#1b1f2a] border border-[#262a35]">
                  <div className="text-[#939183]">M-2 Social Assets</div>
                  <div className="text-[#feb26f] font-bold">400 CRD Release</div>
                  <div className="text-[10px] text-[#939183]">Indemnified under hold</div>
                </div>
                <div className="p-2 rounded bg-[#1b1f2a] border border-[#262a35]">
                  <div className="text-[#939183]">M-3 Source Files</div>
                  <div className="text-[#ffb4ab] font-bold">300 CRD Retained</div>
                  <div className="text-[10px] text-[#939183]">Protective hold</div>
                </div>
              </div>
            </div>
          </div>

          {/* Capital Allocation & Flow Topology */}
          <div className="bg-[#171b26] border border-[#262a35] rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-[#dfe2f0] pb-3 border-b border-[#262a35]">
              Settlement Allocation Waterfall
            </h3>

            {/* Visual Bar */}
            <div className="space-y-1.5 font-mono text-xs">
              <div className="flex justify-between text-[11px]">
                <span className="text-[#c8c58f]">
                  Disbursed: {releaseAmount} CRD ({(releaseAmount / 10).toFixed(0)}%)
                </span>
                <span className="text-[#feb26f]">
                  Retained in Escrow: {holdAmount} CRD ({(holdAmount / 10).toFixed(0)}%)
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-[#1b1f2a] overflow-hidden flex">
                <div
                  style={{ width: `${(releaseAmount / 1000) * 100}%` }}
                  className="bg-[#c8c58f] h-full"
                />
                <div
                  style={{ width: `${(holdAmount / 1000) * 100}%` }}
                  className="bg-[#feb26f] h-full"
                />
              </div>
            </div>

            {/* Topology Flow Graph */}
            <div className="p-4 rounded-lg bg-[#0a0e18] border border-[#262a35] font-mono text-xs">
              <div className="text-[10px] text-[#939183] mb-3">
                PROGRAMMABLE VALUE ROUTING
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center">
                <div className="p-3 rounded-lg bg-[#1b1f2a] border border-[#48473c] w-full sm:w-auto">
                  <div className="text-[10px] text-[#939183]">SOURCE CUSTODY</div>
                  <div className="font-bold text-[#e4e1a9] text-sm">Escrow 2010.88</div>
                  <div className="text-[10px] text-[#939183]">{tx.escrowBalance.toLocaleString()} CRD</div>
                </div>

                <div className="text-xs text-[#939183]">
                  ───► <span className="text-[#e4e1a9] font-bold">{releaseAmount} CRD</span> ───►
                </div>

                <div className="p-3 rounded-lg bg-[#1b1f2a] border border-[#c8c58f]/40 w-full sm:w-auto">
                  <div className="text-[10px] text-[#939183]">BENEFICIARY</div>
                  <div className="font-bold text-[#c8c58f] text-sm">Provider 1020.14</div>
                  <div className="text-[10px] text-[#c8c58f]">{netProviderDisbursal} CRD Net</div>
                </div>

                <div className="p-3 rounded-lg bg-[#1b1f2a] border border-[#3b4a5d] w-full sm:w-auto">
                  <div className="text-[10px] text-[#939183]">PROTOCOL CLEARING</div>
                  <div className="font-bold text-[#b8c8de] text-sm">Clearing 4050.01</div>
                  <div className="text-[10px] text-[#b8c8de]">{feeAmount} CRD Fee</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Human-in-the-Loop Safeguard & Authorization */}
        <div className="space-y-6">
          <div className="bg-[#171b26] border border-[#e4e1a9]/30 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#262a35]">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-[#e4e1a9]" />
                <h3 className="text-sm font-bold text-[#dfe2f0]">
                  Human Governance Gate
                </h3>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                isAlreadySettled 
                  ? 'bg-[#c8c58f]/20 text-[#c8c58f] border border-[#c8c58f]/40' 
                  : 'bg-[#feb26f]/20 text-[#feb26f] border border-[#feb26f]/40'
              }`}>
                {isAlreadySettled ? 'SETTLED_FINAL' : 'AUTH_REQUIRED'}
              </span>
            </div>

            <p className="text-xs text-[#cac7b8] leading-relaxed">
              Under Protocol Invariant #1, AI cannot directly execute ledger balance mutations.
              A Tier-3 authorized officer must approve the release.
            </p>

            {validationWarning && (
              <div className="p-3 rounded-lg bg-[#ff5555]/15 border border-[#ff5555]/40 text-[#ff8888] text-xs font-mono flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-[#ff5555] mt-0.5" />
                <span>{validationWarning}</span>
              </div>
            )}

            <div className="space-y-3 font-mono text-xs">
              <div>
                <label className="block text-[10px] text-[#939183] mb-1">
                  AUTHORIZED SIGNER
                </label>
                <input
                  type="text"
                  value={operatorSigner}
                  disabled={isAlreadySettled}
                  onChange={(e) => {
                    setOperatorSigner(e.target.value);
                    setValidationWarning(null);
                  }}
                  className={`w-full bg-[#1b1f2a] border rounded px-3 py-1.5 text-xs text-[#dfe2f0] focus:outline-none focus:border-[#e4e1a9] ${
                    !hasValidSigner ? 'border-[#ff5555]' : 'border-[#262a35]'
                  } ${isAlreadySettled ? 'opacity-50 cursor-not-allowed' : ''}`}
                />
                {!hasValidSigner && (
                  <span className="text-[10px] text-[#ff5555] mt-1 block">
                    * Human authority signature cannot be empty.
                  </span>
                )}
              </div>

              {isModifying && (
                <div className="p-3 rounded-lg bg-[#0a0e18] border border-[#feb26f]/40 space-y-2">
                  <div className="text-[10px] text-[#feb26f] font-bold">
                    MODIFY TRANCHE SPLIT
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#939183] mb-1">
                      RELEASE AMOUNT (CRD)
                    </label>
                    <input
                      type="number"
                      value={releaseAmount}
                      onChange={(e) => handleTrancheModify(Number(e.target.value))}
                      min={0}
                      max={tx.escrowBalance}
                      step={50}
                      className="w-full bg-[#1b1f2a] border border-[#262a35] rounded px-2.5 py-1 text-xs text-[#e4e1a9] font-bold font-mono"
                    />
                  </div>
                  <div className="text-[10px] text-[#939183]">
                    Hold Amount will be: {holdAmount} CRD (Reserved Escrow: {tx.escrowBalance} CRD)
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={handleApprove}
                disabled={isAlreadySettled || !hasValidSigner || !isTrancheBalanced}
                className={`w-full py-3 rounded-lg font-bold font-mono text-xs transition-all flex items-center justify-center gap-2 shadow-lg ${
                  isAlreadySettled
                    ? 'bg-[#1b1f2a] text-[#939183] border border-[#262a35] cursor-not-allowed'
                    : !hasValidSigner || !isTrancheBalanced
                    ? 'bg-[#262a35] text-[#939183] cursor-not-allowed'
                    : 'bg-[#c8c58f] hover:bg-[#e4e1a9] text-[#33320a] ring-2 ring-[#e4e1a9]/60 shadow-[0_0_20px_rgba(228,225,169,0.35)] hover:scale-[1.01] active:scale-[0.99] cursor-pointer'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                {isAlreadySettled
                  ? 'Transaction Already Finalized & Settled'
                  : `★ Step 8: Approve AI Settlement (${releaseAmount} CRD)`}
              </button>

              {!isAlreadySettled && (
                <button
                  type="button"
                  onClick={() => setIsModifying(!isModifying)}
                  className="w-full py-2 rounded-lg bg-[#1b1f2a] hover:bg-[#262a35] text-[#dfe2f0] border border-[#48473c] text-xs font-mono transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5 text-[#c8c58f]" />
                  {isModifying ? 'Lock Modifications' : 'Modify Tranche Amounts'}
                </button>
              )}

              {isAlreadySettled && (
                <button
                  type="button"
                  onClick={() => navigate(`/transactions/${tx.id}/settled`)}
                  className="w-full py-2 rounded-lg bg-[#1b1f2a] hover:bg-[#262a35] text-[#c8c58f] border border-[#c8c58f]/40 text-xs font-mono transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  View Final Settlement &amp; Parity Audit
                </button>
              )}
            </div>
          </div>

          {/* Economic Integrity Audit Tests */}
          <div className="bg-[#171b26] border border-[#262a35] rounded-xl p-5 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#262a35]">
              <div className="flex items-center gap-1.5 font-bold text-[#dfe2f0]">
                <ShieldCheck className="w-4 h-4 text-[#c8c58f]" />
                <span>Economic Integrity Audit Lab</span>
              </div>
              <span className="text-[10px] text-[#939183]">INVARIANT GUARDS</span>
            </div>
            <p className="text-[11px] text-[#cac7b8] leading-relaxed">
              Verify prototype resistance against accidental balance modification, double-settlement, and capital inflation:
            </p>

            <div className="grid grid-cols-1 gap-2 pt-1">
              <button
                type="button"
                onClick={() => triggerSimulatedIntegrityBreach('double_settle')}
                className="w-full px-3 py-1.5 rounded bg-[#1b1f2a] hover:bg-[#262a35] text-[#dfe2f0] border border-[#3b4a5d] text-left flex items-center justify-between text-[11px] transition-colors"
              >
                <span>Test Double Settlement Guard</span>
                <span className="text-[10px] text-[#ff8888]">Guard #2</span>
              </button>

              <button
                type="button"
                onClick={() => triggerSimulatedIntegrityBreach('excess_amount')}
                className="w-full px-3 py-1.5 rounded bg-[#1b1f2a] hover:bg-[#262a35] text-[#dfe2f0] border border-[#3b4a5d] text-left flex items-center justify-between text-[11px] transition-colors"
              >
                <span>Test Excess Disbursal Guard (&gt; Escrow)</span>
                <span className="text-[10px] text-[#ff8888]">Guard #4</span>
              </button>

              <button
                type="button"
                onClick={() => triggerSimulatedIntegrityBreach('unauthorized_state')}
                className="w-full px-3 py-1.5 rounded bg-[#1b1f2a] hover:bg-[#262a35] text-[#dfe2f0] border border-[#3b4a5d] text-left flex items-center justify-between text-[11px] transition-colors"
              >
                <span>Test Direct AI Execution Block</span>
                <span className="text-[10px] text-[#ff8888]">Guard #1</span>
              </button>

              <button
                type="button"
                onClick={() => triggerSimulatedIntegrityBreach('missing_signature')}
                className="w-full px-3 py-1.5 rounded bg-[#1b1f2a] hover:bg-[#262a35] text-[#dfe2f0] border border-[#3b4a5d] text-left flex items-center justify-between text-[11px] transition-colors"
              >
                <span>Test Missing Human Signature Block</span>
                <span className="text-[10px] text-[#ff8888]">Guard #1b</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
