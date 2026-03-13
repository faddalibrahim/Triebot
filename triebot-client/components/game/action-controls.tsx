"use client"

import React, { useState } from 'react';
import { Zap, Target, BookOpen, X } from 'lucide-react';
import { 
  Drawer, 
  DrawerTrigger, 
  DrawerContent, 
  DrawerHeader, 
  DrawerTitle, 
  DrawerDescription, 
  DrawerFooter, 
  DrawerClose 
} from '@/components/ui/drawer';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RulesContent } from './rules-content';
import { cn } from '@/lib/utils';

import { useGameStore } from '@/store/use-game-store';
import { OWNER_PLAYER, OWNER_BOT } from '@/lib/constants';

interface ActionControlsProps {
  onCallBluff: () => void;
  onCallWord: () => void;
  onForfeit: () => void;
  playSuccessSound: () => void;
  playErrorSound: () => void;
  disabled?: boolean;
}

export const ActionControls: React.FC<ActionControlsProps> = ({ 
  onCallBluff, 
  onCallWord,
  onForfeit,
  playSuccessSound,
  playErrorSound,
  disabled
}) => {
  const { moves } = useGameStore();
  const [isBluffOpen, setIsBluffOpen] = useState(false);
  const [isWordOpen, setIsWordOpen] = useState(false);

  const currentWord = moves.map(m => m.letter).join('');


  const handleCallBluff = () => {
    onCallBluff();
    setIsBluffOpen(false); // Close drawer immediately
  };

  const handleCallWord = () => {
    onCallWord();
    setIsWordOpen(false); // Close drawer immediately
  };

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-8">

      {/* Bluff Call Drawer */}
      <Drawer open={isBluffOpen} onOpenChange={setIsBluffOpen}>
        <DrawerTrigger asChild>
          <button 
            disabled={disabled}
            className={cn(
              "flex flex-col items-center justify-center p-2 sm:p-4 gap-1 bg-neo-surface border border-white/5 rounded-xl text-white transition-all group leading-none",
              disabled 
                ? "opacity-40 cursor-not-allowed grayscale-[50%]" 
                : "hover:bg-neo-surface-hover hover:border-white/20 cursor-pointer"
            )}
          >
            <Zap className={cn(
              "w-6 h-6 sm:w-8 sm:h-8 mb-1 text-neo-cyan transition-transform",
              !disabled && "group-hover:scale-110"
            )} />
            <span className="font-bold text-xs sm:text-base text-center">Bluff Call</span>
            <span className="text-[10px] sm:text-xs text-zinc-400 text-center px-1 hidden sm:block">&quot;Fragment can&apos;t form a word!&quot;</span>
          </button>
        </DrawerTrigger>
        <DrawerContent className="bg-neo-bg border-white/10 text-white pb-8">
          <div className="mx-auto w-full max-w-sm px-4">
            <DrawerHeader>
              <DrawerTitle className="text-2xl font-black flex items-center gap-2">
                <Zap className="text-neo-cyan" /> CHALLENGE BLUFF
              </DrawerTitle>
              <DrawerDescription className="text-zinc-400">
                You are challenging the last move. If no word can be formed starting with <span className="text-white font-mono uppercase">"{currentWord}"</span>, you win the round!
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4 bg-neo-surface/50 rounded-xl border border-white/5 mt-4">
              <p className="text-sm text-center mb-4">Are you sure? A failed challenge costs you a point.</p>
              <Button
                onClick={handleCallBluff}
                className="w-full bg-neo-cyan hover:bg-neo-cyan/90 text-black font-bold h-12 rounded-xl"
              >
                CONFIRM CHALLENGE
              </Button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Word Call Drawer */}
      <Drawer open={isWordOpen} onOpenChange={setIsWordOpen}>
        <DrawerTrigger asChild>
          <button 
            disabled={disabled}
            className={cn(
              "flex flex-col items-center justify-center p-2 sm:p-4 gap-1 bg-neo-surface border border-white/5 rounded-xl text-white transition-all group leading-none",
              disabled 
                ? "opacity-40 cursor-not-allowed grayscale-[50%]" 
                : "hover:bg-neo-surface-hover hover:border-white/20 cursor-pointer"
            )}
          >
            <Target className={cn(
              "w-6 h-6 sm:w-8 sm:h-8 mb-1 text-neo-pink transition-transform",
              !disabled && "group-hover:scale-110"
            )} />
            <span className="font-bold text-xs sm:text-base text-center">Word Call</span>
            <span className="text-[10px] sm:text-xs text-zinc-400 text-center px-1 hidden sm:block">&quot;You finished a real word!&quot;</span>
          </button>
        </DrawerTrigger>
        <DrawerContent className="bg-neo-bg border-white/10 text-white pb-8">
          <div className="mx-auto w-full max-w-sm px-4">
            <DrawerHeader>
              <DrawerTitle className="text-2xl font-black flex items-center gap-2">
                <Target className="text-neo-pink" /> CALL WORD
              </DrawerTitle>
              <DrawerDescription className="text-zinc-400">
                Are you claiming that <span className="text-white font-mono uppercase">"{currentWord}"</span> is a complete valid word?
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4 bg-neo-surface/50 rounded-xl border border-white/5 mt-4">
              <p className="text-sm text-center mb-4">If it's a valid word, you win! If not, Triebot wins.</p>
              <Button 
                onClick={handleCallWord}
                className="w-full bg-neo-pink hover:bg-neo-pink/90 text-black font-bold h-12 rounded-xl"
              >
                CLAIM WORD
              </Button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Rules Drawer */}
      <Drawer>
        <DrawerTrigger asChild>
          <button className="flex flex-col items-center justify-center p-2 sm:p-4 gap-1 bg-neo-surface hover:bg-neo-surface-hover border border-white/5 rounded-xl text-white transition-all hover:border-white/20 group cursor-pointer leading-none">
            <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 mb-1 text-neo-purple group-hover:scale-110 transition-transform" />
            <span className="font-bold text-xs sm:text-base text-center">Rules</span>
            <span className="text-[10px] sm:text-xs text-zinc-400 text-center px-1 hidden sm:block">&quot;How to play&quot;</span>
          </button>
        </DrawerTrigger>
        <DrawerContent className="bg-neo-bg border-white/10 text-white pb-8">
          <RulesContent />
        </DrawerContent>
      </Drawer>

      {/* Forfeit Dialog */}
      <Dialog>
        <DialogTrigger render={
          <button 
            disabled={disabled}
            className={cn(
              "flex flex-col items-center justify-center p-2 sm:p-4 gap-1 bg-neo-surface border border-white/5 rounded-xl text-white transition-all group leading-none",
              disabled 
                ? "opacity-40 cursor-not-allowed grayscale-[50%]" 
                : "hover:bg-neo-surface-hover hover:border-white/20 cursor-pointer"
            )}
          >
            <X className={cn(
              "w-6 h-6 sm:w-8 sm:h-8 mb-1 text-neo-red transition-transform",
              !disabled && "group-hover:scale-110"
            )} />
            <span className="font-bold text-xs sm:text-base text-center">Forfeit</span>
            <span className="text-[10px] sm:text-xs text-zinc-400 text-center px-1 hidden sm:block">&quot;Abandon match&quot;</span>
          </button>
        } />
        <DialogContent className="sm:max-w-md bg-neo-surface border-white/5 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold italic uppercase tracking-tight">Abandon Session?</DialogTitle>
            <DialogDescription className="text-zinc-500 font-medium">
              Leaving now will terminate the match and count as a loss. Are you sure?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:justify-end border-none bg-transparent pt-4">
            <DialogClose render={<Button variant="ghost" className="text-zinc-400 hover:text-white hover:bg-white/5">Cancel</Button>} />
            <Button 
              variant="destructive"
              className="bg-neo-red hover:bg-neo-red/80 text-white border-none font-black shadow-[0_0_20px_rgba(255,50,50,0.3)] transition-all active:scale-95 uppercase tracking-widest px-8"
              onClick={onForfeit}
            >
              FORFEIT
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
};
