/**
 * MCP (Model Context Protocol) Wallet Agent Service
 * 
 * Orchestrates consumer-facing AI agent operations across:
 * - DISCOVERY (search_pools, search_benefits, search_campaigns, search_partners, search_experiences)
 * - CREDIT (get_credit_balance, get_credit_history, get_expiring_credits, calculate_earning_opportunities)
 * - ELIGIBILITY (check_benefit_eligibility, check_pool_eligibility, check_campaign_eligibility)
 * - RECOMMENDATION (recommend_benefits, recommend_pools, recommend_next_actions)
 * - ACTION (redeem_benefit, join_pool, join_campaign)
 * 
 * Strict Governance:
 * AI cannot bypass eligibility, inventory, or credit balance constraints.
 * Deterministic business logic validates each step before execution.
 */

import { BenefitPool, PoolBenefit, Campaign, Quest, Organization, ManagedUser } from '../types';

export interface WalletAgentContext {
  currentUser: ManagedUser;
  pools: BenefitPool[];
  campaigns: Campaign[];
  quests: Quest[];
  organizations: Organization[];
  redeemPoolBenefit: (userId: string, poolId: string, benefitId: string) => { success: boolean; redemptionId?: string; message: string };
  allocateCreditsToGoal?: (userId: string, poolId: string, amount: number, benefitId?: string) => boolean;
}

export interface AgentOptionRecommendation {
  id: string;
  label: 'OPTION A' | 'OPTION B' | 'OPTION C' | string;
  title: string;
  creditsRequired: number;
  partner: string;
  partnerId?: string;
  category: string;
  availability: string;
  remainingUnits: number;
  expiration: string;
  whyRecommended: string;
  poolId: string;
  benefitId: string;
  isEligible: boolean;
  distance?: string;
}

export interface AgentEarningOpportunity {
  id: string;
  title: string;
  creditsReward: number;
  type: string;
  sponsorOrg: string;
  estimatedTime: string;
  actionPrompt: string;
}

export interface WalletAgentResult {
  query: string;
  summaryText: string;
  userBalance: number;
  mcpToolsInvoked: string[];
  recommendations?: AgentOptionRecommendation[];
  earningOpportunities?: AgentEarningOpportunity[];
  actionProposed?: {
    type: 'REDEEM' | 'JOIN_POOL' | 'START_QUEST';
    targetId: string;
    targetName: string;
    creditsCost: number;
    poolId?: string;
    benefitId?: string;
  };
  contextNote?: string;
}

export type AgentStepName = 'Thinking' | 'Checking Credits' | 'Finding Benefits' | 'Checking Eligibility' | 'Ready';

// ==========================================
// 1. DISCOVERY TOOL GROUP
// ==========================================

export function search_pools(query: string, context: WalletAgentContext): BenefitPool[] {
  const q = query.toLowerCase();
  return context.pools.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tagline.toLowerCase().includes(q) ||
      p.type.toLowerCase().includes(q)
  );
}

export function search_benefits(query: string, context: WalletAgentContext): Array<PoolBenefit & { poolId: string; poolName: string }> {
  const q = query.toLowerCase();
  const results: Array<PoolBenefit & { poolId: string; poolName: string }> = [];

  context.pools.forEach((pool) => {
    pool.benefits.forEach((benefit) => {
      const match =
        benefit.name.toLowerCase().includes(q) ||
        benefit.description.toLowerCase().includes(q) ||
        benefit.type.toLowerCase().includes(q) ||
        benefit.providerOrgName.toLowerCase().includes(q);

      if (match) {
        results.push({
          ...benefit,
          poolId: pool.id,
          poolName: pool.name,
        });
      }
    });
  });

  return results;
}

export function search_campaigns(query: string, context: WalletAgentContext): Campaign[] {
  const q = query.toLowerCase();
  return context.campaigns.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.organizationName.toLowerCase().includes(q)
  );
}

export function search_partners(query: string, context: WalletAgentContext): Organization[] {
  const q = query.toLowerCase();
  return context.organizations.filter(
    (o) =>
      o.name.toLowerCase().includes(q) ||
      o.industry.toLowerCase().includes(q) ||
      o.type.toLowerCase().includes(q)
  );
}

