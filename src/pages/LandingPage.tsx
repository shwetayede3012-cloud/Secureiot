import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  BrainCircuit, 
  Blocks, 
  ArrowRight, 
  Lock, 
  KeyRound,
  Play, 
  ChevronRight, 
  X, 
  Activity, 
  Sliders, 
  CheckCircle2, 
  Layers, 
  Home, 
  ExternalLink,
  ShieldAlert,
  Server,
  Database,
  Radio,
  FileCheck2,
  AlertTriangle,
  Zap,
  Terminal
} from 'lucide-react';
import { ViewTab } from '../types';

// High-resolution corporate imagery matching project presentation standards
import heroSocOperatorImg from '../assets/images/soc_operator_hero_1790087408107.jpg';
import whySecurityMonitoringImg from '../assets/images/soc_monitoring_room_1790087434254.jpg';
import capExtendImg from '../assets/images/cap_extend_team_1790087453011.jpg';
import capCollaborateImg from '../assets/images/cap_collaborate_1790087470687.jpg';
import capFieldUpgradeImg from '../assets/images/cap_field_upgrade_1790087510251.jpg';

interface LandingPageProps {
  onNavigate: (tab: ViewTab) => void;
  onRunSimulationDemo: () => void;
  onOpenRemixGuide: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigate,
  onRunSimulationDemo,
  onOpenRemixGuide
}) => {
  const [isAdvisoryCardVisible, setIsAdvisoryCardVisible] = useState(true);

  return (
    <div className="relative z-10 w-full min-h-screen text-slate-800 flex flex-col bg-white selection:bg-[#00646e] selection:text-white font-sans">
      
      {/* ========================================================================= */}
      {/* BREADCRUMB NAVIGATION                                                     */}
      {/* ========================================================================= */}
      <div className="w-full bg-[#000028] border-b border-white/10 py-2.5 px-4 sm:px-6 lg:px-8 text-xs text-slate-300">
        <div className="max-w-7xl mx-auto flex items-center gap-2 font-medium">
          <button 
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span className="sr-only">Home</span>
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          <span className="hover:text-white cursor-pointer" onClick={() => onNavigate('landing')}>
            SecureIoT AI Platform
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-white font-semibold">Adaptive Access Control for Blockchain IoT</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* HERO SECTION: SecureIoT AI Project Overview                               */}
      {/* ========================================================================= */}
      <section className="relative w-full bg-[#000028] text-white border-b border-slate-800 overflow-hidden">
        {/* Subtle ambient corporate blue glow */}
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#00646e]/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute -bottom-24 left-10 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Column: Project Identity & Narrative */}
            <div className="lg:col-span-6 flex flex-col justify-center">
              
              {/* Badge Tag */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00646e]/20 border border-[#00e5ff]/30 text-[#00e5ff] text-xs font-mono font-semibold mb-4 w-fit">
                <span className="w-2 h-2 rounded-full bg-[#00e5ff] animate-pulse" />
                <span>AUTONOMOUS ZERO-TRUST DEFENSE SYSTEM</span>
              </div>

              {/* Bold Project Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
                SecureIoT<span className="text-[#00e5ff]">AI</span>
              </h1>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-200 mt-2 tracking-normal">
                Adaptive Access Control for Blockchain IoT Networks
              </h2>

              {/* Lead Narrative */}
              <p className="mt-4 text-base sm:text-lg text-slate-200 leading-relaxed font-normal">
                An intelligent cybersecurity architecture combining continuous Random Forest machine learning risk classification, sub-second zero-trust policy decisions, and tamper-evident Ethereum blockchain smart contract ledgers.
              </p>

              {/* Project Core Features Highlight */}
              <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="text-xs font-mono uppercase tracking-widest text-[#00e5ff] font-bold">
                  Dynamic 3-Tier Policy Governance
                </div>
                <div className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Evaluates 6 telemetry vectors in &lt; 0.02s &bull; Generates instant <span className="text-emerald-400 font-semibold font-mono">ALLOW</span>, <span className="text-amber-400 font-semibold font-mono">LIMITED</span>, or <span className="text-rose-400 font-semibold font-mono">DENY</span> decisions &bull; Commits immutable cryptographic hashes to the blockchain.
                </div>
              </div>

              {/* Primary Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
                <button
                  onClick={() => onNavigate('admin-dashboard')}
                  className="flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-[#00646e] hover:bg-[#00828f] text-white font-bold text-xs sm:text-sm tracking-wide uppercase transition-all shadow-[0_4px_20px_rgba(0,100,110,0.4)] hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <Lock className="w-4 h-4 text-[#00e5ff]" />
                  <span>Launch SOC Console</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>

                <button
                  onClick={() => onNavigate('login')}
                  className="flex items-center gap-2 px-5 py-3.5 rounded-full bg-white/10 hover:bg-white/15 text-white border border-white/20 hover:border-white/40 font-semibold text-xs sm:text-sm tracking-wide transition-all hover:scale-105 cursor-pointer"
                >
                  <KeyRound className="w-4 h-4 text-[#00e5ff]" />
                  <span>Admin Sign In</span>
                </button>

                <button
                  onClick={() => onNavigate('ai-risk')}
                  className="flex items-center gap-2 px-5 py-3.5 rounded-full bg-white/10 hover:bg-white/15 text-white border border-white/20 hover:border-white/40 font-semibold text-xs sm:text-sm tracking-wide transition-all hover:scale-105 cursor-pointer"
                >
                  <BrainCircuit className="w-4 h-4 text-[#00e5ff]" />
                  <span>Test AI Risk Scoring</span>
                </button>

                <button
                  onClick={onRunSimulationDemo}
                  className="flex items-center gap-2 px-5 py-3.5 rounded-full bg-black/40 hover:bg-white/5 text-slate-300 border border-white/10 hover:border-white/25 text-xs sm:text-sm font-medium transition-all cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 text-[#00e5ff] fill-[#00e5ff]" />
                  <span>Attack Simulation</span>
                </button>
              </div>

              {/* KPI Strip */}
              <div className="mt-10 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
                <div>
                  <div className="text-2xl font-black text-white font-mono">&lt; 0.02s</div>
                  <div className="text-[11px] text-slate-400 uppercase tracking-wider mt-0.5">ML Decision Latency</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-[#00e5ff] font-mono">99.8%</div>
                  <div className="text-[11px] text-slate-400 uppercase tracking-wider mt-0.5">Anomaly Detection</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-white font-mono">100%</div>
                  <div className="text-[11px] text-slate-400 uppercase tracking-wider mt-0.5">Immutable Audit</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-emerald-400 font-mono">24/7/365</div>
                  <div className="text-[11px] text-slate-400 uppercase tracking-wider mt-0.5">Zero-Trust Hardened</div>
                </div>
              </div>

            </div>

            {/* Right Column: Hero Operator Photo with Real-Time Telemetry Overlay */}
            <div className="lg:col-span-6 relative w-full flex items-center justify-center">
              
              <div className="relative w-full h-[360px] sm:h-[440px] lg:h-[500px] rounded-2xl overflow-hidden border border-white/15 shadow-2xl group">
                <img
                  src={heroSocOperatorImg}
                  alt="SecureIoT AI SOC Operations Center Monitoring Connected Device Fleet"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />

                {/* Soft gradient blends */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#000028]/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#000028]/90 via-transparent to-transparent pointer-events-none" />

                {/* Top Status Pill */}
                <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/75 border border-white/20 text-white text-xs font-mono backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>SECUREIOT AI &bull; ACTIVE ZERO-TRUST FLEET DEFENSE</span>
                </div>
              </div>

              {/* Floating Real-Time Advisory Card */}
              {isAdvisoryCardVisible && (
                <div className="absolute -bottom-6 right-0 sm:right-4 max-w-sm w-full p-4 rounded-xl bg-[#001132]/95 border border-white/15 shadow-2xl backdrop-blur-xl z-20">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                        Blockchain Telemetry Live
                      </span>
                    </div>
                    <button
                      onClick={() => setIsAdvisoryCardVisible(false)}
                      className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                      title="Dismiss"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-xs font-medium text-slate-200 leading-relaxed">
                    AI classification engine and Ethereum smart contract consensus are synchronized across all connected IoT devices in real-time.
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between gap-2">
                    <button
                      onClick={() => onNavigate('admin-dashboard')}
                      className="flex-1 py-1.5 px-3 rounded-full bg-[#00646e] hover:bg-[#00828f] text-white font-bold text-xs text-center transition-colors shadow-sm"
                    >
                      View SOC Console
                    </button>
                    <button
                      onClick={() => onNavigate('access-request')}
                      className="flex-1 py-1.5 px-3 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white font-semibold text-xs text-center transition-colors"
                    >
                      Simulate Access
                    </button>
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION: "Why Adaptive Access Control for IoT?"                            */}
      {/* ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full bg-white">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Heading and 2 Paragraphs */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            
            <div className="text-xs font-mono uppercase tracking-widest text-[#00646e] font-bold mb-2">
              ZERO-TRUST ARCHITECTURAL PARADIGM
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
              Why Adaptive Access Control for IoT?
            </h2>

            <div className="mt-6 space-y-4 text-slate-700 leading-relaxed text-sm sm:text-base font-normal">
              <p>
                Traditional perimeter security and static credentials are incapable of defending modern IoT networks. Resource-constrained devices like CCTV cameras, smart locks, and environmental sensors are susceptible to credential stuffing, firmware tampering, and rogue lateral pivoting.
              </p>
              
              <p>
                <strong className="text-slate-900 font-semibold">SecureIoT AI</strong> solves this fundamental vulnerability by coupling autonomous client-side Machine Learning with decentralized Ethereum blockchain smart contracts. Every access request is dynamically scored in sub-second latency across 6 behavioral dimensions before any network permission is authorized.
              </p>
            </div>

            {/* Bullet Highlights tailored to the project */}
            <div className="mt-8 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Random Forest Multi-Tree Classification</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Evaluates request frequency, network anomaly %, time drift, trust degradation, and failed attempts to compute instantaneous risk (0.00 - 1.00).
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Three-Tier Zero-Trust Policy Decision</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Dynamically grants <span className="font-semibold text-emerald-700">ALLOW</span> (low risk), <span className="font-semibold text-amber-700">LIMITED</span> (throttled read-only for medium risk), or <span className="font-semibold text-rose-700">DENY</span> (immediate isolation and SOC alert).
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Decentralized Ethereum Smart Contract Ledger</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Emits tamper-evident events and permanently logs cryptographic authorization hashes directly to the Ethereum blockchain, eliminating centralized point-of-failure tampering.
                  </p>
                </div>
              </div>
            </div>

            {/* Strategic SOC Console Link */}
            <div className="mt-8 pt-6 border-t border-slate-200 flex items-center gap-4">
              <button
                onClick={() => onNavigate('admin-dashboard')}
                className="inline-flex items-center gap-2 text-sm font-bold text-[#00646e] hover:text-[#00828f] group transition-colors cursor-pointer"
              >
                <span>Explore Full SOC Command Console</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

          </div>

          {/* Right Column: High-Res Security Operations Control Center Photo */}
          <div className="lg:col-span-6 relative w-full">
            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-slate-100">
              <img
                src={whySecurityMonitoringImg}
                alt="SecureIoT AI Security Operations Control Center Telemetry"
                className="w-full h-[360px] sm:h-[420px] object-cover object-center hover:scale-102 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            </div>
            
            {/* Caption Tag */}
            <div className="mt-3 flex items-center justify-between text-xs text-slate-500 font-mono">
              <span>SECUREIOT AI &bull; CENTRAL COMMAND & TELEMETRY MATRIX</span>
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                ACTIVE DEFENSE
              </span>
            </div>
          </div>

        </div>

      </section>

      {/* ========================================================================= */}
      {/* SECTION: "Featured capabilities" - 3 Core Pillars of SecureIoT AI         */}
      {/* ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full bg-slate-50/70 border-t border-slate-200">
        
        <div className="mb-12">
          <div className="text-xs font-mono uppercase tracking-widest text-[#00646e] font-bold mb-1">
            CORE PLATFORM CAPABILITIES
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Featured Capabilities
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base max-w-2xl">
            Explore the three technological pillars that power the SecureIoT AI adaptive access control framework.
          </p>
        </div>

        {/* 3 Column Grid with Photography */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: AI-Driven Adaptive Risk Classification */}
          <div 
            onClick={() => onNavigate('ai-risk')}
            className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-[#00646e]/60 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            <div>
              {/* Photo on Top */}
              <div className="w-full h-52 overflow-hidden bg-slate-100">
                <img
                  src={capExtendImg}
                  alt="AI-Driven Adaptive Risk Classification"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Title & Description */}
              <div className="p-6">
                <div className="text-[11px] font-mono text-[#00646e] font-bold uppercase mb-1">
                  Machine Learning Engine
                </div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#00646e] transition-colors">
                  AI-Driven Adaptive Risk Scoring
                </h3>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                  Trained Random Forest machine learning models that analyze 6 dynamic behavioral vectors in &lt; 0.02s to determine risk probability before granting any network access.
                </p>
              </div>
            </div>

            <div className="px-6 pb-6 pt-2 flex items-center gap-1.5 text-xs font-bold text-[#00646e] group-hover:underline">
              <span>Test AI Risk Scoring</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: IoT Fleet Hardening & Telemetry */}
          <div 
            onClick={() => onNavigate('devices')}
            className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-[#00646e]/60 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            <div>
              {/* Photo on Top */}
              <div className="w-full h-52 overflow-hidden bg-slate-100">
                <img
                  src={capCollaborateImg}
                  alt="IoT Fleet Hardening & Telemetry"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Title & Description */}
              <div className="p-6">
                <div className="text-[11px] font-mono text-[#00646e] font-bold uppercase mb-1">
                  Edge Perimeter Defense
                </div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#00646e] transition-colors">
                  IoT Fleet Hardening & Telemetry
                </h3>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                  Continuous behavioral telemetry auditing across CCTV cameras, smart locks, environmental sensors, and medical devices with automatic quarantine for compromised nodes.
                </p>
              </div>
            </div>

            <div className="px-6 pb-6 pt-2 flex items-center gap-1.5 text-xs font-bold text-[#00646e] group-hover:underline">
              <span>Manage Connected Fleet</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Blockchain Smart Contract Ledger */}
          <div 
            onClick={() => onNavigate('blockchain')}
            className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-[#00646e]/60 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            <div>
              {/* Photo on Top */}
              <div className="w-full h-52 overflow-hidden bg-slate-100">
                <img
                  src={capFieldUpgradeImg}
                  alt="Blockchain Smart Contract Ledger"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Title & Description */}
              <div className="p-6">
                <div className="text-[11px] font-mono text-[#00646e] font-bold uppercase mb-1">
                  Decentralized Consensus
                </div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#00646e] transition-colors">
                  Blockchain Smart Contract Ledger
                </h3>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                  Ethereum Solidity smart contracts (`AccessControl.sol`) permanently logging access decisions, block heights, and cryptographic hashes for tamper-evident compliance.
                </p>
              </div>
            </div>

            <div className="px-6 pb-6 pt-2 flex items-center gap-1.5 text-xs font-bold text-[#00646e] group-hover:underline">
              <span>Audit Blockchain Ledger</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

        </div>

      </section>

      {/* ========================================================================= */}
      {/* 6 KEY SYSTEM PILLARS (Project Features Deep Dive)                         */}
      {/* ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full bg-white">
        
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-mono uppercase tracking-widest text-[#00646e] font-bold mb-1">
            TECHNICAL SPECIFICATIONS
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Six Foundational Project Features
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            Every layer of the SecureIoT AI architecture is engineered to eliminate static vulnerabilities and provide autonomous, real-time protection.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Feature 1: Machine Learning Classifier */}
          <div 
            onClick={() => onNavigate('ai-risk')}
            className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-[#00646e] hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-[#00646e]/10 text-[#00646e] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900 group-hover:text-[#00646e] transition-colors">
              Random Forest Risk Scoring
            </h4>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Analyzes device trust score, failed attempt velocity, request frequency, time anomaly, and network packet variance to classify threats.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[#00646e]">
              <span>Test Model</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Feature 2: 3-Tier Policy Engine */}
          <div 
            onClick={() => onNavigate('access-request')}
            className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-[#00646e] hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-[#00646e]/10 text-[#00646e] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900 group-hover:text-[#00646e] transition-colors">
              3-Tier Adaptive Policy Engine
            </h4>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Applies zero-trust thresholds: ALLOW (&lt;30 risk), LIMITED throttled read-only access (30-60 risk), or DENY quarantine (&gt;60 risk).
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[#00646e]">
              <span>Simulate Requests</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Feature 3: Blockchain Audit Ledger */}
          <div 
            onClick={() => onNavigate('blockchain')}
            className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-[#00646e] hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-[#00646e]/10 text-[#00646e] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Blocks className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900 group-hover:text-[#00646e] transition-colors">
              Ethereum Smart Contracts
            </h4>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Solidity `AccessControl.sol` contract deployed for decentralized validation, permanent block hashing, and non-repudiable audit logging.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[#00646e]">
              <span>Audit Ledger</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Feature 4: IoT Fleet Fingerprinting */}
          <div 
            onClick={() => onNavigate('devices')}
            className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-[#00646e] hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-[#00646e]/10 text-[#00646e] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Cpu className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900 group-hover:text-[#00646e] transition-colors">
              IoT Fleet Profiling & Quarantine
            </h4>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Maintains continuous behavioral baselines for CCTV cameras, smart locks, temperature sensors, and automated robotic actuators.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[#00646e]">
              <span>View Fleet</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Feature 5: Cyberattack Vector Simulation */}
          <div 
            onClick={onRunSimulationDemo}
            className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-[#00646e] hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-[#00646e]/10 text-[#00646e] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Play className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900 group-hover:text-[#00646e] transition-colors">
              Attack Vector Simulator
            </h4>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Simulates brute force floods, DDoS telemetry spikes, location spoofing, and rogue device impersonation to validate defense resilience.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[#00646e]">
              <span>Run Attack Replay</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Feature 6: Central SOC Command Console */}
          <div 
            onClick={() => onNavigate('admin-dashboard')}
            className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-[#00646e] hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-[#00646e]/10 text-[#00646e] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Activity className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900 group-hover:text-[#00646e] transition-colors">
              Centralized SOC Command
            </h4>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Unified real-time dashboard displaying threat scores, active device statuses, live incident feeds, and operator manual override controls.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[#00646e]">
              <span>Open Dashboard</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

        </div>

      </section>

      {/* ========================================================================= */}
      {/* 4-STEP ZERO-TRUST INCIDENT ANALYSIS & ENFORCEMENT PIPELINE                */}
      {/* ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-slate-200">
        
        <div className="p-8 sm:p-10 rounded-3xl bg-[#000028] text-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-[#00e5ff] font-bold">
                CONTINUOUS PROTECTION MATRIX
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                Zero-Trust Incident Analysis & Enforcement Pipeline
              </h3>
            </div>
            
            <button
              onClick={onRunSimulationDemo}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#00646e] hover:bg-[#00828f] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-[0_4px_16px_rgba(0,100,110,0.4)] self-start md:self-auto cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Launch Live Simulation</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-[#00e5ff]/50 transition-colors">
              <div className="text-[10px] font-mono text-[#00e5ff] uppercase font-bold">01. INGESTION</div>
              <div className="text-sm font-bold text-white mt-1">Device Telemetry</div>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                IoT endpoints submit authorization requests with hardware MAC, timestamp, and location signatures.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-[#00e5ff]/50 transition-colors">
              <div className="text-[10px] font-mono text-[#00e5ff] uppercase font-bold">02. EVALUATION</div>
              <div className="text-sm font-bold text-white mt-1">Random Forest Classifier</div>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Multi-decision trees compute instantaneous risk scores between 0.0 (Trusted) and 1.0 (Critical Threat).
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-[#00e5ff]/50 transition-colors">
              <div className="text-[10px] font-mono text-[#00e5ff] uppercase font-bold">03. ADAPTIVE POLICY</div>
              <div className="text-sm font-bold text-white mt-1">Zero-Trust Decision</div>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Threshold logic automatically applies ALLOW (full session), LIMITED (read-only), or DENY (quarantine).
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-[#00e5ff]/50 transition-colors">
              <div className="text-[10px] font-mono text-[#00e5ff] uppercase font-bold">04. IMMUTABLE RECORD</div>
              <div className="text-sm font-bold text-white mt-1">Blockchain Verification</div>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Ethereum smart contracts store the access hash on-chain for tamper-evident and court-admissible audit logs.
              </p>
            </div>

          </div>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* ENTERPRISE CALL TO ACTION BANNER                                          */}
      {/* ========================================================================= */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="relative rounded-3xl bg-gradient-to-r from-[#000028] via-[#001032] to-[#002244] border border-slate-700 p-8 sm:p-12 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 text-white shadow-xl">
          
          <div className="max-w-xl">
            <div className="w-10 h-1 bg-[#00646e] mb-4 rounded-full" />
            <h3 className="text-2xl sm:text-3xl font-black uppercase text-white">
              SecureIoT AI Threat Defense Architecture
            </h3>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              Explore live SOC telemetry, test machine learning evaluation against anomalous request payloads, and audit the Ethereum smart contract ledger.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => onNavigate('admin-dashboard')}
              className="px-8 py-3.5 rounded-full bg-[#00646e] hover:bg-[#00828f] text-white font-bold text-xs sm:text-sm tracking-wider uppercase transition-all shadow-[0_4px_20px_rgba(0,100,110,0.45)] hover:scale-105 active:scale-95 cursor-pointer"
            >
              Launch SOC Console
            </button>

            <button
              onClick={onOpenRemixGuide}
              className="px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm tracking-wide transition-all border border-white/20"
            >
              Smart Contract Guide
            </button>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* ENTERPRISE FOOTER (SecureIoT AI)                                          */}
      {/* ========================================================================= */}
      <footer className="w-full bg-[#000028] text-slate-400 text-xs border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="text-white font-bold uppercase tracking-wider text-xs mb-4">
                Core Capabilities
              </h4>
              <ul className="space-y-2.5">
                <li><button onClick={() => onNavigate('ai-risk')} className="hover:text-white transition-colors">Random Forest Risk Engine</button></li>
                <li><button onClick={() => onNavigate('devices')} className="hover:text-white transition-colors">IoT Fleet Hardening</button></li>
                <li><button onClick={() => onNavigate('access-request')} className="hover:text-white transition-colors">Zero-Trust Access Evaluator</button></li>
                <li><button onClick={() => onNavigate('blockchain')} className="hover:text-white transition-colors">Blockchain Smart Contract</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold uppercase tracking-wider text-xs mb-4">
                Command & Monitoring
              </h4>
              <ul className="space-y-2.5">
                <li><button onClick={() => onNavigate('admin-dashboard')} className="hover:text-white transition-colors">Central SOC Console</button></li>
                <li><button onClick={() => onNavigate('analytics')} className="hover:text-white transition-colors">Risk Telemetry Analytics</button></li>
                <li><button onClick={onRunSimulationDemo} className="hover:text-white transition-colors">Attack Simulation Engine</button></li>
                <li><button onClick={() => onNavigate('blockchain')} className="hover:text-white transition-colors">Immutable Audit Logs</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold uppercase tracking-wider text-xs mb-4">
                Standards & Compliance
              </h4>
              <ul className="space-y-2.5">
                <li className="text-slate-400">NIST SP 800-207 Zero Trust</li>
                <li className="text-slate-400">ISO/IEC 27001 Certified</li>
                <li className="text-slate-400">IEC 62443 Industrial Security</li>
                <li className="text-slate-400">Solidity Smart Contract Verified</li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold uppercase tracking-wider text-xs mb-4">
                Developer Resources
              </h4>
              <ul className="space-y-2.5">
                <li><button onClick={onOpenRemixGuide} className="hover:text-white transition-colors">Solidity Contract Artifacts</button></li>
                <li><button onClick={() => onNavigate('access-request')} className="hover:text-white transition-colors">Access Policy Simulator</button></li>
                <li><button onClick={() => onNavigate('settings')} className="hover:text-white transition-colors">Network & Contract Settings</button></li>
                <li><button onClick={() => onNavigate('analytics')} className="hover:text-white transition-colors">Telemetry Risk Distribution</button></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-white font-black tracking-wider text-sm font-sans">
                SecureIoT<span className="text-[#00e5ff]">AI</span>
              </span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400">
                Adaptive Access Control for Blockchain IoT Networks
              </span>
            </div>

            <div className="text-[11px] text-slate-500">
              &copy; 2026 SecureIoT AI. All rights reserved.
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
};
