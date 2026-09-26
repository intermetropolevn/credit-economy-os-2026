import React from 'react';
import { useEconomic } from '../context/EconomicContext';
import { ShieldAlert, X, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';

export const EconomicIntegrityAlert: React.FC = () => {
  const { integrityError, clearIntegrityError, navigate } = useEconomic();

  if (!integrityError) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#171b26] border-2 border-[#ff5555] rounded-xl max-w-lg w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={clearIntegrityError}
          className="absolute top-4 right-4 text-[#939183] hover:text-[#dfe2f0] p-1 rounded-lg hover:bg-[#262a35] transition-colors"
          title="Dismiss Alert"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-[#ff5555]/15 border border-[#ff5555]/40 text-[#ff5555] shrink-0">
            <ShieldAlert className="w-7 h-7" />
          </div>

          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#ff5555]/20 text-[#ff5555] border border-[#ff5555]/40 font-bold uppercase tracking-wider">
                {integrityError.code}
              </span>
              <span className="text-xs font-mono text-[#939183]">
                {new Date(integrityError.timestamp).toLocaleTimeString()}
              </span>
            </div>

            <h3 className="text-lg font-bold text-[#dfe2f0] leading-snug">
              {integrityError.title}
            </h3>

            <p className="text-xs text-[#cac7b8] leading-relaxed">
              {integrityError.message}
            </p>
          </div>
        </div>

        {/* Invariant Reference Banner */}
        <div className="mt-4 p-3 rounded-lg bg-[#0a0e18] border border-[#ff5555]/30 space-y-1">
          <div className="text-[10px] font-mono text-[#ff8888] font-bold flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-[#ff5555]" />
            ENFORCED ECONOMIC INVARIANT:
          </div>
          <div className="text-xs font-mono text-[#dfe2f0] font-semibold pl-5">
            "{integrityError.invariant}"
          </div>
        </div>

        {/* Diagnostic Values if available */}
        {integrityError.attemptedValues && (
          <div className="mt-3 p-3 rounded-lg bg-[#1b1f2a] border border-[#262a35] font-mono text-[11px] space-y-1">
            <div className="text-[10px] text-[#939183] uppercase tracking-wider font-bold">
              Rejected Execution Parameters:
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              {integrityError.attemptedValues.releaseAmount !== undefined && (
                <div>
                  <span className="text-[#939183]">Release: </span>
                  <span className="text-[#dfe2f0] font-bold">{integrityError.attemptedValues.releaseAmount} CRD</span>
                </div>
              )}
              {integrityError.attemptedValues.holdAmount !== undefined && (
                <div>
                  <span className="text-[#939183]">Hold: </span>
                  <span className="text-[#dfe2f0] font-bold">{integrityError.attemptedValues.holdAmount} CRD</span>
                </div>
              )}
              {integrityError.attemptedValues.escrowBalance !== undefined && (
                <div>
                  <span className="text-[#939183]">Escrow Limit: </span>
                  <span className="text-[#c8c58f] font-bold">{integrityError.attemptedValues.escrowBalance} CRD</span>
                </div>
              )}
              {integrityError.attemptedValues.totalAllocated !== undefined && (
                <div>
                  <span className="text-[#939183]">Total Attempted: </span>
                  <span className="text-[#ff5555] font-bold">{integrityError.attemptedValues.totalAllocated} CRD</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="mt-5 flex items-center justify-between gap-3 pt-3 border-t border-[#262a35]">
          <span className="text-[11px] text-[#939183]">
            State &amp; balances preserved without mutation.
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={clearIntegrityError}
              className="px-4 py-2 rounded-lg bg-[#c8c58f] hover:bg-[#e4e1a9] text-[#33320a] font-bold font-mono text-xs transition-colors cursor-pointer"
            >
              Acknowledge &amp; Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
