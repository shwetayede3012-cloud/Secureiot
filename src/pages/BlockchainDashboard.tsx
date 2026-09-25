import React, { useState } from 'react';
import { 
  Blocks, 
  Search, 
  Copy, 
  Check, 
  ExternalLink, 
  ShieldCheck, 
  Lock, 
  Cpu, 
  Hash, 
  Clock, 
  Activity, 
  Layers, 
  Filter,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle
} from 'lucide-react';
import { BlockchainTransaction, AccessRequest, ViewTab } from '../types';

interface BlockchainDashboardProps {
  transactions: BlockchainTransaction[];
  accessLogs: AccessRequest[];
  contractAddress: string;
  onOpenRemixGuide: () => void;
  onNavigate: (tab: ViewTab) => void;
}

export const BlockchainDashboard: React.FC<BlockchainDashboardProps> = ({
  transactions,
  accessLogs,
  contractAddress,
  onOpenRemixGuide,
  onNavigate
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedAddr, setCopiedAddr] = useState(false);
  const [selectedTx, setSelectedTx] = useState<BlockchainTransaction | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAddr(true);
    setTimeout(() => setCopiedAddr(false), 2000);
  };

  const filteredTxs = transactions.filter((tx) =>
    tx.transactionHash.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tx.deviceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tx.decision.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const latestBlock = transactions.length > 0 
    ? Math.max(...transactions.map(t => t.blockNumber)) 
    : 18492040;

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-[#001032] border border-white/10 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#000028] border border-white/10 flex items-center justify-center text-[#00e5ff] shadow-[0_0_15px_rgba(0,229,255,0.25)]">
            <Blocks className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                Blockchain Access Ledger
              </h2>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#00646e]/30 text-[#00e5ff] border border-[#00646e] font-bold">
                EVM SIMULATION
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Immutable Solidity smart contract records (<code className="text-[#00e5ff] font-mono">IoTAccessControl.sol</code>)
            </p>
          </div>
        </div>

        <button
          onClick={onOpenRemixGuide}
          className="flex items-center gap-2 px-5 py-3 rounded-full bg-white/10 hover:bg-white/15 text-white border border-white/20 hover:border-white/40 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
        >
          <ExternalLink className="w-3.5 h-3.5 text-[#00e5ff]" />
          <span>Remix Deployment Guide</span>
        </button>
      </div>

      {/* 4 Blockchain Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-[#001032] border border-white/10 shadow-md">
          <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">Target Network</span>
          <div className="text-sm font-bold font-mono text-white mt-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Ethereum EVM / Sepolia</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Chain ID: 11155111</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#001032] border border-white/10 shadow-md">
          <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">Current Block Height</span>
          <div className="text-xl font-black font-mono text-[#00e5ff] mt-1">
            #{latestBlock}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Consensus Finalized</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#001032] border border-white/10 shadow-md">
          <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">Audited Transactions</span>
          <div className="text-xl font-black font-mono text-white mt-1">
            {transactions.length}
          </div>
          <span className="text-[10px] text-emerald-400 mt-1 block">100% Cryptographic Integrity</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#001032] border border-white/10 shadow-md">
          <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">Estimated Gas / Tx</span>
          <div className="text-xl font-black font-mono text-slate-200 mt-1">
            ~42,850 gas
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">LogAccess() Opcode</span>
        </div>

      </div>

      {/* Smart Contract Overview Banner */}
      <div className="p-5 rounded-3xl bg-[#001032] border border-white/10 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold block">
            De-facto Contract Registry
          </span>
          <div className="flex items-center gap-2">
            <code className="text-xs sm:text-sm font-mono text-[#00e5ff] break-all bg-[#000028] px-3 py-1.5 rounded-xl border border-white/10">
              {contractAddress}
            </code>
            <button
              onClick={() => handleCopy(contractAddress)}
              className="p-2 rounded-xl bg-[#00646e] hover:bg-[#00828f] text-white transition-all cursor-pointer"
              title="Copy Contract Address"
            >
              {copiedAddr ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('settings')}
            className="text-xs text-[#00e5ff] hover:underline font-semibold cursor-pointer"
          >
            Configure Custom Address
          </button>
        </div>
      </div>

      {/* Transactions Search and Table */}
      <div className="p-6 rounded-3xl bg-[#001032] border border-white/10 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Blocks className="w-4 h-4 text-[#00e5ff]" />
              <span>Immutable Ledger Records</span>
            </h3>
            <p className="text-xs text-slate-400">
              Every decision produced by the Random Forest model is sealed in a transaction
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by Tx hash, device, status..."
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
                <th className="py-3 px-3.5 rounded-l-lg">Tx Hash</th>
                <th className="py-3 px-3.5">Block</th>
                <th className="py-3 px-3.5">Device ID</th>
                <th className="py-3 px-3.5">Action / Method</th>
                <th className="py-3 px-3.5">Policy Outcome</th>
                <th className="py-3 px-3.5">Gas Used</th>
                <th className="py-3 px-3.5 rounded-r-lg">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {filteredTxs.map((tx) => (
                <tr 
                  key={tx.id}
                  onClick={() => setSelectedTx(tx)}
                  className="hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <td className="py-3 px-3.5 text-[#00e5ff] font-bold">
                    {tx.transactionHash.substring(0, 10)}...{tx.transactionHash.slice(-6)}
                  </td>
                  <td className="py-3 px-3.5 text-white">
                    #{tx.blockNumber}
                  </td>
                  <td className="py-3 px-3.5 text-slate-200">
                    {tx.deviceId}
                  </td>
                  <td className="py-3 px-3.5 text-slate-300">
                    logAccessDecision()
                  </td>
                  <td className="py-3 px-3.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold inline-block ${
                      tx.decision === 'ALLOW' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                      tx.decision === 'LIMITED' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                      'bg-rose-950 text-rose-300 border border-rose-800'
                    }`}>
                      {tx.decision}
                    </span>
                  </td>
                  <td className="py-3 px-3.5 text-slate-400">
                    {tx.gasUsed || 42850}
                  </td>
                  <td className="py-3 px-3.5 text-slate-400 font-sans text-[11px]">
                    {tx.timestamp}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
