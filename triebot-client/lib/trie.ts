import dictionaryRaw from '../data/dictionary.json'
import countriesRaw from '../data/countries.json'
import capitalsRaw from '../data/capitals.json'
import animalsRaw from '../data/animals.json'
import { THEME_DEFAULT, THEME_COUNTRIES, THEME_CAPITALS, THEME_ANIMALS } from './constants'

export type GameTheme = typeof THEME_DEFAULT | typeof THEME_COUNTRIES | typeof THEME_CAPITALS | typeof THEME_ANIMALS

const themeData: Record<GameTheme, string[]> = {
    [THEME_DEFAULT]: dictionaryRaw as string[],
    [THEME_COUNTRIES]: countriesRaw as string[],
    [THEME_CAPITALS]: capitalsRaw as string[],
    [THEME_ANIMALS]: animalsRaw as string[]
}

class TrieNode {
    children: Map<string, TrieNode>
    endOfWord: boolean
    isWinning: boolean

    constructor() {
        this.children = new Map()
        this.endOfWord = false
        this.isWinning = false
    }
}

class Trie {
    root: TrieNode
    wordCount: number
    nodeCount: number

    constructor() {
        this.root = new TrieNode()
        this.wordCount = 0
        this.nodeCount = 1 // Root node counts as 1
    }
    
    insert(word: string){
        let curr = this.root
        const lowerWord = word.toLowerCase()
        
        for(let char of lowerWord){
            if(!curr.children.has(char)) {
                curr.children.set(char, new TrieNode())
                this.nodeCount++
            }
            curr = curr.children.get(char)!
        }
        
        if (!curr.endOfWord) {
            curr.endOfWord = true
            this.wordCount++
        }
    }

    insertAll(words: string[]) {
        for (const word of words) {
            this.insert(word)
        }
    }

    /**
     * Recursively computes and caches whether each node is a winning or losing state.
     * In Ghost:
     * - Node with endOfWord = TRUE is a LOSS for the player who formed it, thus a WIN for the player currently at this node.
     * - A node is a WIN for the current player if ANY child is a LOSS for the next player.
     * - A node is a LOSS for the current player if ALL children are WINS for the next player.
     */
    computeWinningStates(node: TrieNode = this.root): boolean {
        // If the game ended here (previous player completed a word), the current player wins!
        if (node.endOfWord) {
            node.isWinning = true
            return true
        }

        let canForceWin = false
        // Evaluate all valid subsequent moves (children)
        for (const child of node.children.values()) {
            const childIsWinningForNextPlayer = this.computeWinningStates(child)
            
            // If we can make a move that puts the next player in a losing state, 
            // then our current state is a winning state!
            if (!childIsWinningForNextPlayer) {
                canForceWin = true
            }
        }

        node.isWinning = canForceWin
        return canForceWin
    }
    
    // word call
    search(word: string){
        let curr = this.root
        const lowerWord = word.toLowerCase()
        
        for(let char of lowerWord){
            if(!curr.children.has(char))
                return false
            curr = curr.children.get(char)!
        }
        
        return curr.endOfWord
    }
    
    // bluff call
    startsWith(prefix: string){
        let curr = this.root
        const lowerPrefix = prefix.toLowerCase()
        
        for(let char of lowerPrefix){
            if(!curr.children.has(char))
                return false
            curr = curr.children.get(char)!
        }
        
        return true
    }

    /**
     * Traverses depth-first from the given prefix to find a valid complete word.
     * Used by the AI to "prove" it had a word in mind during bluff challenges!
     */
    getRandomWordWithPrefix(prefix: string): string | null {
        let curr = this.root
        const lowerPrefix = prefix.toLowerCase()
        
        for(let char of lowerPrefix){
            if(!curr.children.has(char)) return null
            curr = curr.children.get(char)!
        }
        
        let word = lowerPrefix
        while (!curr.endOfWord && curr.children.size > 0) {
            // Pick a random branch to follow
            const childrenKeys = Array.from(curr.children.keys())
            const randomBranch = childrenKeys[Math.floor(Math.random() * childrenKeys.length)]
            word += randomBranch
            curr = curr.children.get(randomBranch)!
        }
        
        return curr.endOfWord ? word : null
    }
}

const trieCache: Partial<Record<GameTheme, Trie>> = {}

/**
 * Builds and caches the game Trie using the pre-filtered dictionary for a specific theme.
 * Subsequent calls return the cached instance to avoid rebuilding the tree.
 */
function buildGameTrie(theme: GameTheme = THEME_DEFAULT): Trie {
    if (trieCache[theme]) {
        return trieCache[theme]!
    }

    console.time(`buildGameTrie-${theme}`)
    const trie = new Trie()
    trie.insertAll(themeData[theme])
    
    // Pre-calculate all Minimax states!
    trie.computeWinningStates(trie.root)
    console.timeEnd(`buildGameTrie-${theme}`)
    
    console.log(`[Trie][${theme}] Instantiated with ${trie.wordCount} words and ${trie.nodeCount} nodes.`)
    trieCache[theme] = trie
    
    return trie
}

export { Trie, TrieNode, buildGameTrie }