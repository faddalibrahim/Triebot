import { buildGameTrie } from './lib/trie';
import { THEME_COUNTRIES } from './lib/constants';

const trie = buildGameTrie(THEME_COUNTRIES);
console.log("startsWith('a'):", trie.startsWith('a'));
console.log("startsWith('A'):", trie.startsWith('A'));
console.log("search('A'):", trie.search('A'));
