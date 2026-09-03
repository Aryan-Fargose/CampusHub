"use client";

import React from "react";
import { ParallaxOffset } from "@/lib/useParallax";

export interface AtmosphereLayerProps {
  parallax?: ParallaxOffset;
}

export const AtmosphereLayer: React.FC<AtmosphereLayerProps> = ({
  parallax = { x: 0, y: 0 },
}) => {
  // Pure magical green wand flare & glowing illumination — NO fog, NO mist, NO haze
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[2] overflow-hidden select-none"
    >
      {/* Gentle Wand Light Glow at Wizard Location */}
      <div
        style={{
          transform: `translate3d(${-parallax.x * 10}px, ${-parallax.y * 6}px, 0)`,
          top: "48%",
          left: "51%",
        }}
        className="absolute -translate-x-1/2 -translate-y-1/2 h-28 w-28 rounded-full bg-[#10b981]/15 filter blur-xl animate-[wandPulse_4s_ease-in-out_infinite]"
      />
      {/* Concentrated glowing spark at the wand tip */}
      <div
        style={{
          transform: `translate3d(${-parallax.x * 10}px, ${-parallax.y * 6}px, 0)`,
          top: "48%",
          left: "51%",
        }}
        className="absolute -translate-x-1/2 -translate-y-1/2 h-3.5 w-3.5 rounded-full bg-[#6ee7b7] filter blur-[1px] shadow-[0_0_16px_#10b981] animate-[wandPulse_2.5s_ease-in-out_infinite]"
      />
    </div>
  );
};
