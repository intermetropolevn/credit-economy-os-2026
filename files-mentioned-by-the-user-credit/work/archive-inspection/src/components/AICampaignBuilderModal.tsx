import React, { useState, useEffect } from 'react';
import { useEconomic } from '../context/EconomicContext';
import {
  generateCampaignProposalFromIntent,
  create_campaign_draft,
  create_credit_rule_draft,
  create_pool_draft,
  validate_campaign,
  publish_campaign,
  StructuredCampaignProposal,
  AudienceSegment,
  get_audience_segments,
} from '../services/mcpPartnerCampaignService';
import {
  Sparkles,
  Target,
  ArrowRight,
  ArrowDown,
  Layers,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Clock,
  DollarSign,
  Compass,
  Gift,
  TrendingUp,
  Users,
  Eye,
  Edit3,
  Check,
  X,
  FileCheck2,
  Building2,
  ChevronRight,
  Activity,
  Zap,
  Lock,
  Flame,
  HelpCircle,
} from 'lucide-react';

interface AICampaignBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedOrgId?: string;
  initialIntent?: string;
}

export const AICampaignBuilderModal: React.FC<AICampaignBuilderModalProps> = ({
  isOpen,
  onClose,
  preselectedOrgId,
  initialIntent = 'I want to increase first purchases among fitness enthusiasts.',
}) => {
  const {
    organizations,
    pools,
    campaigns,
    quests,
    creditSamples,
    createCampaign,
    createQuest,
    addRewardRule,
    createPool,
    addPoolBenefit,
    navigate,
  } = useEconomic();

  // Builder Stage (1: INTENT, 2: AUDIENCE, 3: INCENTIVE, 4: ACTIVATION, 5: PROPOSAL_SUMMARY)
  const [currentStage, setCurrentStage] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Form State across the 4 stages
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>(() => {
    return preselectedOrgId || organizations.find((o) => o.type === 'Brand' || o.type === 'Vendor')?.id || organizations[0].id;
  });

  const [naturalIntent, setNaturalIntent] = useState<string>(initialIntent);
  const [selectedPresetGoal, setSelectedPresetGoal] = useState<string>('Acquisition');

  // Stage 2: Audience
  const [selectedSegmentId, setSelectedSegmentId] = useState<string>('seg-fitness-enthusiasts');

  // Stage 3: Incentive
  const [customTrigger, setCustomTrigger] = useState<string>('First verified purchase');
  const [rewardAmount, setRewardAmount] = useState<number>(200);
  const [budgetCap, setBudgetCap] = useState<number>(50000);
  const [durationDays, setDurationDays] = useState<number>(30);

  // Stage 4: Activation
  const [selectedPoolId, setSelectedPoolId] = useState<string>('pool-wellness-vitality');

  // Generated Proposal & Execution Plan
  const [proposal, setProposal] = useState<StructuredCampaignProposal | null>(null);
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);

  // Modal View Modes: 'WIZARD' | 'PROPOSAL_VIEW' | 'EDIT_FORM' | 'PREVIEW'
  const [viewMode, setViewMode] = useState<'WIZARD' | 'PROPOSAL_VIEW' | 'EDIT_FORM' | 'PREVIEW'>('WIZARD');

  // Confirmation modal state for economic authorization
  const [showConfirmAuthorizeModal, setShowConfirmAuthorizeModal] = useState<boolean>(false);
  const [createdCampaignId, setCreatedCampaignId] = useState<string | null>(null);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const contextData = {
    organizations,
    pools,
    campaigns,
    quests,
    creditSamples,
    createCampaign,
    createQuest,
    addRewardRule,
    createPool,
    addPoolBenefit,
  };

  const selectedPartner =
    organizations.find((o) => o.id === selectedPartnerId) || organizations[0];
  const audienceSegments = get_audience_segments(selectedPartnerId, contextData);

  // Preset Prompts for rapid brand testing
  const sampleIntents = [
    'I want to increase first purchases among fitness enthusiasts.',
    'I want to acquire new customers interested in running and give them 200 Credits after their first verified purchase.',
    'Launch a weekend retention drive for coffee lovers with 150 Credits.',
    'Re-engage high-balance dormant patrons with a boutique weekend stay.',
  ];

  // Synthesize or update proposal
  const handleGenerateProposal = (intentText?: string) => {
    const text = intentText || naturalIntent;
    setIsSynthesizing(true);

    setTimeout(() => {
      const generated = generateCampaignProposalFromIntent(text, selectedPartnerId, contextData);

      // Override with user adjustments if modified in earlier steps
      generated.rewardCredits = rewardAmount;
      generated.budgetCredits = budgetCap;
      generated.durationDays = durationDays;
      generated.trigger = customTrigger;

      setProposal(generated);
      setIsSynthesizing(false);
      setViewMode('PROPOSAL_VIEW');
    }, 400);
  };

  // Sync inputs when proposal is loaded
  useEffect(() => {
    if (preselectedOrgId) {
      setSelectedPartnerId(preselectedOrgId);
    }
  }, [preselectedOrgId]);

  // Handle Save Draft (creates campaign + credit rule in Draft state)
  const handleCreateDraft = () => {
    if (!proposal) return;
    const campaignDraft = create_campaign_draft(proposal, contextData);
    create_credit_rule_draft(proposal, contextData);
    create_pool_draft(proposal, contextData);
    validate_campaign(proposal, contextData);

    setCreatedCampaignId(campaignDraft.id);
    setFeedbackToast(`Campaign draft "${campaignDraft.name}" created successfully.`);
    setTimeout(() => setFeedbackToast(null), 4000);
  };

  // Handle Authorize and Publish (Confirmation flow)
  const handleAuthorizeAndPublish = () => {
    if (!proposal) return;
    let targetCampaignId = createdCampaignId;

    if (!targetCampaignId) {
      const campaignDraft = create_campaign_draft(proposal, contextData);
      create_credit_rule_draft(proposal, contextData);
      targetCampaignId = campaignDraft.id;
    }

    const outcome = publish_campaign(
      targetCampaignId,
      `${selectedPartner.primaryContact.name} (${selectedPartner.name})`,
      contextData
    );

    setShowConfirmAuthorizeModal(false);
    setFeedbackToast(outcome.message);
    setTimeout(() => {
      setFeedbackToast(null);
      onClose();
      navigate('/programs?tab=campaigns');
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fadeIn">
      <div className="bg-[#141824] border border-[#e4e1a9]/50 rounded-2xl w-full max-w-5xl my-auto shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* ======================================================== */}
        {/* HEADER BAR                                               */}
        {/* ======================================================== */}
        <div className="p-4 sm:p-5 border-b border-[#262a35] flex items-center justify-between bg-[#10141f] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#1b1f2a] border border-[#e4e1a9]/40 text-[#e4e1a9] flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5 text-[#e4e1a9]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[#dfe2f0]">
                  AI Campaign Builder
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#171b26] text-[#e4e1a9] border border-[#e4e1a9]/30">
                  MCP Programmable Demand OS
                </span>
              </div>
              <p className="text-[11px] text-[#939183]">
                Translate brand business objectives into deterministic credit rules, pool allocations, and incentives.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle if proposal exists */}
            {proposal && (
              <div className="flex items-center bg-[#171b26] p-0.5 rounded-lg border border-[#262a35] text-xs">
                <button
                  onClick={() => setViewMode('WIZARD')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                    viewMode === 'WIZARD' ? 'bg-[#1b1f2a] text-[#e4e1a9]' : 'text-[#939183] hover:text-[#dfe2f0]'
                  }`}
                >
                  4-Stage Builder
                </button>
                <button
                  onClick={() => setViewMode('PROPOSAL_VIEW')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                    viewMode === 'PROPOSAL_VIEW' ? 'bg-[#1b1f2a] text-[#e4e1a9]' : 'text-[#939183] hover:text-[#dfe2f0]'
                  }`}
                >
                  Structured Proposal
                </button>
                <button
                  onClick={() => setViewMode('PREVIEW')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                    viewMode === 'PREVIEW' ? 'bg-[#1b1f2a] text-[#e4e1a9]' : 'text-[#939183] hover:text-[#dfe2f0]'
                  }`}
                >
                  Visual Pipeline
                </button>
              </div>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#939183] hover:text-[#dfe2f0] hover:bg-[#1b1f2a] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toast Feedback */}
        {feedbackToast && (
          <div className="p-3 bg-emerald-500/20 border-b border-emerald-500/40 text-emerald-200 text-xs flex items-center justify-between font-semibold">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{feedbackToast}</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-300">MCP ACTION VERIFIED</span>
          </div>
        )}

        {/* ======================================================== */}
        {/* MAIN BODY VIEWPORT (Scrollable)                          */}
        {/* ======================================================== */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 bg-[#0f131d]">
          {/* ======================================================== */}
          {/* VIEW MODE 1: 4-STAGE INTERACTIVE BUILDER                */}
          {/* ======================================================== */}
          {viewMode === 'WIZARD' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              {/* Stepper Tabs */}
              <div className="grid grid-cols-4 gap-2 text-xs">
                {[
                  { num: 1, label: '1. INTENT', sub: 'What to achieve?' },
                  { num: 2, label: '2. AUDIENCE', sub: 'Who participates?' },
                  { num: 3, label: '3. INCENTIVE', sub: 'What behavior?' },
                  { num: 4, label: '4. ACTIVATION', sub: 'Where rewards live?' },
                ].map((s) => (
                  <button
                    key={s.num}
                    onClick={() => setCurrentStage(s.num as any)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      currentStage === s.num
                        ? 'bg-[#1b1f2a] border-[#e4e1a9] text-[#e4e1a9] shadow-sm ring-1 ring-[#e4e1a9]/30'
                        : currentStage > s.num
                        ? 'bg-[#141824] border-emerald-500/30 text-emerald-400'
                        : 'bg-[#141824]/50 border-[#262a35] text-[#939183]'
                    }`}
                  >
                    <div className="font-bold flex items-center justify-between text-xs">
                      <span>{s.label}</span>
                      {currentStage > s.num ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : null}
                    </div>
                    <div className="text-[10px] opacity-75 mt-0.5">{s.sub}</div>
                  </button>
                ))}
              </div>

              {/* STAGE 1: INTENT */}
              {currentStage === 1 && (
                <div className="p-5 rounded-2xl bg-[#141824] border border-[#262a35] space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-[#dfe2f0] flex items-center gap-2">
                        <Target className="w-4 h-4 text-[#e4e1a9]" />
                        <span>Stage 1: Intent &amp; Business Objective</span>
                      </h3>
                      <p className="text-xs text-[#939183]">
                        Describe what business outcome you want to generate in natural language.
                      </p>
                    </div>

                    {/* Partner Selector */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#939183]">Brand:</span>
                      <select
                        value={selectedPartnerId}
                        onChange={(e) => setSelectedPartnerId(e.target.value)}
                        className="px-2.5 py-1.5 rounded-lg bg-[#0c1019] border border-[#262a35] text-xs text-[#dfe2f0] focus:outline-none"
                      >
                        {organizations.map((org) => (
                          <option key={org.id} value={org.id}>
                            {org.name} ({org.industry})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Natural Language Prompt Area */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#dfe2f0]">
                      Brand Natural Language Input:
                    </label>
                    <div className="relative">
                      <textarea
                        rows={3}
                        value={naturalIntent}
                        onChange={(e) => setNaturalIntent(e.target.value)}
                        placeholder="e.g. I want to acquire new customers interested in running and give them 200 Credits after their first verified purchase."
                        className="w-full p-3.5 rounded-xl bg-[#0c1019] border border-[#262a35] text-xs text-[#dfe2f0] placeholder-[#939183] focus:border-[#e4e1a9]/60 focus:outline-none leading-relaxed"
                      />
                    </div>
                  </div>

                  {/* Clickable Quick Prompt Samples */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-mono text-[#939183] uppercase tracking-wider">
                      Try Sample Business Objectives:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                      {sampleIntents.map((s, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setNaturalIntent(s);
                            handleGenerateProposal(s);
                          }}
                          className="p-2.5 rounded-xl bg-[#171b26] hover:bg-[#1b1f2a] border border-[#262a35] hover:border-[#e4e1a9]/40 text-[#cac7b8] text-left transition-colors cursor-pointer"
                        >
                          "{s}"
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#262a35]">
                    <div className="text-[11px] text-[#939183]">
                      MCP Tool invoked: <code className="text-[#e4e1a9]">get_partner_profile()</code>
                    </div>
                    <button
                      onClick={() => setCurrentStage(2)}
                      className="px-4 py-2 rounded-lg bg-[#e4e1a9] hover:bg-[#d8d598] text-[#171b26] font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <span>Proceed to Audience</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* STAGE 2: AUDIENCE */}
              {currentStage === 2 && (
                <div className="p-5 rounded-2xl bg-[#141824] border border-[#262a35] space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-[#dfe2f0] flex items-center gap-2">
                        <Users className="w-4 h-4 text-[#e4e1a9]" />
                        <span>Stage 2: Audience Cohort Targeting</span>
                      </h3>
                      <p className="text-xs text-[#939183]">
                        Select which customer segment should qualify for this programmable demand campaign.
                      </p>
                    </div>
                    <span className="text-[10px] font-mono text-[#e4e1a9] px-2 py-0.5 rounded bg-[#171b26] border border-[#e4e1a9]/30">
                      get_audience_segments()
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {audienceSegments.map((seg) => (
                      <div
                        key={seg.id}
                        onClick={() => setSelectedSegmentId(seg.id)}
                        className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                          selectedSegmentId === seg.id
                            ? 'bg-[#1b1f2a] border-[#e4e1a9] ring-1 ring-[#e4e1a9]/40'
                            : 'bg-[#0c1019] border-[#262a35] hover:border-[#e4e1a9]/30'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs text-[#dfe2f0]">{seg.name}</span>
                          <span className="font-mono text-xs font-bold text-[#e4e1a9]">
                            {seg.userCount.toLocaleString()} Users
                          </span>
                        </div>
                        <p className="text-[11px] text-[#cac7b8] mb-2 leading-relaxed">
                          {seg.description}
                        </p>
                        <div className="flex items-center justify-between text-[10px] text-[#939183] pt-1.5 border-t border-[#262a35]">
                          <span>Benchmark: {seg.conversionBenchmark}</span>
                          <span className="text-emerald-400 font-semibold">{seg.activityLevel} Activity</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#262a35]">
                    <button
                      onClick={() => setCurrentStage(1)}
                      className="px-3.5 py-1.5 rounded-lg bg-[#1b1f2a] hover:bg-[#262a35] text-xs text-[#cac7b8] cursor-pointer"
                    >
                      &larr; Back to Intent
                    </button>
                    <button
                      onClick={() => setCurrentStage(3)}
                      className="px-4 py-2 rounded-lg bg-[#e4e1a9] hover:bg-[#d8d598] text-[#171b26] font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <span>Proceed to Incentive</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* STAGE 3: INCENTIVE */}
              {currentStage === 3 && (
                <div className="p-5 rounded-2xl bg-[#141824] border border-[#262a35] space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-[#dfe2f0] flex items-center gap-2">
                        <Zap className="w-4 h-4 text-[#e4e1a9]" />
                        <span>Stage 3: Incentive &amp; Verification Trigger</span>
                      </h3>
                      <p className="text-xs text-[#939183]">
                        Configure what behavior unlocks the reward and calibrate budget limits.
                      </p>
                    </div>
                    <span className="text-[10px] font-mono text-[#e4e1a9] px-2 py-0.5 rounded bg-[#171b26] border border-[#e4e1a9]/30">
                      estimate_credit_cost()
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Trigger Input */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#dfe2f0]">
                        Action Trigger Event:
                      </label>
                      <input
                        type="text"
                        value={customTrigger}
                        onChange={(e) => setCustomTrigger(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-[#0c1019] border border-[#262a35] text-xs text-[#dfe2f0] focus:border-[#e4e1a9]/60 focus:outline-none"
                      />
                      <div className="text-[10px] text-[#939183]">e.g. First verified purchase, 3-workout streak, referral</div>
                    </div>

                    {/* Credit Reward */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#dfe2f0]">
                        Credit Reward per Conversion:
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={rewardAmount}
                          onChange={(e) => setRewardAmount(Number(e.target.value))}
                          step={50}
                          min={50}
                          max={5000}
                          className="w-full px-3 py-2 rounded-lg bg-[#0c1019] border border-[#262a35] text-xs font-mono font-bold text-[#e4e1a9] focus:outline-none"
                        />
                        <span className="text-xs font-mono text-[#939183]">CRD</span>
                      </div>
                      <div className="text-[10px] text-[#939183]">Equates to approx. ${(rewardAmount * 0.05).toFixed(2)} USD value</div>
                    </div>

                    {/* Total Budget Cap */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#dfe2f0]">
                        Total Campaign Budget Cap:
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={budgetCap}
                          onChange={(e) => setBudgetCap(Number(e.target.value))}
                          step={5000}
                          min={5000}
                          className="w-full px-3 py-2 rounded-lg bg-[#0c1019] border border-[#262a35] text-xs font-mono font-bold text-[#dfe2f0] focus:outline-none"
                        />
                        <span className="text-xs font-mono text-[#939183]">CRD</span>
                      </div>
                      <div className="text-[10px] text-[#939183]">Maximum cap: enables {(budgetCap / rewardAmount).toFixed(0)} conversions</div>
                    </div>

                    {/* Duration Days */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#dfe2f0]">
                        Campaign Duration:
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={durationDays}
                          onChange={(e) => setDurationDays(Number(e.target.value))}
                          step={7}
                          min={7}
                          max={90}
                          className="w-full px-3 py-2 rounded-lg bg-[#0c1019] border border-[#262a35] text-xs font-mono text-[#dfe2f0] focus:outline-none"
                        />
                        <span className="text-xs text-[#939183]">Days</span>
                      </div>
                      <div className="text-[10px] text-[#939183]">Issuance ceases automatically at deadline</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#262a35]">
                    <button
                      onClick={() => setCurrentStage(2)}
                      className="px-3.5 py-1.5 rounded-lg bg-[#1b1f2a] hover:bg-[#262a35] text-xs text-[#cac7b8] cursor-pointer"
                    >
                      &larr; Back to Audience
                    </button>
                    <button
                      onClick={() => setCurrentStage(4)}
                      className="px-4 py-2 rounded-lg bg-[#e4e1a9] hover:bg-[#d8d598] text-[#171b26] font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <span>Proceed to Activation</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* STAGE 4: ACTIVATION */}
              {currentStage === 4 && (
                <div className="p-5 rounded-2xl bg-[#141824] border border-[#262a35] space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-[#dfe2f0] flex items-center gap-2">
                        <Compass className="w-4 h-4 text-[#e4e1a9]" />
                        <span>Stage 4: Activation &amp; Destination Pool</span>
                      </h3>
                      <p className="text-xs text-[#939183]">
                        "Where should the reward live?" Connect earned credits into an ecosystem destination pool.
                      </p>
                    </div>
                    <span className="text-[10px] font-mono text-[#e4e1a9] px-2 py-0.5 rounded bg-[#171b26] border border-[#e4e1a9]/30">
                      get_pool_options()
                    </span>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-semibold text-[#dfe2f0]">
                      Select Suggested Destination Pool:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {pools.map((p) => (
                        <div
                          key={p.id}
                          onClick={() => setSelectedPoolId(p.id)}
                          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                            selectedPoolId === p.id
                              ? 'bg-[#1b1f2a] border-[#e4e1a9] ring-1 ring-[#e4e1a9]/40'
                              : 'bg-[#0c1019] border-[#262a35] hover:border-[#e4e1a9]/30'
                          }`}
                        >
                          <div className="font-bold text-xs text-[#dfe2f0] mb-0.5">{p.name}</div>
                          <p className="text-[11px] text-[#939183] line-clamp-2 mb-2">{p.tagline}</p>
                          <div className="text-[10px] text-emerald-400 font-mono">
                            {p.benefits.length} Active Redemption Perks
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#0c1019] border border-[#262a35] text-xs text-[#cac7b8] flex items-center gap-3">
                    <Shield className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div>
                      <strong className="text-[#dfe2f0]">Programmable Demand Invariance:</strong> Credits earned from this campaign can be accumulated towards high-value collective destination experiences, preventing immediate cashout breakage.
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#262a35]">
                    <button
                      onClick={() => setCurrentStage(3)}
                      className="px-3.5 py-1.5 rounded-lg bg-[#1b1f2a] hover:bg-[#262a35] text-xs text-[#cac7b8] cursor-pointer"
                    >
                      &larr; Back to Incentive
                    </button>
                    <button
                      onClick={() => handleGenerateProposal()}
                      disabled={isSynthesizing}
                      className="px-5 py-2.5 rounded-xl bg-[#e4e1a9] hover:bg-[#d8d598] text-[#171b26] font-bold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-md"
                    >
                      {isSynthesizing ? (
                        <>
                          <span className="w-4 h-4 border-2 border-[#171b26] border-t-transparent rounded-full animate-spin" />
                          <span>Synthesizing Proposal...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>Generate Structured Proposal</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW MODE 2: STRUCTURED PROPOSAL VIEW                   */}
          {/* Objective, Target, Trigger, Reward, Budget, Duration,   */}
          {/* Suggested Pool, Expected users, Assumptions, Actions     */}
          {/* ======================================================== */}
          {viewMode === 'PROPOSAL_VIEW' && proposal && (
            <div className="space-y-6 max-w-4xl mx-auto animate-fadeIn">
              {/* Proposal Header Banner */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-[#171b26] via-[#141824] to-[#171b26] border border-[#e4e1a9]/40 shadow-lg space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                      CAMPAIGN PROPOSAL
                    </span>
                    <span className="text-xs text-[#939183]">
                      Synthesized for <strong>{proposal.partnerName}</strong>
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-[#e4e1a9]">
                    MCP Tool Flow: 11 Tools Orchestrated
                  </div>
                </div>

                <div className="text-base font-bold text-[#dfe2f0]">
                  "{proposal.rawIntent}"
                </div>
              </div>

              {/* Main Structured Proposal Card */}
              <div className="bg-[#141824] border border-[#262a35] rounded-2xl p-6 space-y-5 shadow-sm">
                <h3 className="text-sm font-bold text-[#e4e1a9] uppercase tracking-wider flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  <span>Campaign Specification</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-[#0c1019] border border-[#262a35] space-y-1">
                    <span className="text-[#939183] text-[10px] uppercase font-mono">Objective:</span>
                    <div className="font-bold text-[#dfe2f0] text-sm">{proposal.objective}</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#0c1019] border border-[#262a35] space-y-1">
                    <span className="text-[#939183] text-[10px] uppercase font-mono">Target:</span>
                    <div className="font-bold text-[#dfe2f0] text-sm">{proposal.targetAudience}</div>
                    <div className="text-[10px] text-emerald-400">{proposal.expectedUsersText} verified users</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#0c1019] border border-[#262a35] space-y-1">
                    <span className="text-[#939183] text-[10px] uppercase font-mono">Trigger:</span>
                    <div className="font-bold text-[#dfe2f0] text-sm">{proposal.trigger}</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#0c1019] border border-[#262a35] space-y-1">
                    <span className="text-[#939183] text-[10px] uppercase font-mono">Reward:</span>
                    <div className="font-bold text-[#e4e1a9] text-base font-mono">
                      {proposal.rewardCredits.toLocaleString()} Credits
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#0c1019] border border-[#262a35] space-y-1">
                    <span className="text-[#939183] text-[10px] uppercase font-mono">Budget:</span>
                    <div className="font-bold text-[#dfe2f0] text-base font-mono">
                      {proposal.budgetCredits.toLocaleString()} Credits
                    </div>
                    <div className="text-[10px] text-[#939183]">Automated hard-stop ceiling</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#0c1019] border border-[#262a35] space-y-1">
                    <span className="text-[#939183] text-[10px] uppercase font-mono">Duration:</span>
                    <div className="font-bold text-[#dfe2f0] text-sm">{proposal.durationDays} days</div>
                    <div className="text-[10px] text-[#939183]">{proposal.timelineText}</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#0c1019] border border-[#262a35] space-y-1">
                    <span className="text-[#939183] text-[10px] uppercase font-mono">Suggested Pool:</span>
                    <div className="font-bold text-[#dfe2f0] text-sm">{proposal.suggestedPoolName}</div>
                    <div className="text-[10px] text-emerald-400">Co-funded ecosystem sink</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#0c1019] border border-[#262a35] space-y-1">
                    <span className="text-[#939183] text-[10px] uppercase font-mono">Expected Users:</span>
                    <div className="font-bold text-[#dfe2f0] text-base font-mono">
                      {proposal.costEstimate.expectedConversions.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-[#939183]">Estimated conversions (12% baseline)</div>
                  </div>
                </div>

                {/* AI Explained Assumptions Section */}
                <div className="pt-2 border-t border-[#262a35] space-y-3">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-[#e4e1a9]" />
                    <h4 className="text-xs font-bold text-[#dfe2f0] uppercase tracking-wider">
                      AI Model Assumptions &amp; Risk Guardrails
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {proposal.assumptions.map((assump, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-[#0c1019] border border-[#262a35] space-y-1"
                      >
                        <div className="font-bold text-[#e4e1a9] text-xs">{assump.title}</div>
                        <p className="text-[11px] text-[#cac7b8] leading-relaxed">
                          {assump.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ACTION BUTTONS (As explicitly required: [Edit campaign], [Preview], [Create draft]) */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-[#262a35]">
                  <div className="flex items-center gap-2">
                    {/* [Edit campaign] */}
                    <button
                      onClick={() => setViewMode('WIZARD')}
                      className="px-3.5 py-2 rounded-xl bg-[#1b1f2a] hover:bg-[#262a35] text-xs font-semibold text-[#dfe2f0] transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[#e4e1a9]" />
                      <span>Edit Campaign</span>
                    </button>

                    {/* [Preview] */}
                    <button
                      onClick={() => setViewMode('PREVIEW')}
                      className="px-3.5 py-2 rounded-xl bg-[#1b1f2a] hover:bg-[#262a35] text-xs font-semibold text-[#dfe2f0] transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#e4e1a9]" />
                      <span>Preview Execution Plan</span>
                    </button>

                    {/* [Create draft] */}
                    <button
                      onClick={handleCreateDraft}
                      className="px-4 py-2 rounded-xl bg-[#1b1f2a] hover:bg-[#262a35] border border-[#e4e1a9]/40 text-xs font-bold text-[#e4e1a9] transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <FileCheck2 className="w-3.5 h-3.5" />
                      <span>Create Draft</span>
                    </button>
                  </div>

                  {/* ECONOMIC AUTHORIZATION CTA (Opens Confirmation Modal) */}
                  <button
                    onClick={() => setShowConfirmAuthorizeModal(true)}
                    className="px-5 py-2.5 rounded-xl bg-[#e4e1a9] hover:bg-[#d8d598] text-[#171b26] font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01]"
                  >
                    <Lock className="w-4 h-4 text-[#171b26]" />
                    <span>Authorize &amp; Publish Campaign</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW MODE 3: VISUAL EXECUTION PLAN                      */}
          {/* Brand objective ↓ Audience ↓ Trigger ↓ Credit rule ↓    */}
          {/* Pool ↓ Benefit ↓ Measurement                            */}
          {/* ======================================================== */}
          {viewMode === 'PREVIEW' && proposal && (
            <div className="space-y-6 max-w-3xl mx-auto animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-[#262a35]">
                <div>
                  <h3 className="text-sm font-bold text-[#dfe2f0] flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#e4e1a9]" />
                    <span>Programmable Demand Visual Execution Plan</span>
                  </h3>
                  <p className="text-xs text-[#939183]">
                    The platform as an operating system: deterministic flow from natural language intent to live economic settlement.
                  </p>
                </div>
                <button
                  onClick={() => setViewMode('PROPOSAL_VIEW')}
                  className="text-xs text-[#e4e1a9] hover:underline font-semibold cursor-pointer"
                >
                  &larr; Back to Proposal
                </button>
              </div>

              {/* Vertical Visual Execution Pipeline DAG */}
              <div className="space-y-3">
                {proposal.executionPlan.map((step, idx) => (
                  <React.Fragment key={step.id}>
                    <div className="p-4 rounded-xl bg-[#141824] border border-[#262a35] hover:border-[#e4e1a9]/50 transition-all flex items-start justify-between gap-4 shadow-sm group">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#1b1f2a] border border-[#3b4152] flex items-center justify-center font-bold text-xs text-[#e4e1a9] shrink-0 mt-0.5">
                          {idx + 1}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] text-[#939183] uppercase">
                              {step.node}
                            </span>
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-300">
                              {step.status}
                            </span>
                          </div>
                          <div className="text-sm font-bold text-[#dfe2f0] group-hover:text-[#e4e1a9] transition-colors">
                            {step.subtitle}
                          </div>
                          <div className="space-y-0.5 pt-1">
                            {step.details.map((d, dIdx) => (
                              <div key={dIdx} className="text-[11px] text-[#cac7b8] flex items-center gap-1.5">
                                <span className="w-1 h-1 rounded-full bg-[#e4e1a9]" />
                                <span>{d}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <span className="text-[10px] font-mono text-[#939183]">VALIDATED</span>
                      </div>
                    </div>

                    {/* Connecting Arrow */}
                    {idx < proposal.executionPlan.length - 1 && (
                      <div className="flex justify-center py-0.5">
                        <div className="w-6 h-6 rounded-full bg-[#171b26] border border-[#262a35] flex items-center justify-center">
                          <ArrowDown className="w-3.5 h-3.5 text-[#e4e1a9]" />
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-[#262a35]">
                <button
                  onClick={() => setViewMode('PROPOSAL_VIEW')}
                  className="px-4 py-2 rounded-xl bg-[#1b1f2a] hover:bg-[#262a35] text-xs font-semibold text-[#cac7b8] cursor-pointer"
                >
                  &larr; Return to Proposal Summary
                </button>
                <button
                  onClick={() => setShowConfirmAuthorizeModal(true)}
                  className="px-5 py-2.5 rounded-xl bg-[#e4e1a9] hover:bg-[#d8d598] text-[#171b26] font-bold text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Lock className="w-4 h-4 text-[#171b26]" />
                  <span>Authorize Campaign</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* ECONOMIC ACTION CONFIRMATION MODAL                      */}
        {/* Strict Requirement: Never automatically publish         */}
        {/* without explicit authorization.                          */}
        {/* ======================================================== */}
        {showConfirmAuthorizeModal && proposal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-[#141824] border border-[#feb26f] rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
              <div className="flex items-center gap-2.5 text-amber-400">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                <h3 className="text-base font-bold text-[#dfe2f0]">
                  Confirm Economic Campaign Publication
                </h3>
              </div>

              <p className="text-xs text-[#cac7b8] leading-relaxed">
                You are about to authorize an active economic issuance campaign for{' '}
                <strong className="text-[#dfe2f0]">{proposal.partnerName}</strong>.
              </p>

              <div className="p-3.5 rounded-xl bg-[#0c1019] border border-[#262a35] text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#939183]">Campaign Name:</span>
                  <span className="font-bold text-[#dfe2f0]">{proposal.objective}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#939183]">Budget Ceiling:</span>
                  <span className="font-mono text-[#e4e1a9] font-bold">
                    {proposal.budgetCredits.toLocaleString()} Credits
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#939183]">Reward per Action:</span>
                  <span className="font-mono text-[#dfe2f0]">
                    +{proposal.rewardCredits} CRD upon {proposal.trigger}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#939183]">Destination Sink:</span>
                  <span className="text-[#dfe2f0]">{proposal.suggestedPoolName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#939183]">Authorized By:</span>
                  <span className="text-[#dfe2f0] font-mono">
                    {selectedPartner.primaryContact.name} ({selectedPartner.primaryContact.role})
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-[#939183]">
                Once published, this campaign will be live across the ecosystem and users will be eligible to trigger real credit grants according to the verified rules engine.
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConfirmAuthorizeModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#1b1f2a] hover:bg-[#262a35] text-xs text-[#cac7b8] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAuthorizeAndPublish}
                  className="px-5 py-2 rounded-xl bg-[#e4e1a9] hover:bg-[#d8d598] text-[#171b26] font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <Check className="w-4 h-4" />
                  <span>Authorize &amp; Launch</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
