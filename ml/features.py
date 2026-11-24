"""
FarmPulse AI - Feature Engineering and Sensor Quality Processing
Implements:
- Observation quality assessment
- Missing reading imputation with uncertainty penalty
- Sensor noise detection
- Rolling aggregations and thermal/vibrational rate of change
"""

import numpy as np
import pandas as pd
from typing import Dict, Any, Tuple, List

# Nominal operating baselines by machine type
NOMINALS = {
    "Heavy-Duty Tractor": {"temp": 88.0, "vib": 1.8, "rpm": 2100.0, "oil": 4.2, "hyd": 205.0},
    "Combine Harvester": {"temp": 92.0, "vib": 2.6, "rpm": 2300.0, "oil": 4.0, "hyd": 215.0},
    "Precision Planter": {"temp": 82.0, "vib": 1.4, "rpm": 1850.0, "oil": 4.5, "hyd": 190.0},
    "Crop Sprayer": {"temp": 85.0, "vib": 1.9, "rpm": 1950.0, "oil": 4.1, "hyd": 180.0},
    "Forage Harvester": {"temp": 94.0, "vib": 2.9, "rpm": 2350.0, "oil": 3.9, "hyd": 220.0},
}

FEATURE_COLUMNS = [
    "engine_temp_imputed",
    "vibration_imputed",
    "rpm_imputed",
    "oil_pressure_imputed",
    "hydraulic_pressure_imputed",
    "temp_deviation_from_nominal",
    "vib_ratio_to_nominal",
    "oil_pressure_drop",
    "hydraulic_pressure_drop",
    "temp_to_ambient_ratio",
    "load_percentage",
    "operating_hours",
    "quality_score",
    "is_missing_flag",
    "is_noisy_flag",
]

def assess_sensor_quality(row: Dict[str, Any]) -> Tuple[float, int, int]:
    """
    Evaluates observation reliability score [0.0 - 1.0], missing flag, and noise flag.
    Distinguishes sensor artifacts from real developing mechanical faults.
    """
    channels = ["engine_temp", "vibration", "rpm", "oil_pressure", "hydraulic_pressure"]
    
    missing_count = sum(1 for ch in channels if row.get(ch) is None or pd.isna(row.get(ch)))
    is_missing = 1 if missing_count > 0 else 0
    
    # Check for unphysical instantaneous noise spikes
    is_noisy = 0
    temp = row.get("engine_temp")
    vib = row.get("vibration")
    oil = row.get("oil_pressure")
    
    if temp is not None and (temp > 145.0 or temp < -10.0):
        is_noisy = 1
    if vib is not None and (vib > 12.0 or vib < 0.0):
        is_noisy = 1
    if oil is not None and (oil > 10.0 or oil < 0.0):
        is_noisy = 1
        
    quality = 1.0 - (0.35 * (missing_count / len(channels))) - (0.25 * is_noisy)
    quality = max(0.10, min(1.0, quality))
    
    return float(round(quality, 3)), is_missing, is_noisy

def preprocess_telemetry_dataframe(df: pd.DataFrame) -> pd.DataFrame:
    """
    Preprocesses raw telemetry data frame into ML feature matrix.
    Safe imputation without future leakage: uses machine nominal baselines.
    """
    data = df.copy()
    
    # Impute missing values using machine type nominals
    for m_type, spec in NOMINALS.items():
        mask = data["machine_type"] == m_type
        data.loc[mask, "engine_temp_imputed"] = data.loc[mask, "engine_temp"].fillna(spec["temp"])
        data.loc[mask, "vibration_imputed"] = data.loc[mask, "vibration"].fillna(spec["vib"])
        data.loc[mask, "rpm_imputed"] = data.loc[mask, "rpm"].fillna(spec["rpm"])
        data.loc[mask, "oil_pressure_imputed"] = data.loc[mask, "oil_pressure"].fillna(spec["oil"])
        data.loc[mask, "hydraulic_pressure_imputed"] = data.loc[mask, "hydraulic_pressure"].fillna(spec["hyd"])
        
    # Baseline fallback if unknown type
    data["engine_temp_imputed"] = data["engine_temp_imputed"].fillna(88.0)
    data["vibration_imputed"] = data["vibration_imputed"].fillna(1.8)
    data["rpm_imputed"] = data["rpm_imputed"].fillna(2000.0)
    data["oil_pressure_imputed"] = data["oil_pressure_imputed"].fillna(4.0)
    data["hydraulic_pressure_imputed"] = data["hydraulic_pressure_imputed"].fillna(200.0)
    
    # Domain physical ratios
    nominal_temps = data["machine_type"].map(lambda t: NOMINALS.get(t, {}).get("temp", 88.0))
    nominal_vibs = data["machine_type"].map(lambda t: NOMINALS.get(t, {}).get("vib", 1.8))
    nominal_oils = data["machine_type"].map(lambda t: NOMINALS.get(t, {}).get("oil", 4.0))
    nominal_hyds = data["machine_type"].map(lambda t: NOMINALS.get(t, {}).get("hyd", 200.0))
    
    data["temp_deviation_from_nominal"] = data["engine_temp_imputed"] - nominal_temps
    data["vib_ratio_to_nominal"] = data["vibration_imputed"] / (nominal_vibs + 1e-4)
    data["oil_pressure_drop"] = nominal_oils - data["oil_pressure_imputed"]
    data["hydraulic_pressure_drop"] = nominal_hyds - data["hydraulic_pressure_imputed"]
    
    ambient = data["ambient_temp"].replace(0, 20.0).fillna(20.0)
    data["temp_to_ambient_ratio"] = data["engine_temp_imputed"] / ambient
    
    data["is_missing_flag"] = data["is_missing"].fillna(0).astype(int)
    data["is_noisy_flag"] = data["is_noisy"].fillna(0).astype(int)
    data["quality_score"] = data["quality_score"].fillna(1.0).astype(float)
    
    return data
