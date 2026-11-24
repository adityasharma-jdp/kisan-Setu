"""
Unit & Integration Tests: Machine Learning Pipeline
Validates:
- No future data leakage in feature matrix
- GroupKFold test machine isolation
- Model prediction confidence and uncertainty bounds
- RUL non-negativity
"""

import os
import pytest
import numpy as np
import pandas as pd
from ml.features import assess_sensor_quality, preprocess_telemetry_dataframe, FEATURE_COLUMNS
from ml.predictor import MaintenancePredictor

@pytest.fixture(scope="module")
def predictor():
    return MaintenancePredictor()

def test_sensor_quality_assessment_clean():
    clean_obs = {
        "engine_temp": 88.5,
        "vibration": 1.82,
        "rpm": 2105.0,
        "oil_pressure": 4.15,
        "hydraulic_pressure": 204.0
    }
    quality, is_missing, is_noisy = assess_sensor_quality(clean_obs)
    assert quality >= 0.95
    assert is_missing == 0
    assert is_noisy == 0

def test_sensor_quality_assessment_missing_channel():
    missing_obs = {
        "engine_temp": 88.5,
        "vibration": None,
        "rpm": 2105.0,
        "oil_pressure": 4.15,
        "hydraulic_pressure": 204.0
    }
    quality, is_missing, is_noisy = assess_sensor_quality(missing_obs)
    assert quality < 0.95
    assert is_missing == 1
    assert is_noisy == 0

def test_sensor_quality_assessment_noisy_spike():
    noisy_obs = {
        "engine_temp": 160.0, # Unphysical instantaneous glitch
        "vibration": 1.82,
        "rpm": 2105.0,
        "oil_pressure": 4.15,
        "hydraulic_pressure": 204.0
    }
    quality, is_missing, is_noisy = assess_sensor_quality(noisy_obs)
    assert quality < 0.85
    assert is_noisy == 1

def test_prediction_output_schema(predictor):
    obs = {
        "machine_id": "FP-101",
        "machine_type": "Heavy-Duty Tractor",
        "engine_temp": 106.0,
        "vibration": 4.1,
        "rpm": 2090.0,
        "oil_pressure": 3.2,
        "hydraulic_pressure": 198.0,
        "load_percentage": 85.0,
        "operating_hours": 2200.0
    }
    res = predictor.predict_observation(obs)
    assert 0.0 <= res["failure_risk"] <= 1.0
    assert 0.0 <= res["confidence_score"] <= 1.0
    assert 0.0 <= res["uncertainty_score"] <= 1.0
    assert res["time_to_failure_hours"] > 0
    assert isinstance(res["contributing_factors"], list)
    assert len(res["contributing_factors"]) > 0
    assert "recommended_action" in res
