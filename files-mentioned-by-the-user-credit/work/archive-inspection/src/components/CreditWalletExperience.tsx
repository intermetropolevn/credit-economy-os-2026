import React, { useState, useEffect } from 'react';
import { useEconomic } from '../context/EconomicContext';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Compass,
  Gift,
  Target,
  Layers,
  MapPin,
  TrendingUp,
  Zap,
  Check,
  X,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Calendar,
  Coffee,
  Activity,
  Music,
  ShoppingBag,
  Award,
  DollarSign,
  UserCheck,
  QrCode,
  Flame,
  Bookmark,
  Share2,
  Tag,
  Star,
  Info,
} from 'lucide-react';
import {
  processWalletAgentQuery,
  AgentOptionRecommendation,
  AgentEarningOpportunity,
  AgentStepName,
  WalletAgentResult,
  redeem_benefit,
} from '../services/mcpWalletAgentService';

interface CreditWalletExperienceProps {
  initialQuery?: string;
  isEmbedded?: boolean;
}

export interface WalletDiscoveryItem {
  id: string;
  title: string;
  partner: string;
  partnerId?: string;
  credits: number;
  category: 'Fitness' | 'Dining & Food' | 'Wellness' | 'Creator & Arts' | 'Travel & Stays' | 'Entertainment';
  availability: 'Available Now' | 'Limited Slots' | 'Coming Soon' | 'High Demand';
  whyRecommended: string;
  image: string;
  poolId?: string;
  poolName?: string;
  distance?: string;
  source: 'brand' | 'creator' | 'community' | 'personal';
  isTrending?: boolean;
}

