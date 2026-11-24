# Problem Statement Analysis

**Problem Statement 08: AI in Agriculture**  
**Title:** Predictive Maintenance Twin for Farm Machinery  
**Hackathon:** NexHack 2.0 | Geeta University

---

## 1. Challenge Breakdown

The official problem statement outlines 10 mandatory technical requirements:

1. **Reconstruction of Machine Condition:** Virtual model reflecting true physical telemetry (engine temperature, vibration RMS, governor RPM, oil pressure, hydraulic pressure, engine load).
2. **Developing Fault Detection:** Identifying degradation prior to catastrophic stoppage, providing adequate warning lead time.
3. **Explainable AI Predictions:** Highlighting top physical factors driving failure risk rather than presenting a black-box probability.
4. **Missing and Noisy Sensor Observations:** Real farm machinery operates in dusty, electrically noisy, and vibration-intense environments. Sensor wires disconnect or experience electromagnetic noise bursts.
5. **Uncertainty Representation:** Explicitly separating epistemic model uncertainty from aleatoric observation uncertainty.
6. **Technician & Spare-Parts Constrained Scheduling:** A maintenance plan is useless if the required aluminum radiator core is out of stock or the master hydraulic technician is unavailable.
7. **Work-Order Acknowledgement and Scheduling:** Operational lifecycle from alert creation to technician dispatch, part reservation, and completion.
8. **Fleet Availability & Downtime Tracking:** Real-time KPI monitoring measuring fleet readiness percentages.
9. **Comparison with Calendar-Only Maintenance:** Side-by-side benchmark comparing identical initial fleet conditions under calendar-only (fixed 250h intervals) vs. condition-based AI.
10. **A Complete Intervention Demonstration:** Guided walkthrough validating all 11 stages of proactive maintenance.

---

## 2. Technical Risk Matrix & Mitigation Strategy

| Challenge / Risk | Potential Pitfall | FarmPulse AI Engineering Solution |
|---|---|---|
| **Data Leakage in ML** | Using future failure timestamps or randomly shuffling time series | Machine-Aware GroupKFold split (`GroupKFold(n_splits=4)` on `machine_id`). No test machine ever appears in train set. |
| **False Positive Alarm Storms** | Classifying sensor dropouts as mechanical breakdowns | Observation Quality Score & Sensor Anomaly Classifier. Missing readings are imputed via nominal baselines with an uncertainty penalty rather than a breakdown label. |
| **Resource Bottlenecks** | Generating maintenance schedules that cannot be executed | Hard constraint verification in `MaintenancePrioritizationEngine`. Work orders cannot be dispatched if matching technician or part is unavailable. |
| **Unfair Baseline Comparison** | Comparing different workloads or machinery sets | Identical 30-day harvest scenario seed (`seed=42`) with 24 machines replayed under both strategies. |
