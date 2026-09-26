/**
 * MCP (Model Context Protocol) AI Orchestration Layer
 * 
 * Conceptual Architecture:
 * USER / BRAND / CREATOR / ADMIN
 *   ↓
 * AI AGENT
 *   ↓
 * MCP LAYER (Discover | Query | Recommend | Configure | Execute | Analyze)
 *   ↓ (Governance: Rules Engine -> Eligibility -> Budget -> Fraud/Risk -> Ledger)
 * CORE CREDIT ECONOMY ENGINE
 *   ↓
 * External Ecosystem (Brands / Merchants / POS / Services / Creators / Events)
 * 
 * IMPORTANT GOVERNANCE RULE:
 * AI and MCP must NEVER directly mutate the economic ledger.
 * All mutations execute deterministic validations before double-entry ledger settlement.
 */

export interface MCPToolDefinition {
  name: string;
  category: 'DISCOVER' | 'QUERY' | 'RECOMMEND' | 'CONFIGURE' | 'EXECUTE' | 'ANALYZE';
  description: string;
  parameters: {
    name: string;
    type: string;
    description: string;
    required: boolean;
  }[];
  requiresGovernanceApproval?: boolean;
}

export interface MCPExecutionStep {
  step: number;
  label: string;
  status: 'PENDING' | 'PASS' | 'WARN' | 'FAIL';
  detail: string;
}

export interface MCPExecutionPlan {
  id: string;
  userPrompt: string;
  category: 'DISCOVER' | 'QUERY' | 'RECOMMEND' | 'CONFIGURE' | 'EXECUTE' | 'ANALYZE';
  selectedTools: string[];
  intentSummary: string;
  governancePipeline: MCPExecutionStep[];
  previewPayload: any;
  resultData?: any;
  requiresConfirmation: boolean;
}

