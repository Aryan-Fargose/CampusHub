"use client";

import React, { useState } from "react";
import { CampusQuote } from "@/types";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

export interface QuoteBannerProps {
  quotes: CampusQuote[];
  className?: string;
}

export const QuoteBanner: React.FC<QuoteBannerProps> = ({
  quotes,
  className,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  const currentQuote = quotes[currentIndex] || quotes[0];

  const handleNextQuote = () => {
    setIsFading(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % quotes.length);
      setIsFading(false);
    }, 200);
  };

  return (
    <div
      className={cn(
        "relative flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl px-6 py-3.5 transition-all duration-300",
        "bg-[#040810]/80 border border-amber-500/30 hover:border-amber-400/50 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.7)]",
        className
      )}
    >
      {/* Ornate Corner Pins */}
      <span className="absolute top-2 left-2 text-[10px] text-amber-400/60 select-none">✦</span>
      <span className="absolute top-2 right-2 text-[10px] text-amber-400/60 select-none">✦</span>
      <span className="absolute bottom-2 left-2 text-[10px] text-amber-400/60 select-none">✦</span>
      <span className="absolute bottom-2 right-2 text-[10px] text-amber-400/60 select-none">✦</span>

      {/* Quote Content */}
      <div
        className={cn(
          "flex-1 text-center sm:text-left transition-opacity duration-200 px-2",
          isFading ? "opacity-0" : "opacity-100"
        )}
      >
        <p className="font-serif text-xs sm:text-sm italic text-amber-100/90 leading-relaxed">
          &ldquo;{currentQuote.text}&rdquo;
        </p>
        <span className="block text-[11px] font-mono text-amber-400/70 mt-0.5">
          &mdash; {currentQuote.author}
          {currentQuote.source && (
            <span className="text-slate-400"> &bull; {currentQuote.source}</span>
          )}
        </span>
      </div>

      {/* Daily Quote Changer Button */}
      <button
        type="button"
        onClick={handleNextQuote}
        className="group inline-flex items-center gap-2 rounded-xl px-4 py-2 bg-[#0a121e] hover:bg-[#121e30] border border-amber-500/30 hover:border-amber-400/60 text-xs font-serif text-amber-200 transition-all duration-200 cursor-pointer shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 select-none flex-shrink-0"
      >
        <span>Daily Quote</span>
        <RefreshCw className="h-3 w-3 text-amber-400 transition-transform duration-500 group-hover:rotate-180" />
      </button>
    </div>
  );
};
