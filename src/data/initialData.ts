import { IoTDevice, UserAccount, AccessRequest, BlockchainTransaction, NotificationItem } from '../types';

export const INITIAL_USERS: UserAccount[] = [
  {
    id: 'usr_admin',
    name: 'Chief Security Officer',
    email: 'admin@iotsecurity.com',
    role: 'ADMIN',
    status: 'ACTIVE',
    lastLogin: 'Today, 10:45 AM',
    assignedDevices: ['CCTV_01', 'CCTV_02', 'SmartDoor_01', 'MotionSensor_01', 'Temperature_01']
  },
  {
    id: 'usr_user',
    name: 'Dr. Sarah Jenkins',
    email: 'user@iotsecurity.com',
    role: 'USER',
    status: 'ACTIVE',
    lastLogin: 'Today, 11:30 AM',
    assignedDevices: ['CCTV_01', 'Temperature_01', 'AirQuality_01']
  },
  {
    id: 'usr_03',
    name: 'Marcus Vance',
    email: 'm.vance@facility.org',
    role: 'USER',
    status: 'ACTIVE',
    lastLogin: 'Yesterday, 04:12 PM',
    assignedDevices: ['MotionSensor_01', 'SmartDoor_01']
  },
  {
    id: 'usr_04',
    name: 'Elena Rostova',
    email: 'e.rostova@lab.ac.uk',
    role: 'USER',
    status: 'ACTIVE',
    lastLogin: '3 days ago',
    assignedDevices: ['SmartHVAC_01', 'AirQuality_01']
  },
  {
    id: 'usr_05',
    name: 'Guest Auditor',
    email: 'auditor@cybersec.io',
    role: 'USER',
    status: 'DISABLED',
    lastLogin: '1 week ago',
    assignedDevices: []
  }
];

