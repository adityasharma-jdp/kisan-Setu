import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Tractor, 
  Activity, 
  CheckCircle, 
  AlertTriangle, 
  Wrench, 
  ArrowRight,
  Gauge,
  Thermometer,
  Zap,
  ShieldCheck
} from 'lucide-react';
import { Language, translations } from '../../data/translations';

interface MachineryShowcaseProps {
  currentLang: Language;
  onSelectMachineForService?: (machineName: string) => void;
}

const SAMPLE_INDIAN_MACHINERY = [
  {
    id: "FP-IND-101",
    name: "Mahindra Yuvo Tech+ 585",
    type: "Heavy-Duty Tractor (4WD)",
    power: "49.3 HP",
    state: "Punjab (Ludhiana)",
    health: 94,
    status: "Healthy",
    engineTemp: "82°C",
    vibration: "2.8 mm/s",
    hours: "1,240 hrs",
    image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "FP-IND-102",
    name: "Swaraj 855 FE Smart Twin",
    type: "Standard Farm Tractor",
    power: "52 HP",
    state: "Haryana (Karnal)",
    health: 88,
    status: "Healthy",
    engineTemp: "85°C",
    vibration: "3.4 mm/s",
    hours: "2,180 hrs",
    image: "https://images.unsplash.com/photo-1530267981375-f0de937f5f13?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "FP-IND-103",
    name: "Preet 987 Multi-Crop Harvester",
    type: "Combine Harvester",
    power: "101 HP",
    state: "Madhya Pradesh (Indore)",
    health: 64,
    status: "Degraded Bearing Wear",
    engineTemp: "98°C",
    vibration: "7.6 mm/s",
    hours: "3,410 hrs",
    image: "https://images.unsplash.com/photo-1595246140625-573b715d11dc?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "FP-IND-104",
    name: "Sonalika Tiger DI 65 CRDS",
    type: "Heavy-Duty Tractor (4WD)",
    power: "65 HP",
    state: "Uttar Pradesh (Meerut)",
    health: 91,
    status: "Healthy",
    engineTemp: "84°C",
    vibration: "3.1 mm/s",
    hours: "980 hrs",
    image: "https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "FP-IND-105",
    name: "Shaktiman Semi-Champion Rotavator",
    type: "Rotavator (Rotary Tiller)",
    power: "Multi-Speed Gear",
    state: "Maharashtra (Nashik)",
    health: 72,
    status: "Blade & Gear Wear",
    engineTemp: "Ambient",
    vibration: "5.8 mm/s",
    hours: "640 hrs",
    image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "FP-IND-106",
    name: "John Deere 5310 GearPro",
    type: "Heavy-Duty Tractor (4WD)",
    power: "55 HP",
    state: "Rajasthan (Sri Ganganagar)",
    health: 96,
    status: "Healthy",
    engineTemp: "79°C",
    vibration: "2.4 mm/s",
    hours: "1,450 hrs",
    image: "https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?auto=format&fit=crop&w=800&q=80",
  }
];

export const MachineryShowcase: React.FC<MachineryShowcaseProps> = ({ 
  currentLang,
  onSelectMachineForService 
}) => {
  const t = translations[currentLang];
  const [filter, setFilter] = useState<'All' | 'Healthy' | 'At Risk'>('All');

  const filteredMachines = SAMPLE_INDIAN_MACHINERY.filter(m => {
    if (filter === 'Healthy') return m.health >= 85;
    if (filter === 'At Risk') return m.health < 85;
    return true;
  });

  return (
    <section id="machinery" className="py-24 bg-kisan-light relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Header & Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-100 text-kisan-primary font-bold text-xs tracking-wider uppercase mb-3 border border-emerald-300/40">
              {t.machinerySection.badge}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-slate-800 tracking-tight">
              {t.machinerySection.title}
            </h2>
            <p className="text-slate-600 max-w-2xl mt-3 text-base">
              {t.machinerySection.subtitle}
            </p>
          </div>

          {/* Quick Filter Buttons */}
          <div className="mt-6 md:mt-0 flex items-center gap-2 bg-white p-1.5 rounded-full border border-slate-200 shadow-sm">
            <button
              onClick={() => setFilter('All')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                filter === 'All' ? 'bg-kisan-primary text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {currentLang === 'hi' ? 'सभी उपकरण' : 'All Machinery'}
            </button>
            <button
              onClick={() => setFilter('Healthy')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                filter === 'Healthy' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {currentLang === 'hi' ? 'सुरक्षित (90%+)' : 'Healthy (90%+)'}
            </button>
            <button
              onClick={() => setFilter('At Risk')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                filter === 'At Risk' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {currentLang === 'hi' ? 'सक्रिय चेतावनी' : 'Action Needed'}
            </button>
          </div>
        </div>

        {/* Machinery Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMachines.map((machine) => {
            const isHealthy = machine.health >= 85;

            return (
              <div 
                key={machine.id}
                className="rounded-3xl bg-white border border-slate-200/90 shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {/* Card Image Banner */}
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    <img 
                      src={machine.image} 
                      alt={machine.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    
                    {/* Machine ID Badge */}
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-bold text-white bg-black/60 backdrop-blur-md">
                      {machine.id}
                    </span>

                    {/* Condition Status Badge */}
                    <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 backdrop-blur-md ${
                      isHealthy 
                        ? 'bg-emerald-500/90 text-white' 
                        : 'bg-amber-500/95 text-white animate-pulse'
                    }`}>
                      {isHealthy ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                      <span>{machine.health}% Score</span>
                    </span>

                    {/* Machine Name & Type on Image */}
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h3 className="text-lg font-bold truncate font-serif">{machine.name}</h3>
                      <p className="text-xs text-emerald-200 font-medium">{machine.type} • {machine.power}</p>
                    </div>
                  </div>

                  {/* Card Body & Telemetry Gauges */}
                  <div className="p-6">
                    <div className="text-xs font-medium text-slate-500 mb-4 flex items-center justify-between">
                      <span>📍 {machine.state}</span>
                      <span className="font-semibold text-slate-700">⏱️ {machine.hours}</span>
                    </div>

                    {/* Micro Live Metrics */}
                    <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 mb-6">
                      <div className="flex items-center gap-2">
                        <Thermometer className="w-4 h-4 text-rose-500" />
                        <div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase">Engine Temp</div>
                          <div className="text-xs font-bold text-slate-800">{machine.engineTemp}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-emerald-600" />
                        <div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase">Vibration</div>
                          <div className="text-xs font-bold text-slate-800">{machine.vibration}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="px-6 pb-6 pt-0 flex items-center gap-3">
                  <Link
                    to="/twin"
                    className="flex-1 py-2.5 px-3 rounded-xl border border-slate-300 hover:border-kisan-primary text-slate-700 hover:text-kisan-primary text-xs font-bold text-center transition-all bg-white hover:bg-slate-50 shadow-sm"
                  >
                    {t.machinerySection.viewTwinBtn}
                  </Link>

                  <button
                    onClick={() => onSelectMachineForService && onSelectMachineForService(machine.name)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-kisan-primary hover:bg-emerald-900 text-white text-xs font-bold text-center transition-all shadow-md flex items-center justify-center gap-1.5"
                  >
                    <Wrench className="w-3.5 h-3.5 text-kisan-fresh" />
                    <span>{t.machinerySection.bookServiceBtn}</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
