import React, { useState } from 'react';
import { useEconomic } from '../context/EconomicContext';
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Cpu,
  ArrowRight,
  ShieldAlert,
  Lock,
  FileText,
  Scale,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export const ExceptionReviewScreen: React.FC = () => {
  const { tx, acceptAIRecommendation, navigate } = useEconomic();
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [disputeNote, setDisputeNote] = useState('');

  const m2 = tx.milestones.find((m) => m.id === 'm-2') || tx.milestones[1];

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Title */}
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
            <span className="text-[#feb26f] font-bold">EXCEPTION REVIEW</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#dfe2f0] flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-[#feb26f]" />
            Contract Exception Detected in Clause 4.2
          </h1>
          <p className="text-xs text-[#cac7b8] mt-1">
            Autonomous contract verification identified deliverable deficiencies under Section 4.2.3 and 4.2.4.
          </p>
        </div>

        <button
          onClick={() => navigate(`/transactions/${tx.id}`)}
          className="text-xs font-mono text-[#b8c8de] hover:underline self-start sm:self-auto"
        >
          ← Return to Transaction Details
        </button>
      </div>

      {/* Exception Overview Header Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#171b26] border border-[#feb26f]/40 rounded-xl p-4">
          <div className="text-[10px] font-mono text-[#939183]">CAPITAL UNDER DEFICIENCY RISK</div>
          <div className="text-2xl font-bold font-mono text-[#feb26f] mt-1">
            300.00 <span className="text-xs font-normal">CRD</span>
          </div>
          <div className="text-[11px] text-[#cac7b8] mt-1">
            Retained in protective escrow
          </div>
        </div>

        <div className="bg-[#171b26] border border-[#262a35] rounded-xl p-4">
          <div className="text-[10px] font-mono text-[#939183]">ELIGIBLE VERIFIED DISBURSAL</div>
          <div className="text-2xl font-bold font-mono text-[#e4e1a9] mt-1">
            700.00 <span className="text-xs font-normal">CRD</span>
          </div>
          <div className="text-[11px] text-[#cac7b8] mt-1">
            Approved for tranche settlement
          </div>
        </div>

        <div className="bg-[#171b26] border border-[#262a35] rounded-xl p-4">
          <div className="text-[10px] font-mono text-[#939183]">AI ARBITRATION CONFIDENCE</div>
          <div className="text-2xl font-bold font-mono text-[#c8c58f] mt-1">
            87.0% <span className="text-xs font-normal">Deterministic</span>
          </div>
          <div className="text-[11px] text-[#cac7b8] mt-1">
            AI verification runtime + contract bounds
          </div>
        </div>
      </div>

      {/* Clause 4.2 Deep Dive Inspection */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#171b26] border border-[#262a35] rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#262a35]">
              <div>
                <h3 className="text-sm font-bold text-[#dfe2f0]">
                  Clause 4.2 — Dynamic Multichannel Social Asset Package
                </h3>
                <p className="text-[11px] text-[#939183]">
                  Contract tranche weight: 400 CRD | Verification: 3 of 5 Delivered
                </p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#feb26f]/20 text-[#feb26f] border border-[#feb26f]/40">
                DEFICIENT_ARBITRATION
              </span>
            </div>

            {/* List of deliverables for M-2 */}
            <div className="space-y-3 font-mono text-xs">
              <div className="text-[11px] font-bold text-[#dfe2f0] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#c8c58f]" />
                VERIFIED ASSETS (3 DELIVERED)
              </div>

              <div className="space-y-2">
                {m2?.deliverables
                  .filter((d) => d.status === 'VERIFIED')
                  .map((d) => (
                    <div
                      key={d.id}
                      className="p-3 rounded-lg bg-[#1b1f2a] border border-[#262a35] flex items-center justify-between"
                    >
                      <div>
                        <div className="font-sans font-medium text-xs text-[#dfe2f0]">
                          {d.name}
                        </div>
                        <div className="text-[10px] text-[#939183] mt-0.5">
                          {d.aspectRatio} • {d.format} • {d.fileSize} • {d.hash}
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-[#c8c58f]/20 text-[#e4e1a9] text-[10px] font-bold">
                        VERIFIED
                      </span>
                    </div>
                  ))}
              </div>

              <div className="pt-2 text-[11px] font-bold text-[#ffb4ab] flex items-center gap-1.5">
                <XCircle className="w-3.5 h-3.5 text-[#ffb4ab]" />
                MISSING ASSETS (2 DEFICIENCIES IDENTIFIED)
              </div>

              <div className="space-y-2">
                {m2?.deliverables
                  .filter((d) => d.status === 'MISSING')
                  .map((d) => (
                    <div
                      key={d.id}
                      className="p-3 rounded-lg bg-[#93000a]/15 border border-[#ffb4ab]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div>
                        <div className="font-sans font-medium text-xs text-[#ffdad6]">
                          {d.name}
                        </div>
                        <div className="text-[10px] text-[#ffb4ab] mt-0.5">
                          {d.aspectRatio} • {d.notes}
                        </div>
                      </div>
                      <span className="self-start sm:self-auto px-2 py-0.5 rounded bg-[#ffb4ab]/20 text-[#ffb4ab] text-[10px] font-bold">
                        MISSING
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: AI Arbitration Assessment & Actions */}
        <div className="space-y-6">
          <div className="bg-[#171b26] border border-[#262a35] rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#262a35]">
              <div className="flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-[#c8c58f]" />
                <h3 className="text-sm font-bold text-[#dfe2f0]">
                  AI Operator Assessment
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#c8c58f] bg-[#1b1f2a] px-2 py-0.5 rounded border border-[#262a35]">
                {tx.aiVerification?.engine || 'Deterministic AI Runtime'}
              </span>
            </div>

            {/* 1. Finding */}
            <div className="p-3 rounded-lg bg-[#0a0e18] border border-[#262a35] space-y-1">
              <span className="text-[10px] font-mono text-[#939183] uppercase tracking-wider block">
                FINDING
              </span>
              <span className="text-xs font-mono text-[#feb26f] font-bold block">
                {tx.aiVerification?.finding || 'Partial fulfillment detected (2 missing motion assets)'}
              </span>
            </div>

            {/* 2. Evidence */}
            <div className="p-3 rounded-lg bg-[#0a0e18] border border-[#262a35] space-y-1.5">
              <span className="text-[10px] font-mono text-[#939183] uppercase tracking-wider block">
                EVIDENCE OBSERVED
              </span>
              <ul className="space-y-1">
                {(tx.aiVerification?.evidence || [
                  'Brand logo vector deliverable verified (Clause 2.1)',
                  'Brand guidelines document verified (Clause 2.1)',
                  '3 of 5 dynamic assets verified (Clause 4.2)',
                  'Missing 2 vertical 9:16 motion formats (Clause 4.2)',
                  'Master files held in escrow pending Clause 4.2',
                ]).map((ev, i) => (
                  <li key={i} className="text-[11px] font-mono text-[#dfe2f0] flex items-start gap-1.5 leading-tight">
                    <CheckCircle2 className="w-3 h-3 text-[#c8c58f] shrink-0 mt-0.5" />
                    <span>{ev}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 3. Recommendation */}
            <div className="p-3 rounded-lg bg-[#0a0e18] border border-[#262a35] space-y-1">
              <span className="text-[10px] font-mono text-[#939183] uppercase tracking-wider block">
                RECOMMENDATION
              </span>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#e4e1a9] uppercase">
                  {tx.aiVerification?.recommendation === 'release'
                    ? 'RELEASE 700 / HOLD 300'
                    : `${tx.aiVerification?.recommendation?.toUpperCase()} (${tx.aiVerification?.releaseAmount || 700} / ${tx.aiVerification?.holdAmount || 300})`}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#c8c58f]/20 text-[#e4e1a9]">
                  PROPOSED
                </span>
              </div>
            </div>

            {/* 4. Economic Impact */}
            <div className="p-3 rounded-lg bg-[#0a0e18] border border-[#262a35] space-y-2 text-xs font-mono">
              <span className="text-[10px] font-mono text-[#939183] uppercase tracking-wider block">
                ECONOMIC IMPACT
              </span>
              <div className="flex justify-between">
                <span className="text-[#939183]">Provider Release:</span>
                <span className="text-[#c8c58f] font-bold">
                  +{tx.aiVerification?.releaseAmount || 700} CRD gross (680 net)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#939183]">Escrow Retention:</span>
                <span className="text-[#feb26f] font-bold">
                  {tx.aiVerification?.holdAmount || 300} CRD in protective hold
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#939183]">Protocol Fee:</span>
                <span className="text-[#b8c8de]">+{tx.platformFee || 20} CRD</span>
              </div>
            </div>

            {/* 5. Confidence */}
            <div className="p-3 rounded-lg bg-[#0a0e18] border border-[#262a35] space-y-1 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-[10px] text-[#939183] uppercase tracking-wider">
                  CONFIDENCE
                </span>
                <span className="text-[#c8c58f] font-bold">
                  {tx.aiVerification?.confidence || 87}%
                </span>
              </div>
              <div className="w-full bg-[#171b26] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#c8c58f] h-full rounded-full"
                  style={{ width: `${tx.aiVerification?.confidence || 87}%` }}
                />
              </div>
            </div>

            {/* 6. Concise Rationale */}
            <div className="text-xs text-[#cac7b8] leading-relaxed bg-[#1b1f2a] p-3 rounded-lg border border-[#262a35] italic">
              "{tx.aiVerification?.rationale || 'The provider has fulfilled milestones representing 700 of 1,000 credits. The remaining 300 credits should remain in escrow until the missing deliverable is verified or the transaction enters dispute resolution.'}"
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={acceptAIRecommendation}
                className="w-full py-2.5 rounded-lg bg-[#c8c58f] hover:bg-[#e4e1a9] text-[#33320a] font-bold font-mono text-xs transition-all flex items-center justify-center gap-1.5 shadow-md ring-2 ring-[#e4e1a9]/50 hover:scale-[1.01] cursor-pointer"
              >
                <span>Step 6-8: Proceed to Settlement Approval (700 / 300)</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#33320a]" />
              </button>

              <button
                onClick={() => setShowDisputeModal(true)}
                className="w-full py-2 rounded-lg bg-[#1b1f2a] hover:bg-[#262a35] text-[#dfe2f0] border border-[#48473c] font-mono text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Scale className="w-3.5 h-3.5 text-[#feb26f]" />
                Simulate Dispute Escalation
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dispute Modal */}
      {showDisputeModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#171b26] border border-[#48473c] rounded-xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-[#dfe2f0] flex items-center gap-2">
              <Scale className="w-5 h-5 text-[#feb26f]" />
              Initiate Manual Dispute Procedure
            </h3>
            <p className="text-xs text-[#cac7b8]">
              Opening a dispute freezes all 1,000 CRD in escrow custody until human arbiters review raw asset packages.
            </p>
            <textarea
              value={disputeNote}
              onChange={(e) => setDisputeNote(e.target.value)}
              placeholder="Enter dispute justification..."
              rows={3}
              className="w-full bg-[#1b1f2a] border border-[#262a35] rounded-lg p-3 text-xs text-[#dfe2f0] focus:outline-none focus:border-[#e4e1a9]"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDisputeModal(false)}
                className="px-3 py-1.5 rounded bg-[#1b1f2a] text-xs font-mono text-[#cac7b8] hover:bg-[#262a35]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowDisputeModal(false);
                  acceptAIRecommendation();
                }}
                className="px-3 py-1.5 rounded bg-[#feb26f] text-xs font-bold font-mono text-[#33320a]"
              >
                Submit Formal Dispute
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
