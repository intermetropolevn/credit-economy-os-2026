import React, { useState } from 'react';
import { useEconomic } from '../context/EconomicContext';
import {
  ManagedUser,
  JourneyStageId,
  UserJourneyStage,
  AIUserRecommendation,
  FrictionSignal,
} from '../types';
import {
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Users,
  Target,
  FileText,
  HelpCircle,
  RotateCcw,
  Check,
  ChevronRight,
  Layers,
  Shield,
  Activity,
  Zap,
  Info,
} from 'lucide-react';

interface Props {
  user: ManagedUser;
  onSelectRecommendation: (rec: AIUserRecommendation) => void;
}

export const UserJourneyIntelligence: React.FC<Props> = ({
  user,
  onSelectRecommendation,
}) => {
  const { funnelMetrics, executeUserIntervention, navigate } = useEconomic();

  // Internal tab state for the Intelligence module
  const [activeIntelTab, setActiveIntelTab] = useState<
    'journey' | 'funnel' | 'comparison' | 'friction' | 'interventions'
  >('journey');

  // Selected stage in the journey to inspect associated events
  const [selectedStageId, setSelectedStageId] = useState<JourneyStageId>(
    user.journeyStages.find((s) => s.status === 'BLOCKED' || s.status === 'CURRENT')?.id ||
      'DELIVERABLE_SUBMITTED'
  );

  // Comparison cohort filter
  const [comparisonMode, setComparisonMode] = useState<'thisUser' | 'similar' | 'all'>('thisUser');

  const selectedStage =
    user.journeyStages.find((s) => s.id === selectedStageId) || user.journeyStages[0];

  const primaryFriction = user.frictionSignals[0];
  const primaryInsight = user.aiInsights[0];
  const primaryRecommendation = user.recommendations[0];

  return (
    <div className="bg-[#141824] border border-[#262a35] rounded-xl p-5 space-y-5">
      {/* Header & Sub-nav */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#262a35] gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#e4e1a9] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#c8c58f]" />
              User Journey &amp; Intelligence
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#1b1f2a] text-[#c8c58f] border border-[#262a35] font-mono">
              Decision Support
            </span>
          </div>
          <p className="text-[11px] text-[#939183] mt-0.5">
            Progression tracking, friction detection, cohort benchmarks, and closed-loop recommendations.
          </p>
        </div>

        {/* Sub-tabs */}
        <div className="flex items-center gap-1 bg-[#171b26] p-1 rounded-lg border border-[#262a35] text-xs">
          {[
            { id: 'journey', label: 'Lifecycle Journey' },
            { id: 'funnel', label: 'Funnel' },
            { id: 'comparison', label: 'Cohort Benchmarks' },
            { id: 'friction', label: 'Friction & AI' },
            { id: 'interventions', label: 'Interventions' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveIntelTab(tab.id as any)}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer whitespace-nowrap text-[11px] font-medium ${
                activeIntelTab === tab.id
                  ? 'bg-[#1b1f2a] text-[#e4e1a9] shadow-sm'
                  : 'text-[#939183] hover:text-[#dfe2f0]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 1. USER JOURNEY PROGRESSION                             */}
      {/* ======================================================== */}
      {activeIntelTab === 'journey' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#dfe2f0] font-medium">
              Core Credit Economy Progression · Click stage to inspect events
            </span>
            <span className="text-[11px] text-[#939183]">
              Stage {user.journeyStages.findIndex((s) => s.status === 'BLOCKED' || s.status === 'CURRENT') + 1} of 8
            </span>
          </div>

          {/* Interactive Horizontal Pipeline Stepper */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {user.journeyStages.map((stage) => {
              const isSelected = stage.id === selectedStageId;
              const isBlocked = stage.status === 'BLOCKED';
              const isCompleted = stage.status === 'COMPLETED';
              const isCurrent = stage.status === 'CURRENT';

              return (
                <button
                  key={stage.id}
                  type="button"
                  onClick={() => setSelectedStageId(stage.id)}
                  className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer relative group ${
                    isSelected
                      ? 'border-[#e4e1a9] bg-[#1b1f2a] ring-1 ring-[#e4e1a9]/30'
                      : isBlocked
                      ? 'border-amber-500/50 bg-amber-500/5 hover:bg-amber-500/10'
                      : isCompleted
                      ? 'border-[#3b4152] bg-[#171b26] hover:border-[#e4e1a9]/50'
                      : 'border-[#262a35] bg-[#171b26]/50 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono mb-1.5">
                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        isCompleted
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : isBlocked
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-[#1b1f2a] text-[#939183]'
                      }`}
                    >
                      {stage.order}
                    </span>
                    {isBlocked ? (
                      <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
                    ) : isCompleted ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                    ) : null}
                  </div>
                  <div className="font-semibold text-xs text-[#dfe2f0] truncate leading-snug">
                    {stage.name}
                  </div>
                  <div className="text-[10px] text-[#939183] mt-1 truncate">
                    {isBlocked ? (
                      <span className="text-amber-300 font-medium">Blocked here</span>
                    ) : isCompleted ? (
                      <span>Completed</span>
                    ) : (
                      <span>Pending</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Detailed Drawer for Selected Stage Events */}
          <div className="p-3.5 rounded-xl bg-[#171b26] border border-[#262a35] space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#262a35]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#dfe2f0]">
                  Stage {selectedStage.order}: {selectedStage.name}
                </span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                    selectedStage.status === 'COMPLETED'
                      ? 'bg-emerald-500/15 text-emerald-300'
                      : selectedStage.status === 'BLOCKED'
                      ? 'bg-amber-500/15 text-amber-300'
                      : 'bg-[#1b1f2a] text-[#939183]'
                  }`}
                >
                  {selectedStage.status}
                </span>
              </div>
              {selectedStage.completedAt && (
                <span className="text-[11px] text-[#939183] font-mono">
                  Completed: {selectedStage.completedAt}
                </span>
              )}
            </div>

            {selectedStage.events.length > 0 ? (
              <div className="space-y-2">
                {selectedStage.events.map((ev) => (
                  <div
                    key={ev.id}
                    className="flex items-start justify-between p-2 rounded-lg bg-[#141824] border border-[#262a35] text-xs"
                  >
                    <div>
                      <div className="font-semibold text-[#dfe2f0]">{ev.title}</div>
                      <div className="text-[11px] text-[#939183] mt-0.5">{ev.description}</div>
                    </div>
                    <span className="text-[10px] font-mono text-[#939183] shrink-0 ml-3">
                      {ev.timestamp}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 text-center text-xs text-[#939183] italic">
                Stage upcoming — no execution events recorded yet.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. FUNNEL ANALYSIS                                      */}
      {/* ======================================================== */}
      {activeIntelTab === 'funnel' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#dfe2f0] font-medium">
              Network Cohort Funnel Benchmark (1,250 Accounts)
            </span>
            <span className="text-[11px] text-amber-300 font-mono">
              Largest Drop-Off: Transaction Created (-28%)
            </span>
          </div>

          {/* Visual Compact Funnel Bars */}
          <div className="space-y-2">
            {funnelMetrics.map((stage) => {
              const isUserAtThisStage =
                stage.id === user.journeyStages.find((s) => s.status === 'BLOCKED' || s.status === 'CURRENT')?.id;

              return (
                <div
                  key={stage.id}
                  className={`p-2.5 rounded-lg border transition-all ${
                    stage.isLargestDropOff
                      ? 'bg-[#1b1f2a] border-amber-500/40 ring-1 ring-amber-500/20'
                      : isUserAtThisStage
                      ? 'bg-[#1b1f2a] border-[#e4e1a9]'
                      : 'bg-[#171b26] border-[#262a35]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[#dfe2f0]">{stage.name}</span>
                      {stage.isLargestDropOff && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-medium">
                          Largest Drop-Off (-{stage.dropOffRate}%)
                        </span>
                      )}
                      {isUserAtThisStage && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#e4e1a9]/20 text-[#e4e1a9] font-medium">
                          {user.name.split(' ')[0]}'s Current Stage
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 font-mono text-xs">
                      <span className="text-[#e4e1a9] font-bold">{stage.conversionRate}%</span>
                      <span className="text-[#939183] text-[11px]">
                        ({stage.usersCompleted}/{stage.usersEntered})
                      </span>
                      <span className="text-[#939183] text-[10px]">
                        Avg: {stage.avgTimeToNext}
                      </span>
                    </div>
                  </div>

                  {/* Funnel conversion bar */}
                  <div className="w-full bg-[#141824] rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        stage.isLargestDropOff
                          ? 'bg-amber-400'
                          : isUserAtThisStage
                          ? 'bg-[#e4e1a9]'
                          : 'bg-[#c8c58f]/70'
                      }`}
                      style={{ width: `${stage.conversionRate}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. USER VS SIMILAR USERS                                */}
      {/* ======================================================== */}
      {activeIntelTab === 'comparison' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-medium text-[#dfe2f0]">
                Descriptive Cohort Benchmark Comparison
              </span>
              <p className="text-[11px] text-[#939183]">
                Segmented by {user.userGroup} · Age: ~70 Days · Volume Tier 2
              </p>
            </div>

            {/* Mode Switcher */}
            <div className="flex items-center gap-1 bg-[#171b26] p-1 rounded-lg border border-[#262a35] text-xs">
              {[
                { id: 'thisUser', label: user.name.split(' ')[0] },
                { id: 'similar', label: 'Similar Users' },
                { id: 'all', label: 'All Platform' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setComparisonMode(m.id as any)}
                  className={`px-2.5 py-1 rounded transition-colors text-[11px] font-medium cursor-pointer ${
                    comparisonMode === m.id
                      ? 'bg-[#1b1f2a] text-[#e4e1a9]'
                      : 'text-[#939183] hover:text-[#dfe2f0]'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {user.segmentComparisons.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-[#171b26] border border-[#262a35] space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#dfe2f0]">{item.metric}</span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                      item.deltaType === 'positive'
                        ? 'bg-emerald-500/15 text-emerald-300'
                        : 'bg-amber-500/15 text-amber-300'
                    }`}
                  >
                    {item.deltaType === 'positive' ? 'Healthy' : 'Friction'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs font-mono py-1">
                  <div className="p-1.5 rounded bg-[#141824] border border-[#262a35]">
                    <div className="text-[10px] text-[#939183] font-sans">This User</div>
                    <div className="font-bold text-[#e4e1a9] text-sm mt-0.5">
                      {item.thisUserValue}
                    </div>
                  </div>
                  <div className="p-1.5 rounded bg-[#141824] border border-[#262a35]">
                    <div className="text-[10px] text-[#939183] font-sans">Similar Cohort</div>
                    <div className="font-semibold text-[#dfe2f0] text-sm mt-0.5">
                      {item.similarUsersValue}
                    </div>
                  </div>
                  <div className="p-1.5 rounded bg-[#141824] border border-[#262a35]">
                    <div className="text-[10px] text-[#939183] font-sans">All Users</div>
                    <div className="text-[#939183] text-sm mt-0.5">{item.allUsersValue}</div>
                  </div>
                </div>

                <p className="text-[11px] text-[#cac7b8] italic">"{item.assessment}"</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. FRICTION SIGNALS & AI INSIGHTS                       */}
      {/* ======================================================== */}
      {activeIntelTab === 'friction' && (
        <div className="space-y-4">
          {/* Epistemic Division Notice */}
          <div className="p-2.5 rounded-lg bg-[#171b26] border border-[#262a35] text-[11px] text-[#939183] flex items-center justify-between">
            <span>Epistemic Clarity: Observed Data vs. AI Interpretation vs. Recommendation</span>
            <Info className="w-3.5 h-3.5 text-[#c8c58f]" />
          </div>

          {/* Active Friction Signals */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-[#dfe2f0]">Active Friction Signals:</div>
            {user.frictionSignals.length > 0 ? (
              user.frictionSignals.map((signal) => (
                <div
                  key={signal.id}
                  className="p-3.5 rounded-xl bg-[#171b26] border border-amber-500/30 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                      <span className="font-semibold text-xs text-[#dfe2f0]">{signal.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {signal.relatedTransactionId && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1b1f2a] text-[#c8c58f] border border-[#262a35]">
                          {signal.relatedTransactionId}
                        </span>
                      )}
                      <span className="text-[10px] font-mono text-[#939183]">
                        {signal.detectedAt}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-[#cac7b8] space-y-1 bg-[#141824] p-2.5 rounded-lg border border-[#262a35]">
                    <div>
                      <strong className="text-[#dfe2f0]">OBSERVED DATA:</strong>{' '}
                      <span className="text-[#cac7b8]">{signal.observedData}</span>
                    </div>
                    <div className="text-[11px] text-[#939183]">
                      <strong className="text-[#939183]">EVIDENCE:</strong> {signal.evidence}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-3 rounded-lg bg-[#171b26] border border-[#262a35] text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Zero behavioral friction signals detected. Account in ideal velocity.</span>
              </div>
            )}
          </div>

          {/* AI Insights & Recommended Actions */}
          {primaryInsight && (
            <div className="p-4 rounded-xl bg-[#171b26] border border-[#3b4152] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#e4e1a9]">
                  <Sparkles className="w-3.5 h-3.5 text-[#c8c58f]" />
                  <span>AI Insight &amp; Root Cause Analysis</span>
                </div>
                <span className="text-[10px] font-mono text-[#939183]">
                  Confidence: {primaryInsight.confidence}
                </span>
              </div>

              <div className="text-xs text-[#dfe2f0] leading-relaxed space-y-1">
                <p>"{primaryInsight.summary}"</p>
                <div className="text-[11px] text-[#939183] pt-1 border-t border-[#262a35]/80">
                  <strong className="text-[#dfe2f0]">AI INTERPRETATION:</strong>{' '}
                  {primaryInsight.interpretation}
                </div>
              </div>

              {/* Recommended Action CTA */}
              {primaryRecommendation && (
                <div className="pt-2 border-t border-[#262a35] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-[10px] font-semibold text-[#939183] uppercase tracking-wider">
                      Next Best Action
                    </div>
                    <div className="text-xs font-bold text-[#dfe2f0]">
                      {primaryRecommendation.title}
                    </div>
                    <div className="text-[11px] text-[#939183]">
                      Expected effect: {primaryRecommendation.expectedEffect}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => onSelectRecommendation(primaryRecommendation)}
                      className="px-3.5 py-1.5 rounded-lg bg-[#e4e1a9] hover:bg-[#d8d598] text-[#171b26] font-bold text-xs transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <span>Preview &amp; Apply</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. INTERVENTION HISTORY & CLOSED LOOP OUTCOMES           */}
      {/* ======================================================== */}
      {activeIntelTab === 'interventions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#dfe2f0] font-medium">
              Closed-Loop Intervention Log: Recommendation → Action → Outcome
            </span>
            <span className="text-[11px] text-[#939183]">
              {user.interventions.length} Interventions
            </span>
          </div>

          <div className="space-y-3">
            {user.interventions.length > 0 ? (
              user.interventions.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-[#171b26] border border-[#262a35] space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="font-semibold text-[#dfe2f0]">{item.actionTitle}</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#939183]">{item.timestamp}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] bg-[#141824] p-2.5 rounded-lg border border-[#262a35]">
                    <div>
                      <div className="text-[#939183]">Action Executed:</div>
                      <div className="text-[#dfe2f0] mt-0.5">{item.actionDetails}</div>
                      <div className="text-[10px] text-[#939183] mt-0.5">By {item.actor}</div>
                    </div>
                    <div>
                      <div className="text-[#939183]">Measured Outcome:</div>
                      <div className="text-emerald-300 mt-0.5 font-medium">
                        {item.outcomeDescription}
                      </div>
                      <div className="text-[10px] text-[#939183] mt-0.5">
                        Timing: {item.outcomeTime}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-3 text-center text-xs text-[#939183] italic">
                No past interventions recorded for this account.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
