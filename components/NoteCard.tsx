import React, { useState, useRef } from 'react';
import { Note } from '../types';
import { Quote, Sparkles, Moon, Star, Leaf, Film, Feather, Heart } from 'lucide-react';

interface NoteCardProps {
  note: Note;
  viewMode: boolean; // If true, hides hints to look good in screenshots
  className?: string;
  id?: string;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, viewMode, className = '', id }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  // 3D Parallax Logic
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (viewMode || !cardRef.current) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    
    // Handle both mouse and touch
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate rotation (limit max degrees for subtle effect)
    const rotateX = ((y - centerY) / centerY) * -5; // Max 5 deg tilt X
    const rotateY = ((x - centerX) / centerX) * 5;  // Max 5 deg tilt Y

    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    // Reset to flat
    setTilt({ x: 0, y: 0 });
  };

  // Calculate dynamic font size based on text length
  const getDynamicFontSize = (text: string) => {
    const len = text.length;
    if (len < 40) return 'text-4xl md:text-5xl leading-tight'; // Very short
    if (len < 80) return 'text-3xl md:text-4xl leading-snug'; // Medium
    return 'text-2xl md:text-3xl leading-snug'; // Long
  };

  const fontSizeClass = getDynamicFontSize(note.content);

  // --- CLASSIC STYLE (UNTOUCHED) ---
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
          <h1 className={`font-serif ${fontSizeClass} text-ink font-medium tracking-tight text-pretty drop-shadow-sm transition-all duration-300 select-none`}>
            {note.content}
          </h1>
        </div>
        <div className="absolute bottom-12 w-full px-12">
          <div className="h-px w-12 bg-gold/30 mx-auto mb-4"></div>
          <p className="font-sans text-xs uppercase tracking-[0.2em] text-stone-500">
            {note.author}
          </p>
        </div>
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
      <div className="relative w-full h-full bg-[#050505] flex flex-col justify-center items-center text-center p-8 md:p-12 overflow-hidden border border-stone-800">
        <div className="absolute inset-2 border border-white/10 rounded-sm"></div>
        <div className="absolute top-12 left-12 text-white/30 animate-pulse"><Star className="w-3 h-3 fill-white" /></div>
        <div className="absolute bottom-20 right-10 text-white/20 animate-pulse delay-700"><Sparkles className="w-5 h-5" /></div>
        <div className="absolute top-8 text-white/10">
          <Moon className="w-8 h-8" />
        </div>
        <div className="relative z-10 space-y-6 my-auto">
          <h1 className={`font-serif ${fontSizeClass} text-stone-100 font-light tracking-wide text-pretty drop-shadow-[0_0_15px_rgba(255,255,255,0.15)] transition-all duration-300 select-none`}>
            {note.content}
          </h1>
        </div>
        <div className="absolute bottom-12 w-full px-12">
          <div className="flex items-center justify-center gap-4 mb-4 opacity-30">
             <div className="h-px w-8 bg-white"></div>
             <div className="w-1 h-1 rounded-full bg-white"></div>
             <div className="h-px w-8 bg-white"></div>
          </div>
          <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-stone-400">
            {note.author}
          </p>
        </div>
      </div>
    );
  };

  // --- AURA STYLE ---
  const renderAura = () => {
    const getGradient = (theme: string) => {
      switch(theme) {
        case 'love': return 'bg-gradient-to-br from-[#ffDEE9] via-[#B5FFFC] to-[#FF9A9E]';
        case 'peace': return 'bg-gradient-to-tr from-[#E0C3FC] via-[#8EC5FC] to-[#E0C3FC]';
        case 'courage': return 'bg-gradient-to-bl from-[#fad0c4] via-[#ffd1ff] to-[#f6d365]';
        default: return 'bg-gradient-to-br from-[#a18cd1] via-[#fbc2eb] to-[#a6c1ee]';
      }
    };
    return (
      <div className={`relative w-full h-full ${getGradient(note.theme)} flex flex-col justify-center items-center text-center p-6`}>
        <div className="relative w-full h-full bg-white/30 backdrop-blur-md rounded-xl border border-white/40 shadow-sm flex flex-col justify-center items-center p-8">
          <div className="absolute -top-3 -right-3 text-white/80 animate-float">
             <Sparkles className="w-8 h-8" />
          </div>
          <div className="relative z-10 space-y-6 my-auto">
            <h1 className={`font-serif ${fontSizeClass} text-ink/90 italic font-medium tracking-tight text-pretty transition-all duration-300 drop-shadow-sm select-none`}>
              {note.content}
            </h1>
          </div>
          <div className="mt-8 pt-4 border-t border-white/50 w-full max-w-[120px]">
            <p className="font-sans text-[10px] font-bold uppercase tracking-widest text-ink/60">
              {note.author}
            </p>
          </div>
        </div>
      </div>
    );
  };

  // --- MINIMAL STYLE ---
  const renderMinimal = () => {
    return (
      <div className="relative w-full h-full bg-white flex flex-col justify-between p-8 md:p-10 border border-stone-100">
        <div className="w-full flex justify-between items-start border-b border-black pb-4">
          <div className="w-4 h-4 bg-black rounded-full"></div>
          <span className="font-sans font-bold text-xs uppercase tracking-tighter text-black">
            NO. {new Date(note.timestamp).getDate().toString().padStart(2, '0')}
          </span>
        </div>
        <div className="my-auto">
          <h1 className={`font-sans ${fontSizeClass} font-bold text-black tracking-tighter text-pretty leading-[0.9] transition-all duration-300 uppercase select-none`}>
            {note.content}
          </h1>
        </div>
        <div className="w-full flex justify-end items-end">
          <div className="text-right">
             <p className="font-serif italic text-sm text-stone-500 mb-1">written by</p>
             <p className="font-sans font-bold text-xs uppercase tracking-widest text-black bg-black text-white px-2 py-1 inline-block">
                {note.author}
             </p>
          </div>
        </div>
      </div>
    );
  };

  // --- BOTANICAL STYLE ---
  const renderBotanical = () => {
    return (
      <div className="relative w-full h-full bg-[#F3F6F3] flex flex-col justify-center items-center text-center p-8 border-8 border-double border-[#8FBC8F]/30">
        <div className="absolute top-4 left-4 text-[#8FBC8F] opacity-60">
          <Leaf className="w-8 h-8 rotate-[-45deg]" />
        </div>
        <div className="absolute bottom-4 right-4 text-[#8FBC8F] opacity-60">
          <Leaf className="w-8 h-8 rotate-[135deg]" />
        </div>
        
        <div className="relative z-10 space-y-8 my-auto max-w-[90%]">
          <h1 className={`font-serif ${fontSizeClass} text-[#2F4F4F] font-normal tracking-wide text-pretty drop-shadow-sm select-none`}>
            {note.content}
          </h1>
        </div>
        
        <div className="absolute bottom-10 w-full flex justify-center">
           <div className="px-6 py-2 border-t border-b border-[#8FBC8F]/40">
              <p className="font-serif italic text-[#556B2F] text-sm">
                — {note.author} —
              </p>
           </div>
        </div>
        
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%232F4F4F' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='1'/%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
      </div>
    );
  };

  // --- CINEMA STYLE ---
  const renderCinema = () => {
    return (
      <div className="relative w-full h-full bg-[#111] flex flex-col justify-center items-center text-center overflow-hidden">
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none z-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`
          }}
        />
        
        <div className="absolute top-0 w-full h-16 bg-black z-10 border-b border-stone-800"></div>
        <div className="absolute bottom-0 w-full h-16 bg-black z-10 border-t border-stone-800 flex items-center justify-center">
             <div className="flex items-center gap-2 opacity-50">
                <Film className="w-3 h-3 text-white" />
                <span className="text-[8px] text-white font-mono tracking-widest">SCENE {new Date(note.timestamp).getDay() + 1}</span>
             </div>
        </div>

        <div className="relative z-10 px-8 my-auto">
          <h1 className={`font-sans ${fontSizeClass} italic font-medium text-[#F0E68C] text-pretty drop-shadow-md leading-relaxed tracking-wide select-none`}>
            "{note.content}"
          </h1>
        </div>

        <div className="relative z-10 mb-20 opacity-70">
           <p className="font-sans text-[10px] uppercase tracking-widest text-white/60">
             Directed by {note.author}
           </p>
        </div>
      </div>
    );
  };

  // --- VINTAGE STYLE ---
  const renderVintage = () => {
    return (
      <div className="relative w-full h-full bg-[#F5F1E6] flex flex-col justify-center items-center text-center p-8">
        <div className="absolute inset-4 border-2 border-dashed border-[#8B4513]/30 pointer-events-none"></div>
        
        <div className="absolute top-8 right-8 w-16 h-16 border-2 border-[#8B4513]/20 rounded-full flex items-center justify-center rotate-12 opacity-40">
           <Feather className="w-6 h-6 text-[#8B4513]" />
        </div>

        <div className="relative z-10 space-y-6 my-auto">
          <h1 className={`font-serif ${fontSizeClass} text-[#3E2723] font-medium tracking-normal text-pretty select-none`}>
            {note.content}
          </h1>
        </div>
        
        <div className="absolute bottom-12 w-full">
           <p className="font-serif italic text-[#8B4513] text-sm mb-1 opacity-70">Sinceramente,</p>
           <p className="font-serif font-bold text-[#5D4037] text-xs uppercase tracking-widest">
             {note.author}
           </p>
        </div>
        
        <div 
          className="absolute inset-0 bg-yellow-900/5 pointer-events-none mix-blend-multiply" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='4' height='4' viewBox='0 0 4 4' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 3h1v1H1V3zm2-2h1v1H3V1z' fill='%238B4513' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E")`
          }}
        />
      </div>
    );
  };

  // --- ROSE STYLE ---
  const renderRose = () => {
    return (
      <div className="relative w-full h-full bg-[#FFF0F5] flex flex-col justify-center items-center text-center p-6 border-[12px] border-white shadow-inner">
        <div className="absolute inset-0 border border-pink-200 m-3 rounded-[30px] pointer-events-none"></div>
        
        <div className="absolute top-8 text-pink-300 opacity-80">
          <Heart className="w-6 h-6 fill-pink-100" />
        </div>

        <div className="relative z-10 space-y-6 my-auto px-4">
          <h1 className={`font-serif ${fontSizeClass} text-[#DB7093] italic font-medium tracking-tight text-pretty drop-shadow-sm select-none`}>
            {note.content}
          </h1>
        </div>
        
        <div className="absolute bottom-10 w-full">
           <div className="inline-block px-4 py-1 bg-white rounded-full shadow-sm border border-pink-100">
             <p className="font-serif text-[#C71585] text-xs tracking-wider">
               con amor, {note.author}
             </p>
           </div>
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
      case 'botanical': return renderBotanical();
      case 'cinema': return renderCinema();
      case 'vintage': return renderVintage();
      case 'rose': return renderRose();
      default: return renderClassic();
    }
  };

  return (
    <div 
      className={`relative w-full max-w-md mx-auto perspective-1000 ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleMouseMove}
      onTouchEnd={handleMouseLeave}
    >
      <div 
        id={id}
        ref={cardRef}
        style={{
          transform: !viewMode 
            ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1)` 
            : 'none',
          transition: !viewMode ? 'transform 0.1s ease-out' : 'none'
        }}
        className={`
        relative 
        aspect-[4/5] 
        shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] 
        animate-fade-in
        overflow-hidden
        bg-white
        cursor-default
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