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
        "group relative flex flex-col justify-between rounded-xl p-3.5 sm:p-4 select-none",
        "backdrop-blur-md transition-all duration-300 ease-out",
        "shadow-[0_6px_24px_rgba(0,0,0,0.8)] hover:shadow-[0_12px_32px_rgba(72,209,204,0.28)]",
        "hover:-translate-y-1.5 active:translate-y-0 cursor-pointer",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#48D1CC]",
        className
      )}
      style={{
        backgroundColor: "rgba(4, 15, 25, 0.88)",
        border: "1px solid rgba(70, 180, 195, 0.35)",
      }}
    >
      {/* Ornate Corner Fantasy Brackets */}
      <span className="absolute top-1.5 left-2 text-[9px] text-[#48D1CC]/50 group-hover:text-[#48D1CC] group-hover:scale-110 select-none transition-all duration-300">⌜</span>
      <span className="absolute top-1.5 right-2 text-[9px] text-[#48D1CC]/50 group-hover:text-[#48D1CC] group-hover:scale-110 select-none transition-all duration-300">⌝</span>
      <span className="absolute bottom-1.5 left-2 text-[9px] text-[#48D1CC]/50 group-hover:text-[#48D1CC] group-hover:scale-110 select-none transition-all duration-300">⌞</span>
      <span className="absolute bottom-1.5 right-2 text-[9px] text-[#48D1CC]/50 group-hover:text-[#48D1CC] group-hover:scale-110 select-none transition-all duration-300">⌟</span>

      {/* Title */}
      <div className="mb-1 text-center">
        <h3 className="font-cinzel text-[10px] font-bold uppercase tracking-[0.2em] text-[#AFC3CF] group-hover:text-white transition-colors duration-300">
          Owl Post
        </h3>
      </div>

      {/* Center Presentation */}
      <div className="flex items-center gap-3 my-1.5">
        {/* Circular Wings Badge with hover glow */}
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#07151e] border border-[#48D1CC]/40 text-[#48D1CC] group-hover:border-[#48D1CC] group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(72,209,204,0.4)] transition-all duration-300">
          <Feather className="h-4.5 w-4.5 text-[#48D1CC] group-hover:rotate-12 transition-transform duration-300" />
        </div>

        {/* Count & Label */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-cinzel text-2xl font-bold text-[#D6D9D4] group-hover:scale-105 transition-transform duration-300 drop-shadow-sm">
              {summary.unreadCount}
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#48D1CC] shadow-[0_0_6px_#48D1CC] animate-pulse" />
          </div>
          <span className="text-[11px] text-[#9BA9AF] font-serif leading-tight">
            New Confessions
          </span>
        </div>
      </div>

      {/* Interactive Action Button */}
      <div className="mt-1">
        <button
          type="button"
          className="group/btn w-full flex items-center justify-center gap-2 rounded-lg py-1.5 px-3 bg-[#051119] hover:bg-[#0c2637] border border-[#1b3a47] hover:border-[#48D1CC]/80 text-[11px] font-serif text-[#D6D9D4] hover:text-white transition-all duration-200 cursor-pointer shadow-sm hover:shadow-[0_0_12px_rgba(72,209,204,0.3)]"
        >
          <span className="text-[#48D1CC] text-xs transition-transform duration-200 group-hover/btn:rotate-12">🪶</span>
          <span>Read Now</span>
          <ArrowRight className="h-3 w-3 text-[#48D1CC] transition-transform duration-200 group-hover/btn:translate-x-1" />
        </button>
      </div>
    </div>
  );
};
