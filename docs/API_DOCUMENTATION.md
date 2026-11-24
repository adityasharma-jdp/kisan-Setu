# API Documentation

FarmPulse AI provides a comprehensive RESTful API built with FastAPI. All endpoints return JSON and adhere to standard HTTP status codes.

Interactive Swagger documentation is available at `http://127.0.0.1:8000/docs`.

---

## 1. Fleet Operations

### `GET /api/fleet/summary`
Returns top-level fleet readiness KPIs, total machines, available units, machines at risk, critical alerts, and technician utilization.

### `GET /api/machines`
Query Parameters:
- `machine_type` (optional string): Filter by machinery type.
- `status_filter` (optional string): Filter by status ("Available", "At Risk", "Under Maintenance").
Returns list of all machines with health scores and hours.

### `GET /api/machines/{machine_id}`
Returns details for a single machinery digital twin.

### `GET /api/machines/{machine_id}/digital-twin`
Returns high-resolution digital twin condition data:
- `machine`: Master machine record.
- `latest_telemetry`: Most recent multi-sensor telemetry packet.
- `telemetry_stream`: Recent 30-hour telemetry history for sparklines.
- `latest_prediction`: Current ML failure probability, RUL, and uncertainty.
- `active_alerts`: Unresolved alerts linked to this machine.

---

## 2. Telemetry & Simulation Injection

### `POST /api/simulation/inject-telemetry`
Simulates telemetry reading injection with optional sensor artifacts.
Request Body:
```json
{
  "machine_id": "FP-101",
  "engine_temp": 108.5,
  "vibration": 4.2,
  "rpm": 2080.0,
  "oil_pressure": 3.1,
  "hydraulic_pressure": 195.0,
  "load_percentage": 85.0,
  "is_missing": false,
  "is_noisy": false,
  "missing_channel": "None"
}
```

---

## 3. Predictions & Machine Learning

### `GET /api/predictions`
Returns recent prediction records across the fleet.

### `GET /api/predictions/metrics`
Returns model evaluation metrics: test set precision, recall, F1-score, confusion matrix, and feature importances.

### `POST /api/predictions/evaluate`
Executes on-the-fly inference on an arbitrary sensor observation without saving to database.

---

## 4. Maintenance Prioritization

### `GET /api/prioritization/plan`
Generates prioritized list of machines needing maintenance under technician and spare-parts constraints.
Response Item:
```json
{
  "machine_id": "FP-101",
  "machine_name": "AgriMax Titan 9400",
  "failure_risk": 0.86,
  "fault_type": "Cooling System Degradation",
  "priority_score": 88.5,
  "can_schedule": true,
  "recommended_technician": "Elena Rostova",
  "required_parts": ["Heavy-Duty Aluminium Radiator Core (PRT-RAD-4420)"],
  "selection_rationale": "High failure risk (86%) with estimated RUL of 74 hours. High-priority agricultural asset."
}
```

---

## 5. Work Orders & Resources

### `GET /api/work-orders`
List work orders with optional status filter.

### `POST /api/work-orders`
Creates and schedules a work order, automatically reserving parts from inventory and assigning technician.

### `POST /api/work-orders/{id}/start`
Transitions work order status to "In Progress".

### `POST /api/work-orders/{id}/complete`
Completes work order, frees technician, updates machine condition to 99% health, and resolves active alerts.

---

## 6. Baseline & Demonstration

### `GET /api/simulation/baseline-comparison`
Replays 30-day harvest scenario comparing Strategy A (Calendar-Only) vs Strategy B (Condition-Based AI).

### `POST /api/simulation/demo-step`
Executes an individual step in the guided 11-step hackathon demonstration.

### `GET /api/reports/export-csv`
Downloads fleet health, work orders, or inventory data as CSV.
