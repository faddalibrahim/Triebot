import { buildGameTrie, GameTheme, TrieNode } from './trie'
import { DIFFICULTY_EASY, DIFFICULTY_MEDIUM, DIFFICULTY_HARD, THEME_DEFAULT } from './constants'

export type Difficulty = typeof DIFFICULTY_EASY | typeof DIFFICULTY_MEDIUM | typeof DIFFICULTY_HARD

/**
 * Triebot is the AI opponent for the Ghost game.
 * It uses a Minimax-evaluated Trie to determine optimal (or sub-optimal) moves based on difficulty.
 */
export class Triebot {
    difficulty: Difficulty
    theme: GameTheme
    private currentNode: TrieNode | null

    constructor(difficulty: Difficulty = DIFFICULTY_MEDIUM, theme: GameTheme = THEME_DEFAULT) {
        this.difficulty = difficulty
        this.theme = theme
        this.currentNode = buildGameTrie(this.theme).root
    }

    /**
     * Resets the bot's internal pointer back to the root of the Trie for a new game.
     * Automatically called if the theme is changed.
     */
    reset() {
        this.currentNode = buildGameTrie(this.theme).root
    }

    setDifficulty(difficulty: Difficulty) {
        this.difficulty = difficulty
    }

    /**
     * Updates the bot's active dictionary theme, resetting the node pointer.
     */
    setTheme(theme: GameTheme) {
        this.theme = theme
        this.reset()
    }

    /**
     * Progresses the bot's internal tracking pointer to match a letter played in the game.
     * This must be called whenever the player OR the bot makes a valid move!
     * @param char A single alphabetical character string in lowercase.
     */
    receiveMove(char: string) {
        if (!this.currentNode) return

        const lowerChar = char.toLowerCase()
        if (this.currentNode.children.has(lowerChar)) {
            this.currentNode = this.currentNode.children.get(lowerChar)!
        } else {
            // Reached an invalid state (letter played that isn't in dictionary)
            this.currentNode = null
        }
    }

    /**
     * Determines the best next letter for the bot to play in Ghost from its current state.
     * @returns A single character string for the next move, or null if no move is possible (game over).
     */
    getNextMove(): string | null {
        if (!this.currentNode) {
            return null // Unreachable state
        }
        
        // If we've already reached a complete word, the game should have ended.
        if (this.currentNode.endOfWord) {
            return null
        }

        const validMoves = Array.from(this.currentNode.children.keys())
        if (validMoves.length === 0) {
            return null
        }

        // A move is considered "winning" if the resulting child node is NOT a win for the NEXT player.
        const winningMoves = validMoves.filter(char => {
            const child = this.currentNode!.children.get(char)!
            return !child.isWinning
        })

        const losingMoves = validMoves.filter(char => {
            const child = this.currentNode!.children.get(char)!
            return child.isWinning
        })

        // --- Difficulty Modifiers ---

        if (this.difficulty === DIFFICULTY_HARD) {
            // HARD: Always pick a guaranteed winning move if one exists.
            if (winningMoves.length > 0) {
                return winningMoves[Math.floor(Math.random() * winningMoves.length)]
            }
            // If forced to lose, pick a random valid move to prolong the inevitable or hope the player blunders.
            return validMoves[Math.floor(Math.random() * validMoves.length)]
        }
        
        if (this.difficulty === DIFFICULTY_MEDIUM) {
            // MEDIUM: Mix of optimal and sub-optimal play.
            // E.g., 60% chance to pick a winning move if available, otherwise random.
            if (winningMoves.length > 0 && Math.random() < 0.6) {
                return winningMoves[Math.floor(Math.random() * winningMoves.length)]
            }
            
            // Fallback: pick randomly from all valid moves.
            return validMoves[Math.floor(Math.random() * validMoves.length)]
        }

        if (this.difficulty === DIFFICULTY_EASY) {
            // EASY: Usually makes blunders if possible.
            // 70% chance to intentionally pick a LOSING move if one exists!
            if (losingMoves.length > 0 && Math.random() < 0.7) {
                return losingMoves[Math.floor(Math.random() * losingMoves.length)]
            }
            
            // Otherwise, completely random.
            return validMoves[Math.floor(Math.random() * validMoves.length)]
        }

        // Fallback safe return
        return validMoves[0]
    }
}
