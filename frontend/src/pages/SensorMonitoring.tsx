import React, { useEffect, useState } from 'react';
import {
  Activity,
  Radio,
  AlertOctagon,
  CheckCircle2,
  AlertTriangle,
  Send,
  Zap,
  Sliders,
  RefreshCw,
  Cpu,
  HelpCircle
} from 'lucide-react';
import { api, Machine, SensorReading } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';

export const SensorMonitoring: React.FC = () => {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [selectedMachine, setSelectedMachine] = useState<string>('FP-101');
  const [telemetry, setTelemetry] = useState<SensorReading[]>([]);
  const [loading, setLoading] = useState(true);

  // Injection controls
  const [noiseBurst, setNoiseBurst] = useState(false);
  const [missingData, setMissingData] = useState(false);
  const [channelSelect, setChannelSelect] = useState('vibration');
  const [injectResult, setInjectResult] = useState<any>(null);
  const [injecting, setInjecting] = useState(false);

  useEffect(() => {
    fetchMachines();
  }, []);

  useEffect(() => {
    if (selectedMachine) {
      loadTelemetry(selectedMachine);
    }
  }, [selectedMachine]);

  const fetchMachines = async () => {
    try {
      const res = await api.getMachines();
      setMachines(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadTelemetry = async (id: string) => {
    try {
      setLoading(true);
      const res = await api.getTelemetryHistory(id, 20);
      setTelemetry(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInject = async () => {
    try {
      setInjecting(true);
      const res = await api.injectTelemetry({
        machine_id: selectedMachine,
        is_missing: missingData,
        is_noisy: noiseBurst,
        missing_channel: missingData ? channelSelect : 'None',
      });
      setInjectResult(res.data);
      await loadTelemetry(selectedMachine);
    } catch (err) {
      console.error(err);
    } finally {
      setInjecting(false);
    }
  };

  const latest = telemetry.length > 0 ? telemetry[telemetry.length - 1] : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Sensor Telemetry & Uncertainty Quality</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time observation quality scoring, missing data flags, and noise burst discrimination.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedMachine}
            onChange={(e) => setSelectedMachine(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-800 shadow-sm"
          >
            {machines.map((m) => (
              <option key={m.machine_id} value={m.machine_id}>
                {m.machine_id} - {m.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Distinction Protocol Callout Box (Section 4.D Mandate) */}
      <div className="bg-emerald-950 text-emerald-100 rounded-2xl p-5 border border-emerald-800 shadow-md">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-emerald-800/80 text-emerald-300">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide">
              MANDATORY SPEC: Sensor Noise & Missing Data Discrimination Engine
            </h2>
            <p className="text-xs text-emerald-300/90 mt-1 leading-relaxed">
              FarmPulse AI separates three distinct telemetry phenomena to prevent false maintenance dispatches:
            </p>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-emerald-900/60 border border-emerald-700/50">
                <span className="font-bold text-white block">1. True Mechanical Fault</span>
                <span className="text-emerald-300 text-[11px] mt-0.5 block">
                  Continuous multi-sensor thermal or vibrational drift beyond nominal baseline. Triggers component repair.
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-900/60 border border-emerald-700/50">
                <span className="font-bold text-white block">2. Missing Telemetry Packet</span>
                <span className="text-emerald-300 text-[11px] mt-0.5 block">
                  Sensor dropout imputed via baseline nominals with an observation uncertainty penalty. Never falsely flagged as mechanical failure!
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-900/60 border border-emerald-700/50">
                <span className="font-bold text-white block">3. Transducer Noise Burst</span>
                <span className="text-emerald-300 text-[11px] mt-0.5 block">
                  Transient unphysical spikes. Flagged as wiring/EMI telemetry degradation rather than machine breakdown.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quality Score Breakdown & Injector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Telemetry Inspection Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Observation Telemetry History (Last 20 Readings)</h3>
              <p className="text-xs text-slate-500">Includes sensor dropout flags and noise indicators</p>
            </div>
            <button
              onClick={() => loadTelemetry(selectedMachine)}
              className="p-1.5 text-slate-500 hover:text-emerald-600 rounded-lg border border-slate-200"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-y border-slate-200 text-slate-600 font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Hour</th>
                  <th className="py-2.5 px-3">Engine Temp</th>
                  <th className="py-2.5 px-3">Vibration</th>
                  <th className="py-2.5 px-3">Oil Pressure</th>
                  <th className="py-2.5 px-3">Quality Score</th>
                  <th className="py-2.5 px-3">Anomaly Tag</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {telemetry.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/70">
                    <td className="py-2 px-3 text-slate-500">h{r.hour_index}</td>
                    <td className="py-2 px-3">
                      {r.engine_temp !== null ? (
                        <span className={r.engine_temp > 102 ? 'text-rose-600 font-bold' : 'text-slate-800'}>
                          {r.engine_temp}°C
                        </span>
                      ) : (
                        <span className="text-amber-600 font-bold bg-amber-50 px-1.5 py-0.5 rounded">
                          MISSING
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-3">
                      {r.vibration !== null ? (
                        <span className={r.vibration > 4.0 ? 'text-rose-600 font-bold' : 'text-slate-800'}>
                          {r.vibration} mm/s
                        </span>
                      ) : (
                        <span className="text-amber-600 font-bold bg-amber-50 px-1.5 py-0.5 rounded">
                          MISSING
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-3">
                      {r.oil_pressure !== null ? (
                        <span className={r.oil_pressure < 2.5 ? 'text-rose-600 font-bold' : 'text-slate-800'}>
                          {r.oil_pressure} bar
                        </span>
                      ) : (
                        <span className="text-amber-600 font-bold bg-amber-50 px-1.5 py-0.5 rounded">
                          MISSING
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-3 font-bold">
                      <span
                        className={
                          r.quality_score > 0.85
                            ? 'text-emerald-600'
                            : r.quality_score > 0.65
                            ? 'text-amber-600'
                            : 'text-rose-600'
                        }
                      >
                        {Math.round(r.quality_score * 100)}%
                      </span>
                    </td>
                    <td className="py-2 px-3 font-sans">
                      {r.is_noisy ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                          Noise Burst
                        </span>
                      ) : r.is_missing ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-300">
                          Channel Dropout
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Nominal</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Col: Testing Lab */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-600" />
            <span>Interactive Telemetry Stress Testing</span>
          </h3>
          <p className="text-xs text-slate-500">
            Simulate noisy electrical artifacts or missing channels to verify that FarmPulse AI does not trigger false mechanical breakdown alerts.
          </p>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
              <div>
                <span className="font-semibold text-slate-900 block">Inject Noise Burst</span>
                <span className="text-[11px] text-slate-500">Simulate unphysical transient voltage spike</span>
              </div>
              <input
                type="checkbox"
                checked={noiseBurst}
                onChange={(e) => setNoiseBurst(e.target.checked)}
                className="w-4 h-4 accent-emerald-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
              <div>
                <span className="font-semibold text-slate-900 block">Simulate Sensor Dropout</span>
                <span className="text-[11px] text-slate-500">Omit reading to test imputation</span>
              </div>
              <input
                type="checkbox"
                checked={missingData}
                onChange={(e) => setMissingData(e.target.checked)}
                className="w-4 h-4 accent-emerald-600 rounded"
              />
            </label>

            {missingData && (
              <select
                value={channelSelect}
                onChange={(e) => setChannelSelect(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-semibold"
              >
                <option value="vibration">Dropout: Vibration Transducer</option>
                <option value="engine_temp">Dropout: Engine Temperature Sensor</option>
                <option value="oil_pressure">Dropout: Oil Pressure Sensor</option>
              </select>
            )}

            <button
              onClick={handleInject}
              disabled={injecting}
              className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{injecting ? 'Injecting Telemetry...' : 'Inject & Validate AI Handling'}</span>
            </button>
          </div>

          {injectResult && (
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2 mt-4 animate-fadeIn">
              <div className="flex items-center justify-between font-bold">
                <span>Resulting Observation Quality:</span>
                <span className="text-emerald-700">
                  {Math.round(injectResult.prediction.observation_quality * 100)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Sensor Anomaly Tagged:</span>
                <span className="font-semibold text-slate-800">
                  {injectResult.prediction.is_sensor_anomaly ? 'TRUE (Wiring/Noise)' : 'FALSE (True Mechanical)'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Adjusted Failure Risk:</span>
                <span className="font-bold text-slate-900">
                  {Math.round(injectResult.prediction.failure_risk * 100)}%
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-600">
                <strong>Diagnosis:</strong> {injectResult.prediction.recommended_action}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
