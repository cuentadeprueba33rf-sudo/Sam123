
import React, { useState } from 'react';
import { X, Instagram, Twitter, MessageCircle, Video, Sparkles, Copy, Loader2, Share2 } from 'lucide-react';
import { Note, SocialPlatform, SocialStrategy } from '../types';
import { generateSocialStrategy } from '../services/geminiService';

interface SocialMediaStudioProps {
  isOpen: boolean;
  onClose: () => void;
  note: Note;
}

const SocialMediaStudio: React.FC<SocialMediaStudioProps> = ({ isOpen, onClose, note }) => {
  const [platform, setPlatform] = useState<SocialPlatform>('instagram');
  const [strategy, setStrategy] = useState<SocialStrategy | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await generateSocialStrategy(note.content, platform);
      setStrategy(result);
    } catch (e: any) {
      setError(e.message || "SAM está en un descanso cósmico. Intenta más tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("¡Copiado!");
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink/70 backdrop-blur-md" onClick={onClose}></div>

      <div className="relative w-full max-w-md bg-white rounded-3xl p-0 shadow-2xl overflow-hidden animate-fade-in flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 p-6 text-white relative shrink-0">
          <button onClick={onClose} className="absolute right-4 top-4 text-white/70 hover:text-white bg-black/10 rounded-full p-1">
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Share2 className="w-6 h-6 text-white" />
            </div>
            <h2 className="font-serif text-2xl font-bold italic">Social Studio</h2>
          </div>
          <p className="font-sans text-xs text-white/80 leading-relaxed">
            Potencia tu nota para redes. SAM creará el caption perfecto y la estrategia viral.
          </p>
        </div>

        <div className="p-6 overflow-y-auto hide-scrollbar flex-1">
          {/* Platform Selector */}
          <div className="grid grid-cols-4 gap-2 mb-6">
            {[
              { id: 'instagram', icon: Instagram, label: 'IG', color: 'text-pink-600 bg-pink-50 border-pink-200' },
              { id: 'tiktok', icon: Video, label: 'TikTok', color: 'text-black bg-stone-100 border-stone-300' },
              { id: 'twitter', icon: Twitter, label: 'X', color: 'text-blue-500 bg-blue-50 border-blue-200' },
              { id: 'whatsapp', icon: MessageCircle, label: 'Status', color: 'text-green-600 bg-green-50 border-green-200' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => { setPlatform(p.id as SocialPlatform); setStrategy(null); }}
                className={`flex flex-col items-center justify-center gap-1 p-3 rounded-xl border-2 transition-all ${platform === p.id ? p.color + ' ring-2 ring-offset-2 ring-stone-300' : 'border-transparent hover:bg-stone-50 text-stone-400'}`}
              >
                <p.icon className="w-5 h-5" />
                <span className="text-[10px] font-bold uppercase">{p.label}</span>
              </button>
            ))}
          </div>

          {!strategy ? (
             <div className="text-center py-8">
               <button 
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full py-4 bg-ink text-white rounded-xl font-sans text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
               >
                 {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                 {isLoading ? 'SAM está pensando...' : 'Generar Estrategia Viral'}
               </button>
               {error && <p className="text-red-500 text-xs mt-4 bg-red-50 p-2 rounded">{error}</p>}
             </div>
          ) : (
            <div className="space-y-6 animate-fade-in">
              
              {/* Viral Hook */}
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl relative group">
                <span className="absolute -top-3 left-4 bg-yellow-400 text-yellow-900 text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shadow-sm">
                   Gancho Viral (Hook)
                </span>
                <p className="font-serif text-lg text-stone-800 font-medium leading-tight pt-2">
                  "{strategy.viralHook}"
                </p>
                <button onClick={() => handleCopy(strategy.viralHook)} className="absolute top-2 right-2 p-1.5 text-yellow-600 hover:bg-yellow-100 rounded">
                  <Copy className="w-4 h-4" />
                </button>
              </div>

              {/* Caption */}
              <div className="bg-stone-50 border border-stone-200 p-4 rounded-xl relative">
                <span className="absolute -top-3 left-4 bg-stone-200 text-stone-600 text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                   Caption / Descripción
                </span>
                <p className="font-sans text-sm text-stone-600 whitespace-pre-line pt-2 leading-relaxed">
                  {strategy.caption}
                </p>
                <div className="mt-4 pt-3 border-t border-stone-200">
                  <p className="text-xs text-blue-600 font-medium">{strategy.hashtags.join(' ')}</p>
                </div>
                <button onClick={() => handleCopy(`${strategy.caption}\n\n${strategy.hashtags.join(' ')}`)} className="absolute top-2 right-2 p-1.5 text-stone-400 hover:bg-stone-100 rounded">
                  <Copy className="w-4 h-4" />
                </button>
              </div>

              {/* Tip */}
              <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex gap-3">
                 <div className="bg-indigo-100 p-2 rounded-full h-fit shrink-0">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                 </div>
                 <div>
                    <h4 className="font-bold text-xs uppercase text-indigo-800 mb-1">Tip de SAM</h4>
                    <p className="text-xs text-indigo-600 leading-relaxed">{strategy.strategyTip}</p>
                 </div>
              </div>

              <button 
                onClick={handleGenerate} 
                className="w-full py-3 border border-stone-200 text-stone-500 rounded-xl font-sans text-[10px] uppercase tracking-wider hover:bg-stone-50"
              >
                Generar otra versión
              </button>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SocialMediaStudio;
