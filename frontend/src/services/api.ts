/**
 * FarmPulse AI - Typed API Client
 * Centralized Axios communication with FastAPI backend.
 */

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

export interface Machine {
  id: number;
  machine_id: string;
  name: string;
  machine_type: string;
  model: string;
  year: number;
  status: 'Available' | 'In Use' | 'At Risk' | 'Under Maintenance';
  operating_state: 'Operational' | 'Degraded' | 'Critical' | 'Offline';
  health_score: number;
  total_operating_hours: number;
  location: string;
  image_url: string;
  last_service_date?: string;
  next_service_due?: string;
}

export interface SensorReading {
  id: number;
  machine_id: string;
  timestamp: string;
  hour_index: number;
  engine_temp: number | null;
  vibration: number | null;
  rpm: number | null;
  oil_pressure: number | null;
  hydraulic_pressure: number | null;
  fuel_rate: number;
  ambient_temp: number;
  load_percentage: number;
  is_missing: boolean;
  is_noisy: boolean;
  missing_channel: string;
  quality_score: number;
}

export interface ContributingFactor {
  feature: string;
  value: string;
  contribution_score: number;
  status: 'Critical' | 'Warning' | 'Normal' | 'Optimal' | 'Degraded';
}

export interface Prediction {
  id?: number;
  machine_id: string;
  timestamp: string;
  failure_risk: number;
  predicted_fault_type: string;
  time_to_failure_hours: number;
  confidence_score: number;
  uncertainty_score: number;
  observation_quality: number;
  is_sensor_anomaly: boolean;
  top_contributing_factors: ContributingFactor[];
  recommended_action?: string;
  model_version: string;
}

export interface Alert {
  id: number;
  machine_id: string;
  prediction_id?: number;
  alert_level: 'Info' | 'Warning' | 'Critical';
  fault_category: string;
  title: string;
  description: string;
  status: 'New' | 'Acknowledged' | 'Scheduled' | 'Resolved';
  acknowledged_by?: string;
  acknowledged_at?: string;
  resolved_at?: string;
  created_at: string;
}

export interface Technician {
  id: number;
  name: string;
  skill_level: string;
  specialization: string;
  hourly_rate: number;
  is_available: boolean;
  phone: string;
  email: string;
  shift: string;
}

export interface SparePart {
  id: number;
  part_number: string;
  name: string;
  category: string;
  stock_quantity: number;
  minimum_threshold: number;
  unit_cost: number;
  lead_time_days: number;
  compatible_machine_types: string;
  shelf_location: string;
}

export interface WorkOrder {
  id: number;
  work_order_number: string;
  machine_id: string;
  alert_id?: number;
  priority: string;
  status: 'Pending' | 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
  failure_type: string;
  description: string;
  estimated_hours: number;
  actual_hours: number;
  technician_id?: number;
  scheduled_start?: string;
  scheduled_end?: string;
  actual_start?: string;
  actual_end?: string;
  total_cost: number;
  notes?: string;
  created_at: string;
}

export interface FleetKPIs {
  total_machines: number;
  available_machines: number;
  machines_at_risk: number;
  under_maintenance: number;
  fleet_readiness_pct: number;
  total_downtime_hours: number;
  critical_alerts: number;
  open_work_orders: number;
  technician_utilization_pct: number;
  parts_in_stock: number;
  parts_low_stock: number;
}

export interface MaintenanceCandidate {
  machine_id: string;
  machine_name: string;
  machine_type: string;
  health_score: number;
  failure_risk: number;
  fault_type: string;
  uncertainty_score: number;
  priority_score: number;
  recommended_technician?: string;
  technician_id?: number;
  required_parts: string[];
  estimated_downtime_hours: number;
  estimated_cost: number;
  potential_downtime_loss_prevented: number;
  can_schedule: boolean;
  bottleneck_reason?: string;
  selection_rationale: string;
}

