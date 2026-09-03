"use client";

import React, { useMemo } from "react";
import { ParallaxOffset } from "@/lib/useParallax";

interface FloatingParticlesProps {
  parallax: ParallaxOffset;
}

interface Particle {
  id: number;
  top: string;
  left: string;
  size: number;
  color: "emerald" | "gold" | "azure" | "amber";
  duration: number;
  delay: number;
}

export const FloatingParticles: React.FC<FloatingParticlesProps> = ({
  parallax,
}) => {
  // Balanced collection of 18 floating magical fireflies & embers
  const particles: Particle[] = useMemo(
    () => [
      { id: 1, top: "18%", left: "15%", size: 3, color: "gold", duration: 7, delay: 0 },
      { id: 2, top: "28%", left: "28%", size: 2.5, color: "emerald", duration: 9, delay: 1.2 },
      { id: 3, top: "36%", left: "46%", size: 3.5, color: "emerald", duration: 6.5, delay: 0.5 },
      { id: 4, top: "48%", left: "55%", size: 3, color: "emerald", duration: 6, delay: 2 },
      { id: 5, top: "25%", left: "68%", size: 2.5, color: "azure", duration: 10, delay: 1.8 },
      { id: 6, top: "14%", left: "80%", size: 3, color: "gold", duration: 8, delay: 0.8 },
      { id: 7, top: "54%", left: "22%", size: 3, color: "amber", duration: 9.5, delay: 2.4 },
      { id: 8, top: "64%", left: "42%", size: 3.5, color: "emerald", duration: 7, delay: 1 },
      { id: 9, top: "58%", left: "62%", size: 3, color: "emerald", duration: 8, delay: 3 },
      { id: 10, top: "38%", left: "84%", size: 2, color: "azure", duration: 8.5, delay: 1.5 },
      { id: 11, top: "70%", left: "34%", size: 2.5, color: "amber", duration: 11, delay: 0.3 },
      { id: 12, top: "22%", left: "54%", size: 2, color: "gold", duration: 7.5, delay: 2.2 },
      { id: 13, top: "62%", left: "76%", size: 2.5, color: "emerald", duration: 8.5, delay: 1.7 },
      { id: 14, top: "12%", left: "38%", size: 2, color: "azure", duration: 11, delay: 3.1 },
      { id: 15, top: "76%", left: "64%", size: 3, color: "amber", duration: 10, delay: 0.6 },
      { id: 16, top: "44%", left: "72%", size: 2.5, color: "gold", duration: 8.5, delay: 2.7 },
      { id: 17, top: "32%", left: "18%", size: 2, color: "emerald", duration: 9, delay: 1.4 },
      { id: 18, top: "68%", left: "82%", size: 2.5, color: "azure", duration: 7.5, delay: 0.9 },
    ],
    []
  );

  const colorStyles = {
    emerald: "bg-[#6ee7b7] shadow-[0_0_12px_#34d399]",
    gold: "bg-[#fef08a] shadow-[0_0_12px_#fde047]",
    azure: "bg-[#bae6fd] shadow-[0_0_10px_#38bdf8]",
    amber: "bg-[#fed7aa] shadow-[0_0_10px_#fb923c]",
  };

  // Layer 3: Floating Fireflies move with mouse parallax (7-9px)
  const transformStyle = {
    transform: `translate3d(${-parallax.x * 8}px, ${-parallax.y * 6}px, 0)`,
    willChange: "transform",
  };

  return (
    <div
      aria-hidden="true"
      style={transformStyle}
      className="pointer-events-none fixed inset-0 z-[3] overflow-hidden transition-transform duration-150 ease-out select-none"
    >
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            top: p.top,
            left: p.left,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
          className={`absolute rounded-full animate-[starTwinkle_ease-in-out_infinite] ${
            colorStyles[p.color]
          }`}
        />
      ))}
    </div>
  );
};
