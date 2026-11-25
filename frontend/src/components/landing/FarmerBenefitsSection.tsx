import React from 'react';
import { 
  TrendingDown, 
  IndianRupee, 
  Award, 
  Clock, 
  CheckCircle2 
} from 'lucide-react';
import { Language, translations } from '../../data/translations';

interface FarmerBenefitsProps {
  currentLang: Language;
}

export const FarmerBenefitsSection: React.FC<FarmerBenefitsProps> = ({ currentLang }) => {
  const t = translations[currentLang];

  const benefits = [
    {
      icon: <TrendingDown className="w-8 h-8 text-rose-600" />,
      title: t.benefits.b1Title,
      desc: t.benefits.b1Desc,
      stat: "42%",
      label: currentLang === 'hi' ? 'कम ब्रेकडाउन' : 'Less Breakdown',
      bg: "bg-rose-50 border-rose-100",
    },
    {
      icon: <IndianRupee className="w-8 h-8 text-emerald-600" />,
      title: t.benefits.b2Title,
      desc: t.benefits.b2Desc,
      stat: "₹28,500",
      label: currentLang === 'hi' ? 'औसत वार्षिक बचत' : 'Annual Savings',
      bg: "bg-emerald-50 border-emerald-100",
    },
    {
      icon: <Award className="w-8 h-8 text-amber-600" />,
      title: t.benefits.b3Title,
      desc: t.benefits.b3Desc,
      stat: "+20%",
      label: currentLang === 'hi' ? 'उच्च रीसेल मूल्य' : 'Higher Resale Value',
      bg: "bg-amber-50 border-amber-100",
    },
    {
      icon: <Clock className="w-8 h-8 text-sky-600" />,
      title: t.benefits.b4Title,
      desc: t.benefits.b4Desc,
      stat: "< 4 hrs",
      label: currentLang === 'hi' ? 'त्वरित सेवा समय' : 'Turnaround Time',
      bg: "bg-sky-50 border-sky-100",
    },
  ];

  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-50 text-kisan-primary font-bold text-xs tracking-wider uppercase mb-3 border border-emerald-200">
            {t.benefits.badge}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-slate-800 tracking-tight">
            {t.benefits.title}
          </h2>
          <p className="text-slate-600 mt-4 text-base">
            {t.benefits.subtitle}
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((b, idx) => (
            <div 
              key={idx}
              className="rounded-3xl bg-slate-50 border border-slate-200/80 p-7 hover:bg-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group"
            >
              <div>
                <div className={`w-16 h-16 rounded-2xl ${b.bg} flex items-center justify-center mb-6 border shadow-sm group-hover:scale-105 transition-transform`}>
                  {b.icon}
                </div>
                
                <div className="mb-4">
                  <span className="text-3xl font-extrabold text-slate-900 font-serif block">{b.stat}</span>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{b.label}</span>
                </div>

                <h3 className="text-lg font-bold text-slate-800 mb-2 font-serif">
                  {b.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {b.desc}
                </p>
              </div>

              <div className="pt-6 mt-4 border-t border-slate-200/60 flex items-center gap-2 text-xs font-bold text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{currentLang === 'hi' ? 'सत्यापित परिणाम' : 'Field Verified'}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
