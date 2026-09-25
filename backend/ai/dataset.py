"""
Synthetic IoT Behavioral Dataset Generator for Adaptive Access Control
=====================================================================
NOTE: This dataset consists purely of SYNTHETIC (simulated) IoT device telemetry
designed specifically for modeling zero-trust access boundaries. It does NOT represent
live or physical hardware deployments.

Features:
1. device_trust: float (0 - 100) - Historical trustworthiness & cryptographic attestation score
2. failed_attempts: int (0 - 25+) - Consecutive failed access or authentication attempts
3. request_frequency: float (req/min) - Burst rate and query velocity
4. network_anomaly: float (0 - 100%) - Packet jitter, payload deviation & unusual routing
5. time_anomaly: float (0 - 100%) - Out-of-window access deviation (e.g., off-hours/night-shift)
6. previous_behavior: float (0 - 100%) - Historical compliance rating over preceding 50 cycles

Target Classes:
- NORMAL: Baseline authorized behavior -> Decision: ALLOW (Risk 0 - 30)
- SUSPICIOUS: Anomalous / degraded behavior -> Decision: LIMITED (Risk 31 - 60)
- HIGH_RISK: Malicious or compromised patterns -> Decision: DENY (Risk 61 - 100)
"""
import os
import numpy as np
import pandas as pd
from typing import Tuple

DATASET_CSV_PATH = os.path.join(os.path.dirname(__file__), "data", "iot_security_synthetic_dataset.csv")

def generate_synthetic_iot_dataset(
    n_samples: int = 3000, 
    random_state: int = 42,
    save_to_csv: bool = True
) -> pd.DataFrame:
    """
    Generates a balanced, clearly documented synthetic dataset of IoT device behaviors.
    Includes edge cases, noise, and clear distributions matching zero-trust security postures.
    """
    np.random.seed(random_state)
    n_per_class = n_samples // 3

    # =========================================================================
    # 1. NORMAL CLASS (Expected Decision: ALLOW, Risk Target: 0 - 30)
    # High trust (78 - 100), few or 0 failed attempts, low request frequency (1 - 12 req/min),
    # low network anomaly (0 - 18%), low time anomaly (0 - 15%), high previous behavior (75 - 100).
    # =========================================================================
    normal_trust = np.clip(np.random.normal(92.0, 5.0, n_per_class), 75.0, 100.0)
    normal_failed = np.random.choice([0, 1, 2], size=n_per_class, p=[0.82, 0.15, 0.03])
    normal_freq = np.clip(np.random.normal(5.0, 2.2, n_per_class), 1.0, 14.0)
    normal_net_anomaly = np.clip(np.random.exponential(4.0, n_per_class), 0.0, 18.0)
    normal_time_anomaly = np.clip(np.random.exponential(3.0, n_per_class), 0.0, 15.0)
    normal_prev_behavior = np.clip(np.random.normal(92.0, 5.0, n_per_class), 75.0, 100.0)
    normal_labels = ["NORMAL"] * n_per_class
    normal_decisions = ["ALLOW"] * n_per_class

    # =========================================================================
    # 2. SUSPICIOUS CLASS (Expected Decision: LIMITED, Risk Target: 31 - 60)
    # Moderate trust (40 - 70), moderate failed attempts (2 - 6), moderate burst rate (15 - 45 req/min),
    # elevated network anomaly (25 - 65%), noticeable time anomaly (20 - 65%), moderate previous behavior (40 - 72).
    # =========================================================================
    susp_trust = np.clip(np.random.normal(54.0, 8.0, n_per_class), 38.0, 72.0)
    susp_failed = np.clip(np.random.poisson(3.6, n_per_class), 2, 6)
    susp_freq = np.clip(np.random.normal(27.0, 7.0, n_per_class), 14.0, 48.0)
    susp_net_anomaly = np.clip(np.random.normal(46.0, 9.0, n_per_class), 22.0, 68.0)
    susp_time_anomaly = np.clip(np.random.normal(42.0, 12.0, n_per_class), 18.0, 70.0)
    susp_prev_behavior = np.clip(np.random.normal(58.0, 9.0, n_per_class), 38.0, 72.0)
    susp_labels = ["SUSPICIOUS"] * n_per_class
    susp_decisions = ["LIMITED"] * n_per_class

    # =========================================================================
    # 3. HIGH_RISK CLASS (Expected Decision: DENY, Risk Target: 61 - 100)
    # Severely compromised or attacking nodes:
    # Low trust (0 - 32), many failed attempts (7 - 25+), extreme request frequency (50 - 150+ req/min),
    # extreme network anomaly (65 - 100%), high off-hours anomaly (55 - 100%), degraded previous behavior (0 - 35).
    # =========================================================================
    high_trust = np.clip(np.random.normal(16.0, 7.0, n_per_class), 0.0, 34.0)
    high_failed = np.clip(np.random.poisson(9.5, n_per_class), 6, 25)
    high_freq = np.clip(np.random.normal(86.0, 18.0, n_per_class), 48.0, 150.0)
    high_net_anomaly = np.clip(np.random.normal(85.0, 8.0, n_per_class), 62.0, 100.0)
    high_time_anomaly = np.clip(np.random.normal(78.0, 11.0, n_per_class), 50.0, 100.0)
    high_prev_behavior = np.clip(np.random.normal(20.0, 8.0, n_per_class), 0.0, 38.0)
    high_labels = ["HIGH_RISK"] * n_per_class
    high_decisions = ["DENY"] * n_per_class

    # Combine into unified DataFrame
    df = pd.DataFrame({
        "device_trust": np.round(np.concatenate([normal_trust, susp_trust, high_trust]), 2),
        "failed_attempts": np.concatenate([normal_failed, susp_failed, high_failed]).astype(int),
        "request_frequency": np.round(np.concatenate([normal_freq, susp_freq, high_freq]), 2),
        "network_anomaly": np.round(np.concatenate([normal_net_anomaly, susp_net_anomaly, high_net_anomaly]), 2),
        "time_anomaly": np.round(np.concatenate([normal_time_anomaly, susp_time_anomaly, high_time_anomaly]), 2),
        "previous_behavior": np.round(np.concatenate([normal_prev_behavior, susp_prev_behavior, high_prev_behavior]), 2),
        "label": np.concatenate([normal_labels, susp_labels, high_labels]),
        "decision": np.concatenate([normal_decisions, susp_decisions, high_decisions])
    })

    # Shuffle dataset
    df = df.sample(frac=1.0, random_state=random_state).reset_index(drop=True)

    if save_to_csv:
        os.makedirs(os.path.dirname(DATASET_CSV_PATH), exist_ok=True)
        df.to_csv(DATASET_CSV_PATH, index=False)
        print(f"[Dataset] Saved {len(df)} synthetic samples to {DATASET_CSV_PATH}")

    return df

def load_or_generate_dataset(n_samples: int = 3000) -> pd.DataFrame:
    """Loads the synthetic dataset from CSV if available, or generates it freshly."""
    if os.path.exists(DATASET_CSV_PATH):
        try:
            df = pd.read_csv(DATASET_CSV_PATH)
            if len(df) >= 500 and "label" in df.columns:
                return df
        except Exception:
            pass
    return generate_synthetic_iot_dataset(n_samples=n_samples, save_to_csv=True)

if __name__ == "__main__":
    df = generate_synthetic_iot_dataset(3000, save_to_csv=True)
    print("Class distribution:")
    print(df["label"].value_counts())
    print("\nSample records:")
    print(df.head())
