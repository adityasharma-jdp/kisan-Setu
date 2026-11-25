import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Tractor, 
  HeartPulse, 
  Wrench, 
  Plus, 
  QrCode, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle, 
  ArrowRight, 
  Activity, 
  Clock, 
  Calendar, 
  Share2,
  FileCheck,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Language, translations } from '../data/translations';
import { FarmerBookServiceModal } from '../components/modals/FarmerBookServiceModal';
import { FarmerRegisterModal } from '../components/modals/FarmerRegisterModal';

export const FarmerPortal: React.FC = () => {
  const [lang, setLang] = useState<Language>('en');
  const [bookModalOpen, setBookModalOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState('Mahindra 585 DI PowerPlus');

  // Load farmer session or default to Punjab demo farmer
  const [farmer, setFarmer] = useState({
    name: "Sardar Harpreet Singh",
    phone: "+91 98765 43210",
    state: "Punjab",
    district: "Ludhiana",
    village: "Samrala",
    registeredAt: "12 Oct 2024",
  });

  useEffect(() => {
    const saved = localStorage.getItem('kisan_farmer_session');
    if (saved) {
      try {
        setFarmer(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const t = translations[lang];

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Farmer Welcome Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-kisan-dark via-kisan-primary to-emerald-950 p-6 sm:p-8 text-white shadow-xl border border-white/10 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-kisan-fresh/5 blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-kisan-fresh text-xs font-bold mb-3 border border-white/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'सत्यापित किसान सदस्य' : 'Verified Kisan Member'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif">
              {lang === 'hi' ? `नमस्ते, ${farmer.name}` : `Welcome back, ${farmer.name}`}
            </h1>
            <p className="text-sm text-emerald-200 mt-1">
              📍 {farmer.village ? `${farmer.village}, ` : ''}{farmer.district}, {farmer.state} • 📱 {farmer.phone}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
              className="px-3.5 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white transition-all"
            >
              🌐 {lang === 'en' ? 'हिन्दी' : 'English'}
            </button>

            <button
              onClick={() => setBookModalOpen(true)}
              className="px-5 py-2.5 rounded-full bg-kisan-fresh hover:bg-lime-400 text-kisan-dark text-xs font-bold shadow-lg transition-all flex items-center gap-2 hover:scale-105"
            >
              <Wrench className="w-4 h-4" />
              <span>{lang === 'hi' ? 'सर्विस बुक करें' : 'Book Doorstep Service'}</span>
            </button>

            <button
              onClick={() => setRegisterModalOpen(true)}
              className="px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/30 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>{lang === 'hi' ? 'नया ट्रैक्टर जोड़ें' : 'Add Machinery'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Proactive AI Early Warning Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500 text-white shadow-md">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">
              {lang === 'hi' ? 'एआई पूर्व चेतावनी: बेयरिंग घिसाव का पता चला' : 'AI Preventive Alert: Developing Bearing Wear Detected'}
            </h4>
            <p className="text-xs text-slate-600 mt-0.5">
              {lang === 'hi'
                ? 'आपके महिंद्रा 585 DI में सामान्य से 18% अधिक कंपन देखा गया है। आगामी गेहूं कटाई से पहले निरीक्षण की सलाह दी जाती है।'
                : 'Mahindra 585 DI has exhibited 18% elevated vibration. Proactive inspection recommended before the upcoming harvest window.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setSelectedMachine('Mahindra 585 DI PowerPlus');
            setBookModalOpen(true);
          }}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex-shrink-0 shadow-md transition-all"
        >
          {lang === 'hi' ? 'तुरंत सर्विस शेड्यूल करें' : 'Schedule Service'}
        </button>
      </div>

      {/* Registered Machinery Health Passports */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-800">
              {lang === 'hi' ? 'मेरे पंजीकृत कृषि उपकरण एवं हेल्थ कार्ड' : 'Registered Machinery & Digital Health Passports'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              {lang === 'hi' ? 'लाइव डिजिटल ट्विन टेलीमेट्री और प्रमाणित सर्विस इतिहास' : 'Real-time telemetry, condition scores and certified maintenance stamps.'}
            </p>
          </div>

          <Link
            to="/twin"
            className="text-xs font-bold text-kisan-primary hover:text-emerald-900 flex items-center gap-1"
          >
            <span>{lang === 'hi' ? 'पूर्ण डिजिटल ट्विन देखें' : 'View Twin Dashboard'}</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Machine 1: Primary Tractor */}
          <div className="rounded-3xl bg-white border border-slate-200/90 shadow-md hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-kisan-primary flex items-center justify-center border border-emerald-100">
                    <Tractor className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-800 font-serif">Mahindra 585 DI PowerPlus</h3>
                    <p className="text-xs text-slate-500">Reg: PB-08-AG-9022 • 49.3 HP • Year 2023</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    94% Health
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-1">Twin Synced</span>
                </div>
              </div>

              {/* Passport Diagnostics Grid */}
              <div className="grid grid-cols-3 gap-3 my-5">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Engine Temp</span>
                  <span className="text-sm font-extrabold text-slate-800">82°C</span>
                  <span className="text-[10px] text-emerald-600 font-semibold block">Normal</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Vibration</span>
                  <span className="text-sm font-extrabold text-slate-800">2.8 mm/s</span>
                  <span className="text-[10px] text-emerald-600 font-semibold block">Optimal</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Useful Life (RUL)</span>
                  <span className="text-sm font-extrabold text-slate-800">340 hrs</span>
                  <span className="text-[10px] text-emerald-600 font-semibold block">Healthy</span>
                </div>
              </div>

              {/* Verified Stamps */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-center justify-between text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-emerald-700" />
                  <span>Last Service: 14 Sep 2026 (Oil & Filter Renewal)</span>
                </div>
                <span className="font-bold text-emerald-800">Verified</span>
              </div>
            </div>

            {/* Actions */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
              <Link
                to="/twin"
                className="text-xs font-bold text-slate-700 hover:text-kisan-primary flex items-center gap-1"
              >
                <span>Live Sensor Stream</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <button
                onClick={() => {
                  setSelectedMachine('Mahindra 585 DI PowerPlus');
                  setBookModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-kisan-primary hover:bg-emerald-900 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Wrench className="w-3.5 h-3.5 text-kisan-fresh" />
                <span>Book Service</span>
              </button>
            </div>
          </div>

          {/* Machine 2: Secondary Rotavator */}
          <div className="rounded-3xl bg-white border border-slate-200/90 shadow-md hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100">
                    <Tractor className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-800 font-serif">Shaktiman Semi-Champion Rotavator</h3>
                    <p className="text-xs text-slate-500">Reg: PB-08-IMP-1044 • Multi-Speed Gear</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    72% Action
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-1">Gear Check Due</span>
                </div>
              </div>

              {/* Passport Diagnostics Grid */}
              <div className="grid grid-cols-3 gap-3 my-5">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Blade Wear</span>
                  <span className="text-sm font-extrabold text-amber-600">74%</span>
                  <span className="text-[10px] text-amber-600 font-semibold block">Moderate</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Gearbox Temp</span>
                  <span className="text-sm font-extrabold text-slate-800">54°C</span>
                  <span className="text-[10px] text-emerald-600 font-semibold block">Safe</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Useful Life (RUL)</span>
                  <span className="text-sm font-extrabold text-amber-600">110 hrs</span>
                  <span className="text-[10px] text-amber-600 font-semibold block">Service Soon</span>
                </div>
              </div>

              {/* Verified Stamps */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-slate-500" />
                  <span>Next Scheduled: Pre-Rabi Tillage Inspection</span>
                </div>
                <span className="font-bold text-amber-600">Due Soon</span>
              </div>
            </div>

            {/* Actions */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
              <Link
                to="/twin"
                className="text-xs font-bold text-slate-700 hover:text-kisan-primary flex items-center gap-1"
              >
                <span>Live Sensor Stream</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <button
                onClick={() => {
                  setSelectedMachine('Shaktiman Semi-Champion Rotavator');
                  setBookModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Wrench className="w-3.5 h-3.5 text-white" />
                <span>Request Inspection</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Modals */}
      <FarmerBookServiceModal
        isOpen={bookModalOpen}
        onClose={() => setBookModalOpen(false)}
        currentLang={lang}
        initialMachineName={selectedMachine}
      />

      <FarmerRegisterModal
        isOpen={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
        currentLang={lang}
      />

    </div>
  );
};
