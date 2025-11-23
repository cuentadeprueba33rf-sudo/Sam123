

import React, { useState, useEffect } from 'react';
import { Menu as MenuIcon, Instagram, Heart, Brain, Eye, PenTool, Palette, Download, Sparkles, Command } from 'lucide-react';
import { Note, Gender, NoteStyle, Mood, AppBackground } from './types';
import { generateDailyNote, getRandomFallbackNote } from './services/geminiService';
import NoteCard from './components/NoteCard';
import Menu from './components/Menu';
import Onboarding from './components/Onboarding';
import CreateNoteModal from './components/CreateNoteModal';
import MoodSelector from './components/MoodSelector';
import QualityEnhancer from './components/QualityEnhancer';
import AIInstructionsModal from './components/AIInstructionsModal';
import ServiceStatusBanner from './components/ServiceStatusBanner';
import LimitReachedModal from './components/LimitReachedModal';

// Declare html2canvas globally since it's loaded via CDN
declare global {
  interface Window {
    html2canvas: any;
  }
}

// Constants
const MAX_AI_USES = 10;

// New Component: Zen Breathing Loader
const BreathingLoader = () => {
  const [text, setText] = useState("Inhala...");
  
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
    }, 2000); // Change text every 2 seconds roughly matching the breathing

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-96 animate-fade-in">
      <div className="relative flex items-center justify-center">
        {/* Breathing Circle */}
        <div className="w-24 h-24 bg-white/20 rounded-full animate-breathe absolute blur-xl"></div>
        <div className="w-20 h-20 bg-white/30 rounded-full animate-breathe absolute backdrop-blur-sm border border-white/50"></div>
        <div className="font-serif text-stone-400 z-10 italic text-xl animate-pulse">{text}</div>
      </div>
    </div>
  );
};

// Component: Initial Splash Screen
const SplashScreen = () => (
  <div className="fixed inset-0 z-[200] bg-[#F0EFEB] flex flex-col items-center justify-center animate-fade-in">
    <div 
      className="absolute inset-0 pointer-events-none opacity-30 z-0"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.1'/%3E%3C/svg%3E")`
      }}
    />
    <div className="relative z-10 flex flex-col items-center">
      <div className="mb-6 relative">
         <div className="absolute inset-0 bg-rose-200 blur-xl opacity-50 animate-pulse rounded-full"></div>
         <Sparkles className="w-16 h-16 text-ink relative z-10 animate-float" />
      </div>
      <p className="font-sans text-xs uppercase tracking-[0.4em] text-stone-500 mb-3 animate-pulse">
        Powered By
      </p>
      <h1 className="font-serif text-5xl text-ink italic tracking-widest drop-shadow-sm">
        SAM IA
      </h1>
    </div>
  </div>
);

// Component: Start Screen
const StartScreen = ({ onStart }: { onStart: () => void }) => (
  <div className="flex flex-col items-center justify-center h-full animate-fade-in z-20">
    <div className="mb-10 relative group">
       <div className="absolute inset-0 bg-stone-200 blur-2xl opacity-40 rounded-full w-40 h-40 animate-pulse transition-opacity duration-1000"></div>
       <Sparkles className="w-16 h-16 text-ink/80 relative z-10 animate-float" />
    </div>
    
    <h1 className="font-serif text-4xl md:text-5xl text-ink italic text-center mb-3 tracking-wide drop-shadow-sm">
      Notas del Alma
    </h1>
    <p className="font-sans text-stone-400 text-[10px] uppercase tracking-[0.3em] mb-12 text-center max-w-[200px] leading-relaxed">
      Tu dosis diaria de paz mental
    </p>

    <button 
      onClick={(e) => { e.stopPropagation(); onStart(); }}
      className="group relative px-8 py-5 bg-ink text-paper rounded-full font-sans text-xs uppercase tracking-[0.2em] transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl overflow-hidden"
    >
      <span className="relative z-10 flex items-center gap-3">
        Revelar Mensaje <Sparkles className="w-3 h-3 animate-pulse" />
      </span>
      <div className="absolute inset-0 rounded-full bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
    </button>
  </div>
);

