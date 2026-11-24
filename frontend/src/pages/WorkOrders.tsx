import React, { useEffect, useState } from 'react';
import {
  ClipboardList,
  Plus,
  Play,
  CheckCircle2,
  XCircle,
  Clock,
  Wrench,
  DollarSign,
  AlertTriangle,
  UserCheck
} from 'lucide-react';
import { api, WorkOrder, Technician, SparePart, Machine } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';

export const WorkOrders: React.FC = () => {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [spareParts, setSpareParts] = useState<SparePart[]>([]);
  const [loading, setLoading] = useState(true);

  // New Work Order Modal
  const [showModal, setShowModal] = useState(false);
  const [machineId, setMachineId] = useState('FP-101');
  const [priority, setPriority] = useState('High');
  const [failureType, setFailureType] = useState('Cooling System Radiator');
  const [desc, setDesc] = useState('');
  const [hours, setHours] = useState(3.5);
  const [techId, setTechId] = useState<number | undefined>(undefined);
  const [selectedPartId, setSelectedPartId] = useState<number | undefined>(undefined);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [woRes, mRes, tRes, pRes] = await Promise.all([
        api.getWorkOrders(),
        api.getMachines(),
        api.getTechnicians(),
        api.getSpareParts(),
      ]);
      setWorkOrders(woRes.data);
      setMachines(mRes.data);
      setTechnicians(tRes.data);
      setSpareParts(pRes.data);
      if (tRes.data.length > 0) setTechId(tRes.data[0].id);
      if (pRes.data.length > 0) setSelectedPartId(pRes.data[0].id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createWorkOrder({
        machine_id: machineId,
        priority,
        failure_type: failureType,
        description: desc || 'Condition-based proactive replacement.',
        estimated_hours: hours,
        technician_id: techId,
        parts: selectedPartId ? [{ part_id: selectedPartId, quantity: 1 }] : [],
      });
      setShowModal(false);
      setDesc('');
      await fetchData();
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to create work order');
    }
  };

  const handleStart = async (id: number) => {
    try {
      await api.startWorkOrder(id);
      await fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleComplete = async (id: number) => {
    try {
      await api.completeWorkOrder(id, 3.2);
      await fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = async (id: number) => {
    if (!confirm('Cancel this work order?')) return;
    try {
      await api.cancelWorkOrder(id);
      await fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Work Order Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Full maintenance lifecycle: technician dispatch, parts reservation, and repair validation.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all transform hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4" />
          <span>Create Work Order</span>
        </button>
      </div>

      {/* Work Orders List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">WO Number</th>
                <th className="py-3 px-4">Machine</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Fault Category</th>
                <th className="py-3 px-4">Technician</th>
                <th className="py-3 px-4">Est. Cost</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {workOrders.map((wo) => {
                const tech = technicians.find((t) => t.id === wo.technician_id);
                return (
                  <tr key={wo.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-emerald-800">
                      {wo.work_order_number}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {wo.machine_id}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={wo.priority} size="sm" />
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={wo.status} size="sm" />
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800">
                      {wo.failure_type}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {tech ? (
                        <span className="flex items-center gap-1.5 font-medium">
                          <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{tech.name}</span>
                        </span>
                      ) : (
                        <span className="text-slate-400">Unassigned</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      ${wo.total_cost.toFixed(0)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {wo.status === 'Scheduled' && (
                          <button
                            onClick={() => handleStart(wo.id)}
                            className="px-2.5 py-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold text-xs border border-blue-200 transition-all flex items-center gap-1"
                          >
                            <Play className="w-3 h-3" />
                            <span>Start</span>
                          </button>
                        )}
                        {wo.status === 'In Progress' && (
                          <button
                            onClick={() => handleComplete(wo.id)}
                            className="px-2.5 py-1 rounded bg-emerald-600 text-white hover:bg-emerald-500 font-semibold text-xs transition-all flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Complete</span>
                          </button>
                        )}
                        {wo.status !== 'Completed' && wo.status !== 'Cancelled' && (
                          <button
                            onClick={() => handleCancel(wo.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                            title="Cancel Order"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Work Order Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-scaleUp">
            <h2 className="text-base font-bold text-slate-900 mb-4">Schedule Maintenance Work Order</h2>
            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Select Machine Digital Twin:</label>
                <select
                  value={machineId}
                  onChange={(e) => setMachineId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-bold"
                >
                  {machines.map((m) => (
                    <option key={m.machine_id} value={m.machine_id}>
                      {m.machine_id} - {m.name} ({m.status})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Priority Level:</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5"
                  >
                    <option value="Critical Emergency">Critical Emergency</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Est. Duration (Hours):</label>
                  <input
                    type="number"
                    step="0.5"
                    value={hours}
                    onChange={(e) => setHours(parseFloat(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Assign Certified Technician:</label>
                <select
                  value={techId}
                  onChange={(e) => setTechId(parseInt(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5"
                >
                  {technicians.map((t) => (
                    <option key={t.id} value={t.id} disabled={!t.is_available}>
                      {t.name} - {t.specialization} ({t.skill_level}) {t.is_available ? '• Available' : '• Busy'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Reserve Spare Part:</label>
                <select
                  value={selectedPartId}
                  onChange={(e) => setSelectedPartId(parseInt(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5"
                >
                  <option value="">No parts required</option>
                  {spareParts.map((p) => (
                    <option key={p.id} value={p.id} disabled={p.stock_quantity < 1}>
                      {p.name} ({p.part_number}) • Stock: {p.stock_quantity}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Scope of Maintenance:</label>
                <textarea
                  rows={2}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Proactive inspection and component replacement notes..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  Confirm & Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
