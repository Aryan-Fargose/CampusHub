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
  // Balanced collection of 16 subtle magical fireflies & embers
  const particles: Particle[] = useMemo(
    () => [
      { id: 1, top: "22%", left: "18%", size: 3, color: "gold", duration: 8, delay: 0 },
      { id: 2, top: "35%", left: "32%", size: 2.5, color: "emerald", duration: 9.5, delay: 1.2 },
      { id: 3, top: "42%", left: "48%", size: 3.5, color: "emerald", duration: 7, delay: 0.5 },
      { id: 4, top: "52%", left: "54%", size: 4, color: "emerald", duration: 6.5, delay: 2 },
      { id: 5, top: "30%", left: "68%", size: 2.5, color: "azure", duration: 11, delay: 1.8 },
      { id: 6, top: "18%", left: "78%", size: 3, color: "gold", duration: 8.5, delay: 0.8 },
      { id: 7, top: "58%", left: "24%", size: 3, color: "amber", duration: 10, delay: 2.4 },
      { id: 8, top: "68%", left: "44%", size: 3.5, color: "emerald", duration: 7.5, delay: 1 },
      { id: 9, top: "62%", left: "58%", size: 3, color: "emerald", duration: 8, delay: 3 },
      { id: 10, top: "45%", left: "82%", size: 2, color: "azure", duration: 9, delay: 1.5 },
      { id: 11, top: "75%", left: "36%", size: 2.5, color: "amber", duration: 11.5, delay: 0.3 },
      { id: 12, top: "28%", left: "52%", size: 2, color: "gold", duration: 8, delay: 2.2 },
      { id: 13, top: "65%", left: "74%", size: 2.5, color: "emerald", duration: 9, delay: 1.7 },
      { id: 14, top: "15%", left: "42%", size: 2, color: "azure", duration: 12, delay: 3.1 },
      { id: 15, top: "80%", left: "65%", size: 3, color: "amber", duration: 10.5, delay: 0.6 },
    ],
    []
  );

  const colorStyles = {
    emerald: "bg-[#6ee7b7] shadow-[0_0_12px_#34d399]",
    gold: "bg-[#fef08a] shadow-[0_0_12px_#fde047]",
    azure: "bg-[#bae6fd] shadow-[0_0_10px_#38bdf8]",
    amber: "bg-[#fed7aa] shadow-[0_0_10px_#fb923c]",
  };

  // Layer 3: Floating Fireflies move with parallax (6-8px)
  const transformStyle = {
    transform: `translate3d(${-parallax.x * 7}px, ${-parallax.y * 5}px, 0)`,
    willChange: "transform",
  };

  return (
    <div
      aria-hidden="true"
      style={transformStyle}
      className="pointer-events-none fixed inset-0 z-[3] overflow-hidden transition-transform duration-150 ease-out"
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
          className={`absolute rounded-full animate-[pulse_ease-in-out_infinite] opacity-80 ${
            colorStyles[p.color]
          }`}
        />
      ))}
    </div>
  );
};
