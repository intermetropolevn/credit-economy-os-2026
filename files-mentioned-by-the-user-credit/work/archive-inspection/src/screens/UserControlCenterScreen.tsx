import React, { useState, useEffect } from 'react';
import { useEconomic } from '../context/EconomicContext';
import { UserStatus, ProposedUserChange, AIUserRecommendation } from '../types';
import { UserJourneyIntelligence } from '../components/UserJourneyIntelligence';
import {
  ArrowLeft,
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
  RefreshCw,
  Sparkles,
  ArrowRight,
  Check,
  X,
  AlertCircle,
  FileText,
  UploadCloud,
  ChevronDown,
  Gift,
  ExternalLink,
  Laptop,
  Building2,
  Target,
  Award,
  Zap,
  Store,
  Wallet,
} from 'lucide-react';
import { CreditWalletExperience } from '../components/CreditWalletExperience';
import { UserAIIntelligenceCard } from '../components/UserAIIntelligenceCard';

export const UserControlCenterScreen: React.FC = () => {
  const {
    users,
    selectedUserId,
    setSelectedUserId,
    setSelectedOrganizationId,
    navigate,
    proposedChange,
    setProposedChange,
    applyProposedChange,
    discardProposedChange,
    userSubmitDeliverable,
    tx,
    pools,
    setSelectedPoolId,
    simulateEarnOpportunity,
    allocateCreditsToGoal,
  } = useEconomic();

  // Find active user or fallback to first user
  const currentUser = users.find((u) => u.id === selectedUserId) || users[0];

  // Admin control form state
  const [activeTab, setActiveTab] = useState<'adjustCredit' | 'creditLimit' | 'status' | 'group' | 'rewards'>('creditLimit');
  const [creditAdjustmentAmount, setCreditAdjustmentAmount] = useState<number>(500);
  const [adjustmentReason, setAdjustmentReason] = useState<string>('Promotional growth credit grant');
  const [newCreditLimit, setNewCreditLimit] = useState<number>(currentUser.creditAccount.creditLimit);
  const [selectedStatus, setSelectedStatus] = useState<UserStatus>(currentUser.status);
  const [statusReason, setStatusReason] = useState<string>('Routine compliance review');
  const [selectedGroup, setSelectedGroup] = useState(currentUser.userGroup);
  const [rewardName, setRewardName] = useState('10% Compute Fee Rebate');
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [previewPortalMode, setPreviewPortalMode] = useState<'overview' | 'wallet'>('overview');

  // Sync local inputs when user changes
  useEffect(() => {
    setNewCreditLimit(currentUser.creditAccount.creditLimit);
    setSelectedStatus(currentUser.status);
    setSelectedGroup(currentUser.userGroup);
    discardProposedChange();
  }, [currentUser.id]);

  // Handler for credit limit change input (triggers proposed state)
  const handleCreditLimitChange = (val: number) => {
    setNewCreditLimit(val);
    if (val === currentUser.creditAccount.creditLimit) {
      discardProposedChange();
      return;
    }

    setProposedChange({
      field: 'creditLimit',
      fieldLabel: 'Credit Limit',
      currentValue: `${currentUser.creditAccount.creditLimit.toLocaleString()} CRD`,
      proposedValue: val,
      reason: 'Administrative line adjustment based on account risk evaluation',
      affects: [
        'Available spending capacity on User Platform',
        'Transaction contract escrow eligibility',
        'User dashboard credit limit indicator',
        `Credit utilization (shifts from ${Math.round(
          (currentUser.creditAccount.reservedCredit / currentUser.creditAccount.creditLimit) * 100
        )}% to ${Math.round((currentUser.creditAccount.reservedCredit / val) * 100)}%)`,
      ],
    });
  };

  // Handler for credit balance adjustment
  const handleCreditAdjustmentChange = (amount: number, reason: string) => {
    setCreditAdjustmentAmount(amount);
    setAdjustmentReason(reason);

    if (amount === 0) {
      discardProposedChange();
      return;
    }

    const newTotal = currentUser.creditAccount.totalCredit + amount;
    const newAvail = currentUser.creditAccount.availableCredit + amount;

    setProposedChange({
      field: 'creditAdjustment',
      fieldLabel: 'Credit Balance Adjustment',
      currentValue: `${currentUser.creditAccount.availableCredit.toLocaleString()} CRD`,
      proposedValue: amount,
      reason: reason || 'Manual credit adjustment by administrator',
      affects: [
        `Immediate spendable balance on User Platform (${newAvail.toLocaleString()} CRD)`,
        'Clearinghouse liability reserve on system balance sheet',
        'Transaction checkout authorization threshold',
        'User platform statement & activity history',
      ],
    });
  };

  // Handler for user status change
  const handleStatusChange = (status: UserStatus, reason: string) => {
    setSelectedStatus(status);
    setStatusReason(reason);

    if (status === currentUser.status) {
      discardProposedChange();
      return;
    }

    const affectsList =
      status === 'Restricted'
        ? [
            'New transaction creation paused immediately',
            'Outbound credit transfers locked',
            'User Platform warning banner displayed',
            'Pending verification claims held in quarantine',
          ]
        : status === 'Suspended'
        ? [
            'All account access suspended on User Platform',
            'Escrow reservations frozen pending compliance sign-off',
            'Marketplace services disconnected',
            'Requires dual-sign clearance to reinstate',
          ]
        : status === 'Active'
        ? [
            'Full transactional capabilities enabled',
            'Multi-sig escrow contract formation authorized',
            'Standard marketplace rate cards unlocked',
            'Real-time automated clearinghouse settlement active',
          ]
        : [
            'Account placed under secondary KYC review',
            'New contract formations above 2,000 CRD require manual officer approval',
            'Notification sent to user requesting verification documents',
          ];

    setProposedChange({
      field: 'status',
      fieldLabel: 'Account Status',
      currentValue: currentUser.status,
      proposedValue: status,
      reason: reason || 'Compliance and risk policy review',
      affects: affectsList,
    });
  };

  // Handler for user group change
  const handleGroupChange = (group: any) => {
    setSelectedGroup(group);
    if (group === currentUser.userGroup) {
      discardProposedChange();
      return;
    }

    setProposedChange({
      field: 'userGroup',
      fieldLabel: 'User Tier Classification',
      currentValue: currentUser.userGroup,
      proposedValue: group,
      reason: 'Account volume tier recalibration',
      affects: [
        'Fee discount schedules and margin tier rates',
        'Concurrent escrow limit allowance',
        'User Platform tier badge in portal view',
      ],
    });
  };

  // Calculate live vs preview values for User Platform Preview
  const isPreview = Boolean(proposedChange);

  const previewAvailableCredit =
    proposedChange?.field === 'creditAdjustment'
      ? currentUser.creditAccount.availableCredit + Number(proposedChange.proposedValue)
      : currentUser.creditAccount.availableCredit;

  const previewTotalCredit =
    proposedChange?.field === 'creditAdjustment'
      ? currentUser.creditAccount.totalCredit + Number(proposedChange.proposedValue)
      : currentUser.creditAccount.totalCredit;

  const previewCreditLimit =
    proposedChange?.field === 'creditLimit'
      ? Number(proposedChange.proposedValue)
      : currentUser.creditAccount.creditLimit;

  const previewStatus =
    proposedChange?.field === 'status'
      ? (proposedChange.proposedValue as UserStatus)
      : currentUser.status;

  const previewGroup =
    proposedChange?.field === 'userGroup'
      ? String(proposedChange.proposedValue)
      : currentUser.userGroup;

  const utilizationPercent = Math.min(
    100,
    Math.round((currentUser.creditAccount.reservedCredit / previewCreditLimit) * 100)
  );

  const handleApply = () => {
    if (!proposedChange) return;

    // Check if sensitive action requires confirmation
    if (
      proposedChange.field === 'status' &&
      (proposedChange.proposedValue === 'Suspended' || proposedChange.proposedValue === 'Restricted')
    ) {
      setShowConfirmModal(true);
      return;
    }

    if (
      proposedChange.field === 'creditAdjustment' &&
      Math.abs(Number(proposedChange.proposedValue)) >= 2000
    ) {
      setShowConfirmModal(true);
      return;
    }

    applyProposedChange(currentUser.id, proposedChange, 'Admin (Risk Officer)');
  };

  const handleConfirmModal = () => {
    if (proposedChange) {
      applyProposedChange(currentUser.id, proposedChange, 'Admin (Risk Officer)');
    }
    setShowConfirmModal(false);
  };

  const handleSelectRecommendation = (rec: AIUserRecommendation) => {
    if (rec.actionType === 'INCREASE_LIMIT') {
      setActiveTab('creditLimit');
      handleCreditLimitChange(7000);
    } else if (rec.actionType === 'ADJUST_CREDIT') {
      setActiveTab('adjustCredit');
      handleCreditAdjustmentChange(500, rec.reason);
    } else {
      setProposedChange({
        field: 'intervention',
        fieldLabel: rec.title,
        currentValue: 'No active notice dispatched',
        proposedValue:
          rec.actionType === 'REQUEST_DOCUMENT'
            ? 'Action Required: Please upload your verification document (Vertical 9:16 Interactive Story Template for TX-1048).'
            : rec.actionType === 'SEND_GUIDANCE'
            ? 'Deliverable Guidance: Review the 1080x1920 MP4/WebP template specifications to accelerate milestone verification.'
            : rec.reason,
        reason: rec.reason,
        affects: rec.affects,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & User Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#262a35]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/users')}
            className="p-1.5 rounded-lg hover:bg-[#1b1f2a] text-[#939183] hover:text-[#dfe2f0] transition-colors cursor-pointer"
            title="Back to all users"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#939183]">
              <span onClick={() => navigate('/users')} className="hover:underline cursor-pointer">
                USERS
              </span>
              <span>/</span>
              <span className="text-[#dfe2f0] font-bold">{currentUser.id}</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-[#dfe2f0] flex items-center gap-2 mt-0.5">
              <span>{currentUser.name}</span>
              <span className="text-xs px-2 py-0.5 rounded bg-[#1b1f2a] text-[#c8c58f] font-normal border border-[#262a35]">
                {currentUser.organization}
              </span>
            </h1>
          </div>
        </div>

        {/* Quick User Switcher Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-mono bg-[#141824] p-1.5 rounded-xl border border-[#262a35]">
          <span className="text-[11px] text-[#939183] px-2 font-sans">Inspect User:</span>
          {users.map((u) => (
            <button
              key={u.id}
              onClick={() => setSelectedUserId(u.id)}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                u.id === currentUser.id
                  ? 'bg-[#e4e1a9] text-[#171b26] font-semibold'
                  : 'text-[#939183] hover:text-[#dfe2f0] hover:bg-[#1b1f2a]'
              }`}
            >
              {u.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Two-Column Main Layout: Left: Admin Control Center; Right: User Platform Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ======================================================== */}
        {/* LEFT COLUMN (7 COLS): ADMIN CONTROL CENTER               */}
        {/* ======================================================== */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section A: Profile Card */}
          <div className="bg-[#141824] border border-[#262a35] rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#262a35]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#e4e1a9] uppercase tracking-wider">
                  A. Profile &amp; Identity
                </span>
              </div>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                  currentUser.status === 'Active'
                    ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                    : currentUser.status === 'Pending Review'
                    ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                    : 'bg-orange-500/10 text-orange-300 border-orange-500/30'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    currentUser.status === 'Active'
                      ? 'bg-emerald-400'
                      : currentUser.status === 'Pending Review'
                      ? 'bg-amber-400'
                      : 'bg-orange-400'
                  }`}
                />
                {currentUser.status}
              </span>
            </div>

            {/* Multi-Role Identity Callout */}
            <div className="p-3 rounded-lg bg-[#171b26] border border-[#262a35] space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#dfe2f0]">{currentUser.name}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#1b1f2a] text-[#e4e1a9] border border-[#262a35]">
                    {currentUser.userType || 'Consumer'} User
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    +{currentUser.creditAccount.totalCredit.toLocaleString()} CRD
                  </span>
                </div>
                <div className="text-[10px] text-[#939183] font-mono">
                  {currentUser.organizationMemberships?.length || 0} Affiliated Orgs
                </div>
              </div>

              {currentUser.organizationMemberships && currentUser.organizationMemberships.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-[#262a35]">
                  <span className="text-[10px] text-[#939183]">Active Roles:</span>
                  {currentUser.organizationMemberships.map((m) => (
                    <span
                      key={m.organizationId}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-[#10141f] text-[#cac7b8] border border-[#262a35]"
                    >
                      <Building2 className="w-2.5 h-2.5 text-[#e4e1a9]" />
                      <span className="font-medium text-[#dfe2f0]">{m.organizationName}</span>
                      <span className="text-[#939183]">({m.role})</span>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-[#171b26] border border-[#262a35]">
                <div className="text-[10px] text-[#939183]">EMAIL</div>
                <div className="text-[#dfe2f0] font-medium mt-0.5 truncate">{currentUser.email}</div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#171b26] border border-[#262a35]">
                <div className="text-[10px] text-[#939183]">ROLE &amp; TIER</div>
                <div className="text-[#dfe2f0] font-medium mt-0.5">
                  {currentUser.role} · {currentUser.userGroup}
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#171b26] border border-[#262a35]">
                <div className="text-[10px] text-[#939183]">WALLET ADDRESS</div>
                <div className="text-[#c8c58f] font-mono mt-0.5 truncate">{currentUser.walletAddress}</div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#171b26] border border-[#262a35]">
                <div className="text-[10px] text-[#939183]">ONBOARDED</div>
                <div className="text-[#dfe2f0] mt-0.5">{new Date(currentUser.createdAt).toLocaleDateString()}</div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#171b26] border border-[#262a35]">
                <div className="text-[10px] text-[#939183]">LAST ACTIVE</div>
                <div className="text-[#dfe2f0] mt-0.5">{currentUser.lastActive}</div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#171b26] border border-[#262a35]">
                <div className="text-[10px] text-[#939183]">ACCOUNT ID</div>
                <div className="text-[#939183] font-mono mt-0.5">{currentUser.creditAccount.accountId}</div>
              </div>
            </div>
          </div>

          {/* Ask AI About This User (MCP Intelligence Layer) */}
          <UserAIIntelligenceCard
            user={currentUser}
            onNavigateToPool={(poolId) => {
              setSelectedPoolId(poolId);
              navigate('/pools');
            }}
          />

          {/* Section B: Economic State */}
          <div className="bg-[#141824] border border-[#262a35] rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#262a35]">
              <span className="text-xs font-semibold text-[#e4e1a9] uppercase tracking-wider">
                B. Economic State
              </span>
              <span className="text-xs text-[#939183] font-mono">
                Currency: {currentUser.creditAccount.currency}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-[#171b26] border border-[#262a35] space-y-1">
                <div className="text-[10px] text-[#939183]">AVAILABLE CREDIT</div>
                <div className="text-xl font-bold font-mono text-[#e4e1a9]">
                  {currentUser.creditAccount.availableCredit.toLocaleString()}
                  <span className="text-xs font-normal text-[#939183] ml-1">CRD</span>
                </div>
                <div className="text-[10px] text-[#939183]">Immediate spending capacity</div>
              </div>

              <div className="p-3 rounded-lg bg-[#171b26] border border-[#262a35] space-y-1">
                <div className="text-[10px] text-[#939183]">RESERVED CREDIT</div>
                <div className="text-xl font-bold font-mono text-[#dfe2f0]">
                  {currentUser.creditAccount.reservedCredit.toLocaleString()}
                  <span className="text-xs font-normal text-[#939183] ml-1">CRD</span>
                </div>
                <div className="text-[10px] text-amber-300/80">
                  {currentUser.creditAccount.reservedCredit > 0
                    ? `Locked in ${currentUser.activeTransactionIds.join(', ')}`
                    : 'No active escrows'}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#171b26] border border-[#262a35] space-y-1">
                <div className="text-[10px] text-[#939183]">CREDIT LIMIT</div>
                <div className="text-xl font-bold font-mono text-[#dfe2f0]">
                  {currentUser.creditAccount.creditLimit.toLocaleString()}
                  <span className="text-xs font-normal text-[#939183] ml-1">CRD</span>
                </div>
                <div className="text-[10px] text-[#939183]">Max approved line</div>
              </div>
            </div>

            {/* Utilization Progress Bar */}
            <div className="p-3 rounded-lg bg-[#171b26] border border-[#262a35] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#939183]">Credit Utilization</span>
                <span className="font-mono text-[#dfe2f0] font-semibold">{utilizationPercent}%</span>
              </div>
              <div className="w-full bg-[#1b1f2a] rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    utilizationPercent > 80
                      ? 'bg-red-400'
                      : utilizationPercent > 50
                      ? 'bg-amber-400'
                      : 'bg-[#c8c58f]'
                  }`}
                  style={{ width: `${utilizationPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-[#939183]">
                <span>0 CRD</span>
                <span>Total Balance: {currentUser.creditAccount.totalCredit.toLocaleString()} CRD</span>
                <span>{previewCreditLimit.toLocaleString()} CRD Cap</span>
              </div>
            </div>
          </div>

          {/* Section C: Organizations & Ecosystem Roles */}
          <div className="bg-[#141824] border border-[#262a35] rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#262a35]">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#e4e1a9]" />
                <span className="text-xs font-semibold text-[#e4e1a9] uppercase tracking-wider">
                  C. Organizations &amp; Multi-Role Memberships
                </span>
              </div>
              <span className="text-xs text-[#939183] font-mono">
                {currentUser.organizationMemberships?.length || 0} Affiliated Entities
              </span>
            </div>

            <div className="space-y-3">
              {currentUser.organizationMemberships && currentUser.organizationMemberships.length > 0 ? (
                currentUser.organizationMemberships.map((m) => (
                  <div
                    key={m.organizationId}
                    className="p-3.5 rounded-lg bg-[#171b26] border border-[#262a35] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#dfe2f0] text-sm">{m.organizationName}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#1b1f2a] text-[#c8c58f] border border-[#262a35]">
                          {m.organizationType}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                          {m.role}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                        <span className="text-[#939183]">Permissions:</span>
                        {m.permissions.map((p) => (
                          <span
                            key={p}
                            className="px-1.5 py-0.5 rounded bg-[#10141f] text-[#cac7b8] border border-[#262a35] font-mono"
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                      <div className="text-[11px] text-[#939183]">
                        Joined: {m.joinedAt} · Programs: {m.programsParticipated} · Earned: {m.creditsEarned.toLocaleString()} CRD · Redeemed: {m.creditsRedeemed.toLocaleString()} CRD
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedOrganizationId(m.organizationId);
                        navigate(`/organizations/${m.organizationId}`);
                      }}
                      className="px-3 py-1.5 rounded-md bg-[#1b1f2a] hover:bg-[#262a35] text-[#e4e1a9] font-medium text-xs transition-colors flex items-center gap-1.5 shrink-0 self-start sm:self-center cursor-pointer border border-[#262a35]"
                    >
                      <span>View Organization</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-lg bg-[#171b26] border border-[#262a35] text-xs text-[#939183] text-center">
                  Independent Individual User (No active business entity affiliations)
                </div>
              )}
            </div>
          </div>

          {/* Section D: Quests & Campaigns Participation */}
          {(currentUser.questProgress?.length || currentUser.campaignParticipation?.length) ? (
            <div className="bg-[#141824] border border-[#262a35] rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#262a35]">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-[#e4e1a9]" />
                  <span className="text-xs font-semibold text-[#e4e1a9] uppercase tracking-wider">
                    D. Quest &amp; Campaign Participation
                  </span>
                </div>
                <span className="text-xs text-[#939183]">
                  Loyalty &amp; Demand Incentives
                </span>
              </div>

              {/* Active Quests */}
              {currentUser.questProgress && currentUser.questProgress.length > 0 && (
                <div className="space-y-2">
                  <div className="text-[11px] font-semibold text-[#cac7b8] uppercase tracking-wider">
                    Active Quests ({currentUser.questProgress.length})
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {currentUser.questProgress.map((q) => (
                      <div key={q.questId} className="p-3 rounded-lg bg-[#171b26] border border-[#262a35] space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-[#dfe2f0] truncate">{q.questName}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                            q.status === 'Completed'
                              ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                              : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                          }`}>
                            {q.status}
                          </span>
                        </div>
                        <div className="text-[10px] text-[#939183] flex items-center justify-between">
                          <span>{q.orgName}</span>
                          <span>{q.creditsEarned > 0 ? `+${q.creditsEarned} CRD Earned` : `${q.progress} / ${q.target}`}</span>
                        </div>
                        <div className="w-full bg-[#1b1f2a] rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-[#e4e1a9] h-full rounded-full transition-all"
                            style={{ width: `${Math.min(100, (q.progress / q.target) * 100)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Campaigns */}
              {currentUser.campaignParticipation && currentUser.campaignParticipation.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-[#262a35]">
                  <div className="text-[11px] font-semibold text-[#cac7b8] uppercase tracking-wider">
                    Campaigns Joined ({currentUser.campaignParticipation.length})
                  </div>
                  <div className="space-y-2">
                    {currentUser.campaignParticipation.map((c) => (
                      <div key={c.campaignId} className="p-3 rounded-lg bg-[#171b26] border border-[#262a35] flex items-center justify-between text-xs">
                        <div>
                          <div className="font-semibold text-[#dfe2f0]">{c.campaignName}</div>
                          <div className="text-[10px] text-[#939183]">
                            {c.orgName} · {c.questsCompleted} / {c.totalQuests} Quests Completed
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-bold text-[#e4e1a9]">+{c.bonusCredits} CRD</span>
                          <div className="text-[10px] text-emerald-400">Bonus Tier</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}

          {/* Section E: User Journey & Decision Support */}
          <UserJourneyIntelligence
            user={currentUser}
            onSelectRecommendation={handleSelectRecommendation}
          />

          {/* Section F: Admin Controls */}
          <div className="bg-[#141824] border border-[#262a35] rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#262a35]">
              <div>
                <span className="text-xs font-semibold text-[#e4e1a9] uppercase tracking-wider">
                  F. Admin Controls
                </span>
                <p className="text-[11px] text-[#939183] mt-0.5">
                  Edits create a proposed state previewed in real-time before applying.
                </p>
              </div>
            </div>

            {/* Control Navigation Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto text-xs bg-[#171b26] p-1 rounded-lg border border-[#262a35]">
              {[
                { id: 'creditLimit', label: 'Credit Limit' },
                { id: 'adjustCredit', label: 'Adjust Credit' },
                { id: 'status', label: 'Change Status' },
                { id: 'group', label: 'User Tier' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-md transition-all cursor-pointer whitespace-nowrap font-medium ${
                    activeTab === tab.id
                      ? 'bg-[#1b1f2a] text-[#e4e1a9] shadow-sm'
                      : 'text-[#939183] hover:text-[#dfe2f0]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab 1: Change Credit Limit */}
            {activeTab === 'creditLimit' && (
              <div className="space-y-4 pt-1">
                <div className="space-y-1.5">
                  <label className="text-xs text-[#cac7b8] flex items-center justify-between">
                    <span>New Credit Limit (CRD)</span>
                    <span className="text-[11px] text-[#939183]">
                      Current: {currentUser.creditAccount.creditLimit.toLocaleString()} CRD
                    </span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={newCreditLimit}
                      onChange={(e) => handleCreditLimitChange(Number(e.target.value))}
                      step={500}
                      min={1000}
                      max={50000}
                      className="flex-1 bg-[#171b26] border border-[#262a35] rounded-lg px-3 py-2 text-sm text-[#dfe2f0] font-mono focus:outline-none focus:border-[#e4e1a9]"
                    />
                    <div className="flex items-center gap-1">
                      {[5000, 7000, 10000, 15000].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => handleCreditLimitChange(preset)}
                          className={`px-2.5 py-1.5 text-xs rounded border transition-colors cursor-pointer ${
                            newCreditLimit === preset
                              ? 'bg-[#e4e1a9] text-[#171b26] font-semibold border-[#e4e1a9]'
                              : 'bg-[#171b26] text-[#939183] hover:text-[#dfe2f0] border-[#262a35]'
                          }`}
                        >
                          {preset / 1000}k
                        </button>
                      ))}
                    </div>
                  </div>
                  <p className="text-[11px] text-[#939183]">
                    Adjusts max concurrent escrow encumbrance and pre-authorized overdraft capability.
                  </p>
                </div>
              </div>
            )}

            {/* Tab 2: Adjust Credit (+/- manual grant/debit) */}
            {activeTab === 'adjustCredit' && (
              <div className="space-y-4 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs text-[#cac7b8]">Adjustment Amount (+ / - CRD)</label>
                    <input
                      type="number"
                      value={creditAdjustmentAmount}
                      onChange={(e) =>
                        handleCreditAdjustmentChange(Number(e.target.value), adjustmentReason)
                      }
                      step={100}
                      className="w-full bg-[#171b26] border border-[#262a35] rounded-lg px-3 py-2 text-sm text-[#dfe2f0] font-mono focus:outline-none focus:border-[#e4e1a9]"
                      placeholder="+500 or -200"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-[#cac7b8]">Reason Category</label>
                    <select
                      value={adjustmentReason}
                      onChange={(e) =>
                        handleCreditAdjustmentChange(creditAdjustmentAmount, e.target.value)
                      }
                      className="w-full bg-[#171b26] border border-[#262a35] rounded-lg px-3 py-2 text-xs text-[#dfe2f0] focus:outline-none focus:border-[#e4e1a9]"
                    >
                      <option value="Promotional growth credit grant">Promotional growth credit grant</option>
                      <option value="Manual dispute refund">Manual dispute refund</option>
                      <option value="Billing discrepancy correction">Billing discrepancy correction</option>
                      <option value="Enterprise incentive subsidy">Enterprise incentive subsidy</option>
                      <option value="SLA non-performance penalty">SLA non-performance penalty</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-1.5 text-xs font-mono">
                  {[250, 500, 1000, 2000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => handleCreditAdjustmentChange(amt, adjustmentReason)}
                      className="px-2.5 py-1 rounded bg-[#171b26] hover:bg-[#1b1f2a] border border-[#262a35] text-[#e4e1a9] cursor-pointer"
                    >
                      +{amt} CRD
                    </button>
                  ))}
                  {[-250, -500].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => handleCreditAdjustmentChange(amt, adjustmentReason)}
                      className="px-2.5 py-1 rounded bg-[#171b26] hover:bg-[#1b1f2a] border border-[#262a35] text-red-300 cursor-pointer"
                    >
                      {amt} CRD
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Change Status */}
            {activeTab === 'status' && (
              <div className="space-y-4 pt-1">
                <div className="space-y-2">
                  <label className="text-xs text-[#cac7b8]">Account Status</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(['Active', 'Pending Review', 'Restricted', 'Suspended'] as UserStatus[]).map(
                      (st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => handleStatusChange(st, statusReason)}
                          className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                            selectedStatus === st
                              ? 'bg-[#1b1f2a] border-[#e4e1a9] text-[#e4e1a9]'
                              : 'bg-[#171b26] border-[#262a35] text-[#939183] hover:text-[#dfe2f0]'
                          }`}
                        >
                          <div className="font-semibold text-xs">{st}</div>
                          <div className="text-[10px] opacity-75 mt-0.5 truncate">
                            {st === 'Active'
                              ? 'Normal access'
                              : st === 'Restricted'
                              ? 'Transfers locked'
                              : st === 'Suspended'
                              ? 'Full freeze'
                              : 'KYC check'}
                          </div>
                        </button>
                      )
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-[#cac7b8]">Action Justification / Audit Note</label>
                  <input
                    type="text"
                    value={statusReason}
                    onChange={(e) => handleStatusChange(selectedStatus, e.target.value)}
                    className="w-full bg-[#171b26] border border-[#262a35] rounded-lg px-3 py-2 text-xs text-[#dfe2f0] focus:outline-none focus:border-[#e4e1a9]"
                    placeholder="Enter reason for status modification..."
                  />
                </div>
              </div>
            )}

            {/* Tab 4: Change User Tier */}
            {activeTab === 'group' && (
              <div className="space-y-4 pt-1">
                <div className="space-y-1.5">
                  <label className="text-xs text-[#cac7b8]">User Tier Classification</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      'Enterprise Tier',
                      'Growth Tier',
                      'Developer Standard',
                      'Verified Partner',
                    ].map((grp) => (
                      <button
                        key={grp}
                        type="button"
                        onClick={() => handleGroupChange(grp)}
                        className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                          selectedGroup === grp
                            ? 'bg-[#1b1f2a] border-[#e4e1a9] text-[#e4e1a9]'
                            : 'bg-[#171b26] border-[#262a35] text-[#939183] hover:text-[#dfe2f0]'
                        }`}
                      >
                        <div className="font-semibold text-xs">{grp}</div>
                        <div className="text-[10px] text-[#939183] mt-0.5">
                          {grp === 'Enterprise Tier' ? 'Multi-sig + 0% fees' : 'Standard clearing'}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* AFFECTS PANEL & CURRENT VS PROPOSED COMPARISON           */}
            {/* ======================================================== */}
            {proposedChange && (
              <div className="p-4 rounded-xl bg-[#171b26] border border-[#feb26f]/40 space-y-3.5 animate-fadeIn">
                <div className="flex items-center justify-between pb-2 border-b border-[#262a35]">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#feb26f]">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Proposed Change — Affects Analysis</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 font-mono">
                    UNSAVED
                  </span>
                </div>

                {/* Current vs Proposed compact comparison */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-[#1b1f2a] border border-[#262a35]">
                    <div className="text-[10px] text-[#939183] uppercase">Current</div>
                    <div className="text-[#dfe2f0] font-bold mt-0.5">
                      {String(proposedChange.currentValue)}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#1b1f2a] border border-[#feb26f]/40">
                    <div className="text-[10px] text-[#feb26f] uppercase">Proposed</div>
                    <div className="text-[#e4e1a9] font-bold mt-0.5">
                      {proposedChange.field === 'creditAdjustment'
                        ? `${Number(proposedChange.proposedValue) >= 0 ? '+' : ''}${proposedChange.proposedValue} CRD`
                        : proposedChange.field === 'creditLimit'
                        ? `${Number(proposedChange.proposedValue).toLocaleString()} CRD`
                        : String(proposedChange.proposedValue)}
                    </div>
                  </div>
                </div>

                {/* Contextual Affects List */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-semibold text-[#dfe2f0]">
                    Downstream System Impact:
                  </div>
                  <ul className="space-y-1 text-xs text-[#cac7b8]">
                    {proposedChange.affects.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Bar */}
                <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#262a35]">
                  <button
                    type="button"
                    onClick={discardProposedChange}
                    className="px-3 py-1.5 rounded-lg bg-[#1b1f2a] hover:bg-[#262a35] text-xs text-[#939183] hover:text-[#dfe2f0] transition-colors cursor-pointer"
                  >
                    Discard Changes
                  </button>
                  <button
                    type="button"
                    onClick={handleApply}
                    className="px-4 py-1.5 rounded-lg bg-[#e4e1a9] hover:bg-[#d8d598] text-[#171b26] font-semibold text-xs transition-all shadow-sm cursor-pointer"
                  >
                    Apply Change &amp; Record Audit
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Section G: Activity Timeline */}
          <div className="bg-[#141824] border border-[#262a35] rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#262a35]">
              <span className="text-xs font-semibold text-[#e4e1a9] uppercase tracking-wider">
                G. User Activity &amp; Audit Trail
              </span>
              <span className="text-xs text-[#939183]">
                {currentUser.activity.length} Events recorded
              </span>
            </div>

            <div className="space-y-3">
              {currentUser.activity.map((event) => (
                <div
                  key={event.id}
                  className="flex items-start justify-between p-3 rounded-lg bg-[#171b26] border border-[#262a35] text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[#dfe2f0]">{event.title}</span>
                      <span className="text-[10px] text-[#939183] font-mono">by {event.actor}</span>
                    </div>
                    <div className="text-[11px] text-[#939183]">{event.description}</div>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <div className="text-[11px] text-[#939183]">{event.timestamp}</div>
                    {event.amount && (
                      <div
                        className={`font-mono font-semibold text-xs mt-0.5 ${
                          event.amount > 0 ? 'text-emerald-400' : 'text-[#e4e1a9]'
                        }`}
                      >
                        {event.amount > 0 ? '+' : ''}
                        {event.amount.toLocaleString()} CRD
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT COLUMN (5 COLS): USER PLATFORM PREVIEW             */}
        {/* ======================================================== */}
        <div className="lg:col-span-5 space-y-4 sticky top-20">
          <div className="bg-[#10141f] border border-[#262a35] rounded-2xl overflow-hidden shadow-2xl relative">
            {/* Window Frame Bar */}
            <div className="bg-[#0b0e17] px-4 py-2.5 border-b border-[#262a35] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#3b4152]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#3b4152]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#3b4152]" />
                </div>
                <div className="text-[11px] font-mono text-[#939183] ml-2 flex items-center gap-1">
                  <Laptop className="w-3 h-3 text-[#c8c58f]" />
                  <span>User Platform Preview</span>
                </div>
              </div>

              {/* Status Badge: Live vs Preview */}
              <div className="flex items-center gap-2">
                {isPreview ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    Preview — Unsaved Changes
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Live
                  </span>
                )}
                <span className="text-[10px] text-[#939183] font-mono hidden sm:inline">
                  {currentUser.lastSyncedAt}
                </span>
              </div>
            </div>

            {/* Portal Content Viewport */}
            <div className="p-5 space-y-5 bg-[#0f131d]">
              {/* User Platform Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#262a35]/80 gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#1b1f2a] border border-[#3b4152] flex items-center justify-center font-bold text-sm text-[#e4e1a9]">
                    {currentUser.avatarInitials}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#dfe2f0]">
                      {currentUser.name.split(' ')[0]}'s Credit Portal
                    </div>
                    <div className="text-[11px] text-[#939183]">
                      {previewGroup} · {previewStatus}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* View Mode Switcher */}
                  <div className="flex items-center p-0.5 rounded-lg bg-[#141824] border border-[#262a35] text-[11px]">
                    <button
                      type="button"
                      onClick={() => setPreviewPortalMode('overview')}
                      className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                        previewPortalMode === 'overview'
                          ? 'bg-[#1b1f2a] text-[#e4e1a9] font-bold shadow-sm'
                          : 'text-[#939183] hover:text-[#dfe2f0]'
                      }`}
                    >
                      Portal Overview
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewPortalMode('wallet')}
                      className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 cursor-pointer ${
                        previewPortalMode === 'wallet'
                          ? 'bg-[#1b1f2a] text-[#e4e1a9] font-bold shadow-sm'
                          : 'text-[#939183] hover:text-[#dfe2f0]'
                      }`}
                    >
                      <Sparkles className="w-3 h-3 text-[#e4e1a9]" />
                      <span>Credit Wallet (AI)</span>
                    </button>
                  </div>

                  <div className="text-right pl-2 border-l border-[#262a35] hidden sm:block">
                    <div className="text-[10px] font-mono text-[#939183]">BALANCE</div>
                    <div className="text-sm font-bold font-mono text-[#e4e1a9]">
                      {previewTotalCredit.toLocaleString()} CRD
                    </div>
                  </div>
                </div>
              </div>

              {previewPortalMode === 'wallet' ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-[#262a35]">
                    <span className="text-[#939183]">Consumer AI Orchestration &amp; Destination Goals</span>
                    <button
                      type="button"
                      onClick={() => navigate('/wallet')}
                      className="text-[#e4e1a9] hover:underline flex items-center gap-1 font-semibold text-xs cursor-pointer"
                    >
                      <span>Open Fullscreen Wallet</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                  <CreditWalletExperience isEmbedded={true} />
                </div>
              ) : (
                <>
                  {/* Operations Notice Banner for Interventions / Notices */}
                  {(currentUser.userPlatformNotification || proposedChange?.field === 'intervention') && (
                <div className="p-3.5 rounded-xl border text-xs bg-amber-500/10 border-amber-500/40 text-amber-200 space-y-1.5 animate-fadeIn">
                  <div className="flex items-center justify-between font-semibold">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>Operations Notice to User</span>
                    </div>
                    {proposedChange?.field === 'intervention' ? (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
                        PREVIEW
                      </span>
                    ) : (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                        LIVE NOTICE
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-[#dfe2f0] leading-relaxed">
                    {proposedChange?.field === 'intervention'
                      ? String(proposedChange.proposedValue)
                      : currentUser.userPlatformNotification}
                  </div>
                </div>
              )}

              {/* Account Standing Banner if Restricted or Suspended */}
              {previewStatus !== 'Active' && (
                <div
                  className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                    previewStatus === 'Restricted'
                      ? 'bg-orange-500/10 border-orange-500/40 text-orange-200'
                      : previewStatus === 'Suspended'
                      ? 'bg-red-500/10 border-red-500/40 text-red-200'
                      : 'bg-amber-500/10 border-amber-500/40 text-amber-200'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-300" />
                  <div className="space-y-0.5">
                    <div className="font-semibold">
                      {previewStatus === 'Restricted'
                        ? 'Account Restricted'
                        : previewStatus === 'Suspended'
                        ? 'Account Suspended'
                        : 'Verification Pending'}
                    </div>
                    <div className="text-[11px] opacity-80">
                      {previewStatus === 'Restricted'
                        ? 'New contract spending is temporarily restricted by administration.'
                        : previewStatus === 'Suspended'
                        ? 'Your access to marketplace clearing is suspended. Contact compliance.'
                        : 'Additional identification is required to lift spending caps.'}
                    </div>
                  </div>
                </div>
              )}

              {/* Balances Card */}
              <div className="p-4 rounded-xl bg-[#141824] border border-[#262a35] space-y-3">
                <div className="text-[11px] font-semibold text-[#939183] uppercase tracking-wider">
                  Available Credits
                </div>
                <div className="flex items-baseline justify-between">
                  <div className="text-3xl font-bold font-mono text-[#e4e1a9]">
                    {previewAvailableCredit.toLocaleString()}
                    <span className="text-xs font-normal text-[#939183] ml-1.5">CRD</span>
                  </div>
                  <div className="text-xs text-[#939183] font-mono">
                    Limit: {previewCreditLimit.toLocaleString()} CRD
                  </div>
                </div>

                <div className="pt-2 border-t border-[#262a35] flex items-center justify-between text-xs">
                  <span className="text-[#939183]">Reserved in Contracts</span>
                  <span className="font-mono text-[#dfe2f0] font-semibold">
                    {currentUser.creditAccount.reservedCredit.toLocaleString()} CRD
                  </span>
                </div>
              </div>

              {/* Active Transaction on User Platform */}
              {currentUser.activeTransactionIds.length > 0 && (
                <div className="p-4 rounded-xl bg-[#141824] border border-[#262a35] space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#939183] font-semibold uppercase tracking-wider text-[10px]">
                      Active Transaction
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#1b1f2a] text-[#c8c58f] border border-[#262a35]">
                      {tx.id}
                    </span>
                  </div>

                  <div className="space-y-0.5">
                    <div className="text-xs font-semibold text-[#dfe2f0] truncate">{tx.title}</div>
                    <div className="text-[11px] text-[#939183] flex items-center justify-between">
                      <span>Status: {tx.state.replace('_', ' ')}</span>
                      <span className="font-mono text-[#e4e1a9] font-medium">
                        {tx.totalValue.toLocaleString()} CRD
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Next Required Action & Two-Way Interactive Submission */}
              <div className="p-4 rounded-xl bg-[#171b26] border border-[#3b4152] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#dfe2f0] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#c8c58f]" />
                    Next Required Action
                  </span>
                  <span className="text-[10px] text-amber-300 font-mono">Pending</span>
                </div>

                {currentUser.pendingActions.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-xs text-[#cac7b8] leading-relaxed">
                      {currentUser.pendingActions[0].title}
                    </p>

                    {/* TWO-WAY USER INTERACTIVE ACTION:
                        Clicking this simulates the user fulfilling their missing deliverable directly on their platform,
                        which updates the shared state and notifies the admin side! */}
                    <button
                      type="button"
                      onClick={() =>
                        userSubmitDeliverable(
                          currentUser.id,
                          'TX-1048',
                          'Vertical 9:16 Interactive Story Template'
                        )
                      }
                      className="w-full py-2 px-3 rounded-lg bg-[#e4e1a9] hover:bg-[#d8d598] text-[#171b26] font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
                    >
                      <UploadCloud className="w-4 h-4" />
                      <span>Simulate User Action: {currentUser.pendingActions[0].actionLabel}</span>
                    </button>
                    <div className="text-[10px] text-center text-[#939183] italic">
                      Updates both User &amp; Admin states simultaneously
                    </div>
                  </div>
                ) : (
                  <div className="p-2.5 rounded-lg bg-[#141824] border border-emerald-500/30 text-xs flex items-center gap-2 text-emerald-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>All required documents submitted &amp; in order!</span>
                  </div>
                )}
              </div>

              {/* Rewards / Benefits Preview */}
              {currentUser.rewards.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <div className="text-[10px] font-semibold text-[#939183] uppercase tracking-wider">
                    Active Rewards &amp; Benefits
                  </div>
                  <div className="space-y-1 text-xs">
                    {currentUser.rewards.map((r) => (
                      <div
                        key={r.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-[#141824] border border-[#262a35]"
                      >
                        <div className="flex items-center gap-1.5 text-[#dfe2f0]">
                          <Gift className="w-3.5 h-3.5 text-[#c8c58f]" />
                          <span>{r.name}</span>
                        </div>
                        {r.credits > 0 && (
                          <span className="font-mono text-[#e4e1a9] text-[11px]">
                            +{r.credits} CRD
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
        </div>
      </div>

      {/* Confirmation Modal for Sensitive Admin Changes */}
      {showConfirmModal && proposedChange && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#141824] border border-[#feb26f] rounded-xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-amber-400">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-bold text-base text-[#dfe2f0]">
                Confirm Sensitive Administrative Change
              </h3>
            </div>

            <p className="text-xs text-[#cac7b8] leading-relaxed">
              You are applying a high-impact modification to{' '}
              <strong className="text-[#dfe2f0]">{currentUser.name}</strong> ({currentUser.email}).
            </p>

            <div className="p-3 rounded-lg bg-[#171b26] border border-[#262a35] text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[#939183]">Field:</span>
                <span className="text-[#dfe2f0] font-semibold">{proposedChange.fieldLabel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#939183]">Current:</span>
                <span className="text-[#939183] line-through">{String(proposedChange.currentValue)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#939183]">New Value:</span>
                <span className="text-[#e4e1a9] font-bold">{String(proposedChange.proposedValue)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#939183]">Justification:</span>
                <span className="text-[#cac7b8] italic truncate max-w-xs">{proposedChange.reason}</span>
              </div>
            </div>

            <p className="text-[11px] text-[#939183]">
              This change will update the user's live platform experience immediately and append an
              immutable audit event to the system governance log.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-3 py-1.5 rounded-lg bg-[#1b1f2a] hover:bg-[#262a35] text-xs text-[#cac7b8] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmModal}
                className="px-4 py-1.5 rounded-lg bg-[#e4e1a9] hover:bg-[#d8d598] text-[#171b26] font-bold text-xs transition-colors cursor-pointer"
              >
                Confirm &amp; Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
