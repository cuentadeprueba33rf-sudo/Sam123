
import React, { useState } from 'react';
import { Crown, AlertTriangle, Zap, Sparkles, X, Check, Snowflake } from 'lucide-react';
import { AppMode } from '../types';

interface ModeSelectorProps {
  currentMode: AppMode;
  onSelect: (mode: AppMode) => void;
  onClose: () => void;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({ currentMode, onSelect, onClose }) => {
  const [selectedMode, setSelectedMode] = useState<AppMode>(currentMode);
  
  const modes: { id: AppMode; label: string; desc: string; icon: React.ElementType; style: string }[] = [
    { 
      id: 'christmas', 
      label: 'Navidad Mágica', 
      desc: 'Esperanza, regalos del alma y nuevos comienzos.', 
      icon: Snowflake, 
      style: 'bg-[#0f2c22] border-[#C5A065] text-[#C5A065] hover:bg-[#1a382e]' 
    },
    { 
      id: 'neutral', 
      label: 'Neutro / Paz', 
      desc: 'Equilibrio, espiritualidad y calma.', 
      icon: Sparkles, 
      style: 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100' 
    },
    { 
      id: 'egocentric', 
      label: 'Modo Egocéntrico', 
      desc: 'Eres el premio. Amor propio radical.', 
      icon: Crown, 
      style: 'bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100' 
    },
    { 
      id: 'redflags', 
      label: 'Modo Red Flags', 
      desc: 'Amiga date cuenta. Realidad directa.', 
      icon: AlertTriangle, 
      style: 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100' 
    },
    { 
      id: 'power', 
      label: 'Modo Poder', 
      desc: 'Ambición, éxito, dinero y disciplina.', 
      icon: Zap, 
      style: 'bg-slate-900 border-slate-700 text-slate-100 hover:bg-slate-800' 
    },
  ];

  const handleContinue = () => {
    onSelect(selectedMode);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-stone-400 hover:text-ink transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-4 text-center">
          <h2 className="font-serif text-2xl text-ink italic">Elige tu Vibra</h2>
          <p className="font-sans text-xs text-stone-400 mt-2">
            La interfaz y los mensajes se adaptarán a ti.
          </p>
        </div>

        <div className="flex flex-col gap-3 overflow-y-auto hide-scrollbar mb-6 flex-1">
          {modes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setSelectedMode(mode.id)}
              className={`relative flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-300 active:scale-95 group text-left ${mode.style} ${selectedMode === mode.id ? 'ring-2 ring-offset-2 ring-ink scale-[1.02] shadow-md' : 'opacity-80 hover:opacity-100'}`}
            >
              <div className={`p-2 rounded-full shrink-0 ${mode.id === 'christmas' ? 'bg-[#C5A065]/20' : 'bg-white/50'}`}>
                <mode.icon className="w-5 h-5" />
              </div>
              <div>
                <span className="block font-sans text-sm font-bold uppercase tracking-wide">{mode.label}</span>
                <span className="block font-serif text-xs opacity-80 mt-1 italic">{mode.desc}</span>
              </div>
              {selectedMode === mode.id && (
                <div className="absolute right-4">
                   <div className="w-4 h-4 rounded-full bg-current flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                   </div>
                </div>
              )}
            </button>
          ))}
        </div>

        <button 
          onClick={handleContinue}
          className="w-full py-4 bg-ink text-white rounded-xl font-sans text-xs uppercase tracking-[0.2em] hover:bg-ink/90 transition-all active:scale-95 flex items-center justify-center gap-2 shadow-xl"
        >
          Continuar
        </button>
      </div>
    </div>
  );
};

export default ModeSelector;
