import React from 'react';
import { 
  LayoutDashboard, 
  Cpu, 
  KeyRound, 
  BrainCircuit, 
  Blocks, 
  Users, 
  LineChart, 
  Settings, 
  LogOut,
  Sparkles,
  ShieldCheck,
  Radio,
  Lock,
  Layers,
  Activity,
  Sun,
  Moon
} from 'lucide-react';
import { UserAccount, ViewTab } from '../types';

interface SidebarProps {
  currentTab: ViewTab;
  onNavigate: (tab: ViewTab) => void;
  activeUser: UserAccount;
  onLogout: () => void;
  activeDeviceCount: number;
  dashboardTheme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

interface NavItem {
  id: ViewTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  highlight?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onNavigate,
  activeUser,
  onLogout,
  activeDeviceCount,
  dashboardTheme = 'light',
  onToggleTheme
}) => {
  const isAdmin = activeUser.role === 'ADMIN';

  const adminNavItems: NavItem[] = [
    { id: 'admin-dashboard', label: 'SOC Overview', icon: LayoutDashboard },
    { id: 'devices', label: 'IoT Fleet Nodes', icon: Cpu, badge: `${activeDeviceCount} Live` },
    { id: 'access-request', label: 'Access Requests', icon: KeyRound },
    { id: 'ai-risk', label: 'AI Risk Classifier', icon: BrainCircuit },
    { id: 'blockchain', label: 'Blockchain Ledger', icon: Blocks },
    { id: 'users', label: 'Identity & Access', icon: Users },
    { id: 'analytics', label: 'Threat Analytics', icon: LineChart },
    { id: 'settings', label: 'SOC Configuration', icon: Settings }
  ];

  const userNavItems: NavItem[] = [
    { id: 'user-dashboard', label: 'Operator Portal', icon: LayoutDashboard },
    { id: 'devices', label: 'Assigned IoT Nodes', icon: Cpu },
    { id: 'access-request', label: 'Request Device Access', icon: KeyRound },
    { id: 'blockchain', label: 'My Ledger History', icon: Blocks },
    { id: 'settings', label: 'Profile & Security', icon: Settings }
  ];

  const navItems = isAdmin ? adminNavItems : userNavItems;

  return (
    <aside className="w-64 shrink-0 hidden md:flex flex-col bg-[#000028] border-r border-slate-800/80 p-4 min-h-[calc(100vh-4rem)] select-none z-20">
      
      {/* Role & Operator Badge Card */}
      <div className="mb-5 p-3.5 rounded-2xl bg-[#001032] border border-white/10 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#00646e]/20 rounded-full blur-xl pointer-events-none" />

        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold">
            SECURE ACCESS
          </span>
          <span className={`inline-flex items-center gap-1.5 text-[9px] font-bold px-2 py-0.5 rounded-full font-mono ${
            isAdmin 
              ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/60' 
              : 'bg-[#00646e]/40 text-[#00e5ff] border border-[#00646e]'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isAdmin ? 'bg-emerald-400' : 'bg-[#00e5ff]'} animate-pulse`} />
            {isAdmin ? 'ADMIN SOC' : 'OPERATOR'}
          </span>
        </div>
        <p className="text-xs font-bold text-white truncate">{activeUser.name}</p>
        <p className="text-[11px] text-slate-400 truncate mt-0.5 font-mono">{activeUser.email}</p>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 space-y-1.5">
        <div className="px-3 pb-1.5 text-[10px] uppercase tracking-widest font-mono text-slate-400 font-semibold">
          Operations Command
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group relative cursor-pointer ${
                isActive
                  ? 'bg-[#00646e] text-white shadow-md shadow-[#00646e]/40 border border-[#00e5ff]/40 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-white/10 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 transition-transform ${
                  isActive ? 'text-[#00e5ff] scale-105' : 'text-slate-400 group-hover:text-[#00e5ff]'
                }`} />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                  isActive 
                    ? 'bg-white/20 text-white' 
                    : 'bg-[#001032] text-[#00e5ff] border border-white/10'
                }`}>
                  {item.badge}
                </span>
              )}

              {isActive && (
                <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-[#00e5ff] shadow-[0_0_8px_rgba(0,229,255,0.9)]" />
              )}
            </button>
          );
        })}
      </nav>

      {/* IoT Gateway Telemetry Status Box */}
      <div className="mt-auto pt-4 border-t border-slate-800">
        <div className="p-3 rounded-xl bg-[#001032] border border-white/10 text-xs">
          <div className="flex items-center justify-between text-[11px] mb-1.5">
            <span className="text-slate-300 flex items-center gap-1.5 font-medium">
              <Activity className="w-3.5 h-3.5 text-[#00e5ff] animate-pulse" />
              Perimeter Defense
            </span>
            <span className="text-emerald-400 font-mono text-[10px] font-bold">ARMED</span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mt-1">
            <span>Engine:</span>
            <span className="text-slate-200">Random Forest + Ethers</span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mt-0.5">
            <span>Policy:</span>
            <span className="text-slate-200">3-Tier Continuous</span>
          </div>
        </div>

        {/* Dashboard Tone Toggle */}
        {onToggleTheme && (
          <div className="mt-3 p-2.5 rounded-xl bg-[#001032] border border-white/10 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-300 font-medium">
              {dashboardTheme === 'light' ? (
                <Sun className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-[#00e5ff]" />
              )}
              <span className="text-[11px] font-sans">Theme:</span>
            </div>
            <button
              onClick={onToggleTheme}
              className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-[#00646e] hover:bg-[#00828f] text-white transition-all cursor-pointer shadow-sm"
              title="Toggle Dashboard Theme"
            >
              {dashboardTheme === 'light' ? 'Soft White' : 'Dark Navy'}
            </button>
          </div>
        )}

        <button
          onClick={onLogout}
          className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-rose-300 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-800/50 transition-all cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5 text-rose-400" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
