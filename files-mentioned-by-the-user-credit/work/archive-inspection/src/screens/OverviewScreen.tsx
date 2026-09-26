import React, { useState } from 'react';
import { useEconomic } from '../context/EconomicContext';
import { getDisplayStatus } from '../utils/statusLabels';
import {
  Plus,
  ArrowRight,
  Lock,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  FileSearch,
  CheckCircle,
  FileCheck2,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Shield,
  Layers,
  ArrowUpRight,
} from 'lucide-react';

export const OverviewScreen: React.FC = () => {
  const { tx, allTransactions, navigate, runAIVerification, isVerifying } = useEconomic();
  const [lifecycleTab, setLifecycleTab] = useState<'standard' | 'exception'>('standard');

  // Compute status for active transactions
  const activeTxList = [
    {
      id: tx.id,
      title: tx.title,
      parties: `${tx.payer.name} → ${tx.provider.name}`,
      amount: `${tx.totalValue.toLocaleString()} CRD`,
      rawState: tx.state,
      updated: '2 min ago',
      actionPath:
        tx.state === 'EXCEPTION_DETECTED'
          ? `/transactions/${tx.id}/exception`
          : tx.state === 'RECOMMENDED' || tx.state === 'APPROVED'
          ? `/transactions/${tx.id}/settlement`
          : tx.state === 'SETTLED'
          ? `/transactions/${tx.id}/settled`
          : `/transactions/${tx.id}`,
      actionLabel:
        tx.state === 'EXCEPTION_DETECTED' || tx.state === 'RECOMMENDED'
          ? 'Review'
          : 'View',
      isPrimaryFocus: true,
    },
    {
      id: 'TX-1047',
      title: 'Model Quantization & TensorRT Cluster',
      parties: 'VentureScale → Hyperion Labs',
      amount: '2,400 CRD',
      rawState: 'SETTLED' as const,
      updated: 'Today',
      actionPath: '/transactions/TX-1047',
      actionLabel: 'View',
      isPrimaryFocus: false,
    },
    {
      id: 'TX-1046',
      title: 'Autonomous Synthetic Dataset Generation',
      parties: 'DataForge Corp → NeuralMesh AI',
      amount: '3,500 CRD',
      rawState: 'SETTLED' as const,
      updated: 'Today',
      actionPath: '/transactions/TX-1046',
      actionLabel: 'View',
      isPrimaryFocus: false,
    },
    {
      id: 'TX-1045',
      title: 'Zero-Knowledge Circuit Optimization',
      parties: 'Veritas Security → Kryptos Hardware',
      amount: '1,800 CRD',
      rawState: 'EXCEPTION_DETECTED' as const,
      updated: 'Today',
      actionPath: '/transactions/TX-1045',
      actionLabel: 'Review',
      isPrimaryFocus: false,
    },
  ];

  // Helper to determine if a lifecycle step is active for the featured transaction
  const isStepActive = (stepName: string) => {
    switch (stepName) {
      case 'Create':
        return tx.state === 'DRAFT';
      case 'Reserve':
        return tx.state === 'RESERVED';
      case 'Deliver':
        return tx.state === 'SUBMITTED';
      case 'Verify':
        return tx.state === 'VERIFYING';
      case 'Exception':
        return tx.state === 'EXCEPTION_DETECTED';
      case 'Review':
        return tx.state === 'RECOMMENDED' || tx.state === 'APPROVED';
      case 'Settle':
        return tx.state === 'SETTLED';
      default:
        return false;
    }
  };

  const isStepDone = (stepName: string) => {
    switch (stepName) {
      case 'Create':
        return tx.state !== 'DRAFT';
      case 'Reserve':
        return tx.state !== 'DRAFT';
      case 'Deliver':
        return ['SUBMITTED', 'VERIFYING', 'EXCEPTION_DETECTED', 'RECOMMENDED', 'APPROVED', 'SETTLED'].includes(tx.state);
      case 'Verify':
        return ['EXCEPTION_DETECTED', 'RECOMMENDED', 'APPROVED', 'SETTLED'].includes(tx.state);
      case 'Exception':
        return ['RECOMMENDED', 'APPROVED', 'SETTLED'].includes(tx.state);
      case 'Review':
        return ['SETTLED'].includes(tx.state);
      case 'Settle':
        return tx.state === 'SETTLED';
      default:
        return false;
    }
  };

  return (
    <div className="space-y-8">
      {/* ======================================================== */}
      {/* SECTION 1: PAGE HEADER                                   */}
      {/* ======================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#262a35]">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#dfe2f0]">
            Credit Economy
          </h1>
          <p className="text-sm text-[#939183] mt-1">
            Manage credit transactions, verification and settlement.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              window.dispatchEvent(new CustomEvent('open-credit-economy-ai'));
            }}
            className="flex items-center px-3.5 py-2.5 rounded-lg bg-[#141824] hover:bg-[#1b1f2a] border border-[#262a35] hover:border-[#e4e1a9]/50 text-[#dfe2f0] font-medium text-sm transition-all shadow-sm cursor-pointer group"
            title="Ask Credit Economy AI Copilot (Cmd+K)"
          >
            <Sparkles className="w-4 h-4 mr-2 text-[#e4e1a9] group-hover:scale-110 transition-transform" />
            <span>Ask Credit Economy</span>
            <kbd className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-mono bg-[#171b26] text-[#939183] border border-[#262a35]">
              ⌘K
            </kbd>
          </button>
          <button
            onClick={() => navigate('/transactions/new')}
            className="flex items-center px-4 py-2.5 rounded-lg bg-[#e4e1a9] hover:bg-[#d8d598] text-[#171b26] font-semibold text-sm transition-all shadow-sm hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            + Create Transaction
          </button>
        </div>
      </div>

      {/* Embedded MCP / AI Copilot Quick Orchestration Strip */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-[#141824] via-[#171b26] to-[#141824] border border-[#e4e1a9]/30 shadow-lg space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#1b1f2a] border border-[#e4e1a9]/40 text-[#e4e1a9] flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-[#e4e1a9]" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#dfe2f0] flex items-center gap-2">
                <span>Credit Economy AI Orchestration Layer</span>
                <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-[#0c1019] text-[#e4e1a9] border border-[#e4e1a9]/30">
                  MCP Protocol
                </span>
              </span>
              <p className="text-[11px] text-[#939183]">
                AI discovers, queries, recommends, configures and requests actions — validated deterministically by the underlying rules engine.
              </p>
            </div>
          </div>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-credit-economy-ai'))}
            className="text-xs text-[#e4e1a9] hover:underline flex items-center gap-1 font-medium cursor-pointer shrink-0"
          >
            <span>Open Command Bar</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Quick prompt buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pt-1 text-[11px] no-scrollbar">
          <span className="text-[10px] font-mono text-[#939183] shrink-0 uppercase">Try asking:</span>
          {[
            'Find benefits I can redeem with 700 Credits.',
            'Create a weekend campaign for inactive users.',
            'Why is Pool A underperforming?',
            'Find partners interested in acquiring fitness users.',
            'Show me users who earn Credits but rarely redeem them.',
          ].map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => {
                window.dispatchEvent(
                  new CustomEvent('open-credit-economy-ai', { detail: { query: prompt } })
                );
              }}
              className="px-2.5 py-1 rounded-full bg-[#1b1f2a] hover:bg-[#262a35] border border-[#262a35] text-[#cac7b8] hover:text-[#e4e1a9] transition-colors whitespace-nowrap cursor-pointer shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION 2: TRANSACTION LIFECYCLE                         */}
      {/* ======================================================== */}
      <div className="bg-[#141824] border border-[#262a35] rounded-xl p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-[#dfe2f0] flex items-center gap-2">
              <span>Transaction Lifecycle</span>
              <span className="text-xs font-normal text-[#939183]">
                · Click any step to view the workflow
              </span>
            </h2>
            <p className="text-xs text-[#939183] mt-0.5">
              Credits are held safely in escrow until verified work meets contract specifications.
            </p>
          </div>

          {/* Toggle between Standard Flow and Exception Flow */}
          <div className="flex items-center gap-1 p-1 bg-[#1b1f2a] rounded-lg border border-[#262a35] text-xs">
            <button
              onClick={() => setLifecycleTab('standard')}
              className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                lifecycleTab === 'standard'
                  ? 'bg-[#262a35] text-[#e4e1a9] font-medium'
                  : 'text-[#939183] hover:text-[#dfe2f0]'
              }`}
            >
              Standard Flow
            </button>
            <button
              onClick={() => setLifecycleTab('exception')}
              className={`px-3 py-1 rounded transition-colors flex items-center gap-1 cursor-pointer ${
                lifecycleTab === 'exception'
                  ? 'bg-[#262a35] text-[#feb26f] font-medium'
                  : 'text-[#939183] hover:text-[#dfe2f0]'
              }`}
            >
              <AlertTriangle className="w-3 h-3 text-[#feb26f]" />
              <span>Exception Flow</span>
            </button>
          </div>
        </div>

        {/* Standard Flow Steps */}
        {lifecycleTab === 'standard' ? (
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
            {[
              {
                step: '1',
                name: 'Create',
                desc: 'Configure parties & terms',
                icon: Plus,
                path: '/transactions/new',
                isActive: isStepActive('Create'),
                isDone: isStepDone('Create'),
              },
              {
                step: '2',
                name: 'Reserve',
                desc: 'Lock credits in escrow',
                icon: Lock,
                path: `/transactions/${tx.id}`,
                isActive: isStepActive('Reserve'),
                isDone: isStepDone('Reserve'),
              },
              {
                step: '3',
                name: 'Deliver',
                desc: 'Submit work & files',
                icon: UploadCloud,
                path: `/transactions/${tx.id}`,
                isActive: isStepActive('Deliver'),
                isDone: isStepDone('Deliver'),
              },
              {
                step: '4',
                name: 'Verify',
                desc: 'Check evidence vs rules',
                icon: CheckCircle,
                path: `/transactions/${tx.id}`,
                isActive: isStepActive('Verify'),
                isDone: isStepDone('Verify'),
              },
              {
                step: '5',
                name: 'Settle',
                desc: 'Disburse & record ledger',
                icon: FileCheck2,
                path: '/settlement',
                isActive: isStepActive('Settle'),
                isDone: isStepDone('Settle'),
              },
            ].map((node, idx) => {
              const Icon = node.icon;
              return (
                <button
                  key={node.name}
                  onClick={() => navigate(node.path)}
                  className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer relative group ${
                    node.isActive
                      ? 'bg-[#e4e1a9]/10 border-[#e4e1a9] shadow-sm ring-1 ring-[#e4e1a9]/30'
                      : node.isDone
                      ? 'bg-[#171b26] border-[#3b4152] hover:border-[#e4e1a9]/60'
                      : 'bg-[#171b26]/50 border-[#262a35] hover:border-[#3b4152]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-semibold ${
                        node.isActive
                          ? 'bg-[#e4e1a9] text-[#171b26]'
                          : node.isDone
                          ? 'bg-[#1b1f2a] text-[#c8c58f] border border-[#48473c]'
                          : 'bg-[#1b1f2a] text-[#939183]'
                      }`}
                    >
                      {node.step}
                    </span>
                    <Icon
                      className={`w-4 h-4 ${
                        node.isActive
                          ? 'text-[#e4e1a9]'
                          : node.isDone
                          ? 'text-[#c8c58f]'
                          : 'text-[#939183]'
                      }`}
                    />
                  </div>
                  <div
                    className={`font-semibold text-sm ${
                      node.isActive ? 'text-[#e4e1a9]' : 'text-[#dfe2f0]'
                    }`}
                  >
                    {node.name}
                  </div>
                  <div className="text-[11px] text-[#939183] mt-0.5">
                    {node.desc}
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          /* Exception Flow Steps: Verify → Exception → Review → Settle */
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
            {[
              {
                step: '1',
                name: 'Verify Deliverables',
                desc: 'AI checks submitted items',
                icon: CheckCircle,
                path: `/transactions/${tx.id}`,
                highlight: 'neutral',
              },
              {
                step: '2',
                name: 'Exception Flagged',
                desc: 'Discrepancy or missing item',
                icon: AlertTriangle,
                path: `/transactions/${tx.id}/exception`,
                highlight: 'orange',
              },
              {
                step: '3',
                name: 'Review & Action',
                desc: 'Approve, adjust, or request fix',
                icon: FileSearch,
                path: `/transactions/${tx.id}/settlement`,
                highlight: 'yellow',
              },
              {
                step: '4',
                name: 'Settlement',
                desc: 'Execute release & update ledger',
                icon: FileCheck2,
                path: '/settlement',
                highlight: 'green',
              },
            ].map((node) => {
              const Icon = node.icon;
              return (
                <button
                  key={node.name}
                  onClick={() => navigate(node.path)}
                  className="text-left p-3.5 rounded-xl border border-[#feb26f]/30 bg-[#feb26f]/5 hover:bg-[#feb26f]/10 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-6 h-6 rounded-full bg-[#1b1f2a] border border-[#feb26f]/40 text-xs font-mono font-semibold text-[#feb26f] flex items-center justify-center">
                      {node.step}
                    </span>
                    <Icon className="w-4 h-4 text-[#feb26f]" />
                  </div>
                  <div className="font-semibold text-sm text-[#dfe2f0]">
                    {node.name}
                  </div>
                  <div className="text-[11px] text-[#939183] mt-0.5">
                    {node.desc}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* SECTION 3: ACTIVE TRANSACTIONS                           */}
      {/* ======================================================== */}
      <div className="bg-[#141824] border border-[#262a35] rounded-xl overflow-hidden space-y-0">
        <div className="p-5 border-b border-[#262a35] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-[#dfe2f0]">
              Active Transactions
            </h2>
            <p className="text-xs text-[#939183] mt-0.5">
              Review current credit allocations, pending verifications, and settlement states.
            </p>
          </div>

          <button
            onClick={() => navigate('/transactions')}
            className="text-xs text-[#c8c58f] hover:text-[#e4e1a9] font-medium flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <span>View all transactions</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Clean, Simple Transaction Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#0f131d] border-b border-[#262a35] text-[#939183] font-medium">
                <th className="py-3 px-5">Transaction</th>
                <th className="py-3 px-4">Parties</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Current Status</th>
                <th className="py-3 px-4">Updated</th>
                <th className="py-3 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262a35]">
              {activeTxList.map((row) => {
                const status = getDisplayStatus(row.rawState);

                return (
                  <tr
                    key={row.id}
                    className={`hover:bg-[#171b26] transition-colors ${
                      row.isPrimaryFocus ? 'bg-[#1b1f2a]/40' : ''
                    }`}
                  >
                    <td className="py-3.5 px-5">
                      <div className="font-semibold text-sm text-[#dfe2f0]">
                        {row.id}
                      </div>
                      <div className="text-[11px] text-[#939183] truncate max-w-xs">
                        {row.title}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-[#dfe2f0]">
                      {row.parties}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-semibold text-[#e4e1a9]">
                      {row.amount}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${status.badgeClass}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${status.dotClass}`} />
                        {status.label}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-[#939183]">
                      {row.updated}
                    </td>

                    <td className="py-3.5 px-5 text-right">
                      <button
                        onClick={() => navigate(row.actionPath)}
                        className={`px-3 py-1 rounded-md text-xs font-medium transition-all inline-flex items-center gap-1 cursor-pointer ${
                          row.actionLabel === 'Review'
                            ? 'bg-[#feb26f]/20 hover:bg-[#feb26f]/30 text-[#feb26f] border border-[#feb26f]/40 font-semibold'
                            : 'bg-[#1b1f2a] hover:bg-[#262a35] text-[#dfe2f0] border border-[#262a35]'
                        }`}
                      >
                        <span>{row.actionLabel}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* AI Assistant Banner inside Active Transactions workflow */}
        <div className="p-4 bg-[#171b26]/90 border-t border-[#262a35]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-[#1b1f2a] border border-[#3b4152]">
            <div className="space-y-1 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-[11px] font-semibold text-[#e4e1a9] uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-[#c8c58f]" />
                  AI Verification Assistant
                </span>
                <span className="text-[#939183]">·</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-orange-500/15 text-orange-300 border border-orange-500/30">
                  Needs Review (TX-1048)
                </span>
              </div>
              <p className="text-xs text-[#dfe2f0]">
                <strong className="text-[#cac7b8]">Reason:</strong> 2 of 3 required deliverables were submitted. One verification document is missing.
              </p>
              <p className="text-xs text-[#939183]">
                <strong className="text-[#cac7b8]">Recommendation:</strong> Request the missing document before settlement, or execute a partial release of 700 CRD with 300 CRD held in reserve.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
              <button
                onClick={() => navigate('/transactions/TX-1048/exception')}
                className="px-3 py-1.5 rounded-lg bg-[#feb26f]/20 hover:bg-[#feb26f]/30 text-[#feb26f] border border-[#feb26f]/50 text-xs font-medium transition-colors cursor-pointer"
              >
                Review Exception
              </button>
              <button
                onClick={() => navigate('/transactions/TX-1048/settlement')}
                className="px-3 py-1.5 rounded-lg bg-[#e4e1a9] hover:bg-[#d8d598] text-[#171b26] text-xs font-semibold transition-colors cursor-pointer"
              >
                Approve Recommendation
              </button>
              <button
                onClick={() => navigate('/transactions/TX-1048')}
                className="px-3 py-1.5 rounded-lg bg-[#262a35] hover:bg-[#323644] text-[#dfe2f0] text-xs font-medium transition-colors cursor-pointer"
              >
                Request Update
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION 4: SYSTEM STATUS                                 */}
      {/* ======================================================== */}
      <div className="space-y-4">
        <div>
          <h2 className="text-base font-bold text-[#dfe2f0]">
            System Status
          </h2>
          <p className="text-xs text-[#939183] mt-0.5">
            Operational snapshot of credit liquidity, commitments, and settlements.
          </p>
        </div>

        {/* 4 Useful Operational Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#141824] border border-[#262a35] rounded-xl p-4 space-y-1">
            <div className="flex items-center justify-between text-xs text-[#939183]">
              <span>Reserved Credit</span>
              <Lock className="w-3.5 h-3.5 text-[#e4e1a9]" />
            </div>
            <div className="text-2xl font-bold font-mono text-[#dfe2f0]">
              5,200 <span className="text-xs text-[#939183] font-normal">CRD</span>
            </div>
            <div className="text-[11px] text-[#939183]">
              Locked across active escrows
            </div>
          </div>

          <div className="bg-[#141824] border border-[#262a35] rounded-xl p-4 space-y-1">
            <div className="flex items-center justify-between text-xs text-[#939183]">
              <span>Active Transactions</span>
              <Layers className="w-3.5 h-3.5 text-[#b8c8de]" />
            </div>
            <div className="text-2xl font-bold font-mono text-[#dfe2f0]">
              4
            </div>
            <div className="text-[11px] text-[#939183]">
              1 pending review, 3 in pipeline
            </div>
          </div>

          <div className="bg-[#141824] border border-[#262a35] rounded-xl p-4 space-y-1">
            <div className="flex items-center justify-between text-xs text-[#939183]">
              <span>Pending Review</span>
              <AlertTriangle className="w-3.5 h-3.5 text-[#feb26f]" />
            </div>
            <div className="text-2xl font-bold font-mono text-[#feb26f]">
              1
            </div>
            <div className="text-[11px] text-[#939183]">
              Requires human decision
            </div>
          </div>

          <div className="bg-[#141824] border border-[#262a35] rounded-xl p-4 space-y-1">
            <div className="flex items-center justify-between text-xs text-[#939183]">
              <span>Settled Today</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-[#c8c58f]" />
            </div>
            <div className="text-2xl font-bold font-mono text-[#e4e1a9]">
              8,400 <span className="text-xs text-[#939183] font-normal">CRD</span>
            </div>
            <div className="text-[11px] text-[#939183]">
              Reconciled in immutable ledger
            </div>
          </div>
        </div>

        {/* Compact Recent Activity Component */}
        <div className="bg-[#141824] border border-[#262a35] rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#dfe2f0]">
              Recent Activity
            </span>
            <button
              onClick={() => navigate('/ledger')}
              className="text-[11px] text-[#c8c58f] hover:text-[#e4e1a9] transition-colors cursor-pointer"
            >
              Open Ledger →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#171b26] border border-[#262a35]">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                <span className="text-[#dfe2f0]">Credit reserved</span>
                <span className="font-mono text-[#939183]">TX-1048</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-[#e4e1a9]">1,000 CRD</span>
                <span className="text-[#939183] text-[11px]">2 min ago</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#171b26] border border-[#262a35]">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-[#dfe2f0]">Settlement completed</span>
                <span className="font-mono text-[#939183]">TX-1047</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-[#e4e1a9]">2,400 CRD</span>
                <span className="text-[#939183] text-[11px]">12 min ago</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#171b26] border border-[#262a35]">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span className="text-[#dfe2f0]">Deliverables submitted</span>
                <span className="font-mono text-[#939183]">TX-1048</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#cac7b8]">6 files</span>
                <span className="text-[#939183] text-[11px]">45 min ago</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#171b26] border border-[#262a35]">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-[#dfe2f0]">Settlement completed</span>
                <span className="font-mono text-[#939183]">TX-1046</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-[#e4e1a9]">3,500 CRD</span>
                <span className="text-[#939183] text-[11px]">Today</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
