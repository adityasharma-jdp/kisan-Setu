"""
FarmPulse AI - Core FastAPI Application
Provides comprehensive REST API endpoints powering all 14 frontend modules,
digital twin telemetry, constrained prioritization, baseline comparison, and demo steps.
"""

from datetime import datetime, timedelta
import io
import csv
import random
from typing import List, Optional, Dict, Any
from fastapi import FastAPI, Depends, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import func

from backend.database import engine, Base, get_db
from backend.models import (
    Machine, SensorReading, ServiceHistory, Prediction,
    Alert, Technician, SparePart, WorkOrder, WorkOrderPart,
    MaintenanceEvent, SimulationRun, ScenarioResult
)
from backend.schemas import (
    MachineResponse, MachineCreate,
    SensorReadingResponse, SensorReadingCreate,
    PredictionResponse,
    AlertResponse, AlertAcknowledgeRequest,
    TechnicianResponse,
    SparePartResponse,
    WorkOrderResponse, WorkOrderCreate,
    FleetSummaryKPIs,
    ScenarioComparisonResponse,
    MaintenanceCandidate
)
from backend.seed import seed_database
from backend.prioritization import MaintenancePrioritizationEngine
from backend.simulation import SimulationEngine
from ml.predictor import MaintenancePredictor

# Initialize application
app = FastAPI(
    title="FarmPulse AI - Fleet Maintenance Intelligence API",
    description="Predict Today. Prevent Downtime Tomorrow. Digital Twin & Predictive Maintenance Engine for Agricultural Machinery.",
    version="2.0.0"
)

# CORS configuration for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure tables and seed data exist at startup
@app.on_event("startup")
def startup_event():
    Base.metadata.create_all(bind=engine)
    seed_database()

predictor = MaintenancePredictor()

# -------------------------------------------------------------
# 1. FLEET SUMMARY & KPIS
# -------------------------------------------------------------
@app.get("/api/fleet/summary", response_model=FleetSummaryKPIs)
def get_fleet_summary(db: Session = Depends(get_db)):
    """Computes real-time fleet health KPIs, readiness percentage, downtime, and resource stats."""
    total = db.query(Machine).count()
    available = db.query(Machine).filter(Machine.status.in_(["Available", "In Use"])).count()
    at_risk = db.query(Machine).filter(Machine.status == "At Risk").count()
    under_maint = db.query(Machine).filter(Machine.status == "Under Maintenance").count()

    readiness = round((available / max(1, total)) * 100, 1)
    
    crit_alerts = db.query(Alert).filter(Alert.status.in_(["New", "Acknowledged"]), Alert.alert_level == "Critical").count()
    open_wos = db.query(WorkOrder).filter(WorkOrder.status.in_(["Pending", "Scheduled", "In Progress"])).count()
    
    techs_total = db.query(Technician).count()
    techs_busy = db.query(Technician).filter(Technician.is_available == False).count()
    tech_util = round((techs_busy / max(1, techs_total)) * 100, 1)

    parts_total = db.query(func.sum(SparePart.stock_quantity)).scalar() or 0
    parts_low = db.query(SparePart).filter(SparePart.stock_quantity <= SparePart.minimum_threshold).count()

    # Total recorded downtime across maintenance
    total_dt = db.query(func.sum(WorkOrder.actual_hours)).scalar() or 184.5

    return {
        "total_machines": total,
        "available_machines": available,
        "machines_at_risk": at_risk,
        "under_maintenance": under_maint,
        "fleet_readiness_pct": readiness,
        "total_downtime_hours": round(float(total_dt), 1),
        "critical_alerts": crit_alerts,
        "open_work_orders": open_wos,
        "technician_utilization_pct": tech_util,
        "parts_in_stock": int(parts_total),
        "parts_low_stock": parts_low
    }


# -------------------------------------------------------------
# 2. MACHINE DIGITAL TWINS
# -------------------------------------------------------------
@app.get("/api/machines", response_model=List[MachineResponse])
def list_machines(
    machine_type: Optional[str] = None,
    status_filter: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Machine)
    if machine_type:
        query = query.filter(Machine.machine_type == machine_type)
    if status_filter:
        query = query.filter(Machine.status == status_filter)
    return query.order_by(Machine.machine_id).all()

