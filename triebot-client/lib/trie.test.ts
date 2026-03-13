import { describe, it, expect } from 'vitest'
import { Trie } from './trie'

describe('Trie', () => {
    it('should create an empty trie', () => {
        const trie = new Trie()
        expect(trie.root).toBeDefined()
        expect(trie.root.children.size).toBe(0)
    })

    it('should insert a word', () => {
        const trie = new Trie()
         expect(trie.root.children.size).toBe(0)
        trie.insert('hello')
        expect(trie.root.children.size).toBe(1)
        expect(trie.root.children.get('h')).toBeDefined()
    })
    
    it('should insert and search for a word', () => {
        const trie = new Trie()
        trie.insert('hello')
        expect(trie.search('hello')).toBe(true)
    })

    it('should not find a word that does not exist', () => {
        const trie = new Trie()
        trie.insert('hello')
        expect(trie.search('world')).toBe(false)
    })

    it('should find a prefix', () => {
        const trie = new Trie()
        trie.insert('hello')
        expect(trie.startsWith('hell')).toBe(true)
    })

    it('should not find a prefix that does not exist', () => {
        const trie = new Trie()
        trie.insert('hello')
        expect(trie.startsWith('helloo')).toBe(false)
    })
})