import React, { useState } from 'react';
import { useEconomic } from '../context/EconomicContext';
import { CreditType } from '../types';
import { Plus, ArrowRight, Shield, Clock, AlertTriangle, Filter, Layers, DollarSign } from 'lucide-react';

export const CreditTypesScreen: React.FC = () => {
  const { creditTypes, setSelectedCreditTypeId, navigate, runSimulationOnObject } = useEconomic();
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const filteredTypes = filterCategory === 'ALL'
    ? creditTypes
    : creditTypes.filter(ct => ct.category === filterCategory);

  const totalCirculating = creditTypes.reduce((acc, ct) => acc + ct.activeSupply, 0);
  const totalLiabilityUsd = creditTypes.reduce((acc, ct) => acc + (ct.reservedLiability * ct.conversionRateUsd), 0);

  const handleSelectDetail = (ct: CreditType) => {
    setSelectedCreditTypeId(ct.id);
    navigate(`/credit-types/${ct.id}`);
  };

  const handleSimulateExpiry = (ct: CreditType, e: React.MouseEvent) => {
    e.stopPropagation();
    runSimulationOnObject({
      title: `Expiry Policy Compression for ${ct.name}`,
      targetObject: `CreditType / ${ct.code}`,
      parameter: 'TTL Expiry Days',
      currentValue: `${ct.expiryDays > 0 ? `${ct.expiryDays} Days` : 'Non-expiring'}`,
      proposedValue: `${Math.max(7, Math.floor(ct.expiryDays / 2))} Days`,
      affectedUsers: 18500,
      liabilityDelta: -450000,
      marginDelta: 3.2,
      shiftDays: 14,
      riskScore: 'Low (+1.2%)',
      confidence: 'PROJECTED',
      missingData: 'Cohort redemption rate elasticity required for precise churn estimation.',
    });
    navigate('/simulation');
  };

  return (
    <div className="space-y-6">
      {/* Header and Operational Job Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
            <span>Credit Economy OS</span>
            <span>/</span>
            <span>Configuration Plane</span>
            <span>/</span>
            <span className="text-[#e4e1a9]">Credit Types</span>
          </div>
          <h1 className="text-2xl font-semibold text-neutral-100 tracking-tight mt-1">
            Programmable Value Classes & Tokenomics
          </h1>
          <p className="text-sm text-neutral-400 mt-1 max-w-3xl">
            Governs fungibility, spend waterfall order, fiat liability backing, and expiry amortizations across all credit instruments in circulation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/simulation')}
            className="px-3.5 py-1.5 text-xs font-medium text-neutral-300 bg-neutral-900 border border-neutral-700 hover:bg-neutral-800 rounded-md transition-colors"
          >
            Simulation Engine
          </button>
          <button
            onClick={() => navigate('/reward-rule-builder')}
            className="px-3.5 py-1.5 text-xs font-medium text-black bg-[#e4e1a9] hover:bg-[#d8d598] rounded-md transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            New Emission Rule
          </button>
        </div>
      </div>

      {/* Aggregate Balance & Reserve Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg bg-neutral-900/60 border border-neutral-800">
          <div className="text-xs text-neutral-400">Active Circulating Supply</div>
          <div className="text-xl font-mono tabular-nums font-semibold text-neutral-100 mt-1">
            {totalCirculating.toLocaleString()} <span className="text-xs font-sans text-neutral-400">Credits</span>
          </div>
          <div className="text-xs text-neutral-400 mt-2 flex items-center gap-1.5">
            <span>4 Classes</span>
            <span>·</span>
            <span>FIFO Waterfall Active</span>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-neutral-900/60 border border-neutral-800">
          <div className="text-xs text-neutral-400">Reserved Liability (In Escrow)</div>
          <div className="text-xl font-mono tabular-nums font-semibold text-[#ffd7b7] mt-1">
            ${totalLiabilityUsd.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-neutral-400 mt-2 flex items-center gap-1.5">
            <span>Backing: 100% Cash/SLA</span>
            <span>·</span>
            <span>Solvent</span>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-neutral-900/60 border border-neutral-800">
          <div className="text-xs text-neutral-400">Waterfall Priority Architecture</div>
          <div className="text-sm font-medium text-neutral-200 mt-1">
            Promo (P1) → Sponsored (P2) → Ecosystem (P3) → Paid (P4)
          </div>
          <div className="text-xs text-emerald-400 mt-2">
            Protects customer cash balance
          </div>
        </div>

        <div className="p-4 rounded-lg bg-neutral-900/60 border border-neutral-800">
          <div className="text-xs text-neutral-400">Invariant Health</div>
          <div className="text-sm font-medium text-emerald-400 mt-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Double-Entry Parity Guaranteed
          </div>
          <div className="text-xs text-neutral-400 mt-2">
            Conservation equation verified
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-1 p-1 bg-neutral-900 rounded-lg border border-neutral-800">
          {['ALL', 'PAID', 'PROMOTIONAL', 'SPONSORED', 'ECOSYSTEM'].map(category => (
            <button
              key={category}
              onClick={() => setFilterCategory(category)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                filterCategory === category
                  ? 'bg-neutral-800 text-neutral-100 shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {category === 'ALL' ? 'All Classes' : category}
            </button>
          ))}
        </div>

        <div className="text-xs text-neutral-400">
          Showing {filteredTypes.length} configured credit types
        </div>
      </div>

      {/* Credit Types Table */}
      <div className="rounded-lg border border-neutral-800 bg-neutral-900/40 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-900/90 text-neutral-400 text-xs font-mono uppercase tracking-wider border-b border-neutral-800">
            <tr>
              <th className="py-3 px-4">Code / Classification</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4 text-right">Waterfall Prio</th>
              <th className="py-3 px-4">Expiry Policy</th>
              <th className="py-3 px-4 text-right">Circulating Supply</th>
              <th className="py-3 px-4 text-right">Escrow Reserved</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/80 text-neutral-300">
            {filteredTypes.map(ct => (
              <tr
                key={ct.id}
                onClick={() => handleSelectDetail(ct)}
                className="hover:bg-neutral-800/40 cursor-pointer transition-colors group"
              >
                <td className="py-3.5 px-4">
                  <div className="font-semibold text-neutral-100 group-hover:text-[#e4e1a9] transition-colors">
                    {ct.name}
                  </div>
                  <div className="text-xs font-mono text-neutral-400 mt-0.5">
                    {ct.code} · {ct.fungibility.replace('_', ' ')}
                  </div>
                </td>

                <td className="py-3.5 px-4 text-xs font-mono text-neutral-300">
                  {ct.category}
                </td>

                <td className="py-3.5 px-4 text-right font-mono tabular-nums">
                  <span className="inline-block px-2 py-0.5 rounded bg-neutral-800 text-neutral-200 text-xs font-medium">
                    P{ct.spendPriority}
                  </span>
                </td>

                <td className="py-3.5 px-4 text-xs">
                  {ct.expiryDays > 0 ? (
                    <span className="text-amber-300/90 font-mono tabular-nums">
                      {ct.expiryDays}d FIFO rolling
                    </span>
                  ) : (
                    <span className="text-neutral-400">Non-expiring</span>
                  )}
                </td>

                <td className="py-3.5 px-4 text-right font-mono tabular-nums text-neutral-200">
                  {ct.activeSupply.toLocaleString()}
                </td>

                <td className="py-3.5 px-4 text-right font-mono tabular-nums text-[#ffd7b7]">
                  {ct.reservedLiability.toLocaleString()}
                </td>

                <td className="py-3.5 px-4 text-xs font-mono">
                  <span className={`inline-flex items-center gap-1 ${
                    ct.status === 'ACTIVE' ? 'text-emerald-400' : 'text-neutral-400'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      ct.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-neutral-500'
                    }`} />
                    {ct.status}
                  </span>
                </td>

                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-2" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={(e) => handleSimulateExpiry(ct, e)}
                      className="px-2 py-1 text-xs text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 rounded transition-colors"
                      title="Run impact simulation before changing policy"
                    >
                      Simulate
                    </button>
                    <button
                      onClick={() => handleSelectDetail(ct)}
                      className="p-1 text-neutral-400 hover:text-[#e4e1a9] rounded transition-colors"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Operational Job Clarification Note */}
      <div className="p-4 rounded-lg bg-neutral-900/30 border border-neutral-800/80 text-xs text-neutral-400 flex items-start gap-3">
        <Shield className="w-4 h-4 text-[#e4e1a9] mt-0.5 shrink-0" />
        <div>
          <span className="font-semibold text-neutral-200">Economic Control Principle:</span> Changes to Credit Types (such as modifying expiry days or spend waterfall priority) alter outstanding balance sheet liabilities. All parameter edits automatically route to the Simulation Sandbox for impact analysis before ledger commit.
        </div>
      </div>
    </div>
  );
};
