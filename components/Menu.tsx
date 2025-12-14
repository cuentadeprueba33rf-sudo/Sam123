
import React from 'react';
import { X, Heart, Clock, Sparkles, PenTool, LayoutTemplate, Wand2, Moon, Palette, Snowflake } from 'lucide-react';
import { Note, AppBackground, NoteStyle, AppInterfaceTheme } from '../types';

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
  savedNotes: Note[];
  onSelectNote: (note: Note) => void;
  onGenerateNew: () => void;
  onCreateOwn: () => void;
  onOpenEnhancer: () => void;
  onGetFallbackNote: () => void;
  onSelectStyle: (style: NoteStyle) => void;
  currentBackground: AppBackground;
  onSetBackground: (bg: AppBackground) => void;
  currentInterfaceTheme: AppInterfaceTheme;
  onSetInterfaceTheme: (theme: AppInterfaceTheme) => void;
}

const Menu: React.FC<MenuProps> = ({ 
  isOpen, 
  onClose, 
  savedNotes, 
  onSelectNote, 
  onGenerateNew, 
  onCreateOwn,
  onOpenEnhancer,
  onGetFallbackNote,
  onSelectStyle,
  currentBackground,
  onSetBackground,
  currentInterfaceTheme,
  onSetInterfaceTheme
}) => {
  
  const interfaceThemes: { id: AppInterfaceTheme; label: string; class: string; icon: React.ElementType }[] = [
    { id: 'essence', label: 'Esencia', class: 'bg-[#F0EFEB] border-stone-200 text-stone-600', icon: Sparkles },
    { id: 'cosmos', label: 'Cosmos', class: 'bg-[#0a0a0c] border-slate-700 text-indigo-300', icon: Moon },
    { id: 'coquette', label: 'Coquette', class: 'bg-[#FFF0F5] border-pink-200 text-pink-500', icon: Heart },
    { id: 'christmas', label: 'Navidad', class: 'bg-[#0f2c22] border-[#C5A065] text-[#C5A065]', icon: Snowflake },
  ];

  const styles: { id: NoteStyle; label: string; class: string }[] = [
    { id: 'classic', label: 'Clásico', class: 'bg-[#FDFBF7] border-stone-300' },
    { id: 'midnight', label: 'Noche', class: 'bg-slate-800 border-slate-600 text-white' },
    { id: 'aura', label: 'Aura', class: 'bg-gradient-to-br from-purple-100 to-blue-100 border-purple-200' },
    { id: 'minimal', label: 'Minimal', class: 'bg-gray-100 border-gray-200 font-bold' },
    { id: 'botanical', label: 'Botánica', class: 'bg-[#F3F6F3] border-[#8FBC8F] text-[#2F4F4F]' },
    { id: 'cinema', label: 'Cine', class: 'bg-black border-stone-700 text-white' },
    { id: 'vintage', label: 'Retro', class: 'bg-[#F5F1E6] border-[#8B4513]' },
    { id: 'rose', label: 'Rose', class: 'bg-[#FFF0F5] border-pink-200' },
    { id: 'christmas', label: 'Festiva', class: 'bg-[#390909] border-[#C5A065] text-[#C5A065]' },
  ];

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-ink/20 backdrop-blur-sm z-[100] transition-opacity duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div 
        className={`fixed inset-y-0 right-0 w-full max-w-sm bg-white z-[101] shadow-2xl transform transition-transform duration-500 ease-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-6 flex justify-between items-center border-b border-stone-100">
          <h2 className="font-serif text-2xl text-ink italic">Menú</h2>
          <button onClick={onClose} className="p-2 hover:bg-stone-50 rounded-full text-stone-400 hover:text-ink transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 hide-scrollbar">
          
          {/* Main Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => { onClose(); onGenerateNew(); }}
              className="p-4 rounded-xl bg-ink text-white shadow-lg flex flex-col items-center justify-center gap-2 hover:bg-stone-800 transition-colors"
            >
              <Sparkles className="w-5 h-5" />
              <span className="font-sans text-xs uppercase tracking-widest">Crear Magia</span>
            </button>
            <button 
              onClick={() => { onClose(); onCreateOwn(); }}
              className="p-4 rounded-xl border border-stone-200 text-stone-600 flex flex-col items-center justify-center gap-2 hover:bg-stone-50 transition-colors"
            >
              <PenTool className="w-5 h-5" />
              <span className="font-sans text-xs uppercase tracking-widest">Escribir</span>
            </button>
          </div>

          <button 
             onClick={() => { onClose(); onOpenEnhancer(); }}
             className="w-full p-4 rounded-xl border border-purple-100 bg-purple-50 text-purple-700 flex items-center justify-center gap-3 hover:bg-purple-100 transition-colors group"
          >
             <Wand2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
             <span className="font-sans text-xs uppercase tracking-widest">Restaurar Calidad (HD)</span>
          </button>

          {/* New Interface Theme Selector */}
          <div>
            <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-stone-400 mb-4 flex items-center gap-2">
              <Palette className="w-4 h-4" /> Apariencia de la App
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {interfaceThemes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => onSetInterfaceTheme(theme.id)}
                  className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all ${theme.class} ${currentInterfaceTheme === theme.id ? 'ring-2 ring-offset-2 ring-ink' : 'opacity-60 hover:opacity-100'}`}
                >
                  <theme.icon className="w-5 h-5" />
                  <span className="font-sans text-[10px] uppercase font-bold">{theme.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Saved Notes List */}
          <div>
            <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-stone-400 mb-4 flex items-center gap-2">
              <Heart className="w-4 h-4" /> Mis Guardados
            </h3>
            {savedNotes.length === 0 ? (
              <div className="text-center py-8 bg-stone-50 rounded-xl border border-stone-100 border-dashed">
                <p className="font-serif text-stone-400 italic">Aún no has guardado notas.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {savedNotes.map((note) => (
                  <button
                    key={note.id}
                    onClick={() => {
                      onSelectNote(note);
                      onClose();
                    }}
                    className="w-full p-4 text-left bg-white border border-stone-100 rounded-xl hover:border-stone-300 hover:shadow-md transition-all group"
                  >
                    <p className="font-serif text-ink text-lg line-clamp-2 group-hover:text-black">"{note.content}"</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="font-sans text-[10px] uppercase text-stone-400 tracking-wider">{note.author}</span>
                      <span className="font-sans text-[10px] text-stone-300 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(note.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="pt-6 border-t border-stone-100 space-y-2">
             <button 
               onClick={() => { onClose(); onGetFallbackNote(); }}
               className="w-full py-3 text-stone-400 hover:text-stone-600 font-sans text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
             >
               <LayoutTemplate className="w-4 h-4" />
               Ver nota aleatoria
             </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default Menu;
