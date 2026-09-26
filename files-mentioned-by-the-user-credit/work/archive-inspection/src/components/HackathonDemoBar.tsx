import React, { useState, useEffect } from 'react';
import { useEconomic } from '../context/EconomicContext';
import {
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  FileText,
  ShieldCheck,
  Lock,
  ChevronDown,
  ChevronUp,
  Layers,
  Info,
} from 'lucide-react';

export interface GoldenPathStep {
  number: number;
  title: string;
  shortLabel: string;
  targetPath: string;
  talkingPoint: string;
  actionPrompt: string;
  screenGoal: string;
}

export const GOLDEN_PATH_STEPS: GoldenPathStep[] = [
  {
    number: 1,
    title: 'Show Economic Overview',
    shortLabel: 'Overview',
    targetPath: '/',
    talkingPoint: 'Credit Economy OS manages credit transactions, verification and double-entry ledger settlement.',
    actionPrompt: 'Open TX-1048 to inspect live contract commitment',
    screenGoal: '5,200 CRD total custody across active contracts with verified ledger balance.',
  },
  {
    number: 2,
    title: 'Open TX-1048',
    shortLabel: 'Open TX-1048',
    targetPath: '/transactions/TX-1048',
    talkingPoint: 'TX-1048 is a programmable brand and creative asset contract between Sarah Chen (Payer) and Alex Morgan (Provider).',
    actionPrompt: 'Examine capital custody panel and contract specifications',
    screenGoal: 'Contract registered with 1,000 CRD notional value across 3 tranches.',
  },
  {
    number: 3,
    title: 'Show 1,000 Credits Reserved',
    shortLabel: '1,000 CRD Escrow',
    targetPath: '/transactions/TX-1048',
    talkingPoint: '1,000 credits were encumbered from Sarah Chen into protocol Escrow Account 2010.88 with zero provider disbursal prior to delivery.',
    actionPrompt: 'Trigger AI Assistant to inspect deliverable files',
    screenGoal: 'Payer 500 CRD available, Escrow 1,000 CRD locked, Provider 0 CRD.',
  },
  {
    number: 4,
    title: 'Run AI Verification',
    shortLabel: 'AI Verify',
    targetPath: '/transactions/TX-1048',
    talkingPoint: 'The AI Operator observes ingested deliverables against contract Clauses 2.1, 4.2, and 6.1 without mutating ledger state.',
    actionPrompt: 'Click "Run AI Verification" to request an AI assessment',
    screenGoal: 'The AI runtime evaluates deliverable hashes against contract milestones.',
  },
  {
    number: 5,
    title: 'Show Incomplete Fulfillment',
    shortLabel: 'Exception 4.2',
    targetPath: '/transactions/TX-1048/exception',
    talkingPoint: 'Autonomous inspection flags an exception: Clause 4.2 delivered 3 of 5 assets, but missed 2 vertical 9:16 motion deliverables.',
    actionPrompt: 'Inspect the 3 verified files vs 2 missing format deficiencies',
    screenGoal: 'Deficiency risk isolated: 300 CRD capital at risk in Clause 4.2.',
  },
  {
    number: 6,
    title: 'Show AI Recommendation: Release 700 / Hold 300',
    shortLabel: 'AI Rec: 700/300',
    targetPath: '/transactions/TX-1048/settlement',
    talkingPoint: 'AI recommends: RELEASE 700 CRD for fulfilled milestones, HOLD 300 CRD in protective escrow pending resolution.',
    actionPrompt: 'Inspect the double-entry balance shift matrix',
    screenGoal: 'Proposed split: 700 CRD release, 300 CRD protective retention.',
  },
  {
    number: 7,
    title: 'Show Evidence and Rationale',
    shortLabel: 'Evidence & Rationale',
    targetPath: '/transactions/TX-1048/settlement',
    talkingPoint: 'AI cites verified vector archives, partial social deliverables, and protective source escrow with 87% confidence.',
    actionPrompt: 'Review inspected evidence list and concise contractual rationale',
    screenGoal: 'Verifiable deliverable hashes backing economic adjudication.',
  },
  {
    number: 8,
    title: 'Approve Settlement (Human Governance Gate)',
    shortLabel: 'Approve Settlement',
    targetPath: '/transactions/TX-1048/settlement',
    talkingPoint: 'Protocol Invariant #1: AI can recommend. Only the deterministic engine can execute after explicit human authorization.',
    actionPrompt: 'Sign as Sarah Chen and click "Approve AI Settlement (700 CRD)"',
    screenGoal: 'Human risk signature gates final ledger execution.',
  },
  {
    number: 9,
    title: 'Show Final Balances',
    shortLabel: 'Final Balances',
    targetPath: '/transactions/TX-1048/settled',
    talkingPoint: 'Deterministic engine executes: Provider credited 680 CRD net (+700 release - 20 fee), Escrow retains 300 CRD, Platform +20 fee.',
    actionPrompt: 'Inspect zero-discrepancy double-entry parity table',
    screenGoal: 'Total Debits 1,020 CRD = Total Credits 1,020 CRD (Δ = 0.00 CRD).',
  },
  {
    number: 10,
    title: 'Open Double-Entry Ledger',
    shortLabel: 'Open Ledger',
    targetPath: '/ledger',
    talkingPoint: 'Every executed action creates an append-only cryptographic ledger entry. No transaction can be settled twice.',
    actionPrompt: 'Navigate to immutable ledger to verify historical sequence',
    screenGoal: 'Append-only ledger sequence with cryptographic Merkle hashes.',
  },
  {
    number: 11,
    title: 'Show Reconciliation = Balanced',
    shortLabel: 'Reconciliation: Balanced',
    targetPath: '/ledger',
    talkingPoint: 'System reconciliation: Zero discrepancy. Debits equal credits across all accounts. Parity is mathematically 100.00% verified.',
    actionPrompt: 'Verify Σ(Debits) - Σ(Credits) = 0.00 CRD in the ledger parity seal',
    screenGoal: 'Reconciliation = BALANCED with zero mathematical discrepancy.',
  },
];

