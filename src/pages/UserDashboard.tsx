import React from 'react';
import { 
  Cpu, 
  KeyRound, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ArrowRight, 
  ShieldCheck, 
  Blocks, 
  Lock, 
  Clock, 
  Radio, 
  Camera, 
  Activity 
} from 'lucide-react';
import { IoTDevice, AccessRequest, UserAccount, ViewTab } from '../types';

interface UserDashboardProps {
  activeUser: UserAccount;
  devices: IoTDevice[];
  accessLogs: AccessRequest[];
  onNavigate: (tab: ViewTab) => void;
  onRequestAccess: (device: IoTDevice) => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  activeUser,
  devices,
  accessLogs,
  onNavigate,
  onRequestAccess
}) => {
  const myDevices = devices.filter(d => 
    activeUser.assignedDevices?.includes(d.deviceId)
  );

  const myLogs = accessLogs.filter(l => 
    l.userId === activeUser.id || 
    activeUser.assignedDevices?.includes(l.deviceId)
  );

  const approvedRequests = myLogs.filter(l => l.decision === 'ALLOW').length;
  const limitedRequests = myLogs.filter(l => l.decision === 'LIMITED').length;
  const deniedRequests = myLogs.filter(l => l.decision === 'DENY').length;

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="p-6 rounded-3xl bg-[#001032] border border-white/10 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#00e5ff] animate-pulse" />
            <span className="text-[10px] font-mono font-bold tracking-widest text-[#00e5ff] uppercase">Identity Scope</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">
            Welcome back, {activeUser.name}
          </h1>
          <p className="text-xs text-slate-300 mt-0.5">
            Assigned IoT Node Portal &bull; Continuous Zero-Trust Security Scope
          </p>
        </div>

        <button
          onClick={() => onNavigate('access-request')}
          className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#00646e] hover:bg-[#00828f] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-[0_4px_16px_rgba(0,100,110,0.4)] hover:scale-105 active:scale-95 cursor-pointer"
        >
          <KeyRound className="w-4 h-4" />
          <span>Request Node Access</span>
        </button>
      </div>

      {/* 4 User Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-[#001032] border border-white/10 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase text-slate-400 font-bold">My Devices</span>
            <Cpu className="w-4 h-4 text-[#00e5ff]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-[#00e5ff] mt-1">
            {myDevices.length}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Assigned Hardware</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#001032] border border-white/10 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase text-slate-400 font-bold">Approved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-400 mt-1">
            {approvedRequests}
          </div>
          <span className="text-[10px] text-emerald-400/80 mt-1 block">Full Access Granted</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#001032] border border-white/10 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase text-slate-400 font-bold">Limited</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-amber-400 mt-1">
            {limitedRequests}
          </div>
          <span className="text-[10px] text-amber-400/80 mt-1 block">Restricted Policy</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#001032] border border-white/10 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase text-slate-400 font-bold">Denied</span>
            <XCircle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-rose-400 mt-1">
            {deniedRequests}
          </div>
          <span className="text-[10px] text-rose-400/80 mt-1 block">High Risk Blocked</span>
        </div>

      </div>

      {/* 2-Column Layout: My Assigned Devices & Current Access Permissions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: My Devices List */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-[#001032] border border-white/10 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#00e5ff]" />
              <span>My Permitted IoT Devices ({myDevices.length})</span>
            </h3>

            <button
              onClick={() => onNavigate('access-request')}
              className="text-xs text-[#00e5ff] hover:underline font-semibold cursor-pointer"
            >
              Request Access &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {myDevices.map((dev) => (
              <div 
                key={dev.id}
                className="p-4 rounded-2xl bg-[#000028] border border-white/10 hover:border-[#00646e]/60 transition-all flex flex-col justify-between shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-white">{dev.deviceId}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      dev.status === 'ONLINE' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                      dev.status === 'SUSPICIOUS' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                      'bg-rose-950 text-rose-300 border border-rose-800'
                    }`}>
                      {dev.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1">{dev.deviceType}</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">{dev.location}</p>

                  <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">Trust Score:</span>
                    <span className="text-[#00e5ff] font-bold">{dev.trustScore}/100</span>
                  </div>
                </div>

                <button
                  onClick={() => onRequestAccess(dev)}
                  className="mt-3.5 w-full py-2 rounded-xl bg-[#00646e] hover:bg-[#00828f] text-white border border-[#00e5ff]/30 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Request Access for {dev.deviceId}</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Current Access Permissions Status */}
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-[#001032] border border-white/10 shadow-xl space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Current Policy State</span>
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#000028] border border-white/10 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">CCTV_01</span>
                  <span className="text-[11px] text-slate-400">Camera Feed Stream</span>
                </div>
                <span className="font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                  ALLOWED
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#000028] border border-white/10 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">SmartDoor_01</span>
                  <span className="text-[11px] text-slate-400">Physical Entrance Lock</span>
                </div>
                <span className="font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800">
                  LIMITED ACCESS
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#000028] border border-white/10 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">Database Cluster</span>
                  <span className="text-[11px] text-slate-400">Central Audit Records</span>
                </div>
                <span className="font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800">
                  ACCESS DENIED
                </span>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-slate-400 leading-relaxed">
              Permissions are evaluated dynamically during each request based on device behavior and trust level.
            </div>
          </div>
        </div>

      </div>

      {/* User's Access Request History */}
      <div className="p-6 rounded-3xl bg-[#001032] border border-white/10 shadow-xl">
        <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-white mb-4 flex items-center gap-2">
          <Blocks className="w-4 h-4 text-[#00e5ff]" />
          <span>My Recent Access Ledger History</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 font-mono text-[10px] uppercase bg-[#000028]/60">
                <th className="py-3 px-3.5 rounded-l-lg">Device ID</th>
                <th className="py-3 px-3.5">Target Resource</th>
                <th className="py-3 px-3.5">Risk</th>
                <th className="py-3 px-3.5">Decision</th>
                <th className="py-3 px-3.5">Blockchain Tx</th>
                <th className="py-3 px-3.5 rounded-r-lg">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {myLogs.slice(0, 5).map((log) => (
                <tr key={log.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-3.5 font-bold text-[#00e5ff]">{log.deviceId}</td>
                  <td className="py-3 px-3.5 text-slate-200 font-sans">{log.resource}</td>
                  <td className="py-3 px-3.5">
                    <span className={log.riskScore > 60 ? 'text-rose-400' : log.riskScore > 30 ? 'text-amber-400' : 'text-emerald-400'}>
                      {log.riskScore}
                    </span>
                  </td>
                  <td className="py-3 px-3.5 font-bold">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] ${
                      log.decision === 'ALLOW' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                      log.decision === 'LIMITED' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                      'bg-rose-950 text-rose-300 border border-rose-800'
                    }`}>
                      {log.decision}
                    </span>
                  </td>
                  <td className="py-3 px-3.5 text-slate-300 truncate max-w-[120px]">
                    {log.transactionHash ? `${log.transactionHash.substring(0, 8)}...` : '0x...'}
                  </td>
                  <td className="py-3 px-3.5 text-slate-400 font-sans text-[11px]">{log.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
