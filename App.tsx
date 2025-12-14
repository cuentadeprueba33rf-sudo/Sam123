
import React, { useState, useEffect } from 'react';
import { Menu as MenuIcon, Copy, Heart, Brain, Eye, PenTool, Palette, Download, Sparkles, Layers, Moon, Flag, Crown, Share2, Snowflake, Gift, Ticket } from 'lucide-react';
import { Note, Gender, NoteStyle, Mood, AppBackground, AppMode, AppInterfaceTheme, FlagType } from './types';
import { generateDailyNote, getRandomFallbackNote } from './services/geminiService';
import NoteCard from './components/NoteCard';
import Menu from './components/Menu';
import Onboarding from './components/Onboarding';
import CreateNoteModal from './components/CreateNoteModal';
import MoodSelector from './components/MoodSelector';
import QualityEnhancer from './components/QualityEnhancer';
import ModeSelector from './components/ModeSelector';
import ServiceStatusBanner from './components/ServiceStatusBanner';
import LimitReachedModal from './components/LimitReachedModal';
import SocialMediaStudio from './components/SocialMediaStudio';
import RewardsPass from './components/RewardsPass';

// Declare html2canvas globally since it's loaded via CDN
declare global {
  interface Window {
    html2canvas: any;
  }
}

// Constants
const BASE_AI_USES = 10;
// VERSION FLAG: UPDATE FOR CHRISTMAS RESET
const APP_VERSION = 'v_christmas_royal_4.0';

// THEME CONFIGURATION OBJECT
const themeConfig = {
  essence: {
    bg: 'bg-[#F0EFEB]',
    text: 'text-ink',
    secondaryText: 'text-stone-400',
    buttonPrimary: 'bg-ink text-white shadow-xl hover:bg-stone-800',
    buttonSecondary: 'bg-white text-stone-500 hover:bg-stone-50 border border-stone-100',
    header: 'text-ink italic',
    accent: 'text-rose-400',
    splashBg: 'bg-[#F0EFEB]',
    splashIconColor: 'text-ink',
    splashPulse: 'bg-rose-200',
    loaderColor: 'bg-white/30 border-white/50 text-stone-400',
    font: 'font-serif'
  },
  cosmos: {
    bg: 'bg-[#0a0a0c]',
    text: 'text-slate-200',
    secondaryText: 'text-slate-500',
    buttonPrimary: 'bg-indigo-600 text-white shadow-indigo-900/50 hover:bg-indigo-500',
    buttonSecondary: 'bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800',
    header: 'text-indigo-300 font-sans tracking-widest uppercase',
    accent: 'text-indigo-500',
    splashBg: 'bg-[#050508]',
    splashIconColor: 'text-indigo-400',
    splashPulse: 'bg-purple-900',
    loaderColor: 'bg-indigo-900/20 border-indigo-500/30 text-indigo-300',
    font: 'font-sans'
  },
  coquette: {
    bg: 'bg-[#FFF0F5]',
    text: 'text-[#8B4A62]',
    secondaryText: 'text-[#DB7093]',
    buttonPrimary: 'bg-[#DB7093] text-white hover:bg-[#C71585] shadow-pink-200',
    buttonSecondary: 'bg-white text-pink-400 hover:bg-pink-50 border border-pink-100',
    header: 'text-[#C71585] font-serif italic font-bold',
    accent: 'text-pink-400',
    splashBg: 'bg-[#FFF0F5]',
    splashIconColor: 'text-pink-500',
    splashPulse: 'bg-pink-200',
    loaderColor: 'bg-white/40 border-pink-200 text-pink-400',
    font: 'font-serif'
  },
  christmas: {
    bg: 'aurora-bg', // Using the custom CSS class for Aurora
    text: 'text-[#d4af37]', // Royal Gold
    secondaryText: 'text-[#a3bfa8]',
    buttonPrimary: 'bg-[#8f1d24] text-[#fadd7e] shadow-[0_0_20px_rgba(143,29,36,0.6)] hover:bg-[#7a181e] border border-[#d4af37]/30 font-royal tracking-widest', // Velvet Red & Gold
    buttonSecondary: 'bg-[#1a0505]/80 backdrop-blur-md text-[#d4af37] hover:bg-[#2a0a0d] border border-[#d4af37]/50', // Dark velvet with gold text
    header: 'text-[#d4af37] font-christmas text-4xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]',
    accent: 'text-[#8f1d24]',
    splashBg: 'bg-[#0f0202]',
    splashIconColor: 'text-[#d4af37]',
    splashPulse: 'bg-[#8f1d24]',
    loaderColor: 'bg-[#d4af37]/20 border-[#d4af37] text-[#d4af37]',
    font: 'font-christmas'
  }
};