export const INITIAL_DEVICES: IoTDevice[] = [
  {
    id: 'dev_01',
    deviceId: 'CCTV_01',
    deviceType: 'Security Camera',
    ipAddress: '192.168.1.101',
    trustScore: 92,
    riskScore: 8,
    status: 'ONLINE',
    lastActivity: 'Just now',
    requestCount: 154,
    assignedUserId: 'usr_user',
    location: 'Building A - North Entrance',
    features: {
      device_trust: 92,
      failed_attempts: 0,
      request_frequency: 4.5,
      network_anomaly: 3.2,
      time_anomaly: 2.1,
      previous_behavior: 96
    }
  },
  {
    id: 'dev_02',
    deviceId: 'CCTV_02',
    deviceType: 'Security Camera',
    ipAddress: '192.168.1.102',
    trustScore: 88,
    riskScore: 12,
    status: 'ONLINE',
    lastActivity: '2 mins ago',
    requestCount: 112,
    assignedUserId: 'usr_admin',
    location: 'Server Room Corridor',
    features: {
      device_trust: 88,
      failed_attempts: 1,
      request_frequency: 6.0,
      network_anomaly: 6.5,
      time_anomaly: 4.8,
      previous_behavior: 91
    }
  },
  {
    id: 'dev_03',
    deviceId: 'Temperature_01',
    deviceType: 'Environmental Sensor',
    ipAddress: '192.168.1.103',
    trustScore: 96,
    riskScore: 4,
    status: 'ONLINE',
    lastActivity: '1 min ago',
    requestCount: 340,
    assignedUserId: 'usr_user',
    location: 'Cold Storage Room 3',
    features: {
      device_trust: 96,
      failed_attempts: 0,
      request_frequency: 1.8,
      network_anomaly: 1.5,
      time_anomaly: 1.0,
      previous_behavior: 98
    }
  },
  {
    id: 'dev_04',
    deviceId: 'MotionSensor_01',
    deviceType: 'PIR Motion Detector',
    ipAddress: '192.168.1.104',
    trustScore: 52,
    riskScore: 48,
    status: 'SUSPICIOUS',
    lastActivity: '4 mins ago',
    requestCount: 94,
    assignedUserId: 'usr_03',
    location: 'Restricted Vault Lobby',
    features: {
      device_trust: 52,
      failed_attempts: 4,
      request_frequency: 28.5,
      network_anomaly: 46.0,
      time_anomaly: 36.0,
      previous_behavior: 58
    }
  },
  {
    id: 'dev_05',
    deviceId: 'SmartDoor_01',
    deviceType: 'Access Control Lock',
    ipAddress: '192.168.1.105',
    trustScore: 18,
    riskScore: 82,
    status: 'BLOCKED',
    lastActivity: '8 mins ago',
    requestCount: 62,
    assignedUserId: 'usr_03',
    location: 'Main Datacenter AirLock',
    features: {
      device_trust: 18,
      failed_attempts: 9,
      request_frequency: 84.0,
      network_anomaly: 88.0,
      time_anomaly: 76.0,
      previous_behavior: 21
    }
  },
  {
    id: 'dev_06',
    deviceId: 'AirQuality_01',
    deviceType: 'Particulate Air Sensor',
    ipAddress: '192.168.1.106',
    trustScore: 91,
    riskScore: 9,
    status: 'ONLINE',
    lastActivity: '3 mins ago',
    requestCount: 198,
    assignedUserId: 'usr_user',
    location: 'Bio-Safety Cleanroom',
    features: {
      device_trust: 91,
      failed_attempts: 0,
      request_frequency: 3.2,
      network_anomaly: 4.8,
      time_anomaly: 3.5,
      previous_behavior: 93
    }
  },
  {
    id: 'dev_07',
    deviceId: 'SmartLight_01',
    deviceType: 'Facility Illumination',
    ipAddress: '192.168.1.107',
    trustScore: 94,
    riskScore: 6,
    status: 'ONLINE',
    lastActivity: '7 mins ago',
    requestCount: 78,
    assignedUserId: 'usr_admin',
    location: 'Floor 2 Executive Suite',
    features: {
      device_trust: 94,
      failed_attempts: 0,
      request_frequency: 1.2,
      network_anomaly: 2.8,
      time_anomaly: 2.0,
      previous_behavior: 95
    }
  },
  {
    id: 'dev_08',
    deviceId: 'WaterSensor_01',
    deviceType: 'Leak & Flow Monitor',
    ipAddress: '192.168.1.108',
    trustScore: 89,
    riskScore: 11,
    status: 'ONLINE',
    lastActivity: '11 mins ago',
    requestCount: 65,
    assignedUserId: 'usr_admin',
    location: 'Basement Utility Well',
    features: {
      device_trust: 89,
      failed_attempts: 0,
      request_frequency: 1.0,
      network_anomaly: 3.5,
      time_anomaly: 2.5,
      previous_behavior: 91
    }
  },
  {
    id: 'dev_09',
    deviceId: 'SmartHVAC_01',
    deviceType: 'Climate Controller',
    ipAddress: '192.168.1.109',
    trustScore: 86,
    riskScore: 14,
    status: 'ONLINE',
    lastActivity: '15 mins ago',
    requestCount: 142,
    assignedUserId: 'usr_04',
    location: 'Rooftop Plant HVAC A',
    features: {
      device_trust: 86,
      failed_attempts: 1,
      request_frequency: 5.0,
      network_anomaly: 8.0,
      time_anomaly: 6.0,
      previous_behavior: 87
    }
  },
  {
    id: 'dev_10',
    deviceId: 'GateController_01',
    deviceType: 'Perimeter Barrier',
    ipAddress: '192.168.1.110',
    trustScore: 48,
    riskScore: 52,
    status: 'SUSPICIOUS',
    lastActivity: '18 mins ago',
    requestCount: 88,
    assignedUserId: 'usr_admin',
    location: 'Vehicular Outer Gate',
    features: {
      device_trust: 48,
      failed_attempts: 3,
      request_frequency: 31.0,
      network_anomaly: 52.0,
      time_anomaly: 44.0,
      previous_behavior: 55
    }
  }
];

export const AVAILABLE_RESOURCES = [
  { id: 'Security Camera', name: 'Security Camera Feed (HD)', riskBase: 10, description: 'Live RTSP stream from encrypted IP camera sensors' },
  { id: 'Security Dashboard', name: 'Security Operations Dashboard', riskBase: 15, description: 'Central telemetry controls and active alarms interface' },
  { id: 'Temperature Data', name: 'Temperature & Climate Logs', riskBase: 5, description: 'Environmental metrics and cryogenic thresholds' },
  { id: 'Building Door', name: 'Smart Building Door Lock', riskBase: 25, description: 'Electronic biometric latch for physical perimeter access' },
  { id: 'Motion Data', name: 'Infrared Motion Telemetry', riskBase: 8, description: 'Real-time occupancy and motion vectors' },
  { id: 'Analytics System', name: 'Predictive Analytics Node', riskBase: 20, description: 'Deep learning historical anomaly intelligence database' }
];

