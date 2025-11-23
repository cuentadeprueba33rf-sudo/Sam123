
import React, { useState } from 'react';
import { X, Sparkles, Command } from 'lucide-react';

interface AIInstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentInstruction: string;
  onSave: (instruction: string) => void;
}

const AIInstructionsModal: React.FC<AIInstructionsModalProps> = ({ isOpen, onClose, currentInstruction, onSave }) => {
  const [instruction, setInstruction] = useState(currentInstruction);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(instruction);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-paper rounded-2xl shadow-2xl p-6 md:p-8 animate-fade-in">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-stone-400 hover:text-ink transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-tr from-purple-100 to-rose-100 rounded-full flex items-center justify-center mb-3 shadow-sm">
             <Command className="w-6 h-6 text-purple-800" />
          </div>
          <h2 className="font-serif text-2xl text-ink italic text-center">Instrucciones Mágicas</h2>
          <p className="font-sans text-xs text-stone-400 mt-2 text-center max-w-[250px]">
            Pídele a la IA algo específico para tu próxima nota.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <textarea
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              placeholder="Ej: Usa una metáfora sobre el mar, hazla muy corta, cita un versículo, sé muy estoico..."
              className="w-full p-4 bg-white border border-stone-200 rounded-xl font-serif text-lg text-ink focus:outline-none focus:border-purple-300 focus:ring-1 focus:ring-purple-200 resize-none h-32 placeholder:text-stone-300 placeholder:italic"
            />
          </div>

          <div className="flex gap-2">
             <button 
              onClick={() => { setInstruction(''); onSave(''); onClose(); }}
              className="flex-1 py-3 bg-white border border-stone-200 text-stone-500 rounded-xl font-sans text-[10px] uppercase tracking-widest hover:bg-stone-50 transition-all"
            >
              Borrar / Limpiar
            </button>
            <button 
              onClick={handleSave}
              className="flex-[2] py-3 bg-ink text-white rounded-xl font-sans text-[10px] uppercase tracking-widest hover:bg-ink/90 transition-all active:scale-95 flex justify-center items-center gap-2"
            >
              <Sparkles className="w-3 h-3" />
              Guardar Instrucción
            </button>
          </div>
        </div>
        
        <p className="text-[10px] text-stone-300 text-center mt-4">
          Esta instrucción se aplicará a las siguientes notas que generes hasta que la borres.
        </p>
      </div>
    </div>
  );
};

export default AIInstructionsModal;
