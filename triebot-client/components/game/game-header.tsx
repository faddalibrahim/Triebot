"use client"

import React from 'react';
import { X, Check, X as IconX, Users, Cpu, ShieldCheck, Timer } from 'lucide-react';
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
import { useGameStore } from "@/store/use-game-store";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface GameHeaderProps {
  onForfeit: () => void;
}

export const GameHeader: React.FC<GameHeaderProps> = ({ onForfeit }) => {
  const { round, totalRounds, timeLeft, roundWinners, matchConfig, roundResult } = useGameStore();

  const controlsContent = (
    <div className="flex items-center gap-1.5 bg-white/5 border border-white/5 p-1 rounded-full hover:border-white/10 transition-colors shadow-lg">
      {/* Timer Only */}
      <div className={cn(
        "flex items-center justify-center w-10 h-10 rounded-full border transition-all duration-300",
        roundResult?.show 
          ? "bg-transparent border-transparent opacity-20 grayscale" 
          : "bg-black/20 border-white/10 shadow-inner"
      )}>
        <span className={cn(
          "text-xs sm:text-sm font-mono font-bold leading-none",
          timeLeft <= 5 && !roundResult?.show ? "text-neo-red animate-pulse" : "text-white"
        )}>
          {timeLeft}
        </span>
      </div>
    </div>
  );

  const trackerContent = () => {
    // Dynamic sizing based on totalRounds for a clean single row
    const getSizing = () => {
      if (totalRounds <= 3) return { dot: "w-8 h-8", icon: 16, gap: "gap-2.5", dotSize: "w-1 h-1" };
      if (totalRounds <= 5) return { dot: "w-7 h-7", icon: 14, gap: "gap-2", dotSize: "w-1 h-1" };
      if (totalRounds <= 7) return { dot: "w-6 h-6", icon: 12, gap: "gap-1.5", dotSize: "w-1 h-1" };
      return { dot: "w-5 h-5", icon: 10, gap: "gap-1", dotSize: "w-0.5 h-0.5" };
    };

    const config = getSizing();

    return (
      <div className={cn("flex items-center", config.gap)}>
        {Array.from({ length: totalRounds }, (_, i) => i + 1).map((rn) => {
          const winner = roundWinners[rn - 1];
          const isCurrent = rn === round;
          return (
            <div 
              key={rn} 
              className={cn(
                "rounded-full flex items-center justify-center border-2 transition-all duration-500",
                config.dot,
                isCurrent ? "border-white bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.3)] animate-pulse" :
                winner === 'player' ? "border-neo-cyan bg-neo-cyan text-black" :
                winner === 'bot' ? "border-neo-red bg-neo-red text-white" :
                "border-white/10 bg-white/5"
              )}
            >
              {winner === 'player' && <Check size={config.icon} strokeWidth={4} />}
              {winner === 'bot' && <IconX size={config.icon} strokeWidth={4} />}
              {!winner && !isCurrent && <div className={cn("rounded-full bg-white/20", config.dotSize)} />}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <header className="w-full max-w-5xl mx-auto px-6 py-4 flex-none flex items-center justify-between relative z-10">
      
      {/* SECTION 1: IDENTITY (Left) */}
      <Dialog>
        <DialogTrigger nativeButton={false} render={
          <div className="flex items-center gap-3 cursor-pointer group hover:bg-white/5 px-2 py-1 -ml-2 rounded-xl transition-all active:scale-95">
            <Avatar className="w-10 h-10 border-2 border-white/5 shadow-xl transition-transform group-hover:scale-105">
              <AvatarFallback className="bg-neo-purple text-white font-black uppercase text-sm">
                {matchConfig.playerName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="hidden sm:flex flex-col">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-tight group-hover:text-white transition-colors">{matchConfig.playerName}</span>
              <span className="text-[9px] font-mono text-neo-cyan uppercase opacity-60">Session Host</span>
            </div>
          </div>
        } />
        <DialogContent className="sm:max-w-md bg-neo-surface border-white/5 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-black italic uppercase tracking-tight flex items-center gap-2">
              <ShieldCheck className="text-neo-cyan w-5 h-5" /> Session Details
            </DialogTitle>
            <DialogDescription className="text-zinc-500">
              Live configuration for this active Triebot session.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Players List */}
            <div className="space-y-3">
              <h4 className="text-[10px] uppercase tracking-[0.2em] font-black text-neo-cyan opacity-80 pl-1">Active Players</h4>
              <div className="space-y-2">
                {/* Human Player */}
                <div className="flex items-center justify-between p-3 bg-black/20 rounded-xl border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-neo-purple flex items-center justify-center text-xs font-black italic">
                      {matchConfig.playerName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-sm leading-none mb-1">{matchConfig.playerName}</p>
                      <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-tighter">Session Host • You</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-black text-neo-cyan italic">{roundWinners.filter(w => w === 'player').length}W</span>
                  </div>
                </div>

                {/* Bot */}
                <div className="flex items-center justify-between p-3 bg-black/20 rounded-xl border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-neo-red/10 border border-neo-red/20 flex items-center justify-center text-neo-red">
                      <Cpu size={16} />
                    </div>
                    <div>
                      <p className="font-bold text-sm leading-none mb-1">Triebot-v1</p>
                      <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-tighter">AI Opponent</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-black text-neo-red italic">{roundWinners.filter(w => w === 'bot').length}W</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Match Rules */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold block mb-1">Match Length</span>
                <span className="font-mono text-sm text-white font-black">{totalRounds} Rounds</span>
              </div>
              <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold block mb-1">Bot Level</span>
                <span className={cn(
                  "font-mono text-sm font-black italic uppercase",
                  matchConfig.difficulty === 'easy' ? 'text-neo-cyan' :
                  matchConfig.difficulty === 'medium' ? 'text-neo-purple' : 'text-neo-red'
                )}>
                  {matchConfig.difficulty}
                </span>
              </div>
              <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold block mb-1">Turn Limit</span>
                <span className="font-mono text-sm text-neo-pink font-black flex items-center gap-1.5">
                  <Timer size={14} /> {matchConfig.timeLimit}s
                </span>
              </div>
              <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold block mb-1">Current Focus</span>
                <span className="font-mono text-sm text-white font-black italic uppercase">Round {round}</span>
              </div>
            </div>
          </div>

          <DialogFooter className="sm:justify-start border-none pt-2">
            <DialogClose render={
              <Button variant="ghost" className="w-full text-zinc-500 hover:text-white hover:bg-white/5 font-bold uppercase tracking-widest text-xs h-12">
                Close Manifest
              </Button>
            } />
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* SECTION 2: TRACKER (Center - perfectly mathematical for all screens) */}
      <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
        <span className="hidden sm:block text-zinc-400 font-medium text-[10px] uppercase tracking-[0.2em] mb-2 opacity-30">
          Match Progress
        </span>
        {trackerContent()}
      </div>

      {/* SECTION 3: ACTION HUB (Right) */}
      <div className="flex items-center">
        {controlsContent}
      </div>
    </header>
  );
};
