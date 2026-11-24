# Installation & Execution Guide

Step-by-step instructions to set up, configure, and execute the FarmPulse AI platform locally.

---

## 1. Prerequisites

- **Operating System:** Windows 10/11, macOS, or Linux.
- **Python:** Python 3.10 to 3.14 installed.
- **Node.js:** Node.js 18.x to 26.x and npm installed.
- **Git:** Installed for version control.

No paid APIs, cloud services, or external subscriptions are required.

---

## 2. Quick Start (Windows Launcher)

For Windows users, launch both backend and frontend with a single command:
```cmd
.\scripts\run_all.bat
```
This automatically starts:
- FastAPI Backend: `http://127.0.0.1:8000`
- Interactive Swagger UI: `http://127.0.0.1:8000/docs`
- React Vite Dashboard: `http://localhost:5173`

---

## 3. Manual Step-by-Step Setup

### Step A: Backend Setup
```bash
# 1. Create Python virtual environment
python -m venv .venv

# 2. Activate virtual environment
# Windows:
.\.venv\Scripts\activate
# Linux/macOS:
source .venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt
# Or directly:
pip install fastapi uvicorn pydantic sqlalchemy scikit-learn joblib pytest httpx pandas scipy

# 4. Train models and generate synthetic dataset
python -m ml.train

# 5. Initialize and seed SQLite database
python -m backend.seed

# 6. Start FastAPI development server
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```

### Step B: Frontend Setup
```bash
# In a new terminal window:
cd frontend

# 1. Install npm dependencies
npm install

# 2. Run Vite development server
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 4. Running Automated Tests

```bash
# Run full pytest test suite
.\.venv\Scripts\python.exe -m pytest -v tests/

# Test frontend production build
cd frontend
npm run build
```
