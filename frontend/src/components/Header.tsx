import React from 'react';
import { Bell, Search, ShieldAlert, Cpu, Sparkles, RefreshCw } from 'lucide-react';
import { NavLink } from 'react-router-dom';

interface HeaderProps {
  criticalAlertCount: number;
  onRefresh?: () => void;
  isLoading?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  criticalAlertCount,
  onRefresh,
  isLoading = false
}) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20 shadow-sm/50">
      {/* Search / Breadcrumb */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search machinery, faults, work orders (e.g. FP-101)..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-800 placeholder-slate-400"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Navigation Quick Switches */}
        <NavLink
          to="/"
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all"
        >
          <span>🌾 Public Portal</span>
        </NavLink>

        <NavLink
          to="/farmer-portal"
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-kisan-primary text-xs font-semibold border border-emerald-200 transition-all"
        >
          <span>🚜 Farmer Passport</span>
        </NavLink>

        {/* Quick Refresh */}
        {onRefresh && (
          <button
            onClick={onRefresh}
            title="Refresh Fleet Telemetry"
            className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg border border-slate-200 transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-emerald-600' : ''}`} />
          </button>
        )}

        {/* Live Simulation Indicator */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Fleet AI: Synchronized</span>
        </div>

        {/* Alert Pill */}
        <NavLink
          to="/predictions"
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
            criticalAlertCount > 0
              ? 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100 animate-alert-pulse'
              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>{criticalAlertCount} Critical Alerts</span>
        </NavLink>

        {/* User Avatar */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs ring-2 ring-emerald-500/20">
            MM
          </div>
          <div className="hidden md:block text-left text-xs">
            <p className="font-semibold text-slate-800 leading-tight">Fleet Dispatcher</p>
            <p className="text-[10px] text-slate-500">NexHack Operational Unit</p>
          </div>
        </div>
      </div>
    </header>
  );
};
