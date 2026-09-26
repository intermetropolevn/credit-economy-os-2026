import React, { useState } from 'react';
import { useEconomic } from '../context/EconomicContext';
import {
  Lock,
  PlusCircle,
  Trash2,
  ShieldCheck,
  Cpu,
  ArrowRight,
  Info,
  CheckCircle2,
  DollarSign,
  Layers,
} from 'lucide-react';

export const CreateTransactionScreen: React.FC = () => {
  const { createAndReserveCredits, navigate } = useEconomic();

  const [title, setTitle] = useState('Autonomous Brand & Dynamic Asset Pipeline');
  const [description, setDescription] = useState(
    'Production-ready vector identity system, cross-platform social dynamic matrix, and source design repository.'
  );
  const [payerName, setPayerName] = useState('Sarah Chen');
  const [providerName, setProviderName] = useState('Alex Morgan');
  const [totalAmount, setTotalAmount] = useState<number>(1000);
  const [platformFee, setPlatformFee] = useState<number>(20);

  const [milestones, setMilestones] = useState([
    {
      id: '1',
      title: 'Brand Identity',
      credits: 300,
      clause: 'Clause 2.1 — Brand Identity Synthesis',
    },
    {
      id: '2',
      title: 'Social Assets',
      credits: 400,
      clause: 'Clause 4.2 — Dynamic Multichannel Social Asset Package',
    },
    {
      id: '3',
      title: 'Source Files',
      credits: 300,
      clause: 'Clause 6.1 — Master Source Files & Intellectual Property',
    },
  ]);

  const payerStartingBalance = 1500;
  const currentMilestoneSum = milestones.reduce((sum, m) => sum + (m.credits || 0), 0);
  const isBalanced = currentMilestoneSum === totalAmount;

  const handleAddMilestone = () => {
    const nextIdx = milestones.length + 1;
    setMilestones([
      ...milestones,
      {
        id: String(Date.now()),
        title: `Milestone ${nextIdx}`,
        credits: 100,
        clause: `Clause ${nextIdx}.1 — Technical Deliverable`,
      },
    ]);
  };

  const handleRemoveMilestone = (id: string) => {
    if (milestones.length <= 1) return;
    setMilestones(milestones.filter((m) => m.id !== id));
  };

  const handleMilestoneChange = (id: string, field: string, value: any) => {
    setMilestones(
      milestones.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isBalanced) return;

    createAndReserveCredits({
      title,
      description,
      payerName,
      providerName,
      totalAmount,
      platformFee,
      milestones,
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#262a35]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-[#dfe2f0]">
              Initialize Transaction &amp; Escrow
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#1b1f2a] text-[#c8c58f] border border-[#262a35]">
              STEP 01 // CAPITAL ENCUMBRANCE
            </span>
          </div>
          <p className="text-xs text-[#cac7b8] mt-1">
            Define multi-party contract terms, tranche weights, and lock credits in autonomous escrow custody.
          </p>
        </div>

        <button
          onClick={() => navigate('/transactions/TX-1048')}
          className="text-xs font-mono text-[#b8c8de] hover:text-[#dfe2f0] underline self-start sm:self-auto"
        >
          Load Seeded TX-1048 Golden Demo →
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Form Specifications */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Allocation Parties */}
          <div className="bg-[#171b26] border border-[#262a35] rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#262a35]">
              <h3 className="text-sm font-bold text-[#dfe2f0] flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-[#1b1f2a] flex items-center justify-center text-[10px] font-mono text-[#e4e1a9] border border-[#48473c]">
                  01
                </span>
                Allocation Parties &amp; Roles
              </h3>
              <span className="text-[10px] font-mono text-[#939183]">MULTI-SIG PARTICIPANTS</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-[#cac7b8] mb-1">
                  PAYER (DEBIT ACCOUNT)
                </label>
                <input
                  type="text"
                  value={payerName}
                  onChange={(e) => setPayerName(e.target.value)}
                  className="w-full bg-[#1b1f2a] border border-[#262a35] rounded-lg px-3 py-2 text-xs font-mono text-[#dfe2f0] focus:outline-none focus:border-[#e4e1a9]"
                  required
                />
                <div className="text-[10px] font-mono text-[#939183] mt-1 flex justify-between">
                  <span>ID: acc-88219 (Compute Ops)</span>
                  <span className="text-[#e4e1a9]">Available: 1,500 CRD</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-[#cac7b8] mb-1">
                  PROVIDER (BENEFICIARY ACCOUNT)
                </label>
                <input
                  type="text"
                  value={providerName}
                  onChange={(e) => setProviderName(e.target.value)}
                  className="w-full bg-[#1b1f2a] border border-[#262a35] rounded-lg px-3 py-2 text-xs font-mono text-[#dfe2f0] focus:outline-none focus:border-[#e4e1a9]"
                  required
                />
                <div className="text-[10px] font-mono text-[#939183] mt-1">
                  ID: acc-10942 (Synthetix Systems)
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-[#cac7b8] mb-1">
                CONTRACT TITLE
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#1b1f2a] border border-[#262a35] rounded-lg px-3 py-2 text-xs text-[#dfe2f0] focus:outline-none focus:border-[#e4e1a9]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[#cac7b8] mb-1">
                SCOPE SPECIFICATION &amp; REPOSITORY OBJECTIVE
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full bg-[#1b1f2a] border border-[#262a35] rounded-lg px-3 py-2 text-xs text-[#dfe2f0] focus:outline-none focus:border-[#e4e1a9]"
                required
              />
            </div>
          </div>

          {/* Section 2: Economic Terms & Fee Routing */}
          <div className="bg-[#171b26] border border-[#262a35] rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#262a35]">
              <h3 className="text-sm font-bold text-[#dfe2f0] flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-[#1b1f2a] flex items-center justify-center text-[10px] font-mono text-[#e4e1a9] border border-[#48473c]">
                  02
                </span>
                Economic Terms &amp; Escrow Custody
              </h3>
              <span className="text-[10px] font-mono text-[#939183]">DETERMINISTIC RULES</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-[#cac7b8] mb-1">
                  TOTAL VALUE TO ENCUMBER (CRD)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={totalAmount}
                    onChange={(e) => setTotalAmount(Number(e.target.value))}
                    min={100}
                    max={1500}
                    className="w-full bg-[#1b1f2a] border border-[#262a35] rounded-lg px-3 py-2 text-sm font-mono font-bold text-[#e4e1a9] focus:outline-none focus:border-[#e4e1a9]"
                    required
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-[#939183]">
                    CRD
                  </span>
                </div>
                <div className="text-[10px] text-[#939183] mt-1">
                  Full 1,000 CRD locked at reservation into Account 2010.88
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-[#cac7b8] mb-1">
                  PROTOCOL SETTLEMENT CLEARING FEE (CRD)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={platformFee}
                    onChange={(e) => setPlatformFee(Number(e.target.value))}
                    className="w-full bg-[#1b1f2a] border border-[#262a35] rounded-lg px-3 py-2 text-sm font-mono text-[#dfe2f0] focus:outline-none focus:border-[#e4e1a9]"
                    required
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-[#939183]">
                    2.0%
                  </span>
                </div>
                <div className="text-[10px] text-[#939183] mt-1">
                  Assessed dynamically at settlement to Account 4050.01
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Contract Milestones & Deliverables */}
          <div className="bg-[#171b26] border border-[#262a35] rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#262a35]">
              <div>
                <h3 className="text-sm font-bold text-[#dfe2f0] flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-[#1b1f2a] flex items-center justify-center text-[10px] font-mono text-[#e4e1a9] border border-[#48473c]">
                    03
                  </span>
                  Contract Milestones &amp; Programmable Tranches
                </h3>
                <p className="text-[11px] text-[#939183] mt-0.5">
                  AI Assistant verifies submitted deliverables against these specified terms
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddMilestone}
                className="flex items-center px-2.5 py-1 rounded bg-[#1b1f2a] hover:bg-[#262a35] text-xs font-mono text-[#e4e1a9] border border-[#48473c] transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5 mr-1" />
                Add Milestone
              </button>
            </div>

            <div className="space-y-3">
              {milestones.map((m, idx) => (
                <div
                  key={m.id}
                  className="p-3.5 rounded-lg bg-[#1b1f2a] border border-[#262a35] space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-[#c8c58f] font-semibold">
                      Milestone 0{idx + 1}
                    </span>
                    {milestones.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMilestone(m.id)}
                        className="text-[#939183] hover:text-[#ffb4ab] transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-mono text-[#939183] mb-1">
                        TITLE
                      </label>
                      <input
                        type="text"
                        value={m.title}
                        onChange={(e) =>
                          handleMilestoneChange(m.id, 'title', e.target.value)
                        }
                        className="w-full bg-[#0a0e18] border border-[#262a35] rounded px-2.5 py-1.5 text-xs text-[#dfe2f0] focus:outline-none focus:border-[#e4e1a9]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-[#939183] mb-1">
                        CREDITS WEIGHT
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={m.credits}
                          onChange={(e) =>
                            handleMilestoneChange(
                              m.id,
                              'credits',
                              Number(e.target.value)
                            )
                          }
                          className="w-full bg-[#0a0e18] border border-[#262a35] rounded px-2.5 py-1.5 text-xs font-mono font-bold text-[#e4e1a9] focus:outline-none focus:border-[#e4e1a9]"
                          required
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono text-[#939183]">
                          CRD
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-[#939183] mb-1">
                      CONTRACT CLAUSE ANCHOR
                    </label>
                    <input
                      type="text"
                      value={m.clause}
                      onChange={(e) =>
                        handleMilestoneChange(m.id, 'clause', e.target.value)
                      }
                      className="w-full bg-[#0a0e18] border border-[#262a35] rounded px-2.5 py-1 text-[11px] font-mono text-[#cac7b8] focus:outline-none focus:border-[#e4e1a9]"
                      required
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-[#0a0e18] border border-[#262a35] text-xs font-mono">
              <span className="text-[#939183]">ALLOCATED TRANCHE SUM:</span>
              <span
                className={`font-bold ${
                  isBalanced ? 'text-[#c8c58f]' : 'text-[#ffb4ab]'
                }`}
              >
                {currentMilestoneSum} / {totalAmount} CRD{' '}
                {isBalanced ? '(100% Balanced)' : '(Sum Mismatch)'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Col: Live Economic Balance Preview & Action */}
        <div className="space-y-6">
          <div className="bg-[#171b26] border border-[#262a35] rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-[#dfe2f0] flex items-center gap-2 pb-3 border-b border-[#262a35]">
              <Lock className="w-4 h-4 text-[#e4e1a9]" />
              Live Escrow Reservation Preview
            </h3>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center text-[#939183]">
                <span>Payer Starting Balance:</span>
                <span className="text-[#dfe2f0]">{payerStartingBalance} CRD</span>
              </div>
              <div className="flex justify-between items-center text-[#feb26f]">
                <span>Escrow Reservation:</span>
                <span>-{totalAmount} CRD</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-[#262a35] font-bold text-[#c8c58f]">
                <span>Payer Remaining Unencumbered:</span>
                <span>{payerStartingBalance - totalAmount} CRD</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#0a0e18] border border-[#262a35] space-y-2 text-xs">
              <div className="text-[10px] font-mono text-[#939183]">
                DETERMINISTIC ESCROW RULES
              </div>
              <div className="text-[11px] text-[#cac7b8] flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#c8c58f] shrink-0" />
                <span>Multi-sig locked in Account 2010.88</span>
              </div>
              <div className="text-[11px] text-[#cac7b8] flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#c8c58f] shrink-0" />
                <span>AI Operator evaluates milestone parity</span>
              </div>
              <div className="text-[11px] text-[#cac7b8] flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#c8c58f] shrink-0" />
                <span>Human-in-the-loop gate before disbursement</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={!isBalanced}
              className={`w-full py-3 rounded-lg font-bold font-mono text-xs transition-all shadow-md flex items-center justify-center gap-2 ${
                isBalanced
                  ? 'bg-[#c8c58f] hover:bg-[#e4e1a9] text-[#33320a] cursor-pointer'
                  : 'bg-[#262a35] text-[#939183] cursor-not-allowed'
              }`}
            >
              <Lock className="w-4 h-4" />
              Create &amp; Reserve Credits ({totalAmount} CRD)
            </button>
          </div>

          {/* Golden scenario quick filler */}
          <div className="p-4 rounded-xl bg-[#171b26] border border-[#262a35] space-y-2">
            <div className="text-xs font-bold text-[#dfe2f0] flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-[#c8c58f]" />
              Golden Demo Shortcut
            </div>
            <p className="text-[11px] text-[#cac7b8] leading-relaxed">
              Want to inspect the canonical TX-1048 Golden Slice directly with the seeded partial delivery exception?
            </p>
            <button
              type="button"
              onClick={() => navigate('/transactions/TX-1048')}
              className="text-xs font-mono text-[#e4e1a9] hover:underline flex items-center gap-1 pt-1"
            >
              Jump directly to TX-1048 →
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
