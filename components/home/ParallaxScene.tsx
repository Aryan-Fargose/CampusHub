"use client";

import React from "react";
import { useParallax } from "@/lib/useParallax";
import { MagicalWorld } from "./MagicalWorld";
import { AtmosphereLayer } from "./AtmosphereLayer";
import { FloatingParticles } from "./FloatingParticles";

export const ParallaxScene: React.FC = () => {
  const parallax = useParallax();

  return (
    <>
      {/* Layer 1: Deep Magical World (1-2px movement) */}
      <MagicalWorld parallax={parallax} />

      {/* Layer 2: Atmosphere, Lantern Halos & Mist (2-4px movement) */}
      <AtmosphereLayer parallax={parallax} />

      {/* Layer 3: Floating Golden/Emerald Star Particles (6-12px movement) */}
      <FloatingParticles parallax={parallax} />
    </>
  );
};
