import React, { useState } from 'react';
import { 
  X, 
  UserCheck, 
  Phone, 
  Lock, 
  ArrowRight, 
  ShieldCheck,
  Sparkles,
  Tractor
} from 'lucide-react';
import { Language } from '../../data/translations';

interface FarmerLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
  onSwitchToRegister: () => void;
}

export const FarmerLoginModal: React.FC<FarmerLoginModalProps> = ({
  isOpen,
  onClose,
  currentLang,
  onSwitchToRegister,
}) => {
  const [phone, setPhone] = useState('9876543210');
  const [role, setRole] = useState<'Farmer' | 'Admin'>('Farmer');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setOtpSent(true);
      setLoading(false);
    }, 600);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onClose();
      if (role === 'Farmer') {
        window.location.href = '/twin';
      } else {
        window.location.href = '/fleet';
      }
    }, 600);
  };

  const handleOneClickDemoFarmer = () => {
    const demoProfile = {
      name: "Sardar Harpreet Singh",
      phone: "+91 98765 43210",
      state: "Punjab",
      district: "Ludhiana",
      village: "Samrala",
      machineId: "FP-101",
      brand: "Mahindra & Mahindra",
      model: "585 DI PowerPlus",
      type: "Heavy-Duty Tractor (4WD)",
      registeredAt: new Date().toISOString(),
    };
    localStorage.setItem('kisan_farmer_session', JSON.stringify(demoProfile));
    onClose();
    window.location.href = '/twin';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-kisan-dark via-kisan-primary to-emerald-900 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-kisan-fresh text-kisan-dark flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-serif">
                {currentLang === 'hi' ? 'किसानसेतु लॉगिन' : 'KisanSetu Portal Login'}
              </h3>
              <p className="text-xs text-emerald-200">
                {currentLang === 'hi' ? 'मोबाइल नंबर द्वारा त्वरित एवं सुरक्षित प्रवेश' : 'Fast & Secure Mobile Login'}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Persona Toggle */}
          <div className="flex items-center p-1 rounded-full bg-slate-100 border border-slate-200">
            <button
              type="button"
              onClick={() => setRole('Farmer')}
              className={`flex-1 py-1.5 rounded-full text-xs font-bold transition-all ${
                role === 'Farmer' ? 'bg-kisan-primary text-white shadow-sm' : 'text-slate-600'
              }`}
            >
              {currentLang === 'hi' ? 'किसान पोर्टल' : 'Farmer Portal'}
            </button>
            <button
              type="button"
              onClick={() => setRole('Admin')}
              className={`flex-1 py-1.5 rounded-full text-xs font-bold transition-all ${
                role === 'Admin' ? 'bg-kisan-primary text-white shadow-sm' : 'text-slate-600'
              }`}
            >
              {currentLang === 'hi' ? 'सर्विस ऑपरेशन्स' : 'Fleet Ops Admin'}
            </button>
          </div>

          {!otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {currentLang === 'hi' ? 'पंजीकृत मोबाइल नंबर (+91)' : 'Registered Mobile Number (+91)'}
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-slate-200 bg-slate-50 text-xs font-bold text-slate-600">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="9876543210"
                    className="w-full px-3.5 py-2.5 rounded-r-xl border border-slate-200 text-sm focus:outline-none focus:border-kisan-primary"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-full text-xs font-bold text-kisan-dark bg-kisan-fresh hover:bg-lime-400 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Sending OTP...' : (currentLang === 'hi' ? 'ओटीपी भेजें →' : 'Send OTP →')}</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {currentLang === 'hi' ? '4-अंकीय ओटीपी दर्ज करें (डेमो: 1234)' : 'Enter 4-Digit OTP (Demo: 1234)'}
                </label>
                <input
                  type="text"
                  required
                  maxLength={4}
                  placeholder="1234"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-center tracking-widest text-lg font-bold focus:outline-none focus:border-kisan-primary"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-full text-xs font-bold text-white bg-kisan-primary hover:bg-emerald-900 shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Verifying...' : (currentLang === 'hi' ? 'लॉगिन सत्यापित करें' : 'Verify & Access')}</span>
              </button>
            </form>
          )}

          {/* Quick One-Click Demo Farmer */}
          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={handleOneClickDemoFarmer}
              className="w-full py-2.5 px-3 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-kisan-primary text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <span>{currentLang === 'hi' ? 'त्वरित 1-क्लिक किसान डेमो लॉगिन' : 'One-Click Demo Farmer Login (Punjab)'}</span>
            </button>
          </div>

          {/* Footer Switch */}
          <div className="text-center text-xs text-slate-500">
            <span>{currentLang === 'hi' ? 'नया खाता बनाना चाहते हैं?' : 'New to KisanSetu?'} </span>
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="font-bold text-kisan-primary hover:underline"
            >
              {currentLang === 'hi' ? 'निशुल्क पंजीकरण करें' : 'Register as Farmer'}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
