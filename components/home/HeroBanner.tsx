"use client";

import React from "react";
import { UserProfile } from "@/types";

export interface HeroBannerProps {
  user: UserProfile;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ user }) => {
  const isGuestUser = user.displayName?.toLowerCase() === "guest" || user.id?.startsWith("guest_");

  return (
    <section className="relative z-20 flex flex-col items-center justify-center text-center px-4 py-1 sm:py-3 select-none">
      {/* Subtitle */}
      <span className="font-cormorant italic text-lg sm:text-xl text-[#D6D9D4] mb-0.5 drop-shadow-sm">
        {isGuestUser ? "Welcome to CampusHub," : "Welcome back,"}
      </span>

      {/* Majestic Gilded Golden Name - Exactly Matching OWL POST's Cinzel Decorative Font */}
      <h1
        className="font-cinzel text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold uppercase tracking-[0.18em] text-transparent bg-clip-text bg-gradient-to-b from-[#F6E6AE] via-[#E7C56D] to-[#9A6A1F] drop-shadow-[0_4px_22px_rgba(231,197,109,0.38)] hover:drop-shadow-[0_6px_28px_rgba(231,197,109,0.55)] transition-all duration-300 my-1 cursor-default"
        style={{
          fontFamily: 'var(--font-cinzel), "Cinzel Decorative", serif',
        }}
      >
        {isGuestUser ? "GUEST EXPLORER" : user.displayName}
      </h1>

      {/* Delicate Glowing Star with Animated Twinkle and Horizontal Ray Lines */}
      <div className="flex items-center justify-center gap-3 my-1.5">
        <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#48D1CC]/70" />
        <span className="text-[#48D1CC] text-xs drop-shadow-[0_0_8px_#48D1CC] animate-[starTwinkle_3s_ease-in-out_infinite]">
          ✦
        </span>
        <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#48D1CC]/70" />
      </div>

      {/* Inspirational Quote */}
      <p className="max-w-lg font-cormorant italic text-sm sm:text-base text-[#D6D9D4] mt-0.5 leading-relaxed drop-shadow-sm">
        &ldquo;It does not do to dwell on dreams and forget to live.&rdquo;
        <span className="block not-italic text-xs font-serif text-[#9BA9AF] mt-1">
          &mdash; Albus Dumbledore
        </span>
      </p>
    </section>
  );
};
