import React, { createContext, useState, useContext, useMemo } from 'react';
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "./utils/createPageUrl";
import { 
  Home, 
  Search, 
  Leaf, 
  TrendingUp, 
  Cloud, 
  MessageCircle, 
  User,
  Menu,
  X,
  Bot,
  Languages
} from "lucide-react";
import { Button } from "./components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./components/ui/dropdown-menu";

// --- Language Context and Provider ---
const translations = {
  en: {
    // Layout
    dashboard: 'Dashboard',
    diseaseDetection: 'Disease Detection',
    myCrops: 'My Crops',
    expertTips: 'Expert Tips',
    weather: 'Weather',
    community: 'Community',
    chatAssistant: 'Chat Assistant',
    yourFarmingAssistant: 'Your Farming Assistant',
    empoweringFarmers: 'Empowering farmers with smart agricultural solutions',
    footerRights: '© 2024 Krishi Shakhi. Built for sustainable farming.',

    // Dashboard
    greetingMorning: 'Good morning',
    greetingAfternoon: 'Good afternoon',
    greetingEvening: 'Good evening',
    farmer: 'Farmer',
    dashboardSubtitle: "Here's what's happening with your crops today",
    detectDisease: 'Detect Disease',
    scanPlantForDiseases: 'Scan plant for diseases',
    addCrop: 'Add Crop',
    registerNewCrop: 'Register new crop',
    getTips: 'Get Tips',
    expertFarmingAdvice: 'Expert farming advice',
    checkWeather: 'Check Weather',
    weatherForecast: 'Weather forecast',
    todaysWeather: "Today's Weather",
    humidity: "Humidity",
    farmingTip: "Farming Tip",
    activeCrops: 'Active Crops',
    viewAll: 'View All',
    acres: 'acres',
    planted: 'Planted',
    noActiveCropsYet: 'No active crops yet. Add one to get started!',
    recentDetections: 'Recent Detections',
    severity: 'severity',
    noRecentDetections: 'No diseases detected recently. Good job!',
    featuredTips: 'Featured Tips',
    moreTips: 'More Tips',
    noTipsAvailable: 'No expert tips available at the moment.',

    // Chat
    chatWelcome: 'Hello! I am your Krishi Shakhi assistant. How can I help you today?',
    typeYourMessage: 'Type your message here...',
    sendMessage: 'Send',
  },
  hi: {
    // Layout
    dashboard: 'डैशबोर्ड',
    diseaseDetection: 'रोग पहचान',
    myCrops: 'मेरी फसलें',
    expertTips: 'विशेषज्ञ सुझाव',
    weather: 'मौसम',
    community: 'समुदाय',
    chatAssistant: 'सहायक से चैट करें',
    yourFarmingAssistant: 'आपका कृषि सहायक',
    empoweringFarmers: 'स्मार्ट कृषि समाधानों के साथ किसानों को सशक्त बनाना',
    footerRights: '© 2024 कृषि सखी। सतत खेती के लिए बनाया गया।',

    // Dashboard
    greetingMorning: 'सुप्रभात',
    greetingAfternoon: 'शुभ दोपहर',
    greetingEvening: 'शुभ संध्या',
    farmer: 'किसान',
    dashboardSubtitle: 'आज आपकी फसलों का हालचाल',
    detectDisease: 'रोग पहचानें',
    scanPlantForDiseases: 'पौधों के रोगों के लिए स्कैन करें',
    addCrop: 'फसल जोड़ें',
    registerNewCrop: 'नई फसल दर्ज करें',
    getTips: 'सुझाव प्राप्त करें',
    expertFarmingAdvice: 'विशेषज्ञ कृषि सलाह',
    checkWeather: 'मौसम जांचें',
    weatherForecast: 'मौसम पूर्वानुमान',
    todaysWeather: 'आज का मौसम',
    humidity: "नमी",
    farmingTip: "खेती युक्ति",
    activeCrops: 'सक्रिय फसलें',
    viewAll: 'सभी देखें',
    acres: 'एकड़',
    planted: 'लगाया गया',
    noActiveCropsYet: 'अभी तक कोई सक्रिय फसल नहीं है। आरंभ करने के लिए एक जोड़ें!',
    recentDetections: 'हाल की पहचान',
    severity: 'गंभीरता',
    noRecentDetections: 'हाल ही में कोई रोग नहीं पाया गया। बहुत बढ़िया!',
    featuredTips: 'विशेष सुझाव',
    moreTips: 'और सुझाव',
    noTipsAvailable: 'फिलहाल कोई विशेषज्ञ सुझाव उपलब्ध नहीं है।',

    // Chat
    chatWelcome: 'नमस्ते! मैं आपकी कृषि सखी सहायक हूँ। मैं आज आपकी कैसे मदद कर सकती हूँ?',
    typeYourMessage: 'अपना संदेश यहां टाइप करें...',
    sendMessage: 'भेजें',
  }
};

