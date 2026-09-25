import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  Blocks, 
  Bell, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Info, 
  ChevronDown, 
  Search,
  Menu,
  X,
  User, 
  LogOut, 
  Play, 
  ExternalLink,
  Layers,
  ArrowRight,
  Sliders,
  Activity,
  FileCheck2,
  Lock,
  Sparkles,
  Globe,
  ShoppingCart,
  Sun,
  Moon,
  BrainCircuit
} from 'lucide-react';
import { UserAccount, NotificationItem, ViewTab } from '../types';
import { StorageService } from '../services/storageService';

interface NavbarProps {
  activeUser: UserAccount | null;
  notifications: NotificationItem[];
  onNavigate: (tab: ViewTab) => void;
  onSwitchUser: (userEmail: string) => void;
  onLogout: () => void;
  onOpenRemixGuide: () => void;
  onRunSimulationDemo: () => void;
  currentTab: ViewTab;
  dashboardTheme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeUser,
  notifications,
  onNavigate,
  onSwitchUser,
  onLogout,
  onOpenRemixGuide,
  onRunSimulationDemo,
  currentTab,
  dashboardTheme = 'light',
  onToggleTheme
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    StorageService.markAllNotificationsRead();
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* TOP CORPORATE UTILITY BAR                                                 */}
      {/* ========================================================================= */}
      <div className="w-full bg-[#000028] border-b border-white/10 py-2 px-4 sm:px-6 lg:px-8 text-xs font-sans text-slate-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Left: SecureIoT AI Brand Logo & Tagline */}
          <div 
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#00646e] to-[#00e5ff] flex items-center justify-center text-white shadow-[0_0_14px_rgba(0,229,255,0.45)] group-hover:scale-105 transition-transform shrink-0">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-black tracking-tight text-white font-sans group-hover:text-[#00e5ff] transition-colors">
                  SecureIoT<span className="text-[#00e5ff] ml-0.5">AI</span>
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 font-mono hidden md:inline">
                  ZERO-TRUST ACTIVE
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-medium hidden sm:block -mt-0.5">
                Adaptive Access Control for Blockchain IoT Networks
              </div>
            </div>
          </div>

          {/* Right: Global Region, Support, Fleet Devices & Operator Log in */}
          <div className="flex items-center gap-4 sm:gap-6 text-slate-300 text-xs font-medium">
            
            {/* Global / Country Selector */}
            <div className="flex items-center gap-1.5 hover:text-white cursor-pointer transition-colors">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">India | EN</span>
            </div>

            {/* Support & Community */}
            <div 
              onClick={onOpenRemixGuide}
              className="hidden md:flex items-center gap-1 hover:text-white cursor-pointer transition-colors"
            >
              <span>Support & community</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </div>

            {/* Fleet Inventory / Cart Icon */}
            <button 
              onClick={() => onNavigate('devices')}
              className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
              title="Monitored Fleet Devices"
            >
              <ShoppingCart className="w-3.5 h-3.5 text-slate-400 hover:text-white" />
              <span className="hidden sm:inline text-[11px] bg-white/10 px-1.5 py-0.5 rounded text-slate-300">
                4 nodes
              </span>
            </button>

            {/* Dashboard Theme Toggle (Soft White / Dark Navy) */}
            {onToggleTheme && currentTab !== 'landing' && currentTab !== 'login' && (
              <button
                onClick={onToggleTheme}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-all text-[11px] font-medium cursor-pointer"
                title={`Switch to ${dashboardTheme === 'light' ? 'Dark Navy' : 'Soft White'} Dashboard`}
              >
                {dashboardTheme === 'light' ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-300" />
                    <span className="hidden md:inline font-mono text-[10px]">Soft White</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-[#00e5ff]" />
                    <span className="hidden md:inline font-mono text-[10px]">Dark Navy</span>
                  </>
                )}
              </button>
            )}

            {/* Log in / Current Operator Profile */}
            {activeUser ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-1.5 py-1 px-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-[#00e5ff]" />
                  <span className="font-semibold text-[11px] truncate max-w-[120px]">{activeUser.name}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 rounded-xl bg-[#001032] border border-white/15 shadow-2xl p-2 divide-y divide-white/10 z-50 animate-in fade-in">
                    <div className="p-2.5">
                      <p className="text-xs font-bold text-white">{activeUser.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{activeUser.email}</p>
                      <div className="mt-1.5 inline-block text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                        OPERATOR: {activeUser.role}
                      </div>
                    </div>
                    <div className="py-1.5 space-y-1">
                      <button
                        onClick={() => { setShowUserMenu(false); onNavigate('login'); }}
                        className="w-full text-left px-2.5 py-1.5 text-xs text-[#00e5ff] hover:bg-white/10 rounded flex items-center gap-2 transition-colors font-medium"
                      >
                        <Lock className="w-3.5 h-3.5 text-[#00e5ff]" />
                        <span>Admin Login / Switch</span>
                      </button>
                      <button
                        onClick={() => { setShowUserMenu(false); onNavigate('admin-dashboard'); }}
                        className="w-full text-left px-2.5 py-1.5 text-xs text-slate-200 hover:bg-white/10 rounded transition-colors"
                      >
                        Central SOC Console
                      </button>
                      <button
                        onClick={() => { setShowUserMenu(false); onNavigate('devices'); }}
                        className="w-full text-left px-2.5 py-1.5 text-xs text-slate-200 hover:bg-white/10 rounded transition-colors"
                      >
                        Connected IoT Fleet
                      </button>
                      <button
                        onClick={() => { setShowUserMenu(false); onOpenRemixGuide(); }}
                        className="w-full text-left px-2.5 py-1.5 text-xs text-slate-200 hover:bg-white/10 rounded transition-colors"
                      >
                        Smart Contract Audit
                      </button>
                    </div>
                    <div className="pt-1.5">
                      <button
                        onClick={() => { setShowUserMenu(false); onLogout(); }}
                        className="w-full text-left px-2.5 py-1.5 text-xs text-rose-400 hover:bg-rose-950/40 rounded flex items-center gap-2 transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button 
                onClick={() => onNavigate('login')}
                className="flex items-center gap-1.5 py-1 px-3 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors text-xs font-semibold"
              >
                <Lock className="w-3 h-3 text-[#00e5ff]" />
                <span>Admin Login</span>
              </button>
            )}

          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECONDARY UTILITY BAR                                                     */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 w-full bg-[#000028] border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-end gap-4">
          
          {/* Right Side: Search, Alert Notifications, and "Launch SOC Console" */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Search Button matching Screenshot 612 */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-white/10 text-slate-300 hover:text-white text-xs transition-colors cursor-pointer"
              aria-label="Search"
            >
              <Search className="w-4 h-4 text-slate-400" />
              <span className="hidden sm:inline">Search</span>
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                aria-label="Alerts"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex items-center justify-center min-w-[16px] h-[16px] text-[9px] font-bold text-white bg-[#00646e] rounded-full px-1 shadow-[0_0_8px_rgba(0,100,110,0.8)]">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-[#001032] border border-white/15 shadow-2xl backdrop-blur-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <div className="p-3 border-b border-white/10 flex items-center justify-between bg-black/40">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-[#00e5ff]" />
                      <span className="text-xs font-bold text-white uppercase tracking-wider">Security Telemetry Alerts</span>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-[11px] text-[#00e5ff] hover:underline"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-white/5">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-400">
                        No active incident notifications.
                      </div>
                    ) : (
                      notifications.map((notif) => {
                        const Icon = 
                          notif.type === 'error' ? XCircle :
                          notif.type === 'warning' ? AlertTriangle :
                          notif.type === 'success' ? CheckCircle2 : Info;
                        
                        const iconColor = 
                          notif.type === 'error' ? 'text-red-400' :
                          notif.type === 'warning' ? 'text-amber-400' :
                          notif.type === 'success' ? 'text-emerald-400' : 'text-[#00e5ff]';

                        return (
                          <div key={notif.id} className={`p-3 text-xs hover:bg-white/5 transition-colors ${!notif.read ? 'bg-[#00646e]/20' : ''}`}>
                            <div className="flex items-start gap-2.5">
                              <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${iconColor}`} />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1 mb-0.5">
                                  <span className="font-semibold text-white truncate">{notif.title}</span>
                                  <span className="text-[10px] text-slate-400 font-mono">{notif.timestamp}</span>
                                </div>
                                <p className="text-slate-300 text-[11px] leading-relaxed">{notif.message}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Admin Login Portal Quick Action */}
            <button
              onClick={() => onNavigate('login')}
              className={`hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-full font-semibold text-xs transition-all border cursor-pointer ${
                currentTab === 'login'
                  ? 'bg-[#00e5ff]/20 text-[#00e5ff] border-[#00e5ff]/60'
                  : 'bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white border-white/15'
              }`}
            >
              <Lock className="w-3.5 h-3.5 text-[#00e5ff]" />
              <span>Admin Login</span>
            </button>

            {/* Primary Action: "Launch SOC Console" Button */}
            <button
              onClick={() => onNavigate('admin-dashboard')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#00646e] hover:bg-[#00828f] text-white font-bold text-xs tracking-wider uppercase transition-all shadow-[0_4px_16px_rgba(0,100,110,0.4)] hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>Launch SOC Console</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-white/10 text-slate-300 lg:hidden"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>
        </div>

        {/* Mobile Flyout Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-[#001032] border-b border-slate-800 px-4 py-4 space-y-3 animate-in slide-in-from-top">
            <button
              onClick={() => { setIsMobileMenuOpen(false); onNavigate('admin-dashboard'); }}
              className="w-full text-left py-2.5 px-3 rounded-lg text-sm font-semibold bg-[#00646e] text-white flex items-center justify-between"
            >
              <span>Launch Central SOC Console</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={() => { setIsMobileMenuOpen(false); onNavigate('login'); }}
              className="w-full text-left py-2 px-3 rounded-lg text-sm font-semibold text-[#00e5ff] hover:bg-white/5 flex items-center gap-2"
            >
              <Lock className="w-4 h-4 text-[#00e5ff]" />
              <span>Admin Login Portal</span>
            </button>
          </div>
        )}
      </header>

      {/* Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-xl bg-[#001032] border border-white/20 rounded-2xl p-4 shadow-2xl text-white">
            <div className="flex items-center gap-3 pb-3 border-b border-white/10">
              <Search className="w-5 h-5 text-[#00e5ff]" />
              <input
                type="text"
                autoFocus
                placeholder="Search cyber capabilities, IoT devices, smart contracts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
              />
              <button 
                onClick={() => setIsSearchOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="pt-3 space-y-1 text-xs text-slate-300">
              <div className="px-2 py-1 text-[10px] uppercase font-mono text-slate-400">Suggested Quick Links</div>
              <button 
                onClick={() => { setIsSearchOpen(false); onNavigate('ai-risk'); }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 flex items-center justify-between"
              >
                <span>AI Risk Assessment Engine</span>
                <span className="text-[10px] text-[#00e5ff] font-mono">Algorithm</span>
              </button>
              <button 
                onClick={() => { setIsSearchOpen(false); onNavigate('devices'); }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 flex items-center justify-between"
              >
                <span>IoT Connected Devices & Access Policies</span>
                <span className="text-[10px] text-[#00e5ff] font-mono">Infrastructure</span>
              </button>
              <button 
                onClick={() => { setIsSearchOpen(false); onNavigate('blockchain'); }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 flex items-center justify-between"
              >
                <span>Blockchain Smart Contract Ledger</span>
                <span className="text-[10px] text-[#00e5ff] font-mono">Solidity</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
