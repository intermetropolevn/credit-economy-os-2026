import React, { useState } from 'react';
import { useEconomic } from '../context/EconomicContext';
import { UserStatus } from '../types';
import {
  Search,
  ArrowRight,
  Shield,
  Layers,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Clock,
  User,
  Users,
  Eye,
  Sliders,
  DollarSign,
  TrendingUp,
  Building2,
  Sparkles,
} from 'lucide-react';
import { UserAIModal } from '../components/UserAIModal';
import { User as UserType } from '../types';

export const UsersListScreen: React.FC = () => {
  const { users, organizations, navigate, setSelectedUserId, setSelectedPoolId, currentPath } = useEconomic();
  const [aiTargetUser, setAiTargetUser] = useState<UserType | null>(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userTypeTab, setUserTypeTab] = useState<'ALL' | 'Consumer' | 'Business' | 'Admin' | 'Segments'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | UserStatus>('ALL');
  const [orgFilter, setOrgFilter] = useState<string>('ALL');

  React.useEffect(() => {
    if (currentPath.includes('type=Consumer')) setUserTypeTab('Consumer');
    else if (currentPath.includes('type=Business')) setUserTypeTab('Business');
    else if (currentPath.includes('type=Admin')) setUserTypeTab('Admin');
    else if (currentPath.includes('type=Segments')) setUserTypeTab('Segments');
    else if (currentPath === '/users') setUserTypeTab('ALL');
  }, [currentPath]);

  const filteredUsers = users.filter((u) => {
    const matchesType =
      userTypeTab === 'ALL'
        ? true
        : userTypeTab === 'Segments'
        ? u.creditAccount.availableCredit > 5000 || u.role === 'Hybrid'
        : (u.userType || (u.role === 'Hybrid' ? 'Consumer' : u.role === 'Provider' || u.role === 'Payer' ? 'Business' : 'Admin')) === userTypeTab;

    const matchesStatus = statusFilter === 'ALL' || u.status === statusFilter;
    const matchesOrg =
      orgFilter === 'ALL' ||
      u.organizationMemberships?.some((m) => m.organizationId === orgFilter) ||
      u.organization.toLowerCase().includes(orgFilter.toLowerCase());

    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.organizationMemberships?.some((m) => m.organizationName.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesType && matchesStatus && matchesOrg && matchesSearch;
  });

  const totalCredits = users.reduce((sum, u) => sum + u.creditAccount.totalCredit, 0);
  const totalReserved = users.reduce((sum, u) => sum + u.creditAccount.reservedCredit, 0);
  const activeCount = users.filter((u) => u.status === 'Active').length;
  const reviewCount = users.filter((u) => u.status === 'Pending Review').length;
  const restrictedCount = users.filter((u) => u.status === 'Restricted' || u.status === 'Suspended').length;

  const getStatusBadge = (status: UserStatus) => {
    switch (status) {
      case 'Active':
        return {
          dotClass: 'bg-emerald-400',
          textClass: 'text-emerald-300',
          badgeClass: 'bg-emerald-500/10 border-emerald-500/30',
        };
      case 'Pending Review':
        return {
          dotClass: 'bg-amber-400',
          textClass: 'text-amber-300',
          badgeClass: 'bg-amber-500/10 border-amber-500/30',
        };
      case 'Restricted':
        return {
          dotClass: 'bg-orange-400',
          textClass: 'text-orange-300',
          badgeClass: 'bg-orange-500/10 border-orange-500/30',
        };
      case 'Suspended':
        return {
          dotClass: 'bg-red-400',
          textClass: 'text-red-300',
          badgeClass: 'bg-red-500/10 border-red-500/30',
        };
      default:
        return {
          dotClass: 'bg-neutral-400',
          textClass: 'text-neutral-300',
          badgeClass: 'bg-neutral-800 border-neutral-700',
        };
    }
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUserId(userId);
    navigate(`/users/${userId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#262a35]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-[#dfe2f0]">
              Users &amp; Digital Identities
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#1b1f2a] text-[#c8c58f] border border-[#262a35] font-mono">
              {users.length} Unified Accounts
            </span>
          </div>
          <p className="text-xs text-[#939183] mt-1">
            Unified identity system where consumers, business owners, and organization members operate in one shared credit economy.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              window.dispatchEvent(
                new CustomEvent('open-credit-economy-ai', {
                  detail: { query: 'Show me users who earn Credits but rarely redeem them.' },
                })
              );
            }}
            className="px-3 py-1.5 rounded-lg bg-[#141824] hover:bg-[#1b1f2a] border border-[#e4e1a9]/40 text-[#e4e1a9] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            title="Ask AI to detect dormant accumulators or segment high-velocity cohorts"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#e4e1a9]" />
            <span>AI Cohort Segmenter (MCP)</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-mono text-[#939183] hidden sm:flex">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Multi-Role Identity Synchronized</span>
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#141824] border border-[#262a35] rounded-xl p-3.5 space-y-1">
          <div className="flex items-center justify-between text-xs text-[#939183]">
            <span>Active Accounts</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono text-[#dfe2f0]">
            {activeCount}{' '}
            <span className="text-xs text-[#939183] font-normal font-sans">
              / {users.length}
            </span>
          </div>
          <div className="text-[11px] text-[#939183]">Good standing</div>
        </div>

        <div className="bg-[#141824] border border-[#262a35] rounded-xl p-3.5 space-y-1">
          <div className="flex items-center justify-between text-xs text-[#939183]">
            <span>Pending Review</span>
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-bold font-mono text-[#feb26f]">
            {reviewCount}
          </div>
          <div className="text-[11px] text-[#939183]">KYC / compliance check</div>
        </div>

        <div className="bg-[#141824] border border-[#262a35] rounded-xl p-3.5 space-y-1">
          <div className="flex items-center justify-between text-xs text-[#939183]">
            <span>Restricted / Suspended</span>
            <Shield className="w-3.5 h-3.5 text-orange-400" />
          </div>
          <div className="text-xl font-bold font-mono text-[#dfe2f0]">
            {restrictedCount}
          </div>
          <div className="text-[11px] text-[#939183]">Limited spending</div>
        </div>

        <div className="bg-[#141824] border border-[#262a35] rounded-xl p-3.5 space-y-1">
          <div className="flex items-center justify-between text-xs text-[#939183]">
            <span>Total User Liquidity</span>
            <DollarSign className="w-3.5 h-3.5 text-[#e4e1a9]" />
          </div>
          <div className="text-xl font-bold font-mono text-[#e4e1a9]">
            {totalCredits.toLocaleString()}{' '}
            <span className="text-xs text-[#939183] font-normal font-sans">CRD</span>
          </div>
          <div className="text-[11px] text-[#939183]">
            {totalReserved.toLocaleString()} CRD encumbered
          </div>
        </div>
      </div>

      {/* Tabs as specified in Section 2 & 3: All Users, Consumer Users, Business Users, Admin Users, Segments */}
      <div className="flex items-center gap-1 overflow-x-auto text-xs bg-[#141824] p-1 rounded-xl border border-[#262a35]">
        {[
          { id: 'ALL', label: `All Users (${users.length})` },
          { id: 'Consumer', label: 'Consumer Users' },
          { id: 'Business', label: 'Business Users' },
          { id: 'Admin', label: 'Admin Users' },
          { id: 'Segments', label: 'High Velocity Segments' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setUserTypeTab(tab.id as any)}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap font-medium ${
              userTypeTab === tab.id
                ? 'bg-[#1b1f2a] text-[#e4e1a9] shadow-sm font-semibold'
                : 'text-[#939183] hover:text-[#dfe2f0]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-[#939183] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, organization..."
            className="w-full bg-[#171b26] border border-[#262a35] rounded-lg pl-9 pr-3 py-2 text-xs text-[#dfe2f0] placeholder-[#939183] focus:outline-none focus:border-[#e4e1a9]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Organization filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[#939183]">Organization:</span>
            <select
              value={orgFilter}
              onChange={(e) => setOrgFilter(e.target.value)}
              className="bg-[#171b26] border border-[#262a35] rounded-lg px-2.5 py-1.5 text-xs text-[#dfe2f0] focus:outline-none focus:border-[#e4e1a9]"
            >
              <option value="ALL">All Organizations</option>
              {organizations.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[#939183]">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-[#171b26] border border-[#262a35] rounded-lg px-2.5 py-1.5 text-xs text-[#dfe2f0] focus:outline-none focus:border-[#e4e1a9]"
            >
              <option value="ALL">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Pending Review">Pending Review</option>
              <option value="Restricted">Restricted</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Data Table */}
      <div className="bg-[#141824] border border-[#262a35] rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#0f131d] border-b border-[#262a35] text-[#939183] font-medium uppercase font-mono text-[10px]">
                <th className="py-3 px-5">User &amp; Identity</th>
                <th className="py-3 px-4">Organization Affiliations</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Available Credit</th>
                <th className="py-3 px-4 text-right">Reserved</th>
                <th className="py-3 px-4 text-right">Active Quests</th>
                <th className="py-3 px-4">Last Activity</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262a35]/60">
              {filteredUsers.map((user) => {
                const badge = getStatusBadge(user.status);

                return (
                  <tr
                    key={user.id}
                    onClick={() => handleSelectUser(user.id)}
                    className="hover:bg-[#171b26]/80 transition-colors group cursor-pointer"
                  >
                    {/* User Identity */}
                    <td className="py-3.5 px-5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#1b1f2a] border border-[#3b4152] text-[#e4e1a9] flex items-center justify-center font-bold text-xs shrink-0 group-hover:border-[#e4e1a9] transition-colors">
                          {user.avatarInitials}
                        </div>
                        <div>
                          <div className="font-semibold text-sm text-[#dfe2f0] group-hover:text-[#e4e1a9] transition-colors flex items-center gap-1.5">
                            <span>{user.name}</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#1b1f2a] text-[#c8c58f] border border-[#262a35]">
                              {user.userType || user.role}
                            </span>
                          </div>
                          <div className="text-[11px] text-[#939183]">
                            {user.email} · <span className="font-mono text-[#cac7b8]">{user.organization}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Organization Affiliations (Section 1 & 3: Multi-Role Display) */}
                    <td className="py-3.5 px-4">
                      {user.organizationMemberships && user.organizationMemberships.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {user.organizationMemberships.map((m, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#1b1f2a] text-[#dfe2f0] border border-[#262a35] inline-flex items-center gap-1"
                            >
                              <Building2 className="w-2.5 h-2.5 text-[#e4e1a9]" />
                              <span>{m.organizationName}</span>
                              <span className="text-[#c8c58f]">({m.role})</span>
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[11px] text-[#939183] italic">Direct Consumer</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${badge.badgeClass}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${badge.dotClass}`} />
                        <span className={badge.textClass}>{user.status}</span>
                      </span>
                    </td>

                    {/* Available Credit */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-right">
                      <span className="font-mono font-bold text-sm text-[#e4e1a9]">
                        {user.creditAccount.availableCredit.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-[#939183] ml-1">CRD</span>
                    </td>

                    {/* Reserved Credit */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-right">
                      <span className="font-mono text-xs text-[#939183]">
                        {user.creditAccount.reservedCredit.toLocaleString()} CRD
                      </span>
                    </td>

                    {/* Active Quests & Programs */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-right font-mono text-[#dfe2f0]">
                      {user.questProgress?.length || user.activeTransactionIds.length} Active
                    </td>

                    {/* Last Activity */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-[#939183] text-[11px]">
                      {user.lastActive}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-5 whitespace-nowrap text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setAiTargetUser(user);
                            setIsAiModalOpen(true);
                          }}
                          className="px-2.5 py-1 rounded bg-[#141824] hover:bg-[#1b1f2a] text-xs text-[#e4e1a9] font-medium border border-[#e4e1a9]/40 inline-flex items-center gap-1 cursor-pointer transition-colors shadow-sm"
                          title="Ask AI about this user (MCP Intelligence)"
                        >
                          <Sparkles className="w-3 h-3 text-[#e4e1a9]" />
                          <span>Ask AI</span>
                        </button>

                        <button
                          onClick={() => handleSelectUser(user.id)}
                          className="px-2.5 py-1 rounded bg-[#1b1f2a] hover:bg-[#262a35] text-xs text-[#dfe2f0] hover:text-[#e4e1a9] font-medium border border-[#262a35] inline-flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <span>Control Center</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* User AI Intelligence Modal (MCP) */}
      <UserAIModal
        user={aiTargetUser}
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onNavigateToPool={(poolId) => {
          setSelectedPoolId(poolId);
          navigate('/pools');
        }}
      />
    </div>
  );
};
