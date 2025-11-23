
import React from 'react';
import { X, PenTool, BatteryWarning } from 'lucide-react';

interface LimitReachedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToManual: () => void;
}

const LimitReachedModal: React.FC<LimitReachedModalProps> = ({ isOpen, onClose, onSwitchToManual }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-sm bg-paper rounded-2xl shadow-2xl p-6 md:p-8 animate-fade-in text-center border border-stone-200">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-stone-400 hover:text-ink transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
           <BatteryWarning className="w-8 h-8 text-stone-500" />
        </div>

        <h2 className="font-serif text-2xl text-ink italic mb-2">Energía Agotada</h2>
        
        <p className="font-sans text-xs text-stone-500 leading-relaxed mb-6">
          Has usado tus <span className="font-bold text-ink">10 deseos de IA</span> por hoy. 
          La magia necesita recargarse. Mientras tanto, tu propia voz es la más poderosa.
        </p>

        <div className="space-y-3">
          <button 
            onClick={() => {
              onClose();
              onSwitchToManual();
            }}
            className="w-full py-3 bg-ink text-white rounded-xl font-sans text-xs uppercase tracking-widest hover:bg-ink/90 transition-all active:scale-95 flex justify-center items-center gap-2"
          >
            <PenTool className="w-4 h-4" />
            Escribir manualmente
          </button>

          <button 
            onClick={onClose}
            className="w-full py-3 bg-transparent border border-stone-200 text-stone-500 rounded-xl font-sans text-xs uppercase tracking-widest hover:bg-stone-50 transition-all"
          >
            Volver mañana
          </button>
        </div>
      </div>
    </div>
  );
};

export default LimitReachedModal;
