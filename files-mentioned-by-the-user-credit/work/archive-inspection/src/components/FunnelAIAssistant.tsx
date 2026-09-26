import React, { useState } from 'react';
import { mcpIntelligence } from '../services/mcpIntelligenceService';
import {
  Sparkles,
  ArrowRight,
  TrendingDown,
  AlertTriangle,
  FlaskConical,
  Target,
  Check,
  CheckCircle2,
  RefreshCw,
  Search,
  Shield,
  Layers,
  ChevronDown,
  X,
  Compass,
} from 'lucide-react';

interface FunnelAIAssistantProps {
  onOpenCampaignBuilder?: (prefillQuery?: string) => void;
}

export const FunnelAIAssistant: React.FC<FunnelAIAssistantProps> = ({
  onOpenCampaignBuilder,
}) => {
  const exampleFunnelQueries = [
    'Why are users dropping after earning Credits?',
    'Where is the largest friction point in the user lifecycle?',
    'Why are first-time purchasers not redeeming benefits?',
    'Is there a credit threshold gap between earn and burn?',
  ];

  const [activeQuery, setActiveQuery] = useState(exampleFunnelQueries[0]);
  const [customQuery, setCustomQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState('');
  const [funnelData, setFunnelData] = useState(() =>
    mcpIntelligence.askAIFunnel(exampleFunnelQueries[0])
  );

  // Confirmation modal state for write actions
  const [pendingAction, setPendingAction] = useState<{
    type: 'EXPERIMENT' | 'CAMPAIGN_DRAFT';
    title: string;
    description: string;
  } | null>(null);

  const [notification, setNotification] = useState<string | null>(null);

  const handleRunAnalysis = (queryText: string) => {
    setActiveQuery(queryText);
    setIsAnalyzing(true);
    setNotification(null);

    setAnalysisStep('Retrieving: Funnel Lifecycle Telemetry...');
    setTimeout(() => {
      setAnalysisStep('Retrieving: Credit Earning Ledger (8,450 records)...');
      setTimeout(() => {
        setAnalysisStep('Retrieving: Pool Discovery & Benefit Catalog Views...');
        setTimeout(() => {
          setAnalysisStep('Identifying drop-offs, segments & threshold mismatches...');
          setTimeout(() => {
            const result = mcpIntelligence.askAIFunnel(queryText);
            setFunnelData(result);
            setIsAnalyzing(false);
            setAnalysisStep('');
          }, 250);
        }, 250);
      }, 250);
    }, 250);
  };

  const handleConfirmWriteAction = () => {
    if (!pendingAction) return;

    if (pendingAction.type === 'EXPERIMENT') {
      setNotification(
        `Experiment "${funnelData.experimentDetails.name}" registered in Test Mode. Auto-routing 20% of new credit recipients to personalized pools.`
      );
    } else if (pendingAction.type === 'CAMPAIGN_DRAFT') {
      if (onOpenCampaignBuilder) {
        onOpenCampaignBuilder(
          'Create targeted campaign for users dropping after earning Credits with instant 150 Credit pool activation bonus'
        );
      } else {
        window.dispatchEvent(
          new CustomEvent('open-credit-economy-ai', {
            detail: {
              query:
                'Create targeted campaign for users dropping after earning Credits with instant 150 Credit pool activation bonus',
            },
          })
        );
      }
      setNotification(
        'Campaign draft successfully created in Draft state. Please review in Campaigns tab before publishing.'
      );
    }

    setPendingAction(null);
  };

  return (
    <div className="bg-[#141824] border border-[#e4e1a9]/40 rounded-xl p-5 space-y-5 shadow-2xl relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#262a35]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#1b1f2a] border border-[#e4e1a9]/40 text-[#e4e1a9] flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-[#e4e1a9]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-[#dfe2f0]">
                Ask AI — Funnel Diagnostics &amp; Drop-Off Intelligence
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1b1f2a] text-[#e4e1a9] border border-[#e4e1a9]/30">
                MCP ENGINE
              </span>
            </div>
            <p className="text-[11px] text-[#939183]">
              Diagnoses conversion friction across Credit Earning, Pool Discovery, and Benefit Redemptions.
            </p>
          </div>
        </div>

        <span className="text-xs font-mono text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-lg">
          Largest Drop: -38% Post-Earn
        </span>
      </div>

      {/* Preset Questions */}
      <div className="space-y-2">
        <label className="text-[11px] font-mono text-[#939183] uppercase tracking-wider block">
          Diagnostic Inquiries:
        </label>
        <div className="flex flex-wrap gap-1.5">
          {exampleFunnelQueries.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleRunAnalysis(q)}
              className={`px-3 py-1.5 rounded-lg text-xs transition-all text-left cursor-pointer border ${
                activeQuery === q
                  ? 'bg-[#1b1f2a] text-[#e4e1a9] border-[#e4e1a9]/60 font-semibold shadow-sm'
                  : 'bg-[#171b26] text-[#cac7b8] border-[#262a35] hover:border-[#3b4152] hover:text-[#dfe2f0]'
              }`}
            >
              {q}
            </button>
          ))}
        </div>

        {/* Custom Input */}
        <div className="flex items-center gap-2 pt-1">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-[#939183] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={customQuery}
              onChange={(e) => setCustomQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && customQuery.trim()) {
                  handleRunAnalysis(customQuery.trim());
                  setCustomQuery('');
                }
              }}
              placeholder="Ask custom question about funnel stages, user drop-offs, or reward friction..."
              className="w-full bg-[#10141f] border border-[#262a35] rounded-lg pl-9 pr-3 py-2 text-xs text-[#dfe2f0] placeholder-[#939183] focus:outline-none focus:border-[#e4e1a9]"
            />
          </div>
          <button
            onClick={() => {
              if (customQuery.trim()) {
                handleRunAnalysis(customQuery.trim());
                setCustomQuery('');
              }
            }}
            disabled={!customQuery.trim() || isAnalyzing}
            className="px-4 py-2 rounded-lg bg-[#1b1f2a] hover:bg-[#262a35] disabled:opacity-50 text-xs font-semibold text-[#e4e1a9] border border-[#262a35] cursor-pointer"
          >
            Diagnose
          </button>
        </div>
      </div>

      {/* Analysis telemetry indicator */}
      {isAnalyzing && (
        <div className="p-4 rounded-xl bg-[#10141f] border border-[#e4e1a9]/30 flex items-center gap-3 animate-pulse">
          <RefreshCw className="w-4 h-4 text-[#e4e1a9] animate-spin" />
          <span className="text-xs font-mono text-[#e4e1a9]">{analysisStep}</span>
        </div>
      )}

      {/* Notification banner */}
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

      {/* Diagnostic Results */}
      {!isAnalyzing && funnelData && (
        <div className="space-y-4 pt-1">
          {/* Visual Retrieval Pipeline */}
          <div className="p-3 rounded-xl bg-[#10141f] border border-[#262a35] space-y-2">
            <div className="text-[10px] font-mono text-[#939183] uppercase tracking-wider">
              MCP Telemetry Retrieval Chain:
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              {funnelData.retrievalChain.map((step, idx) => (
                <React.Fragment key={idx}>
                  <span className="px-2.5 py-1 rounded bg-[#171b26] border border-[#262a35] text-[#dfe2f0]">
                    {step}
                  </span>
                  {idx < funnelData.retrievalChain.length - 1 && (
                    <ArrowRight className="w-3 h-3 text-[#e4e1a9]" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* OBSERVATION */}
          <div className="p-4 rounded-xl bg-[#171b26] border border-amber-500/30 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold font-mono text-amber-300 uppercase tracking-wider">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>OBSERVATION</span>
            </div>
            <p className="text-sm font-semibold text-[#dfe2f0]">
              &ldquo;{funnelData.observation}&rdquo;
            </p>
          </div>

          {/* POSSIBLE CAUSES */}
          <div className="p-4 rounded-xl bg-[#171b26] border border-[#262a35] space-y-2">
            <div className="text-xs font-bold font-mono text-[#e4e1a9] uppercase tracking-wider">
              POSSIBLE CAUSES
            </div>
            <ul className="space-y-1.5 text-xs text-[#cac7b8]">
              {funnelData.possibleCauses.map((cause, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#e4e1a9] mt-1.5 shrink-0" />
                  <span>{cause}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* IDENTIFIED BOTTLENECK AUDIT GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-[#10141f] border border-[#262a35] space-y-1">
              <span className="text-[10px] font-mono text-[#939183] uppercase">Largest Drop-Off</span>
              <div className="font-bold text-amber-300">{funnelData.identifiedBottlenecks.largestDropOff}</div>
            </div>
            <div className="p-3 rounded-lg bg-[#10141f] border border-[#262a35] space-y-1">
              <span className="text-[10px] font-mono text-[#939183] uppercase">Segment Affected</span>
              <div className="font-bold text-[#dfe2f0]">{funnelData.identifiedBottlenecks.segmentAffected}</div>
            </div>
            <div className="p-3 rounded-lg bg-[#10141f] border border-[#262a35] space-y-1">
              <span className="text-[10px] font-mono text-[#939183] uppercase">Relevant Campaigns</span>
              <div className="font-bold text-[#e4e1a9]">
                {funnelData.identifiedBottlenecks.relevantCampaigns.join(', ')}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-[#10141f] border border-[#262a35] space-y-1">
              <span className="text-[10px] font-mono text-[#939183] uppercase">Reward Mismatch</span>
              <div className="text-[#cac7b8] text-[11px]">{funnelData.identifiedBottlenecks.possibleRewardMismatch}</div>
            </div>
            <div className="p-3 rounded-lg bg-[#10141f] border border-[#262a35] space-y-1">
              <span className="text-[10px] font-mono text-[#939183] uppercase">Credit Threshold Issue</span>
              <div className="text-[#cac7b8] text-[11px]">{funnelData.identifiedBottlenecks.creditThresholdIssue}</div>
            </div>
            <div className="p-3 rounded-lg bg-[#10141f] border border-[#262a35] space-y-1">
              <span className="text-[10px] font-mono text-[#939183] uppercase">Inventory Status</span>
              <div className="text-[#cac7b8] text-[11px]">{funnelData.identifiedBottlenecks.inventoryIssue}</div>
            </div>
          </div>

          {/* RECOMMENDED EXPERIMENT & ACTIONS */}
          <div className="p-4 rounded-xl bg-[#10141f] border border-[#e4e1a9]/50 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold font-mono text-emerald-300 uppercase tracking-wider">
                <FlaskConical className="w-3.5 h-3.5" />
                <span>RECOMMENDED EXPERIMENT</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1b1f2a] text-[#dfe2f0] border border-[#262a35]">
                Requires Authorization
              </span>
            </div>

            <p className="text-sm font-semibold text-[#e4e1a9]">
              &ldquo;{funnelData.recommendedExperiment}&rdquo;
            </p>

            <div className="text-xs text-[#939183] font-mono">
              Hypothesis: {funnelData.experimentDetails.hypothesis}
            </div>

            {/* Action Buttons: [Create experiment] [Create campaign draft] */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-[#262a35]">
              <button
                onClick={() =>
                  setPendingAction({
                    type: 'EXPERIMENT',
                    title: 'Authorize Funnel A/B Experiment Deployment',
                    description: `This will initialize "${funnelData.experimentDetails.name}" with a sample size of ${funnelData.experimentDetails.sampleSize}. It automatically tracks pool open rates and redemption velocity without changing any monetary parameters.`,
                  })
                }
                className="px-3.5 py-2 rounded-lg bg-[#1b1f2a] hover:bg-[#262a35] text-xs font-bold text-[#e4e1a9] border border-[#e4e1a9]/40 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <FlaskConical className="w-3.5 h-3.5 text-[#e4e1a9]" />
                <span>Create experiment</span>
              </button>

              <button
                onClick={() =>
                  setPendingAction({
                    type: 'CAMPAIGN_DRAFT',
                    title: 'Authorize AI Campaign Draft Creation',
                    description: `This will launch an AI campaign draft targeting first-time credit earners with an instant 150 Credit pool activation bonus to bridge the 38% drop-off. Changes are saved as a Draft only.`,
                  })
                }
                className="px-4 py-2 rounded-lg bg-[#e4e1a9] hover:bg-[#d8d598] text-[#171b26] text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
              >
                <Target className="w-3.5 h-3.5" />
                <span>Create campaign draft</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Write Actions */}
      {pendingAction && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141824] border border-[#e4e1a9]/50 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#262a35]">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-center justify-center">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#dfe2f0]">{pendingAction.title}</h4>
                <p className="text-[11px] text-[#939183]">Confirmation Required: Economic Safety Governance</p>
              </div>
            </div>

            <p className="text-xs text-[#cac7b8] leading-relaxed">
              {pendingAction.description}
            </p>

            <div className="p-3 rounded-lg bg-[#171b26] border border-[#262a35] text-xs font-mono space-y-1">
              <div className="text-[#939183]">Operation: <span className="text-[#e4e1a9]">{pendingAction.type}</span></div>
              <div className="text-[#939183]">State: <span className="text-emerald-400">Non-destructive (Draft &amp; Test mode)</span></div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setPendingAction(null)}
                className="px-3.5 py-2 rounded-lg bg-[#171b26] hover:bg-[#1b1f2a] text-xs font-medium text-[#939183] hover:text-[#dfe2f0] border border-[#262a35] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmWriteAction}
                className="px-4 py-2 rounded-lg bg-[#e4e1a9] hover:bg-[#d8d598] text-[#171b26] text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Confirm &amp; Execute</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
