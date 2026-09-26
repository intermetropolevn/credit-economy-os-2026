/**
 * EXPERIENCE BACKEND & DATA LAYER SERVICE
 *
 * Implements the mock backend data layer supporting the Digital Experience Layer (DX).
 * Preserves existing Credit, Campaign, Quest, Pool, Partner, User, and Analytics data models.
 *
 * Authoritative Rule Separation:
 * Experience Event → Rule Engine → Validation → Credit Ledger.
 * Experience events can request Credits but CANNOT directly alter the ledger.
 */

import {
  Experience,
  JourneyEntity,
  JourneyNodeEntity,
  JourneyEdgeEntity,
  ExperienceEventEntity,
  ExperienceSessionEntity,
  ExperienceAttributionEntity,
  ExperienceEventType,
  NextBestExperience,
  ExperienceChannel,
  ExperienceType,
  ExperienceStatus,
} from '../types';
import { seedExperiences, seedNextBestExperiences } from '../data/experiencesSeedData';

// Seed Initial Journeys
const seedInitialJourneys: JourneyEntity[] = [
  {
    id: 'jrn-summer-fitness-01',
    experienceId: 'exp-summer-fitness-01',
    name: 'Summer Fitness 8-Stage Lifecycle Journey',
    status: 'active',
    nodes: [
      {
        id: 'node-entry-1',
        journeyId: 'jrn-summer-fitness-01',
        type: 'ENTRY',
        name: 'POS Check-in / QR Scan',
        config: { placement: 'Saigon Fitness Front Desk', channel: 'QR' },
        conditions: ['Patron within 50m geofence or POS terminal token'],
        position: { x: 0, y: 0 },
        nextNodeIds: ['node-exp-2'],
      },
      {
        id: 'node-exp-2',
        journeyId: 'jrn-summer-fitness-01',
        type: 'EXPERIENCE',
        name: 'Summer Fitness Kickoff Story',
        config: { mediaType: 'video_story', durationSeconds: 45 },
        conditions: ['First exposure in 7 days'],
        position: { x: 250, y: 0 },
        nextNodeIds: ['node-act-3'],
      },
      {
        id: 'node-act-3',
        journeyId: 'jrn-summer-fitness-01',
        type: 'ACTION',
        name: 'Complete 3 Workout Sessions',
        config: { milestoneTarget: 3, questId: 'qst-fitness-01' },
        conditions: ['Verified merchant POS check-in', 'Min 45 min interval'],
        position: { x: 500, y: 0 },
        nextNodeIds: ['node-crd-4'],
      },
      {
        id: 'node-crd-4',
        journeyId: 'jrn-summer-fitness-01',
        type: 'CREDIT',
        name: 'Mint 200 Credits',
        config: { ruleId: 'RUL-FIT-200', rewardAmount: 200, cooldown: 'ONCE' },
        conditions: ['Action verified by POS signature'],
        position: { x: 750, y: 0 },
        nextNodeIds: ['node-pol-5'],
      },
      {
        id: 'node-pol-5',
        journeyId: 'jrn-summer-fitness-01',
        type: 'POOL',
        name: 'Discover Fitness & Wellness Pool',
        config: { poolId: 'pool-fitness-wellness', goalAmount: 500 },
        conditions: ['User balance >= 200 CRD'],
        position: { x: 1000, y: 0 },
        nextNodeIds: ['node-ben-6'],
      },
      {
        id: 'node-ben-6',
        journeyId: 'jrn-summer-fitness-01',
        type: 'BENEFIT',
        name: 'Browse High-Utility Perks',
        config: { benefitId: 'ben-hiit-01', partner: 'Saigon Fitness Studio' },
        conditions: ['Pool membership active'],
        position: { x: 1250, y: 0 },
        nextNodeIds: ['node-cnv-7'],
      },
      {
        id: 'node-cnv-7',
        journeyId: 'jrn-summer-fitness-01',
        type: 'CONVERSION',
        name: 'Redeem Perk & Visit Studio',
        config: { goalType: 'in_store_redemption', voucherCodePrefix: 'VCH-FIT' },
        conditions: ['User confirms 200 CRD burn'],
        position: { x: 1500, y: 0 },
        nextNodeIds: ['node-fol-8'],
      },
      {
        id: 'node-fol-8',
        journeyId: 'jrn-summer-fitness-01',
        type: 'FOLLOW-UP',
        name: 'Next Best Experience Invitation',
        config: { recommendationType: 'cross_merchant_coffee' },
        conditions: ['Redemption completed within 24h'],
        position: { x: 1750, y: 0 },
        nextNodeIds: [],
      },
    ],
    edges: [
      { id: 'edge-1-2', sourceNodeId: 'node-entry-1', targetNodeId: 'node-exp-2' },
      { id: 'edge-2-3', sourceNodeId: 'node-exp-2', targetNodeId: 'node-act-3' },
      { id: 'edge-3-4', sourceNodeId: 'node-act-3', targetNodeId: 'node-crd-4' },
      { id: 'edge-4-5', sourceNodeId: 'node-crd-4', targetNodeId: 'node-pol-5' },
      { id: 'edge-5-6', sourceNodeId: 'node-pol-5', targetNodeId: 'node-ben-6' },
      { id: 'edge-6-7', sourceNodeId: 'node-ben-6', targetNodeId: 'node-cnv-7' },
      { id: 'edge-7-8', sourceNodeId: 'node-cnv-7', targetNodeId: 'node-fol-8' },
    ],
  },
];

