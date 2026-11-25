import React from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  QrCode, 
  Calendar, 
  Gauge, 
  Award, 
  Wrench, 
  Sparkles,
  FileText
} from 'lucide-react';
import { Language, translations } from '../../data/translations';

interface DigitalHealthCardPreviewProps {
  currentLang: Language;
  onOpenRegister: () => void;
}

export const DigitalHealthCardPreview: React.FC<DigitalHealthCardPreviewProps> = ({
  currentLang,
  onOpenRegister,
}) => {
  const t = translations[currentLang];

  return (
    <section className="py-24 bg-white relative overflow-hidden border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-5">
            <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-50 text-kisan-primary font-bold text-xs tracking-wider uppercase mb-4 border border-emerald-200">
              {currentLang === 'hi' ? 'स्मार्ट हेल्थ पासपोर्ट' : 'DIGITAL HEALTH PASSPORT'}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight leading-tight mb-6">
              {currentLang === 'hi' ? 'हर मशीन का डिजिटल स्वास्थ्य रिकॉर्ड' : 'Every Tractor Deserves a Lifetime Health Passport.'}
            </h2>
            <p className="text-slate-600 text-base leading-relaxed mb-8">
              {currentLang === 'hi'
                ? 'कागजी रसीदों और खोए हुए बिलों को अलविदा कहें। किसानसेतु डिजिटल हेल्थ कार्ड आपके ट्रैक्टर के सभी सर्विस स्टैम्प, ऑयल चेंज, बेयरिंग स्थिति और वारंटी को हमेशा सुरक्षित रखता है।'
                : 'Say goodbye to lost paper bills and uncertain service history. The KisanSetu Digital Health Passport preserves all maintenance timestamps, sensor diagnostics, genuine part replacements, and certified technician stamps.'}
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span className="text-sm font-semibold text-slate-800">
                  {currentLang === 'hi' ? '100% सत्यापित डिजिटल सर्विस रिकॉर्ड' : '100% Verified Digital Maintenance Record'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span className="text-sm font-semibold text-slate-800">
                  {currentLang === 'hi' ? 'पुराने ट्रैक्टर की रीसेल वैल्यू में 20% तक वृद्धि' : 'Up to 20% Higher Resale Value in Secondary Market'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span className="text-sm font-semibold text-slate-800">
                  {currentLang === 'hi' ? 'क्यूआर कोड से किसी भी समय स्कैन और शेयर करने योग्य' : 'Instant QR Code Scan & Shareable Verification'}
                </span>
              </div>
            </div>

            <button
              onClick={onOpenRegister}
              className="px-8 py-3.5 rounded-full text-sm font-bold text-white bg-kisan-primary hover:bg-emerald-900 shadow-xl hover:shadow-emerald-900/30 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-kisan-fresh" />
              <span>{currentLang === 'hi' ? 'अपना हेल्थ कार्ड बनाएं →' : 'Generate Free Health Passport →'}</span>
            </button>
          </div>

          {/* Right Preview Card Mockup */}
          <div className="lg:col-span-7 flex justify-center">
            <div className="w-full max-w-lg rounded-3xl bg-gradient-to-br from-kisan-dark via-kisan-primary to-emerald-950 p-7 text-white shadow-2xl border border-emerald-500/30 relative overflow-hidden">
              
              {/* Background watermark */}
              <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-kisan-fresh/10 rounded-full blur-3xl pointer-events-none"></div>

              {/* Passport Header */}
              <div className="flex items-center justify-between pb-6 border-b border-white/15">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                    <Award className="w-6 h-6 text-kisan-fresh" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white font-serif tracking-wide">KISANSETU HEALTH PASSPORT</h3>
                    <p className="text-xs text-emerald-200">Govt SMAM Aligned • Digital Twin Certified</p>
                  </div>
                </div>

                <div className="w-14 h-14 bg-white p-1 rounded-xl shadow-md">
                  {/* Clean Mock QR Code */}
                  <div className="w-full h-full bg-slate-900 rounded-lg flex items-center justify-center text-white">
                    <QrCode className="w-9 h-9 text-white" />
                  </div>
                </div>
              </div>

              {/* Machine Identifiers */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-6 border-b border-white/10 text-xs">
                <div>
                  <span className="text-emerald-300 block mb-1">Vehicle / Reg ID</span>
                  <span className="font-bold text-white text-sm">PB-08-AG-9022</span>
                </div>
                <div>
                  <span className="text-emerald-300 block mb-1">Machinery Model</span>
                  <span className="font-bold text-white text-sm">Mahindra 585 DI</span>
                </div>
                <div>
                  <span className="text-emerald-300 block mb-1">Operating State</span>
                  <span className="font-bold text-white text-sm">Ludhiana, Punjab</span>
                </div>
              </div>

              {/* Health Score & Diagnostics */}
              <div className="py-6 border-b border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-emerald-100">Overall Machinery Health</span>
                  <span className="text-sm font-extrabold text-kisan-fresh">94% • Excellent</span>
                </div>
                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/10">
                  <div className="w-[94%] h-full bg-gradient-to-r from-emerald-400 to-kisan-fresh rounded-full"></div>
                </div>

                <div className="grid grid-cols-3 gap-3 mt-4 text-center">
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-[10px] text-emerald-300 block">Bearing Wear</span>
                    <span className="text-xs font-bold text-white">Optimal (98%)</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-[10px] text-emerald-300 block">Hydraulics</span>
                    <span className="text-xs font-bold text-white">182 bar (Normal)</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-[10px] text-emerald-300 block">Engine Coolant</span>
                    <span className="text-xs font-bold text-white">82°C (Healthy)</span>
                  </div>
                </div>
              </div>

              {/* Last Certified Stamp */}
              <div className="pt-5 flex items-center justify-between text-xs text-emerald-200">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-kisan-fresh" />
                  <span>Certified by Master Tech: R. Singh (Badge #4092)</span>
                </div>
                <span className="font-mono text-emerald-400">Next Due: 28 Dec 2026</span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
