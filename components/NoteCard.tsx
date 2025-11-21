import React from 'react';
import { Note } from '../types';
import { Quote } from 'lucide-react';

interface NoteCardProps {
  note: Note;
  viewMode: boolean; // If true, hides hints to look good in screenshots
}

const NoteCard: React.FC<NoteCardProps> = ({ note, viewMode }) => {
  
  // Visual themes based on note type
  const getThemeStyles = (theme: string) => {
    switch (theme) {
      case 'love': return 'border-rose-200 bg-gradient-to-b from-rose-50/80 to-white';
      case 'peace': return 'border-blue-100 bg-gradient-to-b from-slate-50/80 to-white';
      case 'courage': return 'border-orange-100 bg-gradient-to-b from-orange-50/50 to-white';
      default: return 'border-stone-200 bg-gradient-to-b from-stone-50 to-white';
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto perspective-1000">
      <div 
        id="note-card-capture" 
        className={`
        relative 
        bg-white 
        aspect-[4/5] 
        p-8 md:p-12 
        shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] 
        border-4 ${getThemeStyles(note.theme)}
        flex flex-col justify-center items-center text-center
        transition-all duration-700 ease-out
        animate-fade-in
      `}>
        {/* Decorative corners */}
        <div className="absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 border-ink/5 opacity-50"></div>
        <div className="absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 border-ink/5 opacity-50"></div>
        
        {/* Top decoration */}
        <div className="absolute top-8 text-gold opacity-40">
          <Quote className="w-8 h-8 rotate-180" />
        </div>

        {/* Main Content */}
        <div className="relative z-10 space-y-6 my-auto">
          <h1 className="font-serif text-3xl md:text-4xl lg:text-4xl leading-snug text-ink font-medium tracking-tight text-pretty drop-shadow-sm">
            {note.content}
          </h1>
        </div>

        {/* Footer / Signature */}
        <div className="absolute bottom-12 w-full px-12">
          <div className="h-px w-12 bg-gold/30 mx-auto mb-4"></div>
          <p className="font-sans text-xs uppercase tracking-[0.2em] text-stone-500">
            {note.author}
          </p>
          {!viewMode && (
            <p className="font-serif text-stone-300 text-xs mt-2 italic opacity-60">
              {new Date(note.timestamp).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric' })}
            </p>
          )}
        </div>

        {/* Texture overlay - Fixed: Uses Data URI instead of external URL to prevent blank images in screenshots */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none mix-blend-multiply"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")`
          }}
        />
      </div>
    </div>
  );
};

export default NoteCard;