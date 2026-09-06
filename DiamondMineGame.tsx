"use client";

import { useEffect, useRef, useState } from "react";
import { Gem, Pause, CircleDollarSign, Hexagon, Sparkles, Diamond } from "lucide-react";

interface GameProps {
  indicatorLevel: number; // 0.0 to 1.0
  showCelebration: boolean;
  exercisesCompleted: number;
  score: number;
  lastReward: number;
}

export default function DiamondMineGame({ indicatorLevel, showCelebration, exercisesCompleted, score, lastReward }: GameProps) {
  const prevLevelRef = useRef(indicatorLevel);
  const [isInhaling, setIsInhaling] = useState(false);

  useEffect(() => {
    if (indicatorLevel > prevLevelRef.current + 0.005) {
      setIsInhaling(true);
    } else if (indicatorLevel < prevLevelRef.current - 0.005) {
      setIsInhaling(false);
    }
    prevLevelRef.current = indicatorLevel;
  }, [indicatorLevel]);

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[400px] h-[65vh] md:h-[600px] bg-[#2a1711] rounded-2xl border-4 border-[#3d2314] shadow-2xl relative overflow-hidden select-none">
      
      {/* Cave Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-90 mix-blend-screen"
        style={{ backgroundImage: `url('/bg-cave.jpg')` }}
      />
      
      {/* Foreground darkness overlay to make UI pop */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 md:from-black/60 via-transparent to-black/60 md:to-black/40 pointer-events-none" />

      {/* TOP LEFT: Title Area */}
      <div className="absolute top-3 left-3 md:top-6 md:left-6 z-30 flex flex-col items-center scale-75 md:scale-100 origin-top-left">
        <div className="bg-[#122240] border-[3px] border-[#294273] rounded-2xl px-6 py-2 shadow-2xl relative z-10">
          <h2 className="text-xl md:text-3xl font-black text-white drop-shadow-md tracking-tight whitespace-nowrap">
            Diamond <span className="text-[#f5a83a]">Mine</span>
          </h2>
          <Gem className="absolute -top-4 -left-4 text-cyan-300 fill-cyan-400 drop-shadow-[0_0_10px_#22d3ee]" size={32} />
        </div>
        <div className="bg-[#0f1b33] rounded-b-xl px-5 py-2 text-xs md:text-sm text-[#8fa8d6] font-medium shadow-lg -translate-y-2 border border-[#294273] border-t-0 whitespace-nowrap">
          Take a deep breath!
        </div>
      </div>

      {/* TOP RIGHT: Counters & Pause */}
      <div className="absolute top-3 right-3 md:top-6 md:right-6 z-30 flex gap-2 md:gap-4 scale-75 md:scale-100 origin-top-right">
        {/* XP Score */}
        <div className="bg-[#122240] border-[3px] border-[#294273] rounded-full px-3 md:px-5 py-2 flex items-center gap-2 shadow-2xl">
          <Sparkles className="text-yellow-400 fill-yellow-400 drop-shadow-[0_0_5px_#facc15]" size={16} />
          <span className="text-white font-black text-lg md:text-xl tracking-widest">{score} <span className="text-xs md:text-sm text-[#8fa8d6]">XP</span></span>
        </div>
        {/* Diamond Counter */}
        <div className="bg-[#122240] border-[3px] border-[#294273] rounded-full px-3 md:px-5 py-2 flex items-center gap-2 md:gap-3 shadow-2xl">
          <Gem className="text-cyan-400 fill-cyan-400 drop-shadow-[0_0_5px_#22d3ee]" size={20} />
          <span className="text-white font-black text-lg md:text-xl tracking-widest">{exercisesCompleted} / 8</span>
        </div>
        <button className="bg-[#122240] border-[3px] border-[#294273] rounded-2xl w-10 h-10 md:w-12 md:h-12 flex items-center justify-center shadow-2xl hover:bg-[#1a3059] transition-colors active:scale-95">
          <Pause className="text-[#8fa8d6] fill-[#8fa8d6]" size={16} />
        </button>
      </div>

      {/* CENTER LEFT: The Vacuum Machine */}
      <div className="absolute top-1/2 left-[5%] md:left-24 -translate-y-1/2 z-20 scale-75 md:scale-100 origin-left">
        {/* Machine Body */}
        <div className="relative w-24 h-32 md:w-28 md:h-36 bg-gradient-to-br from-blue-100 to-blue-300 rounded-t-full rounded-b-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] border-4 border-slate-300 flex flex-col items-center justify-center">
          
          <div className="absolute top-6 left-4 w-6 h-6 bg-white/60 rounded-full blur-[1px]" />
          
          <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full border-4 border-slate-400 mt-4 transition-all duration-300 ${
            isInhaling ? 'bg-green-400 shadow-[0_0_20px_#4ade80]' : 'bg-green-900 shadow-none'
          }`} />

          <div className="absolute bottom-4 w-[120%] h-2 bg-[#122240] rounded-full shadow-lg" />

          {/* Suction Arm */}
          <div className="absolute top-1/2 -right-6 md:-right-8 w-10 md:w-12 h-4 bg-slate-700 flex items-center">
            {/* Nozzle Cone */}
            <div className="absolute -right-6 md:-right-8 w-6 h-10 md:w-8 md:h-12 bg-slate-300 rounded-l-sm" style={{ clipPath: 'polygon(0 30%, 100% 0, 100% 100%, 0 70%)' }}>
              
              {/* Suction Beam Effect! */}
              <div 
                className="absolute top-1/2 left-6 md:left-8 w-[60vw] md:w-[600px] h-[100px] md:h-[150px] origin-left -translate-y-1/2 pointer-events-none will-change-transform"
                style={{ 
                  background: 'linear-gradient(90deg, rgba(34,211,238,0.5) 0%, rgba(34,211,238,0.1) 40%, transparent 100%)',
                  opacity: indicatorLevel > 0.02 ? 1 : 0,
                  clipPath: 'polygon(0 40%, 100% 0, 100% 100%, 0 60%)',
                  transition: 'opacity 0.1s ease-out'
                }}
              >
                {isInhaling && (
                  <>
                    <div className="absolute top-1/4 left-[10%] w-[10%] h-[2px] bg-cyan-300/80 animate-pulse" />
                    <div className="absolute bottom-1/3 left-[20%] w-[15%] h-[1px] bg-cyan-200/60 animate-pulse delay-75" />
                    <div className="absolute top-1/2 left-[5%] w-[20%] h-[3px] bg-cyan-100/90 animate-pulse delay-150" />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CENTER RIGHT: The Loot (Coins, Crystals, Diamond) */}
      <div 
        className="absolute top-1/2 right-[5%] md:right-12 -translate-y-1/2 flex items-center gap-6 md:gap-12 z-20 will-change-transform scale-[0.65] md:scale-100 origin-right"
        style={{ 
          // Responsive pull distance! Pulls by a percentage of viewport width on mobile, pixels on desktop
          transform: `translateX(calc(-${indicatorLevel} * min(70vw, 500px)))`,
          transition: indicatorLevel < 0.05 ? 'transform 0.5s ease-in' : 'transform 100ms ease-out'
        }}
      >
         {/* Coins Column */}
         <div className="flex flex-col gap-6 md:gap-8">
           {[1,2,3].map(i => (
             <div key={i} className="w-10 h-10 rounded-full bg-yellow-400 border-4 border-yellow-600 flex items-center justify-center shadow-[0_0_15px_rgba(250,204,21,0.5)]">
               <div className="w-4 h-6 border-2 border-yellow-600 rounded-sm" />
             </div>
           ))}
         </div>

         {/* Crystals Column */}
         <div className="flex flex-col gap-4 md:gap-6 ml-2 md:ml-4">
           {[1,2,3].map(i => (
             <div key={i} className="w-6 h-16 bg-gradient-to-b from-orange-300 to-orange-600 shadow-[0_0_20px_rgba(249,115,22,0.6)]" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }} />
           ))}
         </div>

         {/* Blue Gems Column */}
         <div className="flex flex-col gap-3 md:gap-4 ml-4 md:ml-6">
           {[1,2,3].map(i => (
             <Hexagon key={i} className="text-blue-300 fill-blue-400 drop-shadow-[0_0_20px_rgba(96,165,250,0.8)]" size={56} />
           ))}
         </div>

         {/* The Giant Diamond (The Target!) */}
         <div className="ml-8 md:ml-16 relative">
           <div className="absolute -left-8 md:-left-12 top-1/2 -translate-y-1/2 w-[2px] h-48 bg-yellow-400/50 border-l border-dashed border-yellow-300" />
           
           <div className={`transition-all duration-300 ${showCelebration && lastReward >= 100 ? 'scale-110 drop-shadow-[0_0_50px_rgba(217,70,239,1)]' : 'scale-100 drop-shadow-[0_0_30px_rgba(192,132,252,0.6)]'}`}>
             <Diamond size={160} className="text-purple-200 fill-purple-400/80" strokeWidth={1} />
             <Sparkles className="absolute top-4 right-4 text-white animate-ping" size={24} />
             <Sparkles className="absolute bottom-8 left-8 text-cyan-200 animate-pulse delay-300" size={32} />
           </div>
         </div>
      </div>

      {/* BOTTOM LEFT: Inhale Progress Bar */}
      <div className="absolute bottom-4 left-4 right-4 md:right-auto md:bottom-6 md:left-6 z-30">
        <div className="bg-[#122240] border-[3px] border-[#294273] rounded-2xl p-3 md:p-4 w-full md:w-80 shadow-2xl">
          <div className="text-white font-bold text-sm md:text-lg mb-1 md:mb-2 tracking-wide">Inhale Steadily</div>
          
          <div className="relative h-6 md:h-8 bg-[#0a1224] rounded-full overflow-hidden border-2 border-[#1e3663]">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-600 to-green-400 transition-all duration-100 ease-out"
              style={{ width: `${indicatorLevel * 100}%` }}
            />
            <div 
              className="absolute inset-0 opacity-40 pointer-events-none"
              style={{
                backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 15px, #0a1224 15px, #0a1224 18px)'
              }}
            />
          </div>
        </div>
      </div>

      {/* BOTTOM RIGHT: Tip Panel (Hidden on mobile to save space) */}
      <div className="hidden md:block absolute bottom-6 right-6 z-30">
        <div className="bg-[#122240] border-[3px] border-[#294273] rounded-2xl px-6 py-4 shadow-2xl max-w-[220px]">
          <p className="text-center text-[#8fa8d6] font-bold leading-snug">
            Bigger breaths bring bigger rewards!
          </p>
        </div>
      </div>

      {/* Grand Success Celebration overlay */}
      <div 
        className={`absolute inset-0 pointer-events-none flex items-center justify-center z-50 transition-all duration-500 ${
          showCelebration && lastReward > 0 ? 'opacity-100 bg-purple-900/60 backdrop-blur-md' : 'opacity-0 backdrop-blur-0'
        }`}
      >
        <div className={`px-6 py-4 md:px-12 md:py-6 bg-gradient-to-r ${lastReward >= 100 ? 'from-purple-600 to-pink-600' : lastReward >= 50 ? 'from-blue-600 to-cyan-600' : 'from-amber-500 to-orange-500'} rounded-3xl border-4 border-white/50 text-white shadow-[0_0_100px_rgba(217,70,239,0.8)] transform transition-transform duration-500 delay-100 ${
          showCelebration && lastReward > 0 ? 'scale-100 translate-y-0' : 'scale-50 translate-y-20'
        }`}>
          <div className="flex flex-col items-center gap-1 md:gap-2">
            <span className="font-black text-3xl md:text-5xl tracking-tight uppercase drop-shadow-lg text-transparent bg-clip-text bg-gradient-to-b from-white to-purple-200 text-center">
              {lastReward >= 100 ? 'Diamond Mined!' : lastReward >= 50 ? 'Crystals Mined!' : 'Coins Mined!'}
            </span>
            <span className="font-bold text-lg md:text-xl text-purple-200 tracking-widest uppercase">+{lastReward} XP</span>
          </div>
        </div>
      </div>

    </div>
  );
}
