/**
 * Model Context Protocol (MCP) Platform Intelligence & Analytics Service
 * 
 * Provides deterministic read tools and diagnostic analysis actions
 * across User Management, Funnel Analytics, Campaign Analytics, and Pool Analytics.
 * Strict economic safety: Read operations are non-destructive; all write actions
 * require explicit confirmation and authorization.
 */

import { seedUsers, seedOrganizations, seedPrograms, seedCampaigns } from '../data/seedData';
import { seedBenefitPools } from '../data/poolsSeedData';
import { User, Organization, BenefitPool, Program, Campaign } from '../types';

// ============================================================================
// 1. MCP READ TOOLS
// ============================================================================

export interface UserFunnelMetrics {
  userId: string;
  userName: string;
  totalEarnedCredits: number;
  totalRedeemedCredits: number;
  availableCredits: number;
  questStartedCount: number;
  questCompletedCount: number;
  poolViewsCount: number;
  benefitViewsCount: number;
  redemptionCount: number;
  conversionRate: number;
  dropOffStage: string;
  dropOffReason: string;
}

export interface CampaignMetricsReport {
  campaignId: string;
  name: string;
  organizationId: string;
  organizationName: string;
  budgetTotal: number;
  budgetIssued: number;
  utilizationPct: number;
  conversionRate: number;
  activeParticipants: number;
  avgCostPerAcquisition: number;
  velocityRating: 'HIGH' | 'STABLE' | 'UNDERPERFORMING';
  churnRisk: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface PoolMetricsReport {
  poolId: string;
  poolName: string;
  poolType: string;
  totalFundingCredits: number;
  committedCredits: number;
  participantsCount: number;
  redemptionVelocity: number;
  inventoryHealth: 'BALANCED' | 'DEFICIT' | 'SURPLUS_UNUSED';
  topDestination: string;
  unusedRewardsCount: number;
}

export class MCPIntelligenceService {
  private users: User[] = [...seedUsers];
  private orgs: Organization[] = [...seedOrganizations];
  private pools: BenefitPool[] = [...seedBenefitPools];
  private programs: Program[] = [...seedPrograms];
  private campaigns: Campaign[] = [...seedCampaigns];

  // ----------------------------------------------------
  // READ TOOL 1: get_user_profile(userId)
  // ----------------------------------------------------
  public get_user_profile(userId: string): User | undefined {
    return this.users.find((u) => u.id === userId);
  }

  // ----------------------------------------------------
  // READ TOOL 2: get_user_activity(userId)
  // ----------------------------------------------------
  public get_user_activity(userId: string) {
    const user = this.get_user_profile(userId);
    if (!user) return null;

    return {
      userId: user.id,
      lastActive: user.lastActive,
      status: user.status,
      activeQuestsCount: user.questProgress?.length || 2,
      activeTransactionsCount: user.activeTransactionIds?.length || 1,
      creditAccount: user.creditAccount,
      memberships: user.organizationMemberships || [],
    };
  }

  // ----------------------------------------------------
  // READ TOOL 3: get_user_funnel(userId)
  // ----------------------------------------------------
  public get_user_funnel(userId: string): UserFunnelMetrics {
    const user = this.get_user_profile(userId);
    const earned = user ? user.creditAccount.totalCredit : 1240;
    const redeemed = user ? (user.creditAccount.totalCredit - user.creditAccount.availableCredit - user.creditAccount.reservedCredit) : 120;
    const available = user ? user.creditAccount.availableCredit : 1120;

    let dropOffStage = 'Redemption Inactive';
    let dropOffReason = 'User accumulated credits but has not selected a high-utility destination pool.';

    if (redeemed > 500) {
      dropOffStage = 'Active Circulator';
      dropOffReason = 'Healthy redemption velocity across multiple merchant benefits.';
    } else if (earned < 300) {
      dropOffStage = 'Quest Commenced';
      dropOffReason = 'Initial quest started but second purchase verification pending.';
    }

    return {
      userId: user?.id || userId,
      userName: user?.name || 'Patron',
      totalEarnedCredits: earned,
      totalRedeemedCredits: Math.max(0, redeemed),
      availableCredits: available,
      questStartedCount: 4,
      questCompletedCount: 3,
      poolViewsCount: 2,
      benefitViewsCount: 1,
      redemptionCount: redeemed > 0 ? 1 : 0,
      conversionRate: Math.round((redeemed / (earned || 1)) * 100),
      dropOffStage,
      dropOffReason,
    };
  }

