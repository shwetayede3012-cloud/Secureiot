"""
AI-Driven Adaptive Access Control for Blockchain-Based IoT Networks
===================================================================
FastAPI Backend Server providing:
- Real scikit-learn Random Forest model inference & training
- Transparent 0-100 risk score and dynamic trust score calculation
- Zero-Trust 3-Tier Access Policy Engine:
    0 - 30   -> ALLOW
    31 - 60  -> LIMITED
    61 - 100 -> DENY
- IoT Fleet Behavioral Telemetry Simulation
- Cryptographic / Blockchain Access Log Ledger Integration
"""
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any, Optional
from datetime import datetime
import uuid
import time
import os

try:
    from backend.models import (
        IoTDevice, DeviceStatus, RiskLevel, AccessDecision,
        DeviceFeatures, AccessRequestCreate, RiskAnalysisResult,
        BlockchainTransaction, ActivitySimulationRequest
    )
    from backend.ai.model import ai_classifier
except ImportError:
    from models import (
        IoTDevice, DeviceStatus, RiskLevel, AccessDecision,
        DeviceFeatures, AccessRequestCreate, RiskAnalysisResult,
        BlockchainTransaction, ActivitySimulationRequest
    )
    from ai.model import ai_classifier

app = FastAPI(
    title="AI-Driven Adaptive Access Control for Blockchain-Based IoT Networks",
    description="Adaptive Access Control and Real Random Forest Evaluation for IoT Networks",
    version="2.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Fleet in-memory state with the 6 core features
DEVICES_DB: Dict[str, Dict[str, Any]] = {
    "CCTV_01": {
        "id": "dev_01",
        "device_id": "CCTV_01",
        "device_type": "Surveillance Camera",
        "ip_address": "192.168.1.101",
        "trust_score": 92,
        "risk_score": 8,
        "status": "ONLINE",
        "last_activity": "Just now",
        "request_count": 142,
        "assigned_user_id": "usr_02",
        "features": {
            "device_trust": 92.0,
            "failed_attempts": 0,
            "request_frequency": 4.5,
            "network_anomaly": 4.0,
            "time_anomaly": 3.0,
            "previous_behavior": 95.0
        }
    },
    "CCTV_02": {
        "id": "dev_02",
        "device_id": "CCTV_02",
        "device_type": "Surveillance Camera",
        "ip_address": "192.168.1.102",
        "trust_score": 88,
        "risk_score": 12,
        "status": "ONLINE",
        "last_activity": "2 mins ago",
        "request_count": 98,
        "assigned_user_id": "usr_02",
        "features": {
            "device_trust": 88.0,
            "failed_attempts": 1,
            "request_frequency": 6.2,
            "network_anomaly": 7.5,
            "time_anomaly": 5.0,
            "previous_behavior": 89.0
        }
    },
    "Temperature_01": {
        "id": "dev_03",
        "device_id": "Temperature_01",
        "device_type": "Environmental Sensor",
        "ip_address": "192.168.1.103",
        "trust_score": 96,
        "risk_score": 4,
        "status": "ONLINE",
        "last_activity": "1 min ago",
        "request_count": 310,
        "assigned_user_id": "usr_02",
        "features": {
            "device_trust": 96.0,
            "failed_attempts": 0,
            "request_frequency": 2.0,
            "network_anomaly": 2.0,
            "time_anomaly": 1.0,
            "previous_behavior": 98.0
        }
    },
    "MotionSensor_01": {
        "id": "dev_04",
        "device_id": "MotionSensor_01",
        "device_type": "PIR Motion Detector",
        "ip_address": "192.168.1.104",
        "trust_score": 52,
        "risk_score": 48,
        "status": "SUSPICIOUS",
        "last_activity": "5 mins ago",
        "request_count": 87,
        "assigned_user_id": "usr_02",
        "features": {
            "device_trust": 52.0,
            "failed_attempts": 3,
            "request_frequency": 28.0,
            "network_anomaly": 48.0,
            "time_anomaly": 35.0,
            "previous_behavior": 60.0
        }
    },
    "SmartDoor_01": {
        "id": "dev_05",
        "device_id": "SmartDoor_01",
        "device_type": "Access Control Lock",
        "ip_address": "192.168.1.105",
        "trust_score": 18,
        "risk_score": 82,
        "status": "BLOCKED",
        "last_activity": "10 mins ago",
        "request_count": 45,
        "assigned_user_id": "usr_02",
        "features": {
            "device_trust": 18.0,
            "failed_attempts": 9,
            "request_frequency": 80.0,
            "network_anomaly": 85.0,
            "time_anomaly": 75.0,
            "previous_behavior": 22.0
        }
    },
    "AirQuality_01": {
        "id": "dev_06",
        "device_id": "AirQuality_01",
        "device_type": "Particulate Air Sensor",
        "ip_address": "192.168.1.106",
        "trust_score": 91,
        "risk_score": 9,
        "status": "ONLINE",
        "last_activity": "3 mins ago",
        "request_count": 178,
        "assigned_user_id": "usr_02",
        "features": {
            "device_trust": 91.0,
            "failed_attempts": 0,
            "request_frequency": 3.0,
            "network_anomaly": 5.0,
            "time_anomaly": 4.0,
            "previous_behavior": 92.0
        }
    },
    "SmartLight_01": {
        "id": "dev_07",
        "device_id": "SmartLight_01",
        "device_type": "Facility Illumination",
        "ip_address": "192.168.1.107",
        "trust_score": 94,
        "risk_score": 6,
        "status": "ONLINE",
        "last_activity": "8 mins ago",
        "request_count": 64,
        "assigned_user_id": "usr_02",
        "features": {
            "device_trust": 94.0,
            "failed_attempts": 0,
            "request_frequency": 1.5,
            "network_anomaly": 3.0,
            "time_anomaly": 2.0,
            "previous_behavior": 95.0
        }
    },
    "WaterSensor_01": {
        "id": "dev_08",
        "device_id": "WaterSensor_01",
        "device_type": "Leak & Flow Monitor",
        "ip_address": "192.168.1.108",
        "trust_score": 89,
        "risk_score": 11,
        "status": "ONLINE",
        "last_activity": "12 mins ago",
        "request_count": 52,
        "assigned_user_id": "usr_02",
        "features": {
            "device_trust": 89.0,
            "failed_attempts": 0,
            "request_frequency": 1.0,
            "network_anomaly": 4.0,
            "time_anomaly": 3.0,
            "previous_behavior": 90.0
        }
    }
}

BLOCKCHAIN_LOGS: List[Dict[str, Any]] = []
ACCESS_REQUESTS: List[Dict[str, Any]] = []
CURRENT_BLOCK_NUMBER = 18492050

@app.on_event("startup")
def startup_event():
    """Ensures Random Forest classifier model is initialized on startup."""
    if not ai_classifier.is_trained:
        print("[Startup] Initializing Random Forest Classifier...")
        ai_classifier._load_or_train()

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "AI-Driven Adaptive Access Control for Blockchain-Based IoT Networks",
        "ai_model_trained": ai_classifier.is_trained,
        "model_accuracy": ai_classifier.accuracy,
        "classes": ai_classifier.class_names,
        "features": ai_classifier.feature_names,
        "synthetic_data": True,
        "data_disclaimer": "Software simulation using synthetic IoT behavioral training data; no claim of physical IoT hardware",
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/api/devices")
def get_devices():
    return list(DEVICES_DB.values())

@app.get("/api/devices/{device_id}")
def get_device(device_id: str):
    if device_id not in DEVICES_DB:
        raise HTTPException(status_code=404, detail="Device not found")
    return DEVICES_DB[device_id]

@app.post("/api/ai/analyze")
def analyze_risk(payload: Dict[str, Any]):
    """
    Accepts the six behavioral security features:
    [device_trust, failed_attempts, request_frequency, network_anomaly, time_anomaly, previous_behavior]

    Runs real inference through the scikit-learn RandomForestClassifier.
    Calculates 0-100 risk score, trust score, decision, class probabilities, and diagnostic explanation.
    """
    features_input = payload.get("features", payload) if isinstance(payload.get("features"), dict) else payload

    features = {
        "device_trust": float(features_input.get("device_trust", 50.0)),
        "failed_attempts": int(features_input.get("failed_attempts", 0)),
        "request_frequency": float(features_input.get("request_frequency", 5.0)),
        "network_anomaly": float(features_input.get("network_anomaly", 10.0)),
        "time_anomaly": float(features_input.get("time_anomaly", 0.0)),
        "previous_behavior": float(features_input.get("previous_behavior", 50.0))
    }

    # Execute real Random Forest prediction
    eval_result = ai_classifier.predict(features)
    device_id = str(payload.get("deviceId") or payload.get("device_id") or "SIMULATOR_NODE")

    # Strict compliance with TASK 3 response specification:
    response = {
        "prediction": eval_result["prediction"],
        "risk_score": eval_result["risk_score"],
        "trust_score": eval_result["trust_score"],
        "decision": eval_result["decision"],
        "probabilities": eval_result["probabilities"],
        "reason": eval_result["reason"],
        # Additional fields for complete frontend & dashboard compatibility
        "reasons": eval_result["reasons"],
        "explanation": eval_result["explanation"],
        "risk_level": eval_result["risk_level"],
        "confidence": eval_result["confidence"],
        "features": eval_result["features"],
        "deviceId": device_id,
        "riskScore": eval_result["risk_score"],
        "trustScore": eval_result["trust_score"],
        "id": f"eval_{int(time.time() * 1000)}",
        "timestamp": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")
    }

    return response

@app.post("/api/devices/simulate-activity")
def simulate_activity(payload: ActivitySimulationRequest):
    """
    Simulates real behavioral shift in an IoT node:
    Generates the six behavioral features for NORMAL, SUSPICIOUS, or HIGH_RISK.
    Feeds the updated features into the Random Forest model.
    Updates the device's risk_score, trust_score, and status from the ML MODEL output!
    """
    device_id = payload.device_id
    activity_type = payload.activity_type.upper()

    if device_id not in DEVICES_DB:
        raise HTTPException(status_code=404, detail="Device not found")

    device = DEVICES_DB[device_id]
    features = device["features"]

    if activity_type == "NORMAL":
        features["device_trust"] = 92.0
        features["failed_attempts"] = 0
        features["request_frequency"] = 4.2
        features["network_anomaly"] = 3.5
        features["time_anomaly"] = 1.0
        features["previous_behavior"] = 94.0

    elif activity_type == "SUSPICIOUS":
        features["device_trust"] = 55.0
        features["failed_attempts"] = 4
        features["request_frequency"] = 28.5
        features["network_anomaly"] = 48.0
        features["time_anomaly"] = 38.0
        features["previous_behavior"] = 60.0

    elif activity_type == "HIGH_RISK":
        features["device_trust"] = 18.0
        features["failed_attempts"] = 9
        features["request_frequency"] = 85.0
        features["network_anomaly"] = 88.0
        features["time_anomaly"] = 76.0
        features["previous_behavior"] = 21.0
    else:
        raise HTTPException(status_code=400, detail="Invalid activity type. Expected NORMAL, SUSPICIOUS, or HIGH_RISK")

    # Run real ML model evaluation
    eval_result = ai_classifier.predict(features)

    # Update device state strictly from ML output
    device["risk_score"] = eval_result["risk_score"]
    device["trust_score"] = eval_result["trust_score"]
    device["last_activity"] = "Just now"
    device["request_count"] += 1

    if eval_result["decision"] == "DENY":
        device["status"] = "BLOCKED"
    elif eval_result["decision"] == "LIMITED":
        device["status"] = "SUSPICIOUS"
    else:
        device["status"] = "ONLINE"

    return {
        "message": f"Simulated {activity_type} behavior on {device_id}",
        "device": device,
        "evaluation": eval_result
    }

@app.post("/api/access-request")
def request_access(payload: AccessRequestCreate):
    """
    Zero-Trust access request pipeline:
    1. Extract device features
    2. Model inference via Random Forest
    3. Calculate risk score & dynamic trust
    4. Access decision (ALLOW, LIMITED, DENY)
    5. Append record to blockchain ledger
    """
    global CURRENT_BLOCK_NUMBER
    device_id = payload.device_id
    if device_id not in DEVICES_DB:
        raise HTTPException(status_code=404, detail="Device not found")

    device = DEVICES_DB[device_id]
    features = device["features"]

    # 1. AI Risk Analysis through Random Forest
    eval_result = ai_classifier.predict(features)

    # 2. Update device scores from model output
    device["trust_score"] = eval_result["trust_score"]
    device["risk_score"] = eval_result["risk_score"]
    device["request_count"] += 1
    device["last_activity"] = "Just now"

    if eval_result["decision"] == "DENY":
        device["status"] = "BLOCKED"
    elif eval_result["decision"] == "LIMITED":
        device["status"] = "SUSPICIOUS"
    else:
        device["status"] = "ONLINE"

    # 3. Create blockchain transaction record
    CURRENT_BLOCK_NUMBER += 1
    tx_hash = "0x" + uuid.uuid4().hex + uuid.uuid4().hex[:32]

    tx_record = {
        "id": f"tx_{int(time.time() * 1000)}",
        "transaction_hash": tx_hash,
        "device_id": device_id,
        "resource": payload.resource,
        "risk_score": eval_result["risk_score"],
        "trust_score": eval_result["trust_score"],
        "decision": eval_result["decision"],
        "block_number": CURRENT_BLOCK_NUMBER,
        "status": "Confirmed",
        "timestamp": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC"),
        "is_simulated": True,
        "gas_used": 68420,
        "reason": eval_result["reason"]
    }
    BLOCKCHAIN_LOGS.insert(0, tx_record)

    # 4. Record access request
    req_record = {
        "id": f"req_{int(time.time() * 1000)}",
        "user_id": payload.user_id,
        "device_id": device_id,
        "resource": payload.resource,
        "reason": payload.reason,
        "risk_score": eval_result["risk_score"],
        "trust_score": eval_result["trust_score"],
        "decision": eval_result["decision"],
        "prediction": eval_result["prediction"],
        "probabilities": eval_result["probabilities"],
        "timestamp": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC"),
        "transaction_hash": tx_hash
    }
    ACCESS_REQUESTS.insert(0, req_record)

    return {
        "decision": eval_result["decision"],
        "risk_score": eval_result["risk_score"],
        "trust_score": eval_result["trust_score"],
        "prediction": eval_result["prediction"],
        "probabilities": eval_result["probabilities"],
        "reason": eval_result["reason"],
        "reasons": eval_result["reasons"],
        "explanation": eval_result["explanation"],
        "confidence": eval_result["confidence"],
        "blockchain_transaction": tx_record,
        "device": device
    }

@app.get("/api/blockchain/logs")
def get_blockchain_logs():
    return BLOCKCHAIN_LOGS

@app.get("/api/ai/feature-importances")
def get_feature_importances():
    if not ai_classifier.is_trained:
        ai_classifier.train()
    return {
        "accuracy": ai_classifier.accuracy,
        "feature_importances": ai_classifier.feature_importances,
        "features": ai_classifier.feature_names
    }

@app.get("/api/ai/model-info")
def get_model_info():
    """Provides full transparency and metadata regarding the Random Forest model."""
    if not ai_classifier.is_trained:
        ai_classifier.train()
    return {
        "model_type": "RandomForestClassifier",
        "library": "scikit-learn",
        "is_trained": ai_classifier.is_trained,
        "test_accuracy": ai_classifier.accuracy,
        "features": ai_classifier.feature_names,
        "classes": ai_classifier.class_names,
        "feature_importances": ai_classifier.feature_importances,
        "metadata": ai_classifier.metadata,
        "policy_mapping": {
            "0-30": "ALLOW",
            "31-60": "LIMITED",
            "61-100": "DENY"
        },
        "synthetic_notice": "Uses synthetic IoT telemetry data generator. No real physical hardware claimed."
    }
