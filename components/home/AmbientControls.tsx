"use client";

import React, { useState } from "react";
import { Music, Volume2, VolumeX, Sparkles, ChevronDown, Wand2, Zap } from "lucide-react";
import { ACADEMY_THEMES } from "@/lib/themes";
import { ThemeId } from "@/types";
import { cn } from "@/lib/utils";

export interface AmbientControlsProps {
  currentThemeId: ThemeId;
  onThemeChange: (themeId: ThemeId) => void;
  className?: string;
}

export const AmbientControls: React.FC<AmbientControlsProps> = ({
  currentThemeId,
  onThemeChange,
  className,
}) => {
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [spellCast, setSpellCast] = useState(false);

  const handleCastSpell = () => {
    setSpellCast(true);
    setTimeout(() => setSpellCast(false), 2000);
  };

  return (
    <div
      className={cn(
        "relative z-20 flex flex-col items-center justify-between gap-4 select-none w-full",
        className
      )}
    >
      {/* Spellcast feedback toast */}
      {spellCast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 rounded-full bg-amber-950/90 border border-amber-400 px-5 py-2 text-xs font-serif text-amber-200 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
          ⚡ Lumos Maxima! The Academy spires glow brighter.
        </div>
      )}

      {/* Main Bottom Controls Bar */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 px-2 sm:px-6">
        {/* Left Quick Spell Trigger */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleCastSpell}
            aria-label="Cast Lumos quick spell"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#08101a]/80 hover:bg-amber-950/60 border border-amber-500/40 hover:border-amber-400 text-amber-300 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-[0_0_15px_rgba(251,191,36,0.5)] focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            <Zap className="h-4 w-4" />
          </button>
        </div>

        {/* Center: Music, Mute, and Chamber Theme Selector */}
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {/* Ambient Sound Toggle */}
          <button
            type="button"
            aria-label={isPlayingMusic ? "Pause ambient melody" : "Play ambient melody"}
            onClick={() => setIsPlayingMusic((prev) => !prev)}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-xl border transition-all duration-200 cursor-pointer shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400",
              isPlayingMusic
                ? "bg-emerald-950/80 border-emerald-400/60 text-emerald-300 shadow-[0_0_12px_#34d399]"
                : "bg-[#060c14]/80 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
            )}
          >
            <Music className={cn("h-4 w-4", isPlayingMusic && "animate-bounce")} />
          </button>

          {/* Volume / Mute Toggle */}
          <button
            type="button"
            aria-label={isMuted ? "Unmute audio" : "Mute audio"}
            onClick={() => setIsMuted((prev) => !prev)}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-xl border transition-all duration-200 cursor-pointer shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400",
              isMuted
                ? "bg-red-950/60 border-red-500/40 text-red-300"
                : "bg-[#060c14]/80 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
            )}
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </button>

          {/* Chamber Theme Dropdown Trigger */}
          <div className="relative">
            <button
              type="button"
              aria-label="Switch Common Room Chamber theme"
              onClick={() => setShowThemeModal((prev) => !prev)}
              className="flex items-center gap-2 rounded-xl px-4 h-9 bg-[#060c14]/80 hover:bg-[#0c1420] border border-amber-500/30 hover:border-amber-400/60 text-xs font-serif text-amber-200 transition-all duration-200 cursor-pointer shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span className="text-slate-400">Chamber Theme:</span>
              <span className="font-semibold text-emerald-300">
                {ACADEMY_THEMES[currentThemeId].name}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>

            {/* Chamber Themes Popover */}
            {showThemeModal && (
              <div className="absolute bottom-11 left-1/2 -translate-x-1/2 w-64 rounded-2xl bg-[#060b13] border border-amber-500/40 p-2.5 shadow-2xl backdrop-blur-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="text-[11px] font-mono text-amber-300/80 px-2 pb-2 border-b border-slate-800 mb-1 flex items-center justify-between">
                  <span>Select Chamber Theme</span>
                  <span className="text-[10px] text-slate-500">5 Themes</span>
                </div>
                <div className="space-y-1">
                  {(Object.keys(ACADEMY_THEMES) as ThemeId[]).map((id) => {
                    const theme = ACADEMY_THEMES[id];
                    const isSelected = id === currentThemeId;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => {
                          onThemeChange(id);
                          setShowThemeModal(false);
                        }}
                        className={cn(
                          "w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-serif transition-all duration-150 cursor-pointer text-left",
                          isSelected
                            ? "bg-amber-950/60 text-amber-200 border border-amber-500/40"
                            : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <span>{theme.icon}</span>
                          <div>
                            <p className="font-semibold">{theme.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono">
                              {theme.subtitle}
                            </p>
                          </div>
                        </div>
                        {isSelected && (
                          <span className="text-amber-400 text-xs">✓</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Wand Cursor Hint */}
        <div className="flex items-center gap-2 text-xs font-serif text-slate-400/80 select-none">
          <Wand2 className="h-3.5 w-3.5 text-amber-400/70" />
          <div className="flex flex-col text-right">
            <span className="text-[11px] text-amber-200/90 leading-tight">Move your wand</span>
            <span className="text-[10px] text-slate-400/70 leading-tight">Explore the magic</span>
          </div>
        </div>
      </div>

      {/* Academy Motto */}
      <div className="text-center font-mono text-[11px] text-slate-400/80 tracking-widest uppercase pb-2">
        <span className="text-amber-500/80">✦</span> DJSCE{" "}
        <span className="text-amber-500/80">✦</span>
        <span className="block text-[10px] text-slate-400 lowercase tracking-normal font-serif mt-0.5">
          dream. learn. belong.
        </span>
      </div>
    </div>
  );
};
