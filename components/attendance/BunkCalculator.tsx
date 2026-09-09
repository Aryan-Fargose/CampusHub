"use client";

import React, { useState, useMemo } from "react";
import { SubjectAttendance } from "@/types/attendance";
import {
  calculatePercentage,
  calculateSafeBunks,
  calculateRequiredLectures,
  getAttendanceStatus,
} from "@/lib/attendanceStorage";
import { Calculator, ShieldCheck, AlertOctagon, TrendingUp, TrendingDown, RefreshCw } from "lucide-react";

interface BunkCalculatorProps {
  subjects: SubjectAttendance[];
  defaultTarget: number;
}

export const BunkCalculator: React.FC<BunkCalculatorProps> = ({
  subjects,
  defaultTarget,
}) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("all");
  const [target, setTarget] = useState<number>(defaultTarget);

  // What-if simulator states
  const [simulatedBunks, setSimulatedBunks] = useState<number>(1);
  const [simulatedAttends, setSimulatedAttends] = useState<number>(1);

  // Derive present, absent, total
  const { name, present, total } = useMemo(() => {
    if (selectedSubjectId === "all") {
      const p = subjects.reduce((sum, s) => sum + s.present, 0);
      const a = subjects.reduce((sum, s) => sum + s.absent, 0);
      return {
        name: "Overall (All Subjects Combined)",
        present: p,
        total: p + a,
      };
    }
    const found = subjects.find((s) => s.id === selectedSubjectId);
    if (found) {
      return {
        name: found.name,
        present: found.present,
        total: found.total,
      };
    }
    return { name: "Selected Subject", present: 0, total: 0 };
  }, [selectedSubjectId, subjects]);

  const currentPercentage = calculatePercentage(present, total);
  const safeBunks = calculateSafeBunks(present, total, target);
  const requiredLectures = calculateRequiredLectures(present, total, target);
  const status = getAttendanceStatus(currentPercentage, target, safeBunks);

  // Simulation calculations
  // If I bunk 'simulatedBunks' lectures:
  const afterBunkTotal = total + simulatedBunks;
  const afterBunkPct = calculatePercentage(present, afterBunkTotal);

  // If I attend 'simulatedAttends' lectures:
  const afterAttendPresent = present + simulatedAttends;
  const afterAttendTotal = total + simulatedAttends;
  const afterAttendPct = calculatePercentage(afterAttendPresent, afterAttendTotal);

  const targetPresets = [70, 75, 80, 85, 90];

  return (
    <div
      className="relative w-full rounded-2xl p-5 sm:p-7 backdrop-blur-xl border border-[#48D1CC]/30 select-none shadow-[0_10px_35px_rgba(0,0,0,0.8)]"
      style={{
        backgroundColor: "rgba(4, 15, 25, 0.88)",
      }}
    >
      {/* Corner Ornaments */}
      <span className="absolute top-2 left-2.5 text-xs text-[#48D1CC]/40 select-none">⌜</span>
      <span className="absolute top-2 right-2.5 text-xs text-[#48D1CC]/40 select-none">⌝</span>
      <span className="absolute bottom-2 left-2.5 text-xs text-[#48D1CC]/40 select-none">⌞</span>
      <span className="absolute bottom-2 right-2.5 text-xs text-[#48D1CC]/40 select-none">⌟</span>

      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#142834]">
        <div>
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-[#E7C56D]" />
            <h3 className="font-cinzel text-xl sm:text-2xl font-bold tracking-wider text-[#E7C56D]">
              BUNK CALCULATOR
            </h3>
          </div>
          <p className="text-xs text-[#AFC3CF] font-serif mt-1">
            Dynamic margin forecaster &bull; Instant bunk tolerance analysis
          </p>
        </div>

        {/* Subject Selector Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-mono text-[#9BA9AF] uppercase whitespace-nowrap">
            Select Course:
          </label>
          <select
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-[#02070e] border border-[#1b3b48] focus:border-[#48D1CC] text-xs font-serif text-[#D6D9D4] outline-none cursor-pointer"
          >
            <option value="all">⚡ All Courses Combined</option>
            {subjects.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name} ({calculatePercentage(sub.present, sub.total)}%)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Target Setting Bar */}
      <div className="my-5 p-3.5 rounded-xl bg-[#020a13] border border-[#1b3b48] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase text-[#AFC3CF]">Target Attendance:</span>
          <span className="font-cinzel text-base font-bold text-[#48D1CC]">{target}%</span>
        </div>

        <div className="flex items-center gap-1.5">
          {targetPresets.map((pct) => (
            <button
              key={pct}
              type="button"
              onClick={() => setTarget(pct)}
              className={`px-2.5 py-1 text-xs font-mono rounded transition-all cursor-pointer ${
                target === pct
                  ? "bg-[#0c2e36] text-[#48D1CC] font-bold border border-[#48D1CC]/60 shadow-[0_0_8px_rgba(72,209,204,0.3)]"
                  : "bg-[#040f19] border border-[#1b3b48] text-[#9BA9AF] hover:text-[#D6D9D4]"
              }`}
            >
              {pct}%
            </button>
          ))}
        </div>
      </div>

      {/* Primary Answers: Two Big Verdict Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Answer 1: Safe to Bunk */}
        <div className="relative rounded-xl p-5 bg-[#031518]/80 border border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.15)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 flex items-center gap-1.5 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                HOW MANY CAN I SAFELY MISS?
              </span>
              <span className="text-[10px] font-mono text-[#9BA9AF]">Target: {target}%</span>
            </div>

            <div className="mt-3 font-cinzel text-4xl sm:text-5xl font-bold tracking-tight text-emerald-300">
              {safeBunks} <span className="text-xl sm:text-2xl font-serif font-normal text-emerald-400/80">LECTURES</span>
            </div>
          </div>

          <p className="mt-3 text-xs text-[#AFC3CF] font-serif leading-relaxed">
            {currentPercentage >= target ? (
              safeBunks > 0 ? (
                <>
                  You can safely miss the next{" "}
                  <strong className="text-emerald-300">{safeBunks}</strong> lecture
                  {safeBunks === 1 ? "" : "s"} in {name} and your attendance will not drop below{" "}
                  {target}%.
                </>
              ) : (
                "You are at or near the boundary. Any missed lecture will push you below target."
              )
            ) : (
              "You are currently below target. No safe bunks are permitted until you recover your standing."
            )}
          </p>
        </div>

        {/* Answer 2: How Many to Attend */}
        <div className="relative rounded-xl p-5 bg-[#1f0b12]/80 border border-rose-500/40 shadow-[0_0_20px_rgba(244,63,94,0.15)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-widest text-rose-400 flex items-center gap-1.5 font-bold">
                <AlertOctagon className="w-4 h-4 text-rose-400" />
                HOW MANY MUST I ATTEND?
              </span>
              <span className="text-[10px] font-mono text-[#9BA9AF]">Target: {target}%</span>
            </div>

            <div className="mt-3 font-cinzel text-4xl sm:text-5xl font-bold tracking-tight text-rose-300">
              {requiredLectures}{" "}
              <span className="text-xl sm:text-2xl font-serif font-normal text-rose-400/80">
                LECTURES
              </span>
            </div>
          </div>

          <p className="mt-3 text-xs text-[#AFC3CF] font-serif leading-relaxed">
            {currentPercentage >= target ? (
              <>
                You are currently above your target ({currentPercentage}%). Attend consecutive lectures to build a larger safety margin.
              </>
            ) : (
              <>
                You are below target ({currentPercentage}%). You must attend the next{" "}
                <strong className="text-rose-300">{requiredLectures}</strong> consecutive lecture
                {requiredLectures === 1 ? "" : "s"} without missing any to restore your attendance to{" "}
                {target}%.
              </>
            )}
          </p>
        </div>
      </div>

      {/* Interactive What-If Scenario Forecaster */}
      <div className="p-4 sm:p-5 rounded-xl bg-[#02070e]/90 border border-[#1b3b48]">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-cinzel text-xs font-bold uppercase tracking-wider text-[#AFC3CF] flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5 text-[#48D1CC]" />
            What-If Scenario Forecaster
          </h4>
          <span className="text-[11px] font-mono text-[#9BA9AF]">
            Current: {present}/{total} ({currentPercentage}%) &bull;{" "}
            <span
              className={`uppercase font-bold ${
                status === "safe"
                  ? "text-emerald-400"
                  : status === "warning"
                  ? "text-amber-400"
                  : "text-rose-400"
              }`}
            >
              {status}
            </span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* If I bunk X classes */}
          <div className="p-3.5 rounded-lg bg-[#040f19] border border-[#142834] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#D6D9D4] font-serif flex items-center gap-1">
                <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
                If I bunk:
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setSimulatedBunks(Math.max(1, simulatedBunks - 1))}
                  className="w-6 h-6 rounded bg-[#07131e] border border-[#1b3b48] text-xs font-bold hover:text-white cursor-pointer"
                >
                  -
                </button>
                <span className="w-8 text-center font-mono font-bold text-xs text-rose-300">
                  {simulatedBunks}
                </span>
                <button
                  type="button"
                  onClick={() => setSimulatedBunks(simulatedBunks + 1)}
                  className="w-6 h-6 rounded bg-[#07131e] border border-[#1b3b48] text-xs font-bold hover:text-white cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            <div className="pt-2 border-t border-[#142834] flex items-center justify-between text-xs font-mono">
              <span className="text-[#9BA9AF]">Projected Result:</span>
              <span
                className={`font-bold ${
                  afterBunkPct >= target ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {afterBunkPct}% ({present}/{afterBunkTotal})
              </span>
            </div>
          </div>

          {/* If I attend next Y classes */}
          <div className="p-3.5 rounded-lg bg-[#040f19] border border-[#142834] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#D6D9D4] font-serif flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                If I attend next:
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setSimulatedAttends(Math.max(1, simulatedAttends - 1))}
                  className="w-6 h-6 rounded bg-[#07131e] border border-[#1b3b48] text-xs font-bold hover:text-white cursor-pointer"
                >
                  -
                </button>
                <span className="w-8 text-center font-mono font-bold text-xs text-emerald-300">
                  {simulatedAttends}
                </span>
                <button
                  type="button"
                  onClick={() => setSimulatedAttends(simulatedAttends + 1)}
                  className="w-6 h-6 rounded bg-[#07131e] border border-[#1b3b48] text-xs font-bold hover:text-white cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            <div className="pt-2 border-t border-[#142834] flex items-center justify-between text-xs font-mono">
              <span className="text-[#9BA9AF]">Projected Result:</span>
              <span
                className={`font-bold ${
                  afterAttendPct >= target ? "text-emerald-400" : "text-amber-400"
                }`}
              >
                {afterAttendPct}% ({afterAttendPresent}/{afterAttendTotal})
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