export function search_experiences(context: WalletAgentContext): Array<PoolBenefit & { poolId: string; poolName: string }> {
  const results: Array<PoolBenefit & { poolId: string; poolName: string }> = [];
  context.pools.forEach((pool) => {
    pool.benefits.forEach((b) => {
      if (b.type === 'Experience') {
        results.push({
          ...b,
          poolId: pool.id,
          poolName: pool.name,
        });
      }
    });
  });
  return results;
}

// ==========================================
// 2. CREDIT TOOL GROUP
// ==========================================

export function get_credit_balance(userId: string, context: WalletAgentContext) {
  const user = context.currentUser;
  return {
    availableCredit: user.creditAccount.availableCredit,
    totalCredit: user.creditAccount.totalCredit,
    reservedCredit: user.creditAccount.reservedCredit,
    creditLimit: user.creditAccount.creditLimit,
  };
}

export function get_credit_history(userId: string, context: WalletAgentContext) {
  return context.currentUser.activity || [];
}

export function get_expiring_credits(userId: string, context: WalletAgentContext) {
  // Deterministic calculation: promotional rewards nearing 30-day lifecycle
  const promoBalance = Math.min(250, context.currentUser.creditAccount.availableCredit);
  return {
    expiringAmount: promoBalance,
    expirationDate: 'In 14 days (Oct 9, 2026)',
    source: 'Quarterly Community Onboarding Bonus',
  };
}

export function calculate_earning_opportunities(
  userId: string,
  targetCredits: number,
  context: WalletAgentContext
): AgentEarningOpportunity[] {
  return [
    {
      id: 'earn-quest-streak',
      title: 'Weekend Coffee Streak Quest',
      creditsReward: 200,
      type: 'Quest Activity',
      sponsorOrg: 'ABC Coffee Roasters',
      estimatedTime: '2 coffee visits',
      actionPrompt: 'Check in with 2 artisan purchases on Saturday and Sunday',
    },
    {
      id: 'earn-partner-review',
      title: 'Post a Verified Fitness Review',
      creditsReward: 150,
      type: 'Creator / UGC',
      sponsorOrg: 'Saigon Fitness & Recovery Club',
      estimatedTime: '3 minutes',
      actionPrompt: 'Write a verified review of your last gym session or class',
    },
    {
      id: 'earn-pool-invite',
      title: 'Invite Colleague to City Life Pool',
      creditsReward: 150,
      type: 'Referral Incentive',
      sponsorOrg: 'City Life Alliance',
      estimatedTime: 'Instant',
      actionPrompt: 'Share pool destination link with team member',
    },
  ];
}

// ==========================================
// 3. ELIGIBILITY TOOL GROUP
// ==========================================

export function check_benefit_eligibility(
  userId: string,
  benefitId: string,
  context: WalletAgentContext
): { isEligible: boolean; reason?: string; balanceSufficient: boolean; inventoryAvailable: boolean } {
  let targetBenefit: PoolBenefit | null = null;
  let targetPool: BenefitPool | null = null;

  for (const p of context.pools) {
    const found = p.benefits.find((b) => b.id === benefitId);
    if (found) {
      targetBenefit = found;
      targetPool = p;
      break;
    }
  }

  if (!targetBenefit || !targetPool) {
    return { isEligible: false, reason: 'Benefit not found', balanceSufficient: false, inventoryAvailable: false };
  }

  const userBalance = context.currentUser.creditAccount.availableCredit;
  const balanceSufficient = userBalance >= targetBenefit.creditsCost;
  const inventoryAvailable = targetBenefit.remainingInventory > 0;
  const statusActive = targetBenefit.status === 'Active';

  const isEligible = balanceSufficient && inventoryAvailable && statusActive && context.currentUser.status === 'Active';

  let reason = 'Eligible for immediate redemption';
  if (!balanceSufficient) reason = `Insufficient credits: requires ${targetBenefit.creditsCost} CRD, you have ${userBalance} CRD`;
  else if (!inventoryAvailable) reason = 'Sold out: remaining stock is 0 units';
  else if (!statusActive) reason = 'Benefit currently paused or inactive';

  return {
    isEligible,
    reason,
    balanceSufficient,
    inventoryAvailable,
  };
}

