import React, { useState } from 'react';
import { 
  Cpu, 
  ShieldCheck, 
  AlertTriangle, 
  XCircle, 
  KeyRound, 
  Blocks, 
  Play, 
  Activity, 
  Search, 
  ArrowRight, 
  ChevronRight, 
  Sparkles,
  Zap,
  TrendingUp,
  BrainCircuit,
  Lock,
  Radio,
  ExternalLink,
  Shield,
  Layers
} from 'lucide-react';
import { IoTDevice, AccessRequest, BlockchainTransaction, ViewTab } from '../types';
import { StorageService } from '../services/storageService';

interface AdminDashboardProps {
  devices: IoTDevice[];
  accessLogs: AccessRequest[];
  transactions: BlockchainTransaction[];
  onNavigate: (tab: ViewTab) => void;
  onRunSimulationDemo: () => void;
  onRefreshData: () => void;
  onRequestAccess: (device: IoTDevice) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  devices,
  accessLogs,
  transactions,
  onNavigate,
  onRunSimulationDemo,
  onRefreshData,
  onRequestAccess
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Dynamic Metrics
  const totalDevices = devices.length;
  const activeDevices = devices.filter(d => d.status === 'ONLINE').length;
  const suspiciousDevices = devices.filter(d => d.status === 'SUSPICIOUS').length;
  const blockedDevices = devices.filter(d => d.status === 'BLOCKED').length;
  const totalAccessRequests = accessLogs.length;
  const totalBlockchainTxs = transactions.length;

