import React, { useState, useEffect } from 'react';
import { 
  Play, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Loader2, 
  RotateCcw, 
  X, 
  ArrowRight, 
  ShieldCheck, 
  BrainCircuit, 
  Blocks,
  Activity
} from 'lucide-react';
import { StorageService } from '../services/storageService';
import { IoTDevice, AccessDecision } from '../types';

interface AutomatedDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataChanged: () => void;
}

interface DemoStep {
  stepNumber: number;
  title: string;
  description: string;
  targetDevice: string;
  activityType: 'NORMAL' | 'SUSPICIOUS' | 'HIGH_RISK' | 'NORMAL_RESTORE';
  expectedTrust: number;
  expectedRisk: number;
  expectedDecision: AccessDecision;
  why: string;
}

const DEMO_STEPS: DemoStep[] = [
  {
    stepNumber: 1,
    title: 'STEP 1: Normal Operational Baseline',
    description: 'CCTV_01 requests Security Dashboard. Standard request frequency and low network jitter.',
    targetDevice: 'CCTV_01',
    activityType: 'NORMAL',
    expectedTrust: 92,
    expectedRisk: 8,
    expectedDecision: 'ALLOW',
    why: 'Low failed requests (0), normal request rate (4.2 req/min), baseline telemetry verified.'
  },
  {
    stepNumber: 2,
    title: 'STEP 2: Suspicious Activity Spike',
    description: 'CCTV_01 generates suspicious activity. Failed authentication attempts elevate.',
    targetDevice: 'CCTV_01',
    activityType: 'SUSPICIOUS',
    expectedTrust: 55,
    expectedRisk: 45,
    expectedDecision: 'LIMITED',
    why: 'Failed requests increase to 4, network anomaly rises to 46.0%, frequency elevates to 28.0 req/min.'
  },
  {
    stepNumber: 3,
    title: 'STEP 3: High-Risk Anomalous Attack',
    description: 'CCTV_01 exhibits severe anomaly pattern indicative of malicious botnet / firmware takeover.',
    targetDevice: 'CCTV_01',
    activityType: 'HIGH_RISK',
    expectedTrust: 18,
    expectedRisk: 82,
    expectedDecision: 'DENY',
    why: 'Severe network anomaly (86.0%), flood rate (88.0 req/min), 10 consecutive failed attempts.'
  },
  {
    stepNumber: 4,
    title: 'STEP 4: Adaptive Recovery & Stabilization',
    description: 'Firmware reset and anomaly scrubbing complete. Device telemetry returns to baseline.',
    targetDevice: 'CCTV_01',
    activityType: 'NORMAL_RESTORE',
    expectedTrust: 89,
    expectedRisk: 11,
    expectedDecision: 'ALLOW',
    why: 'Telemetry stabilized, failed attempts zeroed, trust score rebounds to approved operational bounds.'
  }
];

