"use client";

import React, { useState } from "react";
import { ThemeId } from "@/types";
import { chamberThemes } from "@/lib/themes";
import { Volume2, VolumeX, Sparkles } from "lucide-react";
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
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(65);

  const toggleSound = () => {
    setIsPlaying((prev) => !prev);
  };

  return (
    <aside
      aria-label="Chamber Ambience & Theme Controls"
      className={cn(
        "relative mx-auto flex flex-wrap items-center justify-between gap-4 rounded-2xl p-4 sm:px-6 transition-all duration-300",
        "bg-[#040812]/80 backdrop-blur-md border border-amber-500/25 shadow-[0_4px_24px_rgba(0,0,0,0.6)]",
        className
      )}
    >
      {/* Left: Audio Ambience Controls */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggleSound}
          aria-label={isPlaying ? "Mute ambient castle sounds" : "Play ambient castle sounds"}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-xl border transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400",
            isPlaying
              ? "bg-amber-950/60 border-amber-400 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.3)]"
              : "bg-slate-900/70 border-slate-700/60 text-slate-400 hover:text-slate-200"
          )}
        >
          {isPlaying ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        </button>

        <div className="flex flex-col">
          <span className="font-cinzel text-xs font-bold text-slate-200 flex items-center gap-1.5">
            <span>Castle Whispers</span>
            {isPlaying && (
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            )}
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            {isPlaying ? `Volume ${volume}%` : "Muted"}
          </span>
        </div>

        {isPlaying && (
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            aria-label="Ambient audio volume"
            className="w-20 accent-amber-400 h-1 bg-slate-800 rounded-lg cursor-pointer"
          />
        )}
      </div>

      {/* Right: Chamber Theme Switcher */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 text-xs text-amber-300/80 mr-1">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          <span className="hidden sm:inline font-cinzel text-xs">Chamber:</span>
        </div>

        <div className="flex items-center gap-1.5">
          {chamberThemes.map((theme) => {
            const isSelected = currentThemeId === theme.id;
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => onThemeChange(theme.id)}
                title={theme.name}
                aria-label={`Select ${theme.name} chamber theme`}
                className={cn(
                  "relative flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs font-cinzel transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400",
                  isSelected
                    ? "bg-slate-900/90 text-amber-200 border border-amber-400/80 shadow-[0_0_10px_rgba(245,158,11,0.2)] font-bold"
                    : "bg-slate-950/40 text-slate-400 border border-slate-800/80 hover:text-slate-200 hover:border-slate-700"
                )}
              >
                <span>{theme.icon}</span>
                <span className="hidden md:inline">{theme.name}</span>
                {isSelected && (
                  <span className="h-1 w-1 rounded-full bg-amber-400 shadow-[0_0_4px_#fde047]" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
