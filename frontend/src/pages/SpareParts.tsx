import React, { useEffect, useState } from 'react';
import {
  Boxes,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Package,
  Layers,
  ArrowUpRight,
  RefreshCw,
  Search
} from 'lucide-react';
import { api, SparePart } from '../services/api';

export const SpareParts: React.FC = () => {
  const [parts, setSpareParts] = useState<SparePart[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [reorderingId, setReorderingId] = useState<number | null>(null);

  useEffect(() => {
    fetchParts();
  }, []);

  const fetchParts = async () => {
    try {
      setLoading(true);
      const res = await api.getSpareParts();
      setSpareParts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReorder = async (partId: number) => {
    try {
      setReorderingId(partId);
      await api.reorderSparePart(partId, 5);
      await fetchParts();
    } catch (err) {
      console.error(err);
    } finally {
      setReorderingId(null);
    }
  };

  const categories = ['All', 'Cooling', 'Bearings', 'Hydraulics', 'Lubrication', 'Electrical'];

  const filtered = parts.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.part_number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'All' || p.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Spare Parts Inventory & Warehouse</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Maintenance components, stock reorder thresholds, shelf locations, and supplier lead times.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
            {parts.reduce((acc, p) => acc + p.stock_quantity, 0)} Total Units in Stock
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search part name or part number (e.g. PRT-BRG-8801)..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategoryFilter(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                categoryFilter === c
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((p) => {
          const isLow = p.stock_quantity <= p.minimum_threshold;
          return (
            <div
              key={p.id}
              className={`bg-white rounded-xl p-5 border shadow-sm transition-all flex flex-col justify-between ${
                isLow ? 'border-amber-300 bg-amber-50/20' : 'border-slate-200 hover:border-emerald-300'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      {p.part_number}
                    </span>
                    <h3 className="font-bold text-sm text-slate-900 mt-1.5">{p.name}</h3>
                    <p className="text-[11px] text-slate-500 font-medium">Category: {p.category}</p>
                  </div>
                  {isLow ? (
                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold border border-amber-300 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Low Stock
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      In Stock
                    </span>
                  )}
                </div>

                {/* Stock Level Bar */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-500">Available Quantity:</span>
                    <span className="font-bold font-mono text-slate-900">
                      {p.stock_quantity} units (min: {p.minimum_threshold})
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        isLow ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, (p.stock_quantity / 20) * 100)}%` }}
                    />
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <div>
                    <span className="text-slate-400 block">Unit Cost:</span>
                    <span className="font-bold text-slate-800 font-mono">${p.unit_cost}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Lead Time:</span>
                    <span className="font-semibold text-slate-800">{p.lead_time_days} days</span>
                  </div>
                  <div className="col-span-2 text-slate-500">
                    📍 {p.shelf_location} • {p.compatible_machine_types}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => handleReorder(p.id)}
                  disabled={reorderingId === p.id}
                  className="w-full py-1.5 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 font-semibold text-xs transition-all border border-slate-200 flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${reorderingId === p.id ? 'animate-spin' : ''}`} />
                  <span>{reorderingId === p.id ? 'Reordering...' : 'Reorder +5 Units'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