@app.post("/api/machines", response_model=MachineResponse)
def create_machine(mach_in: MachineCreate, db: Session = Depends(get_db)):
    existing = db.query(Machine).filter(Machine.machine_id == mach_in.machine_id).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"Machine ID {mach_in.machine_id} already exists")
    
    machine = Machine(
        machine_id=mach_in.machine_id,
        name=mach_in.name,
        machine_type=mach_in.machine_type,
        model=mach_in.model,
        year=mach_in.year,
        status=mach_in.status,
        operating_state=mach_in.operating_state,
        health_score=mach_in.health_score,
        total_operating_hours=mach_in.total_operating_hours,
        location=mach_in.location,
        image_url=mach_in.image_url
    )
    db.add(machine)
    db.flush()

    # Initialize digital twin telemetry and baseline prediction
    sim = SimulationEngine(db)
    sim.inject_telemetry_reading(
        machine_id=mach_in.machine_id,
        load_percentage=75.0,
        is_missing=False,
        is_noisy=False
    )
    db.commit()
    db.refresh(machine)
    return machine

@app.get("/api/machines/{machine_id}", response_model=MachineResponse)
def get_machine(machine_id: str, db: Session = Depends(get_db)):
    machine = db.query(Machine).filter(Machine.machine_id == machine_id).first()
    if not machine:
        raise HTTPException(status_code=404, detail="Machine not found")
    return machine

@app.get("/api/machines/{machine_id}/digital-twin")
def get_machine_digital_twin(machine_id: str, db: Session = Depends(get_db)):
    """Fetches high-resolution digital twin condition telemetry, latest prediction, and active alerts."""
    machine = db.query(Machine).filter(Machine.machine_id == machine_id).first()
    if not machine:
        raise HTTPException(status_code=404, detail="Machine not found")

    latest_reading = (
        db.query(SensorReading)
        .filter(SensorReading.machine_id == machine_id)
        .order_by(SensorReading.timestamp.desc())
        .first()
    )

    history_readings = (
        db.query(SensorReading)
        .filter(SensorReading.machine_id == machine_id)
        .order_by(SensorReading.timestamp.desc())
        .limit(30)
        .all()
    )
    history_readings.reverse()

    latest_prediction = (
        db.query(Prediction)
        .filter(Prediction.machine_id == machine_id)
        .order_by(Prediction.timestamp.desc())
        .first()
    )

    alerts = (
        db.query(Alert)
        .filter(Alert.machine_id == machine_id)
        .order_by(Alert.created_at.desc())
        .limit(5)
        .all()
    )

    return {
        "machine": machine,
        "latest_telemetry": latest_reading,
        "telemetry_stream": history_readings,
        "latest_prediction": latest_prediction,
        "active_alerts": alerts
    }


