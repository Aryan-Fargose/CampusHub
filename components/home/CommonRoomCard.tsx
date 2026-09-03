"use client";

import React from "react";
import { CommonRoomPreview } from "@/types";
import { ArrowRight, Gamepad2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CommonRoomCardProps {
  preview: CommonRoomPreview;
  className?: string;
}

export const CommonRoomCard: React.FC<CommonRoomCardProps> = ({
  preview,
  className,
}) => {
  return (
    <div
      id="commonroom-preview"
      tabIndex={0}
      role="region"
      aria-label="Common Room Mini Games"
      className={cn(
        "group relative flex flex-col justify-between rounded-2xl p-5 sm:p-6 transition-all duration-300",
        "bg-[#050c14]/75 hover:bg-[#081522]/85 backdrop-blur-lg",
        "border border-amber-500/25 hover:border-emerald-400/60 shadow-[0_8px_32px_rgba(0,0,0,0.6)] hover:shadow-[0_8px_32px_rgba(16,185,129,0.25)]",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400",
        "hover:-translate-y-1.5 active:translate-y-0",
        className
      )}
    >
      {/* Corner Pins */}
      <span className="absolute top-2.5 left-2.5 text-[11px] text-amber-400/50 group-hover:text-amber-300 select-none transition-colors">✦</span>
      <span className="absolute top-2.5 right-2.5 text-[11px] text-amber-400/50 group-hover:text-amber-300 select-none transition-colors">✦</span>
      <span className="absolute bottom-2.5 left-2.5 text-[11px] text-amber-400/50 group-hover:text-amber-300 select-none transition-colors">✦</span>
      <span className="absolute bottom-2.5 right-2.5 text-[11px] text-amber-400/50 group-hover:text-amber-300 select-none transition-colors">✦</span>

      {/* Title */}
      <div className="mb-2 text-center">
        <h3 className="font-serif text-[11px] sm:text-xs uppercase tracking-widest text-amber-200/90 group-hover:text-amber-100 transition-colors">
          Common Room
        </h3>
      </div>

      {/* Neon Tic-Tac-Toe Rune Grid & Info */}
      <div className="flex items-center gap-4 my-2">
        {/* Glowing Emerald Rune Grid */}
        <div className="relative flex-shrink-0 grid grid-cols-2 gap-1.5 p-2 rounded-xl bg-emerald-950/50 border border-emerald-500/40 group-hover:border-emerald-400/80 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all shadow-inner">
          <div className="h-5 w-5 rounded bg-emerald-900/60 flex items-center justify-center text-xs text-emerald-300 font-mono font-bold shadow-sm">
            ✕
          </div>
          <div className="h-5 w-5 rounded bg-emerald-900/60 flex items-center justify-center text-xs text-emerald-300 font-mono font-bold shadow-sm">
            ○
          </div>
          <div className="h-5 w-5 rounded bg-emerald-900/60 flex items-center justify-center text-xs text-emerald-300 font-mono font-bold shadow-sm">
            ✕
          </div>
          <div className="h-5 w-5 rounded bg-emerald-900/60 flex items-center justify-center text-xs text-emerald-300 font-mono font-bold shadow-sm">
            ○
          </div>
        </div>

        {/* Game Details */}
        <div className="flex flex-col">
          <h4 className="font-serif text-base sm:text-lg font-semibold text-white group-hover:text-emerald-300 transition-colors">
            {preview.featuredGame}
          </h4>
          <span className="text-xs text-slate-400 font-serif">
            {preview.subtitle}
          </span>
        </div>
      </div>

      {/* Interactive Action Button */}
      <div className="mt-3">
        <button
          type="button"
          className="group/btn w-full flex items-center justify-center gap-2 rounded-xl py-2.5 px-4 bg-[#08101a] hover:bg-[#0e1b2c] border border-amber-500/30 hover:border-emerald-400/70 text-xs font-serif text-amber-200/90 hover:text-amber-100 transition-all duration-200 cursor-pointer shadow-md hover:shadow-[0_0_15px_rgba(16,185,129,0.25)]"
        >
          <Gamepad2 className="h-3.5 w-3.5 text-amber-400" />
          <span>Play Now</span>
          <ArrowRight className="h-3.5 w-3.5 text-amber-400 transition-transform duration-200 group-hover/btn:translate-x-1" />
        </button>
      </div>
    </div>
  );
};
