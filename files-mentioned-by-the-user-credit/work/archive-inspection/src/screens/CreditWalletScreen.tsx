import React, { useState } from 'react';
import { useEconomic } from '../context/EconomicContext';
import { CreditWalletExperience } from '../components/CreditWalletExperience';
import {
  Wallet,
  Sparkles,
  UserCheck,
  ChevronDown,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  Target,
  Clock,
  Compass,
  Zap,
} from 'lucide-react';

export const CreditWalletScreen: React.FC = () => {
  const { users, selectedUserId, setSelectedUserId, navigate } = useEconomic();
  const [isUserSwitcherOpen, setIsUserSwitcherOpen] = useState(false);

  const currentUser = users.find((u) => u.id === selectedUserId) || users[0];

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#262a35]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-[#dfe2f0] flex items-center gap-2.5">
              <Wallet className="w-6 h-6 text-[#e4e1a9]" />
              <span>Credit Wallet</span>
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#1b1f2a] text-[#e4e1a9] border border-[#e4e1a9]/30 font-mono">
              MCP AI Layer Active
            </span>
          </div>
          <p className="text-xs text-[#939183] mt-1">
            Programmable consumer credit balance, destination accumulation goals, and natural language AI orchestration.
          </p>
        </div>

        {/* User Identity Switcher (Demonstrating Sarah Chen & other patrons) */}
        <div className="flex items-center gap-2 relative">
          <div className="relative">
            <button
              onClick={() => setIsUserSwitcherOpen(!isUserSwitcherOpen)}
              className="flex items-center px-3 py-1.5 rounded-lg bg-[#141824] hover:bg-[#1b1f2a] border border-[#262a35] text-xs text-[#dfe2f0] gap-2 transition-colors cursor-pointer"
            >
              <div className="w-5 h-5 rounded-full bg-[#1b1f2a] border border-[#3b4152] flex items-center justify-center font-bold text-[10px] text-[#e4e1a9]">
                {currentUser.avatarInitials}
              </div>
              <span className="font-semibold">{currentUser.name}</span>
              <span className="text-[10px] text-[#939183]">({currentUser.creditAccount.availableCredit.toLocaleString()} CRD)</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#939183]" />
            </button>

            {isUserSwitcherOpen && (
              <div className="absolute right-0 mt-2 w-64 p-2 rounded-xl bg-[#141824] border border-[#262a35] shadow-2xl z-50 text-xs space-y-1">
                <div className="px-2.5 py-1.5 text-[10px] font-semibold text-[#939183] border-b border-[#262a35] uppercase tracking-wider">
                  Switch Active Patron Identity
                </div>
                {users.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      setSelectedUserId(u.id);
                      setIsUserSwitcherOpen(false);
                    }}
                    className={`w-full text-left p-2 rounded-lg transition-colors flex items-center justify-between cursor-pointer ${
                      u.id === currentUser.id
                        ? 'bg-[#1b1f2a] text-[#e4e1a9]'
                        : 'text-[#dfe2f0] hover:bg-[#1b1f2a]/60'
                    }`}
                  >
                    <div>
                      <div className="font-semibold">{u.name}</div>
                      <div className="text-[10px] text-[#939183]">{u.userGroup}</div>
                    </div>
                    <span className="font-mono text-[11px] font-bold text-[#e4e1a9]">
                      {u.creditAccount.availableCredit.toLocaleString()} CRD
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => navigate('/pools')}
            className="px-3 py-1.5 rounded-lg bg-[#171b26] hover:bg-[#1b1f2a] border border-[#262a35] text-xs text-[#cac7b8] transition-colors cursor-pointer hidden sm:flex items-center gap-1.5"
          >
            <Compass className="w-3.5 h-3.5 text-[#e4e1a9]" />
            <span>Destination Pools</span>
          </button>
        </div>
      </div>

      {/* Main Credit Wallet Experience */}
      <CreditWalletExperience />
    </div>
  );
};
