"""
FarmPulse AI - SQLAlchemy ORM Relational Models
12 Normalized entities supporting fleet management, digital twin telemetry,
explainable predictions, constrained scheduling, and baseline strategy comparison.
"""

from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Float, Boolean, DateTime,
    ForeignKey, Text, JSON
)
from sqlalchemy.orm import relationship

from backend.database import Base

class Machine(Base):
    __tablename__ = "machines"

    id = Column(Integer, primary_key=True, index=True)
    machine_id = Column(String(50), unique=True, index=True, nullable=False) # e.g. "FP-101"
    name = Column(String(100), nullable=False) # e.g. "AgriMax Titan 9000"
    machine_type = Column(String(50), nullable=False) # "Heavy-Duty Tractor", "Combine Harvester", etc.
    model = Column(String(50), nullable=False)
    year = Column(Integer, default=2022)
    status = Column(String(30), default="Available") # "Available", "In Use", "At Risk", "Under Maintenance"
    operating_state = Column(String(30), default="Operational") # "Operational", "Degraded", "Critical", "Offline"
    health_score = Column(Float, default=98.0) # 0 to 100
    total_operating_hours = Column(Float, default=1240.0)
    last_service_date = Column(DateTime, default=datetime.utcnow)
    next_service_due = Column(DateTime)
    location = Column(String(100), default="North Sector Farm 4")
    image_url = Column(String(255), default="/tractor.svg")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    sensor_readings = relationship("SensorReading", back_populates="machine", cascade="all, delete-orphan")
    predictions = relationship("Prediction", back_populates="machine", cascade="all, delete-orphan")
    alerts = relationship("Alert", back_populates="machine", cascade="all, delete-orphan")
    work_orders = relationship("WorkOrder", back_populates="machine", cascade="all, delete-orphan")
    service_histories = relationship("ServiceHistory", back_populates="machine", cascade="all, delete-orphan")
    maintenance_events = relationship("MaintenanceEvent", back_populates="machine", cascade="all, delete-orphan")


class SensorReading(Base):
    __tablename__ = "sensor_readings"

    id = Column(Integer, primary_key=True, index=True)
    machine_id = Column(String(50), ForeignKey("machines.machine_id"), nullable=False, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    hour_index = Column(Integer, default=0)
    engine_temp = Column(Float, nullable=True) # °C
    vibration = Column(Float, nullable=True)   # mm/s RMS
    rpm = Column(Float, nullable=True)
    oil_pressure = Column(Float, nullable=True) # bar
    hydraulic_pressure = Column(Float, nullable=True) # bar
    fuel_rate = Column(Float, default=25.0)    # L/h
    ambient_temp = Column(Float, default=24.0)
    load_percentage = Column(Float, default=75.0)
    is_missing = Column(Boolean, default=False)
    is_noisy = Column(Boolean, default=False)
    missing_channel = Column(String(50), default="None")
    quality_score = Column(Float, default=1.0)
    created_at = Column(DateTime, default=datetime.utcnow)

    machine = relationship("Machine", back_populates="sensor_readings")


class ServiceHistory(Base):
    __tablename__ = "service_histories"

    id = Column(Integer, primary_key=True, index=True)
    machine_id = Column(String(50), ForeignKey("machines.machine_id"), nullable=False, index=True)
    service_date = Column(DateTime, default=datetime.utcnow)
    service_type = Column(String(50), nullable=False) # "Routine Preventive", "Condition-Based Repair", "Emergency Overhaul"
    description = Column(Text, nullable=False)
    technician_name = Column(String(100), nullable=False)
    cost = Column(Float, default=450.0)
    downtime_hours = Column(Float, default=3.5)
    parts_replaced = Column(String(255), default="Engine Oil, Filter")
    created_at = Column(DateTime, default=datetime.utcnow)

    machine = relationship("Machine", back_populates="service_histories")


class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    machine_id = Column(String(50), ForeignKey("machines.machine_id"), nullable=False, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    failure_risk = Column(Float, nullable=False) # 0.0 to 1.0
    predicted_fault_type = Column(String(100), default="Healthy")
    time_to_failure_hours = Column(Float, default=360.0)
    confidence_score = Column(Float, default=0.90) # 0.0 to 1.0
    uncertainty_score = Column(Float, default=0.10) # 0.0 to 1.0
    observation_quality = Column(Float, default=0.95)
    is_sensor_anomaly = Column(Boolean, default=False)
    top_contributing_factors = Column(JSON, default=list)
    recommended_action = Column(Text, nullable=True)
    model_version = Column(String(50), default="RF-Fleet-v2.1")
    created_at = Column(DateTime, default=datetime.utcnow)

    machine = relationship("Machine", back_populates="predictions")
    alerts = relationship("Alert", back_populates="prediction")


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    machine_id = Column(String(50), ForeignKey("machines.machine_id"), nullable=False, index=True)
    prediction_id = Column(Integer, ForeignKey("predictions.id"), nullable=True)
    alert_level = Column(String(20), default="Warning") # "Info", "Warning", "Critical"
    fault_category = Column(String(100), nullable=False)
    title = Column(String(150), nullable=False)
    description = Column(Text, nullable=False)
    status = Column(String(30), default="New") # "New", "Acknowledged", "Scheduled", "Resolved"
    acknowledged_by = Column(String(100), nullable=True)
    acknowledged_at = Column(DateTime, nullable=True)
    resolved_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    machine = relationship("Machine", back_populates="alerts")
    prediction = relationship("Prediction", back_populates="alerts")
    work_orders = relationship("WorkOrder", back_populates="alert")


class Technician(Base):
    __tablename__ = "technicians"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    skill_level = Column(String(30), default="Senior") # "Junior", "Intermediate", "Senior", "Master Tech"
    specialization = Column(String(100), default="Mechanical & Hydraulics")
    hourly_rate = Column(Float, default=65.0)
    is_available = Column(Boolean, default=True)
    current_assignment_id = Column(Integer, nullable=True)
    phone = Column(String(30), default="+1 (555) 349-1029")
    email = Column(String(100), default="tech@farmpulse.ai")
    shift = Column(String(30), default="Morning") # "Morning", "Evening", "Night"
    created_at = Column(DateTime, default=datetime.utcnow)

    work_orders = relationship("WorkOrder", back_populates="technician")


class SparePart(Base):
    __tablename__ = "spare_parts"

    id = Column(Integer, primary_key=True, index=True)
    part_number = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)
    category = Column(String(50), default="Hydraulics") # "Hydraulics", "Cooling", "Bearings", "Lubrication", "Electrical"
    stock_quantity = Column(Integer, default=10)
    minimum_threshold = Column(Integer, default=3)
    unit_cost = Column(Float, default=120.0)
    lead_time_days = Column(Integer, default=2)
    compatible_machine_types = Column(String(200), default="All Machinery")
    shelf_location = Column(String(50), default="Bay A-12")
    created_at = Column(DateTime, default=datetime.utcnow)

    work_order_parts = relationship("WorkOrderPart", back_populates="part")


class WorkOrder(Base):
    __tablename__ = "work_orders"

    id = Column(Integer, primary_key=True, index=True)
    work_order_number = Column(String(50), unique=True, index=True, nullable=False) # e.g. "WO-2026-081"
    machine_id = Column(String(50), ForeignKey("machines.machine_id"), nullable=False, index=True)
    alert_id = Column(Integer, ForeignKey("alerts.id"), nullable=True)
    priority = Column(String(20), default="Medium") # "Low", "Medium", "High", "Critical Emergency"
    status = Column(String(30), default="Pending") # "Pending", "Scheduled", "In Progress", "Completed", "Cancelled"
    failure_type = Column(String(100), default="Bearing Wear")
    description = Column(Text, nullable=False)
    estimated_hours = Column(Float, default=3.0)
    actual_hours = Column(Float, default=0.0)
    technician_id = Column(Integer, ForeignKey("technicians.id"), nullable=True)
    scheduled_start = Column(DateTime, nullable=True)
    scheduled_end = Column(DateTime, nullable=True)
    actual_start = Column(DateTime, nullable=True)
    actual_end = Column(DateTime, nullable=True)
    total_cost = Column(Float, default=0.0)
    notes = Column(Text, default="")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    machine = relationship("Machine", back_populates="work_orders")
    alert = relationship("Alert", back_populates="work_orders")
    technician = relationship("Technician", back_populates="work_orders")
    parts = relationship("WorkOrderPart", back_populates="work_order", cascade="all, delete-orphan")


class WorkOrderPart(Base):
    __tablename__ = "work_order_parts"

    id = Column(Integer, primary_key=True, index=True)
    work_order_id = Column(Integer, ForeignKey("work_orders.id"), nullable=False)
    part_id = Column(Integer, ForeignKey("spare_parts.id"), nullable=False)
    quantity = Column(Integer, default=1)
    unit_cost = Column(Float, default=0.0)
    total_cost = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)

    work_order = relationship("WorkOrder", back_populates="parts")
    part = relationship("SparePart", back_populates="work_order_parts")


