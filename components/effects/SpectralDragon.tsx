"use client";

import React from "react";
import Image from "next/image";

interface DragonParticle {
  id: number;
  left: string;
  top: string;
  size: number;
  delay: string;
  duration: string;
  opacity: number;
}

const DRAGON_PARTICLES: DragonParticle[] = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: `${15 + (i * 4.5) % 75}%`,
  top: `${6 + (i * 5.2) % 30}%`,
  size: 2 + (i % 3) * 1.5,
  delay: `${(i * 0.8) % 6}s`,
  duration: `${4 + (i % 4) * 2}s`,
  opacity: 0.3 + (i % 5) * 0.12,
}));

export const SpectralDragon: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[3] pointer-events-none overflow-hidden select-none"
    >
      <style jsx global>{`
        @keyframes dragonGlideFlight {
          0% {
            transform: translate3d(108vw, 6vh, 0) rotate(-6deg) scale(0.92);
            opacity: 0;
            filter: drop-shadow(0 0 10px rgba(22, 207, 255, 0.4))
              drop-shadow(0 0 25px rgba(8, 123, 255, 0.25));
          }
          6% {
            opacity: 0.85;
            transform: translate3d(88vw, 5vh, 0) rotate(-4deg) scale(0.98);
          }
          18% {
            transform: translate3d(70vw, 11vh, 0) rotate(3deg) scale(1.02);
            opacity: 0.95;
            filter: drop-shadow(0 0 16px rgba(22, 207, 255, 0.7))
              drop-shadow(0 0 35px rgba(8, 123, 255, 0.45));
          }
          32% {
            transform: translate3d(52vw, 4vh, 0) rotate(-5deg) scale(0.96);
            opacity: 0.9;
          }
          48% {
            transform: translate3d(36vw, 13vh, 0) rotate(4deg) scale(1.04);
            opacity: 0.95;
          }
          62% {
            transform: translate3d(22vw, 7vh, 0) rotate(-3deg) scale(0.98);
            opacity: 0.85;
          }
          76% {
            transform: translate3d(8vw, 12vh, 0) rotate(2deg) scale(1);
            opacity: 0.8;
          }
          88% {
            transform: translate3d(-8vw, 5vh, 0) rotate(-2deg) scale(0.94);
            opacity: 0.6;
          }
          96% {
            transform: translate3d(-24vw, 8vh, 0) rotate(0deg) scale(0.9);
            opacity: 0.2;
          }
          100% {
            transform: translate3d(-38vw, 9vh, 0) rotate(0deg) scale(0.85);
            opacity: 0;
          }
        }

        @keyframes spectralEmberFloat {
          0% {
            transform: translateY(0px) scale(0.8);
            opacity: 0;
          }
          50% {
            opacity: 0.75;
            transform: translateY(-20px) scale(1.2);
          }
          100% {
            transform: translateY(-45px) scale(0.6);
            opacity: 0;
          }
        }

        .spectral-dragon-track {
          animation: dragonGlideFlight 26s cubic-bezier(0.42, 0, 0.58, 1) infinite;
          will-change: transform, opacity;
        }

        @media (prefers-reduced-motion: reduce) {
          .spectral-dragon-track {
            animation: none !important;
            transform: translate3d(65vw, 8vh, 0) scale(0.95);
            opacity: 0.45 !important;
          }
        }
      `}</style>

      {/* Floating Dragon Embers & Sparks */}
      {DRAGON_PARTICLES.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: p.left,
            top: p.top,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: "#16CFFF",
            boxShadow: `0 0 8px #16CFFF, 0 0 16px #087BFF`,
            animation: `spectralEmberFloat ${p.duration} ease-in-out infinite`,
            animationDelay: p.delay,
            opacity: p.opacity,
          }}
        />
      ))}

      {/* Blue Spectral Dragon Sovereign */}
      <div className="spectral-dragon-track absolute top-0 left-0 w-[24vw] min-w-[220px] max-w-[380px] pointer-events-none">
        <div className="relative w-full aspect-[3/1] filter drop-shadow-[0_0_18px_rgba(22,207,255,0.7)] drop-shadow-[0_0_40px_rgba(8,123,255,0.4)]">
          <Image
            src="/images/spectral-dragon.png"
            alt="Spectral Dragon of Blue Flame"
            fill
            sizes="(max-width: 768px) 240px, 380px"
            className="object-contain"
            priority
          />
        </div>
      </div>
    </div>
  );
};
