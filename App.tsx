import React, { useState, useEffect } from 'react';
import { Menu as MenuIcon, Instagram, Heart, Brain, Copy, Eye, PenTool, Palette, Download, Sparkles } from 'lucide-react';
import { Note, Gender, NoteStyle, Mood, AppBackground } from './types';
import { generateDailyNote } from './services/geminiService';
import NoteCard from './components/NoteCard';
import Menu from './components/Menu';
import Onboarding from './components/Onboarding';
import CreateNoteModal from './components/CreateNoteModal';
import MoodSelector from './components/MoodSelector';
import QualityEnhancer from './components/QualityEnhancer';

// Declare html2canvas globally since it's loaded via CDN
declare global {
  interface Window {
    html2canvas: any;
  }
}

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
    <div className="flex flex-col items-center justify-center h-96">
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

const App: React.FC = () => {
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [savedNotes, setSavedNotes] = useState<Note[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [screenshotMode, setScreenshotMode] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  
  // New states for Gender, Mood, Custom Notes & Background
  const [gender, setGender] = useState<Gender | null>(null);
  const [currentMood, setCurrentMood] = useState<Mood>('neutral'); // Store current mood
  const [appBackground, setAppBackground] = useState<AppBackground>('auto');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showMoodSelector, setShowMoodSelector] = useState(false);
  const [isEnhancerOpen, setIsEnhancerOpen] = useState(false);
  
  // Splash Screen State
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  // Handle Splash Screen Timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSplashVisible(false);
    }, 4000); // 4 seconds
    return () => clearTimeout(timer);
  }, []);

  // Initial Load
  useEffect(() => {
    const loadInitialData = async () => {
      // 1. Check Local Storage for gender
      const savedGender = localStorage.getItem('user_gender') as Gender | null;
      
      // Load saved mood if exists
      const savedMood = localStorage.getItem('user_mood') as Mood | null;
      if (savedMood) setCurrentMood(savedMood);

      if (savedGender) {
        setGender(savedGender);
        // Generate first note with saved or default mood
        const note = await generateDailyNote(savedGender, savedMood || 'neutral');
        setCurrentNote(note);
        setIsLoading(false);
      } else {
        // Show onboarding if no gender saved
        setShowOnboarding(true);
        setIsLoading(false);
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

      // Load Background preference
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

  const handleGenderSelect = async (selectedGender: Gender) => {
    localStorage.setItem('user_gender', selectedGender);
    setGender(selectedGender);
    setShowOnboarding(false);
    setIsLoading(true);
    // Generate first note
    const note = await generateDailyNote(selectedGender, currentMood);
    setCurrentNote(note);
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
    setIsLoading(true);
    const note = await generateDailyNote(gender, mood);
    setCurrentNote(note);
    setIsLoading(false);
  };

  const handleGenerateNew = async () => {
    if (!gender) return;
    setIsLoading(true);
    const note = await generateDailyNote(gender, currentMood);
    setCurrentNote(note);
    setIsLoading(false);
  };

  const handleCreateOwnNote = (note: Note) => {
    setCurrentNote(note);
  };

  const handleRestorationComplete = (note: Note) => {
    setCurrentNote(note);
    // Optionally auto-save restored notes
    if (!savedNotes.find(n => n.content === note.content)) {
       setSavedNotes([note, ...savedNotes]);
    }
    // Trigger download immediately for UX "Magic" feeling
    setTimeout(() => {
       handleDownloadImage();
    }, 1000);
  };

  const handleSaveNote = () => {
    if (currentNote && !savedNotes.find(n => n.id === currentNote.id)) {
      setSavedNotes([currentNote, ...savedNotes]);
    }
  };

  // Cycle through visual styles without changing text
  const handleCycleStyle = () => {
    if (!currentNote) return;
    // ORDER: Classic first, then the new ones
    const styles: NoteStyle[] = ['classic', 'midnight', 'aura', 'minimal', 'botanical', 'cinema', 'vintage', 'rose'];
    const currentIndex = styles.indexOf(currentNote.style || 'classic');
    const nextIndex = (currentIndex + 1) % styles.length;
    
    setCurrentNote({
      ...currentNote,
      style: styles[nextIndex]
    });
  };

  const handleCopyText = () => {
    if (!currentNote) return;
    const text = `"${currentNote.content}" — ${currentNote.author}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  // Optimized specifically for Instagram Stories (9:16 format)
  const handleInstagramShare = async () => {
    const element = document.getElementById('story-capture-stage');
    if (!element || !window.html2canvas) return;

    setIsGeneratingImage(true);

    // Slight delay to ensure any rendering changes have applied in the hidden DOM
    setTimeout(async () => {
      try {
        // 1. Generate Image from the specific 1080x1920 stage
        const canvas = await window.html2canvas(element, {
          scale: 1, // Already 1080x1920
          backgroundColor: null, 
          logging: false,
          useCORS: true, 
          allowTaint: true,
          width: 1080,
          height: 1920
        });

        // 2. Convert to Blob
        canvas.toBlob(async (blob: Blob | null) => {
          if (!blob) {
            setIsGeneratingImage(false);
            return;
          }

          // 3. Create File with specific name to help OS identify context
          const file = new File([blob], "instagram-story.png", { type: "image/png" });

          // 4. Share using Web Share API - Optimized for "Image Only"
          if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
            try {
              // We intentionally OMIT text and url to force the OS to treat this as a photo share
              // This often filters out non-visual apps and prioritizes Instagram/Photos
              await navigator.share({
                files: [file]
              });
            } catch (err) {
              console.log('Share cancelled or failed', err);
            }
          } else {
            // Fallback: Download the image if sharing not supported (Desktop)
            const link = document.createElement('a');
            link.download = 'instagram-story.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
            alert("Imagen guardada. Abre Instagram y súbela a tu historia.");
          }
          setIsGeneratingImage(false);
        }, 'image/png', 1.0); // Max quality

      } catch (error) {
        console.error("Error generating image", error);
        setIsGeneratingImage(false);
        alert("Hubo un problema al generar la imagen.");
      }
    }, 100);
  };

  // New function to just download the image without sharing intent
  const handleDownloadImage = async () => {
    const element = document.getElementById('story-capture-stage');
    if (!element || !window.html2canvas) return;

    setIsGeneratingImage(true);

    setTimeout(async () => {
      try {
        const canvas = await window.html2canvas(element, {
          scale: 1, // 1080x1920
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

  // Determine AUTOMATIC background color based on note style
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

  // Determine ACTUAL background color based on User Preference + Note Style (if auto)
  const getFinalBackgroundColor = () => {
    if (appBackground === 'light') return '#FDFBF7';
    if (appBackground === 'dark') return '#0f1115';
    // For 'aura', we handle it via style/class later, but return a base color here
    if (appBackground === 'aura') return '#F3E5F5'; 
    
    // Default to Auto logic
    return getAutoBackgroundColor(currentNote?.style);
  };

  const getBackgroundClass = () => {
    if (appBackground === 'aura') return 'bg-gradient-to-br from-rose-100 via-purple-100 to-blue-100';
    return '';
  };

  // Helper to determine if UI text should be light or dark based on background
  const isDarkBg = () => {
    if (appBackground === 'dark') return true;
    if (appBackground === 'auto' && (currentNote?.style === 'midnight' || currentNote?.style === 'cinema')) return true;
    return false;
  };

  const uiTextColor = isDarkBg() ? 'text-white' : 'text-ink';
  const uiBgHover = isDarkBg() ? 'hover:bg-white/10' : 'hover:bg-stone-50';

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

      {/* Texture Overlay (Noise) - Only for non-dark themes to avoid muddy blacks */}
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
          {/* Scaled for export */}
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

      {/* Header / Nav - Hidden in Screenshot Mode */}
      <nav className={`fixed top-0 w-full p-6 flex justify-between items-center z-30 transition-all duration-500 ${screenshotMode ? 'opacity-0 -translate-y-10 pointer-events-none' : 'opacity-100'}`}>
        <div className="flex items-center gap-2">
           <div className={`w-2 h-2 rounded-full animate-pulse ${isDarkBg() ? 'bg-white' : 'bg-ink'}`}></div>
           <span className={`font-serif italic text-lg ${uiTextColor}`}>Notas del Alma</span>
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); setIsMenuOpen(true); }}
          className={`p-2 rounded-full transition-colors ${uiTextColor} ${isDarkBg() ? 'hover:bg-white/10' : 'hover:bg-ink/5'}`}
        >
          <MenuIcon className="w-6 h-6" />
        </button>
      </nav>

      {/* Main Content Area */}
      <main className={`w-full max-w-xl px-4 z-10 transition-all duration-500 flex flex-col justify-center items-center ${screenshotMode ? 'scale-105' : 'scale-100'}`}>
        {isLoading ? (
          <BreathingLoader />
        ) : (
          currentNote && <NoteCard note={currentNote} viewMode={screenshotMode || isGeneratingImage} />
        )}
      </main>

      {/* Loading Overlay for Image Generation */}
      {isGeneratingImage && (
        <div className="fixed inset-0 bg-ink/50 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center gap-4 animate-fade-in">
            <div className="w-8 h-8 border-4 border-stone-200 border-t-ink rounded-full animate-spin"></div>
            <p className="font-sans text-sm text-ink font-medium">Preparando recuerdo...</p>
          </div>
        </div>
      )}

      {/* Helper text for Screenshot Mode */}
      {screenshotMode && (
        <div className="fixed top-24 left-0 w-full text-center z-40 pointer-events-none animate-pulse">
          <p className="inline-block bg-black/50 text-white px-4 py-2 rounded-full font-sans text-xs uppercase tracking-widest backdrop-blur-md">
            Toca la pantalla para salir
          </p>
        </div>
      )}

      {/* Controls - Optimized for Mobile (Bottom Bar) */}
      <div className={`fixed bottom-0 w-full p-4 md:p-8 md:pb-12 flex justify-center items-end gap-4 md:gap-6 z-30 transition-all duration-500 ${screenshotMode ? 'opacity-0 translate-y-20 pointer-events-none' : 'opacity-100'}`}>
        
        {/* 1. Change Mood Button */}
        <button 
          onClick={(e) => { e.stopPropagation(); setShowMoodSelector(true); }}
          className={`group p-3 md:p-4 bg-white shadow-lg rounded-full transition-all active:scale-95 ${uiBgHover}`}
          title="Cambiar estado de ánimo"
        >
          <Brain className="w-5 h-5 md:w-6 md:h-6 text-stone-400 group-hover:text-purple-600 transition-colors" />
        </button>

        {/* 2. MAIN GENERATE BUTTON (Use Current Mood) */}
        <button 
          onClick={(e) => { e.stopPropagation(); handleGenerateNew(); }}
          className={`group p-4 md:p-5 bg-white shadow-xl rounded-full transition-all active:scale-95 ${uiBgHover} ring-1 ring-stone-100`}
          title="Nueva Nota (Mismo Mood)"
        >
          <Sparkles className="w-6 h-6 md:w-7 md:h-7 text-ink group-hover:text-gold transition-colors" />
        </button>

        {/* 3. Instagram Share Button */}
        <button 
          onClick={(e) => { e.stopPropagation(); handleInstagramShare(); }}
          className="group relative p-5 md:p-6 bg-gradient-to-tr from-purple-600 via-pink-600 to-orange-500 text-white shadow-xl rounded-full hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center mb-2 md:mb-0"
          title="Compartir en Historia"
        >
           <Instagram className="w-7 h-7 md:w-8 md:h-8" />
           <span className="absolute -top-12 left-1/2 -translate-x-1/2 bg-ink text-white text-[10px] px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-sans pointer-events-none shadow-sm">
             Historia
           </span>
        </button>

        <button 
          onClick={(e) => { e.stopPropagation(); handleSaveNote(); }}
          className={`group p-3 md:p-4 bg-white shadow-lg rounded-full transition-all active:scale-95 ${uiBgHover}`}
          title="Guardar en favoritos"
        >
          <Heart className={`w-5 h-5 md:w-6 md:h-6 transition-colors ${isSaved ? 'fill-rose-400 text-rose-400' : 'text-stone-400 hover:text-rose-400'}`} />
        </button>

      </div>

      {/* Secondary Tools (Copy & Create) - Right Side */}
      <div className={`fixed right-4 md:right-6 bottom-24 md:bottom-32 flex flex-col gap-3 md:gap-4 z-30 transition-all duration-500 ${screenshotMode ? 'opacity-0 translate-x-10 pointer-events-none' : 'opacity-100'}`}>
         <button 
           onClick={(e) => { e.stopPropagation(); handleDownloadImage(); }}
           className="p-3 bg-white/80 backdrop-blur shadow-md rounded-full text-stone-600 hover:text-ink hover:bg-white transition-all active:scale-90"
           title="Descargar imagen"
         >
            <Download className="w-5 h-5" />
         </button>

         <button 
           onClick={(e) => { e.stopPropagation(); handleCycleStyle(); }}
           className="p-3 bg-white/80 backdrop-blur shadow-md rounded-full text-stone-600 hover:text-ink hover:bg-white transition-all group active:scale-90"
           title="Cambiar Estilo Visual"
         >
            <Palette className="w-5 h-5 group-hover:rotate-12 transition-transform" />
         </button>

         <button 
           onClick={(e) => { e.stopPropagation(); setIsCreateModalOpen(true); }}
           className="p-3 bg-white/80 backdrop-blur shadow-md rounded-full text-stone-600 hover:text-ink hover:bg-white transition-all active:scale-90"
           title="Escribir mi nota"
         >
            <PenTool className="w-5 h-5" />
         </button>
         <button 
           onClick={(e) => { e.stopPropagation(); handleCopyText(); }}
           className="p-3 bg-white/80 backdrop-blur shadow-md rounded-full text-stone-600 hover:text-ink hover:bg-white transition-all active:scale-90"
           title="Copiar texto"
         >
            {copySuccess ? <span className="text-xs font-bold text-green-600">OK</span> : <Copy className="w-5 h-5" />}
         </button>
         <button 
            onClick={(e) => { e.stopPropagation(); setScreenshotMode(true); }}
            className="p-3 bg-white/80 backdrop-blur shadow-md rounded-full text-stone-600 hover:text-ink hover:bg-white transition-all active:scale-90"
            title="Modo limpio"
         >
            <Eye className="w-5 h-5" />
         </button>
      </div>

      {/* Drawer Menu */}
      <Menu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        savedNotes={savedNotes}
        onSelectNote={setCurrentNote}
        onGenerateNew={() => setShowMoodSelector(true)} 
        onCreateOwn={() => setIsCreateModalOpen(true)}
        onOpenEnhancer={() => setIsEnhancerOpen(true)}
        currentBackground={appBackground}
        onSetBackground={handleBackgroundChange}
      />

    </div>
  );
};

export default App;