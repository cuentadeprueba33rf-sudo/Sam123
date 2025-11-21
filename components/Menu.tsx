import React from 'react';
import { X, Heart, Clock, Sparkles } from 'lucide-react';
import { Note } from '../types';

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
  savedNotes: Note[];
  onSelectNote: (note: Note) => void;
  onGenerateNew: () => void;
}

const Menu: React.FC<MenuProps> = ({ isOpen, onClose, savedNotes, onSelectNote, onGenerateNew }) => {
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
          <div className="flex justify-between items-center mb-8 border-b border-stone-200 pb-4">
            <h2 className="font-serif text-2xl text-ink italic">Mis Tesoros</h2>
            <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
              <X className="w-6 h-6 text-ink/60" />
            </button>
          </div>

          <div className="mb-6">
            <button 
              onClick={() => {
                onGenerateNew();
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 bg-ink text-paper py-3 rounded-lg font-sans text-sm uppercase tracking-widest hover:bg-ink/90 transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              Nueva Nota
            </button>
          </div>

          <div className="flex-1 overflow-y-auto hide-scrollbar space-y-4">
            {savedNotes.length === 0 ? (
              <div className="text-center text-stone-400 mt-10">
                <Heart className="w-12 h-12 mx-auto mb-2 opacity-20" />
                <p className="font-serif italic">Aún no has guardado ninguna nota.</p>
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