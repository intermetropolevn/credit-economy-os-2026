/**
 * Model Context Protocol (MCP) & Integrations Infrastructure Service
 * 
 * Interoperability and Agent-Access Layer for Credit Economy OS.
 * 
 * ARCHITECTURAL MANDATE:
 * MCP is an interoperability and agent-access layer.
 * It is NOT the source of truth.
 * The Credit Ledger, Rules Engine, Eligibility Engine, and Fraud Engine remain authoritative.
 */

export type ToolClassification = 'READ' | 'WRITE' | 'SENSITIVE';

export type ToolDomain =
  | 'CREDIT'
  | 'CAMPAIGN'
  | 'POOL'
  | 'PARTNER'
  | 'USER'
  | 'ANALYTICS'
  | 'REDEMPTION';

export interface MCPToolDefinition {
  id: string;
  name: string;
  domain: ToolDomain;
  classification: ToolClassification;
  description: string;
  requiresAuthorization: boolean;
  authoritativeEngine: 'Credit Ledger' | 'Rules Engine' | 'Eligibility Engine' | 'Fraud Engine' | 'Clearinghouse Reserve';
  authorizerRole?: 'SUPER_ADMIN' | 'RISK_OFFICER' | 'ADMIN' | 'NONE';
  inputSchema: Record<string, string>;
  outputSchema: Record<string, string>;
  exampleInput: string;
  riskRating: 'NONE' | 'LOW' | 'MEDIUM' | 'CRITICAL';
}

export interface MCPServerConnector {
  id: string;
  name: string;
  category: 'E-commerce' | 'POS' | 'Payment' | 'Events' | 'Creator' | 'CRM' | 'Partner Systems';
  status: 'CONNECTED' | 'SYNCING' | 'DEGRADED' | 'DISCONNECTED';
  endpoint: string;
  permissions: 'READ' | 'READ_WRITE' | 'SENSITIVE_AUTHORIZED';
  lastSync: string;
  availableTools: string[]; // List of tool names
  dataScope: string;
  latencyMs: number;
  authMethod: 'mTLS' | 'OAuth2 Bearer' | 'HMAC Signature' | 'API Key';
  uptime30d: string;
  version: string;
}

export interface MCPExecutionLogEntry {
  id: string;
  timestamp: string;
  agent: string;
  tool: string;
  domain: ToolDomain;
  classification: ToolClassification;
  inputSummary: string;
  validation: 'PASSED' | 'FAILED' | 'ESCALATED';
  authoritativeEngine: string;
  result: string;
  actor: 'AI Agent' | 'Admin (Risk Officer)' | 'Platform Operator' | 'Super Admin' | 'External POS Node';
  status: 'SUCCESS' | 'PENDING_APPROVAL' | 'REJECTED' | 'FAILED';
  durationMs: number;
}

export interface ExternalMCPEventMapping {
  id: string;
  sourceServer: string;
  externalTool: string;
  eventType: string;
  payloadRequirements: string[];
  mappedCreditRule: string;
  creditRewardFormula: string;
  destinationPool: string;
  fraudEngineChecks: string[];
  status: 'ACTIVE' | 'TEST_MODE' | 'PAUSED';
  lastTriggered?: string;
  totalTriggerCount: number;
}

