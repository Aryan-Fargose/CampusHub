import React from "react";
import { UserProfile } from "@/types";
import { WorldExplorer } from "./WorldExplorer";

export interface HeroBannerProps {
  user: UserProfile;
  onExploreWorld?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  user,
  onExploreWorld,
}) => {
  return (
    <section className="relative z-20 flex flex-col items-center justify-center text-center px-4 py-4 sm:py-8 select-none">
      {/* Sub-label */}
      <span className="font-serif text-sm sm:text-base tracking-widest text-amber-200/90 mb-1">
        Welcome back,
      </span>

      {/* Dynamic User Name with Gilded Gold Serif Glow */}
      <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-[#fffbeb] via-[#fef08a] to-[#d97706] drop-shadow-[0_4px_30px_rgba(217,175,78,0.45)] mb-3">
        {user.displayName}
      </h1>

      {/* Inspirational Quote */}
      <p className="max-w-md italic font-serif text-xs sm:text-sm text-slate-300/90 mb-8 leading-relaxed">
        &ldquo;It does not do to dwell on dreams and forget to live.&rdquo;
        <span className="block not-italic text-[11px] font-mono text-amber-400/70 mt-1">
          &mdash; Albus Dumbledore
        </span>
      </p>

      {/* Interactive World Explorer CTA */}
      <div className="w-full flex justify-center">
        <WorldExplorer onExplore={onExploreWorld} />
      </div>
    </section>
  );
};
