import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Transaction,
  LedgerEntry,
  TimelineEvent,
  AIVerificationResult,
  EconomicIntegrityViolation,
  TransactionState,
  CreditType,
  RewardRule,
  SpendProduct,
  PriceRule,
  WalletPolicy,
  RiskPolicy,
  BudgetEnvelope,
  AuditLogRecord,
  SimulationScenario,
  AIAnalystCapability,
  AIRecommendationItem,
  ManagedUser,
  ProposedUserChange,
  UserStatus,
  FunnelStageMetric,
  Organization,
  OrganizationMember,
  OrganizationRole,
  Quest,
  Campaign,
  CreditProgram,
  CreditSampleTemplate,
  ApprovalRequest,
  RewardPoolItem,
  ProgramSimulationInput,
  ProgramSimulationResult,
  BenefitPool,
  PoolBenefit,
  PoolContribution,
  PoolParticipant,
  PoolRedemptionRecord,
} from '../types';
import { seedBenefitPools } from '../data/poolsSeedData';
import {
  initialTransactionTX1048,
  sampleTransactions,
  initialHistoricalLedgerEntries,
  goldenDeliverablesM1,
  goldenDeliverablesM2,
  goldenDeliverablesM3,
  seedCreditTypes,
  seedRewardRules,
  seedSpendProducts,
  seedPriceRules,
  seedWalletPolicies,
  seedRiskPolicies,
  seedBudgetEnvelopes,
  seedAuditLogs,
  seedSimulationScenarios,
  seedAIAnalystCapabilities,
  seedAIRecommendations,
  seedUsers,
  seedFunnelMetrics,
  seedOrganizations,
  seedQuests,
  seedCampaigns,
  seedPrograms,
  seedCreditSamples,
  seedApprovalRequests,
  seedRewardPools,
} from '../data/seedData';

interface EconomicContextType {
  currentPath: string;
  navigate: (path: string) => void;
  tx: Transaction;
  allTransactions: Transaction[];
  ledger: LedgerEntry[];
  isVerifying: boolean;
  integrityError: EconomicIntegrityViolation | null;
  clearIntegrityError: () => void;
  createAndReserveCredits: (params: {
    title: string;
    description: string;
    payerName: string;
    providerName: string;
    totalAmount: number;
    platformFee: number;
    milestones: Array<{ title: string; credits: number; clause: string }>;
  }) => void;
  submitDeliverables: () => void;
  runAIVerification: () => Promise<void>;
  acceptAIRecommendation: () => void;
  approveSettlement: (releaseAmount?: number, holdAmount?: number, signer?: string) => boolean;
  resetGoldenDemo: () => void;
  settleCustomDispute: (notes: string) => void;
  triggerSimulatedIntegrityBreach: (type: 'double_settle' | 'excess_amount' | 'unauthorized_state' | 'missing_signature') => void;

  // Domain Entities for 18 core screens
  creditTypes: CreditType[];
  selectedCreditTypeId: string;
  setSelectedCreditTypeId: (id: string) => void;
  updateCreditType: (id: string, updates: Partial<CreditType>) => void;

  rewardRules: RewardRule[];
  addRewardRule: (rule: Omit<RewardRule, 'id' | 'version' | 'createdAt' | 'updatedAt'>) => void;
  updateRewardRule: (id: string, updates: Partial<RewardRule>) => void;
  toggleRewardRuleStatus: (id: string) => void;

  spendProducts: SpendProduct[];
  updateSpendProduct: (id: string, updates: Partial<SpendProduct>) => void;

  priceRules: PriceRule[];
  updatePriceRule: (id: string, updates: Partial<PriceRule>) => void;

  walletPolicies: WalletPolicy[];
  updateWalletPolicy: (id: string, updates: Partial<WalletPolicy>) => void;

  riskPolicies: RiskPolicy[];
  toggleRiskPolicy: (id: string) => void;
  releaseRiskHold: (id: string) => void;

  budgetEnvelopes: BudgetEnvelope[];
  updateBudgetEnvelope: (id: string, updates: Partial<BudgetEnvelope>) => void;

  auditLogs: AuditLogRecord[];
  addAuditLog: (entry: Omit<AuditLogRecord, 'id' | 'timestamp' | 'signatureHash'>) => void;

  simulationScenarios: SimulationScenario[];
  activeSimulation: SimulationScenario | null;
  setActiveSimulation: (sim: SimulationScenario | null) => void;
  runSimulationOnObject: (params: {
    title: string;
    targetObject: string;
    parameter: string;
    currentValue: string;
    proposedValue: string;
    affectedUsers: number;
    liabilityDelta: number;
    marginDelta: number;
    shiftDays: number;
    riskScore: string;
    confidence: 'ACTUAL' | 'ESTIMATED' | 'PROJECTED';
    missingData?: string;
  }) => SimulationScenario;

  aiCapabilities: AIAnalystCapability[];
  aiRecommendations: AIRecommendationItem[];
  handleAIRecommendationAction: (id: string, action: 'APPROVED' | 'REJECTED' | 'DISMISSED') => void;

  // User Management & Platform Preview
  users: ManagedUser[];
  selectedUserId: string;
  setSelectedUserId: (id: string) => void;
  proposedChange: ProposedUserChange | null;
  setProposedChange: (change: ProposedUserChange | null) => void;
  applyProposedChange: (userId: string, change: ProposedUserChange, adminName?: string) => void;
  discardProposedChange: () => void;
  userSubmitDeliverable: (userId: string, transactionId: string, deliverableName?: string) => void;
  updateUserStatus: (userId: string, status: UserStatus, reason?: string) => void;
  funnelMetrics: FunnelStageMetric[];
  executeUserIntervention: (userId: string, recommendationId: string, actionType: string, customNote?: string) => void;

  // Organization, Quest, Campaign & Ecosystem
  organizations: Organization[];
  selectedOrganizationId: string;
  setSelectedOrganizationId: (id: string) => void;
  createOrganization: (orgData: Partial<Organization>) => Organization;
  updateOrganization: (id: string, updates: Partial<Organization>) => void;
  addOrganizationMember: (orgId: string, memberData: Partial<OrganizationMember>) => void;
  removeOrganizationMember: (orgId: string, memberId: string) => void;
  updateOrganizationMemberRole: (orgId: string, memberId: string, role: OrganizationRole, permissions: string[]) => void;
  quests: Quest[];
  createQuest: (questData: Partial<Quest>) => Quest;
  updateQuest: (id: string, updates: Partial<Quest>) => void;
  campaigns: Campaign[];
  createCampaign: (campaignData: Partial<Campaign>) => Campaign;
  updateCampaign: (id: string, updates: Partial<Campaign>) => void;
  programs: CreditProgram[];
  createProgram: (programData: Partial<CreditProgram>) => CreditProgram;
  creditSamples: CreditSampleTemplate[];
  approvalRequests: ApprovalRequest[];
  updateApprovalRequest: (id: string, status: 'APPROVED' | 'CHANGES_REQUESTED' | 'REJECTED', notes?: string) => void;
  rewardPools: RewardPoolItem[];
  redeemRewardPoolItem: (userId: string, rewardId: string) => boolean;
  simulateProgram: (input: ProgramSimulationInput) => ProgramSimulationResult;

  // Benefit Pools
  pools: BenefitPool[];
  selectedPoolId: string;
  setSelectedPoolId: (id: string) => void;
  createPool: (poolData: Partial<BenefitPool>) => BenefitPool;
  updatePool: (id: string, updates: Partial<BenefitPool>) => void;
  addPoolContribution: (poolId: string, contribution: Omit<PoolContribution, 'id'>) => void;
  addPoolBenefit: (poolId: string, benefit: Omit<PoolBenefit, 'id' | 'redeemedCount'>) => void;
  redeemPoolBenefit: (userId: string, poolId: string, benefitId: string) => { success: boolean; redemptionId?: string; message: string };
  saveUserGoal: (userId: string, poolId: string, benefitId: string) => void;
  allocateCreditsToGoal: (userId: string, poolId: string, amount: number, benefitId?: string) => boolean;
  unallocateCreditsFromGoal: (userId: string, poolId: string, benefitId: string, amount: number) => boolean;
  simulateEarnOpportunity: (userId: string, opportunityName: string, creditAmount: number) => void;
}

const EconomicContext = createContext<EconomicContextType | null>(null);