const App: React.FC = () => {
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [savedNotes, setSavedNotes] = useState<Note[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [screenshotMode, setScreenshotMode] = useState(false);
  
  // New states for Gender, Mood, Custom Notes & Background
  const [gender, setGender] = useState<Gender | null>(null);
  const [currentMood, setCurrentMood] = useState<Mood>('neutral'); // Store current mood
  const [appBackground, setAppBackground] = useState<AppBackground>('auto');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showMoodSelector, setShowMoodSelector] = useState(false);
  const [isEnhancerOpen, setIsEnhancerOpen] = useState(false);
  
  // AI Instructions State
  const [aiInstruction, setAiInstruction] = useState<string>('');
  const [isAIInstructionModalOpen, setIsAIInstructionModalOpen] = useState(false);
  
  // Usage Limit State
  const [aiUsageCount, setAiUsageCount] = useState(0);
  const [showLimitModal, setShowLimitModal] = useState(false);

  // Splash Screen State
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  
  // Service Warning Banner State
  const [showServiceBanner, setShowServiceBanner] = useState(true);

  // Handle Splash Screen Timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSplashVisible(false);
    }, 4000); // 4 seconds
    return () => clearTimeout(timer);
  }, []);

  // Initial Load and Usage Tracking Logic
  useEffect(() => {
    const loadInitialData = async () => {
      // --- USAGE TRACKING LOGIC ---
      const today = new Date().toDateString();
      const lastUsageDate = localStorage.getItem('last_usage_date');
      const savedCount = parseInt(localStorage.getItem('ai_usage_count') || '0');

      if (lastUsageDate !== today) {
        // Reset count if it's a new day
        setAiUsageCount(0);
        localStorage.setItem('ai_usage_count', '0');
        localStorage.setItem('last_usage_date', today);
      } else {
        setAiUsageCount(savedCount);
      }

      // --- USER DATA LOGIC ---
      const savedGender = localStorage.getItem('user_gender') as Gender | null;
      const savedMood = localStorage.getItem('user_mood') as Mood | null;
      if (savedMood) setCurrentMood(savedMood);

      const savedInstruction = localStorage.getItem('ai_instruction');
      if (savedInstruction) setAiInstruction(savedInstruction);

      if (savedGender) {
        setGender(savedGender);
      } else {
        setShowOnboarding(true);
      }

      // Load saved notes
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

  // Save favorite notes to local storage
  useEffect(() => {
    localStorage.setItem('saved_notes', JSON.stringify(savedNotes));
  }, [savedNotes]);

  // Helper to increment usage
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
    if (aiUsageCount >= MAX_AI_USES) {
      setShowLimitModal(true);
      return false;
    }
    return true;
  };

  const handleGenderSelect = async (selectedGender: Gender) => {
    localStorage.setItem('user_gender', selectedGender);
    setGender(selectedGender);
    setShowOnboarding(false);
    
    // For new users, we generate the first note immediately as a welcome
    if (!checkAiLimit()) {
      return; 
    }

    setIsLoading(true);
    const note = await generateDailyNote(selectedGender, currentMood, aiInstruction);
    setCurrentNote(note);
    if (note.isGeneratedByAI) {
      incrementAiUsage();
    }
    setIsLoading(false);
  };

  const handleBackgroundChange = (bg: AppBackground) => {
    setAppBackground(bg);
    localStorage.setItem('app_background', bg);
  };

  const handleMoodSelect = async (mood: Mood) => {
    setCurrentMood(mood);
    localStorage.setItem('user_mood', mood); // Remember mood
    setShowMoodSelector(false);
    
    if (!gender) return;

    if (!checkAiLimit()) return;

    setIsLoading(true);
    const note = await generateDailyNote(gender, mood, aiInstruction);
    setCurrentNote(note);
    if (note.isGeneratedByAI) {
      incrementAiUsage();
    }
    setIsLoading(false);
  };

  const handleAIInstructionSave = (instruction: string) => {
    setAiInstruction(instruction);
    localStorage.setItem('ai_instruction', instruction);
    // If user saves a new instruction, usually they want to see it applied.
    // We trigger generation if they have credits.
    if (instruction && gender && aiUsageCount < MAX_AI_USES) {
        handleGenerateNew();
    }
  };

  const handleGenerateNew = async () => {
    if (!gender) {
      setShowOnboarding(true); // If for some reason gender is not set, show onboarding
      return;
    }
    
    if (!checkAiLimit()) return;

    setIsLoading(true);
    const note = await generateDailyNote(gender, currentMood, aiInstruction);
    setCurrentNote(note);
    if (note.isGeneratedByAI) {
      incrementAiUsage();
    }
    setIsLoading(false);
  };

  // Generate a note from the backup collection (Manual fallback)
  const handleGetFallbackNote = () => {
    const note = getRandomFallbackNote();
    setCurrentNote(note);
    // Note: We do NOT increment usage for fallback notes as they are offline/free content.
  };

  const handleOpenEnhancer = () => {
    if (!checkAiLimit()) return;
    setIsEnhancerOpen(true);
  };

  const handleCreateOwnNote = (note: Note) => {
    setCurrentNote(note);
  };

  const handleRestorationComplete = (note: Note) => {
    incrementAiUsage(); // Enhancing consumes a credit
    setCurrentNote(note);
    if (!savedNotes.find(n => n.content === note.content)) {
       setSavedNotes([note, ...savedNotes]);
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
    const styles: NoteStyle[] = ['classic', 'midnight', 'aura', 'minimal', 'botanical', 'cinema', 'vintage', 'rose'];
    const currentIndex = styles.indexOf(currentNote.style || 'classic');
    const nextIndex = (currentIndex + 1) % styles.length;
    
    setCurrentNote({
      ...currentNote,
      style: styles[nextIndex]
    });
  };

  // Directly set a specific style from the Menu Templates
  const handleSelectStyle = (style: NoteStyle) => {
    if (!currentNote) return;
    setCurrentNote({
        ...currentNote,
        style: style
    });
  }

  // Optimized specifically for Instagram Stories (9:16 format)
  const handleInstagramShare = async () => {
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

        canvas.toBlob(async (blob: Blob | null) => {
          if (!blob) {
            setIsGeneratingImage(false);
            return;
          }
          const file = new File([blob], "instagram-story.png", { type: "image/png" });
          if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
            try {
              await navigator.share({ files: [file] });
            } catch (err) {
              console.log('Share cancelled or failed', err);
            }
          } else {
            const link = document.createElement('a');
            link.download = 'instagram-story.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
            alert("Imagen guardada. Abre Instagram y súbela a tu historia.");
          }
          setIsGeneratingImage(false);
        }, 'image/png', 1.0);

      } catch (error) {
        console.error("Error generating image", error);
        setIsGeneratingImage(false);
        alert("Hubo un problema al generar la imagen.");
      }
    }, 100);
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

  const getAutoBackgroundColor = (style?: NoteStyle) => {
    switch(style) {
      case 'midnight': return '#0f1115';
      case 'cinema': return '#1a1a1a';
      case 'botanical': return '#e8ede8';
      case 'vintage': return '#ebe6da';
      case 'rose': return '#fff0f5';
      default: return '#F0EFEB';
    }
  };

  const getFinalBackgroundColor = () => {
    if (appBackground === 'light') return '#FDFBF7';
    if (appBackground === 'dark') return '#0f1115';
    if (appBackground === 'aura') return '#F3E5F5'; 
    return getAutoBackgroundColor(currentNote?.style);
  };

  const getBackgroundClass = () => {
    if (appBackground === 'aura') return 'bg-gradient-to-br from-rose-100 via-purple-100 to-blue-100';
    return '';
  };

  const isDarkBg = () => {
    if (appBackground === 'dark') return true;
    if (appBackground === 'auto' && (currentNote?.style === 'midnight' || currentNote?.style === 'cinema')) return true;
    return false;
  };

  const uiTextColor = isDarkBg() ? 'text-white' : 'text-ink';
  const uiBgHover = isDarkBg() ? 'hover:bg-white/10' : 'hover:bg-stone-50';
  
  const secondaryBtnClass = `group p-3 md:p-4 bg-white shadow-lg rounded-full transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl active:scale-95 flex items-center justify-center ${uiBgHover}`;
  const mainBtnClass = `group p-5 bg-white shadow-2xl rounded-full transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-2xl active:scale-90 flex items-center justify-center ring-2 ring-stone-100 ${aiUsageCount >= MAX_AI_USES ? 'opacity-50 grayscale' : ''}`;

  return (
    <div 
      className={`min-h-screen w-full relative flex flex-col items-center justify-center transition-all duration-500 ${screenshotMode ? 'cursor-zoom-out' : ''} ${getBackgroundClass()}`}
      onClick={() => setScreenshotMode(false)}
      style={{
        backgroundColor: appBackground !== 'aura' ? getFinalBackgroundColor() : undefined,
      }}
    >
      {/* SPLASH SCREEN */}
      {isSplashVisible && <SplashScreen />}
      
      {/* SERVICE WARNING BANNER */}
      {showServiceBanner && !isSplashVisible && (
        <ServiceStatusBanner onClose={() => setShowServiceBanner(false)} />
      )}

      {/* LIMIT MODAL */}
      <LimitReachedModal 
        isOpen={showLimitModal} 
        onClose={() => setShowLimitModal(false)} 
        onSwitchToManual={() => {
           setShowLimitModal(false);
           setIsCreateModalOpen(true);
        }}
      />

      {/* Texture Overlay */}
      {!isDarkBg() && (
        <div 
          className="absolute inset-0 pointer-events-none opacity-30 z-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.1'/%3E%3C/svg%3E")`
          }}
        />
      )}

      {/* --- HIDDEN STORY STAGE (1080x1920) --- */}
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
            backgroundImage: (!['midnight', 'cinema'].includes(currentNote.style))
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
            <p className={`font-serif text-4xl italic tracking-wider ${['midnight', 'cinema'].includes(currentNote.style) ? 'text-white' : 'text-stone-800'}`}>
              Notas del Alma
            </p>
            <p className={`font-sans text-xl uppercase tracking-[0.3em] mt-4 ${['midnight', 'cinema'].includes(currentNote.style) ? 'text-stone-500' : 'text-stone-400'}`}>
              @notasdelalma
            </p>
          </div>
        </div>
      )}

      {/* Overlays */}
      {showOnboarding && !isSplashVisible && <Onboarding onComplete={handleGenderSelect} />}
      {showMoodSelector && !isSplashVisible && <MoodSelector onSelect={handleMoodSelect} onClose={() => setShowMoodSelector(false)} />}
      <CreateNoteModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onCreate={handleCreateOwnNote} />
      <QualityEnhancer isOpen={isEnhancerOpen} onClose={() => setIsEnhancerOpen(false)} onRestorationComplete={handleRestorationComplete} />
      <AIInstructionsModal 
        isOpen={isAIInstructionModalOpen} 
        onClose={() => setIsAIInstructionModalOpen(false)} 
        currentInstruction={aiInstruction}
        onSave={handleAIInstructionSave}
      />

      {/* Header */}
      <nav className={`fixed top-0 w-full p-6 flex justify-between items-center z-30 transition-all duration-500 ${screenshotMode ? 'opacity-0 -translate-y-10 pointer-events-none' : 'opacity-100'}`}>
        <div className="flex items-center gap-2">
           <div className={`w-2 h-2 rounded-full animate-pulse ${isDarkBg() ? 'bg-white' : 'bg-ink'}`}></div>
           <span className={`font-serif italic text-lg ${uiTextColor}`}>Notas del Alma</span>
           <span className="ml-2 text-[10px] font-sans opacity-50 bg-stone-200/50 px-2 py-0.5 rounded-full text-ink">
             {aiUsageCount}/{MAX_AI_USES}
           </span>
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); setIsMenuOpen(true); }}
          className={`p-2 rounded-full transition-colors ${uiTextColor} ${isDarkBg() ? 'hover:bg-white/10' : 'hover:bg-ink/5'}`}
        >
          <MenuIcon className="w-6 h-6" />
        </button>
      </nav>

      {/* Main Content */}
      <main className={`w-full max-w-xl px-4 z-10 transition-all duration-500 flex flex-col justify-center items-center ${screenshotMode ? 'scale-105' : 'scale-100'} flex-grow`}>
        {isLoading ? (
          <BreathingLoader />
        ) : (
          currentNote ? (
            <NoteCard note={currentNote} viewMode={screenshotMode || isGeneratingImage} />
          ) : (
            !showOnboarding && <StartScreen onStart={handleGenerateNew} />
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

      {/* Controls - Only show if a note is generated */}
      {currentNote && (
        <div className={`fixed bottom-6 md:bottom-10 w-full px-4 flex justify-center items-center gap-3 md:gap-6 z-30 transition-all duration-500 ${screenshotMode ? 'opacity-0 translate-y-20 pointer-events-none' : 'opacity-100'}`}>
          
          <button 
            onClick={(e) => { e.stopPropagation(); setShowMoodSelector(true); }}
            className={secondaryBtnClass}
            title="Cambiar estado de ánimo"
          >
            <Brain className="w-5 h-5 text-stone-400 group-hover:text-purple-600 transition-colors" />
          </button>

          <button 
            onClick={(e) => { e.stopPropagation(); handleSaveNote(); }}
            className={secondaryBtnClass}
            title="Guardar en favoritos"
          >
            <Heart className={`w-5 h-5 transition-colors ${isSaved ? 'fill-rose-400 text-rose-400' : 'text-stone-400 hover:text-rose-400'}`} />
          </button>

          <button 
            onClick={(e) => { e.stopPropagation(); handleGenerateNew(); }}
            className={mainBtnClass}
            title="Nueva Nota"
          >
            <Sparkles className="w-7 h-7 text-ink group-hover:text-gold transition-colors" />
          </button>

          <button 
            onClick={(e) => { e.stopPropagation(); handleInstagramShare(); }}
            className={`group p-3 md:p-4 bg-white shadow-lg rounded-full transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl active:scale-95 flex items-center justify-center ${uiBgHover}`}
            title="Compartir en Historia"
          >
            <Instagram className="w-5 h-5 text-stone-400 group-hover:text-pink-600 transition-colors" />
          </button>
          
          <button 
            onClick={(e) => { e.stopPropagation(); handleDownloadImage(); }}
            className={secondaryBtnClass}
            title="Descargar imagen"
          >
              <Download className="w-5 h-5 text-stone-400 group-hover:text-blue-600 transition-colors" />
          </button>

        </div>
      )}

      {/* Secondary Tools - Only show if a note is generated */}
      {currentNote && (
        <div className={`fixed right-4 md:right-8 bottom-32 md:bottom-36 flex flex-col gap-3 z-30 transition-all duration-500 ${screenshotMode ? 'opacity-0 translate-x-10 pointer-events-none' : 'opacity-100'}`}>

          <button 
            onClick={(e) => { e.stopPropagation(); handleCycleStyle(); }}
            className="p-3 bg-white/80 backdrop-blur shadow-sm rounded-full text-stone-500 hover:text-ink hover:bg-white hover:shadow-md transition-all duration-300 group active:scale-90"
            title="Cambiar Estilo Visual"
          >
              <Palette className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          </button>

          <button 
            onClick={(e) => { e.stopPropagation(); setIsCreateModalOpen(true); }}
            className="p-3 bg-white/80 backdrop-blur shadow-sm rounded-full text-stone-500 hover:text-ink hover:bg-white hover:shadow-md transition-all duration-300 active:scale-90"
            title="Escribir mi nota"
          >
              <PenTool className="w-5 h-5" />
          </button>

          <button 
            onClick={(e) => { e.stopPropagation(); setIsAIInstructionModalOpen(true); }}
            className={`p-3 bg-white/80 backdrop-blur shadow-sm rounded-full hover:text-ink hover:bg-white hover:shadow-md transition-all duration-300 active:scale-90 ${aiInstruction ? 'text-purple-600 ring-2 ring-purple-200' : 'text-stone-500'}`}
            title="Instrucciones a la IA"
          >
              <Command className="w-5 h-5" />
          </button>

          <button 
              onClick={(e) => { e.stopPropagation(); setScreenshotMode(true); }}
              className="p-3 bg-white/80 backdrop-blur shadow-sm rounded-full text-stone-500 hover:text-ink hover:bg-white hover:shadow-md transition-all duration-300 active:scale-90"
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
      />

    </div>
  );
};

export default App;