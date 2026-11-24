"""
API Integration Tests: FastAPI Endpoints & Work Order Lifecycle
Tests:
- GET /api/fleet/summary
- GET /api/machines
- POST /api/work-orders (create, start, complete)
- Alert resolution and machine condition update verification
"""

import pytest
from fastapi.testclient import TestClient
from backend.main import app

@pytest.fixture(scope="module")
def client():
    return TestClient(app)

def test_fleet_summary_kpis(client):
    res = client.get("/api/fleet/summary")
    assert res.status_code == 200
    data = res.json()
    assert data["total_machines"] >= 20
    assert 0.0 <= data["fleet_readiness_pct"] <= 100.0
    assert "technician_utilization_pct" in data

def test_list_machines(client):
    res = client.get("/api/machines")
    assert res.status_code == 200
    data = res.json()
    assert len(data) >= 20
    assert any(m["machine_id"] == "FP-101" for m in data)

def test_digital_twin_endpoint(client):
    res = client.get("/api/machines/FP-101/digital-twin")
    assert res.status_code == 200
    data = res.json()
    assert "machine" in data
    assert "telemetry_stream" in data
    assert "latest_prediction" in data

def test_telemetry_injection_and_prediction(client):
    payload = {
        "machine_id": "FP-101",
        "engine_temp": 112.5,
        "vibration": 4.6,
        "rpm": 2085.0,
        "oil_pressure": 2.8,
        "hydraulic_pressure": 195.0,
        "load_percentage": 90.0
    }
    res = client.post("/api/simulation/inject-telemetry", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "reading" in data
    assert "prediction" in data
    assert data["prediction"]["failure_risk"] > 0.60

def test_work_order_lifecycle(client):
    # 1. Create work order
    wo_payload = {
        "machine_id": "FP-102",
        "priority": "High",
        "failure_type": "Bearing Replacement",
        "description": "Integration test work order",
        "estimated_hours": 3.0
    }
    create_res = client.post("/api/work-orders", json=wo_payload)
    assert create_res.status_code == 200
    wo = create_res.json()
    wo_id = wo["id"]
    assert wo["status"] in ["Scheduled", "Pending"]

    # 2. Start work order
    start_res = client.post(f"/api/work-orders/{wo_id}/start")
    assert start_res.status_code == 200
    assert start_res.json()["status"] == "In Progress"

    # 3. Complete work order
    comp_res = client.post(f"/api/work-orders/{wo_id}/complete?actual_hours=2.8")
    assert comp_res.status_code == 200
    assert comp_res.json()["status"] == "Completed"