class MaintenanceEvent(Base):
    __tablename__ = "maintenance_events"

    id = Column(Integer, primary_key=True, index=True)
    machine_id = Column(String(50), ForeignKey("machines.machine_id"), nullable=False, index=True)
    event_type = Column(String(50), nullable=False) # "Intervention Started", "Completed", "Emergency Stoppage"
    timestamp = Column(DateTime, default=datetime.utcnow)
    description = Column(Text, nullable=False)
    impact_hours = Column(Float, default=0.0)
    recorded_by = Column(String(100), default="Automated System")
    created_at = Column(DateTime, default=datetime.utcnow)

    machine = relationship("Machine", back_populates="maintenance_events")


class SimulationRun(Base):
    __tablename__ = "simulation_runs"

    id = Column(Integer, primary_key=True, index=True)
    run_name = Column(String(100), nullable=False)
    scenario_type = Column(String(50), default="Seasonal Harvest Peak")
    duration_days = Column(Integer, default=30)
    fleet_size = Column(Integer, default=24)
    seed = Column(Integer, default=42)
    status = Column(String(30), default="Completed") # "Pending", "Running", "Completed"
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, default=datetime.utcnow)

    results = relationship("ScenarioResult", back_populates="simulation_run", cascade="all, delete-orphan")


class ScenarioResult(Base):
    __tablename__ = "scenario_results"

    id = Column(Integer, primary_key=True, index=True)
    simulation_run_id = Column(Integer, ForeignKey("simulation_runs.id"), nullable=False)
    strategy_name = Column(String(50), nullable=False) # "Calendar-Only (Strategy A)" or "Condition-Based AI (Strategy B)"
    fleet_availability_pct = Column(Float, default=85.0)
    total_downtime_hours = Column(Float, default=180.0)
    total_failures = Column(Integer, default=8)
    emergency_repairs_count = Column(Integer, default=6)
    scheduled_maintenance_count = Column(Integer, default=12)
    total_cost = Column(Float, default=19500.0)
    mean_time_to_repair = Column(Float, default=4.8) # hours
    mean_warning_lead_hours = Column(Float, default=72.0)
    technician_utilization_pct = Column(Float, default=74.0)
    spare_parts_consumed = Column(Integer, default=28)
    summary_json = Column(JSON, default=dict)
    created_at = Column(DateTime, default=datetime.utcnow)

    simulation_run = relationship("SimulationRun", back_populates="results")
