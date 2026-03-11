import React from 'react';
import { Bot } from 'lucide-react';

import { useGameStore } from "@/store/use-game-store";

export const TurnIndicator: React.FC = () => {
  const { isPlayerTurn } = useGameStore();
  
  return (
    <div className="h-20 sm:h-24 mb-2 sm:mb-4 flex flex-col items-center justify-center relative w-full">
      {isPlayerTurn ? (
        <div className="flex flex-col items-center transition-all duration-500 animate-in fade-in zoom-in-75 slide-in-from-bottom-2">
          <div className="flex items-center gap-2.5 bg-neo-cyan/10 px-6 py-2 rounded-full border border-neo-cyan/20 shadow-[0_0_20px_rgba(0,255,255,0.1)]">
            <div className="w-2.5 h-2.5 rounded-full bg-neo-cyan shadow-[0_0_10px_rgba(0,255,255,0.8)] animate-pulse" />
            <span className="text-base font-black text-neo-cyan uppercase italic tracking-wider leading-none">Your Move</span>
          </div>
          <p className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] font-bold mt-2 opacity-50">Triebot is waiting</p>
        </div>
      ) : (
        <div className="flex flex-col items-center transition-all duration-500 animate-in fade-in zoom-in-75 slide-in-from-top-2">
          <div className="mb-3 text-neo-purple filter drop-shadow-[0_0_15px_rgba(124,97,255,0.4)] animate-bounce-slow">
            <Bot size={48} strokeWidth={1.5} />
          </div>
          <span className="text-sm font-bold text-zinc-400 uppercase tracking-[0.2em] animate-pulse">Thinking...</span>
        </div>
      )}
    </div>
  );
};
