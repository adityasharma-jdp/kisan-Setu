"""
FarmPulse AI - Synthetic Agricultural Fleet Telemetry & Fault Generator
Generates realistic multivariate sensor telemetry with physical degradation curves,
sensor dropouts, noise bursts, and labeled time-to-failure windows.
"""

import numpy as np
import pandas as pd
import json
import os
from typing import Dict, List, Tuple

# Machinery types and nominal operating baselines
MACHINE_SPECS = {
    "Heavy-Duty Tractor": {
        "engine_temp_base": 88.0,      # °C
        "vibration_base": 1.8,          # mm/s RMS
        "rpm_nominal": 2100.0,         # RPM
        "oil_pressure_base": 4.2,       # bar
        "hydraulic_pressure_base": 205.0,# bar
        "fuel_rate_base": 28.5,         # L/h
        "daily_operating_hours": 9.5,
    },
    "Combine Harvester": {
        "engine_temp_base": 92.0,
        "vibration_base": 2.6,
        "rpm_nominal": 2300.0,
        "oil_pressure_base": 4.0,
        "hydraulic_pressure_base": 215.0,
        "fuel_rate_base": 42.0,
        "daily_operating_hours": 11.0,
    },
    "Precision Planter": {
        "engine_temp_base": 82.0,
        "vibration_base": 1.4,
        "rpm_nominal": 1850.0,
        "oil_pressure_base": 4.5,
        "hydraulic_pressure_base": 190.0,
        "fuel_rate_base": 18.0,
        "daily_operating_hours": 8.0,
    },
    "Crop Sprayer": {
        "engine_temp_base": 85.0,
        "vibration_base": 1.9,
        "rpm_nominal": 1950.0,
        "oil_pressure_base": 4.1,
        "hydraulic_pressure_base": 180.0,
        "fuel_rate_base": 22.0,
        "daily_operating_hours": 7.5,
    },
    "Forage Harvester": {
        "engine_temp_base": 94.0,
        "vibration_base": 2.9,
        "rpm_nominal": 2350.0,
        "oil_pressure_base": 3.9,
        "hydraulic_pressure_base": 220.0,
        "fuel_rate_base": 46.0,
        "daily_operating_hours": 10.5,
    }
}

FAULT_MODES = [
    "Cooling_System_Degradation",
    "Bearing_Mechanical_Wear",
    "Hydraulic_Cavitation_Leak",
    "Lubrication_Pressure_Loss",
]

