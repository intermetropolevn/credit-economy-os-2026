import React, { useState } from 'react';
import { useEconomic } from '../context/EconomicContext';
import { RewardRule } from '../types';
import { Plus, Play, Pause, ArrowRight, ShieldCheck, Zap, AlertCircle } from 'lucide-react';

export const RewardRulesScreen: React.FC = () => {
  const { rewardRules, toggleRewardRuleStatus, navigate, runSimulationOnObject, creditTypes, budgetEnvelopes } = useEconomic();
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const filteredRules = filterStatus === 'ALL'
    ? rewardRules
    : rewardRules.filter(r => r.status === filterStatus);

  const handleSimulateRule = (rule: RewardRule) => {
    runSimulationOnObject({
      title: `Emission Rate Calibration for ${rule.name}`,
      targetObject: `RewardRule / ${rule.code}`,
      parameter: 'Base Issuance Credits',
      currentValue: `${rule.baseAmount} Credits`,
      proposedValue: `${Math.round(rule.baseAmount * 1.5)} Credits (+50%)`,
      affectedUsers: 14200,
      liabilityDelta: Math.round(rule.baseAmount * 0.5 * 14200),
      marginDelta: -2.4,
      shiftDays: -18,
      riskScore: 'Sybil incentive shift (+4.2%)',
      confidence: 'ESTIMATED',
      missingData: 'Estimated based on 90-day organic signup conversion cohort curve.',
    });
    navigate('/simulation');
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
            <span className="text-[#e4e1a9]">Reward Rules</span>
          </div>
          <h1 className="text-2xl font-semibold text-neutral-100 tracking-tight mt-1">
            Reward & Incentive Emission Rules
          </h1>
          <p className="text-sm text-neutral-400 mt-1 max-w-3xl">
            Deterministic emission triggers linked to user milestones, verified contributions, and platform engagement. Governed by budget envelopes and sybil rate-limits.
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
            Build New Reward Rule
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg bg-neutral-900/60 border border-neutral-800">
          <div className="text-xs text-neutral-400">Active Emission Rules</div>
          <div className="text-xl font-mono tabular-nums font-semibold text-neutral-100 mt-1">
            {rewardRules.filter(r => r.status === 'ACTIVE').length} / {rewardRules.length}
          </div>
          <div className="text-xs text-neutral-400 mt-2">
            Deterministic event listeners
          </div>
        </div>

        <div className="p-4 rounded-lg bg-neutral-900/60 border border-neutral-800">
          <div className="text-xs text-neutral-400">Linked Budget Envelopes</div>
          <div className="text-xl font-mono tabular-nums font-semibold text-neutral-100 mt-1">
            {budgetEnvelopes.length} Active
          </div>
          <div className="text-xs text-neutral-400 mt-2">
            Soft-cap auto-throttling active
          </div>
        </div>

        <div className="p-4 rounded-lg bg-neutral-900/60 border border-neutral-800">
          <div className="text-xs text-neutral-400">Total 24h Emission Volume</div>
          <div className="text-xl font-mono tabular-nums font-semibold text-[#e4e1a9] mt-1">
            184,500 <span className="text-xs font-sans text-neutral-400">Credits</span>
          </div>
          <div className="text-xs text-neutral-400 mt-2">
            ~$1,845 USD liability created
          </div>
        </div>

        <div className="p-4 rounded-lg bg-neutral-900/60 border border-neutral-800">
          <div className="text-xs text-neutral-400">Sybil Fraud Rejection Rate</div>
          <div className="text-xl font-mono tabular-nums font-semibold text-emerald-400 mt-1">
            99.2%
          </div>
          <div className="text-xs text-neutral-400 mt-2">
            Subnet clustering protection
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-1 p-1 bg-neutral-900 rounded-lg border border-neutral-800">
          {['ALL', 'ACTIVE', 'PAUSED'].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                filterStatus === st
                  ? 'bg-neutral-800 text-neutral-100 shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {st === 'ALL' ? 'All Rules' : st}
            </button>
          ))}
        </div>

        <div className="text-xs text-neutral-400">
          Showing {filteredRules.length} emission rules
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-neutral-800 bg-neutral-900/40 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-900/90 text-neutral-400 text-xs font-mono uppercase tracking-wider border-b border-neutral-800">
            <tr>
              <th className="py-3 px-4">Rule Code & Name</th>
              <th className="py-3 px-4">Event Trigger</th>
              <th className="py-3 px-4">Credit Instrument</th>
              <th className="py-3 px-4 text-right">Base Amount</th>
              <th className="py-3 px-4">Multiplier Formula</th>
              <th className="py-3 px-4">Limit / Cooldown</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/80 text-neutral-300">
            {filteredRules.map(rule => {
              const targetCredit = creditTypes.find(ct => ct.id === rule.creditTypeId);
              return (
                <tr key={rule.id} className="hover:bg-neutral-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-neutral-100">
                      {rule.name}
                    </div>
                    <div className="text-xs font-mono text-neutral-400 mt-0.5">
                      {rule.code} · v{rule.version}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">
                      {rule.triggerEvent}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-xs">
                    <div className="font-mono text-neutral-200">
                      {targetCredit?.code || rule.creditTypeId}
                    </div>
                    <div className="text-neutral-500">
                      {targetCredit?.category}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono tabular-nums text-neutral-100 font-semibold">
                    {rule.baseAmount.toLocaleString()}
                  </td>

                  <td className="py-3.5 px-4 text-xs font-mono text-neutral-300">
                    {rule.multiplierFormula}
                  </td>

                  <td className="py-3.5 px-4 text-xs text-neutral-400">
                    <div>Cap: {rule.maxClaimsPerUser}/user</div>
                    <div>{rule.cooldownMinutes > 0 ? `${rule.cooldownMinutes}m cooldown` : 'No cooldown'}</div>
                  </td>

                  <td className="py-3.5 px-4 text-xs font-mono">
                    <button
                      onClick={() => toggleRewardRuleStatus(rule.id)}
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded transition-colors ${
                        rule.status === 'ACTIVE'
                          ? 'text-emerald-400 bg-emerald-950/40 hover:bg-emerald-900/50'
                          : 'text-neutral-400 bg-neutral-800 hover:bg-neutral-700'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        rule.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-neutral-500'
                      }`} />
                      {rule.status}
                    </button>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleSimulateRule(rule)}
                        className="px-2 py-1 text-xs text-neutral-300 hover:text-neutral-100 bg-neutral-800 hover:bg-neutral-700 rounded transition-colors"
                      >
                        Simulate
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