// 50 historical access logs to demonstrate realistic log patterns
export const INITIAL_ACCESS_LOGS: AccessRequest[] = [
  {
    id: 'req_101',
    userId: 'usr_user',
    userName: 'Dr. Sarah Jenkins',
    deviceId: 'CCTV_01',
    resource: 'Security Camera',
    reason: 'Scheduled perimeter security audit',
    riskScore: 8,
    trustScore: 92,
    decision: 'ALLOW',
    reasons: ['Device behavior conforms to baseline security policy'],
    timestamp: '2026-09-18 11:20:14 UTC',
    transactionHash: '0x8f31b7a2d48e24c5819d9b642e88a0319ca7819e913a452179b8a1c97a8921f0',
    blockNumber: 18492001
  },
  {
    id: 'req_102',
    userId: 'usr_admin',
    userName: 'Chief Security Officer',
    deviceId: 'SmartDoor_01',
    resource: 'Building Door',
    reason: 'Emergency server room maintenance',
    riskScore: 82,
    trustScore: 18,
    decision: 'DENY',
    reasons: ['High failed request count (9 attempts)', 'Abnormal request frequency (84.0 req/min)', 'Network anomaly detected (88.0%)'],
    timestamp: '2026-09-18 11:15:02 UTC',
    transactionHash: '0x1c449e7b231189ac056f7e8a9310d54a20b784c01e3894aa72bc3190df6210b3',
    blockNumber: 18492002
  },
  {
    id: 'req_103',
    userId: 'usr_03',
    userName: 'Marcus Vance',
    deviceId: 'MotionSensor_01',
    resource: 'Motion Data',
    reason: 'Vault occupancy verification',
    riskScore: 48,
    trustScore: 52,
    decision: 'LIMITED',
    reasons: ['Abnormal request frequency (28.5 req/min)', 'Network anomaly detected (46.0%)'],
    timestamp: '2026-09-18 11:08:44 UTC',
    transactionHash: '0x7b925a1e847c2039ab184dd630129c546e1074a83bf81992ec01a742881b94ea',
    blockNumber: 18492003
  },
  {
    id: 'req_104',
    userId: 'usr_user',
    userName: 'Dr. Sarah Jenkins',
    deviceId: 'Temperature_01',
    resource: 'Temperature Data',
    reason: 'Cold storage validation check',
    riskScore: 4,
    trustScore: 96,
    decision: 'ALLOW',
    reasons: ['Device behavior conforms to baseline security policy'],
    timestamp: '2026-09-18 10:55:19 UTC',
    transactionHash: '0x4389ae028b12f458c92134aa8820f45138bcda09156ef4821a37c940b492019a',
    blockNumber: 18492004
  },
  {
    id: 'req_105',
    userId: 'usr_admin',
    userName: 'Chief Security Officer',
    deviceId: 'GateController_01',
    resource: 'Security Dashboard',
    reason: 'Perimeter status polling',
    riskScore: 52,
    trustScore: 48,
    decision: 'LIMITED',
    reasons: ['Network anomaly detected (52.0%)', 'Low device trust score (48.0/100)'],
    timestamp: '2026-09-18 10:41:30 UTC',
    transactionHash: '0x99238e1a674d8123bc4501ef9028ac45129487c01bfe541289cb129402a71029',
    blockNumber: 18492005
  },
  {
    id: 'req_106',
    userId: 'usr_user',
    userName: 'Dr. Sarah Jenkins',
    deviceId: 'AirQuality_01',
    resource: 'Analytics System',
    reason: 'Hourly air filtration review',
    riskScore: 9,
    trustScore: 91,
    decision: 'ALLOW',
    reasons: ['Device behavior conforms to baseline security policy'],
    timestamp: '2026-09-18 10:30:11 UTC',
    transactionHash: '0x3281fa09c84918237eab10294bcdaef19047289bcaef102948cba0194827cfa1',
    blockNumber: 18492006
  },
  {
    id: 'req_107',
    userId: 'usr_admin',
    userName: 'Chief Security Officer',
    deviceId: 'CCTV_02',
    resource: 'Security Camera',
    reason: 'Server corridor visual check',
    riskScore: 12,
    trustScore: 88,
    decision: 'ALLOW',
    reasons: ['Device behavior conforms to baseline security policy'],
    timestamp: '2026-09-18 10:14:50 UTC',
    transactionHash: '0x55018bca92837482910fae10928347ba0192847cba019247cba0192847c10294',
    blockNumber: 18492007
  },
  {
    id: 'req_108',
    userId: 'usr_04',
    userName: 'Elena Rostova',
    deviceId: 'SmartHVAC_01',
    resource: 'Temperature Data',
    reason: 'Cleanroom humidity regulation',
    riskScore: 14,
    trustScore: 86,
    decision: 'ALLOW',
    reasons: ['Device behavior conforms to baseline security policy'],
    timestamp: '2026-09-18 09:55:00 UTC',
    transactionHash: '0x661928abce0918237481920cae0192847cbfa0192847cba0192847c0192847ab',
    blockNumber: 18492008
  },
  {
    id: 'req_109',
    userId: 'usr_admin',
    userName: 'Chief Security Officer',
    deviceId: 'SmartLight_01',
    resource: 'Security Dashboard',
    reason: 'Floor lighting schedule verification',
    riskScore: 6,
    trustScore: 94,
    decision: 'ALLOW',
    reasons: ['Device behavior conforms to baseline security policy'],
    timestamp: '2026-09-18 09:30:22 UTC',
    transactionHash: '0x7782910fcae0918237481920394827cba0192847cba0192847c0192847c1029a',
    blockNumber: 18492009
  },
  {
    id: 'req_110',
    userId: 'usr_admin',
    userName: 'Chief Security Officer',
    deviceId: 'WaterSensor_01',
    resource: 'Analytics System',
    reason: 'Utility flow diagnostic audit',
    riskScore: 11,
    trustScore: 89,
    decision: 'ALLOW',
    reasons: ['Device behavior conforms to baseline security policy'],
    timestamp: '2026-09-18 09:10:05 UTC',
    transactionHash: '0x889102938472910384729103847291038472910384729103847291038472910b',
    blockNumber: 18492010
  }
];