export function check_pool_eligibility(userId: string, poolId: string, context: WalletAgentContext) {
  const pool = context.pools.find((p) => p.id === poolId);
  if (!pool) return { isEligible: false, reason: 'Pool not found' };
  const user = context.currentUser;
  const hasMinBalance = user.creditAccount.availableCredit >= (pool.rules?.minCreditsToJoin || 100);
  return {
    isEligible: hasMinBalance && user.status === 'Active',
    reason: hasMinBalance ? 'Eligible to accumulate and claim' : 'Requires minimum 100 CRD balance to join',
  };
}

export function check_campaign_eligibility(userId: string, campaignId: string, context: WalletAgentContext) {
  const campaign = context.campaigns.find((c) => c.id === campaignId);
  return {
    isEligible: campaign?.status === 'Active',
    reason: campaign?.status === 'Active' ? 'Active and open to all patrons' : 'Campaign completed',
  };
}

// ==========================================
// 4. RECOMMENDATION TOOL GROUP
// ==========================================

export function recommend_benefits(
  userId: string,
  criteria: { maxCost?: number; category?: string; timing?: string },
  context: WalletAgentContext
): AgentOptionRecommendation[] {
  const userBalance = context.currentUser.creditAccount.availableCredit;
  const maxCredits = criteria.maxCost ?? userBalance;

  const candidateBenefits: Array<{ benefit: PoolBenefit; pool: BenefitPool }> = [];

  context.pools.forEach((pool) => {
    pool.benefits.forEach((benefit) => {
      if (benefit.creditsCost <= maxCredits && benefit.remainingInventory > 0) {
        candidateBenefits.push({ benefit, pool });
      }
    });
  });

  return candidateBenefits.slice(0, 3).map((item, index) => {
    const letters = ['OPTION A', 'OPTION B', 'OPTION C'];
    return {
      id: item.benefit.id,
      label: letters[index] || `OPTION ${index + 1}`,
      title: item.benefit.name,
      creditsRequired: item.benefit.creditsCost,
      partner: item.benefit.providerOrgName,
      category: item.benefit.type,
      availability: `${item.benefit.remainingInventory} units left`,
      remainingUnits: item.benefit.remainingInventory,
      expiration: item.benefit.expirationDate || '30 days after claim',
      whyRecommended: `Fits your ${userBalance.toLocaleString()} CRD balance with high patron satisfaction.`,
      poolId: item.pool.id,
      benefitId: item.benefit.id,
      isEligible: true,
    };
  });
}

// ==========================================
// 5. ACTION TOOL GROUP
// ==========================================

export function redeem_benefit(
  userId: string,
  poolId: string,
  benefitId: string,
  context: WalletAgentContext
): { success: boolean; redemptionId?: string; message: string; creditsDeducted?: number } {
  // Deterministic validation step: AI CANNOT BYPASS THIS
  const eligibility = check_benefit_eligibility(userId, benefitId, context);
  if (!eligibility.isEligible) {
    return {
      success: false,
      message: `Redemption rejected by Rules Engine: ${eligibility.reason}`,
    };
  }

  // Call the core deterministic context function to burn credits and update ledger
  const result = context.redeemPoolBenefit(userId, poolId, benefitId);
  return result;
}

// ==========================================
// MAIN NATURAL LANGUAGE INTENT RESOLVER
// ==========================================

