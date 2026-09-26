import React, { useState, useEffect } from 'react';
import { useEconomic } from '../context/EconomicContext';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Play,
  RotateCcw,
  Target,
  Shield,
  Layers,
  Coins,
  Compass,
  ShoppingBag,
  TrendingUp,
  Award,
  BarChart3,
  Check,
  X,
  CreditCard,
  QrCode,
  Building2,
  Users,
  Clock,
  ExternalLink,
  ChevronRight,
  Flame,
  Zap,
  Terminal,
  Activity,
  AlertTriangle,
  FileCheck2,
} from 'lucide-react';

export const HeroEndToEndDemoScreen: React.FC = () => {
  const { navigate, setSelectedPoolId, setSelectedUserId } = useEconomic();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isPlayingAuto, setIsPlayingAuto] = useState<boolean>(false);
  const [autoTimer, setAutoTimer] = useState<number>(0);

  // Step 2 MCP state
  const [isMcpApproved, setIsMcpApproved] = useState<boolean>(false);

  // Step 3 POS Event state
  const [isPosSimulated, setIsPosSimulated] = useState<boolean>(false);
  const [posStage, setPosStage] = useState<string>('IDLE');

  // Step 5 Pool Selection state
  const [selectedBenefit, setSelectedBenefit] = useState<string | null>(null);

  // Step 6 Redemption state
  const [isRedeeming, setIsRedeeming] = useState<boolean>(false);
  const [isRedeemed, setIsRedeemed] = useState<boolean>(false);

  // Step 7 Experiment state
  const [experimentCreated, setExperimentCreated] = useState<boolean>(false);

  // Auto-play timer
  useEffect(() => {
    let interval: any;
    if (isPlayingAuto) {
      interval = setInterval(() => {
        setAutoTimer((prev) => {
          if (prev >= 100) {
            // Advance to next step
            setCurrentStep((s) => (s < 7 ? s + 1 : 1));
            return 0;
          }
          return prev + 2.5; // ~4 seconds per step
        });
      }, 100);
    } else {
      setAutoTimer(0);
    }
    return () => clearInterval(interval);
  }, [isPlayingAuto, currentStep]);

  // Steps definition
  const steps = [
    {
      num: 1,
      title: 'BRAND',
      subtitle: 'Campaign Definition via AI',
      loopNode: 'BUSINESS DEMAND → CAMPAIGN',
      icon: Building2,
      badge: 'Demand Creator',
    },
    {
      num: 2,
      title: 'MCP',
      subtitle: 'Execution Trace & Authorization',
      loopNode: 'MCP VALIDATION',
      icon: Terminal,
      badge: 'Agent Orchestration',
    },
    {
      num: 3,
      title: 'USER',
      subtitle: 'POS Event & Credit Issuance',
      loopNode: 'USER ACTION → CREDIT',
      icon: ShoppingBag,
      badge: 'Authoritative Ledger',
    },
    {
      num: 4,
      title: 'USER DISCOVERY',
      subtitle: 'Wallet Notification & Proactive Nudge',
      loopNode: 'CREDIT AWARENESS',
      icon: Coins,
      badge: 'Proactive AI',
    },
    {
      num: 5,
      title: 'POOL',
      subtitle: 'Demand Aggregation & Recommendations',
      loopNode: 'POOL DISCOVERY',
      icon: Compass,
      badge: 'Destination Alignment',
    },
    {
      num: 6,
      title: 'REDEMPTION',
      subtitle: 'Multi-Check Verification & Benefit Burn',
      loopNode: 'BENEFIT CONSUMPTION',
      icon: Award,
      badge: 'Settlement & Burn',
    },
    {
      num: 7,
      title: 'ANALYTICS',
      subtitle: 'Closed-Loop Insights & Optimization',
      loopNode: 'ANALYTICS → NEW DEMAND',
      icon: TrendingUp,
      badge: 'Loop Feedback',
    },
  ];

  const resetHeroDemo = () => {
    setCurrentStep(1);
    setIsPlayingAuto(false);
    setAutoTimer(0);
    setIsMcpApproved(false);
    setIsPosSimulated(false);
    setPosStage('IDLE');
    setSelectedBenefit(null);
    setIsRedeemed(false);
    setExperimentCreated(false);
  };

  const handleSimulatePos = () => {
    setPosStage('VERIFYING_TX');
    setTimeout(() => {
      setPosStage('VALIDATING_CAMPAIGN');
      setTimeout(() => {
        setPosStage('CALCULATING_REWARD');
        setTimeout(() => {
          setPosStage('COMMITTED');
          setIsPosSimulated(true);
        }, 350);
      }, 350);
    }, 350);
  };

  const handleRedeemBenefit = () => {
    setIsRedeeming(true);
    setTimeout(() => {
      setIsRedeeming(false);
      setIsRedeemed(true);
    }, 600);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Header */}
      <div className="bg-[#141824] border border-[#e4e1a9]/40 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        {/* Background glow effect */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#e4e1a9]/10 via-emerald-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#262a35] relative">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#1b1f2a] text-[#e4e1a9] border border-[#e4e1a9]/40 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>HERO DEMONSTRATION &bull; CLOSED-LOOP PROTOCOL</span>
              </span>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                End-to-End Verified
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#dfe2f0]">
              The Demand Aggregation &amp; Credit Loop
            </h1>
            <p className="text-xs sm:text-sm text-[#939183] max-w-3xl leading-relaxed">
              Experience the complete flow connecting <strong className="text-[#dfe2f0]">User</strong>,{' '}
              <strong className="text-[#dfe2f0]">Brand</strong>,{' '}
              <strong className="text-[#e4e1a9]">Credit</strong>,{' '}
              <strong className="text-[#dfe2f0]">Destination Pool</strong>, and the{' '}
              <strong className="text-[#dfe2f0]">MCP Interoperability Layer</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start lg:self-auto">
            <button
              onClick={() => setIsPlayingAuto(!isPlayingAuto)}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md ${
                isPlayingAuto
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-[#e4e1a9] hover:bg-[#d8d598] text-[#171b26]'
              }`}
            >
              <Play className={`w-3.5 h-3.5 ${isPlayingAuto ? 'animate-spin' : ''}`} />
              <span>{isPlayingAuto ? 'Pause Guided Tour' : 'Play Guided Tour'}</span>
            </button>

            <button
              onClick={resetHeroDemo}
              className="px-3.5 py-2 rounded-xl bg-[#171b26] hover:bg-[#1b1f2a] text-xs font-medium text-[#939183] hover:text-[#dfe2f0] border border-[#262a35] flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Reset Demo State"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Complete Macro-Economic Loop Diagram */}
        <div className="pt-5 space-y-3 relative">
          <div className="flex items-center justify-between text-[11px] font-mono text-[#939183]">
            <span className="uppercase tracking-wider font-semibold text-[#c8c58f]">
              Autonomous Value Circuit (Demand Aggregation OS):
            </span>
            <span>
              Active Phase:{' '}
              <strong className="text-[#e4e1a9]">{steps[currentStep - 1].loopNode}</strong>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-9 gap-1.5 text-center text-[10px] font-mono">
            {[
              { id: 1, label: 'BUSINESS DEMAND', stepRef: 1 },
              { id: 2, label: 'CAMPAIGN', stepRef: 1 },
              { id: 3, label: 'USER ACTION', stepRef: 3 },
              { id: 4, label: 'CREDIT', stepRef: 3 },
              { id: 5, label: 'POOL', stepRef: 5 },
              { id: 6, label: 'BENEFIT', stepRef: 6 },
              { id: 7, label: 'NEW DEMAND', stepRef: 6 },
              { id: 8, label: 'ANALYTICS', stepRef: 7 },
              { id: 9, label: 'OPTIMIZATION', stepRef: 7 },
            ].map((node, i) => {
              const isHighlighted =
                (node.stepRef === currentStep) ||
                (currentStep === 1 && (node.id === 1 || node.id === 2)) ||
                (currentStep === 3 && (node.id === 3 || node.id === 4)) ||
                (currentStep === 5 && node.id === 5) ||
                (currentStep === 6 && (node.id === 6 || node.id === 7)) ||
                (currentStep === 7 && (node.id === 8 || node.id === 9));

              return (
                <div
                  key={node.id}
                  className={`p-2 rounded-lg border transition-all ${
                    isHighlighted
                      ? 'bg-[#1b1f2a] border-[#e4e1a9] text-[#e4e1a9] font-bold shadow-lg shadow-[#e4e1a9]/10 ring-1 ring-[#e4e1a9]/40 scale-102'
                      : 'bg-[#10141f] border-[#262a35] text-[#939183]'
                  }`}
                >
                  <div className="truncate">{node.label}</div>
                  <div className="text-[8px] opacity-60 mt-0.5">Stage 0{node.id}</div>
                </div>
              );
            })}
          </div>

          {/* Auto play progress bar */}
          {isPlayingAuto && (
            <div className="w-full bg-[#10141f] rounded-full h-1 overflow-hidden">
              <div
                className="h-full bg-[#e4e1a9] transition-all duration-100 ease-linear"
                style={{ width: `${autoTimer}%` }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Interactive Step Selector Stepper */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {steps.map((s) => {
          const isCurrent = s.num === currentStep;
          const isPassed = s.num < currentStep;
          const Icon = s.icon;

          return (
            <button
              key={s.num}
              onClick={() => {
                setIsPlayingAuto(false);
                setCurrentStep(s.num);
              }}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                isCurrent
                  ? 'bg-[#1b1f2a] border-[#e4e1a9] text-[#dfe2f0] shadow-md ring-1 ring-[#e4e1a9]/30'
                  : isPassed
                  ? 'bg-[#141824] border-emerald-500/30 text-[#cac7b8] hover:border-[#3b4152]'
                  : 'bg-[#141824] border-[#262a35] text-[#939183] hover:text-[#dfe2f0]'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-[10px] text-[#e4e1a9] font-bold">
                  STEP 0{s.num}
                </span>
                {isPassed && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
              </div>
              <div className="text-xs font-bold truncate text-[#dfe2f0]">{s.title}</div>
              <div className="text-[10px] text-[#939183] truncate mt-0.5">{s.subtitle}</div>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Stage Box */}
      <div className="bg-[#141824] border border-[#262a35] rounded-2xl p-6 shadow-xl space-y-6">
        {/* Step Indicator Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#262a35]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1b1f2a] border border-[#e4e1a9]/40 text-[#e4e1a9] flex items-center justify-center font-bold font-mono text-base">
              0{currentStep}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-[#dfe2f0]">
                  STEP {currentStep} &mdash; {steps[currentStep - 1].title}
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1b1f2a] text-[#e4e1a9] border border-[#e4e1a9]/30">
                  {steps[currentStep - 1].badge}
                </span>
              </div>
              <p className="text-xs text-[#939183] mt-0.5">
                {steps[currentStep - 1].subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
              disabled={currentStep === 1}
              className="px-3 py-1.5 rounded-lg bg-[#171b26] hover:bg-[#1b1f2a] disabled:opacity-40 text-xs text-[#dfe2f0] border border-[#262a35] flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setCurrentStep((s) => Math.min(7, s + 1))}
              disabled={currentStep === 7}
              className="px-3.5 py-1.5 rounded-lg bg-[#e4e1a9] hover:bg-[#d8d598] disabled:opacity-40 text-xs font-bold text-[#171b26] flex items-center gap-1 cursor-pointer transition-all shadow-sm"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* STEP 1: BRAND                                            */}
        {/* ======================================================== */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-[#171b26] border border-[#262a35] flex items-start gap-3">
              <Building2 className="w-5 h-5 text-[#e4e1a9] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-[#dfe2f0]">
                  Scenario Context: Saigon Fitness Club wants to acquire new customers.
                </h4>
                <p className="text-xs text-[#939183] leading-relaxed">
                  Instead of paying traditional ad platforms $8+ per click with unverified conversions, the brand uses the AI Campaign Builder to seed high-utility credits and aggregate demand toward a dedicated Destination Pool.
                </p>
              </div>
            </div>

            {/* Input Simulation */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-[#939183] block">
                Brand Input in AI Campaign Builder:
              </label>
              <div className="p-4 rounded-xl bg-[#10141f] border border-[#e4e1a9]/50 font-mono text-sm text-[#e4e1a9] shadow-inner flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#e4e1a9] shrink-0" />
                <span>&ldquo;I want to acquire new fitness customers and reward first-time purchases.&rdquo;</span>
              </div>
            </div>

            {/* AI Generated Elements */}
            <div className="space-y-3">
              <div className="text-xs font-mono text-[#939183] uppercase tracking-wider">
                Autonomous Proposal Synthesized by AI:
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-[#171b26] border border-[#262a35] space-y-1">
                  <span className="text-[10px] font-mono text-[#939183] uppercase">Campaign</span>
                  <div className="font-bold text-sm text-[#dfe2f0]">New Fitness Patron Acquisition Drive</div>
                  <div className="text-[11px] text-[#939183]">Program: Saigon Fitness Growth Q3</div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#171b26] border border-[#262a35] space-y-1">
                  <span className="text-[10px] font-mono text-[#939183] uppercase">Target Segment</span>
                  <div className="font-bold text-sm text-[#dfe2f0]">New / First-Time Wellness Patrons</div>
                  <div className="text-[11px] text-[#939183]">Filtered by: 0 previous transactions</div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#171b26] border border-[#262a35] space-y-1">
                  <span className="text-[10px] font-mono text-[#939183] uppercase">Purchase Trigger</span>
                  <div className="font-bold text-sm text-emerald-400">First-Time In-Store Purchase &ge; $25</div>
                  <div className="text-[11px] text-[#939183]">Source: Merchant POS Connector</div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#171b26] border border-[#e4e1a9]/30 space-y-1">
                  <span className="text-[10px] font-mono text-[#939183] uppercase">Credit Reward</span>
                  <div className="font-bold text-base font-mono text-[#e4e1a9]">200 Credits</div>
                  <div className="text-[11px] text-[#939183]">Instant programmable credit ledger mint</div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#171b26] border border-[#262a35] space-y-1">
                  <span className="text-[10px] font-mono text-[#939183] uppercase">Total Budget</span>
                  <div className="font-bold text-base font-mono text-[#dfe2f0]">50,000 Credits</div>
                  <div className="text-[11px] text-[#939183]">Supports 250 verified customer acquisitions</div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#171b26] border border-[#e4e1a9]/40 space-y-1">
                  <span className="text-[10px] font-mono text-[#939183] uppercase">Destination Pool</span>
                  <div className="font-bold text-sm text-[#e4e1a9]">Fitness &amp; Wellness Weekend Pool</div>
                  <div className="text-[11px] text-[#939183]">Aggregates demand with 4 partner merchants</div>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-5 py-2.5 rounded-xl bg-[#e4e1a9] hover:bg-[#d8d598] text-[#171b26] font-bold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <span>Proceed to Step 2: MCP Execution Trace &rarr;</span>
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 2: MCP                                              */}
        {/* ======================================================== */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-[#dfe2f0]">
                  Model Context Protocol (MCP) Orchestration &amp; Verification
                </h4>
                <p className="text-xs text-[#939183]">
                  Subtle trace demonstrating read tool inspection, draft state initialization, and explicit admin approval.
                </p>
              </div>
              <span className="text-xs font-mono text-emerald-300 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/30">
                mTLS Verified
              </span>
            </div>

            {/* Execution Trace Terminal */}
            <div className="bg-[#10141f] border border-[#262a35] rounded-xl p-4 font-mono text-xs space-y-3 shadow-inner">
              <div className="flex items-center justify-between pb-2 border-b border-[#262a35] text-[11px] text-[#939183]">
                <div className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-[#e4e1a9]" />
                  <span>MCP Execution Trace: Agent &rarr; Tool Registry</span>
                </div>
                <span>Session ID: sess_mcp_9921b</span>
              </div>

              <div className="space-y-2 text-[#dfe2f0]">
                <div className="flex items-start gap-2">
                  <span className="text-[#939183]">10:14:02.120</span>
                  <span className="text-[#e4e1a9] font-bold">AI</span>
                  <span className="text-[#939183]">&rarr;</span>
                  <span className="text-emerald-400">get_audience_segments({`{ category: 'fitness', status: 'new' }`})</span>
                </div>
                <div className="pl-24 text-[11px] text-[#939183]">
                  &rdquor; Result: Found 4,280 prospective patrons in metro reach.
                </div>

                <div className="flex items-start gap-2">
                  <span className="text-[#939183]">10:14:02.450</span>
                  <span className="text-[#e4e1a9] font-bold">AI</span>
                  <span className="text-[#939183]">&rarr;</span>
                  <span className="text-emerald-400">estimate_credit_cost({`{ target: 250, reward_per_user: 200 }`})</span>
                </div>
                <div className="pl-24 text-[11px] text-[#939183]">
                  &rdquor; Result: 50,000 CRD budget envelope required. Merchant headroom verified (Solvent).
                </div>

                <div className="flex items-start gap-2">
                  <span className="text-[#939183]">10:14:02.820</span>
                  <span className="text-[#e4e1a9] font-bold">AI</span>
                  <span className="text-[#939183]">&rarr;</span>
                  <span className="text-amber-400">create_campaign_draft({`{ name: 'New Fitness Patron Acquisition Drive' }`})</span>
                </div>

                <div className="flex items-start gap-2">
                  <span className="text-[#939183]">10:14:03.110</span>
                  <span className="text-[#e4e1a9] font-bold">AI</span>
                  <span className="text-[#939183]">&rarr;</span>
                  <span className="text-amber-400">create_credit_rule_draft({`{ trigger: 'first_purchase', reward: 200 }`})</span>
                </div>

                <div className="flex items-start gap-2">
                  <span className="text-[#939183]">10:14:03.390</span>
                  <span className="text-[#e4e1a9] font-bold">AI</span>
                  <span className="text-[#939183]">&rarr;</span>
                  <span className="text-amber-400">create_pool_draft({`{ poolName: 'Fitness & Wellness Weekend Pool' }`})</span>
                </div>

                <div className="pt-2 border-t border-[#262a35] flex items-center justify-between">
                  <span className="text-amber-300 font-bold">
                    &bull; Status: DRAFTS COMMITTED &mdash; SENSITIVE WRITE ACTION QUARANTINED
                  </span>
                  <span className="text-[#939183]">Requires Explicit Human Operator Sign-Off</span>
                </div>
              </div>
            </div>

            {/* Admin Authorization Card */}
            <div className={`p-4 rounded-xl border transition-all ${
              isMcpApproved
                ? 'bg-emerald-500/10 border-emerald-500/40'
                : 'bg-[#171b26] border-amber-500/40'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    isMcpApproved ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {isMcpApproved ? <Check className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-[#dfe2f0]">
                      {isMcpApproved ? 'Campaign & Rule Activated' : 'Admin Approval Required (Human-in-the-Loop)'}
                    </h5>
                    <p className="text-[11px] text-[#939183]">
                      {isMcpApproved
                        ? 'Campaign CMP-FIT-001 is now LIVE on the network. POS webhooks active.'
                        : 'Review proposed 50,000 CRD reserve encumbrance and rule parameters.'}
                    </p>
                  </div>
                </div>

                {!isMcpApproved ? (
                  <button
                    onClick={() => setIsMcpApproved(true)}
                    className="px-4 py-2 rounded-lg bg-[#e4e1a9] hover:bg-[#d8d598] text-[#171b26] font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve &amp; Publish Campaign</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="px-4 py-2 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-[#171b26] font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <span>Proceed to Step 3: User Purchase &rarr;</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 3: USER                                             */}
        {/* ======================================================== */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-[#171b26] border border-[#262a35] flex items-start gap-3">
              <ShoppingBag className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-[#dfe2f0]">
                  User Scenario: Sarah Chen completes a qualifying in-store purchase.
                </h4>
                <p className="text-xs text-[#939183] mt-0.5">
                  Sarah visits Saigon Fitness Studio and purchases an introductory session ($35.00). The merchant POS fires a verified event payload into the Credit Economy.
                </p>
              </div>
            </div>

            {/* Simulated POS Terminal & Webhook */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-[#10141f] border border-[#262a35] space-y-3">
                <div className="flex items-center justify-between text-[#939183] border-b border-[#262a35] pb-2">
                  <span>Merchant POS Terminal #02</span>
                  <span className="text-emerald-400">ONLINE</span>
                </div>
                <div className="space-y-1 text-[#cac7b8]">
                  <div>Customer: <strong className="text-[#dfe2f0]">Sarah Chen</strong></div>
                  <div>Merchant: <strong className="text-[#dfe2f0]">Saigon Fitness Studio</strong></div>
                  <div>Order Amount: <strong className="text-[#dfe2f0]">$35.00 USD</strong></div>
                  <div>Event Type: <strong className="text-emerald-400">purchase_verified</strong></div>
                  <div>Tx Reference: <span className="text-[#939183]">POS-99823-SGN</span></div>
                </div>

                <button
                  onClick={handleSimulatePos}
                  disabled={posStage !== 'IDLE' && posStage !== 'COMMITTED'}
                  className={`w-full py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    isPosSimulated
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-[#e4e1a9] hover:bg-[#d8d598] text-[#171b26]'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>{isPosSimulated ? 'Purchase Verified & Event Replayed' : 'Simulate POS Purchase Event'}</span>
                </button>
              </div>

              {/* Credit Engine Validation Pipeline */}
              <div className="p-4 rounded-xl bg-[#10141f] border border-[#262a35] space-y-2.5">
                <div className="flex items-center justify-between text-[#939183] border-b border-[#262a35] pb-2">
                  <span>Authoritative Credit Engine Pipeline</span>
                  <span className="text-[#e4e1a9]">MCP Consumer</span>
                </div>

                <div className="space-y-2 text-[11px]">
                  <div className="flex items-center justify-between">
                    <span>1. validate transaction</span>
                    <span className={posStage !== 'IDLE' ? 'text-emerald-400' : 'text-[#939183]'}>
                      {posStage !== 'IDLE' ? 'PASSED &bull; HMAC OK' : 'PENDING'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>2. validate campaign</span>
                    <span className={posStage !== 'IDLE' && posStage !== 'VERIFYING_TX' ? 'text-emerald-400' : 'text-[#939183]'}>
                      {posStage !== 'IDLE' && posStage !== 'VERIFYING_TX' ? 'ACTIVE &bull; 50k BUDGET' : 'PENDING'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>3. validate user eligibility</span>
                    <span className={posStage === 'CALCULATING_REWARD' || posStage === 'COMMITTED' ? 'text-emerald-400' : 'text-[#939183]'}>
                      {posStage === 'CALCULATING_REWARD' || posStage === 'COMMITTED' ? 'FIRST-TIME PATRON OK' : 'PENDING'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>4. calculate reward</span>
                    <span className={posStage === 'COMMITTED' ? 'text-[#e4e1a9] font-bold' : 'text-[#939183]'}>
                      {posStage === 'COMMITTED' ? '200 CRD' : 'PENDING'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-[#262a35]">
                    <span className="font-bold">5. issue 200 Credits</span>
                    <span className={posStage === 'COMMITTED' ? 'text-emerald-400 font-bold' : 'text-[#939183]'}>
                      {posStage === 'COMMITTED' ? 'LEDGER COMMITTED' : 'PENDING'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {isPosSimulated && (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Double-entry ledger journal #LED-99182 committed: 200 CRD credited to Sarah Chen.</span>
                </div>
                <button
                  onClick={() => setCurrentStep(4)}
                  className="px-4 py-1.5 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-[#171b26] font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <span>Proceed to Step 4: User Discovery &rarr;</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 4: USER DISCOVERY                                   */}
        {/* ======================================================== */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-[#dfe2f0]">
                  User Discovery &mdash; Credit Wallet Experience
                </h4>
                <p className="text-xs text-[#939183]">
                  Sarah Chen opens her Credit Wallet on mobile. AI delivers a proactive destination recommendation.
                </p>
              </div>
              <span className="text-xs font-mono text-[#e4e1a9] bg-[#1b1f2a] px-2.5 py-1 rounded border border-[#262a35]">
                Patron: Sarah Chen
              </span>
            </div>

            {/* Mobile / Wallet Preview Simulation */}
            <div className="max-w-md mx-auto bg-[#10141f] border border-[#262a35] rounded-3xl p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between text-xs text-[#939183] pb-2 border-b border-[#262a35]">
                <span className="font-mono">Credit Economy Wallet</span>
                <span className="text-emerald-400 font-mono">Synced</span>
              </div>

              {/* Balance Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#171b26] to-[#141824] border border-[#e4e1a9]/30 space-y-2">
                <span className="text-[10px] font-mono text-[#939183] uppercase">Available Balance</span>
                <div className="flex items-baseline gap-2">
                  <div className="text-3xl font-bold font-mono text-[#e4e1a9]">1,440</div>
                  <div className="text-xs font-mono text-[#939183]">CRD</div>
                  <span className="text-[11px] font-mono text-emerald-400 ml-auto bg-emerald-500/10 px-2 py-0.5 rounded">
                    +200 CRD Just Added
                  </span>
                </div>
                <div className="text-[11px] text-[#cac7b8]">
                  From: <strong>Saigon Fitness Studio First Purchase</strong>
                </div>
              </div>

              {/* AI Proactive Nudge Card */}
              <div className="p-4 rounded-2xl bg-[#1b1f2a] border border-[#e4e1a9]/60 space-y-2.5 shadow-lg">
                <div className="flex items-center gap-2 text-xs font-bold text-[#e4e1a9]">
                  <Sparkles className="w-4 h-4 text-[#e4e1a9]" />
                  <span>AI Destination Nudge</span>
                </div>
                <p className="text-xs text-[#dfe2f0] leading-relaxed font-medium">
                  &ldquo;You've earned 200 Credits. You are 300 Credits away from unlocking the Fitness Weekend Pool.&rdquo;
                </p>

                {/* Progress toward pool goal */}
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-[#939183]">Goal: Fitness Weekend Pool</span>
                    <span className="text-[#e4e1a9] font-bold">200 / 500 CRD (40%)</span>
                  </div>
                  <div className="w-full bg-[#10141f] rounded-full h-2 overflow-hidden">
                    <div className="h-full bg-[#e4e1a9] rounded-full transition-all" style={{ width: '40%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setCurrentStep(5)}
                className="px-5 py-2.5 rounded-xl bg-[#e4e1a9] hover:bg-[#d8d598] text-[#171b26] font-bold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <span>Proceed to Step 5: Ask AI &amp; Pool Discovery &rarr;</span>
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 5: POOL                                             */}
        {/* ======================================================== */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-[#10141f] border border-[#262a35] space-y-2">
              <span className="text-[10px] font-mono text-[#939183] uppercase">User Prompt in Chat / Search:</span>
              <div className="text-sm font-bold text-[#dfe2f0] flex items-center gap-2">
                <span className="text-[#e4e1a9]">&ldquo;What can I unlock with my Credits?&rdquo;</span>
              </div>
              <div className="text-[11px] text-[#939183]">
                AI queries: <code className="text-[#c8c58f]">mcp.search_pools()</code> &amp; <code className="text-[#c8c58f]">mcp.get_reward_inventory()</code>
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-xs font-mono text-[#939183] uppercase tracking-wider">
                AI Recommendation Engine Returns Curated Options:
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. Fitness Class */}
                <div
                  onClick={() => setSelectedBenefit('fitness-class')}
                  className={`p-4 rounded-xl border transition-all cursor-pointer space-y-3 ${
                    selectedBenefit === 'fitness-class'
                      ? 'bg-[#1b1f2a] border-[#e4e1a9] ring-2 ring-[#e4e1a9]/30 shadow-lg'
                      : 'bg-[#171b26] border-[#262a35] hover:border-[#3b4152]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                      INSTANT UNLOCK
                    </span>
                    <span className="font-mono text-sm font-bold text-[#e4e1a9]">200 CRD</span>
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-[#dfe2f0]">1-Day Premium HIIT Class</h5>
                    <p className="text-[11px] text-[#939183] mt-0.5">Saigon Fitness Studio</p>
                  </div>
                  <p className="text-xs text-[#cac7b8]">
                    Full access pass to recovery lounge, sauna, and premium group session.
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedBenefit('fitness-class');
                      setCurrentStep(6);
                    }}
                    className="w-full py-1.5 rounded-lg bg-[#e4e1a9] hover:bg-[#d8d598] text-[#171b26] font-bold text-xs cursor-pointer"
                  >
                    Select &amp; Redeem
                  </button>
                </div>

                {/* 2. Coffee Benefit */}
                <div
                  onClick={() => setSelectedBenefit('coffee-benefit')}
                  className={`p-4 rounded-xl border transition-all cursor-pointer space-y-3 ${
                    selectedBenefit === 'coffee-benefit'
                      ? 'bg-[#1b1f2a] border-[#e4e1a9] ring-2 ring-[#e4e1a9]/30'
                      : 'bg-[#171b26] border-[#262a35] hover:border-[#3b4152]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                      INSTANT UNLOCK
                    </span>
                    <span className="font-mono text-sm font-bold text-[#e4e1a9]">150 CRD</span>
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-[#dfe2f0]">Cold Brew &amp; Croissant Set</h5>
                    <p className="text-[11px] text-[#939183] mt-0.5">ABC Coffee Roasters</p>
                  </div>
                  <p className="text-xs text-[#cac7b8]">
                    Single origin cold brew pairing at any partner boutique café counter.
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedBenefit('coffee-benefit');
                      setCurrentStep(6);
                    }}
                    className="w-full py-1.5 rounded-lg bg-[#141824] hover:bg-[#1b1f2a] text-[#dfe2f0] font-medium text-xs border border-[#262a35] cursor-pointer"
                  >
                    Select
                  </button>
                </div>

                {/* 3. Sports Event */}
                <div
                  onClick={() => setSelectedBenefit('sports-event')}
                  className={`p-4 rounded-xl border transition-all cursor-pointer space-y-3 ${
                    selectedBenefit === 'sports-event'
                      ? 'bg-[#1b1f2a] border-[#e4e1a9] ring-2 ring-[#e4e1a9]/30'
                      : 'bg-[#171b26] border-[#262a35] hover:border-[#3b4152]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                      ASPIRATIONAL GOAL
                    </span>
                    <span className="font-mono text-sm font-bold text-[#dfe2f0]">500 CRD</span>
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-[#dfe2f0]">Weekend VIP Marathon Pass</h5>
                    <p className="text-[11px] text-[#939183] mt-0.5">City Marathon Series</p>
                  </div>
                  <p className="text-xs text-[#cac7b8]">
                    Exclusive bib number, recovery hydration kit, and finisher gala entry.
                  </p>
                  <div className="text-[11px] text-amber-300 font-mono">
                    300 Credits needed to unlock
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 6: REDEMPTION                                       */}
        {/* ======================================================== */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-[#dfe2f0]">
                  Benefit Redemption &mdash; Authoritative Safety Checks
                </h4>
                <p className="text-xs text-[#939183]">
                  Selected: <strong className="text-[#e4e1a9]">1-Day Premium HIIT Class</strong> (200 Credits)
                </p>
              </div>
              <span className="text-xs font-mono text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/30">
                SENSITIVE Tool: redeem_benefit()
              </span>
            </div>

            {/* MCP Pre-Redemption Safety Checks */}
            <div className="p-4 rounded-xl bg-[#10141f] border border-[#262a35] space-y-3 font-mono text-xs">
              <div className="text-[10px] text-[#939183] uppercase pb-2 border-b border-[#262a35]">
                MCP Read Tools Executed Prior to Burn:
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-[#171b26] border border-emerald-500/30 space-y-1">
                  <div className="text-[#939183]">1. check_balance()</div>
                  <div className="text-emerald-400 font-bold">200 / 1,440 CRD (PASS)</div>
                  <div className="text-[10px] text-[#939183]">Sufficient unencumbered funds</div>
                </div>

                <div className="p-3 rounded-lg bg-[#171b26] border border-emerald-500/30 space-y-1">
                  <div className="text-[#939183]">2. check_eligibility()</div>
                  <div className="text-emerald-400 font-bold">ELIGIBLE (PASS)</div>
                  <div className="text-[10px] text-[#939183]">Active tier &amp; no restriction</div>
                </div>

                <div className="p-3 rounded-lg bg-[#171b26] border border-emerald-500/30 space-y-1">
                  <div className="text-[#939183]">3. check_inventory()</div>
                  <div className="text-emerald-400 font-bold">34 PASSES AVAILABLE</div>
                  <div className="text-[10px] text-[#939183]">Allocated partner quota OK</div>
                </div>
              </div>
            </div>

            {/* Confirmation & Execution */}
            {!isRedeemed ? (
              <div className="p-5 rounded-xl bg-[#171b26] border border-[#e4e1a9]/50 space-y-4">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-[#e4e1a9]" />
                  <div>
                    <h5 className="font-bold text-sm text-[#dfe2f0]">
                      Confirm Credit Burn Authorization
                    </h5>
                    <p className="text-xs text-[#939183]">
                      Burning 200 Credits will permanently update your balance on the ledger and issue your entrance QR pass.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    onClick={() => setCurrentStep(5)}
                    className="px-4 py-2 rounded-lg bg-[#10141f] text-xs text-[#939183] border border-[#262a35] cursor-pointer"
                  >
                    Choose Different Benefit
                  </button>
                  <button
                    onClick={handleRedeemBenefit}
                    disabled={isRedeeming}
                    className="px-5 py-2 rounded-lg bg-[#e4e1a9] hover:bg-[#d8d598] text-[#171b26] font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>{isRedeeming ? 'Executing redeem_benefit()...' : 'Confirm & Authorize Burn (200 CRD)'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/40 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
                      <QrCode className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">
                        Voucher Issued &bull; Ledger Burn Recorded
                      </span>
                      <h4 className="text-base font-bold text-[#dfe2f0]">
                        Pass: VCH-FIT-88219 (1-Day HIIT Access)
                      </h4>
                      <p className="text-xs text-[#cac7b8]">
                        Present QR code at Saigon Fitness Studio reception. Valid for 30 days.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setCurrentStep(7)}
                    className="px-5 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-[#171b26] font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                  >
                    <span>Proceed to Step 7: Campaign Analytics &rarr;</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 7: ANALYTICS                                        */}
        {/* ======================================================== */}
        {currentStep === 7 && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-[#10141f] border border-[#262a35] space-y-2">
              <span className="text-[10px] font-mono text-[#939183] uppercase">Admin Diagnostic Query:</span>
              <div className="text-sm font-bold text-[#dfe2f0] flex items-center gap-2">
                <span className="text-[#e4e1a9]">&ldquo;How did this campaign perform?&rdquo;</span>
              </div>
            </div>

            {/* Retrieved Metrics Grid */}
            <div className="space-y-2">
              <span className="text-xs font-mono text-[#939183] uppercase tracking-wider block">
                MCP Telemetry Retrieved Across Engines:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 text-xs font-mono">
                <div className="p-3 rounded-lg bg-[#171b26] border border-[#262a35]">
                  <div className="text-[10px] text-[#939183]">Participants</div>
                  <div className="text-sm font-bold text-[#dfe2f0]">420</div>
                  <div className="text-[9px] text-[#939183] font-sans">New patrons</div>
                </div>

                <div className="p-3 rounded-lg bg-[#171b26] border border-[#262a35]">
                  <div className="text-[10px] text-[#939183]">Conversion</div>
                  <div className="text-sm font-bold text-emerald-400">38.4%</div>
                  <div className="text-[9px] text-emerald-400 font-sans">+14% vs benchmark</div>
                </div>

                <div className="p-3 rounded-lg bg-[#171b26] border border-[#262a35]">
                  <div className="text-[10px] text-[#939183]">Credits Issued</div>
                  <div className="text-sm font-bold text-[#e4e1a9]">42,000</div>
                  <div className="text-[9px] text-[#939183] font-sans">84% of envelope</div>
                </div>

                <div className="p-3 rounded-lg bg-[#171b26] border border-[#262a35]">
                  <div className="text-[10px] text-[#939183]">Credits Burned</div>
                  <div className="text-sm font-bold text-emerald-300">31,500</div>
                  <div className="text-[9px] text-emerald-400 font-sans">75% velocity rate</div>
                </div>

                <div className="p-3 rounded-lg bg-[#171b26] border border-[#262a35]">
                  <div className="text-[10px] text-[#939183]">Pool Engagement</div>
                  <div className="text-sm font-bold text-[#e4e1a9]">84%</div>
                  <div className="text-[9px] text-emerald-400 font-sans">Opened or saved</div>
                </div>

                <div className="p-3 rounded-lg bg-[#171b26] border border-[#262a35]">
                  <div className="text-[10px] text-[#939183]">Purchase Conv</div>
                  <div className="text-sm font-bold text-emerald-400">2.6x</div>
                  <div className="text-[9px] text-emerald-400 font-sans">Repeat visits</div>
                </div>

                <div className="p-3 rounded-lg bg-[#171b26] border border-[#262a35]">
                  <div className="text-[10px] text-[#939183]">Acquisition CAC</div>
                  <div className="text-sm font-bold text-emerald-300">$1.85</div>
                  <div className="text-[9px] text-[#939183] font-sans">vs $8.40 paid ads</div>
                </div>
              </div>
            </div>

            {/* CAMPAIGN INSIGHT */}
            <div className="p-5 rounded-xl bg-[#171b26] border border-[#e4e1a9]/50 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold font-mono text-[#e4e1a9] uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-[#e4e1a9]" />
                <span>CAMPAIGN INSIGHT</span>
              </div>
              <p className="text-sm font-semibold text-[#dfe2f0] leading-relaxed">
                &ldquo;Users who received Credits had higher Pool engagement than users who only received a voucher.&rdquo;
              </p>
              <p className="text-xs text-[#cac7b8] leading-relaxed">
                Empirical comparative testing demonstrates that 84% of credit recipients actively browsed or committed toward a multi-brand Destination Pool, compared to only 14% retention among single-merchant coupon recipients.
              </p>

              {/* Action: Create follow-up experiment */}
              <div className="pt-3 border-t border-[#262a35] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#dfe2f0]">Recommended Optimization:</span>{' '}
                  <span className="text-xs text-[#939183]">
                    Launch a cross-brand weekend bundle connecting Saigon Fitness + ABC Coffee.
                  </span>
                </div>

                {!experimentCreated ? (
                  <button
                    onClick={() => setExperimentCreated(true)}
                    className="px-4 py-2 rounded-lg bg-[#e4e1a9] hover:bg-[#d8d598] text-[#171b26] font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Create follow-up experiment</span>
                  </button>
                ) : (
                  <span className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Follow-Up Experiment Drafted</span>
                  </span>
                )}
              </div>
            </div>

            {/* Loop Summary Banner */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-[#171b26] via-[#1b1f2a] to-[#171b26] border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Closed-Loop Demand Aggregation Completed</span>
                </div>
                <div className="text-[#939183]">
                  Business Demand &rarr; Campaign &rarr; User Action &rarr; Credit &rarr; Pool &rarr; Benefit &rarr; New Demand &rarr; Analytics &rarr; Optimization.
                </div>
              </div>

              <button
                onClick={resetHeroDemo}
                className="px-3.5 py-1.5 rounded-lg bg-[#141824] hover:bg-[#1b1f2a] text-[#dfe2f0] border border-[#262a35] font-medium text-xs cursor-pointer"
              >
                Replay Hero Demo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
