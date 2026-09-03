"use client";

import React, { useState } from "react";
import { CampusQuote, ThemeId } from "@/types";
import { Volume2, VolumeX, Music, Sun, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BottomControlsProps {
  quotes: CampusQuote[];
  currentThemeId: ThemeId;
  onThemeChange: (themeId: ThemeId) => void;
  className?: string;
}

export const BottomControls: React.FC<BottomControlsProps> = ({
  quotes,
  currentThemeId,
  onThemeChange,
  className,
}) => {
  const [isPlayingMusic, setIsPlayingMusic] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);

  const currentQuote = quotes[quoteIndex] || {
    id: "default",
    text: "Happiness can be found, even in the darkest of times, if one only remembers to turn on the light.",
    author: "Albus Dumbledore",
  };

  const handleNextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % quotes.length);
  };

  const themes: ThemeId[] = ["midnight", "crimson", "emerald", "azure", "golden"];
  const cycleTheme = () => {
    const nextIdx = (themes.indexOf(currentThemeId) + 1) % themes.length;
    onThemeChange(themes[nextIdx]);
  };

  return (
    <footer
      aria-label="Campus Wisdom & Controls"
      className={cn(
        "relative z-20 w-full flex flex-col md:flex-row items-center justify-between gap-4 mt-6 select-none",
        className
      )}
    >
      {/* ======================================================================= */}
      {/* Left: 3 Glowing Circular Audio & Ambience Buttons                       */}
      {/* ======================================================================= */}
      <div className="flex items-center gap-3">
        {/* Music Note Toggle Button */}
        <button
          type="button"
          onClick={() => setIsPlayingMusic((prev) => !prev)}
          aria-label={isPlayingMusic ? "Pause music" : "Play music"}
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-full transition-all cursor-pointer focus:outline-none",
            "bg-[#040f17]/85 border shadow-[0_0_12px_rgba(0,0,0,0.8)]",
            isPlayingMusic
              ? "border-[#2dd4bf] text-[#2dd4bf] shadow-[0_0_15px_rgba(45,212,191,0.4)]"
              : "border-[#17303d] text-[#64748b] hover:text-[#94a3b8]"
          )}
        >
          <Music className="h-4 w-4" />
        </button>

        {/* Mute/Unmute Audio Button */}
        <button
          type="button"
          onClick={() => setIsMuted((prev) => !prev)}
          aria-label={isMuted ? "Unmute sound" : "Mute sound"}
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-full transition-all cursor-pointer focus:outline-none",
            "bg-[#040f17]/85 border border-[#17303d] text-[#64748b] hover:text-[#94a3b8] hover:border-[#2dd4bf]/40 shadow-[0_0_12px_rgba(0,0,0,0.8)]"
          )}
        >
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>

        {/* Theme Sun Toggle Button */}
        <button
          type="button"
          onClick={cycleTheme}
          aria-label="Cycle chamber theme"
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-full transition-all cursor-pointer focus:outline-none",
            "bg-[#040f17]/85 border border-[#17303d] text-[#64748b] hover:text-amber-300 hover:border-amber-400/50 shadow-[0_0_12px_rgba(0,0,0,0.8)]"
          )}
        >
          <Sun className="h-4 w-4" />
        </button>
      </div>

      {/* ======================================================================= */}
      {/* Center: Ornate Gothic Plaque with Wisdom Quote & DJSCE Monogram        */}
      {/* ======================================================================= */}
      <div className="flex flex-col items-center justify-center max-w-xl text-center">
        {/* Ornate Plaque Frame */}
        <div className="relative px-8 py-3 rounded-lg bg-[#030811]/75 backdrop-blur-md border border-[#16333f]/60 shadow-[0_4px_24px_rgba(0,0,0,0.85)]">
          {/* Subtle Corner Brackets */}
          <span className="absolute top-1.5 left-2 text-[10px] text-[#2dd4bf]/40">⌜</span>
          <span className="absolute top-1.5 right-2 text-[10px] text-[#2dd4bf]/40">⌝</span>
          <span className="absolute bottom-1.5 left-2 text-[10px] text-[#2dd4bf]/40">⌞</span>
          <span className="absolute bottom-1.5 right-2 text-[10px] text-[#2dd4bf]/40">⌟</span>

          <p className="font-cormorant italic text-sm sm:text-base text-[#dce7e3] leading-relaxed">
            &ldquo;{currentQuote.text}&rdquo;
          </p>
        </div>

        {/* DJSCE Monogram with Filigree Line */}
        <div className="flex items-center gap-2 mt-1.5 text-[#527983] text-[11px] font-serif tracking-[0.25em]">
          <span className="h-[1px] w-6 bg-[#21434f]" />
          <span>✦ DJSCE ✦</span>
          <span className="h-[1px] w-6 bg-[#21434f]" />
        </div>
      </div>

      {/* ======================================================================= */}
      {/* Right: Daily Quote Parchment Button                                    */}
      {/* ======================================================================= */}
      <div className="flex items-center">
        <button
          type="button"
          onClick={handleNextQuote}
          className={cn(
            "group relative inline-flex items-center gap-2.5 rounded-lg px-5 py-2.5 cursor-pointer select-none transition-all duration-300",
            "bg-gradient-to-r from-[#d9be85] via-[#e5cf9e] to-[#caa76a] text-[#1e1507]",
            "border border-[#8f6d33] hover:border-[#fef08a] shadow-[0_4px_16px_rgba(0,0,0,0.8)] hover:shadow-[0_0_20px_rgba(217,190,133,0.5)]",
            "font-cinzel text-xs font-bold tracking-wider hover:-translate-y-0.5 active:translate-y-0"
          )}
        >
          <BookOpen className="h-3.5 w-3.5 text-[#1e1507]" />
          <span>Daily Quote</span>
          <span className="text-sm group-hover:rotate-12 transition-transform">🪶</span>
        </button>
      </div>
    </footer>
  );
};