  const filteredLogs = accessLogs.filter(log => 
    log.deviceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.decision.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSimulateDevice = (deviceId: string, type: 'NORMAL' | 'SUSPICIOUS' | 'HIGH_RISK') => {
    StorageService.simulateDeviceActivity(deviceId, type);
    onRefreshData();
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner with Quick Trigger (Landing Page Deep Navy Theme) */}
      <div className="p-6 sm:p-7 rounded-3xl bg-[#001032] border border-white/10 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00646e]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
            <span className="text-[11px] font-mono font-bold tracking-widest text-[#00e5ff] uppercase">
              SecureIoT AI SOC Defense Core
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Security Operations Command
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Continuous behavioral risk scoring, multi-tier zero-trust authorization, and cryptographic smart contract ledger logging.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-3">
          <button
            onClick={onRunSimulationDemo}
            className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#00646e] hover:bg-[#00828f] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-[0_4px_16px_rgba(0,100,110,0.4)] hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-white text-white" />
            <span>Run Attack Simulation</span>
          </button>
          
          <button
            onClick={() => onNavigate('access-request')}
            className="flex items-center gap-2 px-5 py-3 rounded-full bg-white/10 hover:bg-white/15 text-white border border-white/20 hover:border-white/40 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            <KeyRound className="w-3.5 h-3.5 text-[#00e5ff]" />
            <span>New Access Request</span>
          </button>
        </div>
      </div>

      {/* 6 Metric KPI Cards Styled as Landing Page Bento Blocks */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        
        {/* Total Devices */}
        <div className="p-4 rounded-2xl bg-[#001032] border border-white/10 shadow-lg group hover:border-[#00e5ff]/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase font-bold text-slate-400">Total Fleet</span>
            <Cpu className="w-4 h-4 text-[#00e5ff]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-white mt-2">
            {totalDevices}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Simulated IoT Nodes</span>
        </div>

        {/* Active Devices */}
        <div className="p-4 rounded-2xl bg-[#001032] border border-white/10 shadow-lg group hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase font-bold text-slate-400">Active Nodes</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-400 mt-2">
            {activeDevices}
          </div>
          <span className="text-[10px] text-emerald-300/80 mt-1 block">Low Risk Baseline</span>
        </div>

        {/* Suspicious Devices */}
        <div className="p-4 rounded-2xl bg-[#001032] border border-white/10 shadow-lg group hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase font-bold text-slate-400">Suspicious</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-amber-400 mt-2">
            {suspiciousDevices}
          </div>
          <span className="text-[10px] text-amber-300/80 mt-1 block">Limited Sandbox</span>
        </div>

        {/* Blocked Devices */}
        <div className="p-4 rounded-2xl bg-[#001032] border border-white/10 shadow-lg group hover:border-rose-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase font-bold text-slate-400">Blocked</span>
            <XCircle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-rose-400 mt-2">
            {blockedDevices}
          </div>
          <span className="text-[10px] text-rose-300/80 mt-1 block">Isolated by AI</span>
        </div>

        {/* Total Access Requests */}
        <div className="p-4 rounded-2xl bg-[#001032] border border-white/10 shadow-lg group hover:border-[#00646e]/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase font-bold text-slate-400">Requests</span>
            <KeyRound className="w-4 h-4 text-[#00e5ff]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-white mt-2">
            {totalAccessRequests}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Evaluated by Model</span>
        </div>

        {/* Blockchain Transactions */}
        <div className="p-4 rounded-2xl bg-[#001032] border border-white/10 shadow-lg group hover:border-cyan-400/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase font-bold text-slate-400">Ledger Txs</span>
            <Blocks className="w-4 h-4 text-[#00e5ff]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-[#00e5ff] mt-2">
            {totalBlockchainTxs}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Immutable Proofs</span>
        </div>

      </div>

      {/* Main Grid: Live Fleet Status & Quick Activity Generator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: IoT Devices Quick View & Behavior Injector */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-6 rounded-3xl bg-[#001032] border border-white/10 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <Cpu className="w-4 h-4 text-[#00e5ff]" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  Active IoT Nodes Telemetry
                </h3>
              </div>
              <button
                onClick={() => onNavigate('devices')}
                className="text-xs text-[#00e5ff] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
              >
                <span>Full Device Manager</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Devices Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {devices.slice(0, 4).map((dev) => (
                <div 
                  key={dev.id}
                  className="p-4 rounded-2xl bg-[#000028] border border-white/10 hover:border-[#00646e]/80 transition-all shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono font-bold text-xs text-[#00e5ff]">{dev.deviceId}</span>
                      <p className="text-[11px] text-slate-300 font-medium">{dev.deviceType}</p>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      dev.status === 'ONLINE' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                      dev.status === 'SUSPICIOUS' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                      dev.status === 'BLOCKED' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                      'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}>
                      {dev.status}
                    </span>
                  </div>

                  {/* Trust & Risk Bar */}
                  <div className="mt-3.5 space-y-1 text-[11px] font-mono">
                    <div className="flex justify-between text-slate-400">
                      <span>Trust: <strong className="text-white">{dev.trustScore}</strong></span>
                      <span>Risk: <strong className={dev.riskScore > 60 ? 'text-rose-400' : dev.riskScore > 30 ? 'text-amber-400' : 'text-emerald-400'}>{dev.riskScore}</strong></span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden flex">
                      <div className="bg-[#00646e] h-full transition-all duration-500" style={{ width: `${dev.trustScore}%` }} />
                      <div className="bg-rose-500 h-full transition-all duration-500" style={{ width: `${dev.riskScore}%` }} />
                    </div>
                  </div>

                  {/* Behavior Injectors */}
                  <div className="mt-3.5 pt-3 border-t border-white/10 flex items-center justify-between gap-1">
                    <span className="text-[9px] uppercase font-mono text-slate-400 font-bold">Simulate:</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleSimulateDevice(dev.deviceId, 'NORMAL')}
                        className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-800/50 transition-colors cursor-pointer"
                        title="Simulate normal baseline traffic"
                      >
                        Normal
                      </button>
                      <button
                        onClick={() => handleSimulateDevice(dev.deviceId, 'SUSPICIOUS')}
                        className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-amber-950/60 hover:bg-amber-900/80 text-amber-300 border border-amber-800/50 transition-colors cursor-pointer"
                        title="Simulate multiple anomalies"
                      >
                        Suspicious
                      </button>
                      <button
                        onClick={() => handleSimulateDevice(dev.deviceId, 'HIGH_RISK')}
                        className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800/50 transition-colors cursor-pointer"
                        title="Simulate high anomalous attack burst"
                      >
                        High-Risk
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Adaptive Security Architecture Summary */}
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-[#001032] border border-white/10 shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Adaptive Policy Thresholds
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#000028] border border-emerald-900/50 flex items-center justify-between">
                <div>
                  <span className="font-bold text-emerald-300 block">LOW RISK (0 - 30)</span>
                  <span className="text-[11px] text-slate-400">Baseline telemetry & verified key</span>
                </div>
                <span className="font-mono font-black text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-700">
                  ALLOW
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#000028] border border-amber-900/50 flex items-center justify-between">
                <div>
                  <span className="font-bold text-amber-300 block">MEDIUM (31 - 60)</span>
                  <span className="text-[11px] text-slate-400">Repeated retries / network jitter</span>
                </div>
                <span className="font-mono font-black text-amber-400 bg-amber-950 px-2.5 py-1 rounded-lg border border-amber-700">
                  LIMITED
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#000028] border border-rose-900/50 flex items-center justify-between">
                <div>
                  <span className="font-bold text-rose-300 block">HIGH RISK (61 - 100)</span>
                  <span className="text-[11px] text-slate-400">Critical anomaly & rogue traffic</span>
                </div>
                <span className="font-mono font-black text-rose-400 bg-rose-950 px-2.5 py-1 rounded-lg border border-rose-700">
                  DENY
                </span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono">Classifier: Random Forest</span>
              <button
                onClick={() => onNavigate('ai-risk')}
                className="text-[#00e5ff] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>AI Risk Scoring</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Recent Access Requests Log Table Styled with Midnight Navy and White Borders */}
      <div className="p-6 rounded-3xl bg-[#001032] border border-white/10 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Blocks className="w-4 h-4 text-[#00e5ff]" />
              <span>Real-Time Access Decisions & Blockchain Ledger</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Live zero-trust audit records committed to Ethereum smart contract
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Filter by device, resource, policy..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#000028] border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00646e]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 font-mono text-[10px] uppercase bg-[#000028]/60">
                <th className="py-3 px-3.5 rounded-l-lg">Device ID</th>
                <th className="py-3 px-3.5">Resource</th>
                <th className="py-3 px-3.5">Trust</th>
                <th className="py-3 px-3.5">Risk</th>
                <th className="py-3 px-3.5">Decision</th>
                <th className="py-3 px-3.5">Tx Hash</th>
                <th className="py-3 px-3.5">Block</th>
                <th className="py-3 px-3.5 rounded-r-lg">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {filteredLogs.slice(0, 6).map((log) => (
                <tr key={log.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-3.5 font-bold text-[#00e5ff]">
                    {log.deviceId}
                  </td>
                  <td className="py-3 px-3.5 text-slate-200 font-sans">
                    {log.resource}
                  </td>
                  <td className="py-3 px-3.5 text-white">
                    {log.trustScore}
                  </td>
                  <td className="py-3 px-3.5">
                    <span className={log.riskScore > 60 ? 'text-rose-400' : log.riskScore > 30 ? 'text-amber-400' : 'text-emerald-400'}>
                      {log.riskScore}
                    </span>
                  </td>
                  <td className="py-3 px-3.5 font-bold">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] inline-block ${
                      log.decision === 'ALLOW' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                      log.decision === 'LIMITED' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                      'bg-rose-950 text-rose-300 border border-rose-800'
                    }`}>
                      {log.decision === 'ALLOW' ? 'ALLOW' : log.decision === 'LIMITED' ? 'LIMITED' : 'DENY'}
                    </span>
                  </td>
                  <td className="py-3 px-3.5 text-slate-400 truncate max-w-[120px]" title={log.transactionHash}>
                    {log.transactionHash ? `${log.transactionHash.substring(0, 8)}...${log.transactionHash.slice(-4)}` : '0x...'}
                  </td>
                  <td className="py-3 px-3.5 text-[#00e5ff]">
                    #{log.blockNumber}
                  </td>
                  <td className="py-3 px-3.5 text-slate-400 font-sans text-[11px]">
                    {log.timestamp}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
          <span className="text-slate-400">Showing {Math.min(6, filteredLogs.length)} of {filteredLogs.length} logged requests</span>
          <button
            onClick={() => onNavigate('blockchain')}
            className="text-[#00e5ff] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
          >
            <span>View All Blockchain Logs</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </div>
  );
};
