"use client";

import React, { useState } from "react";
import { SubjectAttendance } from "@/types/attendance";
import {
  calculatePercentage,
  calculateSafeBunks,
  calculateRequiredLectures,
  getAttendanceStatus,
} from "@/lib/attendanceStorage";
import { Check, X, ChevronRight } from "lucide-react";

interface SubjectCardProps {
  subject: SubjectAttendance;
  onMarkPresent: (subjectId: string) => void;
  onMarkAbsent: (subjectId: string) => void;
  onOpenDetail: (subject: SubjectAttendance) => void;
}

export const SubjectCard: React.FC<SubjectCardProps> = ({
  subject,
  onMarkPresent,
  onMarkAbsent,
  onOpenDetail,
}) => {
  const [justMarked, setJustMarked] = useState<"present" | "absent" | null>(null);

  const percentage = calculatePercentage(subject.present, subject.total);
  const safeBunks = calculateSafeBunks(
    subject.present,
    subject.total,
    subject.targetPercentage
  );
  const requiredLectures = calculateRequiredLectures(
    subject.present,
    subject.total,
    subject.targetPercentage
  );
  const status = getAttendanceStatus(percentage, subject.targetPercentage, safeBunks);

  const isSafe = status === "safe";
  const isWarning = status === "warning";

  // Visual accents based on health
  const statusBorder = isSafe
    ? "border-[#48D1CC]/30 hover:border-[#48D1CC]/70"
    : isWarning
    ? "border-amber-500/40 hover:border-amber-400/80"
    : "border-rose-500/50 hover:border-rose-400";

  const statusBadgeColor = isSafe
    ? "bg-emerald-950/60 text-emerald-300 border-emerald-500/40"
    : isWarning
    ? "bg-amber-950/60 text-amber-300 border-amber-500/40"
    : "bg-rose-950/60 text-rose-300 border-rose-500/40";

  const progressGradient = isSafe
    ? "from-teal-500 to-emerald-400"
    : isWarning
    ? "from-amber-600 to-amber-400"
    : "from-rose-600 to-rose-400";

  const handlePresent = (e: React.MouseEvent) => {
    e.stopPropagation();
    setJustMarked("present");
    onMarkPresent(subject.id);
    setTimeout(() => setJustMarked(null), 700);
  };

  const handleAbsent = (e: React.MouseEvent) => {
    e.stopPropagation();
    setJustMarked("absent");
    onMarkAbsent(subject.id);
    setTimeout(() => setJustMarked(null), 700);
  };

  return (
    <div
      onClick={() => onOpenDetail(subject)}
      tabIndex={0}
      role="button"
      aria-label={`Subject card for ${subject.name}`}
      className={`group relative flex flex-col justify-between rounded-xl p-4 sm:p-5 backdrop-blur-md transition-all duration-200 cursor-pointer select-none shadow-[0_6px_24px_rgba(0,0,0,0.7)] hover:shadow-[0_10px_32px_rgba(72,209,204,0.22)] hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#48D1CC] ${statusBorder}`}
      style={{
        backgroundColor: "rgba(4, 15, 25, 0.88)",
      }}
    >
      {/* Ornate Corner Fantasy Brackets */}
      <span className="absolute top-1.5 left-2 text-[10px] text-[#48D1CC]/40 group-hover:text-[#48D1CC] transition-colors select-none">⌜</span>
      <span className="absolute top-1.5 right-2 text-[10px] text-[#48D1CC]/40 group-hover:text-[#48D1CC] transition-colors select-none">⌝</span>
      <span className="absolute bottom-1.5 left-2 text-[10px] text-[#48D1CC]/40 group-hover:text-[#48D1CC] transition-colors select-none">⌞</span>
      <span className="absolute bottom-1.5 right-2 text-[10px] text-[#48D1CC]/40 group-hover:text-[#48D1CC] transition-colors select-none">⌟</span>

      {/* Temporary action feedback badge */}
      {justMarked && (
        <div
          className={`absolute -top-3 right-4 z-20 px-3 py-0.5 rounded-full text-xs font-mono font-bold tracking-wider animate-bounce ${
            justMarked === "present"
              ? "bg-emerald-500 text-black shadow-[0_0_12px_#10b981]"
              : "bg-rose-500 text-white shadow-[0_0_12px_#f43f5e]"
          }`}
        >
          {justMarked === "present" ? "+1 PRESENT" : "+1 ABSENT"}
        </div>
      )}

      {/* Card Header: Subject Name, Code & Status Badge */}
      <div>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0 pr-2">
            <h4 className="font-cinzel text-base sm:text-lg font-bold tracking-wide text-[#E7C56D] group-hover:text-[#FFF5D6] transition-colors truncate">
              {subject.name}
            </h4>
            <div className="flex items-center gap-2 mt-0.5 text-xs text-[#9BA9AF] font-serif">
              {subject.code && (
                <span className="font-mono text-[10px] text-[#48D1CC] tracking-wider px-1.5 py-0.5 rounded bg-[#09222c] border border-[#1b3b48]">
                  {subject.code}
                </span>
              )}
              {subject.professor && (
                <span className="truncate italic text-[11px] text-[#AFC3CF]">
                  {subject.professor}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span
              className={`px-2 py-0.5 text-[10px] font-cinzel font-bold tracking-widest uppercase rounded border ${statusBadgeColor}`}
            >
              {status}
            </span>
            <ChevronRight className="w-4 h-4 text-[#9BA9AF] group-hover:text-[#48D1CC] group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>

        {/* Attendance Statistics Block */}
        <div className="mt-4 flex items-baseline justify-between">
          <div>
            <div className="font-cinzel text-3xl sm:text-4xl font-bold tracking-tight text-[#D6D9D4] group-hover:scale-105 transition-transform">
              {percentage}%
            </div>
            <p className="text-[11px] font-mono text-[#9BA9AF] mt-0.5">
              <span className="text-emerald-400 font-bold">{subject.present}</span>
              {" / "}
              <span className="text-[#D6D9D4]">{subject.total}</span> attended
            </p>
          </div>

          {/* Safe bunks / Required lectures pill */}
          <div className="text-right">
            {percentage >= subject.targetPercentage ? (
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#9BA9AF]">
                  Safe to miss
                </span>
                <div className="text-xs sm:text-sm font-cinzel font-bold text-[#48D1CC]">
                  {safeBunks} {safeBunks === 1 ? "lecture" : "lectures"}
                </div>
              </div>
            ) : (
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-mono tracking-wider text-rose-300">
                  Attend next
                </span>
                <div className="text-xs sm:text-sm font-cinzel font-bold text-rose-400">
                  {requiredLectures} {requiredLectures === 1 ? "lecture" : "lectures"}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar with Target Marker */}
        <div className="mt-3.5 space-y-1">
          <div className="relative h-2 w-full rounded-full bg-[#081722] overflow-hidden">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${progressGradient} transition-all duration-500`}
              style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
            />
            {/* Target 75% tick marker */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-amber-400/80 z-10 shadow-[0_0_4px_#fbbf24]"
              style={{ left: `${subject.targetPercentage}%` }}
              title={`Target: ${subject.targetPercentage}%`}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] text-[#9BA9AF] font-mono">
            <span>Target: {subject.targetPercentage}%</span>
            <span>
              {percentage >= subject.targetPercentage
                ? "Above target"
                : `${Math.round((subject.targetPercentage - percentage) * 10) / 10}% below`}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Action Controls: [ PRESENT ] and [ ABSENT ] */}
      <div className="mt-4 pt-3 border-t border-[#142834]/80 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={handlePresent}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#082823] hover:bg-[#0c3932] active:bg-[#124d43] border border-emerald-500/40 hover:border-emerald-400 text-xs font-mono font-bold tracking-wider text-emerald-300 hover:text-white transition-all shadow-[0_0_10px_rgba(16,185,129,0.15)] hover:shadow-[0_0_15px_rgba(16,185,129,0.35)] cursor-pointer"
        >
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>PRESENT</span>
        </button>

        <button
          type="button"
          onClick={handleAbsent}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#270e14] hover:bg-[#38131d] active:bg-[#4a1826] border border-rose-500/40 hover:border-rose-400 text-xs font-mono font-bold tracking-wider text-rose-300 hover:text-white transition-all shadow-[0_0_10px_rgba(244,63,94,0.15)] hover:shadow-[0_0_15px_rgba(244,63,94,0.35)] cursor-pointer"
        >
          <X className="w-3.5 h-3.5 text-rose-400" />
          <span>ABSENT</span>
        </button>
      </div>
    </div>
  );
};
