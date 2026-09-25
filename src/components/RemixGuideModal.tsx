import React, { useState } from 'react';
import { 
  Blocks, 
  Copy, 
  Check, 
  ExternalLink, 
  X, 
  Code2, 
  ChevronRight, 
  Terminal,
  ShieldAlert,
  Sparkles
} from 'lucide-react';

interface RemixGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  contractAddress: string;
  onUpdateContractAddress: (addr: string) => void;
}

const SOLIDITY_CONTRACT_CODE = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IoTAccessControl
 * @dev Smart Contract for recording and auditing adaptive access decisions
 *      for IoT devices in an AI-Driven Access Control System.
 *      Compatible with Remix IDE and EVM-compatible blockchains.
 */
contract IoTAccessControl {
    
    enum Decision { DENY, LIMITED, ALLOW }

    struct AccessLog {
        uint256 id;
        string deviceId;
        string resource;
        uint256 riskScore;
        uint256 trustScore;
        Decision decision;
        string reason;
        uint256 timestamp;
        address recordedBy;
    }

    address public owner;
    uint256 public logCounter;
    mapping(uint256 => AccessLog) public accessLogs;
    mapping(string => uint256[]) private deviceLogs;

    event AccessRecorded(
        uint256 indexed id,
        string indexed deviceId,
        string resource,
        uint256 riskScore,
        uint256 trustScore,
        Decision decision,
        uint256 timestamp,
        address indexed recordedBy
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this operation");
        _;
    }

    constructor() {
        owner = msg.sender;
        logCounter = 0;
    }

    function recordAccess(
        string memory _deviceId,
        string memory _resource,
        uint256 _riskScore,
        uint256 _trustScore,
        Decision _decision,
        string memory _reason
    ) public returns (uint256) {
        logCounter++;
        
        accessLogs[logCounter] = AccessLog({
            id: logCounter,
            deviceId: _deviceId,
            resource: _resource,
            riskScore: _riskScore,
            trustScore: _trustScore,
            decision: _decision,
            reason: _reason,
            timestamp: block.timestamp,
            recordedBy: msg.sender
        });

        deviceLogs[_deviceId].push(logCounter);

        emit AccessRecorded(
            logCounter,
            _deviceId,
            _resource,
            _riskScore,
            _trustScore,
            _decision,
            block.timestamp,
            msg.sender
        );

        return logCounter;
    }

    function getDeviceLogCount(string memory _deviceId) public view returns (uint256) {
        return deviceLogs[_deviceId].length;
    }

    function getLatestLog(uint256 _logId) public view returns (AccessLog memory) {
        require(_logId > 0 && _logId <= logCounter, "Log ID out of bounds");
        return accessLogs[_logId];
    }
}`;

export const RemixGuideModal: React.FC<RemixGuideModalProps> = ({
  isOpen,
  onClose,
  contractAddress,
  onUpdateContractAddress
}) => {
  const [copied, setCopied] = useState(false);
  const [inputAddress, setInputAddress] = useState(contractAddress);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(SOLIDITY_CONTRACT_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputAddress.startsWith('0x') && inputAddress.length === 42) {
      onUpdateContractAddress(inputAddress);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-3xl bg-[#001032] border border-white/20 rounded-3xl shadow-[0_0_60px_rgba(0,229,255,0.2)] overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="p-5 border-b border-white/10 bg-[#000028]/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#000028] border border-white/10 flex items-center justify-center text-[#00e5ff] shadow-[0_0_15px_rgba(0,229,255,0.25)]">
              <Blocks className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display">
                Remix IDE & Ethereum Smart Contract Integration
              </h3>
              <p className="text-xs text-slate-300">
                Deploy <code className="text-[#00e5ff] font-mono">contracts/IoTAccessControl.sol</code> to Remix VM or Sepolia Testnet
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300">
          
          {/* Security Notice */}
          <div className="p-4 rounded-2xl bg-[#000028] border border-amber-800/40 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed text-slate-300">
              <strong className="text-amber-300">Academic & Security Notice:</strong> The system defaults to <strong>Simulation Mode</strong>. When running without an external RPC node, transactions are cryptographically simulated and clearly labeled. <em>Never expose private blockchain keys in frontend code</em>.
            </div>
          </div>

          {/* 10-Step Remix Deployment Walkthrough */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-mono flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#00e5ff]" />
              <span>10-Step Remix Deployment Procedure</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {[
                { step: 1, title: 'Open Remix IDE', desc: 'Navigate to remix.ethereum.org in your web browser.' },
                { step: 2, title: 'Create IoTAccessControl.sol', desc: 'In contracts/ folder, click create new file named IoTAccessControl.sol.' },
                { step: 3, title: 'Paste Contract Code', desc: 'Copy the Solidity code provided below and paste into the editor.' },
                { step: 4, title: 'Select Solidity Compiler', desc: 'Choose compiler version 0.8.20 or 0.8.24 in the left tab.' },
                { step: 5, title: 'Compile Contract', desc: 'Click "Compile IoTAccessControl.sol" (Ctrl+S / Cmd+S).' },
                { step: 6, title: 'Deploy using Remix VM', desc: 'Select environment: "Remix VM (Shanghai)" or "Injected Provider - MetaMask".' },
                { step: 7, title: 'Test recordAccess()', desc: 'Execute recordAccess() with ("CCTV_01", "Camera", 8, 92, 2, "Normal").' },
                { step: 8, title: 'Copy Deployed Address', desc: 'Under Deployed Contracts, copy the generated 0x address.' },
                { step: 9, title: 'Configure App Address', desc: 'Paste your address into the input field below or CONTRACT_ADDRESS in .env.' },
                { step: 10, title: 'Connect with ethers.js', desc: 'Frontend will seamlessly bind to your live deployed smart contract!' },
              ].map(item => (
                <div key={item.step} className="p-3.5 rounded-2xl bg-[#000028] border border-white/10 flex items-start gap-2.5 shadow-sm">
                  <span className="w-6 h-6 rounded-full bg-[#00646e] text-white font-mono font-bold flex items-center justify-center text-[10px] shrink-0">
                    {item.step}
                  </span>
                  <div>
                    <h5 className="font-semibold text-white">{item.title}</h5>
                    <p className="text-[11px] text-slate-400 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Copy Contract Code */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5 font-mono">
                <Code2 className="w-4 h-4 text-[#00e5ff]" />
                <span>contracts/IoTAccessControl.sol (Solidity ^0.8.20)</span>
              </span>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#00646e] hover:bg-[#00828f] text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Contract Code'}</span>
              </button>
            </div>

            <div className="relative rounded-2xl bg-[#000028] border border-white/10 p-3.5 max-h-48 overflow-y-auto font-mono text-[11px] text-[#00e5ff]">
              <pre>{SOLIDITY_CONTRACT_CODE}</pre>
            </div>
          </div>

          {/* Contract Address Configuration Form */}
          <form onSubmit={handleSaveAddress} className="p-4 rounded-2xl bg-[#000028] border border-white/10 space-y-3">
            <label className="block text-xs font-semibold text-white font-mono">
              Update Active Contract Address (Ethers.js Target):
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={inputAddress}
                onChange={(e) => setInputAddress(e.target.value)}
                placeholder="0x..."
                className="flex-1 px-3.5 py-2 rounded-xl bg-[#001032] border border-white/15 text-xs font-mono text-[#00e5ff] focus:outline-none focus:border-[#00646e]"
              />
              <button
                type="submit"
                className="px-5 py-2 rounded-full bg-[#00646e] hover:bg-[#00828f] text-white font-bold text-xs uppercase tracking-wide transition-colors shrink-0 cursor-pointer shadow-sm"
              >
                Save Address
              </button>
            </div>
            {savedSuccess && (
              <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>Contract address saved! Ethers.js integration active.</span>
              </p>
            )}
          </form>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-[#000028] flex items-center justify-between">
          <a
            href="https://remix.ethereum.org"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-xs text-[#00e5ff] hover:underline transition-colors font-semibold"
          >
            <span>Launch Remix IDE Online</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs font-bold cursor-pointer border border-white/10"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
