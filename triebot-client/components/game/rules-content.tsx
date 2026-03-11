import React from 'react';
import { BookOpen } from 'lucide-react';
import { DrawerHeader, DrawerTitle, DrawerDescription } from '@/components/ui/drawer';

export const RulesContent: React.FC = () => {
  return (
    <div className="mx-auto w-full max-w-2xl px-6">
      <DrawerHeader>
        <DrawerTitle className="text-xl sm:text-3xl font-extrabold flex items-center gap-2 sm:gap-3 justify-center py-2 sm:py-4">
          <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-neo-purple shrink-0" />
          <span>How to Play <span className="text-neo-purple">Triebot</span></span>
        </DrawerTitle>
        <DrawerDescription className="text-center text-zinc-400 text-lg mb-6">
          Don&apos;t be the one to finish the word.
        </DrawerDescription>
      </DrawerHeader>

      <div className="grid gap-8 overflow-y-auto max-h-[50vh] pr-2 custom-scrollbar">
        {/* Rulebook Section */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-neo-surface text-neo-purple text-xs flex items-center justify-center font-bold">1</span>
            The Rulebook
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              "Words must be 4+ letters.",
              "No plurals (e.g., apples).",
              "No verb tense variants.",
              "No names or brands.",
              "Cannot repeat a word in a session."
            ].map((rule, idx) => (
              <div key={idx} className="bg-neo-surface/40 border border-white/5 p-3 rounded-lg text-sm text-zinc-300">
                {rule}
              </div>
            ))}
          </div>
        </section>

        {/* Move Section */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-neo-surface text-neo-purple text-xs flex items-center justify-center font-bold">2</span>
            Making a Move
          </h2>
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-neo-surface/30 border border-white/5">
              <h3 className="font-bold text-neo-cyan text-sm mb-1 uppercase tracking-wider">Add a Letter</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">Append one character. It must still have potential to form a real word.</p>
            </div>
            <div className="p-4 rounded-xl bg-neo-surface/30 border border-white/5 border-l-neo-purple border-l-2">
              <h3 className="font-bold text-white text-sm mb-1 uppercase tracking-wider">Bluff Call</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">Claim the fragment <strong>cannot possibly</strong> form a valid word.</p>
            </div>
            <div className="p-4 rounded-xl bg-neo-surface/30 border border-white/5 border-l-neo-pink border-l-2">
              <h3 className="font-bold text-white text-sm mb-1 uppercase tracking-wider">Word Call</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">Claim the opponent <strong>already finished</strong> a valid word (4+ letters).</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
