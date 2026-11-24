"""
FarmPulse AI - Constrained Maintenance Prioritization Engine
Implements Section 4.E: Multi-attribute scheduling engine considering:
- Fault severity & failure risk
- Prediction uncertainty score
- Machine criticality & agricultural seasonal weight
- Machine availability & downtime penalty
- Technician availability & skill compatibility
- Spare-parts inventory availability & lead time
- Explanatory rationale and resource bottleneck detection
"""

from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from backend.models import Machine, Prediction, Alert, Technician, SparePart, WorkOrder

# Machinery importance & downtime cost matrix ($/hour during peak harvest/planting)
MACHINE_CRITICALITY = {
    "Combine Harvester": {"weight": 1.0, "downtime_cost_per_hr": 250.0},
    "Heavy-Duty Tractor": {"weight": 0.90, "downtime_cost_per_hr": 200.0},
    "Precision Planter": {"weight": 0.85, "downtime_cost_per_hr": 180.0},
    "Crop Sprayer": {"weight": 0.70, "downtime_cost_per_hr": 140.0},
    "Forage Harvester": {"weight": 0.80, "downtime_cost_per_hr": 170.0},
}

# Fault mode required parts and technician specialization mapping
FAULT_REQUIREMENTS = {
    "Cooling_System_Degradation": {
        "required_part_category": "Cooling",
        "primary_part_query": "PRT-RAD-4420",
        "backup_part_query": "PRT-THM-2105",
        "tech_specialization": "Engine Diagnostics & Thermal Systems",
        "estimated_hours": 3.5,
        "base_cost": 480.0
    },
    "Bearing_Mechanical_Wear": {
        "required_part_category": "Bearings",
        "primary_part_query": "PRT-BRG-8801",
        "backup_part_query": "PRT-CLT-3810",
        "tech_specialization": "Mechanical Bearings & Transmissions",
        "estimated_hours": 4.0,
        "base_cost": 520.0
    },
    "Hydraulic_Cavitation_Leak": {
        "required_part_category": "Hydraulics",
        "primary_part_query": "PRT-HYD-9100",
        "backup_part_query": "PRT-HYD-3340",
        "tech_specialization": "Hydraulics & Heavy Powertrains",
        "estimated_hours": 4.5,
        "base_cost": 650.0
    },
    "Lubrication_Pressure_Loss": {
        "required_part_category": "Lubrication",
        "primary_part_query": "PRT-OIL-1102",
        "backup_part_query": "PRT-FLT-6780",
        "tech_specialization": "Lubrication Systems & Preventive Care",
        "estimated_hours": 2.5,
        "base_cost": 310.0
    },
    "Sensor_Telemetry_Fault": {
        "required_part_category": "Electrical",
        "primary_part_query": "PRT-SNR-5501",
        "backup_part_query": "PRT-SNR-5502",
        "tech_specialization": "IoT Sensors & Electrical Harnesses",
        "estimated_hours": 1.5,
        "base_cost": 210.0
    }
}

