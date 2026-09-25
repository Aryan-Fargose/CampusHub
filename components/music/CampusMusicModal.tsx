"use client";

import React, { useEffect, useRef } from "react";
import { CampusMusicPlayer } from "./CampusMusicPlayer";
import { Music, Maximize2, X } from "lucide-react";
import { animate } from "animejs";
import { cn } from "@/lib/utils";
import { useCampusMusic } from "./CampusMusicContext";

const YouTubeIcon: React.FC<{ className?: string }> = ({ className = "w-3 h-3" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

export interface CampusMusicModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  openTrigger?: number;
}

export const CampusMusicModal: React.FC<CampusMusicModalProps> = ({
  isOpen: propIsOpen,
  onClose: propOnClose,
}) => {
  const {
    isOpen: contextIsOpen,
    isMinimized,
    expandPlayer,
    minimizePlayer,
    closePlayer,
    provider,
  } = useCampusMusic();

  const isOpen = propIsOpen ?? contextIsOpen;
  const onClose = propOnClose ?? closePlayer;

  const modalContentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      try {
        if (modalContentRef.current) {
          animate(modalContentRef.current, {
            scale: [0.94, 1],
            opacity: [0, 1],
            translateY: [12, 0],
            duration: 280,
            easing: "easeOutCubic",
          });
        }
      } catch {
        // Safe fallback
      }
    }
  }, [isOpen, isMinimized]);

  // Handle ESC key to minimize rather than destroy
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isMinimized) {
        minimizePlayer();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isMinimized, minimizePlayer]);

  if (!isOpen) return null;

  return (
    <>
      {/* 1. Minimized Floating Audio Dock Pill (20-25% Smaller Footprint) */}
      {isMinimized && (
        <aside
          aria-label="Campus Music Active Player Dock"
          className="fixed top-16 sm:top-20 right-4 sm:right-8 z-50 flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-[#030e16]/95 border border-[#48D1CC]/70 shadow-[0_0_18px_rgba(72,209,204,0.35)] backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200 select-none"
        >
          <div
            className={cn(
              "flex h-6 w-6 items-center justify-center rounded-full border",
              provider === "youtube"
                ? "bg-[#250d0d] border-[#ff4d4d] text-[#ff6b6b]"
                : "bg-[#082218] border-[#1DB954] text-[#1DB954]"
            )}
          >
            {provider === "youtube" ? (
              <YouTubeIcon className="w-3 h-3 text-[#ff6b6b]" />
            ) : (
              <Music className="w-3 h-3 animate-pulse text-[#1DB954]" />
            )}
          </div>

          <div
            className="flex flex-col pr-0.5 cursor-pointer"
            onClick={expandPlayer}
          >
            <span className="font-cinzel text-[11px] font-bold text-[#f1ede4] flex items-center gap-1.5 leading-tight">
              <span>CAMPUS MUSIC</span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#48D1CC] animate-ping" />
            </span>
            <span className="text-[9px] text-[#80949F] font-serif leading-tight">
              Click to summon controls
            </span>
          </div>

          {/* Expand to Modal Button */}
          <button
            type="button"
            onClick={expandPlayer}
            title="Expand Campus Music controls"
            aria-label="Expand player"
            className="p-0.5 rounded-md hover:bg-[#071c2b] text-[#AFC3CF] hover:text-[#48D1CC] transition-colors cursor-pointer"
          >
            <Maximize2 className="w-3 h-3" />
          </button>

          {/* Close completely */}
          <button
            type="button"
            onClick={onClose}
            title="Close music player"
            aria-label="Close music player"
            className="p-0.5 rounded-md hover:bg-red-950/60 text-[#80949F] hover:text-red-400 transition-colors cursor-pointer"
          >
            <X className="w-3 h-3" />
          </button>
        </aside>
      )}

      {/* 2. Persistent Player Container (Never unmounted when minimized) */}
      <div
        role="dialog"
        aria-modal="true"
        aria-hidden={isMinimized}
        aria-labelledby="campus-music-modal-title"
        className={cn(
          "fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 transition-all duration-300 overflow-y-auto",
          isMinimized
            ? "opacity-0 pointer-events-none -z-10 scale-95"
            : "opacity-100 pointer-events-auto bg-black/80 backdrop-blur-md"
        )}
        onClick={(e) => {
          // Clicking outer backdrop minimizes the player rather than stopping it
          if (e.target === e.currentTarget) {
            minimizePlayer();
          }
        }}
      >
        <div
          ref={modalContentRef}
          className="relative w-full max-w-xl my-auto will-change-transform"
        >
          <CampusMusicPlayer
            variant="modal"
            onClose={onClose}
            onMinimize={minimizePlayer}
          />
        </div>
      </div>
    </>
  );
};