export const AutomatedDemoModal: React.FC<AutomatedDemoModalProps> = ({
  isOpen,
  onClose,
  onDataChanged
}) => {
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(-1);
  const [isRunning, setIsRunning] = useState(false);
  const [stepStatuses, setStepStatuses] = useState<('pending' | 'running' | 'completed')[]>([
    'pending', 'pending', 'pending', 'pending'
  ]);
  const [stepResults, setStepResults] = useState<any[]>([]);

  if (!isOpen) return null;

  const executeStep = async (index: number) => {
    const step = DEMO_STEPS[index];
    
    // Update step status
    setStepStatuses(prev => {
      const copy = [...prev];
      copy[index] = 'running';
      return copy;
    });

    // Simulate activity on device
    const actType = step.activityType === 'NORMAL_RESTORE' ? 'NORMAL' : step.activityType;
    StorageService.simulateDeviceActivity('CCTV_01', actType);

    // Process actual access request
    const result = await StorageService.processAccessRequest(
      'usr_admin',
      'Chief Security Officer',
      'CCTV_01',
      'Security Dashboard',
      `Automated Demo Simulation - ${step.title}`
    );

    setStepResults(prev => [...prev, result]);
    setStepStatuses(prev => {
      const copy = [...prev];
      copy[index] = 'completed';
      return copy;
    });

    onDataChanged();
  };

  const startAutomatedDemo = async () => {
    setIsRunning(true);
    setStepResults([]);
    setStepStatuses(['pending', 'pending', 'pending', 'pending']);

    for (let i = 0; i < DEMO_STEPS.length; i++) {
      setCurrentStepIdx(i);
      await executeStep(i);
      // Wait 1.4s between steps for visual inspection
      if (i < DEMO_STEPS.length - 1) {
        await new Promise(r => setTimeout(r, 1400));
      }
    }

    setIsRunning(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-3xl bg-[#081022] border border-cyan-500/40 rounded-2xl shadow-[0_0_60px_rgba(6,182,212,0.25)] overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-[#0c162e] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100 font-display flex items-center gap-2">
                <span>Automated Adaptive Access Control Demonstration</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/50">
                  Viva Scenario
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Demonstrating dynamic permission shift: <strong>ALLOW &rarr; LIMITED &rarr; DENY &rarr; ALLOW</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isRunning}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          
          {/* Action Trigger Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/40 via-blue-950/30 to-purple-950/40 border border-cyan-800/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider font-mono">
                Project Demonstration Engine
              </h4>
              <p className="text-xs text-slate-300 mt-1 max-w-lg leading-relaxed">
                Executes the complete academic scenario described in the requirements: watch CCTV_01 behavior change dynamically in real-time, computing new trust/risk scores and registering immutable blockchain records.
              </p>
            </div>

            <button
              onClick={startAutomatedDemo}
              disabled={isRunning}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-xs tracking-wider transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] disabled:opacity-60 shrink-0 cursor-pointer"
            >
              {isRunning ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Executing Simulation...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>Start 4-Step Simulation</span>
                </>
              )}
            </button>
          </div>

          {/* 4 Interactive Step Cards */}
          <div className="space-y-3">
            {DEMO_STEPS.map((step, idx) => {
              const status = stepStatuses[idx];
              const result = stepResults[idx];
              const isCurrent = currentStepIdx === idx && isRunning;

              return (
                <div
                  key={step.stepNumber}
                  className={`p-4 rounded-xl border transition-all ${
                    status === 'completed'
                      ? 'bg-slate-900/80 border-cyan-800/50 shadow-md'
                      : isCurrent
                      ? 'bg-cyan-950/40 border-cyan-500/70 shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                      : 'bg-slate-950/40 border-slate-800/60 opacity-80'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0 ${
                        status === 'completed'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : isCurrent
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 animate-pulse'
                          : 'bg-slate-900 text-slate-400 border border-slate-800'
                      }`}>
                        {status === 'completed' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : isCurrent ? (
                          <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                        ) : (
                          step.stepNumber
                        )}
                      </div>

                      <div>
                        <h5 className="text-xs font-bold text-slate-100 flex items-center gap-2">
                          <span>{step.title}</span>
                          {status === 'completed' && (
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                              SUCCESS
                            </span>
                          )}
                        </h5>
                        <p className="text-xs text-slate-300 mt-0.5">{step.description}</p>
                      </div>
                    </div>

                    {/* Decision Badge */}
                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-mono text-slate-400 block">Adaptive Decision:</span>
                      <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-extrabold font-mono mt-0.5 ${
                        step.expectedDecision === 'ALLOW' 
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/60'
                          : step.expectedDecision === 'LIMITED'
                          ? 'bg-amber-950/80 text-amber-300 border border-amber-700/60'
                          : 'bg-red-950/80 text-red-300 border border-red-700/60'
                      }`}>
                        {step.expectedDecision === 'ALLOW' ? 'ALLOW' : step.expectedDecision === 'LIMITED' ? 'LIMITED ACCESS' : 'DENY'}
                      </span>
                    </div>
                  </div>

                  {/* Metrics Bar & Explainability */}
                  <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] font-mono">
                    <div className="flex items-center justify-between p-2 rounded bg-slate-950/60 border border-slate-800">
                      <span className="text-slate-400">Target Trust:</span>
                      <span className="font-bold text-cyan-300">
                        {result ? `${result.evalResult.trustScore}/100` : `~${step.expectedTrust}`}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded bg-slate-950/60 border border-slate-800">
                      <span className="text-slate-400">Target Risk:</span>
                      <span className={`font-bold ${
                        step.expectedRisk <= 30 ? 'text-emerald-400' : step.expectedRisk <= 60 ? 'text-amber-400' : 'text-red-400'
                      }`}>
                        {result ? `${result.evalResult.riskScore}/100` : `~${step.expectedRisk}`}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded bg-slate-950/60 border border-slate-800">
                      <span className="text-slate-400">Blockchain Block:</span>
                      <span className="text-indigo-300">
                        {result ? `#${result.transaction.blockNumber}` : 'Pending Mining'}
                      </span>
                    </div>
                  </div>

                  <p className="mt-2 text-[11px] text-slate-400 italic">
                    <strong className="text-slate-300 not-italic">AI Reasoning: </strong>
                    {step.why}
                  </p>
                </div>
              );
            })}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#0a1224] flex items-center justify-between">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Real-time persistence active. Check Blockchain Logs & Analytics.</span>
          </div>

          <button
            onClick={onClose}
            disabled={isRunning}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold disabled:opacity-50"
          >
            Close Window
          </button>
        </div>

      </div>
    </div>
  );
};