# -------------------------------------------------------------
# 3. SENSOR TELEMETRY & INJECTION
# -------------------------------------------------------------
@app.get("/api/machines/{machine_id}/telemetry", response_model=List[SensorReadingResponse])
def get_telemetry_history(
    machine_id: str,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    readings = (
        db.query(SensorReading)
        .filter(SensorReading.machine_id == machine_id)
        .order_by(SensorReading.timestamp.desc())
        .limit(limit)
        .all()
    )
    readings.reverse()
    return readings

@app.post("/api/simulation/inject-telemetry")
def inject_telemetry(payload: Dict[str, Any], db: Session = Depends(get_db)):
    """Simulates live telemetry injection with missing or noisy sensor flags."""
    sim = SimulationEngine(db)
    res = sim.inject_telemetry_reading(
        machine_id=payload.get("machine_id", "FP-101"),
        engine_temp=payload.get("engine_temp"),
        vibration=payload.get("vibration"),
        rpm=payload.get("rpm"),
        oil_pressure=payload.get("oil_pressure"),
        hydraulic_pressure=payload.get("hydraulic_pressure"),
        load_percentage=payload.get("load_percentage", 80.0),
        is_missing=payload.get("is_missing", False),
        is_noisy=payload.get("is_noisy", False),
        missing_channel=payload.get("missing_channel", "None")
    )
    return res


# -------------------------------------------------------------
# 4. PREDICTIONS & ML EXPLAINABILITY
# -------------------------------------------------------------
@app.get("/api/predictions", response_model=List[PredictionResponse])
def list_latest_predictions(limit: int = 50, db: Session = Depends(get_db)):
    return db.query(Prediction).order_by(Prediction.timestamp.desc()).limit(limit).all()

@app.get("/api/predictions/metrics")
def get_model_evaluation_metrics():
    """Returns test set evaluation metrics, confusion matrix, and feature importances."""
    return predictor.metrics

@app.post("/api/predictions/evaluate")
def evaluate_custom_observation(observation: Dict[str, Any]):
    """Evaluates arbitrary custom sensor readings on the fly."""
    return predictor.predict_observation(observation)


# -------------------------------------------------------------
# 5. ALERTS MANAGEMENT
# -------------------------------------------------------------
@app.get("/api/alerts", response_model=List[AlertResponse])
def list_alerts(
    status_filter: Optional[str] = None,
    level: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Alert)
    if status_filter:
        query = query.filter(Alert.status == status_filter)
    if level:
        query = query.filter(Alert.alert_level == level)
    return query.order_by(Alert.created_at.desc()).all()

@app.post("/api/alerts/{alert_id}/acknowledge", response_model=AlertResponse)
def acknowledge_alert(
    alert_id: int,
    req: AlertAcknowledgeRequest,
    db: Session = Depends(get_db)
):
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    alert.status = "Acknowledged"
    alert.acknowledged_by = req.acknowledged_by
    alert.acknowledged_at = datetime.utcnow()
    db.commit()
    db.refresh(alert)
    return alert

@app.post("/api/alerts/{alert_id}/resolve", response_model=AlertResponse)
def resolve_alert(alert_id: int, db: Session = Depends(get_db)):
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    alert.status = "Resolved"
    alert.resolved_at = datetime.utcnow()
    db.commit()
    db.refresh(alert)
    return alert


# -------------------------------------------------------------
# 6. TECHNICIANS & ROSTER
# -------------------------------------------------------------
@app.get("/api/technicians", response_model=List[TechnicianResponse])
def list_technicians(available_only: bool = False, db: Session = Depends(get_db)):
    query = db.query(Technician)
    if available_only:
        query = query.filter(Technician.is_available == True)
    return query.order_by(Technician.name).all()

@app.post("/api/technicians/{tech_id}/toggle-availability")
def toggle_technician_availability(tech_id: int, db: Session = Depends(get_db)):
    tech = db.query(Technician).filter(Technician.id == tech_id).first()
    if not tech:
        raise HTTPException(status_code=404, detail="Technician not found")
    tech.is_available = not tech.is_available
    db.commit()
    return {"id": tech.id, "name": tech.name, "is_available": tech.is_available}


# -------------------------------------------------------------
# 7. SPARE PARTS INVENTORY
# -------------------------------------------------------------
@app.get("/api/spare-parts", response_model=List[SparePartResponse])
def list_spare_parts(category: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(SparePart)
    if category:
        query = query.filter(SparePart.category == category)
    return query.order_by(SparePart.category, SparePart.name).all()

@app.post("/api/spare-parts/{part_id}/reorder")
def reorder_spare_part(part_id: int, quantity: int = Query(5, ge=1), db: Session = Depends(get_db)):
    part = db.query(SparePart).filter(SparePart.id == part_id).first()
    if not part:
        raise HTTPException(status_code=404, detail="Part not found")
    part.stock_quantity += quantity
    db.commit()
    return {"id": part.id, "name": part.name, "new_stock_quantity": part.stock_quantity}


# -------------------------------------------------------------
# 8. WORK ORDERS MANAGEMENT
# -------------------------------------------------------------
@app.get("/api/work-orders", response_model=List[WorkOrderResponse])
def list_work_orders(status_filter: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(WorkOrder)
    if status_filter:
        query = query.filter(WorkOrder.status == status_filter)
    return query.order_by(WorkOrder.created_at.desc()).all()

@app.post("/api/work-orders", response_model=WorkOrderResponse)
def create_work_order(wo_in: WorkOrderCreate, db: Session = Depends(get_db)):
    now = datetime.utcnow()
    wo_num = f"WO-{now.strftime('%Y%m%d')}-{random.randint(100, 999)}"
    
    # Check parts availability & deduct
    total_parts_cost = 0.0
    for p_item in wo_in.parts:
        part = db.query(SparePart).filter(SparePart.id == p_item.part_id).first()
        if not part or part.stock_quantity < p_item.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Cannot schedule work order: insufficient inventory for part {part.name if part else 'Unknown'}"
            )
        part.stock_quantity -= p_item.quantity
        total_parts_cost += (part.unit_cost * p_item.quantity)

    # Check technician availability
    if wo_in.technician_id:
        tech = db.query(Technician).filter(Technician.id == wo_in.technician_id).first()
        if tech and not tech.is_available:
            raise HTTPException(status_code=400, detail=f"Technician {tech.name} is currently assigned or unavailable")
        if tech:
            tech.is_available = False

    work_order = WorkOrder(
        work_order_number=wo_num,
        machine_id=wo_in.machine_id,
        alert_id=wo_in.alert_id,
        priority=wo_in.priority,
        status="Scheduled" if wo_in.technician_id else "Pending",
        failure_type=wo_in.failure_type,
        description=wo_in.description,
        estimated_hours=wo_in.estimated_hours,
        technician_id=wo_in.technician_id,
        scheduled_start=now + timedelta(hours=1) if wo_in.technician_id else None,
        scheduled_end=now + timedelta(hours=int(wo_in.estimated_hours) + 1) if wo_in.technician_id else None,
        total_cost=total_parts_cost + (wo_in.estimated_hours * 65.0),
        notes=wo_in.notes or ""
    )
    db.add(work_order)

    # Update machine status
    machine = db.query(Machine).filter(Machine.machine_id == wo_in.machine_id).first()
    if machine:
        machine.status = "Under Maintenance"

    db.commit()
    db.refresh(work_order)
    return work_order

@app.post("/api/work-orders/{wo_id}/start")
def start_work_order(wo_id: int, db: Session = Depends(get_db)):
    wo = db.query(WorkOrder).filter(WorkOrder.id == wo_id).first()
    if not wo:
        raise HTTPException(status_code=404, detail="Work order not found")
    wo.status = "In Progress"
    wo.actual_start = datetime.utcnow()
    db.commit()
    return {"id": wo.id, "status": wo.status, "actual_start": wo.actual_start}

@app.post("/api/work-orders/{wo_id}/complete")
def complete_work_order(wo_id: int, actual_hours: float = Query(3.0, ge=0.5), db: Session = Depends(get_db)):
    wo = db.query(WorkOrder).filter(WorkOrder.id == wo_id).first()
    if not wo:
        raise HTTPException(status_code=404, detail="Work order not found")
    wo.status = "Completed"
    wo.actual_hours = actual_hours
    wo.actual_end = datetime.utcnow()

    # Free technician
    if wo.technician_id:
        tech = db.query(Technician).filter(Technician.id == wo.technician_id).first()
        if tech:
            tech.is_available = True

    # Restore machine condition
    machine = db.query(Machine).filter(Machine.machine_id == wo.machine_id).first()
    if machine:
        machine.status = "Available"
        machine.operating_state = "Operational"
        machine.health_score = 98.5
        machine.last_service_date = datetime.utcnow()

    # Resolve linked alert
    if wo.alert_id:
        alert = db.query(Alert).filter(Alert.id == wo.alert_id).first()
        if alert:
            alert.status = "Resolved"
            alert.resolved_at = datetime.utcnow()

    db.commit()
    return {"id": wo.id, "status": wo.status, "machine_status": machine.status if machine else "Available"}

@app.post("/api/work-orders/{wo_id}/cancel")
def cancel_work_order(wo_id: int, db: Session = Depends(get_db)):
    wo = db.query(WorkOrder).filter(WorkOrder.id == wo_id).first()
    if not wo:
        raise HTTPException(status_code=404, detail="Work order not found")
    wo.status = "Cancelled"
    if wo.technician_id:
        tech = db.query(Technician).filter(Technician.id == wo.technician_id).first()
        if tech:
            tech.is_available = True
    machine = db.query(Machine).filter(Machine.machine_id == wo.machine_id).first()
    if machine and machine.status == "Under Maintenance":
        machine.status = "Available"
    db.commit()
    return {"id": wo.id, "status": "Cancelled"}


# -------------------------------------------------------------
# 9. PRIORITIZATION ENGINE (Section 4.E)
# -------------------------------------------------------------
@app.get("/api/prioritization/plan", response_model=List[MaintenanceCandidate])
def get_prioritized_maintenance_plan(db: Session = Depends(get_db)):
    """Computes multi-attribute prioritization under technician and spare-parts constraints."""
    engine_inst = MaintenancePrioritizationEngine(db)
    return engine_inst.generate_prioritized_schedule()


# -------------------------------------------------------------
# 10. BASELINE STRATEGY COMPARISON (Section 4.G)
# -------------------------------------------------------------
@app.get("/api/simulation/baseline-comparison", response_model=ScenarioComparisonResponse)
def get_baseline_comparison(duration_days: int = 30, fleet_size: int = 24, db: Session = Depends(get_db)):
    """Compares Calendar-Only vs Condition-Based AI maintenance on identical synthetic scenario."""
    sim = SimulationEngine(db)
    return sim.run_baseline_comparison(duration_days=duration_days, fleet_size=fleet_size)


# -------------------------------------------------------------
# 11. GUIDED INTERVENTION DEMONSTRATION (Section 4.H)
# -------------------------------------------------------------
@app.post("/api/simulation/demo-step")
def trigger_demo_step(payload: Dict[str, Any], db: Session = Depends(get_db)):
    """Executes a single step in the 11-step interactive intervention demonstration."""
    step = int(payload.get("step", 1))
    machine_id = str(payload.get("machine_id", "FP-101"))
    sim = SimulationEngine(db)
    return sim.execute_demo_step(step_number=step, machine_id=machine_id)


# -------------------------------------------------------------
# 12. ANALYTICS & CSV REPORTS EXPORT (Section 4.I)
# -------------------------------------------------------------
@app.get("/api/reports/export-csv")
def export_reports_csv(report_type: str = "fleet_health", db: Session = Depends(get_db)):
    """Exports structured fleet analytics as downloadable CSV."""
    output = io.StringIO()
    writer = csv.writer(output)

    if report_type == "fleet_health":
        writer.writerow(["Machine ID", "Name", "Type", "Status", "Operating State", "Health Score", "Operating Hours", "Location"])
        machines = db.query(Machine).all()
        for m in machines:
            writer.writerow([m.machine_id, m.name, m.machine_type, m.status, m.operating_state, m.health_score, m.total_operating_hours, m.location])
        filename = f"farmpulse_fleet_health_{datetime.utcnow().strftime('%Y%m%d')}.csv"

    elif report_type == "work_orders":
        writer.writerow(["WO Number", "Machine ID", "Priority", "Status", "Failure Type", "Estimated Hours", "Actual Hours", "Cost", "Created At"])
        wos = db.query(WorkOrder).all()
        for w in wos:
            writer.writerow([w.work_order_number, w.machine_id, w.priority, w.status, w.failure_type, w.estimated_hours, w.actual_hours, w.total_cost, w.created_at])
        filename = f"farmpulse_work_orders_{datetime.utcnow().strftime('%Y%m%d')}.csv"

    else:
        writer.writerow(["Part Number", "Name", "Category", "Stock", "Min Threshold", "Unit Cost", "Lead Time Days", "Location"])
        parts = db.query(SparePart).all()
        for p in parts:
            writer.writerow([p.part_number, p.name, p.category, p.stock_quantity, p.minimum_threshold, p.unit_cost, p.lead_time_days, p.shelf_location])
        filename = f"farmpulse_inventory_{datetime.utcnow().strftime('%Y%m%d')}.csv"

    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )
