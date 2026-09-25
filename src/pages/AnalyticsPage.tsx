import React, { useState } from 'react';
import { 
  LineChart as LineChartIcon, 
  PieChart as PieChartIcon, 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  ShieldCheck, 
  AlertTriangle, 
  XCircle,
  Activity,
  Layers,
  Blocks
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  Legend 
} from 'recharts';
import { IoTDevice, AccessRequest, BlockchainTransaction } from '../types';

interface AnalyticsPageProps {
  devices: IoTDevice[];
  accessLogs: AccessRequest[];
  transactions: BlockchainTransaction[];
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({
  devices,
  accessLogs,
  transactions
}) => {
  const [timeFilter, setTimeFilter] = useState<'today' | '7days' | '30days'>('7days');

  // Chart 1: Access Requests Over Time
  const timeSeriesData = [
    { time: '02:00', allow: 4, limited: 1, deny: 0 },
    { time: '06:00', allow: 12, limited: 2, deny: 1 },
    { time: '10:00', allow: 28, limited: 5, deny: 2 },
    { time: '14:00', allow: 35, limited: 8, deny: 3 },
    { time: '18:00', allow: 22, limited: 4, deny: 1 },
    { time: '22:00', allow: 9, limited: 3, deny: 2 },
  ];

  // Chart 2: Allowed vs Limited vs Denied Distribution
  const allowCount = accessLogs.filter(l => l.decision === 'ALLOW').length;
  const limitedCount = accessLogs.filter(l => l.decision === 'LIMITED').length;
  const denyCount = accessLogs.filter(l => l.decision === 'DENY').length;

  const decisionDistribution = [
    { name: 'Allowed', value: Math.max(allowCount, 4), color: '#10b981' },
    { name: 'Limited', value: Math.max(limitedCount, 2), color: '#fbbf24' },
    { name: 'Denied', value: Math.max(denyCount, 1), color: '#f43f5e' },
  ];

  // Chart 3: Device Risk Scores
  const deviceRiskData = devices.map(d => ({
    name: d.deviceId,
    risk: d.riskScore,
    trust: d.trustScore
  }));

  const avgTrust = Math.round(
    devices.reduce((acc, d) => acc + d.trustScore, 0) / (devices.length || 1)
  );
  const avgRisk = Math.round(
    devices.reduce((acc, d) => acc + d.riskScore, 0) / (devices.length || 1)
  );

  return (
    <div className="space-y-6">
      
      {/* Header & Filter Controls */}
      <div className="p-6 rounded-3xl bg-[#001032] border border-white/10 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#00e5ff] animate-pulse" />
            <span className="text-[10px] font-mono font-bold tracking-widest text-[#00e5ff] uppercase">Fleet Intelligence</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-[#00e5ff]" />
            <span>Telemetry & Security Analytics</span>
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Statistical behavioral monitoring, anomaly patterns, and decision distributions
          </p>
        </div>

        {/* Time Filters */}
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-[#000028] border border-white/10 shadow-inner">
          <Calendar className="w-3.5 h-3.5 text-slate-400 ml-2.5" />
          <button
            onClick={() => setTimeFilter('today')}
            className={`px-3.5 py-1.5 text-xs font-mono font-bold rounded-full transition-all cursor-pointer ${
              timeFilter === 'today' ? 'bg-[#00646e] text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setTimeFilter('7days')}
            className={`px-3.5 py-1.5 text-xs font-mono font-bold rounded-full transition-all cursor-pointer ${
              timeFilter === '7days' ? 'bg-[#00646e] text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            7 Days
          </button>
          <button
            onClick={() => setTimeFilter('30days')}
            className={`px-3.5 py-1.5 text-xs font-mono font-bold rounded-full transition-all cursor-pointer ${
              timeFilter === '30days' ? 'bg-[#00646e] text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            30 Days
          </button>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-[#001032] border border-white/10 text-center shadow-md">
          <span className="text-[10px] uppercase font-mono text-slate-400 font-bold">Average Trust Score</span>
          <div className="text-2xl sm:text-3xl font-black font-mono text-[#00e5ff] mt-1">
            {avgTrust}<span className="text-xs text-slate-400">/100</span>
          </div>
          <span className="text-[10px] text-emerald-400 mt-1 block">&uarr; 3.2% from last cycle</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#001032] border border-white/10 text-center shadow-md">
          <span className="text-[10px] uppercase font-mono text-slate-400 font-bold">Average Risk Score</span>
          <div className="text-2xl sm:text-3xl font-black font-mono text-amber-400 mt-1">
            {avgRisk}<span className="text-xs text-slate-400">/100</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Optimal fleet envelope</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#001032] border border-white/10 text-center shadow-md">
          <span className="text-[10px] uppercase font-mono text-slate-400 font-bold">Suspicious Events</span>
          <div className="text-2xl sm:text-3xl font-black font-mono text-rose-400 mt-1">
            {devices.filter(d => d.status === 'SUSPICIOUS' || d.status === 'BLOCKED').length}
          </div>
          <span className="text-[10px] text-rose-400/80 mt-1 block">Filtered by Adaptive Gate</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#001032] border border-white/10 text-center shadow-md">
          <span className="text-[10px] uppercase font-mono text-slate-400 font-bold">Blockchain Commits</span>
          <div className="text-2xl sm:text-3xl font-black font-mono text-white mt-1">
            {transactions.length}
          </div>
          <span className="text-[10px] text-[#00e5ff] mt-1 block">100% Finalized</span>
        </div>

      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart 1: Requests Over Time (Area Chart) */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-[#001032] border border-white/10 shadow-xl">
          <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-white mb-4 flex items-center gap-2">
            <LineChartIcon className="w-4 h-4 text-[#00e5ff]" />
            <span>Access Requests & Adaptive Decisions Over Time</span>
          </h3>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeSeriesData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAllow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="colorLimited" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#fbbf24" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="colorDeny" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ backgroundColor: '#001032', borderColor: '#ffffff20', borderRadius: '12px', fontSize: 12, color: '#fff' }} />
                <Area type="monotone" dataKey="allow" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorAllow)" name="Allowed" />
                <Area type="monotone" dataKey="limited" stroke="#fbbf24" strokeWidth={2} fillOpacity={1} fill="url(#colorLimited)" name="Limited" />
                <Area type="monotone" dataKey="deny" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#colorDeny)" name="Denied" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Allowed vs Limited vs Denied (Donut / Pie) */}
        <div className="p-6 rounded-3xl bg-[#001032] border border-white/10 shadow-xl flex flex-col justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-white mb-2 flex items-center gap-2">
            <PieChartIcon className="w-4 h-4 text-emerald-400" />
            <span>Policy Decision Ratios</span>
          </h3>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={decisionDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {decisionDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#001032', borderColor: '#ffffff20', borderRadius: '12px', fontSize: 12, color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono pt-3 border-t border-white/10">
            <div>
              <span className="text-emerald-400 block font-bold">ALLOW</span>
              <span className="text-white font-bold">{allowCount}</span>
            </div>
            <div>
              <span className="text-amber-400 block font-bold">LIMITED</span>
              <span className="text-white font-bold">{limitedCount}</span>
            </div>
            <div>
              <span className="text-rose-400 block font-bold">DENY</span>
              <span className="text-white font-bold">{denyCount}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Chart 3: Device Risk vs Trust Distribution (Bar Chart) */}
      <div className="p-6 rounded-3xl bg-[#001032] border border-white/10 shadow-xl">
        <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-white mb-4 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-[#00e5ff]" />
          <span>Device Risk vs Trust Comparative Breakdown</span>
        </h3>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={deviceRiskData} margin={{ top: 10, right: 20, left: 0, bottom: 25 }}>
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} angle={-25} textAnchor="end" />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ backgroundColor: '#001032', borderColor: '#ffffff20', borderRadius: '12px', fontSize: 12, color: '#fff' }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="trust" fill="#00646e" name="Trust Score" radius={[4, 4, 0, 0]} />
              <Bar dataKey="risk" fill="#f43f5e" name="Risk Score" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
