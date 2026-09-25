"""
Random Forest Training Script for IoT Adaptive Access Control
============================================================
Trains a scikit-learn RandomForestClassifier on the synthetic IoT behavioral dataset.
Persists the trained model using joblib to /backend/ai/models/rf_model.joblib.
Saves model evaluation metrics and feature importances to /backend/ai/models/model_metadata.json.
"""
import os
import json
import joblib
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix

try:
    from backend.ai.dataset import load_or_generate_dataset, DATASET_CSV_PATH
except ImportError:
    from dataset import load_or_generate_dataset, DATASET_CSV_PATH

BASE_DIR = os.path.dirname(__file__)
MODELS_DIR = os.path.join(BASE_DIR, "models")
MODEL_FILE_PATH = os.path.join(MODELS_DIR, "rf_model.joblib")
METADATA_FILE_PATH = os.path.join(MODELS_DIR, "model_metadata.json")

FEATURE_NAMES = [
    "device_trust",
    "failed_attempts",
    "request_frequency",
    "network_anomaly",
    "time_anomaly",
    "previous_behavior"
]

CLASS_NAMES = ["NORMAL", "SUSPICIOUS", "HIGH_RISK"]

def train_model(n_samples: int = 3000, random_state: int = 42) -> dict:
    """
    Trains the Random Forest model and persists it to disk.
    Returns metrics and training artifacts.
    """
    os.makedirs(MODELS_DIR, exist_ok=True)

    print("[ML Pipeline] Loading synthetic IoT behavioral dataset...")
    df = load_or_generate_dataset(n_samples=n_samples)

    X = df[FEATURE_NAMES]
    y = df["label"]

    print(f"[ML Pipeline] Dataset size: {len(df)} samples across classes: {dict(y.value_counts())}")

    # Stratified Train/Test Split (80% train, 20% test)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=random_state, stratify=y
    )

    print(f"[ML Pipeline] Training RandomForestClassifier (n_estimators=100, max_depth=10)...")
    clf = RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        min_samples_split=4,
        min_samples_leaf=2,
        random_state=random_state,
        n_jobs=-1
    )

    clf.fit(X_train, y_train)

    # Evaluate on held-out test set
    y_pred = clf.predict(X_test)
    test_accuracy = float(accuracy_score(y_test, y_pred))
    report = classification_report(y_test, y_pred, output_dict=True)

    # Feature importances
    feature_importances = {
        name: round(float(imp), 4)
        for name, imp in zip(FEATURE_NAMES, clf.feature_importances_)
    }

    # Persist model with joblib
    joblib.dump(clf, MODEL_FILE_PATH)
    print(f"[ML Pipeline] Successfully saved Random Forest model to: {MODEL_FILE_PATH}")

    # Persist metadata
    metadata = {
        "model_type": "RandomForestClassifier",
        "library": "scikit-learn",
        "n_estimators": 100,
        "max_depth": 10,
        "feature_names": FEATURE_NAMES,
        "class_names": list(clf.classes_),
        "test_accuracy": round(test_accuracy, 4),
        "test_samples": len(y_test),
        "total_samples": len(df),
        "feature_importances": feature_importances,
        "dataset_path": DATASET_CSV_PATH,
        "model_path": MODEL_FILE_PATH,
        "synthetic_data": True,
        "data_notice": "Trained on synthetic IoT behavioral telemetry (no physical IoT hardware claim)",
        "classification_report": report
    }

    with open(METADATA_FILE_PATH, "w") as f:
        json.dump(metadata, f, indent=2)
    print(f"[ML Pipeline] Saved model metadata to: {METADATA_FILE_PATH}")

    print(f"[ML Pipeline] Evaluation Test Accuracy: {test_accuracy * 100:.2f}%")
    print("[ML Pipeline] Feature Importances:")
    for k, v in feature_importances.items():
        print(f"  - {k}: {v * 100:.1f}%")

    return {
        "clf": clf,
        "metadata": metadata,
        "accuracy": test_accuracy
    }

if __name__ == "__main__":
    train_model()
