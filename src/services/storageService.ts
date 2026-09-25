import { 
  IoTDevice, 
  AccessRequest, 
  BlockchainTransaction, 
  NotificationItem, 
  UserAccount,
  AccessDecision,
  RiskAnalysisResult,
  DeviceStatus
} from '../types';
import { 
  INITIAL_DEVICES, 
  INITIAL_USERS, 
  INITIAL_ACCESS_LOGS, 
  INITIAL_TRANSACTIONS, 
  INITIAL_NOTIFICATIONS 
} from '../data/initialData';
import { IoTRiskAIEngine, AiEngine } from './aiEngine';
import { BlockchainService } from './blockchainService';

const STORAGE_KEYS = {
  DEVICES: 'secureiot_devices_v1',
  USERS: 'secureiot_users_v1',
  LOGS: 'secureiot_access_logs_v1',
  TXS: 'secureiot_blockchain_txs_v1',
  NOTIFICATIONS: 'secureiot_notifications_v1',
  CURRENT_USER: 'secureiot_active_user_v1'
};

export class StorageService {
  public static getDevices(): IoTDevice[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.DEVICES);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    this.saveDevices(INITIAL_DEVICES);
    return INITIAL_DEVICES;
  }

  public static saveDevices(devices: IoTDevice[]): void {
    localStorage.setItem(STORAGE_KEYS.DEVICES, JSON.stringify(devices));
  }

  public static getDevice(deviceId: string): IoTDevice | undefined {
    const devices = this.getDevices();
    return devices.find(d => d.deviceId === deviceId);
  }

  public static addDevice(device: Omit<IoTDevice, 'id' | 'requestCount' | 'lastActivity'>): IoTDevice {
    const devices = this.getDevices();
    const newDevice: IoTDevice = {
      ...device,
      id: `dev_${Date.now()}`,
      requestCount: 0,
      lastActivity: 'Just added'
    };
    devices.unshift(newDevice);
    this.saveDevices(devices);
    this.addNotification({
      title: 'New Device Registered',
      message: `${newDevice.deviceId} (${newDevice.deviceType}) connected at ${newDevice.ipAddress}.`,
      type: 'info',
      deviceId: newDevice.deviceId
    });
    return newDevice;
  }

  public static updateDevice(idOrDeviceId: string, updates: Partial<IoTDevice>): void {
    const devices = this.getDevices().map(d => {
      if (d.id === idOrDeviceId || d.deviceId === idOrDeviceId) {
        return { ...d, ...updates };
      }
      return d;
    });
    this.saveDevices(devices);
  }

  public static deleteDevice(idOrDeviceId: string): void {
    const devices = this.getDevices().filter(d => d.id !== idOrDeviceId && d.deviceId !== idOrDeviceId);
    this.saveDevices(devices);
    this.addNotification({
      title: 'Device Removed',
      message: `Device was deleted from the IoT fleet.`,
      type: 'warning'
    });
  }

  public static removeDevice(deviceId: string): void {
    this.deleteDevice(deviceId);
  }

  public static updateDeviceStatus(deviceId: string, status: DeviceStatus): void {
    const devices = this.getDevices().map(d => {
      if (d.deviceId === deviceId) {
        return { ...d, status, lastActivity: 'Status changed' };
      }
      return d;
    });
    this.saveDevices(devices);
  }

  /**
   * Generates realistic IoT behavioral patterns:
   * NORMAL: Trust 90-100, low failed requests, normal frequency, low anomaly
   * SUSPICIOUS: Trust 40-70, multiple failed requests, higher frequency, medium anomaly
   * HIGH-RISK: Trust 0-30, many failed requests, very high frequency, high anomaly
   */
  public static simulateDeviceActivity(
    deviceId: string, 
    type: 'NORMAL' | 'SUSPICIOUS' | 'HIGH_RISK'
  ): { device: IoTDevice; evalResult: RiskAnalysisResult } {
    const devices = this.getDevices();
    const index = devices.findIndex(d => d.deviceId === deviceId);
    if (index === -1) throw new Error(`Device ${deviceId} not found`);

    const dev = { ...devices[index] };

    if (type === 'NORMAL') {
      const generatedTrust = Math.floor(Math.random() * 8) + 92; // 92 - 100
      dev.features = {
        device_trust: generatedTrust,
        failed_attempts: Math.random() > 0.85 ? 1 : 0,
        request_frequency: Math.round((Math.random() * 4 + 3) * 10) / 10,
        network_anomaly: Math.round((Math.random() * 4 + 1) * 10) / 10,
        time_anomaly: Math.round((Math.random() * 3 + 1) * 10) / 10,
        previous_behavior: Math.floor(Math.random() * 6) + 94
      };
    } else if (type === 'SUSPICIOUS') {
      const generatedTrust = Math.floor(Math.random() * 21) + 45; // 45 - 65
      dev.features = {
        device_trust: generatedTrust,
        failed_attempts: Math.floor(Math.random() * 3) + 3, // 3 - 5
        request_frequency: Math.round((Math.random() * 15 + 22) * 10) / 10, // 22 - 37
        network_anomaly: Math.round((Math.random() * 20 + 38) * 10) / 10, // 38 - 58%
        time_anomaly: Math.round((Math.random() * 20 + 30) * 10) / 10,
        previous_behavior: Math.floor(Math.random() * 15) + 55
      };
    } else {
      // HIGH_RISK
      const generatedTrust = Math.floor(Math.random() * 16) + 12; // 12 - 27
      dev.features = {
        device_trust: generatedTrust,
        failed_attempts: Math.floor(Math.random() * 6) + 8, // 8 - 13
        request_frequency: Math.round((Math.random() * 40 + 75) * 10) / 10, // 75 - 115 req/min
        network_anomaly: Math.round((Math.random() * 15 + 80) * 10) / 10, // 80 - 95%
        time_anomaly: Math.round((Math.random() * 20 + 70) * 10) / 10,
        previous_behavior: Math.floor(Math.random() * 15) + 18
      };
    }

    dev.lastActivity = 'Just now';
    dev.requestCount += 1;

    // Run real ML evaluation on the generated features
    const evalResult = IoTRiskAIEngine.evaluateRisk(dev.deviceId, dev.features);
    dev.riskScore = evalResult.riskScore;
    dev.trustScore = evalResult.trustScore;

    // Adaptive policy application:
    // 0 - 30 -> ALLOW (ONLINE)
    // 31 - 60 -> LIMITED (SUSPICIOUS)
    // 61 - 100 -> DENY (BLOCKED)
    if (evalResult.decision === 'DENY') {
      dev.status = 'BLOCKED';
    } else if (evalResult.decision === 'LIMITED') {
      dev.status = 'SUSPICIOUS';
    } else {
      dev.status = 'ONLINE';
    }

    devices[index] = dev;
    this.saveDevices(devices);

    // Asynchronously notify backend simulation endpoint if active
    fetch('/api/devices/simulate-activity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        device_id: deviceId,
        activity_type: type
      })
    }).catch(() => {});

    // Notify
    if (type === 'HIGH_RISK') {
      this.addNotification({
        title: 'High-Risk Activity Detected',
        message: `${deviceId} exhibited abnormal request frequency and severe network anomalies. Status set to BLOCKED.`,
        type: 'error',
        deviceId
      });
    } else if (type === 'SUSPICIOUS') {
      this.addNotification({
        title: 'Suspicious Behavior Flagged',
        message: `${deviceId} generated multiple failed authentication requests. Trust degraded to ${dev.trustScore}.`,
        type: 'warning',
        deviceId
      });
    } else {
      this.addNotification({
        title: 'Normal Activity Verified',
        message: `${deviceId} telemetry stabilized. Trust score restored to ${dev.trustScore}.`,
        type: 'success',
        deviceId
      });
    }

    return { device: dev, evalResult };
  }

  // Access Requests & Blockchain Integration
  public static getAccessLogs(): AccessRequest[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.LOGS);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    this.saveAccessLogs(INITIAL_ACCESS_LOGS);
    return INITIAL_ACCESS_LOGS;
  }

  public static saveAccessLogs(logs: AccessRequest[]): void {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
  }

  public static getBlockchainTxs(): BlockchainTransaction[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TXS);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    this.saveBlockchainTxs(INITIAL_TRANSACTIONS);
    return INITIAL_TRANSACTIONS;
  }

  public static saveBlockchainTxs(txs: BlockchainTransaction[]): void {
    localStorage.setItem(STORAGE_KEYS.TXS, JSON.stringify(txs));
  }

  public static async processAccessRequest(
    userId: string,
    userName: string,
    deviceId: string,
    resource: string,
    reason: string
  ): Promise<{ 
    request: AccessRequest; 
    transaction: BlockchainTransaction;
    evalResult: RiskAnalysisResult;
    device: IoTDevice 
  }> {
    const devices = this.getDevices();
    const devIndex = devices.findIndex(d => d.deviceId === deviceId);
    if (devIndex === -1) throw new Error('Device not found');

    const device = devices[devIndex];

    // 1. AI Risk Analysis through real Random Forest ML pipeline
    const evalResult = await AiEngine.analyzeRiskApi({
      deviceId,
      device_trust: device.features.device_trust,
      failed_attempts: device.features.failed_attempts,
      request_frequency: device.features.request_frequency,
      network_anomaly: device.features.network_anomaly,
      time_anomaly: device.features.time_anomaly,
      previous_behavior: device.features.previous_behavior
    });

    // 2. Adaptive Access Control Policy Update
    device.trustScore = evalResult.trustScore;
    device.riskScore = evalResult.riskScore;
    device.requestCount += 1;
    device.lastActivity = 'Just now';

    if (evalResult.decision === 'DENY') {
      device.status = 'BLOCKED';
    } else if (evalResult.decision === 'LIMITED') {
      device.status = 'SUSPICIOUS';
    } else {
      device.status = 'ONLINE';
    }
    devices[devIndex] = device;
    this.saveDevices(devices);

    // 3. Smart Contract / Blockchain Logging
    const transaction = await BlockchainService.recordAccessOnChain(
      deviceId,
      resource,
      evalResult.riskScore,
      evalResult.trustScore,
      evalResult.decision,
      evalResult.reason || evalResult.explanation
    );

    const txs = this.getBlockchainTxs();
    txs.unshift(transaction);
    this.saveBlockchainTxs(txs);

    // 4. Record Access Log
    const newLog: AccessRequest = {
      id: `req_${Date.now()}`,
      userId,
      userName,
      deviceId,
      resource,
      reason,
      riskScore: evalResult.riskScore,
      trustScore: evalResult.trustScore,
      decision: evalResult.decision,
      reasons: evalResult.reasons,
      prediction: evalResult.prediction,
      probabilities: evalResult.probabilities,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      transactionHash: transaction.transactionHash,
      blockNumber: transaction.blockNumber
    };

    const logs = this.getAccessLogs();
    logs.unshift(newLog);
    this.saveAccessLogs(logs);

    // 5. Notify
    const decisionColor = evalResult.decision === 'ALLOW' ? 'success' : evalResult.decision === 'LIMITED' ? 'warning' : 'error';
    this.addNotification({
      title: `Access ${evalResult.decision}: ${deviceId}`,
      message: `Request for ${resource} decided as ${evalResult.decision} (Risk: ${evalResult.riskScore}). Block #${transaction.blockNumber}.`,
      type: decisionColor,
      deviceId
    });

    return {
      request: newLog,
      transaction,
      evalResult,
      device
    };
  }

  // Notifications
  public static getNotifications(): NotificationItem[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    this.saveNotifications(INITIAL_NOTIFICATIONS);
    return INITIAL_NOTIFICATIONS;
  }

  public static saveNotifications(notifs: NotificationItem[]): void {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
  }

  public static addNotification(item: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>): void {
    const notifs = this.getNotifications();
    const newNotif: NotificationItem = {
      ...item,
      id: `notif_${Date.now()}`,
      timestamp: 'Just now',
      read: false
    };
    notifs.unshift(newNotif);
    this.saveNotifications(notifs.slice(0, 30));
  }

  public static markAllNotificationsRead(): void {
    const notifs = this.getNotifications().map(n => ({ ...n, read: true }));
    this.saveNotifications(notifs);
  }

  // User Accounts
  public static getUsers(): UserAccount[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USERS);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    this.saveUsers(INITIAL_USERS);
    return INITIAL_USERS;
  }

  public static saveUsers(users: UserAccount[]): void {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }

  public static addUser(user: Omit<UserAccount, 'id'>): UserAccount {
    const users = this.getUsers();
    const newUser: UserAccount = {
      ...user,
      id: `usr_${Date.now()}`
    };
    users.push(newUser);
    this.saveUsers(users);
    this.addNotification({
      title: 'New User Provisioned',
      message: `${newUser.name} (${newUser.role}) was added to the access list.`,
      type: 'info'
    });
    return newUser;
  }

  public static updateUser(userId: string, updates: Partial<UserAccount>): void {
    const users = this.getUsers().map(u => {
      if (u.id === userId) {
        return { ...u, ...updates };
      }
      return u;
    });
    this.saveUsers(users);
  }

  public static toggleUserStatus(userId: string): void {
    const users = this.getUsers().map(u => {
      if (u.id === userId) {
        return { ...u, status: (u.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE') as any };
      }
      return u;
    });
    this.saveUsers(users);
  }

  public static getActiveUser(): UserAccount | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (stored && stored !== 'null' && stored !== 'undefined') {
        return JSON.parse(stored);
      }
    } catch (e) {}
    return null; // Unauthenticated by default: prompts Admin Login when accessing SOC
  }

  public static setActiveUser(user: UserAccount | null): void {
    if (!user) {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    } else {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    }
  }

  public static resetToFactoryDefaults(): void {
    localStorage.removeItem(STORAGE_KEYS.DEVICES);
    localStorage.removeItem(STORAGE_KEYS.LOGS);
    localStorage.removeItem(STORAGE_KEYS.TXS);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    localStorage.removeItem(STORAGE_KEYS.USERS);
    this.saveDevices(INITIAL_DEVICES);
    this.saveUsers(INITIAL_USERS);
    this.saveAccessLogs(INITIAL_ACCESS_LOGS);
    this.saveBlockchainTxs(INITIAL_TRANSACTIONS);
    this.saveNotifications(INITIAL_NOTIFICATIONS);
    this.setActiveUser(null);
  }
}