// Seed Initial Experience Sessions
const seedInitialSessions: ExperienceSessionEntity[] = [
  {
    id: 'ses-sarah-01',
    experienceId: 'exp-summer-fitness-01',
    userId: 'usr-sarah-chen',
    startedAt: '2026-09-24T08:30:00Z',
    lastActivityAt: '2026-09-26T02:15:00Z',
    currentNode: 'node-crd-4',
    status: 'active',
    conversionStatus: 'converted',
  },
  {
    id: 'ses-alex-02',
    experienceId: 'exp-coffee-trail-02',
    userId: 'usr-alex-morgan',
    startedAt: '2026-09-25T14:10:00Z',
    lastActivityAt: '2026-09-25T15:00:00Z',
    currentNode: 'node-exp-2',
    status: 'active',
    conversionStatus: 'pending',
  },
];

// Seed Initial Attributions
const seedInitialAttributions: ExperienceAttributionEntity[] = [
  {
    id: 'att-01',
    experienceId: 'exp-summer-fitness-01',
    userId: 'usr-sarah-chen',
    conversionType: 'first_purchase',
    conversionId: 'tx-pos-99823',
    attributedValue: 35.0,
    attributionModel: 'last_touch',
    timestamp: '2026-09-26T01:14:00Z',
  },
  {
    id: 'att-02',
    experienceId: 'exp-coffee-trail-02',
    userId: 'usr-marcus-vance',
    conversionType: 'in_store_tasting',
    conversionId: 'tx-pos-88412',
    attributedValue: 18.5,
    attributionModel: 'linear',
    timestamp: '2026-09-25T16:20:00Z',
  },
];

export class ExperienceBackendService {
  private experiences: Experience[] = [];
  private journeys: JourneyEntity[] = [...seedInitialJourneys];
  private events: ExperienceEventEntity[] = [];
  private sessions: ExperienceSessionEntity[] = [...seedInitialSessions];
  private attributions: ExperienceAttributionEntity[] = [...seedInitialAttributions];

  // Authoritative in-memory user credit balances
  private userBalances: Record<string, number> = {
    'usr-sarah-chen': 1440,
    'usr-alex-morgan': 520,
    'usr-marcus-vance': 850,
  };

  // Authoritative Ledger Journal storage
  private ledgerEntries: Array<{
    id: string;
    timestamp: string;
    debitAccount: string;
    creditAccount: string;
    amount: number;
    description: string;
    experienceId: string;
    hash: string;
  }> = [];

  constructor() {
    this.initializeExperiences();
  }

  private initializeExperiences() {
    this.experiences = seedExperiences.map((exp, idx) => ({
      ...exp,
      description: exp.objective,
      audienceId: `aud-${exp.partnerId.replace('org-', '')}`,
      journeyId: exp.journey?.id || `jrn-${exp.id}`,
      creditRuleId: idx === 0 ? 'RUL-FIT-200' : 'RUL-QUEST-100',
      poolId: exp.associatedPoolId || 'pool-fitness-wellness',
      primaryBenefitId: exp.featuredBenefits?.[0] ? 'ben-hiit-01' : 'ben-coffee-01',
      conversionGoal: 'Verified customer purchase and class visit',
      createdAt: '2026-06-01T00:00:00Z',
    }));
  }

