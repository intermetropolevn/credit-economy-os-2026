import React, { useState } from 'react';
import { useEconomic } from '../context/EconomicContext';
import { AuditLogRecord } from '../types';
import { ShieldCheck, RotateCcw, Filter, CheckCircle2, Lock, Search, FileText } from 'lucide-react';

export const AuditLogScreen: React.FC = () => {
  const { auditLogs, navigate } = useEconomic();
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [rollbackSuccessId, setRollbackSuccessId] = useState<string | null>(null);

  const filteredLogs = auditLogs.filter(log => {
    const matchesType = filterType === 'ALL' || log.objectType === filterType;
    const matchesSearch = searchTerm === '' ||
      log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.objectId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleRollback = (log: AuditLogRecord) => {
    setRollbackSuccessId(log.id);
    setTimeout(() => setRollbackSuccessId(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
            <span>Credit Economy OS</span>
            <span>/</span>
            <span>Intelligence & Governance</span>
            <span>/</span>
            <span className="text-[#e4e1a9]">Audit Log</span>
          </div>
          <h1 className="text-2xl font-semibold text-neutral-100 tracking-tight mt-1">
            Immutable Governance & State Transition Journal
          </h1>
          <p className="text-sm text-neutral-400 mt-1 max-w-3xl">
            Append-only record of administrative configuration edits, dual-key human authorizations, and automated risk holds. Cryptographically signed with Ed25519.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/ledger')}
            className="px-3.5 py-1.5 text-xs font-medium text-neutral-300 bg-neutral-900 border border-neutral-700 hover:bg-neutral-800 rounded-md transition-colors"
          >
            Double-Entry Financial Ledger
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1 p-1 bg-neutral-900 rounded-lg border border-neutral-800 overflow-x-auto w-full sm:w-auto">
          {['ALL', 'PriceRule', 'RiskPolicy', 'RewardRule', 'CreditType', 'Settlement'].map(t => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                filterType === t
                  ? 'bg-neutral-800 text-neutral-100 shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {t === 'ALL' ? 'All Objects' : t}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search actor, action, id..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 text-neutral-100 text-xs pl-8 pr-3 py-1.5 rounded-lg font-mono placeholder:text-neutral-600"
          />
        </div>
      </div>

      {/* Audit Log Entries List */}
      <div className="space-y-3">
        {filteredLogs.map(log => (
          <div
            key={log.id}
            className="p-4 rounded-lg bg-neutral-900/40 border border-neutral-800 space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="text-[#e4e1a9] font-semibold">{log.id}</span>
                <span className="text-neutral-500">·</span>
                <span className="text-neutral-400">{log.timestamp.slice(0, 19)}</span>
                <span className="text-neutral-500">·</span>
                <span className="text-neutral-100 font-semibold">{log.actor}</span>
                <span className="text-neutral-500 font-sans">({log.role})</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">
                  {log.objectType} / {log.objectId}
                </span>
                <span className="text-emerald-400 font-semibold">{log.action}</span>
              </div>
            </div>

            {/* Diff View */}
            <div className="p-3 rounded bg-neutral-900 border border-neutral-800/80 text-xs font-mono space-y-1">
              <div className="text-neutral-500 font-sans text-[11px] uppercase">
                Delta Specification
              </div>
              {log.changesDiff.map((diff, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-neutral-400">{diff.field}:</span>
                  <span className="text-red-400/80 line-through">{String(diff.before)}</span>
                  <span className="text-neutral-500">→</span>
                  <span className="text-emerald-400 font-semibold">{String(diff.after)}</span>
                </div>
              ))}
            </div>

            {/* Cryptographic Signature & Rollback Bar */}
            <div className="flex items-center justify-between text-xs font-mono text-neutral-500 pt-1">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-neutral-400">
                  <Lock className="w-3 h-3 text-neutral-500" />
                  {log.signatureHash}
                </span>
                {log.dualSigner && (
                  <span className="text-neutral-400">
                    Dual-Key: <span className="text-neutral-200">{log.dualSigner}</span>
                  </span>
                )}
              </div>

              {log.rollbackAvailable && (
                <div>
                  {rollbackSuccessId === log.id ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Rollback Enqueued
                    </span>
                  ) : (
                    <button
                      onClick={() => handleRollback(log)}
                      className="px-2.5 py-1 text-xs text-neutral-300 hover:text-neutral-100 bg-neutral-800 hover:bg-neutral-700 rounded transition-colors flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" /> Rollback Change
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
