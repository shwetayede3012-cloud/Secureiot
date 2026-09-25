export type DeviceStatus = 'ONLINE' | 'OFFLINE' | 'SUSPICIOUS' | 'BLOCKED';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export type AccessDecision = 'ALLOW' | 'LIMITED' | 'DENY';

export type UserRole = 'ADMIN' | 'USER';

export interface DeviceFeatures {
  device_trust: number;       // 0 - 100
  failed_attempts: number;    // integer count
  request_frequency: number;  // requests per min
  network_anomaly: number;    // 0 - 100 %
  time_anomaly: number;       // 0 - 100 %
  previous_behavior: number;  // 0 - 100 %
}

export interface IoTDevice {
  id: string;
  deviceId: string;
  deviceType: string;
  ipAddress: string;
  trustScore: number;
  riskScore: number;
  status: DeviceStatus;
  lastActivity: string;
  requestCount: number;
  assignedUserId?: string;
  location?: string;
  features: DeviceFeatures;
}

export interface AccessRequest {
  id: string;
  userId: string;
  userName: string;
  deviceId: string;
  resource: string;
  reason: string;
  riskScore: number;
  trustScore: number;
  decision: AccessDecision;
  reasons: string[];
  timestamp: string;
  transactionHash: string;
  blockNumber: number;
  prediction?: 'NORMAL' | 'SUSPICIOUS' | 'HIGH_RISK';
  probabilities?: {
    NORMAL: number;
    SUSPICIOUS: number;
    HIGH_RISK: number;
  };
}

export interface RiskAnalysisResult {
  id: string;
  deviceId: string;
  trustScore: number;
  riskScore: number;
  riskLevel: RiskLevel;
  decision: AccessDecision;
  confidence: number;
  explanation: string;
  reasons: string[];
  features: DeviceFeatures;
  timestamp: string;
  // ML Model Specific Attributes
  prediction?: 'NORMAL' | 'SUSPICIOUS' | 'HIGH_RISK';
  probabilities?: {
    NORMAL: number;
    SUSPICIOUS: number;
    HIGH_RISK: number;
  };
  reason?: string;
  risk_score?: number;
  trust_score?: number;
}

export interface BlockchainTransaction {
  id: string;
  transactionHash: string;
  deviceId: string;
  resource: string;
  riskScore: number;
  trustScore: number;
  decision: AccessDecision;
  blockNumber: number;
  status: 'Confirmed' | 'Pending' | 'Failed';
  timestamp: string;
  isSimulated: boolean;
  gasUsed: number;
  reason: string;
  contractAddress?: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'ACTIVE' | 'DISABLED';
  lastLogin: string;
  assignedDevices: string[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  timestamp: string;
  read: boolean;
  deviceId?: string;
}

export type ViewTab = 
  | 'landing'
  | 'login'
  | 'admin-dashboard'
  | 'user-dashboard'
  | 'devices'
  | 'access-request'
  | 'ai-risk'
  | 'blockchain'
  | 'analytics'
  | 'users'
  | 'settings';