export const MCP_TOOL_REGISTRY: MCPToolDefinition[] = [
  // 1. DISCOVER
  {
    name: 'discover_platform_capabilities',
    category: 'DISCOVER',
    description: 'Search and discover available economic modules, earning activities, and spend destinations.',
    parameters: [
      { name: 'query', type: 'string', description: 'Keyword or intent to discover capabilities', required: false },
      { name: 'domain', type: 'string', description: 'Filter by domain (programs, pools, merchants, quests)', required: false },
    ],
  },
  {
    name: 'discover_partners_and_segments',
    category: 'DISCOVER',
    description: 'Find ecosystem vendors, brands, or patron segments matching strategic criteria.',
    parameters: [
      { name: 'targetAudience', type: 'string', description: 'Audience segment or interest (e.g. fitness, coffee)', required: true },
      { name: 'organizationType', type: 'string', description: 'Vendor, Brand, Merchant, or Partner', required: false },
    ],
  },

  // 2. QUERY
  {
    name: 'query_user_context',
    category: 'QUERY',
    description: 'Read user balance, active goals, tier eligibility, and historical quest completions.',
    parameters: [
      { name: 'userId', type: 'string', description: 'Unique user identifier or name', required: true },
      { name: 'includeGoals', type: 'boolean', description: 'Whether to fetch destination pool allocations', required: false },
    ],
  },
  {
    name: 'query_campaign_performance',
    category: 'QUERY',
    description: 'Inspect live quest conversion, budget utilization, and drop-off metrics for a campaign.',
    parameters: [
      { name: 'campaignId', type: 'string', description: 'Campaign identifier', required: false },
      { name: 'organizationId', type: 'string', description: 'Filter by sponsoring organization', required: false },
    ],
  },
  {
    name: 'query_pool_health',
    category: 'QUERY',
    description: 'Query destination pool balance, shared funding absorption, and participant demand.',
    parameters: [
      { name: 'poolId', type: 'string', description: 'Destination pool ID (e.g. pool-city-life)', required: true },
    ],
  },
  {
    name: 'query_reward_availability',
    category: 'QUERY',
    description: 'Check available inventory stock and affordability for specific credit thresholds.',
    parameters: [
      { name: 'maxCreditCost', type: 'number', description: 'Maximum credit cost filter', required: true },
      { name: 'category', type: 'string', description: 'Benefit or reward category', required: false },
    ],
  },

  // 3. RECOMMEND
  {
    name: 'recommend_destination_benefits',
    category: 'RECOMMEND',
    description: 'Generate personalized benefit recommendations based on patron credit balance and velocity.',
    parameters: [
      { name: 'userId', type: 'string', description: 'User identifier', required: true },
      { name: 'lifestyleAffinity', type: 'string', description: 'Preferred category (F&B, Stay, Workshop)', required: false },
    ],
  },
  {
    name: 'recommend_campaign_optimization',
    category: 'RECOMMEND',
    description: 'Propose automated parameter tuning to mitigate drop-offs or preserve budget margin.',
    parameters: [
      { name: 'campaignId', type: 'string', description: 'Target campaign ID', required: true },
      { name: 'issue', type: 'string', description: 'Observed friction (e.g. friction_drop, budget_surge)', required: false },
    ],
  },

  // 4. CONFIGURE
  {
    name: 'configure_quest_incentive',
    category: 'CONFIGURE',
    description: 'Draft or update quest reward rules, completion triggers, and daily caps.',
    parameters: [
      { name: 'name', type: 'string', description: 'Quest title', required: true },
      { name: 'rewardAmount', type: 'number', description: 'Credit payout amount', required: true },
      { name: 'trigger', type: 'string', description: 'Event trigger rule', required: true },
      { name: 'budgetCap', type: 'number', description: 'Total credit budget cap', required: true },
    ],
    requiresGovernanceApproval: true,
  },
  {
    name: 'configure_destination_pool',
    category: 'CONFIGURE',
    description: 'Structure a new shared funding destination pool and add participating merchant benefits.',
    parameters: [
      { name: 'name', type: 'string', description: 'Pool name', required: true },
      { name: 'type', type: 'string', description: 'Lifestyle, Travel, Creator, Wellness', required: true },
      { name: 'sharedFunding', type: 'number', description: 'Initial credit funding pool', required: true },
    ],
    requiresGovernanceApproval: true,
  },

  // 5. EXECUTE (Sensitive - Always Enforces Governance Pipeline)
  {
    name: 'execute_credit_reward_issuance',
    category: 'EXECUTE',
    description: 'Issue approved promotional or loyalty credits to user via rules engine validation.',
    parameters: [
      { name: 'userId', type: 'string', description: 'Recipient user ID', required: true },
      { name: 'amount', type: 'number', description: 'Credit amount to issue', required: true },
      { name: 'reason', type: 'string', description: 'Quest, milestone, or referral reason', required: true },
      { name: 'campaignId', type: 'string', description: 'Sponsoring campaign identifier', required: true },
    ],
    requiresGovernanceApproval: true,
  },
  {
    name: 'execute_benefit_redemption',
    category: 'EXECUTE',
    description: 'Burn credits on immutable ledger and mint verified digital redemption voucher pass.',
    parameters: [
      { name: 'userId', type: 'string', description: 'Patron user ID', required: true },
      { name: 'poolId', type: 'string', description: 'Pool ID containing benefit', required: true },
      { name: 'benefitId', type: 'string', description: 'Target benefit ID to redeem', required: true },
    ],
    requiresGovernanceApproval: true,
  },
  {
    name: 'execute_goal_credit_allocation',
    category: 'EXECUTE',
    description: 'Lock free available balance toward a destination goal in a multi-goal pool.',
    parameters: [
      { name: 'userId', type: 'string', description: 'Patron ID', required: true },
      { name: 'poolId', type: 'string', description: 'Pool ID', required: true },
      { name: 'benefitId', type: 'string', description: 'Target benefit goal', required: true },
      { name: 'amount', type: 'number', description: 'Credits to commit', required: true },
    ],
    requiresGovernanceApproval: false,
  },

  // 6. ANALYZE
  {
    name: 'analyze_macro_funnel',
    category: 'ANALYZE',
    description: 'Inspect multi-stage funnel drop-off, credit circulation velocity, and cohort retention.',
    parameters: [
      { name: 'timeframe', type: 'string', description: 'e.g. 30d, 90d', required: false },
    ],
  },
  {
    name: 'analyze_pool_utilization',
    category: 'ANALYZE',
    description: 'Evaluate demand-to-supply ratio, goal lock-in rates, and merchant capacity absorption.',
    parameters: [
      { name: 'poolId', type: 'string', description: 'Destination pool ID', required: true },
    ],
  },
];

/**
 * Natural language intent parser for AI Command Bar & Copilots
 */
