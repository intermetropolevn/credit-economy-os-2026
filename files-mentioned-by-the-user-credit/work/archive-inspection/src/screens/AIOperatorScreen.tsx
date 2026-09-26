import React, { useState } from 'react';
import { useEconomic } from '../context/EconomicContext';
import {
  Cpu,
  ShieldCheck,
  Zap,
  Activity,
  CheckCircle2,
  Lock,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  Terminal,
  Layers,
  FileText,
  TrendingUp,
  Scale,
  Check,
  X,
  Eye,
  Compass,
  Code,
  Search,
  Building2,
} from 'lucide-react';
import { MCP_TOOL_REGISTRY } from '../services/mcpOrchestrationService';

export const AIOperatorScreen: React.FC = () => {
  const { tx, navigate, aiCapabilities, aiRecommendations, handleAIRecommendationAction } = useEconomic();
  const [activeTab, setActiveTab] = useState<'ANALYSTS' | 'SANDBOX' | 'MCP_PROTOCOL'>('MCP_PROTOCOL');
  const [selectedAnalystId, setSelectedAnalystId] = useState<string>('cap-01');
  const [mcpCategoryFilter, setMcpCategoryFilter] = useState<string>('ALL');

  const [sandboxMilestones, setSandboxMilestones] = useState<'partial' | 'full' | 'disputed'>('partial');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<any>(null);

  const selectedAnalyst = aiCapabilities.find(c => c.id === selectedAnalystId) || aiCapabilities[0];

  const runSimulation = async () => {
    setIsSimulating(true);
    try {
      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transaction: {
            id: tx.id,
            totalValue: tx.totalValue,
            platformFee: tx.platformFee,
            payer: tx.payer.name,
            provider: tx.provider.name,
          },
          contract: tx.milestones,
          deliverables: tx.milestones.flatMap((m) => m.deliverables),
          economicState: {
            escrowBalance: tx.escrowBalance,
            payerBalance: tx.payer.currentBalance,
          },
          scenario: sandboxMilestones,
        }),
      });
      const data = await res.json();
      setSimulationResult(data);
    } catch {
      // Fallback
      if (sandboxMilestones === 'full') {
        setSimulationResult({
          finding: 'All 3 contractual milestones fulfilled with 100% cryptographic deliverable parity.',
          fulfillmentScore: 100.0,
          riskLevel: 'low',
          recommendation: 'release',
          releaseAmount: 1000,
          holdAmount: 0,
          confidence: 96,
          rationale: 'All contractual milestones verified without discrepancy.',
          evidence: [
            'Brand Identity vector kit verified (300 CRD)',
            'All 5 dynamic social formats verified (400 CRD)',
            'Source repository archive verified (300 CRD)',
          ],
        });
      } else if (sandboxMilestones === 'disputed') {
        setSimulationResult({
          finding: 'Significant deliverable non-conformance detected under Clauses 4.2 and 6.1.',
          fulfillmentScore: 30.0,
          riskLevel: 'high',
          recommendation: 'hold',
          releaseAmount: 300,
          holdAmount: 700,
          confidence: 91,
          rationale: 'Significant deliverable non-conformance detected. Retaining 700 CRD in protective escrow pending arbitration.',
          evidence: [
            'Brand Identity verified (300 CRD)',
            'Failed hash check on Clause 4.2 assets',
            'Source files withheld by provider',
          ],
        });
      } else {
        setSimulationResult({
          finding: 'Partial fulfillment detected (missing 9:16 motion deliverables under Clause 4.2)',
          fulfillmentScore: 70.0,
          riskLevel: 'medium',
          recommendation: 'release',
          releaseAmount: 700,
          holdAmount: 300,
          confidence: 87,
          rationale: 'The provider has fulfilled milestones representing 700 of 1,000 credits. The remaining 300 credits should remain in escrow until the missing deliverable is verified.',
          evidence: [
            'Brand logo vector deliverable verified against Clause 2.1 (300 CRD)',
            'Brand identity guidelines document verified against Clause 2.1',
            '3 of 5 dynamic social marketing assets verified against Clause 4.2 (400 CRD partial)',
            'Missing 9:16 vertical motion formats required under Clause 4.2',
            'Master vector & motion source files held in protective escrow pending Clause 4.2 resolution (300 CRD)',
          ],
        });
      }
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
            <span>Operations</span>
            <span>/</span>
            <span>AI & Monitoring</span>
            <span>/</span>
            <span className="text-[#e4e1a9]">AI Assistant & Recommendations</span>
          </div>
          <h1 className="text-2xl font-semibold text-neutral-100 tracking-tight mt-1">
            AI Assistant &amp; Recommendations
          </h1>
          <p className="text-sm text-neutral-400 mt-1 max-w-3xl">
            Governed by strict separation of concerns: AI Observes → AI Reasons → AI Recommends → Rules Validate → Human Approves → Settlement Executes → Ledger Records.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/settings/integrations')}
            className="px-3.5 py-1.5 text-xs font-medium text-[#e4e1a9] bg-[#141824] border border-[#e4e1a9]/40 hover:bg-[#1b1f2a] rounded-md transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            title="Inspect MCP servers, tools, permission matrix & execution log"
          >
            <Cpu className="w-3.5 h-3.5" />
            AI &amp; Integrations
          </button>
          <button
            onClick={() => navigate('/audit-log')}
            className="px-3.5 py-1.5 text-xs font-medium text-neutral-300 bg-neutral-900 border border-neutral-700 hover:bg-neutral-800 rounded-md transition-colors"
          >
            Audit History
          </button>
          <button
            onClick={() => navigate('/settlement')}
            className="px-3.5 py-1.5 text-xs font-medium text-black bg-[#e4e1a9] hover:bg-[#d8d598] rounded-md transition-colors flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Settlement Console
          </button>
        </div>
      </div>

      {/* Primary Invariant Banner */}
      <div className="p-4 rounded-lg bg-neutral-900/60 border border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-neutral-300">
            <span className="font-semibold text-neutral-100">Separation of Authority:</span> AI cannot directly mutate balances, bypass ledger debits/credits, or execute arbitrary payouts.
          </span>
        </div>
        <div className="flex items-center gap-2 font-mono text-neutral-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Policy Engine: Invariants Active</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-neutral-900 rounded-lg border border-neutral-800 w-fit flex-wrap">
        <button
          onClick={() => setActiveTab('MCP_PROTOCOL')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
            activeTab === 'MCP_PROTOCOL'
              ? 'bg-[#1b1f2a] text-[#e4e1a9] border border-[#e4e1a9]/30 shadow-sm'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#e4e1a9]" />
          <span>MCP Orchestration Layer (6 Pillars &amp; Protocol)</span>
        </button>
        <button
          onClick={() => setActiveTab('ANALYSTS')}
          className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors ${
            activeTab === 'ANALYSTS'
              ? 'bg-neutral-800 text-neutral-100 shadow-sm'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          6 Specialized AI Analysts &amp; Live Recommendations
        </button>
        <button
          onClick={() => setActiveTab('SANDBOX')}
          className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors ${
            activeTab === 'SANDBOX'
              ? 'bg-neutral-800 text-neutral-100 shadow-sm'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          TX-1048 Multimodal Verification Sandbox
        </button>
      </div>

      {activeTab === 'ANALYSTS' ? (
        <div className="space-y-6">
          {/* 6 Specialized Analysts Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {aiCapabilities.map(cap => (
              <button
                key={cap.id}
                onClick={() => setSelectedAnalystId(cap.id)}
                className={`p-4 rounded-lg border text-left transition-all ${
                  selectedAnalystId === cap.id
                    ? 'bg-neutral-800/80 border-[#e4e1a9] shadow-sm'
                    : 'bg-neutral-900/40 border-neutral-800 hover:bg-neutral-800/40'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-neutral-400">{cap.code}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] ${
                    cap.status === 'OBSERVING'
                      ? 'bg-emerald-950/60 text-emerald-400'
                      : cap.status === 'REASONING'
                      ? 'bg-amber-950/60 text-amber-300'
                      : 'bg-blue-950/60 text-blue-300'
                  }`}>
                    {cap.status}
                  </span>
                </div>

                <div className="font-semibold text-neutral-100 text-sm mt-1.5">
                  {cap.role}
                </div>
                <div className="text-xs text-neutral-400 mt-1">
                  {cap.title}
                </div>

                <div className="mt-3 pt-2 border-t border-neutral-800 flex items-center justify-between text-xs font-mono text-neutral-500">
                  <span>Confidence: {Math.round(cap.confidenceScore * 100)}%</span>
                  <span className="text-[#e4e1a9]">{cap.pendingRecommendationsCount} pending</span>
                </div>
              </button>
            ))}
          </div>

          {/* Selected Analyst Spec Card */}
          <div className="p-5 rounded-lg bg-neutral-900/40 border border-neutral-800 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div>
                <h2 className="text-base font-semibold text-neutral-100">
                  {selectedAnalyst.role}: Operational Context & Rules Consulted
                </h2>
                <div className="text-xs font-mono text-neutral-400 mt-0.5">
                  {selectedAnalyst.code} · Last Execution: {selectedAnalyst.lastExecutionTimestamp.slice(0, 19)}
                </div>
              </div>
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Engine Invariant Verified
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3 rounded bg-neutral-900 border border-neutral-800 space-y-1.5">
                <div className="text-neutral-400 uppercase font-sans text-[11px]">
                  Monitored Ingestion Entities
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedAnalyst.monitoredEntities.map(ent => (
                    <span key={ent} className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-200">
                      {ent}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded bg-neutral-900 border border-neutral-800 space-y-1.5">
                <div className="text-neutral-400 uppercase font-sans text-[11px]">
                  Active Deterministic Rules Consulted
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedAnalyst.activeRulesConsulted.map(r => (
                    <span key={r} className="px-2 py-0.5 rounded bg-neutral-800 text-[#e4e1a9]">
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Live Actionable Recommendations Queue */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-neutral-100">
                Actionable AI Recommendations (Awaiting Human Authorization)
              </h2>
              <span className="text-xs font-mono text-neutral-400">
                {aiRecommendations.filter(r => r.status === 'PENDING_REVIEW').length} pending review
              </span>
            </div>

            {aiRecommendations.map(rec => (
              <div
                key={rec.id}
                className="p-5 rounded-lg bg-neutral-900/60 border border-neutral-800 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-neutral-800 text-[#e4e1a9]">
                      {rec.analystCode}
                    </span>
                    <span className="text-neutral-400">·</span>
                    <span className="text-neutral-300 font-semibold">{rec.title}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-neutral-400">
                      Confidence: <span className="text-neutral-100 font-semibold">{Math.round(rec.confidence * 100)}%</span>
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] ${
                      rec.riskLevel === 'HIGH'
                        ? 'bg-red-950/60 text-red-300'
                        : rec.riskLevel === 'MEDIUM'
                        ? 'bg-amber-950/60 text-amber-300'
                        : 'bg-emerald-950/60 text-emerald-300'
                    }`}>
                      {rec.riskLevel} RISK
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="text-neutral-300">
                    <span className="font-semibold text-neutral-100">Observation: </span>
                    {rec.observation}
                  </div>
                  <div className="text-neutral-400">
                    <span className="font-semibold text-neutral-300">Rationale: </span>
                    {rec.rationale}
                  </div>
                  <div className="p-2.5 rounded bg-neutral-900 border border-neutral-800 text-[#e4e1a9] font-mono text-xs">
                    Proposed Action: {rec.proposedAction}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-neutral-800/80 text-xs font-mono">
                  <div className="text-neutral-400">
                    Required Approval Gate: <span className="text-neutral-200">{rec.requiredApprovalRole}</span>
                  </div>

                  {rec.status === 'PENDING_REVIEW' ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAIRecommendationAction(rec.id, 'REJECTED')}
                        className="px-3 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors flex items-center gap-1"
                      >
                        <X className="w-3.5 h-3.5" /> Reject
                      </button>
                      <button
                        onClick={() => handleAIRecommendationAction(rec.id, 'APPROVED')}
                        className="px-3.5 py-1.5 rounded font-medium text-black bg-[#e4e1a9] hover:bg-[#d8d598] transition-colors flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" /> Authorize Execution
                      </button>
                    </div>
                  ) : (
                    <span className={`px-2.5 py-1 rounded text-xs ${
                      rec.status === 'APPROVED' ? 'bg-emerald-950/60 text-emerald-400' : 'bg-red-950/60 text-red-300'
                    }`}>
                      Status: {rec.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* TX-1048 Multimodal Sandbox */
        <div className="space-y-6">
          <div className="bg-[#171b26] border border-[#262a35] rounded-xl p-5 space-y-4">
            <h2 className="text-lg font-bold text-[#dfe2f0]">
              Verification Sandbox for Transaction {tx.id}
            </h2>
            <p className="text-xs text-[#cac7b8]">
              Test how the AI Assistant evaluates contract fulfillment across different evidence states.
            </p>

            <div className="flex flex-wrap gap-2">
              {[
                { id: 'partial', label: 'Scenario A: Partial Fulfillment (1 Missing Asset)' },
                { id: 'full', label: 'Scenario B: 100% Cryptographic Parity' },
                { id: 'disputed', label: 'Scenario C: Contract Non-Conformance & Hold' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSandboxMilestones(s.id as any)}
                  className={`px-3 py-2 rounded text-xs font-mono transition-all ${
                    sandboxMilestones === s.id
                      ? 'bg-[#c8c58f] text-[#33320a] font-bold shadow-md'
                      : 'bg-[#1b1f2a] text-[#cac7b8] hover:text-[#dfe2f0] border border-[#48473c]'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            <button
              onClick={runSimulation}
              disabled={isSimulating}
              className="flex items-center px-4 py-2 rounded bg-[#1b1f2a] hover:bg-[#262a35] text-xs font-mono text-[#e4e1a9] border border-[#48473c] transition-colors"
            >
              <Play className="w-3.5 h-3.5 mr-1.5 text-[#c8c58f]" />
              {isSimulating ? 'Analyzing Multimodal Evidence...' : 'Run Adjudication Inspection'}
            </button>
          </div>

          {simulationResult && (
            <div className="bg-[#171b26] border border-[#262a35] rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#262a35]">
                <h3 className="text-sm font-bold text-[#dfe2f0]">
                  Inspection Output
                </h3>
                <span className="font-mono text-xs text-[#c8c58f]">
                  Score: {simulationResult.fulfillmentScore}% · Confidence: {simulationResult.confidence}%
                </span>
              </div>
              <p className="text-xs text-[#dfe2f0]">
                {simulationResult.finding}
              </p>
              <div className="p-3 rounded bg-[#0a0e18] border border-[#262a35] text-xs font-mono space-y-1">
                <div className="text-[#939183]">Recommendation Proposal:</div>
                <div className="text-[#c8c58f]">
                  Release: {simulationResult.releaseAmount} CRD · Hold: {simulationResult.holdAmount} CRD
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: MCP ORCHESTRATION LAYER & PROTOCOL INSPECTOR      */}
      {/* ======================================================== */}
      {activeTab === 'MCP_PROTOCOL' && (
        <div className="space-y-6">
          {/* Header Context Banner */}
          <div className="p-4 rounded-xl bg-[#141824] border border-[#262a35] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#e4e1a9]">
                  Model Context Protocol (MCP) Orchestration Layer
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-mono">
                  12 Active Tools
                </span>
              </div>
              <p className="text-xs text-[#cac7b8]">
                Enables AI agents to discover, query, recommend, configure, and request deterministic economic actions across users, brands, creators, campaigns, and destination pools.
              </p>
            </div>

            <button
              onClick={() => {
                window.dispatchEvent(
                  new CustomEvent('open-credit-economy-ai', {
                    detail: { query: 'Find benefits I can redeem with 700 Credits.' },
                  })
                );
              }}
              className="px-4 py-2 rounded-lg bg-[#e4e1a9] hover:bg-[#d8d598] text-[#171b26] text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Open Global Command Bar (⌘K)</span>
            </button>
          </div>

          {/* ======================================================== */}
          {/* CONCEPTUAL ARCHITECTURE VISUALIZATION                    */}
          {/* ======================================================== */}
          <div className="p-5 rounded-2xl bg-[#0c1019] border border-[#262a35] space-y-4">
            <div className="flex items-center justify-between border-b border-[#262a35] pb-3">
              <div>
                <h3 className="text-sm font-bold text-[#dfe2f0] flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#e4e1a9]" />
                  <span>Platform Conceptual Architecture</span>
                </h3>
                <p className="text-[11px] text-[#939183]">
                  AI Agent &rarr; MCP Layer &rarr; Core Credit Economy Engine &rarr; Ecosystem
                </p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#171b26] text-[#939183] border border-[#262a35]">
                Source of Truth: Deterministic Rules Engine
              </span>
            </div>

            {/* Architecture Node Flow */}
            <div className="space-y-3 font-mono text-xs">
              {/* Layer 1: Participants */}
              <div className="p-3 rounded-xl bg-[#141824] border border-[#262a35] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[#1b1f2a] text-[#e4e1a9] flex items-center justify-center font-bold text-[10px]">
                    L1
                  </div>
                  <div>
                    <span className="font-bold text-[#dfe2f0]">USER / BRAND / CREATOR / ADMIN</span>
                    <div className="text-[10px] text-[#939183]">Natural language intent, business goals, and governance instructions</div>
                  </div>
                </div>
                <span className="text-[10px] text-[#939183]">Human / Machine Actors</span>
              </div>

              <div className="text-center text-[#939183]">↓</div>

              {/* Layer 2: AI Agent */}
              <div className="p-3 rounded-xl bg-[#171b26] border border-[#c8c58f]/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[#1b1f2a] text-[#e4e1a9] flex items-center justify-center font-bold text-[10px]">
                    L2
                  </div>
                  <div>
                    <span className="font-bold text-[#e4e1a9]">AI AGENT (Reasoning &amp; Plan Synthesis)</span>
                    <div className="text-[10px] text-[#cac7b8]">Parses user prompt, selects MCP toolchain, and drafts execution plan</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#10141f] text-[#e4e1a9]">
                  Tool Selector Active
                </span>
              </div>

              <div className="text-center text-[#939183]">↓</div>

              {/* Layer 3: MCP Layer (The 6 Pillars) */}
              <div className="p-4 rounded-xl bg-[#10141f] border border-[#e4e1a9]/60 shadow-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#e4e1a9] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#e4e1a9]" />
                    <span>MCP LAYER &mdash; 6 CORE PILLARS</span>
                  </span>
                  <span className="text-[10px] text-[#939183] font-mono">Standardized Protocol Boundary</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 pt-1 text-[11px] text-center">
                  {[
                    { name: '1. DISCOVER', desc: 'Pools, Perks & Orgs' },
                    { name: '2. QUERY', desc: 'Balances & Audits' },
                    { name: '3. RECOMMEND', desc: 'Perks & Actions' },
                    { name: '4. CONFIGURE', desc: 'Quests & Rules' },
                    { name: '5. EXECUTE', desc: 'Claims & Ledgers' },
                    { name: '6. ANALYZE', desc: 'Funnels & Pacing' },
                  ].map((p, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-lg bg-[#141824] border border-[#262a35] space-y-0.5"
                    >
                      <div className="font-bold text-[#dfe2f0]">{p.name}</div>
                      <div className="text-[9px] text-[#939183]">{p.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center text-emerald-400 font-bold text-[10px]">
                ↓ (Strict Governance Validation Pipeline)
              </div>

              {/* Layer 4: Core Credit Economy Engine */}
              <div className="p-4 rounded-xl bg-[#141824] border border-emerald-500/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-emerald-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>CORE CREDIT ECONOMY ENGINE (Deterministic Source of Truth)</span>
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400/80">Invariants Enforced</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[10px] text-center">
                  {[
                    'Credit Ledger',
                    'Rules Engine',
                    'Campaign Engine',
                    'Quest Engine',
                    'Pool Engine',
                    'Benefit / Reward Engine',
                    'Partner Engine',
                    'User / Segment Engine',
                    'Analytics Engine',
                    'Fraud & Eligibility',
                  ].map((engine, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded bg-[#171b26] border border-[#262a35] text-[#dfe2f0] font-medium"
                    >
                      {engine}
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center text-[#939183]">↓</div>

              {/* Layer 5: External Ecosystem */}
              <div className="p-3 rounded-xl bg-[#141824] border border-[#262a35] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[#1b1f2a] text-[#dfe2f0] flex items-center justify-center font-bold text-[10px]">
                    L5
                  </div>
                  <div>
                    <span className="font-bold text-[#dfe2f0]">EXTERNAL ECOSYSTEM</span>
                    <div className="text-[10px] text-[#939183]">Shopee · Brands · Merchants · POS Counters · Services · Creators · Events · Communities</div>
                  </div>
                </div>
                <span className="text-[10px] text-[#939183]">Value Realization</span>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* IMPORTANT GOVERNANCE RULE CALLOUT                        */}
          {/* ======================================================== */}
          <div className="p-4 rounded-xl bg-[#10141f] border border-amber-500/40 space-y-3">
            <div className="flex items-center gap-2 text-amber-300">
              <AlertTriangle className="w-4 h-4" />
              <span className="font-bold text-xs uppercase tracking-wider">
                Crucial Governance Rule: Zero Direct Ledger Mutation
              </span>
            </div>

            <p className="text-xs text-[#cac7b8] leading-relaxed">
              AI agents and MCP tools must <strong>never</strong> directly mutate the economic ledger or balances.
              All financial actions follow a deterministic 7-stage validation pipeline:
            </p>

            <div className="p-3 rounded-lg bg-[#171b26] border border-[#262a35] font-mono text-[11px] text-[#e4e1a9] overflow-x-auto whitespace-nowrap">
              AI Request &rarr; MCP Tool &rarr; Business Rules Validation &rarr; Eligibility Check &rarr; Budget Check &rarr; Fraud/Risk Check &rarr; Ledger Settlement
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
              <div className="p-3 rounded-lg bg-[#141824] border border-red-500/30 space-y-1">
                <div className="text-red-400 font-bold flex items-center gap-1.5">
                  <X className="w-3.5 h-3.5" />
                  <span>Prohibited Anti-Pattern</span>
                </div>
                <div className="text-[11px] text-[#cac7b8]">
                  <code>AI &rarr; &ldquo;Give user 500 Credits&rdquo; &rarr; directly modify user wallet table</code>
                </div>
                <div className="text-[10px] text-red-300">
                  Breaches double-entry balance parity, skips budget cap verification, and invalidates Merkle audit proofs.
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#141824] border border-emerald-500/30 space-y-1">
                <div className="text-emerald-300 font-bold flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  <span>Enforced MCP Protocol Pipeline</span>
                </div>
                <div className="text-[11px] text-[#cac7b8]">
                  <code>AI &rarr; execute_credit_reward_issuance() &rarr; rules engine &rarr; budget &rarr; ledger</code>
                </div>
                <div className="text-[10px] text-emerald-400">
                  Guarantees idempotent journal entries, prevents sybil abuse, and maintains audit trail compliance.
                </div>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* MCP TOOL REGISTRY (THE 6 PILLARS)                        */}
          {/* ======================================================== */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-[#dfe2f0]">
                  Active MCP Tool Registry
                </h3>
                <p className="text-xs text-[#939183]">
                  Standardized JSON schema tools exposed to platform copilots and autonomous agents.
                </p>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1 overflow-x-auto text-[11px]">
                {['ALL', 'DISCOVER', 'QUERY', 'RECOMMEND', 'CONFIGURE', 'EXECUTE', 'ANALYZE'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setMcpCategoryFilter(cat)}
                    className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer shrink-0 ${
                      mcpCategoryFilter === cat
                        ? 'bg-[#e4e1a9] text-[#171b26] font-bold'
                        : 'bg-[#171b26] text-[#939183] hover:text-[#dfe2f0] border border-[#262a35]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {MCP_TOOL_REGISTRY.filter(
                (t) => mcpCategoryFilter === 'ALL' || t.category === mcpCategoryFilter
              ).map((tool) => (
                <div
                  key={tool.name}
                  className="p-4 rounded-xl bg-[#141824] border border-[#262a35] hover:border-[#3b4152] transition-colors space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[#e4e1a9]">
                        {tool.name}()
                      </span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                        tool.category === 'EXECUTE'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : tool.category === 'CONFIGURE'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                          : 'bg-[#171b26] text-[#c8c58f] border border-[#262a35]'
                      }`}>
                        {tool.category}
                      </span>
                    </div>

                    <p className="text-xs text-[#cac7b8] leading-relaxed">
                      {tool.description}
                    </p>

                    {/* Parameters Schema */}
                    <div className="p-2.5 rounded-lg bg-[#0c1019] border border-[#262a35] space-y-1.5 text-[11px] font-mono">
                      <div className="text-[10px] text-[#939183] uppercase">Parameters:</div>
                      {tool.parameters.map((p) => (
                        <div key={p.name} className="flex items-start justify-between gap-2">
                          <span className="text-[#dfe2f0]">
                            {p.name}
                            {p.required && <span className="text-amber-400">*</span>}:
                          </span>
                          <span className="text-[#939183] text-right truncate">
                            {p.type} &mdash; {p.description}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#262a35] flex items-center justify-between">
                    <span className="text-[10px] text-[#939183]">
                      {tool.requiresGovernanceApproval ? '🔒 Requires Governance Approval' : '✓ Read / Invariance Safe'}
                    </span>
                    <button
                      onClick={() => {
                        window.dispatchEvent(
                          new CustomEvent('open-credit-economy-ai', {
                            detail: {
                              query:
                                tool.name === 'query_reward_availability'
                                  ? 'Find benefits I can redeem with 700 Credits.'
                                  : tool.name === 'configure_quest_incentive'
                                  ? 'Create a weekend campaign for inactive users.'
                                  : tool.name === 'query_pool_health'
                                  ? 'Why is Pool A underperforming?'
                                  : tool.name === 'discover_partners_and_segments'
                                  ? 'Find partners interested in acquiring fitness users.'
                                  : 'Show me users who earn Credits but rarely redeem them.',
                            },
                          })
                        );
                      }}
                      className="px-2.5 py-1 rounded bg-[#171b26] hover:bg-[#1b1f2a] text-[#e4e1a9] border border-[#262a35] text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3 text-[#e4e1a9]" />
                      <span>Test Tool</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

