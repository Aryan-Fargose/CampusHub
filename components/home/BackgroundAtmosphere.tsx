"use client";

import React from "react";
import { ParallaxScene } from "./ParallaxScene";

/**
 * BackgroundAtmosphere
 * Clean top-level atmosphere container orchestrating:
 * - Layer 1: Full-screen cinematic castle world & dark overlays (z-0, z-1)
 * - Layer 2: Dual counter-drifting horizontal fog & lighting (z-2)
 * - Layer 3: Floating fireflies, embers & soaring messenger owl (z-3)
 */
export const BackgroundAtmosphere: React.FC = () => {
  return <ParallaxScene />;
};
