import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  CalendarClock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Users,
  Boxes,
  ArrowRight,
  ShieldAlert,
  HelpCircle,
  Sparkles,
  Info
} from 'lucide-react';
import { api, MaintenanceCandidate } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';

export const MaintenancePlanning: React.FC = () => {
  const [candidates, setCandidates] = useState<MaintenanceCandidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [schedulingId, setSchedulingId] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchPlan();
  }, []);

  const fetchPlan = async () => {
    try {
      setLoading(true);
      const res = await api.getPrioritizedPlan();
      setCandidates(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDispatchWorkOrder = async (cand: MaintenanceCandidate) => {
    try {
      setSchedulingId(cand.machine_id);
      await api.createWorkOrder({
        machine_id: cand.machine_id,
        priority: cand.priority_score > 75 ? 'Critical Emergency' : 'High',
        failure_type: cand.fault_type,
        description: `Proactive condition-based maintenance dispatched via Prioritization Engine. ${cand.selection_rationale}`,
        estimated_hours: cand.estimated_downtime_hours,
        technician_id: cand.technician_id,
        notes: `Selected rationale: ${cand.selection_rationale}`
      });
      setActionSuccess(`Work Order successfully created & dispatched for ${cand.machine_id}!`);
      setTimeout(() => setActionSuccess(null), 5000);
      await fetchPlan();
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to dispatch work order');
    } finally {
      setSchedulingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Constrained Maintenance Prioritization
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Multi-attribute scheduling engine considering fault severity, prediction uncertainty, technician availability, and spare-parts inventory.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
            {candidates.filter((c) => c.can_schedule).length} Schedulable Now
          </span>
          <span className="text-xs px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 font-semibold border border-rose-200">
            {candidates.filter((c) => !c.can_schedule).length} Resource Bottlenecks
          </span>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Prioritization Formula Legend */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm text-xs text-slate-600 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-emerald-600" />
          <span className="font-semibold text-slate-900">Multi-Attribute Priority Scoring:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
          <span className="bg-slate-100 px-2 py-0.5 rounded">Risk (40%)</span>
          <span>+</span>
          <span className="bg-slate-100 px-2 py-0.5 rounded">Crop Criticality (25%)</span>
          <span>+</span>
          <span className="bg-slate-100 px-2 py-0.5 rounded">RUL Urgency (15%)</span>
          <span>+</span>
          <span className="bg-slate-100 px-2 py-0.5 rounded">Confidence Calibration (10%)</span>
          <span>+</span>
          <span className="bg-slate-100 px-2 py-0.5 rounded">Condition Penalty (10%)</span>
        </div>
      </div>

      {/* Prioritized Candidates List */}
      <div className="space-y-4">
        {candidates.map((c, idx) => (
          <div
            key={c.machine_id}
            className={`bg-white rounded-xl border p-5 shadow-sm transition-all ${
              c.can_schedule
                ? 'border-slate-200 hover:border-emerald-400'
                : 'border-rose-200/80 bg-rose-50/10'
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Left Column: Rank, ID, Fault Details */}
              <div className="flex items-start gap-4">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold font-mono text-sm shadow-sm ${
                    idx === 0
                      ? 'bg-emerald-600 text-white ring-2 ring-emerald-400/30'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  #{idx + 1}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900">{c.machine_id}</span>
                    <span className="text-xs text-slate-500">• {c.machine_name}</span>
                    <span className="text-xs text-slate-400">({c.machine_type})</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mt-1">
                    Fault: {c.fault_type}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 max-w-xl">
                    <strong className="text-slate-800">Rationale:</strong> {c.selection_rationale}
                  </p>
                </div>
              </div>

              {/* Middle Column: Resource Constraints Verification */}
              <div className="grid grid-cols-2 gap-3 text-xs min-w-[280px]">
                {/* Technician Constraint */}
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-medium">
                    <Users className="w-3.5 h-3.5" />
                    <span>Assigned Tech</span>
                  </div>
                  <p className="font-semibold text-slate-900 mt-0.5 truncate">
                    {c.recommended_technician || 'None Available'}
                  </p>
                </div>

                {/* Parts Constraint */}
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-medium">
                    <Boxes className="w-3.5 h-3.5" />
                    <span>Required Part</span>
                  </div>
                  <p className="font-semibold text-slate-900 mt-0.5 truncate">
                    {c.required_parts[0] || 'Assembly'}
                  </p>
                </div>
              </div>

              {/* Right Column: Score & Action Button */}
              <div className="flex items-center justify-between lg:justify-end gap-4 border-t lg:border-t-0 pt-3 lg:pt-0">
                <div className="text-left lg:text-right">
                  <span className="text-2xl font-bold font-mono text-emerald-700">
                    {c.priority_score}
                  </span>
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">Priority Index</p>
                </div>

                <div>
                  {c.can_schedule ? (
                    <button
                      onClick={() => handleDispatchWorkOrder(c)}
                      disabled={schedulingId === c.machine_id}
                      className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 whitespace-nowrap"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{schedulingId === c.machine_id ? 'Dispatching...' : 'Dispatch Work Order'}</span>
                    </button>
                  ) : (
                    <div className="text-right">
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-100 text-rose-800 text-xs font-bold border border-rose-200">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Scheduling Blocked</span>
                      </span>
                      <p className="text-[10px] text-rose-600 font-medium mt-1 max-w-[200px] truncate" title={c.bottleneck_reason}>
                        {c.bottleneck_reason}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
