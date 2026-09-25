import React, { useState } from 'react';
import { 
  KeyRound, 
  Cpu, 
  Database, 
  ShieldCheck, 
  ArrowRight, 
  HelpCircle, 
  Sparkles, 
  Info, 
  Layers, 
  Lock, 
  Camera, 
  Server, 
  Radio, 
  SlidersHorizontal 
} from 'lucide-react';
import { IoTDevice, UserAccount, ViewTab } from '../types';
import { StorageService } from '../services/storageService';

interface AccessRequestPageProps {
  devices: IoTDevice[];
  activeUser: UserAccount | null;
  preselectedDevice?: IoTDevice | null;
  onInitiateAnalysis: (
    deviceId: string, 
    resource: string, 
    reason: string,
    result: any
  ) => void;
  onNavigate: (tab: ViewTab) => void;
}

const RESOURCES = [
  { id: 'Smart Door', name: 'Smart Door Biometrics', icon: Lock, desc: 'Perimeter physical entry & magnetic turnstiles' },
  { id: 'Security Camera Stream', name: 'Camera H.265 Stream', icon: Camera, desc: 'Real-time encrypted video surveillance telemetry feed' },
  { id: 'Temperature Sensor Feed', name: 'Environmental Telemetry', icon: Radio, desc: 'Server room HVAC, humidity and rack temperature data' },
  { id: 'Database Logs', name: 'Database Audit Ledger', icon: Database, desc: 'Encrypted SQL & Spanner historical transaction logs' },
  { id: 'Network Gateway', name: 'Edge Gateway VLAN Core', icon: Server, desc: 'Hardware switch routing tables and boundary firewall ports' },
  { id: 'Admin Configuration', name: 'Cryptographic Key Vault', icon: SlidersHorizontal, desc: 'Zero-trust root certificate & authorization policy manager' },
];

