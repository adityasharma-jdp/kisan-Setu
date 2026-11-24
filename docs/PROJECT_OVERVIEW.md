# FarmPulse AI - Project Overview

**Predict Today. Prevent Downtime Tomorrow.**  
*NexHack 2.0 | Problem Statement 08 (AI in Agriculture) | Geeta University*

---

## 1. Executive Summary

Modern agriculture depends on high-throughput, heavy machinery fleets (tractors, combine harvesters, precision seeders, sprayers). During critical seasonal windows—such as spring planting or high-moisture autumn harvest—unplanned mechanical failure leads to catastrophic operational losses:
- Harvester downtime during rain forecasts leads to crop rot and grain lodging.
- Emergency field repairs cost **3× to 5× more** than planned preventative servicing due to expedited freight, night technician rates, and secondary damage from catastrophic component seizure.
- Traditional agricultural operations rely strictly on calendar maintenance (e.g., servicing every 250 engine hours) or reactive breakdown repair ("fix when broken").

**FarmPulse AI** solves this critical agricultural logistics challenge. It is an enterprise-grade digital twin and predictive maintenance intelligence platform that:
1. Reconstructs real-time operating conditions of every farm machine.
2. Detects developing mechanical faults (bearing flaking, cooling radiator clogging, hydraulic cavitation, lubrication breakdown) **48 to 120 hours before catastrophic breakdown**.
3. Decomposes prediction uncertainty into epistemic (model ensemble variance) and aleatoric (sensor noise and dropout) factors.
4. Prevents false positive alarms caused by telemetry glitches or missing IoT sensor packets.
5. Optimizes maintenance schedules under hard operational constraints: technician specialty skills and spare-parts stock availability.
6. Proves verifiable operational ROI over calendar-only maintenance through side-by-side scenario simulation.

---

## 2. Key Capabilities & Architectural Pillars

| Capability | Module | Core Engineering Value |
|---|---|---|
| **Digital Twin Telemetry Replay** | `backend/simulation.py` | Virtual replica of 24 fleet machines with live sensor stream synthesis and historical replay. |
| **Random Forest Fault Detection** | `ml/predictor.py` | 100-tree ensemble trained with machine-aware GroupKFold validation (zero test leakage). |
| **Observation Quality Index** | `ml/features.py` | Distinguishes between true developing mechanical faults vs. electrical noise and missing sensor channels. |
| **Constrained Prioritization** | `backend/prioritization.py` | Multi-criteria ranking with real-time bottleneck detection (technician skill & spare-parts inventory). |
| **Strategy Comparison Engine** | `backend/simulation.py` | Fair replay of identical 30-day harvest demand under Strategy A (Calendar) vs Strategy B (Condition-Based AI). |
| **Interactive 11-Step Demo** | `frontend/src/pages/DemoSimulation.tsx` | Guided demonstration from early sensor drift to work-order acknowledgement, repair, and fleet readiness update. |

---

## 3. Technology Stack

- **Frontend:** React 18, TypeScript, Vite 6, Tailwind CSS, React Router 6, Recharts, Lucide React, Axios.
- **Backend:** Python 3.14 / 3.11, FastAPI, Pydantic V2, SQLAlchemy ORM, Uvicorn, SQLite.
- **Machine Learning:** Scikit-learn, Random Forest (Classifier + Regressor), Pandas, NumPy, Joblib.
- **Testing & DevOps:** Pytest, HTTPX, GitHub Actions CI/CD.
