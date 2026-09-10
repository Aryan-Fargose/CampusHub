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
  Scroll,
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
  const bgRef = useRef<HTMLDivElement | null>(null);

  // Scroll Progress: 0.0 to 1.0
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const targetProgressRef = useRef<number>(0);
  const currentProgressRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);

  // Mouse Parallax Offset
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  // Handle Window Scroll to compute progress
  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const totalScrollHeight =
        container.scrollHeight - window.innerHeight;
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

  // Smooth lerp loop for cinematic camera inertia
  useEffect(() => {
    const lerp = (start: number, end: number, factor: number) =>
      start + (end - start) * factor;

    const tick = () => {
      const current = currentProgressRef.current;
      const target = targetProgressRef.current;

      // Smooth interpolation factor
      const next = lerp(current, target, 0.08);
      currentProgressRef.current = next;
      setScrollProgress(next);

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Mouse parallax interaction
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 16;
      const y = (e.clientY / innerHeight - 0.5) * 14;
      setMouseOffset({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Compute camera transforms based on scroll progress
  // Stage 1 (0.00 - 0.22): Overview
  // Stage 2 (0.23 - 0.48): X & O (Right side chess table)
  // Stage 3 (0.49 - 0.74): Match Creatures (Left side hearth)
  // Stage 4 (0.75 - 1.00): Forest Run (Archway portal)
  const getCameraValues = (p: number) => {
    if (p <= 0.22) {
      // Stage 1: Overview
      const t = p / 0.22;
      return {
        panX: t * -5,
        panY: t * 1,
        zoom: 1.05 + t * 0.05,
        rotateY: t * -2,
        rotateX: t * 1,
        activeStation: null,
      };
    } else if (p <= 0.48) {
      // Stage 2: Sweep to Right side (X & O / Chess Alcove)
      const t = (p - 0.22) / 0.26;
      return {
        panX: -5 + t * -17, // moves toward -22%
        panY: 1 + t * 5,
        zoom: 1.1 + t * 0.16,
        rotateY: -2 + t * -6,
        rotateX: 1 + t * 2,
        activeStation: "x-and-o",
      };
    } else if (p <= 0.74) {
      // Stage 3: Sweep across couches to Left side (Hearth / Match Creatures)
      const t = (p - 0.48) / 0.26;
      return {
        panX: -22 + t * 42, // sweeps from -22% across to +20%
        panY: 6 + t * -10,
        zoom: 1.26 + t * 0.02,
        rotateY: -8 + t * 17,
        rotateX: 3 + t * -1,
        activeStation: "match-creatures",
      };
    } else {
      // Stage 4: Zoom into Dark Archway (Forest Run)
      const t = (p - 0.74) / 0.26;
      return {
        panX: 20 + t * 12, // moves to +32%
        panY: -4 + t * 12,
        zoom: 1.28 + t * 0.1,
        rotateY: 9 + t * 4,
        rotateX: 2 + t * -4,
        activeStation: "dino-run",
      };
    }
  };

  const camera = getCameraValues(scrollProgress);

  // Programmatic scroll teleport to station
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

  // Station card selection animation
  const handleStationClick = (game: GameStationConfig) => {
    if (game.status === "coming-soon") return;

    try {
      animate(`#station-card-${game.id}`, {
        scale: [1, 1.08, 1.02],
        duration: 350,
        easing: "easeOutCubic",
      });
    } catch {
      // Ignored
    }

    setTimeout(() => {
      onSelectGame(game);
    }, 150);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-[420vh] bg-[#020509] text-[#f1ede4] select-none"
    >
      {/* ========================================================================= */}
      {/* 1. FIXED 3D VIEWPORT CONTAINER                                           */}
      {/* ========================================================================= */}
      <div
        className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0"
        style={{ perspective: "1100px" }}
      >
        {/* The 3D Camera Rig */}
        <div
          ref={bgRef}
          className="absolute -inset-[15%] w-[130%] h-[130%] will-change-transform"
          style={{
            backgroundImage: "url('/backgrounds/common-room.jpg')",
            backgroundPosition: "center 38%",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            transform: `translate3d(${camera.panX + mouseOffset.x * -0.3}%, ${
              camera.panY + mouseOffset.y * -0.3
            }%, 0) scale(${camera.zoom}) rotateY(${
              camera.rotateY + mouseOffset.x * 0.1
            }deg) rotateX(${camera.rotateX + mouseOffset.y * -0.1}deg)`,
            transition: "transform 0.1s linear",
          }}
        />

        {/* 
          Subtle Vignette only — NO heavy fog, mist, or smoke overlays.
          Keeps the room crisp, dark, and readable.
        */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 45%, rgba(2,5,9,0.1) 0%, rgba(2,5,9,0.55) 75%, rgba(2,5,9,0.92) 100%)",
          }}
        />

        {/* Subtle Underwater Green Lantern Glow Points */}
        <div
          className="absolute top-[28%] left-[45%] w-64 h-64 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none animate-pulse"
          style={{ animationDuration: "6s" }}
        />
        <div
          className="absolute top-[35%] left-[20%] w-48 h-48 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none animate-pulse"
          style={{ animationDuration: "8s", animationDelay: "2s" }}
        />

        {/* Floating Arcane Embers */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <span
            className="absolute w-1 h-1 rounded-full bg-[#48D1CC]/60 shadow-[0_0_8px_#48D1CC]"
            style={{
              top: "35%",
              left: "25%",
              animation: "emberDrift 9s infinite linear",
            }}
          />
          <span
            className="absolute w-1.5 h-1.5 rounded-full bg-[#E7C56D]/60 shadow-[0_0_8px_#E7C56D]"
            style={{
              top: "55%",
              left: "70%",
              animation: "emberDrift 11s infinite linear 2s",
            }}
          />
          <span
            className="absolute w-1 h-1 rounded-full bg-[#34d399]/50 shadow-[0_0_6px_#34d399]"
            style={{
              top: "40%",
              left: "82%",
              animation: "emberDrift 8s infinite linear 4s",
            }}
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. FIXED HUD & TELEPORT NAVIGATION RAIL (z-30)                           */}
      {/* ========================================================================= */}
      <aside
        aria-label="Common Room Navigation"
        className="fixed right-4 sm:right-7 top-1/2 -translate-y-1/2 z-30 flex flex-col items-end gap-3 pointer-events-auto"
      >
        {/* Exploration Progress Track */}
        <div className="flex flex-col items-center gap-3 bg-[#030d15]/85 border border-[#1b3a47] rounded-full py-3 px-2 backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.8)]">
          {/* Overview Point */}
          <button
            type="button"
            onClick={() => scrollToStation(0.0)}
            title="Common Room Chamber Overview"
            className={`group flex items-center justify-center w-7 h-7 rounded-full transition-all cursor-pointer ${
              scrollProgress < 0.22
                ? "bg-[#48D1CC] text-[#020509] shadow-[0_0_12px_#48D1CC] scale-110"
                : "bg-[#061924] text-[#80949F] hover:text-[#48D1CC] hover:bg-[#0c2f44]"
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
          </button>

          {/* Game Stations */}
          {GAME_STATIONS.slice(0, 3).map((game) => {
            const isCurrent = camera.activeStation === game.id;
            return (
              <button
                key={game.id}
                type="button"
                onClick={() => scrollToStation(game.stageProgress)}
                title={`${game.title} (${game.stationName})`}
                className={`group relative flex items-center justify-center w-7 h-7 rounded-full transition-all cursor-pointer ${
                  isCurrent
                    ? "bg-[#E7C56D] text-[#020509] shadow-[0_0_14px_#E7C56D] scale-115 font-bold"
                    : "bg-[#061924] text-[#80949F] hover:text-[#E7C56D] hover:bg-[#0c2f44]"
                }`}
              >
                <span className="text-[10px] font-cinzel">
                  {game.id === "x-and-o" ? "✕" : game.id === "match-creatures" ? "✦" : "⚡"}
                </span>

                {/* Floating tooltip on hover */}
                <span className="absolute right-9 px-2.5 py-1 rounded-md bg-[#041520]/90 border border-[#48D1CC]/40 text-[10px] font-cinzel text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md">
                  {game.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Scroll percentage indicator */}
        <span className="text-[9px] font-mono text-[#48D1CC]/70 pr-1">
          {Math.round(scrollProgress * 100)}% Depth
        </span>
      </aside>

      {/* ========================================================================= */}
      {/* 3. SCROLL-REVEALED INTERACTIVE GAME STATIONS (z-20)                       */}
      {/* ========================================================================= */}
      <main className="relative z-20 w-full">
        {/* ----------------------------------------------------------------------- */}
        {/* STAGE 1: Chamber Entrance Overview (Scroll progress 0% - 20%)          */}
        {/* ----------------------------------------------------------------------- */}
        <section className="min-h-screen flex flex-col items-center justify-between px-4 sm:px-8 pt-20 pb-12 text-center pointer-events-none">
          <div className="my-auto max-w-2xl bg-[#041520]/80 border border-[#48D1CC]/35 rounded-2xl p-6 sm:p-9 backdrop-blur-md shadow-[0_0_45px_rgba(4,21,32,0.85)] pointer-events-auto animate-in fade-in zoom-in-95 duration-500">
            {/* Top Crest */}
            <div className="flex items-center justify-center gap-2 text-[#E7C56D] text-xs font-cinzel font-bold tracking-[0.25em] uppercase mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Hogwarts Common Room</span>
              <Sparkles className="w-3.5 h-3.5" />
            </div>

            <h1 className="font-cinzel text-3xl sm:text-5xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#f1ede4] via-[#E7C56D] to-[#48D1CC] mb-3">
              The Emerald Sanctuary
            </h1>

            <p className="font-serif text-sm sm:text-base text-[#AFC3CF] leading-relaxed mb-6">
              Beneath the surface of the Black Lake lies the subterranean common
              hall. Gaze into the depths as the giant squid drifts past the
              vaulted arches, or explore the room to discover ancient wizarding
              games.
            </p>

            {/* Quick action buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => scrollToStation(0.35)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0c3642] via-[#094850] to-[#0c3642] border border-[#48D1CC] text-xs font-cinzel font-bold text-white hover:scale-105 hover:shadow-[0_0_20px_rgba(72,209,204,0.4)] transition-all cursor-pointer"
              >
                <Gamepad2 className="w-4 h-4 text-[#48D1CC]" />
                <span>Explore Game Stations</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#48D1CC]" />
              </button>
            </div>
          </div>

          {/* Prompt to Scroll Down */}
          <div className="flex flex-col items-center gap-1.5 text-xs font-serif text-[#AFC3CF] pointer-events-auto animate-bounce">
            <span>Scroll down to walk through the Common Room</span>
            <ChevronDown className="w-4 h-4 text-[#48D1CC]" />
          </div>
        </section>

        {/* ----------------------------------------------------------------------- */}
        {/* STAGE 2: Game 1 — X & O (Chess Alcove, Right Side)                      */}
        {/* ----------------------------------------------------------------------- */}
        <section className="min-h-screen flex items-center justify-end px-4 sm:px-12 lg:px-24 py-16 pointer-events-none">
          {(() => {
            const game = GAME_STATIONS[0];
            const isFocussed = camera.activeStation === game.id;
            return (
              <div
                id={`station-card-${game.id}`}
                className={`w-full max-w-md bg-[#041520]/88 border-2 rounded-2xl p-6 sm:p-7 backdrop-blur-xl transition-all duration-500 pointer-events-auto shadow-[0_0_40px_rgba(0,0,0,0.9)] ${
                  isFocussed
                    ? "border-[#48D1CC] shadow-[0_0_35px_rgba(72,209,204,0.35)] scale-100 opacity-100"
                    : "border-[#1c4152]/60 scale-95 opacity-70 hover:opacity-100"
                }`}
              >
                {/* Station Tag & Landmark */}
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-cinzel font-bold tracking-wider bg-[#48D1CC]/20 border border-[#48D1CC]/50 text-[#48D1CC]">
                    {game.badge}
                  </span>
                  <span className="text-[10px] font-serif text-[#80949F]">
                    {game.playersText}
                  </span>
                </div>

                <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-[#f1ede4] mb-1">
                  {game.title}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-[#E7C56D] font-cinzel mb-2.5">
                  <Swords className="w-3.5 h-3.5" />
                  <span>{game.stationName}</span>
                </div>

                <p className="font-serif text-xs text-[#AFC3CF] leading-relaxed mb-4">
                  {game.description}
                </p>

                {/* Landmark Location Tag */}
                <div className="flex items-center gap-1.5 mb-5 text-[11px] font-serif text-[#80949F]">
                  <Scroll className="w-3 h-3 text-[#E7C56D]" />
                  <span>Located at: {game.landmark}</span>
                </div>

                {/* Play Station Trigger Button */}
                <button
                  type="button"
                  onClick={() => handleStationClick(game)}
                  className="group w-full flex items-center justify-center gap-2 rounded-xl py-2.5 px-4 bg-gradient-to-r from-[#051a24] via-[#093244] to-[#051a24] hover:from-[#093244] hover:to-[#093244] border border-[#48D1CC] text-xs font-cinzel font-bold text-[#f1ede4] hover:text-white transition-all duration-200 cursor-pointer shadow-md hover:shadow-[0_0_20px_rgba(72,209,204,0.4)]"
                >
                  <Gamepad2 className="w-4 h-4 text-[#48D1CC] transition-transform duration-200 group-hover:scale-110" />
                  <span>Enter Duel of Wizards</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#48D1CC] transition-transform duration-200 group-hover:translate-x-1" />
                </button>
              </div>
            );
          })()}
        </section>

        {/* ----------------------------------------------------------------------- */}
        {/* STAGE 3: Game 2 — Match the Creatures (Emerald Hearth, Left Side)       */}
        {/* ----------------------------------------------------------------------- */}
        <section className="min-h-screen flex items-center justify-start px-4 sm:px-12 lg:px-24 py-16 pointer-events-none">
          {(() => {
            const game = GAME_STATIONS[1];
            const isFocussed = camera.activeStation === game.id;
            return (
              <div
                id={`station-card-${game.id}`}
                className={`w-full max-w-md bg-[#041520]/88 border-2 rounded-2xl p-6 sm:p-7 backdrop-blur-xl transition-all duration-500 pointer-events-auto shadow-[0_0_40px_rgba(0,0,0,0.9)] ${
                  isFocussed
                    ? "border-[#E7C56D] shadow-[0_0_35px_rgba(231,197,109,0.35)] scale-100 opacity-100"
                    : "border-[#1c4152]/60 scale-95 opacity-70 hover:opacity-100"
                }`}
              >
                {/* Station Tag & Landmark */}
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-cinzel font-bold tracking-wider bg-[#E7C56D]/20 border border-[#E7C56D]/50 text-[#E7C56D]">
                    {game.badge}
                  </span>
                  <span className="text-[10px] font-serif text-[#80949F]">
                    {game.playersText}
                  </span>
                </div>

                <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-[#f1ede4] mb-1">
                  {game.title}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-[#E7C56D] font-cinzel mb-2.5">
                  <Flame className="w-3.5 h-3.5" />
                  <span>{game.stationName}</span>
                </div>

                <p className="font-serif text-xs text-[#AFC3CF] leading-relaxed mb-4">
                  {game.description}
                </p>

                {/* Landmark Location Tag */}
                <div className="flex items-center gap-1.5 mb-5 text-[11px] font-serif text-[#80949F]">
                  <Scroll className="w-3 h-3 text-[#E7C56D]" />
                  <span>Located at: {game.landmark}</span>
                </div>

                {/* Play Station Trigger Button */}
                <button
                  type="button"
                  onClick={() => handleStationClick(game)}
                  className="group w-full flex items-center justify-center gap-2 rounded-xl py-2.5 px-4 bg-gradient-to-r from-[#191508] via-[#2f270d] to-[#191508] hover:from-[#2f270d] hover:to-[#2f270d] border border-[#E7C56D] text-xs font-cinzel font-bold text-[#f1ede4] hover:text-white transition-all duration-200 cursor-pointer shadow-md hover:shadow-[0_0_20px_rgba(231,197,109,0.4)]"
                >
                  <Sparkles className="w-4 h-4 text-[#E7C56D] transition-transform duration-200 group-hover:scale-110" />
                  <span>Begin Memory Trial</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#E7C56D] transition-transform duration-200 group-hover:translate-x-1" />
                </button>
              </div>
            );
          })()}
        </section>

        {/* ----------------------------------------------------------------------- */}
        {/* STAGE 4: Game 3 — Forbidden Forest Run (Dark Archway Portal)            */}
        {/* ----------------------------------------------------------------------- */}
        <section className="min-h-screen flex items-center justify-center px-4 sm:px-8 py-16 pointer-events-none">
          {(() => {
            const game = GAME_STATIONS[2];
            const isFocussed = camera.activeStation === game.id;
            return (
              <div
                id={`station-card-${game.id}`}
                className={`w-full max-w-md bg-[#041520]/88 border-2 rounded-2xl p-6 sm:p-7 backdrop-blur-xl transition-all duration-500 pointer-events-auto shadow-[0_0_40px_rgba(0,0,0,0.9)] ${
                  isFocussed
                    ? "border-[#34d399] shadow-[0_0_35px_rgba(52,211,153,0.35)] scale-100 opacity-100"
                    : "border-[#1c4152]/60 scale-95 opacity-70 hover:opacity-100"
                }`}
              >
                {/* Station Tag & Landmark */}
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-cinzel font-bold tracking-wider bg-[#34d399]/20 border border-[#34d399]/50 text-[#34d399]">
                    {game.badge}
                  </span>
                  <span className="text-[10px] font-serif text-[#80949F]">
                    {game.playersText}
                  </span>
                </div>

                <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-[#f1ede4] mb-1">
                  {game.title}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-[#34d399] font-cinzel mb-2.5">
                  <Flame className="w-3.5 h-3.5" />
                  <span>{game.stationName}</span>
                </div>

                <p className="font-serif text-xs text-[#AFC3CF] leading-relaxed mb-4">
                  {game.description}
                </p>

                {/* Landmark Location Tag */}
                <div className="flex items-center gap-1.5 mb-5 text-[11px] font-serif text-[#80949F]">
                  <Scroll className="w-3 h-3 text-[#E7C56D]" />
                  <span>Located at: {game.landmark}</span>
                </div>

                {/* Play Station Trigger Button */}
                <button
                  type="button"
                  onClick={() => handleStationClick(game)}
                  className="group w-full flex items-center justify-center gap-2 rounded-xl py-2.5 px-4 bg-gradient-to-r from-[#041d16] via-[#0b3829] to-[#041d16] hover:from-[#0b3829] hover:to-[#0b3829] border border-[#34d399] text-xs font-cinzel font-bold text-[#f1ede4] hover:text-white transition-all duration-200 cursor-pointer shadow-md hover:shadow-[0_0_20px_rgba(52,211,153,0.4)]"
                >
                  <Gamepad2 className="w-4 h-4 text-[#34d399] transition-transform duration-200 group-hover:scale-110" />
                  <span>Sprint into Forest</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#34d399] transition-transform duration-200 group-hover:translate-x-1" />
                </button>
              </div>
            );
          })()}
        </section>
      </main>
    </div>
  );
};
