import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowDown,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Plus,
  Trash2,
  Copy,
  ChevronRight,
  ChevronDown,
  Layers,
  Smartphone,
  Check,
  X,
  Zap,
  Clock,
  Compass,
  Award,
  Coins,
  Shield,
  Eye,
  SlidersHorizontal,
  Calendar,
  Send,
  Building2,
  QrCode,
  Tag,
  Gift,
  HelpCircle,
} from 'lucide-react';
import {
  Experience,
  JourneyNode,
  JourneyNodeType,
  ExperienceEventType,
} from '../types';

export interface ExperienceJourneyBuilderProps {
  experience: Experience;
  onUpdateExperience: (exp: Experience) => void;
  onNavigatePool?: (poolId: string) => void;
}

export const CANONICAL_STAGES: {
  type: JourneyNodeType;
  label: string;
  badgeColor: string;
  borderColor: string;
  bgLight: string;
  subtypes: string[];
}[] = [
  {
    type: 'ENTRY',
    label: 'ENTRY',
    badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    borderColor: 'border-purple-500/40',
    bgLight: 'bg-purple-950/20',
    subtypes: ['QR Scan', 'Campaign Link', 'Partner Link', 'Event Entry', 'User Segment', 'Purchase Trigger'],
  },
  {
    type: 'EXPERIENCE',
    label: 'EXPERIENCE',
    badgeColor: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
    borderColor: 'border-blue-500/40',
    bgLight: 'bg-blue-950/20',
    subtypes: ['Landing Experience', 'Product Story', 'Creator Story', 'Brand Story', 'Interactive Content', 'Event Experience'],
  },
  {
    type: 'ACTION',
    label: 'ACTION',
    badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    borderColor: 'border-emerald-500/40',
    bgLight: 'bg-emerald-950/20',
    subtypes: ['Purchase', 'Quest', 'Review', 'Referral', 'Check-in', 'UGC', 'Event Attendance', 'Survey'],
  },
  {
    type: 'VALUE',
    label: 'VALUE',
    badgeColor: 'text-teal-400 bg-teal-500/10 border-teal-500/30',
    borderColor: 'border-teal-500/40',
    bgLight: 'bg-teal-950/20',
    subtypes: ['Contribution', 'Engagement', 'Transaction', 'Referral', 'Content'],
  },
  {
    type: 'CREDIT',
    label: 'CREDIT',
    badgeColor: 'text-[#e4e1a9] bg-[#e4e1a9]/10 border-[#e4e1a9]/30',
    borderColor: 'border-[#e4e1a9]/50',
    bgLight: 'bg-amber-950/20',
    subtypes: ['Earn Credits', 'Bonus', 'Milestone', 'Streak'],
  },
  {
    type: 'POOL',
    label: 'POOL',
    badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    borderColor: 'border-amber-500/40',
    bgLight: 'bg-amber-950/20',
    subtypes: ['Join Pool', 'Unlock Pool', 'Explore Pool'],
  },
  {
    type: 'BENEFIT',
    label: 'BENEFIT',
    badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    borderColor: 'border-cyan-500/40',
    bgLight: 'bg-cyan-950/20',
    subtypes: ['Voucher', 'Product', 'Service', 'Experience', 'Event', 'Access'],
  },
  {
    type: 'CONVERSION',
    label: 'CONVERSION',
    badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
    borderColor: 'border-rose-500/40',
    bgLight: 'bg-rose-950/20',
    subtypes: ['Purchase', 'Booking', 'Visit', 'Redemption', 'Subscription'],
  },
  {
    type: 'FOLLOW-UP',
    label: 'FOLLOW-UP',
    badgeColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
    borderColor: 'border-indigo-500/40',
    bgLight: 'bg-indigo-950/20',
    subtypes: ['Recommend Experience', 'Retarget', 'Referral', 'New Campaign'],
  },
];

