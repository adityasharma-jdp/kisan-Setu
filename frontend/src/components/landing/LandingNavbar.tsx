import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Tractor, 
  Menu, 
  X, 
  Globe, 
  ShieldCheck, 
  UserCheck, 
  Wrench, 
  ArrowRight,
  LayoutDashboard
} from 'lucide-react';
import { Language, translations } from '../../data/translations';

interface LandingNavbarProps {
  currentLang: Language;
  onToggleLang: () => void;
  onOpenRegister: () => void;
  onOpenLogin: () => void;
}

export const LandingNavbar: React.FC<LandingNavbarProps> = ({
  currentLang,
  onToggleLang,
  onOpenRegister,
  onOpenLogin,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const t = translations[currentLang];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 sm:px-6 lg:px-12 pt-4">
      <div 
        className={`max-w-7xl mx-auto rounded-full transition-all duration-300 px-6 py-3.5 flex items-center justify-between ${
          isScrolled 
            ? 'glass-card-dark shadow-2xl bg-kisan-dark/90 border border-white/20' 
            : 'glass-nav bg-white/10 border border-white/20 shadow-lg'
        }`}
      >
        {/* Brand Logo & Title */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-kisan-primary to-kisan-fresh flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
            <Tractor className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1">
              {t.brandName}
              <span className="inline-block w-2 h-2 rounded-full bg-kisan-fresh animate-pulse"></span>
            </span>
            <span className="text-[10px] text-emerald-200/80 font-medium tracking-wider uppercase -mt-0.5">
              Indian AgriTech Platform
            </span>
          </div>
        </Link>

        {/* Center Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-7">
          <a href="#home" className="text-sm font-medium text-white/90 hover:text-kisan-fresh transition-colors">
            {t.nav.home}
          </a>
          <a href="#about" className="text-sm font-medium text-white/80 hover:text-kisan-fresh transition-colors">
            {t.nav.about}
          </a>
          <a href="#machinery" className="text-sm font-medium text-white/80 hover:text-kisan-fresh transition-colors">
            {t.nav.machinery}
          </a>
          <a href="#services" className="text-sm font-medium text-white/80 hover:text-kisan-fresh transition-colors">
            {t.nav.services}
          </a>
          <a href="#how-it-works" className="text-sm font-medium text-white/80 hover:text-kisan-fresh transition-colors">
            {t.nav.howItWorks}
          </a>
          <a href="#faq" className="text-sm font-medium text-white/80 hover:text-kisan-fresh transition-colors">
            {t.nav.contact}
          </a>
        </nav>

        {/* Right CTA & Actions */}
        <div className="hidden md:flex items-center gap-3">
          {/* Language Switcher */}
          <button
            onClick={onToggleLang}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white/90 bg-white/10 hover:bg-white/20 border border-white/20 transition-all hover:scale-105"
            title="Toggle English / Hindi"
          >
            <Globe className="w-3.5 h-3.5 text-kisan-fresh" />
            <span>{t.nav.languageToggle}</span>
          </button>

          {/* Direct link to Fleet Admin / Twin suite */}
          <Link
            to="/fleet"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-emerald-100 bg-kisan-primary/60 hover:bg-kisan-primary border border-emerald-500/30 transition-all hover:scale-105 shadow-sm"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-kisan-fresh" />
            <span>{t.nav.adminConsole}</span>
          </Link>

          {/* Login Button */}
          <button
            onClick={onOpenLogin}
            className="px-4 py-1.5 rounded-full text-xs font-semibold text-white/90 hover:text-white bg-transparent hover:bg-white/10 transition-colors"
          >
            {t.nav.login}
          </button>

          {/* Farmer Registration CTA */}
          <button
            onClick={onOpenRegister}
            className="flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-bold text-kisan-dark bg-kisan-fresh hover:bg-lime-400 shadow-md hover:shadow-lg transition-all hover:scale-105"
          >
            <span>{t.nav.registerFarmer}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={onToggleLang}
            className="p-1.5 rounded-full text-white bg-white/10 border border-white/20 text-xs font-semibold"
          >
            {t.nav.languageToggle}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-full text-white hover:bg-white/10"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 max-w-7xl mx-auto rounded-3xl glass-card-dark p-6 shadow-2xl border border-white/20 flex flex-col gap-4 animate-in fade-in duration-200">
          <nav className="flex flex-col gap-3">
            <a 
              href="#home" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium text-white/90 hover:text-kisan-fresh py-1 border-b border-white/10"
            >
              {t.nav.home}
            </a>
            <a 
              href="#about" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium text-white/90 hover:text-kisan-fresh py-1 border-b border-white/10"
            >
              {t.nav.about}
            </a>
            <a 
              href="#machinery" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium text-white/90 hover:text-kisan-fresh py-1 border-b border-white/10"
            >
              {t.nav.machinery}
            </a>
            <a 
              href="#services" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium text-white/90 hover:text-kisan-fresh py-1 border-b border-white/10"
            >
              {t.nav.services}
            </a>
            <a 
              href="#how-it-works" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium text-white/90 hover:text-kisan-fresh py-1 border-b border-white/10"
            >
              {t.nav.howItWorks}
            </a>
            <Link
              to="/fleet"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-semibold text-kisan-fresh py-1 border-b border-white/10 flex items-center justify-between"
            >
              <span>{t.nav.adminConsole}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </nav>

          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenLogin();
              }}
              className="w-full py-2.5 rounded-full text-sm font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 text-center"
            >
              {t.nav.login}
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenRegister();
              }}
              className="w-full py-2.5 rounded-full text-sm font-bold text-kisan-dark bg-kisan-fresh hover:bg-lime-400 text-center shadow-lg"
            >
              {t.nav.registerFarmer}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
