import React, { useEffect, useState } from 'react';
import {
  PlayCircle,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Tractor,
  Activity,
  AlertTriangle,
  BrainCircuit,
  Users,
  Boxes,
  ClipboardList,
  Wrench,
  Cpu,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';

export const DemoSimulation: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [stepData, setStepData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    runStep(1);
  }, []);

  const runStep = async (step: number) => {
    try {
      setLoading(true);
      const res = await api.executeDemoStep(step, 'FP-101');
      setCurrentStep(step);
      setStepData(res.data);
      setHistory((prev) => {
        const filtered = prev.filter((p) => p.step < step);
        return [...filtered, res.data];
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 11) {
      runStep(currentStep + 1);
    }
  };

  const resetDemo = () => {
    setHistory([]);
    runStep(1);
  };

  const stepsList = [
    { num: 1, title: 'Select Tractor', icon: Tractor },
    { num: 2, title: 'Replay Telemetry', icon: Activity },
    { num: 3, title: 'AI Alert Trigger', icon: AlertTriangle },
    { num: 4, title: 'XAI & Uncertainty', icon: BrainCircuit },
    { num: 5, title: 'Acknowledge Alert', icon: CheckCircle2 },
    { num: 6, title: 'Check Technicians', icon: Users },
    { num: 7, title: 'Check Spare Parts', icon: Boxes },
    { num: 8, title: 'Schedule Work Order', icon: ClipboardList },
    { num: 9, title: 'Simulate Maintenance', icon: Wrench },
    { num: 10, title: 'Restore Condition', icon: Cpu },
    { num: 11, title: 'Fleet Readiness Impact', icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-slate-900 rounded-2xl p-6 text-white border border-emerald-700/50 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-2 border border-emerald-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Official Hackathon Evaluation Flow • Section 4.H</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Interactive Guided Intervention Demonstration</h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Follow the complete end-to-end lifecycle of predictive condition-based maintenance: from early sensor drift to explainability, resource dispatch, repair execution, and fleet readiness elevation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={resetDemo}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-600 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>
          {currentStep < 11 ? (
            <button
              onClick={nextStep}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
            >
              <span>Advance to Step {currentStep + 1}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="px-4 py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold">
              ✓ All 11 Steps Successfully Demonstrated
            </div>
          )}
        </div>
      </div>

      {/* 11 Steps Horizontal Stepper Tracker */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm overflow-x-auto">
        <div className="flex items-center justify-between min-w-[900px] gap-2">
          {stepsList.map((s, idx) => {
            const Icon = s.icon;
            const isCompleted = currentStep > s.num;
            const isCurrent = currentStep === s.num;

            return (
              <React.Fragment key={s.num}>
                <button
                  onClick={() => runStep(s.num)}
                  className={`flex flex-col items-center text-center gap-1.5 transition-all group p-1 ${
                    isCurrent ? 'scale-105' : ''
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                      isCompleted
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : isCurrent
                        ? 'bg-emerald-100 text-emerald-800 ring-2 ring-emerald-500 font-bold'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <span
                    className={`text-[10px] font-semibold max-w-[70px] truncate ${
                      isCurrent ? 'text-emerald-800 font-bold' : isCompleted ? 'text-slate-800' : 'text-slate-400'
                    }`}
                  >
                    {s.title}
                  </span>
                </button>
                {idx < stepsList.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 min-w-[20px] transition-all ${
                      currentStep > s.num ? 'bg-emerald-500' : 'bg-slate-200'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Active Step Showcase Card */}
      {stepData && (
        <div className="bg-white rounded-2xl border-2 border-emerald-500 shadow-xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                ACTIVE STEP {stepData.step} OF 11
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-2">{stepData.title}</h2>
              <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
                {stepData.description}
              </p>
            </div>
            <div className="text-right">
              <span className="font-mono text-sm font-bold text-slate-800">{stepData.machine_id}</span>
              <p className="text-xs text-slate-500">{stepData.machine_name}</p>
            </div>
          </div>

          {/* Dynamic Payload Viewer Based on Step */}
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              Step Execution Telemetry & Data State
            </h3>

            {/* Custom UI for each step */}
            {currentStep === 1 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <span className="text-slate-400">Machine Name:</span>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">{stepData.machine_name}</p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <span className="text-slate-400">Operating Hours:</span>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">{stepData.payload.hours} hrs</p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <span className="text-slate-400">Condition Score:</span>
                  <p className="font-bold text-amber-600 text-sm mt-0.5">{stepData.payload.health_score}%</p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <span className="text-slate-400">Operating Status:</span>
                  <div className="mt-1"><StatusBadge status={stepData.payload.status} size="sm" /></div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <span className="text-slate-400">Engine Temp:</span>
                    <p className="font-bold text-rose-600 text-lg font-mono">
                      {stepData.payload.reading.engine_temp}°C (Critical)
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <span className="text-slate-400">Bearing Vibration:</span>
                    <p className="font-bold text-rose-600 text-lg font-mono">
                      {stepData.payload.reading.vibration} mm/s (Severe)
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <span className="text-slate-400">Oil Pressure:</span>
                    <p className="font-bold text-amber-600 text-lg font-mono">
                      {stepData.payload.reading.oil_pressure} bar
                    </p>
                  </div>
                </div>
                <p className="text-slate-600 text-xs">
                  Sensor telemetry streams into digital twin. Degradation curve matches physical cooling radiator core fouling.
                </p>
              </div>
            )}

            {currentStep === 3 && (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-xs text-rose-900 space-y-1">
                <div className="flex items-center gap-2 font-bold text-rose-800">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>ALERT GENERATED: {stepData.payload.title}</span>
                </div>
                <p>{stepData.payload.description}</p>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <span className="text-slate-400">Failure Risk:</span>
                    <p className="text-xl font-bold text-rose-600 font-mono">
                      {Math.round(stepData.payload.failure_risk * 100)}%
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <span className="text-slate-400">RUL Countdown:</span>
                    <p className="text-xl font-bold text-slate-900 font-mono">
                      {stepData.payload.estimated_rul_hours} hrs
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <span className="text-slate-400">Model Confidence:</span>
                    <p className="text-xl font-bold text-emerald-700 font-mono">
                      {Math.round(stepData.payload.confidence_score * 100)}%
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <span className="text-slate-400">Uncertainty:</span>
                    <p className="text-xl font-bold text-slate-700 font-mono">
                      {Math.round(stepData.payload.uncertainty_score * 100)}%
                    </p>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <span className="font-bold text-slate-800 block mb-2">Explainable Contributing Factors:</span>
                  <div className="space-y-1.5">
                    {stepData.payload.top_contributing_factors?.map((f: any, i: number) => (
                      <div key={i} className="flex justify-between items-center text-xs">
                        <span>{f.feature} ({f.value})</span>
                        <span className="font-bold text-rose-600">+{Math.round(f.contribution_score * 100)}% weight</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-900 flex items-center justify-between">
                <div>
                  <p className="font-bold">Alert Successfully Acknowledged</p>
                  <p className="text-emerald-700 mt-0.5">Acknowledged By: {stepData.payload.acknowledged_by}</p>
                </div>
                <span className="font-mono text-[11px] text-emerald-600">{stepData.payload.timestamp}</span>
              </div>
            )}

            {currentStep === 6 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                {stepData.payload.map((t: any) => (
                  <div key={t.id} className="bg-white p-3 rounded-lg border border-slate-200">
                    <p className="font-bold text-slate-900">{t.name}</p>
                    <p className="text-[11px] text-slate-500">{t.specialization}</p>
                    <span className="inline-block mt-2 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                      {t.skill_level}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {currentStep === 7 && (
              <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
                <div>
                  <span className="font-mono text-xs font-bold text-slate-700">{stepData.payload.part_number}</span>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">{stepData.payload.part_name}</p>
                </div>
                <div className="text-right">
                  <span className="text-base font-bold text-emerald-700">{stepData.payload.in_stock} Units Available</span>
                  <p className="text-slate-500">${stepData.payload.unit_cost} Unit Cost</p>
                </div>
              </div>
            )}

            {currentStep === 8 && (
              <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-mono font-bold text-emerald-700 text-sm">{stepData.payload.work_order_number}</span>
                  <StatusBadge status={stepData.payload.status} size="sm" />
                </div>
                <p className="text-slate-700">Assigned Technician: <strong>{stepData.payload.technician}</strong></p>
              </div>
            )}

            {currentStep === 9 && (
              <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                <div className="flex items-center gap-2 text-emerald-700 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Maintenance Successfully Completed</span>
                </div>
                <p className="text-slate-600">
                  Actual Duration: <strong>{stepData.payload.actual_duration_hours} hours</strong> • Replaced: {stepData.payload.parts_installed}
                </p>
              </div>
            )}

            {currentStep === 10 && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-900 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm">Machinery Health Restored:</span>
                  <span className="text-2xl font-bold font-mono text-emerald-700">{stepData.payload.health_score}%</span>
                </div>
                <p className="text-emerald-800">
                  Telemetry re-initialized to factory nominal parameters. Radiator core cooling restored.
                </p>
              </div>
            )}

            {currentStep === 11 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <span className="text-slate-500">Fleet Readiness:</span>
                  <p className="text-2xl font-bold text-emerald-700 mt-1">{stepData.payload.fleet_readiness_pct}%</p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <span className="text-slate-500">Active Fleet:</span>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    {stepData.payload.available_machines} / {stepData.payload.total_machines}
                  </p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <span className="text-slate-500">Prevented Downtime:</span>
                  <p className="text-2xl font-bold text-emerald-700 mt-1">+{stepData.payload.prevented_downtime_hours} hrs</p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <span className="text-slate-500">Cost Avoidance:</span>
                  <p className="text-2xl font-bold text-emerald-700 mt-1">+${stepData.payload.estimated_cost_avoidance_usd}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
