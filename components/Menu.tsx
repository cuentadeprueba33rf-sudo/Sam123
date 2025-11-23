import React from 'react';
import { X, Heart, Clock, Sparkles, PenTool, LayoutTemplate, Wand2 } from 'lucide-react';
import { Note, AppBackground } from '../types';

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
  savedNotes: Note[];
  onSelectNote: (note: Note) => void;
  onGenerateNew: () => void;
  onCreateOwn: () => void;
  onOpenEnhancer: () => void;
  currentBackground: AppBackground;
  onSetBackground: (bg: AppBackground) => void;
}

const Menu: React.FC<MenuProps> = ({ 
  isOpen, 
  onClose, 
  savedNotes, 
  onSelectNote, 
  onGenerateNew, 
  onCreateOwn,
  onOpenEnhancer,
  currentBackground,
  onSetBackground
}) => {
  
  const backgrounds: { id: AppBackground; label: string; class: string }[] = [
    { id: 'auto', label: 'Magia', class: 'bg-gradient-to-br from-stone-100 to-stone-200 border-stone-300' },
    { id: 'light', label: 'Luz', class: 'bg-[#FDFBF7] border-stone-200' },
    { id: 'dark', label: 'Noche', class: 'bg-[#0f1115] border-stone-700 text-white' },
    { id: 'aura', label: 'Aura', class: 'bg-gradient-to-br from-rose-100 to-blue-100 border-white' },
  ];

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-ink/20 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`fixed right-0 top-0 h-full w-80 bg-paper shadow-2xl z-50 transform transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-6 border-b border-stone-200 pb-4">
            <h2 className="font-serif text-2xl text-ink italic">Mis Tesoros</h2>
            <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
              <X className="w-6 h-6 text-ink/60" />
            </button>
          </div>

          {/* Actions */}
          <div className="mb-6 space-y-3">
            <button 
              onClick={() => {
                onGenerateNew();
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 bg-ink text-paper py-3 rounded-lg font-sans text-xs uppercase tracking-widest hover:bg-ink/90 transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              Pedir al Universo
            </button>
            
            <button 
              onClick={() => {
                onCreateOwn();
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 bg-white border border-stone-200 text-ink py-3 rounded-lg font-sans text-xs uppercase tracking-widest hover:bg-stone-50 transition-all active:scale-95"
            >
              <PenTool className="w-4 h-4" />
              Escribir mi nota
            </button>

            <button 
              onClick={() => {
                onOpenEnhancer();
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-100 text-purple-900 py-3 rounded-lg font-sans text-xs uppercase tracking-widest hover:bg-purple-100 transition-all active:scale-95"
            >
              <Wand2 className="w-4 h-4" />
              Mejorar Calidad (IA)
            </button>
          </div>

          {/* Background Selector */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3 text-stone-400">
              <LayoutTemplate className="w-4 h-4" />
              <span className="font-sans text-xs uppercase tracking-wider">Atmósfera</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {backgrounds.map((bg) => (
                <button
                  key={bg.id}
                  onClick={() => onSetBackground(bg.id)}
                  className={`flex flex-col items-center gap-2 group`}
                >
                  <div className={`w-12 h-12 rounded-full border-2 shadow-sm transition-all ${bg.class} ${currentBackground === bg.id ? 'ring-2 ring-offset-2 ring-ink scale-105' : 'opacity-70 group-hover:opacity-100'}`}>
                    {bg.id === 'auto' && (
                      <div className="w-full h-full flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-stone-400" />
                      </div>
                    )}
                  </div>
                  <span className={`text-[9px] font-sans uppercase tracking-widest ${currentBackground === bg.id ? 'text-ink font-bold' : 'text-stone-400'}`}>
                    {bg.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Saved List */}
          <div className="flex-1 overflow-y-auto hide-scrollbar space-y-4">
            <h3 className="font-sans text-xs uppercase tracking-wider text-stone-400 mb-2">Guardadas</h3>
            {savedNotes.length === 0 ? (
              <div className="text-center text-stone-400 mt-4">
                <Heart className="w-8 h-8 mx-auto mb-2 opacity-20" />
                <p className="font-serif italic text-sm">Tu colección está vacía.</p>
              </div>
            ) : (
              savedNotes.map((note) => (
                <div 
                  key={note.id} 
                  onClick={() => {
                    onSelectNote(note);
                    onClose();
                  }}
                  className="p-4 bg-white border border-stone-100 shadow-sm rounded-xl cursor-pointer hover:shadow-md transition-all hover:-translate-y-1 group"
                >
                  <p className="font-serif text-ink/80 text-lg leading-snug line-clamp-3 mb-2 group-hover:text-ink">
                    "{note.content}"
                  </p>
                  <div className="flex justify-between items-center text-xs text-stone-400 font-sans uppercase tracking-wider">
                    <span>{note.author}</span>
                    <span className="flex items-center gap-1">
                       <Clock className="w-3 h-3" />
                       {new Date(note.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="mt-auto pt-6 text-center">
            <p className="font-serif text-xs text-stone-300 italic">Hecho con amor para ti</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Menu;