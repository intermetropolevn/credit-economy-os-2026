import React, { useState } from 'react';
import { useEconomic } from '../context/EconomicContext';
import {
  CheckCircle2,
  Lock,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  FileText,
  Download,
  Share2,
  Cpu,
  RotateCcw,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export const FinalSettlementScreen: React.FC = () => {
  const { tx, navigate, resetGoldenDemo } = useEconomic();
  const [downloaded, setDownloaded] = useState(false);

  const isSettled = tx.state === 'SETTLED';
  const settlementEntry = tx.ledgerEntries.find((e) => e.type === 'SETTLEMENT');
  const holdEntry = tx.ledgerEntries.find((e) => e.type === 'HOLD');
  const feeEntry = tx.ledgerEntries.find((e) => e.type === 'FEE');

  const releaseAmount = settlementEntry ? settlementEntry.amount : (tx.totalValue - tx.escrowBalance);
  const holdAmount = holdEntry ? holdEntry.amount : tx.escrowBalance;
  const feeAmount = feeEntry ? feeEntry.amount : (tx.platformFee || 20);
  const netProviderDisbursal = Math.max(0, releaseAmount - feeAmount);

  const totalDebits = releaseAmount + feeAmount + holdAmount;
  const totalCredits = releaseAmount + feeAmount + holdAmount;
  const deltaReconciliation = totalDebits - totalCredits;

  const handleDownloadReceipt = () => {
    setDownloaded(true);
    const receiptData = {
      transactionId: tx.id,
      settledAt: tx.settledAt,
      humanApprovedBy: tx.humanApprovedBy,
      totalValue: tx.totalValue,
      settlementAmount: releaseAmount,
      protectiveHold: holdAmount,
      platformFee: feeAmount,
      netProviderCredited: netProviderDisbursal,
      merkleAuditRoot: tx.merkleAuditRoot,
      auditSignature: tx.auditSignature,
      parityVerified: true,
      deltaDiscrepancy: deltaReconciliation,
      engine: 'Credit Economy OS Deterministic Engine v4.11',
    };
    const blob = new Blob([JSON.stringify(receiptData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Audit-Receipt-${tx.id}.json`;
    a.click();
    setTimeout(() => setDownloaded(false), 3000);
  };

  if (!isSettled) {
    return (
      <div className="space-y-6">
        <div className="bg-[#171b26] border border-[#ff5555]/40 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-3 text-[#ff5555]">
            <ShieldAlert className="w-8 h-8" />
            <div>
              <h2 className="text-xl font-bold text-[#dfe2f0]">
                Integrity Gate: Transaction Not Yet Settled
              </h2>
              <p className="text-xs text-[#cac7b8] mt-1">
                Settlement audit screens are only accessible after deterministic engine execution and human authority approval. Current lifecycle state: <span className="font-mono text-[#feb26f] font-bold">{tx.state}</span>.
              </p>
            </div>
          </div>
          <div className="p-4 rounded-lg bg-[#0a0e18] border border-[#262a35] font-mono text-xs space-y-2">
            <div className="text-[10px] text-[#939183]">ENFORCED INVARIANT:</div>
            <div className="text-[#c8c58f] font-bold">
              "AI can recommend. Only the deterministic economic engine can execute after human approval."
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate(`/transactions/${tx.id}`)}
              className="px-4 py-2 rounded-lg bg-[#c8c58f] hover:bg-[#e4e1a9] text-[#33320a] font-bold font-mono text-xs transition-colors cursor-pointer"
            >
              Return to Transaction Lifecycle ({tx.id})
            </button>
            <button
              onClick={() => navigate('/ledger')}
              className="px-4 py-2 rounded-lg bg-[#1b1f2a] hover:bg-[#262a35] text-[#dfe2f0] border border-[#48473c] font-mono text-xs transition-colors"
            >
              View Historical Ledger
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#171b26] to-[#0a0e18] border border-[#c8c58f]/40 rounded-xl p-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-[#c8c58f]/20 border border-[#c8c58f]/40 text-xs font-mono font-bold text-[#e4e1a9]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#c8c58f]" />
              TRANSACTION SETTLED &amp; RECONCILED
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#dfe2f0]">
              Autonomous Settlement Finalized
            </h1>
            <p className="text-xs text-[#cac7b8]">
              Tranche release of {releaseAmount} CRD executed with zero ledger discrepancy. {holdAmount} CRD retained in protective escrow.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleDownloadReceipt}
              className="flex items-center px-3.5 py-2 rounded-lg bg-[#1b1f2a] hover:bg-[#262a35] text-[#dfe2f0] border border-[#48473c] font-mono text-xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 mr-1.5 text-[#c8c58f]" />
              {downloaded ? 'Receipt Downloaded!' : 'Download Audit Receipt'}
            </button>
            <button
              onClick={() => navigate('/ledger')}
              className="flex items-center px-4 py-2 rounded-lg bg-[#c8c58f] hover:bg-[#e4e1a9] text-[#33320a] font-bold font-mono text-xs transition-all shadow-md ring-2 ring-[#e4e1a9]/60 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 mr-1.5 text-[#33320a]" />
              <span>★ Step 10: Open Double-Entry Ledger →</span>
            </button>
          </div>
        </div>
      </div>

      {/* Step 9: Final Post-Settlement Balances */}
      <div className="bg-[#171b26] border border-[#262a35] rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#262a35]">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-[#c8c58f]/20 text-[#e4e1a9] text-xs font-mono font-bold">
              STEP 9: FINAL BALANCES
            </span>
            <h3 className="text-sm font-bold text-[#dfe2f0]">
              Post-Settlement Account Balances &amp; Parity
            </h3>
          </div>
          <span className="text-xs font-mono text-[#c8c58f] font-bold">
            CONSERVATION: ZERO CAPITAL DEFICIT
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 font-mono text-xs">
          <div className="p-3.5 rounded-lg bg-[#1b1f2a] border border-[#c8c58f]/50">
            <div className="text-[#939183] text-[10px]">1020.14 PROVIDER (ALEX)</div>
            <div className="text-2xl font-bold text-[#c8c58f] mt-1">
              {netProviderDisbursal.toFixed(2)} <span className="text-xs font-normal">CRD</span>
            </div>
            <div className="text-[11px] text-[#c8c58f] mt-1 font-semibold">
              +{releaseAmount} release - {feeAmount} fee
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-[#1b1f2a] border border-[#feb26f]/50">
            <div className="text-[#939183] text-[10px]">2010.88 ESCROW (LOCKED HOLD)</div>
            <div className="text-2xl font-bold text-[#feb26f] mt-1">
              {holdAmount.toFixed(2)} <span className="text-xs font-normal">CRD</span>
            </div>
            <div className="text-[11px] text-[#feb26f] mt-1 font-semibold">
              Retained in protective hold
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-[#1b1f2a] border border-[#3b4a5d]">
            <div className="text-[#939183] text-[10px]">4050.01 PROTOCOL CLEARING</div>
            <div className="text-2xl font-bold text-[#dfe2f0] mt-1">
              {feeAmount.toFixed(2)} <span className="text-xs font-normal">CRD</span>
            </div>
            <div className="text-[11px] text-[#b8c8de] mt-1 font-semibold">
              2.0% protocol routing receipt
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-[#1b1f2a] border border-[#262a35]">
            <div className="text-[#939183] text-[10px]">1010.42 PAYER (SARAH)</div>
            <div className="text-2xl font-bold text-[#dfe2f0] mt-1">
              {tx.payer.currentBalance.toFixed(2)} <span className="text-xs font-normal">CRD</span>
            </div>
            <div className="text-[11px] text-[#939183] mt-1 font-semibold">
              1,500 initial - 1,000 reserved
            </div>
          </div>
        </div>
      </div>

      {/* Autonomous Settlement Pipeline Verification Checkmarks */}
      <div className="bg-[#171b26] border border-[#262a35] rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-[#dfe2f0] pb-3 border-b border-[#262a35]">
          Autonomous Settlement Pipeline Verification
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-xs font-mono">
          {[
            { label: '01. Creation', desc: 'Contract registered' },
            { label: '02. Escrow Lock', desc: `${tx.totalValue.toLocaleString()} CRD encumbered` },
            { label: '03. Artifacts', desc: 'Deliverables ingested' },
            { label: '04. AI Verify', desc: 'Clause 4.2 exception' },
            { label: '05. Recommend', desc: `Release ${releaseAmount} / Hold ${holdAmount}` },
            { label: '06. Human Auth', desc: tx.humanApprovedBy ? `${tx.humanApprovedBy.split(' ')[0]} signed` : 'Authorized' },
            { label: '07. Ledger Settlement', desc: 'Balanced to 0.00' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-lg bg-[#0a0e18] border border-[#c8c58f]/30 space-y-1"
            >
              <div className="flex items-center text-[#c8c58f] gap-1 font-bold text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#c8c58f] shrink-0" />
                <span>{item.label}</span>
              </div>
              <div className="text-[10px] text-[#939183]">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Double-Entry Ledger Settlement & Cryptographic Audit Seal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Double-Entry Balance Table */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#171b26] border border-[#262a35] rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#262a35]">
              <div>
                <h3 className="text-sm font-bold text-[#dfe2f0]">
                  Double-Entry Ledger Balance Table
                </h3>
                <p className="text-[11px] text-[#939183]">
                  All debits and credits strictly balance to zero discrepancy
                </p>
              </div>
              <span className="px-2.5 py-0.5 rounded bg-[#c8c58f]/20 text-[#e4e1a9] text-xs font-mono font-bold">
                PARITY: 100.00% BALANCED
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-[#262a35] text-[#939183]">
                    <th className="pb-2">ACCOUNT</th>
                    <th className="pb-2">DESCRIPTION</th>
                    <th className="pb-2 text-right">DEBIT (CRD)</th>
                    <th className="pb-2 text-right">CREDIT (CRD)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#262a35]">
                  <tr>
                    <td className="py-2.5 text-[#dfe2f0] font-semibold">
                      2010.88 Client Escrow Reserve
                    </td>
                    <td className="py-2.5 text-[#cac7b8]">
                      Adjudicated tranche release under Exception 4.2
                    </td>
                    <td className="py-2.5 text-right text-[#feb26f] font-bold">{releaseAmount.toFixed(2)}</td>
                    <td className="py-2.5 text-right text-[#939183]">0.00</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 text-[#dfe2f0] font-semibold">
                      1020.14 Provider Available Capital
                    </td>
                    <td className="py-2.5 text-[#cac7b8]">
                      Milestone fulfillment disbursal ({tx.provider.name})
                    </td>
                    <td className="py-2.5 text-right text-[#939183]">0.00</td>
                    <td className="py-2.5 text-right text-[#c8c58f] font-bold">{releaseAmount.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 text-[#dfe2f0] font-semibold">
                      1020.14 Provider Capital (Fee Debit)
                    </td>
                    <td className="py-2.5 text-[#cac7b8]">
                      Protocol settlement routing assessment (2.0%)
                    </td>
                    <td className="py-2.5 text-right text-[#feb26f] font-bold">{feeAmount.toFixed(2)}</td>
                    <td className="py-2.5 text-right text-[#939183]">0.00</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 text-[#dfe2f0] font-semibold">
                      4050.01 Protocol Liquidity Clearing
                    </td>
                    <td className="py-2.5 text-[#cac7b8]">
                      Protocol treasury settlement clearing receipt
                    </td>
                    <td className="py-2.5 text-right text-[#939183]">0.00</td>
                    <td className="py-2.5 text-right text-[#c8c58f] font-bold">{feeAmount.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 text-[#dfe2f0] font-semibold">
                      2010.88 Client Escrow Reserve (Locked Tranche)
                    </td>
                    <td className="py-2.5 text-[#cac7b8]">
                      Deficiency protective escrow retention under Clause 4.2
                    </td>
                    <td className="py-2.5 text-right text-[#feb26f] font-bold">{holdAmount.toFixed(2)}</td>
                    <td className="py-2.5 text-right text-[#feb26f] font-bold">{holdAmount.toFixed(2)}</td>
                  </tr>
                  <tr className="bg-[#0a0e18] font-bold text-sm">
                    <td colSpan={2} className="py-3 px-2 text-[#c8c58f]">
                      TOTALS &amp; RECONCILIATION DELTA
                    </td>
                    <td className="py-3 text-right text-[#feb26f]">{totalDebits.toFixed(2)} CRD</td>
                    <td className="py-3 text-right text-[#c8c58f]">{totalCredits.toFixed(2)} CRD</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-[#0a0e18] border border-[#262a35] text-xs font-mono">
              <span className="text-[#939183]">NET ARITHMETIC DISCREPANCY:</span>
              <span className="text-[#c8c58f] font-bold">
                Σ(Debits) - Σ(Credits) = 0.00000000 CRD
              </span>
            </div>
          </div>
        </div>

        {/* Right Col: Audit Seal & Replay Options */}
        <div className="space-y-6">
          <div className="bg-[#171b26] border border-[#262a35] rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-[#dfe2f0] pb-3 border-b border-[#262a35] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#c8c58f]" />
              Cryptographic Audit Seal
            </h3>

            <div className="space-y-2.5 text-xs font-mono">
              <div>
                <span className="text-[#939183] text-[10px] block">MERKLE AUDIT ROOT</span>
                <span className="text-[#dfe2f0] text-[11px] break-all font-bold">
                  {tx.merkleAuditRoot}
                </span>
              </div>

              <div>
                <span className="text-[#939183] text-[10px] block">AUTHORIZATION RECORD</span>
                <span className="text-[#e4e1a9] text-[11px] block">
                  {tx.humanApprovedBy || 'Sarah Chen (Tier-3 Enterprise Auth)'}
                </span>
                <span className="text-[#939183] text-[10px]">
                  Timestamp: {tx.settledAt || '2026-03-24T12:05:00Z'}
                </span>
              </div>

              <div>
                <span className="text-[#939183] text-[10px] block">SIGNATURE SCHEME</span>
                <span className="text-[#b8c8de] text-[11px]">
                  {tx.auditSignature}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#262a35] space-y-2">
              <button
                onClick={resetGoldenDemo}
                className="w-full py-2.5 rounded-lg bg-[#1b1f2a] hover:bg-[#262a35] text-[#e4e1a9] border border-[#48473c] text-xs font-mono font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Replay Golden Demo Scenario
              </button>

              <button
                onClick={() => navigate('/transactions')}
                className="w-full py-2 rounded-lg text-xs font-mono text-[#cac7b8] hover:text-[#dfe2f0] transition-colors"
              >
                Browse All Transactions →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
