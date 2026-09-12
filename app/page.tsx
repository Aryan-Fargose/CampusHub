"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { ParallaxScene } from "@/components/home/ParallaxScene";
import { HeroBanner } from "@/components/home/HeroBanner";
import { AttendanceCard } from "@/components/home/AttendanceCard";
import { CanteenCard } from "@/components/home/CanteenCard";
import { OwlPostCard } from "@/components/home/OwlPostCard";
import { CommonRoomCard } from "@/components/home/CommonRoomCard";
import { BottomControls } from "@/components/home/BottomControls";
import { useAuth } from "@/lib/auth/AuthContext";

import {
  mockCurrentUser,
  mockCanteenPick,
  mockOwlPost,
  mockCommonRoom,
  mockQuotes,
} from "@/lib/mockData";
import { useAttendance } from "@/lib/useAttendance";
import { ThemeId } from "@/types";

export default function HomePage() {
  const router = useRouter();
  const { profile, isAuthenticated, isGuest, isLoading, needsUsernameSetup } = useAuth();
  const [currentThemeId, setCurrentThemeId] = useState<ThemeId>("midnight");
  const [exploreAlert, setExploreAlert] = useState(false);
  const { overallStats } = useAttendance();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated && !isGuest) {
        router.replace("/auth");
      } else if (needsUsernameSetup) {
        router.replace("/onboarding/username");
      }
    }
  }, [isLoading, isAuthenticated, isGuest, needsUsernameSetup, router]);

  const dynamicAttendance = {
    percentage: overallStats.percentage,
    status: overallStats.status === "danger" ? ("critical" as const) : overallStats.status,
    statusLabel: overallStats.status === "danger" ? "DANGER" : overallStats.status.toUpperCase(),
    safeBunksCount: overallStats.safeBunks,
    totalLectures: overallStats.total,
    attendedLectures: overallStats.present,
  };

  const handleExploreWorld = () => {
    setExploreAlert(true);
    setTimeout(() => setExploreAlert(false), 3000);
  };

  // If loading or unauthenticated, show a clean dark ambient state
  if (isLoading || (!isAuthenticated && !isGuest)) {
    return (
      <div className="min-h-screen bg-[#020509] flex items-center justify-center select-none">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 rounded-full border-2 border-[#E7C56D] border-t-transparent animate-spin" />
          <span className="font-cinzel text-xs text-[#E7C56D] tracking-widest uppercase">
            Opening Sanctum...
          </span>
        </div>
      </div>
    );
  }

  const currentUser = profile || mockCurrentUser;

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden bg-[#020509] text-[#f1ede4]">
      {/* ========================================================================= */}
      {/* 1. Cinematic Environment: World, Clear Atmosphere, Particles, Callout    */}
      {/* ========================================================================= */}
      <ParallaxScene onExploreWorld={handleExploreWorld} />

      {/* ========================================================================= */}
      {/* 2. Top Navigation Bar (z-50)                                              */}
      {/* ========================================================================= */}
      <Header user={currentUser} />

      {/* Interactive Exploration Feedback Toast */}
      {exploreAlert && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 rounded-full bg-[#041d22]/90 border border-[#48D1CC] px-6 py-2.5 text-xs font-serif text-[#D6D9D4] shadow-[0_0_35px_rgba(72,209,204,0.5)] backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-300">
          ✨ The Gates of CampusHub are opening... Welcome to the enchanted campus!
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. Main CampusHub UI Grid (z-20) - Scaled for 25% smaller side cards      */}
      {/* ========================================================================= */}
      <main className="relative z-20 mx-auto w-full max-w-7xl flex-1 px-4 sm:px-8 py-2 sm:py-3 flex flex-col justify-between">
        {/* Desktop 3-Column / Mobile Stacked Architecture */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-center flex-1 my-auto">
          {/* Left Column: Attendance Overview & Canteen Pick (25% more compact) */}
          <div className="order-2 lg:order-1 lg:col-span-3 space-y-3.5 w-full max-w-[245px] mx-auto lg:mx-0">
            <AttendanceCard attendance={dynamicAttendance} />
            <CanteenCard canteenPick={mockCanteenPick} />
          </div>

          {/* Center Column: Personalized Hero Banner (Unobstructed focal point) */}
          <div className="order-1 lg:order-2 lg:col-span-6 flex flex-col items-center justify-center my-2 lg:my-0">
            <HeroBanner user={currentUser} />
          </div>

          {/* Right Column: Owl Post & Common Room (25% more compact) */}
          <div className="order-3 lg:order-3 lg:col-span-3 space-y-3.5 w-full max-w-[245px] mx-auto lg:ml-auto lg:mr-0">
            <OwlPostCard summary={mockOwlPost} />
            <CommonRoomCard preview={mockCommonRoom} />
          </div>
        </div>

        {/* ======================================================================= */}
        {/* 4. Bottom Controls: 3 Buttons, Ornate Wisdom Plaque, Daily Quote Button */}
        {/* ======================================================================= */}
        <BottomControls
          quotes={mockQuotes}
          currentThemeId={currentThemeId}
          onThemeChange={setCurrentThemeId}
        />
      </main>
    </div>
  );
}
