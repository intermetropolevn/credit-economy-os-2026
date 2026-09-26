import React, { useState } from 'react';
import { User } from '../types';
import { mcpIntelligence } from '../services/mcpIntelligenceService';
import { useEconomic } from '../context/EconomicContext';
import {
  Sparkles,
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Layers,
  Target,
  RefreshCw,
  Coins,
  Compass,
  Check,
  X,
  Shield,
  HelpCircle,
} from 'lucide-react';

interface UserAIIntelligenceCardProps {
  user: User;
  onNavigateToPool?: (poolId: string) => void;
  onRequestCampaignCreate?: (userName: string) => void;
}

export const UserAIIntelligenceCard: React.FC<UserAIIntelligenceCardProps> = ({
  user,
  onNavigateToPool,
  onRequestCampaignCreate,
}) => {
  const { navigate, setSelectedPoolId } = useEconomic();

  const presetQuestions = [
    "Why hasn't this user redeemed their Credits?",
    'What should we recommend to this user?',
    'Which campaigns is this user likely to engage with?',
    'How did this user earn most of their Credits?',
    'Is this user close to unlocking anything?',
  ];

  const [activeQuestion, setActiveQuestion] = useState<string>(presetQuestions[0]);
  const [customQuery, setCustomQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [retrievalStage, setRetrievalStage] = useState('');
  const [insightData, setInsightData] = useState(() =>
    mcpIntelligence.askAIAboutUser(user.id, presetQuestions[0])
  );

  // Confirmation modal state for write actions
  const [pendingAction, setPendingAction] = useState<{
    type: 'CAMPAIGN' | 'POOL_RECOMMENDATION';
    title: string;
    details: string;
  } | null>(null);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  const runQuery = (q: string) => {
    setActiveQuestion(q);
    setIsLoading(true);
    setActionSuccessMessage(null);

    // Realistic stepwise MCP telemetry
    setRetrievalStage('Querying get_user_profile() & get_user_activity()...');
    setTimeout(() => {
      setRetrievalStage('Evaluating credit history & pool behavior...');
      setTimeout(() => {
        setRetrievalStage('Synthesizing behavioral patterns via MCP...');
        setTimeout(() => {
          const res = mcpIntelligence.askAIAboutUser(user.id, q);
          setInsightData(res);
          setIsLoading(false);
          setRetrievalStage('');
        }, 300);
      }, 300);
    }, 250);
  };

  const handleExecuteConfirmedAction = () => {
    if (!pendingAction) return;

    if (pendingAction.type === 'CAMPAIGN') {
      if (onRequestCampaignCreate) {
        onRequestCampaignCreate(user.name);
      } else {
        // Dispatch campaign builder trigger with pre-filled audience
        window.dispatchEvent(
          new CustomEvent('open-credit-economy-ai', {
            detail: {
              query: `Create targeted re-engagement campaign for ${user.name} with 160 Credit reward.`,
            },
          })
        );
      }
      setActionSuccessMessage(
        `Draft campaign "${insightData.suggestedCampaign}" committed in pending draft state for ${user.name}.`
      );
    } else if (pendingAction.type === 'POOL_RECOMMENDATION') {
      setActionSuccessMessage(
        `Destination recommendation for "${insightData.suggestedPoolName}" logged and sent to patron inbox.`
      );
    }

    setPendingAction(null);
  };

  const handleViewPool = () => {
    if (onNavigateToPool) {
      onNavigateToPool(insightData.suggestedPoolId);
    } else {
      setSelectedPoolId(insightData.suggestedPoolId);
      navigate('/pools');
    }
  };

  return (
    <div className="bg-[#141824] border border-[#e4e1a9]/40 rounded-xl p-5 space-y-4 shadow-xl relative overflow-hidden">
      {/* Decorative gradient corner */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#e4e1a9]/5 rounded-bl-full pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#262a35]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#1b1f2a] border border-[#e4e1a9]/40 text-[#e4e1a9] flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-[#e4e1a9]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-[#dfe2f0]">
                Ask AI about this user
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1b1f2a] text-[#e4e1a9] border border-[#e4e1a9]/30">
                MCP INTELLIGENCE LAYER
              </span>
            </div>
            <p className="text-[11px] text-[#939183]">
              Retrieves profile + activity + credit history + campaign participation + pool behavior + redemption history.
            </p>
          </div>
        </div>

        <div className="text-xs font-mono text-[#939183]">
          Subject: <span className="text-[#dfe2f0] font-bold">{user.name}</span> ({user.creditAccount.availableCredit.toLocaleString()} CRD avail)
        </div>
      </div>

      {/* Preset Question Chips */}
      <div className="space-y-2">
        <label className="text-[11px] font-mono text-[#939183] uppercase tracking-wider block">
          Select or Ask a Question:
        </label>
        <div className="flex flex-wrap gap-1.5">
          {presetQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => runQuery(q)}
              className={`px-3 py-1.5 rounded-lg text-xs transition-all text-left cursor-pointer border ${
                activeQuestion === q
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
                  runQuery(customQuery.trim());
                  setCustomQuery('');
                }
              }}
              placeholder="Ask custom question about patron behavior, risk, or incentives..."
              className="w-full bg-[#10141f] border border-[#262a35] rounded-lg pl-9 pr-3 py-2 text-xs text-[#dfe2f0] placeholder-[#939183] focus:outline-none focus:border-[#e4e1a9]"
            />
          </div>
          <button
            onClick={() => {
              if (customQuery.trim()) {
                runQuery(customQuery.trim());
                setCustomQuery('');
              }
            }}
            disabled={!customQuery.trim() || isLoading}
            className="px-3.5 py-2 rounded-lg bg-[#1b1f2a] hover:bg-[#262a35] disabled:opacity-50 text-xs font-semibold text-[#e4e1a9] border border-[#262a35] transition-colors cursor-pointer"
          >
            Ask
          </button>
        </div>
      </div>

      {/* Loading telemetry indicator */}
      {isLoading && (
        <div className="p-3.5 rounded-xl bg-[#10141f] border border-[#e4e1a9]/30 flex items-center gap-3 animate-pulse">
          <RefreshCw className="w-4 h-4 text-[#e4e1a9] animate-spin" />
          <span className="text-xs font-mono text-[#e4e1a9]">{retrievalStage}</span>
        </div>
      )}

      {/* Success Banner */}
      {actionSuccessMessage && (
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{actionSuccessMessage}</span>
          </div>
          <button
            onClick={() => setActionSuccessMessage(null)}
            className="text-emerald-400 hover:text-emerald-200"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Synthesis Display */}
      {!isLoading && insightData && (
        <div className="space-y-4 pt-1">
          {/* Active Question Badge */}
          <div className="text-xs text-[#939183] font-mono">
            Query: &ldquo;<span className="text-[#dfe2f0]">{insightData.question}</span>&rdquo;
          </div>

          {/* USER INSIGHT */}
          <div className="p-4 rounded-xl bg-[#171b26] border border-[#262a35] space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold font-mono text-[#e4e1a9] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#e4e1a9]" />
              <span>USER INSIGHT</span>
            </div>
            <p className="text-xs text-[#dfe2f0] leading-relaxed">
              &ldquo;{insightData.userInsight}&rdquo;
            </p>
          </div>

          {/* RECOMMENDED ACTION */}
          <div className="p-4 rounded-xl bg-[#10141f] border border-[#e4e1a9]/40 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold font-mono text-[#dfe2f0] uppercase tracking-wider">
                <Target className="w-3.5 h-3.5 text-emerald-400" />
                <span>RECOMMENDED ACTION</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1b1f2a] text-emerald-300 border border-emerald-500/30">
                Awaiting Admin Confirmation
              </span>
            </div>

            <p className="text-sm font-semibold text-[#e4e1a9]">
              &ldquo;{insightData.recommendedAction}&rdquo;
            </p>

            {/* Action Buttons: [View Pool] [Create Campaign] [No action] */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#262a35]">
              <button
                onClick={handleViewPool}
                className="px-3 py-1.5 rounded-lg bg-[#1b1f2a] hover:bg-[#262a35] text-xs font-semibold text-[#dfe2f0] hover:text-[#e4e1a9] border border-[#262a35] flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5 text-[#e4e1a9]" />
                <span>View Pool</span>
              </button>

              <button
                onClick={() =>
                  setPendingAction({
                    type: 'CAMPAIGN',
                    title: `Create Campaign Draft for ${user.name}`,
                    details: `This will initialize an AI campaign draft targeting ${user.name}'s segment (Fitness & Food enthusiasts) with a 160 Credit completion incentive. No budget will be burned until final manual approval.`,
                  })
                }
                className="px-3.5 py-1.5 rounded-lg bg-[#e4e1a9] hover:bg-[#d8d598] text-[#171b26] text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
              >
                <Target className="w-3.5 h-3.5" />
                <span>Create Campaign</span>
              </button>

              <button
                onClick={() => {
                  setActionSuccessMessage(`Recommendation marked as dismissed. No ledger or state change made.`);
                }}
                className="px-3 py-1.5 rounded-lg bg-[#171b26] hover:bg-[#1b1f2a] text-xs text-[#939183] hover:text-[#dfe2f0] border border-[#262a35] transition-colors cursor-pointer"
              >
                No action
              </button>
            </div>
          </div>

          {/* Collapsible Retrieval Context (Auditability) */}
          <div className="text-[11px] text-[#939183] bg-[#10141f] p-3 rounded-lg border border-[#262a35] space-y-1">
            <span className="font-mono font-bold text-[#c8c58f] block">
              MCP Evidence Chain (Read Tools):
            </span>
            <ul className="list-disc list-inside space-y-0.5 text-[#cac7b8]">
              {insightData.retrievalContext.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Write Action */}
      {pendingAction && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141824] border border-[#e4e1a9]/50 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#262a35]">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-center justify-center">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#dfe2f0]">{pendingAction.title}</h4>
                <p className="text-[11px] text-[#939183]">Strict Economic Governance: Explicit Authorization Required</p>
              </div>
            </div>

            <p className="text-xs text-[#cac7b8] leading-relaxed">
              {pendingAction.details}
            </p>

            <div className="p-3 rounded-lg bg-[#171b26] border border-[#262a35] text-xs font-mono space-y-1">
              <div className="text-[#939183]">User: <span className="text-[#dfe2f0]">{user.name}</span></div>
              <div className="text-[#939183]">Action Type: <span className="text-[#e4e1a9]">{pendingAction.type}</span></div>
              <div className="text-[#939183]">Ledger Impact: <span className="text-emerald-400">Non-destructive (Draft only)</span></div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setPendingAction(null)}
                className="px-3.5 py-2 rounded-lg bg-[#171b26] hover:bg-[#1b1f2a] text-xs font-medium text-[#939183] hover:text-[#dfe2f0] border border-[#262a35] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteConfirmedAction}
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
