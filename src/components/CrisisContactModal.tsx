import React, { useState } from 'react';
import { X, ShieldCheck, Mail, Building, Phone, Send, CheckCircle2, Globe, AlertTriangle } from 'lucide-react';

interface CrisisContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTopic?: string;
}

export const CrisisContactModal: React.FC<CrisisContactModalProps> = ({
  isOpen,
  onClose,
  defaultTopic = 'Cyber Security & IoT Access Control'
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    phone: '',
    topic: defaultTopic,
    urgency: 'high',
    notes: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ref = `C24-CYBER-${Math.floor(100000 + Math.random() * 900000)}`;
    setReferenceId(ref);
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl rounded-2xl bg-[#0e1014] border border-white/15 shadow-2xl overflow-hidden text-zinc-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#090b0e]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center bg-black">
              <span className="text-xs font-black tracking-widest text-white">C24</span>
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-wider uppercase text-white">Crisis24 Security Advisory</h2>
              <p className="text-[11px] text-zinc-400">Elite Risk Management & Cyber Strategic Group</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-violet-500/20 border border-violet-500/50 flex items-center justify-center text-violet-400 mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">Engagement Request Received</h3>
            <p className="text-sm text-zinc-300 mt-2 max-w-md mx-auto">
              Our Senior Cyber Risk Strategists and 24/7 Global Operations Command have received your advisory request.
            </p>

            <div className="mt-6 p-4 rounded-xl bg-zinc-900/90 border border-white/10 max-w-xs mx-auto text-left">
              <div className="text-[10px] uppercase font-mono text-zinc-400">Incident Engagement Reference</div>
              <div className="text-base font-mono font-bold text-violet-400 mt-0.5">{referenceId}</div>
              <div className="text-xs text-zinc-400 mt-2 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Response SLA: &lt; 15 Minutes</span>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="mt-8 px-6 py-2.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-sm transition-all"
            >
              Return to Platform
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-violet-500/10 border border-violet-500/25 text-violet-300 text-xs">
              <AlertTriangle className="w-4 h-4 shrink-0 text-violet-400" />
              <span>
                Active threat response operations underway. Direct coordination available for enterprise infrastructure defense.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Jane Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-lg bg-black/60 border border-white/15 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Corporate Email</label>
                <input
                  type="email"
                  required
                  placeholder="j.doe@enterprise.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-lg bg-black/60 border border-white/15 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Organization / Enterprise</label>
                <input
                  type="text"
                  required
                  placeholder="Global Energy & IoT Corp"
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-lg bg-black/60 border border-white/15 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Direct Contact Phone</label>
                <input
                  type="tel"
                  placeholder="+1 (555) 019-2834"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-lg bg-black/60 border border-white/15 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Strategic Advisory Area</label>
              <select
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                className="w-full px-3.5 py-2 rounded-lg bg-black/60 border border-white/15 text-sm text-white focus:outline-none focus:border-violet-500"
              >
                <option value="Cyber Security & IoT Access Control">Cyber Security & IoT Access Control</option>
                <option value="AI Adaptive Risk Scoring & Zero-Trust Architecture">AI Adaptive Risk Scoring & Zero-Trust Architecture</option>
                <option value="Blockchain Smart Contract Audit & Governance">Blockchain Smart Contract Audit & Governance</option>
                <option value="Active Incident Response & Ransomware Defense">Active Incident Response & Threat Containment</option>
                <option value="Global Risk Intelligence & Evacuation Operations">Global Risk Intelligence & Evacuation Operations</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Threat Context / Brief Details</label>
              <textarea
                rows={3}
                placeholder="Briefly describe your environment, current security telemetry, or urgent risk parameters..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3.5 py-2 rounded-lg bg-black/60 border border-white/15 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs tracking-wider uppercase transition-all shadow-[0_4px_20px_rgba(124,58,237,0.4)] active:scale-95"
              >
                <span>Submit Strategic Advisory Request</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
