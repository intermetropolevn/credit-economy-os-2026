import React, { useState } from 'react';
import { useEconomic } from '../context/EconomicContext';
import { SpendProduct } from '../types';
import { Play, TrendingUp, Cpu, Server, Video, Code, Shield, Clock } from 'lucide-react';

export const SpendProductsScreen: React.FC = () => {
  const { spendProducts, updateSpendProduct, navigate, runSimulationOnObject } = useEconomic();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const filteredProducts = selectedCategory === 'ALL'
    ? spendProducts
    : spendProducts.filter(sp => sp.category === selectedCategory);

  const totalDailyVolume = spendProducts.reduce((acc, p) => acc + p.avgDailyVolume, 0);
  const totalDailyGrossRevenue = spendProducts.reduce((acc, p) => acc + (p.avgDailyVolume * p.unitPriceCredits * 0.01), 0);

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'COMPUTE':
        return <Cpu className="w-4 h-4 text-emerald-400" />;
      case 'GENERATIVE_AI':
        return <Video className="w-4 h-4 text-[#e4e1a9]" />;
      case 'AGENT_ORCHESTRATION':
        return <Code className="w-4 h-4 text-blue-400" />;
      case 'STORAGE':
        return <Server className="w-4 h-4 text-purple-400" />;
      default:
        return <Cpu className="w-4 h-4 text-neutral-400" />;
    }
  };

  const handleSimulateProduct = (prod: SpendProduct) => {
    runSimulationOnObject({
      title: `Elasticity & Margin Optimization for ${prod.name}`,
      targetObject: `SpendProduct / ${prod.code}`,
      parameter: 'Unit Price in Credits',
      currentValue: `${prod.unitPriceCredits} Credits`,
      proposedValue: `${Math.round(prod.unitPriceCredits * 0.85)} Credits (-15%)`,
      affectedUsers: 4800,
      liabilityDelta: 0,
      marginDelta: -6.4,
      shiftDays: 0,
      riskScore: 'Neutral (0.0%)',
      confidence: 'ACTUAL',
      missingData: 'Historical GPU batch execution log over 24,000 tasks verifies COGS floor.',
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
            <span>Spend & Monetization</span>
            <span>/</span>
            <span className="text-[#e4e1a9]">Spend Products</span>
          </div>
          <h1 className="text-2xl font-semibold text-neutral-100 tracking-tight mt-1">
            Monetized Products & COGS Margin Architecture
          </h1>
          <p className="text-sm text-neutral-400 mt-1 max-w-3xl">
            Platform execution primitives consumed via credits. Enforces hard margin floors above external compute COGS (AWS / GPU clusters).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/pricing')}
            className="px-3.5 py-1.5 text-xs font-medium text-neutral-300 bg-neutral-900 border border-neutral-700 hover:bg-neutral-800 rounded-md transition-colors"
          >
            Dynamic Pricing Rules
          </button>
          <button
            onClick={() => navigate('/simulation')}
            className="px-3.5 py-1.5 text-xs font-medium text-black bg-[#e4e1a9] hover:bg-[#d8d598] rounded-md transition-colors flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-black" />
            Simulate Pricing Shift
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg bg-neutral-900/60 border border-neutral-800">
          <div className="text-xs text-neutral-400">Daily Task Run Rate</div>
          <div className="text-xl font-mono tabular-nums font-semibold text-neutral-100 mt-1">
            {totalDailyVolume.toLocaleString()} <span className="text-xs font-sans text-neutral-400">Jobs/Day</span>
          </div>
          <div className="text-xs text-neutral-400 mt-2">
            Automated runtime clearing
          </div>
        </div>

        <div className="p-4 rounded-lg bg-neutral-900/60 border border-neutral-800">
          <div className="text-xs text-neutral-400">24h Gross Value Consumed</div>
          <div className="text-xl font-mono tabular-nums font-semibold text-emerald-400 mt-1">
            ${totalDailyGrossRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-neutral-400 mt-2">
            Burn rate across all credit classes
          </div>
        </div>

        <div className="p-4 rounded-lg bg-neutral-900/60 border border-neutral-800">
          <div className="text-xs text-neutral-400">Average Platform Gross Margin</div>
          <div className="text-xl font-mono tabular-nums font-semibold text-neutral-100 mt-1">
            58.8%
          </div>
          <div className="text-xs text-emerald-400 mt-2">
            Above 35% Floor Policy
          </div>
        </div>

        <div className="p-4 rounded-lg bg-neutral-900/60 border border-neutral-800">
          <div className="text-xs text-neutral-400">Provider Escrow Share</div>
          <div className="text-xl font-mono tabular-nums font-semibold text-[#ffd7b7] mt-1">
            68.8% Weighted
          </div>
          <div className="text-xs text-neutral-400 mt-2">
            Disbursed upon deliverable verify
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-1 p-1 bg-neutral-900 rounded-lg border border-neutral-800">
          {['ALL', 'COMPUTE', 'GENERATIVE_AI', 'AGENT_ORCHESTRATION', 'STORAGE'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                selectedCategory === cat
                  ? 'bg-neutral-800 text-neutral-100 shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {cat === 'ALL' ? 'All Products' : cat.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="text-xs text-neutral-400">
          {filteredProducts.length} Monetized Catalog Items
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-lg border border-neutral-800 bg-neutral-900/40 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-900/90 text-neutral-400 text-xs font-mono uppercase tracking-wider border-b border-neutral-800">
            <tr>
              <th className="py-3 px-4">Product Code & Name</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4 text-right">Vendor COGS</th>
              <th className="py-3 px-4 text-right">Target Margin</th>
              <th className="py-3 px-4 text-right">Unit Price (Credits)</th>
              <th className="py-3 px-4 text-right">Provider Split</th>
              <th className="py-3 px-4">Reservation TTL</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/80 text-neutral-300">
            {filteredProducts.map(prod => (
              <tr key={prod.id} className="hover:bg-neutral-800/40 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(prod.category)}
                    <span className="font-semibold text-neutral-100">{prod.name}</span>
                  </div>
                  <div className="text-xs font-mono text-neutral-400 mt-0.5 pl-6">
                    {prod.code} · ~{prod.avgDailyVolume.toLocaleString()} jobs/day
                  </div>
                </td>

                <td className="py-3.5 px-4 text-xs font-mono text-neutral-300">
                  {prod.category}
                </td>

                <td className="py-3.5 px-4 text-right font-mono tabular-nums text-neutral-400">
                  ${prod.cogsUsd.toFixed(2)}
                </td>

                <td className="py-3.5 px-4 text-right font-mono tabular-nums text-emerald-400 font-semibold">
                  {prod.marginTargetPercent}%
                </td>

                <td className="py-3.5 px-4 text-right font-mono tabular-nums text-[#e4e1a9] font-semibold">
                  {prod.unitPriceCredits} <span className="text-xs font-sans text-neutral-400">(${ (prod.unitPriceCredits * 0.01).toFixed(2) })</span>
                </td>

                <td className="py-3.5 px-4 text-right font-mono tabular-nums text-[#ffd7b7]">
                  {prod.providerRevSharePercent}%
                </td>

                <td className="py-3.5 px-4 text-xs font-mono text-neutral-400">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3 h-3 text-neutral-500" />
                    {prod.reservationTtlMinutes} min
                  </span>
                </td>

                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => handleSimulateProduct(prod)}
                    className="px-2.5 py-1 text-xs text-neutral-300 hover:text-neutral-100 bg-neutral-800 hover:bg-neutral-700 rounded transition-colors"
                  >
                    Simulate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Safety Notice */}
      <div className="p-4 rounded-lg bg-neutral-900/30 border border-neutral-800 text-xs text-neutral-400 flex items-start gap-3">
        <Shield className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
        <div>
          <span className="font-semibold text-neutral-200">COGS Margin Floor Guarantee:</span> The Pricing Engine will reject any discount or surge configuration that produces a unit margin lower than 35% above direct vendor compute cost.
        </div>
      </div>
    </div>
  );
};
