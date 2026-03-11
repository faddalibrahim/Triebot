"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { GameHeader } from '@/components/game/game-header';
import { TurnIndicator } from '@/components/game/turn-indicator';
import { WordFragment } from '@/components/game/word-fragment';
import { ActionControls } from '@/components/game/action-controls';
import { GameKeyboard } from '@/components/game/game-keyboard';
import { useSoundEffects } from '@/hooks/use-sound-effects';
import { ConfettiOverlay } from '@/components/game/confetti-overlay';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useGameStore } from '@/store/use-game-store';
import { Trophy, AlertCircle, LogOut, ChevronRight, Check, X as IconX } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function PlayPage() {
  const router = useRouter();
  const [hasHydrated, setHasHydrated] = useState(false);

  const { playMoveSound, playBotMoveSound, playSuccessSound, playErrorSound } = useSoundEffects();
  
  const {
    moves,
    showConfetti,
    gameState,
    isPlayerTurn,
    addMove,
    toggleTurn,
    tickTimer,
    setShowConfetti,
    resetGame,
    nextRound,
    timeLeft,
    round,
    totalRounds,
    recordRoundResult,
    clearRoundResult,
    roundWinners,
    roundResult,
    startGame,
  } = useGameStore();

  // Handle Hydration
  useEffect(() => {
    setHasHydrated(true);
  }, []);

  // Redirect if game hasn't started (Game Guard)
  useEffect(() => {
    if (hasHydrated && gameState !== 'playing' && gameState !== 'ended') {
      router.replace('/lobby');
    }
  }, [hasHydrated, gameState, router]);

  // Derived State
  const currentWord = moves.map(m => m.letter).join('');

  // Timer Effect
  useEffect(() => {
    if (gameState !== 'playing' || (roundResult && roundResult.show)) return;
    
    if (timeLeft <= 0) {
      if (isPlayerTurn) {
        playErrorSound();
        recordRoundResult('bot', 'timeout');
      } else {
        playSuccessSound();
        recordRoundResult('player', 'timeout');
      }
      return;
    }

    const timer = setInterval(() => {
      tickTimer();
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, timeLeft, isPlayerTurn, roundResult?.show, tickTimer, playErrorSound, playSuccessSound, recordRoundResult]);

  // Handle Turn Transitions (Bot AI Mock)
  useEffect(() => {
    if (!isPlayerTurn && gameState === 'playing' && hasHydrated && !roundResult?.show) {
      const botThinkingTimeout = setTimeout(() => {
        const latestState = useGameStore.getState();
        if (latestState.gameState !== 'playing') return;

        const randomLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        addMove({ letter: randomLetter, owner: 'bot' });
        playBotMoveSound();
        toggleTurn();
      }, 2500);

      return () => clearTimeout(botThinkingTimeout);
    }
  }, [isPlayerTurn, gameState, hasHydrated, roundResult?.show, addMove, playBotMoveSound, toggleTurn]);

  // Handlers
  const handleTriggerSuccess = () => {
    playSuccessSound();
    setShowConfetti(true);
  };

  const handleKeyPress = (key: string) => {
    if (!isPlayerTurn || roundResult?.show) return;
    
    addMove({ letter: key, owner: 'player' });
    playMoveSound();
    toggleTurn();
  };

  const handleBluffCall = () => {
    // Mock logic: Player wins if word length is even
    if (currentWord.length % 2 === 0) {
      playSuccessSound();
      recordRoundResult('player', 'bluff');
    } else {
      playErrorSound();
      recordRoundResult('bot', 'bluff');
    }
  };

  const handleWordCall = () => {
    // Mock logic: Player wins if word length is odd
    if (currentWord.length % 2 !== 0) {
      playSuccessSound();
      recordRoundResult('player', 'word');
    } else {
      playErrorSound();
      recordRoundResult('bot', 'word');
    }
  };

  const handleForfeit = () => {
    playErrorSound();
    resetGame();
    router.push('/lobby');
  };

  if (!hasHydrated) {
    return (
      <div className="h-screen w-full bg-neo-bg flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-neo-cyan/20 border-t-neo-cyan rounded-full animate-spin" />
      </div>
    );
  }


  if (gameState !== 'playing' && gameState !== 'ended') {
    return (
      <div className="h-screen w-full bg-neo-bg flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-neo-cyan/20 border-t-neo-cyan rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-[100dvh] w-full bg-neo-bg text-foreground flex flex-col relative overflow-hidden selection:bg-neo-purple/30">
      <ConfettiOverlay trigger={showConfetti} onComplete={() => setShowConfetti(false)} />
      
      <GameHeader onForfeit={handleForfeit} />

      <main className="flex-1 min-h-0 flex flex-col items-center justify-start pt-2 sm:pt-4 p-4 sm:p-6 w-full max-w-5xl mx-auto relative z-10">
        <TurnIndicator />
        <WordFragment />
      </main>

      <footer className="w-full max-w-4xl flex-none mx-auto px-4 sm:px-6 py-4 pb-6 sm:pb-8 relative z-10">
        <ActionControls 
          onCallBluff={handleBluffCall} 
          onCallWord={handleWordCall}
          onForfeit={handleForfeit}
          playSuccessSound={handleTriggerSuccess}
          playErrorSound={playErrorSound}
          disabled={!isPlayerTurn || roundResult?.show}
        />
        <GameKeyboard onKeyPress={handleKeyPress} disabled={!isPlayerTurn || roundResult?.show} />
      </footer>

      {/* Round/Match Result Dialog */}
      <Dialog open={!!roundResult?.show} onOpenChange={(open) => {
        // Only allow opening, prevent closing via backdrop/ESC
        if (!open) return;
      }}>
        <DialogContent className="sm:max-w-md bg-neo-surface border-white/5 text-white p-6" showCloseButton={false}>
          {roundResult && (
            <>
              <DialogHeader className="items-center text-center">
                {round === totalRounds ? (
                  // MATCH COMPLETE HEADER
                  (() => {
                    const playerWins = roundWinners.filter(w => w === 'player').length;
                    const botWins = roundWinners.filter(w => w === 'bot').length;
                    const isVictory = playerWins > botWins;
                    const isDraw = playerWins === botWins;

                    return (
                      <>
                        <div className={cn(
                          "w-20 h-20 rounded-full flex items-center justify-center mb-3 shadow-2xl transition-all duration-700 animate-in zoom-in-50",
                          isVictory ? "bg-neo-cyan text-black shadow-neo-cyan/20" : 
                          isDraw ? "bg-zinc-500 text-white" : "bg-neo-red text-white shadow-neo-red/20"
                        )}>
                          {isVictory ? <Trophy size={40} /> : <AlertCircle size={40} />}
                        </div>
                        <DialogTitle className={cn(
                          "text-4xl font-black uppercase italic tracking-tight",
                          isVictory ? "text-neo-cyan" : isDraw ? "text-white" : "text-neo-red"
                        )}>
                          {isVictory ? "VICTORY!" : isDraw ? "DRAW!" : "DEFEAT!"}
                        </DialogTitle>
                        <div className="flex flex-col items-center gap-4 mt-2">
                          <div className="flex flex-wrap justify-center gap-2 mt-2 max-w-[280px]">
                            {roundWinners.map((winner, idx) => {
                              const isLarge = roundWinners.length <= 5;
                              return (
                                <div 
                                  key={idx} 
                                  className={cn(
                                    "rounded-full flex items-center justify-center border-2 transition-all duration-500",
                                    isLarge ? "w-8 h-8" : "w-7 h-7",
                                    winner === 'player' ? "border-neo-cyan bg-neo-cyan text-black" : "border-neo-red bg-neo-red text-white"
                                  )}
                                >
                                  {winner === 'player' ? 
                                    <Check size={isLarge ? 16 : 14} strokeWidth={4} /> : 
                                    <IconX size={isLarge ? 16 : 14} strokeWidth={4} />
                                  }
                                </div>
                              );
                            })}
                          </div>
                          <DialogDescription className="text-zinc-400 font-bold uppercase tracking-widest text-xs">
                            Final Score: {playerWins}W - {botWins}L
                          </DialogDescription>
                        </div>
                      </>
                    );
                  })()
                ) : (
                  // SINGLE ROUND RESULT HEADER
                  <>
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-2 shadow-xl ${
                      roundResult.winner === 'player' ? 'bg-neo-cyan text-black' : 'bg-neo-red text-white'
                    }`}>
                      {roundResult.winner === 'player' ? <Trophy size={28} /> : <AlertCircle size={28} />}
                    </div>
                    <DialogTitle className={`text-2xl font-black uppercase italic ${
                      roundResult.winner === 'player' ? 'text-neo-cyan' : 'text-neo-red'
                    }`}>
                      {roundResult.winner === 'player' ? 'Round Won!' : 'Round Lost!'}
                    </DialogTitle>
                    <DialogDescription className="text-zinc-400">
                      <span className="block mb-2">
                        {roundResult.type === 'timeout' && (roundResult.winner === 'bot' ? "You ran out of time!" : "Triebot was too slow!")}
                        {roundResult.type === 'word' && (roundResult.winner === 'player' ? "You caught a complete word!" : "You claimed a word that wasn't finished!")}
                        {roundResult.type === 'bluff' && (roundResult.winner === 'player' ? "Triebot was bluffing!" : "Triebot had a word in mind!")}
                      </span>
                      <span className="text-xs font-mono uppercase tracking-tighter opacity-60">
                        {totalRounds - round} {totalRounds - round === 1 ? 'round' : 'rounds'} remaining
                      </span>
                    </DialogDescription>
                  </>
                )}
              </DialogHeader>

              <div className="flex flex-col gap-3 mt-6">
                <Button 
                  onClick={() => {
                    if (round === totalRounds) {
                      startGame(); // Start a fresh match with same config
                    } else {
                      nextRound();
                    }
                  }}
                  className="w-full h-14 bg-neo-purple text-white font-black rounded-xl hover:bg-neo-purple/90 flex items-center justify-center gap-2 transition-all active:scale-95 shadow-[0_0_20px_rgba(124,97,255,0.3)]"
                >
                  {round === totalRounds ? "REPLAY MATCH" : "NEXT ROUND"} <ChevronRight size={20} />
                </Button>
                <Button 
                  variant="ghost"
                  onClick={() => {
                    resetGame();
                    router.push('/lobby');
                  }}
                  className="w-full h-12 text-zinc-500 hover:text-white hover:bg-white/5 font-bold flex items-center justify-center gap-2"
                >
                  <LogOut size={18} /> {round === totalRounds ? "EXIT TO LOBBY" : "EXIT GAME"}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
