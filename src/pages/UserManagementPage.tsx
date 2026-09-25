import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  Check, 
  X, 
  Search, 
  Power, 
  Cpu, 
  Edit3, 
  Trash2,
  Lock
} from 'lucide-react';
import { UserAccount, UserRole, IoTDevice } from '../types';
import { StorageService } from '../services/storageService';

interface UserManagementPageProps {
  users: UserAccount[];
  devices: IoTDevice[];
  onRefreshData: () => void;
}

export const UserManagementPage: React.FC<UserManagementPageProps> = ({
  users,
  devices,
  onRefreshData
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  
  // New User Form State
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('USER');
  const [selectedDeviceIds, setSelectedDeviceIds] = useState<string[]>(['CCTV_01']);

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleStatus = (user: UserAccount) => {
    const updatedStatus = user.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE';
    StorageService.updateUser(user.id, { status: updatedStatus });
    onRefreshData();
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;

    StorageService.addUser({
      name: newName.trim(),
      email: newEmail.trim(),
      role: newRole,
      status: 'ACTIVE',
      lastLogin: 'Never',
      assignedDevices: selectedDeviceIds
    });

    setShowAddModal(false);
    setNewName('');
    setNewEmail('');
    onRefreshData();
  };

  const toggleDeviceSelection = (deviceId: string) => {
    if (selectedDeviceIds.includes(deviceId)) {
      setSelectedDeviceIds(selectedDeviceIds.filter(id => id !== deviceId));
    } else {
      setSelectedDeviceIds([...selectedDeviceIds, deviceId]);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="p-6 rounded-3xl bg-[#001032] border border-white/10 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#00e5ff] animate-pulse" />
            <span className="text-[10px] font-mono font-bold tracking-widest text-[#00e5ff] uppercase">Identity Governance</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-[#00e5ff]" />
            <span>Identity & Access Governance (RBAC)</span>
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Administer security operators, end users, and device authorization scopes
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#00646e] hover:bg-[#00828f] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-[0_4px_16px_rgba(0,100,110,0.4)] hover:scale-105 active:scale-95 cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Provision New User</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="p-6 rounded-3xl bg-[#001032] border border-white/10 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-white">
            Registered Security Principals ({filteredUsers.length})
          </h3>

          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search user name, email, role..."
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
                <th className="py-3 px-3.5 rounded-l-lg">Principal</th>
                <th className="py-3 px-3.5">Email Address</th>
                <th className="py-3 px-3.5">Role</th>
                <th className="py-3 px-3.5">Status</th>
                <th className="py-3 px-3.5">Assigned Devices</th>
                <th className="py-3 px-3.5">Last Login</th>
                <th className="py-3 px-3.5 text-right rounded-r-lg">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#00646e] border border-[#00e5ff]/40 flex items-center justify-center font-bold text-white text-xs font-sans shadow-sm">
                        {user.name.charAt(0)}
                      </div>
                      <span className="font-bold text-white font-sans">{user.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3.5 text-slate-300">
                    {user.email}
                  </td>
                  <td className="py-3 px-3.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      user.role === 'ADMIN'
                        ? 'bg-[#00646e]/40 text-[#00e5ff] border border-[#00e5ff]/50'
                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-3.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      user.status === 'ACTIVE'
                        ? 'text-emerald-300 bg-emerald-950 border border-emerald-800'
                        : 'text-slate-400 bg-slate-900 border border-slate-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3 px-3.5">
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {user.assignedDevices.map((d) => (
                        <span key={d} className="px-2 py-0.5 rounded-md text-[10px] bg-[#000028] text-[#00e5ff] border border-white/10">
                          {d}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-3.5 text-slate-400 font-sans text-[11px]">
                    {user.lastLogin}
                  </td>
                  <td className="py-3 px-3.5 text-right">
                    <button
                      onClick={() => handleToggleStatus(user)}
                      className="p-1.5 rounded-lg bg-[#000028] hover:bg-white/10 text-slate-300 border border-white/10 transition-colors cursor-pointer"
                      title={user.status === 'ACTIVE' ? 'Disable Account' : 'Activate Account'}
                    >
                      <Power className={`w-3.5 h-3.5 ${user.status === 'ACTIVE' ? 'text-emerald-400' : 'text-slate-500'}`} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Provision User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-[#001032] border border-white/20 rounded-3xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#00e5ff]" />
                <span>Provision New Security Principal</span>
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1 font-mono">Full Legal Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Elena Rostova"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#000028] border border-white/15 text-white focus:border-[#00646e] outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1 font-mono">Corporate Email</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="name@iotsecurity.com"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#000028] border border-white/15 text-white focus:border-[#00646e] outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1 font-mono">System Role</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as UserRole)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#000028] border border-white/15 text-white focus:border-[#00646e] outline-none"
                >
                  <option value="USER">USER (Restricted Device Access)</option>
                  <option value="ADMIN">ADMIN (Full Security Operations Control)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5 font-mono">Assign Permitted IoT Devices</label>
                <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto pr-1">
                  {devices.map((dev) => {
                    const isChecked = selectedDeviceIds.includes(dev.deviceId);
                    return (
                      <div
                        key={dev.id}
                        onClick={() => toggleDeviceSelection(dev.deviceId)}
                        className={`p-2.5 rounded-xl border cursor-pointer flex items-center justify-between text-[11px] font-mono transition-all ${
                          isChecked
                            ? 'bg-[#00646e]/30 border-[#00e5ff] text-[#00e5ff]'
                            : 'bg-[#000028] border-white/10 text-slate-400 hover:border-white/20'
                        }`}
                      >
                        <span className="truncate">{dev.deviceId}</span>
                        {isChecked && <Check className="w-3.5 h-3.5 text-[#00e5ff]" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-full text-slate-400 hover:text-white border border-transparent hover:border-white/10 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-full bg-[#00646e] hover:bg-[#00828f] text-white font-bold uppercase tracking-wider cursor-pointer shadow-md"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
