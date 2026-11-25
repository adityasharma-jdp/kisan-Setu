import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Tractor, 
  PhoneCall, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  ArrowUpRight,
  ExternalLink
} from 'lucide-react';
import { Language, translations } from '../../data/translations';

interface LandingFooterProps {
  currentLang: Language;
}

export const LandingFooter: React.FC<LandingFooterProps> = ({ currentLang }) => {
  const t = translations[currentLang];

  return (
    <footer className="bg-kisan-dark text-white pt-16 pb-12 border-t border-emerald-900/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Top Toll-Free Helpline Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-kisan-darkest to-emerald-950 p-6 sm:p-8 border border-white/10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 mb-16">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-14 h-14 rounded-full bg-kisan-fresh/20 flex items-center justify-center text-kisan-fresh border border-kisan-fresh/30">
              <PhoneCall className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs uppercase font-bold text-emerald-300 tracking-wider block">
                {t.footer.helplineTitle}
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-white font-serif">
                {t.footer.helplineNumber}
              </span>
            </div>
          </div>

          <div className="text-center md:text-right">
            <span className="text-xs text-emerald-200/80 block">
              {currentLang === 'hi' ? 'सोमवार - शनिवार: सुबह 6 बजे से रात 10 बजे तक' : 'Monday - Saturday: 6:00 AM - 10:00 PM IST'}
            </span>
            <span className="text-xs font-bold text-kisan-fresh">
              {currentLang === 'hi' ? 'मुफ्त किसान सहायता एवं सर्विस शेड्यूलिंग' : 'Free Farmer Helpline & Instant Service Dispatch'}
            </span>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Info */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-kisan-fresh flex items-center justify-center text-kisan-dark">
                <Tractor className="w-5 h-5" />
              </div>
              <span className="text-2xl font-bold font-serif text-white">{t.brandName}</span>
            </div>
            <p className="text-sm text-emerald-100/70 leading-relaxed mb-6 font-sans">
              {t.footer.description}
            </p>
            <div className="text-xs text-emerald-200/60">
              📍 Central Headquarters: New Delhi & Ludhiana Agri-Innovation Center
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-300 mb-4">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2.5 text-sm text-emerald-100/80">
              <li><a href="#home" className="hover:text-kisan-fresh transition-colors">Home</a></li>
              <li><a href="#about" className="hover:text-kisan-fresh transition-colors">About KisanSetu</a></li>
              <li><a href="#machinery" className="hover:text-kisan-fresh transition-colors">Machinery Showcase</a></li>
              <li><a href="#how-it-works" className="hover:text-kisan-fresh transition-colors">How It Works</a></li>
              <li><a href="#faq" className="hover:text-kisan-fresh transition-colors">Frequently Asked Questions</a></li>
            </ul>
          </div>

          {/* Fleet Operations & Tools */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-300 mb-4">
              Operations Console
            </h4>
            <ul className="space-y-2.5 text-sm text-emerald-100/80">
              <li>
                <Link to="/fleet" className="hover:text-kisan-fresh transition-colors flex items-center gap-1">
                  <span>Fleet Management</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-kisan-fresh" />
                </Link>
              </li>
              <li>
                <Link to="/twin" className="hover:text-kisan-fresh transition-colors flex items-center gap-1">
                  <span>Digital Twin Telemetry</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-kisan-fresh" />
                </Link>
              </li>
              <li>
                <Link to="/predictions" className="hover:text-kisan-fresh transition-colors flex items-center gap-1">
                  <span>AI Predictive Engine</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-kisan-fresh" />
                </Link>
              </li>
              <li>
                <Link to="/work-orders" className="hover:text-kisan-fresh transition-colors flex items-center gap-1">
                  <span>Work Order Management</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-kisan-fresh" />
                </Link>
              </li>
              <li>
                <Link to="/baseline" className="hover:text-kisan-fresh transition-colors flex items-center gap-1">
                  <span>Strategy Comparison</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-kisan-fresh" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Government Mission Alignment */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-300 mb-4">
              Mission Alignment
            </h4>
            <p className="text-xs text-emerald-100/70 leading-relaxed mb-4">
              {t.footer.nationalMission}
            </p>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-emerald-200">
              <span className="font-bold text-white block mb-1">NexHack 2.0 Hackathon</span>
              <span>Problem Statement 08: AI in Agriculture • Predictive Maintenance Twin</span>
            </div>
          </div>

        </div>

        {/* Copyright & Disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-emerald-200/60 gap-4">
          <div>
            © {new Date().getFullYear()} {t.brandName} Platform. {t.footer.rightsReserved}
          </div>
          <div className="flex items-center gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Security Standards</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
