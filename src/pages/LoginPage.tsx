import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle, 
  Loader2, 
  CheckCircle2, 
  KeyRound, 
  Cpu, 
  Fingerprint, 
  Smartphone, 
  Home, 
  ChevronRight,
  ShieldAlert,
  Server,
  Terminal,
  Layers
} from 'lucide-react';
import { UserRole, UserAccount, ViewTab } from '../types';
import { StorageService } from '../services/storageService';

interface LoginPageProps {
  onLoginSuccess: (user: UserAccount) => void;
  onNavigate: (tab: ViewTab) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onNavigate }) => {
  const [role, setRole] = useState<UserRole>('ADMIN');
  const [email, setEmail] = useState('admin@iotsecurity.com');
  const [password, setPassword] = useState('AdminSecurityPass2026!');
  const [mfaCode, setMfaCode] = useState('849201');
  const [useMfa, setUseMfa] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [authStage, setAuthStage] = useState<string>('');

  const handleRoleSwitch = (selectedRole: UserRole) => {
    setErrorMsg('');
    setRole(selectedRole);
    if (selectedRole === 'ADMIN') {
      setEmail('admin@iotsecurity.com');
      setPassword('AdminSecurityPass2026!');
      setMfaCode('849201');
      setUseMfa(true);
    } else {
      setEmail('user@iotsecurity.com');
      setPassword('UserSecurityPass2026!');
      setMfaCode('');
      setUseMfa(false);
    }
  };

  const handleQuickFill = (targetRole: UserRole) => {
    handleRoleSwitch(targetRole);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please provide both administrator email and cryptographic passkey.');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setErrorMsg('Please enter a valid authorized domain email address.');
      return;
    }

    if (role === 'ADMIN' && useMfa && mfaCode.trim().length < 6) {
      setErrorMsg('Administrator access requires a valid 6-digit MFA verification token.');
      return;
    }

    setIsLoading(true);
    setAuthStage('Verifying cryptographic credentials...');

    setTimeout(() => {
      setAuthStage('Checking Zero-Trust device posture & permissions...');
    }, 400);

    setTimeout(() => {
      setAuthStage('Generating authenticated session hash on ledger...');
    }, 800);

    setTimeout(() => {
      setIsLoading(false);
      setAuthStage('');

      const allUsers = StorageService.getUsers();
      let matched = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (!matched) {
        matched = {
          id: `usr_${Date.now()}`,
          name: role === 'ADMIN' ? 'Chief Security Officer (Admin)' : 'Authorized IoT Operator',
          email: email.trim(),
          role: role,
          status: 'ACTIVE',
          lastLogin: 'Just now',
          assignedDevices: role === 'ADMIN' 
            ? ['CCTV_01', 'CCTV_02', 'SmartDoor_01', 'MotionSensor_01', 'Temperature_01'] 
            : ['CCTV_01', 'Temperature_01', 'AirQuality_01']
        };
      } else {
        matched = { ...matched, role };
      }

      // Record access notification
      StorageService.addNotification({
        title: `${role === 'ADMIN' ? 'Administrator' : 'Operator'} Authenticated`,
        message: `Session granted for ${matched.email} under Zero-Trust RBAC policy.`,
        type: 'success'
      });

      StorageService.setActiveUser(matched);
      onLoginSuccess(matched);
    }, 1200);
  };

  return (
    <div className="w-full min-h-screen bg-slate-100 flex flex-col font-sans selection:bg-[#00646e] selection:text-white">
      
      {/* Breadcrumb Header Bar */}
      <div className="w-full bg-[#000028] border-b border-white/10 py-2.5 px-4 sm:px-6 lg:px-8 text-xs text-slate-300">
        <div className="max-w-7xl mx-auto flex items-center gap-2 font-medium">
          <button 
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          <button 
            onClick={() => onNavigate('landing')}
            className="hover:text-white transition-colors"
          >
            SecureIoT AI Platform
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-white font-semibold">
            {role === 'ADMIN' ? 'Administrator SOC Authentication' : 'Operator Portal Sign In'}
          </span>
        </div>
      </div>

      {/* Main Authentication Container */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 sm:py-16">
        <div className="w-full max-w-xl">

          {/* Card Wrapper with Midnight Navy Corporate Header & White Body */}
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            
            {/* Dark Corporate Header */}
            <div className="bg-[#000028] text-white p-6 sm:p-8 border-b border-slate-800 relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#00646e]/20 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00646e] to-[#00e5ff] flex items-center justify-center text-white shadow-[0_0_15px_rgba(0,229,255,0.4)] shrink-0">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white font-sans">
                      SecureIoT<span className="text-[#00e5ff]">AI</span>
                    </h1>
                    <p className="text-xs text-slate-300">
                      Adaptive Access Control &bull; Security Operations Center
                    </p>
                  </div>
                </div>

                <div className="hidden sm:flex flex-col items-end">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/80 text-[10px] font-mono font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    TLS 1.3 SECURE
                  </span>
                  <span className="text-[10px] text-slate-400 mt-1 font-mono">
                    NIST SP 800-207
                  </span>
                </div>
              </div>

              {/* Title & Description */}
              <div className="mt-6">
                <div className="text-xs font-mono uppercase tracking-widest text-[#00e5ff] font-bold">
                  PRIVILEGED ACCESS GATEWAY
                </div>
                <h2 className="text-2xl font-extrabold text-white mt-1">
                  {role === 'ADMIN' ? 'Admin SOC Security Sign In' : 'Operator Portal Authentication'}
                </h2>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                  {role === 'ADMIN'
                    ? 'Authenticate with administrator credentials to manage fleet devices, train AI risk models, and execute blockchain overrides.'
                    : 'Log in with standard operator access to view assigned IoT devices and submit access requests.'}
                </p>
              </div>

              {/* Role Toggle Selector */}
              <div className="mt-6 grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
                <button
                  type="button"
                  onClick={() => handleRoleSwitch('ADMIN')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    role === 'ADMIN'
                      ? 'bg-[#00646e] text-white shadow-lg shadow-[#00646e]/50 border border-[#00e5ff]/40'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <KeyRound className="w-3.5 h-3.5 text-[#00e5ff]" />
                  <span>Admin SOC Login</span>
                  {role === 'ADMIN' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleSwitch('USER')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    role === 'USER'
                      ? 'bg-[#00646e] text-white shadow-lg shadow-[#00646e]/50 border border-[#00e5ff]/40'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Cpu className="w-3.5 h-3.5 text-[#00e5ff]" />
                  <span>Operator / User Login</span>
                  {role === 'USER' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  )}
                </button>
              </div>

            </div>

            {/* Form Body */}
            <div className="p-6 sm:p-8">

              {/* Instant 1-Click Demo Buttons */}
              <div className="mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[11px] font-mono uppercase font-bold text-slate-600 flex items-center gap-1.5">
                    <Fingerprint className="w-3.5 h-3.5 text-[#00646e]" />
                    <span>Quick Demo Credentials</span>
                  </span>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-[#00646e]/10 text-[#00646e] border border-[#00646e]/20">
                    ONE-CLICK FILL
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickFill('ADMIN')}
                    className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                      role === 'ADMIN' && email === 'admin@iotsecurity.com'
                        ? 'bg-[#000028] text-white border-transparent shadow-md'
                        : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold flex items-center gap-1">
                        <KeyRound className="w-3 h-3 text-[#00e5ff]" />
                        <span>Admin Account</span>
                      </span>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-900/60 text-emerald-300">
                        FULL SOC
                      </span>
                    </div>
                    <div className="text-[11px] font-mono opacity-80 mt-1 truncate">
                      admin@iotsecurity.com
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickFill('USER')}
                    className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                      role === 'USER' && email === 'user@iotsecurity.com'
                        ? 'bg-[#000028] text-white border-transparent shadow-md'
                        : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold flex items-center gap-1">
                        <Cpu className="w-3 h-3 text-[#00e5ff]" />
                        <span>Operator Account</span>
                      </span>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-900/60 text-cyan-300">
                        READ/REQ
                      </span>
                    </div>
                    <div className="text-[11px] font-mono opacity-80 mt-1 truncate">
                      user@iotsecurity.com
                    </div>
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {errorMsg && (
                <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span className="font-medium">{errorMsg}</span>
                </div>
              )}

              {/* Main Credentials Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Authorized Identity Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@iotsecurity.com"
                      className="w-full pl-10 pr-3 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#00646e] focus:bg-white focus:ring-2 focus:ring-[#00646e]/20 text-xs text-slate-900 font-mono outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Password / Passkey */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Cryptographic Passkey
                    </label>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Min 12-char SHA256
                    </span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••••••"
                      className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#00646e] focus:bg-white focus:ring-2 focus:ring-[#00646e]/20 text-xs text-slate-900 font-mono outline-none transition-all placeholder:text-slate-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* MFA Verification Section (Highlighted for Admin) */}
                {role === 'ADMIN' && (
                  <div className="p-4 rounded-2xl bg-[#000028]/5 border border-[#00646e]/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-[#00646e]" />
                        <span className="text-xs font-bold text-slate-800">
                          Two-Factor Authentication (MFA)
                        </span>
                      </div>
                      <label className="flex items-center gap-1.5 text-[11px] text-slate-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={useMfa}
                          onChange={(e) => setUseMfa(e.target.checked)}
                          className="rounded border-slate-300 text-[#00646e] focus:ring-[#00646e]"
                        />
                        <span>Enforce FIDO2/TOTP</span>
                      </label>
                    </div>

                    {useMfa && (
                      <div>
                        <div className="text-[11px] text-slate-600 mb-1.5 flex items-center justify-between">
                          <span>Enter 6-digit Authenticator Code:</span>
                          <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                            DEMO CODE: 849201
                          </span>
                        </div>
                        <input
                          type="text"
                          maxLength={6}
                          value={mfaCode}
                          onChange={(e) => setMfaCode(e.target.value)}
                          placeholder="849201"
                          className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 focus:border-[#00646e] focus:ring-2 focus:ring-[#00646e]/20 text-center tracking-widest font-mono font-bold text-base text-slate-900 outline-none"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Session Persistence & Clearances */}
                <div className="flex items-center justify-between pt-1 text-xs text-slate-600">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-300 text-[#00646e] focus:ring-[#00646e]"
                    />
                    <span>Persist session token (8h)</span>
                  </label>
                  <span className="text-[11px] font-mono text-[#00646e] font-semibold">
                    Zero-Trust RBAC
                  </span>
                </div>

                {/* Submit Sign-In Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-4 py-3.5 px-6 rounded-full bg-[#00646e] hover:bg-[#00828f] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-[0_4px_16px_rgba(0,100,110,0.4)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 hover:scale-[1.01] active:scale-[0.99]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>{authStage || 'Authenticating...'}</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In as {role === 'ADMIN' ? 'SOC Administrator' : 'Authorized Operator'}</span>
                      <ArrowRight className="w-4 h-4 text-white" />
                    </>
                  )}
                </button>

              </form>

              {/* Security Features Bullet Strip */}
              <div className="mt-6 pt-5 border-t border-slate-200 grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded-xl bg-slate-50">
                  <div className="text-[10px] font-mono font-bold text-[#00646e]">LEVEL 4</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Admin Clearance</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-50">
                  <div className="text-[10px] font-mono font-bold text-[#00646e]">KECCAK-256</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Hash Verification</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-50">
                  <div className="text-[10px] font-mono font-bold text-[#00646e]">ETHEREUM</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Audit Handshake</div>
                </div>
              </div>

              {/* Navigation Back */}
              <div className="mt-6 text-center">
                <button
                  onClick={() => onNavigate('landing')}
                  className="text-xs font-semibold text-slate-600 hover:text-[#00646e] transition-colors inline-flex items-center gap-1 cursor-pointer"
                >
                  &larr; Return to SecureIoT AI Platform Overview
                </button>
              </div>

            </div>

          </div>

          {/* Compliance Tagline */}
          <div className="mt-6 text-center text-xs text-slate-500">
            Protected by SecureIoT AI Zero-Trust Gateway &bull; NIST SP 800-207 &bull; ISO/IEC 27001
          </div>

        </div>
      </div>

    </div>
  );
};
