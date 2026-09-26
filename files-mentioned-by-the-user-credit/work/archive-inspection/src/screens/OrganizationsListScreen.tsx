import React, { useState } from 'react';
import { useEconomic } from '../context/EconomicContext';
import { OrganizationType, OrganizationStatus, Organization } from '../types';
import {
  Building2,
  Plus,
  Search,
  Filter,
  Users,
  Layers,
  ArrowRight,
  TrendingUp,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Award,
  DollarSign,
  ChevronRight,
  Store,
  ExternalLink,
  Target,
  FileText,
  X,
  Check,
} from 'lucide-react';
import { AICampaignBuilderModal } from '../components/AICampaignBuilderModal';

export const OrganizationsListScreen: React.FC = () => {
  const { organizations, setSelectedOrganizationId, navigate, createOrganization, currentPath } = useEconomic();

  const [activeTab, setActiveTab] = useState<'ALL' | OrganizationType>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | OrganizationStatus>('ALL');
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [showAiCampaignBuilder, setShowAiCampaignBuilder] = useState(false);

  React.useEffect(() => {
    if (currentPath.includes('type=Vendor')) setActiveTab('Vendor');
    else if (currentPath.includes('type=Brand')) setActiveTab('Brand');
    else if (currentPath.includes('type=Partner')) setActiveTab('Partner');
    else if (currentPath.includes('type=Merchant')) setActiveTab('Merchant');
    else if (currentPath.includes('type=Service%20Provider') || currentPath.includes('type=Service Provider')) setActiveTab('Service Provider');
    else if (currentPath === '/organizations') setActiveTab('ALL');
  }, [currentPath]);

  // Onboarding Wizard State (Section 16: 6-step guided vendor onboarding flow)
  const [wizardStep, setWizardStep] = useState<number>(1);
  const [newOrgName, setNewOrgName] = useState('');
  const [newOrgType, setNewOrgType] = useState<OrganizationType>('Vendor');
  const [newOrgIndustry, setNewOrgIndustry] = useState('F&B');
  const [selectedGoals, setSelectedGoals] = useState<string[]>(['Increase repeat purchases', 'Drive visits']);
  const [selectedSamplePreset, setSelectedSamplePreset] = useState<string>('Buy 2 Coffees (+100 CRD)');
  const [newOrgBudget, setNewOrgBudget] = useState<number>(50000);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');

  const filteredOrgs = organizations.filter((org) => {
    const matchesTab = activeTab === 'ALL' || org.type === activeTab;
    const matchesStatus = statusFilter === 'ALL' || org.status === statusFilter;
    const matchesSearch =
      org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.primaryContact.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesStatus && matchesSearch;
  });

  const totalCreditsIssued = organizations.reduce((sum, o) => sum + o.creditsIssued, 0);
  const totalCreditsRedeemed = organizations.reduce((sum, o) => sum + o.creditsRedeemed, 0);
  const totalOutstanding = organizations.reduce((sum, o) => sum + o.outstandingCredits, 0);
  const totalQuests = organizations.reduce((sum, o) => sum + o.activeQuestsCount, 0);
  const totalPrograms = organizations.reduce((sum, o) => sum + o.activeProgramsCount, 0);

  const handleOpenDetail = (orgId: string) => {
    setSelectedOrganizationId(orgId);
    navigate(`/organizations/${orgId}`);
  };

  const handleFinishOnboarding = () => {
    if (!newOrgName) return;
    const created = createOrganization({
      name: newOrgName,
      type: newOrgType,
      industry: newOrgIndustry,
      status: 'Active',
      plan: 'Growth',
      monthlyBudget: newOrgBudget,
      primaryContact: {
        name: contactName || 'Partner Admin',
        email: contactEmail || 'admin@partner.io',
        role: 'Owner',
      },
      creditRulesSummary: `${selectedSamplePreset} with monthly cap of ${newOrgBudget.toLocaleString()} CRD`,
    });

    setShowOnboardingModal(false);
    setWizardStep(1);
    setSelectedOrganizationId(created.id);
    navigate(`/organizations/${created.id}`);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#262a35]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-[#dfe2f0] flex items-center gap-2.5">
              <Building2 className="w-6 h-6 text-[#e4e1a9]" />
              <span>Organizations &amp; Vendors</span>
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#1b1f2a] text-[#c8c58f] border border-[#262a35] font-mono">
              {organizations.length} Ecosystem Entities
            </span>
          </div>
          <p className="text-xs text-[#939183] mt-1">
            Vendors, Brands, Partners, Merchants, and Service Providers operating under the platform's centralized credit economy.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              window.dispatchEvent(
                new CustomEvent('open-credit-economy-ai', {
                  detail: { query: 'Find partners interested in acquiring fitness users.' },
                })
              );
            }}
            className="px-3 py-2 rounded-lg bg-[#141824] hover:bg-[#1b1f2a] border border-[#262a35] hover:border-[#e4e1a9]/50 text-xs text-[#dfe2f0] transition-all flex items-center gap-1.5 cursor-pointer shadow-sm group"
            title="Ask AI to discover matching partners and strategic alliances"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#e4e1a9] group-hover:scale-110 transition-transform" />
            <span>AI Partner Match</span>
          </button>
          <button
            onClick={() => setShowAiCampaignBuilder(true)}
            className="px-3 py-2 rounded-lg bg-gradient-to-r from-[#1b1f2a] to-[#141824] hover:bg-[#1b1f2a] border border-[#e4e1a9]/50 text-xs font-bold text-[#e4e1a9] transition-all flex items-center gap-1.5 cursor-pointer shadow-sm group hover:scale-[1.01]"
            title="Synthesize programmable demand campaigns with AI"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#e4e1a9] group-hover:scale-110 transition-transform" />
            <span>AI Campaign Builder</span>
          </button>
          <button
            onClick={() => setShowOnboardingModal(true)}
            className="px-3.5 py-2 rounded-lg bg-[#e4e1a9] hover:bg-[#d8d598] text-[#171b26] font-semibold text-xs transition-all shadow-sm flex items-center gap-1.5 cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
          >
            <Plus className="w-4 h-4" />
            <span>Onboard Organization</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-[#141824] border border-[#262a35] rounded-xl p-3.5 space-y-1">
          <div className="flex items-center justify-between text-xs text-[#939183]">
            <span>Active Businesses</span>
            <Building2 className="w-3.5 h-3.5 text-[#e4e1a9]" />
          </div>
          <div className="text-xl font-bold font-mono text-[#dfe2f0]">
            {organizations.length}
          </div>
          <div className="text-[11px] text-[#939183]">Across 6 core industries</div>
        </div>

        <div className="bg-[#141824] border border-[#262a35] rounded-xl p-3.5 space-y-1">
          <div className="flex items-center justify-between text-xs text-[#939183]">
            <span>Active Quests</span>
            <Target className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-300">
            {totalQuests}
          </div>
          <div className="text-[11px] text-[#939183]">{totalPrograms} Loyalty Programs</div>
        </div>

        <div className="bg-[#141824] border border-[#262a35] rounded-xl p-3.5 space-y-1">
          <div className="flex items-center justify-between text-xs text-[#939183]">
            <span>Credits Issued</span>
            <TrendingUp className="w-3.5 h-3.5 text-[#e4e1a9]" />
          </div>
          <div className="text-xl font-bold font-mono text-[#e4e1a9]">
            {totalCreditsIssued.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#939183]">Platform wide issuance</div>
        </div>

        <div className="bg-[#141824] border border-[#262a35] rounded-xl p-3.5 space-y-1">
          <div className="flex items-center justify-between text-xs text-[#939183]">
            <span>Credits Redeemed</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-[#c8c58f]" />
          </div>
          <div className="text-xl font-bold font-mono text-[#dfe2f0]">
            {totalCreditsRedeemed.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#939183]">
            {Math.round((totalCreditsRedeemed / totalCreditsIssued) * 100)}% redemption rate
          </div>
        </div>

        <div className="bg-[#141824] border border-[#262a35] rounded-xl p-3.5 space-y-1 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-xs text-[#939183]">
            <span>Outstanding Float</span>
            <DollarSign className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-bold font-mono text-[#feb26f]">
            {totalOutstanding.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#939183]">Reserved in user wallets</div>
        </div>
      </div>

      {/* Tabs & Filter Bar */}
      <div className="space-y-3">
        {/* Organization Type Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto text-xs bg-[#141824] p-1 rounded-xl border border-[#262a35]">
          {[
            { id: 'ALL', label: 'All Organizations' },
            { id: 'Vendor', label: 'Vendors' },
            { id: 'Brand', label: 'Brands' },
            { id: 'Partner', label: 'Partners' },
            { id: 'Merchant', label: 'Merchants' },
            { id: 'Service Provider', label: 'Service Providers' },
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

        {/* Filter and Search controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="relative w-full sm:w-80">
            <Search className="w-3.5 h-3.5 text-[#939183] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, industry, contact..."
              className="w-full bg-[#171b26] border border-[#262a35] rounded-lg pl-9 pr-3 py-2 text-xs text-[#dfe2f0] placeholder-[#939183] focus:outline-none focus:border-[#e4e1a9]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-[#939183]">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-[#171b26] border border-[#262a35] rounded-lg px-2.5 py-1.5 text-xs text-[#dfe2f0] focus:outline-none focus:border-[#e4e1a9]"
            >
              <option value="ALL">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Pending Review">Pending Review</option>
              <option value="Suspended">Suspended</option>
              <option value="Onboarding">Onboarding</option>
            </select>
          </div>
        </div>
      </div>

      {/* Organizations Table */}
      <div className="bg-[#141824] border border-[#262a35] rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0f131d] text-[#939183] border-b border-[#262a35] uppercase font-mono text-[10px]">
              <tr>
                <th className="py-3 px-4">Organization</th>
                <th className="py-3 px-4">Type &amp; Plan</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Members</th>
                <th className="py-3 px-4">Active Programs</th>
                <th className="py-3 px-4 text-right">Credits Issued</th>
                <th className="py-3 px-4 text-right">Redeemed</th>
                <th className="py-3 px-4 text-right">Outstanding</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262a35]/60">
              {filteredOrgs.map((org) => (
                <tr
                  key={org.id}
                  onClick={() => handleOpenDetail(org.id)}
                  className="hover:bg-[#171b26]/80 transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#1b1f2a] border border-[#3b4152] flex items-center justify-center font-bold text-xs text-[#e4e1a9] shrink-0 group-hover:border-[#e4e1a9] transition-colors">
                        {org.logoInitials}
                      </div>
                      <div>
                        <div className="font-semibold text-[#dfe2f0] group-hover:text-[#e4e1a9] transition-colors">
                          {org.name}
                        </div>
                        <div className="text-[11px] text-[#939183] mt-0.5">
                          {org.industry} · Contact: {org.primaryContact.name}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#1b1f2a] text-[#c8c58f] border border-[#262a35]">
                        {org.type}
                      </span>
                      <span className="text-[10px] text-[#939183] font-mono">
                        {org.plan}
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium border ${
                        org.status === 'Active'
                          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                          : org.status === 'Pending Review'
                          ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                          : 'bg-red-500/10 text-red-300 border-red-500/30'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          org.status === 'Active' ? 'bg-emerald-400' : 'bg-amber-400'
                        }`}
                      />
                      {org.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1 text-[#dfe2f0]">
                      <Users className="w-3.5 h-3.5 text-[#939183]" />
                      <span>{org.membersCount}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="space-y-0.5">
                      <div className="text-[#dfe2f0] font-medium">
                        {org.activeProgramsCount} Programs · {org.activeQuestsCount} Quests
                      </div>
                      <div className="text-[10px] text-[#939183]">
                        {org.activeCampaignsCount} Active Campaigns
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono text-[#e4e1a9] font-medium">
                    {org.creditsIssued.toLocaleString()} CRD
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono text-[#939183]">
                    {org.creditsRedeemed.toLocaleString()} CRD
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono font-semibold text-[#dfe2f0]">
                    {org.outstandingCredits.toLocaleString()} CRD
                  </td>

                  <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleOpenDetail(org.id)}
                      className="px-2.5 py-1 rounded bg-[#1b1f2a] hover:bg-[#262a35] text-xs text-[#e4e1a9] font-medium border border-[#262a35] inline-flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <span>Workspace</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Guided 6-Step Vendor Onboarding Modal (Section 16) */}
      {showOnboardingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-[#141824] border border-[#262a35] rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl animate-fadeIn">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#262a35]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1b1f2a] text-[#c8c58f] border border-[#262a35]">
                    STEP {wizardStep} OF 6
                  </span>
                  <h3 className="font-bold text-base text-[#dfe2f0]">
                    {wizardStep === 1 && '1. Choose Business Classification'}
                    {wizardStep === 2 && '2. Define Core Business Goals'}
                    {wizardStep === 3 && '3. Select Credit Templates'}
                    {wizardStep === 4 && '4. Customize Credit & Budget Parameters'}
                    {wizardStep === 5 && '5. Review & Projected Participation Preview'}
                    {wizardStep === 6 && '6. Publish & Deploy to Ecosystem'}
                  </h3>
                </div>
                <p className="text-xs text-[#939183] mt-0.5">
                  Plug into the centralized Credit Economy Operating System with tailored rules.
                </p>
              </div>

              <button
                onClick={() => setShowOnboardingModal(false)}
                className="p-1 rounded-lg text-[#939183] hover:text-[#dfe2f0] hover:bg-[#1b1f2a] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Stepper Progress Bar */}
            <div className="grid grid-cols-6 gap-1">
              {[1, 2, 3, 4, 5, 6].map((s) => (
                <div
                  key={s}
                  className={`h-1.5 rounded-full transition-all ${
                    s <= wizardStep ? 'bg-[#e4e1a9]' : 'bg-[#262a35]'
                  }`}
                />
              ))}
            </div>

            {/* Wizard Body Steps */}
            <div className="space-y-4 min-h-[260px]">
              {/* Step 1: Business Classification */}
              {wizardStep === 1 && (
                <div className="space-y-3.5">
                  <div className="space-y-1.5">
                    <label className="text-xs text-[#cac7b8]">Organization / Brand Name</label>
                    <input
                      type="text"
                      value={newOrgName}
                      onChange={(e) => setNewOrgName(e.target.value)}
                      placeholder="e.g. Blue Bottle Coffee, Horizon Fitness, Artisan Bakery"
                      className="w-full bg-[#171b26] border border-[#262a35] rounded-lg px-3 py-2 text-sm text-[#dfe2f0] focus:outline-none focus:border-[#e4e1a9]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs text-[#cac7b8]">Entity Type</label>
                      <select
                        value={newOrgType}
                        onChange={(e) => setNewOrgType(e.target.value as any)}
                        className="w-full bg-[#171b26] border border-[#262a35] rounded-lg px-3 py-2 text-xs text-[#dfe2f0] focus:outline-none focus:border-[#e4e1a9]"
                      >
                        <option value="Vendor">Vendor</option>
                        <option value="Brand">Brand</option>
                        <option value="Partner">Partner</option>
                        <option value="Merchant">Merchant</option>
                        <option value="Service Provider">Service Provider</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs text-[#cac7b8]">Industry Domain</label>
                      <select
                        value={newOrgIndustry}
                        onChange={(e) => setNewOrgIndustry(e.target.value)}
                        className="w-full bg-[#171b26] border border-[#262a35] rounded-lg px-3 py-2 text-xs text-[#dfe2f0] focus:outline-none focus:border-[#e4e1a9]"
                      >
                        <option value="F&B">F&B (Food &amp; Beverage)</option>
                        <option value="Retail">Retail &amp; Apparel</option>
                        <option value="Fitness">Fitness &amp; Wellness</option>
                        <option value="Travel">Travel &amp; Hospitality</option>
                        <option value="Entertainment">Entertainment &amp; Arts</option>
                        <option value="SaaS">SaaS &amp; Digital Services</option>
                        <option value="Community">Community &amp; Co-working</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Business Goals */}
              {wizardStep === 2 && (
                <div className="space-y-3">
                  <p className="text-xs text-[#cac7b8]">
                    Select the primary outcomes you want your credit loyalty program to accomplish:
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      'Increase repeat purchases',
                      'Increase referrals',
                      'Drive physical store visits',
                      'Increase social engagement',
                      'Acquire new customers',
                      'Reactivate dormant users',
                      'Increase 30-day retention',
                      'Promote higher-margin items',
                    ].map((goal) => {
                      const isSelected = selectedGoals.includes(goal);
                      return (
                        <button
                          key={goal}
                          type="button"
                          onClick={() => {
                            setSelectedGoals(
                              isSelected ? selectedGoals.filter((g) => g !== goal) : [...selectedGoals, goal]
                            );
                          }}
                          className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? 'bg-[#1b1f2a] border-[#e4e1a9] text-[#e4e1a9]'
                              : 'bg-[#171b26] border-[#262a35] text-[#939183] hover:text-[#dfe2f0]'
                          }`}
                        >
                          <span>{goal}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#e4e1a9]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 3: Choose Credit Samples */}
              {wizardStep === 3 && (
                <div className="space-y-3">
                  <p className="text-xs text-[#cac7b8]">
                    Recommended credit templates based on <strong>{newOrgIndustry}</strong>:
                  </p>
                  <div className="space-y-2 text-xs">
                    {[
                      {
                        title: 'Visit Store (+20 CRD)',
                        desc: 'Daily check-in on QR scan or counter check',
                        cost: '~$0.20 per visit',
                      },
                      {
                        title: 'Purchase Specialty Item (+100 CRD)',
                        desc: 'Disburses on completed POS purchase',
                        cost: '~$1.00 per transaction',
                      },
                      {
                        title: 'Spend $10 Threshold (+100 CRD)',
                        desc: 'Rebates 10% in credit for orders above $10',
                        cost: 'Effective 10% loyalty rebate',
                      },
                      {
                        title: 'Refer Friend (+200 CRD)',
                        desc: 'Double-sided referral on referee first purchase',
                        cost: '~$2.00 customer acquisition',
                      },
                    ].map((preset) => (
                      <div
                        key={preset.title}
                        onClick={() => setSelectedSamplePreset(preset.title)}
                        className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                          selectedSamplePreset === preset.title
                            ? 'bg-[#1b1f2a] border-[#e4e1a9] text-[#dfe2f0]'
                            : 'bg-[#171b26] border-[#262a35] text-[#939183] hover:text-[#dfe2f0]'
                        }`}
                      >
                        <div>
                          <div className="font-semibold text-xs text-[#dfe2f0]">{preset.title}</div>
                          <div className="text-[11px] text-[#939183] mt-0.5">{preset.desc}</div>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-mono text-[#c8c58f]">{preset.cost}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4: Customize */}
              {wizardStep === 4 && (
                <div className="space-y-3.5">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="space-y-1.5">
                      <label className="text-[#cac7b8]">Monthly Credit Budget</label>
                      <input
                        type="number"
                        value={newOrgBudget}
                        onChange={(e) => setNewOrgBudget(Number(e.target.value))}
                        step={10000}
                        min={10000}
                        className="w-full bg-[#171b26] border border-[#262a35] rounded-lg px-3 py-2 font-mono text-sm text-[#dfe2f0] focus:outline-none focus:border-[#e4e1a9]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[#cac7b8]">Target Audience</label>
                      <select className="w-full bg-[#171b26] border border-[#262a35] rounded-lg px-3 py-2 text-xs text-[#dfe2f0] focus:outline-none focus:border-[#e4e1a9]">
                        <option>All local district users</option>
                        <option>Registered loyalty members</option>
                        <option>Cross-network partner customers</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="space-y-1.5">
                      <label className="text-[#cac7b8]">Primary Contact Name</label>
                      <input
                        type="text"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="Owner or Manager name"
                        className="w-full bg-[#171b26] border border-[#262a35] rounded-lg px-3 py-2 text-xs text-[#dfe2f0] focus:outline-none focus:border-[#e4e1a9]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[#cac7b8]">Contact Email</label>
                      <input
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="contact@brand.io"
                        className="w-full bg-[#171b26] border border-[#262a35] rounded-lg px-3 py-2 text-xs text-[#dfe2f0] focus:outline-none focus:border-[#e4e1a9]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Preview */}
              {wizardStep === 5 && (
                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-[#171b26] border border-[#262a35] space-y-2">
                    <div className="flex items-center justify-between pb-2 border-b border-[#262a35]">
                      <span className="font-bold text-[#dfe2f0]">{newOrgName || 'New Organization'}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1b1f2a] text-[#c8c58f]">
                        {newOrgType} · {newOrgIndustry}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 py-1 text-center font-mono">
                      <div className="p-2 rounded bg-[#141824] border border-[#262a35]">
                        <div className="text-[10px] text-[#939183] font-sans">Projected Users</div>
                        <div className="text-sm font-bold text-[#dfe2f0] mt-0.5">350 - 600</div>
                      </div>
                      <div className="p-2 rounded bg-[#141824] border border-[#262a35]">
                        <div className="text-[10px] text-[#939183] font-sans">Monthly Cap</div>
                        <div className="text-sm font-bold text-[#e4e1a9] mt-0.5">
                          {newOrgBudget.toLocaleString()} CRD
                        </div>
                      </div>
                      <div className="p-2 rounded bg-[#141824] border border-[#262a35]">
                        <div className="text-[10px] text-[#939183] font-sans">Expected Quests</div>
                        <div className="text-sm font-bold text-emerald-400 mt-0.5">3 Quests</div>
                      </div>
                    </div>

                    <div className="text-[11px] text-[#939183] space-y-1 pt-1">
                      <div>
                        <strong>Selected Rule:</strong> {selectedSamplePreset}
                      </div>
                      <div>
                        <strong>Focus Goals:</strong> {selectedGoals.join(', ')}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 6: Publish */}
              {wizardStep === 6 && (
                <div className="space-y-4 text-center py-4 text-xs">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center mx-auto border border-emerald-500/40">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#dfe2f0]">Ready for Platform Deployment</h4>
                    <p className="text-xs text-[#939183] max-w-md mx-auto mt-1">
                      Your organization configuration complies with all double-entry ledger balance rules and risk policies.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-[#171b26] border border-[#262a35] max-w-md mx-auto text-left space-y-1">
                    <div className="text-[#dfe2f0] font-semibold">Deployment Parameters:</div>
                    <div className="text-[11px] text-[#939183]">
                      Organization: <strong>{newOrgName}</strong> · Type: {newOrgType}
                    </div>
                    <div className="text-[11px] text-[#939183]">
                      Budget: {newOrgBudget.toLocaleString()} CRD · Status: Live Active
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Action Controls */}
            <div className="flex items-center justify-between pt-3 border-t border-[#262a35]">
              <button
                type="button"
                disabled={wizardStep === 1}
                onClick={() => setWizardStep((prev) => Math.max(1, prev - 1))}
                className="px-3 py-1.5 rounded-lg bg-[#1b1f2a] text-[#939183] hover:text-[#dfe2f0] text-xs disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                Back
              </button>

              <div className="flex items-center gap-2">
                {wizardStep < 6 ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (wizardStep === 1 && !newOrgName) {
                        setNewOrgName('New Artisan Collective');
                      }
                      setWizardStep((prev) => Math.min(6, prev + 1));
                    }}
                    className="px-4 py-1.5 rounded-lg bg-[#e4e1a9] hover:bg-[#d8d598] text-[#171b26] font-semibold text-xs transition-colors cursor-pointer"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleFinishOnboarding}
                    className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Publish &amp; Open Workspace</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Campaign Builder Modal (MCP Programmable Demand Layer) */}
      <AICampaignBuilderModal
        isOpen={showAiCampaignBuilder}
        onClose={() => setShowAiCampaignBuilder(false)}
      />
    </div>
  );
};
