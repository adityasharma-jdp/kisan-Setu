"""
FarmPulse AI - Comprehensive Fleet Seed Data
Seeds 24 machinery twins, technicians, spare parts, alerts, historical telemetry,
service logs, and baseline scenario comparisons.
"""

from datetime import datetime, timedelta
import random
from sqlalchemy.orm import Session
from backend.database import SessionLocal, engine, Base
from backend.models import (
    Machine, SensorReading, ServiceHistory, Prediction,
    Alert, Technician, SparePart, WorkOrder, WorkOrderPart,
    MaintenanceEvent, SimulationRun, ScenarioResult
)

MACHINES_SEED = [
    {"machine_id": "FP-101", "name": "AgriMax Titan 9400", "machine_type": "Heavy-Duty Tractor", "model": "AT-9400", "year": 2023, "status": "At Risk", "operating_state": "Degraded", "health_score": 68.5, "hours": 2480.0, "location": "North Sector Plot 4"},
    {"machine_id": "FP-102", "name": "CropMaster Harvester X9", "machine_type": "Combine Harvester", "model": "CM-X9", "year": 2022, "status": "Available", "operating_state": "Operational", "health_score": 94.0, "hours": 1820.0, "location": "East Harvest Valley"},
    {"machine_id": "FP-103", "name": "PrecisionPlanter 36R", "machine_type": "Precision Planter", "model": "PP-36R", "year": 2024, "status": "Available", "operating_state": "Operational", "health_score": 98.2, "hours": 640.0, "location": "Central Depot Barn 2"},
    {"machine_id": "FP-104", "name": "AeroSpray HighClear 1200", "machine_type": "Crop Sprayer", "model": "AS-1200", "year": 2023, "status": "In Use", "operating_state": "Operational", "health_score": 88.5, "hours": 1410.0, "location": "West Orchard Section"},
    {"machine_id": "FP-105", "name": "SilageKing Forage Pro", "machine_type": "Forage Harvester", "model": "SK-700", "year": 2021, "status": "Under Maintenance", "operating_state": "Offline", "health_score": 52.0, "hours": 3650.0, "location": "Workshop Bay 3"},
    {"machine_id": "FP-106", "name": "TerraTrack Magnum 380", "machine_type": "Heavy-Duty Tractor", "model": "TT-380", "year": 2022, "status": "Available", "operating_state": "Operational", "health_score": 91.0, "hours": 2100.0, "location": "South Ridge Fields"},
    {"machine_id": "FP-107", "name": "HarvPro TwinRotor 820", "machine_type": "Combine Harvester", "model": "HP-820", "year": 2023, "status": "At Risk", "operating_state": "Degraded", "health_score": 71.0, "hours": 1950.0, "location": "North Harvest Sector"},
    {"machine_id": "FP-108", "name": "SeedPulse MultiRow 24", "machine_type": "Precision Planter", "model": "SP-24", "year": 2024, "status": "Available", "operating_state": "Operational", "health_score": 97.5, "hours": 510.0, "location": "Central Depot Barn 1"},
    {"machine_id": "FP-109", "name": "AeroSpray EcoMist 900", "machine_type": "Crop Sprayer", "model": "AS-900", "year": 2022, "status": "Available", "operating_state": "Operational", "health_score": 93.0, "hours": 1280.0, "location": "Vineyard Section B"},
    {"machine_id": "FP-110", "name": "SilageKing HeavyCut 650", "machine_type": "Forage Harvester", "model": "SK-650", "year": 2021, "status": "Available", "operating_state": "Operational", "health_score": 86.0, "hours": 3120.0, "location": "East Silo Pasture"},
    {"machine_id": "FP-111", "name": "TitanTerra QuadTrack 500", "machine_type": "Heavy-Duty Tractor", "model": "TT-500", "year": 2024, "status": "In Use", "operating_state": "Operational", "health_score": 96.5, "hours": 890.0, "location": "Prairie Plot 12"},
    {"machine_id": "FP-112", "name": "BioHarv AxialFlow 750", "machine_type": "Combine Harvester", "model": "BH-750", "year": 2022, "status": "Available", "operating_state": "Operational", "health_score": 89.0, "hours": 2340.0, "location": "East Valley Field 6"},
    {"machine_id": "FP-113", "name": "SeedMaster UltraRow 32", "machine_type": "Precision Planter", "model": "SM-32", "year": 2023, "status": "Available", "operating_state": "Operational", "health_score": 95.0, "hours": 980.0, "location": "South Grain Depot"},
    {"machine_id": "FP-114", "name": "AeroGlide BoomSpray 1500", "machine_type": "Crop Sprayer", "model": "AG-1500", "year": 2023, "status": "At Risk", "operating_state": "Degraded", "health_score": 74.5, "hours": 1750.0, "location": "North Orchard Road"},
    {"machine_id": "FP-115", "name": "ForageMax Chopper 800", "machine_type": "Forage Harvester", "model": "FM-800", "year": 2022, "status": "Available", "operating_state": "Operational", "health_score": 87.0, "hours": 2890.0, "location": "North Pasture 3"},
    {"machine_id": "FP-116", "name": "AgriMax Steiger 420", "machine_type": "Heavy-Duty Tractor", "model": "AS-420", "year": 2023, "status": "Available", "operating_state": "Operational", "health_score": 92.5, "hours": 1650.0, "location": "West Tillage Section"},
    {"machine_id": "FP-117", "name": "CropKing Lexion 680", "machine_type": "Combine Harvester", "model": "CK-680", "year": 2020, "status": "Under Maintenance", "operating_state": "Offline", "health_score": 48.0, "hours": 4200.0, "location": "Workshop Bay 1"},
    {"machine_id": "FP-118", "name": "PlanterTech DirectDrill 18", "machine_type": "Precision Planter", "model": "PT-18", "year": 2024, "status": "Available", "operating_state": "Operational", "health_score": 99.0, "hours": 320.0, "location": "Central Barn 3"},
    {"machine_id": "FP-119", "name": "IntelliSpray AutoBoom 1000", "machine_type": "Crop Sprayer", "model": "IS-1000", "year": 2023, "status": "Available", "operating_state": "Operational", "health_score": 90.5, "hours": 1150.0, "location": "South Valley Fields"},
    {"machine_id": "FP-120", "name": "SilageKing Biocut 720", "machine_type": "Forage Harvester", "model": "SK-720", "year": 2023, "status": "Available", "operating_state": "Operational", "health_score": 93.5, "hours": 1450.0, "location": "East Meadow Section"},
    {"machine_id": "FP-121", "name": "TerraTrack DualHub 350", "machine_type": "Heavy-Duty Tractor", "model": "TT-350", "year": 2022, "status": "In Use", "operating_state": "Operational", "health_score": 85.0, "hours": 2780.0, "location": "North Plot 8"},
    {"machine_id": "FP-122", "name": "HarvPro Rotary 900", "machine_type": "Combine Harvester", "model": "HP-900", "year": 2024, "status": "Available", "operating_state": "Operational", "health_score": 96.0, "hours": 740.0, "location": "Central Grain Silos"},
    {"machine_id": "FP-123", "name": "PrecisionPlanter AirSeed 48", "machine_type": "Precision Planter", "model": "PP-48", "year": 2023, "status": "Available", "operating_state": "Operational", "health_score": 92.0, "hours": 1120.0, "location": "West Field Staging"},
    {"machine_id": "FP-124", "name": "AeroSpray MultiNozzle 1400", "machine_type": "Crop Sprayer", "model": "AS-1400", "year": 2022, "status": "Available", "operating_state": "Operational", "health_score": 88.0, "hours": 1690.0, "location": "South Valley 4"}
]

