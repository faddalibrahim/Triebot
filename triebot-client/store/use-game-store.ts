import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Move } from '@/components/game/word-fragment';

interface MatchConfig {
  mode: 'vs-triebot' | 'local-multiplayer';
  rounds: number;
  timeLimit: number;
  theme: string;
  playerName: string;
  avatar: string;
}

interface GameState {
  // State
  matchConfig: MatchConfig;
  round: number;
  totalRounds: number;
  timeLeft: number;
  isPlayerTurn: boolean;
  moves: Move[];
  gameState: 'idle' | 'playing' | 'ended';
  showConfetti: boolean;
  roundWinners: ('player' | 'bot' | null)[];
  roundResult: { 
    show: boolean; 
    type: 'timeout' | 'word' | 'bluff'; 
    winner: 'player' | 'bot';
  } | null;

  // Actions
  setMatchConfig: (config: Partial<MatchConfig>) => void;
  startGame: () => void;
  addMove: (move: Move) => void;
  toggleTurn: () => void;
  tickTimer: () => void;
  nextRound: () => void;
  setShowConfetti: (show: boolean) => void;
  resetGame: () => void;
  setGameState: (state: 'idle' | 'playing' | 'ended') => void;
  recordRoundResult: (winner: 'player' | 'bot', type: 'timeout' | 'word' | 'bluff') => void;
  clearRoundResult: () => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // Initial State
      matchConfig: {
        mode: 'vs-triebot',
        rounds: 5,
        timeLimit: 30,
        theme: 'general',
        playerName: 'Player 1',
        avatar: 'bot-1',
      },
      round: 1,
      totalRounds: 5,
      timeLeft: 30,
      isPlayerTurn: true,
      moves: [],
      isGameOver: false,
      gameState: 'idle',
      showConfetti: false,
      roundWinners: [],
      roundResult: null,

      // Actions
      setMatchConfig: (config) => set((state) => ({
        matchConfig: { ...state.matchConfig, ...config },
        // Sync related game state immediately if needed
        totalRounds: config.rounds ?? state.totalRounds,
      })),

      startGame: () => {
        const { matchConfig } = get();
        set({ 
          gameState: 'playing', 
          moves: [], 
          round: 1, 
          timeLeft: matchConfig.timeLimit, 
          totalRounds: matchConfig.rounds,
          isPlayerTurn: true, 
          roundWinners: [],
          roundResult: null,
        });
      },
      
      addMove: (move) => set((state) => ({ 
        moves: [...state.moves, move] 
      })),

      toggleTurn: () => set((state) => ({ 
        isPlayerTurn: !state.isPlayerTurn,
        timeLeft: state.matchConfig.timeLimit // Reset timer using match config
      })),

      tickTimer: () => set((state) => {
        if (state.timeLeft <= 0) return { timeLeft: 0 };
        return { timeLeft: state.timeLeft - 1 };
      }),

      nextRound: () => {
        const { round, totalRounds, matchConfig, roundResult } = get();
        if (round < totalRounds) {
          set({
            round: round + 1,
            moves: [],
            timeLeft: matchConfig.timeLimit,
            isPlayerTurn: roundResult?.winner === 'bot', // Loser starts!
            roundResult: null,
          });
        } else {
          set({ gameState: 'ended' });
        }
      },

      setShowConfetti: (show) => set({ showConfetti: show }),

      setGameState: (state) => set({ gameState: state }),

      recordRoundResult: (winner, type) => set((state) => {
        const newWinners = [...state.roundWinners];
        newWinners[state.round - 1] = winner;
        
        // Auto confetti on match victory
        const playerWins = newWinners.filter(w => w === 'player').length;
        const botWins = newWinners.filter(w => w === 'bot').length;
        const isLastRound = state.round === state.totalRounds;
        const autoConfetti = isLastRound && playerWins > botWins;

        return { 
          roundWinners: newWinners,
          roundResult: { show: true, type, winner },
          showConfetti: autoConfetti || state.showConfetti
        };
      }),

      clearRoundResult: () => set({ roundResult: null }),

      resetGame: () => set((state) => ({
        round: 1,
        timeLeft: state.matchConfig.timeLimit,
        isPlayerTurn: true,
        moves: [],
        gameState: 'idle',
        showConfetti: false,
        roundWinners: [],
        roundResult: null,
      })),
    }),
    {
      name: 'triebot-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