export const EconomicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname && window.location.pathname !== '/' ? window.location.pathname : '/';
  });

  // User Management State
  const [users, setUsers] = useState<ManagedUser[]>(() => seedUsers);
  const [selectedUserId, setSelectedUserId] = useState<string>('usr-sarah-chen');
  const [proposedChange, setProposedChange] = useState<ProposedUserChange | null>(null);
  const [funnelMetrics, setFunnelMetrics] = useState<FunnelStageMetric[]>(() => seedFunnelMetrics);

  const [tx, setTx] = useState<Transaction>(() => JSON.parse(JSON.stringify(initialTransactionTX1048)));
  const [allTransactions, setAllTransactions] = useState<Transaction[]>(() => [
    JSON.parse(JSON.stringify(initialTransactionTX1048)),
    sampleTransactions[1],
    sampleTransactions[2],
    sampleTransactions[3],
  ]);
  const [ledger, setLedger] = useState<LedgerEntry[]>(() => [...initialHistoricalLedgerEntries]);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [integrityError, setIntegrityError] = useState<EconomicIntegrityViolation | null>(null);

  // Core 18-screen operational state
  const [creditTypes, setCreditTypes] = useState<CreditType[]>(() => seedCreditTypes);
  const [selectedCreditTypeId, setSelectedCreditTypeId] = useState<string>('ct-paid');
  const [rewardRules, setRewardRules] = useState<RewardRule[]>(() => seedRewardRules);
  const [spendProducts, setSpendProducts] = useState<SpendProduct[]>(() => seedSpendProducts);
  const [priceRules, setPriceRules] = useState<PriceRule[]>(() => seedPriceRules);
  const [walletPolicies, setWalletPolicies] = useState<WalletPolicy[]>(() => seedWalletPolicies);
  const [riskPolicies, setRiskPolicies] = useState<RiskPolicy[]>(() => seedRiskPolicies);
  const [budgetEnvelopes, setBudgetEnvelopes] = useState<BudgetEnvelope[]>(() => seedBudgetEnvelopes);
  const [auditLogs, setAuditLogs] = useState<AuditLogRecord[]>(() => seedAuditLogs);
  const [simulationScenarios, setSimulationScenarios] = useState<SimulationScenario[]>(() => seedSimulationScenarios);
  const [activeSimulation, setActiveSimulation] = useState<SimulationScenario | null>(null);
  const [aiCapabilities, setAiCapabilities] = useState<AIAnalystCapability[]>(() => seedAIAnalystCapabilities);
  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendationItem[]>(() => seedAIRecommendations);

  // Organization, Quest, Campaign & Ecosystem State
  const [organizations, setOrganizations] = useState<Organization[]>(() => seedOrganizations);
  const [selectedOrganizationId, setSelectedOrganizationId] = useState<string>('org-abc-coffee');
  const [quests, setQuests] = useState<Quest[]>(() => seedQuests);
  const [campaigns, setCampaigns] = useState<Campaign[]>(() => seedCampaigns);
  const [programs, setPrograms] = useState<CreditProgram[]>(() => seedPrograms);
  const [creditSamples, setCreditSamples] = useState<CreditSampleTemplate[]>(() => seedCreditSamples);
  const [approvalRequests, setApprovalRequests] = useState<ApprovalRequest[]>(() => seedApprovalRequests);
  const [rewardPools, setRewardPools] = useState<RewardPoolItem[]>(() => seedRewardPools);
  const [pools, setPools] = useState<BenefitPool[]>(() => seedBenefitPools);
  const [selectedPoolId, setSelectedPoolId] = useState<string>('pool-city-life');

  const createOrganization = (orgData: Partial<Organization>): Organization => {
    const newId = `org-${Date.now()}`;
    const newOrg: Organization = {
      id: newId,
      name: orgData.name || 'New Organization',
      slug: orgData.slug || (orgData.name ? orgData.name.toLowerCase().replace(/\s+/g, '-') : 'new-org'),
      type: orgData.type || 'Vendor',
      status: orgData.status || 'Active',
      plan: orgData.plan || 'Starter',
      logoInitials: orgData.logoInitials || (orgData.name ? orgData.name.substring(0, 2).toUpperCase() : 'NO'),
      industry: orgData.industry || 'General',
      primaryContact: orgData.primaryContact || {
        name: 'Admin',
        email: 'admin@org.com',
        role: 'Owner',
      },
      createdAt: new Date().toISOString(),
      membersCount: orgData.members?.length || 1,
      activeProgramsCount: 0,
      activeQuestsCount: 0,
      activeCampaignsCount: 0,
      creditsIssued: 0,
      creditsRedeemed: 0,
      outstandingCredits: 0,
      monthlyBudget: orgData.monthlyBudget || 50000,
      budgetUsed: 0,
      questCompletionRate: 0,
      campaignConversion: 0,
      creditRulesSummary: orgData.creditRulesSummary || 'Standard platform rules',
      members: orgData.members || [],
      customEarningMultiplier: orgData.customEarningMultiplier || 1.0,
      redemptionRatePerCredit: orgData.redemptionRatePerCredit || 1.0,
    };

    setOrganizations(prev => [newOrg, ...prev]);
    addAuditLog({
      actor: 'Platform Admin',
      role: 'System Administrator',
      action: 'ORGANIZATION_CREATED',
      objectType: 'UserAccount',
      objectId: newId,
      changesDiff: [{ field: 'Organization', before: 'None', after: newOrg.name }],
      rollbackAvailable: false,
    });
    return newOrg;
  };

  const updateOrganization = (id: string, updates: Partial<Organization>) => {
    setOrganizations(prev => prev.map(o => o.id === id ? { ...o, ...updates } : o));
    addAuditLog({
      actor: 'Admin Operator',
      role: 'Operations Administrator',
      action: 'ORGANIZATION_UPDATED',
      objectType: 'UserAccount',
      objectId: id,
      changesDiff: Object.entries(updates).map(([k, v]) => ({ field: k, before: 'Previous', after: String(v) })),
      rollbackAvailable: true,
    });
  };

  const addOrganizationMember = (orgId: string, memberData: Partial<OrganizationMember>) => {
    const newMemberId = `mem-${Date.now()}`;
    const newMember: OrganizationMember = {
      id: newMemberId,
      userId: memberData.userId || `usr-${Date.now()}`,
      userName: memberData.userName || 'New Member',
      userEmail: memberData.userEmail || 'member@org.com',
      avatarInitials: memberData.avatarInitials || (memberData.userName ? memberData.userName.substring(0, 2).toUpperCase() : 'NM'),
      role: memberData.role || 'Member',
      permissions: memberData.permissions || ['VIEW_ANALYTICS'],
      joinedAt: new Date().toISOString().split('T')[0],
      programsParticipated: 0,
      creditsEarned: 0,
      creditsRedeemed: 0,
    };

    setOrganizations(prev => prev.map(o => {
      if (o.id !== orgId) return o;
      const updatedMembers = [...o.members, newMember];
      return {
        ...o,
        members: updatedMembers,
        membersCount: updatedMembers.length,
      };
    }));

    setUsers(prev => prev.map(u => {
      if (u.id !== newMember.userId && u.email !== newMember.userEmail) return u;
      const targetOrg = organizations.find(o => o.id === orgId);
      const newMembership = {
        organizationId: orgId,
        organizationName: targetOrg?.name || 'Organization',
        organizationType: targetOrg?.type || 'Vendor',
        role: newMember.role,
        permissions: newMember.permissions,
        joinedAt: newMember.joinedAt,
        programsParticipated: 0,
        creditsEarned: 0,
        creditsRedeemed: 0,
      };
      return {
        ...u,
        organizationMemberships: [...(u.organizationMemberships || []), newMembership],
      };
    }));
  };

  const removeOrganizationMember = (orgId: string, memberId: string) => {
    let removedUserId = '';
    setOrganizations(prev => prev.map(o => {
      if (o.id !== orgId) return o;
      const target = o.members.find(m => m.id === memberId);
      if (target) removedUserId = target.userId;
      const updated = o.members.filter(m => m.id !== memberId);
      return {
        ...o,
        members: updated,
        membersCount: updated.length,
      };
    }));

    if (removedUserId) {
      setUsers(prev => prev.map(u => {
        if (u.id !== removedUserId) return u;
        return {
          ...u,
          organizationMemberships: (u.organizationMemberships || []).filter(m => m.organizationId !== orgId),
        };
      }));
    }
  };

  const updateOrganizationMemberRole = (orgId: string, memberId: string, role: OrganizationRole, permissions: string[]) => {
    let targetUserId = '';
    setOrganizations(prev => prev.map(o => {
      if (o.id !== orgId) return o;
      const updated = o.members.map(m => {
        if (m.id === memberId) {
          targetUserId = m.userId;
          return { ...m, role, permissions };
        }
        return m;
      });
      return { ...o, members: updated };
    }));

    if (targetUserId) {
      setUsers(prev => prev.map(u => {
        if (u.id !== targetUserId) return u;
        return {
          ...u,
          organizationMemberships: (u.organizationMemberships || []).map(m =>
            m.organizationId === orgId ? { ...m, role, permissions } : m
          ),
        };
      }));
    }
  };

  const createQuest = (questData: Partial<Quest>): Quest => {
    const newId = `qst-${Date.now()}`;
    const newQuest: Quest = {
      id: newId,
      name: questData.name || 'New Quest',
      description: questData.description || 'Complete required business action to receive credits.',
      owner: questData.owner || 'Admin',
      organizationId: questData.organizationId || 'org-abc-coffee',
      organizationName: questData.organizationName || 'ABC Coffee',
      ownershipType: questData.ownershipType || 'VENDOR',
      programId: questData.programId,
      campaignId: questData.campaignId,
      trigger: questData.trigger || 'purchase.completed',
      eventType: questData.eventType || 'POS_PURCHASE',
      condition: questData.condition || 'Count >= 1',
      progressRule: questData.progressRule || 'Increments upon event detection',
      completionRule: questData.completionRule || 'Disburse on verified event',
      creditReward: questData.creditReward || 100,
      frequency: questData.frequency || 'Weekly',
      budget: questData.budget || 20000,
      budgetUsed: 0,
      audience: questData.audience || 'All active users',
      startDate: questData.startDate || new Date().toISOString().split('T')[0],
      status: questData.status || 'Active',
      questType: questData.questType || 'Purchase',
      participantsCount: 0,
      completionsCount: 0,
    };

    setQuests(prev => [newQuest, ...prev]);

    if (newQuest.organizationId) {
      setOrganizations(prev => prev.map(o =>
        o.id === newQuest.organizationId ? { ...o, activeQuestsCount: o.activeQuestsCount + 1 } : o
      ));
    }

    addAuditLog({
      actor: questData.owner || 'Admin',
      role: 'Program Operator',
      action: 'QUEST_CREATED',
      objectType: 'CreditRule',
      objectId: newId,
      changesDiff: [{ field: 'Quest', before: 'None', after: newQuest.name }],
      rollbackAvailable: false,
    });

    return newQuest;
  };

  const updateQuest = (id: string, updates: Partial<Quest>) => {
    setQuests(prev => prev.map(q => q.id === id ? { ...q, ...updates } : q));
  };

  const createCampaign = (campaignData: Partial<Campaign>): Campaign => {
    const newId = `cmp-${Date.now()}`;
    const newCampaign: Campaign = {
      id: newId,
      name: campaignData.name || 'New Campaign',
      description: campaignData.description || 'Targeted multi-quest promotional campaign.',
      organizationId: campaignData.organizationId || 'org-abc-coffee',
      organizationName: campaignData.organizationName || 'ABC Coffee',
      ownershipType: campaignData.ownershipType || 'VENDOR',
      programId: campaignData.programId,
      questIds: campaignData.questIds || [],
      audience: campaignData.audience || 'All registered users',
      timeline: campaignData.timeline || '30 Days',
      budget: campaignData.budget || 50000,
      budgetUsed: 0,
      creditStrategy: campaignData.creditStrategy || 'Tiered milestones with completion bonus',
      rewardStrategy: campaignData.rewardStrategy || 'Direct credit disbursal + voucher',
      status: campaignData.status || 'Active',
      participants: 0,
      questStarts: 0,
      questCompletions: 0,
      conversionRate: 0,
      creditsIssued: 0,
      redemptionRate: 0,
      roiMetric: 'Initial launch phase',
    };

    setCampaigns(prev => [newCampaign, ...prev]);

    if (newCampaign.organizationId) {
      setOrganizations(prev => prev.map(o =>
        o.id === newCampaign.organizationId ? { ...o, activeCampaignsCount: o.activeCampaignsCount + 1 } : o
      ));
    }

    return newCampaign;
  };

  const updateCampaign = (id: string, updates: Partial<Campaign>) => {
    setCampaigns(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const createProgram = (programData: Partial<CreditProgram>): CreditProgram => {
    const newId = `prg-${Date.now()}`;
    const newProgram: CreditProgram = {
      id: newId,
      name: programData.name || 'New Loyalty Program',
      description: programData.description || 'Comprehensive loyalty and incentives program.',
      organizationId: programData.organizationId || 'org-abc-coffee',
      organizationName: programData.organizationName || 'ABC Coffee',
      ownershipType: programData.ownershipType || 'VENDOR',
      type: programData.type || 'Loyalty',
      status: programData.status || 'Active',
      budget: programData.budget || 100000,
      budgetUsed: 0,
      questIds: programData.questIds || [],
      campaignIds: programData.campaignIds || [],
      participantsCount: 0,
      creditsIssued: 0,
      startDate: programData.startDate || new Date().toISOString().split('T')[0],
    };

    setPrograms(prev => [newProgram, ...prev]);

    if (newProgram.organizationId) {
      setOrganizations(prev => prev.map(o =>
        o.id === newProgram.organizationId ? { ...o, activeProgramsCount: o.activeProgramsCount + 1 } : o
      ));
    }

    return newProgram;
  };

  const updateApprovalRequest = (id: string, status: 'APPROVED' | 'CHANGES_REQUESTED' | 'REJECTED', notes?: string) => {
    setApprovalRequests(prev => prev.map(req => {
      if (req.id !== id) return req;
      return {
        ...req,
        status,
        notes: notes || req.notes,
      };
    }));

    const req = approvalRequests.find(r => r.id === id);
    if (req && status === 'APPROVED') {
      if (req.type === 'Campaign') {
        setCampaigns(prev => prev.map(c => c.name === req.programName ? { ...c, status: 'Active' } : c));
      } else if (req.type === 'Quest') {
        setQuests(prev => prev.map(q => q.name === req.programName ? { ...q, status: 'Active' } : q));
      }
    }

    addAuditLog({
      actor: 'Risk Committee Admin',
      role: 'Risk Officer',
      action: status === 'APPROVED' ? 'APPROVAL_REQUEST_APPROVED' : 'APPROVAL_REQUEST_REVIEWED',
      objectType: 'CreditRule',
      objectId: id,
      changesDiff: [{ field: 'Approval Status', before: 'PENDING', after: status }],
      rollbackAvailable: false,
    });
  };

  const redeemRewardPoolItem = (userId: string, rewardId: string): boolean => {
    const reward = rewardPools.find(r => r.id === rewardId);
    if (!reward || reward.remainingInventory <= 0) return false;

    const user = users.find(u => u.id === userId);
    if (!user || user.creditAccount.availableCredit < reward.creditsCost) return false;

    setUsers(prev => prev.map(u => {
      if (u.id !== userId) return u;
      const newAvail = u.creditAccount.availableCredit - reward.creditsCost;
      const newTotal = u.creditAccount.totalCredit - reward.creditsCost;
      return {
        ...u,
        creditAccount: {
          ...u.creditAccount,
          availableCredit: newAvail,
          totalCredit: newTotal,
        },
        activity: [
          {
            id: `act-red-${Date.now()}`,
            timestamp: 'Just now',
            type: 'TRANSACTION',
            title: `Redeemed ${reward.creditsCost} CRD: ${reward.name}`,
            description: `Exchanged credit balance for reward from ${reward.organizationName}`,
            actor: u.name,
            amount: -reward.creditsCost,
          },
          ...u.activity,
        ],
      };
    }));

    setRewardPools(prev => prev.map(r => {
      if (r.id !== rewardId) return r;
      const newRemaining = r.remainingInventory - 1;
      return {
        ...r,
        remainingInventory: newRemaining,
        totalRedeemed: r.totalRedeemed + 1,
        status: newRemaining === 0 ? 'Depleted' : r.status,
      };
    }));

    const newEntry: LedgerEntry = {
      id: `led-red-${Date.now()}`,
      entrySequence: ledger.length + 1,
      timestamp: new Date().toISOString(),
      transactionId: `TX-RED-${reward.id.slice(-4)}`,
      type: 'SETTLEMENT',
      accountDebit: `2010.USER.${user.id.slice(-4)}`,
      accountCredit: `4010.MERCHANT.REDEMPTION.${reward.organizationId || 'PLATFORM'}`,
      amount: reward.creditsCost,
      balanceBefore: user.creditAccount.availableCredit,
      balanceAfter: user.creditAccount.availableCredit - reward.creditsCost,
      description: `Reward redemption: ${reward.name} for ${user.name}`,
      merkleRoot: `0x${Math.random().toString(16).slice(2, 10)}...`,
      status: 'FINALIZED',
    };
    setLedger(prev => [newEntry, ...prev]);

    return true;
  };

  // ==========================================
  // BENEFIT POOLS OPERATIONS & ACCOUNTING
  // ==========================================
  const createPool = (poolData: Partial<BenefitPool>): BenefitPool => {
    const newId = `pool-${Date.now()}`;
    const newPool: BenefitPool = {
      id: newId,
      name: poolData.name || 'New Benefit Pool',
      tagline: poolData.tagline || 'Curated partner rewards and experiences.',
      description: poolData.description || 'Shared destination where users accumulate credits toward selected benefits.',
      type: poolData.type || 'Lifestyle',
      status: poolData.status || 'Active',
      owner: poolData.owner || 'Credit Economy OS',
      durationStart: poolData.durationStart || new Date().toISOString().split('T')[0],
      durationEnd: poolData.durationEnd || '2026-12-31',
      totalFundingCredits: poolData.totalFundingCredits || 25000,
      committedCredits: poolData.committedCredits || 0,
      participantsCount: poolData.participantsCount || 0,
      redemptionRate: 0,
      benefitsCount: poolData.benefits?.length || 0,
      benefits: poolData.benefits || [],
      contributions: poolData.contributions || [
        {
          id: `cnt-${Date.now()}`,
          poolId: newId,
          organizationId: 'org-platform-treasury',
          organizationName: 'Platform Central Treasury',
          organizationType: 'Other',
          contributionType: 'Credit Funding',
          amountCredits: poolData.totalFundingCredits || 25000,
          date: new Date().toISOString().split('T')[0],
          status: 'Settled',
        },
      ],
      participants: poolData.participants || [],
      redemptions: [],
      rules: poolData.rules || {
        eligibleUserTiers: ['All Tiers'],
        minCreditsToJoin: 100,
        maxRedemptionsPerUser: 5,
        perUserLimitNote: 'Standard pool quota applies',
        poolExpiration: 'Dec 31, 2026',
        benefitExpiration: '30 days after voucher claim',
      },
    };

    setPools((prev) => [newPool, ...prev]);

    addAuditLog({
      actor: 'Admin (Treasury)',
      role: 'Treasury Admin',
      action: 'POOL_CREATED',
      objectType: 'Program',
      objectId: newId,
      changesDiff: [{ field: 'Pool Name', before: 'None', after: newPool.name }],
      rollbackAvailable: false,
    });

    return newPool;
  };

  const updatePool = (id: string, updates: Partial<BenefitPool>) => {
    setPools((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const addPoolContribution = (poolId: string, contribution: Omit<PoolContribution, 'id'>) => {
    const newContrib: PoolContribution = {
      ...contribution,
      id: `cnt-${Date.now()}`,
      poolId,
    };

    setPools((prev) =>
      prev.map((p) => {
        if (p.id !== poolId) return p;
        return {
          ...p,
          totalFundingCredits: p.totalFundingCredits + (contribution.amountCredits || 0),
          contributions: [newContrib, ...p.contributions],
        };
      })
    );

    addAuditLog({
      actor: contribution.organizationName,
      role: 'Partner Contributor',
      action: 'POOL_FUNDING_CONTRIBUTED',
      objectType: 'Ledger',
      objectId: poolId,
      changesDiff: [{ field: 'Funding Added', before: '0 CRD', after: `${contribution.amountCredits} CRD` }],
      rollbackAvailable: false,
    });
  };

  const addPoolBenefit = (poolId: string, benefit: Omit<PoolBenefit, 'id' | 'redeemedCount'>) => {
    const newBen: PoolBenefit = {
      ...benefit,
      id: `ben-${Date.now()}`,
      poolId,
      redeemedCount: 0,
    };

    setPools((prev) =>
      prev.map((p) => {
        if (p.id !== poolId) return p;
        return {
          ...p,
          benefitsCount: p.benefitsCount + 1,
          benefits: [...p.benefits, newBen],
        };
      })
    );
  };

  const redeemPoolBenefit = (
    userId: string,
    poolId: string,
    benefitId: string
  ): { success: boolean; redemptionId?: string; message: string } => {
    const user = users.find((u) => u.id === userId);
    if (!user) return { success: false, message: 'User identity not found.' };

    const pool = pools.find((p) => p.id === poolId);
    if (!pool) return { success: false, message: 'Pool destination not found.' };

    const benefit = pool.benefits.find((b) => b.id === benefitId);
    if (!benefit) return { success: false, message: 'Benefit item not found in this pool.' };

    if (benefit.remainingInventory <= 0) {
      return { success: false, message: 'This benefit inventory is depleted.' };
    }

    if (user.creditAccount.availableCredit < benefit.creditsCost) {
      return {
        success: false,
        message: `Insufficient balance: ${user.creditAccount.availableCredit.toLocaleString()} CRD available, ${benefit.creditsCost.toLocaleString()} CRD required.`,
      };
    }

    const redemptionId = `RED-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    // 1. Deduct user balance
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== userId) return u;
        const newAvailable = u.creditAccount.availableCredit - benefit.creditsCost;
        const newTotal = u.creditAccount.totalCredit - benefit.creditsCost;
        return {
          ...u,
          creditAccount: {
            ...u.creditAccount,
            availableCredit: newAvailable,
            totalCredit: newTotal,
          },
          activity: [
            {
              id: `act-red-${Date.now()}`,
              timestamp: 'Just now',
              type: 'REWARD',
              title: `Redeemed ${benefit.name}`,
              description: `Claimed from ${pool.name} for ${benefit.creditsCost.toLocaleString()} CRD. Voucher: ${redemptionId}`,
              actor: u.name,
              amount: -benefit.creditsCost,
              relatedId: redemptionId,
            },
            ...u.activity,
          ],
        };
      })
    );

    // 2. Update benefit inventory & pool records
    const redemptionRecord: PoolRedemptionRecord = {
      id: redemptionId,
      poolId,
      poolName: pool.name,
      benefitId: benefit.id,
      benefitName: benefit.name,
      benefitType: benefit.type,
      userId: user.id,
      userName: user.name,
      providerOrgId: benefit.providerOrgId,
      providerOrgName: benefit.providerOrgName,
      creditsSpent: benefit.creditsCost,
      timestamp: 'Just now',
      status: 'COMPLETED',
      ledgerTransactionId: `TX-POOL-${redemptionId.slice(-4)}`,
    };

    setPools((prev) =>
      prev.map((p) => {
        if (p.id !== poolId) return p;

        const updatedBenefits = p.benefits.map((b) => {
          if (b.id !== benefitId) return b;
          const newRemaining = b.remainingInventory - 1;
          return {
            ...b,
            remainingInventory: newRemaining,
            redeemedCount: b.redeemedCount + 1,
            status: newRemaining === 0 ? ('Depleted' as const) : b.status,
          };
        });

        // Update participant redemptions & goal status
        const updatedParticipants = p.participants.map((part) => {
          if (part.userId !== userId) return part;
          let updatedGoals = part.goals ? [...part.goals] : [];
          const goalMatch = updatedGoals.find((g) => g.benefitId === benefitId);
          if (goalMatch) {
            updatedGoals = updatedGoals.map((g) =>
              g.benefitId === benefitId ? { ...g, status: 'Redeemed' as const, allocatedCredits: 0 } : g
            );
          }
          const totalAllocated = updatedGoals.reduce((s, g) => s + g.allocatedCredits, 0);
          return {
            ...part,
            redemptionsCount: part.redemptionsCount + 1,
            poolCredits: totalAllocated,
            availableCredits: Math.max(0, part.availableCredits - benefit.creditsCost),
            goals: updatedGoals,
            lastActivity: `Redeemed: ${benefit.name}`,
          };
        });

        return {
          ...p,
          benefits: updatedBenefits,
          participants: updatedParticipants,
          redemptions: [redemptionRecord, ...p.redemptions],
        };
      })
    );

    // 3. Immutable Double-Entry Ledger Transaction
    const newEntry: LedgerEntry = {
      id: `led-pool-red-${Date.now()}`,
      entrySequence: ledger.length + 1,
      timestamp: new Date().toISOString(),
      transactionId: `TX-POOL-${redemptionId.slice(-4)}`,
      type: 'SETTLEMENT',
      accountDebit: `2010.USER.${user.id.slice(-4)}`,
      accountCredit: `4010.MERCHANT.POOL.${pool.id.slice(-4)}`,
      amount: benefit.creditsCost,
      balanceBefore: user.creditAccount.availableCredit,
      balanceAfter: user.creditAccount.availableCredit - benefit.creditsCost,
      description: `Pool Benefit Redemption: ${benefit.name} by ${user.name} (${redemptionId})`,
      merkleRoot: `0x${Math.random().toString(16).slice(2, 10)}...`,
      status: 'FINALIZED',
    };
    setLedger((prev) => [newEntry, ...prev]);

    return {
      success: true,
      redemptionId,
      message: `Benefit "${benefit.name}" redeemed successfully for ${benefit.creditsCost.toLocaleString()} CRD.`,
    };
  };

  const saveUserGoal = (userId: string, poolId: string, benefitId: string) => {
    const user = users.find((u) => u.id === userId);
    const pool = pools.find((p) => p.id === poolId);
    if (!user || !pool) return;

    const benefit = pool.benefits.find((b) => b.id === benefitId);
    if (!benefit) return;

    setPools((prev) =>
      prev.map((p) => {
        if (p.id !== poolId) return p;

        const existingParticipantIndex = p.participants.findIndex((part) => part.userId === userId);
        if (existingParticipantIndex >= 0) {
          const updatedParticipants = [...p.participants];
          const current = updatedParticipants[existingParticipantIndex];
          const existingGoals = current.goals || [];
          
          let updatedGoals: import('../types').UserGoalAllocation[];
          const goalMatch = existingGoals.find((g) => g.benefitId === benefit.id);

          if (goalMatch) {
            updatedGoals = existingGoals.map((g) => ({
              ...g,
              isPrimary: g.benefitId === benefit.id,
            }));
          } else {
            const newGoal: import('../types').UserGoalAllocation = {
              id: `goal-${Date.now()}`,
              benefitId: benefit.id,
              benefitName: benefit.name,
              benefitType: benefit.type,
              providerOrgName: benefit.providerOrgName,
              targetCredits: benefit.creditsCost,
              allocatedCredits: 0,
              savedAt: new Date().toISOString().split('T')[0],
              status: 'Building',
              isPrimary: true,
            };
            updatedGoals = [
              newGoal,
              ...existingGoals.map((g) => ({ ...g, isPrimary: false })),
            ];
          }

          const primaryGoal = updatedGoals.find((g) => g.isPrimary) || updatedGoals[0];
          const totalAllocated = updatedGoals.reduce((sum, g) => sum + g.allocatedCredits, 0);
          const progress = primaryGoal ? Math.min(100, Math.round((primaryGoal.allocatedCredits / primaryGoal.targetCredits) * 100)) : 0;

          updatedParticipants[existingParticipantIndex] = {
            ...current,
            poolCredits: totalAllocated,
            goalBenefitId: primaryGoal.benefitId,
            goalBenefitName: primaryGoal.benefitName,
            goalTargetCredits: primaryGoal.targetCredits,
            goalProgressPercent: progress,
            goals: updatedGoals,
            lastActivity: `Goal updated: ${benefit.name}`,
          };
          return { ...p, participants: updatedParticipants };
        } else {
          // New participant in pool
          const initialGoal: import('../types').UserGoalAllocation = {
            id: `goal-${Date.now()}`,
            benefitId: benefit.id,
            benefitName: benefit.name,
            benefitType: benefit.type,
            providerOrgName: benefit.providerOrgName,
            targetCredits: benefit.creditsCost,
            allocatedCredits: 0,
            savedAt: new Date().toISOString().split('T')[0],
            status: 'Building',
            isPrimary: true,
          };
          const newParticipant: PoolParticipant = {
            id: `part-${Date.now()}`,
            userId: user.id,
            userName: user.name,
            userEmail: user.email,
            avatarInitials: user.avatarInitials,
            poolId: p.id,
            availableCredits: user.creditAccount.availableCredit,
            poolCredits: 0,
            goalBenefitId: benefit.id,
            goalBenefitName: benefit.name,
            goalTargetCredits: benefit.creditsCost,
            goalProgressPercent: 0,
            goals: [initialGoal],
            lastActivity: 'Goal saved',
            redemptionsCount: 0,
          };
          return {
            ...p,
            participantsCount: p.participantsCount + 1,
            participants: [newParticipant, ...p.participants],
          };
        }
      })
    );
  };

  const allocateCreditsToGoal = (userId: string, poolId: string, amount: number, benefitId?: string): boolean => {
    const user = users.find((u) => u.id === userId);
    if (!user) return false;

    const pool = pools.find((p) => p.id === poolId);
    if (!pool) return false;

    const participant = pool.participants.find((p) => p.userId === userId);
    const currentAllocated = participant ? participant.poolCredits : 0;
    const freeAvailable = user.creditAccount.availableCredit - currentAllocated;

    if (amount > freeAvailable) return false;

    setPools((prev) =>
      prev.map((p) => {
        if (p.id !== poolId) return p;

        const updatedParticipants = p.participants.map((part) => {
          if (part.userId !== userId) return part;

          let updatedGoals = part.goals ? [...part.goals] : [];
          const targetBenefitId = benefitId || part.goalBenefitId || p.benefits[0]?.id;

          const goalIndex = updatedGoals.findIndex((g) => g.benefitId === targetBenefitId);
          if (goalIndex >= 0) {
            const currentGoal = updatedGoals[goalIndex];
            const newAllocated = currentGoal.allocatedCredits + amount;
            const isReached = newAllocated >= currentGoal.targetCredits;
            updatedGoals[goalIndex] = {
              ...currentGoal,
              allocatedCredits: newAllocated,
              status: isReached ? 'Goal Reached' : 'Building',
            };
          } else {
            const ben = p.benefits.find((b) => b.id === targetBenefitId);
            if (ben) {
              updatedGoals.push({
                id: `goal-${Date.now()}`,
                benefitId: ben.id,
                benefitName: ben.name,
                benefitType: ben.type,
                providerOrgName: ben.providerOrgName,
                targetCredits: ben.creditsCost,
                allocatedCredits: amount,
                savedAt: new Date().toISOString().split('T')[0],
                status: amount >= ben.creditsCost ? 'Goal Reached' : 'Building',
                isPrimary: true,
              });
            }
          }

          const totalAllocated = updatedGoals.reduce((sum, g) => sum + g.allocatedCredits, 0);
          const primary = updatedGoals.find((g) => g.isPrimary) || updatedGoals[0];
          const progress = primary ? Math.min(100, Math.round((primary.allocatedCredits / primary.targetCredits) * 100)) : 0;

          return {
            ...part,
            poolCredits: totalAllocated,
            goalProgressPercent: progress,
            goals: updatedGoals,
            lastActivity: `+${amount} CRD allocated`,
          };
        });

        return {
          ...p,
          committedCredits: p.committedCredits + amount,
          participants: updatedParticipants,
        };
      })
    );

    return true;
  };

  const unallocateCreditsFromGoal = (userId: string, poolId: string, benefitId: string, amount: number): boolean => {
    setPools((prev) =>
      prev.map((p) => {
        if (p.id !== poolId) return p;

        const updatedParticipants = p.participants.map((part) => {
          if (part.userId !== userId) return part;

          let updatedGoals = part.goals ? [...part.goals] : [];
          const goalIndex = updatedGoals.findIndex((g) => g.benefitId === benefitId);
          if (goalIndex < 0) return part;

          const currentGoal = updatedGoals[goalIndex];
          const amountToWithdraw = Math.min(currentGoal.allocatedCredits, amount);
          const newAllocated = currentGoal.allocatedCredits - amountToWithdraw;

          updatedGoals[goalIndex] = {
            ...currentGoal,
            allocatedCredits: newAllocated,
            status: newAllocated >= currentGoal.targetCredits ? 'Goal Reached' : 'Building',
          };

          const totalAllocated = updatedGoals.reduce((sum, g) => sum + g.allocatedCredits, 0);
          const primary = updatedGoals.find((g) => g.isPrimary) || updatedGoals[0];
          const progress = primary ? Math.min(100, Math.round((primary.allocatedCredits / primary.targetCredits) * 100)) : 0;

          return {
            ...part,
            poolCredits: totalAllocated,
            goalProgressPercent: progress,
            goals: updatedGoals,
            lastActivity: `-${amountToWithdraw} CRD unallocated`,
          };
        });

        return {
          ...p,
          committedCredits: Math.max(0, p.committedCredits - amount),
          participants: updatedParticipants,
        };
      })
    );

    return true;
  };

  const simulateEarnOpportunity = (userId: string, opportunityName: string, creditAmount: number) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== userId) return u;
        return {
          ...u,
          creditAccount: {
            ...u.creditAccount,
            availableCredit: u.creditAccount.availableCredit + creditAmount,
            totalCredit: u.creditAccount.totalCredit + creditAmount,
          },
          activity: [
            {
              id: `act-earn-${Date.now()}`,
              timestamp: 'Just now',
              type: 'TRANSACTION',
              title: `Completed: ${opportunityName}`,
              description: `Earned +${creditAmount} CRD into unified wallet from program activity.`,
              actor: 'Program Engine',
              amount: creditAmount,
            },
            ...u.activity,
          ],
        };
      })
    );

    // Also update any active participant record for this user in pools
    setPools((prev) =>
      prev.map((p) => {
        const hasUser = p.participants.some((part) => part.userId === userId);
        if (!hasUser) return p;
        return {
          ...p,
          participants: p.participants.map((part) => {
            if (part.userId !== userId) return part;
            return {
              ...part,
              availableCredits: part.availableCredits + creditAmount,
              lastActivity: `Earned +${creditAmount} CRD`,
            };
          }),
        };
      })
    );

    const newLedgerEntry: LedgerEntry = {
      id: `led-earn-${Date.now()}`,
      entrySequence: ledger.length + 1,
      timestamp: new Date().toISOString(),
      transactionId: `TX-EARN-${Date.now().toString().slice(-4)}`,
      type: 'RESERVE',
      accountDebit: '1010.PLATFORM.INCENTIVE.RESERVE',
      accountCredit: `2010.USER.${user.id.slice(-4)}`,
      amount: creditAmount,
      balanceBefore: user.creditAccount.availableCredit,
      balanceAfter: user.creditAccount.availableCredit + creditAmount,
      description: `Quest Earn Event: ${opportunityName} for ${user.name}`,
      merkleRoot: `0x${Math.random().toString(16).slice(2, 10)}...`,
      status: 'FINALIZED',
    };
    setLedger((prev) => [newLedgerEntry, ...prev]);
  };

  const simulateProgram = (input: ProgramSimulationInput): ProgramSimulationResult => {
    const orgQuests = quests.filter(q => q.organizationId === input.organizationId || q.ownershipType === 'PLATFORM');
    const selectedCmp = campaigns.find(c => c.id === input.campaignId);

    const eligibleQuests = orgQuests.map(q => {
      let isCompleted = false;
      let progressPct = 0;

      if (q.questType === 'Purchase' && input.purchases >= 2) {
        isCompleted = true;
        progressPct = 100;
      } else if (q.questType === 'Visit' && input.visits >= 1) {
        isCompleted = true;
        progressPct = 100;
      } else if (q.questType === 'Referral' && input.referrals >= 1) {
        isCompleted = true;
        progressPct = 100;
      } else if (q.questType === 'Spend Threshold' && input.spend >= 40) {
        isCompleted = true;
        progressPct = 100;
      } else if (q.questType === 'Streak' && input.purchases >= 3) {
        isCompleted = true;
        progressPct = 100;
      } else if (q.questType === 'Signup') {
        isCompleted = true;
        progressPct = 100;
      } else {
        progressPct = Math.min(90, Math.round((input.purchases / 2) * 50 + (input.visits > 0 ? 30 : 0)));
      }

      return {
        questId: q.id,
        questName: q.name,
        status: (isCompleted ? 'Completed' : progressPct > 0 ? 'In Progress' : 'Eligible') as 'Eligible' | 'Completed' | 'In Progress',
        progressPct,
        creditsCanEarn: q.creditReward,
      };
    });

    const completed = eligibleQuests.filter(eq => eq.status === 'Completed');
    const completedIds = completed.map(c => c.questName);

    const creditBreakdown: Array<{ source: string; amount: number; reason: string }> = [];
    let totalCredits = 0;

    completed.forEach(c => {
      const q = quests.find(item => item.id === c.questId);
      if (q) {
        creditBreakdown.push({
          source: q.name,
          amount: q.creditReward,
          reason: `Satisfied trigger: ${q.trigger} (${q.condition})`,
        });
        totalCredits += q.creditReward;
      }
    });

    const campaignProgressPct = selectedCmp
      ? Math.min(100, Math.round((completed.length / Math.max(1, selectedCmp.questIds.length)) * 100))
      : Math.min(100, completed.length * 35);

    if (campaignProgressPct >= 100 && selectedCmp) {
      creditBreakdown.push({
        source: `${selectedCmp.name} Milestone Bonus`,
        amount: 500,
        reason: 'All quests in campaign completed within designated timeline',
      });
      totalCredits += 500;
    }

    const org = organizations.find(o => o.id === input.organizationId);
    const orgBudget = org?.monthlyBudget || 100000;
    const budgetUsed = org?.budgetUsed || 45000;
    const remaining = Math.max(0, orgBudget - budgetUsed - totalCredits);

    const finalBalance = input.currentCreditBalance + totalCredits;
    const eligibleRewards = rewardPools
      .filter(r => r.creditsCost <= finalBalance)
      .map(r => `${r.name} (${r.creditsCost.toLocaleString()} CRD)`);

    return {
      eligibleQuests,
      completedQuests: completedIds,
      creditsEarned: totalCredits,
      creditBreakdown,
      campaignProgressPct,
      budgetConsumption: totalCredits,
      budgetRemaining: remaining,
      rewardEligibility: eligibleRewards,
      projectedMonthlyCreditCost: Math.round(totalCredits * 48),
    };
  };

  const updateCreditType = (id: string, updates: Partial<CreditType>) => {
    setCreditTypes(prev => prev.map(ct => ct.id === id ? { ...ct, ...updates, updatedAt: new Date().toISOString() } : ct));
    addAuditLog({
      actor: 'admin_console',
      role: 'Treasury Admin',
      action: 'CREDIT_TYPE_UPDATED',
      objectType: 'CreditType',
      objectId: id,
      changesDiff: Object.entries(updates).map(([k, v]) => ({ field: k, before: 'Previous', after: String(v) })),
      rollbackAvailable: true,
    });
  };

  const addRewardRule = (newRule: Omit<RewardRule, 'id' | 'version' | 'createdAt' | 'updatedAt'>) => {
    const id = `rr-${Date.now()}`;
    const rule: RewardRule = {
      ...newRule,
      id,
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setRewardRules(prev => [rule, ...prev]);
    addAuditLog({
      actor: newRule.createdBy || 'growth.lead@demo.example',
      role: 'Growth Lead',
      action: 'REWARD_RULE_CREATED',
      objectType: 'RewardRule',
      objectId: rule.code,
      changesDiff: [{ field: 'baseAmount', before: 0, after: rule.baseAmount }],
      rollbackAvailable: false,
    });
  };

  const updateRewardRule = (id: string, updates: Partial<RewardRule>) => {
    setRewardRules(prev => prev.map(rr => rr.id === id ? { ...rr, ...updates, version: rr.version + 1, updatedAt: new Date().toISOString() } : rr));
    addAuditLog({
      actor: 'growth.lead@demo.example',
      role: 'Growth Lead',
      action: 'REWARD_RULE_MODIFIED',
      objectType: 'RewardRule',
      objectId: id,
      changesDiff: Object.entries(updates).map(([k, v]) => ({ field: k, before: 'Previous', after: String(v) })),
      rollbackAvailable: true,
    });
  };

  const toggleRewardRuleStatus = (id: string) => {
    setRewardRules(prev => prev.map(rr => {
      if (rr.id === id) {
        const nextStatus = rr.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
        return { ...rr, status: nextStatus, updatedAt: new Date().toISOString() };
      }
      return rr;
    }));
  };

  const updateSpendProduct = (id: string, updates: Partial<SpendProduct>) => {
    setSpendProducts(prev => prev.map(sp => sp.id === id ? { ...sp, ...updates } : sp));
    addAuditLog({
      actor: 'product.ops@demo.example',
      role: 'Product Ops',
      action: 'SPEND_PRODUCT_UPDATED',
      objectType: 'SpendProduct',
      objectId: id,
      changesDiff: Object.entries(updates).map(([k, v]) => ({ field: k, before: 'Previous', after: String(v) })),
      rollbackAvailable: true,
    });
  };

  const updatePriceRule = (id: string, updates: Partial<PriceRule>) => {
    setPriceRules(prev => prev.map(pr => pr.id === id ? { ...pr, ...updates } : pr));
    addAuditLog({
      actor: 'pricing.admin@demo.example',
      role: 'Monetization Lead',
      action: 'PRICE_RULE_CALIBRATED',
      objectType: 'PriceRule',
      objectId: id,
      changesDiff: Object.entries(updates).map(([k, v]) => ({ field: k, before: 'Previous', after: String(v) })),
      rollbackAvailable: true,
    });
  };

  const updateWalletPolicy = (id: string, updates: Partial<WalletPolicy>) => {
    setWalletPolicies(prev => prev.map(wp => wp.id === id ? { ...wp, ...updates } : wp));
    addAuditLog({
      actor: 'risk.officer@demo.example',
      role: 'Risk Officer',
      action: 'WALLET_POLICY_MODIFIED',
      objectType: 'WalletPolicy',
      objectId: id,
      changesDiff: Object.entries(updates).map(([k, v]) => ({ field: k, before: 'Previous', after: String(v) })),
      rollbackAvailable: true,
    });
  };

  const toggleRiskPolicy = (id: string) => {
    setRiskPolicies(prev => prev.map(rp => {
      if (rp.id === id) {
        const next = rp.status === 'ENFORCING' ? 'MONITOR_ONLY' : 'ENFORCING';
        return { ...rp, status: next };
      }
      return rp;
    }));
  };

  const releaseRiskHold = (id: string) => {
    setRiskPolicies(prev => prev.map(rp => rp.id === id ? { ...rp, activeHoldsCount: Math.max(0, rp.activeHoldsCount - 1) } : rp));
  };

  const updateBudgetEnvelope = (id: string, updates: Partial<BudgetEnvelope>) => {
    setBudgetEnvelopes(prev => prev.map(bg => bg.id === id ? { ...bg, ...updates } : bg));
  };

  const addAuditLog = (entry: Omit<AuditLogRecord, 'id' | 'timestamp' | 'signatureHash'>) => {
    const newEntry: AuditLogRecord = {
      ...entry,
      id: `aud-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      signatureHash: `sig_ed25519:${Math.random().toString(36).substring(2, 8)}...${Math.random().toString(36).substring(2, 6)}`,
    };
    setAuditLogs(prev => [newEntry, ...prev]);
  };

  const runSimulationOnObject = ({
    title,
    targetObject,
    parameter,
    currentValue,
    proposedValue,
    affectedUsers,
    liabilityDelta,
    marginDelta,
    shiftDays,
    riskScore,
    confidence,
    missingData,
  }: {
    title: string;
    targetObject: string;
    parameter: string;
    currentValue: string;
    proposedValue: string;
    affectedUsers: number;
    liabilityDelta: number;
    marginDelta: number;
    shiftDays: number;
    riskScore: string;
    confidence: 'ACTUAL' | 'ESTIMATED' | 'PROJECTED';
    missingData?: string;
  }): SimulationScenario => {
    const scenario: SimulationScenario = {
      id: `sim-${Date.now()}`,
      title,
      targetObject,
      parameter,
      currentValue,
      proposedValue,
      affectedUsersEstimate: affectedUsers,
      rewardLiabilityDeltaCredits: liabilityDelta,
      grossMarginDeltaPercent: marginDelta,
      budgetExhaustionShiftDays: shiftDays,
      riskExposureScoreDelta: riskScore,
      dataConfidence: confidence,
      missingDataNotes: missingData,
      policyBoundCheck: marginDelta < -15 || liabilityDelta > 2000000 ? 'WARNING' : 'PASSED',
    };
    setSimulationScenarios(prev => [scenario, ...prev]);
    setActiveSimulation(scenario);
    return scenario;
  };

  const handleAIRecommendationAction = (id: string, action: 'APPROVED' | 'REJECTED' | 'DISMISSED') => {
    setAiRecommendations(prev => prev.map(rec => {
      if (rec.id === id) {
        return { ...rec, status: action };
      }
      return rec;
    }));

    const targetRec = aiRecommendations.find(r => r.id === id);
    if (targetRec && action === 'APPROVED') {
      addAuditLog({
        actor: 'sarah_human_approver',
        role: targetRec.requiredApprovalRole,
        action: `AI_REC_${action}_FOR_${targetRec.analystCode}`,
        objectType: 'Settlement',
        objectId: targetRec.targetEntityId,
        changesDiff: [{ field: 'status', before: 'PENDING_REVIEW', after: action }],
        rollbackAvailable: false,
      });
    }
  };

  const clearIntegrityError = () => {
    setIntegrityError(null);
  };

  const discardProposedChange = () => {
    setProposedChange(null);
  };

  const applyProposedChange = (userId: string, change: ProposedUserChange, adminName = 'Admin Operator') => {
    setUsers(prev => prev.map(u => {
      if (u.id !== userId) return u;

      const updatedCreditAccount = { ...u.creditAccount };
      let updatedStatus = u.status;
      let updatedGroup = u.userGroup;
      const updatedRewards = [...u.rewards];
      const newActivity = [...u.activity];

      if (change.field === 'creditAdjustment') {
        const delta = Number(change.proposedValue);
        updatedCreditAccount.availableCredit += delta;
        updatedCreditAccount.totalCredit += delta;
        newActivity.unshift({
          id: `act-${Date.now()}`,
          timestamp: 'Just now',
          type: 'CREDIT_ADJUSTMENT',
          title: `Credit Adjustment (${delta >= 0 ? '+' : ''}${delta.toLocaleString()} CRD)`,
          description: change.reason || 'Manual administrative credit adjustment applied',
          actor: adminName,
          amount: delta,
        });
      } else if (change.field === 'creditLimit') {
        const newLimit = Number(change.proposedValue);
        updatedCreditAccount.creditLimit = newLimit;
        newActivity.unshift({
          id: `act-${Date.now()}`,
          timestamp: 'Just now',
          type: 'LIMIT_CHANGE',
          title: `Credit Limit Updated to ${newLimit.toLocaleString()} CRD`,
          description: change.reason || 'Credit line limit updated by administrator',
          actor: adminName,
        });
      } else if (change.field === 'status') {
        updatedStatus = change.proposedValue as UserStatus;
        newActivity.unshift({
          id: `act-${Date.now()}`,
          timestamp: 'Just now',
          type: 'STATUS_CHANGE',
          title: `Status Changed: ${change.currentValue} → ${change.proposedValue}`,
          description: change.reason || 'User status updated by administrator',
          actor: adminName,
        });
      } else if (change.field === 'userGroup') {
        updatedGroup = change.proposedValue as any;
        newActivity.unshift({
          id: `act-${Date.now()}`,
          timestamp: 'Just now',
          type: 'STATUS_CHANGE',
          title: `Tier Updated: ${change.proposedValue}`,
          description: change.reason || 'User tier classification updated',
          actor: adminName,
        });
      } else if (change.field === 'intervention') {
        const notifMsg = String(change.proposedValue);
        newActivity.unshift({
          id: `act-${Date.now()}`,
          timestamp: 'Just now',
          type: 'TRANSACTION',
          title: `Intervention: ${change.fieldLabel}`,
          description: notifMsg,
          actor: adminName,
        });
        const newInt: import('../types').UserInterventionRecord = {
          id: `int-${Date.now()}`,
          timestamp: 'Just now',
          actionTitle: change.fieldLabel,
          actionDetails: notifMsg,
          actor: adminName,
          outcomeTime: 'Pending user response',
          outcomeDescription: 'Delivered to User Platform · Prompted user action',
          resultStatus: 'IMPROVED',
        };
        const updatedRecs = u.recommendations.map(r =>
          r.title.toLowerCase().includes(change.fieldLabel.toLowerCase()) || change.fieldLabel.toLowerCase().includes(r.title.toLowerCase())
            ? { ...r, status: 'APPLIED' as const }
            : r
        );
        return {
          ...u,
          interventions: [newInt, ...u.interventions],
          recommendations: updatedRecs,
          userPlatformNotification: notifMsg,
          activity: newActivity,
          lastSyncedAt: 'Synced just now',
        };
      }

      return {
        ...u,
        creditAccount: updatedCreditAccount,
        status: updatedStatus,
        userGroup: updatedGroup,
        rewards: updatedRewards,
        activity: newActivity,
        lastSyncedAt: 'Synced just now',
      };
    }));

    addAuditLog({
      actor: adminName,
      role: 'Operations Administrator',
      action: 'USER_ECONOMIC_STATE_ADJUSTED',
      objectType: 'UserAccount',
      objectId: userId,
      changesDiff: [
        {
          field: change.fieldLabel,
          before: change.currentValue,
          after: change.proposedValue,
        },
      ],
      rollbackAvailable: true,
    });

    setProposedChange(null);
  };

  const userSubmitDeliverable = (userId: string, transactionId: string, deliverableName = 'Vertical 9:16 Interactive Story Template') => {
    // 1. Update user state (pending actions, journey stages, friction signals, interventions, activity)
    setUsers(prev => prev.map(u => {
      if (u.id !== userId) return u;

      // Advance journey stages: DELIVERABLE_SUBMITTED and VERIFICATION_PASSED complete
      const updatedJourney = u.journeyStages.map(s => {
        if (s.id === 'DELIVERABLE_SUBMITTED') {
          return {
            ...s,
            status: 'COMPLETED' as const,
            completedAt: 'Just now',
            events: [
              ...s.events,
              {
                id: `ev-${Date.now()}`,
                timestamp: 'Just now',
                title: 'Vertical 9:16 Assets Ingested',
                description: 'Uploaded and cryptographic sha256 checksum verified against Clause 4.2 specs',
              },
            ],
          };
        }
        if (s.id === 'VERIFICATION_PASSED') {
          return {
            ...s,
            status: 'COMPLETED' as const,
            completedAt: 'Just now',
            events: [
              {
                id: `ev-ver-${Date.now()}`,
                timestamp: 'Just now',
                title: 'AI Verification Succeeded',
                description: 'All 8 deliverables passed clause constraints with 98.4% confidence score',
              },
            ],
          };
        }
        if (s.id === 'SETTLEMENT_COMPLETED') {
          return {
            ...s,
            status: 'CURRENT' as const,
          };
        }
        return s;
      });

      // Resolve friction signals
      const updatedFriction = u.frictionSignals.map(f =>
        f.code === 'MISSING_DELIVERABLE' || f.code === 'VERIFICATION_LATENCY'
          ? { ...f, status: 'RESOLVED' as const }
          : f
      );

      // Close the loop on previous interventions
      const updatedInterventions = u.interventions.map(int => {
        if (int.outcomeTime === 'Pending user response') {
          return {
            ...int,
            outcomeTime: '18 minutes later',
            outcomeDescription: 'Document submitted by user · Verification passed (Closed Loop)',
            resultStatus: 'RESOLVED' as const,
          };
        }
        return int;
      });

      return {
        ...u,
        pendingActions: u.pendingActions.filter(a => a.transactionId !== transactionId || !a.title.includes(deliverableName)),
        journeyStages: updatedJourney,
        frictionSignals: updatedFriction,
        interventions: updatedInterventions,
        userPlatformNotification: null,
        activity: [
          {
            id: `act-${Date.now()}`,
            timestamp: 'Just now',
            type: 'USER_SUBMISSION',
            title: `Deliverable Submitted from User Platform`,
            description: `Uploaded and verified hash for: ${deliverableName}`,
            actor: u.name,
            relatedId: transactionId,
          },
          ...u.activity,
        ],
        lastSyncedAt: 'Synced just now',
      };
    }));

    // 2. Update transaction deliverable status
    setTx(prev => {
      if (prev.id !== transactionId) return prev;
      const updatedMilestones = prev.milestones.map(m => {
        const updatedDels = m.deliverables.map(d => {
          if (d.name.includes('Vertical') || d.name.includes('Story Template') || d.status === 'MISSING') {
            return {
              ...d,
              status: 'VERIFIED' as const,
              hash: 'sha256:77ae12...c38b',
              fileSize: '12.4 MB',
              submittedAt: new Date().toISOString(),
              notes: 'Submitted via User Platform Preview. Verified against Clause 4.2 specs.',
            };
          }
          return d;
        });
        return {
          ...m,
          deliverables: updatedDels,
          status: 'VERIFIED' as const,
        };
      });

      return {
        ...prev,
        milestones: updatedMilestones,
        state: 'SUBMITTED',
        timeline: [
          ...prev.timeline,
          {
            id: `t-${Date.now()}`,
            stepNumber: 4,
            title: 'Missing Deliverable Ingested from User Platform',
            description: `User submitted ${deliverableName}. All 8 contract deliverables now fulfilled.`,
            timestamp: new Date().toISOString(),
            actor: 'User Platform',
            status: 'completed',
            badge: 'SUBMITTED',
          },
        ],
      };
    });

    // 3. Add to system audit log
    addAuditLog({
      actor: 'User Platform',
      role: 'User Portal Session',
      action: 'DELIVERABLE_SUBMITTED',
      objectType: 'Transaction',
      objectId: transactionId,
      changesDiff: [
        {
          field: 'Deliverables',
          before: '6 of 8 Ingested (2 Missing)',
          after: '8 of 8 Ingested (All Verified)',
        },
      ],
      rollbackAvailable: false,
    });
  };

  const updateUserStatus = (userId: string, status: UserStatus, reason = 'Administrative update') => {
    setUsers(prev => prev.map(u => {
      if (u.id !== userId) return u;
      return {
        ...u,
        status,
        activity: [
          {
            id: `act-${Date.now()}`,
            timestamp: 'Just now',
            type: 'STATUS_CHANGE',
            title: `Status Changed to ${status}`,
            description: reason,
            actor: 'Admin Operator',
          },
          ...u.activity,
        ],
        lastSyncedAt: 'Synced just now',
      };
    }));

    addAuditLog({
      actor: 'admin_console',
      role: 'Risk Officer',
      action: 'USER_STATUS_UPDATED',
      objectType: 'UserAccount',
      objectId: userId,
      changesDiff: [{ field: 'Status', before: 'Previous', after: status }],
      rollbackAvailable: true,
    });
  };

  const executeUserIntervention = (userId: string, recommendationId: string, actionType: string, customNote?: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id !== userId) return u;

      const updatedRecs = u.recommendations.map(r =>
        r.id === recommendationId ? { ...r, status: 'APPLIED' as const } : r
      );

      let notifMessage = customNote;
      if (!notifMessage) {
        if (actionType === 'REQUEST_DOCUMENT') {
          notifMessage = 'Action Required: Please upload your verification document (Vertical 9:16 Interactive Story Template for TX-1048).';
        } else if (actionType === 'SEND_GUIDANCE') {
          notifMessage = 'Deliverable Guidance: Review the 1080x1920 MP4/WebP template specifications to accelerate milestone verification.';
        } else {
          notifMessage = 'Account Notification: An administrative update has been posted to your account.';
        }
      }

      const newIntervention: import('../types').UserInterventionRecord = {
        id: `int-${Date.now()}`,
        timestamp: 'Just now',
        actionTitle:
          actionType === 'REQUEST_DOCUMENT'
            ? 'Requested missing document'
            : actionType === 'SEND_GUIDANCE'
            ? 'Sent deliverable guidance'
            : 'Applied administrative intervention',
        actionDetails: notifMessage,
        actor: 'Admin (Risk Officer)',
        outcomeTime: 'Pending user response',
        outcomeDescription: 'Notification delivered to User Platform portal',
        resultStatus: 'IMPROVED',
      };

      return {
        ...u,
        recommendations: updatedRecs,
        interventions: [newIntervention, ...u.interventions],
        userPlatformNotification: notifMessage,
        lastSyncedAt: 'Synced just now',
      };
    }));

    addAuditLog({
      actor: 'Admin (Risk Officer)',
      role: 'Operations Administrator',
      action: 'ADMIN_INTERVENTION_DISPATCHED',
      objectType: 'UserAccount',
      objectId: userId,
      changesDiff: [{ field: 'Intervention Action', before: 'Pending', after: actionType }],
      rollbackAvailable: false,
    });
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    setCurrentPath(path);
    window.history.pushState({}, '', path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const createAndReserveCredits = ({
    title,
    description,
    payerName,
    providerName,
    totalAmount,
    platformFee,
    milestones,
  }: {
    title: string;
    description: string;
    payerName: string;
    providerName: string;
    totalAmount: number;
    platformFee: number;
    milestones: Array<{ title: string; credits: number; clause: string }>;
  }) => {
    // Preserve TX-1048 for standard demo scenario, otherwise generate
    const isGolden = payerName.toLowerCase().includes('sarah') || totalAmount === 1000;
    const newTxId = isGolden ? 'TX-1048' : `TX-${Math.floor(1000 + Math.random() * 9000)}`;
    const timestamp = new Date().toISOString();

    const newMilestones = milestones.map((m, index) => ({
      id: `m-${index + 1}`,
      clause: m.clause || `Clause ${index + 1}.1`,
      title: m.title,
      credits: m.credits,
      percentage: Math.round((m.credits / totalAmount) * 100),
      status: 'PENDING' as const,
      verificationNote: `${m.title} deliverables awaiting provider submission.`,
      deliverables: [],
    }));

    const reserveEntry: LedgerEntry = {
      id: `${newTxId}-RES-01`,
      entrySequence: 104801,
      timestamp,
      transactionId: newTxId,
      type: 'RESERVE',
      accountDebit: `1010.42 Payer Capital (${payerName})`,
      accountCredit: '2010.88 Client Escrow Reserve',
      amount: totalAmount,
      balanceBefore: 1500,
      balanceAfter: 1500 - totalAmount, // 500 CRD
      description: `Capital encumbrance for ${newTxId} contract commitment`,
      merkleRoot: '0x8f2a...c011',
      status: 'FINALIZED',
    };

    const newTimeline: TimelineEvent[] = [
      {
        id: `t-init-${Date.now()}`,
        stepNumber: 1,
        title: 'Transaction Initialized & Contract Formed',
        description: `${newTxId} registered between ${payerName} and ${providerName} with ${totalAmount} CRD notional value.`,
        timestamp: '2026-03-24 09:12:00 UTC',
        actor: 'Sarah Chen',
        status: 'completed',
        badge: 'INIT_200',
      },
      {
        id: `t-res-${Date.now()}`,
        stepNumber: 2,
        title: 'Credits Reserved in Protocol Escrow',
        description: `${payerName} balance debited ${totalAmount} CRD; credits locked into Account 2010.88 with protocol fee hold of ${platformFee} CRD.`,
        timestamp: '2026-03-24 09:12:45 UTC',
        actor: 'Deterministic Engine',
        status: 'completed',
        badge: 'ESCROW_LOCKED',
      },
      {
        id: `t-del-${Date.now()}`,
        stepNumber: 3,
        title: 'Deliverables & Asset Evidence Ingested',
        description: 'Awaiting provider asset submission for contract milestone evaluation.',
        timestamp: 'Pending',
        actor: 'Alex Morgan',
        status: 'active',
        badge: 'AWAITING_SUBMISSION',
      },
      {
        id: `t-ai-${Date.now()}`,
        stepNumber: 4,
        title: 'AI Verification & Contract Inspection',
        description: 'AI Economic Operator inspects contract clauses vs deliverable hashes.',
        timestamp: 'Pending',
        actor: 'AI Economic Operator',
        status: 'upcoming',
        badge: 'AI_VERIFY',
      },
      {
        id: `t-exc-${Date.now()}`,
        stepNumber: 5,
        title: 'Contract Exception Detected',
        description: 'Autonomous exception identification and capital deficiency risk assessment.',
        timestamp: 'Pending',
        actor: 'AI Economic Operator',
        status: 'upcoming',
        badge: 'EXCEPTION',
      },
      {
        id: `t-rec-${Date.now()}`,
        stepNumber: 6,
        title: 'Settlement Recommendation Formulated',
        description: 'AI Operator recommended: RELEASE 700 CRD / HOLD 300 CRD. Awaiting human authority signature.',
        timestamp: 'Pending',
        actor: 'AI Economic Operator',
        status: 'upcoming',
        badge: 'RECOMMENDED',
      },
      {
        id: `t-auth-${Date.now()}`,
        stepNumber: 7,
        title: 'Human Approval & Risk Governance',
        description: 'Pending executive sign-off to execute deterministic release.',
        timestamp: 'Pending',
        actor: 'Human Risk Officer',
        status: 'upcoming',
        badge: 'AUTH_REQUIRED',
      },
      {
        id: `t-set-${Date.now()}`,
        stepNumber: 8,
        title: 'Deterministic Settlement Execution',
        description: 'Automated ledger balance shift and provider capital credit.',
        timestamp: 'Pending',
        actor: 'Deterministic Engine',
        status: 'upcoming',
        badge: 'SETTLEMENT',
      },
      {
        id: `t-audit-${Date.now()}`,
        stepNumber: 9,
        title: 'Cryptographic Ledger Reconciliation',
        description: 'Zero-discrepancy double-entry verification and Merkle tree audit seal.',
        timestamp: 'Pending',
        actor: 'Deterministic Engine',
        status: 'upcoming',
        badge: 'RECONCILED',
      },
    ];

    const newTransaction: Transaction = {
      id: newTxId,
      title,
      description,
      payer: {
        ...tx.payer,
        name: payerName,
        startingBalance: 1500,
        currentBalance: 500,
      },
      provider: {
        ...tx.provider,
        name: providerName,
        startingBalance: 0,
        currentBalance: 0,
      },
      platform: {
        ...tx.platform,
        startingBalance: 0,
        currentBalance: 0,
      },
      totalValue: totalAmount,
      platformFee,
      currency: 'CRD',
      state: 'RESERVED',
      createdAt: timestamp,
      escrowBalance: totalAmount,
      milestones: newMilestones,
      timeline: newTimeline,
      ledgerEntries: [reserveEntry],
      merkleAuditRoot: '0x4f89d31bb990e4f8812c3b889a7102e',
      auditSignature: 'ECDSA_SECP256K1_VALID',
    };

    setTx(newTransaction);
    setAllTransactions((prev) => [newTransaction, ...prev.filter((t) => t.id !== newTxId)]);
    setLedger((prev) => [...initialHistoricalLedgerEntries]);
    navigate(`/transactions/${newTxId}`);
  };

  const submitDeliverables = () => {
    const updatedMilestones = tx.milestones.map((m) => {
      if (m.id === 'm-1') {
        return {
          ...m,
          status: 'VERIFIED' as const,
          deliverables: goldenDeliverablesM1,
          verificationNote: 'Vector typography, color system, and master logo approved with 100% test coverage.',
        };
      }
      if (m.id === 'm-2') {
        return {
          ...m,
          status: 'PARTIAL' as const,
          deliverables: goldenDeliverablesM2,
          verificationNote: '3 of 5 required multichannel assets verified. Missing vertical 9:16 motion deliverables.',
        };
      }
      if (m.id === 'm-3') {
        return {
          ...m,
          status: 'HELD' as const,
          deliverables: goldenDeliverablesM3,
          verificationNote: 'Master Figma tokens held in protective escrow awaiting prior tranche resolution.',
        };
      }
      return m;
    });

    const updatedTimeline = tx.timeline.map((event) => {
      if (event.stepNumber === 3) {
        return {
          ...event,
          status: 'completed' as const,
          timestamp: '2026-03-24 11:32:10 UTC',
          description: 'Provider Alex Morgan submitted deliverables across 3 tranches (6 files ingested, 2 missing).',
          badge: 'INGESTED',
        };
      }
      if (event.stepNumber === 4) {
        return {
          ...event,
          status: 'active' as const,
          badge: 'READY_FOR_AI',
        };
      }
      return event;
    });

    const updatedTx: Transaction = {
      ...tx,
      state: 'SUBMITTED',
      milestones: updatedMilestones,
      timeline: updatedTimeline,
    };

    setTx(updatedTx);
    setAllTransactions((prev) =>
      prev.map((item) => (item.id === tx.id ? updatedTx : item))
    );
  };

  const runAIVerification = async () => {
    setIsVerifying(true);

    const verifiedMilestones = tx.milestones.map((m) => {
      if (m.id === 'm-1') {
        return {
          ...m,
          status: 'VERIFIED' as const,
          deliverables: goldenDeliverablesM1,
          verificationNote: 'Vector typography, color system, and master logo approved with 100% test coverage.',
        };
      }
      if (m.id === 'm-2') {
        return {
          ...m,
          status: 'PARTIAL' as const,
          deliverables: goldenDeliverablesM2,
          verificationNote: '3 of 5 required multichannel assets verified. Missing vertical 9:16 motion deliverables under Clause 4.2.',
        };
      }
      if (m.id === 'm-3') {
        return {
          ...m,
          status: 'HELD' as const,
          deliverables: goldenDeliverablesM3,
          verificationNote: 'Master Figma tokens held in protective escrow awaiting prior tranche resolution.',
        };
      }
      return m;
    });

    try {
      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transaction: {
            id: tx.id,
            totalValue: tx.totalValue,
            platformFee: tx.platformFee,
            payer: tx.payer.name,
            provider: tx.provider.name,
          },
          contract: verifiedMilestones,
          deliverables: verifiedMilestones.flatMap((m) => m.deliverables),
          economicState: {
            escrowBalance: tx.escrowBalance,
            payerBalance: tx.payer.currentBalance,
          },
        }),
      });

      const data: AIVerificationResult = await response.json();
      const updatedTx: Transaction = {
        ...tx,
        state: 'EXCEPTION_DETECTED',
        milestones: verifiedMilestones,
        aiVerification: data,
        timeline: tx.timeline.map((event) => {
          if (event.stepNumber === 3) {
            return {
              ...event,
              status: 'completed' as const,
              timestamp: event.timestamp === 'Pending' ? '2026-03-24 11:32:10 UTC' : event.timestamp,
              badge: 'INGESTED',
            };
          }
          if (event.stepNumber === 4) {
            return {
              ...event,
              status: 'completed' as const,
              timestamp: '2026-03-24 12:00:15 UTC',
              badge: 'VERIFIED_87%',
            };
          }
          if (event.stepNumber === 5) {
            return {
              ...event,
              status: 'completed' as const,
              timestamp: '2026-03-24 12:00:19 UTC',
              description: 'Deficiency flag raised on Clause 4.2 (2 missing vertical motion formats). Capital under risk: 300 CRD.',
              badge: 'EXCEPTION',
            };
          }
          if (event.stepNumber === 6) {
            return {
              ...event,
              status: 'active' as const,
              timestamp: '2026-03-24 12:00:22 UTC',
              badge: 'RECOMMENDED',
            };
          }
          return event;
        }),
      };

      setTx(updatedTx);
      setAllTransactions((prev) =>
        prev.map((item) => (item.id === tx.id ? updatedTx : item))
      );
    } catch (err) {
      console.error('Error during AI verification:', err);
    } finally {
      setIsVerifying(false);
    }
  };

  const acceptAIRecommendation = () => {
    const updatedTx: Transaction = {
      ...tx,
      state: 'RECOMMENDED',
      timeline: tx.timeline.map((event) => {
        if (event.stepNumber === 6) {
          return { ...event, status: 'completed' as const };
        }
        if (event.stepNumber === 7) {
          return { ...event, status: 'active' as const };
        }
        return event;
      }),
    };
    setTx(updatedTx);
    setAllTransactions((prev) =>
      prev.map((item) => (item.id === tx.id ? updatedTx : item))
    );
    navigate(`/transactions/${tx.id}/settlement`);
  };

  const approveSettlement = (
    releaseAmount: number = 700,
    holdAmount: number = 300,
    signer: string = 'Sarah Chen (Tier-3 Enterprise Auth)'
  ): boolean => {
    const timestamp = new Date().toISOString();

    // =========================================================================
    // INVARIANT 1: AI CAN RECOMMEND. ONLY DETERMINISTIC ENGINE CAN EXECUTE WITH HUMAN APPROVAL.
    // =========================================================================
    const allowableStates: TransactionState[] = ['RECOMMENDED', 'EXCEPTION_DETECTED', 'APPROVED'];
    if (!allowableStates.includes(tx.state)) {
      const violation: EconomicIntegrityViolation = {
        code: 'UNAUTHORIZED_EXECUTION',
        title: 'Governance Gate Violation: Unauthorized Lifecycle Stage',
        message: `Deterministic settlement execution rejected. Current state is '${tx.state}'. Economic settlement strictly requires prior AI exception adjudication and human review readiness.`,
        invariant: 'AI can recommend. Only the deterministic economic engine can execute after human authorization.',
        timestamp,
        transactionId: tx.id,
      };
      setIntegrityError(violation);
      return false;
    }

    if (!signer || signer.trim().length === 0) {
      const violation: EconomicIntegrityViolation = {
        code: 'UNAUTHORIZED_EXECUTION',
        title: 'Governance Gate Violation: Missing Human Authority Signature',
        message: 'Deterministic settlement execution rejected. Economic actions require a verified human risk officer or enterprise authority signature.',
        invariant: 'AI can recommend. Execution requires explicit human authorization.',
        timestamp,
        transactionId: tx.id,
      };
      setIntegrityError(violation);
      return false;
    }

    // =========================================================================
    // INVARIANT 2: A TRANSACTION CANNOT BE SETTLED TWICE.
    // =========================================================================
    if (tx.state === 'SETTLED') {
      const violation: EconomicIntegrityViolation = {
        code: 'DOUBLE_SETTLEMENT',
        title: 'Double Settlement Violation: Transaction Already Finalized',
        message: `Transaction ${tx.id} was already finalized and settled at ${tx.settledAt || 'prior execution'}. Double-settlement is strictly rejected to prevent credit inflation.`,
        invariant: 'A transaction cannot be settled twice.',
        timestamp,
        transactionId: tx.id,
      };
      setIntegrityError(violation);
      return false;
    }

    const existingSettlementEntry = ledger.find(
      (e) => e.transactionId === tx.id && (e.type === 'SETTLEMENT' || e.type === 'RECONCILIATION')
    );
    if (existingSettlementEntry) {
      const violation: EconomicIntegrityViolation = {
        code: 'DOUBLE_SETTLEMENT',
        title: 'Ledger Idempotency Violation: Prior Settlement Entry Detected',
        message: `Historical ledger already contains settlement record (${existingSettlementEntry.id}) for transaction ${tx.id}. Re-execution would create duplicate capital disbursal.`,
        invariant: 'A transaction cannot be settled twice.',
        timestamp,
        transactionId: tx.id,
      };
      setIntegrityError(violation);
      return false;
    }

    // =========================================================================
    // INVARIANT 3: NON-NEGATIVE TRANCHES & NO CREDIT CREATION FROM NOTHING
    // =========================================================================
    if (typeof releaseAmount !== 'number' || isNaN(releaseAmount) || releaseAmount < 0) {
      const violation: EconomicIntegrityViolation = {
        code: 'NEGATIVE_ALLOCATION',
        title: 'Economic Boundary Violation: Negative Disbursal Rejected',
        message: `Release amount must be a non-negative number. Received: ${releaseAmount}. Negative credit allocations are prohibited.`,
        invariant: 'Released + held credits must never exceed the reserved amount.',
        timestamp,
        transactionId: tx.id,
        attemptedValues: { releaseAmount, holdAmount, escrowBalance: tx.escrowBalance },
      };
      setIntegrityError(violation);
      return false;
    }

    if (typeof holdAmount !== 'number' || isNaN(holdAmount) || holdAmount < 0) {
      const violation: EconomicIntegrityViolation = {
        code: 'NEGATIVE_ALLOCATION',
        title: 'Economic Boundary Violation: Negative Hold Rejected',
        message: `Hold amount must be a non-negative number. Received: ${holdAmount}. Negative credit allocations are prohibited.`,
        invariant: 'Released + held credits must never exceed the reserved amount.',
        timestamp,
        transactionId: tx.id,
        attemptedValues: { releaseAmount, holdAmount, escrowBalance: tx.escrowBalance },
      };
      setIntegrityError(violation);
      return false;
    }

    // =========================================================================
    // INVARIANT 4: RELEASED + HELD CREDITS MUST NEVER EXCEED THE RESERVED AMOUNT
    // =========================================================================
    const totalAllocated = releaseAmount + holdAmount;
    if (totalAllocated > tx.escrowBalance) {
      const violation: EconomicIntegrityViolation = {
        code: 'EXCESS_DISBURSAL',
        title: 'Excess Disbursal Violation: Escrow Limit Breached',
        message: `Attempted total allocation (${totalAllocated} CRD = ${releaseAmount} release + ${holdAmount} hold) exceeds reserved escrow balance (${tx.escrowBalance} CRD). Creating credits from nothing is prohibited.`,
        invariant: 'Released + held credits must never exceed the reserved amount.',
        timestamp,
        transactionId: tx.id,
        attemptedValues: { releaseAmount, holdAmount, escrowBalance: tx.escrowBalance, totalAllocated },
      };
      setIntegrityError(violation);
      return false;
    }

    // Capital conservation within the transaction tranche
    if (totalAllocated !== tx.escrowBalance) {
      const violation: EconomicIntegrityViolation = {
        code: 'CAPITAL_CREATION',
        title: 'Capital Conservation Violation: Unallocated Tranche Discrepancy',
        message: `Tranche sum (${totalAllocated} CRD) does not balance reserved escrow (${tx.escrowBalance} CRD). Discrepancy of ${Math.abs(tx.escrowBalance - totalAllocated)} CRD unallocated. All reserved credits must be deterministically accounted for.`,
        invariant: 'Released + held credits must never exceed the reserved amount.',
        timestamp,
        transactionId: tx.id,
        attemptedValues: { releaseAmount, holdAmount, escrowBalance: tx.escrowBalance, totalAllocated },
      };
      setIntegrityError(violation);
      return false;
    }

    const feeAmount = tx.platformFee || 20;
    if (releaseAmount > 0 && releaseAmount < feeAmount) {
      const violation: EconomicIntegrityViolation = {
        code: 'EXCESS_DISBURSAL',
        title: 'Fee Feasibility Violation: Insolvent Net Disbursal',
        message: `Release amount (${releaseAmount} CRD) is less than protocol clearing fee (${feeAmount} CRD). Disbursal would produce an unauthorized provider balance deficit.`,
        invariant: 'Released + held credits must never exceed the reserved amount.',
        timestamp,
        transactionId: tx.id,
        attemptedValues: { releaseAmount, holdAmount, escrowBalance: tx.escrowBalance },
      };
      setIntegrityError(violation);
      return false;
    }

    // =========================================================================
    // INVARIANT 5: PREDICTED SYSTEM BALANCES & PARITY
    // =========================================================================
    const newPayerBalance = tx.payer.currentBalance; // Payer was encumbered at reserve time
    const newProviderBalance = tx.provider.currentBalance + releaseAmount - feeAmount;
    const newPlatformBalance = tx.platform.currentBalance + feeAmount;
    const newEscrowBalance = holdAmount;

    // Double-entry closed system conservation:
    // deltaEscrow = -releaseAmount
    // deltaProvider = releaseAmount - feeAmount
    // deltaPlatform = feeAmount
    // deltaPayer = 0
    // Net sum = (-releaseAmount) + (releaseAmount - feeAmount) + feeAmount + 0 = 0.00 CRD
    const deltaEscrow = newEscrowBalance - tx.escrowBalance;
    const deltaProvider = newProviderBalance - tx.provider.currentBalance;
    const deltaPlatform = newPlatformBalance - tx.platform.currentBalance;
    const deltaPayer = newPayerBalance - tx.payer.currentBalance;
    const netDiscrepancy = deltaEscrow + deltaProvider + deltaPlatform + deltaPayer;

    if (Math.abs(netDiscrepancy) > 0.0000001) {
      const violation: EconomicIntegrityViolation = {
        code: 'UNBALANCED_SETTLEMENT',
        title: 'Ledger Reconciliation Failure: Double-Entry Imbalance',
        message: `Double-entry parity failed: Net balance discrepancy is ${netDiscrepancy.toFixed(8)} CRD. Σ(Debits) must equal Σ(Credits) with zero tolerance.`,
        invariant: 'After settlement, the ledger must reconcile.',
        timestamp,
        transactionId: tx.id,
        attemptedValues: { discrepancy: netDiscrepancy },
      };
      setIntegrityError(violation);
      return false;
    }

    // =========================================================================
    // INVARIANT 6: EVERY ACTION CREATES A UNIQUE LEDGER ENTRY (NO DUPLICATES)
    // =========================================================================
    const seqBase = ledger.length + 104801;
    const releaseEntryId = `${tx.id}-REL-${seqBase}`;
    const feeEntryId = `${tx.id}-FEE-${seqBase + 1}`;
    const holdEntryId = `${tx.id}-HLD-${seqBase + 2}`;
    const recEntryId = `${tx.id}-REC-${seqBase + 3}`;

    const prospectiveIds = [releaseEntryId, feeEntryId, holdEntryId, recEntryId];
    const duplicateId = prospectiveIds.find((id) => ledger.some((e) => e.id === id));
    if (duplicateId) {
      const violation: EconomicIntegrityViolation = {
        code: 'DUPLICATE_LEDGER_ENTRY',
        title: 'Duplicate Ledger Entry Detected',
        message: `Ledger sequence collision detected for entry ID: ${duplicateId}. Append-only ledger integrity violation.`,
        invariant: 'Every executed economic action must create a ledger entry.',
        timestamp,
        transactionId: tx.id,
      };
      setIntegrityError(violation);
      return false;
    }

    // =========================================================================
    // DETERMINISTIC EXECUTION
    // =========================================================================
    const releaseEntry: LedgerEntry = {
      id: releaseEntryId,
      entrySequence: seqBase,
      timestamp,
      transactionId: tx.id,
      type: 'SETTLEMENT',
      accountDebit: '2010.88 Client Escrow Reserve',
      accountCredit: `1020.14 Provider Capital (${tx.provider.name})`,
      amount: releaseAmount,
      balanceBefore: tx.escrowBalance,
      balanceAfter: holdAmount,
      description: `Adjudicated tranche disbursal: ${releaseAmount} CRD released under Exception 4.2 protocol`,
      merkleRoot: '0x9d11e8a09912bc',
      status: 'FINALIZED',
    };

    const feeEntry: LedgerEntry = {
      id: feeEntryId,
      entrySequence: seqBase + 1,
      timestamp,
      transactionId: tx.id,
      type: 'FEE',
      accountDebit: `1020.14 Provider Capital (${tx.provider.name})`,
      accountCredit: '4050.01 Protocol Liquidity Clearing',
      amount: feeAmount,
      balanceBefore: tx.provider.currentBalance + releaseAmount,
      balanceAfter: newProviderBalance,
      description: `Protocol settlement routing fee (2.0% on ${releaseAmount} CRD notional tranche)`,
      merkleRoot: '0x44ae0991bc331f',
      status: 'FINALIZED',
    };

    const holdEntry: LedgerEntry = {
      id: holdEntryId,
      entrySequence: seqBase + 2,
      timestamp,
      transactionId: tx.id,
      type: 'HOLD',
      accountDebit: '2010.88 Client Escrow Reserve',
      accountCredit: '2010.88 Client Escrow Reserve (Locked Tranche)',
      amount: holdAmount,
      balanceBefore: holdAmount,
      balanceAfter: holdAmount,
      description: `Deficiency retention: ${holdAmount} CRD isolated in protective escrow for missing deliverables`,
      merkleRoot: '0x17c092aa8812de',
      status: 'FINALIZED',
    };

    const reconciliationEntry: LedgerEntry = {
      id: recEntryId,
      entrySequence: seqBase + 3,
      timestamp,
      transactionId: tx.id,
      type: 'RECONCILIATION',
      accountDebit: '2010.88 Escrow Clearing',
      accountCredit: '1020.14 / 4050.01 Balanced',
      amount: releaseAmount,
      balanceBefore: 0,
      balanceAfter: 0,
      description: 'Zero-discrepancy double-entry verification: Σ(Debits) - Σ(Credits) = 0.00 CRD',
      merkleRoot: '0x4f89d31bb990e4f8812c3b889a7102e',
      status: 'FINALIZED',
    };

    const newLedgerEntries = [releaseEntry, feeEntry, holdEntry, reconciliationEntry];

    const updatedTx: Transaction = {
      ...tx,
      state: 'SETTLED',
      escrowBalance: newEscrowBalance,
      payer: { ...tx.payer, currentBalance: newPayerBalance },
      provider: { ...tx.provider, currentBalance: newProviderBalance },
      platform: { ...tx.platform, currentBalance: newPlatformBalance },
      humanApprovedBy: signer,
      humanApprovedAt: timestamp,
      settledAt: timestamp,
      ledgerEntries: [...tx.ledgerEntries, ...newLedgerEntries],
      timeline: tx.timeline.map((event) => {
        return {
          ...event,
          status: 'completed' as const,
          timestamp: event.timestamp === 'Pending' ? timestamp : event.timestamp,
        };
      }),
    };

    // State commitment
    setTx(updatedTx);
    setAllTransactions((prev) =>
      prev.map((item) => (item.id === tx.id ? updatedTx : item))
    );
    setLedger((prev) => [...prev, ...newLedgerEntries]);
    setIntegrityError(null);
    navigate(`/transactions/${tx.id}/settled`);
    return true;
  };

  const triggerSimulatedIntegrityBreach = (
    type: 'double_settle' | 'excess_amount' | 'unauthorized_state' | 'missing_signature'
  ) => {
    if (type === 'double_settle') {
      const violation: EconomicIntegrityViolation = {
        code: 'DOUBLE_SETTLEMENT',
        title: 'Integrity Audit: Double-Settlement Guard Triggered',
        message: 'Simulated breach: An external agent attempted to execute settlement a second time on an already settled transaction. The deterministic engine rejected the action and preserved ledger state.',
        invariant: 'A transaction cannot be settled twice.',
        timestamp: new Date().toISOString(),
        transactionId: tx.id,
      };
      setIntegrityError(violation);
    } else if (type === 'excess_amount') {
      const violation: EconomicIntegrityViolation = {
        code: 'EXCESS_DISBURSAL',
        title: 'Integrity Audit: Solvency Guard Triggered',
        message: `Simulated breach: Attempted to release 1,200 CRD when reserved escrow is only ${tx.escrowBalance} CRD. The deterministic engine rejected credit creation from nothing.`,
        invariant: 'Released + held credits must never exceed the reserved amount.',
        timestamp: new Date().toISOString(),
        transactionId: tx.id,
        attemptedValues: { releaseAmount: 1200, holdAmount: 0, escrowBalance: tx.escrowBalance, totalAllocated: 1200 },
      };
      setIntegrityError(violation);
    } else if (type === 'unauthorized_state') {
      const violation: EconomicIntegrityViolation = {
        code: 'UNAUTHORIZED_EXECUTION',
        title: 'Integrity Audit: Autonomous AI Execution Blocked',
        message: 'Simulated breach: An autonomous AI process attempted to invoke settlement execution directly without human authority approval. Execution halted at Human Governance Gate.',
        invariant: 'AI can recommend. Only the deterministic economic engine can execute after human authorization.',
        timestamp: new Date().toISOString(),
        transactionId: tx.id,
      };
      setIntegrityError(violation);
    } else if (type === 'missing_signature') {
      const violation: EconomicIntegrityViolation = {
        code: 'UNAUTHORIZED_EXECUTION',
        title: 'Integrity Audit: Missing Governance Signature',
        message: 'Simulated breach: Settlement requested with an empty signer field. Execution halted until verified executive credentials are provided.',
        invariant: 'AI can recommend. Execution requires explicit human authorization.',
        timestamp: new Date().toISOString(),
        transactionId: tx.id,
      };
      setIntegrityError(violation);
    }
  };

  const settleCustomDispute = (notes: string) => {
    approveSettlement(500, 500, 'Arbitration Officer (Dispute Protocol 8.1)');
  };

  const resetGoldenDemo = () => {
    const freshTx = JSON.parse(JSON.stringify(initialTransactionTX1048));
    setTx(freshTx);
    setAllTransactions([
      freshTx,
      sampleTransactions[1],
      sampleTransactions[2],
      sampleTransactions[3],
    ]);
    setLedger([...initialHistoricalLedgerEntries]);
    setIntegrityError(null);
    navigate('/transactions/TX-1048');
  };

  return (
    <EconomicContext.Provider
      value={{
        currentPath,
        navigate,
        tx,
        allTransactions,
        ledger,
        isVerifying,
        integrityError,
        clearIntegrityError,
        createAndReserveCredits,
        submitDeliverables,
        runAIVerification,
        acceptAIRecommendation,
        approveSettlement,
        resetGoldenDemo,
        settleCustomDispute,
        triggerSimulatedIntegrityBreach,

        // Core 18-screen operational state
        creditTypes,
        selectedCreditTypeId,
        setSelectedCreditTypeId,
        updateCreditType,

        rewardRules,
        addRewardRule,
        updateRewardRule,
        toggleRewardRuleStatus,

        spendProducts,
        updateSpendProduct,

        priceRules,
        updatePriceRule,

        walletPolicies,
        updateWalletPolicy,

        riskPolicies,
        toggleRiskPolicy,
        releaseRiskHold,

        budgetEnvelopes,
        updateBudgetEnvelope,

        auditLogs,
        addAuditLog,

        simulationScenarios,
        activeSimulation,
        setActiveSimulation,
        runSimulationOnObject,

        aiCapabilities,
        aiRecommendations,
        handleAIRecommendationAction,

        // User Management & Platform Preview
        users,
        selectedUserId,
        setSelectedUserId,
        proposedChange,
        setProposedChange,
        applyProposedChange,
        discardProposedChange,
        userSubmitDeliverable,
        updateUserStatus,
        funnelMetrics,
        executeUserIntervention,

        // Organization & Ecosystem
        organizations,
        selectedOrganizationId,
        setSelectedOrganizationId,
        createOrganization,
        updateOrganization,
        addOrganizationMember,
        removeOrganizationMember,
        updateOrganizationMemberRole,
        quests,
        createQuest,
        updateQuest,
        campaigns,
        createCampaign,
        updateCampaign,
        programs,
        createProgram,
        creditSamples,
        approvalRequests,
        updateApprovalRequest,
        rewardPools,
        redeemRewardPoolItem,
        simulateProgram,

        // Benefit Pools
        pools,
        selectedPoolId,
        setSelectedPoolId,
        createPool,
        updatePool,
        addPoolContribution,
        addPoolBenefit,
        redeemPoolBenefit,
        saveUserGoal,
        allocateCreditsToGoal,
        unallocateCreditsFromGoal,
        simulateEarnOpportunity,
      }}
    >
      {children}
    </EconomicContext.Provider>
  );
};

export const useEconomic = () => {
  const context = useContext(EconomicContext);
  if (!context) {
    throw new Error('useEconomic must be used within an EconomicProvider');
  }
  return context;
};
