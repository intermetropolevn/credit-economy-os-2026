import React, { useState } from 'react';
import { useEconomic } from '../context/EconomicContext';
import { WalletPolicy } from '../types';
import { Shield, Clock, AlertTriangle, ArrowUpDown, CheckCircle2, Lock } from 'lucide-react';

export const WalletPoliciesScreen: React.FC = () => {
  const { walletPolicies, updateWalletPolicy, creditTypes, navigate } = useEconomic();

  const activePolicy = walletPolicies[0];
  const [waterfall, setWaterfall] = useState<string[]>(activePolicy?.spendWaterfallOrder || ['ct-promo', 'ct-sponsored', 'ct-eco', 'ct-paid']);
  const [reservationTtl, setReservationTtl] = useState<number>(activePolicy?.defaultReservationTtlMin || 15);
  const [dailyLimit, setDailyLimit] = useState<number>(activePolicy?.maxDailySpendCredits || 50000);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const moveUp = (index: number) => {
    if (index === 0) return;
    const next = [...waterfall];
    const temp = next[index - 1];
    next[index - 1] = next[index];
    next[index] = temp;
    setWaterfall(next);
  };

  const moveDown = (index: number) => {
    if (index === waterfall.length - 1) return;
    const next = [...waterfall];
    const temp = next[index + 1];
    next[index + 1] = next[index];
    next[index] = temp;
    setWaterfall(next);
  };

  const handleSave = () => {
    updateWalletPolicy(activePolicy.id, {
      spendWaterfallOrder: waterfall,
      defaultReservationTtlMin: Number(reservationTtl),
      maxDailySpendCredits: Number(dailyLimit),
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
            <span>Credit Economy OS</span>
            <span>/</span>
            <span>Policies & Risk</span>
            <span>/</span>
            <span className="text-[#e4e1a9]">Wallet Policies</span>
          </div>
          <h1 className="text-2xl font-semibold text-neutral-100 tracking-tight mt-1">
            Wallet Encumbrance & Spend Waterfall Governance
          </h1>
          <p className="text-sm text-neutral-400 mt-1 max-w-3xl">
            Regulates the automatic debit sequence across credit classes, reservation TTL auto-release, and strict zero-overdraft invariants.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/risk-policies')}
            className="px-3.5 py-1.5 text-xs font-medium text-neutral-300 bg-neutral-900 border border-neutral-700 hover:bg-neutral-800 rounded-md transition-colors"
          >
            Risk Policies
          </button>
          <button
            onClick={handleSave}
            className="px-3.5 py-1.5 text-xs font-medium text-black bg-[#e4e1a9] hover:bg-[#d8d598] rounded-md transition-colors"
          >
            Save Policy Rules
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Waterfall Ordering */}
        <div className="p-5 rounded-lg bg-neutral-900/40 border border-neutral-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-neutral-100">
              FIFO Spend Waterfall Order
            </h2>
            <span className="text-xs font-mono text-[#e4e1a9]">
              Consumer Cash Protection
            </span>
          </div>
          <p className="text-xs text-neutral-400">
            When a user initiates an execution, credits are encumbered in the strict sequential order below. Promotional and expiring credits are consumed first.
          </p>

          <div className="space-y-2 pt-2">
            {waterfall.map((creditId, index) => {
              const ct = creditTypes.find(c => c.id === creditId);
              return (
                <div
                  key={creditId}
                  className="flex items-center justify-between p-3 rounded-lg bg-neutral-900 border border-neutral-800 text-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">
                      #{index + 1}
                    </span>
                    <div>
                      <div className="font-semibold text-neutral-100">
                        {ct?.name || creditId}
                      </div>
                      <div className="text-xs font-mono text-neutral-400">
                        {ct?.code} · {ct?.expiryDays ? `${ct.expiryDays}d Expiry` : 'Non-expiring'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      disabled={index === 0}
                      onClick={() => moveUp(index)}
                      className="px-2 py-1 text-xs rounded bg-neutral-800 hover:bg-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed text-neutral-300"
                    >
                      ▲ Up
                    </button>
                    <button
                      disabled={index === waterfall.length - 1}
                      onClick={() => moveDown(index)}
                      className="px-2 py-1 text-xs rounded bg-neutral-800 hover:bg-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed text-neutral-300"
                    >
                      ▼ Down
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reservation TTL and Overdraft Constraints */}
        <div className="p-5 rounded-lg bg-neutral-900/40 border border-neutral-800 space-y-5">
          <h2 className="text-base font-semibold text-neutral-100">
            Encumbrance & Execution Constraints
          </h2>

          <div className="space-y-4 text-sm">
            <div>
              <label className="block text-xs font-mono text-neutral-400 uppercase mb-1">
                Default Reservation TTL (Time-To-Live in Minutes)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="1"
                  max="1440"
                  value={reservationTtl}
                  onChange={(e) => setReservationTtl(Number(e.target.value))}
                  className="w-32 bg-neutral-800 border border-neutral-700 text-neutral-100 px-3 py-2 rounded-md font-mono tabular-nums text-sm"
                />
                <span className="text-xs text-neutral-400">
                  Escrow automatically releases unfinalized credits back to user on timeout.
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-neutral-400 uppercase mb-1">
                Tier 1 Daily Spend Velocity Cap (Credits / 24h)
              </label>
              <input
                type="number"
                min="1000"
                max="5000000"
                step="5000"
                value={dailyLimit}
                onChange={(e) => setDailyLimit(Number(e.target.value))}
                className="w-full bg-neutral-800 border border-neutral-700 text-neutral-100 px-3 py-2 rounded-md font-mono tabular-nums text-sm"
              />
            </div>

            <div className="p-4 rounded-lg bg-neutral-900 border border-neutral-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-neutral-400">
                  Strict Zero-Overdraft Invariant
                </span>
                <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Hard Constraint
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Wallets cannot balance below 0.00 credits under any circumstance. Reservations are pre-encumbered before execution begins.
              </p>
            </div>

            {saveSuccess && (
              <div className="p-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800 rounded flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Wallet policy updated and active across clearing daemons.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
