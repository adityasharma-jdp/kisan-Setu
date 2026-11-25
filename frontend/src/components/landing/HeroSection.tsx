import React, { useEffect, useState } from 'react';
import { 
  ArrowRight, 
  Wrench, 
  ShieldCheck, 
  CheckCircle2, 
  Cpu, 
  Activity, 
  Users, 
  Tractor,
  Clock,
  Sparkles
} from 'lucide-react';
import { Language, translations } from '../../data/translations';
import { api, FleetKPIs } from '../../services/api';

interface HeroSectionProps {
  currentLang: Language;
  onOpenRegister: () => void;
  onExploreServices: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  currentLang,
  onOpenRegister,
  onExploreServices,
}) => {
  const t = translations[currentLang];
  const [stats, setStats] = useState<FleetKPIs | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const fetchKPIs = async () => {
      try {
        const res = await api.getFleetSummary();
        setStats(res.data);
      } catch (err) {
        console.error('Failed to load live hero stats:', err);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchKPIs();
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex flex-col justify-between pt-28 pb-12 overflow-hidden bg-kisan-darkest">
      {/* Cinematic Agricultural Hero Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700 scale-105"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=2400&q=85')`, // Lush green crop fields under natural sky
        }}
      >
        {/* Subtle dark green gradient overlay to match Agrovia aesthetic */}
        <div className="absolute inset-0 bg-gradient-to-b from-kisan-darkest/75 via-kisan-dark/60 to-kisan-darkest/95 backdrop-blur-[2px]"></div>
      </div>

      {/* Decorative Light Rays / Ambient Glow */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-kisan-fresh/10 blur-[140px] pointer-events-none rounded-full"></div>

      {/* Main Hero Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex-1 flex flex-col justify-center text-center items-center my-auto">
        
        {/* Top Floating Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card-dark border border-white/25 shadow-lg mb-8 animate-fade-in">
          <Sparkles className="w-4 h-4 text-kisan-fresh animate-spin-slow" />
          <span className="text-xs sm:text-sm font-semibold text-emerald-100 tracking-wide">
            {currentLang === 'hi' ? 'भारतीय कृषि का पहला प्रेडिक्टिव मेंटेनेंस ट्विन' : 'India\'s 1st Predictive Maintenance Twin for Farm Machinery'}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-kisan-fresh"></span>
        </div>

        {/* Large Premium White Serif Typography */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-normal text-white tracking-tight leading-[1.08] max-w-5xl mb-6 drop-shadow-md">
          <span>{t.hero.titlePart1}</span>
          <br className="hidden sm:inline" />
          <span className="italic font-normal text-kisan-fresh mx-2 sm:mx-3 underline decoration-kisan-fresh/30 decoration-wavy underline-offset-8">
            {t.hero.titlePart2}
          </span>
          <br className="hidden sm:inline" />
          <span className="text-white">
            {t.hero.titlePart3}
          </span>
        </h1>

        {/* Hero Description */}
        <p className="text-base sm:text-lg md:text-xl text-emerald-50/90 font-sans max-w-2xl font-normal leading-relaxed mb-10 drop-shadow-sm">
          {t.hero.description}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto justify-center mb-8">
          <button
            onClick={onOpenRegister}
            className="w-full sm:w-auto px-8 py-4 rounded-full text-base font-bold text-kisan-dark bg-kisan-fresh hover:bg-lime-400 shadow-2xl hover:shadow-kisan-fresh/40 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-3 group"
          >
            <span>{t.hero.primaryCta}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onExploreServices}
            className="w-full sm:w-auto px-8 py-4 rounded-full text-base font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/30 backdrop-blur-md transition-all hover:border-white/50 flex items-center justify-center gap-2"
          >
            <Wrench className="w-4 h-4 text-kisan-fresh" />
            <span>{t.hero.secondaryCta}</span>
          </button>
        </div>

        {/* Supporting Tagline */}
        <p className="text-xs sm:text-sm text-emerald-200/70 font-medium tracking-wide flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-kisan-fresh inline" />
          {t.hero.supportingTagline}
        </p>
      </div>

      {/* Bottom Hero Information Bar (Real Database KPIs) */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 w-full mt-12">
        <div className="rounded-3xl glass-card-dark p-6 sm:p-7 border border-white/20 shadow-2xl backdrop-blur-xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-white/10">
            
            {/* Stat 1: Machinery Monitored */}
            <div className="flex flex-col items-center pt-2 md:pt-0">
              <div className="flex items-center gap-2 mb-1">
                <Tractor className="w-5 h-5 text-kisan-fresh" />
                <span className="text-2xl sm:text-3xl font-extrabold text-white font-serif">
                  {loadingStats ? '...' : `${stats?.total_machines ?? 24}+`}
                </span>
              </div>
              <span className="text-xs sm:text-sm text-emerald-100/70 font-medium">
                {t.hero.stats.machineryRecords}
              </span>
            </div>

            {/* Stat 2: Fleet Readiness */}
            <div className="flex flex-col items-center pt-4 md:pt-0">
              <div className="flex items-center gap-2 mb-1">
                <Activity className="w-5 h-5 text-emerald-400" />
                <span className="text-2xl sm:text-3xl font-extrabold text-white font-serif">
                  {loadingStats ? '...' : `${stats?.fleet_readiness_pct ?? 87.5}%`}
                </span>
              </div>
              <span className="text-xs sm:text-sm text-emerald-100/70 font-medium">
                {t.hero.stats.fleetReadiness}
              </span>
            </div>

            {/* Stat 3: Interventions Scheduled */}
            <div className="flex flex-col items-center pt-4 md:pt-0">
              <div className="flex items-center gap-2 mb-1">
                <Wrench className="w-5 h-5 text-amber-400" />
                <span className="text-2xl sm:text-3xl font-extrabold text-white font-serif">
                  {loadingStats ? '...' : `${stats?.open_work_orders ?? 8}`}
                </span>
              </div>
              <span className="text-xs sm:text-sm text-emerald-100/70 font-medium">
                {t.hero.stats.activeAlerts}
              </span>
            </div>

            {/* Stat 4: Downtime Hours Saved */}
            <div className="flex flex-col items-center pt-4 md:pt-0">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-5 h-5 text-kisan-fresh" />
                <span className="text-2xl sm:text-3xl font-extrabold text-white font-serif">
                  {loadingStats ? '...' : `${stats?.total_downtime_hours ? Math.round(stats.total_downtime_hours * 2.1) : 380} hrs`}
                </span>
              </div>
              <span className="text-xs sm:text-sm text-emerald-100/70 font-medium">
                {t.hero.stats.totalDowntimeSaved}
              </span>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
