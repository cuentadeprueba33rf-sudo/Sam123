import React, { useState, useEffect } from 'react';
import { Menu as MenuIcon, Instagram, Heart, RefreshCcw, Copy, Camera, PenTool, Palette } from 'lucide-react';
import { Note, Gender, NoteStyle } from './types';
import { generateDailyNote } from './services/geminiService';
import NoteCard from './components/NoteCard';
import Menu from './components/Menu';
import Onboarding from './components/Onboarding';
import CreateNoteModal from './components/CreateNoteModal';

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
  
  // New states for Gender & Custom Notes
  const [gender, setGender] = useState<Gender | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Initial Load
  useEffect(() => {
    const loadInitialData = async () => {
      // 1. Check Local Storage for gender
      const savedGender = localStorage.getItem('user_gender') as Gender | null;
      
      if (savedGender) {
        setGender(savedGender);
        // Generate first note with saved gender
        const note = await generateDailyNote(savedGender);
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
    // Generate first note immediately after selection
    const note = await generateDailyNote(selectedGender);
    setCurrentNote(note);
    setIsLoading(false);
  };

  const handleNewNote = async () => {
    if (!gender) return;
    setIsLoading(true);
    const note = await generateDailyNote(gender);
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

  // Function to share specifically to Instagram Stories (via native share sheet)
  const handleInstagramShare = async () => {
    const element = document.getElementById('note-card-capture');
    if (!element || !window.html2canvas) return;

    setIsGeneratingImage(true);

    // Slight delay to ensure any rendering changes have applied
    setTimeout(async () => {
      try {
        // 1. Generate Image from DOM
        const canvas = await window.html2canvas(element, {
          scale: 3, // High resolution
          backgroundColor: null, // Transparent to respect styles
          logging: false,
          useCORS: true, // To handle external images
          allowTaint: true,
        });

        // 2. Convert to Blob
        canvas.toBlob(async (blob: Blob | null) => {
          if (!blob) {
            setIsGeneratingImage(false);
            return;
          }

          // 3. Create File
          const file = new File([blob], "nota-del-alma.png", { type: "image/png" });

          // 4. Share using Web Share API
          if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
            try {
              await navigator.share({
                files: [file],
                title: 'Nota del Alma', 
                text: '✨'
              });
            } catch (err) {
              console.log('Share cancelled or failed', err);
            }
          } else {
            // Fallback: Download the image if sharing not supported (Desktop)
            const link = document.createElement('a');
            link.download = 'nota-del-alma.png';
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
      {/* Onboarding Overlay */}
      {showOnboarding && <Onboarding onComplete={handleGenderSelect} />}

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
            <p className={`font-serif animate-pulse ${currentNote?.style === 'midnight' ? 'text-stone-400' : 'text-stone-400'}`}>Sintonizando vibra...</p>
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
            <p className="font-sans text-sm text-ink font-medium">Preparando tu historia...</p>
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
          onClick={(e) => { e.stopPropagation(); handleNewNote(); }}
          className="group p-4 bg-white shadow-lg rounded-full hover:bg-stone-50 transition-all active:scale-95"
          title="Nueva Nota del Universo"
        >
          <RefreshCcw className="w-6 h-6 text-ink group-hover:rotate-180 transition-transform duration-500" />
        </button>

        {/* Instagram Share Button */}
        <button 
          onClick={(e) => { e.stopPropagation(); handleInstagramShare(); }}
          className="group relative p-6 bg-gradient-to-tr from-purple-600 via-pink-600 to-orange-500 text-white shadow-xl rounded-full hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center"
          title="Compartir en Historia"
        >
           <Instagram className="w-8 h-8" />
           <span className="absolute -top-12 left-1/2 -translate-x-1/2 bg-ink text-white text-[10px] px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-sans pointer-events-none shadow-sm">
             Compartir a Historia
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
        onGenerateNew={handleNewNote}
        onCreateOwn={() => setIsCreateModalOpen(true)}
      />

    </div>
  );
};

export default App;