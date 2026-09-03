"use client";

import React from "react";
import { useParallax } from "@/lib/useParallax";
import { MagicalWorld } from "./MagicalWorld";
import { AtmosphereLayer } from "./AtmosphereLayer";
import { FloatingParticles } from "./FloatingParticles";
import { WorldExplorer } from "./WorldExplorer";

interface ParallaxSceneProps {
  onExploreWorld?: () => void;
}

export const ParallaxScene: React.FC<ParallaxSceneProps> = ({ onExploreWorld }) => {
  const parallax = useParallax();

  return (
    <>
      {/* Layer 1: Exact Cinematic Castle Landscape with Dragon & Owl in Art (z-0, z-1) */}
      <MagicalWorld parallax={parallax} />

      {/* Layer 2: Interactive Cursor Hover Fog (z-2) */}
      <AtmosphereLayer parallax={parallax} />

      {/* Layer 3: Subtle Floating Stardust & Fireflies (z-3) */}
      <FloatingParticles parallax={parallax} />

      {/* Mid-Right: Curved Dashed Green Arrow + "Explore your Campus World" (z-20) */}
      <div className="fixed top-[50%] right-[24%] sm:right-[27%] z-20 pointer-events-auto hidden lg:block">
        <WorldExplorer onExplore={onExploreWorld} />
      </div>
    </>
  );
};
