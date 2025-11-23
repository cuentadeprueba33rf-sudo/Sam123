import React from 'react';
import { CloudRain, Sun, Zap, Coffee, HelpCircle, X } from 'lucide-react';
import { Mood } from '../types';

interface MoodSelectorProps {
  onSelect: (mood: Mood) => void;
  onClose: () => void;
}

const moods: { id: Mood; label: string; icon: React.ElementType; color: string }[] = [
  { id: 'anxious', label: 'Ansiedad', icon: CloudRain, color: 'bg-blue-50 text-blue-600 border-blue-200' },
  { id: 'sad', label: 'Tristeza', icon: CloudRain, color: 'bg-indigo-50 text-indigo-600 border-indigo-200' },
  { id: 'grateful', label: 'Gratitud', icon: Sun, color: 'bg-amber-50 text-amber-600 border-amber-200' },
  { id: 'tired', label: 'Agotamiento', icon: Coffee, color: 'bg-stone-50 text-stone-600 border-stone-200' },
  { id: 'confused', label: 'Confusión', icon: HelpCircle, color: 'bg-purple-50 text-purple-600 border-purple-200' },
  { id: 'neutral', label: 'Sorpréndeme', icon: Zap, color: 'bg-rose-50 text-rose-600 border-rose-200' },
];

const MoodSelector: React.FC<MoodSelectorProps> = ({ onSelect, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-md" onClick={onClose}></div>
      
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl transform transition-all">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-serif text-2xl text-ink">¿Cómo está tu corazón hoy?</h2>
          <button onClick={onClose} className="p-2 text-stone-400 hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {moods.map((mood) => (
            <button
              key={mood.id}
              onClick={() => onSelect(mood.id)}
              className={`flex items-center gap-3 p-4 rounded-xl border transition-all hover:scale-[1.02] active:scale-95 ${mood.color}`}
            >
              <mood.icon className="w-5 h-5" />
              <span className="font-sans text-sm font-medium">{mood.label}</span>
            </button>
          ))}
        </div>
        
        <p className="text-center font-serif text-stone-400 text-xs mt-6 italic">
          El universo tiene el mensaje correcto para ti.
        </p>
      </div>
    </div>
  );
};

export default MoodSelector;