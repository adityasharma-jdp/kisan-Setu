"""
Unit & Integration Tests: Sensor Quality and Uncertainty Handling (Section 4.D Mandate)
Ensures:
- Missing sensor readings do NOT automatically trigger false mechanical breakdown alerts!
- Noisy transient sensor bursts are classified as telemetry artifacts rather than mechanical failure.
"""

import pytest
from ml.predictor import MaintenancePredictor

@pytest.fixture(scope="module")
def predictor():
    return MaintenancePredictor()

def test_missing_sensor_does_not_cause_false_failure_alarm(predictor):
    """
    CRUCIAL TEST FOR SECTION 4.D:
    A healthy tractor with nominal operational parameters should NOT be
    classified as a critical mechanical breakdown merely because the vibration sensor dropped out.
    """
    obs_with_dropout = {
        "machine_id": "FP-102",
        "machine_type": "Heavy-Duty Tractor",
        "engine_temp": 88.0,        # completely nominal
        "vibration": None,           # missing telemetry packet
        "rpm": 2100.0,              # nominal
        "oil_pressure": 4.2,        # nominal
        "hydraulic_pressure": 205.0,# nominal
        "load_percentage": 75.0,
        "operating_hours": 1100.0
    }
    res = predictor.predict_observation(obs_with_dropout)

    # Must NOT classify as high failure risk!
    assert res["failure_risk"] < 0.45, f"False positive failure risk: {res['failure_risk']}"
    assert res["is_sensor_anomaly"] is True
    # Uncertainty must increase because a sensor is missing
    assert res["uncertainty_score"] > 0.15

def test_noisy_spike_tagged_as_sensor_telemetry_artifact(predictor):
    """
    A single electrical spike in temperature without continuous physical degradation
    should be identified as a transducer anomaly, not an engine seizure.
    """
    noisy_obs = {
        "machine_id": "FP-103",
        "machine_type": "Precision Planter",
        "engine_temp": 155.0,        # unphysical electrical EMI glitch
        "vibration": 1.4,            # nominal
        "rpm": 1850.0,               # nominal
        "oil_pressure": 4.5,         # nominal
        "hydraulic_pressure": 190.0, # nominal
        "load_percentage": 70.0,
        "operating_hours": 800.0
    }
    res = predictor.predict_observation(noisy_obs)
    assert res["is_sensor_anomaly"] is True
    assert res["failure_risk"] < 0.50
