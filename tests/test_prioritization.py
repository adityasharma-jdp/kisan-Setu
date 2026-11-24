"""
Unit & Integration Tests: Maintenance Prioritization & Constraint Checking (Section 4.E)
Validates:
- Scheduling is blocked when required parts are out of stock.
- Scheduling is blocked when matching technician skills are unavailable.
- Candidates with higher risk & agricultural criticality rank higher.
"""

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.database import Base
from backend.models import Machine, Technician, SparePart, Prediction
from backend.prioritization import MaintenancePrioritizationEngine

@pytest.fixture
def test_db():
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(bind=engine)
    Session = sessionmaker(bind=engine)
    db = Session()

    # Seed 2 test machines
    m1 = Machine(
        machine_id="FP-TEST-1",
        name="Harvester Alpha",
        machine_type="Combine Harvester",
        model="H-1",
        status="At Risk",
        health_score=60.0
    )
    m2 = Machine(
        machine_id="FP-TEST-2",
        name="Sprayer Beta",
        machine_type="Crop Sprayer",
        model="S-1",
        status="Available",
        health_score=85.0
    )
    db.add_all([m1, m2])

    # Seed 1 prediction for m1 (Cooling degradation)
    p1 = Prediction(
        machine_id="FP-TEST-1",
        failure_risk=0.88,
        predicted_fault_type="Cooling_System_Degradation",
        time_to_failure_hours=35.0,
        uncertainty_score=0.15
    )
    db.add(p1)

    # Seed parts: radiator core in stock
    part1 = SparePart(
        part_number="PRT-RAD-4420",
        name="Aluminium Radiator Core",
        category="Cooling",
        stock_quantity=3,
        unit_cost=420.0
    )
    db.add(part1)

    # Seed technician: available senior tech
    tech1 = Technician(
        name="Elena Rostova",
        specialization="Engine Diagnostics & Thermal Systems",
        skill_level="Senior",
        is_available=True
    )
    db.add(tech1)
    db.commit()

    yield db
    db.close()

def test_prioritization_ranking_and_schedulable(test_db):
    engine = MaintenancePrioritizationEngine(test_db)
    plan = engine.generate_prioritized_schedule()

    assert len(plan) > 0
    top = plan[0]
    assert top["machine_id"] == "FP-TEST-1"
    assert top["priority_score"] > 60.0
    assert top["can_schedule"] is True
    assert top["bottleneck_reason"] is None
    assert "Elena Rostova" in top["recommended_technician"]

def test_prioritization_blocks_scheduling_when_parts_exhausted(test_db):
    # Set radiator stock to 0
    part = test_db.query(SparePart).filter(SparePart.part_number == "PRT-RAD-4420").first()
    part.stock_quantity = 0
    test_db.commit()

    engine = MaintenancePrioritizationEngine(test_db)
    plan = engine.generate_prioritized_schedule()

    top = plan[0]
    assert top["can_schedule"] is False
    assert "out of stock" in top["bottleneck_reason"].lower()

def test_prioritization_blocks_scheduling_when_technicians_busy(test_db):
    # Restore part but make tech busy
    part = test_db.query(SparePart).filter(SparePart.part_number == "PRT-RAD-4420").first()
    part.stock_quantity = 5
    tech = test_db.query(Technician).first()
    tech.is_available = False
    test_db.commit()

    engine = MaintenancePrioritizationEngine(test_db)
    plan = engine.generate_prioritized_schedule()

    top = plan[0]
    assert top["can_schedule"] is False
    assert "technician" in top["bottleneck_reason"].lower()
