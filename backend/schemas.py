"""
FarmPulse AI - Pydantic Request & Response Schemas
Type-safe data contracts for REST endpoints.
"""

from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field

# Machine Schemas
class MachineBase(BaseModel):
    machine_id: str
    name: str
    machine_type: str
    model: str
    year: int = 2022
    status: str = "Available"
    operating_state: str = "Operational"
    health_score: float = 98.0
    total_operating_hours: float = 1200.0
    location: str = "Sector Farm 1"
    image_url: str = "/tractor.svg"

class MachineCreate(MachineBase):
    pass

class MachineResponse(MachineBase):
    id: int
    last_service_date: Optional[datetime] = None
    next_service_due: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Sensor Reading Schemas
class SensorReadingBase(BaseModel):
    machine_id: str
    hour_index: int = 0
    engine_temp: Optional[float] = None
    vibration: Optional[float] = None
    rpm: Optional[float] = None
    oil_pressure: Optional[float] = None
    hydraulic_pressure: Optional[float] = None
    fuel_rate: float = 24.0
    ambient_temp: float = 22.0
    load_percentage: float = 75.0
    is_missing: bool = False
    is_noisy: bool = False
    missing_channel: str = "None"
    quality_score: float = 1.0

class SensorReadingCreate(SensorReadingBase):
    pass

class SensorReadingResponse(SensorReadingBase):
    id: int
    timestamp: datetime
    created_at: datetime

    class Config:
        from_attributes = True


# Prediction Schemas
class PredictionResponse(BaseModel):
    id: Optional[int] = None
    machine_id: str
    timestamp: datetime
    failure_risk: float
    predicted_fault_type: str
    time_to_failure_hours: float
    confidence_score: float
    uncertainty_score: float
    observation_quality: float
    is_sensor_anomaly: bool
    top_contributing_factors: List[Dict[str, Any]]
    recommended_action: Optional[str] = None
    model_version: str

    class Config:
        from_attributes = True


# Alert Schemas
class AlertBase(BaseModel):
    machine_id: str
    alert_level: str
    fault_category: str
    title: str
    description: str
    status: str = "New"

class AlertCreate(AlertBase):
    prediction_id: Optional[int] = None

class AlertResponse(AlertBase):
    id: int
    prediction_id: Optional[int] = None
    acknowledged_by: Optional[str] = None
    acknowledged_at: Optional[datetime] = None
    resolved_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True

class AlertAcknowledgeRequest(BaseModel):
    acknowledged_by: str = "Maintenance Manager"


# Technician Schemas
class TechnicianBase(BaseModel):
    name: str
    skill_level: str = "Senior"
    specialization: str = "Mechanical & Hydraulics"
    hourly_rate: float = 65.0
    is_available: bool = True
    phone: str = "+1 (555) 019-2831"
    email: str = "tech@farmpulse.ai"
    shift: str = "Morning"

class TechnicianResponse(TechnicianBase):
    id: int
    current_assignment_id: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True


# Spare Part Schemas
class SparePartBase(BaseModel):
    part_number: str
    name: str
    category: str
    stock_quantity: int
    minimum_threshold: int = 3
    unit_cost: float
    lead_time_days: int = 2
    compatible_machine_types: str = "All Machinery"
    shelf_location: str = "Bay A-1"

class SparePartResponse(SparePartBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# Work Order Schemas
class WorkOrderPartItem(BaseModel):
    part_id: int
    quantity: int = 1

class WorkOrderCreate(BaseModel):
    machine_id: str
    alert_id: Optional[int] = None
    priority: str = "High"
    failure_type: str = "Bearing Wear"
    description: str
    estimated_hours: float = 3.5
    technician_id: Optional[int] = None
    parts: List[WorkOrderPartItem] = []
    notes: Optional[str] = ""

class WorkOrderResponse(BaseModel):
    id: int
    work_order_number: str
    machine_id: str
    alert_id: Optional[int] = None
    priority: str
    status: str
    failure_type: str
    description: str
    estimated_hours: float
    actual_hours: float
    technician_id: Optional[int] = None
    scheduled_start: Optional[datetime] = None
    scheduled_end: Optional[datetime] = None
    actual_start: Optional[datetime] = None
    actual_end: Optional[datetime] = None
    total_cost: float
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Prioritization Engine Schemas
class MaintenanceCandidate(BaseModel):
    machine_id: str
    machine_name: str
    machine_type: str
    failure_risk: float
    fault_type: str
    uncertainty_score: float
    priority_score: float
    recommended_technician: Optional[str] = None
    required_parts: List[str] = []
    estimated_downtime_hours: float
    estimated_cost: float
    can_schedule: bool
    bottleneck_reason: Optional[str] = None
    selection_rationale: str


# Baseline Strategy Comparison Schemas
class ScenarioComparisonResponse(BaseModel):
    simulation_id: int
    duration_days: int
    fleet_size: int
    strategy_a: Dict[str, Any] # Calendar-only
    strategy_b: Dict[str, Any] # Condition-based AI
    savings: Dict[str, Any]
    timeline_comparison: List[Dict[str, Any]]


# Fleet Overview KPIs
class FleetSummaryKPIs(BaseModel):
    total_machines: int
    available_machines: int
    machines_at_risk: int
    under_maintenance: int
    fleet_readiness_pct: float
    total_downtime_hours: float
    critical_alerts: int
    open_work_orders: int
    technician_utilization_pct: float
    parts_in_stock: int
    parts_low_stock: int