TECHNICIANS_SEED = [
    {"name": "Marcus Vance", "skill_level": "Master Tech", "specialization": "Hydraulics & Heavy Powertrains", "hourly_rate": 85.0, "is_available": True, "phone": "+1 (555) 234-8901", "email": "m.vance@farmpulse.ai", "shift": "Morning"},
    {"name": "Elena Rostova", "skill_level": "Senior", "specialization": "Engine Diagnostics & Thermal Systems", "hourly_rate": 72.0, "is_available": True, "phone": "+1 (555) 345-9012", "email": "e.rostova@farmpulse.ai", "shift": "Morning"},
    {"name": "Darius Thorne", "skill_level": "Senior", "specialization": "Mechanical Bearings & Transmissions", "hourly_rate": 68.0, "is_available": False, "phone": "+1 (555) 456-0123", "email": "d.thorne@farmpulse.ai", "shift": "Morning"},
    {"name": "Sarah Chen", "skill_level": "Intermediate", "specialization": "IoT Sensors & Electrical Harnesses", "hourly_rate": 55.0, "is_available": True, "phone": "+1 (555) 567-1234", "email": "s.chen@farmpulse.ai", "shift": "Evening"},
    {"name": "Carlos Gomez", "skill_level": "Intermediate", "specialization": "Lubrication Systems & Preventive Care", "hourly_rate": 52.0, "is_available": True, "phone": "+1 (555) 678-2345", "email": "c.gomez@farmpulse.ai", "shift": "Morning"},
    {"name": "Liam Gallagher", "skill_level": "Senior", "specialization": "Harvester Threshing & Hydraulics", "hourly_rate": 70.0, "is_available": True, "phone": "+1 (555) 789-3456", "email": "l.gallagher@farmpulse.ai", "shift": "Evening"},
    {"name": "Aisha Patel", "skill_level": "Junior", "specialization": "General Agricultural Fleet Inspection", "hourly_rate": 42.0, "is_available": True, "phone": "+1 (555) 890-4567", "email": "a.patel@farmpulse.ai", "shift": "Morning"},
    {"name": "Thomas Brody", "skill_level": "Master Tech", "specialization": "Planter Calibration & Hydraulics", "hourly_rate": 82.0, "is_available": False, "phone": "+1 (555) 901-5678", "email": "t.brody@farmpulse.ai", "shift": "Night"}
]