export const HackathonDemoBar: React.FC = () => {
  const { currentPath, navigate, tx, isVerifying, runAIVerification, approveSettlement, resetGoldenDemo } = useEconomic();
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [showAllSteps, setShowAllSteps] = useState<boolean>(false);

  // Compute current step dynamically based on application path and state
  const getCurrentStepIndex = (): number => {
    if (currentPath === '/') {
      return 0; // Step 1: Overview
    }
    if (currentPath === '/transactions/TX-1048') {
      if (tx.state === 'SUBMITTED' || tx.state === 'RESERVED') {
        if (isVerifying) return 3; // Step 4: Run AI Verification
        return 1; // Step 2 / 3: Open TX-1048 & Show 1,000 Credits Reserved
      }
      if (tx.state === 'EXCEPTION_DETECTED' || tx.state === 'RECOMMENDED') {
        return 3; // Just completed verification, ready for step 5
      }
      if (tx.state === 'SETTLED') {
        return 8; // Step 9
      }
    }
    if (currentPath.endsWith('/exception')) {
      return 4; // Step 5: Show incomplete fulfillment
    }
    if (currentPath.endsWith('/settlement')) {
      if (tx.state === 'SETTLED') return 8; // Step 9
      return 5; // Step 6 & 7: AI Recommendation & Evidence, Step 8: Approve
    }
    if (currentPath.endsWith('/settled')) {
      return 8; // Step 9: Show final balances
    }
    if (currentPath === '/ledger') {
      return 9; // Step 10 & 11: Open ledger & Reconciliation = Balanced
    }
    return 0;
  };

  const activeStepIdx = getCurrentStepIndex();
  const activeStep = GOLDEN_PATH_STEPS[activeStepIdx] || GOLDEN_PATH_STEPS[0];

  const handleNextStep = () => {
    if (activeStepIdx === 0) {
      // From Overview (Step 1) -> Open TX-1048 (Step 2 & 3)
      navigate('/transactions/TX-1048');
    } else if (activeStepIdx === 1) {
      // On TX-1048 (Step 2/3) -> Run AI Verification (Step 4)
      if (tx.state === 'SUBMITTED' || tx.state === 'RESERVED') {
        runAIVerification();
      } else {
        navigate('/transactions/TX-1048/exception');
      }
    } else if (activeStepIdx === 2 || activeStepIdx === 3) {
      // After or during verification -> Step 5: Show incomplete fulfillment
      if (tx.state === 'EXCEPTION_DETECTED' || tx.state === 'RECOMMENDED') {
        navigate('/transactions/TX-1048/exception');
      } else {
        runAIVerification();
      }
    } else if (activeStepIdx === 4) {
      // From Exception (Step 5) -> Step 6/7/8: AI Recommendation & Approval
      navigate('/transactions/TX-1048/settlement');
    } else if (activeStepIdx === 5 || activeStepIdx === 6 || activeStepIdx === 7) {
      // On Settlement -> Execute settlement or view settled
      if (tx.state !== 'SETTLED') {
        approveSettlement(700, 300, 'Sarah Chen (Tier-3 Enterprise Auth)');
      } else {
        navigate('/transactions/TX-1048/settled');
      }
    } else if (activeStepIdx === 8) {
      // From Final Settled (Step 9) -> Step 10/11: Open Ledger
      navigate('/ledger');
    } else if (activeStepIdx >= 9) {
      // On Ledger -> Can loop or stay
      resetGoldenDemo();
    }
  };

  const handlePrevStep = () => {
    if (activeStepIdx === 0) return;
    if (activeStepIdx === 1) navigate('/');
    else if (activeStepIdx <= 3) navigate('/transactions/TX-1048');
    else if (activeStepIdx === 4) navigate('/transactions/TX-1048');
    else if (activeStepIdx <= 7) navigate('/transactions/TX-1048/exception');
    else if (activeStepIdx === 8) navigate('/transactions/TX-1048/settlement');
    else if (activeStepIdx >= 9) navigate('/transactions/TX-1048/settled');
  };

  const handleStepSelect = (step: GoldenPathStep) => {
    navigate(step.targetPath);
  };

  return (
    <aside aria-label="Demo Mode Control Panel" className="sticky bottom-0 z-40 bg-[#0a0e18]/95 backdrop-blur-md border-t border-[#313540] shadow-2xl transition-all duration-300">
      {/* Mini top bar with subtle Demo Mode indicator */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-3">
          {/* Subtle Demo Mode Indicator */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#e4e1a9]/10 border border-[#e4e1a9]/40 text-[#e4e1a9] font-mono text-[11px] font-semibold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-[#c8c58f] animate-pulse" />
            <span>DEMO MODE</span>
            <span className="text-[#939183] hidden sm:inline">• Guided Walkthrough</span>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#dfe2f0]">
            <span className="text-[#c8c58f] font-bold">Step {activeStep.number}/11:</span>
            <span className="font-semibold">{activeStep.title}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowAllSteps(!showAllSteps)}
            className="px-2.5 py-1 rounded bg-[#171b26] hover:bg-[#1b1f2a] text-[#cac7b8] hover:text-[#dfe2f0] border border-[#262a35] text-[11px] font-mono transition-colors flex items-center gap-1 cursor-pointer"
            title="View all 11 steps of the presentation"
          >
            <Layers className="w-3 h-3 text-[#c8c58f]" />
            <span className="hidden sm:inline">11-Step Map</span>
          </button>


          <button
            onClick={resetGoldenDemo}
            className="px-2.5 py-1 rounded bg-[#171b26] hover:bg-[#1b1f2a] text-[#e4e1a9] border border-[#48473c] text-[11px] font-mono transition-colors flex items-center gap-1 cursor-pointer"
            title="Reset TX-1048 to initial verification-ready state"
          >
            <RotateCcw className="w-3 h-3 text-[#c8c58f]" />
            <span className="hidden sm:inline">Reset Golden Demo</span>
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded bg-[#171b26] hover:bg-[#1b1f2a] text-[#939183] hover:text-[#dfe2f0] border border-[#262a35] transition-colors cursor-pointer"
            aria-label={isExpanded ? 'Collapse presenter bar' : 'Expand presenter bar'}
          >
            {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Expanded Presenter Teleprompter & Step Controller */}
      {isExpanded && (
        <div className="border-t border-[#1b1f2a] bg-[#070b12] px-4 sm:px-6 py-2.5">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Presenter Talking Cue */}
            <div className="flex-1 flex items-start sm:items-center gap-2.5 min-w-0">
              <div className="w-6 h-6 rounded-full bg-[#171b26] border border-[#48473c] flex items-center justify-center shrink-0 text-[#c8c58f] mt-0.5 sm:mt-0 font-mono text-[10px] font-bold">
                {activeStep.number}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[10px] font-mono text-[#939183] uppercase tracking-wider flex items-center gap-1.5">
                  <span>PRESENTER TALKING POINT</span>
                  <span className="text-[#48473c]">•</span>
                  <span className="text-[#e4e1a9] font-medium">{activeStep.screenGoal}</span>
                </div>
                <p className="text-xs text-[#dfe2f0] truncate sm:whitespace-normal font-sans">
                  "{activeStep.talkingPoint}"
                </p>
              </div>
            </div>

            {/* Manual Controls: Prev, Next, Action */}
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
              <button
                onClick={() => navigate('/demo')}
                className="px-3 py-1.5 rounded-lg bg-[#e4e1a9]/20 hover:bg-[#e4e1a9]/30 text-[#e4e1a9] border border-[#e4e1a9]/50 text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                title="Launch End-to-End Hero Demo (User + Brand + Credit + Pool + MCP)"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Hero Demo: Fitness Loop</span>
                <span className="md:hidden">Hero Demo</span>
              </button>

              <button
                onClick={handlePrevStep}
                disabled={activeStepIdx === 0}
                className={`px-3 py-1.5 rounded text-xs font-mono transition-colors flex items-center gap-1 ${
                  activeStepIdx === 0
                    ? 'bg-[#171b26] text-[#48473c] border border-[#262a35] cursor-not-allowed'
                    : 'bg-[#1b1f2a] hover:bg-[#262a35] text-[#dfe2f0] border border-[#48473c] cursor-pointer'
                }`}
                title="Previous step"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Back</span>
              </button>

              <button
                onClick={handleNextStep}
                disabled={isVerifying}
                className="px-4 py-1.5 rounded-lg bg-[#c8c58f] hover:bg-[#e4e1a9] text-[#33320a] font-bold font-mono text-xs transition-all flex items-center gap-1.5 shadow-md hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <span>
                  {activeStepIdx === 0 && 'Step 2: Open TX-1048 →'}
                  {activeStepIdx === 1 && (tx.state === 'SUBMITTED' ? 'Step 4: Run AI Verification →' : 'Step 5: View Exception →')}
                  {activeStepIdx === 2 && 'Step 4: Run AI Verification →'}
                  {activeStepIdx === 3 && (isVerifying ? 'Verifying Deliverables...' : 'Step 5: Show Exception →')}
                  {activeStepIdx === 4 && 'Step 6: Show AI Recommendation →'}
                  {(activeStepIdx === 5 || activeStepIdx === 6 || activeStepIdx === 7) && (tx.state !== 'SETTLED' ? 'Step 8: Approve Settlement (700 CRD) →' : 'Step 9: Show Final Balances →')}
                  {activeStepIdx === 8 && 'Step 10: Open Ledger →'}
                  {activeStepIdx >= 9 && 'Complete • Replay Demo ↺'}
                </span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Interactive 11-step mini-map when expanded */}
          {showAllSteps && (
            <div className="mt-3 pt-3 border-t border-[#1b1f2a] grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-11 gap-1.5">
              {GOLDEN_PATH_STEPS.map((step, idx) => {
                const isCurrent = idx === activeStepIdx;
                const isPassed = idx < activeStepIdx;

                return (
                  <button
                    key={step.number}
                    onClick={() => handleStepSelect(step)}
                    className={`p-1.5 rounded text-left transition-all font-mono text-[10px] cursor-pointer ${
                      isCurrent
                        ? 'bg-[#c8c58f] text-[#33320a] font-bold shadow-sm'
                        : isPassed
                        ? 'bg-[#171b26] text-[#c8c58f] border border-[#c8c58f]/40 hover:bg-[#1b1f2a]'
                        : 'bg-[#10141e] text-[#939183] border border-[#1b1f2a] hover:text-[#dfe2f0] hover:bg-[#171b26]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>0{step.number}</span>
                      {isPassed && <CheckCircle2 className="w-2.5 h-2.5 text-[#c8c58f]" />}
                    </div>
                    <div className="truncate mt-0.5">{step.shortLabel}</div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </aside>
  );
};
