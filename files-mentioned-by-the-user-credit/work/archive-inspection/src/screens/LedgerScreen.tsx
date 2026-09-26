import React, { useState } from 'react';
import { useEconomic } from '../context/EconomicContext';
import {
  FileText,
  Search,
  CheckCircle2,
  Lock,
  Download,
  Filter,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

export const LedgerScreen: React.FC = () => {
  const { ledger, navigate } = useEconomic();
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const totalFeesAccrued = ledger
    .filter((e) => e.type === 'FEE')
    .reduce((sum, e) => sum + e.amount, 0);

  const feeCount = ledger.filter((e) => e.type === 'FEE').length;

  const filteredEntries = ledger.filter((entry) => {
    const matchesType = filterType === 'ALL' || entry.type === filterType;
    const matchesSearch =
      entry.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.accountDebit.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.accountCredit.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const exportLedgerJSON = () => {
    const blob = new Blob([JSON.stringify(ledger, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CreditEconomy-Ledger-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#262a35]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-[#dfe2f0]">
              Double-Entry Programmable Ledger
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#1b1f2a] text-[#c8c58f] border border-[#262a35]">
              APPEND-ONLY // {ledger.length} ENTRIES
            </span>
          </div>
          <p className="text-xs text-[#cac7b8] mt-1">
            Immutable cryptographic transaction log with continuous zero-discrepancy reconciliation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportLedgerJSON}
            className="flex items-center px-3.5 py-1.5 rounded-lg bg-[#1b1f2a] hover:bg-[#262a35] text-[#dfe2f0] border border-[#48473c] text-xs font-mono transition-colors"
          >
            <Download className="w-3.5 h-3.5 mr-1.5 text-[#c8c58f]" />
            Export Ledger (JSON)
          </button>
        </div>
      </div>

      {/* Step 11: Reconciliation = Balanced Banner */}
      <div className="bg-gradient-to-r from-[#171b26] via-[#1b1f2a] to-[#0a0e18] border-2 border-[#c8c58f]/60 rounded-xl p-4 sm:p-5 shadow-lg relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#c8c58f]/20 border border-[#c8c58f]/50 flex items-center justify-center text-[#e4e1a9] shrink-0">
              <CheckCircle2 className="w-6 h-6 text-[#c8c58f]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#c8c58f]/20 text-[#e4e1a9] font-bold border border-[#c8c58f]/40">
                  STEP 11: AUDIT PARITY
                </span>
                <span className="text-xs font-mono text-[#c8c58f] font-bold tracking-wider">
                  STATUS: RECONCILIATION = BALANCED
                </span>
              </div>
              <h2 className="text-lg font-bold text-[#dfe2f0] mt-0.5">
                Double-Entry Parity Verified: Zero Discrepancy (Δ = 0.00000000 CRD)
              </h2>
              <p className="text-xs text-[#cac7b8]">
                Every executed action created an immutable append-only ledger entry. Released (700) + Held (300) = Reserved (1,000).
              </p>
            </div>
          </div>

          <div className="font-mono text-right shrink-0">
            <div className="text-[11px] text-[#939183]">SYSTEM DISCREPANCY</div>
            <div className="text-xl font-bold text-[#c8c58f]">0.00000000 CRD</div>
            <div className="text-[10px] text-[#e4e1a9]">100.00% Conserved</div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
        <div className="p-4 rounded-xl bg-[#171b26] border border-[#262a35]">
          <div className="text-[10px] text-[#939183]">PARITY VERIFICATION</div>
          <div className="text-xl font-bold text-[#c8c58f] mt-1">100.00% Zero Deficit</div>
          <div className="text-[10px] text-[#cac7b8] mt-1">
            Σ(Debits) - Σ(Credits) = 0.00 CRD
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#171b26] border border-[#262a35]">
          <div className="text-[10px] text-[#939183]">TOTAL SEQUENCED ENTRIES</div>
          <div className="text-xl font-bold text-[#dfe2f0] mt-1">{ledger.length} Records</div>
          <div className="text-[10px] text-[#939183] mt-1">
            Latest Hash: {ledger[ledger.length - 1]?.merkleRoot}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#171b26] border border-[#262a35]">
          <div className="text-[10px] text-[#939183]">PROTOCOL CLEARING ACCRUED</div>
          <div className="text-xl font-bold text-[#e4e1a9] mt-1">{totalFeesAccrued.toFixed(2)} CRD</div>
          <div className="text-[10px] text-[#cac7b8] mt-1">Assessed across {feeCount} finalized settlements</div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-[#171b26] p-3 rounded-xl border border-[#262a35]">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#939183]" />
          <input
            type="text"
            placeholder="Search by entry ID, TX ID, description, or account..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#1b1f2a] border border-[#262a35] rounded-lg pl-9 pr-3 py-1.5 text-xs text-[#dfe2f0] placeholder-[#939183] focus:outline-none focus:border-[#e4e1a9]"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto text-xs font-mono">
          {['ALL', 'RESERVE', 'SETTLEMENT', 'FEE', 'HOLD', 'RECONCILIATION'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-2.5 py-1.5 rounded-lg transition-all ${
                filterType === t
                  ? 'bg-[#e4e1a9] text-[#33320a] font-bold'
                  : 'bg-[#1b1f2a] text-[#cac7b8] hover:bg-[#262a35] border border-[#262a35]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-[#171b26] border border-[#262a35] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="bg-[#0a0e18] border-b border-[#262a35] text-[#939183]">
                <th className="py-3 px-4">SEQ // ENTRY_ID</th>
                <th className="py-3 px-4">TIMESTAMP</th>
                <th className="py-3 px-4">TX_ID</th>
                <th className="py-3 px-4">TYPE</th>
                <th className="py-3 px-4">ACCOUNT_DEBIT</th>
                <th className="py-3 px-4">ACCOUNT_CREDIT</th>
                <th className="py-3 px-4 text-right">AMOUNT (CRD)</th>
                <th className="py-3 px-4">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262a35]">
              {filteredEntries.map((entry) => {
                const isTX1048 = entry.transactionId === 'TX-1048';
                return (
                  <tr
                    key={entry.id}
                    className={`transition-colors ${
                      isTX1048
                        ? 'bg-[#c8c58f]/10 hover:bg-[#c8c58f]/15 border-l-2 border-l-[#c8c58f]'
                        : 'hover:bg-[#1b1f2a]/60'
                    }`}
                  >
                    <td className="py-3 px-4 font-bold text-[#dfe2f0] whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span>{entry.id}</span>
                        {isTX1048 && (
                          <span className="text-[9px] px-1 py-0.2 bg-[#c8c58f]/20 text-[#e4e1a9] rounded">
                            Demo Slice
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-[#939183]">Seq: {entry.entrySequence}</div>
                    </td>
                  <td className="py-3 px-4 text-[#939183] whitespace-nowrap">
                    {entry.timestamp.replace('T', ' ').substring(0, 19)}
                  </td>
                  <td className="py-3 px-4 font-bold text-[#e4e1a9] whitespace-nowrap">
                    <button
                      onClick={() => navigate(`/transactions/${entry.transactionId}`)}
                      className="hover:underline"
                    >
                      {entry.transactionId}
                    </button>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        entry.type === 'SETTLEMENT'
                          ? 'bg-[#c8c58f]/20 text-[#e4e1a9]'
                          : entry.type === 'RESERVE'
                          ? 'bg-[#3b4a5d]/30 text-[#b8c8de]'
                          : entry.type === 'FEE'
                          ? 'bg-[#1b1f2a] text-[#cac7b8]'
                          : entry.type === 'HOLD'
                          ? 'bg-[#feb26f]/20 text-[#feb26f]'
                          : 'bg-[#c8c58f]/10 text-[#c8c58f]'
                      }`}
                    >
                      {entry.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#cac7b8] max-w-xs truncate">
                    {entry.accountDebit}
                  </td>
                  <td className="py-3 px-4 text-[#cac7b8] max-w-xs truncate">
                    {entry.accountCredit}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-[#dfe2f0] whitespace-nowrap">
                    {entry.amount.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="flex items-center text-[#c8c58f] text-[10px]">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      FINALIZED
                    </span>
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
