"use client";

import React from "react";
import { AttendanceSummary } from "@/types";
import { cn } from "@/lib/utils";

export interface AttendanceCardProps {
  attendance: AttendanceSummary;
  className?: string;
}

export const AttendanceCard: React.FC<AttendanceCardProps> = ({
  attendance,
  className,
}) => {
  // Proportional 25% scale down: radius 39, stroke 6
  const radius = 39;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (attendance.percentage / 100) * circumference;

  return (
    <div
      id="attendance-preview"
      tabIndex={0}
      role="region"
      aria-label="Attendance Overview"
      className={cn(
        "group relative flex flex-col items-center justify-between rounded-xl p-3.5 sm:p-4 select-none",
        "backdrop-blur-md transition-all duration-300 ease-out",
        "shadow-[0_6px_24px_rgba(0,0,0,0.8)] hover:shadow-[0_12px_32px_rgba(72,209,204,0.28)]",
        "hover:-translate-y-1.5 active:translate-y-0 cursor-pointer",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#48D1CC]",
        className
      )}
      style={{
        backgroundColor: "rgba(4, 15, 25, 0.88)",
        border: "1px solid rgba(70, 180, 195, 0.35)",
      }}
    >
      {/* Ornate Corner Fantasy Brackets with hover animation */}
      <span className="absolute top-1.5 left-2 text-[9px] text-[#48D1CC]/50 group-hover:text-[#48D1CC] group-hover:scale-110 select-none transition-all duration-300">⌜</span>
      <span className="absolute top-1.5 right-2 text-[9px] text-[#48D1CC]/50 group-hover:text-[#48D1CC] group-hover:scale-110 select-none transition-all duration-300">⌝</span>
      <span className="absolute bottom-1.5 left-2 text-[9px] text-[#48D1CC]/50 group-hover:text-[#48D1CC] group-hover:scale-110 select-none transition-all duration-300">⌞</span>
      <span className="absolute bottom-1.5 right-2 text-[9px] text-[#48D1CC]/50 group-hover:text-[#48D1CC] group-hover:scale-110 select-none transition-all duration-300">⌟</span>

      {/* Title */}
      <div className="mb-1 text-center">
        <h3 className="font-cinzel text-[10px] font-bold uppercase tracking-[0.2em] text-[#AFC3CF] group-hover:text-white transition-colors duration-300">
          Attendance Overview
        </h3>
      </div>

      {/* Circular Radial Gauge */}
      <div className="relative flex items-center justify-center my-1.5">
        <svg className="h-26 w-26 sm:h-28 sm:w-28 -rotate-90 transform" viewBox="0 0 100 100">
          {/* Subtle Background Track */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            className="stroke-[#091a24] fill-none"
            strokeWidth="6"
          />
          {/* Luminous Neon Cyan Progress Arc with dynamic hover glow */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            className="stroke-[#48D1CC] fill-none transition-all duration-1000 ease-out drop-shadow-[0_0_8px_rgba(72,209,204,0.6)] group-hover:drop-shadow-[0_0_14px_rgba(72,209,204,0.9)]"
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>

        {/* Center Percentage & Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="font-cinzel text-2xl font-bold tracking-tight text-[#D6D9D4] group-hover:scale-105 transition-transform duration-300 drop-shadow-sm">
            {attendance.percentage}%
          </span>
          <span className="text-[8px] uppercase tracking-widest text-[#9BA9AF] font-mono">
            Overall Attendance
          </span>
        </div>
      </div>

      {/* Status Label & Safe Bunks Count */}
      <div className="mt-1 text-center space-y-0.5">
        <div className="font-cinzel text-xs font-bold tracking-[0.2em] text-[#48D1CC] uppercase drop-shadow-[0_0_6px_rgba(72,209,204,0.5)] group-hover:scale-105 transition-transform duration-300">
          {attendance.statusLabel}
        </div>
        <p className="text-[11px] text-[#9BA9AF] font-serif">
          You can bunk{" "}
          <span className="font-semibold text-[#D6D9D4]">
            {attendance.safeBunksCount} lectures
          </span>
        </p>
      </div>
    </div>
  );
};