export interface ScenarioComparison {
  simulation_id: number;
  duration_days: number;
  fleet_size: number;
  strategy_a: {
    strategy_name: string;
    fleet_availability_pct: number;
    total_downtime_hours: number;
    total_failures: number;
    emergency_repairs_count: number;
    scheduled_maintenance_count: number;
    total_cost: number;
    downtime_cost: number;
    parts_cost: number;
    labor_cost: number;
    mean_time_to_repair_hours: number;
    mean_warning_lead_hours: number;
    technician_utilization_pct: number;
    spare_parts_consumed: number;
    unplanned_breakdowns: number;
    maintenance_philosophy: string;
  };
  strategy_b: {
    strategy_name: string;
    fleet_availability_pct: number;
    total_downtime_hours: number;
    total_failures: number;
    emergency_repairs_count: number;
    scheduled_maintenance_count: number;
    total_cost: number;
    downtime_cost: number;
    parts_cost: number;
    labor_cost: number;
    mean_time_to_repair_hours: number;
    mean_warning_lead_hours: number;
    technician_utilization_pct: number;
    spare_parts_consumed: number;
    unplanned_breakdowns: number;
    maintenance_philosophy: string;
  };
  savings: {
    downtime_reduction_hours: number;
    downtime_reduction_pct: number;
    cost_savings_usd: number;
    cost_reduction_pct: number;
    availability_gain_pct: number;
    emergency_repairs_prevented: number;
    warning_lead_advantage_hours: number;
  };
  timeline_comparison: Array<{
    day: number;
    strategy_a_availability: number;
    strategy_b_availability: number;
    strategy_a_cum_downtime: number;
    strategy_b_cum_downtime: number;
    strategy_a_cum_cost: number;
    strategy_b_cum_cost: number;
  }>;
}

// API Methods
export const api = {
  getFleetSummary: () => apiClient.get<FleetKPIs>('/fleet/summary'),
  getMachines: (params?: { machine_type?: string; status_filter?: string }) =>
    apiClient.get<Machine[]>('/machines', { params }),
  getMachine: (id: string) => apiClient.get<Machine>(`/machines/${id}`),
  getMachineDigitalTwin: (id: string) => apiClient.get<any>(`/machines/${id}/digital-twin`),
  getTelemetryHistory: (id: string, limit = 50) =>
    apiClient.get<SensorReading[]>(`/machines/${id}/telemetry`, { params: { limit } }),
  injectTelemetry: (data: any) => apiClient.post('/simulation/inject-telemetry', data),
  getPredictions: (limit = 50) => apiClient.get<Prediction[]>('/predictions', { params: { limit } }),
  getModelMetrics: () => apiClient.get<any>('/predictions/metrics'),
  getAlerts: (params?: { status_filter?: string; level?: string }) =>
    apiClient.get<Alert[]>('/alerts', { params }),
  acknowledgeAlert: (alertId: number, acknowledged_by = 'Maintenance Manager') =>
    apiClient.post<Alert>(`/alerts/${alertId}/acknowledge`, { acknowledged_by }),
  resolveAlert: (alertId: number) => apiClient.post<Alert>(`/alerts/${alertId}/resolve`),
  getTechnicians: (available_only = false) =>
    apiClient.get<Technician[]>('/technicians', { params: { available_only } }),
  toggleTechnicianAvailability: (id: number) =>
    apiClient.post(`/technicians/${id}/toggle-availability`),
  getSpareParts: (category?: string) =>
    apiClient.get<SparePart[]>('/spare-parts', { params: { category } }),
  reorderSparePart: (id: number, quantity = 5) =>
    apiClient.post(`/spare-parts/${id}/reorder`, null, { params: { quantity } }),
  getWorkOrders: (status_filter?: string) =>
    apiClient.get<WorkOrder[]>('/work-orders', { params: { status_filter } }),
  createWorkOrder: (data: any) => apiClient.post<WorkOrder>('/work-orders', data),
  startWorkOrder: (id: number) => apiClient.post(`/work-orders/${id}/start`),
  completeWorkOrder: (id: number, actual_hours = 3.0) =>
    apiClient.post(`/work-orders/${id}/complete`, null, { params: { actual_hours } }),
  cancelWorkOrder: (id: number) => apiClient.post(`/work-orders/${id}/cancel`),
  getPrioritizedPlan: () => apiClient.get<MaintenanceCandidate[]>('/prioritization/plan'),
  getBaselineComparison: (duration_days = 30, fleet_size = 24) =>
    apiClient.get<ScenarioComparison>('/simulation/baseline-comparison', {
      params: { duration_days, fleet_size },
    }),
  executeDemoStep: (step: number, machine_id = 'FP-101') =>
    apiClient.post('/simulation/demo-step', { step, machine_id }),
  getExportUrl: (report_type = 'fleet_health') =>
    `${API_BASE_URL}/reports/export-csv?report_type=${report_type}`,
};
