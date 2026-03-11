import React from 'react';
import Link from 'next/link';
import { Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { KeyboardBackground } from './keyboard-background';

export const Hero: React.FC = () => {
  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center text-center px-4 py-20 overflow-hidden">
      <KeyboardBackground />
      


      <div className="relative z-10 animate-float" style={{ animationDuration: '4s' }}>
        <div className="inline-block mb-6 px-5 py-2 rounded-full border border-neo-cyan/40 glass shadow-[0_0_15px_rgba(255,255,255,0.2)]">
          <span className="text-neo-cyan font-mono text-xs md:text-sm uppercase tracking-widest font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-neo-cyan animate-pulse" />
            Triebot v1.0
          </span>
        </div>
      </div>
      
      <div className="relative z-10 flex flex-col items-center mb-6 animate-float" style={{ animationDuration: '6s' }}>
        <div className="mb-4 filter drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] text-white">
          <Bot size={80} strokeWidth={1.5} />
        </div>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white drop-shadow-2xl">
          Think you can <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-neo-cyan to-neo-purple relative inline-block mt-2">
            beat
          </span>  me?
        </h1>
      </div>
      
      <p className="relative z-10 max-w-2xl text-lg md:text-xl text-zinc-400 mb-10 leading-relaxed drop-shadow-md">
        Take turns building a word together, but whatever you do... don't be the one to finish it.
      </p>
      
      <div className="relative z-10 flex flex-col sm:flex-row gap-6 items-center justify-center w-full max-w-lg mx-auto">
        <Link href="/lobby" className="w-full sm:w-auto flex-1">
          <Button variant="neo" size="xl" className="w-full min-w-[240px]">Play Now</Button>
        </Link>
        <Link href="/rules" className="w-full sm:w-auto flex-1">
          <Button variant="neo-secondary" size="xl" className="w-full min-w-[240px]">Read The Rules</Button>
        </Link>
      </div>
    </section>
  );
};