class MCPRegistryService {
  // ============================================================================
  // 1. MCP SERVERS (Connected External Systems)
  // ============================================================================
  private servers: MCPServerConnector[] = [
    {
      id: 'srv-shopee',
      name: 'Demo Commerce',
      category: 'E-commerce',
      status: 'CONNECTED',
      endpoint: 'mcp://demo-commerce.example.invalid/v2/orders',
      permissions: 'READ_WRITE',
      lastSync: '2 minutes ago',
      availableTools: ['verify_purchase', 'get_order_status', 'check_inventory'],
      dataScope: 'Merchant order receipts, SKU categories, delivery confirmation status',
      latencyMs: 84,
      authMethod: 'OAuth2 Bearer',
      uptime30d: '99.98%',
      version: 'v2.4.1',
    },
    {
      id: 'srv-pos',
      name: 'Merchant POS',
      category: 'POS',
      status: 'CONNECTED',
      endpoint: 'mcp://merchant-pos.example.invalid/v1/counter',
      permissions: 'SENSITIVE_AUTHORIZED',
      lastSync: '12 seconds ago',
      availableTools: ['verify_purchase', 'redeem_benefit', 'validate_credit_reward'],
      dataScope: 'In-store barcode scans, register receipts, cashier verification tokens',
      latencyMs: 38,
      authMethod: 'mTLS',
      uptime30d: '99.99%',
      version: 'v3.1.0',
    },
    {
      id: 'srv-ecom',
      name: 'E-commerce',
      category: 'E-commerce',
      status: 'CONNECTED',
      endpoint: 'mcp://commerce-sync.example.invalid/v1/cart',
      permissions: 'READ_WRITE',
      lastSync: '5 minutes ago',
      availableTools: ['search_campaigns', 'check_inventory', 'get_credit_balance'],
      dataScope: 'Product catalog, patron cart tokens, checkout price adjustments',
      latencyMs: 62,
      authMethod: 'HMAC Signature',
      uptime30d: '99.94%',
      version: 'v2.2.0',
    },
    {
      id: 'srv-payment',
      name: 'Payment',
      category: 'Payment',
      status: 'CONNECTED',
      endpoint: 'mcp://clearing.example.invalid/v1/settle',
      permissions: 'SENSITIVE_AUTHORIZED',
      lastSync: '45 seconds ago',
      availableTools: ['verify_transaction', 'issue_credit', 'validate_credit_reward'],
      dataScope: 'Escrow payment receipts, bank tranche confirmations, transaction proofs',
      latencyMs: 42,
      authMethod: 'mTLS',
      uptime30d: '100.00%',
      version: 'v4.0.1',
    },
    {
      id: 'srv-events',
      name: 'Events',
      category: 'Events',
      status: 'CONNECTED',
      endpoint: 'mcp://events.example.invalid/v1/checkin',
      permissions: 'READ_WRITE',
      lastSync: '14 minutes ago',
      availableTools: ['verify_attendance', 'get_user_activity'],
      dataScope: 'Ticket barcode validations, geo-fenced check-in coordinates, venue logs',
      latencyMs: 95,
      authMethod: 'OAuth2 Bearer',
      uptime30d: '99.85%',
      version: 'v1.8.4',
    },
    {
      id: 'srv-creators',
      name: 'Creator Platforms',
      category: 'Creator',
      status: 'CONNECTED',
      endpoint: 'mcp://creators.example.invalid/v2/attributions',
      permissions: 'READ_WRITE',
      lastSync: '8 minutes ago',
      availableTools: ['verify_content', 'get_user_segment', 'search_campaigns'],
      dataScope: 'UGC post URLs, engagement metrics, branded hashtag verification tokens',
      latencyMs: 142,
      authMethod: 'OAuth2 Bearer',
      uptime30d: '99.72%',
      version: 'v2.1.2',
    },
    {
      id: 'srv-crm',
      name: 'CRM',
      category: 'CRM',
      status: 'CONNECTED',
      endpoint: 'mcp://crm.example.invalid/v1/contacts',
      permissions: 'READ',
      lastSync: '18 minutes ago',
      availableTools: ['get_user_profile', 'get_user_segment', 'search_partners'],
      dataScope: 'Patron contact tiers, KYC compliance levels, lifecycle segment tags',
      latencyMs: 110,
      authMethod: 'API Key',
      uptime30d: '99.91%',
      version: 'v1.9.0',
    },
    {
      id: 'srv-partners',
      name: 'Partner Systems',
      category: 'Partner Systems',
      status: 'CONNECTED',
      endpoint: 'mcp://partners.example.invalid/v2/integration',
      permissions: 'READ_WRITE',
      lastSync: '3 minutes ago',
      availableTools: ['get_partner_profile', 'check_inventory', 'search_pools'],
      dataScope: 'Hotel booking systems, wellness studio calendar allocations, catalog inventory',
      latencyMs: 88,
      authMethod: 'HMAC Signature',
      uptime30d: '99.95%',
      version: 'v2.5.0',
    },
  ];

