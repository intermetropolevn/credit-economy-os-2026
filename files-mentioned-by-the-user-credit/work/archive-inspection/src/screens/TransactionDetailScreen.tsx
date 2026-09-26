import React from 'react';
import { useEconomic } from '../context/EconomicContext';
import {
  Lock,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
  ExternalLink,
  ArrowRight,
  ShieldAlert,
  Loader2,
  FileCheck2,
  Layers,
  Sparkles,
  HelpCircle,
  UploadCloud,
} from 'lucide-react';

export const TransactionDetailScreen: React.FC = () => {
  const { currentPath, tx, isVerifying, submitDeliverables, runAIVerification, navigate } = useEconomic();

  const allDeliverables = tx.milestones.flatMap((m) => m.deliverables);
  const hasDeliverables = allDeliverables.length > 0;

  // Auto-run AI verification if navigating directly to /verify step
  React.useEffect(() => {
    if (currentPath.endsWith('/verify') && (tx.state === 'RESERVED' || tx.state === 'SUBMITTED') && !isVerifying) {
      runAIVerification();
    }
  }, [currentPath, tx.state, isVerifying]);

  return (
    <div className="space-y-6">
      {/* Top Banner & State Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#262a35]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#939183] mb-1">
            <span
              onClick={() => navigate('/transactions')}
              className="hover:underline cursor-pointer"
            >
              TRANSACTIONS
            </span>
            <span>/</span>
            <span className="text-[#dfe2f0] font-bold">{tx.id}</span>
          </div>

          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-[#dfe2f0]">
              {tx.title}
            </h1>
            <span
              className={`px-2.5 py-0.5 rounded text-xs font-mono font-semibold ${
                tx.state === 'SETTLED'
                  ? 'bg-[#c8c58f]/20 text-[#e4e1a9] border border-[#c8c58f]/40'
                  : tx.state === 'EXCEPTION_DETECTED'
                  ? 'bg-[#feb26f]/20 text-[#feb26f] border border-[#feb26f]/40'
                  : tx.state === 'SUBMITTED'
                  ? 'bg-[#3b4a5d]/40 text-[#dfe2f0] border border-[#3b4a5d]'
                  : 'bg-[#3b4a5d]/30 text-[#b8c8de] border border-[#3b4a5d]'
              }`}
            >
              STATE: {tx.state}
            </span>
          </div>
          <p className="text-xs text-[#cac7b8] mt-1">{tx.description}</p>
        </div>

        {/* Primary Interactive Actions */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {tx.state === 'RESERVED' && (
            <button
              onClick={submitDeliverables}
              className="flex items-center px-4 py-2 rounded-lg bg-[#c8c58f] hover:bg-[#e4e1a9] text-[#33320a] font-bold font-mono text-xs transition-colors shadow-sm cursor-pointer"
            >
              <UploadCloud className="w-4 h-4 mr-2 text-[#33320a]" />
              Submit Deliverables
            </button>
          )}

          {(tx.state === 'SUBMITTED' || tx.state === 'RESERVED') && (
            <button
              onClick={runAIVerification}
              disabled={isVerifying}
              className={`flex items-center px-4 py-2 rounded-lg font-mono text-xs transition-all ${
                tx.state === 'SUBMITTED'
                  ? 'bg-[#c8c58f] hover:bg-[#e4e1a9] text-[#33320a] font-bold shadow-lg ring-2 ring-[#e4e1a9]/60 shadow-[0_0_15px_rgba(228,225,169,0.3)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer'
                  : 'bg-[#1b1f2a] hover:bg-[#262a35] text-[#dfe2f0] border border-[#48473c]'
              }`}
            >
              {isVerifying ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin text-[#33320a]" />
                  AI Assistant Verifying Deliverables...
                </>
              ) : (
                <>
                  <Cpu className="w-3.5 h-3.5 mr-2 text-[#33320a]" />
                  Verify Deliverables (AI Assistant)
                </>
              )}
            </button>
          )}

          {['EXCEPTION_DETECTED', 'RECOMMENDED', 'APPROVED', 'SETTLED'].includes(tx.state) && (
            <button
              onClick={() => navigate(`/transactions/${tx.id}/exception`)}
              className="flex items-center px-4 py-2 rounded-lg bg-[#feb26f]/20 hover:bg-[#feb26f]/30 text-[#feb26f] border border-[#feb26f]/60 text-xs font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <AlertTriangle className="w-3.5 h-3.5 mr-1.5" />
              Review Exception (300 CRD Discrepancy)
            </button>
          )}

          {['EXCEPTION_DETECTED', 'RECOMMENDED', 'APPROVED', 'SETTLED'].includes(tx.state) && (
            <button
              onClick={() => {
                if (tx.state === 'SETTLED') {
                  navigate(`/transactions/${tx.id}/settled`);
                } else {
                  navigate(`/transactions/${tx.id}/settlement`);
                }
              }}
              className="flex items-center px-4 py-2 rounded-lg bg-[#c8c58f] hover:bg-[#e4e1a9] text-[#33320a] font-bold text-xs transition-all shadow-sm hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              {tx.state === 'SETTLED' ? 'View Final Settlement' : 'Review Recommendation & Settle'}
              <ArrowRight className="w-3.5 h-3.5 ml-1.5 text-[#33320a]" />
            </button>
          )}
        </div>
      </div>

      {/* Grid of Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Panels 01, 02, 03 */}
        <div className="lg:col-span-2 space-y-6">
          {/* Panel 01: Economic State & Capital Custody */}
          <div className="bg-[#171b26] border border-[#262a35] rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#262a35]">
              <div className="flex items-center space-x-2">
                <span className="w-5 h-5 rounded bg-[#1b1f2a] flex items-center justify-center text-[10px] font-mono text-[#e4e1a9] border border-[#48473c]">
                  01
                </span>
                <h3 className="text-sm font-bold text-[#dfe2f0]">
                  Economic State &amp; Capital Custody
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#c8c58f] bg-[#1b1f2a] px-2.5 py-0.5 rounded border border-[#262a35] font-semibold">
                STEP 3: 1,000 CRD RESERVED IN ESCROW
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 font-mono text-xs">
              <div className="p-3 rounded-lg bg-[#1b1f2a] border border-[#262a35]">
                <div className="text-[#939183] text-[10px]">TOTAL VALUE</div>
                <div className="text-lg font-bold text-[#e4e1a9] mt-0.5">
                  {tx.totalValue} CRD
                </div>
                <div className="text-[10px] text-[#939183] mt-1">Notional sum</div>
              </div>

              <div className="p-3 rounded-lg bg-[#1b1f2a] border border-[#c8c58f]/50 ring-1 ring-[#c8c58f]/40">
                <div className="text-[#c8c58f] text-[10px] font-bold flex items-center gap-1">
                  <Lock className="w-3 h-3 text-[#c8c58f]" />
                  IN ESCROW (2010.88)
                </div>
                <div className="text-xl font-bold text-[#e4e1a9] mt-0.5">
                  {tx.escrowBalance} CRD
                </div>
                <div className="text-[10px] text-[#c8c58f] mt-1 font-semibold">Encumbered in multi-sig</div>
              </div>

              <div className="p-3 rounded-lg bg-[#1b1f2a] border border-[#262a35]">
                <div className="text-[#939183] text-[10px]">PAYER (SARAH CHEN)</div>
                <div className="text-sm font-bold text-[#dfe2f0] mt-0.5">
                  {tx.payer.currentBalance} CRD
                </div>
                <div className="text-[10px] text-[#939183] mt-1">Avail: {tx.payer.currentBalance} CRD (debited 1,000)</div>
              </div>

              <div className="p-3 rounded-lg bg-[#1b1f2a] border border-[#262a35]">
                <div className="text-[#939183] text-[10px]">PROVIDER (ALEX MORGAN)</div>
                <div className="text-sm font-bold text-[#b8c8de] mt-0.5">
                  {tx.provider.currentBalance} CRD
                </div>
                <div className="text-[10px] text-[#939183] mt-1">
                  0 CRD prior to settlement
                </div>
              </div>
            </div>
          </div>

          {/* Panel 02: Contract Specifications & Tranches */}
          <div className="bg-[#171b26] border border-[#262a35] rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#262a35]">
              <div className="flex items-center space-x-2">
                <span className="w-5 h-5 rounded bg-[#1b1f2a] flex items-center justify-center text-[10px] font-mono text-[#e4e1a9] border border-[#48473c]">
                  02
                </span>
                <h3 className="text-sm font-bold text-[#dfe2f0]">
                  Contract Specifications &amp; Tranches
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#939183]">3 MILESTONES</span>
            </div>

            <div className="space-y-3">
              {tx.milestones.map((m, idx) => (
                <div
                  key={m.id}
                  className={`p-3.5 rounded-lg border text-xs ${
                    m.status === 'PARTIAL'
                      ? 'bg-[#1b1f2a] border-[#feb26f]/40'
                      : 'bg-[#1b1f2a] border-[#262a35]'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono">
                    <div className="flex items-center gap-2">
                      <span className="text-[#939183]">M-0{idx + 1}</span>
                      <span className="font-bold text-[#dfe2f0]">{m.title}</span>
                      <span className="text-[10px] text-[#939183]">({m.percentage}%)</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#e4e1a9]">{m.credits} CRD</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          m.status === 'VERIFIED'
                            ? 'bg-[#c8c58f]/20 text-[#e4e1a9]'
                            : m.status === 'PARTIAL'
                            ? 'bg-[#feb26f]/20 text-[#feb26f]'
                            : 'bg-[#313540] text-[#cac7b8]'
                        }`}
                      >
                        {m.status}
                      </span>
                    </div>
                  </div>

                  <div className="mt-1 text-[11px] font-mono text-[#939183] truncate">
                    {m.clause}
                  </div>

                  {m.verificationNote && (
                    <div className="mt-2 text-[11px] text-[#cac7b8] italic bg-[#0a0e18] p-2 rounded border border-[#262a35]">
                      {m.verificationNote}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Panel 03: Deliverables & Artifact Ingestion */}
          <div className="bg-[#171b26] border border-[#262a35] rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#262a35]">
              <div className="flex items-center space-x-2">
                <span className="w-5 h-5 rounded bg-[#1b1f2a] flex items-center justify-center text-[10px] font-mono text-[#e4e1a9] border border-[#48473c]">
                  03
                </span>
                <h3 className="text-sm font-bold text-[#dfe2f0]">
                  Deliverables &amp; Artifact Ingestion
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#939183]">
                {hasDeliverables ? `${allDeliverables.length} ASSETS LOGGED` : 'AWAITING UPLOAD'}
              </span>
            </div>

            {!hasDeliverables ? (
              <div className="p-6 rounded-lg bg-[#0a0e18] border border-[#262a35] text-center space-y-3">
                <UploadCloud className="w-8 h-8 mx-auto text-[#c8c58f]" />
                <div className="text-xs font-mono text-[#dfe2f0]">
                  Provider Deliverables Pending Ingestion
                </div>
                <p className="text-[11px] text-[#939183] max-w-sm mx-auto">
                  Sarah Chen's 1,000 CRD is secured in Escrow Account 2010.88.
                  Click below to simulate Alex Morgan submitting the contractual deliverables.
                </p>
                <button
                  onClick={submitDeliverables}
                  className="px-4 py-2 rounded-lg bg-[#c8c58f] hover:bg-[#e4e1a9] text-[#33320a] font-bold font-mono text-xs transition-colors shadow-sm cursor-pointer"
                >
                  Submit Deliverables (Simulate Ingestion)
                </button>
              </div>
            ) : (
              <div className="space-y-2 font-mono text-xs">
                {tx.milestones.flatMap((m) =>
                  m.deliverables.map((del) => (
                    <div
                      key={del.id}
                      className={`flex items-center justify-between p-2.5 rounded-lg border ${
                        del.status === 'MISSING'
                          ? 'bg-[#93000a]/10 border-[#ffb4ab]/40 text-[#ffb4ab]'
                          : del.status === 'PENDING'
                          ? 'bg-[#1b1f2a] border-[#262a35] text-[#939183]'
                          : 'bg-[#1b1f2a] border-[#262a35] text-[#dfe2f0]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        {del.status === 'VERIFIED' && (
                          <CheckCircle2 className="w-4 h-4 text-[#c8c58f] shrink-0" />
                        )}
                        {del.status === 'MISSING' && (
                          <AlertTriangle className="w-4 h-4 text-[#feb26f] shrink-0" />
                        )}
                        {del.status === 'PENDING' && (
                          <Lock className="w-4 h-4 text-[#939183] shrink-0" />
                        )}

                        <div className="truncate">
                          <div className="font-sans font-medium text-xs truncate">
                            {del.name}
                          </div>
                          <div className="text-[10px] text-[#939183] mt-0.5 truncate">
                            {del.aspectRatio} • {del.format} • {del.fileSize}
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0 ml-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            del.status === 'VERIFIED'
                              ? 'bg-[#c8c58f]/20 text-[#e4e1a9]'
                              : del.status === 'MISSING'
                              ? 'bg-[#ffb4ab]/20 text-[#ffb4ab]'
                              : 'bg-[#313540] text-[#939183]'
                          }`}
                        >
                          {del.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Panel 04 AI Verification Assistant & Timeline */}
        <div className="space-y-6">
          {/* Panel 04: AI Verification Assistant */}
          <div className="bg-[#171b26] border border-[#262a35] rounded-xl p-5 space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-[#262a35]">
              <div className="flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-[#c8c58f]" />
                <h3 className="text-sm font-bold text-[#dfe2f0]">
                  AI Verification Assistant
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#c8c58f]">
                {tx.aiVerification ? `${tx.aiVerification.confidence}% CONFIDENCE` : 'STANDBY'}
              </span>
            </div>

            {isVerifying ? (
              <div className="py-8 text-center space-y-3">
                <Loader2 className="w-8 h-8 mx-auto animate-spin text-[#e4e1a9]" />
                <div className="text-xs font-mono text-[#dfe2f0]">
                  Executing structured AI verification...
                </div>
                <div className="text-[11px] text-[#939183]">
                  Comparing submitted deliverables against Contract Clauses 2.1, 4.2, 6.1
                </div>
              </div>
            ) : tx.aiVerification ? (
              <div className="space-y-4">
                {/* 1. Finding */}
                <div className="p-3 rounded-lg bg-[#0a0e18] border border-[#262a35] space-y-2">
                  <div className="text-[10px] font-mono text-[#939183] uppercase tracking-wider">
                    01 // Finding
                  </div>
                  <div className="text-xs font-mono text-[#feb26f] font-bold">
                    {tx.aiVerification.finding}
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#939183] pt-1 border-t border-[#1b1f2a]">
                    <span>Fulfillment Score: {tx.aiVerification.fulfillmentScore}%</span>
                    <span className="capitalize px-1.5 py-0.5 rounded bg-[#feb26f]/20 text-[#feb26f]">
                      Risk: {tx.aiVerification.riskLevel}
                    </span>
                  </div>
                </div>

                {/* 2. Evidence */}
                <div className="p-3 rounded-lg bg-[#0a0e18] border border-[#262a35] space-y-2">
                  <div className="text-[10px] font-mono text-[#939183] uppercase tracking-wider">
                    02 // Verified Evidence
                  </div>
                  <ul className="space-y-1.5">
                    {tx.aiVerification.evidence && tx.aiVerification.evidence.length > 0 ? (
                      tx.aiVerification.evidence.map((item, idx) => (
                        <li key={idx} className="text-[11px] font-mono text-[#dfe2f0] flex items-start gap-1.5 leading-tight">
                          <CheckCircle2 className="w-3 h-3 text-[#c8c58f] shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-[11px] font-mono text-[#939183]">
                        Clause 2.1 vector assets verified, Clause 4.2 deficiency noted.
                      </li>
                    )}
                  </ul>
                </div>

                {/* 3. Recommendation */}
                <div className="p-3 rounded-lg bg-[#0a0e18] border border-[#262a35] space-y-2">
                  <div className="text-[10px] font-mono text-[#939183] uppercase tracking-wider">
                    03 // Economic Recommendation
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#c8c58f]/20 text-[#e4e1a9] uppercase border border-[#c8c58f]/40">
                      ACTION: {tx.aiVerification.recommendation}
                    </span>
                    <span className="text-xs font-mono font-bold text-[#dfe2f0]">
                      RELEASE {tx.aiVerification.releaseAmount} / HOLD {tx.aiVerification.holdAmount} CRD
                    </span>
                  </div>
                </div>

                {/* 4. Economic Impact */}
                <div className="p-3 rounded-lg bg-[#0a0e18] border border-[#262a35] space-y-2">
                  <div className="text-[10px] font-mono text-[#939183] uppercase tracking-wider">
                    04 // Economic Impact
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="p-2 rounded bg-[#171b26] border border-[#262a35]">
                      <div className="text-[10px] text-[#939183]">PROVIDER RELEASE</div>
                      <div className="text-[#c8c58f] font-bold mt-0.5">
                        +{tx.aiVerification.releaseAmount - (tx.platformFee || 20)} CRD Net
                      </div>
                      <div className="text-[9px] text-[#939183] mt-0.5">
                        ({tx.aiVerification.releaseAmount} CRD - {tx.platformFee || 20} fee)
                      </div>
                    </div>
                    <div className="p-2 rounded bg-[#171b26] border border-[#262a35]">
                      <div className="text-[10px] text-[#939183]">ESCROW RETAINED</div>
                      <div className="text-[#feb26f] font-bold mt-0.5">
                        {tx.aiVerification.holdAmount} CRD Held
                      </div>
                      <div className="text-[9px] text-[#939183] mt-0.5">
                        Protective custody
                      </div>
                    </div>
                  </div>
                </div>

                {/* 5. Confidence */}
                <div className="p-3 rounded-lg bg-[#0a0e18] border border-[#262a35] space-y-1.5 font-mono text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-[#939183] uppercase tracking-wider">
                      05 // Confidence Score
                    </span>
                    <span className="text-[#c8c58f] font-bold">
                      {tx.aiVerification.confidence}%
                    </span>
                  </div>
                  <div className="w-full bg-[#171b26] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#c8c58f] h-full rounded-full transition-all duration-500"
                      style={{ width: `${tx.aiVerification.confidence}%` }}
                    />
                  </div>
                </div>

                {/* 6. Concise Rationale */}
                <div className="p-3 rounded-lg bg-[#1b1f2a] border border-[#262a35] space-y-1">
                  <div className="text-[10px] font-mono text-[#939183] uppercase tracking-wider">
                    06 // Concise Rationale
                  </div>
                  <p className="text-xs text-[#cac7b8] leading-relaxed italic">
                    "{tx.aiVerification.rationale}"
                  </p>
                </div>

                {/* Validation Status Indicator */}
                <div className="flex items-center justify-between px-2.5 py-1.5 rounded bg-[#171b26] border border-[#262a35] text-[10px] font-mono">
                  <span className="text-[#939183] flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#c8c58f]" />
                    VALIDATION ENGINE
                  </span>
                  <span className="text-[#c8c58f] font-bold">
                    INVARIANTS CONSERVED (1,000 CRD)
                  </span>
                </div>

                <div className="pt-2 space-y-2">
                  <button
                    onClick={() => navigate(`/transactions/${tx.id}/exception`)}
                    className="w-full py-2.5 rounded-lg bg-[#feb26f]/20 hover:bg-[#feb26f]/30 text-[#feb26f] border border-[#feb26f]/60 text-xs font-mono font-bold transition-all hover:scale-[1.01] flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Step 5: Show Incomplete Fulfillment (Clause 4.2) →
                  </button>

                  <button
                    onClick={() => navigate(`/transactions/${tx.id}/settlement`)}
                    className="w-full py-2.5 rounded-lg bg-[#c8c58f] hover:bg-[#e4e1a9] text-[#33320a] text-xs font-mono font-bold transition-all hover:scale-[1.01] flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Cpu className="w-3.5 h-3.5" />
                    Step 6-8: View Recommendation (700/300) & Approve →
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-4 space-y-3 text-center">
                <p className="text-xs text-[#cac7b8]">
                  {tx.state === 'RESERVED'
                    ? '1,000 CRD reserved in escrow. Submit deliverables to initiate AI inspection.'
                    : 'Deliverables attached. Ready for autonomous AI contract adjudication.'}
                </p>
                <button
                  onClick={runAIVerification}
                  className="w-full py-2.5 rounded-lg bg-[#c8c58f] hover:bg-[#e4e1a9] text-[#33320a] font-bold font-mono text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Cpu className="w-3.5 h-3.5 text-[#33320a]" />
                  Run AI Verification
                </button>
              </div>
            )}
          </div>

          {/* Event Timeline */}
          <div className="bg-[#171b26] border border-[#262a35] rounded-xl p-5 space-y-4">
            <h4 className="text-sm font-bold text-[#dfe2f0] flex items-center gap-2 pb-3 border-b border-[#262a35]">
              <Clock className="w-4 h-4 text-[#b8c8de]" />
              Event Timeline &amp; State Audit
            </h4>

            <div className="space-y-4 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#262a35]">
              {tx.timeline.map((event) => (
                <div key={event.id} className="relative pl-6 text-xs space-y-0.5">
                  <span
                    className={`absolute left-0.5 top-1 w-3 h-3 rounded-full border-2 ${
                      event.status === 'completed'
                        ? 'bg-[#c8c58f] border-[#0f131d]'
                        : event.status === 'active'
                        ? 'bg-[#feb26f] border-[#0f131d] animate-pulse'
                        : 'bg-[#262a35] border-[#0f131d]'
                    }`}
                  />
                  <div className="flex items-center justify-between font-mono text-[10px]">
                    <span className="text-[#939183]">{event.timestamp}</span>
                    {event.badge && (
                      <span className="px-1.5 py-0.2 rounded bg-[#0a0e18] text-[#c8c58f] border border-[#262a35]">
                        {event.badge}
                      </span>
                    )}
                  </div>
                  <div className="font-semibold text-[#dfe2f0] font-sans">
                    {event.title}
                  </div>
                  <div className="text-[#939183] text-[11px] leading-relaxed">
                    {event.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
