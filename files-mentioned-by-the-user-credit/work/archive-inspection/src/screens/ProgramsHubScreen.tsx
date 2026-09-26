import React, { useState } from 'react';
import { useEconomic } from '../context/EconomicContext';
import {
  Quest,
  Campaign,
  CreditProgram,
  CreditSampleTemplate,
  ApprovalRequest,
  ProgramSimulationInput,
  ProgramSimulationResult,
} from '../types';
import {
  Layers,
  Target,
  Award,
  Sparkles,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  ArrowRight,
  Shield,
  Clock,
  DollarSign,
  Plus,
  Eye,
  Filter,
  Search,
  BookOpen,
  FileCheck,
  Cpu,
  Building2,
  Users,
  Check,
  X,
  ChevronRight,
  Zap,
  BarChart3,
} from 'lucide-react';
import { AICampaignBuilderModal } from '../components/AICampaignBuilderModal';
import { CampaignAIIntelligence } from '../components/CampaignAIIntelligence';

export const ProgramsHubScreen: React.FC = () => {
  const {
    programs,
    quests,
    campaigns,
    creditSamples,
    approvalRequests,
    updateApprovalRequest,
    createQuest,
    createCampaign,
    simulateProgram,
    organizations,
    navigate,
    setSelectedOrganizationId,
    currentPath,
  } = useEconomic();

  const [activeTab, setActiveTab] = useState<
    'allPrograms' | 'quests' | 'campaigns' | 'campaignAnalytics' | 'samples' | 'approvals' | 'simulator' | 'mapping'
  >('allPrograms');

  React.useEffect(() => {
    if (currentPath.includes('tab=quests')) setActiveTab('quests');
    else if (currentPath.includes('tab=campaigns')) setActiveTab('campaigns');
    else if (currentPath.includes('tab=campaignAnalytics') || currentPath.includes('tab=analytics')) setActiveTab('campaignAnalytics');
    else if (currentPath.includes('tab=samples') || currentPath.includes('tab=templates')) setActiveTab('samples');
    else if (currentPath.includes('tab=approvals')) setActiveTab('approvals');
    else if (currentPath.includes('tab=simulator')) setActiveTab('simulator');
    else if (currentPath.includes('tab=mapping')) setActiveTab('mapping');
    else if (currentPath === '/programs') setActiveTab('allPrograms');
  }, [currentPath]);

  // Search & filter
  const [questSearch, setQuestSearch] = useState('');
  const [questFilterOwner, setQuestFilterOwner] = useState<string>('ALL');

  // Simulator State (Section 15)
  const [simInput, setSimInput] = useState<ProgramSimulationInput>({
    userType: 'Consumer',
    userSegment: 'Active Customer',
    purchases: 3,
    spend: 42,
    visits: 2,
    referrals: 1,
    previousCompletions: 2,
    currentCreditBalance: 1200,
    organizationId: 'org-abc-coffee',
    campaignId: 'cmp-abc-summer',
  });

  const [simResult, setSimResult] = useState<ProgramSimulationResult | null>(() =>
    simulateProgram({
      userType: 'Consumer',
      userSegment: 'Active Customer',
      purchases: 3,
      spend: 42,
      visits: 2,
      referrals: 1,
      previousCompletions: 2,
      currentCreditBalance: 1200,
      organizationId: 'org-abc-coffee',
      campaignId: 'cmp-abc-summer',
    })
  );

  // Use Template / Credit Sample Modal (Section 8: Use Template -> Customize -> Preview -> Save -> Publish)
  const [selectedSample, setSelectedSample] = useState<CreditSampleTemplate | null>(null);
  const [sampleTargetOrgId, setSampleTargetOrgId] = useState<string>('org-abc-coffee');
  const [customReward, setCustomReward] = useState<number>(100);
  const [customFrequency, setCustomFrequency] = useState<string>('Weekly');
  const [showSampleModal, setShowSampleModal] = useState(false);

  // AI Campaign Builder Modal State (MCP Layer)
  const [showAiCampaignBuilder, setShowAiCampaignBuilder] = useState(false);
  const [aiBuilderOrgId, setAiBuilderOrgId] = useState<string | undefined>(undefined);

  const handleRunSimulation = () => {
    const result = simulateProgram(simInput);
    setSimResult(result);
  };

  const handleUseTemplate = (sample: CreditSampleTemplate) => {
    setSelectedSample(sample);
    setCustomReward(sample.recommendedCredit);
    setCustomFrequency(sample.frequency);
    setShowSampleModal(true);
  };

  const handlePublishFromSample = () => {
    if (!selectedSample) return;
    const targetOrg = organizations.find((o) => o.id === sampleTargetOrgId);
    createQuest({
      name: selectedSample.sampleName,
      description: selectedSample.description,
      owner: targetOrg ? targetOrg.primaryContact.name : 'Admin',
      organizationId: sampleTargetOrgId,
      organizationName: targetOrg ? targetOrg.name : 'ABC Coffee',
      ownershipType: targetOrg?.type === 'Brand' ? 'BRAND' : 'VENDOR',
      trigger: selectedSample.trigger,
      condition: `Complies with ${selectedSample.industry} baseline specs`,
      creditReward: customReward,
      frequency: customFrequency as any,
      budget: 25000,
      status: 'Active',
      questType: 'Purchase',
    });
    setShowSampleModal(false);
    setSelectedSample(null);
    setActiveTab('quests');
  };

  const filteredQuests = quests.filter((q) => {
    const matchesSearch =
      q.name.toLowerCase().includes(questSearch.toLowerCase()) ||
      q.organizationName.toLowerCase().includes(questSearch.toLowerCase()) ||
      q.trigger.toLowerCase().includes(questSearch.toLowerCase());
    const matchesOwner = questFilterOwner === 'ALL' || q.ownershipType === questFilterOwner;
    return matchesSearch && matchesOwner;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#262a35]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-[#dfe2f0] flex items-center gap-2.5">
              <Layers className="w-6 h-6 text-[#e4e1a9]" />
              <span>Programs, Quests &amp; Campaigns</span>
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#1b1f2a] text-[#c8c58f] border border-[#262a35] font-mono">
              Ecosystem Control Plane
            </span>
          </div>
          <p className="text-xs text-[#939183] mt-1">
            Platform-wide loyalty programs, behavioral quests, marketing campaigns, and decision simulator.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setAiBuilderOrgId(undefined);
              setShowAiCampaignBuilder(true);
            }}
            className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#1b1f2a] to-[#141824] hover:bg-[#1b1f2a] text-[#e4e1a9] font-bold text-xs border border-[#e4e1a9]/50 flex items-center gap-1.5 cursor-pointer transition-all shadow-sm group hover:scale-[1.01]"
            title="Open AI Campaign Builder powered by MCP"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#e4e1a9] group-hover:scale-110 transition-transform" />
            <span>AI Campaign Builder</span>
          </button>
          <button
            onClick={() => {
              window.dispatchEvent(
                new CustomEvent('open-credit-economy-ai', {
                  detail: { query: 'Create a weekend campaign for inactive users.' },
                })
              );
            }}
            className="px-3 py-1.5 rounded-lg bg-[#141824] hover:bg-[#1b1f2a] text-[#dfe2f0] font-medium text-xs border border-[#262a35] flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
            title="Ask AI to configure campaigns and quests"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#e4e1a9]" />
            <span>AI Copilot</span>
          </button>
          <button
            onClick={() => setActiveTab('simulator')}
            className="px-3 py-1.5 rounded-lg bg-[#1b1f2a] hover:bg-[#262a35] text-[#dfe2f0] font-medium text-xs border border-[#262a35] flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Play className="w-3.5 h-3.5 text-[#e4e1a9]" />
            <span>Open Simulator</span>
          </button>
          <button
            onClick={() => setActiveTab('mapping')}
            className="px-3 py-1.5 rounded-lg bg-[#e4e1a9] hover:bg-[#d8d598] text-[#171b26] font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all shadow-sm"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Economy Mapping</span>
          </button>
        </div>
      </div>

      {/* Contextual MCP AI Suggestion Card */}
      <div className="p-3 rounded-xl bg-[#141824] border border-[#262a35] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#1b1f2a] border border-[#e4e1a9]/40 text-[#e4e1a9] flex items-center justify-center shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-[#e4e1a9]" />
          </div>
          <div>
            <span className="font-bold text-[#dfe2f0]">AI Orchestration Opportunity:</span>{' '}
            <span className="text-[#cac7b8]">
              1,420 inactive patrons detected with idle balance &gt; 1,000 CRD. Launching a 48-hour weekend streak quest is projected to drive 3.2x re-activation.
            </span>
          </div>
        </div>
        <button
          onClick={() => {
            window.dispatchEvent(
              new CustomEvent('open-credit-economy-ai', {
                detail: { query: 'Create a weekend campaign for inactive users.' },
              })
            );
          }}
          className="px-3 py-1 rounded-lg bg-[#e4e1a9]/10 hover:bg-[#e4e1a9]/20 text-[#e4e1a9] border border-[#e4e1a9]/40 font-semibold text-xs whitespace-nowrap cursor-pointer transition-colors shrink-0"
        >
          Draft Weekend Campaign &rarr;
        </button>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto text-xs bg-[#141824] p-1 rounded-xl border border-[#262a35]">
        {[
          { id: 'allPrograms', label: `All Programs (${programs.length})` },
          { id: 'quests', label: `Quests (${quests.length})` },
          { id: 'campaigns', label: `Campaigns (${campaigns.length})` },
          { id: 'campaignAnalytics', label: 'Campaign Analytics (MCP AI)' },
          { id: 'samples', label: `Credit Samples (${creditSamples.length})` },
          { id: 'approvals', label: `Approval Queue (${approvalRequests.filter((a) => a.status === 'PENDING').length})` },
          { id: 'simulator', label: 'Program Simulator' },
          { id: 'mapping', label: 'Program Mapping Engine' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap font-medium ${
              activeTab === tab.id
                ? 'bg-[#1b1f2a] text-[#e4e1a9] shadow-sm font-semibold'
                : 'text-[#939183] hover:text-[#dfe2f0]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ======================================================== */}
      {/* 1. ALL PROGRAMS                                         */}
      {/* ======================================================== */}
      {activeTab === 'allPrograms' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {programs.map((prog) => (
              <div
                key={prog.id}
                className="bg-[#141824] border border-[#262a35] rounded-xl p-5 space-y-3.5 text-xs shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1b1f2a] text-[#c8c58f] border border-[#262a35]">
                    {prog.ownershipType} · {prog.type}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                    {prog.status}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-[#dfe2f0]">{prog.name}</h3>
                  <div className="text-[11px] text-[#939183] mt-0.5">
                    By <strong>{prog.organizationName}</strong>
                  </div>
                </div>

                <p className="text-xs text-[#cac7b8] leading-relaxed line-clamp-2">
                  {prog.description}
                </p>

                <div className="p-3 rounded-lg bg-[#171b26] border border-[#262a35] grid grid-cols-3 gap-2 text-center font-mono">
                  <div>
                    <div className="text-[10px] text-[#939183] font-sans">Budget</div>
                    <div className="text-xs font-bold text-[#e4e1a9] mt-0.5">
                      {prog.budget.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#939183] font-sans">Issued</div>
                    <div className="text-xs font-bold text-[#dfe2f0] mt-0.5">
                      {prog.creditsIssued.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#939183] font-sans">Patrons</div>
                    <div className="text-xs font-bold text-emerald-400 mt-0.5">
                      {prog.participantsCount}
                    </div>
                  </div>
                </div>

                <div className="pt-1 flex items-center justify-between text-[11px]">
                  <span className="text-[#939183]">
                    {prog.questIds.length} Quests · {prog.campaignIds.length} Campaigns
                  </span>
                  <button
                    onClick={() => {
                      if (prog.organizationId && prog.organizationId !== 'org-platform') {
                        setSelectedOrganizationId(prog.organizationId);
                        navigate(`/organizations/${prog.organizationId}`);
                      }
                    }}
                    className="text-[#e4e1a9] hover:underline cursor-pointer flex items-center gap-1 font-medium"
                  >
                    <span>Inspect</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. QUESTS (Unified Quest Engine)                        */}
      {/* ======================================================== */}
      {activeTab === 'quests' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="relative w-full sm:w-80">
              <Search className="w-3.5 h-3.5 text-[#939183] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={questSearch}
                onChange={(e) => setQuestSearch(e.target.value)}
                placeholder="Search quests, triggers, conditions..."
                className="w-full bg-[#171b26] border border-[#262a35] rounded-lg pl-9 pr-3 py-2 text-xs text-[#dfe2f0] focus:outline-none focus:border-[#e4e1a9]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-[#939183]">Ownership:</span>
              <select
                value={questFilterOwner}
                onChange={(e) => setQuestFilterOwner(e.target.value)}
                className="bg-[#171b26] border border-[#262a35] rounded-lg px-2.5 py-1.5 text-xs text-[#dfe2f0] focus:outline-none focus:border-[#e4e1a9]"
              >
                <option value="ALL">All Ownerships</option>
                <option value="PLATFORM">PLATFORM</option>
                <option value="VENDOR">VENDOR</option>
                <option value="BRAND">BRAND</option>
                <option value="PARTNER">PARTNER</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredQuests.map((quest) => (
              <div
                key={quest.id}
                className="bg-[#141824] border border-[#262a35] rounded-xl p-5 space-y-3 text-xs flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${
                        quest.ownershipType === 'PLATFORM'
                          ? 'bg-[#1b1f2a] text-[#e4e1a9] border-[#e4e1a9]/40'
                          : quest.ownershipType === 'BRAND'
                          ? 'bg-blue-500/10 text-blue-300 border-blue-500/30'
                          : quest.ownershipType === 'PARTNER'
                          ? 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                          : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                      }`}
                    >
                      {quest.ownershipType}
                    </span>
                    <span className="font-mono text-emerald-400 font-bold text-sm">
                      +{quest.creditReward} CRD
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-[#dfe2f0]">{quest.name}</h4>
                    <div className="text-[11px] text-[#939183] mt-0.5">
                      {quest.organizationName} · {quest.questType}
                    </div>
                  </div>

                  <p className="text-[#cac7b8] text-xs line-clamp-2">{quest.description}</p>
                </div>

                <div className="space-y-2 pt-2 border-t border-[#262a35]">
                  <div className="p-2.5 rounded bg-[#171b26] border border-[#262a35] space-y-1 text-[11px] font-mono">
                    <div className="flex justify-between">
                      <span className="text-[#939183]">Trigger:</span>
                      <span className="text-[#dfe2f0]">{quest.trigger}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#939183]">Condition:</span>
                      <span className="text-[#c8c58f]">{quest.condition}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#939183]">Frequency:</span>
                      <span className="text-[#dfe2f0]">{quest.frequency}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[#939183]">
                    <span>{quest.participantsCount} participants</span>
                    <span className="text-emerald-400">{quest.completionsCount} finished</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. CAMPAIGNS                                             */}
      {/* ======================================================== */}
      {activeTab === 'campaigns' && (
        <div className="space-y-4">
          {/* AI-Assisted Campaign Creation Layer Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-gradient-to-r from-[#171b26] via-[#141824] to-[#171b26] border border-[#e4e1a9]/40 shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#1b1f2a] border border-[#e4e1a9]/40 text-[#e4e1a9] flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-[#e4e1a9]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-[#dfe2f0]">
                    AI-Assisted Campaign Creation Layer
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-[#0c1019] text-[#e4e1a9] border border-[#e4e1a9]/30">
                    MCP Protocol
                  </span>
                </div>
                <p className="text-xs text-[#939183] mt-0.5">
                  Describe a business objective in natural language to synthesize deterministic campaigns, rules &amp; pools.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setAiBuilderOrgId(undefined);
                setShowAiCampaignBuilder(true);
              }}
              className="px-4 py-2 rounded-lg bg-[#e4e1a9] hover:bg-[#d8d598] text-[#171b26] font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm shrink-0 cursor-pointer hover:scale-[1.01]"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Launch AI Campaign Builder</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {campaigns.map((cmp) => (
              <div
                key={cmp.id}
                className="bg-[#141824] border border-[#262a35] rounded-xl p-5 space-y-4 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#dfe2f0]">{cmp.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                      {cmp.status}
                    </span>
                  </div>
                  <span className="font-mono text-xs text-[#e4e1a9] font-bold">
                    Budget: {cmp.budget.toLocaleString()} CRD
                  </span>
                </div>

                <div className="text-[11px] text-[#939183]">
                  Host: <strong>{cmp.organizationName}</strong> · Timeline: {cmp.timeline}
                </div>

                <p className="text-[#cac7b8] text-xs">{cmp.description}</p>

                <div className="grid grid-cols-4 gap-2 text-center font-mono py-1">
                  <div className="p-2 rounded bg-[#171b26] border border-[#262a35]">
                    <div className="text-[10px] text-[#939183] font-sans">Participants</div>
                    <div className="text-xs font-bold text-[#dfe2f0] mt-0.5">{cmp.participants}</div>
                  </div>
                  <div className="p-2 rounded bg-[#171b26] border border-[#262a35]">
                    <div className="text-[10px] text-[#939183] font-sans">Completions</div>
                    <div className="text-xs font-bold text-emerald-400 mt-0.5">
                      {cmp.questCompletions}
                    </div>
                  </div>
                  <div className="p-2 rounded bg-[#171b26] border border-[#262a35]">
                    <div className="text-[10px] text-[#939183] font-sans">Conversion</div>
                    <div className="text-xs font-bold text-[#e4e1a9] mt-0.5">{cmp.conversionRate}%</div>
                  </div>
                  <div className="p-2 rounded bg-[#171b26] border border-[#262a35]">
                    <div className="text-[10px] text-[#939183] font-sans">Redeemed</div>
                    <div className="text-xs font-bold text-[#c8c58f] mt-0.5">{cmp.redemptionRate}%</div>
                  </div>
                </div>

                <div className="text-[11px] text-[#939183]">
                  <strong>Quests Included:</strong> {cmp.questIds.length} connected quests
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* CAMPAIGN ANALYTICS (MCP AI INTELLIGENCE LAYER)          */}
      {/* ======================================================== */}
      {activeTab === 'campaignAnalytics' && (
        <CampaignAIIntelligence
          onOpenCampaignBuilder={() => {
            setShowAiCampaignBuilder(true);
          }}
        />
      )}

      {/* ======================================================== */}
      {/* 4. CREDIT SAMPLES LIBRARY (Section 8)                   */}
      {/* ======================================================== */}
      {activeTab === 'samples' && (
        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#262a35]">
            <div>
              <h3 className="font-bold text-sm text-[#dfe2f0]">Credit Samples &amp; Templates Library</h3>
              <p className="text-xs text-[#939183] mt-0.5">
                Turnkey industry presets for F&amp;B, Retail, Fitness, Travel, Hospitality, and SaaS businesses.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {creditSamples.map((sample) => (
              <div
                key={sample.id}
                className="bg-[#141824] border border-[#262a35] rounded-xl p-5 space-y-3.5 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1b1f2a] text-[#c8c58f] border border-[#262a35]">
                      {sample.industry}
                    </span>
                    <span className="font-mono text-emerald-400 font-bold">
                      +{sample.recommendedCredit} CRD
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-[#dfe2f0]">{sample.sampleName}</h4>
                  <p className="text-xs text-[#cac7b8]">{sample.description}</p>
                </div>

                <div className="space-y-2 pt-2 border-t border-[#262a35]">
                  <div className="p-2.5 rounded bg-[#171b26] border border-[#262a35] space-y-1 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-[#939183]">Trigger:</span>
                      <span className="font-mono text-[#dfe2f0]">{sample.trigger}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#939183]">Est. Cost:</span>
                      <span className="font-mono text-[#e4e1a9]">{sample.estimatedCost}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#939183]">Goal:</span>
                      <span className="text-[#cac7b8] truncate max-w-[160px]">{sample.businessGoal}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleUseTemplate(sample)}
                    className="w-full py-2 px-3 rounded-lg bg-[#e4e1a9] hover:bg-[#d8d598] text-[#171b26] font-bold text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors shadow-sm"
                  >
                    <span>Use Template</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. APPROVAL QUEUE (Section 17)                           */}
      {/* ======================================================== */}
      {activeTab === 'approvals' && (
        <div className="bg-[#141824] border border-[#262a35] rounded-xl p-5 space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#262a35]">
            <div>
              <h3 className="font-bold text-sm text-[#dfe2f0]">
                Vendor Program Approval Queue ({approvalRequests.length})
              </h3>
              <p className="text-xs text-[#939183] mt-0.5">
                Risk officer review for vendor-proposed programs, quests, and budget allocations.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {approvalRequests.map((req) => (
              <div
                key={req.id}
                className="p-4 rounded-xl bg-[#171b26] border border-[#262a35] space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#262a35]">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#dfe2f0]">{req.programName}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1b1f2a] text-[#c8c58f] border border-[#262a35]">
                        {req.type}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                          req.riskLevel === 'LOW'
                            ? 'bg-emerald-500/15 text-emerald-300'
                            : 'bg-amber-500/15 text-amber-300'
                        }`}
                      >
                        {req.riskLevel} RISK
                      </span>
                    </div>
                    <div className="text-[11px] text-[#939183] mt-0.5">
                      Submitted by {req.createdBy} ({req.organizationName}) · {req.submittedDate}
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded text-xs font-semibold self-start sm:self-auto ${
                      req.status === 'APPROVED'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : req.status === 'REJECTED'
                        ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}
                  >
                    {req.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] bg-[#141824] p-3 rounded-lg border border-[#262a35]">
                  <div>
                    <div className="text-[#939183]">Budget &amp; Rules Summary:</div>
                    <div className="text-[#dfe2f0] mt-0.5 font-mono">
                      Cap: {req.creditBudget.toLocaleString()} CRD · {req.rulesSummary}
                    </div>
                    <div className="text-[#939183] mt-1">{req.notes}</div>
                  </div>

                  <div>
                    <div className="text-[#939183]">Audience &amp; Dependencies:</div>
                    <div className="text-[#dfe2f0] mt-0.5">{req.dependencies.audience}</div>
                    <div className="text-[#939183] text-[10px] mt-1">
                      Quests: {req.dependencies.quests?.join(', ') || 'N/A'}
                    </div>
                  </div>
                </div>

                {req.status === 'PENDING' && (
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      onClick={() => updateApprovalRequest(req.id, 'REJECTED', 'Exceeds standard risk ceiling')}
                      className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs font-medium border border-red-500/30 cursor-pointer"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => updateApprovalRequest(req.id, 'CHANGES_REQUESTED', 'Please clarify cap')}
                      className="px-3 py-1.5 rounded-lg bg-[#1b1f2a] hover:bg-[#262a35] text-[#dfe2f0] text-xs font-medium border border-[#262a35] cursor-pointer"
                    >
                      Request Changes
                    </button>
                    <button
                      onClick={() => updateApprovalRequest(req.id, 'APPROVED')}
                      className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs cursor-pointer shadow-sm flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve &amp; Activate</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 6. PROGRAM SIMULATOR (Section 15)                       */}
      {/* ======================================================== */}
      {activeTab === 'simulator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
          {/* Simulator Inputs Column */}
          <div className="lg:col-span-5 bg-[#141824] border border-[#262a35] rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#262a35]">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#e4e1a9]" />
                <h3 className="font-bold text-sm text-[#dfe2f0]">Simulation Inputs</h3>
              </div>
              <span className="text-[10px] font-mono text-[#939183]">TEST WORKBENCH</span>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[#cac7b8]">Target Organization</label>
                <select
                  value={simInput.organizationId}
                  onChange={(e) => setSimInput({ ...simInput, organizationId: e.target.value })}
                  className="w-full bg-[#171b26] border border-[#262a35] rounded-lg px-3 py-2 text-xs text-[#dfe2f0] focus:outline-none focus:border-[#e4e1a9]"
                >
                  {organizations.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.name} ({o.type})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[#cac7b8]">User Type</label>
                  <select
                    value={simInput.userType}
                    onChange={(e) => setSimInput({ ...simInput, userType: e.target.value as any })}
                    className="w-full bg-[#171b26] border border-[#262a35] rounded-lg px-3 py-2 text-xs text-[#dfe2f0] focus:outline-none focus:border-[#e4e1a9]"
                  >
                    <option value="Consumer">Consumer</option>
                    <option value="Business">Business</option>
                    <option value="VIP">VIP</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[#cac7b8]">User Segment</label>
                  <select
                    value={simInput.userSegment}
                    onChange={(e) => setSimInput({ ...simInput, userSegment: e.target.value as any })}
                    className="w-full bg-[#171b26] border border-[#262a35] rounded-lg px-3 py-2 text-xs text-[#dfe2f0] focus:outline-none focus:border-[#e4e1a9]"
                  >
                    <option value="New User">New User</option>
                    <option value="Active Customer">Active Customer</option>
                    <option value="High Value">High Value</option>
                    <option value="At Risk">At Risk</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="text-[#cac7b8]">Purchases</label>
                  <input
                    type="number"
                    value={simInput.purchases}
                    onChange={(e) => setSimInput({ ...simInput, purchases: Number(e.target.value) })}
                    min={0}
                    className="w-full bg-[#171b26] border border-[#262a35] rounded-lg px-2.5 py-1.5 font-mono text-xs text-[#dfe2f0] focus:outline-none focus:border-[#e4e1a9]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[#cac7b8]">Spend ($)</label>
                  <input
                    type="number"
                    value={simInput.spend}
                    onChange={(e) => setSimInput({ ...simInput, spend: Number(e.target.value) })}
                    min={0}
                    className="w-full bg-[#171b26] border border-[#262a35] rounded-lg px-2.5 py-1.5 font-mono text-xs text-[#dfe2f0] focus:outline-none focus:border-[#e4e1a9]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[#cac7b8]">Visits</label>
                  <input
                    type="number"
                    value={simInput.visits}
                    onChange={(e) => setSimInput({ ...simInput, visits: Number(e.target.value) })}
                    min={0}
                    className="w-full bg-[#171b26] border border-[#262a35] rounded-lg px-2.5 py-1.5 font-mono text-xs text-[#dfe2f0] focus:outline-none focus:border-[#e4e1a9]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[#cac7b8]">Referrals Completed</label>
                  <input
                    type="number"
                    value={simInput.referrals}
                    onChange={(e) => setSimInput({ ...simInput, referrals: Number(e.target.value) })}
                    min={0}
                    className="w-full bg-[#171b26] border border-[#262a35] rounded-lg px-2.5 py-1.5 font-mono text-xs text-[#dfe2f0] focus:outline-none focus:border-[#e4e1a9]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[#cac7b8]">Current Wallet Balance</label>
                  <input
                    type="number"
                    value={simInput.currentCreditBalance}
                    onChange={(e) =>
                      setSimInput({ ...simInput, currentCreditBalance: Number(e.target.value) })
                    }
                    min={0}
                    step={100}
                    className="w-full bg-[#171b26] border border-[#262a35] rounded-lg px-2.5 py-1.5 font-mono text-xs text-[#dfe2f0] focus:outline-none focus:border-[#e4e1a9]"
                  />
                </div>
              </div>

              <button
                onClick={handleRunSimulation}
                className="w-full py-2.5 px-4 rounded-lg bg-[#e4e1a9] hover:bg-[#d8d598] text-[#171b26] font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all hover:scale-[1.01]"
              >
                <Play className="w-4 h-4 fill-[#171b26]" />
                <span>Run Program Simulation</span>
              </button>
            </div>
          </div>

          {/* Simulator Results Column */}
          <div className="lg:col-span-7 bg-[#141824] border border-[#262a35] rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#262a35]">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-sm text-[#dfe2f0]">Simulation Outcome &amp; Ledger Impact</h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                CALCULATED
              </span>
            </div>

            {simResult && (
              <div className="space-y-4">
                {/* Metrics header */}
                <div className="grid grid-cols-3 gap-3 text-center font-mono">
                  <div className="p-3 rounded-lg bg-[#171b26] border border-[#262a35]">
                    <div className="text-[10px] text-[#939183] font-sans">Total Credits Earned</div>
                    <div className="text-xl font-bold text-emerald-400 mt-0.5">
                      +{simResult.creditsEarned} CRD
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-[#171b26] border border-[#262a35]">
                    <div className="text-[10px] text-[#939183] font-sans">Campaign Progress</div>
                    <div className="text-xl font-bold text-[#e4e1a9] mt-0.5">
                      {simResult.campaignProgressPct}%
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-[#171b26] border border-[#262a35]">
                    <div className="text-[10px] text-[#939183] font-sans">Remaining Budget</div>
                    <div className="text-xl font-bold text-[#dfe2f0] mt-0.5">
                      {simResult.budgetRemaining.toLocaleString()} CRD
                    </div>
                  </div>
                </div>

                {/* Credit Breakdown Table */}
                <div className="p-3.5 rounded-lg bg-[#171b26] border border-[#262a35] space-y-2">
                  <div className="font-bold text-xs text-[#dfe2f0]">Credit Disbursal Breakdown:</div>
                  <div className="space-y-1.5">
                    {simResult.creditBreakdown.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 rounded bg-[#141824] border border-[#262a35] text-[11px]"
                      >
                        <div>
                          <span className="font-semibold text-[#dfe2f0]">{item.source}</span>
                          <span className="text-[#939183] ml-2">({item.reason})</span>
                        </div>
                        <span className="font-mono text-emerald-400 font-bold">
                          +{item.amount} CRD
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quests Status Matrix */}
                <div className="p-3.5 rounded-lg bg-[#171b26] border border-[#262a35] space-y-2">
                  <div className="font-bold text-xs text-[#dfe2f0]">Quest Qualification Matrix:</div>
                  <div className="space-y-1.5">
                    {simResult.eligibleQuests.map((q) => (
                      <div
                        key={q.questId}
                        className="flex items-center justify-between p-2 rounded bg-[#141824] border border-[#262a35] text-[11px]"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              q.status === 'Completed'
                                ? 'bg-emerald-400'
                                : q.status === 'In Progress'
                                ? 'bg-amber-400'
                                : 'bg-[#939183]'
                            }`}
                          />
                          <span className="font-medium text-[#dfe2f0]">{q.questName}</span>
                        </div>

                        <div className="flex items-center gap-3 font-mono">
                          <span className="text-[10px] text-[#939183]">({q.status})</span>
                          <span className="text-[#e4e1a9]">+{q.creditsCanEarn} CRD</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Projected Cost & Reward Eligibility */}
                <div className="grid grid-cols-2 gap-3 text-[11px]">
                  <div className="p-3 rounded-lg bg-[#171b26] border border-[#262a35] space-y-1">
                    <div className="text-[#939183]">Projected Monthly Program Cost:</div>
                    <div className="font-mono text-sm font-bold text-[#e4e1a9]">
                      ~{simResult.projectedMonthlyCreditCost.toLocaleString()} CRD
                    </div>
                    <div className="text-[10px] text-[#939183]">
                      Based on cohort velocity benchmark (48 monthly users)
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-[#171b26] border border-[#262a35] space-y-1">
                    <div className="text-[#939183]">Unlocked Reward Pool Items:</div>
                    <div className="text-[#dfe2f0] font-medium truncate">
                      {simResult.rewardEligibility.slice(0, 2).join(', ') || 'No rewards yet'}
                    </div>
                    <div className="text-[10px] text-emerald-400">
                      {simResult.rewardEligibility.length} items eligible in wallet
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 7. PROGRAM MAPPING ENGINE (Section 13)                   */}
      {/* ======================================================== */}
      {activeTab === 'mapping' && (
        <div className="bg-[#141824] border border-[#262a35] rounded-xl p-6 space-y-6 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#262a35]">
            <div>
              <h3 className="font-bold text-sm text-[#dfe2f0]">
                Centralized Economy Mapping Engine
              </h3>
              <p className="text-xs text-[#939183] mt-0.5">
                Inspect every dependency: Business Action → Event Trigger → Quest → Campaign → Eligibility → Credit Rule → Ledger Transaction → Reward.
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1b1f2a] text-[#c8c58f] border border-[#262a35]">
              CONNECTED GRAPH
            </span>
          </div>

          {/* Visual Interactive Mapping Flow */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-3 text-center">
              {[
                { step: '1. Action', name: 'Purchase $20', desc: 'Customer buys 2 coffees at counter', color: 'border-blue-500/40 text-blue-300' },
                { step: '2. Event', name: 'purchase.completed', desc: 'POS webhook dispatch with receipt hash', color: 'border-cyan-500/40 text-cyan-300' },
                { step: '3. Quest', name: 'Buy 2 Specialty Coffees', desc: 'Validates 2/2 cup condition in week', color: 'border-emerald-500/40 text-emerald-300' },
                { step: '4. Campaign', name: 'Summer Coffee Fest', desc: 'Chains quest progress + milestone bonus', color: 'border-purple-500/40 text-purple-300' },
                { step: '5. Eligibility', name: 'Verified Patron', desc: 'Checks KYC & fraud limit constraints', color: 'border-yellow-500/40 text-yellow-300' },
                { step: '6. Credit Rule', name: '+100 CRD Disbursal', desc: 'Applies 1.2x merchant multiplier', color: 'border-[#e4e1a9]/60 text-[#e4e1a9]' },
                { step: '7. Ledger', name: 'Double-Entry Post', desc: 'Dr Liability Reserve / Cr User Balance', color: 'border-emerald-400 text-emerald-400' },
                { step: '8. Reward', name: 'Pour-Over Voucher', desc: 'Exchanged in Reward Pool catalog', color: 'border-amber-400 text-amber-300' },
              ].map((node, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl bg-[#171b26] border ${node.color} space-y-1.5 shadow-sm text-left`}
                >
                  <div className="text-[10px] font-mono uppercase opacity-75">{node.step}</div>
                  <div className="font-bold text-xs">{node.name}</div>
                  <div className="text-[10px] text-[#939183] leading-snug">{node.desc}</div>
                </div>
              ))}
            </div>

            {/* Dependency Inspector Table */}
            <div className="p-4 rounded-xl bg-[#171b26] border border-[#262a35] space-y-2">
              <h4 className="font-bold text-xs text-[#dfe2f0]">
                Dependency Traceability Matrix (Example: ABC Coffee Quest 02)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] pt-1">
                <div className="p-2.5 rounded bg-[#141824] border border-[#262a35] space-y-1">
                  <span className="text-[#939183]">Upstream Dependency:</span>
                  <div className="font-mono text-[#dfe2f0]">POS Terminal #412 · Receipt Checksum Valid</div>
                </div>
                <div className="p-2.5 rounded bg-[#141824] border border-[#262a35] space-y-1">
                  <span className="text-[#939183]">Downstream Ledger Commitment:</span>
                  <div className="font-mono text-emerald-400">Journal #10488: 2010.USER.4412 (+100 CRD)</div>
                </div>
                <div className="p-2.5 rounded bg-[#141824] border border-[#262a35] space-y-1">
                  <span className="text-[#939183]">Campaign Milestone Progress:</span>
                  <div className="font-mono text-[#e4e1a9]">Summer Coffee Fest: Quest 2 of 3 Completed</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Use Template & Customize (Section 8) */}
      {showSampleModal && selectedSample && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-[#141824] border border-[#262a35] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-fadeIn text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#262a35]">
              <div>
                <span className="text-[10px] font-mono text-[#c8c58f]">{selectedSample.industry} TEMPLATE</span>
                <h3 className="font-bold text-sm text-[#dfe2f0]">{selectedSample.sampleName}</h3>
              </div>
              <button onClick={() => setShowSampleModal(false)} className="text-[#939183] hover:text-[#dfe2f0]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[#cac7b8]">Assign to Organization</label>
                <select
                  value={sampleTargetOrgId}
                  onChange={(e) => setSampleTargetOrgId(e.target.value)}
                  className="w-full bg-[#171b26] border border-[#262a35] rounded-lg px-3 py-2 text-xs text-[#dfe2f0] focus:outline-none focus:border-[#e4e1a9]"
                >
                  {organizations.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.name} ({o.type})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[#cac7b8]">Credit Reward (CRD)</label>
                  <input
                    type="number"
                    value={customReward}
                    onChange={(e) => setCustomReward(Number(e.target.value))}
                    step={10}
                    className="w-full bg-[#171b26] border border-[#262a35] rounded-lg px-3 py-2 font-mono text-xs text-[#dfe2f0] focus:outline-none focus:border-[#e4e1a9]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[#cac7b8]">Frequency</label>
                  <select
                    value={customFrequency}
                    onChange={(e) => setCustomFrequency(e.target.value)}
                    className="w-full bg-[#171b26] border border-[#262a35] rounded-lg px-3 py-2 text-xs text-[#dfe2f0] focus:outline-none focus:border-[#e4e1a9]"
                  >
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Once">Once per user</option>
                    <option value="Unlimited">Unlimited</option>
                  </select>
                </div>
              </div>

              <div className="p-2.5 rounded bg-[#171b26] border border-[#262a35] text-[11px] text-[#939183] space-y-1">
                <div>
                  <strong>Trigger:</strong> {selectedSample.trigger}
                </div>
                <div>
                  <strong>Estimated Cost:</strong> {selectedSample.estimatedCost}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#262a35]">
              <button
                onClick={() => setShowSampleModal(false)}
                className="px-3 py-1.5 rounded-lg bg-[#1b1f2a] text-[#939183] text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handlePublishFromSample}
                className="px-4 py-1.5 rounded-lg bg-[#e4e1a9] text-[#171b26] font-bold text-xs cursor-pointer hover:bg-[#d8d598]"
              >
                Save &amp; Publish Quest
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Campaign Builder Modal (MCP Programmable Demand Layer) */}
      <AICampaignBuilderModal
        isOpen={showAiCampaignBuilder}
        onClose={() => setShowAiCampaignBuilder(false)}
        preselectedOrgId={aiBuilderOrgId}
      />
    </div>
  );
};
