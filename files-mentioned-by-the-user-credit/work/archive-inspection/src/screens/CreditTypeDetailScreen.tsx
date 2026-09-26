import React, { useState } from 'react';
import { useEconomic } from '../context/EconomicContext';
import { ArrowLeft, Shield, Clock, AlertTriangle, Layers, DollarSign, Activity, Play, CheckCircle2 } from 'lucide-react';

export const CreditTypeDetailScreen: React.FC = () => {
  const {
    creditTypes,
    selectedCreditTypeId,
    updateCreditType,
    navigate,
    runSimulationOnObject,
    spendProducts,
    auditLogs
  } = useEconomic();

  const creditType = creditTypes.find(ct => ct.id === selectedCreditTypeId) || creditTypes[0];

  const [editExpiryDays, setEditExpiryDays] = useState(creditType.expiryDays);
  const [editPriority, setEditPriority] = useState(creditType.spendPriority);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const relatedAudits = auditLogs.filter(a => a.objectId === creditType.id || a.objectId === creditType.code);

  const handleSimulateChange = () => {
    runSimulationOnObject({
      title: `Policy Modification for ${creditType.name}`,
      targetObject: `CreditType / ${creditType.code}`,
      parameter: `Expiry (${creditType.expiryDays}d → ${editExpiryDays}d), Priority (P${creditType.spendPriority} → P${editPriority})`,
      currentValue: `${creditType.expiryDays} days, P${creditType.spendPriority}`,
      proposedValue: `${editExpiryDays} days, P${editPriority}`,
      affectedUsers: creditType.category === 'PROMOTIONAL' ? 38500 : 12400,
      liabilityDelta: editExpiryDays < creditType.expiryDays ? -820000 : 250000,
      marginDelta: editExpiryDays < creditType.expiryDays ? 4.5 : -1.8,
      shiftDays: editExpiryDays < creditType.expiryDays ? 28 : -14,
      riskScore: 'Moderate (Elasticity sensitivity 0.62)',
      confidence: 'ESTIMATED',
      missingData: '30-day cohort churn curve required for exact financial break-even.',
    });
    navigate('/simulation');
  };

  const handleDirectSave = () => {
    updateCreditType(creditType.id, {
      expiryDays: Number(editExpiryDays),
      spendPriority: Number(editPriority),
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleToggleFreeze = () => {
    const nextStatus = creditType.status === 'ACTIVE' ? 'FROZEN' : 'ACTIVE';
    updateCreditType(creditType.id, { status: nextStatus });
  };

  return (
    <div className="space-y-6">
      {/* Header and Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <button
            onClick={() => navigate('/credit-types')}
            className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-200 transition-colors mb-2 font-mono"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Credit Types
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-neutral-100 tracking-tight">
              {creditType.name}
            </h1>
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">
              {creditType.code}
            </span>
            <span className={`inline-flex items-center gap-1 text-xs font-mono ${
              creditType.status === 'ACTIVE' ? 'text-emerald-400' : 'text-amber-400'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${
                creditType.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-amber-500'
              }`} />
              {creditType.status}
            </span>
          </div>
          <p className="text-sm text-neutral-400 mt-1 max-w-2xl">
            {creditType.description}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleFreeze}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors border ${
              creditType.status === 'ACTIVE'
                ? 'bg-red-950/40 border-red-800 text-red-300 hover:bg-red-900/50'
                : 'bg-emerald-950/40 border-emerald-800 text-emerald-300 hover:bg-emerald-900/50'
            }`}
          >
            {creditType.status === 'ACTIVE' ? 'Freeze Issuance' : 'Unfreeze Class'}
          </button>
          <button
            onClick={handleSimulateChange}
            className="px-3.5 py-1.5 text-xs font-medium text-black bg-[#e4e1a9] hover:bg-[#d8d598] rounded-md transition-colors flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-black" />
            Simulate Proposed Changes
          </button>
        </div>
      </div>

      {/* Financial Exposure Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg bg-neutral-900/60 border border-neutral-800">
          <div className="text-xs text-neutral-400">Circulating Supply</div>
          <div className="text-xl font-mono tabular-nums font-semibold text-neutral-100 mt-1">
            {creditType.activeSupply.toLocaleString()}
          </div>
          <div className="text-xs text-neutral-400 mt-2 font-mono">
            Liability: ${(creditType.activeSupply * creditType.conversionRateUsd).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
        </div>

        <div className="p-4 rounded-lg bg-neutral-900/60 border border-neutral-800">
          <div className="text-xs text-neutral-400">Escrow Reserved Balance</div>
          <div className="text-xl font-mono tabular-nums font-semibold text-[#ffd7b7] mt-1">
            {creditType.reservedLiability.toLocaleString()}
          </div>
          <div className="text-xs text-neutral-400 mt-2 font-mono">
            ${(creditType.reservedLiability * creditType.conversionRateUsd).toLocaleString(undefined, { minimumFractionDigits: 2 })} encumbered
          </div>
        </div>

        <div className="p-4 rounded-lg bg-neutral-900/60 border border-neutral-800">
          <div className="text-xs text-neutral-400">Lifetime Cumulative Burned</div>
          <div className="text-xl font-mono tabular-nums font-semibold text-neutral-200 mt-1">
            {creditType.totalBurned.toLocaleString()}
          </div>
          <div className="text-xs text-neutral-400 mt-2">
            Redeemed in runtime execution
          </div>
        </div>

        <div className="p-4 rounded-lg bg-neutral-900/60 border border-neutral-800">
          <div className="text-xs text-neutral-400">Conversion Parity</div>
          <div className="text-xl font-mono tabular-nums font-semibold text-neutral-100 mt-1">
            ${creditType.conversionRateUsd.toFixed(2)} <span className="text-xs font-sans text-neutral-400">/ Credit</span>
          </div>
          <div className="text-xs text-emerald-400 mt-2">
            Strict 100:1 USD Peg
          </div>
        </div>
      </div>

      {/* Policy Configuration & Ledger Accounts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Policy Parameters */}
        <div className="p-5 rounded-lg bg-neutral-900/40 border border-neutral-800 space-y-4">
          <h2 className="text-base font-semibold text-neutral-100">
            Runtime Policy Parameters
          </h2>

          <div className="space-y-4 text-sm">
            <div>
              <label className="block text-xs font-mono text-neutral-400 uppercase mb-1">
                Waterfall Spend Priority (Lower number = Spent First)
              </label>
              <select
                value={editPriority}
                onChange={(e) => setEditPriority(Number(e.target.value))}
                className="w-full bg-neutral-800 border border-neutral-700 text-neutral-100 px-3 py-2 rounded-md text-sm font-mono"
              >
                <option value={1}>P1 - Highest Priority (First spent in FIFO)</option>
                <option value={2}>P2 - Secondary Subsidized Pool</option>
                <option value={3}>P3 - Ecosystem Grant Pool</option>
                <option value={4}>P4 - Paid Customer Balance (Protected Cash Pool)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-neutral-400 uppercase mb-1">
                Expiration Horizon (Days, 0 = Non-expiring)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="0"
                  max="365"
                  value={editExpiryDays}
                  onChange={(e) => setEditExpiryDays(Number(e.target.value))}
                  className="w-32 bg-neutral-800 border border-neutral-700 text-neutral-100 px-3 py-2 rounded-md text-sm font-mono tabular-nums"
                />
                <span className="text-xs text-neutral-400">
                  {editExpiryDays === 0 ? 'Indefinite validity' : 'Rolling FIFO expiry from issuance date'}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-neutral-400 uppercase mb-1">
                Fungibility Mode
              </label>
              <div className="p-2.5 rounded bg-neutral-800/80 border border-neutral-700/80 font-mono text-xs text-neutral-200">
                {creditType.fungibility}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-neutral-800">
              <span className="text-xs text-neutral-400">
                Requires simulation approval for production commit
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSimulateChange}
                  className="px-3 py-1.5 text-xs text-neutral-300 hover:text-neutral-100 bg-neutral-800 hover:bg-neutral-700 rounded transition-colors"
                >
                  Preview Simulation
                </button>
                <button
                  onClick={handleDirectSave}
                  className="px-3.5 py-1.5 text-xs font-medium text-black bg-[#e4e1a9] hover:bg-[#d8d598] rounded transition-colors flex items-center gap-1"
                >
                  Save Policy
                </button>
              </div>
            </div>

            {saveSuccess && (
              <div className="p-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800 rounded flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Policy updated and recorded in audit journal.
              </div>
            )}
          </div>
        </div>

        {/* Financial & Ledger Mapping */}
        <div className="p-5 rounded-lg bg-neutral-900/40 border border-neutral-800 space-y-4">
          <h2 className="text-base font-semibold text-neutral-100">
            Double-Entry Ledger Account Mapping
          </h2>

          <div className="space-y-3 text-xs font-mono">
            <div className="p-3 rounded bg-neutral-900 border border-neutral-800">
              <div className="text-neutral-400">Primary Escrow Account (DR/CR)</div>
              <div className="text-neutral-100 text-sm mt-0.5">2010.88 - Escrow Clearing Reserve</div>
              <div className="text-neutral-500 mt-1 font-sans">
                Temporarily holds debited credits while runtime job executes.
              </div>
            </div>

            <div className="p-3 rounded bg-neutral-900 border border-neutral-800">
              <div className="text-neutral-400">Unearned Liability Account</div>
              <div className="text-neutral-100 text-sm mt-0.5">2020.14 - Customer Unearned Credit Balance</div>
              <div className="text-neutral-500 mt-1 font-sans">
                Balance sheet liability representing outstanding unspent credits.
              </div>
            </div>

            <div className="p-3 rounded bg-neutral-900 border border-neutral-800">
              <div className="text-neutral-400">Allowed Spend Product Whitelist</div>
              <div className="flex flex-wrap gap-1.5 mt-1.5 font-sans">
                {creditType.allowedSpendProducts.includes('*') ? (
                  <span className="px-2 py-0.5 rounded bg-emerald-950/50 border border-emerald-800/80 text-emerald-300 text-xs">
                    All Spend Products Permitted (*)
                  </span>
                ) : (
                  creditType.allowedSpendProducts.map(spCode => (
                    <span key={spCode} className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-200 text-xs">
                      {spCode}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Historical Audit Trail for this Credit Type */}
      <div className="rounded-lg border border-neutral-800 bg-neutral-900/40 p-5 space-y-3">
        <h2 className="text-base font-semibold text-neutral-100">
          Governance & Audit Log for {creditType.code}
        </h2>
        <div className="divide-y divide-neutral-800/80 text-xs font-mono">
          {relatedAudits.length > 0 ? (
            relatedAudits.map(aud => (
              <div key={aud.id} className="py-2.5 flex items-center justify-between text-neutral-300">
                <div>
                  <span className="text-neutral-400">{aud.timestamp.slice(0, 19)}</span> ·{' '}
                  <span className="text-neutral-100 font-semibold">{aud.actor}</span> ({aud.role}) ·{' '}
                  <span className="text-[#e4e1a9]">{aud.action}</span>
                </div>
                <div className="text-neutral-500">
                  {aud.signatureHash}
                </div>
              </div>
            ))
          ) : (
            <div className="py-3 text-neutral-500 font-sans">
              No recent administrative policy modifications recorded for this credit instrument.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
