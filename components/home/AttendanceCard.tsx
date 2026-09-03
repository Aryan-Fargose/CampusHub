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
  const radius = 52;
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
        "group relative flex flex-col items-center justify-between rounded-xl p-5 sm:p-6 transition-all duration-300 select-none",
        "bg-[#030912]/80 hover:bg-[#05111c]/90 backdrop-blur-md",
        "border border-[#1a3843]/70 hover:border-[#2dd4bf]/60 shadow-[0_8px_32px_rgba(0,0,0,0.85)] hover:shadow-[0_8px_32px_rgba(45,212,191,0.25)]",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2dd4bf]",
        "hover:-translate-y-1 active:translate-y-0",
        className
      )}
    >
      {/* Ornate Corner Fantasy Brackets */}
      <span className="absolute top-2 left-2 text-[10px] text-[#2dd4bf]/40 group-hover:text-[#2dd4bf] select-none transition-colors">⌜</span>
      <span className="absolute top-2 right-2 text-[10px] text-[#2dd4bf]/40 group-hover:text-[#2dd4bf] select-none transition-colors">⌝</span>
      <span className="absolute bottom-2 left-2 text-[10px] text-[#2dd4bf]/40 group-hover:text-[#2dd4bf] select-none transition-colors">⌞</span>
      <span className="absolute bottom-2 right-2 text-[10px] text-[#2dd4bf]/40 group-hover:text-[#2dd4bf] select-none transition-colors">⌟</span>

      {/* Title */}
      <div className="mb-2 text-center">
        <h3 className="font-cinzel text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#93bcc4] group-hover:text-[#cceef4] transition-colors">
          Attendance Overview
        </h3>
      </div>

      {/* Circular Radial Gauge */}
      <div className="relative flex items-center justify-center my-2">
        <svg className="h-36 w-36 -rotate-90 transform" viewBox="0 0 130 130">
          {/* Subtle Background Track */}
          <circle
            cx="65"
            cy="65"
            r={radius}
            className="stroke-[#091a24] fill-none"
            strokeWidth="8"
          />
          {/* Luminous Neon Cyan Progress Arc */}
          <circle
            cx="65"
            cy="65"
            r={radius}
            className="stroke-[#2dd4bf] fill-none transition-all duration-1000 ease-out drop-shadow-[0_0_14px_#2dd4bf]"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>

        {/* Center Percentage & Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="font-cinzel text-3xl sm:text-4xl font-bold tracking-tight text-white drop-shadow-md">
            {attendance.percentage}%
          </span>
          <span className="text-[9px] uppercase tracking-widest text-[#7a9ba6] font-mono mt-0.5">
            Overall Attendance
          </span>
        </div>
      </div>

      {/* Status Label & Safe Bunks Count */}
      <div className="mt-2 text-center space-y-1">
        <div className="font-cinzel text-sm sm:text-base font-bold tracking-[0.25em] text-[#34d399] uppercase drop-shadow-[0_0_10px_rgba(52,211,153,0.6)]">
          {attendance.statusLabel}
        </div>
        <p className="text-xs text-[#9bb3ba] font-serif">
          You can bunk{" "}
          <span className="font-semibold text-[#e2e8f0]">
            {attendance.safeBunksCount} lectures
          </span>
        </p>
      </div>
    </div>
  );
};
