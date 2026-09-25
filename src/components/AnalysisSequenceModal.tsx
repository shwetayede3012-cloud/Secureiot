import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  BrainCircuit, 
  History, 
  ShieldCheck, 
  Sliders, 
  Blocks, 
  FileCheck2, 
  CheckCircle2, 
  Loader2, 
  Sparkles,
  AlertTriangle,
  XCircle,
  Hash,
  ExternalLink,
  ChevronRight,
  X
} from 'lucide-react';
import { AccessRequest, BlockchainTransaction, RiskAnalysisResult, IoTDevice } from '../types';

interface AnalysisSequenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  deviceId: string;
  resource: string;
  reason: string;
  resultData: {
    request: AccessRequest;
    transaction: BlockchainTransaction;
    evalResult: RiskAnalysisResult;
    device: IoTDevice;
  } | null;
  onComplete?: () => void;
}

const STEPS = [
  { id: 1, text: 'Receiving request packet...', icon: Cpu },
  { id: 2, text: 'Analyzing behavioral velocity...', icon: BrainCircuit },
  { id: 3, text: 'Checking prior session trust...', icon: History },
  { id: 4, text: 'Calculating dynamic trust metric...', icon: ShieldCheck },
  { id: 5, text: 'Evaluating Random Forest risk score...', icon: Sliders },
  { id: 6, text: 'Applying zero-trust adaptive policy...', icon: Sparkles },
  { id: 7, text: 'Synthesizing EVM bytecode payload...', icon: Blocks },
  { id: 8, text: 'Committing immutable block record...', icon: FileCheck2 },
];

