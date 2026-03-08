# Triebot : A word robot that almost never loses

A words game where players take turns adding letters to a growing word. The goal is to **avoid** being the one to complete a valid word, as that player loses. The game uses a trie data structure to efficiently check for valid words and prefixes.

### Rules
1. Words must be 4+ letters
2. No plurals ( apples, bananas etc)
3. No verb tense variants ( walking, walked, walks )
4. No names and brands ( Michael, Microsoft etc)
5. Can't repeat a word ( prevents infinite loops and boring strategies)
6. Bluff Call
	1. Repeated a word in the same game session
	2. Fragment cannot be a real word
	3.  If a word ain't in the app's dictionary, add it
7. Odd rounds so we can determine the winner

### Extras
1. Timed Rounds
2. Themed Rounds ( countries, animals, capitals etc) (PRO)
3. Tournaments (PRO)
4. Leaderboards (PRO)
5. Play with robot or X others (PRO)

### Tech Stack
1. React (NextJS with Typescript)
2. TailwindCSS
3. Zustand
4. PostgreSQL
5. Redis
6. Docker
7. SocketIO

## Game Logic & Flow

Players take turns adding letters to a growing word. The goal is to **avoid** being the one to complete a valid word, as that player loses. On each player's turn, they have 3 options:
1. Add a letter
2. Challenge the previous player (Bluff Call)
3. Challenge the previous player (Word Call)

If a player chooses to **Add a letter**, they append one character to the current fragment, and the play seamlessly passes to the next player. The fragment must still have the potential to form a real word.

If a player chooses the **Bluff Call**, they are challenging the previous player, claiming that the current fragment *cannot* possibly form a valid word. If the challenger is correct (no valid word can be formed), they win the round. However, if the previous player can state a valid word that starts with the current fragment, the challenger loses.

If a player chooses the **Word Call**, they are challenging the previous player, claiming that the current fragment *is already a complete, valid word* (of 4 or more letters). If the fragment is indeed a valid word, the challenger wins the round (because the previous player completed it). If the fragment is not a valid word, the challenger loses for making a false claim.


### Flowchart

```mermaid
flowchart TD
    Start([Start Round]) --> Turn{"Current Player's Turn"}

    %% Action 1: Play a letter
    Turn -->|Action 1: Play| Add["Add a letter"]
    Add -.->|Pass to next player| Turn

    %% Action 2: Bluff Call
    Turn -->|Action 2: Challenge| BluffCall["Call Bluff: 'No possible word!'"]
    BluffCall --> IsWordPossible{"Can a valid word<br/>be formed?"}
    IsWordPossible -->|Yes| CP_Lose1(["Current Player Loses<br/>(False Challenge)"])
    IsWordPossible -->|No| CP_Win1(["Current Player Wins<br/>(Opponent was bluffing)"])

    %% Action 3: Challenge Completion
    Turn -->|Action 3: Challenge| WordCall["Call Word: 'You finished a word!'"]
    WordCall --> IsWordValid{"Is it a valid word<br/>(>= 4 letters)?"}

    IsWordValid -->|No| CP_Lose2(["Current Player Loses<br/>(False Challenge)"])
    IsWordValid -->|Yes| IsRepeated{"Was it a<br/>repeated word?"}

    IsRepeated -->|Yes| CP_Win2(["Current Player Wins<br/>(Opponent repeated a word)"])
    IsRepeated -->|No| CP_Win2_Alt(["Current Player Wins<br/>(Opponent finished a word)"])

    CP_Lose1 --> EndRound([End Round])
    CP_Win1 --> EndRound
    CP_Lose2 --> EndRound
    CP_Win2 --> EndRound
    CP_Win2_Alt --> EndRound

    classDef win fill:#d4edda,stroke:#28a745,color:#155724;
    classDef lose fill:#f8d7da,stroke:#dc3545,color:#721c24;
    classDef neutr fill:#e2e3e5,stroke:#383d41,color:#383d41;

    class EndRound neutr;
    class CP_Win1,CP_Win2,CP_Win2_Alt win;
    class CP_Lose1,CP_Lose2 lose;
```