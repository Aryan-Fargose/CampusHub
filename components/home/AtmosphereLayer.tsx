"use client";

import React from "react";
import { ParallaxOffset } from "@/lib/useParallax";

interface AtmosphereLayerProps {
  parallax: ParallaxOffset;
}

export const AtmosphereLayer: React.FC<AtmosphereLayerProps> = ({ parallax }) => {
  // Midground layer responds moderately to parallax (2-4px)
  const midgroundTransform = {
    transform: `translate3d(${-parallax.x * 4}px, ${-parallax.y * 3}px, 0)`,
  };

  return (
    <div
      aria-hidden="true"
      style={midgroundTransform}
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none transition-transform duration-100 ease-out"
    >
      {/* 1. Deep Atmospheric Vignette & Moon Glow Haze */}
      <div className="absolute top-[5%] left-[20%] h-[350px] w-[350px] sm:h-[450px] sm:w-[450px] -translate-x-1/2 rounded-full bg-cyan-400/10 blur-[100px]" />
      
      {/* 2. Castle Spire Window Warm Lantern Glows */}
      <div className="absolute top-[25%] left-[30%] h-[200px] w-[200px] rounded-full bg-amber-500/10 blur-[80px]" />
      <div className="absolute top-[28%] right-[25%] h-[220px] w-[220px] rounded-full bg-amber-500/10 blur-[90px]" />

      {/* 3. Wand Pier / Water Center Glow */}
      <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 h-[180px] w-[320px] rounded-full bg-emerald-500/15 blur-[70px]" />

      {/* 4. Left & Right Balustrade Lantern Glows */}
      <div className="absolute bottom-[20%] left-[10%] h-32 w-32 rounded-full bg-amber-400/15 blur-[50px] animate-pulse" />
      <div className="absolute bottom-[22%] right-[12%] h-32 w-32 rounded-full bg-amber-400/15 blur-[50px] animate-pulse" />

      {/* 5. Drifting Lake Mist / Low Fog with Smooth CSS Keyframe */}
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#04080e]/90 via-[#061019]/40 to-transparent opacity-80" />
    </div>
  );
};
