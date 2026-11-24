import React, { useEffect, useState } from 'react';
import {
  Users,
  Award,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
  XCircle,
  ToggleLeft,
  ToggleRight,
  Wrench
} from 'lucide-react';
import { api, Technician } from '../services/api';

export const Technicians: React.FC = () => {
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTechs();
  }, []);

  const fetchTechs = async () => {
    try {
      setLoading(true);
      const res = await api.getTechnicians();
      setTechnicians(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id: number) => {
    try {
      await api.toggleTechnicianAvailability(id);
      await fetchTechs();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Technician Fleet Roster</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Field engineer skills, mechanical certifications, shifts, and real-time dispatch availability.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
            {technicians.filter((t) => t.is_available).length} Available for Dispatch
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {technicians.map((t) => (
          <div
            key={t.id}
            className={`bg-white rounded-xl p-5 border shadow-sm transition-all flex flex-col justify-between ${
              t.is_available
                ? 'border-slate-200 hover:border-emerald-300'
                : 'border-slate-200 bg-slate-50/50'
            }`}
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-800">
                  {t.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <button
                  onClick={() => handleToggle(t.id)}
                  title="Toggle Shift Availability"
                  className="text-xs font-semibold flex items-center gap-1 text-slate-600 hover:text-emerald-700"
                >
                  {t.is_available ? (
                    <span className="text-emerald-600 flex items-center gap-1 font-bold">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Available
                    </span>
                  ) : (
                    <span className="text-slate-400 flex items-center gap-1 font-medium">
                      <span className="w-2 h-2 rounded-full bg-slate-400" />
                      On Job
                    </span>
                  )}
                </button>
              </div>

              {/* Name & Specialization */}
              <div className="mt-3">
                <h3 className="font-bold text-sm text-slate-900">{t.name}</h3>
                <span className="inline-block mt-0.5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {t.skill_level}
                </span>
                <p className="text-xs text-slate-600 mt-2 font-medium">
                  {t.specialization}
                </p>
              </div>

              {/* Contact & Shift Info */}
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-[11px] text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Shift: {t.shift} (${t.hourly_rate}/hr)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{t.phone}</span>
                </div>
                <div className="flex items-center gap-1.5 truncate">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{t.email}</span>
                </div>
              </div>
            </div>

            {/* Toggle footer */}
            <div className="mt-4 pt-3 border-t border-slate-100">
              <button
                onClick={() => handleToggle(t.id)}
                className={`w-full py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  t.is_available
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                {t.is_available ? 'Mark as Dispatched / Busy' : 'Mark as Ready / Available'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
