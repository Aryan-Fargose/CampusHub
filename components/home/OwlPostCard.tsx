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
        "group relative flex flex-col justify-between rounded-xl p-5 sm:p-6 transition-all duration-300 select-none",
        "bg-[#030912]/80 hover:bg-[#05111c]/90 backdrop-blur-md",
        "border border-[#1a3843]/70 hover:border-[#2dd4bf]/60 shadow-[0_8px_32px_rgba(0,0,0,0.85)] hover:shadow-[0_8px_32px_rgba(45,212,191,0.25)]",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2dd4bf]",
        "hover:-translate-y-1 active:translate-y-0",
        className
      )}
    >
      {/* Ornate Corner Fantasy Brackets */}
      <span className="absolute top-2 left-2 text-[10px] text-[#2dd4bf]/40 group-hover:text-[#2dd4bf] select-none transition-colors">⌜</span>
      <span className="absolute top-2 right-2 text-[10px] text-[#2dd4bf]/40 group-hover:text-[#2dd4bf] select-none transition-colors">⌝</span>
      <span className="absolute bottom-2 left-2 text-[10px] text-[#2dd4bf]/40 group-hover:text-[#2dd4bf] select-none transition-colors">⌞</span>
      <span className="absolute bottom-2 right-2 text-[10px] text-[#2dd4bf]/40 group-hover:text-[#2dd4bf] select-none transition-colors">⌟</span>

      {/* Title */}
      <div className="mb-2 text-center">
        <h3 className="font-cinzel text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#93bcc4] group-hover:text-[#cceef4] transition-colors">
          Owl Post
        </h3>
      </div>

      {/* Center Presentation */}
      <div className="flex items-center gap-4 my-2">
        {/* Circular Wings Badge */}
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#081720] border border-[#2dd4bf]/40 text-[#2dd4bf] group-hover:border-[#2dd4bf] group-hover:shadow-[0_0_15px_rgba(45,212,191,0.3)] transition-all">
          <Feather className="h-6 w-6 text-[#2dd4bf]" />
        </div>

        {/* Count & Label */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-cinzel text-3xl sm:text-4xl font-bold text-white drop-shadow-md">
              {summary.unreadCount}
            </span>
            <span className="h-2 w-2 rounded-full bg-[#2dd4bf] shadow-[0_0_8px_#2dd4bf] animate-pulse" />
          </div>
          <span className="text-xs text-[#7a9ba6] font-serif">
            New Confessions
          </span>
        </div>
      </div>

      {/* Interactive Action Button */}
      <div className="mt-2">
        <button
          type="button"
          className="group/btn w-full flex items-center justify-center gap-2 rounded-lg py-2.5 px-4 bg-[#051119] hover:bg-[#092232] border border-[#1b3a47] hover:border-[#2dd4bf]/60 text-xs font-serif text-[#cde4eb] hover:text-white transition-all duration-200 cursor-pointer shadow-sm hover:shadow-[0_0_12px_rgba(45,212,191,0.2)]"
        >
          <span className="text-[#2dd4bf] text-sm">🪶</span>
          <span>Read Now</span>
          <ArrowRight className="h-3.5 w-3.5 text-[#2dd4bf] transition-transform duration-200 group-hover/btn:translate-x-1" />
        </button>
      </div>
    </div>
  );
};
