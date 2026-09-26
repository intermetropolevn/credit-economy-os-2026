import React, { useState } from 'react';
import { useEconomic } from '../context/EconomicContext';
import { BudgetEnvelope } from '../types';
import { AlertTriangle, ShieldCheck, CheckCircle2, TrendingUp, Bell, Plus, Settings } from 'lucide-react';

export const BudgetScreen: React.FC = () => {
  const { budgetEnvelopes, updateBudgetEnvelope, creditTypes, navigate } = useEconomic();

  const totalAllocated = budgetEnvelopes.reduce((acc, b) => acc + b.allocatedCredits, 0);
  const totalConsumed = budgetEnvelopes.reduce((acc, b) => acc + b.consumedCredits, 0);
  const overallUtilization = Math.round((totalConsumed / totalAllocated) * 100);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [newCapacity, setNewCapacity] = useState<number>(0);

  const handleStartEdit = (b: BudgetEnvelope) => {
    setEditingId(b.id);
    setNewCapacity(b.allocatedCredits);
  };

  const handleSaveCapacity = (id: string) => {
    updateBudgetEnvelope(id, {
      allocatedCredits: Number(newCapacity),
    });
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
            <span>Credit Economy OS</span>
            <span>/</span>
            <span>Issuance & Emissions</span>
            <span>/</span>
            <span className="text-[#e4e1a9]">Budget Envelopes</span>
          </div>
          <h1 className="text-2xl font-semibold text-neutral-100 tracking-tight mt-1">
            Departmental & Campaign Budget Envelopes
          </h1>
          <p className="text-sm text-neutral-400 mt-1 max-w-3xl">
            Hard financial caps and soft-threshold governors. No reward rule can emit credits without active linkage to an authorized budget envelope.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/reward-rules')}
            className="px-3.5 py-1.5 text-xs font-medium text-neutral-300 bg-neutral-900 border border-neutral-700 hover:bg-neutral-800 rounded-md transition-colors"
          >
            Linked Reward Rules
          </button>
          <button
            onClick={() => navigate('/simulation')}
            className="px-3.5 py-1.5 text-xs font-medium text-black bg-[#e4e1a9] hover:bg-[#d8d598] rounded-md transition-colors"
          >
            Simulate Exhaustion Velocity
          </button>
        </div>
      </div>

      {/* Aggregate Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg bg-neutral-900/60 border border-neutral-800">
          <div className="text-xs text-neutral-400">Total Authorized Budget</div>
          <div className="text-xl font-mono tabular-nums font-semibold text-neutral-100 mt-1">
            {totalAllocated.toLocaleString()} <span className="text-xs font-sans text-neutral-400">Credits</span>
          </div>
          <div className="text-xs text-neutral-400 mt-2 font-mono">
            ${(totalAllocated * 0.01).toLocaleString(undefined, { minimumFractionDigits: 2 })} Max Authorized
          </div>
        </div>

        <div className="p-4 rounded-lg bg-neutral-900/60 border border-neutral-800">
          <div className="text-xs text-neutral-400">Consumed Supply</div>
          <div className="text-xl font-mono tabular-nums font-semibold text-[#e4e1a9] mt-1">
            {totalConsumed.toLocaleString()}
          </div>
          <div className="text-xs text-neutral-400 mt-2 font-mono">
            ${(totalConsumed * 0.01).toLocaleString(undefined, { minimumFractionDigits: 2 })} Disbursed
          </div>
        </div>

        <div className="p-4 rounded-lg bg-neutral-900/60 border border-neutral-800">
          <div className="text-xs text-neutral-400">Overall Utilization Rate</div>
          <div className="text-xl font-mono tabular-nums font-semibold text-neutral-100 mt-1">
            {overallUtilization}%
          </div>
          <div className="text-xs text-amber-400 mt-2 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> 1 Envelope in Soft-Cap Throttle
          </div>
        </div>

        <div className="p-4 rounded-lg bg-neutral-900/60 border border-neutral-800">
          <div className="text-xs text-neutral-400">Remaining Safe Float</div>
          <div className="text-xl font-mono tabular-nums font-semibold text-emerald-400 mt-1">
            {(totalAllocated - totalConsumed).toLocaleString()}
          </div>
          <div className="text-xs text-neutral-400 mt-2 font-mono">
            ${((totalAllocated - totalConsumed) * 0.01).toLocaleString(undefined, { minimumFractionDigits: 2 })} Available
          </div>
        </div>
      </div>

      {/* Envelopes List */}
      <div className="space-y-4">
        {budgetEnvelopes.map(envelope => {
          const ct = creditTypes.find(c => c.id === envelope.creditTypeId);
          const percentConsumed = Math.round((envelope.consumedCredits / envelope.allocatedCredits) * 100);
          const isWarning = percentConsumed >= envelope.softCapPercent;

          return (
            <div
              key={envelope.id}
              className={`p-5 rounded-lg border transition-all ${
                isWarning
                  ? 'bg-neutral-900/80 border-amber-800/80 shadow-sm'
                  : 'bg-neutral-900/40 border-neutral-800'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">
                      {envelope.code}
                    </span>
                    <span className="text-xs text-neutral-400 font-mono">
                      Dept: {envelope.department}
                    </span>
                    <span className="text-xs text-neutral-500">·</span>
                    <span className="text-xs font-mono text-[#e4e1a9]">
                      {ct?.name || envelope.creditTypeId}
                    </span>
                  </div>
                  <h2 className="text-base font-semibold text-neutral-100 mt-1">
                    {envelope.name}
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-0.5 rounded text-xs font-mono inline-flex items-center gap-1.5 ${
                    isWarning
                      ? 'bg-amber-950/60 text-amber-300 border border-amber-800/80'
                      : 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/80'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isWarning ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                    {isWarning ? 'Soft-Cap Throttled' : 'Healthy Capacity'}
                  </span>

                  {editingId === envelope.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="100000"
                        value={newCapacity}
                        onChange={(e) => setNewCapacity(Number(e.target.value))}
                        className="w-32 bg-neutral-800 border border-neutral-700 text-neutral-100 px-2 py-1 rounded text-xs font-mono"
                      />
                      <button
                        onClick={() => handleSaveCapacity(envelope.id)}
                        className="px-2.5 py-1 text-xs bg-emerald-500 text-black font-semibold rounded"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleStartEdit(envelope)}
                      className="px-2.5 py-1 text-xs text-neutral-300 hover:text-neutral-100 bg-neutral-800 hover:bg-neutral-700 rounded transition-colors"
                    >
                      Adjust Cap
                    </button>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                  <span>
                    Consumed: <span className="text-neutral-100 font-semibold">{envelope.consumedCredits.toLocaleString()}</span> / {envelope.allocatedCredits.toLocaleString()} Credits
                  </span>
                  <span>
                    {percentConsumed}% (Soft Cap: {envelope.softCapPercent}% · Hard Cap: {envelope.hardCapPercent}%)
                  </span>
                </div>

                <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden relative">
                  <div
                    className={`h-full rounded-full transition-all ${
                      percentConsumed >= envelope.hardCapPercent
                        ? 'bg-red-500'
                        : percentConsumed >= envelope.softCapPercent
                        ? 'bg-amber-400'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, percentConsumed)}%` }}
                  />
                  {/* Soft cap indicator line */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-neutral-400"
                    style={{ left: `${envelope.softCapPercent}%` }}
                    title={`Soft cap threshold: ${envelope.softCapPercent}%`}
                  />
                </div>
              </div>

              {isWarning && (
                <div className="mt-3 p-3 rounded bg-amber-950/30 border border-amber-800/60 text-xs text-amber-200/90 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>
                      Soft-cap reached. Emission rules linked to this envelope are receiving an automatic 0.85x dampening multiplier to extend campaign runway.
                    </span>
                  </div>
                  <button
                    onClick={() => navigate('/operator')}
                    className="underline text-amber-100 font-medium hover:text-white shrink-0 ml-3"
                  >
                    View AI Analysis
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
