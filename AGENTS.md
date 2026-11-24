# AGENTS.md - FarmPulse AI Autonomous Development Team

This document outlines the multi-agent role distribution and engineering responsibilities for building **FarmPulse AI: Predictive Maintenance Twin for Farm Machinery** (NexHack 2.0 - Problem Statement 08).

---

## Autonomous Team Roles & Responsibilities

### 1. Software Architect
- Designed the end-to-end event-driven digital twin architecture.
- Formulated the hybrid condition-based maintenance (CBM) prioritization engine.
- Established clean API boundary contracts between Vite frontend, FastAPI backend, and Scikit-learn ML engine.

### 2. Full-Stack Developer
- Implemented the FastAPI REST backend with comprehensive CRUD, replay controls, scheduling engine, and simulation endpoints.
- Built the React 19 + TypeScript + Vite + Tailwind CSS frontend application with 14 functional operational views.
- Implemented responsive side navigation, reactive data fetching with Axios, and real-time alert polling.

### 3. AI / ML Engineer
- Architected synthetic multi-parameter agricultural telemetry generator with physics-grounded degradation modes (bearing wear, cooling efficiency loss, hydraulic cavitation, lubrication breakdown).
- Designed Random Forest classification and regression models for remaining useful life (RUL) estimation and failure probability prediction.
- Integrated feature attribution for explainability and prediction confidence scoring.

### 4. Data Scientist
- Formulated observation quality metrics (missing data flags, sensor SNR, observation quality index).
- Ensured strict avoidance of data leakage (time-series split, no future labels in feature matrix).
- Evaluated models using Precision, Recall, F1-score, and confusion matrices.

### 5. Database Engineer
- Authored SQLAlchemy ORM models with SQLite persistent storage.
- Normalized 12 relational tables: `machines`, `sensor_readings`, `service_histories`, `predictions`, `alerts`, `technicians`, `spare_parts`, `work_orders`, `work_order_parts`, `maintenance_events`, `simulation_runs`, and `scenario_results`.
- Implemented database migrations, seeding, foreign key cascades, and transactional integrity.

### 6. UI / UX Designer
- Created the "Forest & Emerald" enterprise agricultural theme: `#052e16`, `#047857`, `#10b981`, neutral dark `#1e293b`, and crisp light canvases.
- Designed interactive digital twin machine schematics with live telemetry gauges, sparklines, and status badges.
- Built side-by-side strategy comparison cards and the 11-step interactive intervention walkthrough.

### 7. DevOps Engineer
- Configured local environment management, build scripts, PowerShell launchers, and cross-platform runners.
- Created `.github/workflows/ci.yml` for automated linting, backend testing, and build verification.

### 8. QA and Testing Engineer
- Created test suites covering FastAPI endpoints, resource constraint scheduling, uncertainty scoring, and simulation determinism.
- Validated baseline comparison reproducibility across calendar-only vs. condition-based strategies.

### 9. Technical Documentation Specialist
- Authored 12 comprehensive markdown documents in `docs/` detailing architecture, database schemas, ML methodologies, baseline comparisons, and operational user guides.
- Structured presentation scripts for hackathon judging and live demonstrations.
