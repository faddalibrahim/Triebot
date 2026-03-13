"use client"

import React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Bot, User, Clock, Hash, Globe, Trophy } from "lucide-react"
import { useGameStore } from "@/store/use-game-store"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"



const TIMER_PRESETS = [15, 30, 45, 60]

const DIFFICULTY_OPTIONS = [
  { id: 'easy', label: 'Easy', description: 'Friendly bot, shorter words', colorClass: 'text-neo-cyan border-neo-cyan/20 bg-neo-cyan/5 hover:border-neo-cyan/40' },
  { id: 'medium', label: 'Medium', description: 'Standard rules, fair match', colorClass: 'text-neo-purple border-neo-purple/20 bg-neo-purple/5 hover:border-neo-purple/40' },
  { id: 'hard', label: 'Hard', description: 'Master AI, no mercy', colorClass: 'text-neo-red border-neo-red/20 bg-neo-red/5 hover:border-neo-red/40' },
] as const

export default function LobbyPage() {
  const router = useRouter()
  const { matchConfig, setMatchConfig, startGame } = useGameStore()

  const handleStartMatch = () => {
    startGame()
    router.push("/play")
  }

  return (
    <div className="min-h-screen bg-neo-bg text-foreground p-4 md:p-8 selection:bg-neo-purple/30">
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" className="gap-2 text-zinc-400 hover:text-white transition-colors">
              <ArrowLeft size={18} /> Back to Home
            </Button>
          </Link>
          <div className="text-right">
            <h1 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neo-cyan to-neo-purple">GAME LOBBY</h1>
            <p className="text-xs text-zinc-500 uppercase tracking-widest">Precision Word Gaming</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Identity Hub */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-neo-surface border-white/5 ring-0 overflow-visible">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <User className="text-neo-cyan w-5 h-5" /> Identity
                </CardTitle>
                <CardDescription>How you'll appear in the arena</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Arena Nickname</label>
                  <Input 
                    placeholder="Enter nickname..." 
                    className="bg-black/40 border-white/10 h-10 text-white focus:border-neo-cyan/50 transition-all"
                    value={matchConfig.playerName}
                    onChange={(e) => setMatchConfig({ playerName: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#0a0a0b] border-white/5 border-dashed relative overflow-hidden hidden lg:block">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <Trophy size={80} />
              </div>
              <CardContent className="pt-6">
                <p className="text-xs text-zinc-400 italic">"In Ghost, every letter counts. Don't be the one to finish the word—but always be ready to call a bluff."</p>
              </CardContent>
            </Card>
          </div>

          {/* Configuration Arena */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-neo-surface border-white/5 ring-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Globe className="text-neo-purple w-5 h-5" /> Match Config
                </CardTitle>
                <CardDescription>Define the battlefield parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                
                {/* Mode Selector */}
                <div className="space-y-4">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Game Mode</label>
                    <Tabs 
                      defaultValue={matchConfig.mode} 
                      className="w-full"
                      onValueChange={(v) => v && setMatchConfig({ mode: v as any })}
                    >
                      <TabsList className="grid w-full grid-cols-2 h-12 bg-black/40 border-white/5 p-1 rounded-xl">
                        <TabsTrigger 
                          value="vs-triebot" 
                          className="rounded-lg data-active:bg-neo-cyan/10 data-active:text-neo-cyan transition-all"
                        >
                          <Bot className="w-4 h-4 mr-2" /> Vs Triebot
                        </TabsTrigger>
                    <TabsTrigger 
                      value="local-multiplayer" 
                      disabled
                      className="rounded-lg data-active:bg-neo-purple/10 data-active:text-neo-purple transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <User className="w-4 h-4 mr-2" /> Vs Friend (Soon)
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Difficulty Selection */}
              <div className="space-y-4">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">AI Difficulty Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {DIFFICULTY_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setMatchConfig({ difficulty: opt.id })}
                      className={`flex items-center justify-center h-10 rounded-xl border-2 transition-all group ${
                        matchConfig.difficulty === opt.id 
                          ? opt.id === 'easy' ? 'border-neo-cyan bg-neo-cyan/10 text-neo-cyan ring-4 ring-neo-cyan/5' :
                            opt.id === 'medium' ? 'border-neo-purple bg-neo-purple/10 text-neo-purple ring-4 ring-neo-purple/5' :
                            'border-neo-red bg-neo-red/10 text-neo-red ring-4 ring-neo-red/5'
                          : 'border-white/5 bg-black/20 text-zinc-500 hover:border-white/10'
                      }`}
                    >
                      <span className="font-black uppercase italic tracking-widest text-[10px] sm:text-xs">
                        {opt.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Round Selection */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-zinc-400">
                        <Hash size={16} />
                        <label className="text-xs font-bold uppercase tracking-wider">Game Rounds</label>
                      </div>
                      <Select 
                        value={String(matchConfig.rounds)} 
                        onValueChange={(v) => v && setMatchConfig({ rounds: parseInt(v) })}
                      >
                        <SelectTrigger className="bg-black/40 border-transparent h-10 w-full rounded-xl text-white">
                          <SelectValue placeholder="Best of..." />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-white/5 text-white rounded-xl">
                          <SelectItem value="1">1 Round (Sudden Death)</SelectItem>
                          <SelectItem value="3">3 Rounds (Match)</SelectItem>
                          <SelectItem value="5">5 Rounds (Standard)</SelectItem>
                          <SelectItem value="7">7 Rounds (Extended)</SelectItem>
                          <SelectItem value="9">9 Rounds (Championship)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
  
                    {/* Timer Presets */}
                    <div className="space-y-4">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2 text-zinc-400">
                          <Clock size={16} />
                          <label className="text-xs font-bold uppercase tracking-wider">Turn Timer</label>
                        </div>
                        <p className="text-xs text-zinc-500">Seconds allowed per move before time-out</p>
                      </div>
                      <RadioGroup 
                        className="flex flex-wrap gap-2"
                        value={String(matchConfig.timeLimit)}
                        onValueChange={(v) => v && setMatchConfig({ timeLimit: parseInt(v) })}
                      >
                      {TIMER_PRESETS.map((t) => (
                        <div key={t} className="flex-1 min-w-[60px]">
                          <RadioGroupItem value={String(t)} id={`t-${t}`} className="peer sr-only" />
                          <label 
                            htmlFor={`t-${t}`}
                            className={`flex flex-col items-center justify-center h-10 rounded-xl border-2 cursor-pointer transition-all text-sm leading-none ${
                              matchConfig.timeLimit === t 
                                ? 'border-neo-cyan bg-neo-cyan/10 text-neo-cyan ring-4 ring-neo-cyan/5' 
                                : 'border-white/5 bg-black/20 text-zinc-500 hover:border-white/20'
                            }`}
                          >
                            {t}s
                          </label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </div>

                {/* Themes Slider/Selector */}
                <div className="pt-4 border-t border-white/5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider">Themed Rounds</h4>
                      <p className="text-xs text-zinc-500">Add a specific vocabulary constraints</p>
                    </div>
                    <Switch className="data-checked:bg-neo-cyan" />
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['General', 'Countries', 'Animals', 'Cities'].map(theme => (
                      <button
                        key={theme}
                        onClick={() => setMatchConfig({ theme: theme.toLowerCase() })}
                        className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest border transition-all ${
                          matchConfig.theme === theme.toLowerCase()
                            ? 'bg-neo-purple/20 border-neo-purple text-neo-purple'
                            : 'bg-black/20 border-white/5 text-zinc-500 hover:border-white/10'
                        }`}
                      >
                        {theme}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button 
                onClick={handleStartMatch}
                className="w-full h-[60px] bg-neo-purple text-white font-black text-lg rounded-2xl shadow-[0_0_25px_rgba(124,97,255,0.3)] hover:shadow-[0_0_35px_rgba(124,97,255,0.5)] transition-all transform hover:scale-[1.02] active:scale-[0.98] border-none uppercase tracking-wider"
              >
                ENTER THE ARENA
              </Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
