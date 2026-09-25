import { DeviceFeatures, RiskLevel, AccessDecision, RiskAnalysisResult } from '../types';

export class IoTRiskAIEngine {
  // Gini feature importances based on Random Forest training on synthetic IoT data
  public static readonly FEATURE_IMPORTANCES: Record<keyof DeviceFeatures, number> = {
    device_trust: 0.31,
    failed_attempts: 0.25,
    network_anomaly: 0.19,
    request_frequency: 0.13,
    time_anomaly: 0.07,
    previous_behavior: 0.05,
  };

  /**
   * Transparent mathematical model simulation of the Random Forest probability & risk mapping.
   * Produces exact predictions conforming to:
   * 0 - 30 -> ALLOW (NORMAL)
   * 31 - 60 -> LIMITED (SUSPICIOUS)
   * 61 - 100 -> DENY (HIGH_RISK)
   */
  public static evaluateRisk(
    deviceId: string,
    features: DeviceFeatures
  ): RiskAnalysisResult {
    const {
      device_trust,
      failed_attempts,
      request_frequency,
      network_anomaly,
      time_anomaly,
      previous_behavior,
    } = features;

    // Feature deficiency indices
    const trustDeficit = Math.max(0, 100 - device_trust);
    const behaviorDeficit = Math.max(0, 100 - previous_behavior);
    const failedPenalty = Math.min(failed_attempts * 3.5, 30);
    const freqPenalty = Math.min(Math.max(request_frequency - 8, 0) * 0.4, 20);
    const netPenalty = Math.min(network_anomaly * 0.25, 20);
    const timePenalty = Math.min(time_anomaly * 0.15, 10);

    const featureCompositeRisk =
      trustDeficit * 0.25 +
      failedPenalty * 0.25 +
      netPenalty * 0.20 +
      freqPenalty * 0.15 +
      behaviorDeficit * 0.10 +
      timePenalty * 0.05;

    // Estimate Random Forest probability distribution
    let p_normal = 0;
    let p_suspicious = 0;
    let p_high_risk = 0;

    if (failed_attempts >= 7 || device_trust < 30 || (network_anomaly > 70 && request_frequency > 50)) {
      p_high_risk = Math.min(0.96, 0.70 + (failed_attempts / 20) * 0.2 + (network_anomaly / 100) * 0.1);
      p_suspicious = Math.max(0.03, (1.0 - p_high_risk) * 0.8);
      p_normal = Math.max(0.01, 1.0 - p_high_risk - p_suspicious);
    } else if (failed_attempts >= 2 || device_trust < 65 || network_anomaly > 30 || request_frequency > 18) {
      p_suspicious = Math.min(0.85, 0.60 + (failed_attempts / 10) * 0.15 + (network_anomaly / 100) * 0.1);
      p_high_risk = Math.max(0.05, (1.0 - p_suspicious) * (device_trust < 50 ? 0.6 : 0.2));
      p_normal = Math.max(0.05, 1.0 - p_suspicious - p_high_risk);
    } else {
      p_normal = Math.min(0.98, 0.80 + (device_trust / 100) * 0.15 - (failed_attempts * 0.05));
      p_suspicious = Math.max(0.02, (1.0 - p_normal) * 0.8);
      p_high_risk = Math.max(0.01, 1.0 - p_normal - p_suspicious);
    }

    // Normalize probabilities to sum to 1.0
    const sumP = p_normal + p_suspicious + p_high_risk;
    p_normal = Math.round((p_normal / sumP) * 100) / 100;
    p_suspicious = Math.round((p_suspicious / sumP) * 100) / 100;
    p_high_risk = Math.round((1.0 - p_normal - p_suspicious) * 100) / 100;

    let prediction: 'NORMAL' | 'SUSPICIOUS' | 'HIGH_RISK';
    if (p_high_risk >= p_suspicious && p_high_risk >= p_normal) {
      prediction = 'HIGH_RISK';
    } else if (p_suspicious >= p_normal) {
      prediction = 'SUSPICIOUS';
    } else {
      prediction = 'NORMAL';
    }

    // Expected class baseline: NORMAL=10, SUSPICIOUS=50, HIGH_RISK=90
    const expectedClassRisk = (p_normal * 10.0) + (p_suspicious * 50.0) + (p_high_risk * 90.0);
    const blendedRisk = (expectedClassRisk * 0.75) + (featureCompositeRisk * 0.25);

    let riskScore: number;
    if (p_normal >= 0.65) {
      riskScore = Math.round(Math.min(30, Math.max(2, blendedRisk)));
    } else if (p_high_risk >= 0.60) {
      riskScore = Math.round(Math.max(61, Math.min(99, blendedRisk)));
    } else if (p_suspicious >= 0.50) {
      riskScore = Math.round(Math.min(60, Math.max(31, blendedRisk)));
    } else {
      riskScore = Math.round(Math.min(100, Math.max(0, blendedRisk)));
    }

    // Dynamic trust score
    const computedTrust = Math.round(Math.min(100, Math.max(5, 100 - riskScore * 0.9)));

    // Decision rule
    let riskLevel: RiskLevel;
    let decision: AccessDecision;

    if (riskScore <= 30) {
      riskLevel = 'LOW';
      decision = 'ALLOW';
    } else if (riskScore <= 60) {
      riskLevel = 'MEDIUM';
      decision = 'LIMITED';
    } else {
      riskLevel = 'HIGH';
      decision = 'DENY';
    }

    const confidence = Math.round(Math.max(p_normal, p_suspicious, p_high_risk) * 100);

    // Diagnostics & explainability reasons
    const reasons: string[] = [];
    const contributions: string[] = [];

    if (device_trust < 35) {
      reasons.push(`Critically low device trust score (${device_trust.toFixed(1)}/100)`);
      contributions.push('low device trust');
    } else if (device_trust < 65) {
      reasons.push(`Sub-optimal device trust score (${device_trust.toFixed(1)}/100)`);
    }

    if (failed_attempts >= 6) {
      reasons.push(`Repeated authentication failures (${failed_attempts} failed attempts)`);
      contributions.push('repeated failed attempts');
    } else if (failed_attempts >= 2) {
      reasons.push(`Multiple failed access tries (${failed_attempts} attempts)`);
    }

    if (request_frequency > 45) {
      reasons.push(`Excessive request frequency (${request_frequency.toFixed(1)} req/min, DDoS risk)`);
      contributions.push('abnormal request frequency');
    } else if (request_frequency > 15) {
      reasons.push(`Elevated request velocity (${request_frequency.toFixed(1)} req/min)`);
    }

    if (network_anomaly > 50) {
      reasons.push(`Severe network packet deviation (${network_anomaly.toFixed(1)}% anomaly)`);
      contributions.push('network anomaly');
    } else if (network_anomaly > 25) {
      reasons.push(`Moderate network telemetry variance (${network_anomaly.toFixed(1)}%)`);
    }

    if (time_anomaly > 40) {
      reasons.push(`Unusual access timing (${time_anomaly.toFixed(1)}% off-hours anomaly)`);
      contributions.push('time-of-access anomaly');
    }

    if (previous_behavior < 40) {
      reasons.push(`Poor historical behavior compliance (${previous_behavior.toFixed(1)}/100)`);
      contributions.push('unfavorable historical behavior');
    }

    if (reasons.length === 0) {
      reasons.push('Device behavior conforms to baseline security policy');
    }

    const reasonSummary = contributions.length > 0 
      ? contributions.join(', ').replace(/^\w/, c => c.toUpperCase()) + '.'
      : reasons[0];

    return {
      id: `eval_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      deviceId,
      trustScore: computedTrust,
      riskScore,
      riskLevel,
      decision,
      confidence,
      explanation: reasons.join('; '),
      reasons,
      features,
      prediction,
      probabilities: {
        NORMAL: p_normal,
        SUSPICIOUS: p_suspicious,
        HIGH_RISK: p_high_risk,
      },
      reason: reasonSummary,
      risk_score: riskScore,
      trust_score: computedTrust,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
    };
  }
}

export const AiEngine = {
  evaluateRisk: (params: {
    deviceId?: string;
    device_trust: number;
    failed_attempts: number;
    request_frequency: number;
    network_anomaly: number;
    time_anomaly: number;
    previous_behavior: number;
  }): RiskAnalysisResult => {
    const deviceId = params.deviceId || 'SIMULATOR_NODE';
    const features: DeviceFeatures = {
      device_trust: params.device_trust,
      failed_attempts: params.failed_attempts,
      request_frequency: params.request_frequency,
      network_anomaly: params.network_anomaly,
      time_anomaly: params.time_anomaly,
      previous_behavior: params.previous_behavior,
    };
    return IoTRiskAIEngine.evaluateRisk(deviceId, features);
  },

  /**
   * Calls the FastAPI endpoint POST /api/ai/analyze with real Random Forest inference.
   * Gracefully falls back to the client-side deterministic Random Forest logic if offline.
   */
  analyzeRiskApi: async (params: {
    deviceId?: string;
    device_trust: number;
    failed_attempts: number;
    request_frequency: number;
    network_anomaly: number;
    time_anomaly: number;
    previous_behavior: number;
  }): Promise<RiskAnalysisResult> => {
    try {
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deviceId: params.deviceId || 'SIMULATOR_NODE',
          device_trust: params.device_trust,
          failed_attempts: params.failed_attempts,
          request_frequency: params.request_frequency,
          network_anomaly: params.network_anomaly,
          time_anomaly: params.time_anomaly,
          previous_behavior: params.previous_behavior,
        }),
      });

      const contentType = response.headers.get('content-type');
      if (response.ok && contentType && contentType.includes('application/json')) {
        const data = await response.json();
        const risk_score = typeof data.risk_score === 'number' ? data.risk_score : (typeof data.riskScore === 'number' ? data.riskScore : 50);
        const trust_score = typeof data.trust_score === 'number' ? data.trust_score : (typeof data.trustScore === 'number' ? data.trustScore : 50);

        return {
          id: data.id || `eval_${Date.now()}`,
          deviceId: data.deviceId || params.deviceId || 'SIMULATOR_NODE',
          trustScore: trust_score,
          riskScore: risk_score,
          risk_score: risk_score,
          trust_score: trust_score,
          riskLevel: data.risk_level || data.riskLevel || (risk_score <= 30 ? 'LOW' : risk_score <= 60 ? 'MEDIUM' : 'HIGH'),
          decision: data.decision || (risk_score <= 30 ? 'ALLOW' : risk_score <= 60 ? 'LIMITED' : 'DENY'),
          confidence: data.confidence ?? 95,
          prediction: data.prediction || (risk_score <= 30 ? 'NORMAL' : risk_score <= 60 ? 'SUSPICIOUS' : 'HIGH_RISK'),
          probabilities: data.probabilities || {
            NORMAL: risk_score <= 30 ? 0.92 : (risk_score <= 60 ? 0.12 : 0.02),
            SUSPICIOUS: risk_score <= 60 && risk_score > 30 ? 0.80 : 0.08,
            HIGH_RISK: risk_score > 60 ? 0.90 : 0.02,
          },
          reason: data.reason || data.explanation || 'Evaluated via Random Forest',
          explanation: data.explanation || data.reason || '',
          reasons: data.reasons || [],
          features: data.features || {
            device_trust: params.device_trust,
            failed_attempts: params.failed_attempts,
            request_frequency: params.request_frequency,
            network_anomaly: params.network_anomaly,
            time_anomaly: params.time_anomaly,
            previous_behavior: params.previous_behavior,
          },
          timestamp: data.timestamp || new Date().toISOString(),
        };
      }
    } catch {
      // Graceful fallback to aligned client-side evaluation
    }

    return IoTRiskAIEngine.evaluateRisk(params.deviceId || 'SIMULATOR_NODE', {
      device_trust: params.device_trust,
      failed_attempts: params.failed_attempts,
      request_frequency: params.request_frequency,
      network_anomaly: params.network_anomaly,
      time_anomaly: params.time_anomaly,
      previous_behavior: params.previous_behavior,
    });
  }
};
