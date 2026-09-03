"use client";

import React from "react";
import { ParallaxOffset } from "@/lib/useParallax";

interface MagicalWorldProps {
  parallax: ParallaxOffset;
}

export const MagicalWorld: React.FC<MagicalWorldProps> = ({ parallax }) => {
  // Deep background layer moves very subtly (1-2px)
  const bgTransform = {
    transform: `translate3d(${-parallax.x * 2}px, ${-parallax.y * 1.5}px, 0)`,
  };

  return (
    <div
      aria-hidden="true"
      style={bgTransform}
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none transition-transform duration-150 ease-out"
    >
      {/* 1. Base Sky Gradient: Deep Obsidian, Navy Twilight, Lake Deep */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#03060a] via-[#071018] to-[#04080e]" />

      {/* 2. Realistic Luminous Moon & Crater Layers */}
      <div className="absolute top-[6%] left-[20%] sm:left-[22%] -translate-x-1/2">
        {/* Soft Moon Halo */}
        <div className="absolute -inset-10 rounded-full bg-slate-100/10 blur-[40px]" />
        
        {/* Moon Sphere */}
        <div className="relative h-28 w-28 sm:h-36 sm:w-36 rounded-full bg-gradient-to-br from-[#f8fafc] via-[#e2e8f0] to-[#94a3b8] shadow-[0_0_60px_rgba(226,232,240,0.4)] opacity-95">
          {/* Craters */}
          <div className="absolute top-5 left-6 h-6 w-6 rounded-full bg-slate-400/25 blur-[1.5px]" />
          <div className="absolute top-12 left-14 h-9 w-9 rounded-full bg-slate-500/20 blur-[2px]" />
          <div className="absolute bottom-6 left-8 h-5 w-7 rounded-full bg-slate-400/25 blur-[1px]" />
        </div>

        {/* Ambient Moonlit Cloud Veils */}
        <div className="absolute top-12 -left-16 w-56 h-12 rounded-full bg-[#0a1420]/75 blur-[16px]" />
        <div className="absolute -top-4 left-8 w-48 h-10 rounded-full bg-[#0a1420]/70 blur-[14px]" />
      </div>

      {/* 3. Majestic Magical Academy Castle Spire Silhouette */}
      <div className="absolute bottom-[20%] inset-x-0 flex justify-center items-end opacity-95">
        <svg
          viewBox="0 0 1440 600"
          className="w-full h-auto max-h-[60vh] text-[#060c14] drop-shadow-[0_0_40px_rgba(0,0,0,0.9)]"
          preserveAspectRatio="xMidYMax meet"
          fill="currentColor"
        >
          {/* Distant Mountain Ridges */}
          <path d="M0,480 Q320,380 600,440 T1200,400 L1440,430 L1440,600 L0,600 Z" opacity="0.6" />

          {/* Left Wing Citadel Towers */}
          <path d="M220,600 L220,320 L240,290 L260,320 L260,600 Z" />
          <path d="M260,600 L260,260 L280,230 L300,260 L300,600 Z" />
          <path d="M300,600 L300,200 L320,160 L335,120 L350,160 L370,200 L370,600 Z" />
          <path d="M370,600 L370,240 L390,210 L410,240 L410,600 Z" />
          <path d="M200,600 L200,380 L440,380 L440,600 Z" />

          {/* Central Grand Spires */}
          <path d="M500,600 L500,280 L520,240 L540,280 L540,600 Z" />
          <path d="M680,600 L680,180 L705,130 L720,60 L735,130 L760,180 L760,600 Z" />
          <path d="M760,600 L760,220 L785,180 L810,220 L810,600 Z" />

          {/* Right Wing Citadel Spires */}
          <path d="M1020,600 L1020,230 L1040,190 L1055,140 L1070,190 L1090,230 L1090,600 Z" />
          <path d="M1090,600 L1090,280 L1110,250 L1130,280 L1130,600 Z" />
          <path d="M1130,600 L1130,320 L1150,290 L1170,320 L1170,600 Z" />
          <path d="M1000,600 L1000,370 L1200,370 L1200,600 Z" />

          {/* Golden Candlelit Windows across the Castle */}
          {/* Left Wing Windows */}
          <circle cx="280" cy="280" r="3" fill="#fef08a" className="animate-pulse" />
          <circle cx="335" cy="220" r="3.5" fill="#fed7aa" />
          <circle cx="335" cy="260" r="3" fill="#fef08a" />
          <circle cx="335" cy="300" r="3" fill="#fde047" />
          <circle cx="390" cy="270" r="2.5" fill="#fef08a" />

          {/* Center High Spire Windows */}
          <circle cx="720" cy="180" r="4" fill="#fde047" className="animate-pulse" />
          <circle cx="720" cy="230" r="3.5" fill="#fef08a" />
          <circle cx="720" cy="280" r="3.5" fill="#fed7aa" />
          <circle cx="785" cy="240" r="3" fill="#fef08a" />

          {/* Right Wing Windows */}
          <circle cx="1055" cy="210" r="3.5" fill="#fde047" className="animate-pulse" />
          <circle cx="1055" cy="260" r="3" fill="#fef08a" />
          <circle cx="1110" cy="300" r="3" fill="#fed7aa" />
        </svg>
      </div>

      {/* 4. Soaring Grand Owl with Golden Stardust Trail (Center Top) */}
      <div className="absolute top-[14%] sm:top-[12%] left-1/2 -translate-x-1/2 w-48 sm:w-64 flex flex-col items-center z-10">
        {/* Golden Stardust Trail Sparkles */}
        <div className="relative w-full h-12">
          <svg viewBox="0 0 200 40" className="w-full h-full">
            <path
              d="M20,20 Q60,35 100,20 T180,25"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="1.5"
              strokeDasharray="3,5"
              opacity="0.6"
            />
            {/* Trail embers */}
            <circle cx="35" cy="22" r="2" fill="#fde047" className="animate-ping" />
            <circle cx="75" cy="28" r="1.5" fill="#fef08a" />
            <circle cx="120" cy="18" r="2" fill="#f59e0b" />
            <circle cx="160" cy="24" r="2.5" fill="#fde047" className="animate-pulse" />
          </svg>
        </div>

        {/* Detailed Flying Owl Silhouette */}
        <svg
          viewBox="0 0 120 70"
          className="w-20 h-12 sm:w-24 sm:h-14 text-[#94a3b8] drop-shadow-[0_2px_12px_rgba(251,191,36,0.3)] animate-[float_6s_ease-in-out_infinite]"
          fill="currentColor"
        >
          {/* Owl Wingspan */}
          <path d="M60,35 C42,15 18,10 0,22 C18,34 42,36 54,40 C50,48 54,58 60,64 C66,58 70,48 66,40 C78,36 102,34 120,22 C102,10 78,15 60,35 Z" />
          {/* Owl Eyes Glow */}
          <circle cx="56" cy="35" r="1.5" fill="#fde047" />
          <circle cx="64" cy="35" r="1.5" fill="#fde047" />
        </svg>
      </div>

      {/* 5. Reflective Dark Lake & Foreground Pier Balustrades */}
      <div className="absolute bottom-0 inset-x-0 h-[38vh] flex items-end">
        {/* Lake Water Gradient with subtle water ripple glimmers */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#020508] via-[#040a12] to-transparent opacity-95">
          {/* Moon Reflection in Water */}
          <div className="absolute top-2 left-[20%] sm:left-[22%] -translate-x-1/2 w-16 h-40 bg-gradient-to-b from-slate-200/20 via-slate-300/10 to-transparent blur-[12px]" />
          {/* Wand Emerald Glow Reflection in Water */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-36 h-28 bg-gradient-to-t from-emerald-400/20 via-emerald-500/10 to-transparent blur-[20px]" />
        </div>

        {/* Stone Pier, Balustrades & Lanterns */}
        <svg
          viewBox="0 0 1440 240"
          className="w-full h-full text-[#020509] relative z-10"
          preserveAspectRatio="none"
          fill="currentColor"
        >
          {/* Left Stone Balustrade */}
          <path d="M0,120 L280,150 L280,240 L0,240 Z" />
          {/* Right Stone Balustrade */}
          <path d="M1160,150 L1440,120 L1440,240 L1160,240 Z" />
          {/* Center Pier Promontory */}
          <path d="M520,240 L600,160 L840,160 L920,240 Z" />
        </svg>

        {/* Left Stone Lantern on Balustrade */}
        <div className="absolute bottom-[16%] left-[18%] sm:left-[20%] flex flex-col items-center z-20">
          <div className="h-4 w-4 rounded-full bg-amber-400 shadow-[0_0_20px_#fbbf24] animate-pulse" />
          <div className="h-6 w-3 bg-[#0a0f16] border border-amber-500/40 rounded-sm mt-0.5" />
        </div>

        {/* Right Stone Lantern on Balustrade */}
        <div className="absolute bottom-[16%] right-[18%] sm:right-[20%] flex flex-col items-center z-20">
          <div className="h-4 w-4 rounded-full bg-amber-400 shadow-[0_0_20px_#fbbf24] animate-pulse" />
          <div className="h-6 w-3 bg-[#0a0f16] border border-amber-500/40 rounded-sm mt-0.5" />
        </div>

        {/* 6. Hooded Wizard / Scholar with Illuminated Wand at the Pier Center */}
        <div className="absolute bottom-[4%] left-1/2 -translate-x-1/2 w-48 h-56 flex flex-col items-center justify-end z-20 pointer-events-none">
          {/* Glowing Wand Flare & Light Flare */}
          <div className="relative flex items-center justify-center">
            {/* Emerald/Gold Wand Radiance Flare */}
            <div className="absolute -top-14 -right-8 h-16 w-16 rounded-full bg-emerald-400/50 blur-xl animate-pulse" />
            <div className="absolute -top-12 -right-6 h-5 w-5 rounded-full bg-emerald-300 shadow-[0_0_25px_#34d399,0_0_50px_#10b981]" />
            <div className="absolute -top-11 -right-5 h-2 w-2 rounded-full bg-white shadow-[0_0_10px_#ffffff]" />

            {/* Cloaked Scholar Silhouette */}
            <svg
              viewBox="0 0 120 180"
              className="w-32 h-44 text-[#010306] drop-shadow-[0_8px_20px_rgba(0,0,0,0.95)]"
              fill="currentColor"
            >
              {/* Hooded Cowl */}
              <path d="M60,20 C48,20 42,32 42,45 C42,56 50,66 60,66 C70,66 78,56 78,45 C78,32 72,20 60,20 Z" />
              {/* Flowing Robe & Sleeves */}
              <path d="M42,56 C30,75 24,125 18,180 L102,180 C96,125 90,75 78,56 Z" />
              {/* Arm & Wand Pointer */}
              <path d="M72,68 Q88,56 98,46 L102,42 L98,40 Q84,52 70,62 Z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
