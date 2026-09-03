"use client";

import { useEffect, useState, useRef } from "react";

export interface ParallaxOffset {
  x: number; // normalized between -1 and 1
  y: number; // normalized between -1 and 1
}

/**
 * Lightweight, GPU-friendly mouse parallax hook using requestAnimationFrame.
 * Automatically disabled if prefers-reduced-motion is active or on touch-only mobile devices.
 */
export function useParallax() {
  const [offset, setOffset] = useState<ParallaxOffset>({ x: 0, y: 0 });
  const targetOffset = useRef<ParallaxOffset>({ x: 0, y: 0 });
  const currentOffset = useRef<ParallaxOffset>({ x: 0, y: 0 });
  const animFrameId = useRef<number | null>(null);

  useEffect(() => {
    // Check if reduced motion is preferred
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    // Check if it's a mobile touch device without precision pointer
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      // Calculate normalized mouse coords from -1 to 1 centered at screen middle
      const normalizedX = (e.clientX / innerWidth) * 2 - 1;
      const normalizedY = (e.clientY / innerHeight) * 2 - 1;

      targetOffset.current = {
        x: Math.max(-1, Math.min(1, normalizedX)),
        y: Math.max(-1, Math.min(1, normalizedY)),
      };
    };

    // Smooth lerp update loop
    const animate = () => {
      // Lerp with dampening factor 0.05
      currentOffset.current.x +=
        (targetOffset.current.x - currentOffset.current.x) * 0.05;
      currentOffset.current.y +=
        (targetOffset.current.y - currentOffset.current.y) * 0.05;

      setOffset({
        x: parseFloat(currentOffset.current.x.toFixed(4)),
        y: parseFloat(currentOffset.current.y.toFixed(4)),
      });

      animFrameId.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    animFrameId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, []);

  return offset;
}
