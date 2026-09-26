import React, { useState } from 'react';
import { useEconomic } from '../context/EconomicContext';
import { ShieldCheck, AlertTriangle, CheckCircle2, Lock, Scale, FileText, ArrowRight, Eye } from 'lucide-react';

export const SettlementScreen: React.FC = () => {
  const { allTransactions, tx, approveSettlement, navigate } = useEconomic();

  const [selectedTxId, setSelectedTxId] = useState<string>(tx.id);
  const activeTx = allTransactions.find(t => t.id === selectedTxId) || tx;

  const [releaseAmount, setReleaseAmount] = useState<number>(
    activeTx.aiVerification?.releaseAmount ?? (activeTx.state === 'SETTLED' ? 700 : 700)
  );
  const [holdAmount, setHoldAmount] = useState<number>(
    activeTx.aiVerification?.holdAmount ?? (activeTx.state === 'SETTLED' ? 300 : 300)
  );
  const [operatorSigner, setOperatorSigner] = useState<string>('Sarah Chen (Clearing Officer)');
  const [validationWarning, setValidationWarning] = useState<string | null>(null);

  const totalAllocated = releaseAmount + holdAmount;
  const isTrancheBalanced = totalAllocated === (activeTx.escrowBalance || 1000);
  const isSettled = activeTx.state === 'SETTLED';

  const handleApprove = () => {
    if (isSettled) {
      setValidationWarning('Transaction is already settled and finalized in the ledger.');
      return;
    }
    if (!operatorSigner.trim()) {
      setValidationWarning('Human executive signature required.');
      return;
    }
    if (!isTrancheBalanced) {
      setValidationWarning(`Conservation Error: Sum of release (${releaseAmount}) and hold (${holdAmount}) must equal escrow (${activeTx.escrowBalance || 1000}).`);
      return;
    }

    setValidationWarning(null);
    approveSettlement(releaseAmount, holdAmount, operatorSigner);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
            <span>Credit Economy OS</span>
            <span>/</span>
            <span>Core Operations</span>
            <span>/</span>
            <span className="text-[#e4e1a9]">Settlement Clearing</span>
          </div>
          <h1 className="text-2xl font-semibold text-neutral-100 tracking-tight mt-1">
            Settlement Clearing & Dispute Resolution Console
          </h1>
          <p className="text-sm text-neutral-400 mt-1 max-w-3xl">
            Triage deliverable exceptions, review AI fulfillment recommendations, and execute dual-key cryptographic settlement disbursals.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/ledger')}
            className="px-3.5 py-1.5 text-xs font-medium text-neutral-300 bg-neutral-900 border border-neutral-700 hover:bg-neutral-800 rounded-md transition-colors"
          >
            Double-Entry Ledger
          </button>
        </div>
      </div>

      {/* Main Grid: Queue on Left, Clearing Workbench on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settlement Queue */}
        <div className="space-y-3">
          <div className="text-xs font-mono uppercase text-neutral-400 mb-2">
            Settlement Queue ({allTransactions.length})
          </div>

          {allTransactions.map(t => (
            <button
              key={t.id}
              onClick={() => {
                setSelectedTxId(t.id);
                setReleaseAmount(t.aiVerification?.releaseAmount ?? 700);
                setHoldAmount(t.aiVerification?.holdAmount ?? 300);
              }}
              className={`w-full text-left p-4 rounded-lg border transition-all ${
                selectedTxId === t.id
                  ? 'bg-neutral-800/80 border-[#e4e1a9] shadow-sm'
                  : 'bg-neutral-900/40 border-neutral-800 hover:bg-neutral-800/40'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-neutral-400">{t.id}</span>
                <span className={`px-2 py-0.5 rounded text-[11px] ${
                  t.state === 'SETTLED'
                    ? 'bg-emerald-950/60 text-emerald-400'
                    : t.state === 'EXCEPTION_DETECTED'
                    ? 'bg-red-950/60 text-red-300'
                    : 'bg-amber-950/60 text-amber-300'
                }`}>
                  {t.state}
                </span>
              </div>
              <div className="font-semibold text-neutral-100 text-sm mt-1">
                {t.title}
              </div>
              <div className="flex items-center justify-between text-xs text-neutral-400 mt-2 font-mono">
                <span>Payer: {t.payer.name}</span>
                <span className="text-[#ffd7b7] font-semibold">{t.totalValue} Credits</span>
              </div>
            </button>
          ))}
        </div>

        {/* Clearing Workbench */}
        <div className="lg:col-span-2 p-6 rounded-lg bg-neutral-900/40 border border-neutral-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800 pb-4">
            <div>
              <div className="text-xs font-mono text-neutral-400">
                Clearing Target: <span className="text-neutral-100 font-semibold">{activeTx.id}</span>
              </div>
              <h2 className="text-lg font-semibold text-neutral-100 mt-0.5">
                {activeTx.title}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate(`/transactions/${activeTx.id}`)}
                className="px-2.5 py-1 text-xs text-neutral-300 hover:text-neutral-100 bg-neutral-800 hover:bg-neutral-700 rounded transition-colors flex items-center gap-1 font-mono"
              >
                <Eye className="w-3.5 h-3.5" /> Inspect Verification
              </button>
            </div>
          </div>

          {/* AI Settlement Recommendation Insight */}
          {activeTx.aiVerification && (
            <div className="p-4 rounded-lg bg-neutral-900 border border-neutral-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#e4e1a9] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#e4e1a9]" />
                  AI Settlement Analyst Recommendation
                </span>
                <span className="font-mono text-neutral-400">
                  Confidence: {Math.round(activeTx.aiVerification.confidence * 100)}%
                </span>
              </div>
              <p className="text-xs text-neutral-300">
                {activeTx.aiVerification.finding}
              </p>
              <div className="text-xs font-mono text-neutral-400 pt-1 border-t border-neutral-800/80">
                Proposal: Release <span className="text-emerald-400 font-semibold">{activeTx.aiVerification.releaseAmount} CRD</span> · Hold <span className="text-amber-400 font-semibold">{activeTx.aiVerification.holdAmount} CRD</span>
              </div>
            </div>
          )}

          {/* Split Calculator */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-neutral-100">
              Disbursal Split Calculator & Conservation Check
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-neutral-400 uppercase mb-1">
                  Disbursal to Provider (Credits)
                </label>
                <input
                  type="number"
                  min="0"
                  max={activeTx.escrowBalance || 1000}
                  value={releaseAmount}
                  disabled={isSettled}
                  onChange={(e) => {
                    const r = Number(e.target.value);
                    setReleaseAmount(r);
                    setHoldAmount((activeTx.escrowBalance || 1000) - r);
                  }}
                  className="w-full bg-neutral-800 border border-neutral-700 text-neutral-100 px-3 py-2 rounded-md font-mono tabular-nums text-sm disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-400 uppercase mb-1">
                  Quarantine / Refund to Payer (Credits)
                </label>
                <input
                  type="number"
                  min="0"
                  max={activeTx.escrowBalance || 1000}
                  value={holdAmount}
                  disabled={isSettled}
                  onChange={(e) => {
                    const h = Number(e.target.value);
                    setHoldAmount(h);
                    setReleaseAmount((activeTx.escrowBalance || 1000) - h);
                  }}
                  className="w-full bg-neutral-800 border border-neutral-700 text-neutral-100 px-3 py-2 rounded-md font-mono tabular-nums text-sm disabled:opacity-50"
                />
              </div>
            </div>

            {/* Invariant Equation Box */}
            <div className="p-3 rounded bg-neutral-900 border border-neutral-800 text-xs font-mono flex items-center justify-between">
              <span className="text-neutral-400">
                Release ({releaseAmount}) + Hold ({holdAmount}) === Escrow ({activeTx.escrowBalance || 1000})
              </span>
              <span className={`font-semibold ${isTrancheBalanced ? 'text-emerald-400' : 'text-red-400'}`}>
                {isTrancheBalanced ? '✓ Balanced (100%)' : '✗ Unbalanced Disbursal'}
              </span>
            </div>

            {/* Signer Input */}
            <div>
              <label className="block text-xs font-mono text-neutral-400 uppercase mb-1">
                Authorizing Executive Signature
              </label>
              <input
                type="text"
                value={operatorSigner}
                disabled={isSettled}
                onChange={(e) => setOperatorSigner(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 text-neutral-100 px-3 py-2 rounded-md font-mono text-sm disabled:opacity-50"
              />
            </div>

            {validationWarning && (
              <div className="p-3 rounded bg-red-950/40 border border-red-800 text-xs text-red-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{validationWarning}</span>
              </div>
            )}

            {isSettled && (
              <div className="p-3 rounded bg-emerald-950/40 border border-emerald-800 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Transaction is finalized. Double-entry ledger settlement journal entries committed.</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
              <span className="text-xs text-neutral-400 font-mono">
                Platform Fee: {activeTx.platformFee || 20} Credits automatically retained
              </span>

              <button
                disabled={isSettled || !isTrancheBalanced}
                onClick={handleApprove}
                className={`px-4 py-2 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                  isSettled || !isTrancheBalanced
                    ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                    : 'text-black bg-[#e4e1a9] hover:bg-[#d8d598]'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                {isSettled ? 'Settlement Finalized' : 'Execute Settlement & Ledger Commit'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