SPARE_PARTS_SEED = [
    {"part_number": "PRT-BRG-8801", "name": "Heavy Cylindrical Roller Bearing (Axle)", "category": "Bearings", "stock_quantity": 8, "minimum_threshold": 3, "unit_cost": 165.0, "lead_time_days": 2, "shelf_location": "Bay B-04"},
    {"part_number": "PRT-RAD-4420", "name": "Heavy-Duty Aluminium Radiator Core", "category": "Cooling", "stock_quantity": 4, "minimum_threshold": 2, "unit_cost": 420.0, "lead_time_days": 3, "shelf_location": "Bay C-11"},
    {"part_number": "PRT-THM-2105", "name": "Electronic Dual-Stage Thermostat", "category": "Cooling", "stock_quantity": 12, "minimum_threshold": 4, "unit_cost": 85.0, "lead_time_days": 1, "shelf_location": "Bay C-02"},
    {"part_number": "PRT-HYD-9100", "name": "High-Pressure Hydraulic Proportional Valve", "category": "Hydraulics", "stock_quantity": 2, "minimum_threshold": 2, "unit_cost": 540.0, "lead_time_days": 4, "shelf_location": "Bay A-09"},
    {"part_number": "PRT-HYD-3340", "name": "Reinforced Braided Hydraulic Hose (250 bar)", "category": "Hydraulics", "stock_quantity": 16, "minimum_threshold": 5, "unit_cost": 95.0, "lead_time_days": 1, "shelf_location": "Bay A-03"},
    {"part_number": "PRT-OIL-1102", "name": "Synthetic Hydraulic & Engine Lube Oil (20L)", "category": "Lubrication", "stock_quantity": 24, "minimum_threshold": 8, "unit_cost": 110.0, "lead_time_days": 1, "shelf_location": "Bay D-01"},
    {"part_number": "PRT-FLT-6780", "name": "Primary & Secondary Engine Spin-on Filter Set", "category": "Lubrication", "stock_quantity": 30, "minimum_threshold": 10, "unit_cost": 45.0, "lead_time_days": 1, "shelf_location": "Bay D-03"},
    {"part_number": "PRT-SNR-5501", "name": "Piezoelectric Vibration Transducer Sensor", "category": "Electrical", "stock_quantity": 9, "minimum_threshold": 3, "unit_cost": 195.0, "lead_time_days": 2, "shelf_location": "Bay E-05"},
    {"part_number": "PRT-SNR-5502", "name": "K-Type Thermocouple Temperature Sensor", "category": "Electrical", "stock_quantity": 14, "minimum_threshold": 4, "unit_cost": 65.0, "lead_time_days": 1, "shelf_location": "Bay E-06"},
    {"part_number": "PRT-SNR-5503", "name": "Piezoresistive Oil Pressure Sensor (0-10 bar)", "category": "Electrical", "stock_quantity": 11, "minimum_threshold": 3, "unit_cost": 130.0, "lead_time_days": 2, "shelf_location": "Bay E-07"},
    {"part_number": "PRT-PMP-7200", "name": "Variable Displacement Hydraulic Piston Pump", "category": "Hydraulics", "stock_quantity": 1, "minimum_threshold": 1, "unit_cost": 1250.0, "lead_time_days": 5, "shelf_location": "Bay A-15"},
    {"part_number": "PRT-CLT-3810", "name": "Heavy Tractor Main Friction Clutch Disc", "category": "Bearings", "stock_quantity": 3, "minimum_threshold": 2, "unit_cost": 380.0, "lead_time_days": 3, "shelf_location": "Bay B-08"}
]

