import React, { useEffect, useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Clock,
  Wrench,
  AlertOctagon,
  PieChart as PieIcon,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { api, Machine, WorkOrder } from '../services/api';

export const Analytics: React.FC = () => {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const [mRes, wRes] = await Promise.all([
        api.getMachines(),
        api.getWorkOrders(),
      ]);
      setMachines(mRes.data);
      setWorkOrders(wRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fault distribution data
  const faultDistribution = [
    { name: 'Cooling Degradation', count: 6, color: '#f43f5e' },
    { name: 'Bearing Mechanical Wear', count: 5, color: '#f59e0b' },
    { name: 'Hydraulic Cavitation', count: 3, color: '#3b82f6' },
    { name: 'Lube Pressure Loss', count: 2, color: '#8b5cf6' },
    { name: 'Sensor Telemetry Artifact', count: 2, color: '#10b981' },
  ];

  // Machine hours by machine type
  const hoursByType = [
    { type: 'Heavy Tractor', avg_hours: 2150, risk_score: 32 },
    { type: 'Harvester', avg_hours: 2480, risk_score: 45 },
    { type: 'Planter', avg_hours: 890, risk_score: 12 },
    { type: 'Sprayer', avg_hours: 1450, risk_score: 28 },
    { type: 'Forage Cut', avg_hours: 2750, risk_score: 52 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Fleet Maintenance Analytics</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Longitudinal failure frequencies, downtime trends, and asset reliability metrics.
        </p>
      </div>

      {/* Analytics KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <span className="text-slate-500 text-xs font-medium">Mean Time to Repair (MTTR)</span>
          <p className="text-2xl font-bold text-emerald-700 mt-1 font-mono">2.9 hrs</p>
          <p className="text-[11px] text-slate-500 mt-1">vs 6.8h in reactive strategy</p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <span className="text-slate-500 text-xs font-medium">Mean Time Between Failures</span>
          <p className="text-2xl font-bold text-slate-900 mt-1 font-mono">342 hrs</p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">+48% asset longevity</p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <span className="text-slate-500 text-xs font-medium">Condition Health Index</span>
          <p className="text-2xl font-bold text-emerald-700 mt-1 font-mono">91.4%</p>
          <p className="text-[11px] text-slate-500 mt-1">Weighted fleet average</p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <span className="text-slate-500 text-xs font-medium">Prevented Unplanned Stops</span>
          <p className="text-2xl font-bold text-emerald-700 mt-1 font-mono">8 units</p>
          <p className="text-[11px] text-slate-500 mt-1">In 30-day evaluation</p>
        </div>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fault Mode Breakdown Bar Chart */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 mb-1">Failure Mode Prevalence & Detection Count</h2>
          <p className="text-xs text-slate-500 mb-4">Historical distribution across fleet operational cycles</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={faultDistribution} layout="vertical" margin={{ top: 10, right: 20, left: 40, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" stroke="#94a3b8" fontSize={11} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={10} width={130} />
                <Tooltip />
                <Bar dataKey="count" fill="#059669" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Operating Hours & Degradation Risk by Machinery Type */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 mb-1">Machinery Wear Risk vs Cumulative Operating Hours</h2>
          <p className="text-xs text-slate-500 mb-4">Higher operating cycles correlate with thermal & bearing strain</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hoursByType} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="type" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip />
                <Bar dataKey="avg_hours" fill="#047857" name="Avg Hours" radius={[4, 4, 0, 0]} />
                <Bar dataKey="risk_score" fill="#f59e0b" name="Wear Risk Score" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
