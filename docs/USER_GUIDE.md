# User Guide - Operational Walkthrough

A practical guide for maintenance managers and agricultural fleet dispatchers using the FarmPulse AI dashboard.

---

## 1. Overview Dashboard (`/`)
- **Fleet KPIs:** Monitor real-time fleet readiness percentage, active units, machines at risk, and critical alerts.
- **Availability Curve:** 7-day trend chart tracking operational readiness.
- **Watchlist & Alerts:** Review machines with declining condition scores and take proactive action.

---

## 2. Digital Twin Cockpit (`/twin`)
- **Machinery Selector:** Select any machine (e.g. `FP-101`) to inspect its live virtual condition.
- **Multi-Sensor Gauges:** Real-time readings for engine temperature, RMS vibration, governor RPM, lube oil pressure, and hydraulic pressure.
- **Telemetry Replay:** Interactive sparklines displaying historical telemetry drift.
- **Telemetry Injector:** Simulate custom sensor observations, electrical noise bursts, or sensor dropouts to evaluate uncertainty response.

---

## 3. AI Predictions & Explainability (`/predictions`)
- **Failure Risk:** Predicted probability of mechanical failure.
- **Remaining Useful Life (RUL):** Countdown in operating hours until component failure.
- **Uncertainty Breakdown:** Decomposes prediction confidence into epistemic (model ensemble variance) and aleatoric (telemetry SNR).
- **Explainable Feature Attribution:** Visual breakdown of the physical factors driving failure risk (e.g. Thermal Deviation, Vibration Severity).

---

## 4. Maintenance Planning & Prioritization (`/planning`)
- **Priority Queue:** Multi-attribute ranking considering failure risk, crop criticality, and repair urgency.
- **Constraint Badges:** Real-time verification of matching technician skill and spare-parts stock availability.
- **Bottleneck Reasons:** Transparent explanation when maintenance is blocked due to missing parts or unavailable technicians.
- **1-Click Dispatch:** Directly generate work orders with pre-allocated resources.

---

## 5. Work Order Management (`/work-orders`)
- **Full Lifecycle:** Track orders through Pending $\to$ Scheduled $\to$ In Progress $\to$ Completed.
- **Parts Reservation:** Automatically deducts replacement components from warehouse inventory upon scheduling.
- **Restoration:** Completing an order automatically restores machinery condition to 99% health and resolves active alerts.

---

## 6. Baseline Strategy Comparison (`/baseline`)
- **Side-by-Side Benchmark:** Compares Strategy A (Calendar-Only 250h intervals) against Strategy B (Condition-Based AI) over a 30-day harvest season.
- **Cumulative Timelines:** Interactive charts illustrating downtime and maintenance cost divergence over time.

---

## 7. Interactive Guided Demonstration (`/demo`)
- **11-Step Stepper:** Step-by-step guided demonstration showcasing the complete predictive maintenance workflow.
