"use client"

import { useEffect, useState, useRef } from 'react';
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
import { buildGameTrie, GameTheme } from '@/lib/trie';
import { Triebot, Difficulty } from '@/lib/triebot';
import { PLAYING, ENDED, IDLE, OWNER_PLAYER, OWNER_BOT, CHALLENGE_TIMEOUT, CHALLENGE_WORD, CHALLENGE_BLUFF, THEME_COUNTRIES, THEME_CAPITALS, THEME_ANIMALS } from '@/lib/constants';

export default function PlayPage() {
  const router = useRouter();
  const [hasHydrated, setHasHydrated] = useState(false);
  const botRef = useRef<Triebot | null>(null);

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
    matchConfig,
  } = useGameStore();

  // Handle Hydration
  useEffect(() => {
    setHasHydrated(true);
  }, []);

  // Redirect if game hasn't started (Game Guard)
  useEffect(() => {
    if (hasHydrated && gameState !== PLAYING && gameState !== ENDED) {
      router.replace('/lobby');
    }
  }, [hasHydrated, gameState, router]);

  // Derived State
  const currentWord = moves.map(m => m.letter).join('');

  // Hydrate Bot Instance
  useEffect(() => {
    if (gameState === PLAYING && hasHydrated && !botRef.current) {
      botRef.current = new Triebot(matchConfig.difficulty as Difficulty, matchConfig.theme as GameTheme);
      // Catch up bot if hydrating an active game
      moves.forEach(m => botRef.current!.receiveMove(m.letter));
    }
  }, [gameState, hasHydrated, matchConfig]);

  // Sync Player Moves to Bot Pointer
  useEffect(() => {
    if (!botRef.current) return;
    
    if (moves.length === 0) {
      botRef.current.reset(); // New round
    } else {
      const lastMove = moves[moves.length - 1];
      // Only sync if it was the player making the move, 
      // the bot will pre-sync its own moves to ensure O(1) performance
      if (lastMove.owner === OWNER_PLAYER) {
        botRef.current.receiveMove(lastMove.letter);
      }
    }
  }, [moves.length]);

  // Timer Effect
  useEffect(() => {
    if (gameState !== PLAYING || (roundResult && roundResult.show)) return;
    
    if (timeLeft <= 0) {
      if (isPlayerTurn) {
        playErrorSound();
        recordRoundResult(OWNER_BOT, CHALLENGE_TIMEOUT);
      } else {
        playSuccessSound();
        recordRoundResult(OWNER_PLAYER, CHALLENGE_TIMEOUT);
      }
      return;
    }

    const timer = setInterval(() => {
      tickTimer();
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, timeLeft, isPlayerTurn, roundResult?.show, tickTimer, playErrorSound, playSuccessSound, recordRoundResult]);

  const handleBluffCall = (initiator: typeof OWNER_PLAYER | typeof OWNER_BOT = OWNER_PLAYER) => {
    if (roundResult?.show || moves.length === 0) return;
    
    const trie = buildGameTrie(matchConfig.theme as GameTheme);
    const isValidPrefix = trie.startsWith(currentWord);

    // If initiator calls bluff, they win IF the current string is NOT a valid prefix.
    const initiatorWins = !isValidPrefix;
    const winner = initiatorWins ? initiator : (initiator === OWNER_PLAYER ? OWNER_BOT : OWNER_PLAYER);
    
    // Find the word the Triebot was pursuing if it wasn't bluffing!
    const solution = isValidPrefix ? trie.getRandomWordWithPrefix(currentWord) || undefined : undefined;
    
    if (winner === OWNER_PLAYER) {
      playSuccessSound();
      setShowConfetti(true);
    } else {
      playErrorSound();
    }
    
    recordRoundResult(winner, CHALLENGE_BLUFF, initiator, solution);
  };

  const handleWordCall = (initiator: typeof OWNER_PLAYER | typeof OWNER_BOT = OWNER_PLAYER) => {
    if (roundResult?.show || moves.length === 0) return;
    
    const trie = buildGameTrie(matchConfig.theme as GameTheme);
    const isCompletedWord = currentWord.length >= 4 && trie.search(currentWord);

    // If initiator calls word, they win IF the current string IS a completed dictionary word.
    const initiatorWins = isCompletedWord;
    const winner = initiatorWins ? initiator : (initiator === OWNER_PLAYER ? OWNER_BOT : OWNER_PLAYER);

    if (winner === OWNER_PLAYER) {
      playSuccessSound();
      setShowConfetti(true);
    } else {
      playErrorSound();
    }

    recordRoundResult(winner, CHALLENGE_WORD, initiator);
  };

  // Bot AI Turn Execution
  useEffect(() => {
    if (!isPlayerTurn && gameState === PLAYING && hasHydrated && !roundResult?.show && botRef.current) {
      // Small timeout to simulate "thinking" and make the UI feel reactive
      const botThinkingTimeout = setTimeout(() => {
        const latestState = useGameStore.getState();
        if (latestState.gameState !== PLAYING || latestState.roundResult?.show) return;

        const trie = buildGameTrie(matchConfig.theme as GameTheme);

        // 1. Did the human complete a word? Bot instantly catches them!
        if (currentWord.length >= 4 && trie.search(currentWord)) {
          handleWordCall(OWNER_BOT);
          return;
        }

        // 2. Did the human play an invalid prefix? Bot instantly calls bluff!
        if (!trie.startsWith(currentWord)) {
          handleBluffCall(OWNER_BOT);
          return;
        }

        // 3. Game continues, calculate next optimal move
        const nextChar = botRef.current!.getNextMove();
        
        if (nextChar) {
          botRef.current!.receiveMove(nextChar); // O(1) local sync
          addMove({ letter: nextChar, owner: OWNER_BOT });
          playBotMoveSound();
          toggleTurn();
        } else {
          // If the bot genuinely has no valid moves left in the dictionary (cornered)
          // it must resign by making a random invalid letter or forcing a bluff.
          // For Ghost, if it can't play, the word is effectively trapped.
          // We will bluff as a fallback.
          handleBluffCall(OWNER_BOT);
        }

      }, 1000 + Math.random() * 800); // Between 1.0s and 1.8s

      return () => clearTimeout(botThinkingTimeout);
    }
  }, [isPlayerTurn, gameState, hasHydrated, roundResult?.show, addMove, playBotMoveSound, toggleTurn, currentWord, matchConfig.theme]);

  const handleTriggerSuccess = () => {
    playSuccessSound();
    setShowConfetti(true);
  };

  const handleKeyPress = (key: string) => {
    if (!isPlayerTurn || roundResult?.show) return;
    
    addMove({ letter: key, owner: OWNER_PLAYER });
    playMoveSound();
    toggleTurn();
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


  if (gameState !== PLAYING && gameState !== ENDED) {
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
                    const playerWins = roundWinners.filter(w => w === OWNER_PLAYER).length;
                    const botWins = roundWinners.filter(w => w === OWNER_BOT).length;
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
                                    winner === OWNER_PLAYER ? "border-neo-cyan bg-neo-cyan text-black" : "border-neo-red bg-neo-red text-white"
                                  )}
                                >
                                  {winner === OWNER_PLAYER ? 
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
                      roundResult.winner === OWNER_PLAYER ? 'bg-neo-cyan text-black' : 'bg-neo-red text-white'
                    }`}>
                      {roundResult.winner === OWNER_PLAYER ? <Trophy size={28} /> : <AlertCircle size={28} />}
                    </div>
                    <DialogTitle className={`text-2xl font-black uppercase italic ${
                      roundResult.winner === OWNER_PLAYER ? 'text-neo-cyan' : 'text-neo-red'
                    }`}>
                      {roundResult.winner === OWNER_PLAYER ? 'Round Won!' : 'Round Lost!'}
                    </DialogTitle>
                    <DialogDescription className="text-zinc-400">
                      <span className="block mb-2">
                        {(() => {
                          const { type, winner, initiator, solution } = roundResult;
                          const themeDesc = matchConfig.theme === THEME_COUNTRIES ? 'country' : 
                                            matchConfig.theme === THEME_CAPITALS ? 'capital' : 
                                            matchConfig.theme === THEME_ANIMALS ? 'animal' : 'dictionary word';
                          const prefix = currentWord.toUpperCase();
                          
                          if (type === CHALLENGE_TIMEOUT) {
                            return winner === OWNER_BOT ? "You ran out of time!" : "Triebot was too slow!";
                          }
                          
                          if (type === CHALLENGE_WORD) {
                            if (initiator === OWNER_PLAYER) {
                              return winner === OWNER_PLAYER 
                                ? `You caught Triebot completing a valid ${themeDesc}: "${prefix}"!` 
                                : `You falsely claimed "${prefix}" was a finished ${themeDesc}!`;
                            } else {
                              return winner === OWNER_BOT 
                                ? `Triebot caught you completing a valid ${themeDesc}: "${prefix}"!` 
                                : `Triebot falsely claimed "${prefix}" was a finished ${themeDesc}!`;
                            }
                          }
                          
                          if (type === CHALLENGE_BLUFF) {
                            if (initiator === OWNER_PLAYER) {
                              return winner === OWNER_PLAYER
                                ? `You correctly caught Triebot's bluff! No valid ${themeDesc} starts with "${prefix}".`
                                : `Triebot wasn't bluffing! It was going for: "${solution?.toUpperCase()}"`;
                            } else {
                              return winner === OWNER_BOT
                                ? `You played an invalid prefix! No valid ${themeDesc} starts with "${prefix}".`
                                : `Triebot falsely called your bluff! You could have formed: "${solution?.toUpperCase()}"`;
                            }
                          }
                          return "Round concluded.";
                        })()}
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