export const AnalysisSequenceModal: React.FC<AnalysisSequenceModalProps> = ({
  isOpen,
  onClose,
  deviceId,
  resource,
  reason,
  resultData,
  onComplete
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStepIndex(0);
      setIsFinished(false);
      return;
    }

    setCurrentStepIndex(0);
    setIsFinished(false);

    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < STEPS.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setIsFinished(true);
          if (onComplete) onComplete();
          return prev;
        }
      });
    }, 450);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const decision = resultData?.evalResult.decision || 'ALLOW';
  const riskScore = resultData?.evalResult.riskScore ?? 8;
  const trustScore = resultData?.evalResult.trustScore ?? 92;
  const confidence = resultData?.evalResult.confidence ?? 96.5;
  const reasons = resultData?.evalResult.reasons || ['Device behavior conforms to baseline security policy'];
  const txHash = resultData?.transaction.transactionHash || '0x...';
  const blockNum = resultData?.transaction.blockNumber || 18492041;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-[#001032] border border-white/20 rounded-3xl shadow-[0_0_50px_rgba(0,229,255,0.2)] overflow-hidden">
        
        {/* Header Bar */}
        <div className="p-5 border-b border-white/10 bg-[#000028]/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#000028] border border-white/10 flex items-center justify-center text-[#00e5ff] shadow-[0_0_15px_rgba(0,229,255,0.25)]">
              <BrainCircuit className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>AI Adaptive Evaluation Pipeline</span>
                <span className="text-[10px] font-mono text-[#00e5ff] bg-[#00646e]/40 px-2 py-0.5 rounded-full border border-[#00e5ff]/30 font-bold">
                  8-Stage Pipeline
                </span>
              </h3>
              <p className="text-xs text-slate-300">
                Target Node: <strong className="text-[#00e5ff] font-mono">{deviceId}</strong> &bull; Resource: <span className="text-white">{resource}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          
          {/* Active Progress State */}
          {!isFinished ? (
            <div className="space-y-6">
              {/* Radar / Scanning Visualizer */}
              <div className="relative flex flex-col items-center justify-center py-6">
                <div className="relative w-28 h-28 rounded-full border-2 border-[#00e5ff]/30 flex items-center justify-center bg-[#000028] shadow-[0_0_30px_rgba(0,229,255,0.2)]">
                  {/* Rotating scanner beam */}
                  <div className="absolute inset-0 rounded-full border-t-2 border-[#00e5ff] animate-spin" />
                  <div className="w-20 h-20 rounded-full border border-[#00646e]/50 flex items-center justify-center">
                    <Cpu className="w-10 h-10 text-[#00e5ff] animate-pulse" />
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <span className="text-xs font-mono uppercase tracking-widest text-[#00e5ff] font-bold">
                    Stage {currentStepIndex + 1} of 8
                  </span>
                  <p className="text-base font-semibold text-white mt-0.5">
                    {STEPS[currentStepIndex]?.text}
                  </p>
                </div>
              </div>

              {/* 8-Step Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                {STEPS.map((step, idx) => {
                  const isDone = idx < currentStepIndex;
                  const isCurrent = idx === currentStepIndex;
                  const Icon = step.icon;

                  return (
                    <div
                      key={step.id}
                      className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs transition-all border ${
                        isDone
                          ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
                          : isCurrent
                          ? 'bg-[#00646e]/40 border-[#00e5ff] text-white shadow-[0_0_15px_rgba(0,229,255,0.2)] font-semibold scale-[1.02]'
                          : 'bg-[#000028] border-white/10 text-slate-400'
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : isCurrent ? (
                        <Loader2 className="w-4 h-4 text-[#00e5ff] animate-spin shrink-0" />
                      ) : (
                        <Icon className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                      <span className="truncate">{step.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Final Large Decision Panel */
            <div className="space-y-5 animate-in zoom-in-95">
              
              {/* Decision Hero Banner */}
              <div className={`p-6 rounded-2xl border text-center transition-all shadow-xl ${
                decision === 'ALLOW'
                  ? 'bg-emerald-950/70 border-emerald-500/60 shadow-[0_0_30px_rgba(16,185,129,0.25)]'
                  : decision === 'LIMITED'
                  ? 'bg-amber-950/70 border-amber-500/60 shadow-[0_0_30px_rgba(245,158,11,0.25)]'
                  : 'bg-rose-950/70 border-rose-500/60 shadow-[0_0_30px_rgba(239,68,68,0.25)]'
              }`}>
                <div className="flex justify-center mb-2">
                  {decision === 'ALLOW' && (
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400/60 flex items-center justify-center text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                  )}
                  {decision === 'LIMITED' && (
                    <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-400/60 flex items-center justify-center text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.4)]">
                      <AlertTriangle className="w-7 h-7" />
                    </div>
                  )}
                  {decision === 'DENY' && (
                    <div className="w-12 h-12 rounded-full bg-rose-500/20 border border-rose-400/60 flex items-center justify-center text-rose-300 shadow-[0_0_20px_rgba(239,68,68,0.4)]">
                      <XCircle className="w-7 h-7" />
                    </div>
                  )}
                </div>

                <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-slate-300">
                  Adaptive Policy Output
                </span>
                
                <h2 className={`text-2xl sm:text-3xl font-black font-display tracking-wide mt-0.5 ${
                  decision === 'ALLOW' ? 'text-emerald-400' :
                  decision === 'LIMITED' ? 'text-amber-400' : 'text-rose-400'
                }`}>
                  {decision === 'ALLOW' ? 'ACCESS GRANTED' :
                   decision === 'LIMITED' ? 'LIMITED ACCESS' : 'ACCESS DENIED'}
                </h2>

                <p className="text-xs text-slate-300 mt-1 max-w-md mx-auto">
                  {decision === 'ALLOW' 
                    ? 'Device cleared for full operational interaction with target resource.'
                    : decision === 'LIMITED'
                    ? 'Restricted telemetry access granted with enhanced auditing enabled.'
                    : 'Access rejected. Device flagged for anomalous risk behavior.'}
                </p>
              </div>

              {/* 4 Metrics Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-[#000028] border border-white/10 text-center">
                  <span className="text-[10px] uppercase font-mono text-slate-400 font-bold">Trust Score</span>
                  <div className="text-xl font-bold font-mono text-[#00e5ff] mt-0.5">
                    {trustScore}<span className="text-xs text-slate-400">/100</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#000028] border border-white/10 text-center">
                  <span className="text-[10px] uppercase font-mono text-slate-400 font-bold">Risk Score</span>
                  <div className={`text-xl font-bold font-mono mt-0.5 ${
                    riskScore <= 30 ? 'text-emerald-400' : riskScore <= 60 ? 'text-amber-400' : 'text-rose-400'
                  }`}>
                    {riskScore}<span className="text-xs text-slate-400">/100</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#000028] border border-white/10 text-center">
                  <span className="text-[10px] uppercase font-mono text-slate-400 font-bold">Risk Level</span>
                  <div className={`text-sm font-bold font-mono mt-1 ${
                    riskScore <= 30 ? 'text-emerald-400' : riskScore <= 60 ? 'text-amber-400' : 'text-rose-400'
                  }`}>
                    {riskScore <= 30 ? 'LOW' : riskScore <= 60 ? 'MEDIUM' : 'HIGH'}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#000028] border border-white/10 text-center">
                  <span className="text-[10px] uppercase font-mono text-slate-400 font-bold">AI Confidence</span>
                  <div className="text-xl font-bold font-mono text-white mt-0.5">
                    {confidence}%
                  </div>
                </div>
              </div>

              {/* Explainability reasons */}
              <div className="p-4 rounded-2xl bg-[#000028] border border-white/10 space-y-2">
                <div className="flex items-center gap-2">
                  <BrainCircuit className="w-4 h-4 text-[#00e5ff]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-white">
                    Why was this decision made?
                  </span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {reasons.map((r, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#00e5ff] mt-0.5">•</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Blockchain Receipt */}
              <div className="p-4 rounded-2xl bg-[#000028] border border-[#00646e]/50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Blocks className="w-4 h-4 text-[#00e5ff]" />
                    <span className="text-xs font-bold text-white">Smart Contract Ledger Receipt</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#00646e]/30 text-[#00e5ff] border border-[#00646e] font-bold">
                    EVM SIMULATION
                  </span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="p-2.5 rounded-xl bg-[#001032] border border-white/10">
                    <span className="text-slate-400 block text-[10px]">Tx Hash:</span>
                    <span className="text-[#00e5ff] truncate block">{txHash}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#001032] border border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Block Number:</span>
                      <span className="text-white font-bold">#{blockNum}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Gas Used:</span>
                      <span className="text-slate-300">68,420</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={onClose}
                  className="px-6 py-3 rounded-full bg-[#00646e] hover:bg-[#00828f] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-[0_4px_16px_rgba(0,100,110,0.4)] cursor-pointer"
                >
                  Confirm & View Audit Record
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