// --- CHRISTMAS DECORATIONS ---
const Snowfall = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
    {[...Array(30)].map((_, i) => (
      <div
        key={i}
        className="absolute text-white/40 animate-[fall_12s_linear_infinite]"
        style={{
          left: `${Math.random() * 100}%`,
          top: `-${Math.random() * 20}%`,
          animationDelay: `${Math.random() * 6}s`,
          fontSize: `${Math.random() * 8 + 4}px`,
          textShadow: '0 0 5px white'
        }}
      >
        ❄
      </div>
    ))}
    <style>{`
      @keyframes fall {
        0% { transform: translateY(-10vh) translateX(0) rotate(0deg); opacity: 0; }
        10% { opacity: 0.8; }
        50% { transform: translateY(50vh) translateX(10px) rotate(180deg); }
        100% { transform: translateY(110vh) translateX(-10px) rotate(360deg); opacity: 0; }
      }
    `}</style>
  </div>
);

const ChristmasLights = () => (
    <div className="fixed top-0 left-0 w-full flex justify-around pointer-events-none z-[5]">
        {[...Array(12)].map((_, i) => (
            <div key={i} className="flex flex-col items-center">
                 <div className="w-[1px] h-6 bg-black/30"></div>
                 <div className={`w-3 h-3 rounded-full shadow-[0_0_10px_currentColor] animate-glow ${['text-red-500', 'text-yellow-400', 'text-green-500', 'text-blue-400'][i % 4]}`} style={{ animationDelay: `${i * 0.2}s`, backgroundColor: 'currentColor' }}></div>
            </div>
        ))}
    </div>
);

// --- GIFT REVEAL COMPONENT ---
const GiftReveal = ({ onOpen }: { onOpen: () => void }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleClick = () => {
        setIsOpen(true);
        setTimeout(onOpen, 1000); // Wait for explosion animation
    };

    if (isOpen) {
        return (
            <div className="flex items-center justify-center animate-[ping_1s_ease-out_forwards]">
                 <Sparkles className="w-24 h-24 text-yellow-300" />
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center cursor-pointer animate-fade-in z-50" onClick={handleClick}>
             <p className="font-christmas text-[#d4af37] text-2xl mb-4 animate-pulse drop-shadow-md">Toca para abrir tu regalo</p>
             <div className="relative group hover:scale-110 transition-transform duration-300">
                <div className="absolute inset-0 bg-[#d4af37]/30 blur-xl rounded-full animate-pulse"></div>
                <Gift className="w-24 h-24 text-[#8f1d24] fill-[#50080c] drop-shadow-2xl animate-shake" strokeWidth={1.5} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="w-4 h-24 bg-[#d4af37] opacity-80 rounded-sm"></div>
                    <div className="w-24 h-4 bg-[#d4af37] opacity-80 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-sm"></div>
                </div>
             </div>
        </div>
    );
};

// --- VIP FLAG SELECTOR MODAL ---
const FlagSelectorModal = ({ isOpen, onClose, onSelect, current }: { isOpen: boolean, onClose: () => void, onSelect: (f: FlagType) => void, current: FlagType }) => {
  if (!isOpen) return null;
  const flags: {id: FlagType, label: string, gradient: string}[] = [
     { id: 'none', label: 'Ninguna', gradient: 'bg-gray-100 border' },
     { id: 'rainbow', label: 'Rainbow', gradient: 'bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500' },
     { id: 'bisexual', label: 'Bisexual', gradient: 'bg-gradient-to-r from-pink-600 via-purple-600 to-blue-700' },
     { id: 'lesbian', label: 'Lesbiana', gradient: 'bg-gradient-to-r from-orange-500 via-white to-pink-600' },
     { id: 'trans', label: 'Trans', gradient: 'bg-gradient-to-r from-blue-300 via-pink-300 to-white' },
     { id: 'pan', label: 'Pansexual', gradient: 'bg-gradient-to-r from-pink-500 via-yellow-400 to-blue-400' },
     { id: 'nonbinary', label: 'No Binario', gradient: 'bg-gradient-to-r from-yellow-400 via-white to-purple-600' },
  ];

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
       <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
          <h3 className="text-xl font-serif text-center mb-4 text-ink flex items-center justify-center gap-2">
            <Flag className="w-5 h-5 text-rose-500" /> Banderas de Firma
          </h3>
          <div className="grid grid-cols-2 gap-3">
             {flags.map(f => (
               <button 
                key={f.id}
                onClick={() => { onSelect(f.id); onClose(); }}
                className={`p-3 rounded-xl border-2 transition-all flex items-center gap-3 ${current === f.id ? 'border-ink bg-stone-50' : 'border-transparent hover:bg-stone-50'}`}
               >
                 <div className={`w-8 h-8 rounded-full shadow-sm ${f.gradient}`}></div>
                 <span className="text-sm font-sans font-medium text-stone-600">{f.label}</span>
               </button>
             ))}
          </div>
          <button onClick={onClose} className="w-full mt-4 py-3 text-sm text-stone-400 font-sans uppercase tracking-widest hover:text-ink">Cerrar</button>
       </div>
    </div>
  );
};

