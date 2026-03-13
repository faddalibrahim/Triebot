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

    constructor() {
        this.root = new TrieNode()
    }
    
    insert(word: string){
        let curr = this.root
        
        for(let char of word){
            if(!curr.children.has(char)) 
                curr.children.set(char, new TrieNode())
            curr = curr.children.get(char)!
        }
        
        curr.endOfWord = true
    }
    
    // word call
    search(word: string){
        let curr = this.root
        
        for(let char of word){
            if(!curr.children.has(char))
                return false
            curr = curr.children.get(char)!
        }
        
        return curr.endOfWord
    }
    
    // bluff call
    startsWith(prefix: string){
        let curr = this.root
        
        for(let char of prefix){
            if(!curr.children.has(char))
                return false
            curr = curr.children.get(char)!
        }
        
        return true
    }
}

export { Trie, TrieNode }