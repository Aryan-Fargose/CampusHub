"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { ParallaxScene } from "@/components/home/ParallaxScene";
import { HeroBanner } from "@/components/home/HeroBanner";
import { AttendanceCard } from "@/components/home/AttendanceCard";
import { CanteenCard } from "@/components/home/CanteenCard";
import { OwlPostCard } from "@/components/home/OwlPostCard";
import { CommonRoomCard } from "@/components/home/CommonRoomCard";
import { QuoteBanner } from "@/components/home/QuoteBanner";
import { AmbientControls } from "@/components/home/AmbientControls";
import { useParallax } from "@/lib/useParallax";

import {
  mockCurrentUser,
  mockAttendance,
  mockCanteenPick,
  mockOwlPost,
  mockCommonRoom,
  mockQuotes,
} from "@/lib/mockData";
import { ThemeId } from "@/types";

export default function HomePage() {
  // Scalable user state (ready for future auth integration)
  const [currentUser] = useState(mockCurrentUser);
  // Scalable theme state (ready for Common Room chamber themes)
  const [currentThemeId, setCurrentThemeId] = useState<ThemeId>("midnight");
  // Interactive exploration feedback state
  const [exploreAlert, setExploreAlert] = useState(false);

  // Smooth mouse parallax hook
  const parallax = useParallax();

  const handleExploreWorld = () => {
    setExploreAlert(true);
    setTimeout(() => setExploreAlert(false), 3000);
  };

  // Subtle 2-3px dampened card translation
  const cardsParallaxStyle = {
    transform: `translate3d(${-parallax.x * 3}px, ${-parallax.y * 2}px, 0)`,
    willChange: "transform",
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden bg-[#03060a] text-[#f1ede4]">
      {/* 1. Layered Cinematic Parallax World (Background, Atmosphere, Floating Embers) */}
      <ParallaxScene />

      {/* 2. Floating Top Navigation Bar */}
      <Header user={currentUser} />

      {/* Interactive Exploration Feedback Toast */}
      {exploreAlert && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 rounded-full bg-emerald-950/90 border border-emerald-400 px-6 py-2.5 text-xs font-serif text-emerald-200 shadow-[0_0_30px_rgba(16,185,129,0.5)] backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-300">
          ✨ The Gates of CampusHub are opening... Your enchanted journey begins!
        </div>
      )}

      {/* 3. Main Interactive Cinematic Dashboard Layout */}
      <main className="relative z-20 mx-auto w-full max-w-7xl flex-1 px-4 py-4 sm:px-6 sm:py-6 flex flex-col justify-between">
        {/* Desktop 3-Column / Mobile Stacked Architecture */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-center">
          {/* Left Column: Attendance Overview & Canteen Pick */}
          <div
            style={cardsParallaxStyle}
            className="order-2 lg:order-1 lg:col-span-3 space-y-5 transition-transform duration-100 ease-out"
          >
            <AttendanceCard attendance={mockAttendance} />
            <CanteenCard canteenPick={mockCanteenPick} />
          </div>

          {/* Center Column: Personalized Hero & World Explorer */}
          <div className="order-1 lg:order-2 lg:col-span-6 flex flex-col items-center justify-center my-2 lg:my-0">
            <HeroBanner
              user={currentUser}
              onExploreWorld={handleExploreWorld}
            />
          </div>

          {/* Right Column: Owl Post & Common Room */}
          <div
            style={cardsParallaxStyle}
            className="order-3 lg:order-3 lg:col-span-3 space-y-5 transition-transform duration-100 ease-out"
          >
            <OwlPostCard summary={mockOwlPost} />
            <CommonRoomCard preview={mockCommonRoom} />
          </div>
        </div>

        {/* Bottom Section: Atmospheric Quote Banner & Ambient Controls */}
        <div className="mt-8 space-y-5">
          <div className="mx-auto max-w-2xl">
            <QuoteBanner quotes={mockQuotes} />
          </div>

          <AmbientControls
            currentThemeId={currentThemeId}
            onThemeChange={setCurrentThemeId}
          />
        </div>
      </main>
    </div>
  );
}