// Component: Zen Breathing Loader (Themed)
const BreathingLoader = ({ theme }: { theme: AppInterfaceTheme }) => {
  const [text, setText] = useState("Inhala...");
  const t = themeConfig[theme];
  
  useEffect(() => {
    const cycle = [
      { t: "Inhala...", d: 0 },
      { t: "Sostén...", d: 2000 },
      { t: "Exhala...", d: 4000 }
    ];
    let currentIndex = 0;
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % cycle.length;
      setText(cycle[currentIndex].t);
    }, 2000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-96 animate-fade-in">
      <div className="relative flex items-center justify-center">
        <div className={`w-24 h-24 rounded-full animate-breathe absolute blur-xl ${t.splashPulse} opacity-20`}></div>
        <div className={`w-20 h-20 rounded-full animate-breathe absolute backdrop-blur-sm border ${t.loaderColor}`}></div>
        <div className={`font-serif z-10 italic text-xl animate-pulse ${t.secondaryText}`}>{text}</div>
      </div>
    </div>
  );
};

// Component: Initial Splash Screen (Themed)
const SplashScreen = ({ theme }: { theme: AppInterfaceTheme }) => {
  const t = themeConfig[theme];
  return (
    <div className={`fixed inset-0 z-[200] flex flex-col items-center justify-center animate-fade-in ${t.splashBg}`}>
      <div className="relative z-10 flex flex-col items-center">
        <div className="mb-6 relative">
           <div className={`absolute inset-0 blur-xl opacity-50 animate-pulse rounded-full ${t.splashPulse}`}></div>
           {theme === 'christmas' ? (
             <div className="relative">
                 <Snowflake className={`w-20 h-20 relative z-10 animate-spin-slow ${t.splashIconColor}`} strokeWidth={1} />
                 <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-yellow-300 animate-pulse" />
             </div>
           ) : theme === 'cosmos' ? (
             <Moon className={`w-16 h-16 relative z-10 animate-float ${t.splashIconColor}`} />
           ) : theme === 'coquette' ? (
             <Heart className={`w-16 h-16 relative z-10 animate-float fill-current ${t.splashIconColor}`} />
           ) : (
             <Sparkles className={`w-16 h-16 relative z-10 animate-float ${t.splashIconColor}`} />
           )}
        </div>
        <p className={`font-sans text-xs uppercase tracking-[0.4em] mb-3 animate-pulse ${t.secondaryText}`}>
          Powered By
        </p>
        <h1 className={`text-5xl tracking-widest drop-shadow-sm ${t.header}`}>
          SAM IA
        </h1>
      </div>
    </div>
  );
};

// Component: Start Screen (Themed)
const StartScreen = ({ onStart, theme }: { onStart: () => void, theme: AppInterfaceTheme }) => {
  const t = themeConfig[theme];
  return (
    <div className="flex flex-col items-center justify-center h-full animate-fade-in z-20">
      <div className="mb-10 relative group">
         <div className={`absolute inset-0 blur-2xl opacity-40 rounded-full w-40 h-40 animate-pulse transition-opacity duration-1000 ${t.splashPulse}`}></div>
         {theme === 'christmas' ? (
            <div className="relative">
                 <Gift className="w-20 h-20 text-[#8f1d24] fill-[#50080c] animate-float drop-shadow-2xl" />
                 <Sparkles className="absolute -top-4 -right-4 w-10 h-10 text-[#d4af37] animate-pulse" />
            </div>
         ) : (
            <Sparkles className={`w-16 h-16 relative z-10 animate-float ${t.text}`} />
         )}
      </div>
      
      <h1 className={`text-4xl md:text-5xl text-center mb-3 tracking-wide drop-shadow-sm ${t.header}`}>
        Notas del Alma
      </h1>
      <p className={`font-sans text-[10px] uppercase tracking-[0.3em] mb-12 text-center max-w-[200px] leading-relaxed ${t.secondaryText}`}>
        {theme === 'christmas' ? 'Edición Navidad Real' : 'Tu dosis diaria de paz mental'}
      </p>

      <button 
        onClick={(e) => { e.stopPropagation(); onStart(); }}
        className={`group relative px-8 py-5 rounded-full font-sans text-xs uppercase tracking-[0.2em] transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl overflow-hidden ${t.buttonPrimary}`}
      >
        <span className="relative z-10 flex items-center gap-3">
          {theme === 'christmas' ? 'Revelar Regalo' : 'Revelar Mensaje'} <Sparkles className="w-3 h-3 animate-pulse" />
        </span>
        <div className="absolute inset-0 rounded-full bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
      </button>
    </div>
  );
};