  // ============================================================================
  // 2. TOOL REGISTRY (Grouped by Domain with Strict Permission Classification)
  // ============================================================================
  private tools: MCPToolDefinition[] = [
    // --- CREDIT DOMAIN ---
    {
      id: 'tool-get-credit-balance',
      name: 'get_credit_balance',
      domain: 'CREDIT',
      classification: 'READ',
      description: 'Queries available, reserved, and total balance from the authoritative double-entry Credit Ledger.',
      requiresAuthorization: false,
      authoritativeEngine: 'Credit Ledger',
      inputSchema: { userId: 'string', currency: 'string (default: CRD)' },
      outputSchema: { availableCredit: 'number', reservedCredit: 'number', totalCredit: 'number' },
      exampleInput: '{ "userId": "usr-sarah-chen" }',
      riskRating: 'NONE',
    },
    {
      id: 'tool-get-credit-history',
      name: 'get_credit_history',
      domain: 'CREDIT',
      classification: 'READ',
      description: 'Fetches cryptographic immutable ledger journal entries and transaction timeline for an account.',
      requiresAuthorization: false,
      authoritativeEngine: 'Credit Ledger',
      inputSchema: { accountId: 'string', limit: 'number', timeWindow: 'string' },
      outputSchema: { entries: 'Array<LedgerEntry>', count: 'number' },
      exampleInput: '{ "accountId": "acc-sarah-chen", "limit": 20 }',
      riskRating: 'NONE',
    },
    {
      id: 'tool-issue-credit',
      name: 'issue_credit',
      domain: 'CREDIT',
      classification: 'SENSITIVE',
      description: 'Mints new spendable credits into a patron wallet. Requires strict dual-sign authorization and budget headroom verification.',
      requiresAuthorization: true,
      authoritativeEngine: 'Credit Ledger',
      authorizerRole: 'RISK_OFFICER',
      inputSchema: { userId: 'string', amount: 'number', creditClass: 'string', reason: 'string', authorizationToken: 'string' },
      outputSchema: { transactionId: 'string', newBalance: 'number', status: 'string' },
      exampleInput: '{ "userId": "usr-sarah-chen", "amount": 200, "creditClass": "Ecosystem Bonus", "reason": "Quest Reward" }',
      riskRating: 'CRITICAL',
    },
    {
      id: 'tool-validate-credit-reward',
      name: 'validate_credit_reward',
      domain: 'CREDIT',
      classification: 'READ',
      description: 'Evaluates issuance parameters against the Rules Engine and Fraud Engine velocity caps before committing.',
      requiresAuthorization: false,
      authoritativeEngine: 'Rules Engine',
      inputSchema: { recipientId: 'string', campaignId: 'string', creditAmount: 'number' },
      outputSchema: { isValid: 'boolean', remainingAllowance: 'number', riskScore: 'number' },
      exampleInput: '{ "recipientId": "usr-sarah-chen", "campaignId": "cmp-saigon-fitness", "creditAmount": 200 }',
      riskRating: 'LOW',
    },

    // --- CAMPAIGN DOMAIN ---
    {
      id: 'tool-search-campaigns',
      name: 'search_campaigns',
      domain: 'CAMPAIGN',
      classification: 'READ',
      description: 'Searches active, scheduled, and draft marketing campaigns across all affiliated brands.',
      requiresAuthorization: false,
      authoritativeEngine: 'Rules Engine',
      inputSchema: { query: 'string', organizationId: 'string', status: 'string' },
      outputSchema: { campaigns: 'Array<Campaign>', total: 'number' },
      exampleInput: '{ "status": "Active" }',
      riskRating: 'NONE',
    },
    {
      id: 'tool-create-campaign',
      name: 'create_campaign',
      domain: 'CAMPAIGN',
      classification: 'WRITE',
      description: 'Creates a new programmatic campaign shell in Draft state. Does not commit budget reserves until approval.',
      requiresAuthorization: false,
      authoritativeEngine: 'Rules Engine',
      inputSchema: { name: 'string', organizationId: 'string', totalBudget: 'number', trigger: 'string', rewardCredits: 'number' },
      outputSchema: { campaignId: 'string', status: 'string' },
      exampleInput: '{ "name": "First Purchase Drive", "organizationId": "org-saigon-fitness", "totalBudget": 50000 }',
      riskRating: 'MEDIUM',
    },
    {
      id: 'tool-update-campaign',
      name: 'update_campaign',
      domain: 'CAMPAIGN',
      classification: 'WRITE',
      description: 'Modifies non-financial metadata, date schedules, or copy of an existing campaign.',
      requiresAuthorization: false,
      authoritativeEngine: 'Rules Engine',
      inputSchema: { campaignId: 'string', updates: 'Record<string, any>' },
      outputSchema: { success: 'boolean', updatedCampaign: 'Campaign' },
      exampleInput: '{ "campaignId": "cmp-abc-summer", "updates": { "description": "Extended weekend hours" } }',
      riskRating: 'LOW',
    },
    {
      id: 'tool-publish-campaign',
      name: 'publish_campaign',
      domain: 'CAMPAIGN',
      classification: 'SENSITIVE',
      description: 'Encumbers brand budget and activates deterministic reward rules on the live ledger. Requires explicit operator authorization.',
      requiresAuthorization: true,
      authoritativeEngine: 'Rules Engine',
      authorizerRole: 'ADMIN',
      inputSchema: { campaignId: 'string', approvedBudget: 'number', confirmedBy: 'string' },
      outputSchema: { campaignId: 'string', status: 'string', liveTimestamp: 'string' },
      exampleInput: '{ "campaignId": "cmp-draft-fitness-first-buy", "approvedBudget": 50000, "confirmedBy": "Admin (Operator)" }',
      riskRating: 'MEDIUM',
    },
    {
      id: 'tool-pause-campaign',
      name: 'pause_campaign',
      domain: 'CAMPAIGN',
      classification: 'WRITE',
      description: 'Halts credit rule execution for an active campaign immediately preventing further issuance.',
      requiresAuthorization: false,
      authoritativeEngine: 'Rules Engine',
      inputSchema: { campaignId: 'string', reason: 'string' },
      outputSchema: { campaignId: 'string', status: 'string' },
      exampleInput: '{ "campaignId": "cmp-abc-summer", "reason": "Budget cap reached" }',
      riskRating: 'LOW',
    },

    // --- POOL DOMAIN ---
    {
      id: 'tool-search-pools',
      name: 'search_pools',
      domain: 'POOL',
      classification: 'READ',
      description: 'Discovers shared destination pools, total liquidity backing, and curated lifestyle benefit passes.',
      requiresAuthorization: false,
      authoritativeEngine: 'Eligibility Engine',
      inputSchema: { type: 'string', minFunding: 'number' },
      outputSchema: { pools: 'Array<BenefitPool>' },
      exampleInput: '{ "type": "Lifestyle" }',
      riskRating: 'NONE',
    },
    {
      id: 'tool-create-pool',
      name: 'create_pool',
      domain: 'POOL',
      classification: 'WRITE',
      description: 'Provisions a new shared destination pool shell. Does not alter clearinghouse reserve lines.',
      requiresAuthorization: false,
      authoritativeEngine: 'Eligibility Engine',
      inputSchema: { name: 'string', type: 'string', targetCredits: 'number', partnerOrgIds: 'string[]' },
      outputSchema: { poolId: 'string', status: 'string' },
      exampleInput: '{ "name": "City Life Pool", "type": "Lifestyle", "targetCredits": 75000 }',
      riskRating: 'LOW',
    },
    {
      id: 'tool-add-benefit-to-pool',
      name: 'add_benefit_to_pool',
      domain: 'POOL',
      classification: 'WRITE',
      description: 'Attaches a merchant benefit or experiential voucher pass to a destination pool.',
      requiresAuthorization: false,
      authoritativeEngine: 'Eligibility Engine',
      inputSchema: { poolId: 'string', title: 'string', creditsCost: 'number', initialStock: 'number' },
      outputSchema: { benefitId: 'string', status: 'string' },
      exampleInput: '{ "poolId": "pool-fitness", "title": "Recovery Pass", "creditsCost": 600, "initialStock": 50 }',
      riskRating: 'LOW',
    },
    {
      id: 'tool-update-pool',
      name: 'update_pool',
      domain: 'POOL',
      classification: 'WRITE',
      description: 'Updates destination pool parameters, featured badges, or partner contribution allocations.',
      requiresAuthorization: false,
      authoritativeEngine: 'Eligibility Engine',
      inputSchema: { poolId: 'string', updates: 'Record<string, any>' },
      outputSchema: { poolId: 'string', success: 'boolean' },
      exampleInput: '{ "poolId": "pool-fitness", "updates": { "status": "Active" } }',
      riskRating: 'LOW',
    },
    {
      id: 'tool-publish-pool',
      name: 'publish_pool',
      domain: 'POOL',
      classification: 'SENSITIVE',
      description: 'Opens pool to public patron goal accumulation and links partner inventory commitments.',
      requiresAuthorization: true,
      authoritativeEngine: 'Clearinghouse Reserve',
      authorizerRole: 'ADMIN',
      inputSchema: { poolId: 'string', authorizedBy: 'string' },
      outputSchema: { poolId: 'string', status: 'string' },
      exampleInput: '{ "poolId": "pool-fitness", "authorizedBy": "Admin (Risk Officer)" }',
      riskRating: 'MEDIUM',
    },

    // --- PARTNER DOMAIN ---
    {
      id: 'tool-search-partners',
      name: 'search_partners',
      domain: 'PARTNER',
      classification: 'READ',
      description: 'Searches verified vendor, merchant, and brand organizations in the unified directory.',
      requiresAuthorization: false,
      authoritativeEngine: 'Rules Engine',
      inputSchema: { type: 'string', verifiedOnly: 'boolean' },
      outputSchema: { partners: 'Array<Organization>' },
      exampleInput: '{ "type": "Brand" }',
      riskRating: 'NONE',
    },
    {
      id: 'tool-create-partner',
      name: 'create_partner',
      domain: 'PARTNER',
      classification: 'WRITE',
      description: 'Creates a new partner organization profile awaiting verification and billing onboarding.',
      requiresAuthorization: false,
      authoritativeEngine: 'Rules Engine',
      inputSchema: { name: 'string', type: 'string', monthlyBudget: 'number', primaryContact: 'string' },
      outputSchema: { organizationId: 'string', status: 'string' },
      exampleInput: '{ "name": "Nomad Stay Boutique", "type": "Brand", "monthlyBudget": 40000 }',
      riskRating: 'MEDIUM',
    },
    {
      id: 'tool-get-partner-profile',
      name: 'get_partner_profile',
      domain: 'PARTNER',
      classification: 'READ',
      description: 'Queries partner tier, credit account balance, active campaigns, and SLA settlement scores.',
      requiresAuthorization: false,
      authoritativeEngine: 'Rules Engine',
      inputSchema: { organizationId: 'string' },
      outputSchema: { organization: 'Organization', creditAccount: 'any' },
      exampleInput: '{ "organizationId": "org-saigon-fitness" }',
      riskRating: 'NONE',
    },

    // --- USER DOMAIN ---
    {
      id: 'tool-get-user-profile',
      name: 'get_user_profile',
      domain: 'USER',
      classification: 'READ',
      description: 'Reads unified identity, multi-role affiliations, and wallet metadata for a patron or business account.',
      requiresAuthorization: false,
      authoritativeEngine: 'Eligibility Engine',
      inputSchema: { userId: 'string' },
      outputSchema: { user: 'User' },
      exampleInput: '{ "userId": "usr-sarah-chen" }',
      riskRating: 'NONE',
    },
    {
      id: 'tool-get-user-segment',
      name: 'get_user_segment',
      domain: 'USER',
      classification: 'READ',
      description: 'Evaluates behavioral traits, credit holding velocity, and affinity tags via the Eligibility Engine.',
      requiresAuthorization: false,
      authoritativeEngine: 'Eligibility Engine',
      inputSchema: { userId: 'string' },
      outputSchema: { segment: 'string', affinityTags: 'string[]', velocityTier: 'string' },
      exampleInput: '{ "userId": "usr-sarah-chen" }',
      riskRating: 'NONE',
    },
    {
      id: 'tool-get-user-activity',
      name: 'get_user_activity',
      domain: 'USER',
      classification: 'READ',
      description: 'Queries active quests, recent transaction timeline, and unspent credit holding periods.',
      requiresAuthorization: false,
      authoritativeEngine: 'Eligibility Engine',
      inputSchema: { userId: 'string', limit: 'number' },
      outputSchema: { activities: 'Array<any>' },
      exampleInput: '{ "userId": "usr-sarah-chen", "limit": 10 }',
      riskRating: 'NONE',
    },

    // --- ANALYTICS DOMAIN ---
    {
      id: 'tool-get-funnel',
      name: 'get_funnel',
      domain: 'ANALYTICS',
      classification: 'READ',
      description: 'Computes multi-stage lifecycle progression from discovery to quest earn, pool view, and burn.',
      requiresAuthorization: false,
      authoritativeEngine: 'Rules Engine',
      inputSchema: { scope: 'string', timeWindowDays: 'number' },
      outputSchema: { stages: 'Array<any>', dropOffRates: 'Record<string, number>' },
      exampleInput: '{ "scope": "ALL", "timeWindowDays": 30 }',
      riskRating: 'NONE',
    },
    {
      id: 'tool-get-campaign-metrics',
      name: 'get_campaign_metrics',
      domain: 'ANALYTICS',
      classification: 'READ',
      description: 'Extracts real-time conversion rates, cost-per-acquisition, and budget velocity metrics.',
      requiresAuthorization: false,
      authoritativeEngine: 'Rules Engine',
      inputSchema: { campaignId: 'string' },
      outputSchema: { conversionRate: 'number', budgetUsed: 'number', roiRatio: 'string' },
      exampleInput: '{ "campaignId": "cmp-abc-summer" }',
      riskRating: 'NONE',
    },
    {
      id: 'tool-get-pool-metrics',
      name: 'get_pool_metrics',
      domain: 'ANALYTICS',
      classification: 'READ',
      description: 'Queries shared pool liquidity, commitment ratios, inventory utilization, and saver volume.',
      requiresAuthorization: false,
      authoritativeEngine: 'Clearinghouse Reserve',
      inputSchema: { poolId: 'string' },
      outputSchema: { committedCredits: 'number', utilizationPercent: 'number', saverCount: 'number' },
      exampleInput: '{ "poolId": "pool-city-life" }',
      riskRating: 'NONE',
    },
    {
      id: 'tool-analyze-funnel',
      name: 'analyze_funnel',
      domain: 'ANALYTICS',
      classification: 'READ',
      description: 'Automated diagnostic analysis pinpointing friction drop-offs, inventory mismatches, and recommended experiments.',
      requiresAuthorization: false,
      authoritativeEngine: 'Rules Engine',
      inputSchema: { funnelId: 'string' },
      outputSchema: { observation: 'string', possibleCauses: 'string[]', recommendedExperiment: 'string' },
      exampleInput: '{ "funnelId": "lifecycle-default" }',
      riskRating: 'NONE',
    },

    // --- REDEMPTION DOMAIN ---
    {
      id: 'tool-check-eligibility',
      name: 'check_eligibility',
      domain: 'REDEMPTION',
      classification: 'READ',
      description: 'Checks patron balance, geographic eligibility, and cooldown limits before approving checkout.',
      requiresAuthorization: false,
      authoritativeEngine: 'Eligibility Engine',
      inputSchema: { userId: 'string', benefitId: 'string' },
      outputSchema: { isEligible: 'boolean', rejectionReason: 'string | null' },
      exampleInput: '{ "userId": "usr-sarah-chen", "benefitId": "ben-fitness-pass" }',
      riskRating: 'NONE',
    },
    {
      id: 'tool-check-inventory',
      name: 'check_inventory',
      domain: 'REDEMPTION',
      classification: 'READ',
      description: 'Queries live partner stock remaining and reserved hold queues for a benefit pass.',
      requiresAuthorization: false,
      authoritativeEngine: 'Eligibility Engine',
      inputSchema: { benefitId: 'string' },
      outputSchema: { availableUnits: 'number', status: 'string' },
      exampleInput: '{ "benefitId": "ben-fitness-pass" }',
      riskRating: 'NONE',
    },
    {
      id: 'tool-redeem-benefit',
      name: 'redeem_benefit',
      domain: 'REDEMPTION',
      classification: 'SENSITIVE',
      description: 'Burns credits on the immutable ledger and issues cryptographic redemption voucher token. Requires atomic ledger lock.',
      requiresAuthorization: true,
      authoritativeEngine: 'Credit Ledger',
      authorizerRole: 'RISK_OFFICER',
      inputSchema: { userId: 'string', benefitId: 'string', creditsCost: 'number', terminalId: 'string' },
      outputSchema: { voucherCode: 'string', transactionHash: 'string', debitedCredits: 'number', status: 'string' },
      exampleInput: '{ "userId": "usr-sarah-chen", "benefitId": "ben-coffee-flight", "creditsCost": 450, "terminalId": "pos-abc-01" }',
      riskRating: 'CRITICAL',
    },
  ];

