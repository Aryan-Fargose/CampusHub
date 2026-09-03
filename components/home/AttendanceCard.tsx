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
  const radius = 48;
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
        "group relative flex flex-col items-center justify-between rounded-2xl p-5 sm:p-6 transition-all duration-300",
        "bg-[#050c14]/75 hover:bg-[#081522]/85 backdrop-blur-lg",
        "border border-amber-500/25 hover:border-emerald-400/60 shadow-[0_8px_32px_rgba(0,0,0,0.6)] hover:shadow-[0_8px_32px_rgba(16,185,129,0.25)]",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400",
        "hover:-translate-y-1.5 active:translate-y-0",
        className
      )}
    >
      {/* Ornate Corner Pins */}
      <span className="absolute top-2.5 left-2.5 text-[11px] text-amber-400/50 group-hover:text-amber-300 select-none transition-colors">✦</span>
      <span className="absolute top-2.5 right-2.5 text-[11px] text-amber-400/50 group-hover:text-amber-300 select-none transition-colors">✦</span>
      <span className="absolute bottom-2.5 left-2.5 text-[11px] text-amber-400/50 group-hover:text-amber-300 select-none transition-colors">✦</span>
      <span className="absolute bottom-2.5 right-2.5 text-[11px] text-amber-400/50 group-hover:text-amber-300 select-none transition-colors">✦</span>

      {/* Title */}
      <div className="mb-3 text-center">
        <h3 className="font-serif text-[11px] sm:text-xs uppercase tracking-widest text-amber-200/90 group-hover:text-amber-100 transition-colors">
          Attendance Overview
        </h3>
      </div>

      {/* Circular Radial Gauge */}
      <div className="relative flex items-center justify-center my-2">
        <svg className="h-36 w-36 -rotate-90 transform" viewBox="0 0 120 120">
          {/* Background Track */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            className="stroke-slate-800/80 fill-none"
            strokeWidth="7"
          />
          {/* Glowing Emerald Progress Arc */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            className="stroke-emerald-400 fill-none transition-all duration-1000 ease-out drop-shadow-[0_0_10px_#34d399]"
            strokeWidth="7"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>

        {/* Center Percentage & Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="font-serif text-3xl font-bold tracking-tight text-white group-hover:scale-105 transition-transform drop-shadow-md">
            {attendance.percentage}%
          </span>
          <span className="text-[9px] uppercase tracking-widest text-slate-400 font-mono mt-0.5">
            Overall Attendance
          </span>
        </div>
      </div>

      {/* Status Badge & Safe Bunks Count */}
      <div className="mt-3 text-center space-y-1.5">
        <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs font-bold tracking-widest uppercase font-mono shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          {attendance.statusLabel}
        </div>
        <p className="text-xs text-slate-300 font-serif">
          You can bunk{" "}
          <span className="font-semibold text-emerald-300">
            {attendance.safeBunksCount} lectures
          </span>
        </p>
      </div>
    </div>
  );
};
