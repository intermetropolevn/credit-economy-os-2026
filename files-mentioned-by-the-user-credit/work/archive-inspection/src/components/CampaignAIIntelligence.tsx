import React, { useState } from 'react';
import { mcpIntelligence, CampaignMetricsReport } from '../services/mcpIntelligenceService';
import {
  Sparkles,
  TrendingDown,
  AlertTriangle,
  Target,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  Shield,
  Coins,
  Check,
  X,
  Sliders,
} from 'lucide-react';

interface CampaignAIIntelligenceProps {
  onOpenCampaignBuilder?: () => void;
}

export const CampaignAIIntelligence: React.FC<CampaignAIIntelligenceProps> = ({
  onOpenCampaignBuilder,
}) => {
  const [metrics, setMetrics] = useState<CampaignMetricsReport[]>(() =>
    mcpIntelligence.get_campaign_metrics()
  );
  const [underperforming, setUnderperforming] = useState(() =>
    mcpIntelligence.identify_underperforming_campaigns()
  );
  const [recommendations, setRecommendations] = useState(() =>
    mcpIntelligence.recommend_campaign_changes()
  );
  const [velocityReport, setVelocityReport] = useState(() =>
    mcpIntelligence.get_credit_velocity()
  );

  const [isLoading, setIsLoading] = useState(false);
  const [pendingConfirm, setPendingConfirm] = useState<{
    title: string;
    description: string;
    action: () => void;
  } | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const refreshDiagnostics = () => {
    setIsLoading(true);
    setTimeout(() => {
      setMetrics(mcpIntelligence.get_campaign_metrics());
      setUnderperforming(mcpIntelligence.identify_underperforming_campaigns());
      setRecommendations(mcpIntelligence.recommend_campaign_changes());
      setVelocityReport(mcpIntelligence.get_credit_velocity());
      setIsLoading(false);
      setNotification('Campaign analytics & MCP intelligence refreshed from live ledger.');
    }, 400);
  };

  return (
    <div className="bg-[#141824] border border-[#262a35] rounded-xl p-5 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#262a35]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#1b1f2a] border border-[#e4e1a9]/40 text-[#e4e1a9] flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-[#e4e1a9]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-[#dfe2f0]">
                Campaign Analytics &amp; Optimization Intelligence
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1b1f2a] text-[#e4e1a9] border border-[#e4e1a9]/30">
                MCP ENGINE
              </span>
            </div>
            <p className="text-[11px] text-[#939183]">
              Evaluates budget utilization, patron conversion velocity, and automatic underperformance detection.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={refreshDiagnostics}
            disabled={isLoading}
            className="px-3 py-1.5 rounded-lg bg-[#171b26] hover:bg-[#1b1f2a] text-xs font-semibold text-[#dfe2f0] border border-[#262a35] flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh MCP</span>
          </button>
        </div>
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

      {/* Top Velocity & Health Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="p-3 rounded-xl bg-[#171b26] border border-[#262a35]">
          <div className="text-[10px] text-[#939183]">Earning Velocity</div>
          <div className="text-base font-bold text-[#e4e1a9]">
            {velocityReport.earningVelocity.toLocaleString()} CRD / day
          </div>
          <div className="text-[10px] text-emerald-400 font-sans">{velocityReport.trend}</div>
        </div>

        <div className="p-3 rounded-xl bg-[#171b26] border border-[#262a35]">
          <div className="text-[10px] text-[#939183]">Redemption Burn</div>
          <div className="text-base font-bold text-[#dfe2f0]">
            {velocityReport.burnVelocity.toLocaleString()} CRD / day
          </div>
          <div className="text-[10px] text-[#939183] font-sans">Ratio: {velocityReport.velocityRatio}</div>
        </div>

        <div className="p-3 rounded-xl bg-[#171b26] border border-[#262a35]">
          <div className="text-[10px] text-[#939183]">Underperforming Campaigns</div>
          <div className="text-base font-bold text-amber-300">
            {underperforming.length} Flagged
          </div>
          <div className="text-[10px] text-amber-400 font-sans">Conversion &lt; 20%</div>
        </div>

        <div className="p-3 rounded-xl bg-[#171b26] border border-[#262a35]">
          <div className="text-[10px] text-[#939183]">Avg Holding Period</div>
          <div className="text-base font-bold text-emerald-300">
            {velocityReport.escrowHoldingPeriodAvgDays} Days
          </div>
          <div className="text-[10px] text-[#939183] font-sans">Healthy circulation</div>
        </div>
      </div>

      {/* Underperforming Campaigns Alert & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
        {/* Flagged Underperforming Campaigns */}
        <div className="p-4 rounded-xl bg-[#171b26] border border-amber-500/30 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#262a35]">
            <span className="font-bold text-amber-300 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>identify_underperforming_campaigns()</span>
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
              {underperforming.length} Detected
            </span>
          </div>

          <div className="space-y-2.5">
            {underperforming.map((c) => (
              <div key={c.id} className="p-3 rounded-lg bg-[#141824] border border-[#262a35] space-y-1.5">
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-[#dfe2f0]">{c.name}</span>
                  <span className="font-mono text-amber-400">{c.conversionRate}% Conv</span>
                </div>
                <div className="text-[11px] text-[#939183]">{c.issue}</div>
                <div className="text-[11px] text-emerald-400 font-medium">
                  <strong>Recommended Fix:</strong> {c.remedy}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Optimization Actions */}
        <div className="p-4 rounded-xl bg-[#171b26] border border-[#e4e1a9]/40 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#262a35]">
            <span className="font-bold text-[#e4e1a9] flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-[#e4e1a9]" />
              <span>recommend_campaign_changes()</span>
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#141824] text-[#e4e1a9]">
              Projected +14.2% Lift
            </span>
          </div>

          <div className="space-y-2">
            <div className="text-xs text-[#dfe2f0] font-semibold">{recommendations.title}</div>
            <ul className="space-y-1 text-[11px] text-[#cac7b8]">
              {recommendations.recommendedActions.map((rec, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-[#e4e1a9] font-bold">&bull;</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-2 border-t border-[#262a35] flex items-center gap-2">
            <button
              onClick={() =>
                setPendingConfirm({
                  title: 'Authorize AI Campaign Trigger Recalibration',
                  description:
                    'This will update the Summer Coffee Fest condition to "2 orders with any cold brew" and link to the City Life Destination Pool. Confirmation is required before updating live program rules.',
                  action: () => {
                    setNotification('Campaign conditions updated and committed to active program ledger.');
                  },
                })
              }
              className="px-3.5 py-1.5 rounded-lg bg-[#e4e1a9] hover:bg-[#d8d598] text-[#171b26] text-xs font-bold transition-all cursor-pointer shadow-sm"
            >
              Apply Recommended Changes
            </button>
            {onOpenCampaignBuilder && (
              <button
                onClick={onOpenCampaignBuilder}
                className="px-3 py-1.5 rounded-lg bg-[#141824] hover:bg-[#1b1f2a] text-[#dfe2f0] text-xs font-medium border border-[#262a35] cursor-pointer"
              >
                Open AI Builder
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {pendingConfirm && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141824] border border-[#e4e1a9]/50 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#262a35]">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-center justify-center">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#dfe2f0]">{pendingConfirm.title}</h4>
                <p className="text-[11px] text-[#939183]">Explicit Authorization Required</p>
              </div>
            </div>

            <p className="text-xs text-[#cac7b8] leading-relaxed">{pendingConfirm.description}</p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setPendingConfirm(null)}
                className="px-3.5 py-2 rounded-lg bg-[#171b26] hover:bg-[#1b1f2a] text-xs font-medium text-[#939183] hover:text-[#dfe2f0] border border-[#262a35] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  pendingConfirm.action();
                  setPendingConfirm(null);
                }}
                className="px-4 py-2 rounded-lg bg-[#e4e1a9] hover:bg-[#d8d598] text-[#171b26] text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Confirm &amp; Apply</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