  // ==========================================================================
  // 1. EXPERIENCES CRUD
  // ==========================================================================

  public getExperiences(): Experience[] {
    return this.experiences;
  }

  public getExperience(id: string): Experience | null {
    return this.experiences.find((e) => e.id === id) || null;
  }

  public createExperience(data: Partial<Experience>): Experience {
    const id = data.id || `exp-${Date.now()}`;
    const journeyId = `jrn-${id}`;

    const newExp: Experience = {
      id,
      name: data.name || 'Untitled Experience',
      type: data.type || 'Challenge',
      objective: data.objective || 'Default objective for customer participation',
      description: data.description || data.objective || 'Comprehensive customer journey',
      status: 'Draft',
      partnerId: data.partnerId || 'org-saigon-fitness',
      partnerName: data.partnerName || 'Saigon Fitness Club',
      audienceId: data.audienceId || 'aud-new-patrons',
      audience: data.audience || 'Target Community Cohort',
      journeyId,
      creditRuleId: data.creditRuleId || 'RUL-FIT-200',
      poolId: data.poolId || 'pool-fitness-wellness',
      primaryBenefitId: data.primaryBenefitId || 'ben-hiit-01',
      channels: data.channels || ['QR', 'Web', 'Mobile App'],
      startDate: data.startDate || new Date().toISOString().split('T')[0],
      endDate: data.endDate,
      conversionGoal: data.conversionGoal || 'In-store check-in and transaction',
      createdAt: new Date().toISOString(),
      participantsCount: 0,
      engagementRate: 0,
      completionRate: 0,
      creditsGenerated: 0,
      creditsRedeemed: 0,
      conversionRate: 0,
      attributedTransactions: 0,
      attributedRevenueUsd: 0,
      cacUsd: 0,
      tags: data.tags || ['Community'],
      journey: data.journey || {
        id: journeyId,
        name: `${data.name || 'New'} Journey`,
        description: data.description || 'Auto-scaffolded journey',
        nodes: [],
      },
    };

    this.experiences.unshift(newExp);

    // Automatically scaffold backing Journey entity
    this.createJourney({
      id: journeyId,
      experienceId: id,
      name: `${newExp.name} Journey`,
      status: 'draft',
      nodes: [
        {
          id: `node-${Date.now()}-1`,
          journeyId,
          type: 'ENTRY',
          name: 'Entry Touchpoint',
          config: { channel: 'QR' },
          conditions: [],
          position: { x: 0, y: 0 },
          nextNodeIds: [`node-${Date.now()}-2`],
        },
        {
          id: `node-${Date.now()}-2`,
          journeyId,
          type: 'EXPERIENCE',
          name: 'Introduction Story',
          config: {},
          conditions: [],
          position: { x: 250, y: 0 },
          nextNodeIds: [`node-${Date.now()}-3`],
        },
        {
          id: `node-${Date.now()}-3`,
          journeyId,
          type: 'ACTION',
          name: 'Customer Action Quest',
          config: {},
          conditions: [],
          position: { x: 500, y: 0 },
          nextNodeIds: [`node-${Date.now()}-4`],
        },
        {
          id: `node-${Date.now()}-4`,
          journeyId,
          type: 'CREDIT',
          name: 'Reward Credits',
          config: { rewardAmount: 200 },
          conditions: [],
          position: { x: 750, y: 0 },
          nextNodeIds: [],
        },
      ],
      edges: [],
    });

    return newExp;
  }

  public updateExperience(id: string, data: Partial<Experience>): Experience | null {
    const idx = this.experiences.findIndex((e) => e.id === id);
    if (idx === -1) return null;

    this.experiences[idx] = { ...this.experiences[idx], ...data };
    return this.experiences[idx];
  }

  public publishExperience(id: string): { success: boolean; message: string; experience?: Experience } {
    const exp = this.getExperience(id);
    if (!exp) return { success: false, message: `Experience ${id} not found.` };

    // Run validation prior to publishing
    const validation = this.validateExperience(id);
    if (!validation.valid) {
      return {
        success: false,
        message: `Cannot publish experience: Unresolved validation errors present.`,
      };
    }

    exp.status = 'Active';
    // Update linked journey status
    const jrn = exp.journeyId ? this.getJourney(exp.journeyId) : null;
    if (jrn) jrn.status = 'active';

    return {
      success: true,
      message: `Experience "${exp.name}" is now published and active on the network.`,
      experience: exp,
    };
  }

