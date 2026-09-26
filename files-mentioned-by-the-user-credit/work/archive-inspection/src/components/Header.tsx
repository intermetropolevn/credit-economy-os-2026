import React, { useState, useRef, useEffect } from 'react';
import { useEconomic } from '../context/EconomicContext';
import { useRole } from '../context/RoleContext';
import {
  ChevronDown,
  RotateCcw,
  Plus,
  UserCheck,
  ArrowRight,
  Shield,
  Layers,
  Cpu,
  FileCheck2,
  DollarSign,
  AlertTriangle,
  Activity,
  Sparkles,
  Wallet,
  Menu,
  X,
} from 'lucide-react';
import { AICommandBarModal } from './AICommandBarModal';

export const Header: React.FC = () => {
  const { currentPath, navigate, resetGoldenDemo } = useEconomic();
  const { currentRole, setCurrentRole, permission, availableRoles } = useRole();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const [isCommandBarOpen, setIsCommandBarOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [commandBarInitialQuery, setCommandBarInitialQuery] = useState('');
  const navRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcut Cmd+K or Ctrl+K & Custom event listener
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandBarOpen((prev) => !prev);
      }
    }
    function handleCustomEvent(e: Event) {
      const customEvent = e as CustomEvent<{ query?: string }>;
      if (customEvent.detail?.query) {
        setCommandBarInitialQuery(customEvent.detail.query);
      } else {
        setCommandBarInitialQuery('');
      }
      setIsCommandBarOpen(true);
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-credit-economy-ai', handleCustomEvent);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-credit-economy-ai', handleCustomEvent);
    };
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
      if (roleRef.current && !roleRef.current.contains(event.target as Node)) {
        setIsRoleOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Updated Admin Information Architecture per specifications:
  // Dashboard | Users | Organizations | Economy | Programs | Rewards | Analytics | Operations
  const navSections = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      path: '/',
    },
    {
      id: 'users',
      label: 'Users',
      path: '/users',
      subItems: [
        { label: 'Credit Wallet', path: '/wallet', desc: 'Consumer balance, active goals & AI agent (Sarah Chen)', badge: 'AI AGENT' },
        { label: 'All Users', path: '/users', desc: 'Unified digital identities & wallets' },
        { label: 'Consumer Users', path: '/users?type=Consumer', desc: 'Retail customers & quest participants' },
        { label: 'Business Users', path: '/users?type=Business', desc: 'Service providers & enterprise payors' },
        { label: 'Admin Users', path: '/users?type=Admin', desc: 'Risk officers & platform operators' },
        { label: 'Segments', path: '/users?type=Segments', desc: 'High-balance & high-velocity cohorts' },
      ],
    },
    {
      id: 'organizations',
      label: 'Organizations',
      path: '/organizations',
      subItems: [
        { label: 'All Organizations', path: '/organizations', desc: 'Vendors, brands, partners & merchants' },
        { label: 'Vendors', path: '/organizations?type=Vendor', desc: 'Core suppliers & storefront partners' },
        { label: 'Brands', path: '/organizations?type=Brand', desc: 'Sponsoring brands & ecosystem leaders' },
        { label: 'Partners', path: '/organizations?type=Partner', desc: 'Strategic alliance & co-marketing' },
        { label: 'Merchants', path: '/organizations?type=Merchant', desc: 'POS counter & retail redemption nodes' },
        { label: 'Service Providers', path: '/organizations?type=Service Provider', desc: 'API & service delivery organizations' },
      ],
    },
    {
      id: 'economy',
      label: 'Economy',
      path: '/credit-types',
      subItems: [
        { label: 'Credit Rules', path: '/credit-types', desc: 'Paid, promo & ecosystem credit classes' },
        { label: 'Credit Ledger', path: '/ledger', desc: 'Immutable double-entry ledger & balances' },
        { label: 'Earning Rules', path: '/reward-rules', desc: 'Issuance triggers, bonuses & daily caps' },
        { label: 'Redemption Rules', path: '/spend-products', desc: 'Spend catalog & clearing margin floors' },
        { label: 'Credit Templates', path: '/programs?tab=templates', desc: 'Pre-configured incentive structures' },
        { label: 'Credit Samples', path: '/programs?tab=samples', desc: 'Industry-tested program presets' },
        { label: 'Economy Configuration', path: '/economy-health', desc: 'Reserve health & velocity monitoring' },
      ],
    },
    {
      id: 'programs',
      label: 'Programs',
      path: '/programs',
      subItems: [
        { label: 'All Programs', path: '/programs', desc: 'Active quests, campaigns & incentives' },
        { label: 'Quests', path: '/programs?tab=quests', desc: 'Targeted actions & micro-milestones' },
        { label: 'Campaigns', path: '/programs?tab=campaigns', desc: 'Time-bounded promotional drives' },
        { label: 'Templates', path: '/programs?tab=templates', desc: 'Ready-to-launch campaign blueprints' },
        { label: 'Approval Queue', path: '/programs?tab=approvals', desc: 'Vendor program reviews & sign-offs' },
        { label: 'Program Simulator', path: '/programs?tab=simulator', desc: 'Stress-test cost, ROI & completion' },
      ],
    },
    {
      id: 'experiences',
      label: 'Experiences',
      path: '/experiences',
      badge: 'DX',
      isHighlight: true,
      subItems: [
        { label: 'Experience Hub', path: '/experiences?tab=hub', desc: 'Active, scheduled & completed experiences', badge: 'OVERVIEW' },
        { label: 'Journeys', path: '/experiences?tab=journeys', desc: 'Interaction pipeline & drop-off analytics' },
        { label: 'Experience Builder', path: '/experiences?tab=builder', desc: 'Visual journey orchestration canvas', badge: 'CANVAS' },
        { label: 'Experience Marketplace', path: '/experiences?tab=marketplace', desc: 'Curated challenges, retreats & community perks' },
        { label: 'Personalization', path: '/experiences?tab=personalization', desc: 'Next Best Experience contextual recommendations' },
        { label: 'Touchpoints', path: '/experiences?tab=touchpoints', desc: 'QR, Web, Campaign link & POS entry points' },
        { label: 'Experience Analytics', path: '/experiences?tab=analytics', desc: 'Attribution funnel & conversion velocity' },
      ],
    },
    {
      id: 'pools',
      label: 'Pools',
      path: '/pools',
      badge: 'DEMAND',
      isHighlight: true,
      subItems: [
        {
          label: 'All Destination Pools',
          path: '/pools',
          desc: 'Shared funding, participating orgs & collective demand',
          badge: 'DEMAND-CENTRIC',
        },
        {
          label: 'City Life Pool',
          path: '/pools/pool-city-life',
          desc: 'Everyday benefits from local partners (Patron Journey)',
          badge: 'SARAH CHEN',
        },
        {
          label: 'Demand & Allocation',
          path: '/pools?tab=demand',
          desc: 'Aggregated participant goals & inventory capacity absorption',
        },
        {
          label: 'Destination Decision Journey',
          path: '/pools/pool-city-life',
          desc: 'Accumulate toward destinations: "Where do credits take me?"',
        },
      ],
    },
    {
      id: 'rewards',
      label: 'Rewards',
      path: '/rewards',
      badge: 'INVENTORY',
      subItems: [
        {
          label: 'Reward Catalog',
          path: '/rewards?tab=catalog',
          desc: 'What rewards are available: item, provider, price, instant redeem',
          badge: 'INVENTORY-CENTRIC',
        },
        {
          label: 'Merchant Inventory',
          path: '/rewards?tab=inventory',
          desc: 'Stock counts, provider supplies & reorder thresholds',
        },
        {
          label: 'Redemptions Log',
          path: '/rewards?tab=redemptions',
          desc: 'Processed claims & cryptographic ledger burn records',
        },
      ],
    },
    {
      id: 'analytics',
      label: 'Analytics',
      path: '/analytics',
    },
    {
      id: 'operations',
      label: 'Operations',
      path: '/audit-log',
      subItems: [
        { label: 'AI & Integrations', path: '/settings/integrations', desc: 'MCP servers, tool registry, permission matrix & execution log', badge: 'MCP' },
        { label: 'Audit Logs', path: '/audit-log', desc: 'Cryptographic compliance audit trail' },
        { label: 'Manual Adjustments', path: '/users', desc: 'Administrative credit interventions' },
        { label: 'System Configuration', path: '/risk-policies', desc: 'Dual-sign rules & safety ceilings' },
        { label: 'Transactions Console', path: '/transactions', desc: 'Escrows, milestones & verification' },
        { label: 'Settlement Console', path: '/settlement', desc: 'Automated & manual clearing tranches' },
        { label: 'AI Operator', path: '/operator', desc: 'Autonomous monitoring & advisories' },
        { label: 'Impact Simulation', path: '/simulation', desc: 'What-if macro economic testing' },
      ],
    },
    {
      id: 'settings',
      label: 'Settings',
      path: '/settings/integrations',
      badge: 'MCP',
      subItems: [
        {
          label: 'AI & Integrations',
          path: '/settings/integrations',
          desc: 'MCP servers, tool registry, permission model & execution log',
          badge: 'INFRASTRUCTURE',
        },
        {
          label: 'Risk & Safety Policies',
          path: '/risk-policies',
          desc: 'Dual-sign thresholds, rate limits & circuit breakers',
        },
        {
          label: 'Wallet & Liquidity Policies',
          path: '/wallet-policies',
          desc: 'Expiration windows, holding caps & auto-recharge',
        },
      ],
    },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[#262a35] bg-[#0c1019]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Left: Brand + Primary Navigation */}
        <div className="flex items-center gap-5">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 group text-left cursor-pointer focus:outline-none shrink-0"
          >
            <div className="w-7 h-7 rounded-md bg-[#e4e1a9] text-[#171b26] flex items-center justify-center font-bold text-xs shadow-sm">
              CE
            </div>
            <div>
              <span className="text-sm font-bold tracking-tight text-[#dfe2f0] group-hover:text-[#e4e1a9] transition-colors">
                Credit Economy
              </span>
              <span className="hidden sm:inline-block ml-1.5 px-1.5 py-0.5 rounded text-[10px] font-mono bg-[#171b26] text-[#939183] border border-[#262a35]">
                OS
              </span>
            </div>
          </button>

          {/* Primary Nav Links */}
          <nav className="hidden lg:flex items-center space-x-0.5" ref={navRef}>
            {navSections.map((section) => {
              const isActive =
                currentPath === section.path ||
                (section.id === 'users' && currentPath.startsWith('/users')) ||
                (section.id === 'organizations' && currentPath.startsWith('/organizations')) ||
                (section.id === 'programs' && currentPath.startsWith('/programs')) ||
                (section.id === 'experiences' && currentPath.startsWith('/experiences')) ||
                (section.id === 'rewards' && currentPath.startsWith('/rewards')) ||
                (section.id === 'analytics' && currentPath.startsWith('/analytics')) ||
                (section.id === 'economy' &&
                  (currentPath.startsWith('/credit-types') ||
                    currentPath.startsWith('/ledger') ||
                    currentPath.startsWith('/reward-rules') ||
                    currentPath.startsWith('/spend-products') ||
                    currentPath.startsWith('/economy'))) ||
                (section.id === 'operations' &&
                  (currentPath.startsWith('/audit') ||
                    currentPath.startsWith('/risk-policies') ||
                    currentPath.startsWith('/transactions') ||
                    currentPath.startsWith('/settlement') ||
                    currentPath.startsWith('/operator') ||
                    currentPath.startsWith('/simulation')));

              const hasSubItems = section.subItems && section.subItems.length > 0;
              const isDropdownOpen = openDropdown === section.id;

              return (
                <div key={section.id} className="relative">
                  <div className="flex items-center">
                    <button
                      onClick={() => {
                        navigate(section.path);
                        setOpenDropdown(null);
                      }}
                      className={`px-2.5 py-1.5 rounded-l-md text-xs font-medium transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-[#1b1f2a] text-[#e4e1a9] font-semibold'
                          : 'text-[#939183] hover:text-[#dfe2f0] hover:bg-[#171b26]'
                      } ${!hasSubItems ? 'rounded-r-md' : ''}`}
                    >
                      <span className="flex items-center gap-1.5">
                        <span>{section.label}</span>
                        {(section as any).badge && (
                          <span
                            className={`text-[8px] font-mono px-1 py-0.2 rounded font-bold uppercase tracking-wider hidden lg:inline-block ${
                              (section as any).badge === 'DEMAND'
                                ? 'bg-[#e4e1a9]/20 text-[#e4e1a9] border border-[#e4e1a9]/40'
                                : 'bg-[#1b1f2a] text-[#939183] border border-[#262a35]'
                            }`}
                          >
                            {(section as any).badge}
                          </span>
                        )}
                      </span>
                    </button>

                    {hasSubItems && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenDropdown(isDropdownOpen ? null : section.id);
                        }}
                        className={`px-1 py-1.5 rounded-r-md text-xs transition-colors cursor-pointer ${
                          isActive
                            ? 'bg-[#1b1f2a] text-[#e4e1a9]'
                            : 'text-[#939183] hover:text-[#dfe2f0] hover:bg-[#171b26]'
                        }`}
                        title={`Open ${section.label} menu`}
                      >
                        <ChevronDown
                          className={`w-3 h-3 transition-transform ${
                            isDropdownOpen ? 'rotate-180 text-[#e4e1a9]' : ''
                          }`}
                        />
                      </button>
                    )}
                  </div>

                  {/* Dropdown Menu */}
                  {hasSubItems && isDropdownOpen && (
                    <div className="absolute left-0 mt-1 w-64 p-2 rounded-xl bg-[#141824] border border-[#262a35] shadow-2xl z-50 space-y-1">
                      <div className="px-2.5 py-1 text-[10px] font-semibold text-[#939183] border-b border-[#262a35] uppercase tracking-wider">
                        {section.label}
                      </div>
                      {section.subItems?.map((sub) => {
                        const isSubActive = currentPath === sub.path;
                        return (
                          <button
                            key={sub.label}
                            onClick={() => {
                              navigate(sub.path);
                              setOpenDropdown(null);
                            }}
                            className={`w-full text-left p-2 rounded-lg transition-all block cursor-pointer group relative ${
                              isSubActive
                                ? 'bg-[#1b1f2a] text-[#e4e1a9]'
                                : (sub as any).isHighlight
                                ? 'bg-[#1b1f2a]/60 border border-[#e4e1a9]/30 text-[#dfe2f0] hover:bg-[#1b1f2a]'
                                : 'text-[#dfe2f0] hover:bg-[#1b1f2a]/70'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-1.5">
                              <span className={`text-xs font-medium transition-colors ${
                                (sub as any).isHighlight ? 'text-[#e4e1a9] font-semibold' : 'group-hover:text-[#e4e1a9]'
                              }`}>
                                {sub.label}
                              </span>
                              {(sub as any).badge && (
                                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#e4e1a9]/20 text-[#e4e1a9] border border-[#e4e1a9]/40 font-bold shrink-0">
                                  {(sub as any).badge}
                                </span>
                              )}
                            </div>
                            {sub.desc && (
                              <div className="text-[10px] text-[#939183] truncate mt-0.5">
                                {sub.desc}
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Right: Actions, Persona Switcher & Primary CTA */}
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          <button
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            className="lg:hidden inline-flex items-center justify-center w-8 h-8 rounded-md border border-[#262a35] bg-[#171b26] text-[#dfe2f0]"
            aria-label={isMobileMenuOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
          {/* Hero End-to-End Demo Button */}
          <button
            onClick={() => navigate('/demo')}
            className={`hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs transition-all cursor-pointer shadow-sm group ${
              currentPath === '/demo' || currentPath === '/hero-demo' || currentPath === '/scenario'
                ? 'bg-[#e4e1a9] text-[#171b26] font-bold border-[#e4e1a9]'
                : 'bg-[#1b1f2a] hover:bg-[#262a35] border-[#e4e1a9]/50 text-[#e4e1a9]'
            }`}
            title="Launch End-to-End Hero Demo: Brand + User + Credit + Pool + MCP"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="font-bold">Hero Demo</span>
            <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-[#e4e1a9]/20 text-[#e4e1a9] border border-[#e4e1a9]/40 font-bold hidden xl:inline">
              LOOP
            </span>
          </button>

          {/* Credit Wallet Button */}
          <button
            onClick={() => navigate('/wallet')}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs transition-all cursor-pointer shadow-sm group ${
              currentPath === '/wallet'
                ? 'bg-[#1b1f2a] border-[#e4e1a9] text-[#e4e1a9]'
                : 'bg-[#141824] hover:bg-[#1b1f2a] border-[#262a35] hover:border-[#e4e1a9]/50 text-[#dfe2f0]'
            }`}
            title="Open Credit Wallet (Consumer Experience with AI Agent)"
          >
            <Wallet className="w-3.5 h-3.5 text-[#e4e1a9] group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline font-medium">Credit Wallet</span>
          </button>

          {/* Ask Credit Economy Global AI Command Bar Trigger */}
          <button
            onClick={() => {
              setCommandBarInitialQuery('');
              setIsCommandBarOpen(true);
            }}
            className="hidden md:flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#141824] hover:bg-[#1b1f2a] border border-[#262a35] hover:border-[#e4e1a9]/50 text-xs text-[#cac7b8] transition-all cursor-pointer shadow-sm group"
            title="Ask Credit Economy AI Copilot (Cmd+K)"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#e4e1a9] group-hover:scale-110 transition-transform" />
            <span className="hidden md:inline font-medium text-[#dfe2f0]">Ask Credit Economy</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.2 rounded text-[10px] font-mono bg-[#171b26] text-[#939183] border border-[#262a35]">
              ⌘K
            </kbd>
          </button>

          {/* Persona Switcher */}
          <div className="relative hidden xl:block" ref={roleRef}>
            <button
              onClick={() => setIsRoleOpen(!isRoleOpen)}
              className="flex items-center px-2.5 py-1.5 rounded-md bg-[#171b26] border border-[#262a35] hover:bg-[#1b1f2a] text-xs text-[#cac7b8] gap-1.5 transition-colors cursor-pointer"
              title={`Active Persona: ${permission.displayName}`}
            >
              <UserCheck className="w-3.5 h-3.5 text-[#e4e1a9]" />
              <span className="hidden xl:inline text-[#dfe2f0]">{permission.displayName}</span>
              <span className="text-[#48473c] hidden sm:inline">·</span>
              <span className="text-[#e4e1a9] font-medium text-[11px]">
                {currentRole.replace('_', ' ')}
              </span>
              <ChevronDown className="w-3 h-3 text-[#939183] ml-0.5" />
            </button>

            {isRoleOpen && (
              <div className="absolute right-0 mt-2 w-64 p-2 rounded-xl bg-[#141824] border border-[#262a35] shadow-2xl z-50 text-xs space-y-1">
                <div className="px-2.5 py-1.5 text-[10px] font-semibold text-[#939183] border-b border-[#262a35] uppercase tracking-wider">
                  Switch Admin Persona
                </div>
                {availableRoles.map((r) => (
                  <button
                    key={r.role}
                    onClick={() => {
                      setCurrentRole(r.role);
                      setIsRoleOpen(false);
                    }}
                    className={`w-full text-left p-2 rounded-lg transition-colors block cursor-pointer ${
                      currentRole === r.role
                        ? 'bg-[#1b1f2a] text-[#e4e1a9]'
                        : 'text-[#dfe2f0] hover:bg-[#1b1f2a]/60'
                    }`}
                  >
                    <div className="font-semibold text-xs">{r.displayName}</div>
                    <div className="text-[10px] text-[#939183] mt-0.5">{r.department}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Reset Demo State Button */}
          <button
            onClick={resetGoldenDemo}
            className="hidden 2xl:flex items-center px-2 py-1.5 rounded-md hover:bg-[#171b26] text-[#939183] hover:text-[#dfe2f0] text-xs transition-colors cursor-pointer"
            title="Reset system demo state"
          >
            <RotateCcw className="w-3.5 h-3.5 sm:mr-1" />
            <span className="hidden lg:inline text-[11px]">Reset</span>
          </button>

          {/* Primary CTA */}
          <button
            onClick={() => navigate('/transactions/new')}
            className="flex items-center px-3.5 py-1.5 rounded-md bg-[#e4e1a9] hover:bg-[#d8d598] text-[#171b26] font-semibold text-xs transition-colors shadow-sm cursor-pointer gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Create transaction</span>
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <nav aria-label="Mobile primary navigation" className="lg:hidden border-t border-[#262a35] bg-[#141824] px-4 py-3">
          <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 gap-1.5">
            {navSections.map((section) => {
              const active = currentPath === section.path || (section.path !== '/' && currentPath.startsWith(section.path));
              return (
                <button
                  key={section.id}
                  onClick={() => {
                    navigate(section.path);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`min-h-10 rounded-md border px-3 py-2 text-left text-xs font-medium transition-colors ${
                    active
                      ? 'bg-[#c8c58f]/20 border-[#c8c58f]/60 text-[#e4e1a9]'
                      : 'bg-[#171b26] border-[#262a35] text-[#dfe2f0] hover:bg-[#1b1f2a]'
                  }`}
                >
                  {section.label}
                </button>
              );
            })}
          </div>
        </nav>
      )}

      {/* Global AI Command Bar Modal (MCP Orchestration) */}
      <AICommandBarModal
        isOpen={isCommandBarOpen}
        onClose={() => setIsCommandBarOpen(false)}
        initialQuery={commandBarInitialQuery}
      />
    </header>
  );
};
