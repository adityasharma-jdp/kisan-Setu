/**
 * Bilingual Translations (English & Hindi)
 * Dedicated for KisanSetu - Indian AgriTech Machinery Portal
 */

export type Language = 'en' | 'hi';

export interface TranslationStrings {
  brandName: string;
  brandTagline: string;
  nav: {
    home: string;
    about: string;
    machinery: string;
    services: string;
    howItWorks: string;
    contact: string;
    login: string;
    registerFarmer: string;
    adminConsole: string;
    farmerPortal: string;
    languageToggle: string;
  };
  hero: {
    titlePart1: string;
    titlePart2: string;
    titlePart3: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
    supportingTagline: string;
    stats: {
      registeredFarmers: string;
      machineryRecords: string;
      activeAlerts: string;
      fleetReadiness: string;
      resolvedRepairs: string;
      totalDowntimeSaved: string;
    };
  };
  ecosystem: {
    heading: string;
    badge: string;
    partners: string[];
  };
  about: {
    badge: string;
    title: string;
    subtitle: string;
    card1Title: string;
    card1Desc: string;
    card2Title: string;
    card2Desc: string;
    card3Title: string;
    card3Desc: string;
  };
  machinerySection: {
    badge: string;
    title: string;
    subtitle: string;
    healthCardTitle: string;
    healthCardSubtitle: string;
    bookServiceBtn: string;
    viewTwinBtn: string;
  };
  howItWorks: {
    badge: string;
    title: string;
    subtitle: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    step4Title: string;
    step4Desc: string;
  };
  benefits: {
    badge: string;
    title: string;
    subtitle: string;
    b1Title: string;
    b1Desc: string;
    b2Title: string;
    b2Desc: string;
    b3Title: string;
    b3Desc: string;
    b4Title: string;
    b4Desc: string;
  };
  faq: {
    badge: string;
    title: string;
    subtitle: string;
    items: { q: string; a: string }[];
  };
  footer: {
    description: string;
    helplineTitle: string;
    helplineNumber: string;
    quickLinks: string;
    machineryHub: string;
    contactSupport: string;
    rightsReserved: string;
    nationalMission: string;
  };
}

