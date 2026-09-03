"use client";

import React, { useState } from "react";
import { ArrowUpRight, Sparkles, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface WorldExplorerProps {
  onExplore?: () => void;
  className?: string;
}

export const WorldExplorer: React.FC<WorldExplorerProps> = ({
  onExplore,
  className,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center select-none",
        className
      )}
    >
      {/* Interactive Main Trigger Button */}
      <button
        type="button"
        onClick={onExplore}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsHovered(true)}
        onBlur={() => setIsHovered(false)}
        className={cn(
          "group relative inline-flex items-center gap-3 rounded-full px-6 py-3 sm:px-8 sm:py-3.5 font-serif text-sm sm:text-base tracking-wide transition-all duration-300 cursor-pointer overflow-hidden",
          "bg-[#051419]/80 hover:bg-[#071c22]/95 text-emerald-100",
          "border border-emerald-500/40 hover:border-emerald-300 shadow-[0_4px_25px_rgba(6,78,59,0.5)] hover:shadow-[0_4px_35px_rgba(16,185,129,0.6)]",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#060b13]",
          "hover:-translate-y-0.5 active:translate-y-0"
        )}
      >
        {/* Shimmering Light Sweep Animation across the button on hover */}
        <span
          aria-hidden="true"
          className={cn(
            "absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-emerald-400/25 to-transparent transition-transform duration-700 ease-out",
            isHovered && "translate-x-full"
          )}
        />

        {/* Ambient Corner Sparkle */}
        <Sparkles
          className={cn(
            "h-4 w-4 text-emerald-400 transition-all duration-300",
            isHovered ? "rotate-45 scale-125 text-amber-300" : "opacity-85"
          )}
        />

        {/* Label */}
        <span className="relative font-medium tracking-wider">
          Explore your{" "}
          <span className="text-emerald-300 font-semibold group-hover:text-amber-200 transition-colors">
            Campus World
          </span>
        </span>

        {/* Directional Animated Arrow */}
        <ArrowUpRight
          className={cn(
            "h-4 w-4 text-emerald-400 transition-transform duration-300",
            isHovered
              ? "translate-x-1 -translate-y-1 text-amber-300 scale-110"
              : "group-hover:translate-x-0.5"
          )}
        />
      </button>

      {/* Subtitle / Scroll Prompt */}
      <div className="flex flex-col items-center gap-1 mt-4 text-[11px] font-serif text-slate-400/70 tracking-widest uppercase">
        <span>Scroll to discover</span>
        <ChevronDown className="h-3.5 w-3.5 text-amber-400/60 animate-bounce" />
      </div>
    </div>
  );
};
