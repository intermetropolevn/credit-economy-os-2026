import React, { useState } from 'react';
import { useEconomic } from '../context/EconomicContext';
import { SimulationScenario } from '../types';
import { Play, AlertTriangle, ShieldCheck, CheckCircle2, ArrowRight, Clock, HelpCircle, FileText, Lock } from 'lucide-react';

export const ImpactSimulationScreen: React.FC = () => {
  const { simulationScenarios, activeSimulation, setActiveSimulation, navigate, addAuditLog } = useEconomic();

  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(
    activeSimulation ? activeSimulation.id : simulationScenarios[0]?.id || 'sim-01'
  );

  const [activationSuccess, setActivationSuccess] = useState<boolean>(false);

  const scenario = simulationScenarios.find(s => s.id === selectedScenarioId) || simulationScenarios[0];

  const handleActivate = () => {
    addAuditLog({
      actor: 'executive_admin',
      role: 'Treasury & Monetization Lead',
      action: `SIMULATED_POLICY_ACTIVATED_${scenario.targetObject.replace(/\s+/g, '_')}`,
      objectType: 'PriceRule',
      objectId: scenario.targetObject,
      changesDiff: [
        { field: scenario.parameter, before: scenario.currentValue, after: scenario.proposedValue },
      ],
      rollbackAvailable: true,
      dualSigner: 'cro_risk_officer',
    });
    setActivationSuccess(true);
    setTimeout(() => setActivationSuccess(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
            <span>Credit Economy OS</span>
            <span>/</span>
            <span>Intelligence & Governance</span>
            <span>/</span>
            <span className="text-[#e4e1a9]">Impact Simulation</span>
          </div>
          <h1 className="text-2xl font-semibold text-neutral-100 tracking-tight mt-1">
            Pre-Commit Economic Impact Simulator & Twin
          </h1>
          <p className="text-sm text-neutral-400 mt-1 max-w-3xl">
            Forecasts macroeconomic consequences before activating high-impact parameter changes. Enforces the strict governance workflow: Edit → Validate → Preview → Warnings → Compare → Dual-Sign → Activate.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/operator')}
            className="px-3.5 py-1.5 text-xs font-medium text-neutral-300 bg-neutral-900 border border-neutral-700 hover:bg-neutral-800 rounded-md transition-colors"
          >
            AI Economic Analyst
          </button>
        </div>
      </div>

      {/* Reusable Workflow Pattern Banner */}
      <div className="p-4 rounded-lg bg-neutral-900/60 border border-neutral-800">
        <div className="text-xs font-mono uppercase text-neutral-400 mb-2">
          High-Impact Governance Pattern (Standardized Protocol)
        </div>
        <div className="flex items-center justify-between overflow-x-auto gap-2 text-xs font-mono">
          {[
            { step: '01', name: 'Edit Config', status: 'done' },
            { step: '02', name: 'Validate Bounds', status: 'done' },
            { step: '03', name: 'Preview Impact', status: 'active' },
            { step: '04', name: 'Review Warnings', status: 'active' },
            { step: '05', name: 'Compare Actuals', status: 'active' },
            { step: '06', name: 'Dual-Sign & Commit', status: 'ready' },
          ].map((s, idx) => (
            <div key={idx} className="flex items-center gap-2 shrink-0">
              <span className={`px-2 py-0.5 rounded ${
                s.status === 'done'
                  ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/80'
                  : s.status === 'active'
                  ? 'bg-neutral-800 text-[#e4e1a9] border border-[#e4e1a9]/50'
                  : 'bg-neutral-900 text-neutral-400 border border-neutral-800'
              }`}>
                {s.step}. {s.name}
              </span>
              {idx < 5 && <span className="text-neutral-600">→</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Scenarios Grid & Comparative View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scenario Selection Cards */}
        <div className="space-y-3">
          <div className="text-xs font-mono uppercase text-neutral-400 mb-2">
            Simulation Scenarios ({simulationScenarios.length})
          </div>

          {simulationScenarios.map(sc => (
            <button
              key={sc.id}
              onClick={() => setSelectedScenarioId(sc.id)}
              className={`w-full text-left p-4 rounded-lg border transition-all ${
                selectedScenarioId === sc.id
                  ? 'bg-neutral-800/80 border-[#e4e1a9] shadow-sm'
                  : 'bg-neutral-900/40 border-neutral-800 hover:bg-neutral-800/40'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-neutral-400">{sc.id}</span>
                <span className={`px-1.5 py-0.5 rounded text-[11px] ${
                  sc.dataConfidence === 'ACTUAL'
                    ? 'bg-emerald-950/60 text-emerald-400'
                    : sc.dataConfidence === 'ESTIMATED'
                    ? 'bg-blue-950/60 text-blue-300'
                    : 'bg-amber-950/60 text-amber-300'
                }`}>
                  {sc.dataConfidence}
                </span>
              </div>
              <div className="font-semibold text-neutral-100 text-sm mt-1">
                {sc.title}
              </div>
              <div className="text-xs text-neutral-400 mt-2 font-mono">
                Target: {sc.targetObject}
              </div>
            </button>
          ))}
        </div>

        {/* Detailed Comparative Sandbox */}
        <div className="lg:col-span-2 p-6 rounded-lg bg-neutral-900/40 border border-neutral-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800 pb-4">
            <div>
              <div className="text-xs font-mono text-neutral-400">
                {scenario.targetObject}
              </div>
              <h2 className="text-lg font-semibold text-neutral-100 mt-0.5">
                {scenario.title}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-xs font-mono ${
                scenario.policyBoundCheck === 'PASSED'
                  ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/80'
                  : 'bg-amber-950/60 text-amber-300 border border-amber-800/80'
              }`}>
                Invariant Bounds: {scenario.policyBoundCheck}
              </span>
            </div>
          </div>

          {/* Delta Specification */}
          <div className="p-4 rounded-lg bg-neutral-900 border border-neutral-800 text-xs font-mono flex items-center justify-between">
            <div>
              <div className="text-neutral-400">{scenario.parameter} (Current)</div>
              <div className="text-base text-neutral-300 font-semibold mt-1">
                {scenario.currentValue}
              </div>
            </div>
            <div className="text-neutral-500 text-base">→</div>
            <div>
              <div className="text-[#e4e1a9]">{scenario.parameter} (Proposed)</div>
              <div className="text-base text-[#e4e1a9] font-semibold mt-1">
                {scenario.proposedValue}
              </div>
            </div>
          </div>

          {/* 3-Column Comparative Metrics (ACTUAL / ESTIMATED / PROJECTED) */}
          <div className="space-y-2">
            <div className="text-xs font-mono uppercase text-neutral-400">
              Comparative Impact Forecast
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-4 rounded-lg bg-neutral-900 border border-neutral-800">
                <div className="flex items-center justify-between text-xs text-neutral-400">
                  <span>Affected Users</span>
                  <span className="font-mono text-[11px] text-blue-400">ESTIMATED</span>
                </div>
                <div className="text-xl font-mono tabular-nums font-semibold text-neutral-100 mt-1">
                  {scenario.affectedUsersEstimate.toLocaleString()}
                </div>
                <div className="text-xs text-neutral-500 mt-2 font-sans">
                  Active user cohort in scope
                </div>
              </div>

              <div className="p-4 rounded-lg bg-neutral-900 border border-neutral-800">
                <div className="flex items-center justify-between text-xs text-neutral-400">
                  <span>Reward Liability Delta</span>
                  <span className="font-mono text-[11px] text-blue-400">ESTIMATED</span>
                </div>
                <div className={`text-xl font-mono tabular-nums font-semibold mt-1 ${
                  scenario.rewardLiabilityDeltaCredits > 0 ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {scenario.rewardLiabilityDeltaCredits > 0 ? '+' : ''}
                  {scenario.rewardLiabilityDeltaCredits.toLocaleString()} <span className="text-xs font-sans text-neutral-400">Credits</span>
                </div>
                <div className="text-xs text-neutral-500 mt-2 font-mono">
                  ${(scenario.rewardLiabilityDeltaCredits * 0.01).toLocaleString(undefined, { minimumFractionDigits: 2 })} USD
                </div>
              </div>

              <div className="p-4 rounded-lg bg-neutral-900 border border-neutral-800">
                <div className="flex items-center justify-between text-xs text-neutral-400">
                  <span>Gross Margin Impact</span>
                  <span className="font-mono text-[11px] text-emerald-400">ACTUAL</span>
                </div>
                <div className={`text-xl font-mono tabular-nums font-semibold mt-1 ${
                  scenario.grossMarginDeltaPercent < 0 ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {scenario.grossMarginDeltaPercent > 0 ? '+' : ''}
                  {scenario.grossMarginDeltaPercent}%
                </div>
                <div className="text-xs text-neutral-500 mt-2 font-sans">
                  Shift in platform net take
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              <div className="p-4 rounded-lg bg-neutral-900 border border-neutral-800">
                <div className="flex items-center justify-between text-xs text-neutral-400">
                  <span>Budget Exhaustion Shift</span>
                  <span className="font-mono text-[11px] text-amber-300">PROJECTED</span>
                </div>
                <div className={`text-lg font-mono tabular-nums font-semibold mt-1 ${
                  scenario.budgetExhaustionShiftDays < 0 ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {scenario.budgetExhaustionShiftDays === 0 ? 'No shift' : `${scenario.budgetExhaustionShiftDays > 0 ? '+' : ''}${scenario.budgetExhaustionShiftDays} Days`}
                </div>
                <div className="text-xs text-neutral-500 mt-2 font-sans">
                  Horizon change on linked budget envelope
                </div>
              </div>

              <div className="p-4 rounded-lg bg-neutral-900 border border-neutral-800">
                <div className="flex items-center justify-between text-xs text-neutral-400">
                  <span>Risk / Sybil Exposure</span>
                  <span className="font-mono text-[11px] text-amber-300">PROJECTED</span>
                </div>
                <div className="text-sm font-mono font-semibold text-neutral-100 mt-1">
                  {scenario.riskExposureScoreDelta}
                </div>
                <div className="text-xs text-neutral-500 mt-2 font-sans">
                  Incentive shift for multi-account abuse
                </div>
              </div>
            </div>
          </div>

          {/* Missing Data Notification */}
          {scenario.missingDataNotes && (
            <div className="p-4 rounded-lg bg-neutral-900/80 border border-neutral-800 text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-neutral-300 font-semibold">
                <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
                Data Confidence Note:
              </div>
              <p className="text-neutral-400">
                {scenario.missingDataNotes}
              </p>
            </div>
          )}

          {activationSuccess && (
            <div className="p-3 rounded bg-emerald-950/40 border border-emerald-800 text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>
                Dual-Key Authorization Confirmed: Simulated policy changes scheduled and committed to the Audit Log.
              </span>
            </div>
          )}

          {/* Activation Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
            <span className="text-xs text-neutral-400">
              Requires dual-sign endorsement from Chief Risk Officer
            </span>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/audit-log')}
                className="px-3.5 py-1.5 text-xs text-neutral-300 hover:text-neutral-100 bg-neutral-800 hover:bg-neutral-700 rounded-md transition-colors"
              >
                Inspect Audit History
              </button>
              <button
                onClick={handleActivate}
                className="px-4 py-1.5 text-xs font-medium text-black bg-[#e4e1a9] hover:bg-[#d8d598] rounded-md transition-colors flex items-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                Dual-Sign & Schedule Activation
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
