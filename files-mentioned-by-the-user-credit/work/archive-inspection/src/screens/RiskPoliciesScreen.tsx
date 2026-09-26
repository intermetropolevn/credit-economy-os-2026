import React, { useState } from 'react';
import { useEconomic } from '../context/EconomicContext';
import { RiskPolicy } from '../types';
import { ShieldAlert, AlertTriangle, CheckCircle2, Lock, Unlock, Eye, FileText, ArrowRight } from 'lucide-react';

export const RiskPoliciesScreen: React.FC = () => {
  const { riskPolicies, toggleRiskPolicy, releaseRiskHold, navigate } = useEconomic();
  const [activeTab, setActiveTab] = useState<'POLICIES' | 'HOLDS'>('POLICIES');

  const totalActiveHolds = riskPolicies.reduce((acc, p) => acc + p.activeHoldsCount, 0);

  // Simulated active holds records
  const sampleHolds = [
    {
      id: 'HOLD-1048',
      entityId: 'TX-1048',
      policyCode: 'POL-DELIVERABLE-CORRUPTION',
      reason: 'Deliverable del-06 vertical story template has 0-byte size and null SHA256 hash.',
      amountHeld: 250,
      timestamp: '2026-03-24T11:04:12Z',
      status: 'UNDER_REVIEW',
    },
    {
      id: 'HOLD-9921',
      entityId: 'WL-0x44a...10bc',
      policyCode: 'POL-IP-CLUSTER-FARM',
      reason: '4 accounts claiming bounty RR-MODEL-CONTRIB-04 from ASN 45102 within 180s.',
      amountHeld: 10000,
      timestamp: '2026-03-24T06:12:00Z',
      status: 'QUARANTINED',
    },
    {
      id: 'HOLD-8802',
      entityId: 'TX-1049',
      policyCode: 'POL-DUAL-SIGN-HIGHVAL',
      reason: 'Transaction value of 12,500 credits exceeds standard 5,000 threshold. Pending secondary signature.',
      amountHeld: 12500,
      timestamp: '2026-03-24T09:30:00Z',
      status: 'AWAITING_DUAL_KEY',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
            <span>Credit Economy OS</span>
            <span>/</span>
            <span>Policies & Risk</span>
            <span>/</span>
            <span className="text-[#e4e1a9]">Risk Policies & Holds</span>
          </div>
          <h1 className="text-2xl font-semibold text-neutral-100 tracking-tight mt-1">
            Automated Invariant Defense & Quarantine Queue
          </h1>
          <p className="text-sm text-neutral-400 mt-1 max-w-3xl">
            Enforces hard economic invariants, velocity gates, sybil cluster detection, and deliverable cryptographic integrity holds.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/operator')}
            className="px-3.5 py-1.5 text-xs font-medium text-neutral-300 bg-neutral-900 border border-neutral-700 hover:bg-neutral-800 rounded-md transition-colors"
          >
            AI Risk Analyst
          </button>
          <button
            onClick={() => navigate('/settlement')}
            className="px-3.5 py-1.5 text-xs font-medium text-black bg-[#e4e1a9] hover:bg-[#d8d598] rounded-md transition-colors flex items-center gap-1.5"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            Triage Settlement Exceptions
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg bg-neutral-900/60 border border-neutral-800">
          <div className="text-xs text-neutral-400">Active Risk Policies</div>
          <div className="text-xl font-mono tabular-nums font-semibold text-neutral-100 mt-1">
            {riskPolicies.filter(r => r.status === 'ENFORCING').length} / {riskPolicies.length} Enforcing
          </div>
          <div className="text-xs text-emerald-400 mt-2">
            Deterministic runtime hooks
          </div>
        </div>

        <div className="p-4 rounded-lg bg-neutral-900/60 border border-neutral-800">
          <div className="text-xs text-neutral-400">Current Encumbered Holds</div>
          <div className="text-xl font-mono tabular-nums font-semibold text-amber-400 mt-1">
            {totalActiveHolds} Holds Active
          </div>
          <div className="text-xs text-neutral-400 mt-2">
            Quarantined in 2010.88 Escrow
          </div>
        </div>

        <div className="p-4 rounded-lg bg-neutral-900/60 border border-neutral-800">
          <div className="text-xs text-neutral-400">Total Value Quarantined</div>
          <div className="text-xl font-mono tabular-nums font-semibold text-[#ffd7b7] mt-1">
            22,750 <span className="text-xs font-sans text-neutral-400">Credits</span>
          </div>
          <div className="text-xs text-neutral-400 mt-2">
            ~$227.50 USD in protective freeze
          </div>
        </div>

        <div className="p-4 rounded-lg bg-neutral-900/60 border border-neutral-800">
          <div className="text-xs text-neutral-400">Governance Gate</div>
          <div className="text-sm font-semibold text-neutral-100 mt-1">
            Dual-Key Human Approval
          </div>
          <div className="text-xs text-neutral-400 mt-2">
            Mandatory for release &gt; 5,000
          </div>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-1 p-1 bg-neutral-900 rounded-lg border border-neutral-800 w-fit">
        <button
          onClick={() => setActiveTab('POLICIES')}
          className={`px-3.5 py-1 text-xs font-medium rounded-md transition-colors ${
            activeTab === 'POLICIES'
              ? 'bg-neutral-800 text-neutral-100 shadow-sm'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          Enforcement Rules ({riskPolicies.length})
        </button>
        <button
          onClick={() => setActiveTab('HOLDS')}
          className={`px-3.5 py-1 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
            activeTab === 'HOLDS'
              ? 'bg-neutral-800 text-neutral-100 shadow-sm'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          Active Quarantine Queue
          <span className="w-2 h-2 rounded-full bg-amber-500" />
        </button>
      </div>

      {activeTab === 'POLICIES' ? (
        <div className="rounded-lg border border-neutral-800 bg-neutral-900/40 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-900/90 text-neutral-400 text-xs font-mono uppercase tracking-wider border-b border-neutral-800">
              <tr>
                <th className="py-3 px-4">Policy Code & Name</th>
                <th className="py-3 px-4">Monitored Invariant Condition</th>
                <th className="py-3 px-4">Action On Breach</th>
                <th className="py-3 px-4 text-center">Severity</th>
                <th className="py-3 px-4 text-right">Active Holds</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/80 text-neutral-300">
              {riskPolicies.map(policy => (
                <tr key={policy.id} className="hover:bg-neutral-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-neutral-100">
                      {policy.name}
                    </div>
                    <div className="text-xs font-mono text-neutral-400 mt-0.5">
                      {policy.code}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-xs font-mono">
                    <div className="text-neutral-200">{policy.targetMetric}</div>
                    <div className="text-neutral-400">{policy.thresholdCondition}</div>
                  </td>

                  <td className="py-3.5 px-4 text-xs font-mono text-[#e4e1a9]">
                    {policy.action}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-mono ${
                      policy.severity === 'CRITICAL'
                        ? 'bg-red-950/60 text-red-300 border border-red-800/80'
                        : 'bg-amber-950/60 text-amber-300 border border-amber-800/80'
                    }`}>
                      {policy.severity}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono tabular-nums text-neutral-200">
                    {policy.activeHoldsCount}
                  </td>

                  <td className="py-3.5 px-4 text-center text-xs font-mono">
                    <button
                      onClick={() => toggleRiskPolicy(policy.id)}
                      className={`px-2.5 py-0.5 rounded transition-colors ${
                        policy.status === 'ENFORCING'
                          ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/80'
                          : 'bg-neutral-800 text-neutral-400'
                      }`}
                    >
                      {policy.status}
                    </button>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => releaseRiskHold(policy.id)}
                      className="px-2.5 py-1 text-xs text-neutral-300 hover:text-neutral-100 bg-neutral-800 hover:bg-neutral-700 rounded transition-colors"
                      title="Clear 1 active hold for this rule"
                    >
                      Release 1 Hold
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Active Holds Queue */
        <div className="space-y-4">
          {sampleHolds.map(hold => (
            <div
              key={hold.id}
              className="p-5 rounded-lg bg-neutral-900/60 border border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800/80">
                    {hold.id}
                  </span>
                  <span className="font-mono text-xs text-neutral-400">
                    Target: <span className="text-neutral-100 font-semibold">{hold.entityId}</span>
                  </span>
                  <span className="text-xs text-neutral-500">·</span>
                  <span className="text-xs font-mono text-neutral-400">{hold.policyCode}</span>
                </div>
                <p className="text-sm text-neutral-200 mt-1">
                  {hold.reason}
                </p>
                <div className="text-xs text-neutral-400 font-mono">
                  Timestamp: {hold.timestamp.slice(0, 19)} · Amount: <span className="text-[#ffd7b7] font-semibold">{hold.amountHeld} Credits</span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => navigate('/settlement')}
                  className="px-3.5 py-1.5 text-xs text-neutral-300 hover:text-neutral-100 bg-neutral-800 hover:bg-neutral-700 rounded-md transition-colors flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Inspect in Settlement
                </button>
                <button
                  onClick={() => {
                    alert(`Dual-key human override requested for ${hold.id}. Release recorded in Audit Log.`);
                  }}
                  className="px-3.5 py-1.5 text-xs font-medium text-black bg-[#e4e1a9] hover:bg-[#d8d598] rounded-md transition-colors flex items-center gap-1.5"
                >
                  <Unlock className="w-3.5 h-3.5" />
                  Dual-Key Release
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
