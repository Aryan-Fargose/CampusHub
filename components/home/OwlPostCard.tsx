"use client";

import React from "react";
import { OwlPostSummary } from "@/types";
import { ArrowRight, Feather } from "lucide-react";
import { cn } from "@/lib/utils";

export interface OwlPostCardProps {
  summary: OwlPostSummary;
  className?: string;
}

export const OwlPostCard: React.FC<OwlPostCardProps> = ({
  summary,
  className,
}) => {
  return (
    <div
      id="owlpost-preview"
      tabIndex={0}
      role="region"
      aria-label="Owl Post Confessions"
      className={cn(
        "group relative flex flex-col justify-between rounded-2xl p-5 sm:p-6 transition-all duration-300",
        "bg-[#050c14]/75 hover:bg-[#081522]/85 backdrop-blur-lg",
        "border border-amber-500/25 hover:border-indigo-400/60 shadow-[0_8px_32px_rgba(0,0,0,0.6)] hover:shadow-[0_8px_32px_rgba(99,102,241,0.25)]",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400",
        "hover:-translate-y-1.5 active:translate-y-0",
        className
      )}
    >
      {/* Corner Pins */}
      <span className="absolute top-2.5 left-2.5 text-[11px] text-amber-400/50 group-hover:text-amber-300 select-none transition-colors">✦</span>
      <span className="absolute top-2.5 right-2.5 text-[11px] text-amber-400/50 group-hover:text-amber-300 select-none transition-colors">✦</span>
      <span className="absolute bottom-2.5 left-2.5 text-[11px] text-amber-400/50 group-hover:text-amber-300 select-none transition-colors">✦</span>
      <span className="absolute bottom-2.5 right-2.5 text-[11px] text-amber-400/50 group-hover:text-amber-300 select-none transition-colors">✦</span>

      {/* Tiny Perched Owl Silhouette in Corner */}
      <span className="absolute -top-3.5 right-4 text-base select-none filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
        🦉
      </span>

      {/* Title */}
      <div className="mb-2 text-center">
        <h3 className="font-serif text-[11px] sm:text-xs uppercase tracking-widest text-amber-200/90 group-hover:text-amber-100 transition-colors">
          Owl Post
        </h3>
      </div>

      {/* Center Count & Icon */}
      <div className="flex flex-col items-center justify-center my-2 text-center">
        {/* Feather Emblem */}
        <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-950/60 border border-indigo-500/40 text-indigo-300 group-hover:scale-105 group-hover:border-indigo-400/70 group-hover:shadow-[0_0_15px_rgba(99,102,241,0.4)] transition-all shadow-md">
          <Feather className="h-6 w-6 text-indigo-300" />
        </div>

        {/* Count & Label */}
        <div className="flex items-baseline gap-2">
          <span className="font-serif text-4xl font-bold tracking-tight text-white group-hover:text-amber-200 transition-colors drop-shadow-md">
            {summary.unreadCount}
          </span>
          <span className="text-[10px] uppercase tracking-widest text-slate-400 font-mono">
            New Confessions
          </span>
        </div>
      </div>

      {/* Interactive Action Button */}
      <div className="mt-3">
        <button
          type="button"
          className="group/btn w-full flex items-center justify-center gap-2 rounded-xl py-2.5 px-4 bg-[#08101a] hover:bg-[#0e1b2c] border border-amber-500/30 hover:border-amber-400/70 text-xs font-serif text-amber-200/90 hover:text-amber-100 transition-all duration-200 cursor-pointer shadow-md hover:shadow-[0_0_15px_rgba(245,158,11,0.25)]"
        >
          <span className="text-amber-400 text-sm">🪶</span>
          <span>Read Now</span>
          <ArrowRight className="h-3.5 w-3.5 text-amber-400 transition-transform duration-200 group-hover/btn:translate-x-1" />
        </button>
      </div>
    </div>
  );
};
