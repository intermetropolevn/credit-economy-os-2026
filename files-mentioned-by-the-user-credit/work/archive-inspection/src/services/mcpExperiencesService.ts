/**
 * MCP EXPERIENCES SERVICE
 * Digital Experience Layer (DX) Interoperability & Agent Orchestration
 *
 * Implements the Experience-to-Economy Loop:
 * EXPERIENCE → ACTION → VALUE → CREDITS → DEMAND → POOL → BENEFIT → TRANSACTION → NEW EXPERIENCE
 *
 * Invariant: The Experience layer NEVER directly writes to the balance ledger.
 * It fires semantic events which are processed authoritatively by:
 * Event → Credit Rule Engine → Eligibility Check → Budget Check → Fraud Check → Ledger
 */

import {
  Experience,
  JourneyNode,
  ExperienceJourney,
  ExperienceEventType,
  NextBestExperience,
  ExperienceFunnelMetrics,
  TouchpointConfig,
} from '../types';
import {
  seedExperiences,
  seedNextBestExperiences,
  seedExperienceFunnel,
  seedTouchpoints,
} from '../data/experiencesSeedData';
import { experienceBackendService } from './experienceBackendService';

export interface ExperienceEventPayload {
  eventId?: string;
  eventType: ExperienceEventType;
  experienceId: string;
  userId: string;
  partnerId: string;
  touchpointId?: string;
  metadata?: Record<string, any>;
  timestamp?: string;
}

export interface EventProcessingReceipt {
  success: boolean;
  eventId: string;
  eventType: ExperienceEventType;
  userId: string;
  eligibilityPassed: boolean;
  creditRuleTriggered?: string;
  creditRewardAmount?: number;
  ledgerJournalId?: string;
  budgetRemaining?: number;
  fraudRiskScore: number;
  nextBestExperience?: NextBestExperience;
  message: string;
}

export class MCPExperiencesService {
  private experiences: Experience[] = [...seedExperiences];
  private nextBestExperiences: NextBestExperience[] = [...seedNextBestExperiences];
  private touchpoints: TouchpointConfig[] = [...seedTouchpoints];
  private funnelMetrics: ExperienceFunnelMetrics = { ...seedExperienceFunnel };
  private eventLog: ExperienceEventPayload[] = [];

  // --------------------------------------------------------------------------
  // 1. READ TOOLS
  // --------------------------------------------------------------------------

  public get_experiences(status?: string): Experience[] {
    if (!status || status === 'All') return this.experiences;
    return this.experiences.filter((e) => e.status.toLowerCase() === status.toLowerCase());
  }

  public get_experience(experienceId: string): Experience | undefined {
    return this.experiences.find((e) => e.id === experienceId);
  }

  public get_user_context(userId: string) {
    return {
      userId,
      affinityCategories: ['Fitness', 'Dining & Food', 'Wellness'],
      totalCreditsBalance: 1440,
      activeExperiencesCount: 2,
      completedQuestsCount: 4,
      lastInteraction: '2 hours ago at Saigon Fitness Club POS',
      unlockedPoolIds: ['pool-fitness-wellness', 'pool-city-life'],
      proximityGoals: [
        { poolName: 'Fitness & Wellness Weekend Pool', goal: 500, current: 200, needed: 300 },
        { poolName: 'Saigon City Life Pool', goal: 250, current: 250, needed: 0 },
      ],
    };
  }

  public get_next_best_experience(userId: string): NextBestExperience[] {
    return this.nextBestExperiences;
  }

  public get_experience_funnel(experienceId?: string): ExperienceFunnelMetrics {
    return this.funnelMetrics;
  }

  public get_conversion_attribution(experienceId?: string) {
    const target = experienceId ? this.get_experience(experienceId) : this.experiences[0];
    return {
      experienceId: target?.id || 'exp-all',
      name: target?.name || 'All Experiences',
      attributedRevenueUsd: target?.attributedRevenueUsd || 58885,
      attributedTransactions: target?.attributedTransactions || 1400,
      cacUsd: target?.cacUsd || 1.85,
      creditsGenerated: target?.creditsGenerated || 758500,
      creditsBurned: target?.creditsRedeemed || 515000,
      roiMultiplier: '4.8x verified demand generation',
      topChannels: [
        { channel: 'QR Counter Display', share: '38%' },
        { channel: 'Social Story Link', share: '32%' },
        { channel: 'Merchant POS', share: '18%' },
        { channel: 'Web Portal', share: '12%' },
      ],
    };
  }

  public get_touchpoints(experienceId?: string): TouchpointConfig[] {
    if (!experienceId) return this.touchpoints;
    return this.touchpoints.filter((t) => t.experienceId === experienceId);
  }

  // --------------------------------------------------------------------------
  // 2. WRITE & ORCHESTRATION TOOLS
  // --------------------------------------------------------------------------

