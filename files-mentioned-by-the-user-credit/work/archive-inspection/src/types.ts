export type TransactionState =
  | 'DRAFT'
  | 'RESERVED'
  | 'SUBMITTED'
  | 'VERIFYING'
  | 'EXCEPTION_DETECTED'
  | 'RECOMMENDED'
  | 'APPROVED'
  | 'SETTLED';

export interface Participant {
  name: string;
  id: string;
  organization: string;
  role: 'Payer' | 'Provider' | 'Platform';
  avatarInitials: string;
  walletAddress: string;
  startingBalance: number;
  currentBalance: number;
}

export interface DeliverableItem {
  id: string;
  milestoneId: string;
  name: string;
  format: string;
  fileSize: string;
  hash: string;
  status: 'VERIFIED' | 'MISSING' | 'PENDING' | 'FAILED';
  submittedAt: string;
  aspectRatio?: string;
  notes?: string;
}

export interface Milestone {
  id: string;
  clause: string;
  title: string;
  credits: number;
  percentage: number;
  status: 'VERIFIED' | 'PARTIAL' | 'HELD' | 'PENDING';
  deliverables: DeliverableItem[];
  verificationNote?: string;
}

export interface AIVerificationResult {
  finding: string;
  fulfillmentScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'Low' | 'Medium' | 'High';
  recommendation: 'release' | 'hold' | 'refund' | 'escalate' | string;
  releaseAmount: number;
  holdAmount: number;
  confidence: number;
  rationale: string;
  evidence: string[];
  timestamp: string;
  engine: string;
  isValidated?: boolean;
  validationDetails?: {
    totalConserved: boolean;
    balanceConstraintPassed: boolean;
    boundsChecked: boolean;
  };
  milestonesEvaluation?: Array<{
    name: string;
    status: string;
    allocated: number;
    recommended: number;
    note?: string;
  }>;
}

export interface LedgerEntry {
  id: string;
  entrySequence: number;
  timestamp: string;
  transactionId: string;
  type: 'RESERVE' | 'RELEASE' | 'FEE' | 'HOLD' | 'SETTLEMENT' | 'RECONCILIATION';
  accountDebit: string;
  accountCredit: string;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  description: string;
  merkleRoot: string;
  status: 'FINALIZED' | 'PENDING';
}

export interface TimelineEvent {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  timestamp: string;
  actor: 'Sarah Chen' | 'Alex Morgan' | 'AI Economic Operator' | 'Human Risk Officer' | 'Deterministic Engine' | 'User Platform' | string;
  status: 'completed' | 'active' | 'upcoming';
  badge?: string;
}

export interface Transaction {
  id: string;
  title: string;
  description: string;
  payer: Participant;
  provider: Participant;
  platform: Participant;
  totalValue: number;
  platformFee: number;
  currency: string;
  state: TransactionState;
  createdAt: string;
  milestones: Milestone[];
  escrowBalance: number;
  aiVerification?: AIVerificationResult;
  humanApprovedBy?: string;
  humanApprovedAt?: string;
  settledAt?: string;
  timeline: TimelineEvent[];
  ledgerEntries: LedgerEntry[];
  merkleAuditRoot: string;
  auditSignature: string;
}

export interface CreditType {
  id: string;
  code: string;
  name: string;
  category: 'PAID' | 'PROMOTIONAL' | 'SPONSORED' | 'ECOSYSTEM';
  description: string;
  fungibility: 'STRICT_ISOLATED' | 'FUNGIBLE_POOL' | 'RESTRICTED_APP';
  spendPriority: number; // lower number = spent first in waterfall
  expiryDays: number; // 0 = never expires
  conversionRateUsd: number; // e.g. 0.01 = $1 per 100 credits
  activeSupply: number;
  reservedLiability: number;
  totalBurned: number;
  allowedSpendProducts: string[];
  isProtected: boolean;
  status: 'ACTIVE' | 'DEPRECATED' | 'FROZEN';
  updatedAt: string;
}

