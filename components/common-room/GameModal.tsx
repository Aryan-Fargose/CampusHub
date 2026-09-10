"use client";

import React, { useEffect, useRef } from "react";
import { ArrowLeft, X, Sparkles } from "lucide-react";
import { GameStationConfig } from "@/lib/gamesConfig";
import { XandOGame } from "./games/XandOGame";
import { MatchCreaturesGame } from "./games/MatchCreaturesGame";
import { DinoRunGame } from "./games/DinoRunGame";
import { animate } from "animejs";

interface GameModalProps {
  game: GameStationConfig | null;
  onClose: () => void;
}

export const GameModal: React.FC<GameModalProps> = ({ game, onClose }) => {
  const modalContentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (game) {
      // Prevent body scroll behind modal
      document.body.style.overflow = "hidden";

      try {
        if (modalContentRef.current) {
          animate(modalContentRef.current, {
            scale: [0.92, 1],
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 380,
            easing: "easeOutCubic",
          });
        }
      } catch {
        // Safe fallback
      }
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [game]);

  if (!game) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="game-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-300 overflow-y-auto"
    >
      <div
        ref={modalContentRef}
        className="relative w-full max-w-3xl my-auto rounded-2xl bg-gradient-to-b from-[#061822]/95 via-[#030e16]/95 to-[#02070b]/98 border-2 border-[#48D1CC]/40 p-4 sm:p-7 shadow-[0_0_50px_rgba(4,21,32,0.9),0_0_25px_rgba(72,209,204,0.3)] will-change-transform"
      >
        {/* Ornate Fantasy Corner Brackets */}
        <span className="absolute top-2 left-2.5 text-xs text-[#E7C56D]/70 select-none">
          ⌜✦
        </span>
        <span className="absolute top-2 right-2.5 text-xs text-[#E7C56D]/70 select-none">
          ✦⌝
        </span>
        <span className="absolute bottom-2 left-2.5 text-xs text-[#E7C56D]/70 select-none">
          ⌞✦
        </span>
        <span className="absolute bottom-2 right-2.5 text-xs text-[#E7C56D]/70 select-none">
          ✦⌟
        </span>

        {/* Modal Top Bar */}
        <div className="flex items-center justify-between gap-4 pb-4 mb-5 border-b border-[#142e3b]">
          {/* Back to Common Room Button */}
          <button
            type="button"
            onClick={onClose}
            className="group flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#04131d] hover:bg-[#0a2638] border border-[#1b3a47] hover:border-[#48D1CC]/80 text-xs font-serif text-[#D6D9D4] hover:text-white transition-all duration-200 cursor-pointer shadow-sm hover:shadow-[0_0_12px_rgba(72,209,204,0.3)]"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#48D1CC] transition-transform duration-200 group-hover:-translate-x-1" />
            <span className="font-cinzel text-[11px] font-semibold tracking-wider">
              Return to Common Room
            </span>
          </button>

          {/* Game Title Plaque */}
          <div className="text-center hidden sm:block">
            <div className="flex items-center justify-center gap-1.5 text-[10px] font-cinzel text-[#E7C56D] uppercase tracking-[0.2em]">
              <Sparkles className="w-3 h-3" />
              <span>{game.stationName}</span>
            </div>
            <h2
              id="game-modal-title"
              className="font-cinzel text-lg font-bold text-[#f1ede4] tracking-wide"
            >
              {game.title}
            </h2>
          </div>

          {/* Close Icon Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Game"
            className="p-1.5 rounded-lg bg-[#04131d] hover:bg-[#0a2638] border border-[#1b3a47] hover:border-[#ef4444]/60 text-[#80949F] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Render Selected Game */}
        <div className="py-2">
          {game.id === "x-and-o" && <XandOGame />}
          {game.id === "match-creatures" && <MatchCreaturesGame />}
          {game.id === "dino-run" && <DinoRunGame />}
        </div>
      </div>
    </div>
  );
};