  // ============================================================================
  // 3. EXECUTION LOGS
  // ============================================================================
  private executionLogs: MCPExecutionLogEntry[] = [
    {
      id: 'exec-8910',
      timestamp: '2026-09-26 14:52:10',
      agent: 'AI Orchestrator',
      tool: 'create_campaign',
      domain: 'CAMPAIGN',
      classification: 'WRITE',
      inputSummary: 'name="Fitness First Buy", org="Saigon Fitness", budget=50000',
      validation: 'PASSED',
      authoritativeEngine: 'Rules Engine: Budget cap validated against organization headroom ($40,000 allowance)',
      result: 'Draft campaign cmp-draft-fit-01 committed in Draft state',
      actor: 'Admin (Risk Officer)',
      status: 'SUCCESS',
      durationMs: 145,
    },
    {
      id: 'exec-8909',
      timestamp: '2026-09-26 14:48:32',
      agent: 'Merchant POS Node (Saigon Fitness)',
      tool: 'verify_purchase',
      domain: 'REDEMPTION',
      classification: 'READ',
      inputSummary: 'patron="usr-sarah-chen", amount=45.00 USD, terminal="POS-SF-04"',
      validation: 'PASSED',
      authoritativeEngine: 'Fraud Engine: In-store HMAC signature valid, zero double-claim signals',
      result: 'Verified purchase receipt committed to event journal',
      actor: 'External POS Node',
      status: 'SUCCESS',
      durationMs: 42,
    },
    {
      id: 'exec-8908',
      timestamp: '2026-09-26 14:45:19',
      agent: 'AI Campaign Builder',
      tool: 'publish_campaign',
      domain: 'CAMPAIGN',
      classification: 'SENSITIVE',
      inputSummary: 'campaignId="cmp-draft-fit-01", budget=50000 CRD',
      validation: 'PASSED',
      authoritativeEngine: 'Credit Ledger: Escrow reserve locked; Rules Engine activated triggers',
      result: 'Campaign activated live on network',
      actor: 'Super Admin',
      status: 'SUCCESS',
      durationMs: 310,
    },
    {
      id: 'exec-8907',
      timestamp: '2026-09-26 14:38:05',
      agent: 'Autonomous Rate Limiter Node',
      tool: 'issue_credit',
      domain: 'CREDIT',
      classification: 'SENSITIVE',
      inputSummary: 'userId="usr-alex-m", amount=2500 CRD, reason="Batch referral grant"',
      validation: 'ESCALATED',
      authoritativeEngine: 'Fraud Engine: Triggered velocity anomaly rule (>2,000 CRD single grant)',
      result: 'Action placed in Quarantine queue pending dual-sign clearance',
      actor: 'AI Agent',
      status: 'PENDING_APPROVAL',
      durationMs: 82,
    },
    {
      id: 'exec-8906',
      timestamp: '2026-09-26 14:22:15',
      agent: 'Funnel Diagnostic Agent',
      tool: 'analyze_funnel',
      domain: 'ANALYTICS',
      classification: 'READ',
      inputSummary: 'scope="ALL", funnelId="lifecycle-default"',
      validation: 'PASSED',
      authoritativeEngine: 'Rules Engine: Telemetry aggregated across 8,450 records',
      result: 'Identified 38% post-earn drop-off at Pool Discovery',
      actor: 'AI Agent',
      status: 'SUCCESS',
      durationMs: 220,
    },
    {
      id: 'exec-8905',
      timestamp: '2026-09-26 14:10:44',
      agent: 'POS Cashier Terminal #02 (ABC Coffee)',
      tool: 'redeem_benefit',
      domain: 'REDEMPTION',
      classification: 'SENSITIVE',
      inputSummary: 'userId="usr-sarah-chen", benefitId="ben-coffee-flight", credits=450',
      validation: 'PASSED',
      authoritativeEngine: 'Credit Ledger: Debited 450 CRD, balance sheet journal confirmed',
      result: 'Burn voucher code VCH-88219 committed to cryptographic ledger',
      actor: 'Platform Operator',
      status: 'SUCCESS',
      durationMs: 95,
    },
  ];