export interface RewardRule {
  id: string;
  code: string;
  name: string;
  triggerEvent: string;
  creditTypeId: string;
  baseAmount: number;
  multiplierFormula: string;
  cooldownMinutes: number;
  maxClaimsPerUser: number;
  campaignBudgetId: string;
  status: 'ACTIVE' | 'PAUSED' | 'SIMULATING' | 'DRAFT';
  version: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface SpendProduct {
  id: string;
  code: string;
  name: string;
  category: 'COMPUTE' | 'GENERATIVE_AI' | 'STORAGE' | 'AGENT_ORCHESTRATION';
  cogsUsd: number;
  marginTargetPercent: number;
  unitPriceCredits: number;
  providerRevSharePercent: number;
  reservationTtlMinutes: number;
  status: 'ACTIVE' | 'MAINTENANCE' | 'ARCHIVED';
  avgDailyVolume: number;
}

export interface PriceRule {
  id: string;
  code: string;
  spendProductId: string;
  productName: string;
  pricingModel: 'FLAT_TIER' | 'DYNAMIC_SPOT' | 'SURGE_PROTECTED';
  basePriceCredits: number;
  currentMultiplier: number;
  minMarginFloorPercent: number;
  effectiveFrom: string;
  status: 'ACTIVE' | 'PENDING_APPROVAL' | 'SUPERSEDED';
  cogsBenchmarkUsd: number;
}

export interface WalletPolicy {
  id: string;
  name: string;
  spendWaterfallOrder: string[];
  defaultReservationTtlMin: number;
  overdraftAllowed: boolean;
  maxDailySpendCredits: number;
  kycTierRequired: string;
  autoReclaimExpired: boolean;
  status: 'ACTIVE' | 'DRAFT';
}

export interface RiskPolicy {
  id: string;
  code: string;
  name: string;
  targetMetric: string;
  thresholdCondition: string;
  action: 'AUTO_HOLD' | 'REQUIRE_DUAL_SIGN' | 'FLAG_FOR_REVIEW' | 'REJECT';
  activeHoldsCount: number;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  status: 'ENFORCING' | 'MONITOR_ONLY' | 'DISABLED';
}

export interface BudgetEnvelope {
  id: string;
  code: string;
  name: string;
  department: string;
  creditTypeId: string;
  allocatedCredits: number;
  consumedCredits: number;
  softCapPercent: number;
  hardCapPercent: number;
  alertRecipients: string[];
  autoThrottleOnSoftCap: boolean;
  status: 'HEALTHY' | 'WARNING' | 'EXHAUSTED';
}

export interface AuditLogRecord {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  objectType: 'CreditType' | 'RewardRule' | 'SpendProduct' | 'PriceRule' | 'RiskPolicy' | 'WalletPolicy' | 'Settlement' | 'Ledger' | 'UserAccount' | 'Transaction' | 'CreditRule' | 'Organization' | 'Program';
  objectId: string;
  changesDiff: {
    field: string;
    before: string | number;
    after: string | number;
  }[];
  signatureHash: string;
  rollbackAvailable: boolean;
  dualSigner?: string;
}

export interface SimulationScenario {
  id: string;
  title: string;
  targetObject: string;
  parameter: string;
  currentValue: string;
  proposedValue: string;
  affectedUsersEstimate: number;
  rewardLiabilityDeltaCredits: number;
  grossMarginDeltaPercent: number;
  budgetExhaustionShiftDays: number;
  riskExposureScoreDelta: string;
  dataConfidence: 'ACTUAL' | 'ESTIMATED' | 'PROJECTED';
  missingDataNotes?: string;
  policyBoundCheck: 'PASSED' | 'WARNING' | 'VIOLATION';
}

export interface AIAnalystCapability {
  id: string;
  role: 'Economic Analyst' | 'Risk Analyst' | 'Reward Analyst' | 'Pricing Analyst' | 'Settlement Analyst' | 'Reconciliation Analyst';
  code: string;
  title: string;
  status: 'IDLE' | 'OBSERVING' | 'REASONING' | 'RECOMMENDING';
  monitoredEntities: string[];
  activeRulesConsulted: string[];
  confidenceScore: number;
  pendingRecommendationsCount: number;
  lastExecutionTimestamp: string;
}

export interface AIRecommendationItem {
  id: string;
  analystRole: string;
  analystCode: string;
  title: string;
  observation: string;
  rationale: string;
  proposedAction: string;
  confidence: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  policyBoundCheckPassed: boolean;
  requiredApprovalRole: string;
  status: 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'DISMISSED';
  timestamp: string;
  targetEntityId: string;
}

export interface EconomicIntegrityViolation {
  code:
    | 'DOUBLE_SETTLEMENT'
    | 'UNAUTHORIZED_EXECUTION'
    | 'EXCESS_DISBURSAL'
    | 'CAPITAL_CREATION'
    | 'NEGATIVE_ALLOCATION'
    | 'UNBALANCED_SETTLEMENT'
    | 'DUPLICATE_LEDGER_ENTRY'
    | 'UNRECONCILED_LEDGER';
  title: string;
  message: string;
  invariant: string;
  timestamp: string;
  transactionId?: string;
  attemptedValues?: {
    releaseAmount?: number;
    holdAmount?: number;
    escrowBalance?: number;
    totalAllocated?: number;
    discrepancy?: number;
  };
}

export type UserStatus = 'Active' | 'Pending Review' | 'Restricted' | 'Suspended';
export type UserRole = 'Payer' | 'Provider' | 'Platform' | 'Hybrid';
export type UserGroup = 'Enterprise Tier' | 'Growth Tier' | 'Developer Standard' | 'Verified Partner';

export interface UserRewardItem {
  id: string;
  code: string;
  name: string;
  credits: number;
  category: string;
  issuedAt: string;
  status: 'Active' | 'Redeemed' | 'Expired';
}

export interface UserActivityEvent {
  id: string;
  timestamp: string;
  type: 'TRANSACTION' | 'CREDIT_ADJUSTMENT' | 'REWARD' | 'STATUS_CHANGE' | 'LIMIT_CHANGE' | 'USER_SUBMISSION';
  title: string;
  description: string;
  actor: string;
  amount?: number;
  relatedId?: string;
}

export interface ProposedUserChange {
  field: 'creditAdjustment' | 'creditLimit' | 'status' | 'userGroup' | 'reward' | 'intervention';
  fieldLabel: string;
  currentValue: string | number;
  proposedValue: string | number;
  reason: string;
  affects: string[];
}

export type JourneyStageId =
  | 'ACCOUNT_CREATED'
  | 'CREDIT_ACTIVATED'
  | 'FIRST_CREDIT_USED'
  | 'TRANSACTION_CREATED'
  | 'DELIVERABLE_SUBMITTED'
  | 'VERIFICATION_PASSED'
  | 'SETTLEMENT_COMPLETED'
  | 'REPEAT_TRANSACTION';

export interface UserJourneyStage {
  id: JourneyStageId;
  name: string;
  order: number;
  status: 'COMPLETED' | 'CURRENT' | 'BLOCKED' | 'UPCOMING';
  completedAt?: string;
  timeFromPreviousStage?: string;
  events: Array<{
    id: string;
    timestamp: string;
    title: string;
    description: string;
    metadata?: string;
  }>;
}

export interface FunnelStageMetric {
  id: JourneyStageId;
  name: string;
  order: number;
  usersEntered: number;
  usersCompleted: number;
  conversionRate: number;
  dropOffRate: number;
  avgTimeToNext: string;
  isLargestDropOff?: boolean;
}

export interface FrictionSignal {
  id: string;
  code: string;
  name: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  evidence: string;
  observedData: string;
  detectedAt: string;
  relatedTransactionId?: string;
  status: 'ACTIVE' | 'RESOLVED' | 'DISMISSED';
}

export interface AIUserInsight {
  id: string;
  summary: string;
  observedFact: string;
  interpretation: string;
  frictionSignalId?: string;
  confidence: 'High' | 'Medium' | 'Low';
  generatedAt: string;
}

export interface AIUserRecommendation {
  id: string;
  title: string;
  reason: string;
  expectedEffect: string;
  confidence: 'High' | 'Medium' | 'Low';
  actionType:
    | 'REQUEST_DOCUMENT'
    | 'SEND_GUIDANCE'
    | 'ADJUST_CREDIT'
    | 'INCREASE_LIMIT'
    | 'REVIEW_TRANSACTION'
    | 'REMOVE_RESTRICTION'
    | 'DO_NOTHING';
  actionPayload?: any;
  affects: string[];
  status: 'PENDING' | 'PREVIEWING' | 'APPLIED' | 'DISMISSED';
}

export interface UserInterventionRecord {
  id: string;
  timestamp: string;
  actionTitle: string;
  actionDetails: string;
  actor: string;
  outcomeTime: string;
  outcomeDescription: string;
  resultStatus: 'RESOLVED' | 'CONVERTED' | 'IMPROVED' | 'NO_CHANGE';
}

export interface UserSegmentComparison {
  metric: string;
  thisUserValue: string | number;
  similarUsersValue: string | number;
  allUsersValue: string | number;
  assessment: string;
  deltaType: 'positive' | 'negative' | 'neutral';
}

export interface UserPendingAction {
  id: string;
  title: string;
  type: 'MISSING_DELIVERABLE' | 'VERIFICATION_REQUIRED' | 'APPROVAL_NEEDED' | 'KYC_UPDATE';
  transactionId?: string;
  severity: 'high' | 'medium' | 'low';
  actionLabel: string;
  dueText: string;
}

export interface ManagedUser {
  id: string;
  name: string;
  email: string;
  status: UserStatus;
  role: UserRole;
  userGroup: UserGroup;
  organization: string;
  avatarInitials: string;
  walletAddress: string;
  createdAt: string;
  lastActive: string;
  creditAccount: {
    accountId: string;
    totalCredit: number;
    availableCredit: number;
    reservedCredit: number;
    creditLimit: number;
    currency: string;
    autoRecharge: boolean;
  };
  activeTransactionIds: string[];
  pendingActions: UserPendingAction[];
  rewards: UserRewardItem[];
  activity: UserActivityEvent[];
  lastSyncedAt: string;
  // User Journey & Intelligence
  journeyStages: UserJourneyStage[];
  frictionSignals: FrictionSignal[];
  aiInsights: AIUserInsight[];
  recommendations: AIUserRecommendation[];
  interventions: UserInterventionRecord[];
  segmentComparisons: UserSegmentComparison[];
  userPlatformNotification?: string | null;
  userType?: 'Consumer' | 'Business' | 'Admin';
  organizationMemberships?: UserOrganizationMembership[];
  questProgress?: Array<{
    questId: string;
    questName: string;
    orgName: string;
    progress: number;
    target: number;
    status: 'In Progress' | 'Completed';
    creditsEarned: number;
    lastActivity: string;
  }>;
  campaignParticipation?: Array<{
    campaignId: string;
    campaignName: string;
    orgName: string;
    status: 'Active' | 'Completed';
    questsCompleted: number;
    totalQuests: number;
    bonusCredits: number;
  }>;
}

export type User = ManagedUser;

// ==========================================
// UNIFIED ORGANIZATION & VENDOR ECOSYSTEM
// ==========================================

export type OrganizationType = 'Vendor' | 'Brand' | 'Partner' | 'Merchant' | 'Service Provider' | 'Other';
export type OrganizationStatus = 'Active' | 'Pending Review' | 'Suspended' | 'Onboarding';
export type OrganizationPlan = 'Starter' | 'Growth' | 'Enterprise';
export type OrganizationRole = 'Owner' | 'Admin' | 'Campaign Manager' | 'Program Manager' | 'Analyst' | 'Member';

export interface OrganizationMember {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  avatarInitials: string;
  role: OrganizationRole;
  permissions: string[];
  joinedAt: string;
  programsParticipated: number;
  creditsEarned: number;
  creditsRedeemed: number;
}

export interface UserOrganizationMembership {
  organizationId: string;
  organizationName: string;
  organizationType: OrganizationType;
  role: OrganizationRole;
  permissions: string[];
  joinedAt: string;
  programsParticipated: number;
  creditsEarned: number;
  creditsRedeemed: number;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  type: OrganizationType;
  status: OrganizationStatus;
  plan: OrganizationPlan;
  logoInitials: string;
  industry: string;
  primaryContact: {
    name: string;
    email: string;
    role: string;
  };
  createdAt: string;
  membersCount: number;
  activeProgramsCount: number;
  activeQuestsCount: number;
  activeCampaignsCount: number;
  creditsIssued: number;
  creditsRedeemed: number;
  outstandingCredits: number;
  monthlyBudget: number;
  budgetUsed: number;
  questCompletionRate: number;
  campaignConversion: number;
  creditRulesSummary: string;
  members: OrganizationMember[];
  customEarningMultiplier?: number;
  redemptionRatePerCredit?: number; // USD value per 100 CRD
}

export type OwnershipType = 'PLATFORM' | 'VENDOR' | 'BRAND' | 'PARTNER' | 'MERCHANT' | 'SERVICE_PROVIDER';

export type ProgramStatus = 'Draft' | 'Pending Approval' | 'Active' | 'Paused' | 'Completed' | 'Archived';
export type QuestStatus = 'Draft' | 'Pending Approval' | 'Scheduled' | 'Active' | 'Paused' | 'Completed' | 'Expired' | 'Archived';
export type CampaignStatus = 'Draft' | 'Pending Approval' | 'Scheduled' | 'Active' | 'Paused' | 'Completed' | 'Expired' | 'Archived';

export type QuestType =
  | 'Purchase'
  | 'Visit'
  | 'Check-in'
  | 'Review'
  | 'Referral'
  | 'Signup'
  | 'Feature Usage'
  | 'Subscription'
  | 'Engagement'
  | 'Streak'
  | 'Challenge'
  | 'Spend Threshold'
  | 'Multi-step Action';

export interface Quest {
  id: string;
  name: string;
  description: string;
  owner: string;
  organizationId: string;
  organizationName: string;
  ownershipType: OwnershipType;
  programId?: string;
  campaignId?: string;
  trigger: string;
  eventType: string;
  condition: string;
  progressRule: string;
  completionRule: string;
  creditReward: number;
  frequency: 'Once' | 'Daily' | 'Weekly' | 'Monthly' | 'Unlimited';
  budget: number;
  budgetUsed: number;
  audience: string;
  startDate: string;
  endDate?: string;
  status: QuestStatus;
  questType: QuestType;
  participantsCount: number;
  completionsCount: number;
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  organizationId: string;
  organizationName: string;
  ownershipType: OwnershipType;
  programId?: string;
  questIds: string[];
  audience: string;
  timeline: string;
  budget: number;
  budgetUsed: number;
  creditStrategy: string;
  rewardStrategy: string;
  status: CampaignStatus;
  participants: number;
  questStarts: number;
  questCompletions: number;
  conversionRate: number;
  creditsIssued: number;
  redemptionRate: number;
  roiMetric: string;
}

export interface CreditProgram {
  id: string;
  name: string;
  description: string;
  organizationId: string;
  organizationName: string;
  ownershipType: OwnershipType;
  type: 'Loyalty' | 'Growth' | 'Referral' | 'Seasonal' | 'Ecosystem';
  status: ProgramStatus;
  budget: number;
  budgetUsed: number;
  questIds: string[];
  campaignIds: string[];
  participantsCount: number;
  creditsIssued: number;
  startDate: string;
  endDate?: string;
}

export type Program = CreditProgram;

export interface CreditSampleTemplate {
  id: string;
  sampleName: string;
  industry: 'F&B' | 'Retail' | 'Fitness' | 'Travel' | 'Hospitality' | 'Entertainment' | 'SaaS' | 'Education' | 'Creative' | 'Community' | 'Other';
  trigger: string;
  recommendedCredit: number;
  frequency: string;
  estimatedCost: string;
  description: string;
  businessGoal: string;
  suggestedRules: string[];
}

export interface ApprovalRequest {
  id: string;
  organizationId: string;
  organizationName: string;
  programId?: string;
  programName: string;
  type: 'Quest' | 'Campaign' | 'Program' | 'Credit Rule';
  creditBudget: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  createdBy: string;
  submittedDate: string;
  status: 'PENDING' | 'APPROVED' | 'CHANGES_REQUESTED' | 'REJECTED';
  notes?: string;
  rulesSummary: string;
  dependencies: {
    quests?: string[];
    campaigns?: string[];
    audience: string;
  };
}

export interface RewardPoolItem {
  id: string;
  name: string;
  description: string;
  category: 'Product' | 'Benefit' | 'Discount' | 'Service' | 'Experience';
  creditsCost: number;
  organizationId?: string;
  organizationName: string;
  remainingInventory: number;
  totalRedeemed: number;
  status: 'Active' | 'Paused' | 'Depleted';
  eligibleTiers: string[];
}

export interface ProgramSimulationInput {
  userType: 'Consumer' | 'Business' | 'VIP';
  userSegment: 'New User' | 'Active Customer' | 'High Value' | 'At Risk' | 'Dormant';
  purchases: number;
  spend: number;
  visits: number;
  referrals: number;
  previousCompletions: number;
  currentCreditBalance: number;
  organizationId: string;
  campaignId: string;
}

export interface ProgramSimulationResult {
  eligibleQuests: Array<{
    questId: string;
    questName: string;
    status: 'Eligible' | 'Completed' | 'In Progress';
    progressPct: number;
    creditsCanEarn: number;
  }>;
  completedQuests: string[];
  creditsEarned: number;
  creditBreakdown: Array<{
    source: string;
    amount: number;
    reason: string;
  }>;
  campaignProgressPct: number;
  budgetConsumption: number;
  budgetRemaining: number;
  rewardEligibility: string[];
  projectedMonthlyCreditCost: number;
}

// ==========================================
// BENEFIT POOLS (SHARED DEMAND DESTINATIONS)
// ==========================================

export type PoolType =
  | 'Lifestyle'
  | 'Travel'
  | 'Wellness'
  | 'Creator'
  | 'Community'
  | 'Events'
  | 'Partner'
  | 'Seasonal';

export type PoolStatus = 'Draft' | 'Active' | 'Paused' | 'Fully Redeemed' | 'Expired';

export type BenefitType =
  | 'Voucher'
  | 'Discount'
  | 'Product'
  | 'Experience'
  | 'Service'
  | 'Access'
  | 'Freebie';

export interface PoolBenefit {
  id: string;
  poolId: string;
  name: string;
  description: string;
  type: BenefitType;
  providerOrgId: string;
  providerOrgName: string;
  creditsCost: number;
  totalInventory: number;
  remainingInventory: number;
  redeemedCount: number;
  eligibility: string;
  expirationDate: string;
  saversCount?: number;
  demandCredits?: number;
  status: 'Active' | 'Paused' | 'Depleted';
  featured?: boolean;
}

export interface ParticipatingOrgSummary {
  organizationId: string;
  organizationName: string;
  organizationType: OrganizationType;
  contributionCredits: number;
  benefitsOffered: string[];
}

export interface PoolDemandMetrics {
  totalTargetDemandCredits: number;
  accumulatingUsersCount: number;
  demandToFundingRatio: number;
  inventoryUtilizationPercent: number;
  benefitDemandBreakdown: Array<{
    benefitId: string;
    benefitName: string;
    providerName: string;
    targetCost: number;
    activeSaversCount: number;
    committedCredits: number;
    inventoryUnits: number;
    demandPressure: 'High' | 'Moderate' | 'Balanced';
  }>;
}

export interface PoolContribution {
  id: string;
  poolId: string;
  organizationId: string;
  organizationName: string;
  organizationType: OrganizationType;
  contributionType: 'Credit Funding' | 'Benefit Inventory' | 'Sponsored Benefit';
  amountCredits: number;
  inventoryUnits?: number;
  date: string;
  status: 'Committed' | 'Pending' | 'Settled';
  notes?: string;
}

export interface UserGoalAllocation {
  id: string;
  benefitId: string;
  benefitName: string;
  benefitType: BenefitType;
  providerOrgName: string;
  targetCredits: number;
  allocatedCredits: number;
  savedAt: string;
  status: 'Building' | 'Goal Reached' | 'Redeemed';
  isPrimary?: boolean;
}

export interface PoolParticipant {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  avatarInitials: string;
  poolId: string;
  availableCredits: number;
  poolCredits: number;
  goalBenefitId?: string;
  goalBenefitName?: string;
  goalTargetCredits?: number;
  goalProgressPercent?: number;
  goals?: UserGoalAllocation[];
  lastActivity: string;
  redemptionsCount: number;
}

export interface PoolRedemptionRecord {
  id: string;
  poolId: string;
  poolName: string;
  benefitId: string;
  benefitName: string;
  benefitType: BenefitType;
  userId: string;
  userName: string;
  providerOrgId: string;
  providerOrgName: string;
  creditsSpent: number;
  timestamp: string;
  status: 'COMPLETED' | 'PENDING_FULFILLMENT';
  ledgerTransactionId: string;
}

export interface BenefitPool {
  id: string;
  name: string;
  tagline: string;
  description: string;
  type: PoolType;
  status: PoolStatus;
  owner: string;
  durationStart: string;
  durationEnd: string;
  totalFundingCredits: number;
  committedCredits: number;
  participantsCount: number;
  redemptionRate: number;
  benefitsCount: number;
  benefits: PoolBenefit[];
  contributions: PoolContribution[];
  participants: PoolParticipant[];
  redemptions: PoolRedemptionRecord[];
  participatingOrgsSummary?: ParticipatingOrgSummary[];
  demandMetrics?: PoolDemandMetrics;
  rules: {
    eligibleUserTiers: string[];
    minCreditsToJoin: number;
    maxRedemptionsPerUser: number;
    perUserLimitNote: string;
    poolExpiration: string;
    benefitExpiration: string;
  };
}

// ==========================================
// DIGITAL EXPERIENCE LAYER (DX)
// "Experience-to-Economy Loop"
// ==========================================

export type ExperienceStatus = 'Draft' | 'Scheduled' | 'Active' | 'Completed' | 'Paused' | 'Archived';

export type ExperienceType =
  | 'Challenge'
  | 'Event'
  | 'Community'
  | 'Brand Story'
  | 'Service Discovery'
  | 'Creator Showcase'
  | 'Omnichannel';

export type ExperienceChannel =
  | 'Web'
  | 'QR'
  | 'Partner Website'
  | 'Campaign Link'
  | 'Social'
  | 'Event Venue'
  | 'Merchant POS'
  | 'Mobile App';

export type ExperienceEventType =
  | 'experience_viewed'
  | 'experience_started'
  | 'content_viewed'
  | 'quest_started'
  | 'quest_completed'
  | 'product_discovered'
  | 'partner_discovered'
  | 'benefit_viewed'
  | 'pool_joined'
  | 'cta_clicked'
  | 'purchase_started'
  | 'purchase_completed'
  | 'credit_earned'
  | 'benefit_redeemed'
  | 'referral_completed';

export type JourneyNodeType =
  | 'ENTRY'
  | 'TRIGGER'
  | 'EXPERIENCE'
  | 'CONTENT'
  | 'ACTION'
  | 'VALUE'
  | 'CREDIT'
  | 'POOL'
  | 'BENEFIT'
  | 'CONVERSION'
  | 'FOLLOW_UP'
  | 'FOLLOW-UP';

export interface JourneyNode {
  id: string;
  type: JourneyNodeType;
  title: string;
  subtitle: string;
  description: string;
  subtype: string; // e.g. QR scan, Hero, Quest, Earn Credits, Join Pool, Voucher, Purchase, etc.
  conditions?: string[];
  eligibility?: string;
  audience?: string;
  partner?: string;
  goal?: string;
  eventTriggered?: ExperienceEventType;
  creditRuleId?: string;
  creditRewardAmount?: number;
  poolId?: string;
  benefitId?: string;
  conversionGoal?: string;
  stats?: {
    entered: number;
    completed: number;
    dropoffRate: number;
  };
}

export interface ExperienceJourney {
  id: string;
  name: string;
  description: string;
  nodes: JourneyNode[];
}

export interface JourneyEdgeEntity {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  condition?: string;
}

export interface JourneyNodeEntity {
  id: string;
  journeyId: string;
  type: JourneyNodeType;
  name: string;
  config: Record<string, any>;
  conditions: string[];
  position?: { x: number; y: number };
  nextNodeIds: string[];
}

export interface JourneyEntity {
  id: string;
  experienceId: string;
  name: string;
  nodes: JourneyNodeEntity[];
  edges: JourneyEdgeEntity[];
  status: 'draft' | 'active' | 'archived';
}

export interface ExperienceEventEntity {
  id: string;
  experienceId: string;
  journeyId: string;
  userId: string;
  eventType: ExperienceEventType;
  partnerId: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface ExperienceSessionEntity {
  id: string;
  experienceId: string;
  userId: string;
  startedAt: string;
  lastActivityAt: string;
  currentNode: string;
  status: 'active' | 'completed' | 'abandoned';
  conversionStatus: 'pending' | 'converted' | 'dropped';
}

export interface ExperienceAttributionEntity {
  id: string;
  experienceId: string;
  userId: string;
  conversionType: string;
  conversionId: string;
  attributedValue: number;
  attributionModel: 'first_touch' | 'last_touch' | 'linear' | 'time_decay' | 'data_driven';
  timestamp: string;
}

export interface ExperienceEntity {
  id: string;
  name: string;
  type: ExperienceType;
  objective: string;
  description: string;
  status: ExperienceStatus;
  partnerId: string;
  audienceId: string;
  journeyId: string;
  creditRuleId?: string;
  poolId?: string;
  primaryBenefitId?: string;
  channels: ExperienceChannel[];
  startDate: string;
  endDate?: string;
  conversionGoal: string;
  createdAt: string;
}

export interface Experience {
  id: string;
  name: string;
  type: ExperienceType;
  objective: string;
  description?: string;
  status: ExperienceStatus;
  partnerId: string;
  audienceId?: string;
  journeyId?: string;
  creditRuleId?: string;
  poolId?: string;
  primaryBenefitId?: string;
  channels: ExperienceChannel[];
  startDate: string;
  endDate?: string;
  conversionGoal?: string;
  createdAt?: string;