export const translations: Record<Language, TranslationStrings> = {
  en: {
    brandName: "KisanSetu",
    brandTagline: "Predict Today. Prevent Downtime Tomorrow.",
    nav: {
      home: "Home",
      about: "About Us",
      machinery: "Machinery",
      services: "Services",
      howItWorks: "How It Works",
      contact: "Contact Us",
      login: "Login",
      registerFarmer: "Register as Farmer",
      adminConsole: "Fleet Ops Console",
      farmerPortal: "Farmer Portal",
      languageToggle: "हिन्दी",
    },
    hero: {
      titlePart1: "Smart Machinery.",
      titlePart2: "Stronger Farmers.",
      titlePart3: "Better Future.",
      description: "Empowering Indian farmers with a smarter way to manage agricultural machinery, track maintenance, maintain digital service records and connect with certified service providers.",
      primaryCta: "Register as Farmer →",
      secondaryCta: "Explore Machinery Services",
      supportingTagline: "Technology-driven solutions for India's farming community.",
      stats: {
        registeredFarmers: "Registered Farmers",
        machineryRecords: "Machinery Monitored",
        activeAlerts: "Critical Interventions",
        fleetReadiness: "Fleet Readiness",
        resolvedRepairs: "Work Orders Completed",
        totalDowntimeSaved: "Hours Downtime Saved",
      },
    },
    ecosystem: {
      heading: "Trusted by India's Agricultural Ecosystem",
      badge: "NATIONAL AGRI NETWORK",
      partners: [
        "ICAR - Central Institute of Agricultural Engineering",
        "Krishi Vigyan Kendra (KVK Network)",
        "National FPO Federation of India",
        "State Agriculture & Mechanization Depts",
        "Rural Agricultural Cooperatives (PACS)",
        "NABARD Agricultural Innovation Cell"
      ],
    },
    about: {
      badge: "PLATFORM OVERVIEW",
      title: "Bridging Modern Engineering with India's Farmlands",
      subtitle: "KisanSetu transforms traditional farm machinery maintenance from unexpected, costly breakdowns into proactive, AI-guided service schedules tailored to Indian crop seasons.",
      card1Title: "Digital Machinery Health Card",
      card1Desc: "Every tractor and implement receives a lifetime digital health record capturing operating hours, oil degradation, bearing health, and service stamps.",
      card2Title: "AI Condition Predictor",
      card2Desc: "Advanced machine learning algorithms detect mechanical wear up to 72 hours before catastrophic field failure, protecting peak harvest windows.",
      card3Title: "Certified Local Mechanics",
      card3Desc: "Instant connection with trained village-level technicians equipped with verified genuine spare parts to minimize downtime.",
    },
    machinerySection: {
      badge: "EQUIPMENT & HEALTH",
      title: "Smart Machinery Management & Digital Health Cards",
      subtitle: "Track your tractor, harvester, or rotavator in real-time. Review vibration, hydraulic pressure, engine temperature, and remaining useful life.",
      healthCardTitle: "Digital Equipment Passport",
      healthCardSubtitle: "Verified condition score, past service timestamps, and upcoming maintenance schedules.",
      bookServiceBtn: "Book Certified Service",
      viewTwinBtn: "View Digital Twin Telemetry",
    },
    howItWorks: {
      badge: "SIMPLE 4-STEP PROCESS",
      title: "How KisanSetu Protects Your Farm Equipment",
      subtitle: "Designed specifically for ease of use across Indian agricultural states with zero friction.",
      step1Title: "1. Register Your Machinery",
      step1Desc: "Add your tractor or equipment with brand, model, horsepower, and village location in under two minutes.",
      step2Title: "2. Real-Time Condition Analysis",
      step2Desc: "Our AI twin models monitor operating vibration, engine load, and temperature profiles against seasonal baselines.",
      step3Title: "3. Early Warning Alerts",
      step3Desc: "Receive SMS and WhatsApp alerts in your regional language before developing faults cause unexpected field stoppages.",
      step4Title: "4. Rapid Technician Dispatch",
      step4Desc: "Prioritized work order automatically dispatches certified local technicians with genuine spares directly to your farm.",
    },
    benefits: {
      badge: "FARMER IMPACT",
      title: "Why Indian Farmers Choose KisanSetu",
      subtitle: "Tangible savings, guaranteed reliability, and peace of mind during critical sowing and harvesting weeks.",
      b1Title: "42% Reduction in Downtime",
      b1Desc: "Prevent costly breakdown stalls during peak sowing and harvesting windows when every hour counts.",
      b2Title: "₹28,500 Avg. Annual Savings",
      b2Desc: "Fix minor sensor and bearing issues before they lead to expensive catastrophic gearbox or engine rebuilds.",
      b3Title: "Higher Resale Valuation",
      b3Desc: "A complete verified digital maintenance passport significantly boosts your tractor's second-hand market value.",
      b4Title: "Zero Guesswork Servicing",
      b4Desc: "Transparent billing, genuine certified spare parts, and fixed service turnaround timelines.",
    },
    faq: {
      badge: "FREQUENTLY ASKED QUESTIONS",
      title: "Got Questions? We Have Answers.",
      subtitle: "Common inquiries about registering machinery, scheduling maintenance, and tracking machine health.",
      items: [
        {
          q: "Is KisanSetu free for individual farmers?",
          a: "Yes! Farmer registration, machinery health card generation, and basic predictive alerts are completely free for all Indian farmers."
        },
        {
          q: "Can I register multiple tractors and implements?",
          a: "Absolutely. Farmers, custom hiring centers, and FPOs can register unlimited tractors, harvesters, rotavators, and laser levellers under a single account."
        },
        {
          q: "What if there is no internet in my farm field?",
          a: "KisanSetu is built with offline telemetry caching. When your tractor returns to network range or connects via Bluetooth, telemetry syncs automatically."
        },
        {
          q: "How does the AI predict machine failure before it happens?",
          a: "Our machine learning models continuously analyze subtle shifts in engine temperature, vibration harmonics, and oil pressure compared against thousands of hours of normal baseline operation."
        },
        {
          q: "Are the technicians certified?",
          a: "Yes. All technicians registered on KisanSetu are vetted, skill-graded, and equipped with genuine spare parts from authorized distributor hubs."
        }
      ],
    },
    footer: {
      description: "KisanSetu is India's dedicated agricultural machinery intelligence and predictive maintenance twin platform, keeping farm equipment ready and farmers empowered.",
      helplineTitle: "Toll-Free Kisan Machinery Helpline",
      helplineNumber: "1800-180-KISAN (5472)",
      quickLinks: "Quick Navigation",
      machineryHub: "Machinery Services",
      contactSupport: "Farmer Support",
      rightsReserved: "All rights reserved. Built for Indian Agriculture.",
      nationalMission: "Aligned with Sub-Mission on Agricultural Mechanization (SMAM) & Digital Agriculture Mission.",
    },
  },
  hi: {
    brandName: "किसानसेतु",
    brandTagline: "आज पहचानें। कल का ब्रेकडाउन बचाएं।",
    nav: {
      home: "मुख्य पृष्ठ",
      about: "हमारे बारे में",
      machinery: "मशीनरी",
      services: "सेवाएं",
      howItWorks: "यह कैसे काम करता है",
      contact: "संपर्क करें",
      login: "लॉगिन",
      registerFarmer: "किसान पंजीकरण",
      adminConsole: "फ्लीट ऑपरेशन्स कंसोल",
      farmerPortal: "किसान पोर्टल",
      languageToggle: "English",
    },
    hero: {
      titlePart1: "स्मार्ट मशीनरी।",
      titlePart2: "समर्थ किसान।",
      titlePart3: "समृद्ध भविष्य।",
      description: "भारतीय किसानों को कृषि मशीनरी के कुशल प्रबंधन, समय पर निवारक रखरखाव, डिजिटल सर्विस रिकॉर्ड और प्रमाणित तकनीशियनों से जोड़ने वाला आधुनिक कृषि-तकनीक मंच।",
      primaryCta: "किसान पंजीकरण करें →",
      secondaryCta: "मशीनरी सेवाएं देखें",
      supportingTagline: "भारत के अन्नदाताओं के लिए समर्पित आधुनिक तकनीकी समाधान।",
      stats: {
        registeredFarmers: "पंजीकृत किसान",
        machineryRecords: "निगरानी अधीन मशीनें",
        activeAlerts: "महत्वपूर्ण रोकथाम",
        fleetReadiness: "फ्लीट तत्परता",
        resolvedRepairs: "सफलतापूर्वक पूर्ण सेवाएं",
        totalDowntimeSaved: "घंटे ब्रेकडाउन से बचाए गए",
      },
    },
    ecosystem: {
      heading: "भारतीय कृषि पारिस्थितिकी तंत्र द्वारा विश्वसनीय",
      badge: "राष्ट्रीय कृषि नेटवर्क",
      partners: [
        "भा.कृ.अनु.प. - केंद्रीय कृषि अभियांत्रिकी संस्थान (ICAR)",
        "कृषि विज्ञान केंद्र नेटवर्क (KVK)",
        "राष्ट्रीय किसान उत्पादक संगठन (FPO महासंघ)",
        "राज्य कृषि एवं यंत्रीकरण विभाग",
        "प्राथमिक कृषि साख समितियां (PACS)",
        "नाबार्ड ग्रामीण नवाचार प्रकोष्ठ"
      ],
    },
    about: {
      badge: "मंच का परिचय",
      title: "भारतीय खेतों को आधुनिक इंजीनियरिंग से जोड़ना",
      subtitle: "किसानसेतु कृषि यंत्रों के अप्रत्याशित और महंगे ब्रेकडाउन को फसल चक्र के अनुसार सक्रिय, एआई-मार्गदर्शित सर्विस शेड्यूल में बदल देता है।",
      card1Title: "डिजिटल मशीनरी हेल्थ कार्ड",
      card1Desc: "प्रत्येक ट्रैक्टर और यंत्र को एक आजीवन डिजिटल स्वास्थ्य रिकॉर्ड मिलता है जिसमें काम के घंटे, इंजन तेल की गुणवत्ता, बेयरिंग स्वास्थ्य और सर्विस रिकॉर्ड दर्ज होते हैं।",
      card2Title: "एआई कंडीशन प्रेडिक्टर",
      card2Desc: "उन्नत मशीन लर्निंग मॉडल खेत में अचानक खराबी आने से 72 घंटे पहले ही यांत्रिक घिसाव की पहचान कर लेते हैं, जिससे कटाई में रुकावट नहीं आती।",
      card3Title: "प्रमाणित स्थानीय मिस्त्री",
      card3Desc: "असली प्रमाणित स्पेयर पार्ट्स से लैस प्रशिक्षित ग्राम-स्तरीय तकनीशियनों से तत्काल सीधा संपर्क।",
    },
    machinerySection: {
      badge: "उपकरण एवं स्वास्थ्य",
      title: "स्मार्ट मशीनरी प्रबंधन एवं डिजिटल हेल्थ कार्ड",
      subtitle: "अपने ट्रैक्टर, कंबाइन या रोटावेटर की स्थिति वास्तविक समय में देखें। कंपन, हाइड्रोलिक दबाव, इंजन तापमान और शेष उपयोगी जीवन की निगरानी करें।",
      healthCardTitle: "डिजिटल उपकरण पासपोर्ट",
      healthCardSubtitle: "प्रमाणित स्वास्थ्य स्कोर, पिछले सर्विस रिकॉर्ड और आगामी रखरखाव की जानकारी।",
      bookServiceBtn: "प्रमाणित सर्विस बुक करें",
      viewTwinBtn: "डिजिटल ट्विन टेलीमेट्री देखें",
    },
    howItWorks: {
      badge: "सरल 4-चरणीय प्रक्रिया",
      title: "किसानसेतु आपके कृषि यंत्रों की सुरक्षा कैसे करता है",
      subtitle: "भारतीय कृषि राज्यों की आवश्यकताओं के अनुसार बेहद सरल और सहज अनुभव।",
      step1Title: "1. अपनी मशीन पंजीकृत करें",
      step1Desc: "दो मिनट में अपने ट्रैक्टर या उपकरण का ब्रांड, मॉडल, हॉर्सपावर और अपने गांव का नाम दर्ज करें।",
      step2Title: "2. वास्तविक समय स्थिति विश्लेषण",
      step2Desc: "हमारा एआई ट्विन मॉडल इंजन लोड, कंपन और तापमान प्रोफाइल का विश्लेषण करता है।",
      step3Title: "3. समय पूर्व चेतावनी अलर्ट",
      step3Desc: "खेत में अचानक रुकावट आने से पहले अपनी भाषा में एसएमएस और व्हाट्सएप पर पूर्व चेतावनी प्राप्त करें।",
      step4Title: "4. त्वरित तकनीशियन सेवा",
      step4Desc: "प्रमाणित तकनीशियन असली स्पेयर पार्ट्स के साथ सीधे आपके खेत या गांव में मरम्मत के लिए पहुंचता है।",
    },
    benefits: {
      badge: "किसानों को लाभ",
      title: "भारतीय किसान किसानसेतु क्यों चुनते हैं?",
      subtitle: "बुवाई और कटाई के महत्वपूर्ण हफ्तों में ठोस बचत, सुनिश्चित विश्वसनीयता और मानसिक शांति।",
      b1Title: "42% कम ब्रेकडाउन रुकावट",
      b1Desc: "बुवाई और कटाई के महत्वपूर्ण समय में खेत में मशीन बंद होने से होने वाले भारी नुकसान से बचें।",
      b2Title: "₹28,500 औसत वार्षिक बचत",
      b2Desc: "सेंसर और बेयरिंग की छोटी खराबी को समय पर ठीक करें ताकि महंगा इंजन ओवरहॉल न कराना पड़े।",
      b3Title: "बेहतर रीसेल वैल्यू",
      b3Desc: "एक संपूर्ण प्रमाणित डिजिटल सर्विस हिस्ट्री आपके पुराने ट्रैक्टर की बाजार कीमत को बढ़ाती है।",
      b4Title: "पारदर्शी और भरोसेमंद सेवा",
      b4Desc: "पारदर्शी बिलिंग, 100% असली स्पेयर पार्ट्स और तय समय में कार्य पूरा करने की गारंटी।",
    },
    faq: {
      badge: "अक्सर पूछे जाने वाले प्रश्न",
      title: "आपके सवाल, हमारे जवाब",
      subtitle: "मशीन पंजीकरण, सर्विस शेड्यूलिंग और मशीन स्वास्थ्य से जुड़े सामान्य प्रश्न।",
      items: [
        {
          q: "क्या किसानसेतु व्यक्तिगत किसानों के लिए निःशुल्क है?",
          a: "हाँ! किसान पंजीकरण, मशीनरी हेल्थ कार्ड जनरेशन और बेसिक प्रेडिक्टिव अलर्ट सभी भारतीय किसानों के लिए पूरी तरह निःशुल्क हैं।"
        },
        {
          q: "क्या मैं कई ट्रैक्टर और कृषि यंत्र पंजीकृत कर सकता हूँ?",
          a: "बिल्कुल। किसान, कस्टम हायरिंग सेंटर और एफपीओ एक ही खाते में असीमित ट्रैक्टर, हार्वेस्टर, रोटावेटर और लेजर लेवलर जोड़ सकते हैं।"
        },
        {
          q: "यदि मेरे खेत में इंटरनेट कनेक्टिविटी न हो तो क्या होगा?",
          a: "किसानसेतु ऑफलाइन टेलीमेट्री कैशिंग का समर्थन करता है। जब भी आपका उपकरण नेटवर्क में आता है, डेटा स्वतः सिंक हो जाता है।"
        },
        {
          q: "एआई खराबी होने से पहले कैसे भविष्यवाणी करता है?",
          a: "हमारा मशीन लर्निंग मॉडल इंजन तापमान, कंपन और तेल के दबाव में सूक्ष्म परिवर्तनों की तुलना हजारों घंटों के सामान्य डेटा से करता है।"
        },
        {
          q: "क्या तकनीशियन प्रमाणित और प्रशिक्षित हैं?",
          a: "हाँ। किसानसेतु से जुड़े सभी तकनीशियन पूरी तरह प्रशिक्षित, मूल्यांकित और अधिकृत केंद्रों से असली स्पेयर पार्ट्स से सुसज्जित हैं।"
        }
      ],
    },
    footer: {
      description: "किसानसेतु भारत का समर्पित कृषि मशीनरी इंटेलिजेंस एवं प्रेडिक्टिव मेंटेनेंस ट्विन प्लेटफॉर्म है, जो कृषि यंत्रों को तैयार और किसानों को सशक्त रखता है।",
      helplineTitle: "टोल-फ्री किसान मशीनरी हेल्पलाइन",
      helplineNumber: "1800-180-KISAN (5472)",
      quickLinks: "त्वरित नेविगेशन",
      machineryHub: "मशीनरी सेवाएं",
      contactSupport: "किसान सहायता",
      rightsReserved: "सर्वाधिकार सुरक्षित। भारतीय कृषि के लिए निर्मित।",
      nationalMission: "कृषि यंत्रीकरण उप-मिशन (SMAM) एवं डिजिटल कृषि मिशन के अनुरूप।",
    },
  },
};
