"""
FarmPulse AI - Explainable Prediction & Uncertainty Engine
Executes:
1. Multi-factor failure risk inference
2. Uncertainty decomposition:
   - Aleatoric (sensor noise, missing channels)
   - Epistemic (ensemble variance across Random Forest trees)
3. Explainable AI (XAI) feature attribution
4. Actionable prescriptive maintenance recommendation
"""

import os
import json
import warnings
import numpy as np
import pandas as pd
import joblib
from typing import Dict, Any, List

warnings.filterwarnings("ignore", category=UserWarning)

from ml.features import preprocess_telemetry_dataframe, FEATURE_COLUMNS, assess_sensor_quality

MODELS_DIR = "ml/saved_models"

class MaintenancePredictor:
    def __init__(self, models_dir: str = MODELS_DIR):
        self.models_dir = models_dir
        self.clf = None
        self.mode_clf = None
        self.rul_reg = None
        self.metrics = {}
        self._load_models()
        
    def _load_models(self):
        clf_file = os.path.join(self.models_dir, "fault_classifier.joblib")
        mode_file = os.path.join(self.models_dir, "mode_classifier.joblib")
        rul_file = os.path.join(self.models_dir, "rul_regressor.joblib")
        metrics_file = os.path.join(self.models_dir, "model_metrics.json")
        
        if os.path.exists(clf_file) and os.path.exists(mode_file) and os.path.exists(rul_file):
            self.clf = joblib.load(clf_file)
            self.mode_clf = joblib.load(mode_file)
            self.rul_reg = joblib.load(rul_file)
            if os.path.exists(metrics_file):
                with open(metrics_file, "r") as f:
                    self.metrics = json.load(f)
        else:
            print(f"Warning: Models not loaded from {self.models_dir}. Predictor in fallback mode.")
            
    def predict_observation(self, observation: Dict[str, Any]) -> Dict[str, Any]:
        """
        Accepts a single machine telemetry dictionary.
        Returns failure probability, predicted fault, uncertainty decomposition,
        contributing factors, and suggested maintenance intervention.
        """
        # Assess observation quality first (Section D mandate)
        quality_score, is_missing, is_noisy = assess_sensor_quality(observation)
        
        row_dict = {
            "machine_id": observation.get("machine_id", "FP-000"),
            "machine_type": observation.get("machine_type", "Heavy-Duty Tractor"),
            "engine_temp": observation.get("engine_temp"),
            "vibration": observation.get("vibration"),
            "rpm": observation.get("rpm"),
            "oil_pressure": observation.get("oil_pressure"),
            "hydraulic_pressure": observation.get("hydraulic_pressure"),
            "load_percentage": observation.get("load_percentage", 75.0),
            "operating_hours": observation.get("operating_hours", 1200.0),
            "ambient_temp": observation.get("ambient_temp", 22.0),
            "is_missing": is_missing,
            "is_noisy": is_noisy,
            "quality_score": quality_score
        }
        
        df = pd.DataFrame([row_dict])
        processed_df = preprocess_telemetry_dataframe(df)
        X = processed_df[FEATURE_COLUMNS]
        
        if self.clf is None:
            # Deterministic heuristic fallback
            return self._heuristic_prediction(observation, quality_score, is_missing, is_noisy)
            
        # 1. Base failure risk probability
        prob_classes = self.clf.predict_proba(X)[0]
        failure_prob = float(prob_classes[1]) if len(prob_classes) > 1 else 0.0
        
        # 2. Epistemic uncertainty: tree-level variance in predictions
        tree_predictions = np.array([tree.predict_proba(X)[0][1] for tree in self.clf.estimators_])
        epistemic_var = float(np.var(tree_predictions))
        
        # 3. Aleatoric uncertainty: derived from sensor noise & missing data
        aleatoric_factor = (1.0 - quality_score)
        
        # Composite Uncertainty Score [0.0 - 1.0]
        missing_penalty = 0.15 if is_missing else 0.0
        noisy_penalty = 0.15 if is_noisy else 0.0
        uncertainty = float(np.clip((np.sqrt(epistemic_var) * 2.0) + (aleatoric_factor * 1.2) + missing_penalty + noisy_penalty, 0.10, 0.98))
        
        # 4. Fault mode category
        mode_pred = str(self.mode_clf.predict(X)[0])
        
        # 5. Remaining Useful Life (RUL)
        rul_hours = max(2.0, float(self.rul_reg.predict(X)[0]))
        
        # CRUCIAL RULE D: Do not automatically classify missing/noisy sensor readings as mechanical failures!
        raw_temp_dev = float(processed_df["temp_deviation_from_nominal"].iloc[0])
        raw_vib_ratio = float(processed_df["vib_ratio_to_nominal"].iloc[0])
        raw_oil_drop = float(processed_df["oil_pressure_drop"].iloc[0])
        
        # Corroborating multi-channel physical evidence for real mechanical failure
        is_true_physical_fault = (
            (raw_vib_ratio > 1.7 and raw_temp_dev > 10.0) or
            (raw_temp_dev > 18.0 and not is_noisy) or
            (raw_vib_ratio > 2.0 and not is_noisy) or
            (raw_oil_drop > 1.8 and not is_noisy)
        )
        
        is_sensor_anomaly = bool(is_noisy or (is_missing and not is_true_physical_fault))
        
        if is_sensor_anomaly:
            # Sensor telemetry glitch detected, NOT machine mechanical fault!
            failure_prob = min(0.30, failure_prob * 0.4)
            mode_pred = "Sensor_Telemetry_Fault" if is_missing else "Transient_Transducer_Noise"
            recommendation = "Inspect and recalibrate IoT sensor wiring harness. Telemetry stream degraded."
        else:
            if failure_prob > 0.70:
                recommendation = f"Immediate Service Required: Schedule inspection for {mode_pred.replace('_', ' ')}."
            elif failure_prob > 0.40:
                recommendation = f"Developing Fault Alert: Monitor {mode_pred.replace('_', ' ')} closely on next shift."
            else:
                recommendation = "Nominal Condition: Standard operational parameters maintained."
                
        # 6. Feature attribution for Explainable AI (XAI)
        contributing_factors = self._explain_prediction(processed_df.iloc[0], failure_prob)
        
        return {
            "failure_risk": round(failure_prob, 3),
            "predicted_fault_type": mode_pred,
            "time_to_failure_hours": round(rul_hours, 1),
            "confidence_score": round(1.0 - uncertainty, 3),
            "uncertainty_score": round(uncertainty, 3),
            "observation_quality": round(quality_score, 3),
            "is_sensor_anomaly": is_sensor_anomaly,
            "contributing_factors": contributing_factors,
            "recommended_action": recommendation,
            "model_version": "RF-Fleet-v2.1"
        }
        
    def _explain_prediction(self, row: pd.Series, risk: float) -> List[Dict[str, Any]]:
        """
        Extracts top feature contributors to explain the prediction outcome.
        """
        importances = self.metrics.get("feature_importances", {})
        factors = []
        
        factors.append({
            "feature": "Vibration Severity",
            "value": f"{row.get('vibration_imputed', 0):.2f} mm/s",
            "contribution_score": round(float(importances.get("vib_ratio_to_nominal", 0.22) * row.get("vib_ratio_to_nominal", 1.0)), 3),
            "status": "Critical" if row.get("vib_ratio_to_nominal", 1.0) > 1.8 else "Normal"
        })
        factors.append({
            "feature": "Thermal Deviation",
            "value": f"{row.get('temp_deviation_from_nominal', 0):+.1f} °C",
            "contribution_score": round(float(importances.get("temp_deviation_from_nominal", 0.25) * abs(row.get("temp_deviation_from_nominal", 0)) / 10.0), 3),
            "status": "Warning" if abs(row.get("temp_deviation_from_nominal", 0)) > 12.0 else "Normal"
        })
        factors.append({
            "feature": "Lube Oil Pressure Drop",
            "value": f"{row.get('oil_pressure_drop', 0):+.2f} bar",
            "contribution_score": round(float(importances.get("oil_pressure_drop", 0.20) * max(0, row.get("oil_pressure_drop", 0))), 3),
            "status": "Warning" if row.get("oil_pressure_drop", 0) > 1.2 else "Normal"
        })
        factors.append({
            "feature": "Telemetry Quality Index",
            "value": f"{row.get('quality_score', 1.0)*100:.0f}%",
            "contribution_score": round(float((1.0 - row.get("quality_score", 1.0)) * 0.4), 3),
            "status": "Degraded" if row.get("quality_score", 1.0) < 0.75 else "Optimal"
        })
        
        factors.sort(key=lambda x: x["contribution_score"], reverse=True)
        return factors

    def _heuristic_prediction(self, obs: Dict[str, Any], quality: float, is_missing: int, is_noisy: int) -> Dict[str, Any]:
        temp = obs.get("engine_temp", 88.0) or 88.0
        vib = obs.get("vibration", 1.8) or 1.8
        oil = obs.get("oil_pressure", 4.0) or 4.0
        
        risk = 0.1
        fault = "Healthy"
        if vib > 3.8:
            risk = 0.85
            fault = "Bearing_Mechanical_Wear"
        elif temp > 105.0:
            risk = 0.80
            fault = "Cooling_System_Degradation"
        elif oil < 2.0:
            risk = 0.75
            fault = "Lubrication_Pressure_Loss"
            
        uncertainty = 0.15 + (1.0 - quality) * 0.5
        
        return {
            "failure_risk": round(risk, 3),
            "predicted_fault_type": fault,
            "time_to_failure_hours": 48.0 if risk > 0.5 else 450.0,
            "confidence_score": round(1.0 - uncertainty, 3),
            "uncertainty_score": round(uncertainty, 3),
            "observation_quality": round(quality, 3),
            "is_sensor_anomaly": bool(is_missing or is_noisy),
            "contributing_factors": [],
            "recommended_action": "Standard maintenance procedure.",
            "model_version": "Heuristic-Baseline-v1"
        }
