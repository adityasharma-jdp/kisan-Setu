import React from 'react';
import { Award, Building2, CheckCircle, Landmark, ShieldCheck } from 'lucide-react';
import { Language, translations } from '../../data/translations';

interface EcosystemStripProps {
  currentLang: Language;
}

export const EcosystemStrip: React.FC<EcosystemStripProps> = ({ currentLang }) => {
  const t = translations[currentLang];

  return (
    <section className="bg-white py-12 border-y border-slate-200/80 shadow-sm relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="text-center mb-8">
          <span className="inline-block px-3.5 py-1 rounded-full bg-emerald-50 text-kisan-primary font-bold text-xs tracking-wider uppercase mb-2 border border-emerald-200/60">
            {t.ecosystem.badge}
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight font-serif">
            {t.ecosystem.heading}
          </h2>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 items-center">
          {t.ecosystem.partners.map((partner, idx) => (
            <div 
              key={idx}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-300 hover:bg-emerald-50/40 transition-all duration-300 flex flex-col items-center justify-center text-center h-28 group"
            >
              <div className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center text-kisan-primary group-hover:scale-110 transition-transform mb-2 border border-slate-100">
                {idx % 3 === 0 && <Landmark className="w-4 h-4 text-kisan-primary" />}
                {idx % 3 === 1 && <Building2 className="w-4 h-4 text-emerald-700" />}
                {idx % 3 === 2 && <ShieldCheck className="w-4 h-4 text-kisan-primary" />}
              </div>
              <span className="text-[11px] font-semibold text-slate-700 leading-tight line-clamp-2 group-hover:text-kisan-primary transition-colors">
                {partner}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
