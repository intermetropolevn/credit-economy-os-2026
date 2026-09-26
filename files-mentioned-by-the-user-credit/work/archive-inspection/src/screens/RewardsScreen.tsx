import React, { useState, useMemo, useEffect } from 'react';
import { useEconomic } from '../context/EconomicContext';
import { BenefitPool, PoolType, PoolStatus, RewardPoolItem, BenefitType } from '../types';
import {
  Gift,
  Plus,
  Search,
  CheckCircle2,
  DollarSign,
  Users,
  Store,
  ArrowRight,
  TrendingUp,
  Tag,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  Check,
  AlertCircle,
  Layers,
  Target,
  Clock,
  Filter,
  Download,
  ArrowUpRight,
  BarChart3,
  ShieldCheck,
  ChevronRight,
  LayoutGrid,
  List,
  FileSpreadsheet,
  X,
  Building2,
  Calendar,
  Percent,
  Compass,
} from 'lucide-react';

export const RewardsScreen: React.FC = () => {
  const {
    rewardPools,
    users,
    selectedUserId,
    setSelectedUserId,
    redeemRewardPoolItem,
    pools,
    selectedPoolId,
    setSelectedPoolId,
    createPool,
    organizations,
    currentPath,
    navigate,
  } = useEconomic();

  // Tab State: catalog | inventory | redemptions | pools
  const [activeTab, setActiveTab] = useState<'catalog' | 'pools' | 'redemptions' | 'inventory'>('catalog');

  useEffect(() => {
    if (currentPath.includes('tab=catalog') || currentPath === '/rewards') {
      setActiveTab('catalog');
    } else if (currentPath.includes('tab=redemptions')) {
      setActiveTab('redemptions');
    } else if (currentPath.includes('tab=inventory')) {
      setActiveTab('inventory');
    } else if (currentPath.includes('tab=pools')) {
      setActiveTab('pools');
    }
  }, [currentPath]);

  // Selected patron for testing
  const selectedUser = users.find((u) => u.id === selectedUserId) || users[0];

  // Feedback notifications
  const [toastMsg, setToastMsg] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);
  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMsg({ text, type });
    setTimeout(() => setToastMsg(null), 4000);
  };

  // ==========================================
  // POOLS TAB STATE & FILTERS
  // ==========================================
  const [poolSearch, setPoolSearch] = useState('');
  const [poolTypeFilter, setPoolTypeFilter] = useState<'ALL' | PoolType>('ALL');
  const [poolStatusFilter, setPoolStatusFilter] = useState<'ALL' | PoolStatus>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Create Pool Modal
  const [showCreatePoolModal, setShowCreatePoolModal] = useState(false);
  const [newPoolName, setNewPoolName] = useState('');
  const [newPoolTagline, setNewPoolTagline] = useState('');
  const [newPoolDescription, setNewPoolDescription] = useState('');
  const [newPoolType, setNewPoolType] = useState<PoolType>('Lifestyle');
  const [newPoolStatus, setNewPoolStatus] = useState<PoolStatus>('Active');
  const [newPoolOwnerOrg, setNewPoolOwnerOrg] = useState(organizations[0]?.id || 'org-platform-treasury');
  const [newPoolFunding, setNewPoolFunding] = useState<number>(30000);
  const [newPoolDurationStart, setNewPoolDurationStart] = useState('2026-10-01');
  const [newPoolDurationEnd, setNewPoolDurationEnd] = useState('2026-12-31');

  // ==========================================
  // CATALOG TAB STATE
  // ==========================================
  const [catalogSearch, setCatalogSearch] = useState('');
  const [catalogCategoryFilter, setCatalogCategoryFilter] = useState<string>('ALL');

  // ==========================================
  // REDEMPTIONS TAB STATE
  // ==========================================
  const [redemptionSearch, setRedemptionSearch] = useState('');

  // ==========================================
  // INVENTORY TAB STATE
  // ==========================================
  const [inventorySearch, setInventorySearch] = useState('');

  // KPI Calculations
  const totalFunding = useMemo(() => {
    return pools.reduce((sum, p) => sum + p.totalFundingCredits, 0);
  }, [pools]);

  const totalCommitted = useMemo(() => {
    return pools.reduce((sum, p) => sum + p.committedCredits, 0);
  }, [pools]);

  const totalParticipants = useMemo(() => {
    return pools.reduce((sum, p) => sum + p.participantsCount, 0);
  }, [pools]);

  const totalPoolRedemptions = useMemo(() => {
    return pools.reduce((sum, p) => {
      const redCount = p.benefits.reduce((bSum, b) => bSum + b.redeemedCount, 0);
      return sum + (p.redemptions?.length || redCount);
    }, 0);
  }, [pools]);

  const activePoolsCount = useMemo(() => {
    return pools.filter((p) => p.status === 'Active').length;
  }, [pools]);

  // Filtered Pools
  const filteredPools = useMemo(() => {
    return pools.filter((pool) => {
      const matchesSearch =
        pool.name.toLowerCase().includes(poolSearch.toLowerCase()) ||
        pool.tagline.toLowerCase().includes(poolSearch.toLowerCase()) ||
        pool.owner.toLowerCase().includes(poolSearch.toLowerCase());
      const matchesType = poolTypeFilter === 'ALL' || pool.type === poolTypeFilter;
      const matchesStatus = poolStatusFilter === 'ALL' || pool.status === poolStatusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [pools, poolSearch, poolTypeFilter, poolStatusFilter]);

  // Filtered Catalog Items
  const filteredCatalog = useMemo(() => {
    return rewardPools.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
        item.organizationName.toLowerCase().includes(catalogSearch.toLowerCase()) ||
        item.description.toLowerCase().includes(catalogSearch.toLowerCase());
      const matchesCat = catalogCategoryFilter === 'ALL' || item.category === catalogCategoryFilter;
      return matchesSearch && matchesCat;
    });
  }, [rewardPools, catalogSearch, catalogCategoryFilter]);

  // Aggregated Redemptions across pools and catalog
  const allRedemptions = useMemo(() => {
    const list: Array<{
      id: string;
      source: string;
      sourceType: 'POOL' | 'CATALOG';
      benefitName: string;
      benefitType: string;
      userName: string;
      providerName: string;
      creditsSpent: number;
      timestamp: string;
      status: string;
      ledgerTxId: string;
    }> = [];

    // From Pools
    pools.forEach((p) => {
      p.redemptions?.forEach((r) => {
        list.push({
          id: r.id,
          source: p.name,
          sourceType: 'POOL',
          benefitName: r.benefitName,
          benefitType: r.benefitType,
          userName: r.userName,
          providerName: r.providerOrgName,
          creditsSpent: r.creditsSpent,
          timestamp: r.timestamp,
          status: r.status,
          ledgerTxId: r.ledgerTransactionId,
        });
      });
    });

    // Seed additional realistic entries if list is small
    if (list.length < 5) {
      list.push(
        {
          id: 'RED-2026-1048',
          source: 'City Life Pool',
          sourceType: 'POOL',
          benefitName: 'Artisan Pour-Over Voucher',
          benefitType: 'Voucher',
          userName: 'Sarah Chen',
          providerName: 'ABC Coffee',
          creditsSpent: 300,
          timestamp: '18 minutes ago',
          status: 'COMPLETED',
          ledgerTxId: 'TX-LED-8821',
        },
        {
          id: 'RED-2026-1045',
          source: 'Travel Explorer',
          sourceType: 'POOL',
          benefitName: 'Aviation Lounge Pass',
          benefitType: 'Access',
          userName: 'Alex Chen',
          providerName: 'Platform Central Treasury',
          creditsSpent: 4200,
          timestamp: '2 hours ago',
          status: 'COMPLETED',
          ledgerTxId: 'TX-LED-8819',
        },
        {
          id: 'RED-2026-1042',
          source: 'City Life Pool',
          sourceType: 'POOL',
          benefitName: 'Free Specialty Coffee',
          benefitType: 'Freebie',
          userName: 'Emma Tran',
          providerName: 'ABC Coffee',
          creditsSpent: 500,
          timestamp: '4 hours ago',
          status: 'COMPLETED',
          ledgerTxId: 'TX-LED-8815',
        },
        {
          id: 'RED-2026-1039',
          source: 'Creator Pool',
          sourceType: 'POOL',
          benefitName: '500 GPU Compute Minutes',
          benefitType: 'Service',
          userName: 'David Nguyen',
          providerName: 'Synthetix AI Systems',
          creditsSpent: 1500,
          timestamp: 'Yesterday',
          status: 'COMPLETED',
          ledgerTxId: 'TX-LED-8802',
        },
        {
          id: 'RED-2026-1034',
          source: 'Wellness Pool',
          sourceType: 'POOL',
          benefitName: 'Cryotherapy & Cold Plunge Pass',
          benefitType: 'Experience',
          userName: 'Sarah Chen',
          providerName: 'Saigon Fitness',
          creditsSpent: 800,
          timestamp: '2 days ago',
          status: 'COMPLETED',
          ledgerTxId: 'TX-LED-8794',
        }
      );
    }

    return list.filter((r) => {
      const q = redemptionSearch.toLowerCase();
      return (
        r.id.toLowerCase().includes(q) ||
        r.userName.toLowerCase().includes(q) ||
        r.benefitName.toLowerCase().includes(q) ||
        r.providerName.toLowerCase().includes(q) ||
        r.source.toLowerCase().includes(q)
      );
    });
  }, [pools, redemptionSearch]);

  // Aggregated Inventory across pools and catalog
  const allInventory = useMemo(() => {
    const items: Array<{
      id: string;
      name: string;
      category: string;
      destination: string;
      destinationType: 'POOL' | 'CATALOG';
      providerName: string;
      totalStock: number;
      remainingStock: number;
      claimedStock: number;
      creditsCost: number;
      status: 'In Stock' | 'Low Stock' | 'Depleted';
    }> = [];

    // From Pools
    pools.forEach((p) => {
      p.benefits.forEach((b) => {
        const remaining = b.remainingInventory;
        const total = b.totalInventory;
        const claimed = b.redeemedCount;
        let st: 'In Stock' | 'Low Stock' | 'Depleted' = 'In Stock';
        if (remaining <= 0) st = 'Depleted';
        else if (remaining / total < 0.25) st = 'Low Stock';

        items.push({
          id: b.id,
          name: b.name,
          category: b.type,
          destination: p.name,
          destinationType: 'POOL',
          providerName: b.providerOrgName,
          totalStock: total,
          remainingStock: remaining,
          claimedStock: claimed,
          creditsCost: b.creditsCost,
          status: st,
        });
      });
    });

    // From Reward Catalog
    rewardPools.forEach((r) => {
      const remaining = r.remainingInventory;
      const claimed = r.totalRedeemed;
      const total = remaining + claimed;
      let st: 'In Stock' | 'Low Stock' | 'Depleted' = 'In Stock';
      if (remaining <= 0) st = 'Depleted';
      else if (remaining / (total || 1) < 0.2) st = 'Low Stock';

      items.push({
        id: r.id,
        name: r.name,
        category: r.category,
        destination: 'Direct Catalog',
        destinationType: 'CATALOG',
        providerName: r.organizationName,
        totalStock: total,
        remainingStock: remaining,
        claimedStock: claimed,
        creditsCost: r.creditsCost,
        status: st,
      });
    });

    return items.filter((inv) => {
      const q = inventorySearch.toLowerCase();
      return (
        inv.name.toLowerCase().includes(q) ||
        inv.providerName.toLowerCase().includes(q) ||
        inv.destination.toLowerCase().includes(q) ||
        inv.category.toLowerCase().includes(q)
      );
    });
  }, [pools, rewardPools, inventorySearch]);

  // Handle Catalog Direct Redemption
  const handleRedeemCatalog = (rewardId: string, rewardName: string) => {
    const success = redeemRewardPoolItem(selectedUser.id, rewardId);
    if (success) {
      showToast(`Successfully redeemed "${rewardName}" for ${selectedUser.name}! Recorded on ledger.`);
    } else {
      showToast(`Failed to redeem "${rewardName}". Check available credit balance.`, 'error');
    }
  };

  // Handle Create Pool Submit
  const handleCreatePoolSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPoolName.trim()) {
      showToast('Pool name is required', 'error');
      return;
    }

    const org = organizations.find((o) => o.id === newPoolOwnerOrg);
    const ownerName = org?.name || 'Credit Economy OS';

    const created = createPool({
      name: newPoolName.trim(),
      tagline: newPoolTagline.trim() || 'Shared credit destination for ecosystem participants.',
      description: newPoolDescription.trim() || 'Aggregates credits from participating merchants.',
      type: newPoolType,
      status: newPoolStatus,
      owner: ownerName,
      totalFundingCredits: Number(newPoolFunding) || 30000,
      committedCredits: 0,
      participantsCount: 0,
      redemptionRate: 0,
      durationStart: newPoolDurationStart,
      durationEnd: newPoolDurationEnd,
    });

    setShowCreatePoolModal(false);
    setNewPoolName('');
    setNewPoolTagline('');
    setNewPoolDescription('');
    showToast(`Pool "${created.name}" created successfully!`);
    setSelectedPoolId(created.id);
    navigate(`/rewards/pools/${created.id}`);
  };

  // Handle Export
  const handleExportData = () => {
    const exportSummary = {
      exportedAt: new Date().toISOString(),
      activePools: activePoolsCount,
      totalPoolFunding: totalFunding,
      creditsAllocated: totalCommitted,
      activeParticipants: totalParticipants,
      pools: pools.map((p) => ({
        id: p.id,
        name: p.name,
        type: p.type,
        status: p.status,
        funding: p.totalFundingCredits,
        committed: p.committedCredits,
        participants: p.participantsCount,
        benefitsCount: p.benefits.length,
        redemptionRate: `${p.redemptionRate}%`,
        duration: `${p.durationStart} to ${p.durationEnd}`,
      })),
    };

    const blob = new Blob([JSON.stringify(exportSummary, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `benefit-pools-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Exported Benefit Pools JSON successfully!');
  };

  // Helper for Pool Status Badge styling
  const getStatusBadge = (status: PoolStatus) => {
    switch (status) {
      case 'Active':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Active
          </span>
        );
      case 'Draft':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-500/10 text-amber-300 border border-amber-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Draft
          </span>
        );
      case 'Paused':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-neutral-500/10 text-neutral-300 border border-neutral-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
            Paused
          </span>
        );
      case 'Fully Redeemed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-500/10 text-blue-300 border border-blue-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            Fully Redeemed
          </span>
        );
      case 'Expired':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-red-500/10 text-red-300 border border-red-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
            Expired
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {toastMsg && (
        <div
          className={`p-3.5 rounded-xl border text-xs flex items-center justify-between gap-2 shadow-lg animate-fadeIn ${
            toastMsg.type === 'error'
              ? 'bg-red-500/10 border-red-500/40 text-red-300'
              : 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {toastMsg.type === 'error' ? (
              <AlertCircle className="w-4 h-4 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            )}
            <span>{toastMsg.text}</span>
          </div>
          <button
            onClick={() => setToastMsg(null)}
            className="text-current opacity-70 hover:opacity-100 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Screen Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#262a35]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-[#dfe2f0] flex items-center gap-2.5">
              <Gift className="w-6 h-6 text-[#c8c58f]" />
              <span>Rewards &amp; Benefit Coordination</span>
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#1b1f2a] text-[#c8c58f] border border-[#262a35] font-mono">
              Credit OS Layer
            </span>
          </div>
          <p className="text-xs text-[#939183] mt-1">
            Connects centralized credit ledgers to decentralized partner benefit pools, reward catalogs, and merchant redemptions.
          </p>
        </div>

        {/* Global Test Patron Selector & AI Matcher */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              window.dispatchEvent(
                new CustomEvent('open-credit-economy-ai', {
                  detail: { query: 'Find benefits I can redeem with 700 Credits.' },
                })
              );
            }}
            className="px-3 py-1.5 rounded-xl bg-[#141824] hover:bg-[#1b1f2a] border border-[#e4e1a9]/40 text-[#e4e1a9] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            title="Ask AI to find affordable perks and destination benefits"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#e4e1a9]" />
            <span>AI Perk Matcher (MCP)</span>
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

      {/* Architectural Distinction Banner */}
      <div className="p-3.5 rounded-xl bg-[#141824] border border-[#262a35] text-xs flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#1b1f2a] border border-[#262a35] flex items-center justify-center shrink-0">
            <Tag className="w-4 h-4 text-[#e4e1a9]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#dfe2f0]">Reward Catalog &mdash; Inventory Layer</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#171b26] text-[#939183] border border-[#262a35]">
                INVENTORY-CENTRIC
              </span>
            </div>
            <p className="text-[11px] text-[#939183] mt-0.5">
              Answers &ldquo;What rewards are available?&rdquo; &mdash; single-merchant spot items, prices, available stock, and direct checkout burns.
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/pools')}
          className="px-3.5 py-1.5 rounded-lg bg-[#e4e1a9]/10 hover:bg-[#e4e1a9]/20 text-[#e4e1a9] border border-[#e4e1a9]/30 font-semibold flex items-center gap-1.5 text-xs transition-colors shrink-0 cursor-pointer"
        >
          <Compass className="w-3.5 h-3.5 text-[#e4e1a9]" />
          <span>Switch to Destination Pools (Demand &amp; Accumulate) &rarr;</span>
        </button>
      </div>

      {/* 4 Primary Navigation Tabs under Rewards */}
      <div className="flex items-center gap-1 border-b border-[#262a35] overflow-x-auto pb-px">
        {[
          {
            id: 'catalog',
            label: 'Reward Catalog',
            count: rewardPools.length,
            icon: Tag,
            badge: 'INVENTORY-CENTRIC',
          },
          {
            id: 'inventory',
            label: 'Merchant Inventory',
            count: allInventory.length,
            icon: ShoppingBag,
          },
          {
            id: 'redemptions',
            label: 'Redemptions Log',
            count: allRedemptions.length,
            icon: CheckCircle2,
          },
          {
            id: 'pools',
            label: 'Destination Pools',
            count: pools.length,
            icon: Compass,
            badge: 'DEMAND-CENTRIC',
          },
        ].map((tab) => {
          const isSelected = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === 'pools') {
                  navigate('/pools');
                } else {
                  setActiveTab(tab.id as any);
                  navigate(`/rewards?tab=${tab.id}`);
                }
              }}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-all cursor-pointer border-b-2 whitespace-nowrap relative ${
                isSelected
                  ? 'border-[#e4e1a9] text-[#e4e1a9] bg-[#141824]'
                  : 'border-transparent text-[#939183] hover:text-[#dfe2f0] hover:bg-[#141824]/50'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#e4e1a9]' : 'text-[#939183]'}`} />
              <span>{tab.label}</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  isSelected
                    ? 'bg-[#1b1f2a] text-[#e4e1a9] border border-[#262a35]'
                    : 'bg-[#141824] text-[#939183]'
                }`}
              >
                {tab.count}
              </span>
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
      {/* TAB 1: BENEFIT POOLS (CORE DEMAND DESTINATIONS)          */}
      {/* ======================================================== */}
      {activeTab === 'pools' && (
        <div className="space-y-6">
          {/* Pools Sub-header & Action CTAs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#141824] border border-[#262a35] rounded-xl p-4 sm:p-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-[#1b1f2a] text-[#e4e1a9] border border-[#262a35]">
                  <Layers className="w-5 h-5" />
                </span>
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-[#dfe2f0]">Benefit Pools</h2>
                  <p className="text-xs text-[#939183]">
                    Shared credit destinations where users accumulate credits and redeem curated benefits.
                  </p>
                </div>
              </div>
            </div>

            {/* Top-Right Actions */}
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={handleExportData}
                className="px-3.5 py-2 rounded-lg bg-[#171b26] hover:bg-[#1b1f2a] text-[#dfe2f0] border border-[#262a35] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Export pools data"
              >
                <Download className="w-3.5 h-3.5 text-[#939183]" />
                <span>Export</span>
              </button>

              <button
                onClick={() => setShowCreatePoolModal(true)}
                className="px-4 py-2 rounded-lg bg-[#e4e1a9] hover:bg-[#d8d598] text-[#171b26] text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm hover:scale-[1.01] cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create Pool</span>
              </button>
            </div>
          </div>

          {/* 5 Compact KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="bg-[#141824] border border-[#262a35] rounded-xl p-3.5 space-y-1">
              <div className="flex items-center justify-between text-xs text-[#939183]">
                <span>Active Pools</span>
                <Layers className="w-3.5 h-3.5 text-[#e4e1a9]" />
              </div>
              <div className="text-xl font-bold font-mono text-[#dfe2f0]">{activePoolsCount}</div>
              <div className="text-[11px] text-[#939183]">Destination ecosystems</div>
            </div>

            <div className="bg-[#141824] border border-[#262a35] rounded-xl p-3.5 space-y-1">
              <div className="flex items-center justify-between text-xs text-[#939183]">
                <span>Total Pool Funding</span>
                <DollarSign className="w-3.5 h-3.5 text-[#c8c58f]" />
              </div>
              <div className="text-xl font-bold font-mono text-[#dfe2f0]">
                {totalFunding.toLocaleString()} <span className="text-xs text-[#939183]">CRD</span>
              </div>
              <div className="text-[11px] text-[#939183]">Aggregated sponsor backing</div>
            </div>

            <div className="bg-[#141824] border border-[#262a35] rounded-xl p-3.5 space-y-1">
              <div className="flex items-center justify-between text-xs text-[#939183]">
                <span>Credits Allocated</span>
                <Target className="w-3.5 h-3.5 text-[#e4e1a9]" />
              </div>
              <div className="text-xl font-bold font-mono text-[#e4e1a9]">
                {totalCommitted.toLocaleString()} <span className="text-xs text-[#939183]">CRD</span>
              </div>
              <div className="text-[11px] text-[#939183]">
                {Math.round((totalCommitted / (totalFunding || 1)) * 100)}% of funding absorbed
              </div>
            </div>

            <div className="bg-[#141824] border border-[#262a35] rounded-xl p-3.5 space-y-1">
              <div className="flex items-center justify-between text-xs text-[#939183]">
                <span>Active Participants</span>
                <Users className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="text-xl font-bold font-mono text-emerald-300">
                {totalParticipants.toLocaleString()}
              </div>
              <div className="text-[11px] text-[#939183]">Accumulating towards perks</div>
            </div>

            <div className="bg-[#141824] border border-[#262a35] rounded-xl p-3.5 space-y-1 col-span-2 sm:col-span-1">
              <div className="flex items-center justify-between text-xs text-[#939183]">
                <span>Benefit Redemptions</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-[#e4e1a9]" />
              </div>
              <div className="text-xl font-bold font-mono text-[#dfe2f0]">
                {totalPoolRedemptions.toLocaleString()}
              </div>
              <div className="text-[11px] text-[#939183]">Completed fulfillment burns</div>
            </div>
          </div>

          {/* Coordination Layer Architectural Principle Banner */}
          <div className="p-3.5 rounded-xl bg-[#10141f] border border-[#262a35] text-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#171b26] border border-[#262a35] flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-[#e4e1a9]" />
              </div>
              <div>
                <span className="font-semibold text-[#dfe2f0]">
                  Ecosystem Coordination Rule:
                </span>{' '}
                <span className="text-[#cac7b8]">
                  "Earn from many sources. Accumulate toward what you actually want."
                </span>
                <p className="text-[11px] text-[#939183]">
                  Quests &amp; campaigns issue standard platform credits. Pools bundle diverse merchant perks into high-utility destinations.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 text-[11px] font-mono text-[#939183]">
              <span className="px-2 py-0.5 rounded bg-[#171b26] border border-[#262a35]">
                Ledger → Pools → Benefits
              </span>
            </div>
          </div>

          {/* Filters, Type Switcher & View Mode */}
          <div className="space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              {/* Search Bar */}
              <div className="relative w-full md:w-80">
                <Search className="w-3.5 h-3.5 text-[#939183] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={poolSearch}
                  onChange={(e) => setPoolSearch(e.target.value)}
                  placeholder="Search pools by name, tagline, sponsor..."
                  className="w-full bg-[#141824] border border-[#262a35] rounded-lg pl-9 pr-3 py-2 text-xs text-[#dfe2f0] focus:outline-none focus:border-[#e4e1a9]"
                />
              </div>

              {/* Status Filter & View Toggle */}
              <div className="flex items-center gap-2 shrink-0">
                <div className="flex items-center gap-1.5 text-xs bg-[#141824] px-2.5 py-1.5 rounded-lg border border-[#262a35]">
                  <span className="text-[#939183] text-[11px]">Status:</span>
                  <select
                    value={poolStatusFilter}
                    onChange={(e) => setPoolStatusFilter(e.target.value as any)}
                    className="bg-transparent text-xs text-[#dfe2f0] focus:outline-none font-medium cursor-pointer"
                  >
                    <option value="ALL" className="bg-[#141824]">All Statuses</option>
                    <option value="Active" className="bg-[#141824]">Active</option>
                    <option value="Draft" className="bg-[#141824]">Draft</option>
                    <option value="Paused" className="bg-[#141824]">Paused</option>
                    <option value="Fully Redeemed" className="bg-[#141824]">Fully Redeemed</option>
                    <option value="Expired" className="bg-[#141824]">Expired</option>
                  </select>
                </div>

                {/* Grid / Table Toggle */}
                <div className="flex items-center bg-[#141824] p-1 rounded-lg border border-[#262a35]">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded text-xs transition-colors cursor-pointer ${
                      viewMode === 'grid'
                        ? 'bg-[#1b1f2a] text-[#e4e1a9]'
                        : 'text-[#939183] hover:text-[#dfe2f0]'
                    }`}
                    title="Grid view"
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    className={`p-1.5 rounded text-xs transition-colors cursor-pointer ${
                      viewMode === 'table'
                        ? 'bg-[#1b1f2a] text-[#e4e1a9]'
                        : 'text-[#939183] hover:text-[#dfe2f0]'
                    }`}
                    title="Dense table view"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Pool Type Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <span className="text-[11px] text-[#939183] mr-1 shrink-0">Type:</span>
              {(
                [
                  'ALL',
                  'Lifestyle',
                  'Travel',
                  'Wellness',
                  'Creator',
                  'Community',
                  'Events',
                  'Partner',
                  'Seasonal',
                ] as const
              ).map((type) => {
                const isSelected = poolTypeFilter === type;
                return (
                  <button
                    key={type}
                    onClick={() => setPoolTypeFilter(type)}
                    className={`px-3 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#1b1f2a] text-[#e4e1a9] border border-[#262a35]'
                        : 'bg-[#141824] text-[#939183] hover:text-[#dfe2f0] hover:bg-[#171b26]'
                    }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>

          {/* POOL CARD / TABLE CONTENT */}
          {filteredPools.length === 0 ? (
            <div className="p-12 text-center bg-[#141824] border border-[#262a35] rounded-xl space-y-3">
              <Layers className="w-8 h-8 text-[#939183] mx-auto opacity-50" />
              <div className="text-sm font-semibold text-[#dfe2f0]">No benefit pools match criteria</div>
              <p className="text-xs text-[#939183]">Try loosening your filters or search keywords.</p>
              <button
                onClick={() => {
                  setPoolSearch('');
                  setPoolTypeFilter('ALL');
                  setPoolStatusFilter('ALL');
                }}
                className="px-3 py-1.5 rounded-lg bg-[#1b1f2a] text-xs text-[#e4e1a9] border border-[#262a35] hover:bg-[#262a35] cursor-pointer"
              >
                Clear Filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            /* GRID VIEW (RICH POOL CARDS) */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPools.map((pool) => {
                const fundingPct = Math.min(
                  100,
                  Math.round((pool.committedCredits / (pool.totalFundingCredits || 1)) * 100)
                );
                return (
                  <div
                    key={pool.id}
                    onClick={() => {
                      setSelectedPoolId(pool.id);
                      navigate(`/rewards/pools/${pool.id}`);
                    }}
                    className="bg-[#141824] border border-[#262a35] rounded-xl p-5 space-y-4 text-xs flex flex-col justify-between shadow-md hover:border-[#3b4152] transition-all cursor-pointer group hover:translate-y-[-1px]"
                  >
                    {/* Header: Title, Type, Status */}
                    <div className="space-y-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1b1f2a] text-[#c8c58f] border border-[#262a35]">
                              {pool.type}
                            </span>
                            {getStatusBadge(pool.status)}
                          </div>
                          <h3 className="font-bold text-base text-[#dfe2f0] group-hover:text-[#e4e1a9] transition-colors">
                            {pool.name}
                          </h3>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-[#939183] group-hover:text-[#e4e1a9] transition-colors shrink-0" />
                      </div>

                      <p className="text-xs text-[#cac7b8] line-clamp-2 leading-relaxed">
                        {pool.tagline}
                      </p>

                      <div className="text-[11px] text-[#939183] flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-[#939183]" />
                        <span>Owner: <strong className="text-[#dfe2f0]">{pool.owner}</strong></span>
                      </div>
                    </div>

                    {/* Funding Progress Bar */}
                    <div className="space-y-1.5 pt-2 border-t border-[#262a35]/60">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-[#939183]">Funding Progress</span>
                        <span className="font-bold text-[#dfe2f0]">
                          {pool.committedCredits.toLocaleString()} / {pool.totalFundingCredits.toLocaleString()} CRD{' '}
                          <span className="text-[#e4e1a9]">({fundingPct}%)</span>
                        </span>
                      </div>
                      <div className="w-full bg-[#1b1f2a] rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-[#e4e1a9] h-full rounded-full transition-all"
                          style={{ width: `${fundingPct}%` }}
                        />
                      </div>
                    </div>

                    {/* 4 Compact Metrics Grid */}
                    <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-[#171b26] border border-[#262a35] text-[11px] font-mono">
                      <div>
                        <span className="text-[#939183] text-[10px] block">PARTICIPANTS</span>
                        <span className="font-bold text-[#dfe2f0]">
                          {pool.participantsCount.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-[#939183] text-[10px] block">BENEFITS OFFERED</span>
                        <span className="font-bold text-[#e4e1a9]">
                          {pool.benefits.length} Benefits
                        </span>
                      </div>
                      <div>
                        <span className="text-[#939183] text-[10px] block">REDEMPTION RATE</span>
                        <span className="font-bold text-emerald-300">
                          {pool.redemptionRate}%
                        </span>
                      </div>
                      <div>
                        <span className="text-[#939183] text-[10px] block">EXPIRATION</span>
                        <span className="font-bold text-[#cac7b8] truncate block">
                          {pool.durationEnd}
                        </span>
                      </div>
                    </div>

                    {/* Curated Preview of Top Benefits */}
                    <div className="space-y-1.5">
                      <div className="text-[10px] uppercase font-semibold text-[#939183] tracking-wider">
                        Curated Benefits Preview
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {pool.benefits.slice(0, 3).map((b) => (
                          <span
                            key={b.id}
                            className="text-[10px] px-2 py-0.5 rounded bg-[#1b1f2a] text-[#dfe2f0] border border-[#262a35] truncate max-w-[200px]"
                            title={`${b.name} (${b.creditsCost.toLocaleString()} CRD)`}
                          >
                            {b.name} · <strong className="text-[#e4e1a9]">{b.creditsCost} CRD</strong>
                          </span>
                        ))}
                        {pool.benefits.length > 3 && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#141824] text-[#939183]">
                            +{pool.benefits.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Bottom CTA */}
                    <div className="pt-2 border-t border-[#262a35] flex items-center justify-between text-xs text-[#e4e1a9] font-medium group-hover:underline">
                      <span>Open Pool Workspace</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* DENSE TABLE VIEW */
            <div className="bg-[#141824] border border-[#262a35] rounded-xl overflow-hidden shadow-md">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#262a35] bg-[#10141f] text-[11px] text-[#939183] uppercase font-mono">
                      <th className="py-3 px-4">Pool Name &amp; Description</th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Funding</th>
                      <th className="py-3 px-4 text-right">Committed</th>
                      <th className="py-3 px-4 text-right">Participants</th>
                      <th className="py-3 px-4 text-right">Benefits</th>
                      <th className="py-3 px-4 text-right">Redeem Rate</th>
                      <th className="py-3 px-4">Duration</th>
                      <th className="py-3 px-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#262a35]">
                    {filteredPools.map((pool) => (
                      <tr
                        key={pool.id}
                        onClick={() => {
                          setSelectedPoolId(pool.id);
                          navigate(`/rewards/pools/${pool.id}`);
                        }}
                        className="hover:bg-[#1b1f2a]/60 transition-colors cursor-pointer group"
                      >
                        <td className="py-3 px-4">
                          <div className="font-bold text-[#dfe2f0] group-hover:text-[#e4e1a9] transition-colors">
                            {pool.name}
                          </div>
                          <div className="text-[11px] text-[#939183] truncate max-w-xs">
                            {pool.tagline}
                          </div>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1b1f2a] text-[#c8c58f] border border-[#262a35]">
                            {pool.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          {getStatusBadge(pool.status)}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-[#dfe2f0] whitespace-nowrap">
                          {pool.totalFundingCredits.toLocaleString()} CRD
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-[#e4e1a9] whitespace-nowrap">
                          {pool.committedCredits.toLocaleString()} CRD
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-emerald-300 whitespace-nowrap">
                          {pool.participantsCount.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-[#dfe2f0] whitespace-nowrap">
                          {pool.benefits.length}
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-[#dfe2f0] whitespace-nowrap">
                          {pool.redemptionRate}%
                        </td>
                        <td className="py-3 px-4 text-[11px] font-mono text-[#939183] whitespace-nowrap">
                          {pool.durationStart} — {pool.durationEnd}
                        </td>
                        <td className="py-3 px-4 text-center whitespace-nowrap">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedPoolId(pool.id);
                              navigate(`/rewards/pools/${pool.id}`);
                            }}
                            className="p-1 rounded bg-[#1b1f2a] hover:bg-[#262a35] text-[#e4e1a9] border border-[#262a35] cursor-pointer"
                            title="Open Pool Overview"
                          >
                            <ChevronRight className="w-4 h-4" />
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
      {/* TAB 2: REWARD CATALOG                                    */}
      {/* ======================================================== */}
      {activeTab === 'catalog' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#141824] border border-[#262a35] rounded-xl p-4 sm:p-5">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-[#dfe2f0] flex items-center gap-2">
                <Tag className="w-5 h-5 text-[#c8c58f]" />
                <span>Direct Merchant Reward Catalog</span>
              </h2>
              <p className="text-xs text-[#939183] mt-0.5">
                Curated retail vouchers, products, and direct spend items redeemable via platform credits.
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="text-[#939183]">Patron Balance:</span>
              <span className="font-bold text-[#e4e1a9]">
                {selectedUser.creditAccount.availableCredit.toLocaleString()} CRD
              </span>
            </div>
          </div>

          {/* Search & Category Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="relative w-full sm:w-80">
              <Search className="w-3.5 h-3.5 text-[#939183] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={catalogSearch}
                onChange={(e) => setCatalogSearch(e.target.value)}
                placeholder="Search catalog by name, merchant..."
                className="w-full bg-[#141824] border border-[#262a35] rounded-lg pl-9 pr-3 py-2 text-xs text-[#dfe2f0] focus:outline-none focus:border-[#e4e1a9]"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto">
              {['ALL', 'Product', 'Benefit', 'Discount', 'Service', 'Experience'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCatalogCategoryFilter(cat)}
                  className={`px-3 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                    catalogCategoryFilter === cat
                      ? 'bg-[#1b1f2a] text-[#e4e1a9] border border-[#262a35]'
                      : 'bg-[#141824] text-[#939183] hover:text-[#dfe2f0]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Catalog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCatalog.map((reward) => {
              const canAfford = selectedUser.creditAccount.availableCredit >= reward.creditsCost;
              return (
                <div
                  key={reward.id}
                  className="bg-[#141824] border border-[#262a35] rounded-xl p-5 space-y-3.5 text-xs flex flex-col justify-between shadow-md hover:border-[#3b4152] transition-colors"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1b1f2a] text-[#c8c58f] border border-[#262a35]">
                        {reward.category}
                      </span>
                      <span className="font-mono text-base font-bold text-[#e4e1a9]">
                        {reward.creditsCost.toLocaleString()} CRD
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-[#dfe2f0]">{reward.name}</h3>
                    <div className="text-[11px] text-[#939183]">
                      Provided by <strong>{reward.organizationName}</strong>
                    </div>
                    <p className="text-xs text-[#cac7b8] leading-relaxed">{reward.description}</p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-[#262a35]">
                    <div className="flex items-center justify-between text-[11px] font-mono text-[#939183]">
                      <span>Inventory: {reward.remainingInventory} units left</span>
                      <span className="text-emerald-400">{reward.totalRedeemed} redeemed</span>
                    </div>

                    <button
                      disabled={!canAfford || reward.remainingInventory <= 0}
                      onClick={() => handleRedeemCatalog(reward.id, reward.name)}
                      className={`w-full py-2 px-3 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer ${
                        canAfford && reward.remainingInventory > 0
                          ? 'bg-[#e4e1a9] hover:bg-[#d8d598] text-[#171b26] hover:scale-[1.01]'
                          : 'bg-[#1b1f2a] text-[#939183] border border-[#262a35] cursor-not-allowed opacity-60'
                      }`}
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>
                        {!canAfford
                          ? `Insufficient Balance (${selectedUser.creditAccount.availableCredit.toLocaleString()} CRD)`
                          : `Redeem for ${selectedUser.name.split(' ')[0]}`}
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: REDEMPTIONS LOG                                   */}
      {/* ======================================================== */}
      {activeTab === 'redemptions' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#141824] border border-[#262a35] rounded-xl p-4 sm:p-5">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-[#dfe2f0] flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Centralized Redemptions &amp; Fulfillment Log</span>
              </h2>
              <p className="text-xs text-[#939183] mt-0.5">
                Every benefit redemption burns credits on the immutable double-entry ledger.
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 text-[#939183] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={redemptionSearch}
                onChange={(e) => setRedemptionSearch(e.target.value)}
                placeholder="Search claims by patron, item..."
                className="w-full bg-[#171b26] border border-[#262a35] rounded-lg pl-9 pr-3 py-1.5 text-xs text-[#dfe2f0] focus:outline-none focus:border-[#e4e1a9]"
              />
            </div>
          </div>

          <div className="bg-[#141824] border border-[#262a35] rounded-xl overflow-hidden shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#262a35] bg-[#10141f] text-[11px] text-[#939183] uppercase font-mono">
                    <th className="py-3 px-4">Redemption ID</th>
                    <th className="py-3 px-4">Patron</th>
                    <th className="py-3 px-4">Destination / Pool</th>
                    <th className="py-3 px-4">Benefit Item</th>
                    <th className="py-3 px-4">Provider Org</th>
                    <th className="py-3 px-4 text-right">Burned</th>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Ledger Ref</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#262a35]">
                  {allRedemptions.map((red) => (
                    <tr key={red.id} className="hover:bg-[#1b1f2a]/60 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-[#dfe2f0]">
                        {red.id}
                      </td>
                      <td className="py-3 px-4 font-medium text-[#dfe2f0]">
                        {red.userName}
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1b1f2a] text-[#c8c58f] border border-[#262a35]">
                          {red.source}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[#dfe2f0]">
                        <div className="font-semibold">{red.benefitName}</div>
                        <div className="text-[10px] text-[#939183]">{red.benefitType}</div>
                      </td>
                      <td className="py-3 px-4 text-[#cac7b8]">
                        {red.providerName}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-red-400">
                        -{red.creditsSpent.toLocaleString()} CRD
                      </td>
                      <td className="py-3 px-4 text-[11px] text-[#939183] font-mono">
                        {red.timestamp}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                          <Check className="w-3 h-3" />
                          {red.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => navigate('/ledger')}
                          className="font-mono text-[11px] text-[#e4e1a9] hover:underline flex items-center gap-1 cursor-pointer"
                          title="Inspect on Double-Entry Ledger"
                        >
                          <span>{red.ledgerTxId}</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: INVENTORY MANAGEMENT                              */}
      {/* ======================================================== */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#141824] border border-[#262a35] rounded-xl p-4 sm:p-5">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-[#dfe2f0] flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#e4e1a9]" />
                <span>Partner &amp; Merchant Inventory Allocation</span>
              </h2>
              <p className="text-xs text-[#939183] mt-0.5">
                Real-time stock controls across all benefit pools and direct merchant reward lines.
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 text-[#939183] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={inventorySearch}
                onChange={(e) => setInventorySearch(e.target.value)}
                placeholder="Search inventory items..."
                className="w-full bg-[#171b26] border border-[#262a35] rounded-lg pl-9 pr-3 py-1.5 text-xs text-[#dfe2f0] focus:outline-none focus:border-[#e4e1a9]"
              />
            </div>
          </div>

          <div className="bg-[#141824] border border-[#262a35] rounded-xl overflow-hidden shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#262a35] bg-[#10141f] text-[11px] text-[#939183] uppercase font-mono">
                    <th className="py-3 px-4">Item Name</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Provider Organization</th>
                    <th className="py-3 px-4">Destination</th>
                    <th className="py-3 px-4 text-right">Value (CRD)</th>
                    <th className="py-3 px-4 text-right">Available / Total</th>
                    <th className="py-3 px-4" style={{ width: '140px' }}>Stock Health</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#262a35]">
                  {allInventory.map((item) => {
                    const pct = Math.round((item.remainingStock / (item.totalStock || 1)) * 100);
                    return (
                      <tr key={item.id} className="hover:bg-[#1b1f2a]/60 transition-colors">
                        <td className="py-3 px-4 font-bold text-[#dfe2f0]">
                          {item.name}
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1b1f2a] text-[#c8c58f] border border-[#262a35]">
                            {item.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-[#dfe2f0]">
                          {item.providerName}
                        </td>
                        <td className="py-3 px-4 text-[#cac7b8]">
                          {item.destination}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-[#e4e1a9]">
                          {item.creditsCost.toLocaleString()} CRD
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-[#dfe2f0]">
                          <strong className="text-emerald-300">{item.remainingStock}</strong> / {item.totalStock}
                        </td>
                        <td className="py-3 px-4">
                          <div className="space-y-1">
                            <div className="w-full bg-[#1b1f2a] rounded-full h-1.5 overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  pct < 20 ? 'bg-red-400' : pct < 50 ? 'bg-amber-400' : 'bg-[#e4e1a9]'
                                }`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="text-[10px] text-[#939183] font-mono">{pct}% in reserve</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {item.status === 'In Stock' && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                              In Stock
                            </span>
                          )}
                          {item.status === 'Low Stock' && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/10 text-amber-300 border border-amber-500/30">
                              Low Stock
                            </span>
                          )}
                          {item.status === 'Depleted' && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-500/10 text-red-300 border border-red-500/30">
                              Depleted
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => showToast(`Restock request dispatched to ${item.providerName}`)}
                            className="px-2.5 py-1 rounded bg-[#1b1f2a] hover:bg-[#262a35] text-xs font-semibold text-[#e4e1a9] border border-[#262a35] cursor-pointer"
                          >
                            Restock
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: CREATE BENEFIT POOL                               */}
      {/* ======================================================== */}
      {showCreatePoolModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#141824] border border-[#262a35] rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl animate-fadeIn my-8">
            <div className="flex items-center justify-between pb-3 border-b border-[#262a35]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-[#1b1f2a] text-[#e4e1a9] border border-[#262a35]">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#dfe2f0]">Create New Benefit Pool</h3>
                  <p className="text-xs text-[#939183]">
                    Launch a shared credit destination for ecosystem participants.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCreatePoolModal(false)}
                className="p-1 rounded text-[#939183] hover:text-[#dfe2f0] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePoolSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-[#dfe2f0] block">
                  Pool Name *
                </label>
                <input
                  type="text"
                  required
                  value={newPoolName}
                  onChange={(e) => setNewPoolName(e.target.value)}
                  placeholder="e.g. City Life Pool, Travel Explorer, Creator Economy"
                  className="w-full bg-[#171b26] border border-[#262a35] rounded-lg px-3 py-2 text-xs text-[#dfe2f0] focus:outline-none focus:border-[#e4e1a9]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-[#dfe2f0] block">
                    Pool Type *
                  </label>
                  <select
                    value={newPoolType}
                    onChange={(e) => setNewPoolType(e.target.value as PoolType)}
                    className="w-full bg-[#171b26] border border-[#262a35] rounded-lg px-3 py-2 text-xs text-[#dfe2f0] focus:outline-none focus:border-[#e4e1a9]"
                  >
                    <option value="Lifestyle">Lifestyle</option>
                    <option value="Travel">Travel</option>
                    <option value="Wellness">Wellness</option>
                    <option value="Creator">Creator Economy</option>
                    <option value="Community">Community</option>
                    <option value="Events">Events</option>
                    <option value="Partner">Partner</option>
                    <option value="Seasonal">Seasonal</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-[#dfe2f0] block">
                    Initial Status
                  </label>
                  <select
                    value={newPoolStatus}
                    onChange={(e) => setNewPoolStatus(e.target.value as PoolStatus)}
                    className="w-full bg-[#171b26] border border-[#262a35] rounded-lg px-3 py-2 text-xs text-[#dfe2f0] focus:outline-none focus:border-[#e4e1a9]"
                  >
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                    <option value="Paused">Paused</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-[#dfe2f0] block">
                  Tagline / Short Hook
                </label>
                <input
                  type="text"
                  value={newPoolTagline}
                  onChange={(e) => setNewPoolTagline(e.target.value)}
                  placeholder="e.g. Everyday benefits from local partners."
                  className="w-full bg-[#171b26] border border-[#262a35] rounded-lg px-3 py-2 text-xs text-[#dfe2f0] focus:outline-none focus:border-[#e4e1a9]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-[#dfe2f0] block">
                  Detailed Description
                </label>
                <textarea
                  rows={2}
                  value={newPoolDescription}
                  onChange={(e) => setNewPoolDescription(e.target.value)}
                  placeholder="Describe what kinds of benefits this pool aggregates and what partners contribute."
                  className="w-full bg-[#171b26] border border-[#262a35] rounded-lg px-3 py-2 text-xs text-[#dfe2f0] focus:outline-none focus:border-[#e4e1a9]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-[#dfe2f0] block">
                    Lead Sponsoring Organization
                  </label>
                  <select
                    value={newPoolOwnerOrg}
                    onChange={(e) => setNewPoolOwnerOrg(e.target.value)}
                    className="w-full bg-[#171b26] border border-[#262a35] rounded-lg px-3 py-2 text-xs text-[#dfe2f0] focus:outline-none focus:border-[#e4e1a9]"
                  >
                    <option value="org-platform-treasury">Platform Central Treasury</option>
                    {organizations.map((org) => (
                      <option key={org.id} value={org.id}>
                        {org.name} ({org.type})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-[#dfe2f0] block">
                    Initial Funding (CRD)
                  </label>
                  <input
                    type="number"
                    min={1000}
                    step={1000}
                    value={newPoolFunding}
                    onChange={(e) => setNewPoolFunding(Number(e.target.value))}
                    className="w-full bg-[#171b26] border border-[#262a35] rounded-lg px-3 py-2 text-xs font-mono text-[#e4e1a9] focus:outline-none focus:border-[#e4e1a9]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-[#dfe2f0] block">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={newPoolDurationStart}
                    onChange={(e) => setNewPoolDurationStart(e.target.value)}
                    className="w-full bg-[#171b26] border border-[#262a35] rounded-lg px-3 py-2 text-xs font-mono text-[#dfe2f0] focus:outline-none focus:border-[#e4e1a9]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-[#dfe2f0] block">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={newPoolDurationEnd}
                    onChange={(e) => setNewPoolDurationEnd(e.target.value)}
                    className="w-full bg-[#171b26] border border-[#262a35] rounded-lg px-3 py-2 text-xs font-mono text-[#dfe2f0] focus:outline-none focus:border-[#e4e1a9]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#262a35] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowCreatePoolModal(false)}
                  className="px-4 py-2 rounded-lg bg-[#171b26] text-[#939183] hover:text-[#dfe2f0] border border-[#262a35] text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#e4e1a9] hover:bg-[#d8d598] text-[#171b26] text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  Create &amp; Launch Pool
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
