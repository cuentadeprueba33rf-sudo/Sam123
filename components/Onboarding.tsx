
import React, { useState } from 'react';
import { Gender } from '../types';
import { ArrowRight } from 'lucide-react';

interface OnboardingProps {
  onComplete: (gender: Gender, name: string) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedGender, setSelectedGender] = useState<Gender | null>(null);
  const [name, setName] = useState('');

  const handleGenderSelect = (gender: Gender) => {
    setSelectedGender(gender);
    setStep(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedGender && name.trim()) {
      onComplete(selectedGender, name.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-white/30 backdrop-blur-xl animate-fade-in">
      <div className="max-w-md w-full bg-white p-8 md:p-12 rounded-2xl shadow-2xl border border-white/50 text-center transition-all duration-500">
        
        {step === 1 ? (
          <div className="animate-fade-in">
            <h1 className="font-serif text-3xl text-ink mb-2">Bienvenida/o</h1>
            <p className="font-serif text-stone-500 italic mb-8 text-lg">
              Antes de empezar, ¿cómo te gustaría que el universo se dirija a ti?
            </p>

            <div className="space-y-3">
              <button 
                onClick={() => handleGenderSelect('female')}
                className="w-full py-4 px-6 bg-stone-50 border border-stone-200 rounded-xl hover:bg-rose-50 hover:border-rose-200 hover:text-rose-800 transition-all duration-300 group"
              >
                <span className="font-sans text-sm tracking-widest uppercase text-stone-600 group-hover:text-rose-800">Ella</span>
                <span className="block font-serif text-xs text-stone-400 mt-1 group-hover:text-rose-400">Valiosa, amada, guerrera</span>
              </button>

              <button 
                onClick={() => handleGenderSelect('male')}
                className="w-full py-4 px-6 bg-stone-50 border border-stone-200 rounded-xl hover:bg-blue-50 hover:border-blue-200 hover:text-blue-800 transition-all duration-300 group"
              >
                <span className="font-sans text-sm tracking-widest uppercase text-stone-600 group-hover:text-blue-800">Él</span>
                <span className="block font-serif text-xs text-stone-400 mt-1 group-hover:text-blue-400">Valioso, amado, guerrero</span>
              </button>

              <button 
                onClick={() => handleGenderSelect('neutral')}
                className="w-full py-4 px-6 bg-stone-50 border border-stone-200 rounded-xl hover:bg-purple-50 hover:border-purple-200 hover:text-purple-800 transition-all duration-300 group"
              >
                <span className="font-sans text-sm tracking-widest uppercase text-stone-600 group-hover:text-purple-800">Elle / Neutro</span>
                <span className="block font-serif text-xs text-stone-400 mt-1 group-hover:text-purple-400">Energía sin etiquetas</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="animate-fade-in">
            <h1 className="font-serif text-3xl text-ink mb-2">Una cosa más...</h1>
            <p className="font-serif text-stone-500 italic mb-8 text-lg">
              ¿Cuál es tu nombre?
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Escribe tu nombre aquí..."
                className="w-full p-4 bg-stone-50 border border-stone-200 rounded-xl font-serif text-xl text-center text-ink focus:outline-none focus:border-stone-400 focus:ring-1 focus:ring-stone-300 placeholder:text-stone-300"
                autoFocus
              />

              <button 
                type="submit"
                disabled={!name.trim()}
                className="w-full py-4 bg-ink text-white rounded-xl font-sans text-xs uppercase tracking-widest hover:bg-stone-800 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Comenzar <ArrowRight className="w-4 h-4" />
              </button>
            </form>
            <button 
              onClick={() => setStep(1)} 
              className="mt-4 text-xs font-sans text-stone-400 hover:text-stone-600 underline"
            >
              Volver
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default Onboarding;
