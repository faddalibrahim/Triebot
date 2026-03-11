import React from 'react';
import Link from 'next/link';

export default function RulesPage() {
  return (
    <div className="min-h-screen bg-neo-bg text-foreground overflow-x-hidden selection:bg-neo-purple/30 relative">

      
      <div className="max-w-4xl mx-auto px-6 py-20 md:py-32 relative z-10">
        <div className="mb-16">
          <Link href="/" className="inline-flex items-center text-zinc-400 hover:text-white transition-colors mb-8 font-medium">
            <span className="mr-2">←</span> Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white via-zinc-200 to-zinc-500 mb-6 drop-shadow-xl">
            How to Play <span className="text-neo-purple">Triebot</span>
          </h1>
          <p className="text-xl text-zinc-400 leading-relaxed max-w-2xl">
            Triebot is a virtually unbeatable opponent in the classic game of Ghost. Take turns building a word together, but whatever you do... don't be the one to finish it.
          </p>
        </div>

        <div className="grid gap-12">
          
          {/* Section: The Rulebook */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-neo-surface text-neo-purple text-sm">1</span>
              The Rulebook
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                "Words must be 4+ letters.",
                "No plurals (e.g., apples, bananas).",
                "No verb tense variants (e.g., walking, walked).",
                "No names or brands (e.g., Microsoft, Michael).",
                "You cannot repeat a word in the same game session."
              ].map((rule, idx) => (
                <div key={idx} className="bg-neo-surface/50 border border-white/5 p-5 rounded-xl text-zinc-300 shadow-sm">
                  {rule}
                </div>
              ))}
            </div>
          </section>

          {/* Section: Your Turn */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-neo-surface text-neo-purple text-sm">2</span>
              Making a Move
            </h2>
            <p className="text-zinc-400 mb-6">On your turn, you have three options to choose from:</p>
            
            <div className="space-y-4">
              {/* Move 1 */}
              <div className="bg-neo-surface border border-white/5 p-6 rounded-2xl">
                <h3 className="text-xl font-bold text-white mb-2 text-neo-cyan">Add a Letter</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Append one character to the current word fragment. The resulting fragment must still have the potential to form a real, valid dictionary word. Play then seamlessly passes to the next player.
                </p>
              </div>

              {/* Move 2 */}
              <div className="bg-neo-surface border border-white/5 p-6 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-neo-purple" />
                <h3 className="text-xl font-bold text-white mb-2">Bluff Call</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Challenge the previous player, claiming that their fragment <strong>cannot possibly</strong> form a valid word. If no valid word exists, you win! But if the previous player can state a valid word that starts with the fragment, they win and you lose.
                </p>
              </div>

              {/* Move 3 */}
              <div className="bg-neo-surface border border-white/5 p-6 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-neo-pink" />
                <h3 className="text-xl font-bold text-white mb-2">Word Call</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Challenge the previous player, claiming they <strong>already finished</strong> a valid word (4+ letters). If they did indeed complete a word, you win! But if the fragment is not a real complete word, you lose the challenge.
                </p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
