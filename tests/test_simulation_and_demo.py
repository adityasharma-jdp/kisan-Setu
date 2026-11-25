"""
Simulation & Demonstration Integration Tests
Validates:
- Baseline comparison (Section 4.G): Strategy A vs Strategy B metrics & savings
- Complete 11-step guided intervention workflow execution (Section 4.H)
"""

import pytest
from fastapi.testclient import TestClient
from backend.main import app

@pytest.fixture(scope="module")
def client():
    with TestClient(app) as test_client:
        yield test_client

def test_baseline_comparison_strategy_metrics(client):
    res = client.get("/api/simulation/baseline-comparison?duration_days=30&fleet_size=24")
    assert res.status_code == 200
    data = res.json()

    a = data["strategy_a"]
    b = data["strategy_b"]
    s = data["savings"]

    # Condition-based AI must demonstrate superior availability & lower downtime
    assert b["fleet_availability_pct"] > a["fleet_availability_pct"]
    assert b["total_downtime_hours"] < a["total_downtime_hours"]
    assert b["total_cost"] < a["total_cost"]
    assert b["emergency_repairs_count"] < a["emergency_repairs_count"]
    assert b["mean_warning_lead_hours"] > 48.0 # proactive warning lead time advantage

    # Savings checks
    assert s["downtime_reduction_hours"] > 100.0
    assert s["cost_savings_usd"] > 10000.0
    assert len(data["timeline_comparison"]) == 30

def test_complete_11_step_intervention_demonstration(client):
    """Executes all 11 steps of the guided intervention demonstration sequentially."""
    for step in range(1, 12):
        res = client.post("/api/simulation/demo-step", json={"step": step, "machine_id": "FP-101"})
        assert res.status_code == 200, f"Step {step} failed with status {res.status_code}"
        body = res.json()
        assert body["step"] == step
        assert "title" in body
        assert "payload" in body

    # Verify final step 11 reflects elevated readiness and cost avoidance
    final_payload = body["payload"]
    assert final_payload["fleet_readiness_pct"] >= 75.0
    assert final_payload["estimated_cost_avoidance_usd"] > 0
