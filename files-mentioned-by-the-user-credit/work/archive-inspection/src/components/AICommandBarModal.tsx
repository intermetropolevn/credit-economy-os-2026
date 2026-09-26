import React, { useState, useEffect, useRef } from 'react';
import { useEconomic } from '../context/EconomicContext';
import {
  MCP_TOOL_REGISTRY,
  parseNLQueryToMCPPlan,
  MCPExecutionPlan,
} from '../services/mcpOrchestrationService';
import {
  Sparkles,
  Search,
  X,
  Compass,
  Tag,
  Users,
  Target,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Building2,
  Terminal,
  Zap,
  Check,
  ExternalLink,
  ChevronRight,
  Layers,
  ShoppingBag,
} from 'lucide-react';

interface AICommandBarModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

export const AICommandBarModal: React.FC<AICommandBarModalProps> = ({
  isOpen,
  onClose,
  initialQuery = '',
}) => {
  const {
    users,
    selectedUserId,
    pools,
    quests,
    campaigns,
    organizations,
    rewardPools,
    navigate,
    createCampaign,
    redeemPoolBenefit,
    allocateCreditsToGoal,
  } = useEconomic();

  const selectedUser = users.find((u) => u.id === selectedUserId) || users[0];

  const [inputQuery, setInputQuery] = useState(initialQuery);
  const [activePlan, setActivePlan] = useState<MCPExecutionPlan | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [executionSuccessMsg, setExecutionSuccessMsg] = useState<string | null>(null);
  const [governanceStepActive, setGovernanceStepActive] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      if (initialQuery) {
        handleExecuteQuery(initialQuery);
      }
    } else {
      setActivePlan(null);
      setExecutionSuccessMsg(null);
      setGovernanceStepActive(0);
    }
  }, [isOpen, initialQuery]);

  // Keyboard shortcut ESC to close
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleExecuteQuery = (textToRun: string) => {
    if (!textToRun.trim()) return;
    setInputQuery(textToRun);
    setIsProcessing(true);
    setExecutionSuccessMsg(null);
    setGovernanceStepActive(1);

    setTimeout(() => {
      setGovernanceStepActive(2);
      setTimeout(() => {
        setGovernanceStepActive(3);
        const plan = parseNLQueryToMCPPlan(textToRun, {
          selectedUser,
          pools,
          users,
          quests,
          campaigns,
          organizations,
          rewardPools,
        });
        setActivePlan(plan);
        setIsProcessing(false);
      }, 250);
    }, 200);
  };

  const handleConfirmPlanExecution = () => {
    if (!activePlan) return;
    setIsProcessing(true);

    // Simulate deterministic engine validation and state mutation
    setTimeout(() => {
      if (activePlan.category === 'CONFIGURE' && activePlan.previewPayload.campaignName) {
        createCampaign({
          name: activePlan.previewPayload.campaignName,
          description: 'AI-configured 48-Hour Weekend Re-Engagement Drive for dormant patrons.',
          organizationId: 'org-abc-coffee',
          organizationName: 'ABC Coffee & Nomad Stay Coalition',
          ownershipType: 'PARTNER',
          questIds: ['qst-01', 'qst-03'],
          audience: activePlan.previewPayload.targetSegment,
          timeline: '48 Hours',
          budget: activePlan.previewPayload.budgetEnvelope,
          budgetUsed: 0,
          creditStrategy: 'Weekend Double Earning Multiplier (+400 CRD)',
          rewardStrategy: 'Free Coffee & Discounted Stay Vouchers',
          status: 'Active',
          participants: 0,
          questStarts: 0,
          questCompletions: 0,
          conversionRate: 0,
          creditsIssued: 0,
          redemptionRate: 0,
          roiMetric: 'Target 3.2x re-activation ROI',
        });
        setExecutionSuccessMsg(
          'Campaign successfully validated by Rules Engine and published with 15,000 CRD allocated budget envelope.'
        );
      } else {
        setExecutionSuccessMsg(
          'Action executed and verified across the deterministic rules engine and double-entry ledger.'
        );
      }
      setIsProcessing(false);
    }, 600);
  };

  if (!isOpen) return null;

  const examplePrompts = [
    'I want to increase first purchases among fitness enthusiasts.',
    'Find benefits I can redeem with 700 Credits.',
    'Create a weekend campaign for inactive users.',
    'Why is Pool A underperforming?',
    'Find partners interested in acquiring fitness users.',
    'Show me users who earn Credits but rarely redeem them.',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-start justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="bg-[#10141f] border border-[#e4e1a9]/40 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden my-auto space-y-0 relative text-xs">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#e4e1a9]/5 rounded-full blur-3xl pointer-events-none" />

        {/* Top Input Header Bar */}
        <div className="p-4 sm:p-5 border-b border-[#262a35] bg-[#141824] flex items-center gap-3 relative z-10">
          <div className="w-8 h-8 rounded-lg bg-[#1b1f2a] border border-[#e4e1a9]/40 text-[#e4e1a9] flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-[#e4e1a9]" />
          </div>

          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleExecuteQuery(inputQuery);
                }
              }}
              placeholder="Ask Credit Economy... (e.g. Find benefits I can redeem with 700 Credits)"
              className="w-full bg-transparent text-sm sm:text-base font-medium text-[#dfe2f0] placeholder-[#939183] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleExecuteQuery(inputQuery)}
              disabled={!inputQuery.trim() || isProcessing}
              className="px-3.5 py-1.5 rounded-lg bg-[#e4e1a9] hover:bg-[#d8d598] text-[#171b26] text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
            >
              <span>Query MCP</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#939183] hover:text-[#dfe2f0] hover:bg-[#1b1f2a] cursor-pointer"
              title="Close (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Example Query Pills */}
        <div className="p-3 bg-[#0c1019] border-b border-[#262a35] flex items-center gap-2 overflow-x-auto text-[11px]">
          <span className="text-[#939183] shrink-0 font-mono text-[10px] uppercase">
            Quick Inquiries:
          </span>
          {examplePrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleExecuteQuery(prompt)}
              className="px-2.5 py-1 rounded-full bg-[#141824] hover:bg-[#1b1f2a] border border-[#262a35] text-[#cac7b8] hover:text-[#e4e1a9] whitespace-nowrap transition-colors cursor-pointer shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Body Content Area */}
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto relative z-10">
          {/* Active Processing Loader */}
          {isProcessing && (
            <div className="p-8 text-center space-y-3">
              <div className="w-9 h-9 border-2 border-[#e4e1a9] border-t-transparent rounded-full animate-spin mx-auto" />
              <div className="text-xs text-[#cac7b8] font-mono">
                AI Agent orchestrating MCP Tools &amp; Validating Rules Engine...
              </div>
            </div>
          )}

          {/* Success Banner */}
          {executionSuccessMsg && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 flex items-center gap-3 shadow-md animate-fadeIn">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div className="flex-1">
                <div className="font-bold text-xs">Deterministic Execution Succeeded</div>
                <div className="text-[11px] text-emerald-300/90 mt-0.5">{executionSuccessMsg}</div>
              </div>
            </div>
          )}

          {/* Execution Plan & Findings */}
          {activePlan && !isProcessing && (
            <div className="space-y-4 animate-fadeIn">
              {/* Header Box: Identified MCP Tools & Intent */}
              <div className="p-3.5 rounded-xl bg-[#141824] border border-[#262a35] space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#171b26] text-[#e4e1a9] border border-[#e4e1a9]/30 font-bold uppercase">
                      {activePlan.category}
                    </span>
                    <span className="text-xs font-semibold text-[#dfe2f0]">
                      {activePlan.intentSummary}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#939183]">
                    {activePlan.selectedTools.length} MCP Tools Resolved
                  </span>
                </div>

                {/* Selected Tools Pills */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  <span className="text-[10px] text-[#939183] font-mono">Invoked:</span>
                  {activePlan.selectedTools.map((tool, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded font-mono text-[10px] bg-[#171b26] text-[#c8c58f] border border-[#262a35]"
                    >
                      {tool}()
                    </span>
                  ))}
                </div>
              </div>

              {/* Strict Governance Pipeline Visualizer */}
              <div className="p-3.5 rounded-xl bg-[#0c1019] border border-[#262a35] space-y-2">
                <div className="flex items-center justify-between text-[11px] text-[#939183]">
                  <span className="font-mono font-bold uppercase tracking-wider text-[#e4e1a9] flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#e4e1a9]" />
                    <span>Governance Rule Pipeline Enforcement</span>
                  </span>
                  <span className="text-[10px] text-[#939183]">
                    AI Never Mutates Ledger Directly
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-1">
                  {activePlan.governancePipeline.map((step) => (
                    <div
                      key={step.step}
                      className={`p-2.5 rounded-lg border text-[11px] space-y-1 ${
                        step.status === 'PASS'
                          ? 'bg-[#141824] border-emerald-500/30'
                          : step.status === 'WARN'
                          ? 'bg-[#141824] border-amber-500/40 text-amber-300'
                          : 'bg-[#141824] border-[#262a35]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#dfe2f0] flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>{step.label}</span>
                        </span>
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#10141f] text-emerald-400 border border-emerald-500/30 font-bold">
                          {step.status}
                        </span>
                      </div>
                      <div className="text-[10px] text-[#cac7b8] leading-tight">
                        {step.detail}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contextual Results Display */}
              {/* Scenario 1: Benefits under 700 Credits */}
              {activePlan.previewPayload?.destinationBenefits && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#dfe2f0]">
                      Affordable Benefits (Available under {activePlan.previewPayload.maxCredits} CRD)
                    </span>
                    <span className="text-[11px] text-[#939183] font-mono">
                      Sarah Chen Balance: {selectedUser.creditAccount.availableCredit.toLocaleString()} CRD
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {activePlan.previewPayload.destinationBenefits.map((b: any) => (
                      <div
                        key={b.id}
                        className="p-3 rounded-xl bg-[#141824] border border-[#262a35] hover:border-[#e4e1a9]/50 transition-colors space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#171b26] text-[#c8c58f] border border-[#262a35]">
                            {b.type} · {b.poolName}
                          </span>
                          <span className="font-mono text-sm font-bold text-[#e4e1a9]">
                            {b.cost.toLocaleString()} CRD
                          </span>
                        </div>
                        <div>
                          <div className="font-bold text-xs text-[#dfe2f0]">{b.name}</div>
                          <div className="text-[10px] text-[#939183]">Provider: {b.provider}</div>
                        </div>
                        <div className="flex items-center justify-between pt-1 border-t border-[#262a35] text-[10px]">
                          <span className="text-emerald-400">{b.inventory} units available</span>
                          <button
                            onClick={() => {
                              onClose();
                              navigate(`/pools/${b.poolId}`);
                            }}
                            className="px-2 py-1 rounded bg-[#e4e1a9] hover:bg-[#d8d598] text-[#171b26] font-bold cursor-pointer transition-all"
                          >
                            Save or Redeem in Pool
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Scenario 2: Campaign Configuration / Brand Proposal Preview */}
              {activePlan.previewPayload?.campaignName && (
                <div className="p-4 rounded-xl bg-[#141824] border border-[#e4e1a9]/40 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#171b26] text-[#e4e1a9] border border-[#e4e1a9]/30 uppercase font-bold">
                        {activePlan.previewPayload.isBrandProposal ? 'CAMPAIGN PROPOSAL' : 'AI Configuration Proposal'}
                      </span>
                      <h4 className="text-sm font-bold text-[#dfe2f0] mt-1">
                        {activePlan.previewPayload.campaignName}
                      </h4>
                    </div>
                    <span className="text-sm font-mono font-bold text-[#e4e1a9]">
                      Budget: {activePlan.previewPayload.budget || `${activePlan.previewPayload.budgetEnvelope.toLocaleString()} Credits`}
                    </span>
                  </div>

                  {activePlan.previewPayload.isBrandProposal ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                        <div className="p-2.5 rounded-lg bg-[#0c1019] border border-[#262a35] space-y-0.5">
                          <span className="text-[#939183] text-[10px] font-mono uppercase">Objective:</span>
                          <div className="font-bold text-[#dfe2f0]">{activePlan.previewPayload.objective}</div>
                        </div>
                        <div className="p-2.5 rounded-lg bg-[#0c1019] border border-[#262a35] space-y-0.5">
                          <span className="text-[#939183] text-[10px] font-mono uppercase">Target:</span>
                          <div className="font-bold text-[#dfe2f0]">{activePlan.previewPayload.targetAudience}</div>
                        </div>
                        <div className="p-2.5 rounded-lg bg-[#0c1019] border border-[#262a35] space-y-0.5">
                          <span className="text-[#939183] text-[10px] font-mono uppercase">Trigger:</span>
                          <div className="font-bold text-[#dfe2f0]">{activePlan.previewPayload.trigger}</div>
                        </div>
                        <div className="p-2.5 rounded-lg bg-[#0c1019] border border-[#262a35] space-y-0.5">
                          <span className="text-[#939183] text-[10px] font-mono uppercase">Reward:</span>
                          <div className="font-bold text-[#e4e1a9] font-mono">{activePlan.previewPayload.reward}</div>
                        </div>
                        <div className="p-2.5 rounded-lg bg-[#0c1019] border border-[#262a35] space-y-0.5">
                          <span className="text-[#939183] text-[10px] font-mono uppercase">Budget:</span>
                          <div className="font-bold text-[#dfe2f0] font-mono">{activePlan.previewPayload.budget}</div>
                        </div>
                        <div className="p-2.5 rounded-lg bg-[#0c1019] border border-[#262a35] space-y-0.5">
                          <span className="text-[#939183] text-[10px] font-mono uppercase">Duration:</span>
                          <div className="font-bold text-[#dfe2f0]">{activePlan.previewPayload.duration}</div>
                        </div>
                        <div className="p-2.5 rounded-lg bg-[#0c1019] border border-[#262a35] space-y-0.5">
                          <span className="text-[#939183] text-[10px] font-mono uppercase">Suggested Pool:</span>
                          <div className="font-bold text-emerald-400">{activePlan.previewPayload.suggestedPool}</div>
                        </div>
                        <div className="p-2.5 rounded-lg bg-[#0c1019] border border-[#262a35] space-y-0.5">
                          <span className="text-[#939183] text-[10px] font-mono uppercase">Expected Users:</span>
                          <div className="font-bold text-[#dfe2f0] font-mono">{activePlan.previewPayload.expectedUsers}</div>
                        </div>
                      </div>

                      {/* AI Explained Assumptions */}
                      {activePlan.previewPayload.assumptions && (
                        <div className="p-3 rounded-lg bg-[#0c1019] border border-[#262a35] space-y-1.5">
                          <div className="text-[10px] font-mono text-[#e4e1a9] uppercase font-bold">
                            AI Explained Assumptions &amp; Safeguards:
                          </div>
                          <ul className="space-y-1 text-[11px] text-[#cac7b8]">
                            {activePlan.previewPayload.assumptions.map((item: string, i: number) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <span className="text-[#e4e1a9]">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Action CTAs: [Edit campaign], [Preview], [Create draft], and Authorize */}
                      <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-[#262a35]">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              onClose();
                              navigate('/programs?tab=campaigns');
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-[#171b26] hover:bg-[#1b1f2a] text-[#dfe2f0] text-xs font-medium cursor-pointer transition-colors"
                          >
                            [Edit campaign]
                          </button>
                          <button
                            onClick={() => {
                              onClose();
                              navigate('/programs?tab=campaigns');
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-[#171b26] hover:bg-[#1b1f2a] text-[#dfe2f0] text-xs font-medium cursor-pointer transition-colors"
                          >
                            [Preview]
                          </button>
                          <button
                            onClick={handleConfirmPlanExecution}
                            className="px-3 py-1.5 rounded-lg bg-[#171b26] hover:bg-[#1b1f2a] border border-[#e4e1a9]/40 text-[#e4e1a9] text-xs font-bold cursor-pointer transition-colors"
                          >
                            [Create draft]
                          </button>
                        </div>

                        <button
                          onClick={handleConfirmPlanExecution}
                          className="px-4 py-1.5 rounded-lg bg-[#e4e1a9] hover:bg-[#d8d598] text-[#171b26] font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer hover:scale-[1.01]"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Authorize &amp; Launch</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] pt-1">
                        <div className="p-2 rounded bg-[#171b26] border border-[#262a35]">
                          <div className="text-[#939183]">Target Segment</div>
                          <div className="font-semibold text-[#dfe2f0]">{activePlan.previewPayload.targetSegment}</div>
                        </div>
                        <div className="p-2 rounded bg-[#171b26] border border-[#262a35]">
                          <div className="text-[#939183]">Eligible Patrons</div>
                          <div className="font-semibold text-emerald-300">{activePlan.previewPayload.eligibleUsersCount} users</div>
                        </div>
                        <div className="p-2 rounded bg-[#171b26] border border-[#262a35]">
                          <div className="text-[#939183]">Reward Incentive</div>
                          <div className="font-semibold text-[#e4e1a9]">+{activePlan.previewPayload.rewardAmount} CRD</div>
                        </div>
                        <div className="p-2 rounded bg-[#171b26] border border-[#262a35]">
                          <div className="text-[#939183]">Active Window</div>
                          <div className="font-semibold text-[#dfe2f0]">{activePlan.previewPayload.duration}</div>
                        </div>
                      </div>

                      {/* Confirmation / Execution CTA */}
                      <div className="pt-2 flex items-center justify-between border-t border-[#262a35]">
                        <div className="text-[11px] text-[#939183]">
                          Deterministic rules engine will lock budget and publish to programs engine.
                        </div>
                        <button
                          onClick={handleConfirmPlanExecution}
                          className="px-4 py-2 rounded-lg bg-[#e4e1a9] hover:bg-[#d8d598] text-[#171b26] font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer hover:scale-[1.01]"
                        >
                          <Play className="w-3.5 h-3.5" />
                          <span>Approve &amp; Launch Campaign</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Scenario 3: Underperforming Pool Diagnosis */}
              {activePlan.previewPayload?.primaryFriction && (
                <div className="p-4 rounded-xl bg-[#141824] border border-[#262a35] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-[#dfe2f0]">
                        Diagnostic for {activePlan.previewPayload.poolName}
                      </div>
                      <div className="text-[11px] text-amber-300 font-medium">
                        Bottleneck: {activePlan.previewPayload.primaryFriction}
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                      Supply/Demand Asymmetry
                    </span>
                  </div>

                  <p className="text-xs text-[#cac7b8] leading-relaxed">
                    {activePlan.previewPayload.diagnostic}
                  </p>

                  <div className="space-y-1.5 pt-1 border-t border-[#262a35]">
                    <div className="text-[11px] font-bold text-[#dfe2f0] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#e4e1a9]" />
                      <span>AI Orchestration Recommendations:</span>
                    </div>
                    {activePlan.previewPayload.aiRecommendations.map((rec: string, i: number) => (
                      <div
                        key={i}
                        className="p-2 rounded-lg bg-[#171b26] border border-[#262a35] text-[11px] text-[#dfe2f0] flex items-center justify-between gap-2"
                      >
                        <span>{rec}</span>
                        <button
                          onClick={() => {
                            onClose();
                            navigate('/pools/pool-city-life');
                          }}
                          className="px-2 py-0.5 rounded bg-[#1b1f2a] hover:bg-[#262a35] text-[#e4e1a9] text-[10px] font-semibold transition-colors shrink-0 cursor-pointer"
                        >
                          Review in Pool &rarr;
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Scenario 4: Fitness Partner Acquisition Matches */}
              {activePlan.previewPayload?.matches && (
                <div className="space-y-2.5">
                  <div className="text-xs font-bold text-[#dfe2f0]">
                    Synergistic Partner Matching (Fitness Cohorts)
                  </div>
                  <div className="space-y-2">
                    {activePlan.previewPayload.matches.map((m: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-[#141824] border border-[#262a35] space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-[#dfe2f0]">{m.name}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                            {m.synergyScore}% Synergy
                          </span>
                        </div>
                        <p className="text-[11px] text-[#cac7b8]">{m.intent}</p>
                        <div className="text-[10px] text-[#939183] pt-1 border-t border-[#262a35]">
                          <strong className="text-[#e4e1a9]">Proposed Co-Program:</strong> {m.recommendedProgram}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Scenario 5: Dormant Credit Accumulators */}
              {activePlan.previewPayload?.targetUsers && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#dfe2f0]">
                      Identified High-Balance / Low-Velocity Patrons
                    </span>
                    <span className="text-[10px] font-mono text-amber-300">
                      Capital Stagnation Risk
                    </span>
                  </div>

                  <div className="space-y-2">
                    {activePlan.previewPayload.targetUsers.map((u: any) => (
                      <div
                        key={u.id}
                        className="p-3 rounded-xl bg-[#141824] border border-[#262a35] flex items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="font-bold text-[#dfe2f0]">{u.name}</div>
                          <div className="text-[10px] text-[#939183]">
                            Idle Balance: <strong className="text-[#e4e1a9] font-mono">{u.balance.toLocaleString()} CRD</strong> · Last redeem: {u.daysSinceRedemption}d ago
                          </div>
                          <div className="text-[10px] text-emerald-400 mt-0.5">
                            {u.recommendedAction}
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            onClose();
                            navigate('/pools/pool-city-life');
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-[#e4e1a9] hover:bg-[#d8d598] text-[#171b26] text-[11px] font-bold transition-all cursor-pointer shrink-0"
                        >
                          Guide to Destination
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Initial State / Prompt Suggestions if No Active Plan */}
          {!activePlan && !isProcessing && (
            <div className="py-6 px-4 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#141824] border border-[#262a35] text-[#e4e1a9] flex items-center justify-center mx-auto shadow-inner">
                <Compass className="w-6 h-6" />
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h4 className="text-sm font-bold text-[#dfe2f0]">
                  Ask the Credit Economy OS
                </h4>
                <p className="text-xs text-[#939183] leading-relaxed">
                  Query balances, discover partner perks, analyze pool utilization, or instruct AI to draft quest campaigns through the Model Context Protocol.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 max-w-2xl mx-auto pt-2 text-left">
                <div className="p-3 rounded-xl bg-[#141824] border border-[#262a35] space-y-1">
                  <div className="font-bold text-[11px] text-[#e4e1a9] flex items-center gap-1.5">
                    <Search className="w-3.5 h-3.5" />
                    <span>Discover &amp; Query</span>
                  </div>
                  <p className="text-[10px] text-[#939183]">
                    Search affordable perks, query patron balances, and inspect inventory.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-[#141824] border border-[#262a35] space-y-1">
                  <div className="font-bold text-[11px] text-emerald-300 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" />
                    <span>Configure &amp; Recommend</span>
                  </div>
                  <p className="text-[10px] text-[#939183]">
                    Draft re-engagement campaigns and partner synergy programs.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-[#141824] border border-[#262a35] space-y-1">
                  <div className="font-bold text-[11px] text-[#dfe2f0] flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#e4e1a9]" />
                    <span>Govern &amp; Execute</span>
                  </div>
                  <p className="text-[10px] text-[#939183]">
                    Deterministic validation ensures AI never mutates ledger without policy checks.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Bar */}
        <div className="p-3 bg-[#0c1019] border-t border-[#262a35] flex items-center justify-between text-[10px] text-[#939183] font-mono px-4">
          <div className="flex items-center gap-3">
            <span>Model Context Protocol (MCP) Orchestration Layer</span>
            <span>·</span>
            <span>Deterministic Rules Engine Active</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Press</span>
            <kbd className="px-1.5 py-0.5 rounded bg-[#171b26] border border-[#262a35] text-[#dfe2f0]">
              Esc
            </kbd>
            <span>to close</span>
          </div>
        </div>
      </div>
    </div>
  );
};