// Generate synthetic historical transactions
export const INITIAL_TRANSACTIONS: BlockchainTransaction[] = INITIAL_ACCESS_LOGS.map((log) => ({
  id: `tx_${log.id}`,
  transactionHash: log.transactionHash,
  deviceId: log.deviceId,
  resource: log.resource,
  riskScore: log.riskScore,
  trustScore: log.trustScore,
  decision: log.decision,
  blockNumber: log.blockNumber,
  status: 'Confirmed',
  timestamp: log.timestamp,
  isSimulated: true,
  gasUsed: 64200 + Math.floor(Math.random() * 8000),
  reason: log.reasons[0] || 'Smart contract verification completed',
  contractAddress: '0xd9145CCE52D386f254917e481eB44E9943F39138'
}));

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_01',
    title: 'High Risk Alert',
    message: 'SmartDoor_01 generated unusual activity and was denied access.',
    type: 'error',
    timestamp: '8 mins ago',
    read: false,
    deviceId: 'SmartDoor_01'
  },
  {
    id: 'notif_02',
    title: 'Suspicious Device Flagged',
    message: 'MotionSensor_01 trust score decreased to 52. Limited policy applied.',
    type: 'warning',
    timestamp: '15 mins ago',
    read: false,
    deviceId: 'MotionSensor_01'
  },
  {
    id: 'notif_03',
    title: 'Blockchain Confirmed',
    message: 'Access record for CCTV_01 securely logged in Block #18492001.',
    type: 'success',
    timestamp: '28 mins ago',
    read: true,
    deviceId: 'CCTV_01'
  },
  {
    id: 'notif_04',
    title: 'AI Classifier Synchronized',
    message: 'Random Forest risk boundary weights loaded with 97.4% test accuracy.',
    type: 'info',
    timestamp: '1 hour ago',
    read: true
  }
];
