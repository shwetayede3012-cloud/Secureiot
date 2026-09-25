import React, { useState, useEffect, useCallback } from 'react';
import { NetworkBackground } from './components/NetworkBackground';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { AnalysisSequenceModal } from './components/AnalysisSequenceModal';
import { AutomatedDemoModal } from './components/AutomatedDemoModal';
import { RemixGuideModal } from './components/RemixGuideModal';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { DeviceManagementPage } from './pages/DeviceManagementPage';
import { AccessRequestPage } from './pages/AccessRequestPage';
import { AiRiskAnalysisPage } from './pages/AiRiskAnalysisPage';
import { BlockchainDashboard } from './pages/BlockchainDashboard';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { UserManagementPage } from './pages/UserManagementPage';
import { UserDashboard } from './pages/UserDashboard';
import { SettingsPage } from './pages/SettingsPage';

// Types & Services
import { 
  UserAccount, 
  IoTDevice, 
  AccessRequest, 
  BlockchainTransaction, 
  NotificationItem, 
  ViewTab 
} from './types';
import { StorageService } from './services/storageService';

export default function App() {
  const [activeUser, setActiveUser] = useState<UserAccount | null>(() => {
    return StorageService.getActiveUser();
  });
  const [currentTab, setCurrentTab] = useState<ViewTab>('landing');

  // Core Data State
  const [devices, setDevices] = useState<IoTDevice[]>(() => StorageService.getDevices());
  const [accessLogs, setAccessLogs] = useState<AccessRequest[]>(() => StorageService.getAccessLogs());
  const [transactions, setTransactions] = useState<BlockchainTransaction[]>(() => StorageService.getBlockchainTxs());
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => StorageService.getNotifications());
  const [users, setUsers] = useState<UserAccount[]>(() => StorageService.getUsers());
  const [contractAddress, setContractAddress] = useState<string>(
  '0xd9145CCE52D386f254917e481eB44e9943F39138'
);
  // Preselected device for Access Request
  const [preselectedDevice, setPreselectedDevice] = useState<IoTDevice | null>(null);

  // Dashboard Theme State ('light' for soft white as requested, or 'dark')
  const [dashboardTheme, setDashboardTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('secureiot_dashboard_theme');
      if (saved === 'dark' || saved === 'light') return saved;
    } catch (e) {}
    return 'light'; // Default to "thoda white"
  });

  const handleToggleTheme = () => {
    setDashboardTheme(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      try {
        localStorage.setItem('secureiot_dashboard_theme', next);
      } catch (e) {}
      return next;
    });
  };

  // Modals state
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isRemixGuideOpen, setIsRemixGuideOpen] = useState(false);

  // 8-stage AI Analysis modal state
  const [analysisModalState, setAnalysisModalState] = useState<{
    isOpen: boolean;
    deviceId: string;
    resource: string;
    reason: string;
    resultData: any;
  }>({
    isOpen: false,
    deviceId: 'CCTV_01',
    resource: 'Security Camera Stream',
    reason: 'Routine surveillance check',
    resultData: null
  });

  const refreshAllData = useCallback(() => {
    setDevices(StorageService.getDevices());
    setAccessLogs(StorageService.getAccessLogs());
    setTransactions(StorageService.getBlockchainTxs());
    setNotifications(StorageService.getNotifications());
    setUsers(StorageService.getUsers());
    const currentUser = StorageService.getActiveUser();
    setActiveUser(currentUser);
  }, []);

  // Sync state periodically or on change
  useEffect(() => {
    const handleStorageChange = () => refreshAllData();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [refreshAllData]);

  // Role-based route guard
  const handleNavigate = (tab: ViewTab) => {
    // If not authenticated and trying to access private page
    if (!activeUser && tab !== 'landing' && tab !== 'login') {
      setCurrentTab('login');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Role-based protection: non-admins cannot access admin pages, redirect to Admin Login
    const adminOnlyTabs: ViewTab[] = ['admin-dashboard', 'users', 'analytics'];
    if (adminOnlyTabs.includes(tab) && (!activeUser || activeUser.role !== 'ADMIN')) {
      setCurrentTab('login');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSwitchUser = (userEmail: string) => {
    const matched = users.find(u => u.email.toLowerCase() === userEmail.toLowerCase());
    if (matched) {
      StorageService.setActiveUser(matched);
      setActiveUser(matched);
      if (matched.role === 'ADMIN') {
        setCurrentTab('admin-dashboard');
      } else {
        setCurrentTab('user-dashboard');
      }
      StorageService.addNotification({
        title: 'Role Switched',
        message: `Switched active profile to ${matched.name} (${matched.role}).`,
        type: 'info'
      });
      refreshAllData();
    }
  };

  const handleLogout = () => {
    StorageService.setActiveUser(null);
    setActiveUser(null);
    setCurrentTab('landing');
  };

  const handleLoginSuccess = (user: UserAccount) => {
    setActiveUser(user);
    refreshAllData();
    if (user.role === 'ADMIN') {
      setCurrentTab('admin-dashboard');
    } else {
      setCurrentTab('user-dashboard');
    }
  };

  const handleResetData = () => {
    if (confirm('Are you sure you want to reset all simulation data back to initial demo values?')) {
      StorageService.resetToFactoryDefaults();
      refreshAllData();
      setCurrentTab('admin-dashboard');
    }
  };

  const handleRequestAccessForDevice = (device: IoTDevice) => {
    setPreselectedDevice(device);
    setCurrentTab('access-request');
  };

  const handleInitiateAnalysis = (
    deviceId: string,
    resource: string,
    reason: string,
    result: any
  ) => {
    refreshAllData();
    setAnalysisModalState({
      isOpen: true,
      deviceId,
      resource,
      reason,
      resultData: result
    });
  };

  // Determine if full-screen mode (landing or login)
  const isFullScreenPage = currentTab === 'landing' || currentTab === 'login';

  return (
    <div className={`min-h-screen ${!isFullScreenPage && dashboardTheme === 'light' ? 'dashboard-light bg-[#f4f6fa] text-slate-900' : 'bg-[#000028] text-slate-100'} font-sans relative selection:bg-[#00646e] selection:text-white transition-colors duration-200`}>
      
      {/* Background Interactive Nodes Network (Visible on landing/login or in dark theme) */}
      {(isFullScreenPage || dashboardTheme === 'dark') && (
        <NetworkBackground />
      )}

      {/* Top Navigation Bar */}
      <Navbar
        activeUser={activeUser}
        notifications={notifications}
        onNavigate={handleNavigate}
        onSwitchUser={handleSwitchUser}
        onLogout={handleLogout}
        onOpenRemixGuide={() => setIsRemixGuideOpen(true)}
        onRunSimulationDemo={() => setIsDemoModalOpen(true)}
        currentTab={currentTab}
        dashboardTheme={dashboardTheme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Workspace Layout */}
      <div className={`relative z-10 flex min-h-[calc(100vh-4rem)] ${!isFullScreenPage && dashboardTheme === 'light' ? 'bg-[#f4f6fa]' : ''}`}>
        
        {/* Left Sidebar (Only visible when logged in & not on landing/login) */}
        {!isFullScreenPage && activeUser && (
          <Sidebar
            currentTab={currentTab}
            onNavigate={handleNavigate}
            activeUser={activeUser}
            onLogout={handleLogout}
            activeDeviceCount={devices.filter(d => d.status === 'ONLINE').length}
            dashboardTheme={dashboardTheme}
            onToggleTheme={handleToggleTheme}
          />
        )}

        {/* Page Content Viewport */}
        <main className={`flex-1 overflow-y-auto ${isFullScreenPage ? 'w-full p-0' : 'w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8'} ${!isFullScreenPage && dashboardTheme === 'light' ? 'text-slate-900 bg-[#f4f6fa]' : ''}`}>
          
          {currentTab === 'landing' && (
            <LandingPage
              onNavigate={handleNavigate}
              onRunSimulationDemo={() => setIsDemoModalOpen(true)}
              onOpenRemixGuide={() => setIsRemixGuideOpen(true)}
            />
          )}

          {currentTab === 'login' && (
            <LoginPage
              onLoginSuccess={handleLoginSuccess}
              onNavigate={handleNavigate}
            />
          )}

          {currentTab === 'admin-dashboard' && (
            <AdminDashboard
              devices={devices}
              accessLogs={accessLogs}
              transactions={transactions}
              onNavigate={handleNavigate}
              onRunSimulationDemo={() => setIsDemoModalOpen(true)}
              onRefreshData={refreshAllData}
              onRequestAccess={handleRequestAccessForDevice}
            />
          )}

          {currentTab === 'user-dashboard' && activeUser && (
            <UserDashboard
              activeUser={activeUser}
              devices={devices}
              accessLogs={accessLogs}
              onNavigate={handleNavigate}
              onRequestAccess={handleRequestAccessForDevice}
            />
          )}

          {currentTab === 'devices' && (
            <DeviceManagementPage
              devices={devices}
              onRefreshData={refreshAllData}
              onRequestAccessForDevice={handleRequestAccessForDevice}
              onNavigate={handleNavigate}
            />
          )}

          {currentTab === 'access-request' && (
            <AccessRequestPage
              devices={devices}
              activeUser={activeUser}
              preselectedDevice={preselectedDevice}
              onInitiateAnalysis={handleInitiateAnalysis}
              onNavigate={handleNavigate}
            />
          )}

          {currentTab === 'ai-risk' && (
            <AiRiskAnalysisPage />
          )}

          {currentTab === 'blockchain' && (
            <BlockchainDashboard
              transactions={transactions}
              accessLogs={accessLogs}
              contractAddress={contractAddress}
              onOpenRemixGuide={() => setIsRemixGuideOpen(true)}
              onNavigate={handleNavigate}
            />
          )}

          {currentTab === 'analytics' && (
            <AnalyticsPage
              devices={devices}
              accessLogs={accessLogs}
              transactions={transactions}
            />
          )}

          {currentTab === 'users' && (
            <UserManagementPage
              users={users}
              devices={devices}
              onRefreshData={refreshAllData}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsPage
              contractAddress={contractAddress}
              onUpdateContractAddress={setContractAddress}
              onResetData={handleResetData}
              onOpenRemixGuide={() => setIsRemixGuideOpen(true)}
              dashboardTheme={dashboardTheme}
              onToggleTheme={handleToggleTheme}
            />
          )}

        </main>
      </div>

      {/* 8-Stage Animated AI Sequence Modal */}
      <AnalysisSequenceModal
        isOpen={analysisModalState.isOpen}
        onClose={() => setAnalysisModalState(prev => ({ ...prev, isOpen: false }))}
        deviceId={analysisModalState.deviceId}
        resource={analysisModalState.resource}
        reason={analysisModalState.reason}
        resultData={analysisModalState.resultData}
        onComplete={refreshAllData}
      />

      {/* 4-Step Automated Security Scenario Modal */}
      <AutomatedDemoModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        onDataChanged={refreshAllData}
      />

      {/* Remix IDE & Solidity Integration Guide Modal */}
      <RemixGuideModal
        isOpen={isRemixGuideOpen}
        onClose={() => setIsRemixGuideOpen(false)}
        contractAddress={contractAddress}
        onUpdateContractAddress={setContractAddress}
      />

    </div>
  );
}