  public create_experience(draft: Partial<Experience>): Experience {
    const newExp: Experience = {
      id: `exp-${Date.now()}`,
      name: draft.name || 'Untitled Experience',
      partnerId: draft.partnerId || 'org-saigon-fitness',
      partnerName: draft.partnerName || 'Saigon Fitness Club',
      objective: draft.objective || 'Engage patrons and seed programmable credits toward destination pools.',
      audience: draft.audience || 'Target Community',
      status: 'Draft',
      type: draft.type || 'Challenge',
      channels: draft.channels || ['QR', 'Web', 'Mobile App'],
      startDate: draft.startDate || new Date().toISOString().split('T')[0],
      participantsCount: 0,
      engagementRate: 0,
      completionRate: 0,
      creditsGenerated: 0,
      creditsRedeemed: 0,
      conversionRate: 0,
      attributedTransactions: 0,
      attributedRevenueUsd: 0,
      cacUsd: 0,
      tags: draft.tags || ['Community'],
      featuredBenefits: draft.featuredBenefits || [],
      journey: draft.journey || {
        id: `jrn-${Date.now()}`,
        name: `${draft.name || 'New'} Journey`,
        description: 'Auto-scaffolded 8-stage experience-to-economy loop',
        nodes: [
          {
            id: `node-${Date.now()}-1`,
            type: 'TRIGGER',
            title: 'Entry Point Scan / Link',
            subtitle: 'Trigger Node',
            description: 'User enters experience through configured touchpoint.',
            subtype: 'QR scan',
          },
          {
            id: `node-${Date.now()}-2`,
            type: 'ACTION',
            title: 'Complete First Action',
            subtitle: 'Milestone Quest',
            description: 'User completes verified merchant task or attendance.',
            subtype: 'Quest',
          },
          {
            id: `node-${Date.now()}-3`,
            type: 'CREDIT',
            title: 'Reward Credits',
            subtitle: 'Programmable Rule',
            description: 'Core engine validates criteria and credits user balance.',
            subtype: 'Earn Credits',
            creditRewardAmount: 200,
          },
          {
            id: `node-${Date.now()}-4`,
            type: 'POOL',
            title: 'Connect to Destination Pool',
            subtitle: 'Demand Aggregator',
            description: 'Directs newly earned credits toward shared merchant benefits.',
            subtype: 'Join Pool',
          },
        ],
      },
    };

    this.experiences.unshift(newExp);
    return newExp;
  }

  public publish_experience(experienceId: string): { success: boolean; message: string; experience?: Experience } {
    const exp = this.experiences.find((e) => e.id === experienceId);
    if (!exp) {
      return { success: false, message: `Experience ${experienceId} not found.` };
    }
    exp.status = 'Active';
    return {
      success: true,
      message: `Experience "${exp.name}" is now published and active across ${exp.channels.length} channels.`,
      experience: exp,
    };
  }

  public update_journey_node(experienceId: string, nodeId: string, patch: Partial<JourneyNode>): boolean {
    const exp = this.experiences.find((e) => e.id === experienceId);
    if (!exp) return false;
    const node = exp.journey.nodes.find((n) => n.id === nodeId);
    if (!node) return false;
    Object.assign(node, patch);
    return true;
  }

  public add_journey_node(experienceId: string, node: JourneyNode): boolean {
    const exp = this.experiences.find((e) => e.id === experienceId);
    if (!exp) return false;
    exp.journey.nodes.push(node);
    return true;
  }

  public validate_journey(experienceId: string): {
    valid: boolean;
    errors: string[];
    warnings: string[];
    loopIntegrity: boolean;
  } {
    const exp = this.experiences.find((e) => e.id === experienceId);
    if (!exp) return { valid: false, errors: ['Experience not found'], warnings: [], loopIntegrity: false };

    const nodes = exp.journey.nodes;
    const errors: string[] = [];
    const warnings: string[] = [];

    const hasTrigger = nodes.some((n) => n.type === 'TRIGGER');
    const hasAction = nodes.some((n) => n.type === 'ACTION');
    const hasCredit = nodes.some((n) => n.type === 'CREDIT');
    const hasPool = nodes.some((n) => n.type === 'POOL' || n.type === 'BENEFIT');

    if (!hasTrigger) errors.push('Missing entry TRIGGER node (QR scan, campaign entry, or web link).');
    if (!hasAction) errors.push('Missing ACTION node (Quest, Check-in, or verified Purchase).');
    if (!hasCredit) warnings.push('No CREDIT node defined; experience will not generate programmable tokens.');
    if (!hasPool) warnings.push('No POOL or BENEFIT node linked; credits generated may not aggregate into destination demand.');

    const loopIntegrity = hasTrigger && hasAction && hasCredit && hasPool;

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      loopIntegrity,
    };
  }

  // --------------------------------------------------------------------------
  // 3. SEMANTIC EVENT INGESTION & CREDIT ENGINE ROUTING
  // --------------------------------------------------------------------------

  public track_experience_event(payload: ExperienceEventPayload): EventProcessingReceipt {
    // Delegate through authoritative backend service
    const result = experienceBackendService.trackExperienceEvent({
      id: payload.eventId,
      experienceId: payload.experienceId,
      userId: payload.userId,
      eventType: payload.eventType,
      partnerId: payload.partnerId,
      metadata: payload.metadata,
      timestamp: payload.timestamp || new Date().toISOString(),
    });

    this.eventLog.push({ ...payload, eventId: result.event.id, timestamp: result.event.timestamp });

    return {
      success: result.success,
      eventId: result.event.id,
      eventType: result.event.eventType,
      userId: result.event.userId,
      eligibilityPassed: true,
      creditRuleTriggered: result.creditsIssued > 0 ? 'RUL-FIT-200' : undefined,
      creditRewardAmount: result.creditsIssued,
      ledgerJournalId: result.journalEntryId,
      budgetRemaining: 48600,
      fraudRiskScore: 0.04,
      nextBestExperience: result.nextBestExperience,
      message: result.message,
    };
  }

  public create_experiment(params: {
    experienceId: string;
    variantName: string;
    hypothesis: string;
    creditRewardAdjustmentPct: number;
  }): { success: boolean; experimentId: string; message: string } {
    const experimentId = `exp-test-${Date.now()}`;
    return {
      success: true,
      experimentId,
      message: `A/B Experiment "${params.variantName}" initialized for ${params.experienceId}. Traffic split: 50/50. Hypothesis: ${params.hypothesis}`,
    };
  }
}

export const mcpExperiencesService = new MCPExperiencesService();
