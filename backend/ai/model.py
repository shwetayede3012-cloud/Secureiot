"""
Random Forest Inference Engine for Adaptive Access Control
==========================================================
Loads the persistent scikit-learn RandomForestClassifier from disk (joblib)
and performs real inference on 6 IoT security telemetry features.

Computes:
1. Model class prediction (NORMAL, SUSPICIOUS, HIGH_RISK)
2. Class probabilities: P(NORMAL), P(SUSPICIOUS), P(HIGH_RISK)
3. Transparent & explainable Risk Score (0 - 100)
4. Dynamic Trust Score (0 - 100)
5. Zero-Trust Access Decision (ALLOW, LIMITED, DENY)
6. Feature-level explainability reasons
"""
import os
import json
import joblib
import numpy as np
import pandas as pd
from typing import Dict, Any, List, Optional

try:
    from backend.ai.train import (
        FEATURE_NAMES, CLASS_NAMES, MODEL_FILE_PATH, 
        METADATA_FILE_PATH, train_model
    )
except ImportError:
    from train import (
        FEATURE_NAMES, CLASS_NAMES, MODEL_FILE_PATH, 
        METADATA_FILE_PATH, train_model
    )

class IoTRiskClassifier:
    def __init__(self):
        self.feature_names = FEATURE_NAMES
        self.class_names = CLASS_NAMES
        self.clf = None
        self.metadata: Dict[str, Any] = {}
        self.is_trained: bool = False
        self.accuracy: float = 0.0
        self.feature_importances: Dict[str, float] = {}
        self._load_or_train()

    def _load_or_train(self):
        """Loads persistent model from disk if present; otherwise triggers training."""
        if os.path.exists(MODEL_FILE_PATH):
            try:
                self.clf = joblib.load(MODEL_FILE_PATH)
                self.is_trained = True
                print(f"[Model Engine] Loaded trained Random Forest from: {MODEL_FILE_PATH}")
                if os.path.exists(METADATA_FILE_PATH):
                    with open(METADATA_FILE_PATH, "r") as f:
                        self.metadata = json.load(f)
                    self.accuracy = float(self.metadata.get("test_accuracy", 0.97))
                    self.feature_importances = self.metadata.get("feature_importances", {})
                return
            except Exception as e:
                print(f"[Model Engine] Failed to load {MODEL_FILE_PATH}: {e}, retraining...")

        # Train freshly
        artifacts = train_model()
        self.clf = artifacts["clf"]
        self.metadata = artifacts["metadata"]
        self.accuracy = artifacts["accuracy"]
        self.feature_importances = self.metadata.get("feature_importances", {})
        self.is_trained = True

    def train(self) -> Dict[str, Any]:
        """Manually retrains the model and reloads it."""
        artifacts = train_model()
        self.clf = artifacts["clf"]
        self.metadata = artifacts["metadata"]
        self.accuracy = artifacts["accuracy"]
        self.feature_importances = self.metadata.get("feature_importances", {})
        self.is_trained = True
        return self.metadata

    def predict(self, features: Dict[str, float]) -> Dict[str, Any]:
        """
        Executes real inference on the 6 behavioral features:
        - device_trust (0 - 100)
        - failed_attempts (int >= 0)
        - request_frequency (req/min >= 0)
        - network_anomaly (0 - 100)
        - time_anomaly (0 - 100)
        - previous_behavior (0 - 100)

        Returns prediction, probabilities, risk_score, trust_score, decision, and reasons.
        """
        if not self.is_trained or self.clf is None:
            self._load_or_train()

        # Extract features in consistent order
        device_trust = float(features.get("device_trust", 50.0))
        failed_attempts = int(features.get("failed_attempts", 0))
        request_frequency = float(features.get("request_frequency", 5.0))
        network_anomaly = float(features.get("network_anomaly", 10.0))
        time_anomaly = float(features.get("time_anomaly", 0.0))
        previous_behavior = float(features.get("previous_behavior", 50.0))

        input_data = pd.DataFrame([{
            "device_trust": device_trust,
            "failed_attempts": failed_attempts,
            "request_frequency": request_frequency,
            "network_anomaly": network_anomaly,
            "time_anomaly": time_anomaly,
            "previous_behavior": previous_behavior
        }])[self.feature_names]

        # 1. Model Prediction & Probabilities from RandomForestClassifier
        pred_label = str(self.clf.predict(input_data)[0])
        raw_proba = self.clf.predict_proba(input_data)[0]
        classes = list(self.clf.classes_)

        # Map probabilities into dictionary
        probabilities: Dict[str, float] = {
            cls_name: round(float(raw_proba[classes.index(cls_name)]), 4)
            for cls_name in self.class_names
            if cls_name in classes
        }
        for cls_name in self.class_names:
            if cls_name not in probabilities:
                probabilities[cls_name] = 0.0

        p_normal = probabilities.get("NORMAL", 0.0)
        p_suspicious = probabilities.get("SUSPICIOUS", 0.0)
        p_high_risk = probabilities.get("HIGH_RISK", 0.0)

        # 2. Transparent Mathematical Risk Score Calculation
        # Expected class baseline risk:
        # NORMAL -> 10, SUSPICIOUS -> 50, HIGH_RISK -> 90
        expected_class_risk = (p_normal * 10.0) + (p_suspicious * 50.0) + (p_high_risk * 90.0)

        # Feature-aware calibration offset (normalized against policy baselines)
        trust_deficit = max(0.0, 100.0 - device_trust)
        behavior_deficit = max(0.0, 100.0 - previous_behavior)
        failed_penalty = min(failed_attempts * 3.5, 30.0)
        freq_penalty = min(max(request_frequency - 8.0, 0.0) * 0.4, 20.0)
        net_penalty = min(network_anomaly * 0.25, 20.0)
        time_penalty = min(time_anomaly * 0.15, 10.0)

        feature_composite_risk = (
            trust_deficit * 0.25 +
            failed_penalty * 0.25 +
            net_penalty * 0.20 +
            freq_penalty * 0.15 +
            behavior_deficit * 0.10 +
            time_penalty * 0.05
        )

        # Composite score blending ML distribution (75%) with telemetry fine-tuning (25%)
        blended_risk = (expected_class_risk * 0.75) + (feature_composite_risk * 0.25)

        # Strict boundary enforcement conforming to the 3-tier Zero-Trust policy:
        # If model strongly predicts NORMAL (p_normal > 0.65), score must reside in [0, 30]
        # If model strongly predicts HIGH_RISK (p_high_risk > 0.60), score must reside in [61, 100]
        # If model predicts SUSPICIOUS (p_suspicious > 0.50), score must reside in [31, 60]
        if p_normal >= 0.65:
            risk_score = round(min(30.0, max(2.0, blended_risk)), 1)
        elif p_high_risk >= 0.60:
            risk_score = round(max(61.0, min(99.0, blended_risk)), 1)
        elif p_suspicious >= 0.50:
            risk_score = round(min(60.0, max(31.0, blended_risk)), 1)
        else:
            risk_score = round(float(np.clip(blended_risk, 0.0, 100.0)), 1)

        # Dynamic Trust Score (inverse of risk, smoothed by baseline trust)
        trust_score = round(float(np.clip((100.0 - risk_score * 0.9), 5.0, 100.0)), 1)

        # 3. Access Decision Policy
        # 0–30 -> ALLOW
        # 31–60 -> LIMITED
        # 61–100 -> DENY
        if risk_score <= 30.0:
            decision = "ALLOW"
            risk_level = "LOW"
        elif risk_score <= 60.0:
            decision = "LIMITED"
            risk_level = "MEDIUM"
        else:
            decision = "DENY"
            risk_level = "HIGH"

        # 4. Feature Explainability & Diagnostics
        reasons: List[str] = []
        contributions: List[str] = []

        if device_trust < 35.0:
            reasons.append(f"Critically low device trust score ({device_trust:.1f}/100)")
            contributions.append("low device trust")
        elif device_trust < 65.0:
            reasons.append(f"Sub-optimal device trust score ({device_trust:.1f}/100)")

        if failed_attempts >= 6:
            reasons.append(f"Repeated authentication failures ({failed_attempts} failed attempts)")
            contributions.append("repeated failed attempts")
        elif failed_attempts >= 2:
            reasons.append(f"Multiple failed access tries ({failed_attempts} attempts)")

        if request_frequency > 45.0:
            reasons.append(f"Excessive request frequency ({request_frequency:.1f} req/min, DDoS risk)")
            contributions.append("abnormal request frequency")
        elif request_frequency > 15.0:
            reasons.append(f"Elevated request velocity ({request_frequency:.1f} req/min)")

        if network_anomaly > 50.0:
            reasons.append(f"Severe network packet deviation ({network_anomaly:.1f}% anomaly)")
            contributions.append("network anomaly")
        elif network_anomaly > 25.0:
            reasons.append(f"Moderate network telemetry variance ({network_anomaly:.1f}%)")

        if time_anomaly > 40.0:
            reasons.append(f"Unusual access timing ({time_anomaly:.1f}% off-hours anomaly)")
            contributions.append("time-of-access anomaly")

        if previous_behavior < 40.0:
            reasons.append(f"Poor historical behavior compliance ({previous_behavior:.1f}/100)")
            contributions.append("unfavorable historical behavior")

        if not reasons:
            reasons.append("Device behavior conforms to baseline security policy")
            reason_summary = "Normal operational parameters and high device trust."
        else:
            reason_summary = ", ".join(contributions).capitalize() + "." if contributions else reasons[0]

        return {
            "prediction": pred_label,
            "probabilities": probabilities,
            "risk_score": int(round(risk_score)),
            "trust_score": int(round(trust_score)),
            "decision": decision,
            "reason": reason_summary,
            "reasons": reasons,
            "explanation": "; ".join(reasons),
            "risk_level": risk_level,
            "confidence": round(float(probabilities[pred_label]) * 100.0, 1),
            "features": {
                "device_trust": device_trust,
                "failed_attempts": failed_attempts,
                "request_frequency": request_frequency,
                "network_anomaly": network_anomaly,
                "time_anomaly": time_anomaly,
                "previous_behavior": previous_behavior
            }
        }

# Singleton instance for application runtime
ai_classifier = IoTRiskClassifier()
