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
        "group relative flex items-center gap-3 cursor-pointer select-none focus:outline-none",
        className
      )}
    >
      {/* Curved Glowing Green Arrow with Dashed Trail */}
      <svg
        viewBox="0 0 100 80"
        className="w-16 h-12 text-[#34d399] filter drop-shadow-[0_0_8px_#34d399] group-hover:scale-110 transition-transform duration-300"
        fill="none"
      >
        {/* Dashed curved arc */}
        <path
          d="M10,70 Q40,65 75,25"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeDasharray="4,4"
          strokeLinecap="round"
        />
        {/* Arrowhead pointing up-right */}
        <path
          d="M60,20 L80,22 L78,42"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Glowing Callout Text: "Explore your Campus World" */}
      <div className="relative px-3 py-1.5 rounded-full border border-dashed border-[#2dd4bf]/40 bg-[#04151b]/40 backdrop-blur-sm group-hover:border-[#2dd4bf] group-hover:bg-[#062029]/60 transition-all duration-300 shadow-[0_0_15px_rgba(45,212,191,0.15)] group-hover:shadow-[0_0_25px_rgba(45,212,191,0.35)]">
        <p className="font-cormorant italic text-sm sm:text-base text-[#e2e8f0] leading-tight text-center">
          Explore your
        </p>
        <p className="font-cinzel text-xs sm:text-sm font-bold text-[#5eead4] tracking-wider text-center drop-shadow-[0_0_8px_#2dd4bf]">
          Campus World
        </p>
      </div>
    </div>
  );
};
