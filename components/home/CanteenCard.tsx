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
          Canteen Pick
        </h3>
      </div>

      {/* Dish Presentation Row */}
      <div className="flex items-center gap-3 my-1.5">
        {/* Circular Platter Frame with dynamic hover scale and glow */}
        <div className="relative flex-shrink-0 h-12 w-12 sm:h-13 sm:w-13 rounded-full bg-gradient-to-b from-[#142323] to-[#070f12] border border-[#48D1CC]/40 flex items-center justify-center p-1.5 shadow-inner group-hover:border-[#48D1CC] group-hover:scale-105 group-hover:shadow-[0_0_12px_rgba(72,209,204,0.35)] transition-all duration-300">
          <span className="text-2xl filter drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] group-hover:scale-115 group-hover:rotate-6 transition-transform duration-300">
            🌯
          </span>
        </div>

        {/* Item Details */}
        <div className="flex flex-col">
          <h4 className="font-cinzel text-sm sm:text-base font-bold text-[#D6D9D4] group-hover:text-[#F6E6AE] transition-colors duration-300">
            {canteenPick.itemName}
          </h4>
          <span className="text-[11px] text-[#9BA9AF] font-cormorant italic leading-tight">
            {canteenPick.canteenName}
          </span>
        </div>
      </div>

      {/* Footer Metrics */}
      <div className="mt-1 pt-1.5 border-t border-[#132832]/60 flex items-center justify-between text-[11px] text-[#9BA9AF]">
        <div className="flex items-center gap-1 text-[#48D1CC]">
          <Heart className="h-3 w-3 fill-[#48D1CC] text-[#48D1CC] group-hover:scale-110 transition-transform duration-300" />
          <span className="font-semibold text-[11px]">{canteenPick.rating}</span>
        </div>
        <div className="flex items-center gap-1 text-[#48D1CC] text-[11px] font-serif">
          <span>•</span>
          <span>Most Favorited</span>
        </div>
      </div>
    </div>
  );
};
