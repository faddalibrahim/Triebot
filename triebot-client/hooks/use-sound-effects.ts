import { useEffect, useRef, useCallback } from 'react';

export const useSoundEffects = () => {
  const moveSound = useRef<HTMLAudioElement | null>(null);
  const botMoveSound = useRef<HTMLAudioElement | null>(null);
  const successSound = useRef<HTMLAudioElement | null>(null);
  const errorSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Preload sounds on mount
    moveSound.current = new Audio('/sounds/move.mp3');
    botMoveSound.current = new Audio('/sounds/bot-move.mp3');
    successSound.current = new Audio('/sounds/success.mp3');
    errorSound.current = new Audio('/sounds/error.mp3');

    // Optional: Pre-warm the audio context or preload
    [moveSound, botMoveSound, successSound, errorSound].forEach(ref => {
      if (ref.current) {
        ref.current.load();
      }
    });
  }, []);

  const playSound = useCallback((audio: HTMLAudioElement | null) => {
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(err => console.debug('Audio play blocked:', err));
    }
  }, []);

  const playMoveSound = useCallback(() => playSound(moveSound.current), [playSound]);
  const playBotMoveSound = useCallback(() => playSound(botMoveSound.current), [playSound]);
  const playSuccessSound = useCallback(() => playSound(successSound.current), [playSound]);
  const playErrorSound = useCallback(() => playSound(errorSound.current), [playSound]);

  return {
    playMoveSound,
    playBotMoveSound,
    playSuccessSound,
    playErrorSound,
  };
};
