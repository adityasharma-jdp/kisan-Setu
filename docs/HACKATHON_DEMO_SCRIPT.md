# Hackathon Presentation & Demonstration Script

**Project:** FarmPulse AI  
**Event:** NexHack 2.0 | Problem Statement 08 | Geeta University  
**Tagline:** *Predict Today. Prevent Downtime Tomorrow.*

---

## 1. 3-Minute Pitch Script for Hackathon Judges

### Introduction (0:00 - 0:45)
> "Good afternoon, esteemed judges. In agriculture, timing is everything. A combine harvester breaking down during a 48-hour harvest window before a heavy storm doesn't just cost repair bills—it destroys an entire season's crop yield.
> 
> Traditional farms still rely on calendar-only maintenance—servicing tractors every 250 engine hours regardless of whether they need it, while catastrophic failures happen unannounced in between.
> 
> We built **FarmPulse AI**: an enterprise predictive maintenance digital twin that predicts developing machinery faults 48 to 120 hours before catastrophic breakdown, quantifies prediction uncertainty, and schedules repairs under real-world technician and spare-parts constraints."

### Live Product Demonstration (0:45 - 2:15)
*(Navigate to `http://localhost:5173/demo`)*
> "Let me walk you through our **Complete 11-Step Intervention Demonstration**:
> 
> 1. **Step 1:** We select tractor **AgriMax Titan 9400 (FP-101)**.
> 2. **Step 2:** We replay sensor telemetry. Notice how engine temperature climbs past 108°C and bearing vibration exceeds 4.4 mm/s.
> 3. **Step 3:** FarmPulse AI automatically triggers a **Critical Alert** (86% failure probability).
> 4. **Step 4:** Look at the **Explainable AI** screen. We don't just show a black-box number—we decompose the 86% risk into thermal deviation (+21°C), vibration (+2.8 mm/s), and separate epistemic model variance from sensor noise uncertainty!
> 5. **Step 5:** The maintenance manager acknowledges the alert with one click.
> 6. **Steps 6 & 7:** Our Constrained Prioritization Engine checks whether certified technician **Elena Rostova** is on shift and verifies that the replacement **Aluminum Radiator Core** is in stock.
> 7. **Step 8:** We generate and dispatch Work Order `WO-DEMO-042`.
> 8. **Step 9:** Maintenance is executed in 3.2 hours.
> 9. **Step 10:** The digital twin telemetry normalizes back to factory baselines and health restores to 99%.
> 10. **Step 11:** Fleet readiness rises from 79% to 83%, preventing $2,450 in downtime losses!"

### The Baseline Comparison (2:15 - 2:45)
*(Navigate to `http://localhost:5173/baseline`)*
> "To prove our platform's value, we replayed the exact same 30-day harvest scenario under both strategies:
> - **Calendar-only maintenance:** suffered **11 catastrophic breakdowns**, 238 hours of downtime, and $28,450 in costs.
> - **FarmPulse AI:** reduced downtime by **75.3%**, eliminated 89% of emergency repairs, provided **78.5 hours of proactive warning lead time**, and saved **$16,300 in maintenance expenses**!"

### Conclusion & Q&A (2:45 - 3:00)
> "FarmPulse AI is production-ready, fully open-source, features zero data leakage validation, and provides an end-to-end working solution for NexHack 2.0. Thank you, and we welcome your questions!"
