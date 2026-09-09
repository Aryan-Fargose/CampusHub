"use client";

import React from "react";
import { OverallAttendanceStats } from "@/types/attendance";
import { CheckCircle2, AlertTriangle, XCircle, Target, Layers } from "lucide-react";

interface AttendanceOverviewProps {
  stats: OverallAttendanceStats;
  onTargetChange: (newTarget: number) => void;
}

export const AttendanceOverview: React.FC<AttendanceOverviewProps> = ({
  stats,
  onTargetChange,
}) => {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (Math.min(100, Math.max(0, stats.percentage)) / 100) * circumference;

  // Status visual attributes
  const isSafe = stats.status === "safe";
  const isWarning = stats.status === "warning";

  const statusColor = isSafe
    ? "text-emerald-400"
    : isWarning
    ? "text-amber-300"
    : "text-rose-400";

  const statusBorder = isSafe
    ? "border-emerald-500/40"
    : isWarning
    ? "border-amber-500/40"
    : "border-rose-500/40";

  const statusGlow = isSafe
    ? "shadow-[0_0_25px_rgba(52,211,153,0.25)]"
    : isWarning
    ? "shadow-[0_0_25px_rgba(251,191,36,0.25)]"
    : "shadow-[0_0_25px_rgba(244,63,94,0.25)]";

  const strokeColor = isSafe ? "#34d399" : isWarning ? "#fbbf24" : "#f43f5e";

  const targetOptions = [70, 75, 80, 85];

  return (
    <div
      className={`relative w-full rounded-2xl p-5 sm:p-7 backdrop-blur-xl transition-all duration-300 ${statusGlow} select-none`}
      style={{
        backgroundColor: "rgba(4, 15, 25, 0.86)",
        border: "1px solid rgba(70, 180, 195, 0.35)",
      }}
    >
      {/* Corner Ornate Fantasy Brackets */}
      <span className="absolute top-2 left-2.5 text-xs text-[#48D1CC]/40 select-none">⌜</span>
      <span className="absolute top-2 right-2.5 text-xs text-[#48D1CC]/40 select-none">⌝</span>
      <span className="absolute bottom-2 left-2.5 text-xs text-[#48D1CC]/40 select-none">⌞</span>
      <span className="absolute bottom-2 right-2.5 text-xs text-[#48D1CC]/40 select-none">⌟</span>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: Big Radial Gauge & Status */}
        <div className="lg:col-span-5 flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-6">
          {/* Radial SVG Gauge */}
          <div className="relative flex items-center justify-center shrink-0">
            <svg className="w-36 h-36 sm:w-40 sm:h-40 -rotate-90 transform" viewBox="0 0 130 130">
              {/* Background Track */}
              <circle
                cx="65"
                cy="65"
                r={radius}
                className="stroke-[#0a1e2b] fill-none"
                strokeWidth="9"
              />
              {/* Dynamic Progress Arc */}
              <circle
                cx="65"
                cy="65"
                r={radius}
                stroke={strokeColor}
                className="fill-none transition-all duration-1000 ease-out"
                strokeWidth="9"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                style={{
                  filter: `drop-shadow(0 0 8px ${strokeColor})`,
                }}
              />
            </svg>

            {/* Center Percentage Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="font-cinzel text-3xl sm:text-4xl font-bold tracking-tight text-[#D6D9D4] drop-shadow-md">
                {stats.percentage}%
              </span>
              <span className="text-[10px] uppercase tracking-widest text-[#9BA9AF] font-mono mt-0.5">
                Overall
              </span>
            </div>
          </div>

          {/* Primary Status & Headline */}
          <div className="text-center sm:text-left space-y-2">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-cinzel font-bold tracking-widest uppercase border ${statusBorder} ${statusColor} bg-[#020509]/60`}
              >
                {isSafe ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : isWarning ? (
                  <AlertTriangle className="w-3.5 h-3.5" />
                ) : (
                  <XCircle className="w-3.5 h-3.5" />
                )}
                <span>{stats.status.toUpperCase()}</span>
              </span>
            </div>

            <h3 className="font-cinzel text-lg sm:text-xl font-semibold text-[#F6E6AE]">
              {isSafe
                ? "Academic Standing Secure"
                : isWarning
                ? "Attendance Near Threshold"
                : "Attendance Critical Warning"}
            </h3>

            <p className="text-xs sm:text-sm text-[#AFC3CF] font-serif max-w-xs">
              {stats.percentage >= stats.targetPercentage ? (
                <>
                  You can safely miss{" "}
                  <span className="font-bold text-emerald-300">
                    {stats.safeBunks} lecture{stats.safeBunks === 1 ? "" : "s"}
                  </span>{" "}
                  across all courses while staying above your {stats.targetPercentage}% target.
                </>
              ) : (
                <>
                  You must attend the next{" "}
                  <span className="font-bold text-rose-300">
                    {stats.requiredLectures} lecture{stats.requiredLectures === 1 ? "" : "s"}
                  </span>{" "}
                  to restore your standing to {stats.targetPercentage}%.
                </>
              )}
            </p>
          </div>
        </div>

        {/* Right Column: Key Metric Grid & Target Selector */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-4">
          {/* 4 Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Attended */}
            <div className="rounded-xl p-3 bg-[#020a12]/70 border border-[#1b3b48]/60 text-center">
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#9BA9AF]">
                Attended
              </span>
              <div className="font-cinzel text-xl sm:text-2xl font-bold text-emerald-400 mt-0.5">
                {stats.present}
              </div>
              <span className="text-[10px] text-[#AFC3CF] font-serif">Lectures</span>
            </div>

            {/* Missed */}
            <div className="rounded-xl p-3 bg-[#020a12]/70 border border-[#1b3b48]/60 text-center">
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#9BA9AF]">
                Missed
              </span>
              <div className="font-cinzel text-xl sm:text-2xl font-bold text-rose-400 mt-0.5">
                {stats.absent}
              </div>
              <span className="text-[10px] text-[#AFC3CF] font-serif">Lectures</span>
            </div>

            {/* Total Classes */}
            <div className="rounded-xl p-3 bg-[#020a12]/70 border border-[#1b3b48]/60 text-center">
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#9BA9AF]">
                Total Classes
              </span>
              <div className="font-cinzel text-xl sm:text-2xl font-bold text-[#D6D9D4] mt-0.5">
                {stats.total}
              </div>
              <span className="text-[10px] text-[#AFC3CF] font-serif">Conducted</span>
            </div>

            {/* Safe Bunks */}
            <div className="rounded-xl p-3 bg-[#020a12]/70 border border-[#1b3b48]/60 text-center">
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#9BA9AF]">
                Safe to Bunk
              </span>
              <div className="font-cinzel text-xl sm:text-2xl font-bold text-[#48D1CC] mt-0.5">
                {stats.safeBunks}
              </div>
              <span className="text-[10px] text-[#AFC3CF] font-serif">Allowed</span>
            </div>
          </div>

          {/* Bottom Bar: Target Percentage Controls & Subject Counts */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#142834]/80 text-xs">
            {/* Subjects count badge */}
            <div className="flex items-center gap-2 text-[#AFC3CF]">
              <Layers className="w-3.5 h-3.5 text-[#E7C56D]" />
              <span>
                <strong className="text-[#D6D9D4]">{stats.subjectsCount}</strong> Subjects Enrolled
              </span>
              {stats.subjectsBelowTarget > 0 && (
                <span className="ml-1 px-2 py-0.5 rounded bg-rose-950/60 border border-rose-600/40 text-rose-300 text-[10px]">
                  {stats.subjectsBelowTarget} below {stats.targetPercentage}%
                </span>
              )}
            </div>

            {/* Target Attendance Selector */}
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-[#9BA9AF] text-[11px] font-mono uppercase">
                <Target className="w-3 h-3 text-[#48D1CC]" />
                Target:
              </span>
              <div className="inline-flex rounded-lg bg-[#020509]/80 p-0.5 border border-[#1b3b48]">
                {targetOptions.map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => onTargetChange(pct)}
                    className={`px-2.5 py-1 text-xs font-mono rounded transition-all cursor-pointer ${
                      stats.targetPercentage === pct
                        ? "bg-[#0c2e36] text-[#48D1CC] font-bold border border-[#48D1CC]/50 shadow-[0_0_8px_rgba(72,209,204,0.4)]"
                        : "text-[#9BA9AF] hover:text-[#D6D9D4]"
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
