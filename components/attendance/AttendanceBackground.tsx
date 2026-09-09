"use client";

import React, { useEffect, useRef, useState } from "react";

export const AttendanceBackground: React.FC = () => {
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      // Subtle parallax offset (-6px to +6px max)
      const { innerWidth, innerHeight } = window;
      const targetX = (e.clientX / innerWidth - 0.5) * 12;
      const targetY = (e.clientY / innerHeight - 0.5) * 12;

      animationFrameId = requestAnimationFrame(() => {
        setMouseOffset({ x: targetX, y: targetY });
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none select-none z-0 overflow-hidden bg-[#020509]"
    >
      {/* 
        The Cinematic Gothic Study Chamber Background
        Sharp, high quality, unblurred, no heavy fog/mist overlay.
        Extremely subtle scale & mouse parallax.
      */}
      <div
        ref={bgRef}
        className="absolute -inset-[3%] w-[106%] h-[106%] transition-transform duration-700 ease-out will-change-transform"
        style={{
          backgroundImage: "url('/backgrounds/attendance-chamber.jpg')",
          backgroundPosition: "center 42%",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          transform: `translate3d(${-mouseOffset.x}px, ${-mouseOffset.y}px, 0) scale(1.015)`,
          animation: "subtleBreathing 14s ease-in-out infinite alternate",
        }}
      />

      {/* 
        Subtle Cinematic Vignette to keep text readable without fog or blur
        Soft dark edge vignette only — leaves the castle, owl, desk, candles crisp and visible.
      */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 45%, rgba(2,5,9,0.15) 0%, rgba(2,5,9,0.65) 75%, rgba(2,5,9,0.92) 100%)",
        }}
      />

      {/* 
        Subtle green lantern & moonbeam flare accents
        Synchronized with the art's existing magical candle/moonlight spots
      */}
      <div
        className="absolute top-[35%] left-[8%] w-48 h-48 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none animate-pulse"
        style={{ animationDuration: "5s" }}
      />
      <div
        className="absolute top-[28%] right-[14%] w-40 h-40 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none animate-pulse"
        style={{ animationDuration: "7s", animationDelay: "1.5s" }}
      />

      {/* Tiny magical stardust floating embers */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <span
          className="absolute w-1 h-1 rounded-full bg-[#48D1CC]/50 shadow-[0_0_8px_#48D1CC]"
          style={{
            top: "40%",
            left: "22%",
            animation: "emberDrift 8s infinite linear",
          }}
        />
        <span
          className="absolute w-1.5 h-1.5 rounded-full bg-[#E7C56D]/60 shadow-[0_0_8px_#E7C56D]"
          style={{
            top: "60%",
            left: "65%",
            animation: "emberDrift 11s infinite linear 2s",
          }}
        />
        <span
          className="absolute w-1 h-1 rounded-full bg-[#48D1CC]/40 shadow-[0_0_6px_#48D1CC]"
          style={{
            top: "30%",
            left: "78%",
            animation: "emberDrift 9s infinite linear 4s",
          }}
        />
        <span
          className="absolute w-1.5 h-1.5 rounded-full bg-[#34d399]/50 shadow-[0_0_8px_#34d399]"
          style={{
            top: "75%",
            left: "35%",
            animation: "emberDrift 10s infinite linear 1s",
          }}
        />
      </div>

      <style jsx global>{`
        @keyframes subtleBreathing {
          0% {
            transform: scale(1.01) translate3d(0, 0, 0);
          }
          50% {
            transform: scale(1.025) translate3d(2px, -3px, 0);
          }
          100% {
            transform: scale(1.015) translate3d(-2px, 2px, 0);
          }
        }
      `}</style>
    </div>
  );
};