class MaintenancePrioritizationEngine:
    def __init__(self, db: Session):
        self.db = db

    def generate_prioritized_schedule(self) -> List[Dict[str, Any]]:
        """
        Analyzes active machines with developing fault predictions or open alerts.
        Computes composite priority score, verifies technician & parts constraints,
        and generates transparent scheduling recommendations.
        """
        # Fetch active predictions with risk > 0.35 OR machines with status At Risk
        machines = self.db.query(Machine).filter(
            Machine.status.in_(["At Risk", "Available", "In Use"])
        ).all()

        technicians = self.db.query(Technician).all()
        spare_parts = self.db.query(SparePart).all()
        parts_by_num = {p.part_number: p for p in spare_parts}

        candidates = []

        for m in machines:
            # Get latest prediction
            latest_pred = (
                self.db.query(Prediction)
                .filter(Prediction.machine_id == m.machine_id)
                .order_by(Prediction.timestamp.desc())
                .first()
            )

            # Skip if no prediction or very low risk and healthy
            if not latest_pred and m.health_score > 90.0:
                continue

            failure_risk = latest_pred.failure_risk if latest_pred else max(0.1, (100.0 - m.health_score) / 100.0)
            fault_type = latest_pred.predicted_fault_type if latest_pred else "Bearing_Mechanical_Wear"
            uncertainty = latest_pred.uncertainty_score if latest_pred else 0.20
            rul_hours = latest_pred.time_to_failure_hours if latest_pred else 200.0

            if failure_risk < 0.25 and m.health_score > 85.0:
                continue

            # Criticality weighting
            crit_data = MACHINE_CRITICALITY.get(m.machine_type, {"weight": 0.80, "downtime_cost_per_hr": 160.0})
            machine_weight = crit_data["weight"]
            downtime_cost_hr = crit_data["downtime_cost_per_hr"]

            # Compute Composite Multi-Criteria Priority Score [0.0 - 100.0]
            # Risk factor (40 pts)
            risk_score = failure_risk * 40.0
            # Agricultural importance (25 pts)
            importance_score = machine_weight * 25.0
            # Imminence / RUL urgency (15 pts): closer to failure = higher score
            imminence_score = max(0.0, 15.0 * (1.0 - min(rul_hours, 200.0) / 200.0))
            # Uncertainty calibration (10 pts): high confidence gets priority for immediate repair;
            # high uncertainty triggers diagnostic inspection rather than overhaul
            confidence_factor = (1.0 - uncertainty) * 10.0
            # Machine condition penalty (10 pts)
            condition_score = max(0.0, (100.0 - m.health_score) * 0.10)

            total_priority = round(risk_score + importance_score + imminence_score + confidence_factor + condition_score, 1)

            # Constraint Checking: Technicians & Spare Parts
            reqs = FAULT_REQUIREMENTS.get(fault_type, FAULT_REQUIREMENTS["Bearing_Mechanical_Wear"])
            est_hours = reqs["estimated_hours"]
            base_cost = reqs["base_cost"] + (est_hours * 70.0)
            est_downtime_cost = est_hours * downtime_cost_hr

            # 1. Match Technician Availability & Skill
            assigned_tech = None
            for tech in technicians:
                if tech.is_available and (reqs["tech_specialization"].lower() in tech.specialization.lower() or tech.skill_level == "Master Tech"):
                    assigned_tech = tech
                    break
            # Fallback to any available senior tech if specialized is busy
            if not assigned_tech:
                for tech in technicians:
                    if tech.is_available and tech.skill_level in ["Senior", "Master Tech"]:
                        assigned_tech = tech
                        break

            # 2. Check Spare Part Stock
            primary_part = parts_by_num.get(reqs["primary_part_query"])
            backup_part = parts_by_num.get(reqs["backup_part_query"])

            required_part_names = []
            has_parts = False
            bottleneck = None

            if primary_part and primary_part.stock_quantity > 0:
                required_part_names.append(f"{primary_part.name} ({primary_part.part_number})")
                has_parts = True
            elif backup_part and backup_part.stock_quantity > 0:
                required_part_names.append(f"{backup_part.name} ({backup_part.part_number})")
                has_parts = True
            else:
                has_parts = False
                needed_p = primary_part or backup_part
                p_name = needed_p.name if needed_p else "Replacement Assembly"
                bottleneck = f"Inventory Shortage: {p_name} is currently out of stock (lead time: {needed_p.lead_time_days if needed_p else 3} days)."

            # Check Technician constraint
            if not assigned_tech:
                can_schedule = False
                if not bottleneck:
                    bottleneck = f"Technician Shortage: No technician with '{reqs['tech_specialization']}' or Master Tech certification available."
            else:
                can_schedule = has_parts

            # Generate transparent selection rationale
            rationale_parts = []
            if failure_risk > 0.75:
                rationale_parts.append(f"High failure risk ({failure_risk*100:.0f}%) with estimated RUL of {rul_hours:.0f} hours.")
            if machine_weight >= 0.90:
                rationale_parts.append(f"High-priority agricultural asset ({m.machine_type}) with high downtime impact (${downtime_cost_hr:.0f}/hr).")
            if uncertainty > 0.35:
                rationale_parts.append(f"Elevated prediction uncertainty ({uncertainty*100:.0f}%) suggests pre-intervention diagnostic probe.")
            else:
                rationale_parts.append(f"High model confidence ({(1-uncertainty)*100:.0f}%) validates immediate component replacement.")

            selection_rationale = " ".join(rationale_parts)

            candidates.append({
                "machine_id": m.machine_id,
                "machine_name": m.name,
                "machine_type": m.machine_type,
                "health_score": m.health_score,
                "failure_risk": round(failure_risk, 3),
                "fault_type": fault_type.replace("_", " "),
                "uncertainty_score": round(uncertainty, 3),
                "priority_score": total_priority,
                "recommended_technician": assigned_tech.name if assigned_tech else "None Available",
                "technician_id": assigned_tech.id if assigned_tech else None,
                "required_parts": required_part_names if required_part_names else [reqs["primary_part_query"]],
                "estimated_downtime_hours": est_hours,
                "estimated_cost": round(base_cost, 2),
                "potential_downtime_loss_prevented": round(est_downtime_cost, 2),
                "can_schedule": can_schedule,
                "bottleneck_reason": bottleneck,
                "selection_rationale": selection_rationale
            })

        # Sort descending by priority_score
        candidates.sort(key=lambda x: x["priority_score"], reverse=True)
        return candidates
