import React, { useState } from 'react';
import { mcpIntelligence, PoolMetricsReport } from '../services/mcpIntelligenceService';
import {
  Sparkles,
  Compass,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Tag,
  Users,
  Building2,
  DollarSign,
  TrendingUp,
  Shield,
  Check,
  X,
  Plus,
} from 'lucide-react';

export const PoolAIIntelligence: React.FC = () => {
  const [poolMetrics, setPoolMetrics] = useState<PoolMetricsReport[]>(() =>
    mcpIntelligence.get_pool_metrics()
  );
  const [unusedRewards, setUnusedRewards] = useState(() =>
    mcpIntelligence.identify_unused_rewards()
  );
  const [inventoryReport, setInventoryReport] = useState(() =>
    mcpIntelligence.get_reward_inventory()
  );
  const [recommendations, setRecommendations] = useState(() =>
    mcpIntelligence.recommend_pool_changes()
  );

  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<{
    title: string;
    description: string;
    onConfirm: () => void;
  } | null>(null);

  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setPoolMetrics(mcpIntelligence.get_pool_metrics());
      setUnusedRewards(mcpIntelligence.identify_unused_rewards());
      setInventoryReport(mcpIntelligence.get_reward_inventory());
      setRecommendations(mcpIntelligence.recommend_pool_changes());
      setIsLoading(false);
      setNotification('Destination pool telemetry synchronized via MCP read tools.');
    }, 350);
  };

  return (
    <div className="bg-[#141824] border border-[#262a35] rounded-xl p-5 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#262a35]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#1b1f2a] border border-[#e4e1a9]/40 text-[#e4e1a9] flex items-center justify-center">
            <Compass className="w-4 h-4 text-[#e4e1a9]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-[#dfe2f0]">
                Destination Pool Intelligence &amp; Inventory Health
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1b1f2a] text-[#e4e1a9] border border-[#e4e1a9]/30">
                MCP ENGINE
              </span>
            </div>
            <p className="text-[11px] text-[#939183]">
              Monitors shared liquidity pools, stagnation risks, and demand-to-benefit ratios.
            </p>
          </div>
        </div>

        <button
          onClick={refreshData}
          disabled={isLoading}
          className="px-3 py-1.5 rounded-lg bg-[#171b26] hover:bg-[#1b1f2a] text-xs font-semibold text-[#dfe2f0] border border-[#262a35] flex items-center gap-1.5 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Pool MCP</span>
        </button>
      </div>

      {notification && (
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-emerald-400 hover:text-emerald-200">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Inventory & Stagnation Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="p-3 rounded-xl bg-[#171b26] border border-[#262a35]">
          <div className="text-[10px] text-[#939183]">Available Inventory</div>
          <div className="text-base font-bold text-[#dfe2f0]">
            {inventoryReport.totalAvailableInventoryItems.toLocaleString()} Passes
          </div>
          <div className="text-[10px] text-[#939183] font-sans">Across all partner catalogs</div>
        </div>

        <div className="p-3 rounded-xl bg-[#171b26] border border-[#262a35]">
          <div className="text-[10px] text-[#939183]">Total Redemptions</div>
          <div className="text-base font-bold text-emerald-300">
            {inventoryReport.totalRedeemedItems.toLocaleString()}
          </div>
          <div className="text-[10px] text-emerald-400 font-sans">Turnover: {inventoryReport.stockTurnoverRatio * 100}%</div>
        </div>

        <div className="p-3 rounded-xl bg-[#171b26] border border-[#262a35]">
          <div className="text-[10px] text-[#939183]">Stagnant Rewards</div>
          <div className="text-base font-bold text-amber-300">
            {inventoryReport.stagnantInventoryItems} Units
          </div>
          <div className="text-[10px] text-amber-400 font-sans">identify_unused_rewards()</div>
        </div>

        <div className="p-3 rounded-xl bg-[#171b26] border border-[#262a35]">
          <div className="text-[10px] text-[#939183]">Destination Pools</div>
          <div className="text-base font-bold text-[#e4e1a9]">
            {poolMetrics.length} Active
          </div>
          <div className="text-[10px] text-[#939183] font-sans">100% solvency ratio</div>
        </div>
      </div>

      {/* Unused Rewards & Pool Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
        {/* Unused Rewards Audit */}
        <div className="p-4 rounded-xl bg-[#171b26] border border-amber-500/30 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#262a35]">
            <span className="font-bold text-amber-300 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              <span>identify_unused_rewards()</span>
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
              {unusedRewards.length} Stagnant Perks
            </span>
          </div>

          <div className="space-y-2">
            {unusedRewards.map((r, i) => (
              <div key={i} className="p-2.5 rounded-lg bg-[#141824] border border-[#262a35] flex items-center justify-between">
                <div>
                  <div className="font-semibold text-[#dfe2f0]">{r.title}</div>
                  <div className="text-[11px] text-[#939183]">Pool: {r.poolName}</div>
                </div>
                <div className="text-right font-mono text-[11px]">
                  <div className="text-amber-300">{r.stock} in stock</div>
                  <div className="text-[#939183]">{r.redeemed} redeemed</div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() =>
              setPendingAction({
                title: 'Re-Allocate Stagnant Inventory to Flash Quests',
                description:
                  'This will repackage the stagnant passes into high-velocity 48-hour weekend streak rewards to liquidate excess stock. Requires explicit sign-off.',
                onConfirm: () => {
                  setNotification('Stagnant benefits reallocated to active Flash Quest catalog.');
                },
              })
            }
            className="w-full py-1.5 rounded-lg bg-[#141824] hover:bg-[#1b1f2a] text-xs font-semibold text-[#e4e1a9] border border-[#e4e1a9]/40 cursor-pointer"
          >
            Re-Package into Flash Quests
          </button>
        </div>

        {/* AI Pool Recommendations */}
        <div className="p-4 rounded-xl bg-[#171b26] border border-[#e4e1a9]/40 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#262a35]">
            <span className="font-bold text-[#e4e1a9] flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              <span>recommend_pool_changes()</span>
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#141824] text-[#e4e1a9]">
              Target: {recommendations.poolName}
            </span>
          </div>

          <ul className="space-y-2 text-xs text-[#cac7b8]">
            {recommendations.recommendedChanges.map((rec, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#e4e1a9] mt-1.5 shrink-0" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>

          <div className="pt-2 border-t border-[#262a35]">
            <button
              onClick={() =>
                setPendingAction({
                  title: 'Authorize Pool Rebalancing & Milestone Addition',
                  description:
                    'This will introduce a 300 CRD milestone benefit to the Fitness & Wellness Pool and trigger partner onboarding invitations. Changes require manual confirmation.',
                  onConfirm: () => {
                    setNotification('Fitness Pool rebalancing scheduled and milestone perk drafted.');
                  },
                })
              }
              className="px-4 py-2 rounded-lg bg-[#e4e1a9] hover:bg-[#d8d598] text-[#171b26] text-xs font-bold transition-all cursor-pointer shadow-sm"
            >
              Apply Recommended Pool Changes
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {pendingAction && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141824] border border-[#e4e1a9]/50 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#262a35]">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-center justify-center">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#dfe2f0]">{pendingAction.title}</h4>
                <p className="text-[11px] text-[#939183]">Confirmation Required: Economic Governance</p>
              </div>
            </div>

            <p className="text-xs text-[#cac7b8] leading-relaxed">{pendingAction.description}</p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setPendingAction(null)}
                className="px-3.5 py-2 rounded-lg bg-[#171b26] hover:bg-[#1b1f2a] text-xs font-medium text-[#939183] hover:text-[#dfe2f0] border border-[#262a35] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  pendingAction.onConfirm();
                  setPendingAction(null);
                }}
                className="px-4 py-2 rounded-lg bg-[#e4e1a9] hover:bg-[#d8d598] text-[#171b26] text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Confirm &amp; Proceed</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