def generate_telemetry_series(
    machine_id: str,
    machine_type: str,
    n_hours: int = 720,
    seed: int = 42,
    fault_profile: str = "None",
    fault_onset_hour: int = 500,
    sensor_dropout_rate: float = 0.05,
    noise_burst_rate: float = 0.04
) -> pd.DataFrame:
    """
    Generates an hourly telemetry series for a farm machine over n_hours.
    Simulates physics-based degradation, noise bursts, and sensor dropouts.
    """
    rng = np.random.RandomState(seed)
    specs = MACHINE_SPECS[machine_type]
    
    records = []
    
    # Cumulative machine baseline hours
    base_hours = rng.randint(800, 3500)
    
    # Degradation progression accumulator (0.0 healthy -> 1.0 critical failure)
    degradation = 0.0
    
    for h in range(n_hours):
        current_hours = base_hours + h
        # Daily diurnal cycle (day vs night temperature fluctuations)
        diurnal_factor = np.sin(2 * np.pi * (h % 24) / 24) * 4.0
        # Agricultural load variation (60% to 100% rated capacity)
        load_pct = np.clip(rng.normal(78.0, 10.0), 45.0, 100.0)
        load_ratio = load_pct / 80.0
        
        # Advance fault degradation curve if past onset
        if fault_profile != "None" and h >= fault_onset_hour:
            # Exponentially accelerating degradation curve (realistic Weibull-type damage)
            progress = (h - fault_onset_hour) / max(1, (n_hours - fault_onset_hour))
            degradation = np.clip(0.05 + 0.95 * (progress ** 2.2), 0.0, 1.0)
        else:
            # Baseline gentle aging drift
            degradation = np.clip(0.02 * (h / n_hours), 0.0, 0.05)
            
        # Physics model for each sensor channel
        # 1. Engine Temp
        temp_nominal = specs["engine_temp_base"] + diurnal_factor + (load_ratio - 1.0) * 8.0
        if fault_profile == "Cooling_System_Degradation":
            temp_fault = 38.0 * degradation
        else:
            temp_fault = 4.0 * degradation
        temp = temp_nominal + temp_fault + rng.normal(0, 1.2)
        
        # 2. Vibration
        vib_nominal = specs["vibration_base"] * (0.85 + 0.25 * load_ratio)
        if fault_profile == "Bearing_Mechanical_Wear":
            vib_fault = 4.8 * degradation
        else:
            vib_fault = 0.3 * degradation
        vib = vib_nominal + vib_fault + rng.normal(0, 0.15)
        
        # 3. RPM
        rpm_nominal = specs["rpm_nominal"] * (0.97 + 0.05 * (load_pct / 100.0))
        rpm_fluctuation = rng.normal(0, 12.0)
        if fault_profile == "Lubrication_Pressure_Loss" and degradation > 0.6:
            rpm_fluctuation -= 90.0 * degradation
        rpm = rpm_nominal + rpm_fluctuation
        
        # 4. Oil Pressure
        oil_nominal = specs["oil_pressure_base"] - 0.2 * (temp / 100.0)
        if fault_profile == "Lubrication_Pressure_Loss":
            oil_fault = -2.6 * degradation
        else:
            oil_fault = -0.15 * degradation
        oil = max(0.5, oil_nominal + oil_fault + rng.normal(0, 0.08))
        
        # 5. Hydraulic Pressure
        hyd_nominal = specs["hydraulic_pressure_base"] * (0.95 + 0.08 * load_ratio)
        if fault_profile == "Hydraulic_Cavitation_Leak":
            hyd_fault = -75.0 * degradation
        else:
            hyd_fault = -2.0 * degradation
        hyd = max(30.0, hyd_nominal + hyd_fault + rng.normal(0, 2.5))
        
        # 6. Fuel Rate
        fuel = specs["fuel_rate_base"] * load_ratio * (1.0 + 0.18 * degradation) + rng.normal(0, 0.8)
        
        # 7. Ambient Temp
        ambient = 22.0 + diurnal_factor * 1.5 + rng.normal(0, 1.5)
        
        # SENSOR ANOMALIES & QUALITY DEGRADATION (Mandatory Section D)
        # Check for noise burst (transient electrical EMI or sensor transducer glitch)
        is_noisy = rng.rand() < noise_burst_rate
        if is_noisy:
            noisy_channel = rng.choice(["engine_temp", "vibration", "oil_pressure", "hydraulic_pressure"])
            if noisy_channel == "vibration":
                vib += rng.choice([-1.0, 1.0]) * rng.uniform(2.5, 5.0)
            elif noisy_channel == "engine_temp":
                temp += rng.uniform(15.0, 30.0)  # sudden glitch spike
            elif noisy_channel == "oil_pressure":
                oil = max(0.2, oil + rng.uniform(-1.5, 1.5))
            elif noisy_channel == "hydraulic_pressure":
                hyd = max(20.0, hyd + rng.uniform(-50.0, 50.0))
                
        # Check for sensor dropout (missing telemetry packet / disconnection)
        is_missing = rng.rand() < sensor_dropout_rate
        missing_channel = None
        if is_missing:
            missing_channel = rng.choice(["engine_temp", "vibration", "oil_pressure", "hydraulic_pressure", "rpm"])
            
        # Calculate Observation Quality Score [0.0 - 1.0]
        # Distinguish between true fault evidence vs faulty sensor observation!
        quality_score = 1.0
        if is_noisy:
            quality_score -= 0.30
        if is_missing:
            quality_score -= 0.35
            
        quality_score = float(np.clip(quality_score - rng.uniform(0.0, 0.05), 0.10, 1.0))
        
        # Binary developing fault label: 1 if developing fault within next 48-120 hours OR active
        # Avoid data leakage: We predict whether an actual fault is developing
        is_developing_fault = 1 if (fault_profile != "None" and h >= (fault_onset_hour - 72) and degradation > 0.18) else 0
        hours_to_failure = max(0, n_hours - h) if (fault_profile != "None" and h >= fault_onset_hour) else 999
        
        records.append({
            "machine_id": machine_id,
            "machine_type": machine_type,
            "hour_index": h,
            "operating_hours": current_hours,
            "load_percentage": round(float(load_pct), 2),
            "engine_temp": round(float(temp), 2) if missing_channel != "engine_temp" else None,
            "vibration": round(float(vib), 3) if missing_channel != "vibration" else None,
            "rpm": round(float(rpm), 1) if missing_channel != "rpm" else None,
            "oil_pressure": round(float(oil), 2) if missing_channel != "oil_pressure" else None,
            "hydraulic_pressure": round(float(hyd), 1) if missing_channel != "hydraulic_pressure" else None,
            "fuel_rate": round(float(fuel), 2),
            "ambient_temp": round(float(ambient), 2),
            "is_noisy": 1 if is_noisy else 0,
            "is_missing": 1 if is_missing else 0,
            "missing_channel": missing_channel or "None",
            "quality_score": round(quality_score, 3),
            "degradation_level": round(float(degradation), 4),
            "fault_mode": fault_profile if (h >= fault_onset_hour and fault_profile != "None") else "Healthy",
            "is_developing_fault": is_developing_fault,
            "time_to_failure_hours": hours_to_failure
        })
        
    return pd.DataFrame(records)

def build_fleet_dataset(n_machines: int = 24, seed: int = 101, output_dir: str = "dataset") -> str:
    """
    Generates synthetic fleet telemetry across 24 machines over 30 days (720 hours).
    Splits into healthy vs various developing fault profiles across diverse machine types.
    """
    os.makedirs(output_dir, exist_ok=True)
    rng = np.random.RandomState(seed)
    
    types = list(MACHINE_SPECS.keys())
    fleet_dfs = []
    
    for i in range(n_machines):
        machine_id = f"FP-{101 + i}"
        m_type = types[i % len(types)]
        
        # 60% healthy / normal aging, 40% experiencing developing faults
        if i % 3 == 0 or i % 5 == 0:
            fault_mode = rng.choice(FAULT_MODES)
            onset_hour = rng.randint(240, 560)
        else:
            fault_mode = "None"
            onset_hour = 999
            
        m_seed = seed + i * 17
        df_m = generate_telemetry_series(
            machine_id=machine_id,
            machine_type=m_type,
            n_hours=720,
            seed=m_seed,
            fault_profile=fault_mode,
            fault_onset_hour=onset_hour,
            sensor_dropout_rate=0.06,
            noise_burst_rate=0.05
        )
        fleet_dfs.append(df_m)
        
    full_df = pd.concat(fleet_dfs, ignore_index=True)
    csv_path = os.path.join(output_dir, "fleet_telemetry.csv")
    full_df.to_csv(csv_path, index=False)
    print(f"Generated {len(full_df)} telemetry rows across {n_machines} machines -> {csv_path}")
    return csv_path

if __name__ == "__main__":
    build_fleet_dataset()
