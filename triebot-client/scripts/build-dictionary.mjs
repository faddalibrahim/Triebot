import fs from 'fs';
import nlp from 'compromise';

const rawDataPath = '/tmp/raw_words.txt';
if (!fs.existsSync(rawDataPath)) {
    console.error("Missing /tmp/raw_words.txt. Please ensure it was fetched.");
    process.exit(1);
}

const rawData = fs.readFileSync(rawDataPath, 'utf8');
const wordsArray = rawData.split('\n').map(w => w.trim().toLowerCase()).filter(Boolean);
const wordSet = new Set(wordsArray);

let validWords = [];

console.log(`Starting NLP filtering of ${wordsArray.length} words...`);

for (const word of wordsArray) {
    // 1. Length constraint
    if (word.length < 4) continue;
    
    // Pure characters only
    if (!/^[a-z]+$/.test(word)) continue;

    let doc = nlp(word);
    
    // 2. No Plurals
    if (doc.has('#Plural')) continue;
    if (doc.nouns().isPlural().out('array').length > 0) continue;

    // Plural manual heuristic: if it ends in 's' and the base word is in the set
    if (word.endsWith('s') && !word.endsWith('ss') && !word.endsWith('us') && !word.endsWith('is')) {
        const base1 = word.slice(0, -1);
        const base2 = word.endsWith('es') ? word.slice(0, -2) : null;
        if (wordSet.has(base1) || (base2 && wordSet.has(base2))) continue;
    }

    // Ing aggressive heuristic
    if (word.endsWith('ing')) {
        const safeIngs = new Set(['bring', 'thing', 'spring', 'string', 'king', 'ring', 'sing', 'wing', 'sling', 'cling', 'fling', 'sting', 'swing', 'wring', 'morning', 'evening', 'ceiling', 'nothing', 'during', 'wedding', 'meaning']);
        if (!safeIngs.has(word)) continue;
    }

    // Ed aggressive heuristic
    if (word.endsWith('ed')) {
        const safeEds = new Set(['exceed', 'succeed', 'proceed', 'hundred', 'infrared', 'sacred', 'wicked', 'need', 'seed', 'feed', 'bleed', 'speed', 'weed', 'reed', 'steed', 'deed', 'creed', 'greed', 'breed', 'bed', 'red', 'shed', 'sled', 'united']);
        if (!safeEds.has(word)) continue;
    }

    // 4. No names and brands
    if (doc.has('#ProperNoun') || doc.has('#Person') || doc.has('#Organization') || doc.has('#Place') || doc.has('#Country') || doc.has('#City')) {
        continue;
    }
    
    validWords.push(word);
}

const uniqueSortedWords = [...new Set(validWords)].sort();
const dest = '/Users/faddalibrahim/SWE/triebot/triebot-client/data/dictionary.json';

fs.writeFileSync(dest, JSON.stringify(uniqueSortedWords, null, 2));

console.log(`Original words: ${wordsArray.length}`);
console.log(`Rejected words: ${wordsArray.length - uniqueSortedWords.length}`);
console.log(`Remaining valid Ghost words: ${uniqueSortedWords.length}`);
console.log(`Saved pristine dictionary to ${dest}`);
