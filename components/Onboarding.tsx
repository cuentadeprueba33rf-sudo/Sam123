import React from 'react';
import { Gender } from '../types';

interface OnboardingProps {
  onComplete: (gender: Gender) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-white/30 backdrop-blur-xl animate-fade-in">
      <div className="max-w-md w-full bg-white p-8 md:p-12 rounded-2xl shadow-2xl border border-white/50 text-center">
        <h1 className="font-serif text-3xl text-ink mb-2">Bienvenida/o</h1>
        <p className="font-serif text-stone-500 italic mb-8 text-lg">
          Antes de empezar, ¿cómo te gustaría que el universo se dirija a ti?
        </p>

        <div className="space-y-3">
          <button 
            onClick={() => onComplete('female')}
            className="w-full py-4 px-6 bg-stone-50 border border-stone-200 rounded-xl hover:bg-rose-50 hover:border-rose-200 hover:text-rose-800 transition-all duration-300 group"
          >
            <span className="font-sans text-sm tracking-widest uppercase text-stone-600 group-hover:text-rose-800">Ella</span>
            <span className="block font-serif text-xs text-stone-400 mt-1 group-hover:text-rose-400">Valiosa, amada, guerrera</span>
          </button>

          <button 
            onClick={() => onComplete('male')}
            className="w-full py-4 px-6 bg-stone-50 border border-stone-200 rounded-xl hover:bg-blue-50 hover:border-blue-200 hover:text-blue-800 transition-all duration-300 group"
          >
            <span className="font-sans text-sm tracking-widest uppercase text-stone-600 group-hover:text-blue-800">Él</span>
            <span className="block font-serif text-xs text-stone-400 mt-1 group-hover:text-blue-400">Valioso, amado, guerrero</span>
          </button>

          <button 
            onClick={() => onComplete('neutral')}
            className="w-full py-4 px-6 bg-stone-50 border border-stone-200 rounded-xl hover:bg-purple-50 hover:border-purple-200 hover:text-purple-800 transition-all duration-300 group"
          >
            <span className="font-sans text-sm tracking-widest uppercase text-stone-600 group-hover:text-purple-800">Elle / Neutro</span>
            <span className="block font-serif text-xs text-stone-400 mt-1 group-hover:text-purple-400">Energía sin etiquetas</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;