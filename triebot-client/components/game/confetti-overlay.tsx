"use client";

import React, { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import confettiData from '@/public/lottie/confetti.json';

interface ConfettiOverlayProps {
  trigger: boolean;
  onComplete: () => void;
}

export const ConfettiOverlay: React.FC<ConfettiOverlayProps> = ({ trigger, onComplete }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (trigger) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        onComplete();
      }, 3000); // Confetti duration
      return () => clearTimeout(timer);
    }
  }, [trigger, onComplete]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center">
      <Lottie 
        animationData={confettiData} 
        loop={false}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};
