"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface WorldExplorerProps {
  onExplore?: () => void;
  className?: string;
}

export const WorldExplorer: React.FC<WorldExplorerProps> = ({
  onExplore,
  className,
}) => {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onExplore}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onExplore?.();
        }
      }}
      className={cn(
        "group relative flex items-center gap-2.5 cursor-pointer select-none focus:outline-none transition-transform duration-300 hover:scale-105",
        className
      )}
    >
      {/* Curved Glowing Green Arrow with Animated Directional Bounce */}
      <svg
        viewBox="0 0 100 80"
        className="w-14 h-10 text-[#48D1CC] filter drop-shadow-[0_0_8px_rgba(72,209,204,0.75)] animate-[arrowPulse_3s_ease-in-out_infinite] group-hover:scale-110 transition-transform duration-300"
        fill="none"
      >
        {/* Dashed curved arc */}
        <path
          d="M10,70 Q40,65 75,25"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeDasharray="4,4"
          strokeLinecap="round"
        />
        {/* Arrowhead pointing up-right */}
        <path
          d="M60,20 L80,22 L78,42"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Glowing Callout Badge: "Explore your Campus World" */}
      <div
        className="relative px-3.5 py-1.5 rounded-full backdrop-blur-sm transition-all duration-300 shadow-[0_0_15px_rgba(72,209,204,0.2)] group-hover:shadow-[0_0_25px_rgba(72,209,204,0.45)] group-hover:border-[#48D1CC]"
        style={{
          backgroundColor: "rgba(4, 15, 25, 0.85)",
          border: "1px dashed rgba(70, 180, 195, 0.55)",
        }}
      >
        <p className="font-cormorant italic text-xs sm:text-sm text-[#D6D9D4] leading-tight text-center">
          Explore your
        </p>
        <p className="font-cinzel text-[11px] sm:text-xs font-bold text-[#48D1CC] tracking-wider text-center drop-shadow-[0_0_8px_rgba(72,209,204,0.6)]">
          Campus World
        </p>
      </div>
    </div>
  );
};
