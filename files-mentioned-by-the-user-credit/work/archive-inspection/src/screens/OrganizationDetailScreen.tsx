import React, { useState } from 'react';
import { useEconomic } from '../context/EconomicContext';
import {
  OrganizationRole,
  OrganizationStatus,
  Quest,
  Campaign,
  CreditProgram,
  OrganizationMember,
} from '../types';
import {
  Building2,
  Users,
  Layers,
  Target,
  Sparkles,
  TrendingUp,
  DollarSign,
  Plus,
  ArrowLeft,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Award,
  Zap,
  Gift,
  FileText,
  Sliders,
  BarChart3,
  Settings,
  Activity,
  ChevronRight,
  ExternalLink,
  Lock,
  Check,
  X,
  Store,
  UploadCloud,
  RotateCcw,
} from 'lucide-react';
import { AICampaignBuilderModal } from '../components/AICampaignBuilderModal';

export const OrganizationDetailScreen: React.FC = () => {
  const {
    organizations,
    selectedOrganizationId,
    setSelectedOrganizationId,
    navigate,
    updateOrganization,
    addOrganizationMember,
    removeOrganizationMember,
    updateOrganizationMemberRole,
    quests,
    createQuest,
    campaigns,
    createCampaign,
    programs,
    createProgram,
    rewardPools,
    auditLogs,
  } = useEconomic();

  const currentOrg =
    organizations.find((o) => o.id === selectedOrganizationId) || organizations[0];

  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'members'
    | 'programs'
    | 'quests'
    | 'campaigns'
    | 'creditEconomy'
    | 'rewards'
    | 'analytics'
    | 'settings'
    | 'auditLog'
  >('overview');

  // Modals state
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<OrganizationRole>('Member');

  const [showQuestModal, setShowQuestModal] = useState(false);
  const [newQuestName, setNewQuestName] = useState('');
  const [newQuestTrigger, setNewQuestTrigger] = useState('purchase.completed');
  const [newQuestCondition, setNewQuestCondition] = useState('Purchases >= 2');
  const [newQuestReward, setNewQuestReward] = useState<number>(100);
  const [newQuestFrequency, setNewQuestFrequency] = useState<'Weekly' | 'Daily' | 'Once'>('Weekly');
  const [newQuestBudget, setNewQuestBudget] = useState<number>(20000);

  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [newCampaignName, setNewCampaignName] = useState('');
  const [newCampaignTimeline, setNewCampaignTimeline] = useState('30 Days');
  const [newCampaignBudget, setNewCampaignBudget] = useState<number>(50000);
  const [showAiCampaignBuilder, setShowAiCampaignBuilder] = useState(false);

  const [showAdjustRulesModal, setShowAdjustRulesModal] = useState(false);
  const [customMultiplier, setCustomMultiplier] = useState<number>(
    currentOrg.customEarningMultiplier || 1.2
  );
  const [monthlyBudgetInput, setMonthlyBudgetInput] = useState<number>(currentOrg.monthlyBudget);

  // Filtered entities for this organization
  const orgQuests = quests.filter((q) => q.organizationId === currentOrg.id);
  const orgCampaigns = campaigns.filter((c) => c.organizationId === currentOrg.id);
  const orgPrograms = programs.filter((p) => p.organizationId === currentOrg.id);
  const orgRewards = rewardPools.filter((r) => r.organizationId === currentOrg.id);
  const orgAudits = auditLogs.filter(
    (a) =>
      a.objectId === currentOrg.id ||
      a.changesDiff?.some((d) => String(d.after).includes(currentOrg.name) || String(d.before).includes(currentOrg.name))
  );

  const handleAddMember = () => {
    if (!newMemberName || !newMemberEmail) return;
    addOrganizationMember(currentOrg.id, {
      userName: newMemberName,
      userEmail: newMemberEmail,
      role: newMemberRole,
      permissions:
        newMemberRole === 'Owner' || newMemberRole === 'Admin'
          ? ['ALL_PERMISSIONS']
          : newMemberRole === 'Campaign Manager'
          ? ['CREATE_CAMPAIGNS', 'VIEW_ANALYTICS']
          : newMemberRole === 'Program Manager'
          ? ['CREATE_QUESTS', 'CREATE_CAMPAIGNS']
          : ['VIEW_ANALYTICS'],
    });
    setNewMemberName('');
    setNewMemberEmail('');
    setShowMemberModal(false);
  };

  const handleCreateQuest = () => {
    if (!newQuestName) return;
    createQuest({
      name: newQuestName,
      organizationId: currentOrg.id,
      organizationName: currentOrg.name,
      ownershipType: currentOrg.type === 'Brand' ? 'BRAND' : 'VENDOR',
      trigger: newQuestTrigger,
      condition: newQuestCondition,
      creditReward: newQuestReward,
      frequency: newQuestFrequency,
      budget: newQuestBudget,
      status: 'Active',
      questType: 'Purchase',
    });
    setNewQuestName('');
    setShowQuestModal(false);
  };

  const handleCreateCampaign = () => {
    if (!newCampaignName) return;
    createCampaign({
      name: newCampaignName,
      organizationId: currentOrg.id,
      organizationName: currentOrg.name,
      ownershipType: currentOrg.type === 'Brand' ? 'BRAND' : 'VENDOR',
      timeline: newCampaignTimeline,
      budget: newCampaignBudget,
      questIds: orgQuests.map((q) => q.id),
      status: 'Active',
    });
    setNewCampaignName('');
    setShowCampaignModal(false);
  };

  const handleSaveCreditRules = () => {
    updateOrganization(currentOrg.id, {
      customEarningMultiplier: customMultiplier,
      monthlyBudget: monthlyBudgetInput,
    });
    setShowAdjustRulesModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#262a35]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/organizations')}
            className="p-1.5 rounded-lg hover:bg-[#1b1f2a] text-[#939183] hover:text-[#dfe2f0] transition-colors cursor-pointer"
            title="Back to organizations"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#939183]">
              <span onClick={() => navigate('/organizations')} className="hover:underline cursor-pointer">
                ORGANIZATIONS
              </span>
              <span>/</span>
              <span className="text-[#dfe2f0] font-bold">{currentOrg.id}</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-[#dfe2f0] flex items-center gap-2 mt-0.5">
              <span>{currentOrg.name}</span>
              <span className="text-xs px-2 py-0.5 rounded bg-[#1b1f2a] text-[#c8c58f] font-normal border border-[#262a35]">
                {currentOrg.type} · {currentOrg.industry}
              </span>
            </h1>
          </div>
        </div>

        {/* Quick Organization Switcher */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-mono bg-[#141824] p-1.5 rounded-xl border border-[#262a35]">
          <span className="text-[11px] text-[#939183] px-2 font-sans">Inspect Entity:</span>
          {organizations.map((o) => (
            <button
              key={o.id}
              onClick={() => setSelectedOrganizationId(o.id)}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                o.id === currentOrg.id
                  ? 'bg-[#e4e1a9] text-[#171b26] font-semibold'
                  : 'text-[#939183] hover:text-[#dfe2f0] hover:bg-[#1b1f2a]'
              }`}
            >
              {o.name}
            </button>
          ))}
        </div>
      </div>

      {/* Organization Header Workspace Card */}
      <div className="bg-[#141824] border border-[#262a35] rounded-xl p-5 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#262a35]">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#1b1f2a] border border-[#3b4152] flex items-center justify-center font-bold text-xl text-[#e4e1a9] shadow-md">
              {currentOrg.logoInitials}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-lg font-bold text-[#dfe2f0]">{currentOrg.name}</h2>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                    currentOrg.status === 'Active'
                      ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                      : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      currentOrg.status === 'Active' ? 'bg-emerald-400' : 'bg-amber-400'
                    }`}
                  />
                  {currentOrg.status}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#1b1f2a] text-[#c8c58f] border border-[#262a35]">
                  {currentOrg.plan} Plan
                </span>
              </div>
              <div className="text-xs text-[#939183] mt-1 flex items-center gap-3">
                <span>
                  Primary Contact: <strong>{currentOrg.primaryContact.name}</strong> (
                  {currentOrg.primaryContact.role})
                </span>
                <span>·</span>
                <span className="font-mono text-[#c8c58f]">{currentOrg.primaryContact.email}</span>
              </div>
            </div>
          </div>

          {/* Primary Quick Actions (Section 5) */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowAiCampaignBuilder(true)}
              className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#1b1f2a] to-[#141824] hover:bg-[#1b1f2a] text-[#e4e1a9] font-bold text-xs border border-[#e4e1a9]/50 flex items-center gap-1.5 cursor-pointer transition-all shadow-sm group hover:scale-[1.01]"
              title="AI Campaign Builder powered by MCP"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#e4e1a9] group-hover:scale-110 transition-transform" />
              <span>AI Campaign Builder</span>
            </button>

            <button
              onClick={() => setShowQuestModal(true)}
              className="px-3 py-1.5 rounded-lg bg-[#1b1f2a] hover:bg-[#262a35] text-[#dfe2f0] font-medium text-xs border border-[#262a35] flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Target className="w-3.5 h-3.5 text-emerald-400" />
              <span>Create Quest</span>
            </button>

            <button
              onClick={() => setShowCampaignModal(true)}
              className="px-3 py-1.5 rounded-lg bg-[#1b1f2a] hover:bg-[#262a35] text-[#dfe2f0] font-medium text-xs border border-[#262a35] flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Award className="w-3.5 h-3.5 text-[#e4e1a9]" />
              <span>Create Campaign</span>
            </button>

            <button
              onClick={() => setShowMemberModal(true)}
              className="px-3 py-1.5 rounded-lg bg-[#1b1f2a] hover:bg-[#262a35] text-[#dfe2f0] font-medium text-xs border border-[#262a35] flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Users className="w-3.5 h-3.5 text-[#c8c58f]" />
              <span>Add Member</span>
            </button>

            <button
              onClick={() => setShowAdjustRulesModal(true)}
              className="px-3 py-1.5 rounded-lg bg-[#e4e1a9] hover:bg-[#d8d598] text-[#171b26] font-semibold text-xs transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Adjust Credit Rules</span>
            </button>
          </div>
        </div>

        {/* Overview Metric Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 pt-1 text-center font-mono">
          <div className="p-2.5 rounded-lg bg-[#171b26] border border-[#262a35]">
            <div className="text-[10px] text-[#939183] font-sans">Members</div>
            <div className="text-base font-bold text-[#dfe2f0] mt-0.5">{currentOrg.membersCount}</div>
          </div>

          <div className="p-2.5 rounded-lg bg-[#171b26] border border-[#262a35]">
            <div className="text-[10px] text-[#939183] font-sans">Active Users</div>
            <div className="text-base font-bold text-[#dfe2f0] mt-0.5">840</div>
          </div>

          <div className="p-2.5 rounded-lg bg-[#171b26] border border-[#262a35]">
            <div className="text-[10px] text-[#939183] font-sans">Credits Issued</div>
            <div className="text-base font-bold text-[#e4e1a9] mt-0.5">
              {currentOrg.creditsIssued.toLocaleString()}
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-[#171b26] border border-[#262a35]">
            <div className="text-[10px] text-[#939183] font-sans">Credits Redeemed</div>
            <div className="text-base font-bold text-[#c8c58f] mt-0.5">
              {currentOrg.creditsRedeemed.toLocaleString()}
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-[#171b26] border border-[#262a35]">
            <div className="text-[10px] text-[#939183] font-sans">Outstanding Float</div>
            <div className="text-base font-bold text-[#feb26f] mt-0.5">
              {currentOrg.outstandingCredits.toLocaleString()}
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-[#171b26] border border-[#262a35]">
            <div className="text-[10px] text-[#939183] font-sans">Quest Completion</div>
            <div className="text-base font-bold text-emerald-400 mt-0.5">
              {currentOrg.questCompletionRate}%
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-[#171b26] border border-[#262a35]">
            <div className="text-[10px] text-[#939183] font-sans">Campaign Conv.</div>
            <div className="text-base font-bold text-[#dfe2f0] mt-0.5">
              {currentOrg.campaignConversion}%
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-[#171b26] border border-[#262a35]">
            <div className="text-[10px] text-[#939183] font-sans">Monthly Budget</div>
            <div className="text-base font-bold text-[#e4e1a9] mt-0.5">
              {currentOrg.monthlyBudget.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Workspace Tabs (Section 5: Overview, Members, Programs, Quests, Campaigns, Credit Economy, Rewards, Analytics, Settings, Audit Log) */}
      <div className="flex items-center gap-1 overflow-x-auto text-xs bg-[#141824] p-1 rounded-xl border border-[#262a35]">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'members', label: `Members (${currentOrg.members.length})` },
          { id: 'programs', label: `Programs (${orgPrograms.length})` },
          { id: 'quests', label: `Quests (${orgQuests.length})` },
          { id: 'campaigns', label: `Campaigns (${orgCampaigns.length})` },
          { id: 'creditEconomy', label: 'Credit Economy' },
          { id: 'rewards', label: `Reward Catalog (${orgRewards.length})` },
          { id: 'analytics', label: 'Analytics & Funnel' },
          { id: 'settings', label: 'Settings' },
          { id: 'auditLog', label: 'Audit Log' },
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
      {/* TAB 1: OVERVIEW                                         */}
      {/* ======================================================== */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Programs and Quests Snapshot */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-[#141824] border border-[#262a35] rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#262a35]">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-emerald-400" />
                  <h3 className="font-bold text-sm text-[#dfe2f0]">Active Quests &amp; Incentives</h3>
                </div>
                <button
                  onClick={() => setActiveTab('quests')}
                  className="text-xs text-[#e4e1a9] hover:underline cursor-pointer"
                >
                  View All ({orgQuests.length})
                </button>
              </div>

              <div className="space-y-3">
                {orgQuests.map((quest) => (
                  <div
                    key={quest.id}
                    className="p-3.5 rounded-xl bg-[#171b26] border border-[#262a35] flex items-center justify-between gap-4 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#dfe2f0]">{quest.name}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#1b1f2a] text-[#c8c58f] border border-[#262a35]">
                          {quest.ownershipType}
                        </span>
                        <span className="text-[10px] text-[#939183]">Trigger: {quest.trigger}</span>
                      </div>
                      <div className="text-[11px] text-[#939183]">{quest.description}</div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-mono text-emerald-400 font-bold">
                        +{quest.creditReward} CRD
                      </div>
                      <div className="text-[10px] text-[#939183] mt-0.5 font-mono">
                        {quest.completionsCount} completed
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Campaign Pipeline */}
            <div className="bg-[#141824] border border-[#262a35] rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#262a35]">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#e4e1a9]" />
                  <h3 className="font-bold text-sm text-[#dfe2f0]">Marketing Campaigns</h3>
                </div>
                <button
                  onClick={() => setActiveTab('campaigns')}
                  className="text-xs text-[#e4e1a9] hover:underline cursor-pointer"
                >
                  View Campaigns ({orgCampaigns.length})
                </button>
              </div>

              {orgCampaigns.map((cmp) => (
                <div
                  key={cmp.id}
                  className="p-4 rounded-xl bg-[#171b26] border border-[#262a35] space-y-3 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-sm text-[#dfe2f0]">{cmp.name}</span>
                      <div className="text-[11px] text-[#939183] mt-0.5">{cmp.description}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                      {cmp.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-2 py-1 text-center font-mono">
                    <div className="p-2 rounded bg-[#141824] border border-[#262a35]">
                      <div className="text-[10px] text-[#939183] font-sans">Participants</div>
                      <div className="font-bold text-[#dfe2f0] mt-0.5">{cmp.participants}</div>
                    </div>
                    <div className="p-2 rounded bg-[#141824] border border-[#262a35]">
                      <div className="text-[10px] text-[#939183] font-sans">Conversion</div>
                      <div className="font-bold text-emerald-400 mt-0.5">{cmp.conversionRate}%</div>
                    </div>
                    <div className="p-2 rounded bg-[#141824] border border-[#262a35]">
                      <div className="text-[10px] text-[#939183] font-sans">Issued</div>
                      <div className="font-bold text-[#e4e1a9] mt-0.5">
                        {cmp.creditsIssued.toLocaleString()} CRD
                      </div>
                    </div>
                    <div className="p-2 rounded bg-[#141824] border border-[#262a35]">
                      <div className="text-[10px] text-[#939183] font-sans">Redemption</div>
                      <div className="font-bold text-[#c8c58f] mt-0.5">{cmp.redemptionRate}%</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Credit Economy Constraints & Centralized Ledger Rule */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#141824] border border-[#262a35] rounded-xl p-5 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-[#262a35]">
                <Shield className="w-4 h-4 text-[#e4e1a9]" />
                <h3 className="font-bold text-sm text-[#dfe2f0]">Centralized Credit Authority</h3>
              </div>
              <p className="text-xs text-[#939183] leading-relaxed">
                Organizations customize incentives while operating under the platform's immutable double-entry ledger.
              </p>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-[#171b26] border border-[#262a35] flex justify-between">
                  <span className="text-[#939183]">Earning Multiplier:</span>
                  <span className="font-mono text-[#e4e1a9] font-bold">
                    {currentOrg.customEarningMultiplier}x
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#171b26] border border-[#262a35] flex justify-between">
                  <span className="text-[#939183]">Redemption Value:</span>
                  <span className="font-mono text-[#dfe2f0]">
                    100 CRD = ${currentOrg.redemptionRatePerCredit?.toFixed(2)} USD
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#171b26] border border-[#262a35] flex justify-between">
                  <span className="text-[#939183]">Monthly Issuance Budget:</span>
                  <span className="font-mono text-[#e4e1a9]">
                    {currentOrg.monthlyBudget.toLocaleString()} CRD
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#171b26] border border-[#262a35] flex justify-between">
                  <span className="text-[#939183]">Budget Utilization:</span>
                  <span className="font-mono text-emerald-400">
                    {Math.round((currentOrg.budgetUsed / currentOrg.monthlyBudget) * 100)}%
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setShowAdjustRulesModal(true)}
                  className="w-full py-2 px-3 rounded-lg bg-[#1b1f2a] hover:bg-[#262a35] text-xs font-semibold text-[#e4e1a9] border border-[#262a35] cursor-pointer transition-colors"
                >
                  Configure Centralized Rules
                </button>
              </div>
            </div>

            {/* Quick Member Roster */}
            <div className="bg-[#141824] border border-[#262a35] rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#262a35]">
                <h4 className="text-xs font-bold text-[#dfe2f0]">Organization Leaders</h4>
                <button
                  onClick={() => setShowMemberModal(true)}
                  className="text-[11px] text-[#e4e1a9] hover:underline cursor-pointer"
                >
                  + Add
                </button>
              </div>

              <div className="space-y-2">
                {currentOrg.members.slice(0, 4).map((member) => (
                  <div
                    key={member.id}
                    className="p-2 rounded-lg bg-[#171b26] border border-[#262a35] flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#1b1f2a] border border-[#3b4152] flex items-center justify-center font-bold text-[10px] text-[#e4e1a9]">
                        {member.avatarInitials}
                      </div>
                      <div>
                        <div className="font-semibold text-[#dfe2f0]">{member.userName}</div>
                        <div className="text-[10px] text-[#939183]">{member.role}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-[#c8c58f]">
                      {member.creditsEarned.toLocaleString()} CRD
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: MEMBERS & ROLES (Section 6)                      */}
      {/* ======================================================== */}
      {activeTab === 'members' && (
        <div className="bg-[#141824] border border-[#262a35] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#262a35]">
            <div>
              <h3 className="font-bold text-sm text-[#dfe2f0]">
                Organization Members &amp; Permissions
              </h3>
              <p className="text-xs text-[#939183] mt-0.5">
                Manage roles (Owner, Admin, Campaign Manager, Program Manager, Analyst, Member) and granular platform permissions.
              </p>
            </div>
            <button
              onClick={() => setShowMemberModal(true)}
              className="px-3.5 py-1.5 rounded-lg bg-[#e4e1a9] hover:bg-[#d8d598] text-[#171b26] font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Invite Member</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0f131d] text-[#939183] border-b border-[#262a35] uppercase font-mono text-[10px]">
                <tr>
                  <th className="py-3 px-4">Member / User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Permissions</th>
                  <th className="py-3 px-4">Joined</th>
                  <th className="py-3 px-4 text-right">Programs</th>
                  <th className="py-3 px-4 text-right">Credits Earned</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#262a35]/60">
                {currentOrg.members.map((member) => (
                  <tr key={member.id} className="hover:bg-[#171b26]/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#1b1f2a] border border-[#3b4152] flex items-center justify-center font-bold text-xs text-[#e4e1a9]">
                          {member.avatarInitials}
                        </div>
                        <div>
                          <div className="font-semibold text-[#dfe2f0]">{member.userName}</div>
                          <div className="text-[11px] text-[#939183] font-mono">{member.userEmail}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#1b1f2a] text-[#e4e1a9] border border-[#262a35]">
                        {member.role}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-[11px] text-[#939183]">
                      {member.permissions.join(', ')}
                    </td>

                    <td className="py-3.5 px-4 text-[#939183] font-mono">{member.joinedAt}</td>

                    <td className="py-3.5 px-4 text-right font-mono text-[#dfe2f0]">
                      {member.programsParticipated}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono text-[#e4e1a9] font-medium">
                      +{member.creditsEarned.toLocaleString()} CRD
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {member.role !== 'Owner' && (
                        <button
                          onClick={() => removeOrganizationMember(currentOrg.id, member.id)}
                          className="px-2 py-1 rounded bg-[#1b1f2a] hover:bg-red-500/20 text-red-300 border border-[#262a35] hover:border-red-500/40 text-[11px] cursor-pointer"
                        >
                          Remove
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: PROGRAMS                                          */}
      {/* ======================================================== */}
      {activeTab === 'programs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#262a35]">
            <div>
              <h3 className="font-bold text-sm text-[#dfe2f0]">Credit Loyalty Programs</h3>
              <p className="text-xs text-[#939183] mt-0.5">
                High-level business containers encompassing quests, campaigns, and audience rewards.
              </p>
            </div>
            <button
              onClick={() => {
                createProgram({
                  name: `${currentOrg.name} Seasonal Loyalty Tier`,
                  organizationId: currentOrg.id,
                  organizationName: currentOrg.name,
                  budget: 75000,
                  type: 'Loyalty',
                  status: 'Active',
                });
              }}
              className="px-3 py-1.5 rounded-lg bg-[#e4e1a9] hover:bg-[#d8d598] text-[#171b26] font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Program</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {orgPrograms.map((prog) => (
              <div
                key={prog.id}
                className="bg-[#141824] border border-[#262a35] rounded-xl p-5 space-y-3 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-[#dfe2f0]">{prog.name}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                    {prog.status}
                  </span>
                </div>
                <p className="text-[#939183] text-xs">{prog.description}</p>
                <div className="grid grid-cols-3 gap-2 py-2 text-center font-mono">
                  <div className="p-2 rounded bg-[#171b26] border border-[#262a35]">
                    <div className="text-[10px] text-[#939183] font-sans">Budget</div>
                    <div className="font-bold text-[#e4e1a9] mt-0.5">
                      {prog.budget.toLocaleString()} CRD
                    </div>
                  </div>
                  <div className="p-2 rounded bg-[#171b26] border border-[#262a35]">
                    <div className="text-[10px] text-[#939183] font-sans">Issued</div>
                    <div className="font-bold text-[#dfe2f0] mt-0.5">
                      {prog.creditsIssued.toLocaleString()} CRD
                    </div>
                  </div>
                  <div className="p-2 rounded bg-[#171b26] border border-[#262a35]">
                    <div className="text-[10px] text-[#939183] font-sans">Participants</div>
                    <div className="font-bold text-emerald-400 mt-0.5">{prog.participantsCount}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: QUESTS (Unified Quest Engine)                     */}
      {/* ======================================================== */}
      {activeTab === 'quests' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#262a35]">
            <div>
              <h3 className="font-bold text-sm text-[#dfe2f0]">
                Quest Engine ({orgQuests.length} Quests)
              </h3>
              <p className="text-xs text-[#939183] mt-0.5">
                Every quest executes within the platform's unified validation engine with cryptographic ledger accounting.
              </p>
            </div>
            <button
              onClick={() => setShowQuestModal(true)}
              className="px-3 py-1.5 rounded-lg bg-[#e4e1a9] hover:bg-[#d8d598] text-[#171b26] font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Quest</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {orgQuests.map((quest) => (
              <div
                key={quest.id}
                className="bg-[#141824] border border-[#262a35] rounded-xl p-5 space-y-3 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#dfe2f0]">{quest.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1b1f2a] text-[#c8c58f] border border-[#262a35]">
                      {quest.ownershipType}
                    </span>
                  </div>
                  <span className="font-mono text-emerald-400 font-bold text-sm">
                    +{quest.creditReward} CRD
                  </span>
                </div>

                <p className="text-xs text-[#cac7b8]">{quest.description}</p>

                <div className="p-3 rounded-lg bg-[#171b26] border border-[#262a35] space-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-[#939183]">Trigger Event:</span>
                    <span className="font-mono text-[#dfe2f0]">{quest.trigger}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#939183]">Condition:</span>
                    <span className="font-mono text-[#c8c58f]">{quest.condition}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#939183]">Frequency &amp; Cap:</span>
                    <span className="font-mono text-[#dfe2f0]">{quest.frequency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#939183]">Budget Allocation:</span>
                    <span className="font-mono text-[#e4e1a9]">
                      {quest.budgetUsed.toLocaleString()} / {quest.budget.toLocaleString()} CRD
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#939183] pt-1">
                  <span>{quest.participantsCount} participants</span>
                  <span>{quest.completionsCount} completions</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 5: CAMPAIGNS                                         */}
      {/* ======================================================== */}
      {activeTab === 'campaigns' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#262a35]">
            <div>
              <h3 className="font-bold text-sm text-[#dfe2f0]">
                Marketing Campaigns ({orgCampaigns.length})
              </h3>
              <p className="text-xs text-[#939183] mt-0.5">
                Time-bounded promotional programs chaining multiple quests with milestone completion bonuses.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAiCampaignBuilder(true)}
                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#1b1f2a] to-[#141824] hover:bg-[#1b1f2a] border border-[#e4e1a9]/50 text-xs font-bold text-[#e4e1a9] transition-all flex items-center gap-1.5 cursor-pointer shadow-sm group hover:scale-[1.01]"
                title="Synthesize programmable demand campaign with AI"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#e4e1a9] group-hover:scale-110 transition-transform" />
                <span>AI Campaign Builder</span>
              </button>
              <button
                onClick={() => setShowCampaignModal(true)}
                className="px-3 py-1.5 rounded-lg bg-[#e4e1a9] hover:bg-[#d8d598] text-[#171b26] font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Campaign</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {orgCampaigns.map((cmp) => (
              <div
                key={cmp.id}
                className="bg-[#141824] border border-[#262a35] rounded-xl p-5 space-y-4 text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#262a35]">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#dfe2f0]">{cmp.name}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                        {cmp.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#939183] mt-0.5">{cmp.timeline}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-xs text-[#e4e1a9] font-bold">
                      Budget: {cmp.budget.toLocaleString()} CRD
                    </div>
                    <div className="text-[10px] text-[#939183]">ROI: {cmp.roiMetric}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono">
                  <div className="p-3 rounded-lg bg-[#171b26] border border-[#262a35]">
                    <div className="text-[10px] text-[#939183] font-sans">Active Patrons</div>
                    <div className="text-sm font-bold text-[#dfe2f0] mt-0.5">{cmp.participants}</div>
                  </div>
                  <div className="p-3 rounded-lg bg-[#171b26] border border-[#262a35]">
                    <div className="text-[10px] text-[#939183] font-sans">Quests Completed</div>
                    <div className="text-sm font-bold text-emerald-400 mt-0.5">
                      {cmp.questCompletions}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-[#171b26] border border-[#262a35]">
                    <div className="text-[10px] text-[#939183] font-sans">Conversion Rate</div>
                    <div className="text-sm font-bold text-[#e4e1a9] mt-0.5">{cmp.conversionRate}%</div>
                  </div>
                  <div className="p-3 rounded-lg bg-[#171b26] border border-[#262a35]">
                    <div className="text-[10px] text-[#939183] font-sans">Redemption Rate</div>
                    <div className="text-sm font-bold text-[#c8c58f] mt-0.5">{cmp.redemptionRate}%</div>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[#171b26] border border-[#262a35] space-y-1 text-[11px] text-[#cac7b8]">
                  <div>
                    <strong className="text-[#dfe2f0]">Credit Strategy:</strong> {cmp.creditStrategy}
                  </div>
                  <div>
                    <strong className="text-[#dfe2f0]">Reward Incentive:</strong> {cmp.rewardStrategy}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 6: CREDIT ECONOMY (Centralized Control & Rules)     */}
      {/* ======================================================== */}
      {activeTab === 'creditEconomy' && (
        <div className="bg-[#141824] border border-[#262a35] rounded-xl p-5 space-y-5 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#262a35]">
            <div>
              <h3 className="font-bold text-sm text-[#dfe2f0]">
                Centralized Credit Economy &amp; Ledger Integration
              </h3>
              <p className="text-xs text-[#939183] mt-0.5">
                Hierarchical model: Platform Global Invariants → Organization Parameters → Quest Rules → Centralized Ledger.
              </p>
            </div>
            <button
              onClick={() => setShowAdjustRulesModal(true)}
              className="px-3 py-1.5 rounded-lg bg-[#e4e1a9] text-[#171b26] font-bold text-xs cursor-pointer hover:bg-[#d8d598]"
            >
              Modify Constraints
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#171b26] border border-[#262a35] space-y-3">
              <div className="flex items-center gap-2 font-bold text-sm text-[#dfe2f0]">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>Centralized Invariants (Platform Enforced)</span>
              </div>
              <ul className="space-y-2 text-[#cac7b8]">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Double-entry balance check: Total Credits Disbursed = Liability Reserve.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Cryptographic hash verification for all POS receipt &amp; review triggers.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Dual-sign approval required for budget expansions exceeding 200,000 CRD.</span>
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-[#171b26] border border-[#262a35] space-y-3">
              <div className="flex items-center gap-2 font-bold text-sm text-[#dfe2f0]">
                <Sliders className="w-4 h-4 text-[#e4e1a9]" />
                <span>Organization Configurable Parameters</span>
              </div>
              <ul className="space-y-2 text-[#cac7b8]">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#e4e1a9] shrink-0 mt-0.5" />
                  <span>Custom Earning Multiplier: {currentOrg.customEarningMultiplier}x standard rate.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#e4e1a9] shrink-0 mt-0.5" />
                  <span>Monthly Issuance Cap: {currentOrg.monthlyBudget.toLocaleString()} CRD.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#e4e1a9] shrink-0 mt-0.5" />
                  <span>Redemption Exchange Rate: 100 CRD = ${currentOrg.redemptionRatePerCredit?.toFixed(2)} USD.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 7: REWARD CATALOG & POOL                             */}
      {/* ======================================================== */}
      {activeTab === 'rewards' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#262a35]">
            <div>
              <h3 className="font-bold text-sm text-[#dfe2f0]">
                Reward Catalog &amp; Pools ({orgRewards.length} Items)
              </h3>
              <p className="text-xs text-[#939183] mt-0.5">
                Benefits and products that consumers can redeem using earned ecosystem credits.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {orgRewards.map((reward) => (
              <div
                key={reward.id}
                className="bg-[#141824] border border-[#262a35] rounded-xl p-5 space-y-3 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Gift className="w-4 h-4 text-[#c8c58f]" />
                    <span className="font-bold text-sm text-[#dfe2f0]">{reward.name}</span>
                  </div>
                  <span className="font-mono text-sm font-bold text-[#e4e1a9]">
                    {reward.creditsCost.toLocaleString()} CRD
                  </span>
                </div>

                <p className="text-xs text-[#939183]">{reward.description}</p>

                <div className="p-3 rounded-lg bg-[#171b26] border border-[#262a35] flex items-center justify-between text-[11px] font-mono">
                  <span className="text-[#939183]">Remaining Inventory: {reward.remainingInventory}</span>
                  <span className="text-emerald-400 font-semibold">{reward.totalRedeemed} Redeemed</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 8: ANALYTICS & FUNNEL                                */}
      {/* ======================================================== */}
      {activeTab === 'analytics' && (
        <div className="space-y-6 text-xs">
          <div className="bg-[#141824] border border-[#262a35] rounded-xl p-5 space-y-4">
            <h3 className="font-bold text-sm text-[#dfe2f0]">
              End-to-End Loyalty Funnel Conversion
            </h3>

            {/* Funnel Stepper */}
            <div className="space-y-2">
              {[
                { stage: 'Audience Reach', count: 2400, pct: 100, drop: '0%' },
                { stage: 'Eligible Patrons', count: 1850, pct: 77, drop: '-23%' },
                { stage: 'Quest Started', count: 1240, pct: 51, drop: '-26%' },
                { stage: 'Quest Completed', count: 840, pct: 35, drop: '-16%' },
                { stage: 'Earned Credits', count: 840, pct: 35, drop: '0%' },
                { stage: 'Redeemed Rewards', count: 540, pct: 22, drop: '-13%' },
              ].map((step, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-[#171b26] border border-[#262a35] space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#1b1f2a] text-[#c8c58f] font-mono text-[10px] flex items-center justify-center font-bold">
                        {idx + 1}
                      </span>
                      <span className="font-semibold text-[#dfe2f0]">{step.stage}</span>
                    </div>
                    <div className="font-mono flex items-center gap-3">
                      <span className="text-[#e4e1a9] font-bold">{step.count.toLocaleString()}</span>
                      <span className="text-[#939183] text-[10px]">({step.pct}%)</span>
                      <span className="text-amber-400 text-[10px]">{step.drop}</span>
                    </div>
                  </div>
                  <div className="w-full bg-[#141824] rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-[#e4e1a9] h-full rounded-full transition-all duration-500"
                      style={{ width: `${step.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* AI Recommendation Panel (Section 19) */}
            <div className="p-4 rounded-xl bg-[#171b26] border border-[#3b4152] space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-[#e4e1a9]">
                <Sparkles className="w-4 h-4 text-[#c8c58f]" />
                <span>AI Intelligence &amp; Optimization Advisory</span>
              </div>
              <p className="text-[#dfe2f0] leading-relaxed">
                "42% of eligible patrons drop off before completing the second specialty coffee purchase. Consider reducing the requirement from 2 coffees to 1 for new joiners, or disburse an intermediate 30 CRD reward to sustain momentum."
              </p>
              <div className="text-[11px] text-[#939183] font-mono pt-1 border-t border-[#262a35]">
                Confidence: High · Potential impact: +18% 30-day retention
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 9: SETTINGS                                          */}
      {/* ======================================================== */}
      {activeTab === 'settings' && (
        <div className="bg-[#141824] border border-[#262a35] rounded-xl p-5 space-y-4 text-xs">
          <h3 className="font-bold text-sm text-[#dfe2f0]">Organization Profile &amp; Integrations</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-lg bg-[#171b26] border border-[#262a35] space-y-1">
              <div className="text-[#939183]">Webhook / POS Endpoint</div>
              <div className="font-mono text-[#dfe2f0] text-xs truncate">
                https://api.crediteconomy.io/v1/webhook/{currentOrg.slug}
              </div>
            </div>
            <div className="p-3.5 rounded-lg bg-[#171b26] border border-[#262a35] space-y-1">
              <div className="text-[#939183]">Public Organization Slug</div>
              <div className="font-mono text-[#e4e1a9] text-xs">@{currentOrg.slug}</div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 10: AUDIT LOG                                        */}
      {/* ======================================================== */}
      {activeTab === 'auditLog' && (
        <div className="bg-[#141824] border border-[#262a35] rounded-xl p-5 space-y-4 text-xs">
          <h3 className="font-bold text-sm text-[#dfe2f0]">
            Cryptographic Audit Trail for {currentOrg.name}
          </h3>
          <div className="space-y-2">
            {orgAudits.length > 0 ? (
              orgAudits.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-lg bg-[#171b26] border border-[#262a35] flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-[#dfe2f0]">{item.action}</div>
                    <div className="text-[11px] text-[#939183] mt-0.5">By {item.actor}</div>
                  </div>
                  <div className="text-right font-mono text-[10px] text-[#939183]">
                    {item.timestamp}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-[#939183] italic">
                Initial genesis block recorded for {currentOrg.name}.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal: Invite Member */}
      {showMemberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-[#141824] border border-[#262a35] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-fadeIn text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#262a35]">
              <h3 className="font-bold text-sm text-[#dfe2f0]">Invite Organization Member</h3>
              <button
                onClick={() => setShowMemberModal(false)}
                className="text-[#939183] hover:text-[#dfe2f0]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[#cac7b8]">Full Name</label>
                <input
                  type="text"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="e.g. Liam Nguyen"
                  className="w-full bg-[#171b26] border border-[#262a35] rounded-lg px-3 py-2 text-xs text-[#dfe2f0] focus:outline-none focus:border-[#e4e1a9]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[#cac7b8]">Corporate / User Email</label>
                <input
                  type="email"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  placeholder="liam@brand.io"
                  className="w-full bg-[#171b26] border border-[#262a35] rounded-lg px-3 py-2 text-xs text-[#dfe2f0] focus:outline-none focus:border-[#e4e1a9]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[#cac7b8]">Assigned Role</label>
                <select
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value as any)}
                  className="w-full bg-[#171b26] border border-[#262a35] rounded-lg px-3 py-2 text-xs text-[#dfe2f0] focus:outline-none focus:border-[#e4e1a9]"
                >
                  <option value="Admin">Admin (Full Management)</option>
                  <option value="Program Manager">Program Manager (Quests &amp; Rules)</option>
                  <option value="Campaign Manager">Campaign Manager (Campaigns &amp; Promos)</option>
                  <option value="Analyst">Analyst (View Analytics &amp; Reports)</option>
                  <option value="Member">Member (Standard Access)</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-[#262a35]">
              <button
                onClick={() => setShowMemberModal(false)}
                className="px-3 py-1.5 rounded-lg bg-[#1b1f2a] text-[#939183] text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMember}
                className="px-4 py-1.5 rounded-lg bg-[#e4e1a9] text-[#171b26] font-bold text-xs cursor-pointer hover:bg-[#d8d598]"
              >
                Send Invite
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Create Quest */}
      {showQuestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-[#141824] border border-[#262a35] rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-fadeIn text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#262a35]">
              <h3 className="font-bold text-sm text-[#dfe2f0]">
                Create Quest for {currentOrg.name}
              </h3>
              <button
                onClick={() => setShowQuestModal(false)}
                className="text-[#939183] hover:text-[#dfe2f0]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[#cac7b8]">Quest Title</label>
                <input
                  type="text"
                  value={newQuestName}
                  onChange={(e) => setNewQuestName(e.target.value)}
                  placeholder="e.g. Try Seasonal Cold Brew"
                  className="w-full bg-[#171b26] border border-[#262a35] rounded-lg px-3 py-2 text-xs text-[#dfe2f0] focus:outline-none focus:border-[#e4e1a9]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[#cac7b8]">Trigger Event</label>
                  <input
                    type="text"
                    value={newQuestTrigger}
                    onChange={(e) => setNewQuestTrigger(e.target.value)}
                    className="w-full bg-[#171b26] border border-[#262a35] rounded-lg px-3 py-2 font-mono text-xs text-[#dfe2f0] focus:outline-none focus:border-[#e4e1a9]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[#cac7b8]">Credit Reward (CRD)</label>
                  <input
                    type="number"
                    value={newQuestReward}
                    onChange={(e) => setNewQuestReward(Number(e.target.value))}
                    step={10}
                    className="w-full bg-[#171b26] border border-[#262a35] rounded-lg px-3 py-2 font-mono text-xs text-[#dfe2f0] focus:outline-none focus:border-[#e4e1a9]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[#cac7b8]">Frequency</label>
                  <select
                    value={newQuestFrequency}
                    onChange={(e) => setNewQuestFrequency(e.target.value as any)}
                    className="w-full bg-[#171b26] border border-[#262a35] rounded-lg px-3 py-2 text-xs text-[#dfe2f0] focus:outline-none focus:border-[#e4e1a9]"
                  >
                    <option value="Weekly">Weekly</option>
                    <option value="Daily">Daily</option>
                    <option value="Once">Once per user</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[#cac7b8]">Quest Budget (CRD)</label>
                  <input
                    type="number"
                    value={newQuestBudget}
                    onChange={(e) => setNewQuestBudget(Number(e.target.value))}
                    step={5000}
                    className="w-full bg-[#171b26] border border-[#262a35] rounded-lg px-3 py-2 font-mono text-xs text-[#dfe2f0] focus:outline-none focus:border-[#e4e1a9]"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-[#262a35]">
              <button
                onClick={() => setShowQuestModal(false)}
                className="px-3 py-1.5 rounded-lg bg-[#1b1f2a] text-[#939183] text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateQuest}
                className="px-4 py-1.5 rounded-lg bg-[#e4e1a9] text-[#171b26] font-bold text-xs cursor-pointer hover:bg-[#d8d598]"
              >
                Deploy Quest
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Create Campaign */}
      {showCampaignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-[#141824] border border-[#262a35] rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-fadeIn text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#262a35]">
              <h3 className="font-bold text-sm text-[#dfe2f0]">
                Launch Campaign for {currentOrg.name}
              </h3>
              <button
                onClick={() => setShowCampaignModal(false)}
                className="text-[#939183] hover:text-[#dfe2f0]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[#cac7b8]">Campaign Name</label>
                <input
                  type="text"
                  value={newCampaignName}
                  onChange={(e) => setNewCampaignName(e.target.value)}
                  placeholder="e.g. Weekend Cold Brew Discovery"
                  className="w-full bg-[#171b26] border border-[#262a35] rounded-lg px-3 py-2 text-xs text-[#dfe2f0] focus:outline-none focus:border-[#e4e1a9]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[#cac7b8]">Timeline</label>
                  <input
                    type="text"
                    value={newCampaignTimeline}
                    onChange={(e) => setNewCampaignTimeline(e.target.value)}
                    placeholder="e.g. 14 Days"
                    className="w-full bg-[#171b26] border border-[#262a35] rounded-lg px-3 py-2 text-xs text-[#dfe2f0] focus:outline-none focus:border-[#e4e1a9]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[#cac7b8]">Budget Cap (CRD)</label>
                  <input
                    type="number"
                    value={newCampaignBudget}
                    onChange={(e) => setNewCampaignBudget(Number(e.target.value))}
                    step={10000}
                    className="w-full bg-[#171b26] border border-[#262a35] rounded-lg px-3 py-2 font-mono text-xs text-[#dfe2f0] focus:outline-none focus:border-[#e4e1a9]"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-[#262a35]">
              <button
                onClick={() => setShowCampaignModal(false)}
                className="px-3 py-1.5 rounded-lg bg-[#1b1f2a] text-[#939183] text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCampaign}
                className="px-4 py-1.5 rounded-lg bg-[#e4e1a9] text-[#171b26] font-bold text-xs cursor-pointer hover:bg-[#d8d598]"
              >
                Launch Campaign
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Adjust Credit Rules & Constraints */}
      {showAdjustRulesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-[#141824] border border-[#262a35] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-fadeIn text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#262a35]">
              <h3 className="font-bold text-sm text-[#dfe2f0]">
                Configure Credit Constraints for {currentOrg.name}
              </h3>
              <button
                onClick={() => setShowAdjustRulesModal(false)}
                className="text-[#939183] hover:text-[#dfe2f0]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[#cac7b8]">Earning Multiplier</label>
                <input
                  type="number"
                  value={customMultiplier}
                  onChange={(e) => setCustomMultiplier(Number(e.target.value))}
                  step={0.1}
                  min={0.5}
                  max={3.0}
                  className="w-full bg-[#171b26] border border-[#262a35] rounded-lg px-3 py-2 font-mono text-xs text-[#dfe2f0] focus:outline-none focus:border-[#e4e1a9]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[#cac7b8]">Monthly Issuance Budget Cap (CRD)</label>
                <input
                  type="number"
                  value={monthlyBudgetInput}
                  onChange={(e) => setMonthlyBudgetInput(Number(e.target.value))}
                  step={10000}
                  className="w-full bg-[#171b26] border border-[#262a35] rounded-lg px-3 py-2 font-mono text-xs text-[#dfe2f0] focus:outline-none focus:border-[#e4e1a9]"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-[#262a35]">
              <button
                onClick={() => setShowAdjustRulesModal(false)}
                className="px-3 py-1.5 rounded-lg bg-[#1b1f2a] text-[#939183] text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCreditRules}
                className="px-4 py-1.5 rounded-lg bg-[#e4e1a9] text-[#171b26] font-bold text-xs cursor-pointer hover:bg-[#d8d598]"
              >
                Save Constraints
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Campaign Builder Modal (MCP Programmable Demand Layer) */}
      <AICampaignBuilderModal
        isOpen={showAiCampaignBuilder}
        onClose={() => setShowAiCampaignBuilder(false)}
        preselectedOrgId={currentOrg.id}
      />
    </div>
  );
};
