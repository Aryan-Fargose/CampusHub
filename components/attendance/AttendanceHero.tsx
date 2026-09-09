"use client";

import React from "react";
import Link from "next/link";
import { Plus, ArrowLeft, Sparkles, BookOpen, Calculator, History, Compass } from "lucide-react";

interface AttendanceHeroProps {
  onAddSubject: () => void;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const AttendanceHero: React.FC<AttendanceHeroProps> = ({
  onAddSubject,
  activeSection,
  onSectionChange,
}) => {
  const tabs = [
    { id: "all", label: "Dashboard", icon: BookOpen },
    { id: "calculator", label: "Bunk Calculator", icon: Calculator },
    { id: "history", label: "History Log", icon: History },
    { id: "insights", label: "Academic Insights", icon: Compass },
  ];

  return (
    <div className="relative z-10 w-full pt-4 sm:pt-6 pb-4 sm:pb-6 text-center select-none">
      {/* Top Navigation & Action Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 sm:mb-8">
        {/* Back Link */}
        <Link
          href="/"
          className="group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#040f19]/80 border border-[#E7C56D]/30 hover:border-[#F6E6AE] text-xs font-serif text-[#D6D9D4] hover:text-[#F6E6AE] backdrop-blur-md shadow-[0_4px_16px_rgba(0,0,0,0.6)] transition-all duration-200"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5 text-[#E7C56D]" />
          <span>Return to Great Hall</span>
        </Link>

        {/* Add Subject Quick Action */}
        <button
          type="button"
          onClick={onAddSubject}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#0c2e2e] via-[#093539] to-[#0c2e2e] border border-[#48D1CC]/60 hover:border-[#48D1CC] text-xs font-cinzel font-bold tracking-wider text-[#D6D9D4] hover:text-white shadow-[0_0_18px_rgba(72,209,204,0.35)] hover:shadow-[0_0_24px_rgba(72,209,204,0.55)] transition-all duration-200 cursor-pointer active:scale-95"
        >
          <Plus className="w-3.5 h-3.5 text-[#48D1CC]" />
          <span>ENROLL SUBJECT</span>
        </button>
      </div>

      {/* Hero Title & Ornaments */}
      <div className="relative inline-flex flex-col items-center">
        {/* Subtle Top Flourish */}
        <div className="flex items-center justify-center gap-3 mb-2 opacity-80">
          <span className="h-px w-12 sm:w-20 bg-gradient-to-r from-transparent via-[#E7C56D]/60 to-transparent" />
          <Sparkles className="w-3.5 h-3.5 text-[#E7C56D] animate-pulse" />
          <span className="h-px w-12 sm:w-20 bg-gradient-to-l from-transparent via-[#E7C56D]/60 to-transparent" />
        </div>

        {/* Main "ATTENDANCE" Heading */}
        <h1 className="font-cinzel text-3xl sm:text-5xl md:text-6xl font-bold tracking-[0.22em] sm:tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-b from-[#FFF5D6] via-[#E7C56D] to-[#9B7A2D] drop-shadow-[0_4px_18px_rgba(231,197,109,0.35)]">
          ATTENDANCE
        </h1>

        {/* Subtitle */}
        <p className="mt-2 font-cormorant text-sm sm:text-base md:text-lg tracking-[0.28em] sm:tracking-[0.32em] text-[#AFC3CF] font-medium uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
          EVERY LECTURE LEAVES A TRACE
        </p>

        {/* Subtle Bottom Divider with Diamond */}
        <div className="flex items-center justify-center gap-2 mt-3.5 opacity-70">
          <span className="h-px w-16 sm:w-28 bg-gradient-to-r from-transparent via-[#48D1CC]/40 to-[#48D1CC]/70" />
          <span className="text-[10px] text-[#48D1CC]">✦</span>
          <span className="h-px w-16 sm:w-28 bg-gradient-to-l from-transparent via-[#48D1CC]/40 to-[#48D1CC]/70" />
        </div>
      </div>

      {/* Navigation Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-6 sm:mt-7">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSectionChange(tab.id)}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-serif transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-[#09222c] border border-[#48D1CC] text-[#48D1CC] shadow-[0_0_16px_rgba(72,209,204,0.35)] font-semibold"
                  : "bg-[#040f19]/70 border border-[#1b3b48]/60 text-[#AFC3CF] hover:text-[#D6D9D4] hover:border-[#48D1CC]/40"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#48D1CC]" : "text-[#9BA9AF]"}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
