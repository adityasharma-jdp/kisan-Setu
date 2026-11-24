import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Tractor,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Wrench,
  Boxes,
  Users,
  TrendingUp,
  Activity,
  ArrowUpRight,
  ShieldAlert,
  PlayCircle
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { api, FleetKPIs, Machine, Alert } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';

export const OverviewDashboard: React.FC = () => {
  const [kpis, setKpis] = useState<FleetKPIs | null>(null);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [kpiRes, machRes, alertRes] = await Promise.all([
        api.getFleetSummary(),
        api.getMachines(),
        api.getAlerts({ status_filter: 'New' }),
      ]);
      setKpis(kpiRes.data);
      setMachines(machRes.data);
      setAlerts(alertRes.data);
    } catch (err) {
      console.error('Failed to load fleet summary', err);
    } finally {
      setLoading(false);
    }
  };

  // Distribution data for pie chart
  const statusCounts = machines.reduce((acc, m) => {
    acc[m.status] = (acc[m.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = [
    { name: 'Available', value: statusCounts['Available'] || 0, color: '#10b981' },
    { name: 'In Use', value: statusCounts['In Use'] || 0, color: '#3b82f6' },
    { name: 'At Risk', value: statusCounts['At Risk'] || 0, color: '#f59e0b' },
    { name: 'Under Maintenance', value: statusCounts['Under Maintenance'] || 0, color: '#ef4444' },
  ].filter((d) => d.value > 0);

  // Mock weekly availability curve
  const weeklyAvailability = [
    { day: 'Mon', availability: 92.4, risk: 2 },
    { day: 'Tue', availability: 91.8, risk: 3 },
    { day: 'Wed', availability: 94.2, risk: 1 },
    { day: 'Thu', availability: 89.5, risk: 4 },
    { day: 'Fri', availability: 93.1, risk: 2 },
    { day: 'Sat', availability: 95.8, risk: 1 },
    { day: 'Sun', availability: 96.2, risk: 1 },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Banner with Guided Demo CTA */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-slate-900 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-emerald-700/40">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2 border border-emerald-400/30">
            <Tractor className="w-3.5 h-3.5" />
            <span>NexHack 2.0 • Problem Statement 08</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">FarmPulse AI Fleet Operations</h1>
          <p className="text-sm text-emerald-200 mt-1 max-w-2xl">
            Predict developing machine faults, quantify prediction uncertainty, and prioritize maintenance under technician and spare-parts constraints.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <NavLink
            to="/demo"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-all transform hover:-translate-y-0.5"
          >
            <PlayCircle className="w-4 h-4 fill-slate-950 text-emerald-500" />
            <span>Guided 11-Step Demo</span>
          </NavLink>
          <NavLink
            to="/baseline"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-600 transition-all"
          >
            <span>Baseline Comparison</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </NavLink>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {/* Card 1: Total Fleet */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Fleet Readiness</span>
            <Tractor className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">
              {kpis?.fleet_readiness_pct || 79.2}%
            </span>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center">
              +12.4% vs Cal
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {kpis?.available_machines || 19} of {kpis?.total_machines || 24} machines active
          </p>
        </div>

        {/* Card 2: Machines At Risk */}
        <div className="bg-white rounded-xl p-4 border border-amber-200/80 bg-amber-50/20 shadow-sm">
          <div className="flex items-center justify-between text-amber-700 text-xs font-medium">
            <span>Machines At Risk</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-900">
              {kpis?.machines_at_risk || 3}
            </span>
            <span className="text-[11px] text-amber-700 font-medium">Predicted &lt; 120h</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Early fault warnings active</p>
        </div>

        {/* Card 3: Critical Alerts */}
        <div className="bg-white rounded-xl p-4 border border-rose-200/80 bg-rose-50/20 shadow-sm">
          <div className="flex items-center justify-between text-rose-700 text-xs font-medium">
            <span>Critical Alerts</span>
            <ShieldAlert className="w-4 h-4 text-rose-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-rose-900">
              {kpis?.critical_alerts || 1}
            </span>
            <span className="text-[11px] text-rose-600 font-semibold animate-pulse">Action req</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">High probability failures</p>
        </div>

        {/* Card 4: Open Work Orders */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Active Work Orders</span>
            <Wrench className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">
              {kpis?.open_work_orders || 2}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">Scheduled</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {kpis?.technician_utilization_pct || 25}% tech utilization
          </p>
        </div>

        {/* Card 5: Spare Parts Status */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm col-span-2 md:col-span-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Spare Parts Inventory</span>
            <Boxes className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">
              {kpis?.parts_in_stock || 134}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">Units</span>
          </div>
          <p className="text-[11px] text-amber-600 font-semibold mt-1">
            {kpis?.parts_low_stock || 2} parts below threshold
          </p>
        </div>
      </div>

      {/* Main Charts & Telemetry Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Availability Trend Chart (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Fleet Availability & Risk Trend</h2>
              <p className="text-xs text-slate-500">Continuous 7-day operational readiness</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                Fleet Availability %
              </span>
              <span className="flex items-center gap-1.5 text-amber-700 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                Machines At Risk
              </span>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyAvailability} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="availGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                <YAxis domain={[80, 100]} stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="availability"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#availGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fleet Composition Donut (1 Col) */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Fleet Status Allocation</h2>
            <p className="text-xs text-slate-500">24 Fictional Machines Monitored</p>
          </div>
          <div className="h-48 my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {pieData.map((d, i) => (
              <div key={i} className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-50">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-slate-600 truncate">{d.name}:</span>
                <span className="font-bold text-slate-900 ml-auto">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Critical Alerts & Priority Machinery Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Critical Alerts Section */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <h2 className="text-sm font-bold text-slate-900">Active Developing Fault Alerts</h2>
            </div>
            <NavLink to="/predictions" className="text-xs text-emerald-600 font-semibold hover:underline">
              View All Predictions &rarr;
            </NavLink>
          </div>
          <div className="space-y-3">
            {alerts.slice(0, 3).map((a) => (
              <div
                key={a.id}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-emerald-300 transition-all bg-slate-50/50 flex items-start justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={a.alert_level} size="sm" />
                    <span className="font-mono text-xs font-bold text-slate-800">{a.machine_id}</span>
                    <span className="text-xs text-slate-500">• {a.fault_category}</span>
                  </div>
                  <h3 className="text-xs font-semibold text-slate-900 mt-1">{a.title}</h3>
                  <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-1">{a.description}</p>
                </div>
                <NavLink
                  to={`/twin?machine=${a.machine_id}`}
                  className="px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold text-xs whitespace-nowrap transition-all border border-emerald-200"
                >
                  Inspect Twin
                </NavLink>
              </div>
            ))}
          </div>
        </div>

        {/* Machinery Condition Watchlist */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600" />
              <h2 className="text-sm font-bold text-slate-900">Machinery Condition Watchlist</h2>
            </div>
            <NavLink to="/fleet" className="text-xs text-emerald-600 font-semibold hover:underline">
              Full Fleet Roster &rarr;
            </NavLink>
          </div>
          <div className="divide-y divide-slate-100">
            {machines
              .filter((m) => m.health_score < 92.0)
              .slice(0, 4)
              .map((m) => (
                <div key={m.id} className="py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-mono font-bold text-xs text-slate-700">
                      {m.machine_id.split('-')[1]}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 leading-tight">{m.name}</p>
                      <p className="text-[11px] text-slate-500">
                        {m.machine_type} • {m.total_operating_hours} hrs
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-xs font-bold text-slate-900">{m.health_score}%</p>
                      <p className="text-[10px] text-slate-500">Condition Score</p>
                    </div>
                    <StatusBadge status={m.status} size="sm" />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