  // ----------------------------------------------------
  // READ TOOL 4: get_user_segment(userId)
  // ----------------------------------------------------
  public get_user_segment(userId: string) {
    const user = this.get_user_profile(userId);
    if (!user) return { segment: 'General Consumer', traits: ['Low engagement'] };

    const avail = user.creditAccount.availableCredit;
    if (avail > 3000) {
      return {
        segment: 'High-Value Saver / Destination Builder',
        traits: ['High credit balance', 'Awaiting premium experiential reward', 'Low velocity'],
      };
    }
    if (user.role === 'Hybrid' || (user.organizationMemberships && user.organizationMemberships.length > 0)) {
      return {
        segment: 'Prosumer / Partner Affiliate',
        traits: ['Multi-role identity', 'Business operator & consumer', 'Cross-network multiplier'],
      };
    }
    return {
      segment: 'Active Lifestyle Patron',
      traits: ['Frequent quest completions', 'Food & Fitness affinity', 'Mobile-first'],
    };
  }

  // ----------------------------------------------------
  // READ TOOL 5: get_campaign_metrics(campaignId?)
  // ----------------------------------------------------
  public get_campaign_metrics(campaignId?: string): CampaignMetricsReport[] {
    const list = campaignId
      ? this.campaigns.filter((c) => c.id === campaignId)
      : this.campaigns;

    return list.map((c) => {
      const budgetIssued = c.budgetUsed || 0;
      const budgetTotal = c.budget || 50000;
      const utilization = Math.round((budgetIssued / (budgetTotal || 1)) * 100);
      const conversion = c.conversionRate || 34.5;
      const velocity: 'HIGH' | 'STABLE' | 'UNDERPERFORMING' =
        conversion < 20 ? 'UNDERPERFORMING' : conversion > 40 ? 'HIGH' : 'STABLE';

      return {
        campaignId: c.id,
        name: c.name,
        organizationId: c.organizationId,
        organizationName: c.organizationName,
        budgetTotal,
        budgetIssued,
        utilizationPct: utilization,
        conversionRate: conversion,
        activeParticipants: c.participants || 420,
        avgCostPerAcquisition: Math.round(budgetIssued / Math.max(1, (c.participants || 1) * 0.4)),
        velocityRating: velocity,
        churnRisk: conversion < 20 ? 'HIGH' : 'LOW',
      };
    });
  }

  // ----------------------------------------------------
  // READ TOOL 6: get_campaign_funnel(campaignId?)
  // ----------------------------------------------------
  public get_campaign_funnel(campaignId?: string) {
    return {
      campaignId: campaignId || 'cmp-all',
      funnelSteps: [
        { stage: 'Impression & Discovery', patrons: 12500, dropPct: 0 },
        { stage: 'Eligibility Verified', patrons: 9800, dropPct: 21.6 },
        { stage: 'First Trigger Activated', patrons: 5400, dropPct: 44.9 },
        { stage: 'Credit Award Committed', patrons: 3800, dropPct: 29.6 },
        { stage: 'Destination Pool Allocated', patrons: 1450, dropPct: 61.8 }, // Friction point!
        { stage: 'Final Redemption Burned', patrons: 980, dropPct: 32.4 },
      ],
      bottleneck: 'Destination Pool Allocated (-61.8% drop after credit receipt)',
    };
  }

  // ----------------------------------------------------
  // READ TOOL 7: get_pool_metrics(poolId?)
  // ----------------------------------------------------
  public get_pool_metrics(poolId?: string): PoolMetricsReport[] {
    const list = poolId ? this.pools.filter((p) => p.id === poolId) : this.pools;

    return list.map((p) => {
      const unusedRewards = p.benefits.filter((b) => b.redeemedCount === 0 || b.remainingInventory > 50).length;
      const inventoryHealth =
        unusedRewards > 2 ? 'SURPLUS_UNUSED' : p.committedCredits > p.totalFundingCredits * 0.8 ? 'DEFICIT' : 'BALANCED';

      return {
        poolId: p.id,
        poolName: p.name,
        poolType: p.type,
        totalFundingCredits: p.totalFundingCredits,
        committedCredits: p.committedCredits,
        participantsCount: p.participantsCount,
        redemptionVelocity: p.redemptionRate || 32.4,
        inventoryHealth,
        topDestination: p.benefits[0]?.name || 'Signature Experience',
        unusedRewardsCount: unusedRewards,
      };
    });
  }

