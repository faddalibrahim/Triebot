import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Move } from '@/components/game/word-fragment';
import { 
  PLAYING, 
  ENDED, 
  IDLE, 
  OWNER_PLAYER, 
  OWNER_BOT, 
  CHALLENGE_TIMEOUT, 
  CHALLENGE_WORD, 
  CHALLENGE_BLUFF,
  MODE_TRIEBOT,
  MODE_MULTIPLAYER,
  DIFFICULTY_EASY,
  DIFFICULTY_MEDIUM,
  DIFFICULTY_HARD,
  THEME_DEFAULT
} from '@/lib/constants';

interface MatchConfig {
  mode: typeof MODE_TRIEBOT | typeof MODE_MULTIPLAYER;
  rounds: number;
  timeLimit: number;
  theme: string;
  playerName: string;
  avatar: string;
  difficulty: typeof DIFFICULTY_EASY | typeof DIFFICULTY_MEDIUM | typeof DIFFICULTY_HARD;
}

interface GameState {
  // State
  matchConfig: MatchConfig;
  round: number;
  totalRounds: number;
  timeLeft: number;
  isPlayerTurn: boolean;
  moves: Move[];
  gameState: typeof IDLE | typeof PLAYING | typeof ENDED;
  showConfetti: boolean;
  roundWinners: (typeof OWNER_PLAYER | typeof OWNER_BOT | null)[];
  roundResult: { 
    show: boolean; 
    type: typeof CHALLENGE_TIMEOUT | typeof CHALLENGE_WORD | typeof CHALLENGE_BLUFF; 
    winner: typeof OWNER_PLAYER | typeof OWNER_BOT;
    initiator?: typeof OWNER_PLAYER | typeof OWNER_BOT;
    solution?: string;
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
  setGameState: (state: typeof IDLE | typeof PLAYING | typeof ENDED) => void;
  recordRoundResult: (
    winner: typeof OWNER_PLAYER | typeof OWNER_BOT, 
    type: typeof CHALLENGE_TIMEOUT | typeof CHALLENGE_WORD | typeof CHALLENGE_BLUFF, 
    initiator?: typeof OWNER_PLAYER | typeof OWNER_BOT, 
    solution?: string
  ) => void;
  clearRoundResult: () => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // Initial State
      matchConfig: {
        mode: MODE_TRIEBOT,
        rounds: 5,
        timeLimit: 30,
        theme: THEME_DEFAULT,
        playerName: 'Player 1',
        avatar: 'bot-1',
        difficulty: DIFFICULTY_MEDIUM,
      },
      round: 1,
      totalRounds: 5,
      timeLeft: 30,
      isPlayerTurn: true,
      moves: [],
      isGameOver: false,
      gameState: IDLE,
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
          gameState: PLAYING, 
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
            isPlayerTurn: roundResult?.winner === OWNER_BOT, // Loser starts!
            roundResult: null,
          });
        } else {
          set({ gameState: ENDED });
        }
      },

      setShowConfetti: (show) => set({ showConfetti: show }),

      setGameState: (state) => set({ gameState: state }),

      recordRoundResult: (winner, type, initiator, solution) => set((state) => {
        const newWinners = [...state.roundWinners];
        newWinners[state.round - 1] = winner;
        
        // Auto confetti on match victory
        const playerWins = newWinners.filter(w => w === OWNER_PLAYER).length;
        const botWins = newWinners.filter(w => w === OWNER_BOT).length;
        const isLastRound = state.round === state.totalRounds;
        const autoConfetti = isLastRound && playerWins > botWins;

        return { 
          roundWinners: newWinners,
          roundResult: { show: true, type, winner, initiator, solution },
          showConfetti: autoConfetti || state.showConfetti
        };
      }),

      clearRoundResult: () => set({ roundResult: null }),

      resetGame: () => set((state) => ({
        round: 1,
        timeLeft: state.matchConfig.timeLimit,
        isPlayerTurn: true,
        moves: [],
        gameState: IDLE,
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
