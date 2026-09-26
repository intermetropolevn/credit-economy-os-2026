import React, { useState, useMemo } from 'react';
import { useEconomic } from '../context/EconomicContext';
import { BenefitPool, PoolType, PoolStatus } from '../types';
import {
  Layers,
  Compass,
  Target,
  Users,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  Building2,
  ArrowRight,
  Search,
  Filter,
  Download,
  Plus,
  Sparkles,
  HelpCircle,
  Tag,
  ShoppingBag,
  ExternalLink,
  Coins,
  Check,
  Zap,
  BarChart3,
  Award,
  ChevronRight,
  LayoutGrid,
  List,
} from 'lucide-react';
import { PoolAIIntelligence } from '../components/PoolAIIntelligence';

export const PoolsHubScreen: React.FC = () => {
  const {
    pools,
    selectedPoolId,
    setSelectedPoolId,
    navigate,
    users,
    selectedUserId,
    setSelectedUserId,
    organizations,
    createPool,
  } = useEconomic();

  const selectedUser = users.find((u) => u.id === selectedUserId) || users[0];

  // Primary Tabs: 'pools' | 'demand' | 'comparison' | 'journey'
  const [activeTab, setActiveTab] = useState<'pools' | 'demand' | 'comparison' | 'journey'>('pools');

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | PoolType>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | PoolStatus>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Create Pool Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPoolName, setNewPoolName] = useState('');
  const [newPoolTagline, setNewPoolTagline] = useState('');
  const [newPoolType, setNewPoolType] = useState<PoolType>('Lifestyle');
  const [newPoolFunding, setNewPoolFunding] = useState(35000);

  // Aggregated Across All Pools
  const totalSharedFunding = useMemo(
    () => pools.reduce((acc, p) => acc + p.totalFundingCredits, 0),
    [pools]
  );
  const totalCommitted = useMemo(
    () => pools.reduce((acc, p) => acc + p.committedCredits, 0),
    [pools]
  );
  const totalParticipants = useMemo(
    () => pools.reduce((acc, p) => acc + p.participantsCount, 0),
    [pools]
  );
  const totalContributorsCount = useMemo(() => {
    const orgIds = new Set<string>();
    pools.forEach((p) => p.contributions.forEach((c) => orgIds.add(c.organizationId)));
    return orgIds.size || 18;
  }, [pools]);
  const totalRedemptionsCount = useMemo(() => {
    return pools.reduce((acc, p) => {
      const redCount = p.benefits.reduce((sum, b) => sum + b.redeemedCount, 0);
      return acc + (p.redemptions?.length || redCount);
    }, 0);
  }, [pools]);
  const totalRedeemedCredits = useMemo(() => {
    return pools.reduce((acc, p) => {
      return acc + p.benefits.reduce((sum, b) => sum + b.redeemedCount * b.creditsCost, 0);
    }, 0) || 54200;
  }, [pools]);
  const totalDemandCredits = useMemo(() => {
    return pools.reduce((acc, p) => {
      return acc + (p.demandMetrics?.totalTargetDemandCredits || p.totalFundingCredits * 1.35);
    }, 0);
  }, [pools]);

  // Filtered Pools
  const filteredPools = useMemo(() => {
    return pools.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.owner.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === 'ALL' || p.type === typeFilter;
      const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [pools, searchQuery, typeFilter, statusFilter]);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPoolName.trim()) return;
    const created = createPool({
      name: newPoolName.trim(),
      tagline: newPoolTagline.trim() || 'Shared destination pool from partner merchants.',
      description: 'Aggregates credits from participating merchants toward curated destination benefits.',
      type: newPoolType,
      status: 'Active',
      owner: 'Credit Economy OS',
      totalFundingCredits: Number(newPoolFunding) || 35000,
      committedCredits: 0,
      participantsCount: 0,
      redemptionRate: 0,
      durationStart: '2026-10-01',
      durationEnd: '2026-12-31',
    });
    setShowCreateModal(false);
    setNewPoolName('');
    setNewPoolTagline('');
    setSelectedPoolId(created.id);
    navigate(`/pools/${created.id}`);
  };

  return (
    <div className="space-y-6">
      {/* Main Screen Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#262a35]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-[#dfe2f0] flex items-center gap-2.5">
              <Compass className="w-6 h-6 text-[#e4e1a9]" />
              <span>Destination Pools &mdash; Demand &amp; Allocation Layer</span>
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#1b1f2a] text-[#e4e1a9] border border-[#e4e1a9]/30 font-mono font-bold">
              DEMAND-CENTRIC
            </span>
          </div>
          <p className="text-xs text-[#939183] mt-1">
            Users do not simply redeem rewards from inventory. Users choose what destination they want to accumulate toward.
          </p>
        </div>

        {/* AI Copilot & Test Patron Selector */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              window.dispatchEvent(
                new CustomEvent('open-credit-economy-ai', {
                  detail: { query: 'Why is Pool A underperforming?' },
                })
              );
            }}
            className="px-3 py-1.5 rounded-xl bg-[#141824] hover:bg-[#1b1f2a] border border-[#e4e1a9]/40 text-[#e4e1a9] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            title="Ask AI to analyze pool performance or suggest destination perks"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#e4e1a9]" />
            <span>AI Pool Advisor (MCP)</span>
          </button>

          <div className="flex items-center gap-2 text-xs bg-[#141824] px-3 py-1.5 rounded-xl border border-[#262a35]">
            <span className="text-[#939183]">Test Patron:</span>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="bg-[#171b26] border border-[#262a35] rounded-lg px-2.5 py-1 text-xs text-[#dfe2f0] font-semibold focus:outline-none focus:border-[#e4e1a9]"
            >
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.creditAccount.availableCredit.toLocaleString()} CRD)
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* CORE PRODUCT DISTINCTION HERO CARD                       */}
      {/* REWARD CATALOG vs DESTINATION POOLS                      */}
      {/* ======================================================== */}
      <div className="bg-[#10141f] border border-[#e4e1a9]/30 rounded-2xl p-5 shadow-xl space-y-4 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#e4e1a9]/20 text-[#e4e1a9] border border-[#e4e1a9]/40">
                Foundational Architecture
              </span>
              <span className="text-xs text-[#cac7b8] font-semibold">
                Destination-Selection Mechanism for Economic Value
              </span>
            </div>
            <h2 className="text-lg font-bold text-[#dfe2f0]">
              &ldquo;Where do I want my credits to take me?&rdquo;
            </h2>
            <p className="text-xs text-[#cac7b8] leading-relaxed max-w-4xl">
              In a standard loyalty platform, a <strong>Reward Catalog</strong> is inventory-centric and answers <em>&ldquo;What rewards are available?&rdquo;</em> (spot prices, isolated merchant stock, instant checkouts).
              In the <strong>Credit Economy OS</strong>, a <strong>Pool</strong> is demand/allocation-centric and answers <em>&ldquo;What destination do I want to accumulate toward?&rdquo;</em> &mdash; aggregating shared multi-partner funding, participant demand, multi-goal allocation, and continuous quest-driven accumulation.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => navigate('/rewards?tab=catalog')}
              className="px-3.5 py-2 rounded-lg bg-[#171b26] hover:bg-[#1b1f2a] text-[#dfe2f0] border border-[#262a35] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Tag className="w-3.5 h-3.5 text-[#939183]" />
              <span>Inspect Reward Catalog</span>
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 rounded-lg bg-[#e4e1a9] hover:bg-[#d8d598] text-[#171b26] text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer hover:scale-[1.01]"
            >
              <Plus className="w-4 h-4" />
              <span>Create Pool</span>
            </button>
          </div>
        </div>

        {/* Side-by-Side Architectural Contrast Table */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-[#262a35] text-xs">
          {/* Left Column: Reward Catalog */}
          <div className="p-3 rounded-xl bg-[#141824] border border-[#262a35] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#dfe2f0] flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[#939183]" />
                <span>REWARD CATALOG</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#171b26] text-[#939183] border border-[#262a35]">
                INVENTORY-CENTRIC
              </span>
            </div>
            <div className="text-[11px] text-[#939183] italic">
              Answers: &ldquo;What rewards are available?&rdquo;
            </div>
            <ul className="space-y-1 text-[11px] text-[#cac7b8] divide-y divide-[#262a35]/60">
              <li className="pt-1 flex items-center justify-between">
                <span>Core Unit:</span>
                <strong className="text-[#dfe2f0]">Reward SKU &amp; Provider Price</strong>
              </li>
              <li className="pt-1 flex items-center justify-between">
                <span>Supply Model:</span>
                <strong className="text-[#dfe2f0]">Single-merchant physical inventory</strong>
              </li>
              <li className="pt-1 flex items-center justify-between">
                <span>User Decision:</span>
                <strong className="text-[#dfe2f0]">Spot purchase (if affordable) / Bounce</strong>
              </li>
              <li className="pt-1 flex items-center justify-between">
                <span>Economic Dynamic:</span>
                <strong className="text-[#dfe2f0]">Transactional clearing burn</strong>
              </li>
            </ul>
          </div>

          {/* Right Column: Destination Pool */}
          <div className="p-3 rounded-xl bg-[#171b26] border border-[#e4e1a9]/40 space-y-2 ring-1 ring-[#e4e1a9]/20">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#e4e1a9] flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-[#e4e1a9]" />
                <span>DESTINATION POOL</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#e4e1a9]/20 text-[#e4e1a9] border border-[#e4e1a9]/40 font-bold">
                DEMAND / ALLOCATION-CENTRIC
              </span>
            </div>
            <div className="text-[11px] text-[#e4e1a9] italic">
              Answers: &ldquo;What destination do I want to accumulate my credits toward?&rdquo;
            </div>
            <ul className="space-y-1 text-[11px] text-[#cac7b8] divide-y divide-[#262a35]/60">
              <li className="pt-1 flex items-center justify-between">
                <span>Core Unit:</span>
                <strong className="text-[#e4e1a9]">Shared Multi-Partner Destination Goal</strong>
              </li>
              <li className="pt-1 flex items-center justify-between">
                <span>Funding Model:</span>
                <strong className="text-[#dfe2f0]">Shared funding &amp; multi-org co-sponsorship</strong>
              </li>
              <li className="pt-1 flex items-center justify-between">
                <span>User Decision:</span>
                <strong className="text-[#e4e1a9]">Choose destination &rarr; Accumulate &rarr; Redeem</strong>
              </li>
              <li className="pt-1 flex items-center justify-between">
                <span>Economic Dynamic:</span>
                <strong className="text-[#dfe2f0]">Demand aggregation &amp; capacity absorption</strong>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 7 AGGREGATED POOL ECOSYSTEM METRICS                      */}
      {/* Funding | Contributors | Participants | Credits Committed */}
      {/* Credits Redeemed | Demand | Inventory Utilization        */}
      {/* ======================================================== */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {/* 1. Shared Funding */}
        <div className="bg-[#141824] border border-[#262a35] rounded-xl p-3.5 space-y-1">
          <div className="text-[10px] uppercase font-mono font-semibold text-[#939183] flex items-center justify-between">
            <span>Shared Funding</span>
            <DollarSign className="w-3.5 h-3.5 text-[#e4e1a9]" />
          </div>
          <div className="text-xl font-bold font-mono text-[#dfe2f0]">
            {totalSharedFunding.toLocaleString()} <span className="text-[10px] text-[#939183]">CRD</span>
          </div>
          <div className="text-[10px] text-[#939183]">Across {pools.length} active pools</div>
        </div>

        {/* 2. Contributors */}
        <div className="bg-[#141824] border border-[#262a35] rounded-xl p-3.5 space-y-1">
          <div className="text-[10px] uppercase font-mono font-semibold text-[#939183] flex items-center justify-between">
            <span>Contributors</span>
            <Building2 className="w-3.5 h-3.5 text-[#c8c58f]" />
          </div>
          <div className="text-xl font-bold font-mono text-[#e4e1a9]">
            {totalContributorsCount} <span className="text-[10px] text-[#939183]">Orgs</span>
          </div>
          <div className="text-[10px] text-[#939183]">Brands, vendors &amp; treasury</div>
        </div>

        {/* 3. Participants */}
        <div className="bg-[#141824] border border-[#262a35] rounded-xl p-3.5 space-y-1">
          <div className="text-[10px] uppercase font-mono font-semibold text-[#939183] flex items-center justify-between">
            <span>Participants</span>
            <Users className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-300">
            {totalParticipants.toLocaleString()}
          </div>
          <div className="text-[10px] text-[#939183]">Actively building goals</div>
        </div>

        {/* 4. Credits Committed */}
        <div className="bg-[#141824] border border-[#262a35] rounded-xl p-3.5 space-y-1">
          <div className="text-[10px] uppercase font-mono font-semibold text-[#939183] flex items-center justify-between">
            <span>Committed</span>
            <Target className="w-3.5 h-3.5 text-[#e4e1a9]" />
          </div>
          <div className="text-xl font-bold font-mono text-[#e4e1a9]">
            {totalCommitted.toLocaleString()} <span className="text-[10px] text-[#939183]">CRD</span>
          </div>
          <div className="text-[10px] text-[#939183]">
            {Math.round((totalCommitted / (totalSharedFunding || 1)) * 100)}% funding absorbed
          </div>
        </div>

        {/* 5. Credits Redeemed */}
        <div className="bg-[#141824] border border-[#262a35] rounded-xl p-3.5 space-y-1">
          <div className="text-[10px] uppercase font-mono font-semibold text-[#939183] flex items-center justify-between">
            <span>Redeemed</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono text-[#dfe2f0]">
            {totalRedeemedCredits.toLocaleString()} <span className="text-[10px] text-[#939183]">CRD</span>
          </div>
          <div className="text-[10px] text-emerald-400">{totalRedemptionsCount} benefit burns</div>
        </div>

        {/* 6. Participant Demand */}
        <div className="bg-[#141824] border border-[#262a35] rounded-xl p-3.5 space-y-1">
          <div className="text-[10px] uppercase font-mono font-semibold text-[#939183] flex items-center justify-between">
            <span>Total Demand</span>
            <Sparkles className="w-3.5 h-3.5 text-[#e4e1a9]" />
          </div>
          <div className="text-xl font-bold font-mono text-[#e4e1a9]">
            {Math.round(totalDemandCredits).toLocaleString()}{' '}
            <span className="text-[10px] text-[#939183]">CRD</span>
          </div>
          <div className="text-[10px] text-[#939183]">138% goal intention curve</div>
        </div>

        {/* 7. Inventory Utilization */}
        <div className="bg-[#141824] border border-[#262a35] rounded-xl p-3.5 space-y-1 col-span-2 sm:col-span-1">
          <div className="text-[10px] uppercase font-mono font-semibold text-[#939183] flex items-center justify-between">
            <span>Utilization</span>
            <TrendingUp className="w-3.5 h-3.5 text-[#e4e1a9]" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-300">84%</div>
          <div className="text-[10px] text-[#939183]">Partner stock reserved</div>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="flex items-center gap-1 border-b border-[#262a35] overflow-x-auto pb-px">
        {[
          { id: 'pools', label: 'All Destination Pools', count: filteredPools.length, icon: Layers },
          { id: 'demand', label: 'Demand & Allocation Analytics', icon: BarChart3, badge: 'ANALYTICS' },
          { id: 'journey', label: `Patron Journey (${selectedUser.name.split(' ')[0]})`, icon: Compass, badge: 'DECISION COCKPIT' },
          { id: 'comparison', label: 'Catalog vs Pool Distinction', icon: HelpCircle },
        ].map((tab) => {
          const isSelected = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-all cursor-pointer border-b-2 whitespace-nowrap relative ${
                isSelected
                  ? 'border-[#e4e1a9] text-[#e4e1a9] bg-[#141824]'
                  : 'border-transparent text-[#939183] hover:text-[#dfe2f0] hover:bg-[#141824]/50'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#e4e1a9]' : 'text-[#939183]'}`} />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-[#1b1f2a] text-[#e4e1a9] border border-[#262a35]' : 'bg-[#141824] text-[#939183]'
                  }`}
                >
                  {tab.count}
                </span>
              )}
              {tab.badge && (
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#e4e1a9]/20 text-[#e4e1a9] border border-[#e4e1a9]/40 font-mono tracking-wider ml-1 hidden sm:inline-block">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* TAB 1: ALL DESTINATION POOLS                             */}
      {/* ======================================================== */}
      {activeTab === 'pools' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#141824] p-3.5 rounded-xl border border-[#262a35]">
            <div className="relative w-full md:w-80">
              <Search className="w-3.5 h-3.5 text-[#939183] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search pools by destination, partners, perks..."
                className="w-full bg-[#171b26] border border-[#262a35] rounded-lg pl-9 pr-3 py-1.5 text-xs text-[#dfe2f0] focus:outline-none focus:border-[#e4e1a9]"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-[#939183]">Theme:</span>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as any)}
                  className="bg-[#171b26] border border-[#262a35] rounded-lg px-2.5 py-1 text-xs text-[#dfe2f0] focus:outline-none focus:border-[#e4e1a9]"
                >
                  <option value="ALL">All Destinations</option>
                  <option value="Lifestyle">Lifestyle</option>
                  <option value="Travel">Travel</option>
                  <option value="Wellness">Wellness</option>
                  <option value="Creator">Creator</option>
                  <option value="Community">Community</option>
                </select>
              </div>

              <div className="flex items-center border border-[#262a35] rounded-lg overflow-hidden bg-[#171b26]">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 cursor-pointer transition-colors ${
                    viewMode === 'grid' ? 'bg-[#1b1f2a] text-[#e4e1a9]' : 'text-[#939183] hover:text-[#dfe2f0]'
                  }`}
                  title="Grid View"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 cursor-pointer transition-colors ${
                    viewMode === 'table' ? 'bg-[#1b1f2a] text-[#e4e1a9]' : 'text-[#939183] hover:text-[#dfe2f0]'
                  }`}
                  title="Table View"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Grid View of Destination Pools */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredPools.map((pool) => {
                const commitPct = Math.round(
                  (pool.committedCredits / (pool.totalFundingCredits || 1)) * 100
                );
                return (
                  <div
                    key={pool.id}
                    className="bg-[#141824] border border-[#262a35] hover:border-[#3b4152] rounded-xl p-5 space-y-4 shadow-md transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      {/* Top Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1b1f2a] text-[#e4e1a9] border border-[#262a35] font-semibold uppercase">
                              {pool.type}
                            </span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                              {pool.status}
                            </span>
                            {pool.id === 'pool-city-life' && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#e4e1a9] text-[#171b26] shadow-sm">
                                SIGNATURE JOURNEY
                              </span>
                            )}
                          </div>
                          <h3 className="text-base font-bold text-[#dfe2f0] hover:text-[#e4e1a9] transition-colors cursor-pointer"
                            onClick={() => {
                              setSelectedPoolId(pool.id);
                              navigate(`/pools/${pool.id}`);
                            }}
                          >
                            {pool.name}
                          </h3>
                          <p className="text-xs text-[#cac7b8] italic">
                            &ldquo;{pool.tagline}&rdquo;
                          </p>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="text-[10px] text-[#939183] uppercase font-mono">Shared Funding</div>
                          <div className="text-base font-bold font-mono text-[#e4e1a9]">
                            {pool.totalFundingCredits.toLocaleString()} CRD
                          </div>
                          <div className="text-[10px] text-[#939183]">
                            {pool.contributions.length} Org Backers
                          </div>
                        </div>
                      </div>

                      {/* Demand & Allocation Bar */}
                      <div className="p-3 rounded-lg bg-[#10141f] border border-[#262a35] space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-[#cac7b8] font-medium flex items-center gap-1.5">
                            <Target className="w-3.5 h-3.5 text-[#e4e1a9]" />
                            <span>Credits Committed by Accumulators</span>
                          </span>
                          <span className="font-mono font-bold text-[#e4e1a9]">
                            {pool.committedCredits.toLocaleString()} / {pool.totalFundingCredits.toLocaleString()} CRD ({commitPct}%)
                          </span>
                        </div>
                        <div className="w-full bg-[#1b1f2a] rounded-full h-2 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#c8c58f] to-[#e4e1a9] transition-all"
                            style={{ width: `${Math.min(100, commitPct)}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-[#939183]">
                          <span>{pool.participantsCount.toLocaleString()} active patrons building goals</span>
                          <span className="text-emerald-400 font-semibold">{pool.redemptionRate}% redemption velocity</span>
                        </div>
                      </div>

                      {/* Multiple Curated Benefits list */}
                      <div className="space-y-1.5">
                        <div className="text-[11px] font-semibold text-[#dfe2f0] flex items-center justify-between">
                          <span>Curated Benefits to Accumulate Toward:</span>
                          <span className="text-[#939183] font-mono text-[10px]">{pool.benefits.length} perks available</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {pool.benefits.slice(0, 4).map((b) => (
                            <div
                              key={b.id}
                              className="p-2 rounded-lg bg-[#171b26] border border-[#262a35] text-[11px] space-y-0.5"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-[#dfe2f0] truncate">{b.name}</span>
                                <span className="font-mono font-bold text-[#e4e1a9] ml-1 shrink-0">
                                  {b.creditsCost.toLocaleString()}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-[10px] text-[#939183]">
                                <span className="truncate">{b.providerOrgName}</span>
                                <span className="text-emerald-400">{b.remainingInventory} left</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Contributing Organizations strip */}
                      <div className="flex items-center gap-2 pt-1 text-[11px] text-[#939183] flex-wrap">
                        <span className="font-medium text-[#cac7b8]">Backed by:</span>
                        {pool.contributions.map((c, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded bg-[#171b26] border border-[#262a35] text-[#dfe2f0] text-[10px] font-mono"
                          >
                            {c.organizationName}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Action */}
                    <div className="pt-3 border-t border-[#262a35] flex items-center justify-between">
                      <div className="text-[11px] text-[#cac7b8]">
                        Sarah's balance: <strong className="text-[#e4e1a9] font-mono">{selectedUser.creditAccount.availableCredit.toLocaleString()} CRD</strong>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedPoolId(pool.id);
                          navigate(`/pools/${pool.id}`);
                        }}
                        className="px-3.5 py-1.5 rounded-lg bg-[#e4e1a9] hover:bg-[#d8d598] text-[#171b26] text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer hover:scale-[1.01]"
                      >
                        <span>Explore &amp; Accumulate</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-[#141824] border border-[#262a35] rounded-xl overflow-hidden shadow-md">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#262a35] bg-[#10141f] text-[11px] text-[#939183] uppercase font-mono">
                      <th className="py-3 px-4">Destination Pool</th>
                      <th className="py-3 px-4">Theme</th>
                      <th className="py-3 px-4 text-right">Shared Funding</th>
                      <th className="py-3 px-4 text-right">Credits Committed</th>
                      <th className="py-3 px-4 text-right">Participants</th>
                      <th className="py-3 px-4">Contributors</th>
                      <th className="py-3 px-4 text-right">Redemption Rate</th>
                      <th className="py-3 px-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#262a35]">
                    {filteredPools.map((pool) => (
                      <tr key={pool.id} className="hover:bg-[#1b1f2a]/60 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-bold text-[#dfe2f0]">{pool.name}</div>
                          <div className="text-[10px] text-[#939183]">{pool.tagline}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#171b26] text-[#e4e1a9] border border-[#262a35]">
                            {pool.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-[#dfe2f0]">
                          {pool.totalFundingCredits.toLocaleString()} CRD
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-[#e4e1a9]">
                          {pool.committedCredits.toLocaleString()} CRD
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-emerald-300">
                          {pool.participantsCount.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-[11px] text-[#cac7b8]">
                          {pool.contributions.length} organizations
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-emerald-400">
                          {pool.redemptionRate}%
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => {
                              setSelectedPoolId(pool.id);
                              navigate(`/pools/${pool.id}`);
                            }}
                            className="px-2.5 py-1 rounded bg-[#e4e1a9] hover:bg-[#d8d598] text-[#171b26] text-xs font-bold transition-all cursor-pointer"
                          >
                            Open Cockpit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: DEMAND & ALLOCATION ANALYTICS                     */}
      {/* ======================================================== */}
      {activeTab === 'demand' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-[#141824] border border-[#262a35] space-y-1">
            <h3 className="text-base font-bold text-[#dfe2f0] flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#e4e1a9]" />
              <span>Participant Demand Signals vs Partner Supply Capacity</span>
            </h3>
            <p className="text-xs text-[#939183]">
              Unlike a catalog which only measures spot purchases, Pools measure forward-looking consumer intent and capital commitment.
            </p>
          </div>

          {/* Demand Breakdown Table */}
          <div className="bg-[#141824] border border-[#262a35] rounded-xl overflow-hidden shadow-md">
            <div className="p-4 border-b border-[#262a35] flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-[#dfe2f0]">City Life Pool: Benefit Demand Distribution</h4>
                <p className="text-[11px] text-[#939183]">Patrons actively saving toward each curated perk</p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                84% Total Inventory Utilization
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#262a35] bg-[#10141f] text-[11px] text-[#939183] uppercase font-mono">
                    <th className="py-3 px-4">Benefit Destination</th>
                    <th className="py-3 px-4">Provider</th>
                    <th className="py-3 px-4 text-right">Goal Target (CRD)</th>
                    <th className="py-3 px-4 text-right">Active Savers</th>
                    <th className="py-3 px-4 text-right">Committed Credits</th>
                    <th className="py-3 px-4 text-right">Total Inventory</th>
                    <th className="py-3 px-4 text-right">Demand Pressure</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#262a35]">
                  {[
                    {
                      name: 'Weekend Stay',
                      provider: 'Nomad Stay',
                      target: 5000,
                      savers: 1420,
                      committed: 11500,
                      inventory: 15,
                      pressure: 'High (118% capacity pressure)',
                      color: 'text-amber-400',
                    },
                    {
                      name: 'Free Specialty Coffee',
                      provider: 'ABC Coffee',
                      target: 500,
                      savers: 2140,
                      committed: 8500,
                      inventory: 600,
                      pressure: 'Balanced (healthy turnover)',
                      color: 'text-emerald-400',
                    },
                    {
                      name: 'Food Voucher',
                      provider: 'ABC Coffee',
                      target: 1000,
                      savers: 890,
                      committed: 6400,
                      inventory: 300,
                      pressure: 'Moderate (consistent)',
                      color: 'text-blue-400',
                    },
                    {
                      name: 'Creative Workshop',
                      provider: 'Local Studio',
                      target: 2000,
                      savers: 420,
                      committed: 4800,
                      inventory: 50,
                      pressure: 'High (rapidly locking)',
                      color: 'text-amber-400',
                    },
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-[#1b1f2a]/60 transition-colors">
                      <td className="py-3 px-4 font-bold text-[#dfe2f0]">{row.name}</td>
                      <td className="py-3 px-4 text-[#cac7b8]">{row.provider}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-[#e4e1a9]">
                        {row.target.toLocaleString()} CRD
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-[#dfe2f0]">
                        {row.savers.toLocaleString()} patrons
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-[#e4e1a9]">
                        {row.committed.toLocaleString()} CRD
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-[#cac7b8]">
                        {row.inventory} units
                      </td>
                      <td className={`py-3 px-4 text-right font-mono text-xs ${row.color}`}>
                        {row.pressure}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Destination Pool Intelligence & Inventory Health (MCP Layer) */}
          <PoolAIIntelligence />
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: PATRON DESTINATION JOURNEY (SARAH CHEN QUICK COCKPIT) */}
      {/* ======================================================== */}
      {activeTab === 'journey' && (
        <div className="space-y-4">
          <div className="bg-[#141824] border border-[#262a35] rounded-xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#262a35]">
              <div>
                <h3 className="font-bold text-sm text-[#dfe2f0]">
                  {selectedUser.name}'s Destination Journey &mdash; City Life Pool
                </h3>
                <p className="text-[11px] text-[#939183]">
                  Direct cockpit showing multi-goal allocation, accumulation, and redemption pass.
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedPoolId('pool-city-life');
                  navigate('/pools/pool-city-life');
                }}
                className="px-3.5 py-1.5 rounded-lg bg-[#e4e1a9] hover:bg-[#d8d598] text-[#171b26] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span>Open Full Decision Journey Screen</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 3 Accounting Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-[#171b26] border border-[#262a35]">
                <div className="text-[10px] uppercase font-mono text-[#939183]">TOTAL BALANCE</div>
                <div className="text-xl font-bold font-mono text-[#dfe2f0]">3,900 CRD</div>
                <div className="text-[10px] text-[#cac7b8]">Sarah Chen unified wallet</div>
              </div>
              <div className="p-3.5 rounded-xl bg-[#171b26] border border-[#e4e1a9]/40">
                <div className="text-[10px] uppercase font-mono text-[#e4e1a9]">ALLOCATED CREDITS</div>
                <div className="text-xl font-bold font-mono text-[#e4e1a9]">2,900 CRD</div>
                <div className="text-[10px] text-[#cac7b8]">Weekend Stay (2,400) + Workshop (500)</div>
              </div>
              <div className="p-3.5 rounded-xl bg-[#171b26] border border-emerald-500/30">
                <div className="text-[10px] uppercase font-mono text-emerald-400">AVAILABLE TO ALLOCATE</div>
                <div className="text-xl font-bold font-mono text-emerald-300">1,000 CRD</div>
                <div className="text-[10px] text-[#cac7b8]">Uncommitted free balance</div>
              </div>
            </div>

            {/* Sarah's Goal Highlight */}
            <div className="p-4 rounded-xl bg-[#10141f] border border-[#e4e1a9]/30 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#171b26] text-[#e4e1a9] border border-[#262a35] font-bold">
                    PRIMARY DESTINATION GOAL
                  </span>
                  <h4 className="text-base font-bold text-[#dfe2f0] mt-1">WEEKEND STAY &mdash; Nomad Stay</h4>
                </div>
                <div className="text-right">
                  <span className="font-mono text-lg font-bold text-[#e4e1a9]">2,400 / 5,000 CRD</span>
                  <span className="text-xs text-[#cac7b8] ml-2">(48%)</span>
                </div>
              </div>
              <div className="w-full bg-[#1b1f2a] rounded-full h-2.5 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#c8c58f] to-[#e4e1a9]" style={{ width: '48%' }} />
              </div>
              <div className="flex items-center justify-between text-xs text-[#939183]">
                <span>Status: &ldquo;You&rsquo;re building toward this benefit.&rdquo;</span>
                <span className="font-mono text-amber-300">2,600 CRD remaining</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: ARCHITECTURAL COMPARISON MATRIX                   */}
      {/* ======================================================== */}
      {activeTab === 'comparison' && (
        <div className="bg-[#141824] border border-[#262a35] rounded-xl p-5 space-y-4">
          <h3 className="text-base font-bold text-[#dfe2f0]">
            System Comparison: Reward Catalog vs Destination Pools
          </h3>
          <p className="text-xs text-[#939183]">
            How the Credit Economy OS shifts incentives from passive inventory consumption to active multi-party economic coordination.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#262a35] bg-[#10141f] text-[11px] text-[#939183] uppercase font-mono">
                  <th className="py-3 px-4">Dimension</th>
                  <th className="py-3 px-4">Reward Catalog (Inventory-Centric)</th>
                  <th className="py-3 px-4 text-[#e4e1a9]">Destination Pool (Demand/Allocation-Centric)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#262a35] text-xs">
                <tr>
                  <td className="py-3 px-4 font-bold text-[#dfe2f0]">Core Question</td>
                  <td className="py-3 px-4 text-[#939183]">&ldquo;What rewards are available?&rdquo;</td>
                  <td className="py-3 px-4 text-[#e4e1a9] font-semibold">&ldquo;What destination do I want to accumulate toward?&rdquo;</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-[#dfe2f0]">Funding Structure</td>
                  <td className="py-3 px-4 text-[#939183]">Single merchant item margin</td>
                  <td className="py-3 px-4 text-[#dfe2f0]">Shared pool co-sponsored by multiple partners + treasury</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-[#dfe2f0]">Participating Orgs</td>
                  <td className="py-3 px-4 text-[#939183]">Disjointed list of vendors</td>
                  <td className="py-3 px-4 text-[#dfe2f0]">Aligned coalition pooling capital &amp; inventory</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-[#dfe2f0]">Patron Behavior</td>
                  <td className="py-3 px-4 text-[#939183]">One-off spot purchase or bounce</td>
                  <td className="py-3 px-4 text-[#e4e1a9] font-semibold">Goal selection, credit allocation, multi-quest accumulation</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-[#dfe2f0]">Multi-Goal Support</td>
                  <td className="py-3 px-4 text-[#939183]">Shopping cart or single purchase</td>
                  <td className="py-3 px-4 text-[#dfe2f0]">Concurrent goal allocation with zero accounting confusion</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-[#dfe2f0]">Merchant Benefit</td>
                  <td className="py-3 px-4 text-[#939183]">Immediate clearance or discount loss</td>
                  <td className="py-3 px-4 text-[#dfe2f0]">Forward demand visibility &amp; guaranteed liquidity settlement</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Pool Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141824] border border-[#262a35] rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-[#262a35]">
              <h3 className="font-bold text-base text-[#dfe2f0] flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#e4e1a9]" />
                <span>Create New Destination Pool</span>
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-[#939183] hover:text-[#dfe2f0] cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#939183] mb-1 font-medium">Pool Name</label>
                <input
                  type="text"
                  required
                  value={newPoolName}
                  onChange={(e) => setNewPoolName(e.target.value)}
                  placeholder="e.g. Creator Growth Pool"
                  className="w-full bg-[#171b26] border border-[#262a35] rounded-lg px-3 py-2 text-[#dfe2f0] focus:outline-none focus:border-[#e4e1a9]"
                />
              </div>

              <div>
                <label className="block text-[#939183] mb-1 font-medium">Destination Tagline</label>
                <input
                  type="text"
                  value={newPoolTagline}
                  onChange={(e) => setNewPoolTagline(e.target.value)}
                  placeholder="e.g. GPU compute & creative studio benefits"
                  className="w-full bg-[#171b26] border border-[#262a35] rounded-lg px-3 py-2 text-[#dfe2f0] focus:outline-none focus:border-[#e4e1a9]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#939183] mb-1 font-medium">Theme</label>
                  <select
                    value={newPoolType}
                    onChange={(e) => setNewPoolType(e.target.value as any)}
                    className="w-full bg-[#171b26] border border-[#262a35] rounded-lg px-3 py-2 text-[#dfe2f0] focus:outline-none focus:border-[#e4e1a9]"
                  >
                    <option value="Lifestyle">Lifestyle</option>
                    <option value="Travel">Travel</option>
                    <option value="Wellness">Wellness</option>
                    <option value="Creator">Creator</option>
                    <option value="Community">Community</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#939183] mb-1 font-medium">Shared Funding (CRD)</label>
                  <input
                    type="number"
                    min={5000}
                    step={1000}
                    value={newPoolFunding}
                    onChange={(e) => setNewPoolFunding(Number(e.target.value))}
                    className="w-full bg-[#171b26] border border-[#262a35] rounded-lg px-3 py-2 text-[#dfe2f0] focus:outline-none focus:border-[#e4e1a9] font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#262a35] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-[#262a35] text-[#939183] hover:text-[#dfe2f0] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#e4e1a9] hover:bg-[#d8d598] text-[#171b26] font-bold cursor-pointer transition-all"
                >
                  Create Destination Pool
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
