"use client";

import React, { useSyncExternalStore } from "react";

function subscribeReducedMotion(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function subscribeVisibility(callback: () => void) {
  if (typeof document === "undefined") return () => {};
  document.addEventListener("visibilitychange", callback);
  return () => document.removeEventListener("visibilitychange", callback);
}

function getVisibilitySnapshot() {
  if (typeof document === "undefined") return true;
  return document.visibilityState === "visible";
}

export const BackgroundAtmosphere: React.FC = () => {
  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    () => false
  );

  const isVisible = useSyncExternalStore(
    subscribeVisibility,
    getVisibilitySnapshot,
    () => true
  );

  const shouldAnimate = !prefersReducedMotion && isVisible;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
    >
      {/* 1. Base Sky Gradient: Deep Indigo, Midnight Teal, Obsidian */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#05080e] via-[#09121a] to-[#04080c]" />

      {/* 2. Moonlight Radial Glow */}
      <div className="absolute top-[8%] left-[18%] sm:left-[22%] h-[320px] w-[320px] sm:h-[420px] sm:w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-100/10 blur-[90px]" />
      
      {/* The Luminous Moon */}
      <div className="absolute top-[6%] left-[18%] sm:left-[20%] h-24 w-24 sm:h-32 sm:w-32 -translate-x-1/2 rounded-full bg-gradient-to-br from-[#f8fafc] via-[#e2e8f0] to-[#94a3b8] shadow-[0_0_50px_rgba(241,245,249,0.35)] opacity-90">
        {/* Subtle Moon Crater textures */}
        <div className="absolute top-4 left-5 h-5 w-5 rounded-full bg-slate-300/30 blur-[1px]" />
        <div className="absolute top-10 left-12 h-8 w-8 rounded-full bg-slate-400/20 blur-[2px]" />
        <div className="absolute bottom-5 left-8 h-4 w-6 rounded-full bg-slate-400/25 blur-[1px]" />
      </div>

      {/* 3. Distant Mountain & Cloud Silhouettes */}
      <svg
        className="absolute bottom-0 w-full h-[65vh] text-[#050c13]/90 opacity-95"
        preserveAspectRatio="none"
        viewBox="0 0 1440 600"
        fill="currentColor"
      >
        <path d="M0,450 C320,380 420,320 720,390 C1020,460 1180,360 1440,410 L1440,600 L0,600 Z" />
      </svg>

      {/* 4. Magical Castle Spire Silhouette */}
      <div className="absolute bottom-[18%] left-1/2 -translate-x-1/2 w-full max-w-4xl h-[45vh] flex justify-center items-end opacity-90">
        <svg
          viewBox="0 0 800 400"
          className="w-full h-full text-[#080f18] drop-shadow-[0_0_25px_rgba(0,0,0,0.8)]"
          preserveAspectRatio="xMidYMax meet"
          fill="currentColor"
        >
          {/* Main Citadel Towers */}
          <path d="M260,400 L260,260 L280,240 L300,260 L300,400 Z" />
          <path d="M300,400 L300,210 L315,180 L330,150 L345,180 L360,210 L360,400 Z" />
          {/* Central High Spire */}
          <path d="M360,400 L360,160 L385,120 L395,60 L405,120 L430,160 L430,400 Z" />
          {/* Right Spires */}
          <path d="M430,400 L430,220 L445,190 L460,220 L460,400 Z" />
          <path d="M460,400 L460,250 L480,230 L500,250 L500,400 Z" />
          <path d="M500,400 L500,280 L520,260 L540,280 L540,400 Z" />
          {/* Left Wing */}
          <path d="M200,400 L200,300 L220,280 L240,300 L240,400 Z" />
          {/* Connecting Bastion walls */}
          <path d="M180,400 L180,340 L580,340 L580,400 Z" />

          {/* Tiny glowing castle window specks */}
          <circle cx="395" cy="180" r="2.5" fill="#fef08a" className="animate-pulse" />
          <circle cx="330" cy="220" r="2" fill="#fef08a" />
          <circle cx="445" cy="240" r="2" fill="#fef08a" />
          <circle cx="380" cy="260" r="2" fill="#fef08a" />
          <circle cx="410" cy="260" r="2" fill="#fef08a" />
          <circle cx="300" cy="360" r="2" fill="#fef08a" />
          <circle cx="500" cy="360" r="2" fill="#fef08a" />
        </svg>
      </div>

      {/* 5. Mystical Flying Creature / Owl Silhouette */}
      <div
        className={`absolute top-[16%] right-[12%] sm:right-[18%] w-16 h-10 sm:w-20 sm:h-12 text-slate-400/70 ${
          shouldAnimate ? "animate-[float_8s_ease-in-out_infinite]" : ""
        }`}
      >
        <svg viewBox="0 0 100 60" fill="currentColor" className="w-full h-full drop-shadow-md">
          {/* Owl Wings & Body silhouette */}
          <path d="M50,30 C35,15 15,10 0,20 C15,30 35,32 45,35 C42,42 45,50 50,55 C55,50 58,42 55,35 C65,32 85,30 100,20 C85,10 65,15 50,30 Z" />
        </svg>
      </div>

      {/* 6. Foreground Cliffs & Trees Silhouette */}
      <div className="absolute bottom-0 w-full h-[40vh] flex items-end">
        <svg
          viewBox="0 0 1440 320"
          className="w-full h-full text-[#03060a]"
          preserveAspectRatio="none"
          fill="currentColor"
        >
          <path d="M0,220 C180,180 320,240 500,200 C680,160 760,260 920,220 C1100,180 1280,240 1440,190 L1440,320 L0,320 Z" />
        </svg>
      </div>

      {/* 7. Wand Bearer / Stargazer Silhouette on Central Promontory */}
      <div className="absolute bottom-[2%] sm:bottom-[3%] left-1/2 -translate-x-1/2 w-48 h-56 flex flex-col items-center justify-end z-10 pointer-events-none">
        {/* Wand Magic Glow & Flare */}
        <div className="relative flex items-center justify-center">
          <div className="absolute -top-12 -right-6 h-12 w-12 rounded-full bg-emerald-400/40 blur-lg animate-pulse" />
          <div className="absolute -top-10 -right-4 h-4 w-4 rounded-full bg-emerald-300 shadow-[0_0_15px_#34d399]" />

          {/* Stargazer Cloaked Figure Silhouette */}
          <svg
            viewBox="0 0 120 180"
            className="w-28 h-40 text-[#020407] drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]"
            fill="currentColor"
          >
            {/* Hooded Head */}
            <path d="M60,25 C50,25 45,35 45,45 C45,55 52,65 60,65 C68,65 75,55 75,45 C75,35 70,25 60,25 Z" />
            {/* Flowing Cloak & Body */}
            <path d="M45,55 C35,70 30,120 25,180 L95,180 C90,120 85,70 75,55 Z" />
            {/* Extended Arm Holding Wand */}
            <path d="M70,65 Q85,55 95,45 L98,42 L95,40 Q82,50 68,60 Z" />
          </svg>
        </div>
      </div>

      {/* 8. Layered Drifting Mist / Fog (Hardware Accelerated) */}
      <div
        className={`absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-[#04080e]/95 via-[#060e17]/50 to-transparent pointer-events-none ${
          shouldAnimate ? "animate-[pulse_9s_ease-in-out_infinite]" : ""
        }`}
      />

      {/* 9. Floating Mystical Embers / Stars */}
      <div className="absolute inset-0">
        <div className="absolute top-[25%] left-[30%] h-1.5 w-1.5 rounded-full bg-amber-300/80 shadow-[0_0_8px_#fde047] animate-ping duration-1000" />
        <div className="absolute top-[40%] right-[25%] h-1 w-1 rounded-full bg-emerald-300/80 shadow-[0_0_8px_#6ee7b7] animate-pulse" />
        <div className="absolute top-[35%] left-[45%] h-1.5 w-1.5 rounded-full bg-amber-200/60 shadow-[0_0_6px_#fef08a]" />
        <div className="absolute top-[18%] left-[65%] h-1 w-1 rounded-full bg-cyan-300/70 shadow-[0_0_6px_#67e8f9] animate-pulse" />
        <div className="absolute top-[55%] left-[20%] h-1.5 w-1.5 rounded-full bg-emerald-400/60 shadow-[0_0_8px_#34d399]" />
        <div className="absolute top-[50%] right-[32%] h-1 w-1 rounded-full bg-amber-300/70 shadow-[0_0_6px_#fde047]" />
      </div>

      {/* 10. Ambient Emerald & Golden Corner Vignettes */}
      <div className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-emerald-950/20 blur-[100px]" />
      <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-amber-950/20 blur-[100px]" />
    </div>
  );
};
