import React from 'react';

interface GameKeyboardProps {
  onKeyPress: (key: string) => void;
  disabled?: boolean;
}

export const GameKeyboard: React.FC<GameKeyboardProps> = ({ onKeyPress, disabled }) => {
  const rows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
  ];

  return (
    <div className="w-full flex flex-col gap-1.5 sm:gap-2 max-w-2xl mx-auto">
      {rows.map((row, rowIdx) => (
        <div key={rowIdx} className={`flex justify-center gap-1 sm:gap-2 ${
          rowIdx === 1 ? 'px-2 sm:px-6' : 
          rowIdx === 2 ? 'px-6 sm:px-14' : ''
        }`}>
          {row.map((key) => (
            <button 
              key={key} 
              disabled={disabled}
              className={`h-12 sm:h-16 md:h-20 flex-1 max-w-[44px] sm:max-w-[64px] bg-neo-surface text-white font-bold text-lg md:text-2xl rounded-md sm:rounded-xl shadow-sm border border-white/5 transition-all active:scale-95
                ${disabled 
                  ? 'opacity-40 cursor-not-allowed grayscale-[50%]' 
                  : 'hover:bg-neo-purple cursor-pointer'
                }`}
              onClick={() => onKeyPress(key)}
            >
              {key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};