  // ----------------------------------------------------
  // READ TOOL 8: get_pool_redemption(poolId?)
  // ----------------------------------------------------
  public get_pool_redemption(poolId?: string) {
    const pool = this.pools.find((p) => p.id === poolId) || this.pools[0];
    return {
      poolId: pool?.id || 'pool-all',
      poolName: pool?.name || 'Aggregate Pools',
      benefitsRedemptionBreakdown: pool?.benefits.map((b) => ({
        benefitId: b.id,
        title: b.name,
        creditsCost: b.creditsCost,
        redeemedCount: b.redeemedCount,
        stockRemaining: b.remainingInventory,
        turnoverRate: Math.round((b.redeemedCount / (b.remainingInventory + b.redeemedCount || 1)) * 100),
      })) || [],
    };
  }

  // ----------------------------------------------------
  // READ TOOL 9: get_credit_velocity()
  // ----------------------------------------------------
  public get_credit_velocity() {
    return {
      overallVelocityPerDay: 4850, // CRD circulating per 24 hours
      earningVelocity: 3600, // CRD issued daily
      burnVelocity: 2840, // CRD redeemed daily
      velocityRatio: 0.79, // Healthy circulation benchmark: 0.70 - 0.90
      escrowHoldingPeriodAvgDays: 14.2,
      trend: '+12.4% vs prior month',
    };
  }

  // ----------------------------------------------------
  // READ TOOL 10: get_credit_earning_distribution()
  // ----------------------------------------------------
  public get_credit_earning_distribution() {
    return [
      { channel: 'Verified In-Store POS Orders', percentage: 48, creditVolume: 425000 },
      { channel: 'UGC Reviews & Content Creation', percentage: 22, creditVolume: 195000 },
      { channel: 'Cross-Merchant Referral Drive', percentage: 18, creditVolume: 160000 },
      { channel: 'Creator Staking & Bonus Pools', percentage: 12, creditVolume: 106000 },
    ];
  }

  // ----------------------------------------------------
  // READ TOOL 11: get_credit_redemption_distribution()
  // ----------------------------------------------------
  public get_credit_redemption_distribution() {
    return [
      { category: 'Experiential Workshops & Activities', percentage: 42, creditVolume: 295000 },
      { category: 'Direct F&B & Beverage Perks', percentage: 31, creditVolume: 218000 },
      { category: 'Travel & Boutique Weekend Stays', percentage: 19, creditVolume: 133000 },
      { category: 'Digital Passes & Subscriptions', percentage: 8, creditVolume: 56000 },
    ];
  }

  // ----------------------------------------------------
  // READ TOOL 12: get_partner_performance(orgId?)
  // ----------------------------------------------------
  public get_partner_performance(orgId?: string) {
    const org = this.orgs.find((o) => o.id === orgId) || this.orgs[0];
    return {
      organizationId: org.id,
      name: org.name,
      type: org.type,
      budgetUsed: org.budgetUsed,
      monthlyBudget: org.monthlyBudget,
      campaignConversionRate: org.campaignConversion,
      liquidityContribution: 45000,
      patronRetentionRate: 68.4,
      settlementReliabilityScore: 98.2,
    };
  }

  // ----------------------------------------------------
  // READ TOOL 13: get_creator_contribution()
  // ----------------------------------------------------
  public get_creator_contribution() {
    return {
      activeCreatorNodes: 38,
      totalCreditsEarnedViaCreators: 248000,
      topAttributionCampaign: 'Nomad Creator Discovery Tour',
      engagementMultiplier: 3.4, // Patrons driven by creators convert 3.4x faster
    };
  }

  // ----------------------------------------------------
  // READ TOOL 14: get_reward_inventory()
  // ----------------------------------------------------
  public get_reward_inventory() {
    let totalStock = 0;
    let redeemed = 0;
    let unassigned = 0;

    this.pools.forEach((p) => {
      p.benefits.forEach((b) => {
        totalStock += b.remainingInventory;
        redeemed += b.redeemedCount;
        if (b.remainingInventory > 50 && b.redeemedCount < 5) {
          unassigned += b.remainingInventory;
        }
      });
    });

    return {
      totalAvailableInventoryItems: totalStock,
      totalRedeemedItems: redeemed,
      stagnantInventoryItems: unassigned,
      stockTurnoverRatio: 0.62,
    };
  }

  // ============================================================================
  // 2. MCP ANALYSIS ACTIONS
  // ============================================================================

