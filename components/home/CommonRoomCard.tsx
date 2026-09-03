"use client";

import React from "react";
import { CommonRoomPreview } from "@/types";
import { Gamepad2, ArrowRight } from "lucide-react";
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
          Common Room
        </h3>
      </div>

      {/* Center Presentation */}
      <div className="flex items-center gap-4 my-2">
        {/* Square Neon Rune Glyphs Box */}
        <div className="flex-shrink-0 h-14 w-14 rounded-lg bg-[#071720] border border-[#2dd4bf]/40 flex items-center justify-center p-2 group-hover:border-[#2dd4bf] group-hover:shadow-[0_0_12px_rgba(45,212,191,0.3)] transition-all">
          <div className="grid grid-cols-2 gap-1 text-[11px] font-mono text-[#2dd4bf] font-bold text-center leading-none">
            <span>✕</span>
            <span>◯</span>
            <span>✕</span>
            <span>◯</span>
          </div>
        </div>

        {/* Item Details */}
        <div className="flex flex-col">
          <h4 className="font-cinzel text-base sm:text-lg font-bold text-white group-hover:text-[#5eead4] transition-colors">
            {preview.featuredGame}
          </h4>
          <span className="text-xs text-[#7a9ba6] font-serif">
            Challenge a friend!
          </span>
        </div>
      </div>

      {/* Interactive Action Button */}
      <div className="mt-2">
        <button
          type="button"
          className="group/btn w-full flex items-center justify-center gap-2 rounded-lg py-2.5 px-4 bg-[#051119] hover:bg-[#092232] border border-[#1b3a47] hover:border-[#2dd4bf]/60 text-xs font-serif text-[#cde4eb] hover:text-white transition-all duration-200 cursor-pointer shadow-sm hover:shadow-[0_0_12px_rgba(45,212,191,0.2)]"
        >
          <Gamepad2 className="h-3.5 w-3.5 text-[#2dd4bf]" />
          <span>Play Now</span>
          <ArrowRight className="h-3.5 w-3.5 text-[#2dd4bf] transition-transform duration-200 group-hover/btn:translate-x-1" />
        </button>
      </div>
    </div>
  );
};