export const ExperienceJourneyBuilder: React.FC<ExperienceJourneyBuilderProps> = ({
  experience,
  onUpdateExperience,
  onNavigatePool,
}) => {
  const [nodes, setNodes] = useState<JourneyNode[]>(() => {
    if (experience.journey?.nodes && experience.journey.nodes.length > 0) {
      return experience.journey.nodes;
    }
    return [
      {
        id: 'node-entry-1',
        type: 'ENTRY',
        title: 'POS Check-in / QR Scan',
        subtitle: 'Entry Node',
        description: 'Customer scans dynamic QR standee at merchant counter.',
        subtype: 'QR Scan',
        conditions: ['Patron on-site verified'],
        eligibility: 'New & Existing Patrons',
        audience: 'First-time wellness shoppers',
        partner: experience.partnerName,
        goal: 'Entry verification',
        eventTriggered: 'experience_started',
      },
    ];
  });

  const [selectedNodeId, setSelectedNodeId] = useState<string>(nodes[0]?.id || '');
  const [activeViewMode, setActiveViewMode] = useState<'canvas' | 'validation' | 'preview' | 'publish'>('canvas');

  // Progressive Disclosure sections in right drawer
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    basic: true,
    trigger: true,
    eligibility: false,
    economy: true,
    conversion: false,
  });

  // AI Builder State
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [aiPrompt, setAiPrompt] = useState<string>(
    'Create an experience for a fitness brand that wants to acquire first-time customers and reward them with Credits after purchase.'
  );
  const [isAiGenerating, setIsAiGenerating] = useState<boolean>(false);
  const [aiGeneratedJourney, setAiGeneratedJourney] = useState<JourneyNode[] | null>(null);

  // Publishing Stepper State
  const [publishStep, setPublishStep] = useState<'draft' | 'validate' | 'preview' | 'schedule' | 'published'>('draft');
  const [scheduledDate, setScheduledDate] = useState<string>('2026-10-01');

  // Preview Mode: Device vs Loop
  const [previewSubMode, setPreviewSubMode] = useState<'user' | 'loop'>('user');
  const [activePreviewNodeIndex, setActivePreviewNodeIndex] = useState<number>(0);

  const toggleSection = (sec: string) => {
    setOpenSections((prev) => ({ ...prev, [sec]: !prev[sec] }));
  };

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];

  // Node Mutations
  const updateSelectedNode = (patch: Partial<JourneyNode>) => {
    const updated = nodes.map((n) => (n.id === selectedNodeId ? { ...n, ...patch } : n));
    setNodes(updated);
    onUpdateExperience({
      ...experience,
      journey: {
        id: experience.journey?.id || `jrn-${experience.id}`,
        name: experience.journey?.name || `${experience.name} Journey`,
        description: experience.journey?.description || 'Journey pipeline',
        nodes: updated,
      },
    });
  };

  const addNodeAfter = (type: JourneyNodeType, index?: number) => {
    const stageInfo = CANONICAL_STAGES.find((s) => s.type === type) || CANONICAL_STAGES[0];
    const newNode: JourneyNode = {
      id: `node-${Date.now()}`,
      type,
      title: `${stageInfo.label} Step`,
      subtitle: `${stageInfo.subtypes[0]}`,
      description: `Configured interaction for ${stageInfo.label}.`,
      subtype: stageInfo.subtypes[0],
      partner: experience.partnerName,
      audience: experience.audience,
      conditions: [],
      eligibility: 'All patrons',
      eventTriggered: 'content_viewed',
      creditRewardAmount: type === 'CREDIT' ? 200 : undefined,
      creditRuleId: type === 'CREDIT' ? 'RUL-FIT-200' : undefined,
      poolId: type === 'POOL' ? experience.associatedPoolId || 'pool-fitness-wellness' : undefined,
    };

    let updated: JourneyNode[];
    if (typeof index === 'number') {
      updated = [...nodes.slice(0, index + 1), newNode, ...nodes.slice(index + 1)];
    } else {
      updated = [...nodes, newNode];
    }

    setNodes(updated);
    setSelectedNodeId(newNode.id);
    onUpdateExperience({
      ...experience,
      journey: {
        id: experience.journey?.id || `jrn-${experience.id}`,
        name: experience.journey?.name || `${experience.name} Journey`,
        description: experience.journey?.description || 'Journey pipeline',
        nodes: updated,
      },
    });
  };

  const deleteNode = (id: string) => {
    if (nodes.length <= 1) return;
    const updated = nodes.filter((n) => n.id !== id);
    setNodes(updated);
    setSelectedNodeId(updated[0]?.id || '');
    onUpdateExperience({
      ...experience,
      journey: {
        id: experience.journey?.id || `jrn-${experience.id}`,
        name: experience.journey?.name || `${experience.name} Journey`,
        description: experience.journey?.description || 'Journey pipeline',
        nodes: updated,
      },
    });
  };

  const moveNode = (index: number, direction: 'left' | 'right') => {
    if (direction === 'left' && index === 0) return;
    if (direction === 'right' && index === nodes.length - 1) return;

    const targetIdx = direction === 'left' ? index - 1 : index + 1;
    const updated = [...nodes];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;

    setNodes(updated);
    onUpdateExperience({
      ...experience,
      journey: {
        id: experience.journey?.id || `jrn-${experience.id}`,
        name: experience.journey?.name || `${experience.name} Journey`,
        description: experience.journey?.description || 'Journey pipeline',
        nodes: updated,
      },
    });
  };

  // AI Generation Simulation
  const handleGenerateWithAi = () => {
    setIsAiGenerating(true);
    setTimeout(() => {
      setIsAiGenerating(false);
      const generated: JourneyNode[] = [
        {
          id: 'ai-node-1',
          type: 'ENTRY',
          title: 'Dynamic QR Scan & NFC Entry',
          subtitle: 'Store Counter & Social Story',
          description: 'User enters experience by scanning physical retail acrylic or social sticker.',
          subtype: 'QR Scan',
          conditions: ['First-time scan token', 'Verified timestamp'],
          audience: 'New fitness patrons (0 prior orders)',
          partner: 'Saigon Fitness Studio',
          eventTriggered: 'experience_started',
        },
        {
          id: 'ai-node-2',
          type: 'EXPERIENCE',
          title: 'Fitness Landing Experience',
          subtitle: 'Welcome Story & Studio Tour',
          description: 'High-impact multimedia briefing introducing brand coaches and wellness community.',
          subtype: 'Landing Experience',
          audience: 'New fitness patrons',
          partner: 'Saigon Fitness Studio',
          eventTriggered: 'content_viewed',
        },
        {
          id: 'ai-node-3',
          type: 'ACTION',
          title: 'Fitness Challenge: 1st Session',
          subtitle: 'First Purchase & Check-in',
          description: 'User completes and pays for their first boutique session ($25 minimum).',
          subtype: 'Purchase',
          conditions: ['POS verified payment & attendance signature'],
          audience: 'New fitness patrons',
          partner: 'Saigon Fitness Studio',
          eventTriggered: 'purchase_completed',
        },
        {
          id: 'ai-node-4',
          type: 'CREDIT',
          title: 'Mint +200 Credits',
          subtitle: 'Double-Entry Ledger Rule',
          description: 'Authoritative credit rule issues 200 programmable credits from brand budget escrow.',
          subtype: 'Earn Credits',
          creditRuleId: 'RUL-FIT-200',
          creditRewardAmount: 200,
          partner: 'Saigon Fitness Studio',
          eventTriggered: 'credit_earned',
        },
        {
          id: 'ai-node-5',
          type: 'POOL',
          title: 'Discover Fitness & Wellness Pool',
          subtitle: 'Collective Demand Aggregator',
          description: 'User unlocks goal tracking toward the Fitness Weekend Pool (500 CRD goal).',
          subtype: 'Unlock Pool',
          poolId: 'pool-fitness-wellness',
          partner: 'Saigon Fitness & Partners',
          eventTriggered: 'pool_joined',
        },
        {
          id: 'ai-node-6',
          type: 'BENEFIT',
          title: 'Free HIIT Class Benefit',
          subtitle: 'Instant Redeemable Voucher',
          description: 'User burns 200 Credits to redeem a complimentary 1-Day VIP HIIT class pass.',
          subtype: 'Voucher',
          benefitId: 'ben-hiit-01',
          partner: 'Saigon Fitness Studio',
          eventTriggered: 'benefit_viewed',
        },
        {
          id: 'ai-node-7',
          type: 'CONVERSION',
          title: 'Studio Class Booking Confirmation',
          subtitle: 'Confirmed In-Store Visit',
          description: 'Patron schedules class slot in calendar; merchant front-desk scans confirmation pass.',
          subtype: 'Booking',
          goal: 'Class Attendance & Customer Retention',
          eventTriggered: 'benefit_redeemed',
        },
        {
          id: 'ai-node-8',
          type: 'FOLLOW-UP',
          title: 'Friend Referral & Community Invite',
          subtitle: 'Viral Loop Activation',
          description: 'User shares personal invite pass; both parties earn 100 bonus credits on friend check-in.',
          subtype: 'Referral',
          goal: 'K-Factor > 1.2 Community Growth',
          eventTriggered: 'referral_completed',
        },
      ];
      setAiGeneratedJourney(generated);
    }, 600);
  };

  const applyAiJourney = () => {
    if (!aiGeneratedJourney) return;
    setNodes(aiGeneratedJourney);
    setSelectedNodeId(aiGeneratedJourney[0].id);
    onUpdateExperience({
      ...experience,
      journey: {
        id: experience.journey?.id || `jrn-${experience.id}`,
        name: experience.journey?.name || `${experience.name} Journey`,
        description: experience.journey?.description || 'Journey pipeline',
        nodes: aiGeneratedJourney,
      },
    });
    setAiGeneratedJourney(null);
    setIsAiModalOpen(false);
  };

  // Validation Rules Calculation
  const validationItems = [
    {
      label: 'Trigger & Entry configured',
      status: nodes.some((n) => n.type === 'ENTRY' || n.type === 'TRIGGER') ? 'PASS' : 'ERROR',
      message: 'At least one Entry point (QR, Web, POS) must initiate the flow.',
    },
    {
      label: 'Audience segment defined',
      status: nodes.some((n) => n.audience && n.audience.length > 0) ? 'PASS' : 'ERROR',
      message: 'Target cohort must be specified to prevent untargeted credit exposure.',
    },
    {
      label: 'Credit rule valid & ledger-bound',
      status: nodes.some((n) => n.type === 'CREDIT' && n.creditRewardAmount && n.creditRewardAmount > 0)
        ? 'PASS'
        : 'ERROR',
      message: 'Credit node must commit positive programmable reward tokens.',
    },
    {
      label: 'Destination Pool active & funded',
      status: nodes.some((n) => n.type === 'POOL') ? 'PASS' : 'WARN',
      message: 'Pool is active with 50,000 CRD capital liquidity headroom.',
    },
    {
      label: 'Benefit inventory capacity check',
      status: 'WARN',
      message: 'Free Class Benefit has 34 passes left; reorder threshold reached.',
    },
    {
      label: 'Budget solvency verified',
      status: 'PASS',
      message: 'Brand campaign escrow holds 50,000 CRD (Solvent).',
    },
    {
      label: 'No eligibility conflicts detected',
      status: 'PASS',
      message: 'Patron tier rules and geofence conditions are mutually compatible.',
    },
    {
      label: 'Conversion goal defined',
      status: nodes.some((n) => n.type === 'CONVERSION' || n.goal) ? 'PASS' : 'ERROR',
      message: 'Terminal business objective (booking, visit, purchase) established.',
    },
  ];

  const hasValidationErrors = validationItems.some((v) => v.status === 'ERROR');

  return (
    <div className="space-y-6">
      {/* Top Header & Mode Navigation */}
      <div className="bg-[#141824] border border-[#262a35] rounded-2xl p-5 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1b1f2a] text-[#e4e1a9] border border-[#e4e1a9]/30 font-bold">
              JOURNEY ORCHESTRATION CANVAS
            </span>
            <span className="text-xs font-mono text-[#939183]">
              {nodes.length} Stages Configured
            </span>
            <span className="text-xs font-mono text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
              {experience.status}
            </span>
          </div>
          <h2 className="text-xl font-bold text-[#dfe2f0]">{experience.name}</h2>
          <p className="text-xs text-[#939183]">
            Lightweight combination of journey orchestration, campaign rules, experience design, and programmable credit rewards.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsAiModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#e4e1a9]/20 to-amber-500/20 hover:from-[#e4e1a9]/30 hover:to-amber-500/30 text-[#e4e1a9] border border-[#e4e1a9]/50 text-xs font-mono font-bold flex items-center gap-2 cursor-pointer transition-all shadow-md"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Build with AI</span>
          </button>

          {/* View Toggles */}
          <div className="flex items-center bg-[#10141f] p-1 rounded-xl border border-[#262a35]">
            <button
              onClick={() => setActiveViewMode('canvas')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                activeViewMode === 'canvas'
                  ? 'bg-[#1b1f2a] text-[#e4e1a9] font-bold shadow-sm'
                  : 'text-[#939183] hover:text-[#dfe2f0]'
              }`}
            >
              Canvas
            </button>
            <button
              onClick={() => setActiveViewMode('validation')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                activeViewMode === 'validation'
                  ? 'bg-[#1b1f2a] text-[#e4e1a9] font-bold shadow-sm'
                  : 'text-[#939183] hover:text-[#dfe2f0]'
              }`}
            >
              Validate
            </button>
            <button
              onClick={() => setActiveViewMode('preview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                activeViewMode === 'preview'
                  ? 'bg-[#1b1f2a] text-[#e4e1a9] font-bold shadow-sm'
                  : 'text-[#939183] hover:text-[#dfe2f0]'
              }`}
            >
              Preview
            </button>
            <button
              onClick={() => setActiveViewMode('publish')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                activeViewMode === 'publish'
                  ? 'bg-[#1b1f2a] text-[#e4e1a9] font-bold shadow-sm'
                  : 'text-[#939183] hover:text-[#dfe2f0]'
              }`}
            >
              Publish
            </button>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 1. VIEW MODE: CANVAS BUILDER                                         */}
      {/* ==================================================================== */}
      {activeViewMode === 'canvas' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Main Horizontal Canvas (2 cols) */}
          <div className="xl:col-span-2 space-y-4">
            {/* Quick Add Stage Palette */}
            <div className="bg-[#141824] p-3.5 rounded-2xl border border-[#262a35] space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono text-[#939183]">
                <span className="uppercase tracking-wider font-semibold text-[#c8c58f]">
                  Add Canonical Stage to Pipeline:
                </span>
                <span>Click to append node</span>
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {CANONICAL_STAGES.map((stg) => (
                  <button
                    key={stg.type}
                    onClick={() => addNodeAfter(stg.type)}
                    className="px-2.5 py-1.5 rounded-lg bg-[#10141f] hover:bg-[#1b1f2a] border border-[#262a35] hover:border-[#e4e1a9]/40 text-[10px] font-mono whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <Plus className="w-3 h-3 text-[#e4e1a9]" />
                    <span>{stg.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Horizontal Canvas Scroll Area */}
            <div className="bg-[#10141f] p-5 rounded-2xl border border-[#262a35] space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-[#939183] pb-2 border-b border-[#262a35]">
                <span>HORIZONTAL EXPERIENCE-TO-ECONOMY PIPELINE</span>
                <span>{nodes.length} Stages &bull; Left to Right Flow</span>
              </div>

              {/* Scroll Container */}
              <div className="overflow-x-auto pb-4 pt-1">
                <div className="flex items-stretch gap-3 min-w-max">
                  {nodes.map((node, idx) => {
                    const isSelected = node.id === selectedNodeId;
                    const stageMeta =
                      CANONICAL_STAGES.find((s) => s.type === node.type) || CANONICAL_STAGES[0];

                    return (
                      <div key={node.id} className="flex items-center gap-2">
                        {/* Node Card */}
                        <div
                          onClick={() => setSelectedNodeId(node.id)}
                          className={`w-64 rounded-2xl p-4 border transition-all cursor-pointer flex flex-col justify-between space-y-3 relative group ${
                            isSelected
                              ? 'bg-[#1b1f2a] border-[#e4e1a9] ring-2 ring-[#e4e1a9]/40 shadow-xl'
                              : 'bg-[#141824] border-[#262a35] hover:border-[#3b4152]'
                          }`}
                        >
                          <div className="space-y-2">
                            {/* Card Top: Stage Tag & Index */}
                            <div className="flex items-center justify-between">
                              <span
                                className={`text-[9px] font-mono px-2 py-0.5 rounded border uppercase font-bold ${stageMeta.badgeColor}`}
                              >
                                {node.type}
                              </span>
                              <span className="font-mono text-xs text-[#939183] font-bold">
                                0{idx + 1}
                              </span>
                            </div>

                            {/* Node Title & Subtype */}
                            <div>
                              <h4 className="font-bold text-xs text-[#dfe2f0] leading-snug group-hover:text-[#e4e1a9] transition-colors">
                                {node.title}
                              </h4>
                              <p className="text-[10px] text-[#939183] mt-0.5">{node.subtype}</p>
                            </div>

                            <p className="text-[11px] text-[#cac7b8] line-clamp-2 leading-relaxed">
                              {node.description}
                            </p>

                            {/* Key parameter badges */}
                            {node.creditRewardAmount && (
                              <div className="text-[10px] font-mono text-[#e4e1a9] font-bold bg-[#10141f] px-2 py-1 rounded border border-[#e4e1a9]/30">
                                Reward: +{node.creditRewardAmount} CRD
                              </div>
                            )}

                            {node.poolId && (
                              <div className="text-[10px] font-mono text-amber-300 bg-[#10141f] px-2 py-1 rounded border border-amber-500/30 truncate">
                                Pool: Fitness Weekend
                              </div>
                            )}

                            {node.benefitId && (
                              <div className="text-[10px] font-mono text-cyan-300 bg-[#10141f] px-2 py-1 rounded border border-cyan-500/30 truncate">
                                Benefit: Free Class Pass
                              </div>
                            )}
                          </div>

                          {/* Card Reorder & Delete Bar */}
                          <div className="pt-2 border-t border-[#262a35] flex items-center justify-between text-[#939183]">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  moveNode(idx, 'left');
                                }}
                                disabled={idx === 0}
                                className="p-1 rounded hover:bg-[#10141f] disabled:opacity-20 text-xs"
                                title="Move Left"
                              >
                                &larr;
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  moveNode(idx, 'right');
                                }}
                                disabled={idx === nodes.length - 1}
                                className="p-1 rounded hover:bg-[#10141f] disabled:opacity-20 text-xs"
                                title="Move Right"
                              >
                                &rarr;
                              </button>
                            </div>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNode(node.id);
                              }}
                              disabled={nodes.length <= 1}
                              className="p-1 rounded hover:bg-rose-500/20 hover:text-rose-400 disabled:opacity-20 transition-colors"
                              title="Delete Node"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Arrow separator if not last */}
                        {idx < nodes.length - 1 && (
                          <div className="shrink-0 text-[#939183] flex items-center justify-center">
                            <ArrowRight className="w-4 h-4 text-[#e4e1a9]" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Node Configuration Panel (Progressive Disclosure) */}
          <div className="bg-[#141824] p-5 rounded-2xl border border-[#262a35] space-y-4">
            <div className="pb-3 border-b border-[#262a35] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#e4e1a9] font-bold">
                  NODE CONFIGURATION
                </span>
                <h3 className="font-bold text-sm text-[#dfe2f0]">
                  Configure Stage 0{nodes.findIndex((n) => n.id === selectedNode.id) + 1}
                </h3>
              </div>
              <span
                className={`text-[9px] font-mono px-2 py-0.5 rounded border uppercase font-bold ${
                  CANONICAL_STAGES.find((s) => s.type === selectedNode.type)?.badgeColor
                }`}
              >
                {selectedNode.type}
              </span>
            </div>

            {/* Accordion 1: Basic Info */}
            <div className="border border-[#262a35] rounded-xl overflow-hidden bg-[#10141f]">
              <button
                onClick={() => toggleSection('basic')}
                className="w-full p-3 text-left font-mono text-xs font-bold text-[#dfe2f0] flex items-center justify-between cursor-pointer"
              >
                <span>1. Identification &amp; Subtype</span>
                {openSections.basic ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>

              {openSections.basic && (
                <div className="p-3 pt-0 space-y-3 text-xs border-t border-[#262a35]">
                  <div>
                    <label className="text-[10px] font-mono text-[#939183] uppercase block mb-1">Node Title</label>
                    <input
                      type="text"
                      value={selectedNode.title}
                      onChange={(e) => updateSelectedNode({ title: e.target.value })}
                      className="w-full bg-[#141824] border border-[#262a35] p-2 rounded-lg text-[#dfe2f0] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-[#939183] uppercase block mb-1">Subtype</label>
                    <select
                      value={selectedNode.subtype}
                      onChange={(e) => updateSelectedNode({ subtype: e.target.value })}
                      className="w-full bg-[#141824] border border-[#262a35] p-2 rounded-lg text-[#dfe2f0] focus:outline-none"
                    >
                      {(
                        CANONICAL_STAGES.find((s) => s.type === selectedNode.type)?.subtypes || [
                          selectedNode.subtype,
                        ]
                      ).map((sub) => (
                        <option key={sub} value={sub}>
                          {sub}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-[#939183] uppercase block mb-1">Description</label>
                    <textarea
                      rows={2}
                      value={selectedNode.description}
                      onChange={(e) => updateSelectedNode({ description: e.target.value })}
                      className="w-full bg-[#141824] border border-[#262a35] p-2 rounded-lg text-[#dfe2f0] focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Accordion 2: Trigger & Conditions */}
            <div className="border border-[#262a35] rounded-xl overflow-hidden bg-[#10141f]">
              <button
                onClick={() => toggleSection('trigger')}
                className="w-full p-3 text-left font-mono text-xs font-bold text-[#dfe2f0] flex items-center justify-between cursor-pointer"
              >
                <span>2. Trigger &amp; Execution Conditions</span>
                {openSections.trigger ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>

              {openSections.trigger && (
                <div className="p-3 pt-0 space-y-3 text-xs border-t border-[#262a35]">
                  <div>
                    <label className="text-[10px] font-mono text-[#939183] uppercase block mb-1">Trigger Event</label>
                    <select
                      value={selectedNode.eventTriggered || 'content_viewed'}
                      onChange={(e) =>
                        updateSelectedNode({ eventTriggered: e.target.value as ExperienceEventType })
                      }
                      className="w-full bg-[#141824] border border-[#262a35] p-2 rounded-lg text-[#dfe2f0] focus:outline-none"
                    >
                      <option value="experience_started">experience_started</option>
                      <option value="content_viewed">content_viewed</option>
                      <option value="quest_started">quest_started</option>
                      <option value="quest_completed">quest_completed</option>
                      <option value="purchase_completed">purchase_completed</option>
                      <option value="credit_earned">credit_earned</option>
                      <option value="pool_joined">pool_joined</option>
                      <option value="benefit_redeemed">benefit_redeemed</option>
                      <option value="referral_completed">referral_completed</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-[#939183] uppercase block mb-1">Conditions</label>
                    <input
                      type="text"
                      placeholder="e.g., Min $25 spend; geofence within 50m"
                      value={selectedNode.conditions?.join('; ') || ''}
                      onChange={(e) =>
                        updateSelectedNode({
                          conditions: e.target.value.split(';').map((s) => s.trim()),
                        })
                      }
                      className="w-full bg-[#141824] border border-[#262a35] p-2 rounded-lg text-[#dfe2f0] focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Accordion 3: Audience & Partner */}
            <div className="border border-[#262a35] rounded-xl overflow-hidden bg-[#10141f]">
              <button
                onClick={() => toggleSection('eligibility')}
                className="w-full p-3 text-left font-mono text-xs font-bold text-[#dfe2f0] flex items-center justify-between cursor-pointer"
              >
                <span>3. Audience, Eligibility &amp; Partner</span>
                {openSections.eligibility ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>

              {openSections.eligibility && (
                <div className="p-3 pt-0 space-y-3 text-xs border-t border-[#262a35]">
                  <div>
                    <label className="text-[10px] font-mono text-[#939183] uppercase block mb-1">Target Audience</label>
                    <input
                      type="text"
                      value={selectedNode.audience || experience.audience}
                      onChange={(e) => updateSelectedNode({ audience: e.target.value })}
                      className="w-full bg-[#141824] border border-[#262a35] p-2 rounded-lg text-[#dfe2f0] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-[#939183] uppercase block mb-1">Host Partner</label>
                    <input
                      type="text"
                      value={selectedNode.partner || experience.partnerName}
                      onChange={(e) => updateSelectedNode({ partner: e.target.value })}
                      className="w-full bg-[#141824] border border-[#262a35] p-2 rounded-lg text-[#dfe2f0] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-[#939183] uppercase block mb-1">Eligibility Criteria</label>
                    <input
                      type="text"
                      value={selectedNode.eligibility || 'All patrons'}
                      onChange={(e) => updateSelectedNode({ eligibility: e.target.value })}
                      className="w-full bg-[#141824] border border-[#262a35] p-2 rounded-lg text-[#dfe2f0] focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Accordion 4: Economic Loop (Credit, Pool, Benefit) */}
            <div className="border border-[#e4e1a9]/40 rounded-xl overflow-hidden bg-[#10141f]">
              <button
                onClick={() => toggleSection('economy')}
                className="w-full p-3 text-left font-mono text-xs font-bold text-[#e4e1a9] flex items-center justify-between cursor-pointer"
              >
                <span>4. Economic Loop &bull; Credit &amp; Pool</span>
                {openSections.economy ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>

              {openSections.economy && (
                <div className="p-3 pt-0 space-y-3 text-xs border-t border-[#262a35]">
                  <div>
                    <label className="text-[10px] font-mono text-[#939183] uppercase block mb-1">Credit Reward (CRD)</label>
                    <input
                      type="number"
                      value={selectedNode.creditRewardAmount || 0}
                      onChange={(e) =>
                        updateSelectedNode({ creditRewardAmount: parseInt(e.target.value) || 0 })
                      }
                      className="w-full bg-[#141824] border border-[#e4e1a9]/40 p-2 rounded-lg font-mono text-[#e4e1a9] font-bold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-[#939183] uppercase block mb-1">Destination Pool</label>
                    <select
                      value={selectedNode.poolId || 'pool-fitness-wellness'}
                      onChange={(e) => updateSelectedNode({ poolId: e.target.value })}
                      className="w-full bg-[#141824] border border-[#262a35] p-2 rounded-lg text-[#dfe2f0] focus:outline-none"
                    >
                      <option value="pool-fitness-wellness">Fitness &amp; Wellness Weekend Pool</option>
                      <option value="pool-city-life">Saigon City Life &amp; Culture Pool</option>
                      <option value="pool-nomad-stays">Nomad &amp; Travel Escapes Pool</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-[#939183] uppercase block mb-1">Linked Benefit</label>
                    <select
                      value={selectedNode.benefitId || 'ben-hiit-01'}
                      onChange={(e) => updateSelectedNode({ benefitId: e.target.value })}
                      className="w-full bg-[#141824] border border-[#262a35] p-2 rounded-lg text-[#dfe2f0] focus:outline-none"
                    >
                      <option value="ben-hiit-01">1-Day Premium HIIT Class (200 CRD)</option>
                      <option value="ben-coffee-01">Cold Brew &amp; Croissant Set (150 CRD)</option>
                      <option value="ben-overnight-01">Eco-Lodge Free Night (800 CRD)</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Accordion 5: Conversion Goal */}
            <div className="border border-[#262a35] rounded-xl overflow-hidden bg-[#10141f]">
              <button
                onClick={() => toggleSection('conversion')}
                className="w-full p-3 text-left font-mono text-xs font-bold text-[#dfe2f0] flex items-center justify-between cursor-pointer"
              >
                <span>5. Terminal Conversion Goal</span>
                {openSections.conversion ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>

              {openSections.conversion && (
                <div className="p-3 pt-0 space-y-3 text-xs border-t border-[#262a35]">
                  <div>
                    <label className="text-[10px] font-mono text-[#939183] uppercase block mb-1">Goal Definition</label>
                    <input
                      type="text"
                      placeholder="e.g., In-store class attendance and pass redemption"
                      value={selectedNode.goal || ''}
                      onChange={(e) => updateSelectedNode({ goal: e.target.value })}
                      className="w-full bg-[#141824] border border-[#262a35] p-2 rounded-lg text-[#dfe2f0] focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 2. VIEW MODE: VALIDATION CHECKLIST                                   */}
      {/* ==================================================================== */}
      {activeViewMode === 'validation' && (
        <div className="space-y-6">
          <div className="bg-[#141824] p-5 rounded-2xl border border-[#262a35] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#e4e1a9] font-bold">
                  PRE-PUBLISH GOVERNANCE &amp; SAFETY AUDIT
                </span>
                <h3 className="text-lg font-bold text-[#dfe2f0]">Validation Checklist</h3>
                <p className="text-xs text-[#939183]">
                  All economic, audience, and inventory preconditions must be verified before experience activation.
                </p>
              </div>

              <div
                className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold border ${
                  hasValidationErrors
                    ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                    : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                }`}
              >
                {hasValidationErrors ? 'ACTION REQUIRED' : 'READY TO PREVIEW & PUBLISH'}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {validationItems.map((item, i) => (
                <div
                  key={i}
                  className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                    item.status === 'PASS'
                      ? 'bg-[#10141f] border-[#262a35]'
                      : item.status === 'WARN'
                      ? 'bg-amber-500/5 border-amber-500/30'
                      : 'bg-rose-500/5 border-rose-500/30'
                  }`}
                >
                  <div className="mt-0.5">
                    {item.status === 'PASS' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    {item.status === 'WARN' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                    {item.status === 'ERROR' && <X className="w-4 h-4 text-rose-400" />}
                  </div>
                  <div className="space-y-0.5">
                    <div className="font-bold text-xs text-[#dfe2f0]">{item.label}</div>
                    <div className="text-[11px] text-[#939183]">{item.message}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[#262a35] flex justify-end">
              <button
                onClick={() => setActiveViewMode('preview')}
                disabled={hasValidationErrors}
                className="px-5 py-2.5 rounded-xl bg-[#e4e1a9] hover:bg-[#d8d598] disabled:opacity-40 text-[#171b26] font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <span>Proceed to Preview Mode &rarr;</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 3. VIEW MODE: PREVIEW (User Preview + Journey Loop Preview)          */}
      {/* ==================================================================== */}
      {activeViewMode === 'preview' && (
        <div className="space-y-6">
          <div className="bg-[#141824] p-4 rounded-2xl border border-[#262a35] flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#e4e1a9] font-bold">
                MULTI-PERSPECTIVE PREVIEW
              </span>
              <h3 className="text-base font-bold text-[#dfe2f0]">
                {previewSubMode === 'user' ? 'Actual User Phone Experience' : 'Experience-to-Economy Loop Diagram'}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPreviewSubMode('user')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono cursor-pointer ${
                  previewSubMode === 'user'
                    ? 'bg-[#1b1f2a] text-[#e4e1a9] font-bold border border-[#e4e1a9]/40'
                    : 'text-[#939183] hover:text-[#dfe2f0]'
                }`}
              >
                User Preview
              </button>
              <button
                onClick={() => setPreviewSubMode('loop')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono cursor-pointer ${
                  previewSubMode === 'loop'
                    ? 'bg-[#1b1f2a] text-[#e4e1a9] font-bold border border-[#e4e1a9]/40'
                    : 'text-[#939183] hover:text-[#dfe2f0]'
                }`}
              >
                Journey Loop Preview
              </button>
            </div>
          </div>

          {previewSubMode === 'user' ? (
            /* User Mobile Screen Mockup */
            <div className="max-w-md mx-auto bg-[#10141f] border border-[#262a35] rounded-3xl p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between text-xs text-[#939183] pb-2 border-b border-[#262a35] font-mono">
                <span>Credit Economy OS App</span>
                <span className="text-emerald-400">Step {activePreviewNodeIndex + 1} of {nodes.length}</span>
              </div>

              {/* Stage Stepper Tabs */}
              <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
                {nodes.map((n, i) => (
                  <button
                    key={n.id}
                    onClick={() => setActivePreviewNodeIndex(i)}
                    className={`px-2 py-1 rounded text-[10px] font-mono whitespace-nowrap cursor-pointer ${
                      activePreviewNodeIndex === i
                        ? 'bg-[#e4e1a9] text-[#171b26] font-bold'
                        : 'bg-[#141824] text-[#939183]'
                    }`}
                  >
                    0{i + 1} {n.type}
                  </button>
                ))}
              </div>

              {/* Simulated Screen Body */}
              {(() => {
                const node = nodes[activePreviewNodeIndex] || nodes[0];
                return (
                  <div className="p-4 rounded-2xl bg-[#141824] border border-[#262a35] space-y-4 shadow-inner">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-[#e4e1a9] uppercase font-bold">
                        {node.partner || experience.partnerName}
                      </span>
                      <h4 className="text-base font-bold text-[#dfe2f0]">{node.title}</h4>
                      <p className="text-xs text-[#939183]">{node.description}</p>
                    </div>

                    {node.creditRewardAmount && (
                      <div className="p-3 rounded-xl bg-[#1b1f2a] border border-[#e4e1a9]/50 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Coins className="w-4 h-4 text-[#e4e1a9]" />
                          <span className="text-xs font-bold text-[#dfe2f0]">Programmable Reward</span>
                        </div>
                        <span className="text-sm font-bold font-mono text-[#e4e1a9]">
                          +{node.creditRewardAmount} CRD
                        </span>
                      </div>
                    )}

                    {node.poolId && (
                      <div className="p-3 rounded-xl bg-[#10141f] border border-amber-500/40 space-y-1">
                        <span className="text-[10px] font-mono text-amber-300 uppercase">Destination Pool</span>
                        <div className="text-xs font-bold text-[#dfe2f0]">Fitness &amp; Wellness Weekend Pool</div>
                        <div className="text-[10px] text-[#939183]">Accumulate credits with 4 partner merchants</div>
                      </div>
                    )}

                    <button
                      onClick={() =>
                        setActivePreviewNodeIndex((i) => Math.min(nodes.length - 1, i + 1))
                      }
                      className="w-full py-2.5 rounded-xl bg-[#e4e1a9] hover:bg-[#d8d598] text-[#171b26] font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
                    >
                      <span>
                        {activePreviewNodeIndex < nodes.length - 1 ? 'Continue to Next Stage &rarr;' : 'Complete Journey'}
                      </span>
                    </button>
                  </div>
                );
              })()}
            </div>
          ) : (
            /* Journey Loop Preview */
            <div className="bg-[#10141f] p-6 rounded-2xl border border-[#262a35] space-y-6">
              <div className="text-center max-w-xl mx-auto space-y-1">
                <span className="text-xs font-mono uppercase text-[#e4e1a9] font-bold">
                  THE EXPERIENCE-TO-ECONOMY LOOP
                </span>
                <h4 className="text-lg font-bold text-[#dfe2f0]">
                  Closed-Loop Autonomous Circuit
                </h4>
                <p className="text-xs text-[#939183]">
                  Experience &rarr; Action &rarr; Credits &rarr; Pool &rarr; Benefit &rarr; Transaction &rarr; New Experience
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-3 font-mono text-center">
                <div className="p-4 rounded-xl bg-[#141824] border border-purple-500/40 space-y-1">
                  <span className="text-[9px] text-purple-400">1. EXPERIENCE</span>
                  <div className="text-xs font-bold text-[#dfe2f0]">Touchpoint Entry &amp; Story</div>
                  <div className="text-[10px] text-[#939183]">QR, Web, Campaign</div>
                </div>

                <div className="p-4 rounded-xl bg-[#141824] border border-emerald-500/40 space-y-1">
                  <span className="text-[9px] text-emerald-400">2. ACTION</span>
                  <div className="text-xs font-bold text-[#dfe2f0]">Verified In-Store Purchase</div>
                  <div className="text-[10px] text-[#939183]">POS Signature HMAC</div>
                </div>

                <div className="p-4 rounded-xl bg-[#141824] border border-[#e4e1a9]/50 space-y-1">
                  <span className="text-[9px] text-[#e4e1a9]">3. CREDITS</span>
                  <div className="text-xs font-bold text-[#e4e1a9]">+200 Credits Issued</div>
                  <div className="text-[10px] text-[#939183]">Double-Entry Ledger</div>
                </div>

                <div className="p-4 rounded-xl bg-[#141824] border border-amber-500/40 space-y-1">
                  <span className="text-[9px] text-amber-300">4. POOL</span>
                  <div className="text-xs font-bold text-[#dfe2f0]">Demand Aggregator</div>
                  <div className="text-[10px] text-[#939183]">Fitness Weekend Pool</div>
                </div>

                <div className="p-4 rounded-xl bg-[#141824] border border-cyan-500/40 space-y-1">
                  <span className="text-[9px] text-cyan-300">5. BENEFIT</span>
                  <div className="text-xs font-bold text-[#dfe2f0]">Class Pass Burn &amp; Visit</div>
                  <div className="text-[10px] text-[#939183]">Redemption &amp; Retention</div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setActiveViewMode('publish')}
                  className="px-5 py-2.5 rounded-xl bg-[#e4e1a9] hover:bg-[#d8d598] text-[#171b26] font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <span>Proceed to Scheduling &amp; Publish &rarr;</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================================================================== */}
      {/* 4. VIEW MODE: PUBLISH & SCHEDULE                                     */}
      {/* ==================================================================== */}
      {activeViewMode === 'publish' && (
        <div className="bg-[#141824] p-6 rounded-2xl border border-[#262a35] space-y-6 max-w-2xl mx-auto">
          <div>
            <span className="text-[10px] font-mono uppercase text-[#e4e1a9] font-bold">
              MULTI-STEP PUBLISHING WORKFLOW
            </span>
            <h3 className="text-lg font-bold text-[#dfe2f0] mt-0.5">
              Draft &rarr; Validate &rarr; Preview &rarr; Schedule &rarr; Publish
            </h3>
            <p className="text-xs text-[#939183]">
              AI-generated experiences are never auto-published. Review confirmation is strictly enforced.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#10141f] border border-[#262a35] space-y-3">
            <div className="font-bold text-xs text-[#dfe2f0]">Schedule Activation</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="p-3 rounded-lg border border-[#262a35] hover:border-[#e4e1a9]/40 flex items-center gap-2 text-xs cursor-pointer">
                <input type="radio" name="publish-timing" defaultChecked />
                <span>Publish Immediately (Live Webhooks)</span>
              </label>

              <label className="p-3 rounded-lg border border-[#262a35] hover:border-[#e4e1a9]/40 flex items-center gap-2 text-xs cursor-pointer">
                <input type="radio" name="publish-timing" />
                <span>Schedule for Future Date</span>
              </label>
            </div>

            <div className="pt-2">
              <label className="text-[10px] font-mono text-[#939183] uppercase block mb-1">Activation Date</label>
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="bg-[#141824] border border-[#262a35] p-2 rounded-lg text-xs text-[#dfe2f0] focus:outline-none"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
            <Shield className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <div className="font-bold text-xs text-amber-300">Authoritative Governance Sign-Off</div>
              <p className="text-xs text-[#cac7b8]">
                Publishing will activate POS event ingestion rules and lock 50,000 Credits in campaign reserve escrow.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => setActiveViewMode('canvas')}
              className="px-4 py-2 rounded-xl bg-[#10141f] text-xs text-[#939183] border border-[#262a35] cursor-pointer"
            >
              Back to Canvas
            </button>
            <button
              onClick={() => {
                onUpdateExperience({ ...experience, status: 'Active' });
                setActiveViewMode('canvas');
              }}
              className="px-6 py-2.5 rounded-xl bg-[#e4e1a9] hover:bg-[#d8d598] text-[#171b26] font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Zap className="w-4 h-4" />
              <span>Publish Experience Now</span>
            </button>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* "BUILD WITH AI" MODAL                                                */}
      {/* ==================================================================== */}
      {isAiModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#141824] border border-[#e4e1a9]/50 rounded-2xl p-6 max-w-2xl w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#262a35]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#e4e1a9]" />
                <h3 className="font-bold text-base text-[#dfe2f0]">Build Experience with AI</h3>
              </div>
              <button onClick={() => setIsAiModalOpen(false)} className="text-[#939183] hover:text-[#dfe2f0]">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Prompt Input */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-[#939183] uppercase block">
                Prompt / Strategic Goal:
              </label>
              <textarea
                rows={3}
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className="w-full bg-[#10141f] border border-[#262a35] p-3 rounded-xl text-xs text-[#dfe2f0] focus:outline-none"
              />
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Fitness brand first purchase acquisition',
                  'Specialty coffee tasting passport',
                  'Creator UGC video campaign',
                ].map((sug) => (
                  <button
                    key={sug}
                    onClick={() => {
                      if (sug.includes('Fitness')) {
                        setAiPrompt(
                          'Create an experience for a fitness brand that wants to acquire first-time customers and reward them with Credits after purchase.'
                        );
                      } else if (sug.includes('coffee')) {
                        setAiPrompt(
                          'Design an artisan coffee crawl rewarding weekday afternoon check-ins with roasting masterclass perks.'
                        );
                      } else {
                        setAiPrompt(
                          'Build a creator sprint rewarding local short-form reviews with studio equipment access.'
                        );
                      }
                    }}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#10141f] text-[#939183] hover:text-[#dfe2f0] border border-[#262a35] cursor-pointer"
                  >
                    + {sug}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleGenerateWithAi}
                disabled={isAiGenerating}
                className="px-4 py-2 rounded-xl bg-[#e4e1a9] hover:bg-[#d8d598] text-[#171b26] font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isAiGenerating ? 'Synthesizing Architecture...' : 'Generate Journey Pipeline'}</span>
              </button>
            </div>

            {/* AI Generated Journey Preview */}
            {aiGeneratedJourney && (
              <div className="p-4 rounded-xl bg-[#10141f] border border-[#e4e1a9]/40 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#262a35]">
                  <span className="text-xs font-mono font-bold text-[#e4e1a9]">
                    Generated Sequence ({aiGeneratedJourney.length} Stages):
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400">Ready to Apply</span>
                </div>

                <div className="space-y-1.5 text-xs font-mono max-h-56 overflow-y-auto pr-1">
                  {aiGeneratedJourney.map((n, i) => (
                    <div
                      key={n.id}
                      className="p-2 rounded-lg bg-[#141824] border border-[#262a35] flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[#939183]">0{i + 1}</span>
                        <span className="font-bold text-[#dfe2f0]">{n.title}</span>
                      </div>
                      <span className="text-[10px] text-[#e4e1a9]">{n.type} &bull; {n.subtype}</span>
                    </div>
                  ))}
                </div>

                {/* Modal Buttons */}
                <div className="pt-2 flex items-center justify-between">
                  <button
                    onClick={handleGenerateWithAi}
                    className="px-3 py-1.5 rounded-lg bg-[#141824] text-xs text-[#939183] border border-[#262a35] cursor-pointer flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Regenerate</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsAiModalOpen(false)}
                      className="px-3.5 py-1.5 rounded-lg bg-[#141824] text-xs text-[#939183] border border-[#262a35] cursor-pointer"
                    >
                      Edit Prompt
                    </button>
                    <button
                      onClick={applyAiJourney}
                      className="px-5 py-2 rounded-lg bg-[#e4e1a9] hover:bg-[#d8d598] text-[#171b26] font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Check className="w-4 h-4" />
                      <span>Apply Journey</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
