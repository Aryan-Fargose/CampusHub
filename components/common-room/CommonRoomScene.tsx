"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Gamepad2,
  ChevronDown,
  ArrowRight,
  Compass,
  Flame,
  Swords,
} from "lucide-react";
import { GAME_STATIONS, GameStationConfig } from "@/lib/gamesConfig";
import { animate } from "animejs";

interface CommonRoomSceneProps {
  onSelectGame: (game: GameStationConfig) => void;
}

export const CommonRoomScene: React.FC<CommonRoomSceneProps> = ({
  onSelectGame,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const panoRef = useRef<HTMLDivElement | null>(null);

  // Scroll & Camera Progress: 0.0 (Extreme Left) to 1.0 (Extreme Right)
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const targetProgressRef = useRef<number>(0);
  const currentProgressRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);

  // Viewport dimensions for responsive panorama sizing
  const [viewportDims, setViewportDims] = useState<{
    width: number;
    height: number;
  }>({
    width: 1920,
    height: 1080,
  });

  // Mouse Parallax & Drag interaction
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const isDraggingRef = useRef<boolean>(false);
  const dragStartXRef = useRef<number>(0);
  const dragStartProgressRef = useRef<number>(0);

  // 1. Measure viewport dimensions
  useEffect(() => {
    const handleResize = () => {
      setViewportDims({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 2. Scroll listener to compute progress (0.0 to 1.0)
  useEffect(() => {
    const handleScroll = () => {
      if (isDraggingRef.current) return;
      const container = containerRef.current;
      if (!container) return;

      const totalScrollHeight = container.scrollHeight - window.innerHeight;
      if (totalScrollHeight <= 0) return;

      const currentScrollY = window.scrollY;
      const progress = Math.min(
        Math.max(currentScrollY / totalScrollHeight, 0),
        1
      );
      targetProgressRef.current = progress;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 3. Mouse move for 3D perspective camera tilt
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 16;
      const y = (e.clientY / innerHeight - 0.5) * 12;
      setMouseOffset({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // 4. Mouse Drag to physically pan the camera directly
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
    dragStartProgressRef.current = targetProgressRef.current;
  };

  useEffect(() => {
    const handleMouseMoveWindow = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - dragStartXRef.current;
      const deltaProgress = -deltaX / (window.innerWidth * 1.6);
      const newProgress = Math.min(
        Math.max(dragStartProgressRef.current + deltaProgress, 0),
        1
      );

      targetProgressRef.current = newProgress;

      // Sync scroll position with drag
      const container = containerRef.current;
      if (container) {
        const totalScrollHeight = container.scrollHeight - window.innerHeight;
        window.scrollTo({
          top: newProgress * totalScrollHeight,
          behavior: "auto",
        });
      }
    };

    const handleMouseUpWindow = () => {
      isDraggingRef.current = false;
    };

    window.addEventListener("mousemove", handleMouseMoveWindow);
    window.addEventListener("mouseup", handleMouseUpWindow);

    return () => {
      window.removeEventListener("mousemove", handleMouseMoveWindow);
      window.removeEventListener("mouseup", handleMouseUpWindow);
    };
  }, []);

  // 5. 60fps Smooth Lerp Render Loop (Anime.js style cinematic inertia)
  useEffect(() => {
    const lerp = (start: number, end: number, factor: number) =>
      start + (end - start) * factor;

    const render = () => {
      const current = currentProgressRef.current;
      const target = targetProgressRef.current;

      // Silky smooth interpolation for steady camera movement without bounce
      const next = lerp(current, target, 0.12);
      currentProgressRef.current = next;
      setScrollProgress(next);

      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Programmatic smooth scroll to landmark station
  const scrollToStation = (stageProgress: number) => {
    const container = containerRef.current;
    if (!container) return;
    const totalScrollHeight = container.scrollHeight - window.innerHeight;
    const targetY = stageProgress * totalScrollHeight;

    window.scrollTo({
      top: targetY,
      behavior: "smooth",
    });
  };

  // Station card click animation with Anime.js cinematic camera zoom
  const handleStationClick = (game: GameStationConfig) => {
    if (game.status === "coming-soon") return;

    try {
      // 1. Station card zooms toward the user
      animate(`#station-beacon-${game.id}`, {
        scale: [1, 1.35],
        translateZ: [0, 160],
        opacity: [1, 0.3],
        duration: 380,
        easing: "easeOutCubic",
      });

      // 2. Camera rig slightly recedes for cinematic push
      animate("#camera-rig", {
        scale: [1.03, 0.96],
        duration: 380,
        easing: "easeOutCubic",
      });
    } catch {
      // Graceful fallback
    }

    setTimeout(() => {
      onSelectGame(game);
      // Reset transforms when returning to scene
      try {
        animate(`#station-beacon-${game.id}`, {
          scale: 1,
          translateZ: 0,
          opacity: 1,
          duration: 50,
        });
        animate("#camera-rig", {
          scale: 1.03,
          duration: 50,
        });
      } catch {
        // Ignored
      }
    }, 320);
  };

  // Continuous Camera Metrics
  // Pano sizing: 3:1 aspect ratio ensures wide horizontal travel
  const panoWidth = Math.max(
    viewportDims.height * 3.4,
    viewportDims.width * 2.2
  );
  const maxPanDistance = Math.max(panoWidth - viewportDims.width, 0);

  // Horizontal camera glide from extreme LEFT (progress=0.0) to extreme RIGHT (progress=1.0)
  const currentCameraX = -scrollProgress * maxPanDistance;

  // 3D Perspective Rotation:
  // At 0.0 (Left): Camera turns +14° to look into the room
  // At 0.5 (Center): Camera is 0° facing the underwater arches
  // At 1.0 (Right): Camera turns -14° to look into the banquet alcove
  const cameraRotateY = (0.5 - scrollProgress) * 26 + mouseOffset.x * 0.35;
  const cameraRotateX = mouseOffset.y * -0.25;

  // 3D Depth Curve: Camera curves forward into the chamber at center (squid window)
  const cameraTranslateZ = Math.sin(scrollProgress * Math.PI) * 75;

  // Compass degrees: 0° to 360° across the full journey
  const currentDegrees = Math.round(scrollProgress * 360);

  // Determine active landmark based on physical room layout
  const getActiveLandmark = (progress: number) => {
    if (progress < 0.15) {
      return {
        name: "South Gothic Staircase & Portals",
        zone: "Extreme Left",
        angle: Math.round(progress * 360),
        activeId: null,
      };
    } else if (progress >= 0.15 && progress < 0.38) {
      return {
        name: "The Roaring Emerald Hearth",
        zone: "Left-Center",
        angle: 90,
        activeId: "match-creatures",
      };
    } else if (progress >= 0.38 && progress < 0.62) {
      return {
        name: "Black Lake Underwater Arches & Giant Squid",
        zone: "Central Vault",
        angle: 180,
        activeId: "dino-run",
      };
    } else if (progress >= 0.62 && progress < 0.85) {
      return {
        name: "Carved Mahogany Chess Alcove & Study",
        zone: "Right-Center",
        angle: 270,
        activeId: "x-and-o",
      };
    } else {
      return {
        name: "Grand Emerald Banquet Arch & Gallery",
        zone: "Extreme Right",
        angle: 360,
        activeId: null,
      };
    }
  };

  const landmarkInfo = getActiveLandmark(scrollProgress);

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-[500vh] bg-[#020509] text-[#f1ede4] select-none"
    >
      {/* ========================================================================= */}
      {/* 1. FIXED CONTINUOUS 3D VIRTUAL CAMERA STAGE                                */}
      {/* Pure continuous camera glide from LEFT to RIGHT. No image replacement.     */}
      {/* ========================================================================= */}
      <div
        className="fixed inset-0 w-full h-full overflow-hidden z-0 cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        style={{
          perspective: "1200px",
          perspectiveOrigin: "50% 50%",
        }}
      >
        {/* 3D Rotative Camera Rig */}
        <div
          id="camera-rig"
          className="relative w-full h-full will-change-transform"
          style={{
            transform: `rotateY(${cameraRotateY}deg) rotateX(${cameraRotateX}deg) translateZ(${cameraTranslateZ}px) scale(1.03)`,
            transformStyle: "preserve-3d",
            transition: "transform 0.05s linear",
          }}
        >
          {/* Continuous Ultra-Wide Panoramic Canvas Plane */}
          <div
            ref={panoRef}
            className="absolute top-[-7vh] left-0 h-[114vh] will-change-transform pointer-events-none select-none"
            style={{
              width: `${panoWidth}px`,
              transform: `translate3d(${currentCameraX}px, 0, 0)`,
              transformStyle: "preserve-3d",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/backgrounds/common-room-panorama.png"
              alt="Hogwarts Slytherin Common Room Continuous Camera View"
              className="w-full h-full object-cover object-left select-none pointer-events-none"
              style={{
                objectPosition: "left center",
              }}
              draggable={false}
            />

            {/* Subtle Dynamic Lighting: Emerald Hearth Glow (Left-Center at 25%) */}
            <div
              className="absolute pointer-events-none transition-opacity duration-300"
              style={{
                left: `${panoWidth * 0.24}px`,
                top: "30%",
                width: "480px",
                height: "480px",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(72,209,204,0.18) 0%, rgba(16,185,129,0.08) 45%, rgba(0,0,0,0) 70%)",
                filter: "blur(20px)",
              }}
            />

            {/* Subtle Dynamic Lighting: Black Lake Water Caustics (Center at 50%) */}
            <div
              className="absolute pointer-events-none transition-opacity duration-300"
              style={{
                left: `${panoWidth * 0.49}px`,
                top: "22%",
                width: "600px",
                height: "600px",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(56,189,248,0.16) 0%, rgba(45,212,191,0.07) 50%, rgba(0,0,0,0) 75%)",
                filter: "blur(25px)",
              }}
            />

            {/* Subtle Dynamic Lighting: Candlelight Amber Study Glow (Right-Center at 75%) */}
            <div
              className="absolute pointer-events-none transition-opacity duration-300"
              style={{
                left: `${panoWidth * 0.74}px`,
                top: "35%",
                width: "440px",
                height: "440px",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(231,197,109,0.15) 0%, rgba(217,119,6,0.06) 50%, rgba(0,0,0,0) 70%)",
                filter: "blur(20px)",
              }}
            />
          </div>
        </div>

        {/* 
          Subtle Ambient Vignette:
          NO heavy fog, mist, or smoke overlays.
          Leaves the Common Room sharp, rich, and pristine.
        */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, rgba(2,5,9,0.0) 0%, rgba(2,5,9,0.25) 75%, rgba(2,5,9,0.75) 100%)",
          }}
        />

        {/* Floating Arcane Embers */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <span
            className="absolute w-1 h-1 rounded-full bg-[#48D1CC]/70 shadow-[0_0_8px_#48D1CC]"
            style={{
              top: "28%",
              left: `${(25 + scrollProgress * 50) % 100}%`,
              animation: "emberDrift 9s infinite linear",
            }}
          />
          <span
            className="absolute w-1.5 h-1.5 rounded-full bg-[#E7C56D]/70 shadow-[0_0_8px_#E7C56D]"
            style={{
              top: "58%",
              left: `${(75 - scrollProgress * 45 + 100) % 100}%`,
              animation: "emberDrift 11s infinite linear 2s",
            }}
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. TOP 360° COMPASS & DEGREES HUD (z-30)                                  */}
      {/* ========================================================================= */}
      <div className="fixed top-18 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2.5 bg-[#030d15]/85 border border-[#48D1CC]/35 rounded-full py-1.5 px-3.5 sm:px-5 backdrop-blur-md shadow-[0_0_20px_rgba(4,21,32,0.8)] pointer-events-auto">
        <Compass className="w-3.5 h-3.5 text-[#48D1CC] animate-spin-slow" />
        <div className="flex items-center gap-2 text-[10px] sm:text-xs font-cinzel">
          <span className="text-[#E7C56D] font-bold font-mono">
            {currentDegrees}°
          </span>
          <span className="text-[#48D1CC]/40">|</span>
          <span className="text-[#D6D9D4] font-semibold truncate max-w-[160px] sm:max-w-xs">
            {landmarkInfo.name}
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. RIGHT TELEPORT DIAL RAIL (z-30)                                       */}
      {/* ========================================================================= */}
      <aside
        aria-label="Room Navigation Rail"
        className="fixed right-2 sm:right-5 top-1/2 -translate-y-1/2 z-30 flex flex-col items-end gap-2 pointer-events-auto"
      >
        <div className="flex flex-col items-center gap-2 bg-[#030d15]/85 border border-[#1b3a47] rounded-full py-2.5 px-1 backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.8)]">
          {/* Extreme Left Overview Point */}
          <button
            type="button"
            onClick={() => scrollToStation(0.0)}
            title="0° Extreme Left - Entrance Stairs"
            className={`flex items-center justify-center w-5 h-5 rounded-full transition-all cursor-pointer ${
              scrollProgress < 0.12
                ? "bg-[#48D1CC] text-[#020509] shadow-[0_0_10px_#48D1CC] scale-110"
                : "bg-[#061924] text-[#80949F] hover:text-[#48D1CC]"
            }`}
          >
            <Compass className="w-2.5 h-2.5" />
          </button>

          {/* 3 Game Stations (25%, 50%, 75%) */}
          {GAME_STATIONS.slice(0, 3).map((game) => {
            const isNear = landmarkInfo.activeId === game.id;
            return (
              <button
                key={game.id}
                type="button"
                onClick={() => scrollToStation(game.stageProgress)}
                title={`${game.stageAngle}° - ${game.title}`}
                className={`group relative flex items-center justify-center w-5 h-5 rounded-full transition-all cursor-pointer ${
                  isNear
                    ? "bg-[#E7C56D] text-[#020509] shadow-[0_0_12px_#E7C56D] scale-115 font-bold"
                    : "bg-[#061924] text-[#80949F] hover:text-[#E7C56D]"
                }`}
              >
                <span className="text-[8px] font-cinzel">
                  {game.id === "x-and-o"
                    ? "✕"
                    : game.id === "match-creatures"
                    ? "✦"
                    : "⚡"}
                </span>

                <span className="absolute right-7 px-1.5 py-0.5 rounded bg-[#041520]/95 border border-[#48D1CC]/40 text-[8px] font-cinzel text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md">
                  {game.title} ({game.stageAngle}°)
                </span>
              </button>
            );
          })}

          {/* Extreme Right Overview Point */}
          <button
            type="button"
            onClick={() => scrollToStation(1.0)}
            title="360° Extreme Right - Banquet Arch"
            className={`flex items-center justify-center w-5 h-5 rounded-full transition-all cursor-pointer ${
              scrollProgress > 0.88
                ? "bg-[#48D1CC] text-[#020509] shadow-[0_0_10px_#48D1CC] scale-110"
                : "bg-[#061924] text-[#80949F] hover:text-[#48D1CC]"
            }`}
          >
            <Compass className="w-2.5 h-2.5" />
          </button>
        </div>

        <span className="text-[7px] font-mono text-[#48D1CC]/70 pr-0.5">
          PAN
        </span>
      </aside>

      {/* ========================================================================= */}
      {/* 4. SLEEK 70% SMALLER FLOATING GAME BEACON CAPSULES (z-20)                 */}
      {/* ========================================================================= */}
      <main className="relative z-20 w-full pointer-events-none">
        {/* Stage 1: Entrance Heading (Scroll 0% - 15%, Extreme Left) */}
        <section className="min-h-screen flex flex-col items-center justify-between px-4 sm:px-8 pt-24 pb-12 text-center">
          <div className="my-auto max-w-sm bg-[#041520]/80 border border-[#48D1CC]/35 rounded-xl p-4 sm:p-5 backdrop-blur-md shadow-[0_0_30px_rgba(4,21,32,0.85)] pointer-events-auto animate-in fade-in zoom-in-95 duration-500">
            <div className="flex items-center justify-center gap-1 text-[#E7C56D] text-[9px] font-cinzel font-bold tracking-[0.2em] uppercase mb-1">
              <Sparkles className="w-2.5 h-2.5" />
              <span>Cinematic 3D Camera</span>
              <Sparkles className="w-2.5 h-2.5" />
            </div>

            <h1 className="font-cinzel text-xl sm:text-2xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#f1ede4] via-[#E7C56D] to-[#48D1CC] mb-1.5">
              The Emerald Sanctuary
            </h1>

            <p className="font-serif text-[11px] text-[#AFC3CF] leading-relaxed mb-3">
              Scroll down or drag to smoothly glide the camera from the extreme
              left stairs across the hearth and Black Lake arches to the right
              wing.
            </p>

            <button
              type="button"
              onClick={() => scrollToStation(0.25)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gradient-to-r from-[#0c3642] via-[#094850] to-[#0c3642] border border-[#48D1CC] text-[10px] font-cinzel font-bold text-white hover:scale-105 hover:shadow-[0_0_12px_rgba(72,209,204,0.4)] transition-all cursor-pointer"
            >
              <Gamepad2 className="w-3 h-3 text-[#48D1CC]" />
              <span>Glide to Hearth</span>
              <ArrowRight className="w-2.5 h-2.5 text-[#48D1CC]" />
            </button>
          </div>

          <div className="flex flex-col items-center gap-1 text-[10px] font-serif text-[#AFC3CF] pointer-events-auto animate-bounce">
            <span>Scroll down to glide through the room</span>
            <ChevronDown className="w-3 h-3 text-[#48D1CC]" />
          </div>
        </section>

        {/* ----------------------------------------------------------------------- */}
        {/* Stage 2: Match the Creatures Beacon (70% SMALLER - Sleek Glass Capsule) */}
        {/* Positioned around 25% (90°) at the Emerald Fireplace Hearth             */}
        {/* ----------------------------------------------------------------------- */}
        <section className="min-h-screen flex items-center justify-start px-4 sm:px-12 lg:px-20 py-16">
          {(() => {
            const game = GAME_STATIONS[0];
            const isNear = landmarkInfo.activeId === game.id;
            return (
              <div
                id={`station-beacon-${game.id}`}
                style={{
                  transform: `perspective(800px) rotateY(${
                    mouseOffset.x * 0.4
                  }deg) rotateX(${mouseOffset.y * -0.3}deg)`,
                }}
                className={`w-44 sm:w-48 bg-[#041520]/85 border rounded-xl p-2.5 backdrop-blur-xl transition-all duration-300 pointer-events-auto shadow-[0_0_25px_rgba(0,0,0,0.85)] ${
                  isNear
                    ? "border-[#E7C56D] shadow-[0_0_20px_rgba(231,197,109,0.35)] scale-100 opacity-100 ring-1 ring-[#E7C56D]/50"
                    : "border-[#1c4152]/60 scale-90 opacity-60 hover:opacity-100 hover:scale-95"
                }`}
              >
                {/* Compact Header */}
                <div className="flex items-center justify-between mb-1">
                  <span className="px-1.5 py-0.2 rounded text-[7px] font-cinzel font-bold tracking-wider bg-[#E7C56D]/20 border border-[#E7C56D]/50 text-[#E7C56D]">
                    {game.badge}
                  </span>
                  <span className="text-[8px] font-mono text-[#E7C56D]/80">
                    {game.stageAngle}°
                  </span>
                </div>

                <h3 className="font-cinzel text-xs font-bold text-[#f1ede4] leading-tight mb-0.5">
                  {game.title}
                </h3>
                <div className="flex items-center gap-1 text-[9px] text-[#E7C56D] font-cinzel mb-1">
                  <Flame className="w-2 h-2" />
                  <span className="truncate">{game.stationName}</span>
                </div>

                <p className="font-serif text-[9px] text-[#AFC3CF] leading-tight mb-2 line-clamp-2">
                  {game.description}
                </p>

                {/* Compact Action Button (70% smaller) */}
                <button
                  type="button"
                  onClick={() => handleStationClick(game)}
                  className="w-full flex items-center justify-center gap-1 rounded-md py-1 px-2 bg-gradient-to-r from-[#191508] via-[#2f270d] to-[#191508] hover:from-[#2f270d] hover:to-[#2f270d] border border-[#E7C56D] text-[9px] font-cinzel font-bold text-[#f1ede4] hover:text-white transition-all cursor-pointer shadow-sm hover:shadow-[0_0_10px_rgba(231,197,109,0.4)]"
                >
                  <Sparkles className="w-2.5 h-2.5 text-[#E7C56D]" />
                  <span>Play Memory</span>
                </button>
              </div>
            );
          })()}
        </section>

        {/* ----------------------------------------------------------------------- */}
        {/* Stage 3: Forbidden Forest Run Beacon (70% SMALLER - Sleek Glass Capsule)*/}
        {/* Positioned around 50% (180°) at the Grand Underwater Window Archway     */}
        {/* ----------------------------------------------------------------------- */}
        <section className="min-h-screen flex items-center justify-center px-4 sm:px-8 py-16">
          {(() => {
            const game = GAME_STATIONS[1];
            const isNear = landmarkInfo.activeId === game.id;
            return (
              <div
                id={`station-beacon-${game.id}`}
                style={{
                  transform: `perspective(800px) rotateY(${
                    mouseOffset.x * 0.4
                  }deg) rotateX(${mouseOffset.y * -0.3}deg)`,
                }}
                className={`w-44 sm:w-48 bg-[#041520]/85 border rounded-xl p-2.5 backdrop-blur-xl transition-all duration-300 pointer-events-auto shadow-[0_0_25px_rgba(0,0,0,0.85)] ${
                  isNear
                    ? "border-[#34d399] shadow-[0_0_20px_rgba(52,211,153,0.35)] scale-100 opacity-100 ring-1 ring-[#34d399]/50"
                    : "border-[#1c4152]/60 scale-90 opacity-60 hover:opacity-100 hover:scale-95"
                }`}
              >
                {/* Compact Header */}
                <div className="flex items-center justify-between mb-1">
                  <span className="px-1.5 py-0.2 rounded text-[7px] font-cinzel font-bold tracking-wider bg-[#34d399]/20 border border-[#34d399]/50 text-[#34d399]">
                    {game.badge}
                  </span>
                  <span className="text-[8px] font-mono text-[#34d399]/80">
                    {game.stageAngle}°
                  </span>
                </div>

                <h3 className="font-cinzel text-xs font-bold text-[#f1ede4] leading-tight mb-0.5">
                  {game.title}
                </h3>
                <div className="flex items-center gap-1 text-[9px] text-[#34d399] font-cinzel mb-1">
                  <Flame className="w-2 h-2" />
                  <span className="truncate">{game.stationName}</span>
                </div>

                <p className="font-serif text-[9px] text-[#AFC3CF] leading-tight mb-2 line-clamp-2">
                  {game.description}
                </p>

                {/* Compact Action Button (70% smaller) */}
                <button
                  type="button"
                  onClick={() => handleStationClick(game)}
                  className="w-full flex items-center justify-center gap-1 rounded-md py-1 px-2 bg-gradient-to-r from-[#041d16] via-[#0b3829] to-[#041d16] hover:from-[#0b3829] hover:to-[#0b3829] border border-[#34d399] text-[9px] font-cinzel font-bold text-[#f1ede4] hover:text-white transition-all cursor-pointer shadow-sm hover:shadow-[0_0_10px_rgba(52,211,153,0.4)]"
                >
                  <Gamepad2 className="w-2.5 h-2.5 text-[#34d399]" />
                  <span>Start Sprint</span>
                </button>
              </div>
            );
          })()}
        </section>

        {/* ----------------------------------------------------------------------- */}
        {/* Stage 4: X & O Beacon (70% SMALLER - Sleek Glass Capsule)               */}
        {/* Positioned around 75% (270°) at the Mahogany Chess Alcove & Study       */}
        {/* ----------------------------------------------------------------------- */}
        <section className="min-h-screen flex items-center justify-end px-4 sm:px-12 lg:px-20 py-16">
          {(() => {
            const game = GAME_STATIONS[2];
            const isNear = landmarkInfo.activeId === game.id;
            return (
              <div
                id={`station-beacon-${game.id}`}
                style={{
                  transform: `perspective(800px) rotateY(${
                    mouseOffset.x * 0.4
                  }deg) rotateX(${mouseOffset.y * -0.3}deg)`,
                }}
                className={`w-44 sm:w-48 bg-[#041520]/85 border rounded-xl p-2.5 backdrop-blur-xl transition-all duration-300 pointer-events-auto shadow-[0_0_25px_rgba(0,0,0,0.85)] ${
                  isNear
                    ? "border-[#48D1CC] shadow-[0_0_20px_rgba(72,209,204,0.35)] scale-100 opacity-100 ring-1 ring-[#48D1CC]/50"
                    : "border-[#1c4152]/60 scale-90 opacity-60 hover:opacity-100 hover:scale-95"
                }`}
              >
                {/* Compact Header */}
                <div className="flex items-center justify-between mb-1">
                  <span className="px-1.5 py-0.2 rounded text-[7px] font-cinzel font-bold tracking-wider bg-[#48D1CC]/20 border border-[#48D1CC]/50 text-[#48D1CC]">
                    {game.badge}
                  </span>
                  <span className="text-[8px] font-mono text-[#48D1CC]/80">
                    {game.stageAngle}°
                  </span>
                </div>

                <h3 className="font-cinzel text-xs font-bold text-[#f1ede4] leading-tight mb-0.5">
                  {game.title}
                </h3>
                <div className="flex items-center gap-1 text-[9px] text-[#48D1CC] font-cinzel mb-1">
                  <Swords className="w-2 h-2" />
                  <span className="truncate">{game.stationName}</span>
                </div>

                <p className="font-serif text-[9px] text-[#AFC3CF] leading-tight mb-2 line-clamp-2">
                  {game.description}
                </p>

                {/* Compact Action Button (70% smaller) */}
                <button
                  type="button"
                  onClick={() => handleStationClick(game)}
                  className="w-full flex items-center justify-center gap-1 rounded-md py-1 px-2 bg-gradient-to-r from-[#051a24] via-[#093244] to-[#051a24] hover:from-[#093244] hover:to-[#093244] border border-[#48D1CC] text-[9px] font-cinzel font-bold text-[#f1ede4] hover:text-white transition-all cursor-pointer shadow-sm hover:shadow-[0_0_10px_rgba(72,209,204,0.4)]"
                >
                  <Gamepad2 className="w-2.5 h-2.5 text-[#48D1CC]" />
                  <span>Enter Duel</span>
                </button>
              </div>
            );
          })()}
        </section>
      </main>
    </div>
  );
};
