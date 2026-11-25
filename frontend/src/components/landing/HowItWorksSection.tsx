import React from 'react';
import { 
  ClipboardCheck, 
  Cpu, 
  BellRing, 
  Truck,
  ArrowRight
} from 'lucide-react';
import { Language, translations } from '../../data/translations';

interface HowItWorksProps {
  currentLang: Language;
  onOpenRegister: () => void;
}

export const HowItWorksSection: React.FC<HowItWorksProps> = ({ currentLang, onOpenRegister }) => {
  const t = translations[currentLang];

  const steps = [
    {
      icon: <ClipboardCheck className="w-8 h-8 text-kisan-primary" />,
      title: t.howItWorks.step1Title,
      desc: t.howItWorks.step1Desc,
      stepNumber: "01",
    },
    {
      icon: <Cpu className="w-8 h-8 text-kisan-primary" />,
      title: t.howItWorks.step2Title,
      desc: t.howItWorks.step2Desc,
      stepNumber: "02",
    },
    {
      icon: <BellRing className="w-8 h-8 text-kisan-primary" />,
      title: t.howItWorks.step3Title,
      desc: t.howItWorks.step3Desc,
      stepNumber: "03",
    },
    {
      icon: <Truck className="w-8 h-8 text-kisan-primary" />,
      title: t.howItWorks.step4Title,
      desc: t.howItWorks.step4Desc,
      stepNumber: "04",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-kisan-cream relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-100 text-kisan-primary font-bold text-xs tracking-wider uppercase mb-3 border border-emerald-300/40">
            {t.howItWorks.badge}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-slate-800 tracking-tight">
            {t.howItWorks.title}
          </h2>
          <p className="text-slate-600 mt-4 text-base leading-relaxed">
            {t.howItWorks.subtitle}
          </p>
        </div>

        {/* 4 Steps Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, idx) => (
            <div 
              key={idx}
              className="relative rounded-3xl bg-white p-7 border border-emerald-950/10 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group"
            >
              {/* Step Number Watermark */}
              <span className="absolute top-4 right-5 text-4xl font-extrabold text-slate-100 group-hover:text-emerald-100 transition-colors font-serif">
                {step.stepNumber}
              </span>

              <div>
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-6 shadow-sm group-hover:bg-kisan-primary group-hover:text-white transition-all">
                  {step.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-3 font-serif">
                  {step.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>

              <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-800">
                <span>{currentLang === 'hi' ? 'चरण' : 'Step'} {step.stepNumber}</span>
                <span className="w-2 h-2 rounded-full bg-kisan-fresh"></span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Banner */}
        <div className="mt-16 text-center">
          <button
            onClick={onOpenRegister}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-sm text-kisan-dark bg-kisan-fresh hover:bg-lime-400 shadow-xl hover:shadow-kisan-fresh/30 transition-all hover:scale-105"
          >
            <span>{currentLang === 'hi' ? 'आज ही अपनी मशीन पंजीकृत करें' : 'Get Started in Under 2 Minutes'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