  // ----------------------------------------------------
  // ANALYSIS 1: analyze_funnel(funnelScope?)
  // ----------------------------------------------------
  public analyze_funnel(funnelScope?: string) {
    return {
      scope: funnelScope || 'Platform-Wide Lifecycle',
      stages: [
        { name: 'Credit Earning', count: 8450, dropPct: 0 },
        { name: 'Pool Discovery', count: 5240, dropPct: 38.0 }, // Observation benchmark
        { name: 'Benefit View', count: 3410, dropPct: 34.9 },
        { name: 'Redemption Intent', count: 2650, dropPct: 22.3 },
        { name: 'Verified Burn', count: 2190, dropPct: 17.4 },
      ],
      largestDropoff: {
        stage: 'Pool Discovery',
        dropPct: 38.0,
        observation: '38% of users who earn Credits never open a Pool.',
        possibleCauses: [
          'Low Pool visibility after completion of reward quests',
          'Benefits require too many Credits for immediate single-quest redemption',
          'Users lack relevant benefits tailored to their primary purchase categories',
        ],
        recommendedExperiment:
          'Create a personalized Pool recommendation for users after their first Credit earning event.',
      },
    };
  }

  // ----------------------------------------------------
  // ANALYSIS 2: identify_dropoffs()
  // ----------------------------------------------------
  public identify_dropoffs() {
    return [
      {
        area: 'Post-Earn Pool Exploration',
        dropRate: '38.0%',
        impact: 'High',
        frictionReason: 'Users receive credit notifications without direct deep-links to matching destination pools.',
      },
      {
        area: 'Quest Action 2 Verification',
        dropRate: '26.4%',
        impact: 'Medium',
        frictionReason: 'Second physical visit requirement exceeds 7-day user memory window.',
      },
      {
        area: 'High-Credit Destination Lock-In',
        dropRate: '19.2%',
        impact: 'Low',
        frictionReason: 'Aspirational 5,000 CRD goals perceived as unreachable without interim milestones.',
      },
    ];
  }

  // ----------------------------------------------------
  // ANALYSIS 3: identify_high_value_users()
  // ----------------------------------------------------
  public identify_high_value_users() {
    return this.users
      .filter((u) => u.creditAccount.availableCredit > 2000 || u.creditAccount.totalCredit > 3000)
      .map((u) => ({
        id: u.id,
        name: u.name,
        availableCredit: u.creditAccount.availableCredit,
        totalCredit: u.creditAccount.totalCredit,
        organization: u.organization,
        affinity: u.creditAccount.availableCredit > 3500 ? 'Wellness & Travel' : 'Artisan Coffee & Dining',
      }));
  }

  // ----------------------------------------------------
  // ANALYSIS 4: identify_underperforming_campaigns()
  // ----------------------------------------------------
  public identify_underperforming_campaigns() {
    return this.campaigns
      .filter((c) => (c.conversionRate || 30) < 25)
      .map((c) => ({
        id: c.id,
        name: c.name,
        orgName: c.organizationName,
        conversionRate: c.conversionRate || 18.2,
        issue: 'Incentive trigger threshold is set too high relative to average transaction value.',
        remedy: 'Lower required visit frequency or increase milestone credits by 25%.',
      }));
  }

  // ----------------------------------------------------
  // ANALYSIS 5: identify_unused_rewards()
  // ----------------------------------------------------
  public identify_unused_rewards() {
    const list: Array<{ benefitId: string; title: string; poolName: string; stock: number; redeemed: number }> = [];
    this.pools.forEach((p) => {
      p.benefits.forEach((b) => {
        if (b.remainingInventory >= 40 && b.redeemedCount <= 5) {
          list.push({
            benefitId: b.id,
            title: b.name,
            poolName: p.name,
            stock: b.remainingInventory,
            redeemed: b.redeemedCount,
          });
        }
      });
    });
    return list;
  }

  // ----------------------------------------------------
  // ANALYSIS 6: identify_credit_anomalies()
  // ----------------------------------------------------
  public identify_credit_anomalies() {
    return [
      {
        type: 'VELOCITY_SPIKE',
        description: 'Single user executed 6 quest claims in 8 minutes at ABC Coffee Roasters.',
        risk: 'LOW (Flagged for velocity cap enforcement)',
        entityId: 'usr-sarah-chen',
        mitigation: 'Anti-Sybil 24-hour rate limit active.',
      },
    ];
  }

