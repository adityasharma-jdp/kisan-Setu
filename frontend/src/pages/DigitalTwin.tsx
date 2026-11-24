import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Cpu,
  Thermometer,
  Activity,
  Gauge,
  Droplets,
  Zap,
  Play,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  Send,
  Radio
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { api, Machine, SensorReading, Prediction } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';

export const DigitalTwin: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedMachineId = searchParams.get('machine') || 'FP-101';

  const [machines, setMachines] = useState<Machine[]>([]);
  const [twinData, setTwinData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Injection / Simulation state
  const [tempInput, setTempInput] = useState<number>(105.0);
  const [vibInput, setVibInput] = useState<number>(4.2);
  const [isMissingToggle, setIsMissingToggle] = useState<boolean>(false);
  const [isNoisyToggle, setIsNoisyToggle] = useState<boolean>(false);
  const [missingChannel, setMissingChannel] = useState<string>('vibration');
  const [injecting, setInjecting] = useState<boolean>(false);

  useEffect(() => {
    fetchMachines();
  }, []);

  useEffect(() => {
    if (selectedMachineId) {
      fetchTwin(selectedMachineId);
    }
  }, [selectedMachineId]);

  const fetchMachines = async () => {
    try {
      const res = await api.getMachines();
      setMachines(res.data);
    } catch (err) {
      console.error('Failed to load machinery roster', err);
    }
  };

  const fetchTwin = async (id: string) => {
    try {
      setLoading(true);
      const res = await api.getMachineDigitalTwin(id);
      setTwinData(res.data);
      if (res.data.latest_telemetry) {
        setTempInput(res.data.latest_telemetry.engine_temp || 90.0);
        setVibInput(res.data.latest_telemetry.vibration || 2.0);
      }
    } catch (err) {
      console.error('Failed to load twin', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInjectTelemetry = async () => {
    try {
      setInjecting(true);
      await api.injectTelemetry({
        machine_id: selectedMachineId,
        engine_temp: isMissingToggle && missingChannel === 'engine_temp' ? null : tempInput,
        vibration: isMissingToggle && missingChannel === 'vibration' ? null : vibInput,
        rpm: 2100.0,
        oil_pressure: 3.8,
        hydraulic_pressure: 202.0,
        is_missing: isMissingToggle,
        is_noisy: isNoisyToggle,
        missing_channel: isMissingToggle ? missingChannel : 'None',
      });
      // Refresh twin state
      await fetchTwin(selectedMachineId);
    } catch (err) {
      console.error('Injection failed', err);
    } finally {
      setInjecting(false);
    }
  };

  const machine: Machine | undefined = twinData?.machine;
  const latest: SensorReading | undefined = twinData?.latest_telemetry;
  const pred: Prediction | undefined = twinData?.latest_prediction;
  const stream: SensorReading[] = twinData?.telemetry_stream || [];

  return (
    <div className="space-y-6">
      {/* Top Selector & Twin Status Banner */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {machine?.machine_id || selectedMachineId}
              </span>
              <StatusBadge status={machine?.status || 'Available'} size="sm" />
              <span className="text-xs text-slate-500">• {machine?.machine_type}</span>
            </div>
            <h1 className="text-lg font-bold text-slate-900 mt-1">
              {machine?.name || 'Machinery Digital Twin'}
            </h1>
          </div>
        </div>

        {/* Machinery Selector */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-slate-500">Active Twin:</span>
          <select
            value={selectedMachineId}
            onChange={(e) => setSearchParams({ machine: e.target.value })}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-emerald-500"
          >
            {machines.map((m) => (
              <option key={m.machine_id} value={m.machine_id}>
                {m.machine_id} - {m.name} ({m.status})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Digital Twin Cockpit */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Live Sensor Gauges (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Real-time Telemetry Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {/* Temp Gauge */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span>Engine Temperature</span>
                <Thermometer className="w-4 h-4 text-rose-500" />
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-2xl font-bold text-slate-900">
                  {latest?.engine_temp !== null && latest?.engine_temp !== undefined
                    ? `${latest.engine_temp}°C`
                    : 'MISSING'}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">nom: 88°C</span>
              </div>
              <div className="mt-2 w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    (latest?.engine_temp || 0) > 102
                      ? 'bg-rose-500'
                      : (latest?.engine_temp || 0) > 94
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, ((latest?.engine_temp || 80) / 120) * 100)}%` }}
                />
              </div>
            </div>

            {/* Vibration Gauge */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span>Vibration (RMS)</span>
                <Activity className="w-4 h-4 text-amber-500" />
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-2xl font-bold text-slate-900">
                  {latest?.vibration !== null && latest?.vibration !== undefined
                    ? `${latest.vibration}`
                    : 'MISSING'}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">mm/s</span>
              </div>
              <div className="mt-2 w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    (latest?.vibration || 0) > 4.0
                      ? 'bg-rose-500'
                      : (latest?.vibration || 0) > 2.8
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, ((latest?.vibration || 1.5) / 6.0) * 100)}%` }}
                />
              </div>
            </div>

            {/* Oil Pressure */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span>Lube Oil Pressure</span>
                <Droplets className="w-4 h-4 text-blue-500" />
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-2xl font-bold text-slate-900">
                  {latest?.oil_pressure !== null && latest?.oil_pressure !== undefined
                    ? `${latest.oil_pressure}`
                    : 'MISSING'}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">bar</span>
              </div>
              <div className="mt-2 w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    (latest?.oil_pressure || 4) < 2.2
                      ? 'bg-rose-500'
                      : (latest?.oil_pressure || 4) < 3.0
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, ((latest?.oil_pressure || 3) / 5.0) * 100)}%` }}
                />
              </div>
            </div>

            {/* Hydraulic Pressure */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span>Hydraulic Pressure</span>
                <Gauge className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-2xl font-bold text-slate-900">
                  {latest?.hydraulic_pressure ? `${latest.hydraulic_pressure}` : '205.0'}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">bar</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-2">Nominal operating range</p>
            </div>

            {/* Engine RPM */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span>Engine Speed</span>
                <Zap className="w-4 h-4 text-amber-600" />
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-2xl font-bold text-slate-900">
                  {latest?.rpm ? `${latest.rpm}` : '2100'}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">RPM</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-2">Governor regulated</p>
            </div>

            {/* Telemetry Quality Index */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span>Observation Quality</span>
                <Radio className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-2xl font-bold text-slate-900">
                  {latest?.quality_score ? `${Math.round(latest.quality_score * 100)}%` : '100%'}
                </span>
                <span className="text-[11px] text-emerald-600 font-medium">Reliability</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-2">
                {latest?.is_noisy ? '⚠️ Noisy stream' : latest?.is_missing ? '⚠️ Missing channel' : 'Clean telemetry stream'}
              </p>
            </div>
          </div>

          {/* Historical Telemetry Stream Replay Chart */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Multi-Channel Telemetry Stream Replay</h3>
                <p className="text-xs text-slate-500">Synchronized sensor readings over past 30 observation cycles</p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 text-rose-600 font-medium">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  Temp (°C)
                </span>
                <span className="flex items-center gap-1 text-amber-600 font-medium">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Vibration (mm/s)
                </span>
                <span className="flex items-center gap-1 text-blue-600 font-medium">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  Oil (bar)
                </span>
              </div>
            </div>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stream} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="hour_index" stroke="#94a3b8" fontSize={10} tickFormatter={(val) => `h${val}`} />
                  <YAxis stroke="#94a3b8" fontSize={10} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '11px',
                    }}
                  />
                  <Line type="monotone" dataKey="engine_temp" stroke="#f43f5e" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="vibration" stroke="#f59e0b" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="oil_pressure" stroke="#3b82f6" strokeWidth={1.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Col: AI Prediction & Telemetry Injection Lab */}
        <div className="space-y-6">
          {/* AI Condition Twin Card */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-600" />
              <span>Predictive Twin Status</span>
            </h3>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Failure Risk:</span>
                <span
                  className={`font-bold ${
                    (pred?.failure_risk || 0) > 0.70
                      ? 'text-rose-600'
                      : (pred?.failure_risk || 0) > 0.40
                      ? 'text-amber-600'
                      : 'text-emerald-600'
                  }`}
                >
                  {pred ? `${Math.round(pred.failure_risk * 100)}%` : '12%'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Predicted Fault:</span>
                <span className="font-semibold text-slate-800">
                  {pred?.predicted_fault_type?.replace(/_/g, ' ') || 'Healthy Condition'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Remaining Useful Life:</span>
                <span className="font-bold text-slate-900 font-mono">
                  {pred ? `${pred.time_to_failure_hours} hrs` : '420.0 hrs'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Uncertainty Score:</span>
                <span className="font-mono text-slate-700">
                  {pred ? `${Math.round(pred.uncertainty_score * 100)}%` : '18%'}
                </span>
              </div>
            </div>

            <div className="mt-3 p-3 rounded-lg bg-emerald-50/60 border border-emerald-200/60 text-xs">
              <p className="font-semibold text-emerald-900">Recommended Action:</p>
              <p className="text-emerald-800 text-[11px] mt-0.5">
                {pred?.recommended_action || 'Maintain standard scheduled operational interval.'}
              </p>
            </div>
          </div>

          {/* Telemetry Injection Lab (Section 4.D) */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-600" />
                <span>Simulated Observation Injector</span>
              </h3>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono font-bold">
                SEC 4.D
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Inject custom telemetry, simulated transducer noise bursts, or sensor dropouts to evaluate uncertainty handling.
            </p>

            <div className="space-y-3.5 text-xs">
              {/* Temperature Slider */}
              <div>
                <div className="flex justify-between text-slate-600 mb-1">
                  <span>Engine Temp:</span>
                  <span className="font-bold font-mono text-slate-900">{tempInput}°C</span>
                </div>
                <input
                  type="range"
                  min="75"
                  max="125"
                  step="0.5"
                  value={tempInput}
                  onChange={(e) => setTempInput(parseFloat(e.target.value))}
                  className="w-full accent-emerald-600"
                />
              </div>

              {/* Vibration Slider */}
              <div>
                <div className="flex justify-between text-slate-600 mb-1">
                  <span>Vibration (RMS):</span>
                  <span className="font-bold font-mono text-slate-900">{vibInput} mm/s</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="6.0"
                  step="0.1"
                  value={vibInput}
                  onChange={(e) => setVibInput(parseFloat(e.target.value))}
                  className="w-full accent-emerald-600"
                />
              </div>

              {/* Toggles: Noise Burst & Missing Sensor */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <label className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
                  <span className="text-slate-700 font-medium">Inject Transducer Noise Burst</span>
                  <input
                    type="checkbox"
                    checked={isNoisyToggle}
                    onChange={(e) => setIsNoisyToggle(e.target.checked)}
                    className="w-4 h-4 accent-emerald-600 rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
                  <span className="text-slate-700 font-medium">Simulate Missing Sensor Dropout</span>
                  <input
                    type="checkbox"
                    checked={isMissingToggle}
                    onChange={(e) => setIsMissingToggle(e.target.checked)}
                    className="w-4 h-4 accent-emerald-600 rounded"
                  />
                </label>

                {isMissingToggle && (
                  <select
                    value={missingChannel}
                    onChange={(e) => setMissingChannel(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-medium"
                  >
                    <option value="vibration">Missing Channel: Vibration</option>
                    <option value="engine_temp">Missing Channel: Engine Temperature</option>
                    <option value="oil_pressure">Missing Channel: Oil Pressure</option>
                  </select>
                )}
              </div>

              <button
                onClick={handleInjectTelemetry}
                disabled={injecting}
                className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{injecting ? 'Injecting & Re-predicting...' : 'Inject Observation & Evaluate'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
