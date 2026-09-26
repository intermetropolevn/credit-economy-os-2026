import React, { useState } from 'react';
import { useEconomic } from '../context/EconomicContext';
import { getDisplayStatus } from '../utils/statusLabels';
import {
  Search,
  Filter,
  ArrowRight,
  Plus,
  ShieldCheck,
  AlertTriangle,
  Lock,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { TransactionState } from '../types';

export const TransactionsListScreen: React.FC = () => {
  const { allTransactions, navigate } = useEconomic();
  const [filterState, setFilterState] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filtered = allTransactions.filter((tx) => {
    const matchesFilter =
      filterState === 'ALL' ||
      (filterState === 'ACTIVE' && tx.state !== 'SETTLED') ||
      (filterState === 'PENDING_REVIEW' && (tx.state === 'EXCEPTION_DETECTED' || tx.state === 'RECOMMENDED' || tx.state === 'SUBMITTED')) ||
      (filterState === 'SETTLED' && tx.state === 'SETTLED');

    const matchesSearch =
      tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.payer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.provider.name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#262a35]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-[#dfe2f0]">
              Transactions
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#1b1f2a] text-[#c8c58f] border border-[#262a35] font-mono">
              {allTransactions.length} Total
            </span>
          </div>
          <p className="text-xs text-[#939183] mt-1">
            Programmable credit transactions from creation to verification and settlement.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/transactions/new')}
            className="flex items-center px-4 py-2 rounded-lg bg-[#e4e1a9] hover:bg-[#d8d598] text-[#171b26] font-semibold text-xs transition-colors shadow-sm cursor-pointer gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            + Create Transaction
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-[#141824] p-3 rounded-xl border border-[#262a35]">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#939183]" />
          <input
            type="text"
            placeholder="Search by ID (e.g. TX-1048), title, payer, or provider..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1b1f2a] border border-[#262a35] rounded-lg pl-9 pr-3 py-1.5 text-xs text-[#dfe2f0] placeholder-[#939183] focus:outline-none focus:border-[#e4e1a9]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          {[
            { id: 'ALL', label: 'All Transactions' },
            { id: 'ACTIVE', label: 'Active Pipeline' },
            { id: 'PENDING_REVIEW', label: 'Needs Review' },
            { id: 'SETTLED', label: 'Settled' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterState(tab.id)}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                filterState === tab.id
                  ? 'bg-[#e4e1a9] text-[#171b26] font-semibold'
                  : 'bg-[#1b1f2a] text-[#939183] hover:text-[#dfe2f0] hover:bg-[#262a35]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions List Table */}
      <div className="bg-[#141824] border border-[#262a35] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#0f131d] border-b border-[#262a35] text-[#939183] font-medium">
                <th className="py-3 px-5">Transaction</th>
                <th className="py-3 px-4">Parties</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Current Status</th>
                <th className="py-3 px-4">Verification Finding</th>
                <th className="py-3 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262a35]">
              {filtered.map((item) => {
                const status = getDisplayStatus(item.state);
                const hasException = item.state === 'EXCEPTION_DETECTED';
                const isReviewNeeded = item.state === 'RECOMMENDED' || hasException;

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-[#171b26] transition-colors group cursor-pointer"
                    onClick={() => {
                      if (hasException) {
                        navigate(`/transactions/${item.id}/exception`);
                      } else if (item.state === 'RECOMMENDED') {
                        navigate(`/transactions/${item.id}/settlement`);
                      } else if (item.state === 'SETTLED') {
                        navigate(`/transactions/${item.id}/settled`);
                      } else {
                        navigate(`/transactions/${item.id}`);
                      }
                    }}
                  >
                    <td className="py-3.5 px-5 whitespace-nowrap">
                      <div className="font-semibold text-sm text-[#dfe2f0] group-hover:text-[#e4e1a9] transition-colors">
                        {item.id}
                      </div>
                      <div className="text-[11px] text-[#939183] truncate max-w-xs">
                        {item.title}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="text-[#dfe2f0] font-medium">
                        {item.payer.name} <span className="text-[#939183]">→</span> {item.provider.name}
                      </div>
                      <div className="text-[10px] text-[#939183]">
                        Fee: {item.platformFee} CRD
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="text-sm font-semibold font-mono text-[#e4e1a9]">
                        {item.totalValue.toLocaleString()} CRD
                      </div>
                      <div className="text-[10px] text-[#939183]">
                        Escrow: {item.escrowBalance.toLocaleString()} CRD
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${status.badgeClass}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${status.dotClass}`} />
                        {status.label}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-[#939183] max-w-xs">
                      {item.aiVerification ? (
                        <div className="truncate text-[11px]">
                          {item.aiVerification.finding}
                        </div>
                      ) : item.state === 'SETTLED' ? (
                        <div className="text-emerald-400/90 text-[11px] flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Disbursed & reconciled in ledger</span>
                        </div>
                      ) : (
                        <div className="text-[#939183] text-[11px]">
                          {status.description}
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-5 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (hasException) {
                            navigate(`/transactions/${item.id}/exception`);
                          } else if (item.state === 'RECOMMENDED') {
                            navigate(`/transactions/${item.id}/settlement`);
                          } else if (item.state === 'SETTLED') {
                            navigate(`/transactions/${item.id}/settled`);
                          } else {
                            navigate(`/transactions/${item.id}`);
                          }
                        }}
                        className={`px-3 py-1 rounded-md text-xs font-medium transition-all inline-flex items-center gap-1 cursor-pointer ${
                          isReviewNeeded
                            ? 'bg-[#feb26f]/20 hover:bg-[#feb26f]/30 text-[#feb26f] border border-[#feb26f]/40 font-semibold'
                            : 'bg-[#1b1f2a] hover:bg-[#262a35] text-[#dfe2f0] border border-[#262a35]'
                        }`}
                      >
                        <span>{isReviewNeeded ? 'Review' : 'View'}</span>
                        <ArrowRight className="w-3 h-3" />
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
  );
};
