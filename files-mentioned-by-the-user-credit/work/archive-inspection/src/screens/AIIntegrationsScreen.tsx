import React, { useState } from 'react';
import { useEconomic } from '../context/EconomicContext';
import {
  mcpRegistry,
  MCPServerConnector,
  MCPToolDefinition,
  MCPExecutionLogEntry,
  ExternalMCPEventMapping,
  ToolDomain,
  ToolClassification,
} from '../services/mcpRegistryService';
import {
  Cpu,
  Layers,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  ExternalLink,
  Sparkles,
  RefreshCw,
  Search,
  Filter,
  Check,
  X,
  Lock,
  Unlock,
  Radio,
  Sliders,
  DollarSign,
  Activity,
  Terminal,
  Database,
  Building2,
  Zap,
  ShoppingBag,
  Ticket,
  Video,
  CreditCard,
  Eye,
  Plus,
  Play,
  RotateCcw,
} from 'lucide-react';

export const AIIntegrationsScreen: React.FC = () => {
  const { navigate } = useEconomic();

  // Active section tab: 'servers' | 'registry' | 'permissions' | 'logs' | 'external'
  const [activeTab, setActiveTab] = useState<'servers' | 'registry' | 'permissions' | 'logs' | 'external'>('servers');

  // Server state
  const [servers, setServers] = useState<MCPServerConnector[]>(() => mcpRegistry.getServers());
  const [serverSearch, setServerSearch] = useState('');
  const [selectedServerDetail, setSelectedServerDetail] = useState<MCPServerConnector | null>(null);

  // Tool registry state
  const [tools, setTools] = useState<MCPToolDefinition[]>(() => mcpRegistry.getTools());
  const [selectedDomainFilter, setSelectedDomainFilter] = useState<'ALL' | ToolDomain>('ALL');
  const [selectedClassificationFilter, setSelectedClassificationFilter] = useState<'ALL' | ToolClassification>('ALL');
  const [toolSearch, setToolSearch] = useState('');
  const [selectedToolDetail, setSelectedToolDetail] = useState<MCPToolDefinition | null>(null);

  // Execution logs state
  const [logs, setLogs] = useState<MCPExecutionLogEntry[]>(() => mcpRegistry.getExecutionLogs());
  const [logStatusFilter, setLogStatusFilter] = useState<'ALL' | 'SUCCESS' | 'PENDING_APPROVAL' | 'REJECTED'>('ALL');
  const [logSearch, setLogSearch] = useState('');

  // External MCP mappings state
  const [mappings, setMappings] = useState<ExternalMCPEventMapping[]>(() => mcpRegistry.getExternalMappings());
  const [simulatingMapping, setSimulatingMapping] = useState<ExternalMCPEventMapping | null>(null);
  const [simulationPayload, setSimulationPayload] = useState<string>('{\n  "transactionId": "tx-pos-9921",\n  "amountUsd": 45.00,\n  "patronToken": "usr-sarah-chen",\n  "merchant": "Saigon Fitness"\n}');
  const [simulationResult, setSimulationResult] = useState<any | null>(null);

  // General notification banner
  const [notification, setNotification] = useState<string | null>(null);

  // Ping server handler
  const handlePingServer = (serverId: string) => {
    const res = mcpRegistry.pingServer(serverId);
    if (res) {
      setServers([...mcpRegistry.getServers()]);
      setNotification(`Ping successful to ${res.name} (${res.latencyMs}ms latency via ${res.endpoint})`);
    }
  };

  // Authorize pending execution log
  const handleAuthorizeLog = (logId: string) => {
    mcpRegistry.authorizeExecution(logId, 'Admin (Risk Officer)');
    setLogs([...mcpRegistry.getExecutionLogs()]);
    setNotification(`Execution ${logId} authorized. Cryptographic ledger action committed.`);
  };

  // Reject pending execution log
  const handleRejectLog = (logId: string) => {
    mcpRegistry.rejectExecution(logId, 'Administrative velocity threshold policy rejection.');
    setLogs([...mcpRegistry.getExecutionLogs()]);
    setNotification(`Execution ${logId} rejected.`);
  };

  // Trigger simulated inbound event
  const handleRunSimulation = () => {
    if (!simulatingMapping) return;
    try {
      const parsed = JSON.parse(simulationPayload);
      const res = mcpRegistry.simulateInboundEvent(simulatingMapping.id, parsed);
      setSimulationResult(res);
      setLogs([...mcpRegistry.getExecutionLogs()]);
      setMappings([...mcpRegistry.getExternalMappings()]);
      setNotification(`Inbound event ingested and processed by ${res.mapping.mappedCreditRule}.`);
    } catch (e: any) {
      alert(`Invalid JSON payload: ${e.message}`);
    }
  };

  const domainList: ToolDomain[] = ['CREDIT', 'CAMPAIGN', 'POOL', 'PARTNER', 'USER', 'ANALYTICS', 'REDEMPTION'];

  return (
    <div className="space-y-6">
      {/* Platform Settings Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#262a35]">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#1b1f2a] border border-[#e4e1a9]/50 text-[#e4e1a9] flex items-center justify-center font-bold">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-[#dfe2f0]">
                  AI &amp; Integrations
                </h1>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#1b1f2a] text-[#e4e1a9] border border-[#e4e1a9]/30 font-bold uppercase tracking-wider">
                  Platform Settings &bull; Infrastructure
                </span>
              </div>
              <p className="text-xs text-[#939183] mt-0.5">
                Model Context Protocol (MCP) server connectors, authoritative tool registry, RBAC sensitivity controls, and inbound event consumption.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setServers([...mcpRegistry.getServers()]);
              setLogs([...mcpRegistry.getExecutionLogs()]);
              setNotification('All MCP connectors, tool registries & ledger listeners synchronized.');
            }}
            className="px-3.5 py-1.5 rounded-lg bg-[#141824] hover:bg-[#1b1f2a] text-xs font-semibold text-[#dfe2f0] border border-[#262a35] flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#e4e1a9]" />
            <span>Sync All Nodes</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* ARCHITECTURAL MANDATE CALLOUT BANNER                     */}
      {/* ======================================================== */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-[#141824] to-[#171b26] border border-[#e4e1a9]/40 shadow-lg text-xs space-y-2">
        <div className="flex items-center justify-between pb-1.5 border-b border-[#262a35]/80">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#e4e1a9]" />
            <span className="font-bold uppercase tracking-wider text-[#e4e1a9] font-mono text-[11px]">
              Architectural Boundary Mandate
            </span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
            Source of Truth: Core Engines
          </span>
        </div>
        <p className="text-[#cac7b8] leading-relaxed">
          <strong className="text-[#dfe2f0]">Model Context Protocol (MCP)</strong> functions strictly as an{' '}
          <span className="text-[#e4e1a9] font-semibold">interoperability and agent-access layer</span>. It is{' '}
          <strong className="text-red-300">NOT the source of truth</strong>.
          The <span className="underline decoration-[#e4e1a9]">Credit Ledger</span> (double-entry invariance),{' '}
          <span className="underline decoration-[#e4e1a9]">Rules Engine</span>,{' '}
          <span className="underline decoration-[#e4e1a9]">Eligibility Engine</span>, and{' '}
          <span className="underline decoration-[#e4e1a9]">Fraud Engine</span> remain strictly authoritative for all balances, permissions, and issuance limits.
        </p>
      </div>

      {/* Notification Banner */}
      {notification && (
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-emerald-400 hover:text-emerald-200">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Primary Section Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto text-xs bg-[#141824] p-1.5 rounded-xl border border-[#262a35]">
        {[
          { id: 'servers', label: `1. MCP Servers (${servers.length})`, icon: Radio },
          { id: 'registry', label: `2. Tool Registry (${tools.length})`, icon: Terminal },
          { id: 'permissions', label: '3. Permission Model', icon: Shield },
          { id: 'logs', label: `4. Execution Log (${logs.length})`, icon: Activity },
          { id: 'external', label: `5. External MCP & Events (${mappings.length})`, icon: Zap },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap font-medium ${
                isSelected
                  ? 'bg-[#1b1f2a] text-[#e4e1a9] shadow-sm font-semibold'
                  : 'text-[#939183] hover:text-[#dfe2f0]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* SECTION 1: MCP SERVERS                                   */}
      {/* ======================================================== */}
      {activeTab === 'servers' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 text-xs">
            <div>
              <h3 className="font-bold text-sm text-[#dfe2f0]">Connected External Systems</h3>
              <p className="text-[11px] text-[#939183]">
                Bidirectional MCP connectors bridging external platforms into the Credit Economy.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-[#939183] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={serverSearch}
                onChange={(e) => setServerSearch(e.target.value)}
                placeholder="Search server name, type or tool..."
                className="w-full bg-[#171b26] border border-[#262a35] rounded-lg pl-9 pr-3 py-1.5 text-xs text-[#dfe2f0] placeholder-[#939183] focus:outline-none focus:border-[#e4e1a9]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {servers
              .filter(
                (s) =>
                  s.name.toLowerCase().includes(serverSearch.toLowerCase()) ||
                  s.category.toLowerCase().includes(serverSearch.toLowerCase()) ||
                  s.availableTools.some((t) => t.toLowerCase().includes(serverSearch.toLowerCase()))
              )
              .map((server) => {
                const getStatusColor = () => {
                  switch (server.status) {
                    case 'CONNECTED':
                      return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
                    case 'SYNCING':
                      return 'bg-blue-500/10 text-blue-300 border-blue-500/30';
                    case 'DEGRADED':
                      return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
                    default:
                      return 'bg-red-500/10 text-red-300 border-red-500/30';
                  }
                };

                const getPermColor = () => {
                  switch (server.permissions) {
                    case 'SENSITIVE_AUTHORIZED':
                      return 'bg-purple-500/10 text-purple-300 border-purple-500/30';
                    case 'READ_WRITE':
                      return 'bg-blue-500/10 text-blue-300 border-blue-500/30';
                    default:
                      return 'bg-[#1b1f2a] text-[#cac7b8] border-[#262a35]';
                  }
                };

                return (
                  <div
                    key={server.id}
                    className="p-4 rounded-xl bg-[#141824] border border-[#262a35] hover:border-[#3b4152] transition-all flex flex-col justify-between space-y-3 shadow-md"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#171b26] text-[#939183] border border-[#262a35]">
                          {server.category} &bull; {server.version}
                        </span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${getStatusColor()}`}>
                          {server.status}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-bold text-sm text-[#dfe2f0] flex items-center justify-between">
                          <span>{server.name}</span>
                          <span className="text-[10px] font-mono text-[#939183] font-normal">{server.latencyMs}ms</span>
                        </h4>
                        <div className="text-[11px] font-mono text-[#939183] truncate mt-0.5">
                          {server.endpoint}
                        </div>
                      </div>

                      <div className="space-y-1 pt-1 border-t border-[#262a35]">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-[#939183]">Permissions:</span>
                          <span className={`font-mono text-[10px] px-1.5 py-0.2 rounded border ${getPermColor()}`}>
                            {server.permissions}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-[#939183]">Last Sync:</span>
                          <span className="text-[#dfe2f0] font-mono text-[10px]">{server.lastSync}</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-[#939183]">Auth Method:</span>
                          <span className="text-[#c8c58f] font-mono text-[10px]">{server.authMethod}</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] text-[#939183] font-mono uppercase">Data Scope:</span>
                        <p className="text-[11px] text-[#cac7b8] line-clamp-2 leading-relaxed">
                          {server.dataScope}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] text-[#939183] font-mono uppercase">Available Tools:</span>
                        <div className="flex flex-wrap gap-1">
                          {server.availableTools.map((t, i) => (
                            <span
                              key={i}
                              className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#171b26] text-[#e4e1a9] border border-[#262a35]"
                            >
                              {t}()
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#262a35] flex items-center justify-between gap-2">
                      <button
                        onClick={() => handlePingServer(server.id)}
                        className="px-2.5 py-1 rounded bg-[#171b26] hover:bg-[#1b1f2a] text-[11px] font-semibold text-[#dfe2f0] border border-[#262a35] cursor-pointer"
                      >
                        Ping Health
                      </button>
                      <button
                        onClick={() => setSelectedServerDetail(server)}
                        className="px-2.5 py-1 rounded bg-[#1b1f2a] hover:bg-[#262a35] text-[11px] font-semibold text-[#e4e1a9] border border-[#262a35] cursor-pointer flex items-center gap-1"
                      >
                        <span>Details</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 2: TOOL REGISTRY                                 */}
      {/* ======================================================== */}
      {activeTab === 'registry' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 text-xs">
            <div>
              <h3 className="font-bold text-sm text-[#dfe2f0]">Authoritative MCP Tool Registry</h3>
              <p className="text-[11px] text-[#939183]">
                Grouped by domain. Every tool specifies input/output contracts, authoritative engine, and authorization requirements.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Domain Filter */}
              <select
                value={selectedDomainFilter}
                onChange={(e) => setSelectedDomainFilter(e.target.value as any)}
                className="bg-[#171b26] border border-[#262a35] rounded-lg px-2.5 py-1.5 text-xs text-[#dfe2f0] focus:outline-none focus:border-[#e4e1a9]"
              >
                <option value="ALL">All Domains ({tools.length})</option>
                {domainList.map((d) => (
                  <option key={d} value={d}>
                    {d} ({tools.filter((t) => t.domain === d).length})
                  </option>
                ))}
              </select>

              {/* Classification Filter */}
              <select
                value={selectedClassificationFilter}
                onChange={(e) => setSelectedClassificationFilter(e.target.value as any)}
                className="bg-[#171b26] border border-[#262a35] rounded-lg px-2.5 py-1.5 text-xs text-[#dfe2f0] focus:outline-none focus:border-[#e4e1a9]"
              >
                <option value="ALL">All Classifications</option>
                <option value="READ">READ (Non-destructive)</option>
                <option value="WRITE">WRITE (Draft / Metadata)</option>
                <option value="SENSITIVE">SENSITIVE (Explicit Approval)</option>
              </select>

              <div className="relative w-48">
                <Search className="w-3.5 h-3.5 text-[#939183] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={toolSearch}
                  onChange={(e) => setToolSearch(e.target.value)}
                  placeholder="Filter tool name..."
                  className="w-full bg-[#171b26] border border-[#262a35] rounded-lg pl-9 pr-3 py-1.5 text-xs text-[#dfe2f0] placeholder-[#939183] focus:outline-none focus:border-[#e4e1a9]"
                />
              </div>
            </div>
          </div>

          {/* Grouped by Domain Display */}
          <div className="space-y-5">
            {domainList
              .filter((d) => selectedDomainFilter === 'ALL' || selectedDomainFilter === d)
              .map((domain) => {
                const domainTools = tools
                  .filter((t) => t.domain === domain)
                  .filter(
                    (t) =>
                      selectedClassificationFilter === 'ALL' ||
                      t.classification === selectedClassificationFilter
                  )
                  .filter(
                    (t) =>
                      t.name.toLowerCase().includes(toolSearch.toLowerCase()) ||
                      t.description.toLowerCase().includes(toolSearch.toLowerCase())
                  );

                if (domainTools.length === 0) return null;

                return (
                  <div key={domain} className="bg-[#141824] border border-[#262a35] rounded-xl overflow-hidden shadow-md">
                    <div className="px-4 py-2.5 bg-[#10141f] border-b border-[#262a35] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-[#e4e1a9] tracking-wider">
                          DOMAIN: {domain}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-[#171b26] text-[#939183]">
                          {domainTools.length} Tools
                        </span>
                      </div>
                    </div>

                    <div className="divide-y divide-[#262a35]/60">
                      {domainTools.map((tool) => (
                        <div
                          key={tool.id}
                          className="p-4 hover:bg-[#171b26]/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                        >
                          <div className="space-y-1.5 max-w-2xl">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-sm text-[#dfe2f0] flex items-center gap-1">
                                <span>{tool.name}()</span>
                              </span>

                              {/* Classification Badge */}
                              <span
                                className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border ${
                                  tool.classification === 'SENSITIVE'
                                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 ring-1 ring-purple-500/30'
                                    : tool.classification === 'WRITE'
                                    ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                                    : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                                }`}
                              >
                                {tool.classification}
                              </span>

                              {tool.requiresAuthorization && (
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/10 text-red-300 border border-red-500/30 flex items-center gap-1">
                                  <Lock className="w-2.5 h-2.5" />
                                  <span>Explicit Approval ({tool.authorizerRole})</span>
                                </span>
                              )}
                            </div>

                            <p className="text-xs text-[#cac7b8] leading-relaxed">
                              {tool.description}
                            </p>

                            <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#939183]">
                              <span>
                                Authoritative Source:{' '}
                                <strong className="text-[#dfe2f0] font-mono">
                                  {tool.authoritativeEngine}
                                </strong>
                              </span>
                              <span>&bull;</span>
                              <span>
                                Risk Rating:{' '}
                                <span
                                  className={`font-mono font-bold ${
                                    tool.riskRating === 'CRITICAL'
                                      ? 'text-red-400'
                                      : tool.riskRating === 'MEDIUM'
                                      ? 'text-amber-400'
                                      : 'text-emerald-400'
                                  }`}
                                >
                                  {tool.riskRating}
                                </span>
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => setSelectedToolDetail(tool)}
                              className="px-3 py-1.5 rounded-lg bg-[#1b1f2a] hover:bg-[#262a35] text-xs font-semibold text-[#e4e1a9] border border-[#262a35] cursor-pointer flex items-center gap-1"
                            >
                              <span>Inspect Schema</span>
                              <Terminal className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 3: PERMISSION MODEL                              */}
      {/* ======================================================== */}
      {activeTab === 'permissions' && (
        <div className="space-y-6 text-xs">
          <div className="pb-2 border-b border-[#262a35]">
            <h3 className="font-bold text-sm text-[#dfe2f0]">
              MCP Access Control &amp; RBAC Sensitivity Matrix
            </h3>
            <p className="text-[11px] text-[#939183]">
              Every tool is strictly classified. Sensitive actions require cryptographic ledger authorization.
            </p>
          </div>

          {/* 3 Tier Classification Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[#141824] border border-emerald-500/30 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-emerald-300 font-mono">1. READ</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                  Autonomous Permitted
                </span>
              </div>
              <p className="text-[#cac7b8] leading-relaxed">
                Queries state, metrics, and profiles. Does not modify balances, rules, or budget reserves.
              </p>
              <div className="p-2.5 rounded-lg bg-[#171b26] border border-[#262a35] space-y-1">
                <div className="text-[10px] text-[#939183] font-mono">Examples:</div>
                <div className="font-mono text-[#e4e1a9] text-[11px]">
                  get_campaign_metrics() &bull; get_credit_balance() &bull; search_pools()
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#141824] border border-amber-500/30 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-amber-300 font-mono">2. WRITE</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                  Draft &amp; Metadata
                </span>
              </div>
              <p className="text-[#cac7b8] leading-relaxed">
                Creates draft entities or modifies copy/schedules. Does not commit actual budget liquidity.
              </p>
              <div className="p-2.5 rounded-lg bg-[#171b26] border border-[#262a35] space-y-1">
                <div className="text-[10px] text-[#939183] font-mono">Examples:</div>
                <div className="font-mono text-amber-300 text-[11px]">
                  create_campaign() &bull; create_pool() &bull; add_benefit_to_pool()
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#141824] border border-purple-500/40 space-y-2.5 ring-1 ring-purple-500/20">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-purple-300 font-mono">3. SENSITIVE</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">
                  Requires Authorization
                </span>
              </div>
              <p className="text-[#cac7b8] leading-relaxed">
                Burns or mints credits, encumbers sponsor funds, or commits live ledger balance sheet liabilities.
              </p>
              <div className="p-2.5 rounded-lg bg-[#171b26] border border-[#262a35] space-y-1">
                <div className="text-[10px] text-[#939183] font-mono">Examples:</div>
                <div className="font-mono text-purple-300 text-[11px]">
                  issue_credit() &bull; redeem_benefit() &bull; publish_campaign()
                </div>
              </div>
            </div>
          </div>

          {/* Role Authorization Matrix */}
          <div className="bg-[#141824] border border-[#262a35] rounded-xl overflow-hidden shadow-md">
            <div className="p-3.5 bg-[#10141f] border-b border-[#262a35] flex items-center justify-between">
              <span className="font-bold text-[#dfe2f0] font-mono text-xs uppercase">
                RBAC Role Capabilities by Sensitivity Tier
              </span>
              <span className="text-[10px] text-[#939183] font-mono">Enforced by Core Gateways</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#262a35] text-[10px] font-mono uppercase text-[#939183] bg-[#141824]">
                    <th className="py-2.5 px-4">Role Actor</th>
                    <th className="py-2.5 px-4 text-center">READ Access</th>
                    <th className="py-2.5 px-4 text-center">WRITE Access</th>
                    <th className="py-2.5 px-4 text-center">SENSITIVE Execution</th>
                    <th className="py-2.5 px-4">Safety Ceilings &amp; Constraints</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#262a35]/60 text-[#cac7b8]">
                  <tr>
                    <td className="py-3 px-4 font-semibold text-[#dfe2f0]">AI Agent (Autonomous)</td>
                    <td className="py-3 px-4 text-center font-mono text-emerald-400 font-bold">&check; Full</td>
                    <td className="py-3 px-4 text-center font-mono text-amber-300 font-bold">&check; Drafts Only</td>
                    <td className="py-3 px-4 text-center font-mono text-red-400 font-bold">&cross; Escalates</td>
                    <td className="py-3 px-4 text-[11px] text-[#939183]">
                      All financial executions quarantined until manual confirmation.
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-[#dfe2f0]">Platform Operator</td>
                    <td className="py-3 px-4 text-center font-mono text-emerald-400 font-bold">&check; Full</td>
                    <td className="py-3 px-4 text-center font-mono text-emerald-400 font-bold">&check; Full</td>
                    <td className="py-3 px-4 text-center font-mono text-amber-300 font-bold">&check; &le; 5,000 CRD</td>
                    <td className="py-3 px-4 text-[11px] text-[#939183]">
                      Single-signature approved for routine counter redemptions &amp; small fixes.
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-[#e4e1a9]">Super Admin / Risk Officer</td>
                    <td className="py-3 px-4 text-center font-mono text-emerald-400 font-bold">&check; Full</td>
                    <td className="py-3 px-4 text-center font-mono text-emerald-400 font-bold">&check; Full</td>
                    <td className="py-3 px-4 text-center font-mono text-purple-300 font-bold">&check; Unrestricted</td>
                    <td className="py-3 px-4 text-[11px] text-[#939183]">
                      Dual-signature enforced for treasury mints exceeding 50,000 CRD.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 4: EXECUTION LOG                                 */}
      {/* ======================================================== */}
      {activeTab === 'logs' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 text-xs">
            <div>
              <h3 className="font-bold text-sm text-[#dfe2f0]">Live MCP Execution &amp; Authorization Log</h3>
              <p className="text-[11px] text-[#939183]">
                Full audit trail showing Agent &rarr; Tool &rarr; Validation &rarr; Result &rarr; Actor &rarr; Status.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={logStatusFilter}
                onChange={(e) => setLogStatusFilter(e.target.value as any)}
                className="bg-[#171b26] border border-[#262a35] rounded-lg px-2.5 py-1.5 text-xs text-[#dfe2f0] focus:outline-none focus:border-[#e4e1a9]"
              >
                <option value="ALL">All Statuses ({logs.length})</option>
                <option value="SUCCESS">Success Only</option>
                <option value="PENDING_APPROVAL">Pending Approval (Action Required)</option>
                <option value="REJECTED">Rejected</option>
              </select>

              <div className="relative w-48">
                <Search className="w-3.5 h-3.5 text-[#939183] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={logSearch}
                  onChange={(e) => setLogSearch(e.target.value)}
                  placeholder="Filter agent or tool..."
                  className="w-full bg-[#171b26] border border-[#262a35] rounded-lg pl-9 pr-3 py-1.5 text-xs text-[#dfe2f0] placeholder-[#939183] focus:outline-none focus:border-[#e4e1a9]"
                />
              </div>
            </div>
          </div>

          <div className="bg-[#141824] border border-[#262a35] rounded-xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#0f131d] border-b border-[#262a35] text-[#939183] font-mono uppercase text-[10px]">
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Agent / Caller</th>
                    <th className="py-3 px-4">Tool</th>
                    <th className="py-3 px-4">Input Summary</th>
                    <th className="py-3 px-4">Validation (Core Engine)</th>
                    <th className="py-3 px-4">Result</th>
                    <th className="py-3 px-4">Actor</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#262a35]/60">
                  {logs
                    .filter((l) => logStatusFilter === 'ALL' || l.status === logStatusFilter)
                    .filter(
                      (l) =>
                        l.agent.toLowerCase().includes(logSearch.toLowerCase()) ||
                        l.tool.toLowerCase().includes(logSearch.toLowerCase()) ||
                        l.result.toLowerCase().includes(logSearch.toLowerCase())
                    )
                    .map((log) => {
                      const getStatusBadge = () => {
                        switch (log.status) {
                          case 'SUCCESS':
                            return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
                          case 'PENDING_APPROVAL':
                            return 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse';
                          case 'REJECTED':
                            return 'bg-red-500/10 text-red-300 border-red-500/30';
                          default:
                            return 'bg-neutral-800 text-neutral-300';
                        }
                      };

                      return (
                        <tr key={log.id} className="hover:bg-[#171b26]/70 transition-colors">
                          <td className="py-3 px-4 font-mono text-[11px] text-[#939183] whitespace-nowrap">
                            {log.timestamp}
                          </td>
                          <td className="py-3 px-4 font-semibold text-[#dfe2f0] whitespace-nowrap">
                            {log.agent}
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-[#e4e1a9] whitespace-nowrap">
                            {log.tool}()
                          </td>
                          <td className="py-3 px-4 text-[11px] text-[#cac7b8] max-w-xs truncate" title={log.inputSummary}>
                            {log.inputSummary}
                          </td>
                          <td className="py-3 px-4 text-[11px] text-[#939183]">
                            <span className="font-mono text-[#c8c58f] font-semibold">[{log.validation}]</span>{' '}
                            <span>{log.authoritativeEngine}</span>
                          </td>
                          <td className="py-3 px-4 text-[11px] text-[#dfe2f0]">
                            {log.result}
                          </td>
                          <td className="py-3 px-4 font-mono text-[11px] text-[#cac7b8] whitespace-nowrap">
                            {log.actor}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${getStatusBadge()}`}>
                              {log.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            {log.status === 'PENDING_APPROVAL' ? (
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleAuthorizeLog(log.id)}
                                  className="px-2 py-1 rounded bg-[#e4e1a9] hover:bg-[#d8d598] text-[#171b26] text-[10px] font-bold cursor-pointer"
                                  title="Approve and commit to authoritative ledger"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleRejectLog(log.id)}
                                  className="px-2 py-1 rounded bg-[#171b26] hover:bg-[#1b1f2a] text-[#939183] hover:text-red-300 text-[10px] border border-[#262a35] cursor-pointer"
                                  title="Reject"
                                >
                                  Reject
                                </button>
                              </div>
                            ) : (
                              <span className="text-[10px] font-mono text-[#939183]">{log.durationMs}ms</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 5: EXTERNAL MCP (Inbound Capabilities)           */}
      {/* ======================================================== */}
      {activeTab === 'external' && (
        <div className="space-y-6 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#262a35]">
            <div>
              <h3 className="font-bold text-sm text-[#dfe2f0]">
                External Inbound MCP &amp; Event-to-Rule Mappings
              </h3>
              <p className="text-[11px] text-[#939183]">
                External platforms expose verification capabilities to Credit Economy. Events are consumed and mapped into programmable Credit rules.
              </p>
            </div>
          </div>

          {/* Mappings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mappings.map((mapping) => (
              <div
                key={mapping.id}
                className="p-4 rounded-xl bg-[#141824] border border-[#262a35] hover:border-[#e4e1a9]/50 transition-all space-y-3.5 shadow-md"
              >
                <div className="flex items-center justify-between pb-2 border-b border-[#262a35]">
                  <div className="flex items-center gap-2">
                    <span className="font-bold font-mono text-[#e4e1a9] text-sm">
                      {mapping.sourceServer}
                    </span>
                    <span className="text-[10px] font-mono text-[#939183]">&rarr;</span>
                    <span className="font-mono text-xs text-[#dfe2f0] font-semibold">
                      {mapping.externalTool}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                    {mapping.status}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-[#171b26] border border-[#262a35] space-y-2">
                  <div className="text-[10px] font-mono text-[#939183] uppercase">
                    Programmable Mapping Target:
                  </div>
                  <div className="font-semibold text-sm text-[#dfe2f0]">
                    {mapping.mappedCreditRule}
                  </div>
                  <div className="text-[11px] text-[#c8c58f]">
                    <strong>Reward Formula:</strong> {mapping.creditRewardFormula}
                  </div>
                  <div className="text-[11px] text-[#939183]">
                    <strong>Destination Pool:</strong>{' '}
                    <span className="text-[#e4e1a9] font-mono">{mapping.destinationPool}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-[#939183] uppercase">
                    Fraud Engine Authoritative Verification Checks:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {mapping.fraudEngineChecks.map((chk, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#10141f] text-emerald-300 border border-[#262a35]"
                      >
                        &check; {chk}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#939183] pt-2 border-t border-[#262a35]">
                  <span>Total Ingested: <strong className="font-mono text-[#dfe2f0]">{mapping.totalTriggerCount.toLocaleString()}</strong> events</span>
                  <button
                    onClick={() => {
                      setSimulatingMapping(mapping);
                      setSimulationResult(null);
                    }}
                    className="px-3 py-1 rounded bg-[#e4e1a9] hover:bg-[#d8d598] text-[#171b26] text-xs font-bold flex items-center gap-1 cursor-pointer transition-all shadow-sm"
                  >
                    <Play className="w-3 h-3" />
                    <span>Test Inbound Event</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Test Event Simulation Modal */}
          {simulatingMapping && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-[#141824] border border-[#e4e1a9]/50 rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between pb-3 border-b border-[#262a35]">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[#e4e1a9]" />
                    <h4 className="font-bold text-sm text-[#dfe2f0]">
                      Simulate Inbound Event: {simulatingMapping.sourceServer}
                    </h4>
                  </div>
                  <button onClick={() => setSimulatingMapping(null)} className="text-[#939183] hover:text-[#dfe2f0]">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-[#939183] uppercase">
                    Simulated Payload JSON ({simulatingMapping.externalTool}):
                  </label>
                  <textarea
                    value={simulationPayload}
                    onChange={(e) => setSimulationPayload(e.target.value)}
                    rows={5}
                    className="w-full bg-[#10141f] border border-[#262a35] rounded-lg p-2.5 font-mono text-xs text-[#dfe2f0] focus:outline-none focus:border-[#e4e1a9]"
                  />
                </div>

                {simulationResult && (
                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-1">
                    <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Ingestion Committed</span>
                    </div>
                    <p className="text-[#cac7b8]">{simulationResult.log.result}</p>
                    <div className="text-[10px] font-mono text-[#939183]">
                      Execution ID: {simulationResult.log.id} ({simulationResult.log.durationMs}ms)
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#262a35]">
                  <button
                    onClick={() => setSimulatingMapping(null)}
                    className="px-3.5 py-2 rounded-lg bg-[#171b26] hover:bg-[#1b1f2a] text-xs font-medium text-[#939183] hover:text-[#dfe2f0] border border-[#262a35] cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    onClick={handleRunSimulation}
                    className="px-4 py-2 rounded-lg bg-[#e4e1a9] hover:bg-[#d8d598] text-[#171b26] text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Fire Inbound Event</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Schema / Tool Detail Modal */}
      {selectedToolDetail && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141824] border border-[#e4e1a9]/50 rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-2xl text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#262a35]">
              <div className="flex items-center gap-2 font-mono text-sm font-bold text-[#dfe2f0]">
                <span>{selectedToolDetail.name}()</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#1b1f2a] text-[#e4e1a9] border border-[#e4e1a9]/30">
                  {selectedToolDetail.classification}
                </span>
              </div>
              <button onClick={() => setSelectedToolDetail(null)} className="text-[#939183] hover:text-[#dfe2f0]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[#cac7b8] leading-relaxed">{selectedToolDetail.description}</p>

            <div className="space-y-1">
              <span className="text-[10px] font-mono text-[#939183] uppercase">Input Schema:</span>
              <pre className="p-2.5 rounded-lg bg-[#10141f] border border-[#262a35] font-mono text-[11px] text-[#e4e1a9] overflow-x-auto">
                {JSON.stringify(selectedToolDetail.inputSchema, null, 2)}
              </pre>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono text-[#939183] uppercase">Output Schema:</span>
              <pre className="p-2.5 rounded-lg bg-[#10141f] border border-[#262a35] font-mono text-[11px] text-emerald-300 overflow-x-auto">
                {JSON.stringify(selectedToolDetail.outputSchema, null, 2)}
              </pre>
            </div>

            <div className="p-2.5 rounded-lg bg-[#171b26] border border-[#262a35] flex items-center justify-between text-[11px]">
              <span className="text-[#939183]">Authoritative Engine:</span>
              <span className="font-mono font-bold text-[#dfe2f0]">{selectedToolDetail.authoritativeEngine}</span>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedToolDetail(null)}
                className="px-4 py-2 rounded-lg bg-[#1b1f2a] hover:bg-[#262a35] text-xs font-semibold text-[#dfe2f0] border border-[#262a35] cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Server Detail Modal */}
      {selectedServerDetail && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141824] border border-[#e4e1a9]/50 rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-2xl text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#262a35]">
              <div className="flex items-center gap-2 font-mono text-sm font-bold text-[#dfe2f0]">
                <span>{selectedServerDetail.name} Connector</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#1b1f2a] text-emerald-300 border border-emerald-500/30">
                  {selectedServerDetail.status}
                </span>
              </div>
              <button onClick={() => setSelectedServerDetail(null)} className="text-[#939183] hover:text-[#dfe2f0]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 font-mono text-[11px]">
              <div className="p-2.5 rounded-lg bg-[#10141f] border border-[#262a35] space-y-1">
                <div className="text-[#939183]">Endpoint URI:</div>
                <div className="text-[#e4e1a9] break-all">{selectedServerDetail.endpoint}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 rounded bg-[#171b26] border border-[#262a35]">
                  <div className="text-[#939183]">30-Day Uptime</div>
                  <div className="font-bold text-[#dfe2f0]">{selectedServerDetail.uptime30d}</div>
                </div>
                <div className="p-2 rounded bg-[#171b26] border border-[#262a35]">
                  <div className="text-[#939183]">Auth Protocol</div>
                  <div className="font-bold text-[#c8c58f]">{selectedServerDetail.authMethod}</div>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono text-[#939183] uppercase">Data Scope:</span>
              <p className="text-[#cac7b8] leading-relaxed">{selectedServerDetail.dataScope}</p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedServerDetail(null)}
                className="px-4 py-2 rounded-lg bg-[#1b1f2a] hover:bg-[#262a35] text-xs font-semibold text-[#dfe2f0] border border-[#262a35] cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
