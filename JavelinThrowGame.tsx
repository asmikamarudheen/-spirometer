"use client";

import { useEffect, useState } from "react";
import { Target, Pause, Wind, Trophy, Navigation } from "lucide-react";

interface GameProps {
  indicatorLevel: number; // 0.0 to 1.0
  showCelebration: boolean;
  exercisesCompleted: number;
  score: number;
  lastReward: number;
}

export default function JavelinThrowGame({ indicatorLevel, showCelebration, exercisesCompleted, score, lastReward }: GameProps) {
  const [javelinPos, setJavelinPos] = useState({ x: 0, y: 0 });

  // Calculate trajectory based on breath power
  const maxDistance = 80; // 80% of screen width
  const currentDistance = indicatorLevel * maxDistance;

  // Render the dotted trajectory arc
  const renderTrajectory = () => {
    const dots = [];
    const numDots = Math.floor(currentDistance / 5); // A dot every 5%
    for (let i = 1; i <= numDots; i++) {
      const progress = i / (maxDistance / 5); // 0.0 to 1.0 along the arc
      // Parabolic arc formula: y = 4 * h * x * (1 - x)
      const heightMultiplier = 40; // Max height of arc in %
      const xPos = progress * maxDistance;
      const yPos = 4 * heightMultiplier * progress * (1 - progress);

      dots.push(
        <div
          key={i}
          className="absolute w-2 h-2 md:w-3 md:h-3 bg-white/80 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"
          style={{
            left: `calc(15% + ${xPos}%)`,
            bottom: `calc(20% + ${yPos}%)`,
          }}
        />
      );
    }
    return dots;
  };

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[400px] h-[65vh] md:h-[600px] bg-[#4a7c59] rounded-2xl border-4 border-[#2d4a36] shadow-2xl relative overflow-hidden select-none">
      
      {/* Prehistoric Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-90"
        style={{ backgroundImage: `url('/bg-prehistoric.jpg')` }}
      />
      
      {/* Foreground shadow overlay to make UI pop */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />

      {/* TOP LEFT: Title Area */}
      <div className="absolute top-3 left-3 md:top-6 md:left-6 z-30 flex flex-col items-center scale-75 md:scale-100 origin-top-left">
        <div className="bg-[#8b4513] border-4 border-[#5c2e0b] rounded-2xl px-6 py-2 shadow-2xl relative z-10 transform -skew-x-6">
          <h2 className="text-xl md:text-3xl font-black text-[#ffebcd] drop-shadow-md tracking-tighter whitespace-nowrap uppercase">
            Prehistoric <span className="text-[#f5a83a]">Contest</span>
          </h2>
          <div className="text-sm font-bold text-[#f5a83a] text-center tracking-widest mt-1">
            JAVELIN THROW
          </div>
        </div>
      </div>

      {/* TOP RIGHT: Counters */}
      <div className="absolute top-3 right-3 md:top-6 md:right-6 z-30 flex gap-2 md:gap-4 scale-75 md:scale-100 origin-top-right">
        {/* Total Distance */}
        <div className="bg-[#8b4513] border-4 border-[#5c2e0b] rounded-2xl px-3 md:px-5 py-2 flex items-center gap-2 shadow-2xl transform skew-x-3">
          <Trophy className="text-yellow-400 fill-yellow-400 drop-shadow-[0_0_5px_#facc15]" size={20} />
          <div className="flex flex-col items-start leading-none">
            <span className="text-[10px] text-[#ffebcd] font-bold uppercase tracking-wider">Best Distance</span>
            <span className="text-white font-black text-lg md:text-xl tracking-widest">{score} <span className="text-sm text-[#f5a83a]">m</span></span>
          </div>
        </div>
        
        {/* Throws Counter */}
        <div className="bg-[#8b4513] border-4 border-[#5c2e0b] rounded-2xl px-3 md:px-5 py-2 flex items-center gap-2 shadow-2xl transform skew-x-3">
          <div className="flex flex-col items-start leading-none">
            <span className="text-[10px] text-[#ffebcd] font-bold uppercase tracking-wider">Throws</span>
            <span className="text-white font-black text-lg md:text-xl tracking-widest">{exercisesCompleted} / 8</span>
          </div>
        </div>

        <button className="bg-[#8b4513] border-4 border-[#5c2e0b] rounded-2xl w-10 h-10 md:w-12 md:h-12 flex items-center justify-center shadow-2xl hover:bg-[#6b350e] transition-colors active:scale-95">
          <Pause className="text-[#ffebcd] fill-[#ffebcd]" size={16} />
        </button>
      </div>

      {/* GAME AREA */}
      
      {/* The Target (Right Side) */}
      <div className="absolute bottom-[10%] right-[10%] z-20 flex flex-col items-center">
        <Target size={120} className="text-red-500 fill-white drop-shadow-2xl" strokeWidth={2} />
        <div className="w-16 h-4 bg-black/40 rounded-full blur-sm mt-2" />
      </div>

      {/* The Thrower / Javelin (Left Side) */}
      <div className="absolute bottom-[20%] left-[10%] z-20">
        
        {/* Character placeholder (can replace with image later) */}
        <div className="relative w-24 h-32 md:w-32 md:h-40 flex items-end justify-center">
          {/* Animated Javelin! */}
          <div 
            className="absolute top-0 z-30 transition-all"
            style={{
              // When celebration is true, animate the throw across the screen
              transform: showCelebration 
                ? `translate(${Math.min(lastReward, 100) * 0.7}vw, -30vh) rotate(45deg)` 
                : `translate(${indicatorLevel * 20}px, ${indicatorLevel * 10}px) rotate(${-15 + indicatorLevel * 30}deg)`,
              transitionDuration: showCelebration ? '1000ms' : '100ms',
              transitionTimingFunction: showCelebration ? 'cubic-bezier(0.25, 1, 0.5, 1)' : 'ease-out'
            }}
          >
            <div className="relative flex items-center">
              <div className="w-32 md:w-48 h-2 bg-[#8b4513] border border-black/50 rounded-full shadow-lg" />
              <Navigation className="absolute -right-4 text-slate-300 fill-slate-400 rotate-90 drop-shadow-md" size={32} />
            </div>
          </div>
        </div>
      </div>

      {/* Trajectory Dots */}
      {!showCelebration && renderTrajectory()}


      {/* BOTTOM CENTER: Breath Power Gauge */}
      <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-30 w-[90%] md:w-[500px]">
        <div className="bg-[#8b4513] border-4 border-[#5c2e0b] rounded-2xl p-3 md:p-4 shadow-[0_10px_25px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-2 mb-2">
            <Wind className="text-cyan-300" size={20} />
            <span className="text-[#ffebcd] font-bold text-sm md:text-lg tracking-wide uppercase">Your Breath Power</span>
          </div>
          
          {/* Segmented Power Gauge */}
          <div className="relative h-8 md:h-10 bg-[#3a1d08] rounded-xl overflow-hidden border-2 border-[#1a0d04] flex">
            {/* The fill based on level */}
            <div 
              className="absolute top-0 left-0 h-full transition-all duration-100 ease-out"
              style={{ 
                width: `${indicatorLevel * 100}%`,
                background: indicatorLevel > 0.8 ? 'linear-gradient(90deg, #ef4444, #dc2626)' : 
                            indicatorLevel > 0.5 ? 'linear-gradient(90deg, #eab308, #ca8a04)' : 
                            'linear-gradient(90deg, #22c55e, #16a34a)',
                boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.3)'
              }}
            />
            {/* Segmentation markers */}
            {[1,2,3,4,5,6,7,8,9].map(i => (
              <div key={i} className="flex-1 border-r-2 border-[#1a0d04]/80 z-10" />
            ))}
          </div>
        </div>
      </div>

      {/* Grand Success Celebration overlay */}
      <div 
        className={`absolute inset-0 pointer-events-none flex items-center justify-center z-50 transition-all duration-500 ${
          showCelebration && lastReward > 0 ? 'opacity-100 bg-black/60 backdrop-blur-md' : 'opacity-0 backdrop-blur-0'
        }`}
      >
        <div className={`px-6 py-4 md:px-12 md:py-6 bg-[#8b4513] rounded-3xl border-8 border-[#5c2e0b] text-white shadow-[0_0_100px_rgba(245,168,58,0.5)] transform transition-transform duration-500 delay-100 ${
          showCelebration && lastReward > 0 ? 'scale-100 translate-y-0 rotate-[-2deg]' : 'scale-50 translate-y-20 rotate-12'
        }`}>
          <div className="flex flex-col items-center gap-1 md:gap-2">
            <span className="font-black text-3xl md:text-6xl tracking-tight uppercase drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] text-[#f5a83a] text-center">
              {lastReward >= 100 ? 'Mammoth Throw!' : lastReward >= 50 ? 'Great Throw!' : 'Good Effort!'}
            </span>
            <span className="font-bold text-xl md:text-3xl text-white tracking-widest uppercase drop-shadow-md">
              +{lastReward} Meters
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}
