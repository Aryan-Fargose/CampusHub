"use client";

import React, { useEffect, useRef } from "react";
import { ParallaxOffset } from "@/lib/useParallax";

interface FogParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  decay: number;
  colorType: "cyan" | "emerald" | "amber";
}

export interface AtmosphereLayerProps {
  parallax?: ParallaxOffset;
}

export const AtmosphereLayer: React.FC<AtmosphereLayerProps> = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mousePos = useRef<{ x: number; y: number; active: boolean }>({
    x: -9999,
    y: -9999,
    active: false,
  });
  const particlesRef = useRef<FogParticle[]>([]);
  const lastEmitTime = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    const handlePointerMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
      mousePos.current.active = true;

      const now = performance.now();
      // Emit mystical fog puff on cursor hover movement (throttled smoothly)
      if (now - lastEmitTime.current > 35) {
        lastEmitTime.current = now;
        const colors: ("cyan" | "emerald" | "amber")[] = ["cyan", "cyan", "emerald", "amber"];
        const chosenColor = colors[Math.floor(Math.random() * colors.length)];

        // Create 2-3 expanding fog wisps at arrow position
        for (let i = 0; i < 2; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 0.3 + Math.random() * 0.8;
          particlesRef.current.push({
            x: e.clientX + (Math.random() - 0.5) * 20,
            y: e.clientY + (Math.random() - 0.5) * 20,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 0.2, // subtle natural upward drift
            radius: 45 + Math.random() * 40,
            alpha: 0.35 + Math.random() * 0.2,
            decay: 0.005 + Math.random() * 0.006, // lingers for ~2 seconds
            colorType: chosenColor,
          });
        }
      }
    };

    const handlePointerLeave = () => {
      mousePos.current.active = false;
    };

    window.addEventListener("mousemove", handlePointerMove, { passive: true });
    document.addEventListener("mouseleave", handlePointerLeave);

    // Animation Loop for hover fog
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Persistent Ambient Hover Fog Cloud directly at arrow cursor
      if (mousePos.current.active) {
        const { x, y } = mousePos.current;
        const hoverGlow = ctx.createRadialGradient(x, y, 5, x, y, 110);
        hoverGlow.addColorStop(0, "rgba(224, 242, 254, 0.28)");
        hoverGlow.addColorStop(0.4, "rgba(167, 243, 208, 0.18)");
        hoverGlow.addColorStop(0.75, "rgba(56, 189, 248, 0.08)");
        hoverGlow.addColorStop(1, "transparent");

        ctx.fillStyle = hoverGlow;
        ctx.beginPath();
        ctx.arc(x, y, 110, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Dissipating Volumetric Fog Wisps trailing the arrow
      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.radius += 0.55; // Fog expands as it disperses
        p.alpha -= p.decay;

        if (p.alpha <= 0.01) {
          particles.splice(i, 1);
          continue;
        }

        const radGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        if (p.colorType === "emerald") {
          radGrad.addColorStop(0, `rgba(167, 243, 208, ${p.alpha * 0.85})`);
          radGrad.addColorStop(0.5, `rgba(52, 211, 153, ${p.alpha * 0.4})`);
          radGrad.addColorStop(1, "transparent");
        } else if (p.colorType === "amber") {
          radGrad.addColorStop(0, `rgba(254, 240, 138, ${p.alpha * 0.65})`);
          radGrad.addColorStop(0.5, `rgba(245, 158, 11, ${p.alpha * 0.25})`);
          radGrad.addColorStop(1, "transparent");
        } else {
          radGrad.addColorStop(0, `rgba(224, 242, 254, ${p.alpha * 0.9})`);
          radGrad.addColorStop(0.5, `rgba(186, 230, 253, ${p.alpha * 0.45})`);
          radGrad.addColorStop(1, "transparent");
        }

        ctx.fillStyle = radGrad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Cap maximum active particles for high FPS
      if (particles.length > 70) {
        particles.splice(0, particles.length - 70);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handlePointerMove);
      document.removeEventListener("mouseleave", handlePointerLeave);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[2] overflow-hidden select-none"
    >
      {/* Interactive Cursor Hover Fog Canvas */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 h-full w-full"
        style={{ mixBlendMode: "screen" }}
      />
    </div>
  );
};