def seed_database():
    """Initializes tables and populates default demo entities if empty."""
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    try:
        if db.query(Machine).count() > 0:
            print("Database already populated. Skipping initial seed.")
            return

        print("Seeding database with FarmPulse AI enterprise fleet data...")

        # 1. Seed Machines
        now = datetime.utcnow()
        machine_objs = {}
        for m in MACHINES_SEED:
            obj = Machine(
                machine_id=m["machine_id"],
                name=m["name"],
                machine_type=m["machine_type"],
                model=m["model"],
                year=m["year"],
                status=m["status"],
                operating_state=m["operating_state"],
                health_score=m["health_score"],
                total_operating_hours=m["hours"],
                last_service_date=now - timedelta(days=random.randint(15, 60)),
                next_service_due=now + timedelta(days=random.randint(10, 45)),
                location=m["location"],
                image_url="/tractor.svg"
            )
            db.add(obj)
            machine_objs[m["machine_id"]] = obj
        db.commit()

        # 2. Seed Technicians
        tech_objs = []
        for t in TECHNICIANS_SEED:
            obj = Technician(
                name=t["name"],
                skill_level=t["skill_level"],
                specialization=t["specialization"],
                hourly_rate=t["hourly_rate"],
                is_available=t["is_available"],
                phone=t["phone"],
                email=t["email"],
                shift=t["shift"]
            )
            db.add(obj)
            tech_objs.append(obj)
        db.commit()

        # 3. Seed Spare Parts
        part_objs = []
        for p in SPARE_PARTS_SEED:
            obj = SparePart(
                part_number=p["part_number"],
                name=p["name"],
                category=p["category"],
                stock_quantity=p["stock_quantity"],
                minimum_threshold=p["minimum_threshold"],
                unit_cost=p["unit_cost"],
                lead_time_days=p["lead_time_days"],
                compatible_machine_types="All Machinery",
                shelf_location=p["shelf_location"]
            )
            db.add(obj)
            part_objs.append(obj)
        db.commit()

        # 4. Seed Telemetry & Historical Readings for FP-101 (The Guided Intervention Tractor)
        # FP-101 develops thermal/cooling degradation and bearing vibration
        base_time = now - timedelta(hours=48)
        for h in range(48):
            t_stamp = base_time + timedelta(hours=h)
            progress = h / 48.0
            temp = 88.0 + (progress ** 2.0) * 22.0 + random.gauss(0, 1.2)
            vib = 1.8 + (progress ** 2.2) * 2.8 + random.gauss(0, 0.15)
            oil = max(1.8, 4.2 - progress * 1.1 + random.gauss(0, 0.08))
            
            # Include occasional simulated noisy artifact
            is_noisy = (h == 22)
            if is_noisy:
                vib += 2.5
                quality = 0.65
            else:
                quality = 0.98

            db.add(SensorReading(
                machine_id="FP-101",
                timestamp=t_stamp,
                hour_index=h,
                engine_temp=round(temp, 2),
                vibration=round(vib, 3),
                rpm=round(2100.0 + random.gauss(0, 15), 1),
                oil_pressure=round(oil, 2),
                hydraulic_pressure=round(204.0 + random.gauss(0, 3.0), 1),
                fuel_rate=round(29.0 + progress * 5.0, 2),
                ambient_temp=24.5,
                load_percentage=82.0,
                is_missing=False,
                is_noisy=is_noisy,
                quality_score=quality
            ))
            
        # Seed readings for healthy tractor FP-102
        for h in range(24):
            t_stamp = now - timedelta(hours=24 - h)
            db.add(SensorReading(
                machine_id="FP-102",
                timestamp=t_stamp,
                hour_index=h,
                engine_temp=round(91.5 + random.gauss(0, 1.0), 2),
                vibration=round(2.5 + random.gauss(0, 0.12), 3),
                rpm=round(2290.0 + random.gauss(0, 10), 1),
                oil_pressure=round(4.0 + random.gauss(0, 0.05), 2),
                hydraulic_pressure=round(214.0 + random.gauss(0, 2.5), 1),
                fuel_rate=41.5,
                ambient_temp=23.0,
                load_percentage=78.0,
                is_missing=False,
                is_noisy=False,
                quality_score=1.0
            ))
        db.commit()

        # 5. Seed Active Predictions & Alerts
        pred_101 = Prediction(
            machine_id="FP-101",
            timestamp=now - timedelta(minutes=18),
            failure_risk=0.86,
            predicted_fault_type="Cooling_System_Degradation",
            time_to_failure_hours=74.5,
            confidence_score=0.78,
            uncertainty_score=0.22,
            observation_quality=0.98,
            is_sensor_anomaly=False,
            top_contributing_factors=[
                {"feature": "Thermal Deviation", "value": "+21.2 °C", "contribution_score": 0.38, "status": "Critical"},
                {"feature": "Vibration Severity", "value": "4.45 mm/s", "contribution_score": 0.29, "status": "Warning"},
                {"feature": "Lube Oil Pressure Drop", "value": "+1.10 bar", "contribution_score": 0.18, "status": "Warning"}
            ],
            recommended_action="Urgent: Inspect cooling radiator core and cylinder head coolant circulation before next shift.",
            model_version="RF-Fleet-v2.1"
        )
        db.add(pred_101)
        db.flush()

        alert_101 = Alert(
            machine_id="FP-101",
            prediction_id=pred_101.id,
            alert_level="Critical",
            fault_category="Thermal / Cooling System",
            title="Accelerating Thermal Runaway Detected on AgriMax Titan 9400",
            description="Engine temperature has exceeded nominal baseline by +21.2°C over past 18 hours. Predicted time-to-failure: 74.5 hours. Immediate maintenance required.",
            status="New"
        )
        db.add(alert_101)

        pred_107 = Prediction(
            machine_id="FP-107",
            timestamp=now - timedelta(hours=2),
            failure_risk=0.72,
            predicted_fault_type="Bearing_Mechanical_Wear",
            time_to_failure_hours=115.0,
            confidence_score=0.82,
            uncertainty_score=0.18,
            observation_quality=0.96,
            is_sensor_anomaly=False,
            top_contributing_factors=[
                {"feature": "Vibration Severity", "value": "4.12 mm/s", "contribution_score": 0.44, "status": "Critical"}
            ],
            recommended_action="Inspect threshing rotor hub bearing assembly. Excessive radial vibration detected.",
            model_version="RF-Fleet-v2.1"
        )
        db.add(pred_107)
        db.flush()

        alert_107 = Alert(
            machine_id="FP-107",
            prediction_id=pred_107.id,
            alert_level="Warning",
            fault_category="Mechanical Bearing Wear",
            title="Rotor Hub Bearing Vibration Exceeds Threshold on HarvPro 820",
            description="Vibration amplitude rose to 4.12 mm/s (normal < 2.6 mm/s). Early fatigue flaking indicated.",
            status="New"
        )
        db.add(alert_107)
        db.commit()

        # 6. Seed Work Orders
        wo_105 = WorkOrder(
            work_order_number="WO-2026-041",
            machine_id="FP-105",
            priority="Critical Emergency",
            status="In Progress",
            failure_type="Hydraulic Pump Seizure",
            description="Emergency overhaul: variable displacement piston pump seized during field operation.",
            estimated_hours=6.0,
            actual_hours=3.5,
            technician_id=tech_objs[2].id, # Darius Thorne
            scheduled_start=now - timedelta(hours=4),
            scheduled_end=now + timedelta(hours=2),
            actual_start=now - timedelta(hours=3, minutes=30),
            total_cost=1850.0,
            notes="Replaced main pump and flushed contaminated oil."
        )
        db.add(wo_105)

        wo_117 = WorkOrder(
            work_order_number="WO-2026-039",
            machine_id="FP-117",
            priority="High",
            status="Scheduled",
            failure_type="Clutch Assembly Slippage",
            description="Clutch friction material worn past safety limit on Lexion 680.",
            estimated_hours=5.0,
            actual_hours=0.0,
            technician_id=tech_objs[7].id, # Thomas Brody
            scheduled_start=now + timedelta(hours=6),
            scheduled_end=now + timedelta(hours=11),
            total_cost=820.0,
            notes="Parts staged in Bay B-08."
        )
        db.add(wo_117)
        db.commit()

        # 7. Seed Service History Logs
        for m_id in ["FP-101", "FP-102", "FP-103", "FP-104", "FP-106"]:
            db.add(ServiceHistory(
                machine_id=m_id,
                service_date=now - timedelta(days=random.randint(30, 90)),
                service_type="Routine Preventive",
                description="250-hour scheduled lubrication, fuel filter replacement, and belt tension check.",
                technician_name="Elena Rostova",
                cost=340.0,
                downtime_hours=2.5,
                parts_replaced="Engine Oil 20L, Fuel Filter Set"
            ))
        db.commit()

        # 8. Seed Baseline Comparison Simulation Run (Section 4.G)
        sim_run = SimulationRun(
            run_name="30-Day Harvest Peak Fleet Stress Simulation",
            scenario_type="Harvest Season Heavy Load",
            duration_days=30,
            fleet_size=24,
            seed=42,
            status="Completed"
        )
        db.add(sim_run)
        db.flush()

        # Strategy A (Calendar-Only Baseline)
        res_a = ScenarioResult(
            simulation_run_id=sim_run.id,
            strategy_name="Calendar-Only (Strategy A)",
            fleet_availability_pct=83.4,
            total_downtime_hours=238.5,
            total_failures=11,
            emergency_repairs_count=9,
            scheduled_maintenance_count=14,
            total_cost=28450.0,
            mean_time_to_repair=6.8,
            mean_warning_lead_hours=0.0, # Zero proactive lead time in calendar mode!
            technician_utilization_pct=61.0,
            spare_parts_consumed=34,
            summary_json={
                "strategy_description": "Fixed interval maintenance every 250 operating hours regardless of condition. Unexpected catastrophic breakdowns occur mid-harvest.",
                "downtime_cost": 17800.0,
                "parts_cost": 6450.0,
                "labor_cost": 4200.0,
                "unplanned_stoppages": 9
            }
        )
        db.add(res_a)

        # Strategy B (Condition-Based AI)
        res_b = ScenarioResult(
            simulation_run_id=sim_run.id,
            strategy_name="Condition-Based AI (Strategy B)",
            fleet_availability_pct=95.8,
            total_downtime_hours=59.0,
            total_failures=2,
            emergency_repairs_count=1,
            scheduled_maintenance_count=16,
            total_cost=12150.0,
            mean_time_to_repair=2.9,
            mean_warning_lead_hours=78.5, # Proactive warning lead time!
            technician_utilization_pct=88.5,
            spare_parts_consumed=22,
            summary_json={
                "strategy_description": "Continuous digital twin telemetry, Random Forest degradation tracking, and constraint-aware proactive dispatch before catastrophic failure.",
                "downtime_cost": 4400.0,
                "parts_cost": 4650.0,
                "labor_cost": 3100.0,
                "unplanned_stoppages": 1
            }
        )
        db.add(res_b)
        db.commit()

        print("Database seeding completed successfully!")

    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
