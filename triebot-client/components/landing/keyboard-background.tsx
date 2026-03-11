"use client";
import React, { useEffect, useState } from 'react';

export const KeyboardBackground: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [letters, setLetters] = useState<string[]>([]);
  
  const keysArray = Array.from({ length: 800 });

  useEffect(() => {
    setMounted(true);
    
    // Initialize random letters
    const initialLetters = Array.from({ length: 800 }, () => 
      String.fromCharCode(65 + Math.floor(Math.random() * 26))
    );
    setLetters(initialLetters);

    // Periodically scramble some letters for a dynamic effect
    const interval = setInterval(() => {
      setLetters(prev => {
        if (prev.length === 0) return prev;
        const next = [...prev];
        // Scramble ~30 keys at a time
        for (let i = 0; i < 30; i++) {
          const randIdx = Math.floor(Math.random() * next.length);
          next[randIdx] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        }
        return next;
      });
    }, 150);

    return () => clearInterval(interval);
  }, []);

  if (!mounted || letters.length === 0) return null;

  return (
    <div 
      className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-30"
    >
      <div className="w-[120vw] h-[120vh] -translate-x-[10vw] -translate-y-[10vh] grid grid-cols-[repeat(auto-fill,minmax(45px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(80px,1fr))] gap-1.5 md:gap-3 p-2 md:p-4">
        {letters.map((letter, idx) => {
          const brandingLetters = ['T', 'R', 'I', 'E', 'B', 'O', 'T'];
          const isBrandingKey = idx > 40 && idx % 88 === 0;
          const brandingIdx = Math.floor(idx / 88) % brandingLetters.length;
          const brandingLetter = isBrandingKey ? brandingLetters[brandingIdx] : '';

          return (
            <div 
              key={idx}
              className={`w-full aspect-square rounded-md md:rounded-xl border border-white/10 bg-white/[0.03] flex items-center justify-center font-mono text-xs md:text-xl transition-colors duration-500 ${
                isBrandingKey 
                  ? 'text-neo-cyan font-extrabold shadow-[0_0_8px_rgba(0,209,255,0.3)]' 
                  : 'text-white/20'
              }`}
            >
              {brandingLetter || letter}
            </div>
          );
        })}
      </div>
    </div>
  );
};
