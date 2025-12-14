
import React, { useState, useEffect } from 'react';
import { X, Lock, Gift, Sparkles, Clock, CheckCircle2, Zap, BookOpen } from 'lucide-react';

interface RewardsPassProps {
  isOpen: boolean;
  onClose: () => void;
  currentLevel: number;
  nextClaimTime: number;
  onClaimReward: (newLevel: number) => void;
}

const RewardsPass: React.FC<RewardsPassProps> = ({ isOpen, onClose, currentLevel, nextClaimTime, onClaimReward }) => {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [canClaim, setCanClaim] = useState(false);

  // Rewards Configuration
  const rewards = [
    { level: 1, type: 'gens', value: '+3 Gens', desc: 'Límite diario: 13', icon: Zap },
    { level: 2, type: 'collection', value: 'Susurros', desc: 'Desbloquea Frases Ocultas I', icon: BookOpen },
    { level: 3, type: 'gens', value: '+7 Gens', desc: 'Límite diario: 20', icon: Zap },
    { level: 4, type: 'collection', value: 'Ecos', desc: 'Desbloquea Frases Ocultas II', icon: BookOpen },
    { level: 5, type: 'gens', value: '+10 Gens', desc: 'Límite diario: 30', icon: Zap },
    { level: 6, type: 'collection', value: 'Secretos', desc: 'Desbloquea Frases Ocultas III', icon: BookOpen },
    { level: 7, type: 'gens', value: 'Abundancia', desc: 'Límite diario: 50', icon: Gift },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      if (now >= nextClaimTime) {
        setCanClaim(true);
        setTimeLeft('¡Listo!');
      } else {
        setCanClaim(false);
        const diff = nextClaimTime - now;
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(`${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [nextClaimTime]);

  const handleClaim = () => {
    if (canClaim && currentLevel < 7) {
      onClaimReward(currentLevel + 1);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-[#0f0202]/80 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-[#2a0a0d] border border-[#d4af37] rounded-3xl p-0 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-fade-in">
        
        {/* Header */}
        <div className="bg-[#1a0505] p-6 text-center border-b border-[#d4af37]/30 relative">
          <button 
            onClick={onClose}
            className="absolute right-4 top-4 text-[#d4af37]/50 hover:text-[#d4af37] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="font-christmas text-4xl text-[#d4af37] drop-shadow-md">Pase Real</h2>
          <p className="font-royal text-[10px] text-[#fadd7e] uppercase tracking-widest mt-2">
            Recompensas de Navidad
          </p>
        </div>

        {/* Rewards Path */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 hide-scrollbar bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]">
          
          <div className="relative">
             {/* Timeline Line */}
             <div className="absolute left-6 top-4 bottom-4 w-1 bg-[#d4af37]/20 rounded-full"></div>

             {rewards.map((reward, index) => {
               const isUnlocked = currentLevel >= reward.level;
               const isNext = currentLevel === reward.level - 1;
               const isLocked = currentLevel < reward.level - 1;

               return (
                 <div key={reward.level} className={`relative flex items-center gap-4 mb-6 ${isLocked ? 'opacity-50 grayscale' : ''}`}>
                    {/* Status Icon */}
                    <div className={`
                      relative z-10 w-12 h-12 rounded-full flex items-center justify-center shrink-0 border-2
                      ${isUnlocked 
                        ? 'bg-[#d4af37] border-[#d4af37] text-[#2a0a0d]' 
                        : isNext 
                          ? 'bg-[#2a0a0d] border-[#d4af37] text-[#d4af37] animate-pulse' 
                          : 'bg-[#1a0505] border-[#d4af37]/30 text-[#d4af37]/30'}
                    `}>
                       {isUnlocked ? <CheckCircle2 className="w-6 h-6" /> : (isNext ? <Gift className="w-5 h-5" /> : <Lock className="w-4 h-4" />)}
                    </div>

                    {/* Card */}
                    <div className={`
                      flex-1 p-4 rounded-xl border flex items-center justify-between
                      ${isUnlocked 
                        ? 'bg-[#d4af37]/10 border-[#d4af37]/50' 
                        : 'bg-[#1a0505] border-[#d4af37]/10'}
                    `}>
                       <div>
                          <div className="flex items-center gap-2 mb-1">
                             <reward.icon className={`w-3 h-3 ${isUnlocked ? 'text-[#d4af37]' : 'text-stone-500'}`} />
                             <span className={`font-royal text-xs font-bold uppercase tracking-wider ${isUnlocked ? 'text-[#fadd7e]' : 'text-stone-500'}`}>
                               Nivel {reward.level}: {reward.value}
                             </span>
                          </div>
                          <p className="font-serif text-stone-400 text-xs italic">{reward.desc}</p>
                       </div>
                    </div>
                 </div>
               );
             })}
          </div>
        </div>

        {/* Claim Action */}
        <div className="p-6 bg-[#1a0505] border-t border-[#d4af37]/30 text-center">
           {currentLevel >= 7 ? (
             <div className="p-4 rounded-xl bg-[#d4af37]/20 border border-[#d4af37] text-[#fadd7e]">
               <Sparkles className="w-6 h-6 mx-auto mb-2" />
               <p className="font-royal text-xs uppercase tracking-widest font-bold">¡Pase Completado!</p>
               <p className="font-serif text-xs mt-1">Has desbloqueado todo el poder de SAM.</p>
             </div>
           ) : (
             <button
                onClick={handleClaim}
                disabled={!canClaim}
                className={`
                  w-full py-4 rounded-xl font-royal text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all
                  ${canClaim 
                    ? 'bg-[#8f1d24] text-[#fadd7e] shadow-[0_0_20px_rgba(143,29,36,0.6)] hover:bg-[#7a181e] hover:scale-[1.02]' 
                    : 'bg-stone-800 text-stone-500 cursor-not-allowed'}
                `}
             >
                {canClaim ? (
                  <>
                    <Gift className="w-5 h-5 animate-bounce" />
                    Reclamar Recompensa
                  </>
                ) : (
                  <>
                    <Clock className="w-4 h-4" />
                    Próximo reclamo: {timeLeft}
                  </>
                )}
             </button>
           )}
        </div>

      </div>
    </div>
  );
};

export default RewardsPass;
