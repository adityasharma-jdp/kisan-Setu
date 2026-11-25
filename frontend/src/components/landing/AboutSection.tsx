import React from 'react';
import { Cpu, HeartPulse, Users2, ShieldCheck, ArrowRight } from 'lucide-react';
import { Language, translations } from '../../data/translations';

interface AboutSectionProps {
  currentLang: Language;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ currentLang }) => {
  const t = translations[currentLang];

  return (
    <section id="about" className="py-24 bg-kisan-cream relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-100 text-kisan-primary font-bold text-xs tracking-wider uppercase mb-4 border border-emerald-300/40">
            {t.about.badge}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-kisan-dark tracking-tight mb-6">
            {t.about.title}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-sans leading-relaxed">
            {t.about.subtitle}
          </p>
        </div>

        {/* 3 Core Pillars Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: Digital Health Card */}
          <div className="rounded-3xl bg-white p-8 border border-emerald-900/10 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-kisan-primary flex items-center justify-center mb-6 border border-emerald-100 group-hover:bg-kisan-primary group-hover:text-white transition-colors shadow-sm">
                <HeartPulse className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3 font-serif">
                {t.about.card1Title}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6 font-sans">
                {t.about.card1Desc}
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-kisan-primary gap-1 group-hover:gap-2 transition-all">
              <span>{currentLang === 'hi' ? 'स्वास्थ्य विवरण देखें' : 'Explore Health Card'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 2: AI Predictor */}
          <div className="rounded-3xl bg-white p-8 border border-emerald-900/10 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-lime-50 text-emerald-800 flex items-center justify-center mb-6 border border-lime-100 group-hover:bg-emerald-800 group-hover:text-white transition-colors shadow-sm">
                <Cpu className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3 font-serif">
                {t.about.card2Title}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6 font-sans">
                {t.about.card2Desc}
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-kisan-primary gap-1 group-hover:gap-2 transition-all">
              <span>{currentLang === 'hi' ? 'एआई तकनीक समझें' : 'View AI Mechanics'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 3: Certified Mechanics */}
          <div className="rounded-3xl bg-white p-8 border border-emerald-900/10 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center mb-6 border border-amber-100 group-hover:bg-amber-700 group-hover:text-white transition-colors shadow-sm">
                <Users2 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3 font-serif">
                {t.about.card3Title}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6 font-sans">
                {t.about.card3Desc}
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-kisan-primary gap-1 group-hover:gap-2 transition-all">
              <span>{currentLang === 'hi' ? 'तकनीशियन नेटवर्क' : 'Mechanic Network'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
