import React, { useRef } from 'react';

import { useGameStore } from "@/store/use-game-store";

export interface Move {
  letter: string;
  owner: 'player' | 'bot';
}

export const WordFragment: React.FC = () => {
  const { moves, isPlayerTurn } = useGameStore();

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="w-full flex justify-center items-center my-2 sm:my-4 pb-2 shrink-0">
      <div className="flex gap-2 sm:gap-3 flex-wrap justify-center px-4 w-full">
        {moves.map((move, idx) => (
          <div 
            key={`${idx}-${move.letter}-${move.owner}`} 
            className={`w-10 h-14 md:w-16 md:h-20 bg-neo-surface border border-white/10 rounded-lg flex items-center justify-center text-2xl md:text-5xl font-black shadow-lg hover:-translate-y-1 transition-transform animate-enter-letter ${
              move.owner === 'player' ? 'text-player-move' : 'text-bot-move'
            }`}
          >
            {move.letter}
          </div>
        ))}
        
        {/* Blinking Cursor for next input */}
        <div className={`w-10 h-14 md:w-16 md:h-20 border-2 border-dashed border-white/10 rounded-lg flex items-center justify-center transition-colors duration-300 ${
          isPlayerTurn ? 'bg-player-move/5' : 'bg-bot-move/5'
        }`}>
          <span className={`font-bold text-2xl md:text-4xl animate-pulse ${
            isPlayerTurn ? 'text-player-move' : 'text-bot-move'
          }`}>?</span>
        </div>
      </div>
    </div>
  );
};
