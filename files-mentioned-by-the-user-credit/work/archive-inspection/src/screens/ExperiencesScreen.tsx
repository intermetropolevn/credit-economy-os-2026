import React, { useState } from 'react';
import { useEconomic } from '../context/EconomicContext';
import {
  Sparkles,
  Layers,
  Compass,
  ArrowRight,
  ArrowDown,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Target,
  Shield,
  Coins,
  ShoppingBag,
  TrendingUp,
  Award,
  BarChart3,
  Check,
  X,
  CreditCard,
  QrCode,
  Building2,
  Users,
  Clock,
  ExternalLink,
  ChevronRight,
  Flame,
  Zap,
  Terminal,
  Activity,
  FileCheck2,
  Filter,
  Plus,
  Search,
  Share2,
  Copy,
  ChevronDown,
  HelpCircle,
  Eye,
  SlidersHorizontal,
  BookmarkCheck,
  Star,
  Smartphone,
  Globe,
  Tag,
} from 'lucide-react';
import {
  Experience,
  JourneyNode,
  JourneyNodeType,
  ExperienceChannel,
  ExperienceStatus,
  ExperienceMarketplaceItem,
  NextBestExperience,
  TouchpointConfig,
} from '../types';
import {
  seedExperiences,
  seedExperienceMarketplace,
  seedNextBestExperiences,
  seedTouchpoints,
  seedExperienceFunnel,
  sampleSummerFitnessNodes,
} from '../data/experiencesSeedData';
import { mcpExperiencesService, EventProcessingReceipt } from '../services/mcpExperiencesService';
import { ExperienceJourneyBuilder } from '../components/ExperienceJourneyBuilder';

