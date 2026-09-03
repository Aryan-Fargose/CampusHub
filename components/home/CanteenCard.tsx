"use client";

import React from "react";
import { CanteenPick } from "@/types";
import { Heart, Sparkles } from "lucide-react";
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
        "group relative flex flex-col justify-between rounded-2xl p-5 sm:p-6 transition-all duration-300",
        "bg-[#050c14]/75 hover:bg-[#081522]/85 backdrop-blur-lg",
        "border border-amber-500/25 hover:border-amber-400/60 shadow-[0_8px_32px_rgba(0,0,0,0.6)] hover:shadow-[0_8px_32px_rgba(245,158,11,0.2)]",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400",
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
      <div className="mb-3">
        <h3 className="font-serif text-[11px] sm:text-xs uppercase tracking-widest text-amber-200/90 group-hover:text-amber-100 transition-colors">
          Canteen Pick
        </h3>
      </div>

      {/* Food Presentation Row */}
      <div className="flex items-center gap-4 my-2">
        {/* Stylized Dish Thumbnail Box */}
        <div className="relative flex-shrink-0 h-16 w-16 sm:h-20 sm:w-20 rounded-xl bg-gradient-to-br from-[#1c1206] via-[#100b03] to-[#080502] border border-amber-500/40 flex items-center justify-center p-2 shadow-inner group-hover:border-amber-400/70 transition-all">
          <span className="text-3xl sm:text-4xl filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] group-hover:scale-110 transition-transform">
            🌯
          </span>
          <span className="absolute -bottom-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/20 border border-amber-400/50 text-[10px] text-amber-300 shadow-sm">
            ✨
          </span>
        </div>

        {/* Item Details */}
        <div className="flex flex-col">
          <h4 className="font-serif text-base sm:text-lg font-semibold text-white group-hover:text-amber-200 transition-colors">
            {canteenPick.itemName}
          </h4>
          <span className="text-xs text-slate-400 font-mono">
            {canteenPick.canteenName}
          </span>
          {canteenPick.price && (
            <span className="text-sm font-bold text-amber-400 font-mono mt-0.5">
              {canteenPick.price}
            </span>
          )}
        </div>
      </div>

      {/* Footer Metrics */}
      <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-1.5 text-emerald-400">
          <Heart className="h-3.5 w-3.5 fill-emerald-400 text-emerald-400" />
          <span className="font-semibold">{canteenPick.rating}</span>
        </div>
        <span className="text-slate-500">•</span>
        <div className="flex items-center gap-1.5 text-amber-300/90 font-mono text-[11px]">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          <span>{canteenPick.tag}</span>
        </div>
      </div>
    </div>
  );
};
