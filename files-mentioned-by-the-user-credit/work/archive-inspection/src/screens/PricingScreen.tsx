import React, { useState } from 'react';
import { useEconomic } from '../context/EconomicContext';
import { PriceRule } from '../types';
import { Play, TrendingUp, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const PricingScreen: React.FC = () => {
  const { priceRules, updatePriceRule, navigate, runSimulationOnObject } = useEconomic();

  const [activeRuleId, setActiveRuleId] = useState<string>(priceRules[0]?.id || 'pr-01');
  const activeRule = priceRules.find(r => r.id === activeRuleId) || priceRules[0];

  const [multiplierInput, setMultiplierInput] = useState<number>(activeRule.currentMultiplier);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const calculatedCreditPrice = Math.round(activeRule.basePriceCredits * multiplierInput);
  const calculatedUsdPrice = (calculatedCreditPrice * 0.01);
  const calculatedMargin = Math.round(((calculatedUsdPrice - activeRule.cogsBenchmarkUsd) / calculatedUsdPrice) * 100);

  const isFloorBreached = calculatedMargin < activeRule.minMarginFloorPercent;

  const handleSimulate = () => {
    runSimulationOnObject({
      title: `Surge Pricing Calibration for ${activeRule.productName}`,
      targetObject: `PriceRule / ${activeRule.code}`,
      parameter: 'Current Multiplier',
      currentValue: `${activeRule.currentMultiplier}x (${Math.round(activeRule.basePriceCredits * activeRule.currentMultiplier)} Credits)`,
      proposedValue: `${multiplierInput}x (${calculatedCreditPrice} Credits)`,
      affectedUsers: 8400,
      liabilityDelta: 0,
      marginDelta: calculatedMargin - Math.round(((activeRule.basePriceCredits * activeRule.currentMultiplier * 0.01 - activeRule.cogsBenchmarkUsd) / (activeRule.basePriceCredits * activeRule.currentMultiplier * 0.01)) * 100),
      shiftDays: 0,
      riskScore: isFloorBreached ? 'Violation: Below Margin Floor' : 'Within Bounds',
      confidence: 'ACTUAL',
      missingData: 'Cluster telemetry past 48 hours confirms GPU utilization peak at 89%.',
    });
    navigate('/simulation');
  };

  const handleSave = () => {
    if (isFloorBreached) return;
    updatePriceRule(activeRule.id, {
      currentMultiplier: Number(multiplierInput),
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
            <span>Credit Economy OS</span>
            <span>/</span>
            <span>Spend & Monetization</span>
            <span>/</span>
            <span className="text-[#e4e1a9]">Pricing Rules</span>
          </div>
          <h1 className="text-2xl font-semibold text-neutral-100 tracking-tight mt-1">
            Dynamic Pricing & Floor Margin Safeguards
          </h1>
          <p className="text-sm text-neutral-400 mt-1 max-w-3xl">
            Real-time surge multipliers and floor margin enforcement. Prevents underwater execution when vendor GPU cluster costs fluctuate.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/spend-products')}
            className="px-3.5 py-1.5 text-xs font-medium text-neutral-300 bg-neutral-900 border border-neutral-700 hover:bg-neutral-800 rounded-md transition-colors"
          >
            Product Catalog
          </button>
          <button
            onClick={handleSimulate}
            className="px-3.5 py-1.5 text-xs font-medium text-black bg-[#e4e1a9] hover:bg-[#d8d598] rounded-md transition-colors flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-black" />
            Simulate Pricing Scenario
          </button>
        </div>
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rules Selector */}
        <div className="space-y-3">
          <div className="text-xs font-mono uppercase text-neutral-400 mb-2">
            Active Pricing Rules ({priceRules.length})
          </div>
          {priceRules.map(rule => (
            <button
              key={rule.id}
              onClick={() => {
                setActiveRuleId(rule.id);
                setMultiplierInput(rule.currentMultiplier);
              }}
              className={`w-full text-left p-4 rounded-lg border transition-all ${
                activeRuleId === rule.id
                  ? 'bg-neutral-800/80 border-[#e4e1a9] shadow-sm'
                  : 'bg-neutral-900/40 border-neutral-800 hover:bg-neutral-800/40'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-neutral-400">{rule.code}</span>
                <span className="text-[#e4e1a9] font-semibold">{rule.currentMultiplier}x</span>
              </div>
              <div className="font-semibold text-neutral-100 text-sm mt-1">
                {rule.productName}
              </div>
              <div className="flex items-center justify-between text-xs text-neutral-400 mt-2 font-mono">
                <span>Model: {rule.pricingModel}</span>
                <span>Floor: {rule.minMarginFloorPercent}%</span>
              </div>
            </button>
          ))}
        </div>

        {/* Selected Rule Calibration Editor */}
        <div className="lg:col-span-2 p-6 rounded-lg bg-neutral-900/40 border border-neutral-800 space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
            <div>
              <h2 className="text-lg font-semibold text-neutral-100">
                Calibrate: {activeRule.productName}
              </h2>
              <div className="text-xs font-mono text-neutral-400 mt-0.5">
                {activeRule.code} · Model: {activeRule.pricingModel}
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-800/80 text-emerald-400 text-xs font-mono">
              Active in Production
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-3 rounded bg-neutral-900 border border-neutral-800">
              <div className="text-neutral-400">Direct COGS Benchmark</div>
              <div className="text-base text-neutral-100 font-semibold mt-1">
                ${activeRule.cogsBenchmarkUsd.toFixed(2)}
              </div>
              <div className="text-neutral-500 mt-1 font-sans">
                Vendor compute pass-through cost
              </div>
            </div>

            <div className="p-3 rounded bg-neutral-900 border border-neutral-800">
              <div className="text-neutral-400">Base Unit Credits</div>
              <div className="text-base text-[#e4e1a9] font-semibold mt-1">
                {activeRule.basePriceCredits} Credits
              </div>
              <div className="text-neutral-500 mt-1 font-sans">
                ${(activeRule.basePriceCredits * 0.01).toFixed(2)} USD baseline
              </div>
            </div>

            <div className="p-3 rounded bg-neutral-900 border border-neutral-800">
              <div className="text-neutral-400">Hard Margin Floor</div>
              <div className="text-base text-emerald-400 font-semibold mt-1">
                {activeRule.minMarginFloorPercent}% Min
              </div>
              <div className="text-neutral-500 mt-1 font-sans">
                Invariant rejection boundary
              </div>
            </div>
          </div>

          {/* Interactive Multiplier Slider & Input */}
          <div className="space-y-4 pt-2">
            <label className="block text-xs font-mono uppercase text-neutral-400">
              Adjust Dynamic Surge Multiplier (Currently {activeRule.currentMultiplier}x)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0.5"
                max="2.5"
                step="0.05"
                value={multiplierInput}
                onChange={(e) => setMultiplierInput(Number(e.target.value))}
                className="flex-1 accent-[#e4e1a9]"
              />
              <div className="w-24">
                <input
                  type="number"
                  step="0.05"
                  value={multiplierInput}
                  onChange={(e) => setMultiplierInput(Number(e.target.value))}
                  className="w-full bg-neutral-800 border border-neutral-700 text-neutral-100 px-3 py-1.5 rounded-md text-sm font-mono tabular-nums text-center"
                />
              </div>
            </div>

            {/* Calculated Output Preview */}
            <div className="p-4 rounded-lg bg-neutral-900 border border-neutral-800 grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xs text-neutral-400">Effective Credit Price</div>
                <div className="text-lg font-mono tabular-nums font-semibold text-neutral-100 mt-1">
                  {calculatedCreditPrice} <span className="text-xs font-sans text-neutral-400">Credits</span>
                </div>
              </div>

              <div>
                <div className="text-xs text-neutral-400">USD Equivalent</div>
                <div className="text-lg font-mono tabular-nums font-semibold text-neutral-100 mt-1">
                  ${calculatedUsdPrice.toFixed(2)}
                </div>
              </div>

              <div>
                <div className="text-xs text-neutral-400">Projected Margin</div>
                <div className={`text-lg font-mono tabular-nums font-semibold mt-1 ${
                  isFloorBreached ? 'text-red-400' : 'text-emerald-400'
                }`}>
                  {calculatedMargin}%
                </div>
              </div>
            </div>

            {isFloorBreached && (
              <div className="p-3 rounded bg-red-950/40 border border-red-800 text-xs text-red-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>
                  Policy Invariant Breach: Projected gross margin ({calculatedMargin}%) is below the minimum mandatory floor of {activeRule.minMarginFloorPercent}%. Execution will be blocked.
                </span>
              </div>
            )}

            {saveSuccess && (
              <div className="p-3 rounded bg-emerald-950/40 border border-emerald-800 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Pricing rule calibrated and updated successfully.</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
              <span className="text-xs text-neutral-400">
                Dual-key authorization required for changes exceeding ±25%
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleSimulate}
                  className="px-3.5 py-1.5 text-xs text-neutral-300 hover:text-neutral-100 bg-neutral-800 hover:bg-neutral-700 rounded-md transition-colors"
                >
                  Preview Simulation
                </button>
                <button
                  disabled={isFloorBreached}
                  onClick={handleSave}
                  className={`px-4 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    isFloorBreached
                      ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                      : 'text-black bg-[#e4e1a9] hover:bg-[#d8d598]'
                  }`}
                >
                  Commit Pricing Rule
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
