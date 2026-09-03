"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { ParallaxScene } from "@/components/home/ParallaxScene";
import { HeroBanner } from "@/components/home/HeroBanner";
import { AttendanceCard } from "@/components/home/AttendanceCard";
import { CanteenCard } from "@/components/home/CanteenCard";
import { OwlPostCard } from "@/components/home/OwlPostCard";
import { CommonRoomCard } from "@/components/home/CommonRoomCard";
import { BottomControls } from "@/components/home/BottomControls";

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
  const [currentUser] = useState(mockCurrentUser);
  const [currentThemeId, setCurrentThemeId] = useState<ThemeId>("midnight");
  const [exploreAlert, setExploreAlert] = useState(false);

  const handleExploreWorld = () => {
    setExploreAlert(true);
    setTimeout(() => setExploreAlert(false), 3000);
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden bg-[#020509] text-[#f1ede4]">
      {/* ========================================================================= */}
      {/* 1. Cinematic Environment: World, Hover Fog, Embers, Dragon & Owl          */}
      {/* ========================================================================= */}
      <ParallaxScene onExploreWorld={handleExploreWorld} />

      {/* ========================================================================= */}
      {/* 2. Top Navigation Bar (z-50)                                              */}
      {/* ========================================================================= */}
      <Header user={currentUser} />

      {/* Interactive Exploration Feedback Toast */}
      {exploreAlert && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 rounded-full bg-[#041d22]/90 border border-[#2dd4bf] px-6 py-2.5 text-xs font-serif text-[#99f6e4] shadow-[0_0_35px_rgba(45,212,191,0.6)] backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-300">
          ✨ The Gates of CampusHub are opening... Welcome to the enchanted campus!
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. Main CampusHub UI Grid (z-20)                                          */}
      {/* ========================================================================= */}
      <main className="relative z-20 mx-auto w-full max-w-7xl flex-1 px-4 sm:px-8 py-2 sm:py-4 flex flex-col justify-between">
        {/* Desktop 3-Column / Mobile Stacked Architecture */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-center flex-1 my-auto">
          {/* Left Column: Attendance Overview & Canteen Pick */}
          <div className="order-2 lg:order-1 lg:col-span-3 space-y-5">
            <AttendanceCard attendance={mockAttendance} />
            <CanteenCard canteenPick={mockCanteenPick} />
          </div>

          {/* Center Column: Personalized Hero Banner */}
          <div className="order-1 lg:order-2 lg:col-span-6 flex flex-col items-center justify-center my-2 lg:my-0">
            <HeroBanner user={currentUser} />
          </div>

          {/* Right Column: Owl Post & Common Room */}
          <div className="order-3 lg:order-3 lg:col-span-3 space-y-5">
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
