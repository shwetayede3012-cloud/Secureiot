from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from enum import Enum
from datetime import datetime

class DeviceStatus(str, Enum):
    ONLINE = "ONLINE"
    OFFLINE = "OFFLINE"
    SUSPICIOUS = "SUSPICIOUS"
    BLOCKED = "BLOCKED"

class RiskLevel(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"

class AccessDecision(str, Enum):
    ALLOW = "ALLOW"
    LIMITED = "LIMITED"
    DENY = "DENY"

class UserRole(str, Enum):
    ADMIN = "ADMIN"
    USER = "USER"

class IoTDevice(BaseModel):
    id: str
    device_id: str
    device_type: str
    ip_address: str
    trust_score: float = Field(..., ge=0, le=100)
    risk_score: float = Field(..., ge=0, le=100)
    status: DeviceStatus
    last_activity: str
    request_count: int = 0
    assigned_user_id: Optional[str] = None
    features: Optional[Dict[str, Any]] = None

class DeviceFeatures(BaseModel):
    device_trust: float = Field(..., ge=0, le=100)
    failed_attempts: int = Field(..., ge=0)
    request_frequency: float = Field(..., ge=0)  # requests per minute
    network_anomaly: float = Field(..., ge=0, le=100) # score %
    time_anomaly: float = Field(..., ge=0, le=100) # score %
    previous_behavior: float = Field(..., ge=0, le=100) # score %

class AccessRequestCreate(BaseModel):
    user_id: str
    device_id: str
    resource: str
    reason: str

class RiskAnalysisResult(BaseModel):
    prediction: str
    risk_score: int
    trust_score: int
    decision: AccessDecision
    probabilities: Dict[str, float]
    reason: str
    reasons: Optional[List[str]] = None
    explanation: Optional[str] = None
    risk_level: Optional[RiskLevel] = None
    confidence: Optional[float] = None
    features: Optional[Dict[str, Any]] = None
    id: Optional[str] = None
    deviceId: Optional[str] = None
    timestamp: Optional[str] = None

class BlockchainTransaction(BaseModel):
    id: str
    transaction_hash: str
    device_id: str
    resource: str
    risk_score: float
    trust_score: float
    decision: AccessDecision
    block_number: int
    status: str
    timestamp: str
    is_simulated: bool = True
    contract_address: Optional[str] = None
    gas_used: Optional[int] = None
    reason: Optional[str] = None

class ActivitySimulationRequest(BaseModel):
    device_id: str
    activity_type: str  # "NORMAL", "SUSPICIOUS", "HIGH_RISK"
