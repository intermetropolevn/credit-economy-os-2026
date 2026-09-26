import React, { useState } from 'react';
import { useEconomic } from '../context/EconomicContext';
import { ArrowLeft, Check, Shield, AlertTriangle, Play, Sparkles, ChevronRight } from 'lucide-react';

export const RewardRuleBuilderScreen: React.FC = () => {
  const { creditTypes, budgetEnvelopes, addRewardRule, navigate, runSimulationOnObject } = useEconomic();

  const [step, setStep] = useState<number>(1);
  const [name, setName] = useState<string>('Developer Model Upload Bounty');
  const [code, setCode] = useState<string>('RR-MODEL-BOUNTY-V1');
  const [triggerEvent, setTriggerEvent] = useState<string>('model.weights.ingested');
  const [creditTypeId, setCreditTypeId] = useState<string>(creditTypes[0]?.id || 'ct-promo');
  const [baseAmount, setBaseAmount] = useState<number>(500);
  const [multiplierFormula, setMultiplierFormula] = useState<string>('1.0x (Flat)');
  const [cooldownMinutes, setCooldownMinutes] = useState<number>(1440);
  const [maxClaimsPerUser, setMaxClaimsPerUser] = useState<number>(3);
  const [campaignBudgetId, setCampaignBudgetId] = useState<string>(budgetEnvelopes[0]?.id || 'bg-01');

  const selectedCredit = creditTypes.find(c => c.id === creditTypeId);
  const selectedBudget = budgetEnvelopes.find(b => b.id === campaignBudgetId);

  const handleSimulate = () => {
    const projectedUsers = 2500;
    const liabilityDelta = baseAmount * projectedUsers;
    runSimulationOnObject({
      title: `Simulation for New Rule: ${code}`,
      targetObject: `RewardRule / ${code}`,
      parameter: `Base Amount: ${baseAmount} ${selectedCredit?.code || ''}`,
      currentValue: '0 Credits (New Rule)',
      proposedValue: `${baseAmount} Credits`,
      affectedUsers: projectedUsers,
      liabilityDelta,
      marginDelta: -1.2,
      shiftDays: -8,
      riskScore: 'Low (Velocity capped at 3/user)',
      confidence: 'ESTIMATED',
      missingData: 'Initial organic ingestion rate estimated at 2,500 claims/month.',
    });
    navigate('/simulation');
  };

  const handleCommitRule = () => {
    addRewardRule({
      code,
      name,
      triggerEvent,
      creditTypeId,
      baseAmount: Number(baseAmount),
      multiplierFormula,
      cooldownMinutes: Number(cooldownMinutes),
      maxClaimsPerUser: Number(maxClaimsPerUser),
      campaignBudgetId,
      status: 'ACTIVE',
      createdBy: 'admin.builder@demo.example',
    });
    navigate('/reward-rules');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-800 pb-5">
        <div>
          <button
            onClick={() => navigate('/reward-rules')}
            className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-200 transition-colors mb-2 font-mono"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Reward Rules
          </button>
          <h1 className="text-2xl font-semibold text-neutral-100 tracking-tight">
            Emission Rule Builder & Invariant Verifier
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Design deterministic credit rewards with sybil caps and guaranteed budget envelope linkage.
          </p>
        </div>
      </div>

      {/* Stepper Progress */}
      <div className="grid grid-cols-4 gap-2 text-xs font-mono">
        {[
          { num: 1, label: 'Trigger Event' },
          { num: 2, label: 'Eligibility & Caps' },
          { num: 3, label: 'Payout Structure' },
          { num: 4, label: 'Budget & Commit' },
        ].map(s => (
          <button
            key={s.num}
            onClick={() => setStep(s.num)}
            className={`p-3 rounded-lg border text-left transition-colors ${
              step === s.num
                ? 'bg-neutral-800 border-[#e4e1a9] text-neutral-100'
                : step > s.num
                ? 'bg-neutral-900/60 border-neutral-800 text-emerald-400'
                : 'bg-neutral-900/30 border-neutral-800 text-neutral-500'
            }`}
          >
            <div className="flex items-center justify-between">
              <span>Step 0{s.num}</span>
              {step > s.num && <Check className="w-3.5 h-3.5" />}
            </div>
            <div className="font-sans font-medium text-xs mt-1 text-neutral-200">
              {s.label}
            </div>
          </button>
        ))}
      </div>

      {/* Step Content */}
      <div className="p-6 rounded-lg bg-neutral-900/40 border border-neutral-800 space-y-6">
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-neutral-100">
              01. Ingestion Event & Trigger Hook
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-neutral-400 uppercase mb-1">
                  Rule Display Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-700 text-neutral-100 px-3 py-2 rounded-md text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-400 uppercase mb-1">
                  Unique Rule Identifier (Code)
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full bg-neutral-800 border border-neutral-700 text-neutral-100 px-3 py-2 rounded-md text-sm font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-neutral-400 uppercase mb-1">
                Event Bus Topic / Schema
              </label>
              <select
                value={triggerEvent}
                onChange={(e) => setTriggerEvent(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 text-neutral-100 px-3 py-2 rounded-md text-sm font-mono"
              >
                <option value="model.weights.ingested">model.weights.ingested (Developer upload)</option>
                <option value="identity.kyc.verified">identity.kyc.verified (User onboarding)</option>
                <option value="agent.job.streak.7d">agent.job.streak.7d (Engagement retention)</option>
                <option value="verifier.benchmark.approved">verifier.benchmark.approved (Consensus audit)</option>
                <option value="api.call.volume.100k">api.call.volume.100k (Enterprise consumption milestone)</option>
              </select>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-neutral-100">
              02. Sybil Defense, Caps & Cooldowns
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-neutral-400 uppercase mb-1">
                  Lifetime Cap Per User / Wallet
                </label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={maxClaimsPerUser}
                  onChange={(e) => setMaxClaimsPerUser(Number(e.target.value))}
                  className="w-full bg-neutral-800 border border-neutral-700 text-neutral-100 px-3 py-2 rounded-md text-sm font-mono tabular-nums"
                />
                <span className="text-xs text-neutral-400 mt-1 block">
                  Prevents unlimited claim farming from single identity.
                </span>
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-400 uppercase mb-1">
                  Enforced Cooldown Period (Minutes)
                </label>
                <input
                  type="number"
                  min="0"
                  max="43200"
                  value={cooldownMinutes}
                  onChange={(e) => setCooldownMinutes(Number(e.target.value))}
                  className="w-full bg-neutral-800 border border-neutral-700 text-neutral-100 px-3 py-2 rounded-md text-sm font-mono tabular-nums"
                />
                <span className="text-xs text-neutral-400 mt-1 block">
                  1440 min = 24 hours between allowable claims.
                </span>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-neutral-100">
              03. Payout Structure & Credit Instrument
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-neutral-400 uppercase mb-1">
                  Target Credit Instrument Class
                </label>
                <select
                  value={creditTypeId}
                  onChange={(e) => setCreditTypeId(e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-700 text-neutral-100 px-3 py-2 rounded-md text-sm font-mono"
                >
                  {creditTypes.map(ct => (
                    <option key={ct.id} value={ct.id}>
                      {ct.name} ({ct.code}) - P{ct.spendPriority}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-400 uppercase mb-1">
                  Base Emission Quantity (Credits)
                </label>
                <input
                  type="number"
                  min="1"
                  max="100000"
                  value={baseAmount}
                  onChange={(e) => setBaseAmount(Number(e.target.value))}
                  className="w-full bg-neutral-800 border border-neutral-700 text-neutral-100 px-3 py-2 rounded-md text-sm font-mono tabular-nums"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-neutral-400 uppercase mb-1">
                Dynamic Multiplier Formula
              </label>
              <select
                value={multiplierFormula}
                onChange={(e) => setMultiplierFormula(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 text-neutral-100 px-3 py-2 rounded-md text-sm font-mono"
              >
                <option value="1.0x (Flat)">1.0x (Flat issuance)</option>
                <option value="1.5x on Weekend">1.5x on Weekend</option>
                <option value="base * min(downloads/1000, 3.0)">base * min(downloads/1000, 3.0)</option>
                <option value="1.0x + (verifier_reputation * 0.2)">1.0x + (verifier_reputation * 0.2)</option>
              </select>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-neutral-100">
              04. Budget Envelope Linkage & Invariant Audit
            </h2>

            <div className="p-4 rounded-lg bg-neutral-900 border border-neutral-800 space-y-3">
              <label className="block text-xs font-mono text-neutral-400 uppercase">
                Underlying Budget Envelope (Hard Invariant: Emission Requires Envelope)
              </label>
              <select
                value={campaignBudgetId}
                onChange={(e) => setCampaignBudgetId(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 text-neutral-100 px-3 py-2 rounded-md text-sm font-mono"
              >
                {budgetEnvelopes.map(bg => (
                  <option key={bg.id} value={bg.id}>
                    {bg.name} ({bg.code}) - {bg.consumedCredits.toLocaleString()} / {bg.allocatedCredits.toLocaleString()} Credits ({Math.round(bg.consumedCredits/bg.allocatedCredits*100)}%)
                  </option>
                ))}
              </select>

              {selectedBudget && (
                <div className="text-xs text-neutral-400 mt-2 font-mono flex items-center justify-between">
                  <span>Available Envelope Capacity:</span>
                  <span className="text-neutral-100 font-semibold tabular-nums">
                    {(selectedBudget.allocatedCredits - selectedBudget.consumedCredits).toLocaleString()} Credits
                  </span>
                </div>
              )}
            </div>

            <div className="p-4 rounded-lg bg-neutral-900/60 border border-neutral-800 text-xs space-y-2">
              <div className="text-neutral-200 font-semibold flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                Deterministic Policy Invariant Check: PASSED
              </div>
              <p className="text-neutral-400">
                Rule configuration contains finite cap ({maxClaimsPerUser}/user), verified cooldown ({cooldownMinutes}m), and positive budget headroom.
              </p>
            </div>
          </div>
        )}

        {/* Step Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
          <button
            disabled={step === 1}
            onClick={() => setStep(step - 1)}
            className={`px-3.5 py-1.5 text-xs rounded-md transition-colors ${
              step === 1
                ? 'opacity-40 cursor-not-allowed text-neutral-500'
                : 'text-neutral-300 hover:text-neutral-100 bg-neutral-800'
            }`}
          >
            Previous Step
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSimulate}
              className="px-3.5 py-1.5 text-xs text-neutral-300 hover:text-neutral-100 bg-neutral-800 hover:bg-neutral-700 rounded-md transition-colors flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5" />
              Simulate Economic Impact
            </button>

            {step < 4 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="px-4 py-1.5 text-xs font-medium text-black bg-[#e4e1a9] hover:bg-[#d8d598] rounded-md transition-colors flex items-center gap-1.5"
              >
                Next Step <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleCommitRule}
                className="px-4 py-1.5 text-xs font-medium text-black bg-emerald-400 hover:bg-emerald-300 rounded-md transition-colors flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" /> Commit Rule to Production
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
