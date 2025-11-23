import React, { useState, useEffect } from 'react';
import { Menu as MenuIcon, Instagram, Heart, Brain, Copy, Camera, PenTool, Palette } from 'lucide-react';
import { Note, Gender, NoteStyle, Mood } from './types';
import { generateDailyNote } from './services/geminiService';
import NoteCard from './components/NoteCard';
import Menu from './components/Menu';
import Onboarding from './components/Onboarding';
import CreateNoteModal from './components/CreateNoteModal';
import MoodSelector from './components/MoodSelector';

// Declare html2canvas globally since it's loaded via CDN
declare global {
  interface Window {
    html2canvas: any;
  }
}

const App: React.FC = () => {
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [savedNotes, setSavedNotes] = useState<Note[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [screenshotMode, setScreenshotMode] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  
  // New states for Gender, Mood & Custom Notes
  const [gender, setGender] = useState<Gender | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showMoodSelector, setShowMoodSelector] = useState(false);

  // Initial Load
  useEffect(() => {
    const loadInitialData = async () => {
      // 1. Check Local Storage for gender
      const savedGender = localStorage.getItem('user_gender') as Gender | null;
      
      if (savedGender) {
        setGender(savedGender);
        // Generate first note with default mood
        const note = await generateDailyNote(savedGender, 'neutral');
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
    const note = await generateDailyNote(selectedGender, 'neutral');
    setCurrentNote(note);
    setIsLoading(false);
  };

  const handleMoodSelect = async (mood: Mood) => {
    setShowMoodSelector(false);
    if (!gender) return;
    setIsLoading(true);
    const note = await generateDailyNote(gender, mood);
    setCurrentNote(note);
    setIsLoading(false);
  };

  const handleCreateOwnNote = (note: Note) => {
    setCurrentNote(note);
  };

  const handleSaveNote = () => {
    if (currentNote && !savedNotes.find(n => n.id === currentNote.id)) {
      setSavedNotes([currentNote, ...savedNotes]);
    }
  };

  // Cycle through visual styles without changing text
  const handleCycleStyle = () => {
    if (!currentNote) return;
    const styles: NoteStyle[] = ['classic', 'midnight', 'aura', 'minimal'];
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

          // 3. Create File
          const file = new File([blob], "story-nota-del-alma.png", { type: "image/png" });

          // 4. Share using Web Share API - Minimal options to encourage Direct Share
          if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
            try {
              await navigator.share({
                files: [file]
                // Omitting text/title sometimes forces OS to treat it as a pure image share, cleaner UI
              });
            } catch (err) {
              console.log('Share cancelled or failed', err);
            }
          } else {
            // Fallback: Download the image if sharing not supported (Desktop)
            const link = document.createElement('a');
            link.download = 'story-nota-del-alma.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
            alert("Imagen guardada. Ahora puedes subirla a tus historias manualmente.");
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

  const isSaved = currentNote ? savedNotes.some(n => n.id === currentNote.id) : false;

  return (
    <div 
      className={`min-h-screen w-full relative flex flex-col items-center justify-center transition-colors duration-500 ${screenshotMode ? 'bg-stone-100 cursor-zoom-out' : ''}`}
      onClick={() => setScreenshotMode(false)}
      style={{
        backgroundColor: currentNote?.style === 'midnight' ? '#0f1115' : '#F0EFEB',
        transition: 'background-color 0.5s ease'
      }}
    >
      {/* --- HIDDEN STORY STAGE (1080x1920) --- */}
      {/* This renders off-screen and is used exclusively for generating the Instagram Story image */}
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
            backgroundColor: currentNote.style === 'midnight' ? '#0f1115' : '#F0EFEB',
            backgroundImage: currentNote.style !== 'midnight' 
              ? `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`
              : 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px'
          }}
        >
          {/* We scale the note card by 2x to fit nicely in 1080p width (approx 896px width) */}
          <div className="scale-[2.2] transform origin-center shadow-2xl">
            <NoteCard note={currentNote} viewMode={true} />
          </div>
          
          <div className="absolute bottom-40 text-center opacity-70">
            <p className={`font-serif text-4xl italic tracking-wider ${currentNote.style === 'midnight' ? 'text-white' : 'text-stone-800'}`}>
              Notas del Alma
            </p>
            <p className={`font-sans text-xl uppercase tracking-[0.3em] mt-4 ${currentNote.style === 'midnight' ? 'text-stone-500' : 'text-stone-400'}`}>
              @notasdelalma
            </p>
          </div>
        </div>
      )}

      {/* Onboarding Overlay */}
      {showOnboarding && <Onboarding onComplete={handleGenderSelect} />}
      
      {/* Mood Selector Overlay */}
      {showMoodSelector && <MoodSelector onSelect={handleMoodSelect} onClose={() => setShowMoodSelector(false)} />}

      {/* Create Note Modal */}
      <CreateNoteModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onCreate={handleCreateOwnNote} 
      />

      {/* Header / Nav - Hidden in Screenshot Mode */}
      <nav className={`fixed top-0 w-full p-6 flex justify-between items-center z-30 transition-all duration-500 ${screenshotMode ? 'opacity-0 -translate-y-10 pointer-events-none' : 'opacity-100'}`}>
        <div className="flex items-center gap-2">
           <div className={`w-2 h-2 rounded-full animate-pulse ${currentNote?.style === 'midnight' ? 'bg-white' : 'bg-ink'}`}></div>
           <span className={`font-serif italic text-lg ${currentNote?.style === 'midnight' ? 'text-white' : 'text-ink'}`}>Notas del Alma</span>
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); setIsMenuOpen(true); }}
          className={`p-2 rounded-full transition-colors ${currentNote?.style === 'midnight' ? 'hover:bg-white/10 text-white' : 'hover:bg-white/50 text-ink'}`}
        >
          <MenuIcon className="w-6 h-6" />
        </button>
      </nav>

      {/* Main Content Area */}
      <main className={`w-full max-w-xl px-4 transition-all duration-500 ${screenshotMode ? 'scale-105' : 'scale-100'}`}>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-96">
            <div className={`w-12 h-12 border-4 border-t-current rounded-full animate-spin mb-4 ${currentNote?.style === 'midnight' ? 'border-stone-700 text-white' : 'border-stone-200 text-ink'}`}></div>
            <p className={`font-serif animate-pulse ${currentNote?.style === 'midnight' ? 'text-stone-400' : 'text-stone-400'}`}>Sintonizando con tu energía...</p>
          </div>
        ) : (
          currentNote && <NoteCard note={currentNote} viewMode={screenshotMode || isGeneratingImage} />
        )}
      </main>

      {/* Loading Overlay for Image Generation */}
      {isGeneratingImage && (
        <div className="fixed inset-0 bg-ink/50 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center gap-4 animate-fade-in">
            <div className="w-8 h-8 border-4 border-stone-200 border-t-ink rounded-full animate-spin"></div>
            <p className="font-sans text-sm text-ink font-medium">Creando Historia...</p>
          </div>
        </div>
      )}

      {/* Helper text for Screenshot Mode */}
      {screenshotMode && (
        <div className="fixed bottom-10 text-stone-400 font-sans text-xs uppercase tracking-widest animate-pulse">
          Toca cualquier lugar para salir
        </div>
      )}

      {/* Controls - Hidden in Screenshot Mode */}
      <div className={`fixed bottom-0 w-full p-8 pb-12 flex justify-center items-end gap-6 z-30 transition-all duration-500 ${screenshotMode ? 'opacity-0 translate-y-20 pointer-events-none' : 'opacity-100'}`}>
        
        <button 
          onClick={(e) => { e.stopPropagation(); setShowMoodSelector(true); }}
          className="group p-4 bg-white shadow-lg rounded-full hover:bg-stone-50 transition-all active:scale-95"
          title="Sintonizar Emoción"
        >
          <Brain className="w-6 h-6 text-ink group-hover:text-purple-600 transition-colors" />
        </button>

        {/* Instagram Share Button */}
        <button 
          onClick={(e) => { e.stopPropagation(); handleInstagramShare(); }}
          className="group relative p-6 bg-gradient-to-tr from-purple-600 via-pink-600 to-orange-500 text-white shadow-xl rounded-full hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center"
          title="Compartir en Historia"
        >
           <Instagram className="w-8 h-8" />
           <span className="absolute -top-12 left-1/2 -translate-x-1/2 bg-ink text-white text-[10px] px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-sans pointer-events-none shadow-sm">
             Historia
           </span>
        </button>

        <button 
          onClick={(e) => { e.stopPropagation(); handleSaveNote(); }}
          className="group p-4 bg-white shadow-lg rounded-full hover:bg-stone-50 transition-all active:scale-95"
          title="Guardar en favoritos"
        >
          <Heart className={`w-6 h-6 transition-colors ${isSaved ? 'fill-rose-400 text-rose-400' : 'text-ink'}`} />
        </button>

      </div>

      {/* Secondary Tools (Copy & Create) */}
      <div className={`fixed right-6 bottom-32 flex flex-col gap-4 transition-all duration-500 ${screenshotMode ? 'opacity-0 translate-x-10 pointer-events-none' : 'opacity-100'}`}>
         <button 
           onClick={(e) => { e.stopPropagation(); handleCycleStyle(); }}
           className="p-3 bg-white/80 backdrop-blur shadow-md rounded-full text-stone-600 hover:text-ink hover:bg-white transition-all group"
           title="Cambiar Estilo Visual"
         >
            <Palette className="w-5 h-5 group-hover:rotate-12 transition-transform" />
         </button>

         <button 
           onClick={(e) => { e.stopPropagation(); setIsCreateModalOpen(true); }}
           className="p-3 bg-white/80 backdrop-blur shadow-md rounded-full text-stone-600 hover:text-ink hover:bg-white transition-all"
           title="Escribir mi nota"
         >
            <PenTool className="w-5 h-5" />
         </button>
         <button 
           onClick={(e) => { e.stopPropagation(); handleCopyText(); }}
           className="p-3 bg-white/80 backdrop-blur shadow-md rounded-full text-stone-600 hover:text-ink hover:bg-white transition-all"
           title="Copiar texto"
         >
            {copySuccess ? <span className="text-xs font-bold text-green-600">OK</span> : <Copy className="w-5 h-5" />}
         </button>
         <button 
            onClick={(e) => { e.stopPropagation(); setScreenshotMode(true); }}
            className="p-3 bg-white/80 backdrop-blur shadow-md rounded-full text-stone-600 hover:text-ink hover:bg-white transition-all"
            title="Modo limpio"
         >
            <Camera className="w-5 h-5" />
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
      />

    </div>
  );
};

export default App;