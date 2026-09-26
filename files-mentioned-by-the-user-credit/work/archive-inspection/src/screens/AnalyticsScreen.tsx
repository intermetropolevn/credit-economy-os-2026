import React, { useState } from 'react';
import { useEconomic } from '../context/EconomicContext';
import {
  BarChart3,
  TrendingUp,
  Users,
  Target,
  Award,
  Sparkles,
  DollarSign,
  Building2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Filter,
  Check,
  Compass,
  Tag,
  Layers,
  FlaskConical,
  Sliders,
} from 'lucide-react';
import { FunnelAIAssistant } from '../components/FunnelAIAssistant';
import { CampaignAIIntelligence } from '../components/CampaignAIIntelligence';
import { PoolAIIntelligence } from '../components/PoolAIIntelligence';
import { AICampaignBuilderModal } from '../components/AICampaignBuilderModal';

export const AnalyticsScreen: React.FC = () => {
  const { organizations } = useEconomic();

  const [selectedOrgFilter, setSelectedOrgFilter] = useState<string>('ALL');
  const [activeTab, setActiveTab] = useState<'funnel' | 'campaigns' | 'pools' | 'macro'>('funnel');
  const [showAiCampaignBuilder, setShowAiCampaignBuilder] = useState(false);
  const [builderPrefillQuery, setBuilderPrefillQuery] = useState<string | undefined>(undefined);

  const selectedOrg = organizations.find((o) => o.id === selectedOrgFilter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#262a35]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-[#dfe2f0] flex items-center gap-2.5">
              <BarChart3 className="w-6 h-6 text-[#e4e1a9]" />
              <span>Ecosystem Analytics &amp; Intelligence</span>
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#1b1f2a] text-[#c8c58f] border border-[#262a35] font-mono">
              MCP-Powered Governance
            </span>
          </div>
          <p className="text-xs text-[#939183] mt-1">
            Cohort engagement, multi-touch quest funnels, credit circulation velocity, and AI optimization recommendations.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowAiCampaignBuilder(true)}
            className="px-3.5 py-1.5 rounded-xl bg-[#e4e1a9] hover:bg-[#d8d598] text-[#171b26] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Campaign Builder</span>
          </button>

          {/* Organization Filter */}
          <div className="flex items-center gap-2 text-xs bg-[#141824] p-2 rounded-xl border border-[#262a35]">
            <span className="text-[#939183]">Scope:</span>
            <select
              value={selectedOrgFilter}
              onChange={(e) => setSelectedOrgFilter(e.target.value)}
              className="bg-[#171b26] border border-[#262a35] rounded-lg px-2.5 py-1 text-xs text-[#dfe2f0] font-medium focus:outline-none focus:border-[#e4e1a9]"
            >
              <option value="ALL">All Platform Organizations</option>
              {organizations.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name} ({o.type})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Top 6 Core Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-mono">
        <div className="bg-[#141824] border border-[#262a35] rounded-xl p-3.5 space-y-1">
          <div className="text-[10px] text-[#939183] font-sans">Users Reached</div>
          <div className="text-xl font-bold font-mono text-[#dfe2f0]">
            {selectedOrg ? '2,400' : '8,450'}
          </div>
          <div className="text-[10px] text-emerald-400 font-sans">+18.2% vs last month</div>
        </div>

        <div className="bg-[#141824] border border-[#262a35] rounded-xl p-3.5 space-y-1">
          <div className="text-[10px] text-[#939183] font-sans">Active Participants</div>
          <div className="text-xl font-bold font-mono text-[#e4e1a9]">
            {selectedOrg ? '1,240' : '4,820'}
          </div>
          <div className="text-[10px] text-[#939183] font-sans">57% active participation</div>
        </div>

        <div className="bg-[#141824] border border-[#262a35] rounded-xl p-3.5 space-y-1">
          <div className="text-[10px] text-[#939183] font-sans">Quest Completions</div>
          <div className="text-xl font-bold font-mono text-emerald-300">
            {selectedOrg ? '840' : '3,412'}
          </div>
          <div className="text-[10px] text-[#939183] font-sans">Across active quests</div>
        </div>

        <div className="bg-[#141824] border border-[#262a35] rounded-xl p-3.5 space-y-1">
          <div className="text-[10px] text-[#939183] font-sans">Campaign Conversion</div>
          <div className="text-xl font-bold font-mono text-[#dfe2f0]">
            {selectedOrg ? `${selectedOrg.campaignConversion}%` : '46.4%'}
          </div>
          <div className="text-[10px] text-emerald-400 font-sans">+4.1% cohort lift</div>
        </div>

        <div className="bg-[#141824] border border-[#262a35] rounded-xl p-3.5 space-y-1">
          <div className="text-[10px] text-[#939183] font-sans">Avg Credits / User</div>
          <div className="text-xl font-bold font-mono text-[#e4e1a9]">
            {selectedOrg ? '152 CRD' : '168 CRD'}
          </div>
          <div className="text-[10px] text-[#939183] font-sans">Per active participant</div>
        </div>

        <div className="bg-[#141824] border border-[#262a35] rounded-xl p-3.5 space-y-1">
          <div className="text-[10px] text-[#939183] font-sans">Budget Utilization</div>
          <div className="text-xl font-bold font-mono text-emerald-400">
            {selectedOrg
              ? `${Math.round((selectedOrg.budgetUsed / selectedOrg.monthlyBudget) * 100)}%`
              : '74%'}
          </div>
          <div className="text-[10px] text-[#939183] font-sans">Within monthly safe caps</div>
        </div>
      </div>

      {/* Primary Analytics Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto text-xs bg-[#141824] p-1 rounded-xl border border-[#262a35]">
        {[
          { id: 'funnel', label: 'Funnel Analytics (MCP AI)', icon: BarChart3 },
          { id: 'campaigns', label: 'Campaign Analytics (MCP AI)', icon: Target },
          { id: 'pools', label: 'Pool Analytics & Inventory (MCP)', icon: Compass },
          { id: 'macro', label: 'Macro Economic Paradigm', icon: Layers },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap font-medium ${
                activeTab === tab.id
                  ? 'bg-[#1b1f2a] text-[#e4e1a9] shadow-sm font-semibold'
                  : 'text-[#939183] hover:text-[#dfe2f0]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* 1. FUNNEL ANALYTICS TAB                                  */}
      {/* ======================================================== */}
      {activeTab === 'funnel' && (
        <div className="space-y-6">
          {/* Main Grid: Funnel Visualization + AI Optimization Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
            {/* Left Column (8 cols): Funnel Visualization */}
            <div className="lg:col-span-8 bg-[#141824] border border-[#262a35] rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#262a35]">
                <div>
                  <h3 className="font-bold text-sm text-[#dfe2f0]">
                    Ecosystem Lifecycle Funnel ({selectedOrg ? selectedOrg.name : 'All Platform'})
                  </h3>
                  <p className="text-[11px] text-[#939183] mt-0.5">
                    Progression from initial brand audience reach to completed quest and credit redemption.
                  </p>
                </div>
                <span className="text-[10px] font-mono text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                  Drop-Off Detected (-26%)
                </span>
              </div>

              <div className="space-y-3">
                {[
                  {
                    stage: 'Audience Reach',
                    users: selectedOrg ? 2400 : 8450,
                    pct: 100,
                    drop: '0%',
                    desc: 'Impression via POS, QR sticker, social or app feed',
                  },
                  {
                    stage: 'Eligible Users',
                    users: selectedOrg ? 1850 : 6800,
                    pct: 80,
                    drop: '-20%',
                    desc: 'Passed age, region, and initial wallet check',
                  },
                  {
                    stage: 'Quest Started',
                    users: selectedOrg ? 1240 : 4820,
                    pct: 54,
                    drop: '-26%',
                    desc: 'User commenced required action (e.g. ordered first item)',
                    isLargestDrop: true,
                  },
                  {
                    stage: 'Quest Completed',
                    users: selectedOrg ? 840 : 3412,
                    pct: 40,
                    drop: '-14%',
                    desc: 'Verified event condition met (e.g. 2nd coffee bought)',
                  },
                  {
                    stage: 'Credits Earned',
                    users: selectedOrg ? 840 : 3412,
                    pct: 40,
                    drop: '0%',
                    desc: 'Cryptographic ledger credit journal committed',
                  },
                  {
                    stage: 'Redeemed in Reward Pool',
                    users: selectedOrg ? 540 : 2190,
                    pct: 26,
                    drop: '-14%',
                    desc: 'Voucher or item redeemed at counter or partner',
                  },
                ].map((step, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl border transition-all ${
                      step.isLargestDrop
                        ? 'bg-[#1b1f2a] border-amber-500/40 ring-1 ring-amber-500/20'
                        : 'bg-[#171b26] border-[#262a35]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#141824] text-[#c8c58f] font-mono text-[10px] flex items-center justify-center font-bold">
                          {idx + 1}
                        </span>
                        <span className="font-semibold text-xs text-[#dfe2f0]">{step.stage}</span>
                        {step.isLargestDrop && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-medium">
                            Largest Drop-Off ({step.drop})
                          </span>
                        )}
                      </div>

                      <div className="font-mono flex items-center gap-3">
                        <span className="text-sm font-bold text-[#e4e1a9]">
                          {step.users.toLocaleString()}
                        </span>
                        <span className="text-[11px] text-[#939183]">({step.pct}%)</span>
                        <span
                          className={`text-[10px] ${
                            step.drop === '0%' ? 'text-emerald-400' : 'text-amber-400'
                          }`}
                        >
                          {step.drop}
                        </span>
                      </div>
                    </div>

                    <div className="w-full bg-[#141824] rounded-full h-2 overflow-hidden mb-1.5">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          step.isLargestDrop ? 'bg-amber-400' : 'bg-[#e4e1a9]'
                        }`}
                        style={{ width: `${step.pct}%` }}
                      />
                    </div>

                    <div className="text-[10px] text-[#939183]">{step.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column (4 cols): AI Recommendation Panel */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-[#141824] border border-[#262a35] rounded-xl p-5 space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-[#262a35]">
                  <Sparkles className="w-4 h-4 text-[#e4e1a9]" />
                  <h3 className="font-bold text-sm text-[#dfe2f0]">AI Decision Recommendations</h3>
                </div>

                <div className="space-y-3.5">
                  <div className="p-3.5 rounded-lg bg-[#171b26] border border-amber-500/30 space-y-2">
                    <div className="flex items-center gap-1.5 font-bold text-amber-300">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Friction Drop-Off Signal</span>
                    </div>
                    <p className="text-[#dfe2f0] leading-relaxed">
                      "42% of eligible users drop before completing the second action."
                    </p>
                    <div className="text-[11px] text-[#939183] pt-1 border-t border-[#262a35]">
                      <strong className="text-[#dfe2f0]">Recommendation:</strong> Consider reducing the quest from 3 actions to 2 for first-time patrons.
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-[#171b26] border border-[#3b4152] space-y-2">
                    <div className="flex items-center gap-1.5 font-bold text-[#e4e1a9]">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>Budget Forecast Advisory</span>
                    </div>
                    <p className="text-[#dfe2f0] leading-relaxed">
                      "Projected credit cost for Summer Coffee Fest may exceed current monthly budget by 12% at current velocity."
                    </p>
                    <div className="text-[11px] text-[#939183] pt-1 border-t border-[#262a35]">
                      <strong className="text-[#dfe2f0]">Recommendation:</strong> Implement a daily cap of 1,500 CRD or recalibrate referral bonus to maintain margin.
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-[#171b26] border border-emerald-500/30 space-y-2">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Cross-Vendor Synergies</span>
                    </div>
                    <p className="text-[#dfe2f0] leading-relaxed">
                      "Patrons who earn credits at Saigon Fitness exhibit 3.2x higher redemption velocity at ABC Coffee and Nomad Stay."
                    </p>
                    <div className="text-[11px] text-[#939183] pt-1 border-t border-[#262a35]">
                      <strong className="text-[#dfe2f0]">Recommendation:</strong> Form an automated cross-brand loyalty bundle between wellness and coffee vendors.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dedicated MCP Funnel AI Assistant */}
          <FunnelAIAssistant
            onOpenCampaignBuilder={(query) => {
              setBuilderPrefillQuery(query);
              setShowAiCampaignBuilder(true);
            }}
          />
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. CAMPAIGN ANALYTICS TAB                                */}
      {/* ======================================================== */}
      {activeTab === 'campaigns' && (
        <CampaignAIIntelligence
          onOpenCampaignBuilder={() => {
            setShowAiCampaignBuilder(true);
          }}
        />
      )}

      {/* ======================================================== */}
      {/* 3. POOL ANALYTICS TAB                                    */}
      {/* ======================================================== */}
      {activeTab === 'pools' && (
        <div className="space-y-6">
          <PoolAIIntelligence />
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. MACRO ECONOMIC PARADIGM TAB                           */}
      {/* ======================================================== */}
      {(activeTab === 'macro' || activeTab === 'pools') && (
        <div className="bg-[#141824] border border-[#262a35] rounded-xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#262a35]">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#e4e1a9]">
                  Macro Economic Analytics
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#1b1f2a] text-[#dfe2f0] border border-[#262a35] font-mono">
                  Paradigm Separation
                </span>
              </div>
              <h3 className="text-base font-bold text-[#dfe2f0] mt-0.5">
                Reward Catalog (Inventory-Centric) vs Destination Pools (Demand-Centric)
              </h3>
              <p className="text-xs text-[#939183]">
                Empirical metrics demonstrating why Pools function as destination-selection coordination mechanisms rather than coupon storefronts.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-[#939183]">
              <span className="px-2 py-1 rounded bg-[#171b26] border border-[#262a35]">
                Cohort Window: 30 Days
              </span>
            </div>
          </div>

          {/* 2 Comparative Metric Column Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Catalog Metrics */}
            <div className="p-4 rounded-xl bg-[#171b26] border border-[#262a35] space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#262a35]">
                <span className="font-bold text-[#dfe2f0] flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#939183]" />
                  <span>REWARD CATALOG &bull; INVENTORY LAYER</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#141824] text-[#939183]">
                  Spot Clearance
                </span>
              </div>
              <div className="text-[11px] text-[#939183] italic">
                Answers &ldquo;What rewards are available?&rdquo;
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <div className="p-2.5 rounded-lg bg-[#141824] border border-[#262a35]">
                  <div className="text-[10px] text-[#939183] font-mono">Conversion Velocity</div>
                  <div className="text-base font-bold font-mono text-[#dfe2f0]">18.4%</div>
                  <div className="text-[10px] text-[#939183]">Immediate spot checkout</div>
                </div>
                <div className="p-2.5 rounded-lg bg-[#141824] border border-[#262a35]">
                  <div className="text-[10px] text-[#939183] font-mono">Average Engagement</div>
                  <div className="text-base font-bold font-mono text-[#dfe2f0]">1.2 days</div>
                  <div className="text-[10px] text-[#939183]">Single transaction bounce</div>
                </div>
                <div className="p-2.5 rounded-lg bg-[#141824] border border-[#262a35]">
                  <div className="text-[10px] text-[#939183] font-mono">Stock Turnover</div>
                  <div className="text-base font-bold font-mono text-[#dfe2f0]">4.2x / mo</div>
                  <div className="text-[10px] text-[#939183]">Merchant inventory clearance</div>
                </div>
                <div className="p-2.5 rounded-lg bg-[#141824] border border-[#262a35]">
                  <div className="text-[10px] text-[#939183] font-mono">Funding Source</div>
                  <div className="text-base font-bold font-mono text-[#dfe2f0]">Single Org</div>
                  <div className="text-[10px] text-[#939183]">Isolated merchant balance</div>
                </div>
              </div>
            </div>

            {/* Destination Pool Metrics */}
            <div className="p-4 rounded-xl bg-[#171b26] border border-[#e4e1a9]/40 space-y-3 ring-1 ring-[#e4e1a9]/20">
              <div className="flex items-center justify-between pb-2 border-b border-[#262a35]">
                <span className="font-bold text-[#e4e1a9] flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#e4e1a9]" />
                  <span>DESTINATION POOL &bull; DEMAND LAYER</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#e4e1a9]/20 text-[#e4e1a9] font-bold">
                  Goal Accumulation
                </span>
              </div>
              <div className="text-[11px] text-[#e4e1a9] italic">
                Answers &ldquo;What destination do I want to accumulate toward?&rdquo;
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <div className="p-2.5 rounded-lg bg-[#141824] border border-[#262a35]">
                  <div className="text-[10px] text-[#939183] font-mono">Goal Lock-In Rate</div>
                  <div className="text-base font-bold font-mono text-[#e4e1a9]">76.2%</div>
                  <div className="text-[10px] text-emerald-400">Credits locked in goals</div>
                </div>
                <div className="p-2.5 rounded-lg bg-[#141824] border border-[#262a35]">
                  <div className="text-[10px] text-[#939183] font-mono">Average Engagement</div>
                  <div className="text-base font-bold font-mono text-[#e4e1a9]">26.4 days</div>
                  <div className="text-[10px] text-emerald-400">22x sustained retention</div>
                </div>
                <div className="p-2.5 rounded-lg bg-[#141824] border border-[#262a35]">
                  <div className="text-[10px] text-[#939183] font-mono">Inventory Absorption</div>
                  <div className="text-base font-bold font-mono text-emerald-300">84.0%</div>
                  <div className="text-[10px] text-[#939183]">Capacity reserved by demand</div>
                </div>
                <div className="p-2.5 rounded-lg bg-[#141824] border border-[#262a35]">
                  <div className="text-[10px] text-[#939183] font-mono">Shared Funding</div>
                  <div className="text-base font-bold font-mono text-[#e4e1a9]">5 Partners</div>
                  <div className="text-[10px] text-[#939183]">Co-sponsored liquidity</div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Insight Summary Banner */}
          <div className="p-3.5 rounded-lg bg-[#10141f] border border-[#262a35] text-xs flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-[#e4e1a9] shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold text-[#dfe2f0]">Macro Economic Insight:</span>{' '}
              <span className="text-[#cac7b8]">
                Destination Pools shift participant psychology from <em>&ldquo;spending unearned discount coupons&rdquo;</em> to <em>&ldquo;building toward high-value lifestyle destinations&rdquo;</em>.
                This increases cross-partner quest completion by <strong>3.4x</strong>, because credits are viewed as accumulating progress toward aspirational destinations (e.g. Weekend Stay) rather than passive store vouchers.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* AI Campaign Builder Modal (if triggered from Funnel or Campaign actions) */}
      <AICampaignBuilderModal
        isOpen={showAiCampaignBuilder}
        onClose={() => {
          setShowAiCampaignBuilder(false);
          setBuilderPrefillQuery(undefined);
        }}
        initialIntent={builderPrefillQuery}
      />
    </div>
  );
};
