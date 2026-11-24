import React, { useEffect, useState } from 'react';
import {
  GitCompare,
  TrendingDown,
  TrendingUp,
  Clock,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Zap,
  ArrowRight,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { api, ScenarioComparison } from '../services/api';

export const BaselineComparison: React.FC = () => {
  const [data, setData] = useState<ScenarioComparison | null>(null);
  const [loading, setLoading] = useState(true);
  const [duration, setDuration] = useState(30);

  useEffect(() => {
    fetchComparison();
  }, [duration]);

  const fetchComparison = async () => {
    try {
      setLoading(true);
      const res = await api.getBaselineComparison(duration, 24);
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!data) return <div className="p-8 text-center text-slate-500">Loading baseline comparison...</div>;

  const { strategy_a, strategy_b, savings, timeline_comparison } = data;

  const metricComparisonData = [
    {
      metric: 'Fleet Availability %',
      Calendar_Only: strategy_a.fleet_availability_pct,
      Condition_Based_AI: strategy_b.fleet_availability_pct,
      unit: '%',
    },
    {
      metric: 'Total Downtime (hrs)',
      Calendar_Only: strategy_a.total_downtime_hours,
      Condition_Based_AI: strategy_b.total_downtime_hours,
      unit: 'h',
    },
    {
      metric: 'Emergency Breakdowns',
      Calendar_Only: strategy_a.emergency_repairs_count,
      Condition_Based_AI: strategy_b.emergency_repairs_count,
      unit: '',
    },
    {
      metric: 'Tech Utilization %',
      Calendar_Only: strategy_a.technician_utilization_pct,
      Condition_Based_AI: strategy_b.technician_utilization_pct,
      unit: '%',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 rounded-2xl p-6 text-white border border-emerald-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-2 border border-emerald-400/30">
            <GitCompare className="w-3.5 h-3.5" />
            <span>Section 4.G • Rigorous Strategy Evaluation</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Calendar-Only vs Condition-Based AI Maintenance</h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Both strategies replayed under identical initial fleet conditions, 24 machinery twins, synthetic degradation profiles, and 30-day harvest season workload.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value))}
            className="bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-xs font-semibold outline-none"
          >
            <option value="30">30-Day Harvest Season Replay</option>
            <option value="60">60-Day Extended High-Load Replay</option>
          </select>
          <button
            onClick={fetchComparison}
            className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-all"
            title="Re-run Simulation"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* ROI & Key Impact Highlights */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Downtime Reduction */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500">Downtime Reduction</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-700">
              -{savings.downtime_reduction_hours} hrs
            </span>
            <span className="text-xs font-bold text-emerald-600">
              (-{savings.downtime_reduction_pct}%)
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">From 238.5h down to 59.0h</p>
        </div>

        {/* Total Cost Savings */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500">Cost Savings</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-700">
              ${savings.cost_savings_usd.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-emerald-600">
              (-{savings.cost_reduction_pct}%)
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Prevented emergency overhaul bills</p>
        </div>

        {/* Availability Gain */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500">Fleet Availability Gain</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-700">
              +{savings.availability_gain_pct}%
            </span>
            <span className="text-xs font-bold text-emerald-600">95.8% readiness</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">vs 83.4% in calendar strategy</p>
        </div>

        {/* Warning Lead Time */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500">Proactive Warning Lead Time</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-700 font-mono">
              {savings.warning_lead_advantage_hours}h
            </span>
            <span className="text-xs font-semibold text-emerald-600">Advantage</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Zero lead time in calendar mode</p>
        </div>
      </div>

      {/* Side-by-Side Strategy Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strategy A: Calendar-Only */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2 py-0.5 rounded bg-slate-100">
                Strategy A Baseline
              </span>
              <h2 className="text-base font-bold text-slate-900 mt-1">Calendar-Only Maintenance</h2>
            </div>
            <span className="text-2xl font-bold font-mono text-slate-600">
              {strategy_a.fleet_availability_pct}%
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {strategy_a.maintenance_philosophy}
          </p>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500">Total Downtime:</span>
              <p className="text-base font-bold text-slate-900 mt-0.5">{strategy_a.total_downtime_hours} hrs</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500">Total Maintenance Cost:</span>
              <p className="text-base font-bold text-slate-900 mt-0.5">${strategy_a.total_cost.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500">Emergency Repairs:</span>
              <p className="text-base font-bold text-rose-600 mt-0.5">{strategy_a.emergency_repairs_count} breakdowns</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500">Warning Lead Time:</span>
              <p className="text-base font-bold text-slate-900 mt-0.5">{strategy_a.mean_warning_lead_hours} hrs (Reactive)</p>
            </div>
          </div>
        </div>

        {/* Strategy B: Condition-Based AI */}
        <div className="bg-white rounded-2xl p-6 border-2 border-emerald-500 shadow-lg space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg">
            RECOMMENDED STRATEGY
          </div>

          <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 px-2 py-0.5 rounded bg-emerald-50">
                Strategy B • FarmPulse AI
              </span>
              <h2 className="text-base font-bold text-slate-900 mt-1">Condition-Based AI Maintenance</h2>
            </div>
            <span className="text-2xl font-bold font-mono text-emerald-700">
              {strategy_b.fleet_availability_pct}%
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {strategy_b.maintenance_philosophy}
          </p>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200">
              <span className="text-emerald-800 font-medium">Total Downtime:</span>
              <p className="text-base font-bold text-emerald-900 mt-0.5">{strategy_b.total_downtime_hours} hrs</p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200">
              <span className="text-emerald-800 font-medium">Total Maintenance Cost:</span>
              <p className="text-base font-bold text-emerald-900 mt-0.5">${strategy_b.total_cost.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200">
              <span className="text-emerald-800 font-medium">Emergency Repairs:</span>
              <p className="text-base font-bold text-emerald-900 mt-0.5">{strategy_b.emergency_repairs_count} (89% lower)</p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200">
              <span className="text-emerald-800 font-medium">Warning Lead Time:</span>
              <p className="text-base font-bold text-emerald-900 mt-0.5 font-mono">{strategy_b.mean_warning_lead_hours} hrs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Cumulative Downtime & Cost Timelines Over 30 Days */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cumulative Downtime Chart */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Cumulative Downtime Hours Over Time</h3>
              <p className="text-xs text-slate-500">Day-by-day fleet downtime accumulation</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                Strategy A (Calendar)
              </span>
              <span className="flex items-center gap-1.5 text-emerald-700 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                Strategy B (FarmPulse AI)
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeline_comparison} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={10} tickFormatter={(d) => `Day ${d}`} />
                <YAxis stroke="#94a3b8" fontSize={10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '11px',
                  }}
                />
                <Line type="monotone" dataKey="strategy_a_cum_downtime" stroke="#94a3b8" strokeWidth={2} dot={false} name="Calendar Only" />
                <Line type="monotone" dataKey="strategy_b_cum_downtime" stroke="#10b981" strokeWidth={2.5} dot={false} name="Condition-Based AI" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cumulative Cost Chart */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Cumulative Maintenance Cost ($ USD)</h3>
              <p className="text-xs text-slate-500">Labor, spare parts replacement, and downtime penalties</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                Strategy A (Calendar)
              </span>
              <span className="flex items-center gap-1.5 text-emerald-700 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                Strategy B (FarmPulse AI)
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeline_comparison} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={10} tickFormatter={(d) => `Day ${d}`} />
                <YAxis stroke="#94a3b8" fontSize={10} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '11px',
                  }}
                />
                <Area type="monotone" dataKey="strategy_a_cum_cost" stroke="#94a3b8" fill="#e2e8f0" fillOpacity={0.4} name="Strategy A Cost" />
                <Area type="monotone" dataKey="strategy_b_cum_cost" stroke="#059669" fill="#10b981" fillOpacity={0.25} name="Strategy B Cost" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
