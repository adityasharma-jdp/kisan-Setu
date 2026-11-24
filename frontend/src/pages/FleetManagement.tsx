import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Tractor,
  Search,
  Filter,
  Eye,
  Calendar,
  Clock,
  Gauge,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { api, Machine } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';

export const FleetManagement: React.FC = () => {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMachines();
  }, []);

  const fetchMachines = async () => {
    try {
      setLoading(true);
      const res = await api.getMachines();
      setMachines(res.data);
    } catch (err) {
      console.error('Failed to load fleet', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = machines.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.machine_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'All' || m.machine_type === typeFilter;
    const matchesStatus = statusFilter === 'All' || m.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const machineTypes = [
    'All',
    'Heavy-Duty Tractor',
    'Combine Harvester',
    'Precision Planter',
    'Crop Sprayer',
    'Forage Harvester',
  ];

  const statusOptions = ['All', 'Available', 'In Use', 'At Risk', 'Under Maintenance'];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Fleet Machinery Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time digital twin registry, operating condition scores, and maintenance status.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">
            Showing <strong className="text-slate-900">{filtered.length}</strong> of {machines.length} units
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Machine ID, Name, or Sector Location..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:border-emerald-500"
          >
            {machineTypes.map((t) => (
              <option key={t} value={t}>
                {t === 'All' ? 'All Machine Types' : t}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:border-emerald-500"
          >
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s === 'All' ? 'All Statuses' : s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Machines Table & Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((m) => (
          <div
            key={m.id}
            className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all hover:border-emerald-400/80 flex flex-col justify-between group"
          >
            <div>
              {/* Card Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {m.machine_id}
                  </span>
                  <h3 className="font-bold text-sm text-slate-900 mt-1.5 leading-snug group-hover:text-emerald-800 transition-colors">
                    {m.name}
                  </h3>
                  <p className="text-[11px] text-slate-500">{m.machine_type} • {m.model} ({m.year})</p>
                </div>
                <StatusBadge status={m.status} size="sm" />
              </div>

              {/* Health Score Gauge */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-500 font-medium">Condition Health</span>
                  <span
                    className={`font-bold ${
                      m.health_score > 90
                        ? 'text-emerald-600'
                        : m.health_score > 75
                        ? 'text-amber-600'
                        : 'text-rose-600'
                    }`}
                  >
                    {m.health_score}%
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      m.health_score > 90
                        ? 'bg-emerald-500'
                        : m.health_score > 75
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${m.health_score}%` }}
                  />
                </div>
              </div>

              {/* Machinery Specs Grid */}
              <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{m.total_operating_hours} hrs</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Gauge className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{m.operating_state}</span>
                </div>
                <div className="col-span-2 text-slate-500 truncate">
                  📍 {m.location}
                </div>
              </div>
            </div>

            {/* Action Footer */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <NavLink
                to={`/twin?machine=${m.machine_id}`}
                className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-900 group-hover:underline"
              >
                <span>Launch Digital Twin</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </NavLink>
              <NavLink
                to={`/planning?machine=${m.machine_id}`}
                className="text-[11px] px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-all"
              >
                Schedule
              </NavLink>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
