import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { Note, NoteStyle } from '../types';

interface CreateNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (note: Note) => void;
}

const CreateNoteModal: React.FC<CreateNoteModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [theme, setTheme] = useState<'hope' | 'courage' | 'love' | 'peace'>('hope');
  const [style, setStyle] = useState<NoteStyle>('classic');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const newNote: Note = {
      id: crypto.randomUUID(),
      content: content.trim(),
      author: author.trim() || "Yo mism@",
      theme,
      style,
      timestamp: Date.now()
    };

    onCreate(newNote);
    onClose();
    // Reset form
    setContent('');
    setAuthor('');
    setTheme('hope');
    setStyle('classic');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-ink/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-paper rounded-2xl shadow-2xl p-6 md:p-8 animate-fade-in max-h-[90vh] overflow-y-auto hide-scrollbar">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-stone-400 hover:text-ink transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="font-serif text-2xl text-ink italic mb-6 text-center">Escribir mi Nota</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-sans text-xs uppercase tracking-wider text-stone-500 mb-2">
              Tu mensaje
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={120}
              placeholder="Escribe algo hermoso hoy..."
              className="w-full p-4 bg-white border border-stone-200 rounded-xl font-serif text-lg text-ink focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/50 resize-none h-24 placeholder:text-stone-300"
            />
            <div className="text-right text-xs text-stone-300 mt-1">{content.length}/120</div>
          </div>

          <div>
            <label className="block font-sans text-xs uppercase tracking-wider text-stone-500 mb-2">
              Firma (Opcional)
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="ej: Nota Mental, Dios, Universo"
              maxLength={20}
              className="w-full p-3 bg-white border border-stone-200 rounded-lg font-sans text-sm text-ink focus:outline-none focus:border-gold"
            />
          </div>

          {/* Style Selector */}
          <div>
            <label className="block font-sans text-xs uppercase tracking-wider text-stone-500 mb-3">
              Estilo Visual
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'classic', label: 'Clásico', bg: 'bg-[#FDFBF7] border-stone-300' },
                { id: 'midnight', label: 'Noche', bg: 'bg-slate-800 text-white border-slate-600' },
                { id: 'aura', label: 'Aura', bg: 'bg-gradient-to-br from-purple-100 to-blue-100 border-purple-200' },
                { id: 'minimal', label: 'Minimal', bg: 'bg-gray-100 border-gray-200 font-bold' },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setStyle(s.id as NoteStyle)}
                  className={`h-16 rounded-lg border flex items-center justify-center transition-all ${s.bg} ${style === s.id ? 'ring-2 ring-offset-1 ring-ink' : 'opacity-70 hover:opacity-100'}`}
                >
                   <span className="text-[10px] font-sans uppercase">{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-sans text-xs uppercase tracking-wider text-stone-500 mb-3">
              Vibra (Color)
            </label>
            <div className="flex justify-between gap-2">
              {[
                { id: 'hope', color: 'bg-stone-100 border-stone-300', label: 'Paz' },
                { id: 'love', color: 'bg-rose-100 border-rose-300', label: 'Amor' },
                { id: 'courage', color: 'bg-orange-100 border-orange-300', label: 'Fuerza' },
                { id: 'peace', color: 'bg-blue-100 border-blue-300', label: 'Calma' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTheme(t.id as any)}
                  className={`flex-1 py-2 rounded-lg border transition-all ${theme === t.id ? `${t.color} ring-2 ring-offset-1 ring-stone-200` : 'bg-white border-stone-100 hover:bg-stone-50'}`}
                >
                   <span className="text-[10px] uppercase font-bold text-stone-600">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          <button 
            type="submit"
            disabled={!content.trim()}
            className="w-full py-3 bg-ink text-white rounded-xl font-sans text-xs uppercase tracking-widest hover:bg-ink/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 flex justify-center items-center gap-2"
          >
            <Check className="w-4 h-4" />
            Crear Nota
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateNoteModal;