import { describe, it, expect, beforeEach } from 'vitest'
import { Triebot, Difficulty } from './triebot'
import { DIFFICULTY_HARD, DIFFICULTY_MEDIUM, DIFFICULTY_EASY, THEME_DEFAULT } from './constants'

describe('AI Decision Engine', () => {
    let bot: Triebot

    beforeEach(() => {
        bot = new Triebot(DIFFICULTY_HARD, THEME_DEFAULT)
    })

    const playString = (bot: Triebot, word: string) => {
        for (const char of word) {
            bot.receiveMove(char)
        }
    }

    it('should return null for an invalid prefix', () => {
        playString(bot, 'xyzq')
        expect(bot.getNextMove()).toBeNull()
    })

    it('should return null if the string is already a completed word', () => {
        // 'ability' is definitely in the dictionary
        // In ghost, if 'ability' is played, the game is over.
        playString(bot, 'ability')
        expect(bot.getNextMove()).toBeNull()
    })

    it('should return a valid next letter for a valid prefix', () => {
        playString(bot, 'abili')
        const move = bot.getNextMove()
        expect(move).toBeDefined()
        expect(typeof move).toBe('string')
        expect(move?.length).toBe(1)
    })

    // We can't deterministically test Easy/Medium without mocking Math.random
    // but we can ensure they return valid strings.
    it('should return valid moves on medium difficulty', () => {
        bot.setDifficulty(DIFFICULTY_MEDIUM)
        playString(bot, 'abili')
        const move = bot.getNextMove()
        expect(move).toBeDefined()
        expect(typeof move).toBe('string')
    })

    it('should return valid moves on easy difficulty', () => {
        bot.setDifficulty(DIFFICULTY_EASY)
        playString(bot, 'abili')
        const move = bot.getNextMove()
        expect(move).toBeDefined()
        expect(typeof move).toBe('string')
    })
})
