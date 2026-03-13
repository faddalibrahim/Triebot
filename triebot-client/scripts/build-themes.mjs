import fs from 'fs';

const isGhostWord = (word) => {
    if (!word) return false;
    const w = word.trim().toLowerCase();
    if (w.length < 4) return false;
    if (!/^[a-z]+$/.test(w)) return false;
    return true;
};

// 1. Animals
const rawAnimals = JSON.parse(fs.readFileSync('/tmp/animals.json', 'utf8'));
const animalsList = rawAnimals.animals || [];
const validAnimals = [...new Set(animalsList.filter(isGhostWord).map(w => w.toLowerCase()))].sort();
fs.writeFileSync('./data/animals.json', JSON.stringify(validAnimals, null, 2));
console.log(`Saved ${validAnimals.length} animal words to data/animals.json`);

// 2. Countries and Capitals
const rawCountries = JSON.parse(fs.readFileSync('/tmp/countries.json', 'utf8'));
let countries = [];
let capitals = [];

for (const c of rawCountries) {
    if (c.name && c.name.common) {
        countries.push(c.name.common);
    }
    if (c.capital && c.capital.length > 0) {
        capitals.push(c.capital[0]);
    }
}

const validCountries = [...new Set(countries.filter(isGhostWord).map(w => w.toLowerCase()))].sort();
fs.writeFileSync('./data/countries.json', JSON.stringify(validCountries, null, 2));
console.log(`Saved ${validCountries.length} country words to data/countries.json`);

const validCapitals = [...new Set(capitals.filter(isGhostWord).map(w => w.toLowerCase()))].sort();
fs.writeFileSync('./data/capitals.json', JSON.stringify(validCapitals, null, 2));
console.log(`Saved ${validCapitals.length} capital words to data/capitals.json`);
