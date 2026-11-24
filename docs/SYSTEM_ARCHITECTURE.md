# System Architecture

FarmPulse AI is built on a clean three-tier architecture separating the React client interface, FastAPI asynchronous backend, and Scikit-learn predictive machine learning engine.

---

## 1. High-Level Architecture Diagram

```
+-----------------------------------------------------------------------------------+
|                            REACT 18 VITE FRONTEND                                 |
|  - 14 Operational Views (Dashboard, Digital Twin, AIPredictions, Planning, etc.)  |
|  - Real-Time Gauge Visualization, Recharts Sparklines, Interactive Stepper        |
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
|  - 12 Normalized Relational Entities  |   |  - Random Forest Classifier (Risk)    |
|  - Seed Telemetry & Historical Logs   |   |  - Random Forest Multiclass (Mode)    |
|  - Work Orders, Technicians, Parts    |   |  - Random Forest Regressor (RUL)      |
|  - Persistent SQLite Database         |   |  - Epistemic / Aleatoric Uncertainty  |
+---------------------------------------+   +---------------------------------------+
```

---

## 2. Component Boundary Contracts

### Frontend (`frontend/src/`)
- Pure client-side application built with TypeScript and Vite.
- Communicates with FastAPI backend over `http://127.0.0.1:8000/api`.
- Encapsulates all backend queries inside `src/services/api.ts`.
- Manages optimistic state updates and live alert polling.

### Backend (`backend/`)
- FastAPI ASGI application configured with CORS middleware.
- SQLAlchemy 2.0 ORM with SQLite database (`sqlite:///./farmpulse.db`).
- `backend/prioritization.py`: Multi-criteria scheduling engine.
- `backend/simulation.py`: Digital twin simulation and baseline comparison generator.

### Machine Learning (`ml/`)
- `ml/dataset_generator.py`: Synthetic multi-channel physics degradation curves.
- `ml/features.py`: Sensor quality assessment and baseline imputation.
- `ml/train.py`: Zero-leakage machine-aware GroupKFold model training.
- `ml/predictor.py`: In-memory runtime predictor computing failure probability, uncertainty decomposition, and explainable feature attributions.
