"use client";

import React from "react";
import { CanteenPick } from "@/types";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CanteenCardProps {
  canteenPick: CanteenPick;
  className?: string;
}

export const CanteenCard: React.FC<CanteenCardProps> = ({
  canteenPick,
  className,
}) => {
  return (
    <div
      id="canteen-preview"
      tabIndex={0}
      role="region"
      aria-label="Canteen Pick of the Day"
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
          Canteen Pick
        </h3>
      </div>

      {/* Dish Presentation Row */}
      <div className="flex items-center gap-4 my-2">
        {/* Circular Platter Frame */}
        <div className="relative flex-shrink-0 h-16 w-16 sm:h-18 sm:w-18 rounded-full bg-gradient-to-b from-[#182725] to-[#0a1214] border border-[#2dd4bf]/40 flex items-center justify-center p-2 shadow-inner group-hover:border-[#2dd4bf] transition-all">
          <span className="text-3xl filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)] group-hover:scale-110 transition-transform">
            🌯
          </span>
        </div>

        {/* Item Details */}
        <div className="flex flex-col">
          <h4 className="font-cinzel text-base sm:text-lg font-bold text-white group-hover:text-amber-200 transition-colors">
            {canteenPick.itemName}
          </h4>
          <span className="text-xs text-[#7a9ba6] font-cormorant italic">
            {canteenPick.canteenName}
          </span>
        </div>
      </div>

      {/* Footer Metrics */}
      <div className="mt-2 pt-2 border-t border-[#132832] flex items-center justify-between text-xs text-[#9bb3ba]">
        <div className="flex items-center gap-1.5 text-[#34d399]">
          <Heart className="h-3.5 w-3.5 fill-[#34d399] text-[#34d399]" />
          <span className="font-semibold text-xs">{canteenPick.rating}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[#34d399] text-xs font-serif">
          <span>•</span>
          <span>Most Favorited</span>
        </div>
      </div>
    </div>
  );
};
