import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Sliders,
  Shield,
  Database,
  Cpu,
  RefreshCw,
  CheckCircle2,
  Bell
} from 'lucide-react';

export const Settings: React.FC = () => {
  const [criticalThreshold, setCriticalThreshold] = useState(0.75);
  const [warningThreshold, setWarningThreshold] = useState(0.45);
  const [simSpeed, setSimSpeed] = useState('Real-Time (1x)');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">System & Simulation Settings</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure AI decision thresholds, telemetry stream sampling rates, and digital twin simulation parameters.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>System configuration successfully updated!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Card 1: Alert Thresholds */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Bell className="w-4 h-4 text-emerald-600" />
            <h2 className="text-sm font-bold text-slate-900">Predictive AI Alert Trigger Thresholds</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <div className="flex justify-between text-slate-700 mb-1">
                <span>Critical Failure Alert Threshold:</span>
                <span className="font-bold font-mono text-rose-600">{Math.round(criticalThreshold * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.50"
                max="0.95"
                step="0.05"
                value={criticalThreshold}
                onChange={(e) => setCriticalThreshold(parseFloat(e.target.value))}
                className="w-full accent-emerald-600"
              />
              <p className="text-[11px] text-slate-400 mt-1">Triggers immediate high-priority dispatch order.</p>
            </div>

            <div>
              <div className="flex justify-between text-slate-700 mb-1">
                <span>Warning / Developing Fault Threshold:</span>
                <span className="font-bold font-mono text-amber-600">{Math.round(warningThreshold * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.25"
                max="0.65"
                step="0.05"
                value={warningThreshold}
                onChange={(e) => setWarningThreshold(parseFloat(e.target.value))}
                className="w-full accent-emerald-600"
              />
              <p className="text-[11px] text-slate-400 mt-1">Triggers monitoring flag on condition twin watchlist.</p>
            </div>
          </div>
        </div>

        {/* Card 2: Model & Database Specs */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Cpu className="w-4 h-4 text-emerald-600" />
            <h2 className="text-sm font-bold text-slate-900">Machine Learning & Architecture Specs</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-400">ML Model Version:</span>
              <p className="font-bold text-slate-900 mt-0.5">RF-Fleet-v2.1 (Random Forest 100 Estimators)</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-400">Data Leakage Prevention:</span>
              <p className="font-bold text-emerald-700 mt-0.5">GroupKFold (Zero Machine Leakage)</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-400">Database Engine:</span>
              <p className="font-bold text-slate-900 mt-0.5">SQLite Persistent ORM (12 Normalized Tables)</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-400">Synthetic Fleet Horizon:</span>
              <p className="font-bold text-slate-900 mt-0.5">720 Hours (30 Days @ 24 Machines)</p>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all"
          >
            Save Configuration Changes
          </button>
        </div>
      </form>
    </div>
  );
};