  // ============================================================================
  // 4. EXTERNAL MCP (Inbound Verified Events Mapping)
  // ============================================================================
  private externalMappings: ExternalMCPEventMapping[] = [
    {
      id: 'map-pos-purchase',
      sourceServer: 'Merchant POS MCP',
      externalTool: 'verify_purchase()',
      eventType: 'EVENT_PURCHASE_VERIFIED',
      payloadRequirements: ['transactionId', 'merchantId', 'patronToken', 'amountUsd', 'digitalSignature'],
      mappedCreditRule: 'First Purchase & Spend Milestone Quest',
      creditRewardFormula: 'Fixed 200 CRD on first order, 5% spend equivalent thereafter',
      destinationPool: 'Fitness & Wellness Pool',
      fraudEngineChecks: ['Zero-Double-Claim Hash Verification', 'POS Terminal mTLS Check', 'Patron 24h Velocity Cap'],
      status: 'ACTIVE',
      lastTriggered: '12 seconds ago',
      totalTriggerCount: 4820,
    },
    {
      id: 'map-event-attendance',
      sourceServer: 'Event MCP',
      externalTool: 'verify_attendance()',
      eventType: 'EVENT_ATTENDANCE_VERIFIED',
      payloadRequirements: ['ticketId', 'venueId', 'patronToken', 'checkInTimestamp', 'geoFenceProof'],
      mappedCreditRule: 'Community Workshop & Run Club Check-in',
      creditRewardFormula: '150 CRD per verified attendance event (max 2 per week)',
      destinationPool: 'City Life Pool',
      fraudEngineChecks: ['Geo-fence GPS Integrity', 'Ticket Barcode Single-Use Verification'],
      status: 'ACTIVE',
      lastTriggered: '14 minutes ago',
      totalTriggerCount: 1240,
    },
    {
      id: 'map-creator-content',
      sourceServer: 'Creator Platform MCP',
      externalTool: 'verify_content()',
      eventType: 'EVENT_CONTENT_VERIFIED',
      payloadRequirements: ['contentUrl', 'creatorToken', 'hashtagProof', 'impressionsCount', 'verificationStatus'],
      mappedCreditRule: 'Patron UGC Story & Tag Reward Drive',
      creditRewardFormula: '100 CRD baseline + 25 CRD per 500 verified views',
      destinationPool: 'Lifestyle & Exploration Pool',
      fraudEngineChecks: ['Social Graph Bot Filtering', 'Branded Asset Authenticity Audit'],
      status: 'ACTIVE',
      lastTriggered: '8 minutes ago',
      totalTriggerCount: 890,
    },
    {
      id: 'map-payment-gateway',
      sourceServer: 'Payment MCP',
      externalTool: 'verify_transaction()',
      eventType: 'EVENT_TRANSACTION_VERIFIED',
      payloadRequirements: ['bankRef', 'gatewayId', 'payerAccount', 'payeeAccount', 'amount'],
      mappedCreditRule: 'Enterprise Escrow & B2B Settlement Tranche',
      creditRewardFormula: '1:1 Nominal Clearing Tranche Commitment',
      destinationPool: 'Treasury Settlement Pool',
      fraudEngineChecks: ['Bank Webhook HMAC Clearance', 'Sanctions & AML Check', 'Double-Entry Invariant Proof'],
      status: 'ACTIVE',
      lastTriggered: '45 seconds ago',
      totalTriggerCount: 6540,
    },
  ];