  // ==========================================================================
  // 2. JOURNEYS CRUD
  // ==========================================================================

  public getJourney(id: string): JourneyEntity | null {
    return this.journeys.find((j) => j.id === id) || null;
  }

  public createJourney(data: Partial<JourneyEntity>): JourneyEntity {
    const newJourney: JourneyEntity = {
      id: data.id || `jrn-${Date.now()}`,
      experienceId: data.experienceId || '',
      name: data.name || 'New Journey',
      status: data.status || 'draft',
      nodes: data.nodes || [],
      edges: data.edges || [],
    };
    this.journeys.push(newJourney);
    return newJourney;
  }

  public updateJourney(id: string, data: Partial<JourneyEntity>): JourneyEntity | null {
    const idx = this.journeys.findIndex((j) => j.id === id);
    if (idx === -1) return null;

    this.journeys[idx] = { ...this.journeys[idx], ...data };
    return this.journeys[idx];
  }

  // ==========================================================================
  // 3. AUTHORITATIVE EVENT INGESTION & CREDIT ENGINE ROUTING
  // ==========================================================================
  /**
   * EVENT FLOW:
   * purchase_completed
   * → create experience event
   * → identify active experience
   * → evaluate campaign
   * → evaluate credit rule
   * → validate eligibility
   * → issue Credits through Authoritative Ledger
   * → update user credit balance
   * → update experience analytics
   * → update attribution
   * → trigger next-best-experience recommendation
   */
  public trackExperienceEvent(data: Partial<ExperienceEventEntity>): {
    success: boolean;
    event: ExperienceEventEntity;
    creditsIssued: number;
    journalEntryId?: string;
    newBalance?: number;
    nextBestExperience?: NextBestExperience;
    message: string;
  } {
    const eventId = data.id || `evt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const experienceId = data.experienceId || 'exp-summer-fitness-01';
    const userId = data.userId || 'usr-sarah-chen';
    const eventType: ExperienceEventType = data.eventType || 'content_viewed';
    const timestamp = data.timestamp || new Date().toISOString();

    // 1. Create Experience Event Entity
    const eventEntity: ExperienceEventEntity = {
      id: eventId,
      experienceId,
      journeyId: data.journeyId || `jrn-${experienceId}`,
      userId,
      eventType,
      partnerId: data.partnerId || 'org-saigon-fitness',
      timestamp,
      metadata: data.metadata || {},
    };
    this.events.unshift(eventEntity);

    // 2. Identify active Experience and update/create Experience Session
    const exp = this.getExperience(experienceId);
    let session = this.sessions.find(
      (s) => s.experienceId === experienceId && s.userId === userId && s.status === 'active'
    );
    if (!session) {
      session = {
        id: `ses-${Date.now()}`,
        experienceId,
        userId,
        startedAt: timestamp,
        lastActivityAt: timestamp,
        currentNode: 'node-entry-1',
        status: 'active',
        conversionStatus: 'pending',
      };
      this.sessions.push(session);
    } else {
      session.lastActivityAt = timestamp;
    }

    // 3. Evaluate Campaign, Credit Rule & Eligibility
    let creditsToIssue = 0;
    let ruleEvaluated = 'NO_REWARD_RULE';

    if (eventType === 'purchase_completed') {
      creditsToIssue = 200;
      ruleEvaluated = exp?.creditRuleId || 'RUL-FIT-200';
      session.conversionStatus = 'converted';
    } else if (eventType === 'quest_completed') {
      creditsToIssue = 100;
      ruleEvaluated = 'RUL-QUEST-100';
    } else if (eventType === 'referral_completed') {
      creditsToIssue = 150;
      ruleEvaluated = 'RUL-REF-150';
    }

    // 4. Issue Credits via Authoritative Double-Entry Credit Ledger
    let journalId: string | undefined = undefined;
    if (creditsToIssue > 0) {
      journalId = `LED-JOURNAL-${Date.now()}`;
      const previousBal = this.userBalances[userId] || 1440;
      this.userBalances[userId] = previousBal + creditsToIssue;

      // Authoritative Ledger commit
      this.ledgerEntries.unshift({
        id: journalId,
        timestamp,
        debitAccount: '2010.88 (Sponsor Campaign Escrow)',
        creditAccount: `1010.01 (User Available - ${userId})`,
        amount: creditsToIssue,
        description: `Verified ${eventType} trigger in ${exp?.name || experienceId}`,
        experienceId,
        hash: `SHA256:0x${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`,
      });

      // 5. Update Experience Analytics
      if (exp) {
        exp.creditsGenerated = (exp.creditsGenerated || 0) + creditsToIssue;
        exp.attributedTransactions = (exp.attributedTransactions || 0) + 1;
        exp.attributedRevenueUsd = (exp.attributedRevenueUsd || 0) + (data.metadata?.amount || 35.0);
      }

      // 6. Update Experience Attribution
      const attribution: ExperienceAttributionEntity = {
        id: `att-${Date.now()}`,
        experienceId,
        userId,
        conversionType: eventType,
        conversionId: data.metadata?.txRef || `tx-${Date.now()}`,
        attributedValue: data.metadata?.amount || 35.0,
        attributionModel: 'last_touch',
        timestamp,
      };
      this.attributions.push(attribution);
    }

    // 7. Trigger Next Best Experience Recommendation
    const nextBest = seedNextBestExperiences[0];

    return {
      success: true,
      event: eventEntity,
      creditsIssued: creditsToIssue,
      journalEntryId: journalId,
      newBalance: this.userBalances[userId],
      nextBestExperience: nextBest,
      message:
        creditsToIssue > 0
          ? `Event ${eventType} validated. Rule ${ruleEvaluated} triggered: +${creditsToIssue} CRD committed to ledger.`
          : `Event ${eventType} recorded successfully.`,
    };
  }

  // ==========================================================================
  // 4. ANALYTICS & ATTRIBUTION QUERIES
  // ==========================================================================

  public getExperienceFunnel(id: string) {
    const exp = this.getExperience(id);
    const participants = exp?.participantsCount || 1240;

    return {
      experienceId: id,
      name: exp?.name || 'Experience Funnel',
      stages: [
        { stage: 'Impression', count: participants * 36, rate: 100 },
        { stage: 'Discovery', count: Math.round(participants * 22.9), rate: 63.6 },
        { stage: 'Experience Open', count: Math.round(participants * 15.2), rate: 42.2 },
        { stage: 'Engagement', count: Math.round(participants * 10.1), rate: 28.0 },
        { stage: 'Action Completed', count: Math.round(participants * 6.8), rate: 18.8 },
        { stage: 'Credit Earned', count: Math.round(participants * 6.2), rate: 17.2 },
        { stage: 'Pool Visit', count: Math.round(participants * 4.2), rate: 11.6 },
        { stage: 'Benefit View', count: Math.round(participants * 2.7), rate: 7.5 },
        { stage: 'Redemption', count: Math.round(participants * 1.7), rate: 4.7 },
        { stage: 'Repeat Transaction', count: Math.round(participants * 1.3), rate: 3.6 },
      ],
    };
  }

  public getExperienceAttribution(id: string) {
    const exp = this.getExperience(id);
    const relevantAttributions = this.attributions.filter((a) => a.experienceId === id);

    const totalAttributedRev =
      relevantAttributions.reduce((acc, curr) => acc + curr.attributedValue, 0) ||
      exp?.attributedRevenueUsd ||
      13650;

    return {
      experienceId: id,
      experienceName: exp?.name || 'Experience',
      partnerId: exp?.partnerId || 'org-saigon-fitness',
      totalAttributedValue: totalAttributedRev,
      attributedTransactionsCount: relevantAttributions.length || exp?.attributedTransactions || 390,
      effectiveCacUsd: exp?.cacUsd || 1.85,
      attributionModels: {
        firstTouchShare: '24%',
        lastTouchShare: '54%',
        linearShare: '22%',
      },
      recentConversions: relevantAttributions.slice(0, 5),
    };
  }

  public getNextBestExperience(userId: string): NextBestExperience[] {
    const balance = this.userBalances[userId] || 1440;

    return seedNextBestExperiences.map((nbe) => {
      if (nbe.reasonType === 'CREDIT_THRESHOLD') {
        return {
          ...nbe,
          contextualReason: `You have ${balance} Credits available to immediately unlock this signature perk...`,
        };
      }
      return nbe;
    });
  }

  public getUserExperienceHistory(userId: string) {
    const userSessions = this.sessions.filter((s) => s.userId === userId);
    const userEvents = this.events.filter((e) => e.userId === userId);
    const currentBalance = this.userBalances[userId] || 1440;

    return {
      userId,
      currentBalance,
      totalCreditsEarned: currentBalance + 1360,
      activeSessionsCount: userSessions.filter((s) => s.status === 'active').length,
      sessions: userSessions,
      events: userEvents,
      participatingPools: [
        { id: 'pool-fitness-wellness', name: 'Fitness & Wellness Weekend Pool', goal: 500, current: 200 },
        { id: 'pool-city-life', name: 'Saigon City Life & Culture Pool', goal: 250, current: 250 },
      ],
    };
  }

  // ==========================================================================
  // 5. GOVERNANCE & VALIDATION
  // ==========================================================================

  public validateExperience(id: string): {
    valid: boolean;
    checklist: Array<{ name: string; status: 'PASS' | 'WARN' | 'ERROR'; details: string }>;
  } {
    const exp = this.getExperience(id);
    if (!exp) {
      return {
        valid: false,
        checklist: [{ name: 'Experience Exists', status: 'ERROR', details: `Experience ID ${id} not found.` }],
      };
    }

    const jrn = exp.journeyId ? this.getJourney(exp.journeyId) : null;
    const nodes = jrn?.nodes || [];

    const hasTrigger = nodes.some((n) => n.type === 'ENTRY' || n.type === 'TRIGGER');
    const hasAudience = !!exp.audienceId && exp.audienceId.length > 0;
    const hasCreditRule = nodes.some((n) => n.type === 'CREDIT');
    const hasPool = !!exp.poolId;
    const hasBenefit = !!exp.primaryBenefitId;
    const hasGoal = !!exp.conversionGoal && exp.conversionGoal.length > 0;

    const checklist = [
      {
        name: 'Trigger & Entry Node Configured',
        status: (hasTrigger ? 'PASS' : 'ERROR') as 'PASS' | 'ERROR',
        details: hasTrigger ? 'Entry node detected in journey graph.' : 'Missing entry or trigger node.',
      },
      {
        name: 'Audience Segment Configured',
        status: (hasAudience ? 'PASS' : 'ERROR') as 'PASS' | 'ERROR',
        details: hasAudience
          ? `Target audience bound: ${exp.audienceId}`
          : 'Missing audience segmentation filter.',
      },
      {
        name: 'Credit Rule Ledger Binding',
        status: (hasCreditRule ? 'PASS' : 'ERROR') as 'PASS' | 'ERROR',
        details: hasCreditRule
          ? `Programmable credit rule ${exp.creditRuleId} configured with ledger verification.`
          : 'Missing CREDIT node in journey graph.',
      },
      {
        name: 'Destination Pool Availability',
        status: (hasPool ? 'PASS' : 'WARN') as 'PASS' | 'WARN',
        details: hasPool
          ? `Destination pool ${exp.poolId} active with 50,000 CRD capital headroom.`
          : 'No destination pool linked; demand will not aggregate.',
      },
      {
        name: 'Benefit Inventory Capacity Check',
        status: (hasBenefit ? 'PASS' : 'WARN') as 'PASS' | 'WARN',
        details: hasBenefit
          ? `Primary benefit ${exp.primaryBenefitId} checked (34 units remaining).`
          : 'No primary benefit attached.',
      },
      {
        name: 'Budget Solvency Verification',
        status: 'PASS' as const,
        details: 'Merchant campaign escrow balance solvent (>50,000 CRD headroom).',
      },
      {
        name: 'Eligibility Conflict Audit',
        status: 'PASS' as const,
        details: 'No conflicting tier or expiration policies identified.',
      },
      {
        name: 'Conversion Goal Defined',
        status: (hasGoal ? 'PASS' : 'ERROR') as 'PASS' | 'ERROR',
        details: hasGoal ? `Goal defined: ${exp.conversionGoal}` : 'Missing terminal conversion objective.',
      },
    ];

    const hasErrors = checklist.some((c) => c.status === 'ERROR');

    return {
      valid: !hasErrors,
      checklist,
    };
  }
}

// Export singleton instance
export const experienceBackendService = new ExperienceBackendService();
