"use client";

import React, { useState } from "react";
import { CampusQuote, ThemeId } from "@/types";
import { Volume2, VolumeX, Music, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCampusMusic } from "@/components/music/CampusMusicContext";

export interface BottomControlsProps {
  quotes: CampusQuote[];
  currentThemeId?: ThemeId;
  onThemeChange?: (themeId: ThemeId) => void;
  onOpenMusic?: () => void;
  isMusicActive?: boolean;
  className?: string;
}

export const BottomControls: React.FC<BottomControlsProps> = ({
  quotes,
  onOpenMusic,
  isMusicActive: propIsMusicActive,
  className,
}) => {
  const {
    isOpen,
    isMinimized,
    togglePlayer,
    isMuted,
    toggleMute,
  } = useCampusMusic();

  const [quoteIndex, setQuoteIndex] = useState(0);

  const currentQuote = quotes[quoteIndex] || {
    id: "default",
    text: "Happiness can be found, even in the darkest of times, if one only remembers to turn on the light.",
    author: "Albus Dumbledore",
  };

  const handleNextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % quotes.length);
  };

  const isMusicActive = propIsMusicActive ?? (isOpen && !isMinimized);

  const handleMusicClick = () => {
    togglePlayer();
    if (onOpenMusic) {
      onOpenMusic();
    }
  };

  return (
    <footer
      aria-label="Campus Wisdom & Controls"
      className={cn(
        "relative z-20 w-full flex flex-col md:flex-row items-center justify-between gap-3 mt-4 select-none",
        className
      )}
    >
      {/* Left: 2 Useful Audio Controls (Music button & Speaker/Volume button - Sun/Light button removed) */}
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={handleMusicClick}
          title="Campus Music"
          aria-label={isMusicActive ? "Campus Music player open" : "Open Campus Music player"}
          className={cn(
            "group relative flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200 cursor-pointer focus:outline-none hover:scale-110 active:scale-95",
            "shadow-[0_0_12px_rgba(0,0,0,0.8)]",
            isMusicActive
              ? "border border-[#48D1CC] text-[#48D1CC] shadow-[0_0_14px_rgba(72,209,204,0.45)]"
              : "border border-[#17303d] text-[#64748b] hover:text-[#94a3b8]"
          )}
          style={{ backgroundColor: "rgba(4, 15, 25, 0.88)" }}
        >
          <Music className={cn("h-3.5 w-3.5", isMusicActive && "animate-pulse")} />
        </button>

        <button
          type="button"
          onClick={toggleMute}
          title={isMuted ? "Unmute audio" : "Mute audio"}
          aria-label={isMuted ? "Unmute sound" : "Mute sound"}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200 cursor-pointer focus:outline-none hover:scale-110 active:scale-95",
            isMuted
              ? "border border-amber-500/60 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.3)]"
              : "border border-[#17303d] text-[#64748b] hover:text-[#D6D9D4] hover:border-[#48D1CC]/70 shadow-[0_0_12px_rgba(0,0,0,0.8)] hover:shadow-[0_0_14px_rgba(72,209,204,0.35)]"
          )}
          style={{ backgroundColor: "rgba(4, 15, 25, 0.88)" }}
        >
          {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
        </button>
      </div>

      {/* Center: Ornate Gothic Plaque with Wisdom Quote & DJSCE Monogram */}
      <div className="flex flex-col items-center justify-center max-w-lg text-center">
        <div
          className="relative px-6 py-2 rounded-lg backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.8)] transition-all duration-300 hover:shadow-[0_0_20px_rgba(72,209,204,0.2)]"
          style={{
            backgroundColor: "rgba(4, 15, 25, 0.88)",
            border: "1px solid rgba(70, 180, 195, 0.35)",
          }}
        >
          {/* Subtle Corner Brackets */}
          <span className="absolute top-1 left-1.5 text-[9px] text-[#48D1CC]/40">⌜</span>
          <span className="absolute top-1 right-1.5 text-[9px] text-[#48D1CC]/40">⌝</span>
          <span className="absolute bottom-1 left-1.5 text-[9px] text-[#48D1CC]/40">⌞</span>
          <span className="absolute bottom-1 right-1.5 text-[9px] text-[#48D1CC]/40">⌟</span>

          <p className="font-cormorant italic text-xs sm:text-sm text-[#D6D9D4] leading-relaxed transition-opacity duration-300">
            &ldquo;{currentQuote.text}&rdquo;
          </p>
        </div>

        {/* DJSCE Monogram with Filigree Line */}
        <div className="flex items-center gap-2 mt-1 text-[#9BA9AF] text-[10px] font-serif tracking-[0.25em]">
          <span className="h-[1px] w-5 bg-[#21434f]" />
          <span>✦ DJSCE ✦</span>
          <span className="h-[1px] w-5 bg-[#21434f]" />
        </div>
      </div>

      {/* Right: Daily Quote Button with Smooth Hover Lift & Quill Spin */}
      <div className="flex items-center">
        <button
          type="button"
          onClick={handleNextQuote}
          className={cn(
            "group relative inline-flex items-center gap-2 rounded-lg px-4 py-2 cursor-pointer select-none transition-all duration-300",
            "bg-gradient-to-r from-[#d9be85] via-[#e5cf9e] to-[#caa76a] text-[#1e1507]",
            "border border-[#8f6d33] hover:border-[#fef08a] shadow-[0_4px_14px_rgba(0,0,0,0.8)] hover:shadow-[0_0_24px_rgba(231,197,109,0.55)]",
            "font-cinzel text-[11px] font-bold tracking-wider hover:-translate-y-1 active:translate-y-0 active:scale-95"
          )}
        >
          <BookOpen className="h-3 w-3 text-[#1e1507]" />
          <span>Daily Quote</span>
          <span className="text-xs group-hover:rotate-180 transition-transform duration-500">🪶</span>
        </button>
      </div>
    </footer>
  );
};