const App: React.FC = () => {
  // STATE
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [savedNotes, setSavedNotes] = useState<Note[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGiftRevealing, setIsGiftRevealing] = useState(false); // NEW STATE FOR GIFT
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [screenshotMode, setScreenshotMode] = useState(false);
  
  // User Settings
  const [gender, setGender] = useState<Gender | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [userFlag, setUserFlag] = useState<FlagType>('none');
  const [currentMood, setCurrentMood] = useState<Mood>('neutral');
  const [currentMode, setCurrentMode] = useState<AppMode>('neutral');
  const [appBackground, setAppBackground] = useState<AppBackground>('auto');
  const [interfaceTheme, setInterfaceTheme] = useState<AppInterfaceTheme>('essence');
  
  // Rewards System State
  const [rewardLevel, setRewardLevel] = useState(0);
  const [nextClaimTime, setNextClaimTime] = useState(0);
  const [isRewardsOpen, setIsRewardsOpen] = useState(false);
  
  // Modals
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showMoodSelector, setShowMoodSelector] = useState(false);
  const [isEnhancerOpen, setIsEnhancerOpen] = useState(false);
  const [isModeSelectorOpen, setIsModeSelectorOpen] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [isFlagModalOpen, setIsFlagModalOpen] = useState(false);
  const [isSocialStudioOpen, setIsSocialStudioOpen] = useState(false); 

  // Usage Limit State
  const [aiUsageCount, setAiUsageCount] = useState(0);

  // Splash Screen State
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  
  // Service Warning Banner State
  const [showServiceBanner, setShowServiceBanner] = useState(true);
  const [vipWelcomeShown, setVipWelcomeShown] = useState(false);

  // VIP Logic
  const isVIP = username?.toLowerCase() === 'carolina';

  // --- FORCED RESET LOGIC ---
  useEffect(() => {
    const checkVersion = () => {
      const storedVersion = localStorage.getItem('app_version');
      if (storedVersion !== APP_VERSION) {
        // Clear all data
        localStorage.clear();
        localStorage.setItem('app_version', APP_VERSION);
        
        // Show Christmas update message
        alert("🎁 ¡Sorpresa Navideña de SAM! 🎁\n\nHe actualizado todo para que vivas una Navidad de Realeza. Tu experiencia ha sido reiniciada para darte la bienvenida al Palacio de Invierno.");
        
        // Reload page
        window.location.reload();
      }
    };
    checkVersion();
  }, []);

  // Handle Splash Screen Timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSplashVisible(false);
    }, 4000); 
    return () => clearTimeout(timer);
  }, []);

  // Initial Load
  useEffect(() => {
    const loadInitialData = async () => {
      // Usage
      const today = new Date().toDateString();
      const lastUsageDate = localStorage.getItem('last_usage_date');
      const savedCount = parseInt(localStorage.getItem('ai_usage_count') || '0');

      if (lastUsageDate !== today) {
        setAiUsageCount(0);
        localStorage.setItem('ai_usage_count', '0');
        localStorage.setItem('last_usage_date', today);
      } else {
        setAiUsageCount(savedCount);
      }

      // User Data
      const savedGender = localStorage.getItem('user_gender') as Gender | null;
      const savedUsername = localStorage.getItem('user_username');
      const savedFlag = localStorage.getItem('user_flag') as FlagType | null;

      const savedMood = localStorage.getItem('user_mood') as Mood | null;
      const savedMode = localStorage.getItem('user_mode') as AppMode | null;
      const savedTheme = localStorage.getItem('interface_theme') as AppInterfaceTheme | null;

      // Rewards
      const savedRewardLevel = parseInt(localStorage.getItem('reward_level') || '0');
      const savedNextClaim = parseInt(localStorage.getItem('next_claim_time') || '0');
      setRewardLevel(savedRewardLevel);
      setNextClaimTime(savedNextClaim);

      if (savedMood) setCurrentMood(savedMood);
      if (savedMode) setCurrentMode(savedMode);
      if (savedTheme) setInterfaceTheme(savedTheme);
      if (savedFlag) setUserFlag(savedFlag);

      if (savedGender && savedUsername) {
        setGender(savedGender);
        setUsername(savedUsername);
      } else {
        setShowOnboarding(true);
      }

      // Notes
      const localNotes = localStorage.getItem('saved_notes');
      if (localNotes) {
        try {
          setSavedNotes(JSON.parse(localNotes));
        } catch (e) {
          console.error("Error parsing saved notes", e);
        }
      }

      const savedBg = localStorage.getItem('app_background') as AppBackground | null;
      if (savedBg) {
        setAppBackground(savedBg);
      }
    };
    loadInitialData();
  }, []);

  // VIP Welcome Toast
  useEffect(() => {
    if (isVIP && !isSplashVisible && !showOnboarding && !vipWelcomeShown) {
      setTimeout(() => {
        alert("✨ Bienvenida Carolina amiga de SAMUEL ✨");
        setVipWelcomeShown(true);
      }, 1000);
    }
  }, [isVIP, isSplashVisible, showOnboarding, vipWelcomeShown]);

  useEffect(() => {
    localStorage.setItem('saved_notes', JSON.stringify(savedNotes));
  }, [savedNotes]);

  // Calculate Dynamic AI Limit
  const calculateMaxAiUses = () => {
     // Start with 10
     let bonus = 0;
     if (rewardLevel >= 1) bonus += 3;  // Total 13
     if (rewardLevel >= 3) bonus += 7;  // Total 20
     if (rewardLevel >= 5) bonus += 10; // Total 30
     if (rewardLevel >= 7) bonus += 20; // Total 50
     return BASE_AI_USES + bonus;
  };

  const currentMaxUses = calculateMaxAiUses();

  const incrementAiUsage = () => {
    const today = new Date().toDateString();
    setAiUsageCount(prev => {
      const newCount = prev + 1;
      localStorage.setItem('ai_usage_count', newCount.toString());
      localStorage.setItem('last_usage_date', today);
      return newCount;
    });
  };

  const checkAiLimit = (): boolean => {
    if (aiUsageCount >= currentMaxUses) {
      setShowLimitModal(true);
      return false;
    }
    return true;
  };

  // Modified Onboarding Complete
  const handleOnboardingComplete = async (selectedGender: Gender, name: string) => {
    localStorage.setItem('user_gender', selectedGender);
    localStorage.setItem('user_username', name);
    // Set default theme to Christmas for new users during this season
    localStorage.setItem('interface_theme', 'christmas');
    setInterfaceTheme('christmas');

    setGender(selectedGender);
    setUsername(name);
    setShowOnboarding(false);
    
    // Initial generation
    handleGenerateNew(selectedGender, 'festive', 'christmas');
  };

  const handleBackgroundChange = (bg: AppBackground) => {
    setAppBackground(bg);
    localStorage.setItem('app_background', bg);
  };

  const handleInterfaceThemeChange = (theme: AppInterfaceTheme) => {
    setInterfaceTheme(theme);
    localStorage.setItem('interface_theme', theme);
  };

  // Handle Flag Change
  const handleFlagChange = (flag: FlagType) => {
    setUserFlag(flag);
    localStorage.setItem('user_flag', flag);
    // Update current note if exists
    if (currentNote) {
       setCurrentNote({ ...currentNote, userFlag: flag });
    }
  };

  const handleMoodSelect = async (mood: Mood) => {
    setCurrentMood(mood);
    localStorage.setItem('user_mood', mood);
    setShowMoodSelector(false);
    
    if (!gender) return;
    
    // If mood is festive, force christmas mode momentarily for better results
    const modeToUse = mood === 'festive' ? 'christmas' : currentMode;
    handleGenerateNew(gender, mood, modeToUse);
  };

  const handleModeSelect = async (mode: AppMode) => {
    setCurrentMode(mode);
    localStorage.setItem('user_mode', mode);
    
    if (gender) {
        handleGenerateNew(gender, currentMood, mode);
    }
  };

  // Reward Claim Handler
  const handleClaimReward = (newLevel: number) => {
     setRewardLevel(newLevel);
     localStorage.setItem('reward_level', newLevel.toString());
     
     // Set next claim time (1 hour from now)
     const nextTime = Date.now() + 3600000;
     setNextClaimTime(nextTime);
     localStorage.setItem('next_claim_time', nextTime.toString());
  };

  const handleGenerateNew = async (
    forcedGender?: Gender, 
    forcedMood?: Mood, 
    forcedMode?: AppMode
  ) => {
    const g = forcedGender || gender;
    const m = forcedMood || currentMood;
    const mo = forcedMode || currentMode;

    if (!g) {
      setShowOnboarding(true); 
      return;
    }
    
    if (!checkAiLimit()) return;

    setIsLoading(true);
    // If Christmas mode, prepare Gift Reveal
    if (mo === 'christmas') {
        setIsGiftRevealing(true);
    }
    
    const note = await generateDailyNote(g, m, mo);
    const noteWithFlag = { ...note, userFlag: isVIP ? userFlag : 'none' };
    
    setCurrentNote(noteWithFlag);
    if (note.isGeneratedByAI) {
      incrementAiUsage();
    }
    
    // If NOT christmas mode, stop loading immediately. 
    // If IS christmas mode, 'isLoading' stays true until GiftReveal component calls onOpen
    if (mo !== 'christmas') {
        setIsLoading(false);
    }
  };

  const handleGiftOpen = () => {
      setIsGiftRevealing(false);
      setIsLoading(false);
  };

  const handleGetFallbackNote = () => {
    // Pass the reward level to unlock extended collection
    const note = getRandomFallbackNote(rewardLevel);
    setCurrentNote({ ...note, userFlag: isVIP ? userFlag : 'none' });
  };

  const handleOpenEnhancer = () => {
    if (!checkAiLimit()) return;
    setIsEnhancerOpen(true);
  };

  const handleCreateOwnNote = (note: Note) => {
    setCurrentNote({ ...note, userFlag: isVIP ? userFlag : 'none' });
  };

  const handleRestorationComplete = (note: Note) => {
    incrementAiUsage(); 
    const finalNote = { ...note, userFlag: isVIP ? userFlag : 'none' };
    setCurrentNote(finalNote);
    if (!savedNotes.find(n => n.content === finalNote.content)) {
       setSavedNotes([finalNote, ...savedNotes]);
    }
    setTimeout(() => {
       handleDownloadImage();
    }, 1000);
  };

  const handleSaveNote = () => {
    if (currentNote && !savedNotes.find(n => n.id === currentNote.id)) {
      setSavedNotes([currentNote, ...savedNotes]);
    }
  };

  const handleCycleStyle = () => {
    if (!currentNote) return;
    const styles: NoteStyle[] = ['christmas', 'classic', 'midnight', 'aura', 'minimal', 'botanical', 'cinema', 'vintage', 'rose'];
    const currentIndex = styles.indexOf(currentNote.style || 'classic');
    const nextIndex = (currentIndex + 1) % styles.length;
    
    setCurrentNote({
      ...currentNote,
      style: styles[nextIndex]
    });
  };

  const handleSelectStyle = (style: NoteStyle) => {
    if (!currentNote) return;
    setCurrentNote({
        ...currentNote,
        style: style
    });
  }

  const handleCopyText = async () => {
    if (!currentNote) return;
    try {
        await navigator.clipboard.writeText(`"${currentNote.content}" — ${currentNote.author}`);
        alert("Texto copiado al portapapeles ✨");
    } catch (err) {
        console.error('Failed to copy', err);
    }
  };

  const handleDownloadImage = async () => {
    const element = document.getElementById('story-capture-stage');
    if (!element || !window.html2canvas) return;

    setIsGeneratingImage(true);

    setTimeout(async () => {
      try {
        const canvas = await window.html2canvas(element, {
          scale: 1, 
          backgroundColor: null,
          logging: false,
          useCORS: true, 
          allowTaint: true,
          width: 1080,
          height: 1920
        });

        const link = document.createElement('a');
        link.download = `nota-del-alma-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        setIsGeneratingImage(false);
      } catch (error) {
        console.error("Error downloading image", error);
        setIsGeneratingImage(false);
        alert("Hubo un problema al guardar la imagen.");
      }
    }, 100);
  };

  const isSaved = currentNote ? savedNotes.some(n => n.id === currentNote.id) : false;

  // Get current Theme Config
  const activeTheme = themeConfig[interfaceTheme];
  
  // Specific override for NoteCard BG
  const getAutoBackgroundColor = (style?: NoteStyle) => {
     switch(style) {
       case 'midnight': return '#0f1115';
       case 'cinema': return '#1a1a1a';
       case 'botanical': return '#e8ede8';
       case 'vintage': return '#ebe6da';
       case 'rose': return '#fff0f5';
       case 'christmas': return '#2a0a0d';
       default: return '#F0EFEB';
     }
  };

  return (
    <div 
      className={`min-h-screen w-full relative flex flex-col items-center justify-center transition-colors duration-700 ease-in-out ${screenshotMode ? 'cursor-zoom-out' : ''} ${activeTheme.bg}`}
      onClick={() => setScreenshotMode(false)}
    >
      {/* CHRISTMAS DECORATIONS */}
      {interfaceTheme === 'christmas' && (
        <>
            <Snowfall />
            <ChristmasLights />
        </>
      )}

      {/* SPLASH SCREEN */}
      {isSplashVisible && <SplashScreen theme={interfaceTheme} />}
      
      {/* SERVICE WARNING BANNER */}
      {showServiceBanner && !isSplashVisible && (
        <ServiceStatusBanner onClose={() => setShowServiceBanner(false)} />
      )}

      {/* MODALS */}
      <LimitReachedModal 
        isOpen={showLimitModal} 
        onClose={() => setShowLimitModal(false)} 
        onSwitchToManual={() => {
           setShowLimitModal(false);
           setIsCreateModalOpen(true);
        }}
      />
      
      {isModeSelectorOpen && (
        <ModeSelector 
          currentMode={currentMode}
          onSelect={handleModeSelect}
          onClose={() => setIsModeSelectorOpen(false)}
        />
      )}

      <FlagSelectorModal 
        isOpen={isFlagModalOpen}
        onClose={() => setIsFlagModalOpen(false)}
        onSelect={handleFlagChange}
        current={userFlag}
      />

      <RewardsPass 
        isOpen={isRewardsOpen}
        onClose={() => setIsRewardsOpen(false)}
        currentLevel={rewardLevel}
        nextClaimTime={nextClaimTime}
        onClaimReward={handleClaimReward}
      />

      {currentNote && (
          <SocialMediaStudio 
            isOpen={isSocialStudioOpen}
            onClose={() => setIsSocialStudioOpen(false)}
            note={currentNote}
          />
      )}

      {/* Texture Overlay (Global) */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-30 z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.1'/%3E%3C/svg%3E")`
        }}
      />

      {/* --- HIDDEN STORY STAGE --- */}
      {currentNote && (
        <div 
          id="story-capture-stage"
          style={{
            position: 'fixed',
            top: '0',
            left: '-9999px',
            width: '1080px',
            height: '1920px',
            zIndex: -1,
            backgroundColor: getAutoBackgroundColor(currentNote.style), 
            backgroundImage: (!['midnight', 'cinema', 'christmas'].includes(currentNote.style))
              ? `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`
              : 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px'
          }}
        >
          <div className="scale-[2.2] transform origin-center shadow-2xl">
            <NoteCard note={currentNote} viewMode={true} />
          </div>
          
          <div className="absolute bottom-40 text-center opacity-70">
            <p className={`font-serif text-4xl italic tracking-wider ${['midnight', 'cinema', 'christmas'].includes(currentNote.style) ? 'text-white' : 'text-stone-800'}`}>
              Notas del Alma
            </p>
            <p className={`font-sans text-xl uppercase tracking-[0.3em] mt-4 ${['midnight', 'cinema', 'christmas'].includes(currentNote.style) ? 'text-stone-500' : 'text-stone-400'}`}>
              @notasdelalma
            </p>
          </div>
        </div>
      )}

      {/* Overlays */}
      {showOnboarding && !isSplashVisible && <Onboarding onComplete={handleOnboardingComplete} />}
      {showMoodSelector && !isSplashVisible && <MoodSelector onSelect={handleMoodSelect} onClose={() => setShowMoodSelector(false)} />}
      <CreateNoteModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onCreate={handleCreateOwnNote} />
      <QualityEnhancer isOpen={isEnhancerOpen} onClose={() => setIsEnhancerOpen(false)} onRestorationComplete={handleRestorationComplete} />

      {/* Header */}
      <nav className={`fixed top-0 w-full p-6 flex justify-between items-center z-30 transition-all duration-500 ${screenshotMode ? 'opacity-0 -translate-y-10 pointer-events-none' : 'opacity-100'}`}>
        <div className="flex items-center gap-2">
           <div className={`w-2 h-2 rounded-full animate-pulse bg-current ${activeTheme.text}`}></div>
           <span className={`text-lg ${activeTheme.header} transition-colors duration-500`}>Notas del Alma</span>
           {isVIP && <Crown className="w-4 h-4 text-amber-400 animate-pulse" title="VIP" />}
           <span className={`ml-2 text-[10px] font-sans opacity-50 px-2 py-0.5 rounded-full ${activeTheme.text} border border-current`}>
             {aiUsageCount}/{currentMaxUses}
           </span>
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); setIsMenuOpen(true); }}
          className={`p-2 rounded-full transition-colors ${activeTheme.text} hover:opacity-70`}
        >
          <MenuIcon className="w-6 h-6" />
        </button>
      </nav>

      {/* Main Content */}
      <main className={`w-full max-w-xl px-4 z-10 transition-all duration-500 flex flex-col justify-center items-center ${screenshotMode ? 'scale-105' : 'scale-100'} flex-grow`}>
        {isLoading ? (
          // IF CHRISTMAS MODE AND GIFT IS READY
          isGiftRevealing ? (
            <GiftReveal onOpen={handleGiftOpen} />
          ) : (
            // STANDARD LOADER
            <BreathingLoader theme={interfaceTheme} />
          )
        ) : (
          currentNote ? (
            <NoteCard note={currentNote} viewMode={screenshotMode || isGeneratingImage} />
          ) : (
            !showOnboarding && <StartScreen onStart={() => handleGenerateNew()} theme={interfaceTheme} />
          )
        )}
      </main>

      {/* Loading Overlay */}
      {isGeneratingImage && (
        <div className="fixed inset-0 bg-ink/50 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center gap-4 animate-fade-in">
            <div className="w-8 h-8 border-4 border-stone-200 border-t-ink rounded-full animate-spin"></div>
            <p className="font-sans text-sm text-ink font-medium">Preparando recuerdo...</p>
          </div>
        </div>
      )}

      {screenshotMode && (
        <div className="fixed top-24 left-0 w-full text-center z-40 pointer-events-none animate-pulse">
          <p className="inline-block bg-black/50 text-white px-4 py-2 rounded-full font-sans text-xs uppercase tracking-widest backdrop-blur-md">
            Toca la pantalla para salir
          </p>
        </div>
      )}

      {/* Controls */}
      {currentNote && !isLoading && (
        <div className={`fixed bottom-6 md:bottom-10 w-full px-4 flex justify-center items-center gap-3 md:gap-6 z-30 transition-all duration-500 ${screenshotMode ? 'opacity-0 translate-y-20 pointer-events-none' : 'opacity-100'}`}>
          
          <button 
            onClick={(e) => { e.stopPropagation(); setShowMoodSelector(true); }}
            className={`group p-3 md:p-4 shadow-lg rounded-full transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl active:scale-95 flex items-center justify-center ${activeTheme.buttonSecondary}`}
            title="Cambiar estado de ánimo"
          >
            <Brain className="w-5 h-5" />
          </button>

          <button 
            onClick={(e) => { e.stopPropagation(); handleSaveNote(); }}
            className={`group p-3 md:p-4 shadow-lg rounded-full transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl active:scale-95 flex items-center justify-center ${activeTheme.buttonSecondary}`}
            title="Guardar en favoritos"
          >
            <Heart className={`w-5 h-5 transition-colors ${isSaved ? 'fill-current text-rose-500' : ''}`} />
          </button>

          <button 
            onClick={(e) => { e.stopPropagation(); handleGenerateNew(); }}
            className={`group p-5 shadow-2xl rounded-full transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-2xl active:scale-90 flex items-center justify-center ring-2 ring-white/20 ${activeTheme.buttonPrimary} ${aiUsageCount >= currentMaxUses ? 'opacity-50 grayscale' : ''}`}
            title="Nueva Nota"
          >
            <Sparkles className="w-7 h-7" />
          </button>

          <button 
            onClick={(e) => { e.stopPropagation(); handleCopyText(); }}
            className={`group p-3 md:p-4 shadow-lg rounded-full transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl active:scale-95 flex items-center justify-center ${activeTheme.buttonSecondary}`}
            title="Copiar Texto"
          >
            <Copy className="w-5 h-5" />
          </button>
          
          <button 
            onClick={(e) => { e.stopPropagation(); handleDownloadImage(); }}
            className={`group p-3 md:p-4 shadow-lg rounded-full transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl active:scale-95 flex items-center justify-center ${activeTheme.buttonSecondary}`}
            title="Descargar imagen"
          >
              <Download className="w-5 h-5" />
          </button>

        </div>
      )}

      {/* Secondary Tools */}
      {currentNote && !isLoading && (
        <div className={`fixed right-4 md:right-8 bottom-32 md:bottom-36 flex flex-col gap-3 z-30 transition-all duration-500 ${screenshotMode ? 'opacity-0 translate-x-10 pointer-events-none' : 'opacity-100'}`}>
          
          {/* Rewards Button */}
          <button 
              onClick={(e) => { e.stopPropagation(); setIsRewardsOpen(true); }}
              className={`p-3 backdrop-blur shadow-sm rounded-full transition-all duration-300 active:scale-90 ${activeTheme.buttonSecondary} border-[#d4af37] text-[#d4af37] group`}
              title="Pase de Recompensas"
          >
              <Ticket className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              {/* Notification Dot if rewards available (simplified logic) */}
              {rewardLevel < 7 && Date.now() >= nextClaimTime && (
                <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full animate-pulse border-2 border-white"></span>
              )}
          </button>

          {/* SOCIAL STUDIO BUTTON */}
          <button 
              onClick={(e) => { e.stopPropagation(); setIsSocialStudioOpen(true); }}
              className={`p-3 backdrop-blur shadow-sm rounded-full transition-all duration-300 active:scale-90 ${activeTheme.buttonSecondary} border-indigo-200 text-indigo-500 group`}
              title="Social Studio (Viral)"
          >
              <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>

          {/* VIP ONLY BUTTON */}
          {isVIP && (
             <button 
                onClick={(e) => { e.stopPropagation(); setIsFlagModalOpen(true); }}
                className={`p-3 backdrop-blur shadow-sm rounded-full transition-all duration-300 active:scale-90 ${activeTheme.buttonSecondary} border-rose-200 text-rose-500`}
                title="Elegir Bandera (VIP)"
              >
                  <Flag className="w-5 h-5" />
              </button>
          )}

          <button 
            onClick={(e) => { e.stopPropagation(); handleCycleStyle(); }}
            className={`p-3 backdrop-blur shadow-sm rounded-full transition-all duration-300 group active:scale-90 ${activeTheme.buttonSecondary}`}
            title="Cambiar Estilo Visual"
          >
              <Palette className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          </button>

          <button 
            onClick={(e) => { e.stopPropagation(); setIsCreateModalOpen(true); }}
            className={`p-3 backdrop-blur shadow-sm rounded-full transition-all duration-300 active:scale-90 ${activeTheme.buttonSecondary}`}
            title="Escribir mi nota"
          >
              <PenTool className="w-5 h-5" />
          </button>

          <button 
            onClick={(e) => { e.stopPropagation(); setIsModeSelectorOpen(true); }}
            className={`p-3 backdrop-blur shadow-sm rounded-full transition-all duration-300 active:scale-90 ${activeTheme.buttonSecondary} ${currentMode !== 'neutral' ? 'ring-2 ring-current' : ''}`}
            title="Cambiar Vibra (Modo)"
          >
              <Layers className="w-5 h-5" />
          </button>

          <button 
              onClick={(e) => { e.stopPropagation(); setScreenshotMode(true); }}
              className={`p-3 backdrop-blur shadow-sm rounded-full transition-all duration-300 active:scale-90 ${activeTheme.buttonSecondary}`}
              title="Modo limpio"
          >
              <Eye className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Drawer Menu */}
      <Menu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        savedNotes={savedNotes}
        onSelectNote={setCurrentNote}
        onGenerateNew={() => setShowMoodSelector(true)} 
        onCreateOwn={() => setIsCreateModalOpen(true)}
        onOpenEnhancer={handleOpenEnhancer}
        onGetFallbackNote={handleGetFallbackNote}
        onSelectStyle={handleSelectStyle}
        currentBackground={appBackground}
        onSetBackground={handleBackgroundChange}
        currentInterfaceTheme={interfaceTheme}
        onSetInterfaceTheme={handleInterfaceThemeChange}
      />

    </div>
  );
};

export default App;
