"use client";

import React, { useState } from "react";
import { CampusQuote } from "@/types";
import { Sparkles, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

export interface QuoteBannerProps {
  quotes: CampusQuote[];
  className?: string;
}

export const QuoteBanner: React.FC<QuoteBannerProps> = ({
  quotes,
  className,
}) => {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isRotating, setIsRotating] = useState(false);

  const currentQuote = quotes[quoteIndex] || {
    id: "default",
    text: "Words are, in my not-so-humble opinion, our most inexhaustible source of magic.",
    author: "Albus Dumbledore",
  };

  const handleNextQuote = () => {
    setIsRotating(true);
    setTimeout(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
      setIsRotating(false);
    }, 200);
  };

  return (
    <div
      tabIndex={0}
      role="region"
      aria-label="Daily Magical Wisdom"
      className={cn(
        "relative mx-auto flex items-center justify-between gap-4 rounded-2xl px-5 py-3.5 sm:px-6 sm:py-4 transition-all duration-300",
        "bg-[#040812]/80 backdrop-blur-md border border-amber-500/25 shadow-[0_4px_24px_rgba(0,0,0,0.6)]",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400",
        className
      )}
    >
      <div className="flex items-center gap-3.5 overflow-hidden">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-amber-950/50 border border-amber-500/40 text-amber-400 shadow-sm">
          <Sparkles className="h-4 w-4" />
        </div>

        <div className={cn("transition-opacity duration-200", isRotating ? "opacity-0" : "opacity-100")}>
          <p className="font-cormorant italic text-sm sm:text-base text-amber-100/90 leading-snug">
            &ldquo;{currentQuote.text}&rdquo;
          </p>
          <span className="text-[11px] font-cinzel text-amber-400/80 tracking-wider">
            &mdash; {currentQuote.author}
          </span>
        </div>
      </div>

      <button
        type="button"
        aria-label="Show another quote"
        onClick={handleNextQuote}
        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-slate-900/60 border border-slate-700/60 text-slate-400 hover:text-amber-300 hover:border-amber-400/60 hover:bg-slate-800 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 cursor-pointer"
      >
        <RefreshCw className={cn("h-3.5 w-3.5 transition-transform", isRotating ? "animate-spin" : "")} />
      </button>
    </div>
  );
};