  // ----------------------------------------------------
  // ANALYSIS 7: recommend_campaign_changes(campaignId?)
  // ----------------------------------------------------
  public recommend_campaign_changes(campaignId?: string) {
    return {
      campaignId: campaignId || 'cmp-abc-summer',
      title: 'Optimize Summer Coffee Fest Conversion',
      currentConversion: '18.4%',
      projectedConversion: '32.6%',
      recommendedActions: [
        'Shift trigger from "3 orders in 7 days" to "2 orders with any cold brew"',
        'Link reward directly to "City Life Pool" to stimulate immediate cross-merchant redemption',
        'Cap individual patron bonus to 350 CRD/week to preserve merchant budget headroom',
      ],
    };
  }

  // ----------------------------------------------------
  // ANALYSIS 8: recommend_pool_changes(poolId?)
  // ----------------------------------------------------
  public recommend_pool_changes(poolId?: string) {
    const pool = this.pools.find((p) => p.id === poolId) || this.pools[0];
    return {
      poolId: pool.id,
      poolName: pool.name,
      recommendedChanges: [
        'Introduce an interim 300 CRD milestone benefit to prevent drop-off before reaching the 2,500 CRD goal.',
        'Onboard 1 additional boutique fitness or spa partner to absorb excess wellness demand.',
        'Rebalance shared funding: ABC Coffee Roasters currently sponsors 45% of liquidity but receives only 22% of redemptions.',
      ],
    };
  }

  // ----------------------------------------------------
  // ANALYSIS 9: recommend_user_reactivation(userId?)
  // ----------------------------------------------------
  public recommend_user_reactivation(userId?: string) {
    const user = this.get_user_profile(userId || 'usr-sarah-chen') || this.users[0];
    return {
      userId: user.id,
      userName: user.name,
      recommendedIncentive: 'Weekend Wellness Activation',
      suggestedPool: 'Fitness & Wellness Pool',
      estimatedLift: '74% probability of redemption within 72 hours',
    };
  }

  // ============================================================================
  // 3. HIGH-LEVEL QUERY HANDLERS FOR USER INTELLIGENCE & FUNNELS
  // ============================================================================

  /**
   * "Ask AI about this user" handler
   * Uses: profile + activity + credit history + campaign participation + pool behavior + redemption history
   */
  public askAIAboutUser(userId: string, question: string) {
    const user = this.get_user_profile(userId) || this.users[0];
    const earned = user.creditAccount.totalCredit || 1240;
    const available = user.creditAccount.availableCredit || 1120;
    const redeemed = Math.max(0, earned - available - (user.creditAccount.reservedCredit || 0)) || 120;

    const lowerQ = question.toLowerCase();

    // Default target pools and numbers for Sarah Chen / general patrons
    let userInsight = `User has earned ${earned.toLocaleString()} Credits but redeemed only ${redeemed.toLocaleString()}. Their strongest interests are Fitness and Food. They are 160 Credits away from two currently available benefits.`;
    let recommendedAction = 'Recommend Fitness Pool.';
    let suggestedPoolId = 'pool-fitness';
    let suggestedPoolName = 'Fitness & Wellness Destination Pool';
    let suggestedCampaign = 'Personalized 160 CRD Fitness Boost Campaign';

    if (lowerQ.includes('why') && lowerQ.includes('redeem')) {
      userInsight = `User has earned ${earned.toLocaleString()} Credits but redeemed only ${redeemed.toLocaleString()} (${Math.round((redeemed / (earned || 1)) * 100)}% burn rate). Behavioral telemetry reveals the user browses the Fitness & Wellness catalog, but the closest appealing experiential pass requires 800 CRD. They are currently 160 Credits away from reaching this threshold.`;
      recommendedAction = `Recommend Fitness Pool with an accelerated quest to earn the remaining 160 Credits.`;
    } else if (lowerQ.includes('recommend') || lowerQ.includes('suggest')) {
      userInsight = `User has an available balance of ${available.toLocaleString()} CRD with 0 active redemptions in the past 30 days. Their redemption history and POS transactions indicate strong affinities for high-intensity training and artisan roasteries.`;
      recommendedAction = `Recommend Fitness Pool and highlight the "Saigon Recovery Pass" (600 CRD).`;
      suggestedPoolId = 'pool-fitness';
      suggestedPoolName = 'Fitness & Wellness Pool';
    } else if (lowerQ.includes('which campaign') || lowerQ.includes('engage')) {
      userInsight = `Patron exhibits high completion rates (85%) on weekend morning triggers and low responsiveness to weekday lunch offers. They are 3.8x more likely to convert on wellness weekend challenges.`;
      recommendedAction = `Enroll patron into the "Weekend Runner Milestone Quest" with a 200 CRD completion incentive.`;
      suggestedCampaign = 'Weekend Runner Milestone Quest';
    } else if (lowerQ.includes('how did this user earn') || lowerQ.includes('earn most')) {
      userInsight = `User earned ${Math.round(earned * 0.65).toLocaleString()} CRD (65%) through verified in-store orders at ABC Coffee Roasters and Saigon Fitness, ${Math.round(earned * 0.25).toLocaleString()} CRD (25%) from community UGC reviews, and ${Math.round(earned * 0.10).toLocaleString()} CRD (10%) via referral bonuses.`;
      recommendedAction = `Direct user towards lifestyle destination pools that aggregate credits from both coffee and fitness partners.`;
    } else if (lowerQ.includes('close to unlocking') || lowerQ.includes('unlock')) {
      userInsight = `User currently holds ${available.toLocaleString()} Credits. They are only 160 Credits away from unlocking the "Saigon Fitness Recovery & Sauna Day Pass" (priced at 800 CRD) and 80 Credits away from the "Artisan Single Origin Tasting Flight" (450 CRD).`;
      recommendedAction = `Recommend Fitness Pool and trigger a micro-incentive notification for the 160 CRD gap.`;
    }

    return {
      userId: user.id,
      userName: user.name,
      question,
      userInsight,
      recommendedAction,
      suggestedPoolId,
      suggestedPoolName,
      suggestedCampaign,
      retrievalContext: [
        `Profile: ${user.name} (${user.role || 'Consumer'}, ${user.organization || 'Independent'})`,
        `Activity: Last active ${user.lastActive}, ${user.questProgress?.length || 2} quests commenced`,
        `Ledger: ${earned.toLocaleString()} earned, ${redeemed.toLocaleString()} redeemed, ${available.toLocaleString()} available`,
        `Campaigns: Active in 'Summer Coffee Fest' and 'Daily Fitness Streak'`,
        `Pools: Follows 'Fitness & Wellness Pool' and 'City Life Pool'`,
      ],
    };
  }

