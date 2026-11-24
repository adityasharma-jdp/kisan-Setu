# Machine Learning Model Documentation

FarmPulse AI implements an explainable, physics-grounded machine learning pipeline tailored for agricultural fleet predictive maintenance.

---

## 1. Machine Learning Objectives

1. **Failure Probability Classification:** Predict whether a machine is developing a fault within a 48 to 120-hour window before catastrophic stoppage.
2. **Degradation Mode Classification:** Classify the physical failure category (`Cooling_System_Degradation`, `Bearing_Mechanical_Wear`, `Hydraulic_Cavitation_Leak`, `Lubrication_Pressure_Loss`).
3. **Remaining Useful Life (RUL) Regression:** Estimate remaining operating hours until component failure.
4. **Uncertainty Decomposition:** Quantify confidence by decoupling model variance (epistemic) from telemetry noise (aleatoric).

---

## 2. Prevention of Data Leakage (Mandatory Hackathon Rule)

Data leakage is the most frequent flaw in industrial predictive maintenance projects. FarmPulse AI enforces strict architectural safeguards:
- **Zero Machine Leakage:** Evaluated using `GroupKFold(n_splits=4)` grouped on `machine_id`. No machine in the test set ever appeared in the training set.
- **No Future Label Leakage:** Only past telemetry and current operating ratios are fed into the feature matrix. Future failure events are strictly excluded from prediction-time features.
- **Time-Aware Degradation Curves:** Simulated degradation follows accelerating Weibull-type damage accumulation curves.

---

## 3. Model Architecture & Training Results

- **Algorithm:** Random Forest Classifier (100 estimators, max depth 12, balanced class weights).
- **RUL Regressor:** Random Forest Regressor (80 estimators, max depth 12).
- **Dataset Size:** 17,280 hourly observations across 24 machines over a 30-day simulated operating period.

### Test Set Evaluation Metrics (Machine-Aware GroupKFold)

| Metric | Score | Industrial Context |
|---|---|---|
| **Precision** | **93.9%** | Minimizes false positive alarms; prevents unnecessary field service dispatches. |
| **Recall (Sensitivity)** | **92.5%** | Captures developing faults well before physical breakdown occurs. |
| **F1-Score** | **93.2%** | Balanced harmonic performance across severe and minor wear. |
| **RUL Mean Absolute Error** | **30.6 hours** | Provides actionable ~3-day planning lead time for scheduling maintenance shifts. |

---

## 4. Explainable AI (XAI) & Feature Attribution

Rather than outputting a black-box percentage, FarmPulse AI exposes the top physical indicators contributing to failure risk:
- **Thermal Deviation from Nominal:** Engine temperature delta relative to factory baseline (°C).
- **Vibration Severity Ratio:** RMS vibration amplitude relative to machinery nominal baseline.
- **Lube Oil Pressure Drop:** Pressure drop indicating filter clogging or lubrication thinning.
- **Hydraulic Pressure Drop:** Cavitation or valve leakage under high load.
- **Observation Quality Index:** Reliability weight derived from missing channels and signal-to-noise ratio.
