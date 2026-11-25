import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Tractor,
  Cpu,
  BrainCircuit,
  Activity,
  CalendarClock,
  ClipboardList,
  Users,
  Boxes,
  BarChart3,
  GitCompare,
  PlayCircle,
  FileSpreadsheet,
  Settings,
  ShieldCheck,
  ChevronRight,
  HeartPulse,
  Sparkles,
  Globe
} from 'lucide-react';

interface SidebarProps {
  criticalAlertCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ criticalAlertCount = 0 }) => {
  const navSections = [
    {
      title: 'Public & Farmer Portal',
      links: [
        { to: '/', label: 'Agrovia Landing Page', icon: Globe, isPublic: true },
        { to: '/farmer-portal', label: 'Farmer Health Passport', icon: HeartPulse, highlight: true },
      ]
    },
    {
      title: 'Operations',
      links: [
        { to: '/dashboard', label: 'Overview Dashboard', icon: LayoutDashboard },
        { to: '/fleet', label: 'Fleet Management', icon: Tractor },
        { to: '/twin', label: 'Digital Twin', icon: Cpu },
      ]
    },
    {
      title: 'Predictive Intelligence',
      links: [
        { to: '/predictions', label: 'AI Predictions', icon: BrainCircuit },
        { to: '/sensors', label: 'Sensor Monitoring', icon: Activity },
        { to: '/planning', label: 'Maintenance Planning', icon: CalendarClock },
      ]
    },
    {
      title: 'Maintenance Logistics',
      links: [
        { to: '/work-orders', label: 'Work Orders', icon: ClipboardList },
        { to: '/technicians', label: 'Technicians', icon: Users },
        { to: '/spare-parts', label: 'Spare Parts', icon: Boxes },
      ]
    },
    {
      title: 'Strategy & Analysis',
      links: [
        { to: '/analytics', label: 'Analytics', icon: BarChart3 },
        { to: '/baseline', label: 'Baseline Comparison', icon: GitCompare },
        { to: '/demo', label: 'Demo Simulation', icon: PlayCircle, highlight: true },
        { to: '/reports', label: 'Reports', icon: FileSpreadsheet },
        { to: '/settings', label: 'Settings', icon: Settings },
      ]
    }
  ];

  return (
    <aside className="w-64 bg-kisan-darkest border-r border-emerald-950/60 text-slate-300 flex flex-col h-screen fixed left-0 top-0 z-30 select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center gap-3 px-5 border-b border-emerald-900/40 bg-kisan-dark/50">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-kisan-primary to-kisan-fresh flex items-center justify-center shadow-lg shadow-kisan-fresh/20 ring-1 ring-white/20">
          <Tractor className="w-5 h-5 text-kisan-dark stroke-[2.5]" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-base text-white tracking-tight font-serif">KisanSetu</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-semibold bg-kisan-fresh/20 text-kisan-fresh border border-kisan-fresh/30">AgriTech</span>
          </div>
          <p className="text-[10px] text-emerald-300/80 font-medium tracking-wider uppercase">Predictive Twin v2.0</p>
        </div>
      </div>

      {/* Nav Link Groups */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navSections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              {section.title}
            </p>
            {section.links.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/' || link.to === '/dashboard'}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all group ${
                      isActive
                        ? 'bg-kisan-primary text-white shadow-md shadow-emerald-950/40'
                        : link.highlight
                        ? 'text-kisan-fresh hover:bg-emerald-950/40 hover:text-lime-300'
                        : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                    <span>{link.label}</span>
                  </div>
                  {link.highlight && (
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono font-semibold border border-emerald-500/30 animate-pulse">
                      GUIDED
                    </span>
                  )}
                  {link.to === '/predictions' && criticalAlertCount > 0 && (
                    <span className="w-5 h-5 flex items-center justify-center rounded-full bg-rose-500 text-white text-[11px] font-bold shadow-sm">
                      {criticalAlertCount}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}
      </div>

      {/* Sidebar Footer status */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/30">
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50">
          <div className="relative">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="w-2 h-2 rounded-full bg-emerald-400 absolute -top-0.5 -right-0.5 animate-pulse" />
          </div>
          <div className="text-xs">
            <p className="font-semibold text-slate-200">Twin Simulation Engine</p>
            <p className="text-[10px] text-emerald-400">Zero Leakage • Active</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