export const ExperiencesScreen: React.FC = () => {
  const { navigate, setSelectedPoolId, currentPath } = useEconomic();

  // Determine active tab from URL query or default to 'hub'
  const getInitialTab = () => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const tabParam = searchParams.get('tab');
      if (tabParam && ['hub', 'journeys', 'builder', 'marketplace', 'personalization', 'touchpoints', 'analytics'].includes(tabParam)) {
        return tabParam;
      }
      if (currentPath.includes('/journeys')) return 'journeys';
      if (currentPath.includes('/builder')) return 'builder';
      if (currentPath.includes('/marketplace')) return 'marketplace';
      if (currentPath.includes('/personalization')) return 'personalization';
      if (currentPath.includes('/touchpoints')) return 'touchpoints';
      if (currentPath.includes('/analytics')) return 'analytics';
    }
    return 'hub';
  };

  const [activeTab, setActiveTab] = useState<string>(getInitialTab);

  // Experience Data State
  const [experiences, setExperiences] = useState<Experience[]>(seedExperiences);
  const [selectedExperience, setSelectedExperience] = useState<Experience>(seedExperiences[0]);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Builder State
  const [builderExperience, setBuilderExperience] = useState<Experience>(seedExperiences[0]);
  const [selectedNodeId, setSelectedNodeId] = useState<string>(builderExperience.journey.nodes[0]?.id || 'node-trig-01');
  const [validationResult, setValidationResult] = useState<any>(null);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [publishSuccessMsg, setPublishSuccessMsg] = useState<string | null>(null);

  // Touchpoint Simulation State
  const [simulatedReceipt, setSimulatedReceipt] = useState<EventProcessingReceipt | null>(null);
  const [activeSimulatingId, setActiveSimulatingId] = useState<string | null>(null);

  // AI Dialog & Ask AI State
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [aiQuery, setAiQuery] = useState<string>('');
  const [aiAnswer, setAiAnswer] = useState<any>(null);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  // Create Experience Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [newExpTitle, setNewExpTitle] = useState<string>('');
  const [newExpPartner, setNewExpPartner] = useState<string>('Saigon Fitness Club');
  const [newExpObjective, setNewExpObjective] = useState<string>('');
  const [newExpType, setNewExpType] = useState<any>('Challenge');

  // Filter experiences
  const filteredExperiences = experiences.filter((exp) => {
    const matchesStatus =
      selectedStatusFilter === 'All' || exp.status.toLowerCase() === selectedStatusFilter.toLowerCase();
    const matchesSearch =
      searchQuery === '' ||
      exp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.partnerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  // Handle Ask AI
  const handleAskAi = (promptText: string) => {
    setAiQuery(promptText);
    setIsAiLoading(true);
    setIsAiModalOpen(true);

    setTimeout(() => {
      setIsAiLoading(false);
      if (promptText.includes('dropping')) {
        setAiAnswer({
          title: 'Funnel Friction Diagnosis',
          observation: '30.6% of users drop off at the 3-session quest threshold.',
          causes: [
            '14-day window is too short for casual gym-goers.',
            'Initial reward perception gap: 200 CRD feels distant from the 500 CRD Weekend Pass.',
          ],
          recommendation:
            'Introduce an interim 50 CRD milestone after Workout #1 and provide a 1-day extension window.',
          ctaLabel: 'Apply Journey Threshold Optimization',
        });
      } else if (promptText.includes('most demand')) {
        setAiAnswer({
          title: 'High-Demand Experience Identification',
          observation: 'Summer Fitness Challenge generates 172,000 CRD and drives 68.4% engagement.',
          causes: [
            'Strong co-branding with Nike Running Club.',
            'Instant utility perks in the Fitness & Wellness Weekend Pool.',
          ],
          recommendation:
            'Clone this experience model into a "Q4 Marathon Prep" campaign across 6 partner studios.',
          ctaLabel: 'Clone Experience Structure',
        });
      } else if (promptText.includes('low conversion')) {
        setAiAnswer({
          title: 'High-Engagement / Low-Conversion Bottleneck',
          observation: 'Sustainable Nomad Weekend Stays has 61.0% engagement but only 22.0% conversion.',
          causes: [
            '800 CRD requirement creates an aspiration barrier.',
            'Users stall before booking confirmation.',
          ],
          recommendation:
            'Add partial credit redemption (e.g. 300 CRD + $25 USD co-pay) to unlock immediate bookings.',
          ctaLabel: 'Configure Co-Pay Voucher Rule',
        });
      } else {
        setAiAnswer({
          title: 'Strategic Benefit Promotion',
          observation: 'ABC Coffee Cold Brew & Croissant (150 CRD) has the highest velocity turnover (74%).',
          causes: ['Instant gratification threshold below 200 CRD average user balance.'],
          recommendation:
            'Feature this perk as the primary "Instant Unlock" in all post-action completion screens.',
          ctaLabel: 'Promote in Experience Touchpoints',
        });
      }
    }, 450);
  };

  // Handle Touchpoint Event Simulation
  const handleSimulateTouchpoint = (touchpoint: TouchpointConfig) => {
    setActiveSimulatingId(touchpoint.id);
    setTimeout(() => {
      const receipt = mcpExperiencesService.track_experience_event({
        eventType: touchpoint.channel === 'Merchant POS' ? 'purchase_completed' : 'experience_started',
        experienceId: touchpoint.experienceId,
        userId: 'usr-sarah-chen',
        partnerId: 'org-saigon-fitness',
        touchpointId: touchpoint.id,
      });
      setSimulatedReceipt(receipt);
      setActiveSimulatingId(null);
    }, 500);
  };

  // Handle Journey Validation
  const handleValidateJourney = () => {
    const res = mcpExperiencesService.validate_journey(builderExperience.id);
    setValidationResult(res);
  };

  // Handle Publish Experience
  const handlePublishExperience = () => {
    setIsPublishing(true);
    setTimeout(() => {
      const res = mcpExperiencesService.publish_experience(builderExperience.id);
      setIsPublishing(false);
      setPublishSuccessMsg(res.message);
      // Update local state
      setExperiences((prev) =>
        prev.map((e) => (e.id === builderExperience.id ? { ...e, status: 'Active' } : e))
      );
      setBuilderExperience((prev) => ({ ...prev, status: 'Active' }));
    }, 400);
  };

  // Handle Create Experience
  const handleCreateNewExperience = () => {
    if (!newExpTitle.trim()) return;
    const created = mcpExperiencesService.create_experience({
      name: newExpTitle,
      partnerName: newExpPartner,
      objective: newExpObjective || 'Generate participant engagement and seed programmable credits.',
      type: newExpType,
      status: 'Draft',
    });
    setExperiences([created, ...experiences]);
    setBuilderExperience(created);
    setIsCreateModalOpen(false);
    setNewExpTitle('');
    setNewExpObjective('');
    setActiveTab('builder');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Experience-to-Economy Loop Banner */}
      <div className="bg-[#141824] border border-[#262a35] rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-[#262a35]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#1b1f2a] text-[#e4e1a9] border border-[#e4e1a9]/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>DIGITAL EXPERIENCE LAYER (DX)</span>
              </span>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                Loop Connected
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#dfe2f0]">
              Experiences
            </h1>
            <p className="text-xs sm:text-sm text-[#939183] max-w-3xl leading-relaxed">
              Orchestrate user journeys that generate meaningful participation, emit verified events, trigger programmable Credits, and aggregate demand toward Destination Pools.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start lg:self-auto">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#e4e1a9] hover:bg-[#d8d598] text-[#171b26] font-bold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Experience</span>
            </button>

            <button
              onClick={() => handleAskAi('Where are users dropping in our experiences?')}
              className="px-3.5 py-2 rounded-xl bg-[#171b26] hover:bg-[#1b1f2a] text-xs font-medium text-[#e4e1a9] border border-[#e4e1a9]/40 flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask AI</span>
            </button>
          </div>
        </div>

        {/* The Experience-to-Economy Loop Diagram */}
        <div className="pt-4 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-[#939183]">
            <span className="uppercase tracking-wider font-semibold text-[#c8c58f]">
              Autonomous Value Circuit (The Experience-to-Economy Loop):
            </span>
            <span className="text-[#e4e1a9] font-bold">Closed-Loop Demand Engine</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-1.5 text-center text-[10px] font-mono">
            {[
              { label: 'EXPERIENCE', sub: 'Interactive Context', color: 'text-[#dfe2f0]' },
              { label: 'ACTION', sub: 'Verified Event', color: 'text-emerald-400' },
              { label: 'VALUE', sub: 'Utility Rule', color: 'text-emerald-400' },
              { label: 'CREDITS', sub: 'Ledger Commit', color: 'text-[#e4e1a9]' },
              { label: 'DEMAND', sub: 'Intent Formation', color: 'text-[#c8c58f]' },
              { label: 'POOL', sub: 'Shared Capital', color: 'text-[#e4e1a9]' },
              { label: 'BENEFIT', sub: 'Perk Redemption', color: 'text-emerald-300' },
              { label: 'TRANSACTION', sub: 'Loop Re-entry', color: 'text-[#dfe2f0]' },
            ].map((node, i) => (
              <div
                key={node.label}
                className="p-2 rounded-lg bg-[#10141f] border border-[#262a35] hover:border-[#e4e1a9]/40 transition-all flex flex-col justify-center"
              >
                <div className={`font-bold ${node.color}`}>{node.label}</div>
                <div className="text-[8px] text-[#939183] mt-0.5">{node.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Primary Sub-Navigation Tabs */}
      <div className="flex items-center space-x-1 border-b border-[#262a35] pb-1 overflow-x-auto scrollbar-none">
        {[
          { id: 'hub', label: 'Experience Hub', icon: Layers, badge: `${experiences.length}` },
          { id: 'journeys', label: 'Journeys', icon: Compass },
          { id: 'builder', label: 'Experience Builder', icon: SlidersHorizontal, badge: 'CANVAS' },
          { id: 'marketplace', label: 'Experience Marketplace', icon: ShoppingBag, badge: `${seedExperienceMarketplace.length}` },
          { id: 'personalization', label: 'Personalization', icon: Sparkles, badge: 'NEXT BEST' },
          { id: 'touchpoints', label: 'Touchpoints', icon: QrCode, badge: `${seedTouchpoints.length}` },
          { id: 'analytics', label: 'Experience Analytics', icon: BarChart3 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#1b1f2a] text-[#e4e1a9] font-bold border-b-2 border-[#e4e1a9] shadow-sm'
                  : 'text-[#939183] hover:text-[#dfe2f0] hover:bg-[#141824]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold ${
                    isActive
                      ? 'bg-[#e4e1a9]/20 text-[#e4e1a9] border border-[#e4e1a9]/30'
                      : 'bg-[#10141f] text-[#939183] border border-[#262a35]'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ==================================================================== */}
      {/* 1. TAB: EXPERIENCE HUB                                               */}
      {/* ==================================================================== */}
      {activeTab === 'hub' && (
        <div className="space-y-6">
          {/* Executive Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-4 rounded-xl bg-[#141824] border border-[#262a35] space-y-1">
              <span className="text-[10px] font-mono text-[#939183] uppercase">Active Experiences</span>
              <div className="text-xl font-bold font-mono text-[#dfe2f0]">
                {experiences.filter((e) => e.status === 'Active').length}
              </div>
              <div className="text-[10px] text-emerald-400 font-mono">4 Live Across Channels</div>
            </div>

            <div className="p-4 rounded-xl bg-[#141824] border border-[#262a35] space-y-1">
              <span className="text-[10px] font-mono text-[#939183] uppercase">Total Participants</span>
              <div className="text-xl font-bold font-mono text-[#dfe2f0]">3,550</div>
              <div className="text-[10px] text-emerald-400 font-mono">+18% this month</div>
            </div>

            <div className="p-4 rounded-xl bg-[#141824] border border-[#262a35] space-y-1">
              <span className="text-[10px] font-mono text-[#939183] uppercase">Avg Engagement</span>
              <div className="text-xl font-bold font-mono text-[#e4e1a9]">68.4%</div>
              <div className="text-[10px] text-[#939183]">Action completion: 42.5%</div>
            </div>

            <div className="p-4 rounded-xl bg-[#141824] border border-[#262a35] space-y-1">
              <span className="text-[10px] font-mono text-[#939183] uppercase">Credits Generated</span>
              <div className="text-xl font-bold font-mono text-[#e4e1a9]">758,500</div>
              <div className="text-[10px] text-[#939183]">Minted by verified actions</div>
            </div>

            <div className="p-4 rounded-xl bg-[#141824] border border-[#262a35] space-y-1">
              <span className="text-[10px] font-mono text-[#939183] uppercase">Redemption Burn</span>
              <div className="text-xl font-bold font-mono text-emerald-400">67.9%</div>
              <div className="text-[10px] text-emerald-400 font-mono">515,000 CRD burned</div>
            </div>

            <div className="p-4 rounded-xl bg-[#141824] border border-[#262a35] space-y-1">
              <span className="text-[10px] font-mono text-[#939183] uppercase">Attributed Revenue</span>
              <div className="text-xl font-bold font-mono text-emerald-300">$58,885</div>
              <div className="text-[10px] text-[#939183]">1,400+ transactions</div>
            </div>
          </div>

          {/* Filters & Search Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#141824] p-3.5 rounded-xl border border-[#262a35]">
            <div className="flex items-center gap-2 flex-1 max-w-md bg-[#10141f] px-3 py-1.5 rounded-lg border border-[#262a35]">
              <Search className="w-3.5 h-3.5 text-[#939183]" />
              <input
                type="text"
                placeholder="Search experiences, partners, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-xs text-[#dfe2f0] focus:outline-none w-full"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-[#939183] hover:text-[#dfe2f0]">
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto">
              <span className="text-[10px] font-mono text-[#939183] uppercase mr-1">Status:</span>
              {['All', 'Active', 'Scheduled', 'Completed', 'Draft'].map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatusFilter(status)}
                  className={`px-2.5 py-1 rounded-md text-xs font-mono transition-colors cursor-pointer ${
                    selectedStatusFilter === status
                      ? 'bg-[#e4e1a9] text-[#171b26] font-bold'
                      : 'bg-[#10141f] text-[#939183] hover:text-[#dfe2f0] border border-[#262a35]'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Experiences Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredExperiences.map((exp) => {
              const statusColors = {
                Active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
                Scheduled: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
                Completed: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
                Draft: 'bg-neutral-500/10 text-neutral-400 border-neutral-500/30',
                Paused: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
                Archived: 'bg-neutral-500/10 text-neutral-400 border-neutral-500/30',
              };

              return (
                <div
                  key={exp.id}
                  className="bg-[#141824] border border-[#262a35] hover:border-[#e4e1a9]/50 rounded-2xl p-5 shadow-lg transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    {/* Header Row */}
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#10141f] text-[#c8c58f] border border-[#262a35]">
                        {exp.type}
                      </span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${statusColors[exp.status]}`}>
                        {exp.status}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-base text-[#dfe2f0] group-hover:text-[#e4e1a9] transition-colors leading-snug">
                        {exp.name}
                      </h3>
                      <p className="text-xs text-[#939183] mt-0.5 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{exp.partnerName}</span>
                      </p>
                    </div>

                    <p className="text-xs text-[#cac7b8] line-clamp-2 leading-relaxed">
                      {exp.objective}
                    </p>

                    {/* Audience Badge */}
                    <div className="text-[11px] text-[#939183] bg-[#10141f] p-2 rounded-lg border border-[#262a35]">
                      <span className="font-mono uppercase text-[9px] text-[#939183] block">Target Audience:</span>
                      <span className="text-[#dfe2f0] truncate block">{exp.audience}</span>
                    </div>

                    {/* Metrics Row */}
                    <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-center">
                      <div className="p-2 rounded bg-[#10141f] border border-[#262a35]">
                        <span className="text-[9px] text-[#939183] block">PARTICIPANTS</span>
                        <span className="text-xs font-bold text-[#dfe2f0]">{exp.participantsCount}</span>
                      </div>
                      <div className="p-2 rounded bg-[#10141f] border border-[#262a35]">
                        <span className="text-[9px] text-[#939183] block">ENGAGEMENT</span>
                        <span className="text-xs font-bold text-emerald-400">{exp.engagementRate}%</span>
                      </div>
                      <div className="p-2 rounded bg-[#10141f] border border-[#262a35]">
                        <span className="text-[9px] text-[#939183] block">CREDITS GEN</span>
                        <span className="text-xs font-bold text-[#e4e1a9]">
                          {exp.creditsGenerated > 1000 ? `${(exp.creditsGenerated / 1000).toFixed(0)}k` : exp.creditsGenerated}
                        </span>
                      </div>
                    </div>

                    {/* Channels & Tags */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {exp.channels.map((ch) => (
                        <span key={ch} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#1b1f2a] text-[#939183]">
                          {ch}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Footer */}
                  <div className="pt-3 border-t border-[#262a35] flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        setSelectedExperience(exp);
                        setActiveTab('journeys');
                      }}
                      className="text-xs font-mono text-[#e4e1a9] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Inspect Journey</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>

                    <button
                      onClick={() => {
                        setBuilderExperience(exp);
                        setActiveTab('builder');
                      }}
                      className="px-2.5 py-1 rounded bg-[#10141f] hover:bg-[#1b1f2a] text-xs font-medium text-[#dfe2f0] border border-[#262a35] cursor-pointer"
                    >
                      Open in Builder
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 2. TAB: JOURNEYS                                                     */}
      {/* ==================================================================== */}
      {activeTab === 'journeys' && (
        <div className="space-y-6">
          {/* Header & Selector */}
          <div className="bg-[#141824] p-5 rounded-2xl border border-[#262a35] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#e4e1a9] font-bold">
                EXPERIENCE-TO-ECONOMY JOURNEY MAPPER
              </span>
              <h3 className="text-lg font-bold text-[#dfe2f0] mt-0.5">
                {selectedExperience.name}
              </h3>
              <p className="text-xs text-[#939183]">
                Sequence of interactions, drop-off rates, and authoritative rule triggers along the path.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-[#939183]">Switch Experience:</span>
              <select
                value={selectedExperience.id}
                onChange={(e) => {
                  const found = experiences.find((x) => x.id === e.target.value);
                  if (found) setSelectedExperience(found);
                }}
                className="bg-[#10141f] text-xs text-[#dfe2f0] border border-[#262a35] px-3 py-1.5 rounded-lg focus:outline-none"
              >
                {experiences.map((exp) => (
                  <option key={exp.id} value={exp.id}>
                    {exp.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Stepper Node Sequence */}
          <div className="space-y-3">
            <div className="text-xs font-mono uppercase text-[#939183] tracking-wider">
              Configured Interaction Pipeline ({selectedExperience.journey.nodes.length} Stages):
            </div>

            <div className="space-y-3">
              {selectedExperience.journey.nodes.map((node, index) => {
                const nodeTypeColors: Record<JourneyNodeType, { badge: string; border: string }> = {
                  ENTRY: { badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30', border: 'border-purple-500/30' },
                  TRIGGER: { badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30', border: 'border-purple-500/30' },
                  EXPERIENCE: { badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30', border: 'border-blue-500/30' },
                  CONTENT: { badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30', border: 'border-blue-500/30' },
                  ACTION: { badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', border: 'border-emerald-500/30' },
                  VALUE: { badge: 'bg-teal-500/20 text-teal-300 border-teal-500/30', border: 'border-teal-500/30' },
                  CREDIT: { badge: 'bg-[#e4e1a9]/20 text-[#e4e1a9] border-[#e4e1a9]/40', border: 'border-[#e4e1a9]/40' },
                  POOL: { badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30', border: 'border-amber-500/30' },
                  BENEFIT: { badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30', border: 'border-cyan-500/30' },
                  CONVERSION: { badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30', border: 'border-rose-500/30' },
                  FOLLOW_UP: { badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30', border: 'border-indigo-500/30' },
                  'FOLLOW-UP': { badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30', border: 'border-indigo-500/30' },
                };

                const style = nodeTypeColors[node.type] || nodeTypeColors.ACTION;

                return (
                  <div key={node.id} className="relative">
                    <div className="bg-[#141824] border border-[#262a35] hover:border-[#e4e1a9]/40 rounded-xl p-4 shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      {/* Left: Step Info */}
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#10141f] border border-[#262a35] flex items-center justify-center font-mono text-xs font-bold text-[#e4e1a9] shrink-0 mt-0.5">
                          0{index + 1}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={`text-[9px] font-mono px-2 py-0.5 rounded border uppercase font-bold ${style.badge}`}>
                              {node.type} &bull; {node.subtype}
                            </span>
                            <span className="text-xs font-mono text-[#939183]">ID: {node.id}</span>
                          </div>
                          <h4 className="text-sm font-bold text-[#dfe2f0]">{node.title}</h4>
                          <p className="text-xs text-[#939183] max-w-xl">{node.description}</p>
                          {node.creditRewardAmount && (
                            <span className="inline-block text-[11px] font-mono font-bold text-[#e4e1a9] bg-[#1b1f2a] px-2 py-0.5 rounded border border-[#e4e1a9]/30">
                              Programmable Reward: +{node.creditRewardAmount} Credits
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right: Drop-off & Telemetry */}
                      {node.stats && (
                        <div className="flex items-center gap-4 text-xs font-mono shrink-0 bg-[#10141f] p-2.5 rounded-lg border border-[#262a35]">
                          <div>
                            <span className="text-[9px] text-[#939183] block">ENTERED</span>
                            <span className="font-bold text-[#dfe2f0]">{node.stats.entered}</span>
                          </div>
                          <div className="w-px h-6 bg-[#262a35]" />
                          <div>
                            <span className="text-[9px] text-[#939183] block">COMPLETED</span>
                            <span className="font-bold text-emerald-400">{node.stats.completed}</span>
                          </div>
                          <div className="w-px h-6 bg-[#262a35]" />
                          <div>
                            <span className="text-[9px] text-[#939183] block">DROPOFF</span>
                            <span className={`font-bold ${node.stats.dropoffRate > 25 ? 'text-rose-400' : 'text-[#939183]'}`}>
                              {node.stats.dropoffRate}%
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Connecting arrow if not last */}
                    {index < selectedExperience.journey.nodes.length - 1 && (
                      <div className="flex justify-center py-1">
                        <ArrowDown className="w-4 h-4 text-[#939183]" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 3. TAB: EXPERIENCE BUILDER                                           */}
      {/* ==================================================================== */}
      {activeTab === 'builder' && (
        <ExperienceJourneyBuilder
          experience={builderExperience}
          onUpdateExperience={(updatedExp) => {
            setBuilderExperience(updatedExp);
            setExperiences((prev) =>
              prev.map((e) => (e.id === updatedExp.id ? updatedExp : e))
            );
          }}
          onNavigatePool={(poolId) => {
            setSelectedPoolId(poolId);
            navigate(`/pools/${poolId}`);
          }}
        />
      )}

      {/* ==================================================================== */}
      {/* 4. TAB: EXPERIENCE MARKETPLACE                                       */}
      {/* ==================================================================== */}
      {activeTab === 'marketplace' && (
        <div className="space-y-6">
          <div className="bg-[#141824] p-5 rounded-2xl border border-[#262a35] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#e4e1a9] font-bold">
                EXPERIENCE &amp; DEMAND MARKETPLACE
              </span>
              <h3 className="text-lg font-bold text-[#dfe2f0] mt-0.5">
                Curated Community Experiences &amp; Collective Demand
              </h3>
              <p className="text-xs text-[#939183]">
                Not just standard goods: services, challenges, retreats, creator sessions, and partner destination unlocks.
              </p>
            </div>

            <button
              onClick={() => navigate('/wallet')}
              className="px-4 py-2 rounded-xl bg-[#1b1f2a] hover:bg-[#262a35] text-xs font-mono text-[#e4e1a9] border border-[#e4e1a9]/40 flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
            >
              <Coins className="w-3.5 h-3.5" />
              <span>Inspect in Credit Wallet</span>
            </button>
          </div>

          {/* Marketplace Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {seedExperienceMarketplace.map((item) => (
              <div
                key={item.id}
                className="bg-[#141824] border border-[#262a35] hover:border-[#e4e1a9]/50 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4 group transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#10141f] text-[#c8c58f] border border-[#262a35]">
                      {item.category}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
                      {item.availability}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-[#dfe2f0] group-hover:text-[#e4e1a9] transition-colors leading-snug">
                      {item.title}
                    </h4>
                    <p className="text-xs text-[#939183] mt-0.5">{item.partnerName}</p>
                  </div>

                  <p className="text-xs text-[#cac7b8] leading-relaxed">
                    {item.description}
                  </p>

                  <div className="p-2.5 rounded-xl bg-[#10141f] border border-[#262a35] space-y-1 text-[11px] font-mono">
                    <div className="flex justify-between">
                      <span className="text-[#939183]">CREDIT COST:</span>
                      <span className="font-bold text-[#e4e1a9]">{item.creditsRequired} CRD</span>
                    </div>
                    {item.creditsEarned && (
                      <div className="flex justify-between">
                        <span className="text-[#939183]">EARN REWARD:</span>
                        <span className="font-bold text-emerald-400">+{item.creditsEarned} CRD</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-[#939183]">DURATION:</span>
                      <span className="text-[#dfe2f0]">{item.estimatedDuration}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#262a35] flex items-center justify-between">
                  <span className="text-[11px] text-[#939183] truncate">{item.eligibility}</span>
                  <button
                    onClick={() => {
                      if (item.poolId) {
                        setSelectedPoolId(item.poolId);
                        navigate(`/pools/${item.poolId}`);
                      } else {
                        navigate('/wallet');
                      }
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-[#e4e1a9] hover:bg-[#d8d598] text-[#171b26] font-bold text-xs flex items-center gap-1 cursor-pointer transition-all shadow-sm"
                  >
                    <span>{item.ctaText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 5. TAB: PERSONALIZATION                                              */}
      {/* ==================================================================== */}
      {activeTab === 'personalization' && (
        <div className="space-y-6">
          <div className="bg-[#141824] p-5 rounded-2xl border border-[#262a35] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#e4e1a9] font-bold">
                LIGHTWEIGHT PERSONALIZATION LAYER
              </span>
              <h3 className="text-lg font-bold text-[#dfe2f0] mt-0.5">
                Next Best Experience (NBE) Engine
              </h3>
              <p className="text-xs text-[#939183]">
                Contextual, non-invasive recommendation cards powered by user activity, balance proximity, and destination pool eligibility.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-[#10141f] px-3 py-1.5 rounded-xl border border-[#262a35] text-xs font-mono">
              <span className="text-[#939183]">Context Patron:</span>
              <strong className="text-[#dfe2f0]">Sarah Chen (1,440 CRD)</strong>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {seedNextBestExperiences.map((nbe) => {
              const urgencyBadges = {
                HIGH: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
                MEDIUM: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
                OPPORTUNITY: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
              };

              return (
                <div
                  key={nbe.id}
                  className="bg-[#141824] border border-[#262a35] hover:border-[#e4e1a9]/50 rounded-2xl p-5 shadow-lg space-y-4 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-[#e4e1a9] uppercase font-bold flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-[#e4e1a9]" />
                        <span>NEXT BEST EXPERIENCE</span>
                      </span>
                      {nbe.urgency && (
                        <span className={`text-[9px] font-mono px-2 py-0.5 rounded border font-bold ${urgencyBadges[nbe.urgency]}`}>
                          {nbe.urgency} PROXIMITY
                        </span>
                      )}
                    </div>

                    {/* Contextual Reason */}
                    <div className="p-3 rounded-xl bg-[#10141f] border border-[#262a35] text-xs text-[#dfe2f0] italic leading-relaxed">
                      &ldquo;{nbe.contextualReason}&rdquo;
                    </div>

                    <div>
                      <h4 className="font-bold text-base text-[#dfe2f0]">{nbe.title}</h4>
                      <p className="text-xs text-[#939183] mt-0.5">{nbe.partnerName}</p>
                    </div>

                    {nbe.poolName && (
                      <div className="text-[11px] font-mono text-[#cac7b8] flex items-center gap-1.5">
                        <Compass className="w-3.5 h-3.5 text-[#e4e1a9]" />
                        <span>Associated Pool: <strong className="text-[#dfe2f0]">{nbe.poolName}</strong></span>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-[#262a35] flex items-center justify-between">
                    <span className="text-xs font-mono text-[#939183]">
                      {nbe.creditsDelta === 0 ? 'Unlocked & Ready' : `${nbe.creditsDelta} CRD threshold`}
                    </span>
                    <button
                      onClick={() => {
                        if (nbe.poolId) {
                          setSelectedPoolId(nbe.poolId);
                          navigate(`/pools/${nbe.poolId}`);
                        } else {
                          navigate('/wallet');
                        }
                      }}
                      className="px-4 py-2 rounded-xl bg-[#e4e1a9] hover:bg-[#d8d598] text-[#171b26] font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <span>{nbe.actionLabel}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 6. TAB: TOUCHPOINTS                                                  */}
      {/* ==================================================================== */}
      {activeTab === 'touchpoints' && (
        <div className="space-y-6">
          <div className="bg-[#141824] p-5 rounded-2xl border border-[#262a35] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#e4e1a9] font-bold">
                EXPERIENCE ENTRY POINTS &amp; INGESTION
              </span>
              <h3 className="text-lg font-bold text-[#dfe2f0] mt-0.5">
                Touchpoints &amp; QR Telemetry
              </h3>
              <p className="text-xs text-[#939183]">
                Channels through which consumers enter experiences: in-store QR displays, campaign URLs, social story stickers, NFC event totems, and POS terminals.
              </p>
            </div>
          </div>

          {/* Simulated Ingestion Receipt Toast */}
          {simulatedReceipt && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 space-y-1">
              <div className="flex items-center justify-between font-bold">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Authoritative Event Receipt #{simulatedReceipt.eventId}</span>
                </span>
                <button onClick={() => setSimulatedReceipt(null)} className="text-[#939183] hover:text-[#dfe2f0]">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <p>{simulatedReceipt.message}</p>
              <div className="font-mono text-[10px] text-emerald-400">
                Fraud Score: {simulatedReceipt.fraudRiskScore} &bull; Journal: {simulatedReceipt.ledgerJournalId || 'N/A'}
              </div>
            </div>
          )}

          {/* Touchpoints Table / List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {seedTouchpoints.map((tch) => (
              <div
                key={tch.id}
                className="bg-[#141824] border border-[#262a35] hover:border-[#e4e1a9]/50 rounded-2xl p-5 shadow-lg space-y-4 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#10141f] text-[#c8c58f] border border-[#262a35]">
                      {tch.channel}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 font-bold">
                      {tch.status}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-[#dfe2f0]">{tch.name}</h4>
                    <p className="text-xs text-[#939183] mt-0.5">{tch.partnerName}</p>
                  </div>

                  <div className="text-[11px] text-[#939183] bg-[#10141f] p-2.5 rounded-lg border border-[#262a35] space-y-1">
                    <div className="text-[9px] uppercase font-mono text-[#939183]">Placement Location:</div>
                    <div className="text-[#dfe2f0]">{tch.locationOrPlacement}</div>
                  </div>

                  {/* Telemetry Numbers */}
                  <div className="grid grid-cols-3 gap-2 text-center font-mono">
                    <div className="p-2 rounded bg-[#10141f] border border-[#262a35]">
                      <span className="text-[9px] text-[#939183] block">IMPRESSIONS</span>
                      <span className="text-xs font-bold text-[#dfe2f0]">{tch.totalImpressions}</span>
                    </div>
                    <div className="p-2 rounded bg-[#10141f] border border-[#262a35]">
                      <span className="text-[9px] text-[#939183] block">SCANS/CLICKS</span>
                      <span className="text-xs font-bold text-emerald-400">{tch.scansOrClicks}</span>
                    </div>
                    <div className="p-2 rounded bg-[#10141f] border border-[#262a35]">
                      <span className="text-[9px] text-[#939183] block">ACTIONS</span>
                      <span className="text-xs font-bold text-[#e4e1a9]">{tch.actionsTriggered}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#262a35] flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono text-[#939183] truncate">{tch.experienceName}</span>
                  <button
                    onClick={() => handleSimulateTouchpoint(tch)}
                    disabled={activeSimulatingId === tch.id}
                    className="px-3 py-1.5 rounded-lg bg-[#e4e1a9] hover:bg-[#d8d598] text-[#171b26] font-bold text-xs flex items-center gap-1 cursor-pointer transition-all shadow-sm shrink-0"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>{activeSimulatingId === tch.id ? 'Simulating...' : 'Simulate Scan'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 7. TAB: EXPERIENCE ANALYTICS                                         */}
      {/* ==================================================================== */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="bg-[#141824] p-5 rounded-2xl border border-[#262a35] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#e4e1a9] font-bold">
                EXPERIENCE-TO-ECONOMY LIFECYCLE FUNNEL
              </span>
              <h3 className="text-lg font-bold text-[#dfe2f0] mt-0.5">
                Full Attribution &amp; Conversion Velocity
              </h3>
              <p className="text-xs text-[#939183]">
                Traces users from initial touchpoint exposure through verified actions, credit issuance, destination pool exploration, and repeat transactions.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleAskAi('Where are users dropping in our experience funnel?')}
                className="px-3.5 py-2 rounded-xl bg-[#e4e1a9] hover:bg-[#d8d598] text-[#171b26] font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ask AI About Funnel</span>
              </button>
            </div>
          </div>

          {/* 11-Stage Visual Funnel Grid */}
          <div className="bg-[#10141f] p-5 rounded-2xl border border-[#262a35] space-y-4">
            <span className="text-xs font-mono uppercase text-[#939183] tracking-wider block">
              11-Stage Progression Circuit:
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-11 gap-1.5 text-center font-mono">
              {[
                { stage: '1. Impression', val: '45.2k', pct: '100%', color: 'text-[#dfe2f0]' },
                { stage: '2. Discovery', val: '28.4k', pct: '62.8%', color: 'text-[#dfe2f0]' },
                { stage: '3. Open', val: '18.9k', pct: '41.8%', color: 'text-[#dfe2f0]' },
                { stage: '4. Engagement', val: '12.6k', pct: '27.9%', color: 'text-emerald-400' },
                { stage: '5. Action', val: '8.45k', pct: '18.7%', color: 'text-emerald-400' },
                { stage: '6. Credit Earned', val: '7.80k', pct: '17.3%', color: 'text-[#e4e1a9]' },
                { stage: '7. Pool Visit', val: '5.24k', pct: '11.6%', color: 'text-[#e4e1a9]' },
                { stage: '8. Benefit View', val: '3.41k', pct: '7.5%', color: 'text-emerald-300' },
                { stage: '9. Redeem', val: '2.19k', pct: '4.8%', color: 'text-emerald-300' },
                { stage: '10. Transact', val: '1.68k', pct: '3.7%', color: 'text-[#dfe2f0]' },
                { stage: '11. Retention', val: '1.14k', pct: '2.5%', color: 'text-emerald-400' },
              ].map((item, i) => (
                <div key={item.stage} className="p-2.5 rounded-xl bg-[#141824] border border-[#262a35] flex flex-col justify-between">
                  <div>
                    <div className="text-[9px] text-[#939183] truncate">{item.stage}</div>
                    <div className={`text-sm font-bold mt-1 ${item.color}`}>{item.val}</div>
                  </div>
                  <div className="text-[9px] text-[#939183] mt-2 pt-1 border-t border-[#262a35]">{item.pct}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Diagnostic Prompts & Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#141824] p-5 rounded-2xl border border-[#262a35] space-y-3">
              <span className="text-[10px] font-mono uppercase text-[#e4e1a9] font-bold">
                DIAGNOSTIC QUERIES FOR AI
              </span>
              <div className="space-y-2">
                {[
                  'Where are users dropping?',
                  'Which Experience generates the most demand?',
                  'Which experience has high engagement but low conversion?',
                  'Which benefits should we promote?',
                ].map((q) => (
                  <button
                    key={q}
                    onClick={() => handleAskAi(q)}
                    className="w-full text-left p-3 rounded-xl bg-[#10141f] hover:bg-[#1b1f2a] border border-[#262a35] hover:border-[#e4e1a9]/50 text-xs text-[#dfe2f0] transition-colors flex items-center justify-between group cursor-pointer"
                  >
                    <span>&ldquo;{q}&rdquo;</span>
                    <Sparkles className="w-3.5 h-3.5 text-[#e4e1a9] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[#141824] p-5 rounded-2xl border border-[#262a35] space-y-3">
              <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold">
                EXPERIENCE-ATTRIBUTED ECONOMIC PERFORMANCE
              </span>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between p-2 rounded bg-[#10141f] border border-[#262a35]">
                  <span className="text-[#939183]">Attributed Commerce Revenue:</span>
                  <span className="font-bold text-emerald-300">$58,885 USD</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-[#10141f] border border-[#262a35]">
                  <span className="text-[#939183]">Effective Blended CAC:</span>
                  <span className="font-bold text-emerald-300">$1.85 / patron</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-[#10141f] border border-[#262a35]">
                  <span className="text-[#939183]">Credit Velocity Ratio:</span>
                  <span className="font-bold text-[#e4e1a9]">67.9% burn-to-mint</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-[#10141f] border border-[#262a35]">
                  <span className="text-[#939183]">Repeat Store Visit Lift:</span>
                  <span className="font-bold text-emerald-400">+24.6% vs single vouchers</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* ASK AI MODAL                                                         */}
      {/* ==================================================================== */}
      {isAiModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#141824] border border-[#e4e1a9]/50 rounded-2xl p-6 max-w-xl w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#262a35]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#e4e1a9]" />
                <h3 className="font-bold text-base text-[#dfe2f0]">Experience Intelligence AI</h3>
              </div>
              <button onClick={() => setIsAiModalOpen(false)} className="text-[#939183] hover:text-[#dfe2f0]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-[#10141f] border border-[#262a35] text-xs font-mono text-[#e4e1a9]">
              Query: &ldquo;{aiQuery}&rdquo;
            </div>

            {isAiLoading ? (
              <div className="py-8 text-center text-xs text-[#939183] space-y-2">
                <Sparkles className="w-6 h-6 text-[#e4e1a9] animate-spin mx-auto" />
                <p>Retrieving experience funnel telemetry and running MCP analysis actions...</p>
              </div>
            ) : aiAnswer ? (
              <div className="space-y-3 text-xs">
                <div className="p-4 rounded-xl bg-[#171b26] border border-[#262a35] space-y-2">
                  <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">
                    {aiAnswer.title}
                  </span>
                  <p className="font-bold text-[#dfe2f0]">{aiAnswer.observation}</p>
                  <ul className="space-y-1 text-[#939183] pl-4 list-disc">
                    {aiAnswer.causes.map((c: string, i: number) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-[#1b1f2a] border border-[#e4e1a9]/40 space-y-2">
                  <span className="text-[10px] font-mono text-[#e4e1a9] uppercase font-bold">
                    RECOMMENDED EXPERIMENT &bull; OPTIMIZATION
                  </span>
                  <p className="text-[#dfe2f0] leading-relaxed">{aiAnswer.recommendation}</p>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    onClick={() => setIsAiModalOpen(false)}
                    className="px-4 py-2 rounded-lg bg-[#10141f] text-[#939183] border border-[#262a35] cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      setIsAiModalOpen(false);
                      setActiveTab('builder');
                    }}
                    className="px-4 py-2 rounded-lg bg-[#e4e1a9] hover:bg-[#d8d598] text-[#171b26] font-bold cursor-pointer"
                  >
                    {aiAnswer.ctaLabel}
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* CREATE EXPERIENCE MODAL                                              */}
      {/* ==================================================================== */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#141824] border border-[#262a35] rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#262a35]">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#e4e1a9]" />
                <h3 className="font-bold text-base text-[#dfe2f0]">Create New Experience</h3>
              </div>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-[#939183] hover:text-[#dfe2f0]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] font-mono text-[#939183] uppercase block mb-1">Experience Name</label>
                <input
                  type="text"
                  placeholder="e.g., Autumn Coffee Roasting & Sensory Trail"
                  value={newExpTitle}
                  onChange={(e) => setNewExpTitle(e.target.value)}
                  className="w-full bg-[#10141f] border border-[#262a35] p-2.5 rounded-xl text-[#dfe2f0] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-[#939183] uppercase block mb-1">Host Partner</label>
                <select
                  value={newExpPartner}
                  onChange={(e) => setNewExpPartner(e.target.value)}
                  className="w-full bg-[#10141f] border border-[#262a35] p-2.5 rounded-xl text-[#dfe2f0] focus:outline-none"
                >
                  <option value="Saigon Fitness Club">Saigon Fitness Club</option>
                  <option value="ABC Coffee Roasters">ABC Coffee Roasters</option>
                  <option value="Nomad Stays">Nomad Stays &amp; EcoVibe</option>
                  <option value="Lotus Wellness Spa">Lotus Wellness Spa</option>
                  <option value="District Creative Collective">District Creative Collective</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-mono text-[#939183] uppercase block mb-1">Experience Type</label>
                <select
                  value={newExpType}
                  onChange={(e) => setNewExpType(e.target.value)}
                  className="w-full bg-[#10141f] border border-[#262a35] p-2.5 rounded-xl text-[#dfe2f0] focus:outline-none"
                >
                  <option value="Challenge">Challenge</option>
                  <option value="Brand Story">Brand Story</option>
                  <option value="Service Discovery">Service Discovery</option>
                  <option value="Community">Community</option>
                  <option value="Creator Showcase">Creator Showcase</option>
                  <option value="Omnichannel">Omnichannel</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-mono text-[#939183] uppercase block mb-1">Strategic Objective</label>
                <textarea
                  rows={2}
                  placeholder="What user behavior or participation will this experience motivate?"
                  value={newExpObjective}
                  onChange={(e) => setNewExpObjective(e.target.value)}
                  className="w-full bg-[#10141f] border border-[#262a35] p-2.5 rounded-xl text-[#dfe2f0] focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#10141f] text-[#939183] border border-[#262a35] cursor-pointer text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateNewExperience}
                disabled={!newExpTitle.trim()}
                className="px-5 py-2 rounded-xl bg-[#e4e1a9] hover:bg-[#d8d598] disabled:opacity-50 text-[#171b26] font-bold text-xs cursor-pointer shadow-md"
              >
                Create &amp; Open in Builder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
