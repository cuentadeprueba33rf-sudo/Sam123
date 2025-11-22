import React from 'react';
import { Note, NoteStyle } from '../types';
import { Quote, Sparkles, Moon, Sun } from 'lucide-react';

interface NoteCardProps {
  note: Note;
  viewMode: boolean; // If true, hides hints to look good in screenshots
}

const NoteCard: React.FC<NoteCardProps> = ({ note, viewMode }) => {
  
  // --- CLASSIC STYLE ---
  const renderClassic = () => {
     const getThemeStyles = (theme: string) => {
      switch (theme) {
        case 'love': return 'border-rose-200 bg-gradient-to-b from-rose-50/80 to-white';
        case 'peace': return 'border-blue-100 bg-gradient-to-b from-slate-50/80 to-white';
        case 'courage': return 'border-orange-100 bg-gradient-to-b from-orange-50/50 to-white';
        default: return 'border-stone-200 bg-gradient-to-b from-stone-50 to-white';
      }
    };

    return (
      <div className={`relative w-full h-full border-4 ${getThemeStyles(note.theme)} flex flex-col justify-center items-center text-center p-8 md:p-12`}>
        <div className="absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 border-ink/5 opacity-50"></div>
        <div className="absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 border-ink/5 opacity-50"></div>
        <div className="absolute top-8 text-gold opacity-40">
          <Quote className="w-8 h-8 rotate-180" />
        </div>
        <div className="relative z-10 space-y-6 my-auto">
          <h1 className="font-serif text-3xl md:text-4xl leading-snug text-ink font-medium tracking-tight text-pretty drop-shadow-sm">
            {note.content}
          </h1>
        </div>
        <div className="absolute bottom-12 w-full px-12">
          <div className="h-px w-12 bg-gold/30 mx-auto mb-4"></div>
          <p className="font-sans text-xs uppercase tracking-[0.2em] text-stone-500">
            {note.author}
          </p>
        </div>
        {/* Paper Texture */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")`
          }}
        />
      </div>
    );
  };

  // --- MIDNIGHT STYLE ---
  const renderMidnight = () => {
    return (
      <div className="relative w-full h-full bg-[#0F1115] flex flex-col justify-center items-center text-center p-8 md:p-12 overflow-hidden">
        {/* Stars / Sparkles */}
        <div className="absolute top-10 left-10 text-white/20 animate-pulse"><Sparkles className="w-4 h-4" /></div>
        <div className="absolute bottom-20 right-10 text-white/20 animate-pulse delay-700"><Sparkles className="w-6 h-6" /></div>
        <div className="absolute top-1/2 right-8 text-white/10"><Moon className="w-12 h-12" /></div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent pointer-events-none"></div>

        <div className="relative z-10 space-y-6 my-auto">
          <h1 className="font-serif text-3xl md:text-4xl leading-snug text-stone-100 font-light tracking-wide text-pretty drop-shadow-lg">
            "{note.content}"
          </h1>
        </div>
        <div className="absolute bottom-12 w-full px-12">
          <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-stone-400 border-t border-white/10 pt-4 inline-block px-6">
            {note.author}
          </p>
        </div>
        
        {/* Grain - mix-blend removed for screenshot compatibility */}
         <div 
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`
          }}
        />
      </div>
    );
  };

  // --- AURA STYLE ---
  const renderAura = () => {
    const getGradient = (theme: string) => {
      switch(theme) {
        case 'love': return 'from-rose-200 via-purple-100 to-orange-100';
        case 'peace': return 'from-blue-200 via-teal-100 to-indigo-100';
        case 'courage': return 'from-orange-200 via-amber-100 to-rose-100';
        default: return 'from-purple-200 via-pink-100 to-blue-100';
      }
    };

    return (
      <div className={`relative w-full h-full bg-gradient-to-br ${getGradient(note.theme)} flex flex-col justify-center items-center text-center p-8 md:p-12`}>
        {/* Blurred Orbs */}
        <div className="absolute top-0 left-0 w-48 h-48 bg-white/40 rounded-full blur-3xl transform -translate-x-10 -translate-y-10"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/30 rounded-full blur-3xl transform translate-x-10 translate-y-10"></div>

        <div className="relative z-10 space-y-6 my-auto">
          <h1 className="font-serif text-3xl md:text-4xl leading-snug text-ink/80 italic font-medium tracking-tight text-pretty">
            {note.content}
          </h1>
        </div>
        <div className="absolute bottom-12 w-full px-12">
          <p className="font-sans text-xs font-bold uppercase tracking-widest text-white/80 drop-shadow-sm">
            ✦ {note.author} ✦
          </p>
        </div>
      </div>
    );
  };

  // --- MINIMAL STYLE ---
  const renderMinimal = () => {
     const getBg = (theme: string) => {
      switch(theme) {
        case 'love': return 'bg-[#FFF0F0]'; // Soft Pink
        case 'peace': return 'bg-[#F0F4FF]'; // Soft Blue
        case 'courage': return 'bg-[#FFF8F0]'; // Soft Orange
        default: return 'bg-[#F5F5F5]'; // Light Grey
      }
    };

    return (
      <div className={`relative w-full h-full ${getBg(note.theme)} flex flex-col justify-between items-start text-left p-8 md:p-10`}>
        <div className="w-full flex justify-between items-center">
          <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center">
            <Sun className="w-4 h-4 text-ink/50" />
          </div>
          <span className="font-mono text-[10px] text-ink/40">
            {new Date(note.timestamp).toLocaleDateString()}
          </span>
        </div>

        <div className="my-auto">
          <h1 className="font-sans text-3xl md:text-4xl font-bold leading-tight text-ink tracking-tight text-pretty">
            {note.content}
          </h1>
        </div>

        <div className="w-full pt-8 border-t border-black/5">
          <p className="font-mono text-xs text-ink/60">
             — {note.author}
          </p>
        </div>
      </div>
    );
  };

  // --- RENDERER ---
  const renderStyle = () => {
    switch (note.style) {
      case 'midnight': return renderMidnight();
      case 'aura': return renderAura();
      case 'minimal': return renderMinimal();
      default: return renderClassic();
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto perspective-1000">
      <div 
        id="note-card-capture" 
        className={`
        relative 
        aspect-[4/5] 
        shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] 
        transition-all duration-700 ease-out
        animate-fade-in
        overflow-hidden
        bg-white
      `}>
        {renderStyle()}
      </div>
      
      {/* Date hint underneath - only in view mode */}
      {!viewMode && (
        <p className="text-center font-serif text-stone-400 text-xs mt-6 italic opacity-60">
          {new Date(note.timestamp).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric' })}
        </p>
      )}
    </div>
  );
};

export default NoteCard;