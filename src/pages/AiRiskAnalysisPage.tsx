import React, { useState, useEffect } from 'react';
import { 
  BrainCircuit, 
  Sliders, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Sparkles, 
  RotateCcw,
  BarChart3,
  Cpu,
  Layers,
  ShieldCheck
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { AiEngine } from '../services/aiEngine';
import { RiskAnalysisResult } from '../types';

export const AiRiskAnalysisPage: React.FC = () => {
  // 6 Interactive Simulator Sliders
  const [deviceTrust, setDeviceTrust] = useState<number>(85);
  const [failedAttempts, setFailedAttempts] = useState<number>(0);
  const [requestFrequency, setRequestFrequency] = useState<number>(5);
  const [networkAnomaly, setNetworkAnomaly] = useState<number>(8);
  const [timeAnomaly, setTimeAnomaly] = useState<number>(0);
  const [previousBehaviorScore, setPreviousBehaviorScore] = useState<number>(90);
  const [isInferencing, setIsInferencing] = useState<boolean>(false);

  // Feature Importance Data for Chart (Random Forest Gini importance)
  const [featureImportances, setFeatureImportances] = useState([
    { name: 'Device Trust', importance: 32.7, color: '#00e5ff' },
    { name: 'Req. Frequency', importance: 23.1, color: '#00828f' },
    { name: 'Network Anomaly', importance: 15.5, color: '#fbbf24' },
    { name: 'Previous Behavior', importance: 15.0, color: '#10b981' },
    { name: 'Time Anomaly', importance: 13.6, color: '#38bdf8' },
    { name: 'Failed Attempts', importance: 0.1, color: '#f43f5e' },
  ]);

  const [evaluation, setEvaluation] = useState<RiskAnalysisResult>(() => 
    AiEngine.evaluateRisk({
      deviceId: 'SIMULATOR_NODE',
      device_trust: 85,
      failed_attempts: 0,
      request_frequency: 5,
      network_anomaly: 8,
      time_anomaly: 0,
      previous_behavior: 90
    })
  );

  // Fetch actual model feature importances from FastAPI on mount
  useEffect(() => {
    fetch('/api/ai/feature-importances')
      .then(res => res.json())
      .then(data => {
        if (data.feature_importances) {
          const nameMap: Record<string, string> = {
            device_trust: 'Device Trust',
            failed_attempts: 'Failed Attempts',
            request_frequency: 'Req. Frequency',
            network_anomaly: 'Network Anomaly',
            time_anomaly: 'Time Anomaly',
            previous_behavior: 'Previous Behavior'
          };
          const colorMap: Record<string, string> = {
            device_trust: '#00e5ff',
            failed_attempts: '#f43f5e',
            request_frequency: '#00828f',
            network_anomaly: '#fbbf24',
            time_anomaly: '#38bdf8',
            previous_behavior: '#10b981'
          };
          const formatted = Object.entries(data.feature_importances).map(([k, v]) => ({
            name: nameMap[k] || k,
            importance: Math.round(Number(v) * 1000) / 10,
            color: colorMap[k] || '#00e5ff'
          })).sort((a, b) => b.importance - a.importance);
          setFeatureImportances(formatted);
        }
      })
      .catch(() => {});
  }, []);

  // Real-time model inference via API when any of the 6 features change
  useEffect(() => {
    let isCancelled = false;
    setIsInferencing(true);

    AiEngine.analyzeRiskApi({
      deviceId: 'SIMULATOR_NODE',
      device_trust: deviceTrust,
      failed_attempts: failedAttempts,
      request_frequency: requestFrequency,
      network_anomaly: networkAnomaly,
      time_anomaly: timeAnomaly,
      previous_behavior: previousBehaviorScore,
    }).then(result => {
      if (!isCancelled) {
        setEvaluation(result);
        setIsInferencing(false);
      }
    }).catch(() => {
      if (!isCancelled) {
        setIsInferencing(false);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [deviceTrust, failedAttempts, requestFrequency, networkAnomaly, timeAnomaly, previousBehaviorScore]);

  const handleResetDefaults = () => {
    setDeviceTrust(85);
    setFailedAttempts(0);
    setRequestFrequency(5);
    setNetworkAnomaly(8);
    setTimeAnomaly(0);
    setPreviousBehaviorScore(90);
  };

  const handlePresetScenario = (scenario: 'normal' | 'suspicious' | 'attack') => {
    if (scenario === 'normal') {
      // CASE 1: High trust, 0 failed, low freq, low anomaly -> ALLOW
      setDeviceTrust(92);
      setFailedAttempts(0);
      setRequestFrequency(4);
      setNetworkAnomaly(5);
      setTimeAnomaly(0);
      setPreviousBehaviorScore(95);
    } else if (scenario === 'suspicious') {
      // CASE 2: Medium trust, some failed, moderate freq, moderate anomaly -> LIMITED
      setDeviceTrust(55);
      setFailedAttempts(4);
      setRequestFrequency(28);
      setNetworkAnomaly(45);
      setTimeAnomaly(35);
      setPreviousBehaviorScore(60);
    } else {
      // CASE 3: Low trust, many failed, high freq, high anomaly -> DENY
      setDeviceTrust(18);
      setFailedAttempts(9);
      setRequestFrequency(85);
      setNetworkAnomaly(88);
      setTimeAnomaly(76);
      setPreviousBehaviorScore(20);
    }
  };

  const probabilities = evaluation.probabilities || {
    NORMAL: evaluation.decision === 'ALLOW' ? 0.95 : 0.05,
    SUSPICIOUS: evaluation.decision === 'LIMITED' ? 0.85 : 0.10,
    HIGH_RISK: evaluation.decision === 'DENY' ? 0.95 : 0.05,
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="p-6 rounded-3xl bg-[#001032] border border-white/10 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#000028] border border-white/10 flex items-center justify-center text-[#00e5ff] shadow-[0_0_15px_rgba(0,229,255,0.25)]">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#00e5ff] uppercase">Inference Engine</span>
              {isInferencing && (
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800">
                  Computing...
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              AI Risk & Trust Classification Engine
            </h2>
            <p className="text-xs text-slate-300">
              Random Forest behavioral inference model & 6-feature continuous explainability
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePresetScenario('normal')}
            className="px-3.5 py-1.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800 text-xs font-mono font-bold hover:bg-emerald-900 transition-colors cursor-pointer"
          >
            Case 1: Normal
          </button>
          <button
            onClick={() => handlePresetScenario('suspicious')}
            className="px-3.5 py-1.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-800 text-xs font-mono font-bold hover:bg-amber-900 transition-colors cursor-pointer"
          >
            Case 2: Suspicious
          </button>
          <button
            onClick={() => handlePresetScenario('attack')}
            className="px-3.5 py-1.5 rounded-full bg-rose-950/80 text-rose-300 border border-rose-800 text-xs font-mono font-bold hover:bg-rose-900 transition-colors cursor-pointer"
          >
            Case 3: High-Risk
          </button>
        </div>
      </div>

      {/* Synthetic Dataset Notice Badge */}
      <div className="px-4 py-2.5 rounded-2xl bg-[#001844] border border-[#00e5ff]/20 flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#00e5ff]" />
          <span>
            <strong>Simulation Note:</strong> Trained on a 3,000-sample synthetic IoT behavioral dataset using scikit-learn RandomForestClassifier. No physical IoT hardware is claimed.
          </span>
        </div>
        <span className="text-[10px] font-mono text-[#00e5ff] font-bold">
          Policy: 0-30 ALLOW | 31-60 LIMITED | 61-100 DENY
        </span>
      </div>

      {/* Main Interactive Grid: Sliders & Live Decision Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: 6 Feature Sliders */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-[#001032] border border-white/10 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#00e5ff]" />
              <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-white">
                Interactive Feature Parameter Laboratory (6 Model Inputs)
              </h3>
            </div>
            <button
              onClick={handleResetDefaults}
              className="text-xs text-slate-400 hover:text-[#00e5ff] flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>
          </div>

          <div className="space-y-4">
            
            {/* Feature 1: device_trust */}
            <div className="p-4 rounded-2xl bg-[#000028] border border-white/10 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-slate-200">1. device_trust (0 - 100)</span>
                <span className="text-[#00e5ff] font-extrabold">{deviceTrust}/100</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={deviceTrust}
                onChange={(e) => setDeviceTrust(Number(e.target.value))}
                className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-[#00646e]"
              />
              <p className="text-[11px] text-slate-400">
                Cryptographic attestation and historical node credibility index.
              </p>
            </div>

            {/* Feature 2: failed_attempts */}
            <div className="p-4 rounded-2xl bg-[#000028] border border-white/10 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-slate-200">2. failed_attempts (Count)</span>
                <span className="text-rose-400 font-extrabold">{failedAttempts} tries</span>
              </div>
              <input
                type="range"
                min="0"
                max="20"
                value={failedAttempts}
                onChange={(e) => setFailedAttempts(Number(e.target.value))}
                className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-rose-500"
              />
              <p className="text-[11px] text-slate-400">
                Consecutive unauthenticated access attempts in the preceding window.
              </p>
            </div>

            {/* Feature 3: request_frequency */}
            <div className="p-4 rounded-2xl bg-[#000028] border border-white/10 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-slate-200">3. request_frequency (req/min)</span>
                <span className="text-[#00e5ff] font-extrabold">{requestFrequency} req/min</span>
              </div>
              <input
                type="range"
                min="1"
                max="120"
                value={requestFrequency}
                onChange={(e) => setRequestFrequency(Number(e.target.value))}
                className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-[#00828f]"
              />
              <p className="text-[11px] text-slate-400">
                Burst velocity: baseline 1-10 req/min. High bursts trigger rate-limit defense.
              </p>
            </div>

            {/* Feature 4: network_anomaly */}
            <div className="p-4 rounded-2xl bg-[#000028] border border-white/10 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-slate-200">4. network_anomaly (0 - 100%)</span>
                <span className="text-amber-400 font-extrabold">{networkAnomaly}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={networkAnomaly}
                onChange={(e) => setNetworkAnomaly(Number(e.target.value))}
                className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <p className="text-[11px] text-slate-400">
                Measures packet deviation, latency variance, and abnormal payload heuristics.
              </p>
            </div>

            {/* Feature 5: time_anomaly */}
            <div className="p-4 rounded-2xl bg-[#000028] border border-white/10 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-slate-200">5. time_anomaly (0 - 100%)</span>
                <span className="text-sky-300 font-extrabold">{timeAnomaly}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={timeAnomaly}
                onChange={(e) => setTimeAnomaly(Number(e.target.value))}
                className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-sky-500"
              />
              <p className="text-[11px] text-slate-400">
                Measures temporal anomaly (e.g. 0% for scheduled shifts vs 75%+ for dead-of-night anomalies).
              </p>
            </div>

            {/* Feature 6: previous_behavior */}
            <div className="p-4 rounded-2xl bg-[#000028] border border-white/10 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-slate-200">6. previous_behavior (0 - 100)</span>
                <span className="text-emerald-400 font-extrabold">{previousBehaviorScore}/100</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={previousBehaviorScore}
                onChange={(e) => setPreviousBehaviorScore(Number(e.target.value))}
                className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <p className="text-[11px] text-slate-400">
                Historical behavioral compliance rating over the preceding 50 access cycles.
              </p>
            </div>

          </div>
        </div>

        {/* Right 1 Col: Live Recomputed Decision Card & Probabilities */}
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-[#001032] border border-white/10 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#00e5ff]" />
                <span>Random Forest Prediction</span>
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#00646e]/30 text-[#00e5ff] border border-[#00646e]">
                Model: rf_model.joblib
              </span>
            </div>

            {/* Decision Hero Status */}
            <div className={`p-5 rounded-2xl border text-center transition-all ${
              evaluation.decision === 'ALLOW'
                ? 'bg-emerald-950/60 border-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.25)]'
                : evaluation.decision === 'LIMITED'
                ? 'bg-amber-950/60 border-amber-500/60 shadow-[0_0_20px_rgba(245,158,11,0.25)]'
                : 'bg-rose-950/60 border-rose-500/60 shadow-[0_0_20px_rgba(239,68,68,0.25)]'
            }`}>
              <div className="flex justify-center mb-1.5">
                {evaluation.decision === 'ALLOW' && <CheckCircle2 className="w-8 h-8 text-emerald-400" />}
                {evaluation.decision === 'LIMITED' && <AlertTriangle className="w-8 h-8 text-amber-400" />}
                {evaluation.decision === 'DENY' && <XCircle className="w-8 h-8 text-rose-400" />}
              </div>

              <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] uppercase font-mono font-bold tracking-wider mb-1 bg-black/40 text-slate-200 border border-white/10">
                Predicted Class: {evaluation.prediction || (evaluation.decision === 'ALLOW' ? 'NORMAL' : evaluation.decision === 'LIMITED' ? 'SUSPICIOUS' : 'HIGH_RISK')}
              </div>

              <h4 className={`text-xl font-black font-display tracking-wide mt-0.5 ${
                evaluation.decision === 'ALLOW' ? 'text-emerald-400' :
                evaluation.decision === 'LIMITED' ? 'text-amber-400' : 'text-rose-400'
              }`}>
                {evaluation.decision === 'ALLOW' ? 'ALLOW (ACCESS GRANTED)' :
                 evaluation.decision === 'LIMITED' ? 'LIMITED (RESTRICTED ACCESS)' : 'DENY (ACCESS BLOCKED)'}
              </h4>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-3.5 rounded-2xl bg-[#000028] border border-white/10 text-center">
                <span className="text-[10px] text-slate-400 block">Risk Score (0-100):</span>
                <span className={`text-xl font-black ${
                  evaluation.riskScore > 60 ? 'text-rose-400' : evaluation.riskScore > 30 ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {evaluation.riskScore}
                </span>
                <span className="text-[9px] text-slate-500 block mt-0.5">
                  {evaluation.riskScore <= 30 ? '0-30 Range' : evaluation.riskScore <= 60 ? '31-60 Range' : '61-100 Range'}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#000028] border border-white/10 text-center">
                <span className="text-[10px] text-slate-400 block">Trust Score (0-100):</span>
                <span className="text-xl font-black text-[#00e5ff]">
                  {evaluation.trustScore}
                </span>
                <span className="text-[9px] text-slate-500 block mt-0.5">
                  Dynamic Security Posture
                </span>
              </div>
            </div>

            {/* Class Probabilities Progress Breakdown */}
            <div className="p-4 rounded-2xl bg-[#000028] border border-white/10 space-y-2.5">
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#00e5ff] font-bold block">
                Random Forest Class Probabilities:
              </span>
              
              {/* NORMAL Probability */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-emerald-400 font-bold">NORMAL:</span>
                  <span className="text-emerald-300 font-extrabold">{((probabilities.NORMAL || 0) * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 transition-all duration-300" 
                    style={{ width: `${Math.min(100, Math.max(0, (probabilities.NORMAL || 0) * 100))}%` }}
                  />
                </div>
              </div>

              {/* SUSPICIOUS Probability */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-amber-400 font-bold">SUSPICIOUS:</span>
                  <span className="text-amber-300 font-extrabold">{((probabilities.SUSPICIOUS || 0) * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-500 transition-all duration-300" 
                    style={{ width: `${Math.min(100, Math.max(0, (probabilities.SUSPICIOUS || 0) * 100))}%` }}
                  />
                </div>
              </div>

              {/* HIGH_RISK Probability */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-rose-400 font-bold">HIGH_RISK:</span>
                  <span className="text-rose-300 font-extrabold">{((probabilities.HIGH_RISK || 0) * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-rose-500 transition-all duration-300" 
                    style={{ width: `${Math.min(100, Math.max(0, (probabilities.HIGH_RISK || 0) * 100))}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Diagnostic Reason / Explanation */}
            <div className="p-4 rounded-2xl bg-[#000028] border border-white/10 space-y-2">
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#00e5ff] font-bold block">
                Model Decision Explanation:
              </span>
              <p className="text-xs text-slate-200 italic leading-relaxed">
                "{evaluation.reason || evaluation.explanation}"
              </p>
              {evaluation.reasons && evaluation.reasons.length > 0 && (
                <ul className="space-y-1 text-[11px] text-slate-300 pt-1 border-t border-white/10">
                  {evaluation.reasons.map((r, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-[#00e5ff]">•</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

          </div>

          {/* Feature Weights Chart */}
          <div className="p-6 rounded-3xl bg-[#001032] border border-white/10 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#00e5ff]" />
                <span>Random Forest Gini Importance</span>
              </h4>
              <span className="text-[10px] font-mono text-slate-400">scikit-learn</span>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={featureImportances} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                  <XAxis type="number" domain={[0, 45]} tick={{ fontSize: 10, fill: '#94a3b8' }} unit="%" />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} width={95} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#001032', borderColor: '#ffffff20', borderRadius: '12px', fontSize: 12, color: '#fff' }}
                    formatter={(val: any) => [`${val}%`, 'Gini Importance']}
                  />
                  <Bar dataKey="importance" radius={[0, 4, 4, 0]}>
                    {featureImportances.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