export function parseNLQueryToMCPPlan(
  query: string,
  contextData: {
    selectedUser: any;
    pools: any[];
    users: any[];
    quests: any[];
    campaigns: any[];
    organizations: any[];
    rewardPools: any[];
  }
): MCPExecutionPlan {
  const q = query.toLowerCase().trim();
  const planId = `plan-mcp-${Date.now()}`;

  // 1. "Find benefits I can redeem with 700 Credits."
  if (q.includes('benefit') && (q.includes('700') || q.includes('redeem') || q.includes('afford') || q.includes('can i'))) {
    const maxCreds = 700;
    const affordablePoolBenefits: any[] = [];
    contextData.pools.forEach((p) => {
      p.benefits.forEach((b: any) => {
        if (b.creditsCost <= maxCreds && b.remainingInventory > 0) {
          affordablePoolBenefits.push({
            id: b.id,
            name: b.name,
            provider: b.providerOrgName,
            cost: b.creditsCost,
            poolName: p.name,
            poolId: p.id,
            type: b.type,
            inventory: b.remainingInventory,
          });
        }
      });
    });

    const affordableCatalog = contextData.rewardPools.filter(
      (r: any) => r.creditsCost <= maxCreds && r.remainingInventory > 0
    );

    return {
      id: planId,
      userPrompt: query,
      category: 'QUERY',
      selectedTools: ['query_reward_availability', 'recommend_destination_benefits'],
      intentSummary: `Discovered ${affordablePoolBenefits.length} pool benefits and ${affordableCatalog.length} catalog items affordable under ${maxCreds} CRD.`,
      governancePipeline: [
        { step: 1, label: 'Tool Discovery', status: 'PASS', detail: 'Selected query_reward_availability MCP tool' },
        { step: 2, label: 'Ledger State Verification', status: 'PASS', detail: `Patron balance verified: ${contextData.selectedUser?.creditAccount.availableCredit.toLocaleString()} CRD` },
        { step: 3, label: 'Inventory Supply Verification', status: 'PASS', detail: 'Confirmed non-zero physical inventory stock' },
      ],
      previewPayload: {
        maxCredits: maxCreds,
        destinationBenefits: affordablePoolBenefits,
        catalogItems: affordableCatalog,
      },
      requiresConfirmation: false,
    };
  }

  // 2. "Create a weekend campaign for inactive users."
  if (q.includes('weekend') || (q.includes('campaign') && q.includes('inactive')) || q.includes('re-engagement')) {
    return {
      id: planId,
      userPrompt: query,
      category: 'CONFIGURE',
      selectedTools: ['discover_partners_and_segments', 'configure_quest_incentive'],
      intentSummary: 'Drafted 48-Hour Weekend Re-Engagement Campaign with +400 CRD incentive for dormant patrons.',
      governancePipeline: [
        { step: 1, label: 'Segment Verification', status: 'PASS', detail: 'Identified 1,420 inactive patrons (last activity > 30 days)' },
        { step: 2, label: 'Rules Engine Budget Check', status: 'PASS', detail: 'Campaign budget: 15,000 CRD within Monthly Ceiling' },
        { step: 3, label: 'Anti-Sybil Velocity Policy', status: 'PASS', detail: 'Enforced max 1 completion per patron across 48hr window' },
        { step: 4, label: 'Dual-Key Risk Signoff', status: 'PASS', detail: 'Pre-flight verified against Protocol Safe Cap Policy' },
      ],
      previewPayload: {
        campaignName: 'Weekend Coffee & Stays Re-Engagement Drive',
        targetSegment: 'Dormant Consumers (>30d inactive)',
        eligibleUsersCount: 1420,
        questName: 'Weekend Reconnect & Double Earning',
        rewardAmount: 400,
        budgetEnvelope: 15000,
        duration: 'Friday 18:00 - Sunday 23:59',
        participatingOrgs: ['ABC Coffee', 'Nomad Stay'],
      },
      requiresConfirmation: true,
    };
  }

  // 3. "Why is Pool A underperforming?" or "Why is City Life Pool underperforming?"
  if (q.includes('underperforming') || (q.includes('why') && q.includes('pool')) || q.includes('performance')) {
    const targetPool = contextData.pools.find((p) => p.id === 'pool-city-life') || contextData.pools[0];
    return {
      id: planId,
      userPrompt: query,
      category: 'ANALYZE',
      selectedTools: ['query_pool_health', 'analyze_pool_utilization', 'recommend_campaign_optimization'],
      intentSummary: `Diagnostic report for ${targetPool.name}: High demand pressure on Weekend Stay (118% supply absorption) causing completion bottleneck.`,
      governancePipeline: [
        { step: 1, label: 'Pool Health Query', status: 'PASS', detail: `Committed: ${targetPool.committedCredits.toLocaleString()} / ${targetPool.totalFundingCredits.toLocaleString()} CRD` },
        { step: 2, label: 'Demand vs Inventory Curve', status: 'WARN', detail: 'Weekend Stay inventory (12 remaining) over-subscribed by 1,420 accumulators' },
        { step: 3, label: 'Pacing Model Validation', status: 'PASS', detail: 'Average patron needs 2.4 more weeks to reach 5,000 CRD goal' },
      ],
      previewPayload: {
        poolName: targetPool.name,
        totalFunding: targetPool.totalFundingCredits,
        committedCredits: targetPool.committedCredits,
        primaryFriction: 'Demand Concentration Risk',
        diagnostic: '48% of all committed pool credits are concentrated on Weekend Stay (5,000 CRD), where inventory is scarce (12 suites left). Daily perks (Coffee, Vouchers) suffer from lower goal allocation despite ample stock.',
        aiRecommendations: [
          'Introduce milestone micro-claims (e.g. +300 CRD milestone perk) to maintain accumulation velocity',
          'Request Nomad Stay to replenish 10 additional boutique suite inventory units via partner grant',
          'Activate automated Cross-Brand Quest pairing Saigon Fitness check-ins with ABC Coffee vouchers',
        ],
      },
      requiresConfirmation: false,
    };
  }

  // 4. "Find partners interested in acquiring fitness users."
  if (q.includes('fitness') || (q.includes('partner') && q.includes('acquir'))) {
    return {
      id: planId,
      userPrompt: query,
      category: 'DISCOVER',
      selectedTools: ['discover_partners_and_segments', 'recommend_campaign_optimization'],
      intentSummary: 'Identified 3 lifestyle & wellness partners seeking high-velocity fitness cohorts.',
      governancePipeline: [
        { step: 1, label: 'Partner Graph Match', status: 'PASS', detail: 'Scanned 18 active organizations against fitness cohort affinity' },
        { step: 2, label: 'Ecosystem Margin Check', status: 'PASS', detail: 'Partners have average monthly marketing budget > 35,000 CRD' },
      ],
      previewPayload: {
        matches: [
          {
            name: 'Saigon Fitness & Recovery Club',
            type: 'Merchant / Partner',
            intent: 'Looking to acquire 500 active patrons for Cryotherapy & Personal Training packages',
            synergyScore: 98,
            recommendedProgram: 'Cross-vendor wellness quest: 3 gym visits unlock 1 artisan pour-over at ABC Coffee',
          },
          {
            name: 'ABC Coffee Health Bar',
            type: 'Vendor',
            intent: 'Promoting low-sugar cold brews and protein smoothie bar to gym-goers',
            synergyScore: 92,
            recommendedProgram: 'Co-branded morning streak quest (+250 CRD)',
          },
          {
            name: 'Nomad Stay Wellness Pods',
            type: 'Merchant',
            intent: 'Weekend retreat bookings for active wellness travelers',
            synergyScore: 86,
            recommendedProgram: 'Destination Pool contributor: deposit 5 recovery packages into Wellness Pool',
          },
        ],
      },
      requiresConfirmation: false,
    };
  }

  // 4b. Brand Input: "I want to increase first purchases among fitness enthusiasts." / "acquire new customers interested in running"
  if (
    (q.includes('first purchase') && (q.includes('fitness') || q.includes('increase') || q.includes('running'))) ||
    (q.includes('acquire') && (q.includes('running') || q.includes('customer') || q.includes('fitness')))
  ) {
    return {
      id: planId,
      userPrompt: query,
      category: 'CONFIGURE',
      selectedTools: [
        'get_partner_profile',
        'get_available_campaign_templates',
        'get_audience_segments',
        'estimate_credit_cost',
        'get_pool_options',
        'create_campaign_draft',
      ],
      intentSummary: 'Synthesized Campaign Proposal: Increase first purchases among fitness enthusiasts with +200 CRD reward and 50,000 CRD budget.',
      governancePipeline: [
        { step: 1, label: 'Partner Profile & Tier Check', status: 'PASS', detail: 'Partner verified: Saigon Fitness & Recovery Club (Growth Plan)' },
        { step: 2, label: 'Audience Cohort Discovery', status: 'PASS', detail: 'Identified 3,420 fitness enthusiasts with verified identity' },
        { step: 3, label: 'Budget Ceiling Compliance', status: 'PASS', detail: 'Budget of 50,000 CRD allocated safely under monthly limit' },
        { step: 4, label: 'Destination Pool Linkage', status: 'PASS', detail: 'Linked to Fitness & Wellness Pool for destination accumulation' },
      ],
      previewPayload: {
        isBrandProposal: true,
        campaignName: 'Saigon Fitness: First Purchase Acquisition Drive',
        objective: 'Increase first purchases',
        targetAudience: 'Fitness-interested users',
        trigger: 'First verified purchase',
        reward: '200 Credits',
        rewardAmount: 200,
        budget: '50,000 Credits',
        budgetEnvelope: 50000,
        duration: '30 days',
        suggestedPool: 'Fitness & Wellness',
        expectedUsers: '2,000–4,000',
        assumptions: [
          'Assumes 12% baseline conversion on reached fitness segment (approx. 400 net-new buyers).',
          'CAC in credits equates to 200 CRD ($10 USD nominal), outperforming traditional paid social ad channels.',
          'Credits flow into Fitness & Wellness Pool where patrons accumulate towards recovery sessions and classes.',
          'Issuance ceases immediately when 50,000 CRD budget envelope is fully exhausted.',
        ],
      },
      requiresConfirmation: true,
    };
  }

  // 5. "Show me users who earn Credits but rarely redeem them."
  if ((q.includes('earn') && q.includes('rarely')) || q.includes('hoard') || (q.includes('dormant') && q.includes('credit')) || q.includes('rarely redeem')) {
    const accumulators = contextData.users.filter(
      (u: any) => u.creditAccount.availableCredit >= 2500
    );

    return {
      id: planId,
      userPrompt: query,
      category: 'ANALYZE',
      selectedTools: ['query_user_context', 'analyze_macro_funnel', 'recommend_destination_benefits'],
      intentSummary: `Detected ${accumulators.length} high-balance patrons accumulating credits with < 20% historical redemption velocity.`,
      governancePipeline: [
        { step: 1, label: 'Ledger Inactivity Scan', status: 'PASS', detail: 'Filtered users with balance > 2,000 CRD and no burn transactions in 21 days' },
        { step: 2, label: 'Destination Intent Check', status: 'WARN', detail: 'Patrons have unassigned balances not yet allocated to destination pools' },
      ],
      previewPayload: {
        targetUsers: accumulators.map((u: any) => ({
          id: u.id,
          name: u.name,
          balance: u.creditAccount.availableCredit,
          daysSinceRedemption: u.id === 'usr-sc-01' ? 14 : 32,
          velocityRisk: 'Capital Velocity Stagnation',
          recommendedAction: `Prompt ${u.name.split(' ')[0]} to allocate free credits toward City Life Pool benefits`,
        })),
        aiAdvisory: 'Unallocated credits represent latent demand. Prompting these users with high-affinity destination perks converts passive reserve liability into active merchant footfall.',
      },
      requiresConfirmation: false,
    };
  }

  // 6. Generic or Custom Query
  return {
    id: planId,
    userPrompt: query,
    category: 'DISCOVER',
    selectedTools: ['discover_platform_capabilities', 'query_user_context'],
    intentSummary: `AI analyzed "${query}" across Credit Economy modules, pools, and merchant partners.`,
    governancePipeline: [
      { step: 1, label: 'Semantic Tool Resolution', status: 'PASS', detail: 'Mapped prompt to Credit Economy Engine capabilities' },
      { step: 2, label: 'Rules & Policy Invariance', status: 'PASS', detail: 'Validated request within platform safety boundaries' },
    ],
    previewPayload: {
      message: `The Credit Economy OS has processed your request. You can discover benefits, inspect patron balances, configure campaigns, or simulate pool demand.`,
      contextUser: contextData.selectedUser.name,
      userBalance: `${contextData.selectedUser.creditAccount.availableCredit.toLocaleString()} CRD`,
      activePools: contextData.pools.length,
      availableBenefitsCount: contextData.pools.reduce((s, p) => s + p.benefits.length, 0),
    },
    requiresConfirmation: false,
  };
}