const LanguageContext = createContext();

const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');

  const setLanguageAndStore = (lang) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = useMemo(() => (key) => {
    return translations[language][key] || key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage: setLanguageAndStore, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
// --- End of Language Context ---

const AppLayout = ({ children }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t, setLanguage, language } = useLanguage();

  const navigationItems = [
    { titleKey: "dashboard", url: createPageUrl("Dashboard"), icon: Home, color: "text-emerald-600" },
    { titleKey: "diseaseDetection", url: createPageUrl("DiseaseDetection"), icon: Search, color: "text-red-600" },
    { titleKey: "myCrops", url: createPageUrl("CropManagement"), icon: Leaf, color: "text-green-600" },
    { titleKey: "expertTips", url: createPageUrl("ExpertTips"), icon: TrendingUp, color: "text-blue-600" },
    { titleKey: "weather", url: createPageUrl("Weather"), icon: Cloud, color: "text-sky-600" },
    { titleKey: "chatAssistant", url: createPageUrl("Chat"), icon: Bot, color: "text-indigo-600" },
    { titleKey: "community", url: createPageUrl("Community"), icon: MessageCircle, color: "text-purple-600" }
  ];

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50">
      <style>
        {`
          :root {
            --primary-emerald: #10b981;
            --primary-emerald-light: #34d399;
            --primary-emerald-dark: #059669;
            --accent-gold: #f59e0b;
            --text-primary: #065f46;
            --bg-card: rgba(255, 255, 255, 0.9);
          }
        `}
      </style>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-emerald-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-emerald-900">Krishi Shakhi</h1>
                <p className="text-xs text-emerald-600">{t('yourFarmingAssistant')}</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <Link key={item.titleKey} to={item.url}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className={`h-11 gap-3 px-4 transition-all duration-200 ${
                        isActive 
                          ? "bg-emerald-600 text-white shadow-lg" 
                          : "text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
                      }`}
                    >
                      <item.icon className={`w-4 h-4 ${isActive ? "text-white" : item.color}`} />
                      <span className="font-medium">{t(item.titleKey)}</span>
                    </Button>
                  </Link>
                );
              })}
            </nav>

            {/* Profile & Language */}
            <div className="hidden md:flex items-center gap-3">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon" className="border-emerald-200">
                            <Languages className="w-4 h-4 text-emerald-600" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setLanguage('en')} disabled={language === 'en'}>
                            English
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setLanguage('hi')} disabled={language === 'hi'}>
                            हिन्दी (Hindi)
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

              <Button variant="outline" size="icon" className="border-emerald-200">
                <User className="w-4 h-4 text-emerald-600" />
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="outline"
              size="icon"
              className="md:hidden border-emerald-200"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? (
                <X className="w-4 h-4 text-emerald-600" />
              ) : (
                <Menu className="w-4 h-4 text-emerald-600" />
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden" onClick={toggleMobileMenu}>
          <div className="absolute top-20 left-4 right-4 bg-white rounded-2xl shadow-2xl border border-emerald-100 p-4">
            <nav className="space-y-2">
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <Link key={item.titleKey} to={item.url} onClick={toggleMobileMenu}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className={`w-full justify-start h-12 gap-3 px-4 ${
                        isActive 
                          ? "bg-emerald-600 text-white" 
                          : "text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
                      }`}
                    >
                      <item.icon className={`w-5 h-5 ${isActive ? "text-white" : item.color}`} />
                      <span className="font-medium">{t(item.titleKey)}</span>
                    </Button>
                  </Link>
                );
              })}
                <div className="pt-4">
                    <Button onClick={() => { setLanguage('en'); toggleMobileMenu(); }} variant={language === 'en' ? 'default' : 'outline'} className="w-full mb-2">English</Button>
                    <Button onClick={() => { setLanguage('hi'); toggleMobileMenu(); }} variant={language === 'hi' ? 'default' : 'outline'} className="w-full">हिन्दी (Hindi)</Button>
                </div>
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-emerald-900 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Leaf className="w-5 h-5 text-emerald-400" />
            <span className="text-lg font-semibold">Krishi Shakhi</span>
          </div>
          <p className="text-emerald-200 text-sm">
            {t('empoweringFarmers')}
          </p>
          <div className="mt-4 text-xs text-emerald-300">
            {t('footerRights')}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function Layout({ children }) {
    return (
        <LanguageProvider>
            <AppLayout>{children}</AppLayout>
        </LanguageProvider>
    )
}