export const AccessRequestPage: React.FC<AccessRequestPageProps> = ({
  devices,
  activeUser,
  preselectedDevice,
  onInitiateAnalysis,
  onNavigate
}) => {
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>(
    preselectedDevice?.deviceId || (devices[0]?.deviceId || 'CCTV_01')
  );
  const [selectedResource, setSelectedResource] = useState<string>('Security Camera Stream');
  const [reason, setReason] = useState<string>('Routine perimeter surveillance and telemetry check');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Available devices based on user role
  const availableDevices = activeUser?.role === 'ADMIN'
    ? devices
    : devices.filter(d => activeUser?.assignedDevices?.includes(d.deviceId));

  const targetDevice = devices.find(d => d.deviceId === selectedDeviceId) || devices[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDeviceId || !selectedResource) return;

    setIsSubmitting(true);

    const result = await StorageService.processAccessRequest(
      activeUser?.id || 'usr_guest',
      activeUser?.name || 'Authorized Operator',
      selectedDeviceId,
      selectedResource,
      reason
    );

    setIsSubmitting(false);

    onInitiateAnalysis(selectedDeviceId, selectedResource, reason, result);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="p-6 rounded-3xl bg-[#001032] border border-white/10 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#000028] border border-white/10 flex items-center justify-center text-[#00e5ff] shadow-[0_0_15px_rgba(0,229,255,0.25)]">
            <KeyRound className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#00e5ff] uppercase">Policy Gate</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Zero-Trust Access Request Interface
            </h2>
            <p className="text-xs text-slate-300">
              Submit hardware credential access request for machine learning risk evaluation
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-[#00646e]/30 text-[#00e5ff] border border-[#00646e] hidden sm:inline-block font-bold">
          AI Risk Scoring Active
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Request Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="p-6 sm:p-7 rounded-3xl bg-[#001032] border border-white/10 shadow-xl space-y-5">
            
            {/* Device Selection */}
            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-wider font-mono mb-2.5">
                1. Select Requesting IoT Node
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-52 overflow-y-auto pr-1">
                {availableDevices.map((dev) => {
                  const isSelected = selectedDeviceId === dev.deviceId;
                  return (
                    <div
                      key={dev.id}
                      onClick={() => setSelectedDeviceId(dev.deviceId)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between shadow-md ${
                        isSelected
                          ? 'bg-[#00646e]/30 border-[#00e5ff] shadow-[0_0_15px_rgba(0,229,255,0.25)]'
                          : 'bg-[#000028] border-white/10 hover:border-white/30'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Cpu className={`w-4 h-4 ${isSelected ? 'text-[#00e5ff]' : 'text-slate-400'}`} />
                        <div>
                          <p className="text-xs font-bold font-mono text-white">{dev.deviceId}</p>
                          <p className="text-[10px] text-slate-400 truncate max-w-[120px]">{dev.deviceType}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                          dev.status === 'ONLINE' ? 'text-emerald-300 bg-emerald-950 border border-emerald-800' :
                          dev.status === 'SUSPICIOUS' ? 'text-amber-300 bg-amber-950 border border-amber-800' : 'text-rose-300 bg-rose-950 border border-rose-800'
                        }`}>
                          {dev.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Resource Selection */}
            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-wider font-mono mb-2.5">
                2. Target Protected Asset
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {RESOURCES.map((res) => {
                  const Icon = res.icon;
                  const isSelected = selectedResource === res.id;
                  return (
                    <div
                      key={res.id}
                      onClick={() => setSelectedResource(res.id)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 shadow-md ${
                        isSelected
                          ? 'bg-[#00646e]/30 border-[#00e5ff] shadow-[0_0_15px_rgba(0,229,255,0.25)]'
                          : 'bg-[#000028] border-white/10 hover:border-white/30'
                      }`}
                    >
                      <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? 'text-[#00e5ff]' : 'text-slate-400'}`} />
                      <div>
                        <span className="text-xs font-bold text-white block">{res.name}</span>
                        <span className="text-[11px] text-slate-400 leading-tight block mt-0.5">{res.desc}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reason for Access */}
            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-wider font-mono mb-2">
                3. Technical Justification
              </label>
              <textarea
                rows={3}
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Specify the technical operation and telemetry verification reason..."
                className="w-full p-3.5 rounded-2xl bg-[#000028] border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00646e] font-sans"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-full bg-[#00646e] hover:bg-[#00828f] text-white font-extrabold text-xs tracking-wider uppercase transition-all shadow-[0_4px_20px_rgba(0,100,110,0.4)] flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60 hover:scale-[1.01] active:scale-[0.99]"
            >
              <Sparkles className="w-4 h-4 text-[#00e5ff]" />
              <span>Submit to AI Adaptive Access Controller</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </form>
        </div>

        {/* Selected Device Live Telemetry Sidebar */}
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-[#001032] border border-white/10 shadow-xl">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono mb-4 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#00e5ff]" />
              <span>Target Telemetry Profile</span>
            </h3>

            {targetDevice ? (
              <div className="space-y-3.5 text-xs">
                <div className="p-4 rounded-2xl bg-[#000028] border border-white/10 space-y-2 font-mono">
                  <div className="flex justify-between text-slate-400">
                    <span>Node ID:</span>
                    <span className="font-bold text-[#00e5ff]">{targetDevice.deviceId}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Type:</span>
                    <span className="text-slate-200">{targetDevice.deviceType}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Current Status:</span>
                    <span className={`font-bold ${
                      targetDevice.status === 'ONLINE' ? 'text-emerald-400' :
                      targetDevice.status === 'SUSPICIOUS' ? 'text-amber-400' : 'text-rose-400'
                    }`}>
                      {targetDevice.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Failed Attempts:</span>
                    <span className="text-slate-200">{targetDevice.features?.failed_attempts ?? 0}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Frequency:</span>
                    <span className="text-slate-200">{targetDevice.features?.request_frequency ?? 0} req/min</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Network Anomaly:</span>
                    <span className="text-slate-200">{targetDevice.features?.network_anomaly ?? 0}%</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#000028] border border-[#00646e]/40">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-[#00e5ff] font-bold block mb-1">
                    Behavioral Baseline:
                  </span>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Historical compliance rating: {targetDevice.features?.previous_behavior ?? 90}%
                  </p>
                </div>

                <div className="text-[11px] text-slate-400 flex items-start gap-2 p-3 rounded-2xl bg-[#000028] border border-white/10">
                  <Info className="w-4 h-4 text-[#00e5ff] shrink-0 mt-0.5" />
                  <span>Submitting triggers live AI evaluation and commits the resulting policy decision to the Ethereum ledger.</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400">No device selected.</p>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