export const CreditWalletExperience: React.FC<CreditWalletExperienceProps> = ({
  initialQuery = '',
  isEmbedded = false,
}) => {
  const {
    users,
    selectedUserId,
    pools,
    campaigns,
    quests,
    organizations,
    redeemPoolBenefit,
    allocateCreditsToGoal,
    navigate,
    setSelectedPoolId,
  } = useEconomic();

  const currentUser = users.find((u) => u.id === selectedUserId) || users[0];

  // Natural language query & AI agent state
  const [nlQuery, setNlQuery] = useState(initialQuery);
  const [isAgentRunning, setIsAgentRunning] = useState(false);
  const [activeStep, setActiveStep] = useState<AgentStepName>('Ready');
  const [agentResult, setAgentResult] = useState<WalletAgentResult | null>(null);

  // Discovery Filter Tabs
  const [activeDiscoveryTab, setActiveDiscoveryTab] = useState<string>('for-you');

  // Redemption Confirmation Modal State
  const [selectedOptionForRedeem, setSelectedOptionForRedeem] = useState<AgentOptionRecommendation | null>(null);
  const [isProcessingRedeem, setIsProcessingRedeem] = useState(false);
  const [mintedVoucher, setMintedVoucher] = useState<{
    code: string;
    title: string;
    partner: string;
    creditsSpent: number;
    timestamp: string;
  } | null>(null);
  const [redemptionError, setRedemptionError] = useState<string | null>(null);

  // Saved Experiences Set
  const [savedExperienceIds, setSavedExperienceIds] = useState<Set<string>>(new Set(['disc-03']));

  // Quick Action feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const availableCredit = currentUser.creditAccount.availableCredit;
  const totalCredit = currentUser.creditAccount.totalCredit;
  const reservedCredit = currentUser.creditAccount.reservedCredit;
  const creditsSpent = Math.max(0, totalCredit - availableCredit - reservedCredit);
  const expiringCredits = Math.min(250, availableCredit);

  // Active Goals for Sarah Chen / current user
  const activeGoals = [
    {
      id: 'goal-stay',
      title: 'Weekend Stay',
      poolName: 'City Life Pool',
      poolId: 'pool-city-life',
      partner: 'Nomad Stay',
      targetCredits: 5000,
      savedCredits: 2400,
      category: 'Experience',
      status: 'Building',
      daysLeft: 35,
    },
    {
      id: 'goal-fitness-weekend',
      title: 'Fitness Weekend Retreat',
      poolName: 'Fitness & Wellness Weekend Pool',
      poolId: 'pool-fitness-wellness',
      partner: 'Saigon Fitness & Nike',
      targetCredits: 500,
      savedCredits: 300,
      category: 'Experience',
      status: 'Building',
      daysLeft: 14,
    },
  ];

  // Rich Discovery Items Catalog
  const discoveryCatalog: WalletDiscoveryItem[] = [
    {
      id: 'disc-01',
      title: '1-Day Premium HIIT & Recovery Pass',
      partner: 'Saigon Fitness Club',
      partnerId: 'org-saigon-fitness',
      credits: 500,
      category: 'Fitness',
      availability: 'Available Now',
      whyRecommended: 'Because you completed 2 fitness quests this week',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80',
      poolId: 'pool-fitness-wellness',
      poolName: 'Fitness & Wellness Weekend Pool',
      distance: '450m away in District 1',
      source: 'brand',
      isTrending: true,
    },
    {
      id: 'disc-02',
      title: 'Cold Brew & Artisan Croissant Set',
      partner: 'ABC Coffee Roasters',
      partnerId: 'org-abc-coffee',
      credits: 300,
      category: 'Dining & Food',
      availability: 'Available Now',
      whyRecommended: 'Instant unlock with your current balance (1,440 CRD)',
      image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80',
      poolId: 'pool-city-life',
      poolName: 'Saigon City Life & Culture Pool',
      distance: '150m walking distance',
      source: 'brand',
      isTrending: false,
    },
    {
      id: 'disc-03',
      title: 'Sunset Bouldering & Mobility Session',
      partner: 'Vertical Bouldering Studio',
      credits: 450,
      category: 'Fitness',
      availability: 'Limited Slots',
      whyRecommended: 'Your saved experience starts tomorrow',
      image: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=600&q=80',
      poolId: 'pool-fitness-wellness',
      distance: '800m away',
      source: 'community',
      isTrending: true,
    },
    {
      id: 'disc-04',
      title: 'Creator Cinematography Workshop',
      partner: 'District Creative Collective',
      credits: 350,
      category: 'Creator & Arts',
      availability: 'High Demand',
      whyRecommended: 'Curated by local mobile filmmakers',
      image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=600&q=80',
      source: 'creator',
      isTrending: true,
    },
    {
      id: 'disc-05',
      title: 'Sensory Cupping & 250g Bean Bag',
      partner: 'District 1 Roasters',
      credits: 250,
      category: 'Dining & Food',
      availability: 'Available Now',
      whyRecommended: 'Because you completed a Coffee Quest',
      image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80',
      poolId: 'pool-city-life',
      distance: '300m away',
      source: 'brand',
      isTrending: false,
    },
    {
      id: 'disc-06',
      title: 'Tibetan Sound Bath & Herbal Mist',
      partner: 'Lotus Wellness Spa',
      credits: 400,
      category: 'Wellness',
      availability: 'Limited Slots',
      whyRecommended: 'Users with similar active profiles loved this',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80',
      distance: '1.1km away',
      source: 'brand',
      isTrending: true,
    },
    {
      id: 'disc-07',
      title: 'Pro Podcast Audio Suite 2-Hour Pass',
      partner: 'Studio D1 Podcasting Hub',
      credits: 400,
      category: 'Creator & Arts',
      availability: 'Available Now',
      whyRecommended: 'Created by local podcast sound engineers',
      image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=600&q=80',
      source: 'creator',
      isTrending: false,
    },
    {
      id: 'disc-08',
      title: 'Weekend Eco-Glamping Night',
      partner: 'Nomad Stays & EcoVibe',
      credits: 800,
      category: 'Travel & Stays',
      availability: 'Coming Soon',
      whyRecommended: 'Top destination in Nomad & Travel Pool',
      image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=600&q=80',
      poolId: 'pool-nomad-stays',
      source: 'brand',
      isTrending: true,
    },
  ];

  // Filtered Discovery Items
  const filteredDiscovery = discoveryCatalog.filter((item) => {
    if (activeDiscoveryTab === 'for-you') return true;
    if (activeDiscoveryTab === 'near-you') return Boolean(item.distance && item.distance.includes('m away'));
    if (activeDiscoveryTab === 'because-earned') return item.whyRecommended.includes('balance') || item.whyRecommended.includes('completed');
    if (activeDiscoveryTab === 'trending') return item.isTrending;
    if (activeDiscoveryTab === 'creators') return item.source === 'creator';
    if (activeDiscoveryTab === 'brands') return item.source === 'brand';
    if (activeDiscoveryTab === 'unlockable') return item.credits <= availableCredit;
    return true;
  });

  const examplePrompts = [
    'What can I do with 800 Credits?',
    'Find something for this weekend.',
    'I want food experiences.',
    'How can I earn 500 more Credits?',
    'Find experiences from creators.',
  ];

  // Steps definition for AI agent visual progress
  const stepsList: AgentStepName[] = [
    'Thinking',
    'Checking Credits',
    'Finding Benefits',
    'Checking Eligibility',
    'Ready',
  ];

  // Run the multi-step lightweight AI agent progression
  const handleRunAgent = (queryToRun: string) => {
    if (!queryToRun.trim()) return;
    setNlQuery(queryToRun);
    setIsAgentRunning(true);
    setAgentResult(null);
    setMintedVoucher(null);

    const stepIntervals = [
      { step: 'Thinking' as AgentStepName, delay: 0 },
      { step: 'Checking Credits' as AgentStepName, delay: 180 },
      { step: 'Finding Benefits' as AgentStepName, delay: 350 },
      { step: 'Checking Eligibility' as AgentStepName, delay: 520 },
      { step: 'Ready' as AgentStepName, delay: 680 },
    ];

    stepIntervals.forEach(({ step, delay }) => {
      setTimeout(() => {
        setActiveStep(step);
      }, delay);
    });

    setTimeout(() => {
      const walletContext = {
        currentUser,
        pools,
        campaigns,
        quests,
        organizations,
        redeemPoolBenefit,
        allocateCreditsToGoal,
      };

      const result = processWalletAgentQuery(queryToRun, walletContext);
      setAgentResult(result);
      setIsAgentRunning(false);
    }, 720);
  };

  // Toggle Save Experience
  const toggleSave = (id: string, title: string) => {
    setSavedExperienceIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        setToastMessage(`Removed "${title}" from saved.`);
      } else {
        next.add(id);
        setToastMessage(`Saved "${title}" to your wishlist!`);
      }
      return next;
    });
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Execute Redemption
  const handleConfirmRedemption = () => {
    if (!selectedOptionForRedeem) return;
    setIsProcessingRedeem(true);
    setRedemptionError(null);

    setTimeout(() => {
      const walletContext = {
        currentUser,
        pools,
        campaigns,
        quests,
        organizations,
        redeemPoolBenefit,
        allocateCreditsToGoal,
      };

      const result = redeem_benefit(
        currentUser.id,
        selectedOptionForRedeem.poolId,
        selectedOptionForRedeem.benefitId,
        walletContext
      );

      setIsProcessingRedeem(false);

      if (result.success) {
        setMintedVoucher({
          code: `VCH-${Math.floor(100000 + Math.random() * 900000)}`,
          title: selectedOptionForRedeem.title,
          partner: selectedOptionForRedeem.partner,
          creditsSpent: selectedOptionForRedeem.creditsRequired,
          timestamp: new Date().toLocaleTimeString(),
        });
        setSelectedOptionForRedeem(null);
        setToastMessage(`Successfully redeemed ${selectedOptionForRedeem.title}!`);
        setTimeout(() => setToastMessage(null), 5000);
      } else {
        setRedemptionError(result.message);
      }
    }, 550);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-[#1b1f2a] border border-[#e4e1a9] text-[#dfe2f0] text-xs font-medium shadow-2xl flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-[#e4e1a9]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* 1. USER HOME: YOUR NEXT EXPERIENCE                       */}
      {/* 1 Primary + 2 Secondary Recommendations                  */}
      {/* ======================================================== */}
      <div className="bg-[#141824] border border-[#e4e1a9]/40 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#262a35]">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-[#1b1f2a] text-[#e4e1a9] border border-[#e4e1a9]/30 font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>YOUR NEXT EXPERIENCE</span>
            </span>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
              Personalized Economic Journey
            </span>
          </div>

          <span className="text-xs font-mono text-[#939183] hidden sm:inline">
            Patron: <strong className="text-[#dfe2f0]">{currentUser.name}</strong>
          </span>
        </div>

        {/* 1 Primary + 2 Secondary Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* PRIMARY RECOMMENDATION (Takes 1 Col on desktop with standout styling) */}
          <div className="lg:col-span-1 bg-gradient-to-br from-[#1b1f2a] to-[#141824] border-2 border-[#e4e1a9] rounded-2xl p-5 shadow-2xl flex flex-col justify-between space-y-4 relative group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#e4e1a9] text-[#171b26] font-bold">
                  PRIMARY RECOMMENDATION
                </span>
                <span className="text-xs font-mono text-[#e4e1a9] font-bold">200 CRD Needed</span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#dfe2f0] leading-snug group-hover:text-[#e4e1a9] transition-colors">
                  &ldquo;You're 200 Credits away from Fitness Weekend.&rdquo;
                </h3>
                <p className="text-xs text-[#cac7b8] mt-1.5 leading-relaxed">
                  You've accumulated 300 Credits toward the <strong>Fitness &amp; Wellness Weekend Pool</strong> (Goal: 500 CRD).
                </p>
              </div>

              {/* Progress bar */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-[#939183]">Accumulation Progress:</span>
                  <span className="text-[#e4e1a9] font-bold">300 / 500 CRD (60%)</span>
                </div>
                <div className="w-full bg-[#10141f] rounded-full h-2.5 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#c8c58f] to-[#e4e1a9] rounded-full transition-all duration-500" style={{ width: '60%' }} />
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#262a35] flex items-center justify-between gap-2">
              <span className="text-[11px] text-[#939183]">Saigon Fitness &amp; Nike</span>
              <button
                onClick={() => {
                  setSelectedPoolId('pool-fitness-wellness');
                  navigate('/pools/pool-fitness-wellness');
                }}
                className="px-4 py-2 rounded-xl bg-[#e4e1a9] hover:bg-[#d8d598] text-[#171b26] font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
              >
                <span>View Goal Pool</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* SECONDARY 1: Continue Food Explorer Journey */}
          <div className="bg-[#10141f] border border-[#262a35] hover:border-[#e4e1a9]/50 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4 transition-all group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#171b26] text-emerald-400 border border-emerald-500/30 font-bold">
                  ACTIVE QUEST
                </span>
                <span className="text-xs font-mono text-emerald-400 font-bold">+150 CRD</span>
              </div>

              <div>
                <h4 className="text-base font-bold text-[#dfe2f0] group-hover:text-[#e4e1a9] transition-colors">
                  &ldquo;Continue your Food Explorer journey.&rdquo;
                </h4>
                <p className="text-xs text-[#cac7b8] mt-1 leading-relaxed">
                  Next Step: Complete a verified afternoon visit at <strong>District 1 Roasters</strong> to earn +150 Credits and unlock a complimentary tasting set.
                </p>
              </div>

              <div className="text-[11px] font-mono text-[#939183] bg-[#141824] p-2.5 rounded-xl border border-[#262a35] space-y-1">
                <div>Route: Specialty Roasters Circuit</div>
                <div className="text-emerald-400 font-bold">2 of 3 Cafes Visited (66%)</div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#262a35] flex items-center justify-between">
              <span className="text-[11px] text-[#939183]">ABC Coffee &amp; Roasters</span>
              <button
                onClick={() => {
                  setToastMessage('Route marked in map! Check in at District 1 Roasters.');
                  setTimeout(() => setToastMessage(null), 3000);
                }}
                className="px-3.5 py-1.5 rounded-lg bg-[#141824] hover:bg-[#1b1f2a] text-xs font-semibold text-[#dfe2f0] border border-[#262a35] hover:border-[#e4e1a9]/40 cursor-pointer transition-colors"
              >
                Continue Journey &rarr;
              </button>
            </div>
          </div>

          {/* SECONDARY 2: Saved Experience Starts Tomorrow */}
          <div className="bg-[#10141f] border border-[#262a35] hover:border-[#e4e1a9]/50 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4 transition-all group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/30 font-bold">
                  SAVED WISHLIST
                </span>
                <span className="text-xs font-mono text-[#dfe2f0]">Starts Tomorrow</span>
              </div>

              <div>
                <h4 className="text-base font-bold text-[#dfe2f0] group-hover:text-[#e4e1a9] transition-colors">
                  &ldquo;Your saved experience starts tomorrow.&rdquo;
                </h4>
                <p className="text-xs text-[#cac7b8] mt-1 leading-relaxed">
                  <strong>Sunset Bouldering &amp; Mobility Session</strong> at Vertical Studio. Your 450 CRD pass is ready to unlock.
                </p>
              </div>

              <div className="text-[11px] font-mono text-[#939183] bg-[#141824] p-2.5 rounded-xl border border-[#262a35] space-y-1">
                <div>Slot: Saturday 17:30 - 19:30</div>
                <div className="text-[#e4e1a9]">Cost: 450 CRD (Fully Unlocked)</div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#262a35] flex items-center justify-between">
              <span className="text-[11px] text-[#939183]">Vertical Studio</span>
              <button
                onClick={() => {
                  setSelectedOptionForRedeem({
                    id: 'disc-03',
                    label: 'SAVED',
                    title: 'Sunset Bouldering & Mobility Session',
                    creditsRequired: 450,
                    partner: 'Vertical Bouldering Studio',
                    category: 'Fitness',
                    availability: 'Available',
                    remainingUnits: 12,
                    expiration: 'Valid Tomorrow Saturday',
                    whyRecommended: 'Your saved experience starting tomorrow',
                    poolId: 'pool-fitness-wellness',
                    benefitId: 'ben-bouldering-01',
                    isEligible: availableCredit >= 450,
                  });
                }}
                className="px-3.5 py-1.5 rounded-lg bg-[#e4e1a9] hover:bg-[#d8d598] text-[#171b26] text-xs font-bold transition-colors cursor-pointer shadow-sm"
              >
                Redeem Pass &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. CREDIT JOURNEY: BALANCE METRICS & "HOW CREDITS MOVE"  */}
      {/* ======================================================== */}
      <div className="space-y-4">
        {/* Balance Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Current Credit Balance */}
          <div className="bg-[#141824] border border-[#e4e1a9]/40 rounded-2xl p-4 space-y-1 relative overflow-hidden shadow-md">
            <span className="text-[10px] font-mono text-[#e4e1a9] uppercase font-bold tracking-wider block">
              Current Credits
            </span>
            <div className="flex items-baseline gap-1.5 pt-1">
              <span className="text-3xl font-extrabold font-mono text-[#e4e1a9]">
                {availableCredit.toLocaleString()}
              </span>
              <span className="text-xs font-medium text-[#939183]">CRD</span>
            </div>
            <div className="text-[11px] text-emerald-400 font-medium pt-1 border-t border-[#262a35]">
              Ready to experience &bull; Unlocked
            </div>
          </div>

          {/* Credits Earned */}
          <div className="bg-[#141824] border border-[#262a35] rounded-2xl p-4 space-y-1 shadow-sm">
            <span className="text-[10px] font-mono text-[#939183] uppercase font-bold tracking-wider block">
              Credits Earned
            </span>
            <div className="flex items-baseline gap-1.5 pt-1">
              <span className="text-2xl font-bold font-mono text-[#dfe2f0]">
                {totalCredit.toLocaleString()}
              </span>
              <span className="text-xs text-[#939183]">CRD</span>
            </div>
            <div className="text-[11px] text-emerald-400 font-mono pt-1 border-t border-[#262a35]">
              Lifetime verified participation
            </div>
          </div>

          {/* Credits Spent */}
          <div className="bg-[#141824] border border-[#262a35] rounded-2xl p-4 space-y-1 shadow-sm">
            <span className="text-[10px] font-mono text-[#939183] uppercase font-bold tracking-wider block">
              Credits Spent
            </span>
            <div className="flex items-baseline gap-1.5 pt-1">
              <span className="text-2xl font-bold font-mono text-[#dfe2f0]">
                {creditsSpent.toLocaleString()}
              </span>
              <span className="text-xs text-[#939183]">CRD</span>
            </div>
            <div className="text-[11px] text-[#939183] pt-1 border-t border-[#262a35]">
              Burned in experience perks
            </div>
          </div>

          {/* Expiring Credits */}
          <div className="bg-[#141824] border border-[#262a35] rounded-2xl p-4 space-y-1 shadow-sm">
            <span className="text-[10px] font-mono text-amber-300 uppercase font-bold tracking-wider block">
              Expiring Credits
            </span>
            <div className="flex items-baseline gap-1.5 pt-1">
              <span className="text-2xl font-bold font-mono text-amber-300">
                {expiringCredits.toLocaleString()}
              </span>
              <span className="text-xs text-[#939183]">CRD</span>
            </div>
            <div className="text-[11px] text-amber-300/80 pt-1 border-t border-[#262a35]">
              Valid for next 14 days
            </div>
          </div>

          {/* Active Goals */}
          <div className="bg-[#141824] border border-[#262a35] rounded-2xl p-4 space-y-1 shadow-sm col-span-2 lg:col-span-1">
            <span className="text-[10px] font-mono text-[#c8c58f] uppercase font-bold tracking-wider block">
              Active Goals
            </span>
            <div className="flex items-baseline gap-1.5 pt-1">
              <span className="text-2xl font-bold font-mono text-[#dfe2f0]">
                {activeGoals.length}
              </span>
              <span className="text-xs text-[#939183]">Destinations</span>
            </div>
            <div className="text-[11px] text-[#e4e1a9] pt-1 border-t border-[#262a35]">
              Accumulating toward pools
            </div>
          </div>
        </div>

        {/* HOW YOUR CREDITS CAN MOVE (Economic Velocity Loop) */}
        <div className="p-5 rounded-2xl bg-[#141824] border border-[#262a35] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-[#e4e1a9] uppercase font-bold">
                HOW YOUR CREDITS CAN MOVE
              </span>
              <span className="text-xs text-[#939183]">
                Credits are an active economic medium, not static points.
              </span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
              Velocity Engine
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-mono">
            {[
              { step: '1. Earn', desc: 'Complete verified challenges, purchases & quests', color: 'text-emerald-400' },
              { step: '2. Save', desc: 'Accumulate toward shared multi-partner pools', color: 'text-[#dfe2f0]' },
              { step: '3. Unlock', desc: 'Reach capacity thresholds for premium perks', color: 'text-[#e4e1a9]' },
              { step: '4. Experience', desc: 'Enjoy retreats, dining & creator masterclasses', color: 'text-amber-300' },
              { step: '5. Redeem', desc: 'Burn credits & close the loop for new demand', color: 'text-cyan-300' },
            ].map((st) => (
              <div
                key={st.step}
                className="p-3 rounded-xl bg-[#10141f] border border-[#262a35] space-y-1 text-center"
              >
                <div className={`font-bold ${st.color}`}>{st.step}</div>
                <div className="text-[10px] text-[#939183] font-sans leading-tight">{st.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. AI EXPERIENCE AGENT: "Ask AI" Interaction            */}
      {/* Natural Language + MCP Tool Trace + Actionable Cards     */}
      {/* ======================================================== */}
      <div className="p-5 rounded-2xl bg-gradient-to-b from-[#141824] to-[#10141f] border border-[#e4e1a9]/50 shadow-2xl space-y-4 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#1b1f2a] border border-[#e4e1a9]/40 text-[#e4e1a9] flex items-center justify-center shrink-0 shadow-sm">
              <Sparkles className="w-4 h-4 text-[#e4e1a9]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#dfe2f0] flex items-center gap-2">
                <span>AI Experience Agent</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#171b26] text-[#e4e1a9] border border-[#e4e1a9]/30">
                  MCP Powered
                </span>
              </h2>
              <p className="text-[11px] text-[#939183]">
                Query by intent or credit budget. Agent uses MCP tools to match pools, benefits, and verified eligibility.
              </p>
            </div>
          </div>

          <div className="text-[10px] font-mono text-[#939183] hidden md:flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Real-time balance &amp; eligibility verification</span>
          </div>
        </div>

        {/* Input Bar */}
        <div className="flex items-center gap-2 p-1.5 rounded-xl bg-[#0c1019] border border-[#262a35] focus-within:border-[#e4e1a9]/70 transition-colors">
          <input
            type="text"
            value={nlQuery}
            onChange={(e) => setNlQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleRunAgent(nlQuery);
              }
            }}
            placeholder="Ask AI Experience Agent... (e.g. What can I do with 800 Credits?)"
            className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm text-[#dfe2f0] placeholder-[#939183] focus:outline-none"
          />
          <button
            onClick={() => handleRunAgent(nlQuery)}
            disabled={!nlQuery.trim() || isAgentRunning}
            className="px-4 py-2 rounded-lg bg-[#e4e1a9] hover:bg-[#d8d598] text-[#171b26] font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer disabled:opacity-50 shrink-0"
          >
            <span>Ask</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* User Prompt Example Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto text-[11px] no-scrollbar pt-0.5">
          <span className="text-[10px] font-mono text-[#939183] shrink-0 uppercase">Suggested Prompts:</span>
          {examplePrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleRunAgent(prompt)}
              className="px-2.5 py-1 rounded-full bg-[#171b26] hover:bg-[#1b1f2a] border border-[#262a35] text-[#cac7b8] hover:text-[#e4e1a9] whitespace-nowrap transition-colors cursor-pointer shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* AI Agent Progress Indicator */}
        {isAgentRunning && (
          <div className="p-3.5 rounded-xl bg-[#0c1019] border border-[#262a35] space-y-2 animate-fadeIn">
            <div className="flex items-center justify-between text-[11px] text-[#939183]">
              <span className="font-mono text-[#e4e1a9] flex items-center gap-1.5 font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#e4e1a9] animate-ping" />
                AI Agent Querying MCP Registry...
              </span>
              <span className="font-mono text-[10px] text-[#939183]">Deterministic Logic Validation</span>
            </div>

            <div className="flex items-center justify-between gap-1 overflow-x-auto text-[11px]">
              {stepsList.map((step, idx) => {
                const currentIdx = stepsList.indexOf(activeStep);
                const isPast = idx < currentIdx;
                const isCurrent = idx === currentIdx;

                return (
                  <React.Fragment key={step}>
                    <div
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-all ${
                        isCurrent
                          ? 'bg-[#1b1f2a] border-[#e4e1a9] text-[#e4e1a9] shadow-sm animate-pulse'
                          : isPast
                          ? 'bg-[#141824] border-emerald-500/30 text-emerald-400'
                          : 'bg-[#141824]/40 border-[#262a35] text-[#939183]'
                      }`}
                    >
                      {isPast ? (
                        <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                      ) : isCurrent ? (
                        <span className="w-2 h-2 rounded-full bg-[#e4e1a9] animate-spin shrink-0" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#3b4152] shrink-0" />
                      )}
                      <span>{step}</span>
                    </div>

                    {idx < stepsList.length - 1 && (
                      <span className="text-[#3b4152] font-mono text-[10px]">&rarr;</span>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        )}

        {/* Newly Minted Voucher Card Banner */}
        {mintedVoucher && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-200 space-y-2 animate-fadeIn shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h4 className="text-sm font-bold text-[#dfe2f0]">
                  Benefit Successfully Redeemed!
                </h4>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                LEDGER BURNED: -{mintedVoucher.creditsSpent} CRD
              </span>
            </div>

            <div className="p-3.5 rounded-lg bg-[#0c1019] border border-[#262a35] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <div className="font-bold text-sm text-[#dfe2f0]">{mintedVoucher.title}</div>
                <div className="text-[11px] text-[#939183]">Partner: {mintedVoucher.partner}</div>
                <div className="text-[10px] text-emerald-400 font-mono">Present pass at merchant counter for verification</div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <div className="text-[10px] text-[#939183] font-mono uppercase">VOUCHER CODE</div>
                  <div className="font-mono text-sm font-bold text-[#e4e1a9] tracking-wider">
                    {mintedVoucher.code}
                  </div>
                </div>
                <div className="w-10 h-10 rounded-lg bg-white p-1 flex items-center justify-center shrink-0">
                  <QrCode className="w-8 h-8 text-black" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Concise AI Response & Recommendations */}
        {agentResult && !isAgentRunning && (
          <div className="space-y-4 pt-2 border-t border-[#262a35] animate-fadeIn">
            {/* Concise AI Response text block */}
            <div className="p-4 rounded-xl bg-[#10141f] border border-[#262a35] text-xs text-[#dfe2f0] leading-relaxed whitespace-pre-line font-medium shadow-inner">
              {agentResult.summaryText}
            </div>

            {/* Recommendation Cards */}
            {agentResult.recommendations && agentResult.recommendations.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {agentResult.recommendations.map((opt) => (
                  <div
                    key={opt.id}
                    className="p-4 rounded-xl bg-[#141824] border border-[#262a35] hover:border-[#e4e1a9]/50 transition-all flex flex-col justify-between space-y-3 shadow-md group"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#10141f] text-[#c8c58f] border border-[#262a35]">
                          {opt.category}
                        </span>
                        <span className="text-sm font-bold font-mono text-[#e4e1a9]">
                          {opt.creditsRequired.toLocaleString()} CRD
                        </span>
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-[#dfe2f0] group-hover:text-[#e4e1a9] transition-colors leading-snug">
                          {opt.title}
                        </h4>
                        <div className="text-[11px] text-[#939183] mt-0.5">
                          {opt.partner} {opt.distance && `· ${opt.distance}`}
                        </div>
                      </div>

                      <div className="p-2 rounded-lg bg-[#10141f] border border-[#262a35] text-[10px] text-[#cac7b8] leading-tight">
                        <strong className="text-[#e4e1a9]">Why:</strong> {opt.whyRecommended}
                      </div>
                    </div>

                    {/* Action Buttons: [Explore], [Save], [Redeem] */}
                    <div className="pt-2 border-t border-[#262a35] grid grid-cols-3 gap-1.5">
                      <button
                        onClick={() => {
                          if (opt.poolId) {
                            setSelectedPoolId(opt.poolId);
                            navigate(`/pools/${opt.poolId}`);
                          } else {
                            navigate('/pools');
                          }
                        }}
                        className="py-1.5 px-2 rounded-lg bg-[#10141f] hover:bg-[#1b1f2a] text-[#dfe2f0] text-center text-[10px] font-medium border border-[#262a35] cursor-pointer"
                      >
                        Explore
                      </button>

                      <button
                        onClick={() => toggleSave(opt.id, opt.title)}
                        className={`py-1.5 px-2 rounded-lg text-center text-[10px] font-medium border cursor-pointer ${
                          savedExperienceIds.has(opt.id)
                            ? 'bg-[#1b1f2a] text-[#e4e1a9] border-[#e4e1a9]/50'
                            : 'bg-[#10141f] hover:bg-[#1b1f2a] text-[#cac7b8] border-[#262a35]'
                        }`}
                      >
                        {savedExperienceIds.has(opt.id) ? 'Saved' : 'Save'}
                      </button>

                      <button
                        onClick={() => setSelectedOptionForRedeem(opt)}
                        disabled={!opt.isEligible}
                        className="py-1.5 px-2 rounded-lg bg-[#e4e1a9] hover:bg-[#d8d598] text-[#171b26] font-bold text-[10px] cursor-pointer transition-all shadow-sm disabled:opacity-40"
                      >
                        Redeem
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* 4. EXPERIENCE DISCOVERY: SECTIONS & CARDS                 */}
      {/* For You, Near You, Because You Earned Credits, etc.      */}
      {/* ======================================================== */}
      <div className="bg-[#141824] border border-[#262a35] rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-[#e4e1a9]" />
              <h3 className="text-base font-bold text-[#dfe2f0]">Experience Discovery</h3>
            </div>
            <p className="text-xs text-[#939183] mt-0.5">
              Explore unlockable experiences, partner retreats, and creator activities.
            </p>
          </div>

          {/* Discovery Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {[
              { id: 'for-you', label: 'For You' },
              { id: 'near-you', label: 'Near You' },
              { id: 'because-earned', label: 'Because You Earned Credits' },
              { id: 'trending', label: 'Trending' },
              { id: 'creators', label: 'From Creators' },
              { id: 'brands', label: 'From Brands' },
              { id: 'unlockable', label: 'Experiences You Can Unlock' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveDiscoveryTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-mono text-[11px] transition-all cursor-pointer ${
                  activeDiscoveryTab === tab.id
                    ? 'bg-[#e4e1a9] text-[#171b26] font-bold shadow-sm'
                    : 'bg-[#10141f] text-[#939183] hover:text-[#dfe2f0] border border-[#262a35]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Discovery Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredDiscovery.map((item) => (
            <div
              key={item.id}
              className="bg-[#10141f] border border-[#262a35] hover:border-[#e4e1a9]/50 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between transition-all group"
            >
              {/* Image & Header */}
              <div className="space-y-3">
                <div className="relative h-36 w-full overflow-hidden bg-[#171b26]">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[#e4e1a9] font-bold border border-white/10">
                      {item.category}
                    </span>
                    {item.isTrending && (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-rose-500/80 backdrop-blur-md text-white font-bold">
                        Trending
                      </span>
                    )}
                  </div>

                  <div className="absolute top-2.5 right-2.5">
                    <button
                      onClick={() => toggleSave(item.id, item.title)}
                      className={`p-1.5 rounded-full backdrop-blur-md transition-colors cursor-pointer ${
                        savedExperienceIds.has(item.id)
                          ? 'bg-[#e4e1a9] text-[#171b26]'
                          : 'bg-black/60 text-[#dfe2f0] hover:text-[#e4e1a9]'
                      }`}
                      title={savedExperienceIds.has(item.id) ? 'Saved' : 'Save Experience'}
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 pt-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#dfe2f0] truncate">{item.partner}</span>
                    <span className="font-mono text-sm font-bold text-[#e4e1a9]">
                      {item.credits} CRD
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-[#dfe2f0] group-hover:text-[#e4e1a9] transition-colors leading-snug line-clamp-2">
                    {item.title}
                  </h4>

                  {/* Why recommended badge */}
                  <div className="p-2 rounded-lg bg-[#141824] border border-[#262a35] text-[10px] text-[#cac7b8] leading-tight">
                    <strong className="text-[#e4e1a9]">Why:</strong> {item.whyRecommended}
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-[#939183] pt-1">
                    <span>{item.availability}</span>
                    {item.distance && <span>{item.distance}</span>}
                  </div>
                </div>
              </div>

              {/* Action Buttons: [Explore], [Save], [Redeem] */}
              <div className="p-4 pt-0 border-t border-[#262a35] mt-3 pt-3 grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => {
                    if (item.poolId) {
                      setSelectedPoolId(item.poolId);
                      navigate(`/pools/${item.poolId}`);
                    } else {
                      navigate('/pools');
                    }
                  }}
                  className="py-1.5 px-2 rounded-lg bg-[#141824] hover:bg-[#1b1f2a] text-[#dfe2f0] text-center text-[10px] font-medium border border-[#262a35] cursor-pointer"
                >
                  Explore
                </button>

                <button
                  onClick={() => toggleSave(item.id, item.title)}
                  className={`py-1.5 px-2 rounded-lg text-center text-[10px] font-medium border cursor-pointer ${
                    savedExperienceIds.has(item.id)
                      ? 'bg-[#1b1f2a] text-[#e4e1a9] border-[#e4e1a9]/50'
                      : 'bg-[#141824] hover:bg-[#1b1f2a] text-[#cac7b8] border-[#262a35]'
                  }`}
                >
                  {savedExperienceIds.has(item.id) ? 'Saved' : 'Save'}
                </button>

                <button
                  onClick={() => {
                    setSelectedOptionForRedeem({
                      id: item.id,
                      label: 'DIRECT',
                      title: item.title,
                      creditsRequired: item.credits,
                      partner: item.partner,
                      category: item.category,
                      availability: item.availability,
                      remainingUnits: 15,
                      expiration: 'Valid 30 days',
                      whyRecommended: item.whyRecommended,
                      poolId: item.poolId || 'pool-city-life',
                      benefitId: item.id,
                      isEligible: availableCredit >= item.credits,
                    });
                  }}
                  disabled={availableCredit < item.credits}
                  className="py-1.5 px-2 rounded-lg bg-[#e4e1a9] hover:bg-[#d8d598] text-[#171b26] font-bold text-[10px] cursor-pointer transition-all shadow-sm disabled:opacity-40"
                >
                  Redeem
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 5. REDEMPTION CONFIRMATION MODAL                         */}
      {/* Benefit, Credits required, Remaining balance,            */}
      {/* Expiration, Partner, Terms, "Redeem 500 Credits?"        */}
      {/* [Confirm Redemption]                                     */}
      {/* ======================================================== */}
      {selectedOptionForRedeem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#141824] border border-[#e4e1a9]/60 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-[#262a35]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#1b1f2a] border border-[#e4e1a9]/40 text-[#e4e1a9] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[#e4e1a9]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#dfe2f0]">
                    Confirm Benefit Redemption
                  </h3>
                  <div className="text-[10px] font-mono text-[#939183]">
                    Deterministic Balance &amp; Ledger Check
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedOptionForRedeem(null)}
                className="p-1 rounded-lg text-[#939183] hover:text-[#dfe2f0] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Prompt Heading */}
            <div className="text-center py-2 space-y-1">
              <div className="text-lg font-bold text-[#dfe2f0]">
                Redeem {selectedOptionForRedeem.creditsRequired.toLocaleString()} Credits?
              </div>
              <p className="text-xs text-[#cac7b8]">
                For <strong className="text-[#e4e1a9]">{selectedOptionForRedeem.title}</strong>
              </p>
            </div>

            {/* Detailed Financial & Terms Summary */}
            <div className="p-4 rounded-xl bg-[#0c1019] border border-[#262a35] space-y-2.5 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-[#939183]">Partner:</span>
                <span className="text-[#dfe2f0] font-sans font-medium">{selectedOptionForRedeem.partner}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#939183]">Credits Required:</span>
                <span className="text-amber-300 font-bold">-{selectedOptionForRedeem.creditsRequired.toLocaleString()} CRD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#939183]">Current Balance:</span>
                <span className="text-[#dfe2f0]">{availableCredit.toLocaleString()} CRD</span>
              </div>
              <div className="pt-2 border-t border-[#262a35] flex justify-between font-bold">
                <span className="text-[#dfe2f0]">Remaining Balance:</span>
                <span className="text-[#e4e1a9]">
                  {(availableCredit - selectedOptionForRedeem.creditsRequired).toLocaleString()} CRD
                </span>
              </div>
              <div className="flex justify-between text-[11px] pt-1">
                <span className="text-[#939183]">Expiration:</span>
                <span className="text-[#dfe2f0]">{selectedOptionForRedeem.expiration || 'Valid for 30 days'}</span>
              </div>
            </div>

            {/* Terms and conditions */}
            <div className="p-3 rounded-lg bg-[#141824] border border-[#262a35] text-[11px] text-[#939183] leading-relaxed space-y-1">
              <div className="font-bold text-[#cac7b8]">Terms &amp; Conditions:</div>
              <p>
                Valid for single patron entry or fulfillment. Non-transferable. Present the cryptographic QR pass at merchant checkout.
              </p>
            </div>

            {redemptionError && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{redemptionError}</span>
              </div>
            )}

            {/* CTAs */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedOptionForRedeem(null)}
                disabled={isProcessingRedeem}
                className="flex-1 py-2.5 rounded-xl bg-[#1b1f2a] hover:bg-[#262a35] text-xs font-semibold text-[#cac7b8] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRedemption}
                disabled={isProcessingRedeem}
                className="flex-1 py-2.5 rounded-xl bg-[#e4e1a9] hover:bg-[#d8d598] text-[#171b26] font-bold text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
              >
                {isProcessingRedeem ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-[#171b26] border-t-transparent rounded-full animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Confirm Redemption</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
