# Simulation Methodology

FarmPulse AI utilizes a deterministic, physics-grounded synthetic telemetry generator to simulate machinery degradation without requiring physical hardware.

---

## 1. Physical Machinery Baselines

Telemetry is synthesized based on heavy agricultural machinery specifications:

| Machine Type | Nominal Engine Temp | Nominal Vibration | Nominal RPM | Nominal Oil Pressure | Nominal Hydraulic |
|---|---|---|---|---|---|
| **Heavy-Duty Tractor** | 88.0 °C | 1.8 mm/s | 2100 RPM | 4.2 bar | 205.0 bar |
| **Combine Harvester** | 92.0 °C | 2.6 mm/s | 2300 RPM | 4.0 bar | 215.0 bar |
| **Precision Planter** | 82.0 °C | 1.4 mm/s | 1850 RPM | 4.5 bar | 190.0 bar |
| **Crop Sprayer** | 85.0 °C | 1.9 mm/s | 1950 RPM | 4.1 bar | 180.0 bar |
| **Forage Harvester** | 94.0 °C | 2.9 mm/s | 2350 RPM | 3.9 bar | 220.0 bar |

---

## 2. Physical Degradation Profiles

1. **Cooling System Degradation:** Simulates radiator core clogging and coolant circulation loss. Temperature rises gradually:
   $$\Delta T = 38.0 \times \left(\frac{t - t_{\text{onset}}}{t_{\text{fail}} - t_{\text{onset}}}\right)^{2.2}$$
2. **Bearing Mechanical Wear:** Simulates roller bearing micro-flaking and race spalling. Vibration amplitude accelerates exponentially up to 5.5 mm/s RMS.
3. **Hydraulic Cavitation & Valve Leakage:** High-pressure hydraulic lines drop from 210 bar down to 135 bar under peak load with pressure fluctuations.
4. **Lubrication Breakdown:** Oil pressure drops from 4.2 bar down to 1.8 bar, triggering friction and secondary engine temperature spikes.

---

## 3. Sensor Quality Simulation (Section 4.D)

- **Channel Dropouts (Missing Data):** Simulates loose wiring harnesses or IoT telemetry drops with a 5% probability per observation.
- **Transducer Noise Bursts:** Simulates high-frequency electromagnetic interference (EMI) or sensor grounding glitches.
- **Observation Quality Formula:**
  $$\text{Quality Score} = 1.0 - \left(0.35 \times \frac{N_{\text{missing}}}{N_{\text{channels}}}\right) - (0.25 \times \text{IsNoisy})$$
- **Discriminator Principle:** Missing or noisy readings increase uncertainty but are never automatically classified as mechanical breakdowns!