  // Compatibility & Presentation fields
  partnerName: string;
  audience: string;
  participantsCount: number;
  engagementRate: number; // %
  completionRate: number; // %
  creditsGenerated: number;
  creditsRedeemed: number;
  conversionRate: number; // %
  attributedTransactions: number;
  attributedRevenueUsd: number;
  cacUsd: number;
  journey: ExperienceJourney;
  associatedCampaignId?: string;
  associatedPoolId?: string;
  featuredBenefits?: string[];
  tags: string[];
  coverImage?: string;
}

export interface ExperienceMarketplaceItem {
  id: string;
  experienceId?: string;
  title: string;
  partnerName: string;
  category: 'Fitness' | 'Dining & Food' | 'Travel & Stays' | 'Creator & Arts' | 'Wellness' | 'Entertainment';
  creditsRequired?: number;
  creditsEarned?: number;
  availability: 'Available Now' | 'Limited Slots' | 'Coming Soon' | 'High Demand';
  eligibility: string;
  estimatedDuration: string;
  description: string;
  ctaText: string;
  rating?: number;
  participantsCount: number;
  poolName?: string;
  poolId?: string;
}

export interface NextBestExperience {
  id: string;
  title: string;
  reasonType: 'RECENT_CHALLENGE' | 'CREDIT_THRESHOLD' | 'SIMILAR_INTERESTS' | 'POOL_GOAL_PROXIMITY' | 'NEW_PARTNER';
  contextualReason: string;
  partnerName: string;
  creditsDelta?: number;
  poolId?: string;
  poolName?: string;
  experienceId: string;
  actionLabel: string;
  urgency?: 'HIGH' | 'MEDIUM' | 'OPPORTUNITY';
}

export interface TouchpointConfig {
  id: string;
  name: string;
  channel: ExperienceChannel;
  experienceId: string;
  experienceName: string;
  partnerName: string;
  identifierUrl: string;
  qrCodeDataUrl?: string;
  totalImpressions: number;
  scansOrClicks: number;
  actionsTriggered: number;
  creditsIssued: number;
  status: 'Active' | 'Paused';
  locationOrPlacement: string;
}

export interface ExperienceFunnelMetrics {
  impressions: number;
  discovery: number;
  experienceOpen: number;
  engagement: number;
  actionCompleted: number;
  creditEarned: number;
  poolVisit: number;
  benefitView: number;
  redemption: number;
  transaction: number;
  retention: number;
}

