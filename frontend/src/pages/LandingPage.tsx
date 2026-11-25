import React, { useState } from 'react';
import { Language } from '../data/translations';
import { LandingNavbar } from '../components/landing/LandingNavbar';
import { HeroSection } from '../components/landing/HeroSection';
import { EcosystemStrip } from '../components/landing/EcosystemStrip';
import { AboutSection } from '../components/landing/AboutSection';
import { MachineryShowcase } from '../components/landing/MachineryShowcase';
import { DigitalHealthCardPreview } from '../components/landing/DigitalHealthCardPreview';
import { HowItWorksSection } from '../components/landing/HowItWorksSection';
import { FarmerBenefitsSection } from '../components/landing/FarmerBenefitsSection';
import { FAQSection } from '../components/landing/FAQSection';
import { LandingFooter } from '../components/landing/LandingFooter';
import { FarmerRegisterModal } from '../components/modals/FarmerRegisterModal';
import { FarmerLoginModal } from '../components/modals/FarmerLoginModal';
import { FarmerBookServiceModal } from '../components/modals/FarmerBookServiceModal';

export const LandingPage: React.FC = () => {
  const [lang, setLang] = useState<Language>('en');
  const [registerOpen, setRegisterOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [bookServiceOpen, setBookServiceOpen] = useState(false);
  const [selectedMachineName, setSelectedMachineName] = useState<string>('Mahindra 585 DI');

  const toggleLang = () => {
    setLang(prev => (prev === 'en' ? 'hi' : 'en'));
  };

  const handleOpenBookService = (machineName?: string) => {
    if (machineName) setSelectedMachineName(machineName);
    setBookServiceOpen(true);
  };

  return (
    <div className="min-h-screen bg-kisan-light flex flex-col font-sans selection:bg-kisan-fresh selection:text-kisan-dark">
      {/* Floating Transparent Glass Navbar */}
      <LandingNavbar
        currentLang={lang}
        onToggleLang={toggleLang}
        onOpenRegister={() => setRegisterOpen(true)}
        onOpenLogin={() => setLoginOpen(true)}
      />

      {/* Hero Section */}
      <HeroSection
        currentLang={lang}
        onOpenRegister={() => setRegisterOpen(true)}
        onExploreServices={() => {
          const el = document.getElementById('machinery');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Trusted Ecosystem Strip */}
      <EcosystemStrip currentLang={lang} />

      {/* About Section */}
      <AboutSection currentLang={lang} />

      {/* Machinery Showcase with Health Badges */}
      <MachineryShowcase
        currentLang={lang}
        onSelectMachineForService={handleOpenBookService}
      />

      {/* Digital Health Passport Preview */}
      <DigitalHealthCardPreview
        currentLang={lang}
        onOpenRegister={() => setRegisterOpen(true)}
      />

      {/* 4-Step How It Works */}
      <HowItWorksSection
        currentLang={lang}
        onOpenRegister={() => setRegisterOpen(true)}
      />

      {/* Farmer Benefits Grid */}
      <FarmerBenefitsSection currentLang={lang} />

      {/* FAQ Accordion */}
      <FAQSection currentLang={lang} />

      {/* Footer */}
      <LandingFooter currentLang={lang} />

      {/* Modals */}
      <FarmerRegisterModal
        isOpen={registerOpen}
        onClose={() => setRegisterOpen(false)}
        currentLang={lang}
      />

      <FarmerLoginModal
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        currentLang={lang}
        onSwitchToRegister={() => {
          setLoginOpen(false);
          setRegisterOpen(true);
        }}
      />

      <FarmerBookServiceModal
        isOpen={bookServiceOpen}
        onClose={() => setBookServiceOpen(false)}
        currentLang={lang}
        initialMachineName={selectedMachineName}
      />
    </div>
  );
};
