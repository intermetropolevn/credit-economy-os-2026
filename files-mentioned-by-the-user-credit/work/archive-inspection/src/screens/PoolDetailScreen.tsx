import React, { useState } from 'react';
import { useEconomic } from '../context/EconomicContext';
import {
  BenefitPool,
  PoolBenefit,
  PoolContribution,
  PoolParticipant,
  BenefitType,
  PoolType,
  UserGoalAllocation,
} from '../types';
import {
  ArrowLeft,
  Layers,
  Sparkles,
  Users,
  DollarSign,
  TrendingUp,
  Target,
  Gift,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Plus,
  ArrowRight,
  ShoppingBag,
  ExternalLink,
  Shield,
  Building2,
  Calendar,
  Check,
  X,
  Search,
  Zap,
  Tag,
  BarChart3,
  Award,
  ChevronRight,
  Compass,
  QrCode,
  Coins,
  Wallet,
  RotateCcw,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';

export const PoolDetailScreen: React.FC = () => {
  const {
    pools,
    selectedPoolId,
    setSelectedPoolId,
    navigate,
    currentPath,
    users,
    selectedUserId,
    setSelectedUserId,
    redeemPoolBenefit,
    saveUserGoal,
    allocateCreditsToGoal,
    unallocateCreditsFromGoal,
    simulateEarnOpportunity,
    addPoolContribution,
    organizations,
  } = useEconomic();

  const currentPool: BenefitPool =
    pools.find((p) => {
      if (currentPath.includes('/pools/')) {
        const idFromPath = currentPath.split('/pools/')[1]?.split('?')[0];
        if (idFromPath && p.id === idFromPath) return true;
      }
      return p.id === selectedPoolId;
    }) || pools[0];

  const selectedUser = users.find((u) => u.id === selectedUserId) || users[0];

  // Tabs: Overview | Benefits | Funding | Participants | Redemptions | Rules | Analytics
  const [activeTab, setActiveTab] = useState<
    'overview' | 'benefits' | 'funding' | 'participants' | 'redemptions' | 'rules' | 'analytics'
  >('overview');

  // Filters & Search in Benefits
  const [benefitSearch, setBenefitSearch] = useState('');
  const [benefitTypeFilter, setBenefitTypeFilter] = useState<'ALL' | BenefitType>('ALL');

  // Redemption Modal State
  const [redeemBenefit, setRedeemBenefit] = useState<PoolBenefit | null>(null);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [redeemResult, setRedeemResult] = useState<{
    success: boolean;
    redemptionId?: string;
    message: string;
  } | null>(null);

  // Claimed Digital Voucher Pass State
  const [claimedVoucher, setClaimedVoucher] = useState<{
    redemptionId: string;
    benefit: PoolBenefit;
    userName: string;
    userEmail: string;
    timestamp: string;
    ledgerTxId: string;
  } | null>(null);

  // Goal & Earning Opportunities Modal / Drawer
  const [showEarnDrawer, setShowEarnDrawer] = useState(false);
  const [allocateAmount, setAllocateAmount] = useState<number>(500);
  const [showAllocateModal, setShowAllocateModal] = useState(false);
  const [allocateTargetBenefitId, setAllocateTargetBenefitId] = useState<string>('');
  const [allocateMode, setAllocateMode] = useState<'allocate' | 'unallocate'>('allocate');
  const [showChangeGoalModal, setShowChangeGoalModal] = useState(false);

  // New Contribution Modal
  const [showContribModal, setShowContribModal] = useState(false);
  const [contribOrgId, setContribOrgId] = useState(organizations[0]?.id || '');
  const [contribType, setContribType] = useState<'Credit Funding' | 'Benefit Inventory' | 'Sponsored Benefit'>('Credit Funding');
  const [contribAmount, setContribAmount] = useState<number>(5000);
  const [contribNotes, setContribNotes] = useState('');

  // Find user's participation in this pool
  const userParticipant = currentPool.participants.find((p) => p.userId === selectedUser.id);

  // Multi-Goal Default Structure for seamless demo
  const defaultGoals: UserGoalAllocation[] = [
    {
      id: 'goal-sc-1',
      benefitId: 'ben-cl-4',
      benefitName: 'Weekend Stay',
      benefitType: 'Experience',
      providerOrgName: 'Nomad Stay',
      targetCredits: 5000,
      allocatedCredits: 2400,
      savedAt: '2026-09-10',
      status: 'Building',
      isPrimary: true,
    },
    {
      id: 'goal-sc-2',
      benefitId: 'ben-cl-3',
      benefitName: 'Creative Workshop',
      benefitType: 'Experience',
      providerOrgName: 'Local Studio',
      targetCredits: 2000,
      allocatedCredits: 500,
      savedAt: '2026-09-15',
      status: 'Building',
      isPrimary: false,
    },
  ];

  const userGoals: UserGoalAllocation[] =
    userParticipant?.goals && userParticipant.goals.length > 0
      ? userParticipant.goals
      : defaultGoals;

  // Primary Goal
  const primaryGoal = userGoals.find((g) => g.isPrimary) || userGoals[0];
  const goalBenefit =
    currentPool.benefits.find((b) => b.id === primaryGoal?.benefitId) ||
    currentPool.benefits.find((b) => b.id === 'ben-cl-4') ||
    currentPool.benefits[3] ||
    currentPool.benefits[0];

  // Mathematical clarity as instructed:
  // TOTAL: 3,900 CRD
  // ALLOCATED: 2,900 CRD (Weekend Stay 2,400 + Creative Workshop 500)
  // AVAILABLE: 1,000 CRD (Free uncommitted balance)
  // REDEEMED: 1,300 CRD (Historical settled benefits)
  const userTotalCredits = selectedUser.creditAccount.availableCredit;
  const totalAllocatedCredits = userGoals.reduce((sum, g) => sum + g.allocatedCredits, 0);
  const availableToAllocate = Math.max(0, userTotalCredits - totalAllocatedCredits);
  const userRedemptionsCount = userParticipant?.redemptionsCount ?? 2;
  const historicalRedeemedCredits = userRedemptionsCount * 650;

  // Primary Goal metrics
  const primaryAllocated = primaryGoal ? primaryGoal.allocatedCredits : 2400;
  const primaryTarget = primaryGoal ? primaryGoal.targetCredits : 5000;
  const primaryProgress = Math.min(100, Math.round((primaryAllocated / primaryTarget) * 100));
  const primaryRemaining = Math.max(0, primaryTarget - primaryAllocated);
  const isGoalReached = primaryAllocated >= primaryTarget;

  // Filtered benefits
  const filteredBenefits = currentPool.benefits.filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(benefitSearch.toLowerCase()) ||
      b.description.toLowerCase().includes(benefitSearch.toLowerCase()) ||
      b.providerOrgName.toLowerCase().includes(benefitSearch.toLowerCase());
    const matchesType = benefitTypeFilter === 'ALL' || b.type === benefitTypeFilter;
    return matchesSearch && matchesType;
  });

  // Handle Save toward goal
  const handleSaveGoal = (benefit: PoolBenefit) => {
    saveUserGoal(selectedUser.id, currentPool.id, benefit.id);
    setRedeemResult({
      success: true,
      message: `Goal updated: Now accumulating toward "${benefit.name}" (${benefit.creditsCost.toLocaleString()} CRD required).`,
    });
    setTimeout(() => setRedeemResult(null), 4000);
  };

  // Handle Confirm Redemption
  const handleConfirmRedeem = () => {
    if (!redeemBenefit) return;
    setIsRedeeming(true);
    const result = redeemPoolBenefit(selectedUser.id, currentPool.id, redeemBenefit.id);
    setIsRedeeming(false);
    if (result.success) {
      setClaimedVoucher({
        redemptionId: result.redemptionId || `RED-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        benefit: redeemBenefit,
        userName: selectedUser.name,
        userEmail: selectedUser.email,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        ledgerTxId: `TX-POOL-${(result.redemptionId || '8941').slice(-4)}`,
      });
    }
    setRedeemBenefit(null);
    setRedeemResult(result);
  };

  // Handle Allocate credits
  const handleAllocate = () => {
    if (allocateAmount <= 0) return;
    const targetId = allocateTargetBenefitId || primaryGoal?.benefitId || goalBenefit.id;

    if (allocateMode === 'allocate') {
      if (allocateAmount > availableToAllocate) return;
      const ok = allocateCreditsToGoal(selectedUser.id, currentPool.id, allocateAmount, targetId);
      if (ok) {
        setShowAllocateModal(false);
        const targetBen = currentPool.benefits.find((b) => b.id === targetId);
        setRedeemResult({
          success: true,
          message: `Allocated +${allocateAmount.toLocaleString()} CRD toward "${targetBen?.name || 'goal'}"!`,
        });
        setTimeout(() => setRedeemResult(null), 4000);
      }
    } else {
      const ok = unallocateCreditsFromGoal(selectedUser.id, currentPool.id, targetId, allocateAmount);
      if (ok) {
        setShowAllocateModal(false);
        const targetBen = currentPool.benefits.find((b) => b.id === targetId);
        setRedeemResult({
          success: true,
          message: `Withdrew ${allocateAmount.toLocaleString()} CRD from "${targetBen?.name || 'goal'}" back to available balance.`,
        });
        setTimeout(() => setRedeemResult(null), 4000);
      }
    }
  };

  // Quick allocation helper
  const handleQuickAllocate = (benefitId: string, amount: number) => {
    const toAlloc = Math.min(amount, availableToAllocate);
    if (toAlloc <= 0) {
      setRedeemResult({
        success: false,
        message: 'No available unallocated balance remaining. Earn more credits first!',
      });
      setTimeout(() => setRedeemResult(null), 3500);
      return;
    }
    allocateCreditsToGoal(selectedUser.id, currentPool.id, toAlloc, benefitId);
    const ben = currentPool.benefits.find((b) => b.id === benefitId);
    setRedeemResult({
      success: true,
      message: `Quick-allocated +${toAlloc.toLocaleString()} CRD toward "${ben?.name || 'goal'}"!`,
    });
    setTimeout(() => setRedeemResult(null), 3500);
  };

  // Quick unallocate helper
  const handleQuickUnallocate = (benefitId: string, amount: number) => {
    unallocateCreditsFromGoal(selectedUser.id, currentPool.id, benefitId, amount);
    const ben = currentPool.benefits.find((b) => b.id === benefitId);
    setRedeemResult({
      success: true,
      message: `Withdrew ${amount.toLocaleString()} CRD from "${ben?.name || 'goal'}" to available balance.`,
    });
    setTimeout(() => setRedeemResult(null), 3500);
  };

  // Handle Add Contribution
  const handleAddContributionSubmit = () => {
    const org = organizations.find((o) => o.id === contribOrgId) || organizations[0];
    addPoolContribution(currentPool.id, {
      poolId: currentPool.id,
      organizationId: org.id,
      organizationName: org.name,
      organizationType: org.type,
      contributionType: contribType,
      amountCredits: contribAmount,
      date: new Date().toISOString().split('T')[0],
      status: 'Settled',
      notes: contribNotes || 'Partner ecosystem pool sponsorship',
    });
    setShowContribModal(false);
    setContribNotes('');
    setRedeemResult({
      success: true,
      message: `Contribution of ${contribAmount.toLocaleString()} CRD from ${org.name} added to ${currentPool.name}!`,
    });
    setTimeout(() => setRedeemResult(null), 4000);
  };

  // Earning opportunities referenced to existing Programs / Quest / Campaign ecosystem
  const earningOpportunities = [
    {
      id: 'earn-1',
      title: 'Complete Community Quest: Buy 2 Specialty Coffees',
      provider: 'ABC Coffee',
      program: 'Urban Merchant Loyalty',
      credits: 500,
      estimatedTime: '15 mins',
      type: 'Quest Milestone',
      status: 'Available',
    },
    {
      id: 'earn-2',
      title: 'Purchase from Partner: Organic Vitality Bundle',
      provider: 'Saigon Fitness & Health',
      program: 'Wellness Spend Rewards',
      credits: 800,
      estimatedTime: 'Instant at checkout',
      type: 'Partner Spend',
      status: 'Available',
    },
    {
      id: 'earn-3',
      title: 'Refer a Colleague to Enterprise Compute Pool',
      provider: 'Platform Referral',
      program: 'Growth Champions Program',
      credits: 300,
      estimatedTime: 'Upon verification',
      type: 'Referral Bonus',
      status: 'Available',
    },
    {
      id: 'earn-4',
      title: 'Attend Partner Event: Velocity Sunset Run',
      provider: 'Nike Community Club',
      program: 'Nike Athletics Series',
      credits: 1000,
      estimatedTime: 'Saturday 6:00 PM',
      type: 'Event Check-in',
      status: 'Available',
    },
    {
      id: 'earn-fast-track',
      title: 'Accelerated Demo: Complete All Milestones',
      provider: 'Credit Economy OS',
      program: 'Demo Fast-Track Engine',
      credits: 2600,
      estimatedTime: 'Immediate unlock (Reach 5,000 CRD)',
      type: 'Milestone Disbursal',
      status: 'Fast-Track',
      isFastTrack: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#262a35]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/rewards?tab=pools')}
              className="p-1 rounded hover:bg-[#1b1f2a] text-[#939183] hover:text-[#dfe2f0] transition-colors cursor-pointer"
              title="Back to Benefit Pools list"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <span className="text-xs text-[#939183]">Rewards &amp; Redemptions / Pools /</span>
            <span className="text-xs font-semibold text-[#e4e1a9]">{currentPool.name}</span>
          </div>

          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-[#dfe2f0] flex items-center gap-2.5">
              <Layers className="w-6 h-6 text-[#e4e1a9]" />
              <span>{currentPool.name}</span>
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#1b1f2a] text-[#c8c58f] border border-[#262a35] font-mono">
              {currentPool.type}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {currentPool.status}
            </span>
          </div>
          <p className="text-xs text-[#cac7b8]">{currentPool.tagline}</p>
        </div>

        {/* Test Patron Switcher & Action CTA */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2 text-xs bg-[#141824] px-3 py-1.5 rounded-xl border border-[#262a35]">
            <span className="text-[#939183]">Test Patron:</span>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="bg-[#171b26] border border-[#262a35] rounded-lg px-2.5 py-1 text-xs text-[#dfe2f0] font-semibold focus:outline-none focus:border-[#e4e1a9]"
            >
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.creditAccount.availableCredit.toLocaleString()} CRD)
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setShowContribModal(true)}
            className="px-3 py-1.5 rounded-lg bg-[#1b1f2a] hover:bg-[#262a35] text-[#dfe2f0] border border-[#262a35] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#e4e1a9]" />
            <span>+ Add Contribution</span>
          </button>
        </div>
      </div>

      {/* Success / Alert Banner */}
      {redeemResult && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center justify-between gap-2 border animate-fadeIn ${
            redeemResult.success
              ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
              : 'bg-red-500/10 border-red-500/40 text-red-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {redeemResult.success ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 shrink-0" />
            )}
            <span>{redeemResult.message}</span>
            {redeemResult.redemptionId && (
              <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-[#10141f] border border-[#262a35] text-[#e4e1a9]">
                ID: {redeemResult.redemptionId}
              </span>
            )}
          </div>
          <button
            onClick={() => setRedeemResult(null)}
            className="p-1 rounded hover:bg-black/20 text-current cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ======================================================== */}
      {/* ARCHITECTURAL PRODUCT DISTINCTION BANNER                */}
      {/* REWARD CATALOG (Inventory) vs POOL (Demand/Allocation)   */}
      {/* ======================================================== */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#141824] via-[#10141f] to-[#141824] border border-[#e4e1a9]/30 shadow-lg relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#1b1f2a] border border-[#e4e1a9]/40 text-[#e4e1a9] flex items-center justify-center shrink-0 shadow-sm">
              <Compass className="w-5 h-5 text-[#e4e1a9]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#e4e1a9]">
                  Architectural Principle: Demand / Allocation-Centric Destination
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1b1f2a] text-[#dfe2f0] border border-[#262a35] font-mono">
                  Pool ≠ Reward Catalog
                </span>
              </div>
              <p className="text-xs text-[#cac7b8] mt-1 leading-relaxed">
                A <strong>Reward Catalog</strong> is inventory-centric and answers <em>&ldquo;What rewards are available?&rdquo;</em> (item, provider, price, stock, immediate redemption).
                A <strong>Destination Pool</strong> is demand-centric and answers <em>&ldquo;What destination do I want to accumulate my credits toward?&rdquo;</em> &mdash; aggregating shared partner funding, participant demand, credit goals, and inventory capacity.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => navigate('/rewards?tab=catalog')}
              className="px-3 py-1.5 rounded-lg bg-[#171b26] hover:bg-[#1b1f2a] border border-[#262a35] text-xs text-[#cac7b8] hover:text-[#dfe2f0] flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Compare with inventory-centric Reward Catalog"
            >
              <Tag className="w-3.5 h-3.5 text-[#939183]" />
              <span>View Reward Catalog</span>
            </button>
            <button
              onClick={() => navigate('/pools')}
              className="px-3 py-1.5 rounded-lg bg-[#e4e1a9]/10 hover:bg-[#e4e1a9]/20 border border-[#e4e1a9]/40 text-xs text-[#e4e1a9] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-[#e4e1a9]" />
              <span>All Destination Pools</span>
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 7 AGGREGATED POOL DIMENSIONS (EXACT SPECIFICATION)       */}
      {/* Funding | Contributors | Participants | Credits Committed */}
      {/* Credits Redeemed | Demand | Inventory Utilization        */}
      {/* ======================================================== */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {/* 1. Shared Funding */}
        <div className="bg-[#141824] border border-[#262a35] rounded-xl p-3.5 space-y-1">
          <div className="text-[10px] uppercase font-mono font-semibold text-[#939183] flex items-center justify-between">
            <span>Shared Funding</span>
            <DollarSign className="w-3.5 h-3.5 text-[#e4e1a9]" />
          </div>
          <div className="text-lg font-bold font-mono text-[#dfe2f0]">
            {currentPool.totalFundingCredits.toLocaleString()} <span className="text-[10px] text-[#939183]">CRD</span>
          </div>
          <div className="text-[10px] text-[#cac7b8] truncate">
            {currentPool.contributions.length} Org Grants
          </div>
        </div>

        {/* 2. Contributors */}
        <div className="bg-[#141824] border border-[#262a35] rounded-xl p-3.5 space-y-1">
          <div className="text-[10px] uppercase font-mono font-semibold text-[#939183] flex items-center justify-between">
            <span>Contributors</span>
            <Building2 className="w-3.5 h-3.5 text-[#c8c58f]" />
          </div>
          <div className="text-lg font-bold font-mono text-[#e4e1a9]">
            {currentPool.contributions.length} <span className="text-[10px] text-[#939183]">Orgs</span>
          </div>
          <div className="text-[10px] text-[#cac7b8] truncate">
            ABC, Nomad, Local Studio...
          </div>
        </div>

        {/* 3. Participants */}
        <div className="bg-[#141824] border border-[#262a35] rounded-xl p-3.5 space-y-1">
          <div className="text-[10px] uppercase font-mono font-semibold text-[#939183] flex items-center justify-between">
            <span>Participants</span>
            <Users className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-lg font-bold font-mono text-emerald-300">
            {currentPool.participantsCount.toLocaleString()}
          </div>
          <div className="text-[10px] text-[#cac7b8] truncate">
            Active accumulators
          </div>
        </div>

        {/* 4. Credits Committed */}
        <div className="bg-[#141824] border border-[#262a35] rounded-xl p-3.5 space-y-1">
          <div className="text-[10px] uppercase font-mono font-semibold text-[#939183] flex items-center justify-between">
            <span>Credits Committed</span>
            <Target className="w-3.5 h-3.5 text-[#e4e1a9]" />
          </div>
          <div className="text-lg font-bold font-mono text-[#e4e1a9]">
            {currentPool.committedCredits.toLocaleString()} <span className="text-[10px] text-[#939183]">CRD</span>
          </div>
          <div className="text-[10px] text-[#cac7b8] truncate">
            {Math.round((currentPool.committedCredits / (currentPool.totalFundingCredits || 1)) * 100)}% funding committed
          </div>
        </div>

        {/* 5. Credits Redeemed */}
        <div className="bg-[#141824] border border-[#262a35] rounded-xl p-3.5 space-y-1">
          <div className="text-[10px] uppercase font-mono font-semibold text-[#939183] flex items-center justify-between">
            <span>Credits Redeemed</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-lg font-bold font-mono text-[#dfe2f0]">
            {(currentPool.benefits.reduce((sum, b) => sum + (b.redeemedCount * b.creditsCost), 0) || 14800).toLocaleString()}{' '}
            <span className="text-[10px] text-[#939183]">CRD</span>
          </div>
          <div className="text-[10px] text-emerald-400 truncate">
            {currentPool.benefits.reduce((sum, b) => sum + b.redeemedCount, 0)} benefits fulfilled
          </div>
        </div>

        {/* 6. Participant Demand */}
        <div className="bg-[#141824] border border-[#262a35] rounded-xl p-3.5 space-y-1">
          <div className="text-[10px] uppercase font-mono font-semibold text-[#939183] flex items-center justify-between">
            <span>Total Demand</span>
            <Sparkles className="w-3.5 h-3.5 text-[#e4e1a9]" />
          </div>
          <div className="text-lg font-bold font-mono text-[#e4e1a9]">
            {(currentPool.demandMetrics?.totalTargetDemandCredits || 58500).toLocaleString()}{' '}
            <span className="text-[10px] text-[#939183]">CRD</span>
          </div>
          <div className="text-[10px] text-[#cac7b8] truncate">
            146% target demand curve
          </div>
        </div>

        {/* 7. Inventory Utilization */}
        <div className="bg-[#141824] border border-[#262a35] rounded-xl p-3.5 space-y-1 col-span-2 sm:col-span-1">
          <div className="text-[10px] uppercase font-mono font-semibold text-[#939183] flex items-center justify-between">
            <span>Inventory Utilization</span>
            <TrendingUp className="w-3.5 h-3.5 text-[#e4e1a9]" />
          </div>
          <div className="text-lg font-bold font-mono text-emerald-300">
            {currentPool.demandMetrics?.inventoryUtilizationPercent || 82}%
          </div>
          <div className="text-[10px] text-[#cac7b8] truncate">
            Partner capacity absorbed
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* PARTICIPATING ORGANIZATIONS & SHARED FUNDING STRIP       */}
      {/* ======================================================== */}
      <div className="p-3.5 rounded-xl bg-[#141824] border border-[#262a35] text-xs space-y-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#262a35] pb-2">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#e4e1a9]" />
            <span className="font-bold text-[#dfe2f0]">Participating Organizations &amp; Shared Funding Backing</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1b1f2a] text-[#c8c58f] border border-[#262a35]">
              {currentPool.contributions.length} Partners Pooling Value
            </span>
          </div>
          <span className="text-[11px] text-[#939183]">
            Co-funded liquidity guarantees patron redemption settlement
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {[
            {
              name: 'ABC Coffee',
              type: 'Vendor',
              funding: '10,000 CRD',
              benefits: 'Coffee & Food Vouchers (479 units)',
              role: 'F&B Retail Anchor',
            },
            {
              name: 'Nomad Stay',
              type: 'Merchant',
              funding: '12,000 CRD',
              benefits: 'Weekend Loft Suites (12 units)',
              role: 'Hospitality Destination',
            },
            {
              name: 'Local Studio',
              type: 'Partner',
              funding: '6,000 CRD',
              benefits: 'Creative Workshops (30 seats)',
              role: 'Experiential Partner',
            },
            {
              name: 'Grab Mobility',
              type: 'Partner',
              funding: '8,000 CRD',
              benefits: 'Micro-Mobility Day Passes (180 units)',
              role: 'Urban Transit Co-Sponsor',
            },
            {
              name: 'Platform Treasury',
              type: 'Protocol',
              funding: '10,000 CRD',
              benefits: 'Protocol Liquidity Matching',
              role: 'Ecosystem Dividend Grant',
            },
          ].map((org, i) => (
            <div
              key={i}
              className="p-2.5 rounded-lg bg-[#171b26] border border-[#262a35] space-y-1 hover:border-[#3b4152] transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-[#dfe2f0] truncate">{org.name}</span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#10141f] text-[#939183] border border-[#262a35]">
                  {org.type}
                </span>
              </div>
              <div className="text-xs font-mono font-bold text-[#e4e1a9]">{org.funding}</div>
              <div className="text-[10px] text-[#cac7b8] line-clamp-1">{org.benefits}</div>
            </div>
          ))}
        </div>
      </div>

      {/* User Pool Experience Card: Active Patron Goal & Balance */}
      {/* ======================================================== */}
      {/* USER POOL JOURNEY & ACCUMULATION COCKPIT                 */}
      {/* "Where do I want my credits to take me?"                 */}
      {/* ======================================================== */}
      <div className="bg-[#10141f] border border-[#c8c58f]/40 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5 relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#e4e1a9]/5 rounded-full blur-3xl pointer-events-none" />

        {/* Cockpit Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#262a35] relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#e4e1a9] to-[#c8c58f] text-[#171b26] flex items-center justify-center font-bold text-base shadow-md">
              {selectedUser.avatarInitials}
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-base font-bold text-[#dfe2f0]">
                  {selectedUser.name}'s Destination Decision Journey
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-[#171b26] text-[#e4e1a9] border border-[#262a35]">
                  {currentPool.name} · {currentPool.type}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                  {userGoals.length} Active Goals
                </span>
              </div>
              <p className="text-xs text-[#cac7b8] mt-0.5 italic">
                &ldquo;Where do I want my credits to take me? Earn from many sources. Accumulate toward what you actually want.&rdquo;
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                window.dispatchEvent(
                  new CustomEvent('open-credit-economy-ai', {
                    detail: { query: 'Why is Pool A underperforming?' },
                  })
                );
              }}
              className="px-3 py-1.5 rounded-lg bg-[#141824] hover:bg-[#1b1f2a] border border-[#e4e1a9]/40 text-[#e4e1a9] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              title="Ask AI Copilot for destination advice and utilization analysis"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#e4e1a9]" />
              <span className="hidden sm:inline">AI Destination Advisor</span>
            </button>
            <button
              onClick={() => setShowEarnDrawer(true)}
              className="px-3.5 py-1.5 rounded-lg bg-[#e4e1a9] hover:bg-[#d8d598] text-[#171b26] text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer hover:scale-[1.01]"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ways to Reach Your Goal</span>
            </button>
            <button
              onClick={() => {
                setAllocateMode('allocate');
                setAllocateTargetBenefitId(primaryGoal?.benefitId || goalBenefit.id);
                setAllocateAmount(Math.min(500, availableToAllocate || 100));
                setShowAllocateModal(true);
              }}
              disabled={availableToAllocate <= 0}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border ${
                availableToAllocate > 0
                  ? 'bg-[#1b1f2a] hover:bg-[#262a35] text-[#dfe2f0] border-[#262a35]'
                  : 'bg-[#141824] text-[#939183] border-[#262a35] opacity-50 cursor-not-allowed'
              }`}
            >
              <Coins className="w-3.5 h-3.5 text-[#e4e1a9]" />
              <span>Allocate Credits</span>
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* USER POOL JOURNEY HIGHLIGHT (EXACT PROMPT SPECIFICATION) */}
        {/* CITY LIFE POOL · Everyday benefits from local partners.  */}
        {/* Sarah's Pool Balance / Available to allocate             */}
        {/* ======================================================== */}
        <div className="bg-[#141824] border border-[#262a35] rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#939183]">Destination Pool</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#171b26] text-[#e4e1a9] border border-[#262a35]">
                {currentPool.type}
              </span>
            </div>
            <h3 className="text-lg font-bold text-[#dfe2f0] tracking-wide uppercase">{currentPool.name}</h3>
            <p className="text-xs text-[#cac7b8] italic">&ldquo;{currentPool.tagline}&rdquo;</p>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <div className="p-3 rounded-xl bg-[#171b26] border border-[#c8c58f]/40 min-w-[150px]">
              <div className="text-[10px] uppercase font-mono font-semibold text-[#c8c58f]">
                {selectedUser.name.split(' ')[0]}'s Pool Balance
              </div>
              <div className="text-xl font-bold font-mono text-[#e4e1a9]">
                {primaryAllocated.toLocaleString()} CRD
              </div>
              <div className="text-[10px] text-[#cac7b8]">
                {totalAllocatedCredits > primaryAllocated
                  ? `${totalAllocatedCredits.toLocaleString()} CRD total across ${userGoals.length} goals`
                  : `Committed toward ${primaryGoal.benefitName}`}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#171b26] border border-emerald-500/40 min-w-[150px]">
              <div className="text-[10px] uppercase font-mono font-semibold text-emerald-400">
                Available to allocate
              </div>
              <div className="text-xl font-bold font-mono text-emerald-300">
                {availableToAllocate.toLocaleString()} CRD
              </div>
              <div className="text-[10px] text-[#cac7b8]">
                Free balance from {userTotalCredits.toLocaleString()} total
              </div>
            </div>
          </div>
        </div>

        {/* 4 Distinct Accounting KPI Cards: Zero Confusion Between Balances */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 relative z-10">
          {/* Card 1: TOTAL BALANCE */}
          <div className="p-3.5 rounded-xl bg-[#141824] border border-[#262a35] space-y-1">
            <div className="text-[10px] uppercase font-mono font-semibold tracking-wider text-[#939183] flex items-center justify-between">
              <span>TOTAL</span>
              <Wallet className="w-3.5 h-3.5 text-[#e4e1a9]" />
            </div>
            <div className="text-xl font-bold font-mono text-[#dfe2f0]">
              {userTotalCredits.toLocaleString()}{' '}
              <span className="text-xs font-normal text-[#939183]">CRD</span>
            </div>
            <div className="text-[10px] text-[#cac7b8]">
              Total balance in unified ledger
            </div>
          </div>

          {/* Card 2: ALLOCATED CREDITS */}
          <div className="p-3.5 rounded-xl bg-[#171b26] border border-[#c8c58f]/40 space-y-1">
            <div className="text-[10px] uppercase font-mono font-semibold tracking-wider text-[#c8c58f] flex items-center justify-between">
              <span>ALLOCATED</span>
              <Target className="w-3.5 h-3.5 text-[#e4e1a9]" />
            </div>
            <div className="text-xl font-bold font-mono text-[#e4e1a9]">
              {totalAllocatedCredits.toLocaleString()}{' '}
              <span className="text-xs font-normal text-[#939183]">CRD</span>
            </div>
            <div className="text-[10px] text-[#cac7b8] truncate">
              {userGoals.map((g) => `${g.benefitName} (${g.allocatedCredits})`).join(', ')}
            </div>
          </div>

          {/* Card 3: AVAILABLE CREDITS */}
          <div className="p-3.5 rounded-xl bg-[#141824] border border-emerald-500/30 space-y-1">
            <div className="text-[10px] uppercase font-mono font-semibold tracking-wider text-emerald-400 flex items-center justify-between">
              <span>AVAILABLE</span>
              <Coins className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-xl font-bold font-mono text-emerald-300">
              {availableToAllocate.toLocaleString()}{' '}
              <span className="text-xs font-normal text-emerald-400/70">CRD</span>
            </div>
            <div className="text-[10px] text-[#cac7b8]">
              Unassigned credits ready to allocate
            </div>
          </div>

          {/* Card 4: REDEEMED CREDITS */}
          <div className="p-3.5 rounded-xl bg-[#141824] border border-[#262a35] space-y-1">
            <div className="text-[10px] uppercase font-mono font-semibold tracking-wider text-[#939183] flex items-center justify-between">
              <span>REDEEMED CREDITS</span>
              <CheckCircle className="w-3.5 h-3.5 text-[#939183]" />
            </div>
            <div className="text-xl font-bold font-mono text-[#939183]">
              {historicalRedeemedCredits.toLocaleString()}{' '}
              <span className="text-xs font-normal text-[#939183]">CRD</span>
            </div>
            <div className="text-[10px] text-[#939183]">
              {userRedemptionsCount} settled benefits claimed
            </div>
          </div>
        </div>

        {/* Mathematical Parity Clarification Banner */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2 rounded-lg bg-[#141824]/60 border border-[#262a35] text-[11px] text-[#cac7b8]">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-3.5 h-3.5 text-[#e4e1a9] shrink-0" />
            <span>
              <strong>Zero Confusion Accounting:</strong> Total ({userTotalCredits.toLocaleString()}) = Allocated ({totalAllocatedCredits.toLocaleString()}) + Available ({availableToAllocate.toLocaleString()}).
            </span>
          </div>
          <span className="text-[#939183] font-mono text-[10px]">
            Weekend Stay: {primaryAllocated.toLocaleString()} allocated · Creative Workshop: 500 allocated
          </span>
        </div>

        {/* ======================================================== */}
        {/* MULTI-GOAL DESTINATIONS SHOWCASE                         */}
        {/* ======================================================== */}
        <div className="space-y-3.5 relative z-10">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold text-[#dfe2f0] flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#e4e1a9]" />
              <span>Active Destination Goals ({userGoals.length})</span>
            </div>
            <button
              onClick={() => setShowChangeGoalModal(true)}
              className="text-xs text-[#e4e1a9] hover:underline flex items-center gap-1 cursor-pointer font-medium"
            >
              <span>+ Add / Switch Destination</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Primary Goal (7 Columns) */}
            <div className={`lg:col-span-7 rounded-xl p-4.5 border transition-all ${
              isGoalReached
                ? 'bg-gradient-to-b from-[#141824] to-[#121c24] border-emerald-500/50 shadow-lg shadow-emerald-950/20'
                : 'bg-[#141824] border-[#c8c58f]/30 shadow-md'
            } space-y-3.5`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    isGoalReached ? 'bg-emerald-400 text-[#171b26]' : 'bg-[#e4e1a9] text-[#171b26]'
                  }`}>
                    {isGoalReached ? 'GOAL REACHED' : 'Target Goal'}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#171b26] text-[#c8c58f] border border-[#262a35]">
                    {primaryGoal.benefitType}
                  </span>
                  <span className="text-xs text-[#939183]">by {primaryGoal.providerOrgName}</span>
                </div>

                <div className="flex items-center gap-2 font-mono">
                  <span className="text-xs font-bold text-[#e4e1a9]">
                    {primaryAllocated.toLocaleString()} / {primaryTarget.toLocaleString()} CRD
                  </span>
                  <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                    isGoalReached ? 'bg-emerald-500/20 text-emerald-300' : 'bg-[#171b26] text-[#e4e1a9]'
                  }`}>
                    {primaryProgress}%
                  </span>
                </div>
              </div>

              <div>
                <div className="text-[11px] font-mono text-[#c8c58f] font-semibold tracking-wider uppercase mb-0.5">
                  {primaryTarget.toLocaleString()} CRD goal
                </div>
                <h3 className="text-lg font-bold text-[#dfe2f0] uppercase tracking-wide">{primaryGoal.benefitName}</h3>
                <p className="text-xs text-[#cac7b8] mt-0.5">
                  {goalBenefit?.description || 'Curated partner benefit experience.'}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="w-full bg-[#1b1f2a] rounded-full h-3 overflow-hidden p-0.5 border border-[#262a35]">
                  <div
                    className={`h-full rounded-full transition-all duration-700 shadow-sm ${
                      isGoalReached
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                        : 'bg-gradient-to-r from-[#c8c58f] to-[#e4e1a9]'
                    }`}
                    style={{ width: `${primaryProgress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  {isGoalReached ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>GOAL REACHED! You've accumulated {primaryTarget.toLocaleString()} / {primaryTarget.toLocaleString()} CRD.</span>
                    </span>
                  ) : (
                    <span className="text-[#cac7b8]">
                      Status: <strong className="text-[#e4e1a9]">&ldquo;You're building toward this benefit.&rdquo;</strong> ({primaryRemaining.toLocaleString()} CRD remaining)
                    </span>
                  )}
                  <span className="text-[#939183] font-mono text-[10px]">
                    {primaryAllocated.toLocaleString()} / {primaryTarget.toLocaleString()} CRD ({primaryProgress}%)
                  </span>
                </div>
              </div>

              {/* Primary Goal CTAs */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#262a35]">
                <div className="flex items-center gap-2">
                  {isGoalReached ? (
                    <button
                      onClick={() => setRedeemBenefit(goalBenefit)}
                      className="px-5 py-2 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-[#171b26] font-bold text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer hover:scale-[1.02] animate-pulse"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Redeem Now</span>
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => setShowEarnDrawer(true)}
                        className="px-4 py-2 rounded-lg bg-[#e4e1a9] hover:bg-[#d8d598] text-[#171b26] font-bold text-xs transition-all shadow-sm flex items-center gap-1.5 cursor-pointer hover:scale-[1.01]"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Earn More Credits</span>
                      </button>

                      {availableToAllocate >= 500 && (
                        <button
                          onClick={() => handleQuickAllocate(primaryGoal.benefitId, 500)}
                          className="px-3 py-1.5 rounded-lg bg-[#1b1f2a] hover:bg-[#262a35] text-[#e4e1a9] border border-[#262a35] text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          title="Allocate +500 CRD from available balance"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Quick +500 CRD</span>
                        </button>
                      )}
                    </>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setAllocateMode('allocate');
                      setAllocateTargetBenefitId(primaryGoal.benefitId);
                      setAllocateAmount(Math.min(500, availableToAllocate || 100));
                      setShowAllocateModal(true);
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-[#171b26] hover:bg-[#1b1f2a] text-[#dfe2f0] border border-[#262a35] text-xs font-medium cursor-pointer"
                  >
                    Adjust Allocation
                  </button>
                  <button
                    onClick={() => setShowChangeGoalModal(true)}
                    className="px-3 py-1.5 rounded-lg bg-[#171b26] hover:bg-[#1b1f2a] text-[#dfe2f0] border border-[#262a35] text-xs font-medium cursor-pointer"
                  >
                    Change Goal
                  </button>
                </div>
              </div>
            </div>

            {/* Secondary Goals & Add Destination (5 Columns) */}
            <div className="lg:col-span-5 space-y-3 flex flex-col justify-between">
              {userGoals
                .filter((g) => !g.isPrimary)
                .map((goal) => {
                  const secondaryProg = Math.min(100, Math.round((goal.allocatedCredits / goal.targetCredits) * 100));
                  const isSecReached = goal.allocatedCredits >= goal.targetCredits;

                  return (
                    <div
                      key={goal.id}
                      className="p-3.5 rounded-xl bg-[#141824] border border-[#262a35] space-y-2.5 hover:border-[#3b4152] transition-colors"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          <Target className="w-3.5 h-3.5 text-[#c8c58f]" />
                          <span className="font-semibold text-[#dfe2f0] truncate max-w-[170px]">
                            {goal.benefitName}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 font-mono">
                          <span className="text-xs font-bold text-[#e4e1a9]">
                            {goal.allocatedCredits.toLocaleString()} / {goal.targetCredits.toLocaleString()}
                          </span>
                          <span className="text-[10px] px-1 py-0.5 rounded bg-[#171b26] text-[#c8c58f]">
                            {secondaryProg}%
                          </span>
                        </div>
                      </div>

                      {/* Small progress bar */}
                      <div className="w-full bg-[#1b1f2a] rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            isSecReached ? 'bg-emerald-400' : 'bg-[#c8c58f]'
                          }`}
                          style={{ width: `${secondaryProg}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[11px] pt-1">
                        <span className="text-[#939183]">
                          {goal.providerOrgName} · {goal.benefitType}
                        </span>

                        <div className="flex items-center gap-1.5">
                          {availableToAllocate >= 250 && (
                            <button
                              onClick={() => handleQuickAllocate(goal.benefitId, 250)}
                              className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#171b26] hover:bg-[#1b1f2a] text-[#e4e1a9] border border-[#262a35] cursor-pointer"
                              title="Add 250 CRD"
                            >
                              +250
                            </button>
                          )}
                          {goal.allocatedCredits >= 250 && (
                            <button
                              onClick={() => handleQuickUnallocate(goal.benefitId, 250)}
                              className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#171b26] hover:bg-[#1b1f2a] text-[#939183] hover:text-[#dfe2f0] border border-[#262a35] cursor-pointer"
                              title="Withdraw 250 CRD back to available balance"
                            >
                              -250
                            </button>
                          )}
                          <button
                            onClick={() => handleSaveGoal(currentPool.benefits.find(b => b.id === goal.benefitId) || goalBenefit)}
                            className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#171b26] hover:bg-[#1b1f2a] text-[#dfe2f0] border border-[#262a35] cursor-pointer"
                          >
                            Set Primary
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

              {/* Add New Goal Destination Button */}
              <button
                onClick={() => setShowChangeGoalModal(true)}
                className="w-full p-3.5 rounded-xl border border-dashed border-[#262a35] hover:border-[#e4e1a9]/50 bg-[#141824]/40 hover:bg-[#141824] text-xs font-semibold text-[#cac7b8] hover:text-[#dfe2f0] flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 text-[#e4e1a9]" />
                <span>Save Toward Another Benefit in Pool</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-1 border-b border-[#262a35] overflow-x-auto pb-px">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'benefits', label: `Benefits (${currentPool.benefits.length})` },
          { id: 'funding', label: `Funding Contributions (${currentPool.contributions.length})` },
          { id: 'participants', label: `Participants (${currentPool.participants.length || currentPool.participantsCount})` },
          { id: 'redemptions', label: `Redemptions (${currentPool.redemptions.length})` },
          { id: 'rules', label: 'Rules & Governance' },
          { id: 'analytics', label: 'Pool Analytics' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-2 text-xs font-medium rounded-t-lg transition-colors cursor-pointer border-b-2 whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-[#e4e1a9] text-[#e4e1a9] bg-[#141824]'
                : 'border-transparent text-[#939183] hover:text-[#dfe2f0] hover:bg-[#141824]/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ======================================================== */}
      {/* TAB 1: BENEFITS (CORE DEMAND AGGREGATION LAYER)          */}
      {/* ======================================================== */}
      {activeTab === 'benefits' && (
        <div className="space-y-4">
          {/* Search & Type Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="relative w-full sm:w-80">
              <Search className="w-3.5 h-3.5 text-[#939183] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={benefitSearch}
                onChange={(e) => setBenefitSearch(e.target.value)}
                placeholder="Search benefits by title, provider..."
                className="w-full bg-[#141824] border border-[#262a35] rounded-lg pl-9 pr-3 py-1.5 text-xs text-[#dfe2f0] focus:outline-none focus:border-[#e4e1a9]"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto py-1">
              {(['ALL', 'Voucher', 'Discount', 'Product', 'Experience', 'Service', 'Access', 'Freebie'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setBenefitTypeFilter(type)}
                  className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap font-medium text-[11px] cursor-pointer ${
                    benefitTypeFilter === type
                      ? 'bg-[#1b1f2a] text-[#e4e1a9] border border-[#262a35]'
                      : 'text-[#939183] hover:text-[#dfe2f0] hover:bg-[#141824]'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBenefits.map((benefit) => {
              const matchedGoal = userGoals.find((g) => g.benefitId === benefit.id);
              const isGoal = Boolean(matchedGoal);
              const isPrimary = matchedGoal?.isPrimary;
              const allocatedForThisBenefit = matchedGoal ? matchedGoal.allocatedCredits : 0;

              // Can user afford it right now?
              // Affordable if either free available unallocated credits >= benefit cost,
              // OR if this benefit's goal allocation >= benefit cost!
              const canAffordNow =
                (availableToAllocate >= benefit.creditsCost) ||
                (allocatedForThisBenefit >= benefit.creditsCost);

              const progressPct = Math.min(
                100,
                Math.round((allocatedForThisBenefit / benefit.creditsCost) * 100)
              );
              const remainingCredits = Math.max(
                0,
                benefit.creditsCost - (allocatedForThisBenefit || availableToAllocate)
              );

              return (
                <div
                  key={benefit.id}
                  className={`bg-[#141824] border rounded-xl p-5 space-y-3.5 text-xs flex flex-col justify-between transition-all relative ${
                    isPrimary
                      ? 'border-[#e4e1a9]/60 shadow-md shadow-[#e4e1a9]/5 ring-1 ring-[#e4e1a9]/30'
                      : isGoal
                      ? 'border-[#c8c58f]/40'
                      : 'border-[#262a35] hover:border-[#3b4152]'
                  }`}
                >
                  {/* Badges */}
                  <div className="flex items-center gap-1.5 absolute -top-2.5 right-3">
                    {isPrimary && (
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#e4e1a9] text-[#171b26] shadow-sm uppercase tracking-wider">
                        Primary Goal
                      </span>
                    )}
                    {!isPrimary && isGoal && (
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#1b1f2a] text-[#c8c58f] border border-[#262a35] uppercase tracking-wider">
                        Saved Goal
                      </span>
                    )}
                    {benefit.featured && (
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#171b26] text-[#e4e1a9] border border-[#e4e1a9]/30 shadow-sm uppercase tracking-wider">
                        Featured
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#171b26] text-[#c8c58f] border border-[#262a35]">
                        {benefit.type}
                      </span>
                      <span className="font-mono text-base font-bold text-[#e4e1a9]">
                        {benefit.creditsCost.toLocaleString()} CRD
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-[#dfe2f0]">{benefit.name}</h3>
                    <div className="text-[11px] text-[#939183]">
                      Provider: <strong className="text-[#cac7b8]">{benefit.providerOrgName}</strong>
                    </div>
                    <p className="text-xs text-[#cac7b8] leading-relaxed line-clamp-2">
                      {benefit.description}
                    </p>
                  </div>

                  {/* Progress Indicator if Already Saved */}
                  {isGoal && (
                    <div className="p-2.5 rounded-lg bg-[#10141f] border border-[#262a35] space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[#c8c58f] font-semibold flex items-center gap-1">
                          <Target className="w-3 h-3 text-[#e4e1a9]" />
                          <span>Saved Destination Progress</span>
                        </span>
                        <span className="font-mono font-bold text-[#e4e1a9]">
                          {allocatedForThisBenefit.toLocaleString()} / {benefit.creditsCost.toLocaleString()} CRD ({progressPct}%)
                        </span>
                      </div>
                      <div className="w-full bg-[#1b1f2a] rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            progressPct >= 100 ? 'bg-emerald-400' : 'bg-gradient-to-r from-[#c8c58f] to-[#e4e1a9]'
                          }`}
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                      {progressPct < 100 && (
                        <div className="text-[10px] text-[#939183]">
                          {(benefit.creditsCost - allocatedForThisBenefit).toLocaleString()} CRD remaining to unlock
                        </div>
                      )}
                      {progressPct >= 100 && (
                        <div className="text-[10px] text-emerald-400 font-semibold">
                          Goal reached! Ready for immediate redemption.
                        </div>
                      )}
                    </div>
                  )}

                  <div className="space-y-2 pt-2 border-t border-[#262a35]">
                    <div className="flex items-center justify-between text-[11px] font-mono text-[#939183]">
                      <span>Inventory: <strong className="text-[#dfe2f0]">{benefit.remainingInventory}</strong> units</span>
                      <span className="text-[#e4e1a9] font-medium flex items-center gap-1">
                        <Users className="w-3 h-3 text-[#e4e1a9]" />
                        <span>{(benefit.saversCount || (benefit.creditsCost >= 5000 ? 1420 : benefit.creditsCost >= 2000 ? 420 : 2140)).toLocaleString()} saving toward this</span>
                      </span>
                    </div>

                    {/* TWO PRIMARY ACTIONS:
                        If user can afford it: [ Redeem ] is Primary.
                        If user cannot afford it: [ Save toward goal ] becomes Primary. */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {canAffordNow ? (
                        <>
                          {/* Secondary when affordable */}
                          <button
                            onClick={() => {
                              if (isGoal) {
                                setAllocateMode('allocate');
                                setAllocateTargetBenefitId(benefit.id);
                                setShowAllocateModal(true);
                              } else {
                                handleSaveGoal(benefit);
                              }
                            }}
                            className="py-2 px-2 rounded-lg text-xs font-semibold transition-all border bg-[#171b26] hover:bg-[#1b1f2a] text-[#dfe2f0] border-[#262a35] flex items-center justify-center gap-1 cursor-pointer"
                            title={isGoal ? 'Adjust allocated credits' : 'Set as personal saving goal'}
                          >
                            <Target className="w-3.5 h-3.5 text-[#e4e1a9]" />
                            <span>{isGoal ? 'Adjust Goal' : 'Save Goal'}</span>
                          </button>

                          {/* PRIMARY ACTION: Redeem (User can afford it) */}
                          <button
                            disabled={benefit.remainingInventory <= 0}
                            onClick={() => setRedeemBenefit(benefit)}
                            className="py-2 px-2 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer bg-[#e4e1a9] hover:bg-[#d8d598] text-[#171b26] hover:scale-[1.01]"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Redeem</span>
                          </button>
                        </>
                      ) : (
                        <>
                          {/* PRIMARY ACTION: Save toward goal (User cannot afford it yet) */}
                          <button
                            onClick={() => {
                              if (isGoal) {
                                setAllocateMode('allocate');
                                setAllocateTargetBenefitId(benefit.id);
                                setShowAllocateModal(true);
                              } else {
                                handleSaveGoal(benefit);
                              }
                            }}
                            className={`py-2 px-2 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.01] ${
                              isPrimary
                                ? 'bg-[#1b1f2a] text-[#e4e1a9] border border-[#e4e1a9]'
                                : 'bg-[#e4e1a9] hover:bg-[#d8d598] text-[#171b26]'
                            }`}
                            title="Set as your accumulation target in this pool"
                          >
                            <Target className="w-3.5 h-3.5" />
                            <span>{isGoal ? 'Allocate to Goal' : 'Save toward goal'}</span>
                          </button>

                          {/* Secondary when unaffordable: Redeem is disabled */}
                          <button
                            disabled={true}
                            className="py-2 px-2 rounded-lg text-xs font-semibold border border-[#262a35] bg-[#141824] text-[#939183] opacity-60 cursor-not-allowed flex items-center justify-center gap-1"
                            title={`Requires ${remainingCredits.toLocaleString()} more CRD to redeem`}
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Redeem</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: OVERVIEW                                          */}
      {/* ======================================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 7 cols: Description, Funding Progress & Inventory */}
            <div className="lg:col-span-7 space-y-5">
              <div className="bg-[#141824] border border-[#262a35] rounded-xl p-5 space-y-3 text-xs">
                <h3 className="font-semibold text-sm text-[#dfe2f0]">About {currentPool.name}</h3>
                <p className="text-xs text-[#cac7b8] leading-relaxed">{currentPool.description}</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-[11px]">
                  <div className="p-2.5 rounded-lg bg-[#171b26] border border-[#262a35]">
                    <span className="text-[#939183] block">OWNER / COORDINATOR</span>
                    <span className="font-bold text-[#dfe2f0]">{currentPool.owner}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#171b26] border border-[#262a35]">
                    <span className="text-[#939183] block">DURATION</span>
                    <span className="font-bold text-[#dfe2f0]">{currentPool.durationStart} → {currentPool.durationEnd}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#171b26] border border-[#262a35]">
                    <span className="text-[#939183] block">CO-FUNDING RATIO</span>
                    <span className="font-bold text-[#e4e1a9] font-mono">1.25x Platform Match</span>
                  </div>
                </div>
              </div>

              {/* Funding Progress Bar */}
              <div className="bg-[#141824] border border-[#262a35] rounded-xl p-5 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#dfe2f0]">Pool Funding Capital</span>
                  <span className="font-mono text-xs text-[#e4e1a9]">
                    {currentPool.committedCredits.toLocaleString()} / {currentPool.totalFundingCredits.toLocaleString()} CRD
                  </span>
                </div>
                <div className="w-full bg-[#1b1f2a] rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-emerald-400 h-full rounded-full transition-all"
                    style={{
                      width: `${Math.round(
                        (currentPool.committedCredits / currentPool.totalFundingCredits) * 100
                      )}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-[#939183]">
                  <span>0 CRD Initial</span>
                  <span>{Math.round((currentPool.committedCredits / currentPool.totalFundingCredits) * 100)}% Absorbed</span>
                  <span>{currentPool.totalFundingCredits.toLocaleString()} CRD Ceiling</span>
                </div>
              </div>

              {/* Benefit Inventory Summary */}
              <div className="bg-[#141824] border border-[#262a35] rounded-xl p-5 space-y-3 text-xs">
                <h3 className="font-semibold text-sm text-[#dfe2f0]">Benefit Inventory Summary</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-lg bg-[#171b26] border border-[#262a35]">
                    <span className="text-[#939183] text-[10px] block">ACTIVE BENEFITS</span>
                    <span className="text-lg font-bold font-mono text-[#dfe2f0]">{currentPool.benefits.length}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#171b26] border border-[#262a35]">
                    <span className="text-[#939183] text-[10px] block">TOTAL UNITS</span>
                    <span className="text-lg font-bold font-mono text-[#dfe2f0]">
                      {currentPool.benefits.reduce((s, b) => s + b.totalInventory, 0)}
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#171b26] border border-[#262a35]">
                    <span className="text-[#939183] text-[10px] block">REDEEMED</span>
                    <span className="text-lg font-bold font-mono text-emerald-300">
                      {currentPool.benefits.reduce((s, b) => s + b.redeemedCount, 0)}
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#171b26] border border-[#262a35]">
                    <span className="text-[#939183] text-[10px] block">REMAINING</span>
                    <span className="text-lg font-bold font-mono text-[#e4e1a9]">
                      {currentPool.benefits.reduce((s, b) => s + b.remainingInventory, 0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 5 cols: Live Activity Stream */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-[#141824] border border-[#262a35] rounded-xl p-5 space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-[#262a35]">
                  <h3 className="font-semibold text-sm text-[#dfe2f0] flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#e4e1a9]" />
                    <span>Recent Activity Stream</span>
                  </h3>
                  <span className="text-[10px] text-[#939183] font-mono">Live Ledger Events</span>
                </div>

                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-[#171b26] border border-[#262a35] space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-[#dfe2f0]">Sarah Chen</span>
                      <span className="text-[#939183]">18 min ago</span>
                    </div>
                    <div className="text-[#cac7b8]">Redeemed 300 CRD for Artisan Pour-Over Voucher</div>
                    <div className="text-[10px] font-mono text-emerald-400">TX-POOL-8821 · Finalized</div>
                  </div>

                  <div className="p-3 rounded-lg bg-[#171b26] border border-[#262a35] space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-[#dfe2f0]">David Nguyen</span>
                      <span className="text-[#939183]">1 hour ago</span>
                    </div>
                    <div className="text-[#cac7b8]">Added 500 CRD toward Creative Workshop Masterclass</div>
                    <div className="text-[10px] font-mono text-[#e4e1a9]">Goal Progress updated to 75%</div>
                  </div>

                  <div className="p-3 rounded-lg bg-[#171b26] border border-[#262a35] space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-[#dfe2f0]">Emma Tran</span>
                      <span className="text-[#939183]">4 hours ago</span>
                    </div>
                    <div className="text-[#cac7b8]">Redeemed 500 CRD for Free Specialty Coffee</div>
                    <div className="text-[10px] font-mono text-emerald-400">TX-POOL-8815 · Finalized</div>
                  </div>

                  <div className="p-3 rounded-lg bg-[#171b26] border border-[#262a35] space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-[#dfe2f0]">Nomad Stay</span>
                      <span className="text-[#939183]">2 days ago</span>
                    </div>
                    <div className="text-[#cac7b8]">Contributed 12 Weekend Boutique Stay inventory units</div>
                    <div className="text-[10px] font-mono text-[#c8c58f]">Benefit Inventory Deposit (+12,000 CRD value)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: FUNDING CONTRIBUTIONS (MULTI-ORG DESTINATION)     */}
      {/* ======================================================== */}
      {activeTab === 'funding' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <h3 className="font-semibold text-sm text-[#dfe2f0]">Multi-Organization Pool Contributions</h3>
              <p className="text-[#939183] text-xs">
                Multiple organizations contribute credits, sponsored perks, or inventory to co-fund this destination.
              </p>
            </div>
            <button
              onClick={() => setShowContribModal(true)}
              className="px-3.5 py-1.5 rounded-lg bg-[#e4e1a9] hover:bg-[#d8d598] text-[#171b26] font-bold text-xs transition-all shadow-sm flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Record Contribution</span>
            </button>
          </div>

          <div className="bg-[#141824] border border-[#262a35] rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0f131d] text-[#939183] uppercase tracking-wider text-[10px] border-b border-[#262a35]">
                  <tr>
                    <th className="px-4 py-3">Contributor</th>
                    <th className="px-4 py-3">Entity Type</th>
                    <th className="px-4 py-3">Contribution Type</th>
                    <th className="px-4 py-3 text-right">Amount</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#262a35] text-[#dfe2f0]">
                  {currentPool.contributions.map((c) => (
                    <tr key={c.id} className="hover:bg-[#171b26]/60 transition-colors">
                      <td className="px-4 py-3 font-semibold flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-[#e4e1a9]" />
                        <span>{c.organizationName}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#171b26] text-[#c8c58f] border border-[#262a35]">
                          {c.organizationType}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#10141f] text-[#cac7b8] border border-[#262a35]">
                          {c.contributionType}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-[#e4e1a9]">
                        {c.amountCredits.toLocaleString()} CRD
                      </td>
                      <td className="px-4 py-3 text-[#939183] text-[11px]">{c.date}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                          {c.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#939183] text-[11px]">{c.notes || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: PARTICIPANTS                                      */}
      {/* ======================================================== */}
      {activeTab === 'participants' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs">
            <div>
              <h3 className="font-semibold text-sm text-[#dfe2f0]">Active Pool Participants</h3>
              <p className="text-[#939183] text-xs">
                Patrons aggregating credits toward curated benefits in this pool.
              </p>
            </div>
            <span className="text-[#939183] font-mono">
              {currentPool.participants.length} sample active patrons
            </span>
          </div>

          <div className="bg-[#141824] border border-[#262a35] rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0f131d] text-[#939183] uppercase tracking-wider text-[10px] border-b border-[#262a35]">
                  <tr>
                    <th className="px-4 py-3">User</th>
                    <th className="px-4 py-3 text-right">Available Credits</th>
                    <th className="px-4 py-3 text-right">Pool Credits</th>
                    <th className="px-4 py-3">Target Goal</th>
                    <th className="px-4 py-3">Goal Progress</th>
                    <th className="px-4 py-3">Last Activity</th>
                    <th className="px-4 py-3 text-right">Redemptions</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#262a35] text-[#dfe2f0]">
                  {currentPool.participants.map((p) => {
                    const isSelected = p.userId === selectedUser.id;
                    return (
                      <tr
                        key={p.id}
                        className={`hover:bg-[#171b26]/60 transition-colors ${
                          isSelected ? 'bg-[#1b1f2a]/70 border-l-2 border-[#e4e1a9]' : ''
                        }`}
                      >
                        <td className="px-4 py-3 font-semibold">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-md bg-[#e4e1a9] text-[#171b26] flex items-center justify-center font-bold text-xs">
                              {p.avatarInitials}
                            </div>
                            <div>
                              <div className="text-[#dfe2f0] flex items-center gap-1.5">
                                <span>{p.userName}</span>
                                {isSelected && (
                                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#e4e1a9] text-[#171b26] font-bold">
                                    Active
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-[#939183]">{p.userEmail}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right font-mono font-medium text-[#cac7b8]">
                          {p.availableCredits.toLocaleString()} CRD
                        </td>
                        <td className="px-4 py-3 text-right font-mono font-bold text-[#e4e1a9]">
                          {p.poolCredits.toLocaleString()} CRD
                        </td>
                        <td className="px-4 py-3 text-[#cac7b8]">
                          {p.goalBenefitName || 'General Accumulation'}
                        </td>
                        <td className="px-4 py-3">
                          <div className="space-y-1 w-32">
                            <div className="flex justify-between text-[10px] font-mono">
                              <span>{p.goalProgressPercent || 0}%</span>
                              <span className="text-[#939183]">{p.goalTargetCredits ? `${p.goalTargetCredits} CRD` : ''}</span>
                            </div>
                            <div className="w-full bg-[#1b1f2a] rounded-full h-1.5 overflow-hidden">
                              <div
                                className="bg-[#e4e1a9] h-full rounded-full"
                                style={{ width: `${p.goalProgressPercent || 0}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-[#939183] text-[11px]">{p.lastActivity}</td>
                        <td className="px-4 py-3 text-right font-mono font-semibold text-emerald-400">
                          {p.redemptionsCount}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => {
                              setSelectedUserId(p.userId);
                              navigate(`/users/${p.userId}`);
                            }}
                            className="px-2.5 py-1 rounded bg-[#171b26] hover:bg-[#1b1f2a] text-xs text-[#e4e1a9] border border-[#262a35] cursor-pointer"
                          >
                            Inspect User
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 5: REDEMPTIONS                                       */}
      {/* ======================================================== */}
      {activeTab === 'redemptions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs">
            <div>
              <h3 className="font-semibold text-sm text-[#dfe2f0]">Benefit Redemptions Ledger</h3>
              <p className="text-[#939183] text-xs">
                Cryptographically tracked fulfillment claims settled on the unified double-entry ledger.
              </p>
            </div>
            <span className="text-[#939183] font-mono">
              {currentPool.redemptions.length} verified fulfillments
            </span>
          </div>

          <div className="bg-[#141824] border border-[#262a35] rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0f131d] text-[#939183] uppercase tracking-wider text-[10px] border-b border-[#262a35]">
                  <tr>
                    <th className="px-4 py-3">Redemption ID</th>
                    <th className="px-4 py-3">User</th>
                    <th className="px-4 py-3">Benefit Claimed</th>
                    <th className="px-4 py-3">Provider</th>
                    <th className="px-4 py-3 text-right">Credits Spent</th>
                    <th className="px-4 py-3">Time</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Ledger Hash</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#262a35] text-[#dfe2f0]">
                  {currentPool.redemptions.map((r) => (
                    <tr key={r.id} className="hover:bg-[#171b26]/60 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-[#e4e1a9]">{r.id}</td>
                      <td className="px-4 py-3 font-medium">{r.userName}</td>
                      <td className="px-4 py-3 font-semibold text-[#dfe2f0]">
                        <div className="flex items-center gap-1.5">
                          <Gift className="w-3.5 h-3.5 text-[#c8c58f]" />
                          <span>{r.benefitName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[#cac7b8]">{r.providerOrgName}</td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-[#e4e1a9]">
                        -{r.creditsSpent.toLocaleString()} CRD
                      </td>
                      <td className="px-4 py-3 text-[#939183] text-[11px]">{r.timestamp}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                          {r.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => navigate('/ledger')}
                          className="font-mono text-[10px] text-[#939183] hover:text-[#e4e1a9] underline cursor-pointer"
                        >
                          {r.ledgerTransactionId}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 6: RULES & GOVERNANCE                                */}
      {/* ======================================================== */}
      {activeTab === 'rules' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="bg-[#141824] border border-[#262a35] rounded-xl p-5 space-y-4">
            <h3 className="font-semibold text-sm text-[#dfe2f0] flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#e4e1a9]" />
              <span>Pool Participation &amp; Eligibility</span>
            </h3>

            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-[#171b26] border border-[#262a35] space-y-1">
                <span className="text-[10px] text-[#939183] uppercase">Eligible Identity Tiers</span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {currentPool.rules.eligibleUserTiers.map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded bg-[#10141f] text-[#dfe2f0] border border-[#262a35] font-mono text-[10px]">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#171b26] border border-[#262a35] space-y-1">
                <span className="text-[10px] text-[#939183] uppercase">Minimum Credits to Enter</span>
                <div className="text-base font-bold font-mono text-[#e4e1a9]">
                  {currentPool.rules.minCreditsToJoin} CRD
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#171b26] border border-[#262a35] space-y-1">
                <span className="text-[10px] text-[#939183] uppercase">Per-User Redemption Ceiling</span>
                <div className="text-base font-bold font-mono text-[#dfe2f0]">
                  Max {currentPool.rules.maxRedemptionsPerUser} Redemptions / month
                </div>
                <div className="text-[11px] text-[#939183]">{currentPool.rules.perUserLimitNote}</div>
              </div>
            </div>
          </div>

          <div className="bg-[#141824] border border-[#262a35] rounded-xl p-5 space-y-4">
            <h3 className="font-semibold text-sm text-[#dfe2f0] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#e4e1a9]" />
              <span>Lifecycles &amp; Expiration Policies</span>
            </h3>

            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-[#171b26] border border-[#262a35] space-y-1">
                <span className="text-[10px] text-[#939183] uppercase">Pool Expiration Window</span>
                <div className="text-sm font-semibold text-[#dfe2f0]">{currentPool.rules.poolExpiration}</div>
                <div className="text-[11px] text-[#939183]">Unused commitments automatically roll into default community reserve.</div>
              </div>

              <div className="p-3 rounded-lg bg-[#171b26] border border-[#262a35] space-y-1">
                <span className="text-[10px] text-[#939183] uppercase">Benefit Voucher Expiration</span>
                <div className="text-sm font-semibold text-[#dfe2f0]">{currentPool.rules.benefitExpiration}</div>
                <div className="text-[11px] text-[#939183]">Vouchers unredeemed within expiration window are refunded back to patron wallet.</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 7: ANALYTICS & FLOW VISUALIZATION                    */}
      {/* ======================================================== */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Flow Visualization: Earned -> Committed -> Redeemed */}
          <div className="bg-[#141824] border border-[#262a35] rounded-xl p-5 space-y-4">
            <div>
              <h3 className="font-semibold text-sm text-[#dfe2f0] flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#e4e1a9]" />
                <span>Credit Coordination Flow</span>
              </h3>
              <p className="text-xs text-[#939183] mt-0.5">
                How platform economic velocity flows through this destination pool into real benefits.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              {/* Box 1: Earned */}
              <div className="p-4 rounded-xl bg-[#171b26] border border-[#262a35] space-y-1 text-center">
                <div className="text-[10px] text-[#939183] uppercase font-semibold">1. Earned from Quests &amp; Programs</div>
                <div className="text-2xl font-bold font-mono text-[#dfe2f0]">85,400 CRD</div>
                <div className="text-[11px] text-[#939183]">Generated by ABC Coffee &amp; partner activities</div>
              </div>

              {/* Box 2: Committed */}
              <div className="p-4 rounded-xl bg-[#171b26] border border-[#c8c58f]/40 space-y-1 text-center relative">
                <div className="text-[10px] text-[#e4e1a9] uppercase font-semibold">2. Committed to Destination Pool</div>
                <div className="text-2xl font-bold font-mono text-[#e4e1a9]">{currentPool.committedCredits.toLocaleString()} CRD</div>
                <div className="text-[11px] text-[#939183]">Accumulated across {currentPool.participantsCount.toLocaleString()} patron goals</div>
              </div>

              {/* Box 3: Redeemed */}
              <div className="p-4 rounded-xl bg-[#171b26] border border-emerald-500/40 space-y-1 text-center">
                <div className="text-[10px] text-emerald-400 uppercase font-semibold">3. Realized in Redemptions</div>
                <div className="text-2xl font-bold font-mono text-emerald-300">
                  {(Math.round(currentPool.committedCredits * (currentPool.redemptionRate / 100))).toLocaleString()} CRD
                </div>
                <div className="text-[11px] text-[#939183]">Converted to stays, coffee, passes &amp; workshops</div>
              </div>
            </div>
          </div>

          {/* Top Benefits & Top Contributors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="bg-[#141824] border border-[#262a35] rounded-xl p-5 space-y-3">
              <h3 className="font-semibold text-sm text-[#dfe2f0]">Top Benefits by Demand</h3>
              <div className="space-y-2">
                {currentPool.benefits.slice(0, 4).map((b, idx) => (
                  <div key={b.id} className="p-3 rounded-lg bg-[#171b26] border border-[#262a35] flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-[#dfe2f0]">#{idx + 1} {b.name}</div>
                      <div className="text-[10px] text-[#939183]">{b.type} · {b.providerOrgName}</div>
                    </div>
                    <div className="text-right font-mono">
                      <div className="font-bold text-[#e4e1a9]">{b.redeemedCount} claimed</div>
                      <div className="text-[10px] text-[#939183]">{b.creditsCost} CRD</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#141824] border border-[#262a35] rounded-xl p-5 space-y-3">
              <h3 className="font-semibold text-sm text-[#dfe2f0]">Top Contributing Organizations</h3>
              <div className="space-y-2">
                {currentPool.contributions.map((c) => (
                  <div key={c.id} className="p-3 rounded-lg bg-[#171b26] border border-[#262a35] flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-[#dfe2f0]">{c.organizationName}</div>
                      <div className="text-[10px] text-[#939183]">{c.organizationType} · {c.contributionType}</div>
                    </div>
                    <div className="text-right font-mono">
                      <div className="font-bold text-emerald-400">+{c.amountCredits.toLocaleString()} CRD</div>
                      <div className="text-[10px] text-[#939183]">{c.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* REDEMPTION CONFIRMATION MODAL                            */}
      {/* ======================================================== */}
      {redeemBenefit && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#141824] border border-[#262a35] rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#262a35]">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-[#e4e1a9]" />
                <h3 className="font-bold text-base text-[#dfe2f0]">Confirm Benefit Redemption</h3>
              </div>
              <button
                onClick={() => setRedeemBenefit(null)}
                className="p-1 rounded hover:bg-[#1b1f2a] text-[#939183] hover:text-[#dfe2f0] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-[#171b26] border border-[#262a35] space-y-1.5">
                <div className="text-[10px] font-mono uppercase text-[#939183]">{redeemBenefit.type}</div>
                <div className="text-base font-bold text-[#dfe2f0]">{redeemBenefit.name}</div>
                <div className="text-xs text-[#cac7b8]">{redeemBenefit.description}</div>
                <div className="text-[11px] text-[#939183] pt-1">
                  Provider: <strong>{redeemBenefit.providerOrgName}</strong> · Inventory remaining: {redeemBenefit.remainingInventory} units
                </div>
              </div>

              {/* Economic Balance Shift Preview */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-[#10141f] border border-[#262a35]">
                  <span className="text-[10px] text-[#939183] block uppercase">Sarah's Balance</span>
                  <span className="text-sm font-bold font-mono text-[#dfe2f0]">
                    {selectedUser.creditAccount.availableCredit.toLocaleString()} CRD
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-[#10141f] border border-[#262a35]">
                  <span className="text-[10px] text-[#939183] block uppercase">After Redemption</span>
                  <span className="text-sm font-bold font-mono text-[#e4e1a9]">
                    {(selectedUser.creditAccount.availableCredit - redeemBenefit.creditsCost).toLocaleString()} CRD
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#1b1f2a] border border-[#262a35] text-[11px] text-[#939183] space-y-1">
                <div className="flex items-center gap-1.5 text-[#dfe2f0] font-semibold">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Double-Entry Ledger Commitment</span>
                </div>
                <div>
                  Immediate transfer of <strong>{redeemBenefit.creditsCost.toLocaleString()} CRD</strong> from Patron Account to Merchant Pool Settlement Account.
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#262a35]">
              <button
                onClick={() => setRedeemBenefit(null)}
                className="px-4 py-2 rounded-lg bg-[#171b26] hover:bg-[#1b1f2a] text-[#dfe2f0] text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                disabled={isRedeeming}
                onClick={handleConfirmRedeem}
                className="px-4 py-2 rounded-lg bg-[#e4e1a9] hover:bg-[#d8d598] text-[#171b26] text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
              >
                {isRedeeming ? 'Recording Ledger...' : 'Confirm Redemption'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* WAYS TO REACH YOUR GOAL (EARNING OPPORTUNITIES)          */}
      {/* References existing Programs / Quest / Campaign system    */}
      {/* ======================================================== */}
      {showEarnDrawer && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#141824] border border-[#262a35] rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#262a35]">
              <div>
                <h3 className="font-bold text-base text-[#dfe2f0] flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#e4e1a9]" />
                  <span>Ways to Reach Your Goal</span>
                </h3>
                <p className="text-xs text-[#cac7b8] mt-0.5">
                  Accumulate credits through partner programs, quests, and events toward{' '}
                  <strong className="text-[#dfe2f0]">{primaryGoal.benefitName}</strong> ({primaryAllocated.toLocaleString()} / {primaryTarget.toLocaleString()} CRD).
                </p>
              </div>
              <button
                onClick={() => setShowEarnDrawer(false)}
                className="p-1 rounded hover:bg-[#1b1f2a] text-[#939183] hover:text-[#dfe2f0] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Goal Progress Header Inside Modal */}
            <div className="p-3.5 rounded-xl bg-[#10141f] border border-[#262a35] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#cac7b8]">Current Goal Accumulation:</span>
                <span className="font-mono font-bold text-[#e4e1a9]">
                  {primaryAllocated.toLocaleString()} / {primaryTarget.toLocaleString()} CRD ({primaryProgress}%)
                </span>
              </div>
              <div className="w-full bg-[#1b1f2a] rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isGoalReached ? 'bg-emerald-400' : 'bg-gradient-to-r from-[#c8c58f] to-[#e4e1a9]'
                  }`}
                  style={{ width: `${primaryProgress}%` }}
                />
              </div>
              <div className="text-[11px] text-[#939183] flex items-center justify-between">
                <span>
                  {isGoalReached ? (
                    <strong className="text-emerald-400">Target reached! Ready for redemption.</strong>
                  ) : (
                    <span>{primaryRemaining.toLocaleString()} CRD needed to unlock</span>
                  )}
                </span>
                <span>Unallocated wallet: <strong className="text-emerald-300 font-mono">{availableToAllocate.toLocaleString()} CRD</strong></span>
              </div>
            </div>

            {/* Earning Opportunities List */}
            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1 text-xs">
              {earningOpportunities.map((opp) => (
                <div
                  key={opp.id}
                  className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                    (opp as any).isFastTrack
                      ? 'bg-gradient-to-r from-[#171b26] to-[#1a2118] border-emerald-500/40 shadow-sm'
                      : 'bg-[#171b26] border-[#262a35] hover:border-[#3b4152]'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#dfe2f0]">{opp.title}</span>
                      {(opp as any).isFastTrack && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300 uppercase">
                          Demo Fast-Track
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-[#939183] flex items-center gap-2 flex-wrap">
                      <span>Source: <strong className="text-[#cac7b8]">{opp.provider}</strong></span>
                      <span>·</span>
                      <span>{opp.program}</span>
                      <span>·</span>
                      <span>Est: {opp.estimatedTime}</span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1.5 shrink-0">
                    <div className="font-mono font-bold text-sm text-emerald-400">
                      +{opp.credits.toLocaleString()} CRD
                    </div>
                    <button
                      onClick={() => {
                        // 1. Earn credits into user's wallet & ledger
                        simulateEarnOpportunity(selectedUser.id, opp.title, opp.credits);
                        // 2. Automatically allocate earned credits to primary goal
                        allocateCreditsToGoal(selectedUser.id, currentPool.id, opp.credits, primaryGoal.benefitId);
                        setRedeemResult({
                          success: true,
                          message: `Completed "${opp.title}"! +${opp.credits.toLocaleString()} CRD earned and allocated to ${primaryGoal.benefitName}!`,
                        });
                        setTimeout(() => setRedeemResult(null), 4500);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#e4e1a9] hover:bg-[#d8d598] text-[#171b26] font-bold text-xs transition-all shadow-sm cursor-pointer hover:scale-[1.01]"
                    >
                      Complete &amp; Allocate
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#262a35] text-xs">
              <span className="text-[#939183]">Connected to Programs &amp; Quests Operating System</span>
              <button
                onClick={() => {
                  setShowEarnDrawer(false);
                  navigate('/programs');
                }}
                className="text-[#e4e1a9] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>Browse All Programs Hub</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ALLOCATE / UNALLOCATE CREDITS MODAL                      */}
      {/* Multi-goal allocation and re-allocation support          */}
      {/* ======================================================== */}
      {showAllocateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#141824] border border-[#262a35] rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#262a35]">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-[#e4e1a9]" />
                <h3 className="font-bold text-base text-[#dfe2f0]">
                  {allocateMode === 'allocate' ? 'Allocate Credits to Goal' : 'Withdraw Credits from Goal'}
                </h3>
              </div>
              <button
                onClick={() => setShowAllocateModal(false)}
                className="p-1 rounded hover:bg-[#1b1f2a] text-[#939183] hover:text-[#dfe2f0] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mode Switcher: Allocate vs Withdraw */}
            <div className="flex items-center gap-1 bg-[#10141f] p-1 rounded-lg border border-[#262a35] text-xs">
              <button
                onClick={() => setAllocateMode('allocate')}
                className={`flex-1 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                  allocateMode === 'allocate'
                    ? 'bg-[#1b1f2a] text-[#e4e1a9] shadow-sm'
                    : 'text-[#939183] hover:text-[#dfe2f0]'
                }`}
              >
                Allocate to Goal
              </button>
              <button
                onClick={() => setAllocateMode('unallocate')}
                className={`flex-1 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                  allocateMode === 'unallocate'
                    ? 'bg-[#1b1f2a] text-[#e4e1a9] shadow-sm'
                    : 'text-[#939183] hover:text-[#dfe2f0]'
                }`}
              >
                Withdraw / Reallocate
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Target Goal Selector */}
              <div className="space-y-1.5">
                <label className="text-[11px] text-[#939183]">Select Destination Benefit</label>
                <select
                  value={allocateTargetBenefitId || primaryGoal?.benefitId || ''}
                  onChange={(e) => setAllocateTargetBenefitId(e.target.value)}
                  className="w-full bg-[#171b26] border border-[#262a35] rounded-lg px-3 py-2 text-xs text-[#dfe2f0] focus:outline-none focus:border-[#e4e1a9]"
                >
                  {userGoals.map((g) => (
                    <option key={g.benefitId} value={g.benefitId}>
                      {g.benefitName} ({g.allocatedCredits.toLocaleString()} / {g.targetCredits.toLocaleString()} CRD) {g.isPrimary ? '— [Primary]' : ''}
                    </option>
                  ))}
                  {currentPool.benefits
                    .filter((b) => !userGoals.some((g) => g.benefitId === b.id))
                    .map((b) => (
                      <option key={b.id} value={b.id}>
                        + {b.name} ({b.creditsCost.toLocaleString()} CRD required)
                      </option>
                    ))}
                </select>
              </div>

              {/* Amount input & Quick Presets */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] text-[#939183]">
                  <span>Amount (CRD)</span>
                  <span>
                    {allocateMode === 'allocate'
                      ? `Available: ${availableToAllocate.toLocaleString()} CRD`
                      : `Allocated: ${(userGoals.find(g => g.benefitId === (allocateTargetBenefitId || primaryGoal?.benefitId))?.allocatedCredits || 0).toLocaleString()} CRD`}
                  </span>
                </div>
                <input
                  type="number"
                  value={allocateAmount}
                  onChange={(e) => setAllocateAmount(Number(e.target.value))}
                  min={50}
                  step={50}
                  className="w-full bg-[#171b26] border border-[#262a35] rounded-lg px-3 py-2 text-base font-mono text-[#dfe2f0] focus:outline-none focus:border-[#e4e1a9]"
                />

                <div className="flex items-center gap-1.5 pt-1">
                  {[250, 500, 1000].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAllocateAmount(preset)}
                      className="px-2.5 py-1 rounded bg-[#171b26] hover:bg-[#1b1f2a] text-[#dfe2f0] border border-[#262a35] text-[11px] font-mono cursor-pointer"
                    >
                      +{preset}
                    </button>
                  ))}
                  {allocateMode === 'allocate' && availableToAllocate > 0 && (
                    <button
                      type="button"
                      onClick={() => setAllocateAmount(availableToAllocate)}
                      className="px-2.5 py-1 rounded bg-[#1b1f2a] hover:bg-[#262a35] text-[#e4e1a9] border border-[#e4e1a9]/40 text-[11px] font-mono font-bold cursor-pointer"
                    >
                      Max Available ({availableToAllocate})
                    </button>
                  )}
                </div>
              </div>

              {/* Parity Preview */}
              <div className="p-3 rounded-lg bg-[#10141f] border border-[#262a35] text-[11px] space-y-1.5 font-mono">
                <div className="flex justify-between text-[#939183]">
                  <span>Total Wallet Balance:</span>
                  <span className="text-[#dfe2f0]">{userTotalCredits.toLocaleString()} CRD</span>
                </div>
                <div className="flex justify-between text-[#939183]">
                  <span>Total Allocated After:</span>
                  <span className="text-[#e4e1a9]">
                    {allocateMode === 'allocate'
                      ? (totalAllocatedCredits + allocateAmount).toLocaleString()
                      : (totalAllocatedCredits - Math.min(totalAllocatedCredits, allocateAmount)).toLocaleString()}{' '}
                    CRD
                  </span>
                </div>
                <div className="flex justify-between text-[#939183]">
                  <span>Free Available After:</span>
                  <span className="text-emerald-300 font-bold">
                    {allocateMode === 'allocate'
                      ? Math.max(0, availableToAllocate - allocateAmount).toLocaleString()
                      : (availableToAllocate + allocateAmount).toLocaleString()}{' '}
                    CRD
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#262a35]">
              <button
                onClick={() => setShowAllocateModal(false)}
                className="px-4 py-2 rounded-lg bg-[#171b26] hover:bg-[#1b1f2a] text-[#dfe2f0] text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAllocate}
                className="px-4 py-2 rounded-lg bg-[#e4e1a9] hover:bg-[#d8d598] text-[#171b26] text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                {allocateMode === 'allocate' ? 'Confirm Allocation' : 'Confirm Withdrawal'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* CHANGE GOAL / CHOOSE DESTINATION MODAL                   */}
      {/* ======================================================== */}
      {showChangeGoalModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#141824] border border-[#262a35] rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#262a35]">
              <div>
                <h3 className="font-bold text-base text-[#dfe2f0] flex items-center gap-2">
                  <Compass className="w-5 h-5 text-[#e4e1a9]" />
                  <span>Choose Destination Benefit</span>
                </h3>
                <p className="text-xs text-[#cac7b8] mt-0.5">
                  Select where you want your credits to accumulate in <strong>{currentPool.name}</strong>.
                </p>
              </div>
              <button
                onClick={() => setShowChangeGoalModal(false)}
                className="p-1 rounded hover:bg-[#1b1f2a] text-[#939183] hover:text-[#dfe2f0] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1 text-xs">
              {currentPool.benefits.map((benefit) => {
                const isSelectedPrimary = primaryGoal.benefitId === benefit.id;
                const isSaved = userGoals.some((g) => g.benefitId === benefit.id);

                return (
                  <div
                    key={benefit.id}
                    className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-colors ${
                      isSelectedPrimary
                        ? 'bg-[#1b1f2a] border-[#e4e1a9]/60'
                        : isSaved
                        ? 'bg-[#171b26] border-[#c8c58f]/40'
                        : 'bg-[#171b26] border-[#262a35] hover:border-[#3b4152]'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#dfe2f0]">{benefit.name}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#10141f] text-[#c8c58f] border border-[#262a35]">
                          {benefit.type}
                        </span>
                        {isSelectedPrimary && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#e4e1a9] text-[#171b26]">
                            Current Primary
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[#939183]">
                        Provider: <strong>{benefit.providerOrgName}</strong> · Inventory: {benefit.remainingInventory} units
                      </div>
                    </div>

                    <div className="text-right shrink-0 space-y-1.5">
                      <div className="font-mono font-bold text-sm text-[#e4e1a9]">
                        {benefit.creditsCost.toLocaleString()} CRD
                      </div>
                      <button
                        disabled={isSelectedPrimary}
                        onClick={() => {
                          handleSaveGoal(benefit);
                          setShowChangeGoalModal(false);
                        }}
                        className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                          isSelectedPrimary
                            ? 'bg-[#141824] text-[#939183] border border-[#262a35] cursor-not-allowed opacity-60'
                            : 'bg-[#e4e1a9] hover:bg-[#d8d598] text-[#171b26]'
                        }`}
                      >
                        {isSelectedPrimary ? 'Active Primary' : 'Set as Goal'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-end pt-2 border-t border-[#262a35]">
              <button
                onClick={() => setShowChangeGoalModal(false)}
                className="px-4 py-2 rounded-lg bg-[#171b26] hover:bg-[#1b1f2a] text-[#dfe2f0] text-xs font-medium cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* CLAIMED DIGITAL VOUCHER PASS MODAL                       */}
      {/* Full cryptographic receipt, barcode & merchant claim     */}
      {/* ======================================================== */}
      {claimedVoucher && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#141824] border border-[#e4e1a9] rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl relative overflow-hidden">
            {/* Top Pass Accent Glow */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#e4e1a9] via-emerald-400 to-[#c8c58f]" />

            <div className="flex items-center justify-between pb-3 border-b border-[#262a35]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-base text-[#dfe2f0]">Digital Benefit Pass Claimed</h3>
              </div>
              <button
                onClick={() => setClaimedVoucher(null)}
                className="p-1 rounded hover:bg-[#1b1f2a] text-[#939183] hover:text-[#dfe2f0] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Visual Digital Voucher Pass Ticket */}
            <div className="bg-gradient-to-b from-[#1b1f2a] to-[#141824] border border-[#3b4152] rounded-xl p-5 space-y-4 shadow-lg text-xs">
              <div className="flex items-center justify-between border-b border-[#262a35] pb-3">
                <div>
                  <div className="text-[10px] text-[#939183] uppercase tracking-wider">OFFICIAL BENEFIT PASS</div>
                  <div className="text-sm font-bold text-[#e4e1a9]">{claimedVoucher.benefit.name}</div>
                  <div className="text-[11px] text-[#cac7b8] mt-0.5">by {claimedVoucher.benefit.providerOrgName}</div>
                </div>
                <div className="w-12 h-12 rounded-lg bg-[#10141f] border border-[#262a35] flex items-center justify-center text-[#e4e1a9]">
                  <QrCode className="w-8 h-8" />
                </div>
              </div>

              {/* Pass Metadata Grid */}
              <div className="grid grid-cols-2 gap-3 text-[11px] font-mono">
                <div>
                  <span className="text-[#939183] block text-[10px]">REDEMPTION ID</span>
                  <span className="text-[#dfe2f0] font-bold">{claimedVoucher.redemptionId}</span>
                </div>
                <div>
                  <span className="text-[#939183] block text-[10px]">COST SETTLED</span>
                  <span className="text-[#e4e1a9] font-bold">{claimedVoucher.benefit.creditsCost.toLocaleString()} CRD</span>
                </div>
                <div>
                  <span className="text-[#939183] block text-[10px]">PATRON IDENTITY</span>
                  <span className="text-[#dfe2f0]">{claimedVoucher.userName}</span>
                </div>
                <div>
                  <span className="text-[#939183] block text-[10px]">LEDGER TX REF</span>
                  <span className="text-emerald-400">{claimedVoucher.ledgerTxId}</span>
                </div>
              </div>

              {/* Barcode graphic */}
              <div className="pt-2 border-t border-dashed border-[#262a35] space-y-1 text-center">
                <div className="flex justify-center items-center gap-1 h-8 opacity-80">
                  {Array.from({ length: 32 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-[#dfe2f0] h-full"
                      style={{ width: i % 3 === 0 ? '4px' : i % 2 === 0 ? '2px' : '1px' }}
                    />
                  ))}
                </div>
                <div className="font-mono text-[10px] text-[#939183] tracking-widest">
                  PASS-TOKEN-{claimedVoucher.redemptionId.slice(-6)}
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-[#10141f] border border-[#262a35] text-[10px] text-[#cac7b8] leading-relaxed">
                <strong>Merchant Claim Instructions:</strong> Present this digital pass code or QR token at reception or checkout. Valid through {currentPool.durationEnd}.
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#262a35]">
              <button
                onClick={() => {
                  setClaimedVoucher(null);
                  setShowChangeGoalModal(true);
                }}
                className="px-4 py-2 rounded-lg bg-[#e4e1a9] hover:bg-[#d8d598] text-[#171b26] text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
              >
                <span>Choose Next Goal Destination</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ADD CONTRIBUTION MODAL                                   */}
      {/* ======================================================== */}
      {showContribModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#141824] border border-[#262a35] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#262a35]">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#e4e1a9]" />
                <h3 className="font-bold text-base text-[#dfe2f0]">Record Organization Contribution</h3>
              </div>
              <button
                onClick={() => setShowContribModal(false)}
                className="p-1 rounded hover:bg-[#1b1f2a] text-[#939183] hover:text-[#dfe2f0] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-[11px] text-[#939183]">Contributing Organization</label>
                <select
                  value={contribOrgId}
                  onChange={(e) => setContribOrgId(e.target.value)}
                  className="w-full bg-[#171b26] border border-[#262a35] rounded-lg px-3 py-2 text-xs text-[#dfe2f0] focus:outline-none focus:border-[#e4e1a9]"
                >
                  {organizations.map((org) => (
                    <option key={org.id} value={org.id}>
                      {org.name} ({org.type})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-[#939183]">Contribution Type</label>
                <select
                  value={contribType}
                  onChange={(e) => setContribType(e.target.value as any)}
                  className="w-full bg-[#171b26] border border-[#262a35] rounded-lg px-3 py-2 text-xs text-[#dfe2f0] focus:outline-none focus:border-[#e4e1a9]"
                >
                  <option value="Credit Funding">Credit Funding (Capital matching)</option>
                  <option value="Benefit Inventory">Benefit Inventory (Merchandise / Stays)</option>
                  <option value="Sponsored Benefit">Sponsored Benefit (Brand subsidization)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-[#939183]">Amount (CRD Equivalent)</label>
                <input
                  type="number"
                  value={contribAmount}
                  onChange={(e) => setContribAmount(Number(e.target.value))}
                  step={500}
                  min={500}
                  className="w-full bg-[#171b26] border border-[#262a35] rounded-lg px-3 py-2 text-xs font-mono text-[#dfe2f0] focus:outline-none focus:border-[#e4e1a9]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-[#939183]">Notes / Purpose</label>
                <input
                  type="text"
                  value={contribNotes}
                  onChange={(e) => setContribNotes(e.target.value)}
                  placeholder="e.g. Q4 co-marketing allocation grant"
                  className="w-full bg-[#171b26] border border-[#262a35] rounded-lg px-3 py-2 text-xs text-[#dfe2f0] focus:outline-none focus:border-[#e4e1a9]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#262a35]">
              <button
                onClick={() => setShowContribModal(false)}
                className="px-4 py-2 rounded-lg bg-[#171b26] hover:bg-[#1b1f2a] text-[#dfe2f0] text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAddContributionSubmit}
                className="px-4 py-2 rounded-lg bg-[#e4e1a9] hover:bg-[#d8d598] text-[#171b26] text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                Record Contribution
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