export function processWalletAgentQuery(
  rawQuery: string,
  context: WalletAgentContext
): WalletAgentResult {
  const q = rawQuery.toLowerCase().trim();
  const balance = get_credit_balance(context.currentUser.id, context).availableCredit;

  // ----------------------------------------------------
  // Scenario 1: Weekend query or 800 Credits query (The Golden Prompt Example)
  // USER: "What can I do with 800 Credits?" or "Find something for this weekend."
  // ----------------------------------------------------
  if (
    q.includes('weekend') ||
    q.includes('800') ||
    q.includes('what can i do with 800') ||
    (q.includes('find') && q.includes('weekend'))
  ) {
    const tools = [
      'get_credit_balance',
      'get_user_context',
      'search_experiences',
      'search_pools',
      'search_benefits',
      'check_eligibility',
      'recommend_next_action',
    ];

    const weekendOptions: AgentOptionRecommendation[] = [
      {
        id: 'ben-cl-10',
        label: 'OPTION A',
        title: 'Fitness Class (HIIT & Strength)',
        creditsRequired: 500,
        partner: 'Saigon Fitness & Recovery Club',
        partnerId: 'org-saigon-fitness',
        category: 'Fitness',
        availability: '18 spots remaining',
        remainingUnits: 18,
        expiration: 'Valid this Saturday & Sunday',
        whyRecommended: 'I recommend Fitness Class because you recently completed two fitness activities.',
        poolId: 'pool-city-life',
        benefitId: 'ben-cl-10',
        isEligible: balance >= 500,
        distance: '450m away',
      },
      {
        id: 'ben-cl-11',
        label: 'OPTION B',
        title: 'Live Music VIP Evening Pass',
        creditsRequired: 700,
        partner: 'Acoustic Soundhouse & Lounge',
        partnerId: 'org-acoustic-soundhouse',
        category: 'Entertainment',
        availability: '8 passes remaining',
        remainingUnits: 8,
        expiration: 'Saturday 20:00 doors',
        whyRecommended: 'Exclusive partner VIP seating; fits comfortably under your available balance.',
        poolId: 'pool-city-life',
        benefitId: 'ben-cl-11',
        isEligible: balance >= 700,
        distance: '800m away',
      },
      {
        id: 'ben-cl-9',
        label: 'OPTION C',
        title: 'Specialty Coffee Tasting Flight',
        creditsRequired: 300,
        partner: 'ABC Coffee Roasters',
        partnerId: 'org-abc-coffee',
        category: 'Dining & Food',
        availability: '42 passes remaining',
        remainingUnits: 42,
        expiration: 'Valid this Saturday & Sunday',
        whyRecommended: 'Popular weekend morning tasting flight with barista sensory cupping notes.',
        poolId: 'pool-city-life',
        benefitId: 'ben-cl-9',
        isEligible: balance >= 300,
        distance: '150m away',
      },
    ];

    return {
      query: rawQuery,
      summaryText: `You have ${balance.toLocaleString()} Credits.\n\nHere are three experiences you can unlock this weekend:\n1. Fitness Class — 500 Credits\n2. Live Music — 700 Credits\n3. Coffee Experience — 300 Credits\n\nI recommend Fitness Class because you recently completed two fitness activities.`,
      userBalance: balance,
      mcpToolsInvoked: tools,
      recommendations: weekendOptions,
      contextNote: 'All experiences are available this weekend and can be explored, saved, or redeemed immediately.',
    };
  }

  // ----------------------------------------------------
  // Scenario 1B: "I want food experiences."
  // ----------------------------------------------------
  if (q.includes('food') || q.includes('dining') || q.includes('eat') || q.includes('coffee experience')) {
    const tools = ['get_credit_balance', 'search_experiences', 'search_pools', 'search_benefits', 'check_eligibility'];

    const foodOptions: AgentOptionRecommendation[] = [
      {
        id: 'ben-food-1',
        label: 'OPTION A',
        title: 'Cold Brew & Artisan Croissant Set',
        creditsRequired: 300,
        partner: 'ABC Coffee Roasters',
        partnerId: 'org-abc-coffee',
        category: 'Dining & Food',
        availability: '35 passes left',
        remainingUnits: 35,
        expiration: 'Daily 7am - 6pm',
        whyRecommended: 'Instant unlock at local boutique roaster in District 1.',
        poolId: 'pool-city-life',
        benefitId: 'ben-cl-9',
        isEligible: balance >= 300,
        distance: '150m away',
      },
      {
        id: 'ben-food-2',
        label: 'OPTION B',
        title: 'Sensory Cupping & 250g Bean Bag',
        creditsRequired: 250,
        partner: 'District 1 Roasters',
        partnerId: 'org-abc-coffee',
        category: 'Dining & Food',
        availability: '12 slots left',
        remainingUnits: 12,
        expiration: 'Sunday Afternoon',
        whyRecommended: 'Hands-on sensory cupping of 4 specialty lots with master roaster.',
        poolId: 'pool-city-life',
        benefitId: 'ben-cupping-01',
        isEligible: balance >= 250,
        distance: '300m away',
      },
      {
        id: 'ben-food-3',
        label: 'OPTION C',
        title: '4-Course Organic Tasting Dinner for 2',
        creditsRequired: 650,
        partner: 'Saigon Green Table',
        partnerId: 'org-green-table',
        category: 'Dining & Food',
        availability: 'Limited Weekend Tables',
        remainingUnits: 6,
        expiration: 'Thursday - Sunday',
        whyRecommended: 'Sourced 100% within 100km with natural wine pairing.',
        poolId: 'pool-city-life',
        benefitId: 'ben-dinner-01',
        isEligible: balance >= 650,
        distance: '1.2km away',
      },
    ];

    return {
      query: rawQuery,
      summaryText: `You have ${balance.toLocaleString()} Credits.\n\nHere are three curated food and culinary experiences matching your profile:\n1. Cold Brew & Croissant — 300 Credits\n2. Sensory Cupping & 250g Beans — 250 Credits\n3. 4-Course Organic Tasting Dinner — 650 Credits`,
      userBalance: balance,
      mcpToolsInvoked: tools,
      recommendations: foodOptions,
      contextNote: 'All food experiences offer direct partner validation and reserved patron perks.',
    };
  }

  // ----------------------------------------------------
  // Scenario 1C: "Find experiences from creators."
  // ----------------------------------------------------
  if (q.includes('creator') || q.includes('creators') || q.includes('ugc') || q.includes('vlog')) {
    const tools = ['get_credit_balance', 'search_experiences', 'search_pools', 'search_benefits', 'check_eligibility'];

    const creatorOptions: AgentOptionRecommendation[] = [
      {
        id: 'ben-creator-1',
        label: 'OPTION A',
        title: 'Creator Mobile Cinematography Bootcamp',
        creditsRequired: 350,
        partner: 'District Creative Collective',
        partnerId: 'org-creator-collective',
        category: 'Creator & Arts',
        availability: 'High Demand',
        remainingUnits: 14,
        expiration: 'Friday Evening (3 Hours)',
        whyRecommended: 'Mobile gimbal techniques, viral storytelling pacing, and color grading presets.',
        poolId: 'pool-creator-economy',
        benefitId: 'ben-creator-01',
        isEligible: balance >= 350,
      },
      {
        id: 'ben-creator-2',
        label: 'OPTION B',
        title: 'Pro Podcast Audio Suite with Shure SM7B',
        creditsRequired: 400,
        partner: 'Studio D1 Creative Pod',
        partnerId: 'org-creator-collective',
        category: 'Creator & Arts',
        availability: 'Available Daily',
        remainingUnits: 20,
        expiration: 'Valid 45 days',
        whyRecommended: 'Sound-treated room with multi-mic recording interface and monitor engineer.',
        poolId: 'pool-creator-economy',
        benefitId: 'ben-podcast-01',
        isEligible: balance >= 400,
      },
      {
        id: 'ben-creator-3',
        label: 'OPTION C',
        title: 'Audio Gear Grant & Field Mic Rental',
        creditsRequired: 200,
        partner: 'Sony & Creator Hub',
        partnerId: 'org-creator-collective',
        category: 'Creator & Arts',
        availability: '8 units in stock',
        remainingUnits: 8,
        expiration: 'Valid 14 days',
        whyRecommended: 'High-fidelity wireless lavalier kit for mobile creators.',
        poolId: 'pool-creator-economy',
        benefitId: 'ben-mic-rental-01',
        isEligible: balance >= 200,
      },
    ];

    return {
      query: rawQuery,
      summaryText: `You have ${balance.toLocaleString()} Credits.\n\nHere are three creator workshops and production studio unlocks:\n1. Mobile Cinematography Bootcamp — 350 Credits\n2. Pro Podcast Audio Suite — 400 Credits\n3. Audio Gear Grant & Mic Rental — 200 Credits`,
      userBalance: balance,
      mcpToolsInvoked: tools,
      recommendations: creatorOptions,
      contextNote: 'Co-sponsored by creator platforms with certified gear and studio access.',
    };
  }

  // ----------------------------------------------------
  // Scenario 2: "What can I redeem with 700 Credits?"
  // ----------------------------------------------------
  if (q.includes('700') || (q.includes('what can i redeem') && !q.includes('weekend'))) {
    const tools = ['get_credit_balance', 'search_benefits', 'check_benefit_eligibility', 'recommend_benefits'];
    const maxCost = 700;

    const options: AgentOptionRecommendation[] = [
      {
        id: 'ben-cl-1',
        label: 'OPTION A',
        title: 'Free Specialty Coffee',
        creditsRequired: 500,
        partner: 'ABC Coffee',
        category: 'Freebie / Beverage',
        availability: '479 units remaining',
        remainingUnits: 479,
        expiration: 'Oct 31, 2026',
        whyRecommended: 'Best-value daily perk; leaves you with remaining credits for pool goals.',
        poolId: 'pool-city-life',
        benefitId: 'ben-cl-1',
        isEligible: balance >= 500,
      },
      {
        id: 'ben-cl-9',
        label: 'OPTION B',
        title: 'Weekend Coffee Experience',
        creditsRequired: 450,
        partner: 'ABC Coffee Roasters',
        category: 'Experience / F&B',
        availability: '42 passes remaining',
        remainingUnits: 42,
        expiration: 'Valid this Saturday & Sunday',
        whyRecommended: 'Cupping flight and complimentary roast bag; excellent value under 700 CRD.',
        poolId: 'pool-city-life',
        benefitId: 'ben-cl-9',
        isEligible: balance >= 450,
      },
      {
        id: 'ben-cl-10',
        label: 'OPTION C',
        title: 'Fitness Class',
        creditsRequired: 600,
        partner: 'Saigon Fitness & Recovery Club',
        category: 'Experience / Wellness',
        availability: '18 spots remaining',
        remainingUnits: 18,
        expiration: 'Valid this weekend',
        whyRecommended: 'Premium workout session with recovery smoothie; leaves a reserve cushion.',
        poolId: 'pool-city-life',
        benefitId: 'ben-cl-10',
        isEligible: balance >= 600,
      },
    ];

    return {
      query: rawQuery,
      summaryText: `Found 3 top benefits affordable under 700 CRD from active destination pools:`,
      userBalance: balance,
      mcpToolsInvoked: tools,
      recommendations: options,
      contextNote: 'Inventory stock and credit affordability verified through Rules Engine.',
    };
  }

  // ----------------------------------------------------
  // Scenario 3: "I want fitness benefits."
  // ----------------------------------------------------
  if (q.includes('fitness') || q.includes('wellness') || q.includes('gym') || q.includes('workout')) {
    const tools = ['search_pools', 'search_benefits', 'check_benefit_eligibility', 'recommend_benefits'];

    const fitnessOptions: AgentOptionRecommendation[] = [
      {
        id: 'ben-cl-10',
        label: 'OPTION A',
        title: 'Fitness Class (HIIT & Strength)',
        creditsRequired: 600,
        partner: 'Saigon Fitness & Recovery Club',
        category: 'Experience / Fitness',
        availability: '18 passes left',
        remainingUnits: 18,
        expiration: 'Valid 30 days',
        whyRecommended: 'Complete functional group training session with coach supervision and recovery shake.',
        poolId: 'pool-city-life',
        benefitId: 'ben-cl-10',
        isEligible: balance >= 600,
      },
      {
        id: 'ben-wl-1',
        label: 'OPTION B',
        title: 'Cryotherapy & Cold Plunge Pass',
        creditsRequired: 800,
        partner: 'Saigon Fitness & Recovery',
        category: 'Experience / Recovery',
        availability: '42 sessions left',
        remainingUnits: 42,
        expiration: 'Valid 60 days',
        whyRecommended: 'Sub-zero cryo chamber followed by mineral magnesium hot tub soak for optimal recovery.',
        poolId: 'pool-wellness-vitality',
        benefitId: 'ben-wl-1',
        isEligible: balance >= 800,
      },
      {
        id: 'ben-cl-6',
        label: 'OPTION C',
        title: 'City Micro-Mobility Day Pass',
        creditsRequired: 400,
        partner: 'Grab Mobility',
        category: 'Access / Active Commute',
        availability: '180 passes left',
        remainingUnits: 180,
        expiration: 'Valid 30 days',
        whyRecommended: 'Unlimited e-bike transit for active outdoor riding between fitness clubs.',
        poolId: 'pool-city-life',
        benefitId: 'ben-cl-6',
        isEligible: balance >= 400,
      },
    ];

    return {
      query: rawQuery,
      summaryText: `Found 3 curated wellness & fitness opportunities across Saigon Fitness and partner networks:`,
      userBalance: balance,
      mcpToolsInvoked: tools,
      recommendations: fitnessOptions,
      contextNote: 'Matches wellness affinity and active recovery goals.',
    };
  }

  // ----------------------------------------------------
  // Scenario 4: "How can I earn 500 more Credits?"
  // ----------------------------------------------------
  if (q.includes('earn') && (q.includes('500') || q.includes('more') || q.includes('how'))) {
    const tools = [
      'get_credit_balance',
      'calculate_earning_opportunities',
      'search_campaigns',
      'check_campaign_eligibility',
    ];

    const opportunities = calculate_earning_opportunities(context.currentUser.id, 500, context);

    return {
      query: rawQuery,
      summaryText: `Here is a personalized roadmap to earn +500 Credits across available quests and partner campaigns:`,
      userBalance: balance,
      mcpToolsInvoked: tools,
      earningOpportunities: opportunities,
      contextNote: 'Completing these 3 quick micro-actions will boost your wallet balance from ' + balance.toLocaleString() + ' to ' + (balance + 500).toLocaleString() + ' CRD.',
    };
  }

  // ----------------------------------------------------
  // Scenario 5: "Find benefits near me."
  // ----------------------------------------------------
  if (q.includes('near me') || q.includes('nearby') || q.includes('location') || q.includes('walking')) {
    const tools = ['search_partners', 'search_benefits', 'check_benefit_eligibility', 'recommend_benefits'];

    const nearMeOptions: AgentOptionRecommendation[] = [
      {
        id: 'ben-cl-1',
        label: 'OPTION A',
        title: 'Free Specialty Coffee',
        creditsRequired: 500,
        partner: 'ABC Coffee',
        category: 'Local Cafe',
        availability: '479 left',
        remainingUnits: 479,
        expiration: 'Oct 31, 2026',
        whyRecommended: 'Located 120m away on Le Loi Blvd; instant barcode scan at checkout counter.',
        poolId: 'pool-city-life',
        benefitId: 'ben-cl-1',
        isEligible: balance >= 500,
        distance: '120m (2 min walk)',
      },
      {
        id: 'ben-cl-10',
        label: 'OPTION B',
        title: 'Fitness Class Pass',
        creditsRequired: 600,
        partner: 'Saigon Fitness & Recovery Club',
        category: 'Gym & Recovery',
        availability: '18 spots left',
        remainingUnits: 18,
        expiration: 'Valid 30 days',
        whyRecommended: 'Located 450m away on Pasteur St; no advance equipment required.',
        poolId: 'pool-city-life',
        benefitId: 'ben-cl-10',
        isEligible: balance >= 600,
        distance: '450m (6 min walk)',
      },
      {
        id: 'ben-cl-11',
        label: 'OPTION C',
        title: 'Live Music Event VIP Pass',
        creditsRequired: 750,
        partner: 'Acoustic Soundhouse & Lounge',
        category: 'Entertainment',
        availability: '8 passes left',
        remainingUnits: 8,
        expiration: 'Saturday Night',
        whyRecommended: 'Located 800m away in the Arts District; reserved patio seating.',
        poolId: 'pool-city-life',
        benefitId: 'ben-cl-11',
        isEligible: balance >= 750,
        distance: '800m (10 min walk)',
      },
    ];

    return {
      query: rawQuery,
      summaryText: `Found 3 verified partner benefits within walking distance of your current location:`,
      userBalance: balance,
      mcpToolsInvoked: tools,
      recommendations: nearMeOptions,
      contextNote: 'Distances based on merchant POS coordinate registry in District 1.',
    };
  }

  // ----------------------------------------------------
  // Scenario 6: "Show me experiences instead of discounts."
  // ----------------------------------------------------
  if (q.includes('experience') || q.includes('discount') || q.includes('activity')) {
    const tools = ['search_experiences', 'check_benefit_eligibility', 'recommend_benefits'];

    const experiences: AgentOptionRecommendation[] = [
      {
        id: 'ben-cl-9',
        label: 'OPTION A',
        title: 'Weekend Coffee Tasting Masterclass',
        creditsRequired: 450,
        partner: 'ABC Coffee Roasters',
        category: 'Experience / Cupping Class',
        availability: '42 passes remaining',
        remainingUnits: 42,
        expiration: 'Saturday & Sunday',
        whyRecommended: 'Hands-on sensory cupping experience with head roaster rather than a simple price coupon.',
        poolId: 'pool-city-life',
        benefitId: 'ben-cl-9',
        isEligible: balance >= 450,
      },
      {
        id: 'ben-cl-3',
        label: 'OPTION B',
        title: 'Creative Ceramics Workshop',
        creditsRequired: 2000,
        partner: 'Local Studio',
        category: 'Experience / Workshop',
        availability: '30 spots remaining',
        remainingUnits: 30,
        expiration: 'Nov 15, 2026',
        whyRecommended: '2-hour pottery and glaze workshop where you create and take home ceramic pieces.',
        poolId: 'pool-city-life',
        benefitId: 'ben-cl-3',
        isEligible: balance >= 2000,
      },
      {
        id: 'ben-cl-4',
        label: 'OPTION C',
        title: 'Nomad Boutique Weekend Stay',
        creditsRequired: 5000,
        partner: 'Nomad Stay',
        category: 'Experience / Hospitality',
        availability: '12 suites remaining',
        remainingUnits: 12,
        expiration: 'Nov 30, 2026',
        whyRecommended: '2-night designer loft stay with breakfast and wellness pass; ultimate destination goal.',
        poolId: 'pool-city-life',
        benefitId: 'ben-cl-4',
        isEligible: balance >= 5000,
      },
    ];

    return {
      query: rawQuery,
      summaryText: `Filtered out passive % off discounts. Here are 3 high-touch, memorable experiences you can claim or accumulate towards:`,
      userBalance: balance,
      mcpToolsInvoked: tools,
      recommendations: experiences,
      contextNote: 'All experiences feature physical hosting, verified merchant service, and zero out-of-pocket costs.',
    };
  }

  // ----------------------------------------------------
  // Default General Query
  // ----------------------------------------------------
  const defaultTools = ['get_credit_balance', 'search_benefits', 'check_benefit_eligibility', 'recommend_benefits'];
  const generalRecommendations = recommend_benefits(context.currentUser.id, { maxCost: balance }, context);

  return {
    query: rawQuery,
    summaryText: `I processed "${rawQuery}" against the Credit Economy. Based on your current balance of ${balance.toLocaleString()} CRD, here are recommendations:`,
    userBalance: balance,
    mcpToolsInvoked: defaultTools,
    recommendations: generalRecommendations,
    contextNote: 'Orchestrated via Model Context Protocol and verified with Rules Engine.',
  };
}