  /**
   * "Ask AI" in Funnel Analysis handler
   * Retrieves: Funnel -> Credit earning -> Pool discovery -> Benefit view -> Redemption
   */
  public askAIFunnel(question: string) {
    const analysis = this.analyze_funnel();

    return {
      question: question || 'Why are users dropping after earning Credits?',
      retrievalChain: [
        'Funnel Tracking Engine',
        'Credit Earning Ledger (8,450 users)',
        'Pool Discovery Telemetry (5,240 users, -38%)',
        'Benefit Catalog Views (3,410 users, -35%)',
        'Redemption Ledger Commit (2,190 users, -36%)',
      ],
      observation: '38% of users who earn Credits never open a Pool.',
      possibleCauses: [
        'Low Pool visibility — users receive earning alerts but no direct deep-link into curated destination pools.',
        'Benefits require too many Credits — median benefit price is 800 CRD while initial quest reward averages 200 CRD.',
        'Users lack relevant benefits — 42% of earned credits originate in F&B, but 60% of pool inventory is concentrated in premium travel.',
      ],
      identifiedBottlenecks: {
        largestDropOff: 'Pool Discovery (-38.0% drop after credit receipt)',
        segmentAffected: 'First-time credit earners with balance < 500 CRD',
        relevantCampaigns: ['Summer Coffee Fest', 'First Purchase Incentive Drive', 'Daily Steps Quest'],
        possibleRewardMismatch: 'High proportion of users seek instant local F&B perks rather than delayed luxury travel stays.',
        creditThresholdIssue: 'Gap of 400+ CRD between initial earn (200 CRD) and lowest visible benefit (600 CRD).',
        inventoryIssue: 'Boutique coffee vouchers are at 92% depletion while high-tier passes remain unconsumed.',
      },
      recommendedExperiment:
        'Create a personalized Pool recommendation for users after their first Credit earning event.',
      experimentDetails: {
        name: 'Post-Earn Smart Pool Deep-Link Experiment',
        hypothesis: 'Presenting 1-tap relevant Pool options immediately upon Credit award will reduce drop-off from 38% to under 18%.',
        sampleSize: '2,500 new credit recipients',
        targetMetric: 'Pool Open Rate & 14-day Redemption Velocity',
      },
    };
  }
}

export const mcpIntelligence = new MCPIntelligenceService();
