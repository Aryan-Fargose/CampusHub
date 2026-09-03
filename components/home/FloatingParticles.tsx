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
  color: "gold" | "emerald" | "amber" | "cyan";
  duration: number;
  delay: number;
  glowRadius: number;
}

export const FloatingParticles: React.FC<FloatingParticlesProps> = ({
  parallax,
}) => {
  // Pre-generate a deterministic set of 18 lightweight particles
  const particles: Particle[] = useMemo(
    () => [
      { id: 1, top: "15%", left: "22%", size: 3, color: "gold", duration: 7, delay: 0, glowRadius: 8 },
      { id: 2, top: "28%", left: "38%", size: 2, color: "emerald", duration: 9, delay: 1.5, glowRadius: 6 },
      { id: 3, top: "35%", left: "15%", size: 4, color: "amber", duration: 8, delay: 0.8, glowRadius: 10 },
      { id: 4, top: "18%", left: "68%", size: 2.5, color: "gold", duration: 11, delay: 2, glowRadius: 7 },
      { id: 5, top: "42%", left: "75%", size: 3, color: "emerald", duration: 6, delay: 0.5, glowRadius: 8 },
      { id: 6, top: "55%", left: "30%", size: 2, color: "cyan", duration: 10, delay: 3, glowRadius: 6 },
      { id: 7, top: "62%", left: "60%", size: 3.5, color: "gold", duration: 8.5, delay: 1, glowRadius: 9 },
      { id: 8, top: "25%", left: "82%", size: 2, color: "amber", duration: 7.5, delay: 2.2, glowRadius: 6 },
      { id: 9, top: "72%", left: "20%", size: 3, color: "emerald", duration: 9.5, delay: 0.3, glowRadius: 8 },
      { id: 10, top: "68%", left: "85%", size: 2.5, color: "gold", duration: 8, delay: 1.8, glowRadius: 7 },
      { id: 11, top: "12%", left: "48%", size: 2, color: "cyan", duration: 12, delay: 2.5, glowRadius: 5 },
      { id: 12, top: "48%", left: "52%", size: 3.5, color: "gold", duration: 7, delay: 0.7, glowRadius: 10 },
      { id: 13, top: "32%", left: "62%", size: 2, color: "emerald", duration: 8.5, delay: 1.2, glowRadius: 6 },
      { id: 14, top: "80%", left: "45%", size: 3, color: "amber", duration: 9, delay: 3.2, glowRadius: 8 },
      { id: 15, top: "22%", left: "10%", size: 2.5, color: "gold", duration: 10.5, delay: 0.4, glowRadius: 7 },
      { id: 16, top: "58%", left: "12%", size: 2, color: "emerald", duration: 8, delay: 2.8, glowRadius: 6 },
    ],
    []
  );

  const colorStyles = {
    gold: "bg-[#fef08a] shadow-[0_0_10px_#fde047]",
    emerald: "bg-[#6ee7b7] shadow-[0_0_10px_#34d399]",
    amber: "bg-[#fed7aa] shadow-[0_0_8px_#fb923c]",
    cyan: "bg-[#a5f3fc] shadow-[0_0_8px_#38bdf8]",
  };

  // Foreground particles move more with parallax (-8px to +8px)
  const transformStyle = {
    transform: `translate3d(${-parallax.x * 8}px, ${-parallax.y * 6}px, 0)`,
    willChange: "transform",
  };

  return (
    <div
      aria-hidden="true"
      style={transformStyle}
      className="pointer-events-none fixed inset-0 z-10 overflow-hidden transition-transform duration-100 ease-out"
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
          className={`absolute rounded-full animate-[pulse_ease-in-out_infinite] opacity-75 ${
            colorStyles[p.color]
          }`}
        />
      ))}
    </div>
  );
};
