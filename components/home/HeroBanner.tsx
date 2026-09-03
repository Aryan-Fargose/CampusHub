import React from "react";
import { UserProfile } from "@/types";

export interface HeroBannerProps {
  user: UserProfile;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ user }) => {
  return (
    <section className="relative z-20 flex flex-col items-center justify-center text-center px-4 py-2 sm:py-4 select-none">
      {/* Subtitle */}
      <span className="font-cormorant italic text-lg sm:text-2xl text-[#dbe5e1] mb-1 drop-shadow-md">
        Welcome back,
      </span>

      {/* Majestic Gilded Golden Name */}
      <h1 className="font-cinzel text-6xl sm:text-7xl md:text-8xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-b from-[#fff7d6] via-[#e5be65] to-[#8d691e] drop-shadow-[0_6px_35px_rgba(229,190,101,0.55)] my-1">
        {user.displayName}
      </h1>

      {/* Delicate Glowing Star with Horizontal Ray Lines */}
      <div className="flex items-center justify-center gap-3 my-2">
        <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#2dd4bf]/80" />
        <span className="text-[#2dd4bf] text-sm drop-shadow-[0_0_10px_#2dd4bf]">✦</span>
        <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#2dd4bf]/80" />
      </div>

      {/* Inspirational Quote */}
      <p className="max-w-lg font-cormorant italic text-sm sm:text-base text-[#cadad4] mt-1 leading-relaxed drop-shadow-sm">
        &ldquo;It does not do to dwell on dreams and forget to live.&rdquo;
        <span className="block not-italic text-xs font-serif text-[#7e9ea0] mt-1">
          &mdash; Albus Dumbledore
        </span>
      </p>
    </section>
  );
};
