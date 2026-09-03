"use client";

import React from "react";
import { ParallaxOffset } from "@/lib/useParallax";

interface MagicalWorldProps {
  parallax: ParallaxOffset;
}

export const MagicalWorld: React.FC<MagicalWorldProps> = ({ parallax }) => {
  // Deep Background moves minimally with mouse (1-2px)
  const bgTransform = {
    transform: `translate3d(${-parallax.x * 2}px, ${-parallax.y * 1.5}px, 0) scale(1.02)`,
    willChange: "transform",
  };

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
    >
      {/* 1. Full-screen Exact Cinematic Castle & Landscape Image */}
      <div
        className="absolute inset-[-10px] bg-cover bg-no-repeat transition-transform duration-200 ease-out"
        style={{
          ...bgTransform,
          backgroundImage: "url('/backgrounds/campus-world.jpg')",
          backgroundPosition: "center center",
        }}
      />

      {/* 2. Delicate Atmospheric Tint for Readability Behind Cards */}
      {/* Top subtle vignette */}
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#020509]/70 via-[#020509]/30 to-transparent pointer-events-none" />

      {/* Side Column Vignettes (subtle, ensures card legibility without dimming center) */}
      <div className="absolute inset-y-0 left-0 w-full sm:w-[28%] bg-gradient-to-r from-[#020509]/60 via-[#020509]/20 to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-full sm:w-[28%] bg-gradient-to-l from-[#020509]/60 via-[#020509]/20 to-transparent pointer-events-none" />

      {/* Edge Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow: "inset 0 0 120px 25px rgba(0, 0, 0, 0.65)",
        }}
      />

      {/* Bottom Subtle Gradient for Footer Bar */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#020408]/85 via-[#020408]/35 to-transparent pointer-events-none" />
    </div>
  );
};
