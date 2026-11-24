import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  Calendar,
  CheckCircle2,
  FileText,
  Clock,
  HardDrive
} from 'lucide-react';
import { api } from '../services/api';

export const Reports: React.FC = () => {
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownload = (type: string) => {
    setDownloading(type);
    const url = api.getExportUrl(type);
    window.open(url, '_blank');
    setTimeout(() => setDownloading(null), 1500);
  };

  const reportsList = [
    {
      id: 'fleet_health',
      title: 'Fleet Health & Machinery Telemetry Ledger',
      description: 'Comprehensive roster of all 24 machinery twins, operating hours, health scores, and sector locations.',
      records: '24 machines',
      format: 'CSV (Comma Separated Values)',
    },
    {
      id: 'work_orders',
      title: 'Historical Work Orders & Maintenance Logs',
      description: 'Complete record of preventive, condition-based, and emergency maintenance interventions with technician hours and parts costs.',
      records: 'All Work Orders',
      format: 'CSV (Comma Separated Values)',
    },
    {
      id: 'inventory',
      title: 'Spare Parts Inventory & Replenishment Audit',
      description: 'Stock levels, supplier lead times, minimum safe reorder thresholds, and warehouse shelf locations.',
      records: '12 Component Categories',
      format: 'CSV (Comma Separated Values)',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Compliance Reports & Data Export</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Generate structured CSV audit reports for operational reviews and agricultural fleet records.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reportsList.map((r) => (
          <div
            key={r.id}
            className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 hover:border-emerald-300 transition-all"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <h2 className="text-sm font-bold text-slate-900">{r.title}</h2>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{r.description}</p>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
                <p>Scope: <strong className="text-slate-800">{r.records}</strong></p>
                <p>Format: <strong className="text-slate-800">{r.format}</strong></p>
              </div>
            </div>

            <button
              onClick={() => handleDownload(r.id)}
              disabled={downloading === r.id}
              className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{downloading === r.id ? 'Exporting CSV...' : 'Download CSV Export'}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
