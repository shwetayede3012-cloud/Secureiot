import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Blocks, 
  RotateCcw, 
  Save, 
  Check, 
  Download, 
  Sliders, 
  ShieldCheck, 
  ExternalLink,
  Cpu,
  Sun,
  Moon,
  Palette
} from 'lucide-react';
import { StorageService } from '../services/storageService';

interface SettingsPageProps {
  contractAddress: string;
  onUpdateContractAddress: (addr: string) => void;
  onResetData: () => void;
  onOpenRemixGuide: () => void;
  dashboardTheme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  contractAddress,
  onUpdateContractAddress,
  onResetData,
  onOpenRemixGuide,
  dashboardTheme = 'light',
  onToggleTheme
}) => {
  const [address, setAddress] = useState(contractAddress);
  const [rpcUrl, setRpcUrl] = useState('https://rpc.sepolia.org');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateContractAddress(address);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleExportData = () => {
    const data = {
      devices: StorageService.getDevices(),
      accessLogs: StorageService.getAccessLogs(),
      transactions: StorageService.getBlockchainTxs(),
      users: StorageService.getUsers(),
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `secureiot-simulation-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="p-6 rounded-3xl bg-[#001032] border border-white/10 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#000028] border border-white/10 flex items-center justify-center text-[#00e5ff] shadow-[0_0_15px_rgba(0,229,255,0.25)]">
            <SettingsIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#00e5ff] uppercase">Core Gateway</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              System Configuration & Gateway Settings
            </h2>
            <p className="text-xs text-slate-300">
              Configure smart contract endpoints, local simulation parameters, and fleet backups
            </p>
          </div>
        </div>
      </div>

      {/* Dashboard Appearance & Workspace Theme Selector */}
      {onToggleTheme && (
        <div className="p-6 rounded-3xl bg-[#001032] border border-white/10 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-[#00e5ff]" />
              <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-white">
                Dashboard Workspace Appearance
              </h3>
            </div>
            <span className="text-[11px] text-[#00e5ff] font-mono font-semibold">
              Current: {dashboardTheme === 'light' ? 'Soft White Slate' : 'Dark Navy Cyber'}
            </span>
          </div>

          <p className="text-xs text-slate-300 mb-4 leading-relaxed">
            Choose the visual environment for your inner security dashboard. Soft White provides high contrast for daytime analytics and data audits, while Dark Navy offers a deep cyber operations look.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => {
                if (dashboardTheme !== 'light') onToggleTheme();
              }}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                dashboardTheme === 'light'
                  ? 'bg-white border-[#00646e] shadow-lg ring-2 ring-[#00646e]/40'
                  : 'bg-[#000028] border-white/10 hover:border-white/30'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Sun className={`w-4 h-4 ${dashboardTheme === 'light' ? 'text-amber-500' : 'text-slate-400'}`} />
                  <span className={`text-xs font-bold ${dashboardTheme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                    Soft White Slate (Active Default)
                  </span>
                </div>
                {dashboardTheme === 'light' && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                    Active
                  </span>
                )}
              </div>
              <p className={`text-[11px] leading-relaxed ${dashboardTheme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                Clean, pleasant off-white background with crisp cards, optimized readability, and vibrant status pills.
              </p>
            </button>

            <button
              type="button"
              onClick={() => {
                if (dashboardTheme !== 'dark') onToggleTheme();
              }}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                dashboardTheme === 'dark'
                  ? 'bg-[#001032] border-[#00e5ff] shadow-lg ring-2 ring-[#00e5ff]/40'
                  : 'bg-[#000028] border-white/10 hover:border-white/30'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Moon className={`w-4 h-4 ${dashboardTheme === 'dark' ? 'text-[#00e5ff]' : 'text-slate-400'}`} />
                  <span className="text-xs font-bold text-white">
                    Dark Navy Cyber
                  </span>
                </div>
                {dashboardTheme === 'dark' && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#00646e] text-white font-bold">
                    Active
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Industrial deep midnight navy (#000028) canvas matching the landing page network nodes aesthetic.
              </p>
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Blockchain Connection Settings */}
        <div className="p-6 rounded-3xl bg-[#001032] border border-white/10 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-white flex items-center gap-2">
              <Blocks className="w-4 h-4 text-[#00e5ff]" />
              <span>Smart Contract & RPC Endpoints</span>
            </h3>

            <button
              onClick={onOpenRemixGuide}
              className="text-[11px] text-[#00e5ff] hover:underline flex items-center gap-1 cursor-pointer font-semibold"
            >
              <span>Remix Guide</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1 font-mono">
                Active IoTAccessControl Contract Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="0x..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#000028] border border-white/15 text-[#00e5ff] font-mono focus:border-[#00646e] outline-none"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Target Ethereum address for <code className="text-[#00e5ff]">recordAccess()</code> transactions.
              </p>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1 font-mono">
                EVM JSON-RPC Node URL
              </label>
              <input
                type="text"
                value={rpcUrl}
                onChange={(e) => setRpcUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#000028] border border-white/15 text-slate-200 font-mono focus:border-[#00646e] outline-none"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Supports Sepolia, Hardhat, Ganache, or Infura/Alchemy endpoints.
              </p>
            </div>

            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#00646e] hover:bg-[#00828f] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
            >
              {saved ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
              <span>{saved ? 'Saved Successfully' : 'Update Connection'}</span>
            </button>
          </form>
        </div>

        {/* Database & Fleet Simulation Controls */}
        <div className="p-6 rounded-3xl bg-[#001032] border border-white/10 shadow-xl space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-white border-b border-white/10 pb-3 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#00e5ff]" />
            <span>Simulation State & Persistence Management</span>
          </h3>

          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-[#000028] border border-white/10 space-y-2">
              <span className="font-bold text-white block">Export Simulation Ledger</span>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                Download a complete JSON snapshot containing all simulated IoT devices, risk assessments, and blockchain hashes.
              </p>
              <button
                onClick={handleExportData}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white/15 text-white border border-white/10 text-xs font-bold transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#00e5ff]" />
                <span>Export JSON Snapshot</span>
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-900/40 space-y-2">
              <span className="font-bold text-rose-300 block">Factory Reset Baseline</span>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                Purge current simulation mutations and reset all IoT devices, access logs, and blockchain transactions back to original demo values.
              </p>
              <button
                onClick={onResetData}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800 text-xs font-bold transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Simulation Database</span>
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
