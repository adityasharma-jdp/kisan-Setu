# FarmPulse AI - Predictive Maintenance Twin for Farm Machinery

[![CI](https://github.com/farmpulse-ai/farmpulse-ai/actions/workflows/ci.yml/badge.svg)](https://github.com/farmpulse-ai/farmpulse-ai/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![Python: 3.11+](https://img.shields.io/badge/Python-3.11%2B-blue.svg)](https://www.python.org/)
[![React: 18](https://img.shields.io/badge/React-18-cyan.svg)](https://react.dev/)
[![FastAPI: 0.165](https://img.shields.io/badge/FastAPI-0.165-teal.svg)](https://fastapi.tiangolo.com/)

> **Tagline:** *Predict Today. Prevent Downtime Tomorrow.*  
> **Hackathon:** NexHack 2.0 | Problem Statement 08 (AI in Agriculture) | Geeta University

---

## 1. Project Introduction & Problem Statement

In modern agriculture, machinery breakdowns during critical operational windows—such as high-moisture grain harvest or short-window spring planting—cause catastrophic financial losses and crop spoilage. Traditional farm fleet maintenance relies strictly on calendar-based schedules (e.g. servicing every 250 engine hours) or reactive breakdown repairs when equipment breaks down in the field.

**FarmPulse AI** is an enterprise-grade digital twin platform that:
- Models real-time operating conditions of 24 fictional farm machines across 5 machinery classes.
- Predicts developing mechanical failures (bearing flaking, cooling radiator clogging, hydraulic cavitation, lubrication pressure loss) **48 to 120 hours in advance**.
- Decomposes prediction uncertainty into epistemic (model ensemble variance) and aleatoric (sensor noise/dropout) components.
- Discriminates between real mechanical degradation and telemetry glitches (missing IoT packets or electrical noise bursts).
- Prioritizes work orders under strict real-world constraints: technician specialty certifications and warehouse spare-parts availability.
- Proves verifiable operational ROI through an automated side-by-side benchmark comparison against calendar-only maintenance.

---

## 2. Key Features

- **Fleet Cockpit Dashboard:** Real-time fleet readiness percentage, active machine status distribution, critical alert banners, and 7-day availability trends.
- **Machinery Digital Twins:** Virtual state representation with real-time multi-sensor gauges (Engine Temp, RMS Vibration, RPM, Oil Pressure, Hydraulic Pressure) and historical telemetry replay.
- **Explainable AI (XAI):** Top physical contributing factors with feature attribution, confidence scores, and prescriptive maintenance recommendations.
- **Sensor Quality & Uncertainty Engine:** Explicit missing channel imputation and transducer noise burst detection to prevent false-alarm dispatch storms.
- **Constrained Prioritization:** Multi-attribute scheduling engine that verifies technician skill compatibility and inventory stock before dispatching orders.
- **Full Work Order Lifecycle:** Interactive creation, technician assignment, part reservation, execution, condition restoration, and alert resolution.
- **Baseline Strategy Comparison:** Deterministic 30-day harvest scenario benchmark comparing Strategy A (Calendar-Only) against Strategy B (Condition-Based AI).
- **11-Step Guided Intervention Demo:** Complete end-to-end interactive workflow built into the application for hackathon jury evaluation.
- **CSV Data Export:** One-click compliance and audit export for fleet health, work order history, and parts inventory.

---

## 3. Technology Stack

- **Frontend:** React 18, TypeScript, Vite 6, Tailwind CSS, React Router 6, Recharts, Lucide React, Axios.
- **Backend:** Python 3.14 / 3.11, FastAPI, Pydantic V2, SQLAlchemy 2.0 ORM, Uvicorn, SQLite.
- **Machine Learning:** Scikit-learn, Random Forest (Classifier + Regressor), Pandas, NumPy, Scipy, Joblib.
- **Testing & Quality Assurance:** Pytest, HTTPX (FastAPI TestClient), GitHub Actions CI.

---

## 4. System Architecture

```
+-----------------------------------------------------------------------------------+
|                            REACT 18 VITE FRONTEND                                 |
|  - 14 Operational Modules (Dashboard, Digital Twin, Predictions, Planning, etc.)  |
|  - Real-Time Gauges, Interactive Stepper, Recharts Sparklines & Area Charts       |
+------------------------------------------+----------------------------------------+
                                           | HTTP REST API (Axios / JSON)
                                           v
+-----------------------------------------------------------------------------------+
|                            FASTAPI BACKEND SERVICE                                |
|  - REST Endpoints (/api/fleet, /api/machines, /api/prioritization, /api/demo)    |
|  - Prioritization Engine (Technician Skill & Parts Inventory Constraint Checking)  |
|  - Telemetry Stream Injector & Replay Simulator                                   |
+-------------------+---------------------------------------+-----------------------+
                    |                                       |
                    v                                       v
+---------------------------------------+   +---------------------------------------+
|        SQLITE / SQLALCHEMY ORM        |   |       SCIKIT-LEARN ML ENGINE          |
|  - 12 Normalized Relational Tables    |   |  - Random Forest Classifier (Risk)    |
|  - Seed Telemetry & Historical Logs   |   |  - Random Forest Multiclass (Mode)    |
|  - Work Orders, Technicians, Parts    |   |  - Random Forest Regressor (RUL)      |
|  - Persistent SQLite Database         |   |  - Epistemic / Aleatoric Uncertainty  |
+---------------------------------------+   +---------------------------------------+
```

---

## 5. Quick Installation & Execution

### Windows 1-Click Launch
```cmd
.\scripts\run_all.bat
```
Starts backend at `http://127.0.0.1:8000` and frontend at `http://localhost:5173`.

### Manual Step-by-Step Setup
```bash
# 1. Backend virtual environment & packages
python -m venv .venv
# On Windows: .\.venv\Scripts\activate
# On Linux/macOS: source .venv/bin/activate
pip install -r requirements.txt

# 2. Train ML models & seed database
python -m ml.train
python -m backend.seed

# 3. Start backend server
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload

# 4. In a separate terminal, start frontend
cd frontend
npm install
npm run dev
```

---

## 6. Baseline Benchmark Highlights (Section 4.G)

Identical 30-day harvest scenario replayed across 24 machines:

| Metric | Calendar-Only (Strategy A) | FarmPulse AI (Strategy B) | Impact |
|---|---|---|---|
| **Fleet Availability** | 83.4% | **95.8%** | **+12.4% Availability Gain** |
| **Total Downtime** | 238.5 hrs | **59.0 hrs** | **-75.3% Downtime Reduction** |
| **Catastrophic Failures** | 11 failures | **2 failures** | **-81.8% Fewer Breakdowns** |
| **Emergency Overhauls** | 9 overhauls | **1 overhaul** | **-88.9% Fewer Emergency Calls** |
| **Maintenance Cost** | $28,450 | **$12,150** | **$16,300 Cost Savings (-57.3%)** |
| **Warning Lead Time** | 0.0 hrs | **78.5 hrs** | **Proactive Shift Scheduling** |

---

## 7. Interactive 11-Step Demonstration Workflow (Section 4.H)

Navigate to `http://localhost:5173/demo` to run the guided workflow:
1. **Select Tractor:** Select AgriMax Titan 9400 (`FP-101`).
2. **Replay Telemetry:** Replay 48-hour sensor stream showing rising engine temp (+21.2°C) and vibration (4.42 mm/s).
3. **AI Alert:** FarmPulse AI triggers a Critical Alert (86% failure risk).
4. **Explainability & Uncertainty:** Decompose risk into physical feature contributions and separate epistemic from aleatoric uncertainty.
5. **Acknowledge Alert:** Maintenance manager officially logs and acknowledges alert.
6. **Technician Query:** Query availability of certified technicians on shift.
7. **Spare Parts Verification:** Verify stock for replacement component (Aluminium Radiator Core).
8. **Schedule Work Order:** Create and dispatch scheduled maintenance order.
9. **Simulate Execution:** Execute repair in 3.2 hours.
10. **Restore Condition:** Machine digital twin health restored to 99.2% with nominal telemetry.
11. **Fleet Readiness:** Fleet availability elevated, preventing $2,450 in downtime losses.

---

## 8. Automated Testing

Run the full pytest test suite:
```bash
.\.venv\Scripts\python.exe -m pytest -v tests/
```
Result: **16 passed in ~5 seconds (100% pass rate)**.

---

## 9. Model Limitations

1. **Synthetic Telemetry Baseline:** Telemetry is generated via physics degradation curves and nominal baselines. While calibrated to real tractor specifications, it does not replace physical dynamometer testing.
2. **Imputation Boundary:** Telemetry imputation uses machine-type nominal baselines. Highly customized aftermarket implement configurations may require additional sensor calibration.
3. **Extreme Weather Shocks:** Sensor ambient temperature fluctuations exceeding $\pm 35$°C in sudden storms may temporarily decrease observation quality scores.

---

## 10. Git & Remote Repository Instructions

To connect this local repository to GitHub:
```bash
# Add your GitHub remote
git remote add origin https://github.com/<your-username>/farmpulse-ai.git

# Push main branch
git branch -M main
git push -u origin main
```
*(Ensure all local secrets and virtual environments remain excluded via `.gitignore`.)*