  // ----------------------------------------------------
  // Public Accessors
  // ----------------------------------------------------
  public getServers(): MCPServerConnector[] {
    return this.servers;
  }

  public getTools(): MCPToolDefinition[] {
    return this.tools;
  }

  public getExecutionLogs(): MCPExecutionLogEntry[] {
    return this.executionLogs;
  }

  public getExternalMappings(): ExternalMCPEventMapping[] {
    return this.externalMappings;
  }

  // ----------------------------------------------------
  // Action: Authorize Sensitive Pending Log
  // ----------------------------------------------------
  public authorizeExecution(logId: string, actor: string): boolean {
    const entry = this.executionLogs.find((l) => l.id === logId);
    if (!entry) return false;

    entry.status = 'SUCCESS';
    entry.validation = 'PASSED';
    entry.actor = actor as any;
    entry.result = `Approved by ${actor}. Ledger action committed.`;
    return true;
  }

  // ----------------------------------------------------
  // Action: Reject Pending Log
  // ----------------------------------------------------
  public rejectExecution(logId: string, reason: string): boolean {
    const entry = this.executionLogs.find((l) => l.id === logId);
    if (!entry) return false;

    entry.status = 'REJECTED';
    entry.result = `Rejected: ${reason}`;
    return true;
  }

  // ----------------------------------------------------
  // Action: Simulate Inbound External Event
  // ----------------------------------------------------
  public simulateInboundEvent(mappingId: string, simulatedPayload: Record<string, any>) {
    const mapping = this.externalMappings.find((m) => m.id === mappingId) || this.externalMappings[0];
    mapping.totalTriggerCount += 1;
    mapping.lastTriggered = 'Just now';

    const newLog: MCPExecutionLogEntry = {
      id: `exec-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      agent: `${mapping.sourceServer} (Inbound Webhook)`,
      tool: mapping.externalTool.replace('()', ''),
      domain: 'REDEMPTION',
      classification: 'READ',
      inputSummary: JSON.stringify(simulatedPayload),
      validation: 'PASSED',
      authoritativeEngine: `Fraud Engine: ${mapping.fraudEngineChecks[0]} verified successfully`,
      result: `Event consumed by Credit Economy OS. Rule "${mapping.mappedCreditRule}" triggered. Award routed to "${mapping.destinationPool}".`,
      actor: 'External POS Node',
      status: 'SUCCESS',
      durationMs: Math.floor(35 + Math.random() * 50),
    };

    this.executionLogs.unshift(newLog);

    return {
      success: true,
      log: newLog,
      mapping,
    };
  }

  // ----------------------------------------------------
  // Action: Test Server Ping
  // ----------------------------------------------------
  public pingServer(serverId: string) {
    const server = this.servers.find((s) => s.id === serverId);
    if (!server) return null;

    server.lastSync = 'Just now';
    server.latencyMs = Math.floor(25 + Math.random() * 40);
    server.status = 'CONNECTED';
    return {
      serverId: server.id,
      name: server.name,
      status: server.status,
      latencyMs: server.latencyMs,
      endpoint: server.endpoint,
    };
  }
}

export const mcpRegistry = new MCPRegistryService();
