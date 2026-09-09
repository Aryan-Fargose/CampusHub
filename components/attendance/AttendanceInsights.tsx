"use client";

import React, { useMemo } from "react";
import { SubjectAttendance, OverallAttendanceStats } from "@/types/attendance";
import {
  calculatePercentage,
  calculateSafeBunks,
  calculateRequiredLectures,
} from "@/lib/attendanceStorage";
import { Sparkles, ShieldCheck, AlertTriangle, Award, Flame } from "lucide-react";

interface AttendanceInsightsProps {
  stats: OverallAttendanceStats;
  subjects: SubjectAttendance[];
}

export const AttendanceInsights: React.FC<AttendanceInsightsProps> = ({
  stats,
  subjects,
}) => {
  const insights = useMemo(() => {
    const list: Array<{
      type: "safe" | "warning" | "achievement" | "info";
      title: string;
      description: string;
      icon: typeof Sparkles;
    }> = [];

    if (subjects.length === 0) return list;

    // 1. Overall Standing Insight
    if (stats.percentage >= stats.targetPercentage) {
      list.push({
        type: "safe",
        title: "Academic Standing Fully Secured",
        description: `Your overall attendance is currently at ${stats.percentage}%, exceeding your ${stats.targetPercentage}% target. You can safely miss up to ${stats.safeBunks} lectures in total without dropping below threshold.`,
        icon: ShieldCheck,
      });
    } else {
      list.push({
        type: "warning",
        title: "Overall Attendance Below Threshold",
        description: `Your aggregate attendance is ${stats.percentage}%. You need ${stats.requiredLectures} consecutive attended lectures across subjects to restore standing above ${stats.targetPercentage}%.`,
        icon: AlertTriangle,
      });
    }

    // 2. Highest Performing Subject
    const sortedByPct = [...subjects].sort(
      (a, b) =>
        calculatePercentage(b.present, b.total) -
        calculatePercentage(a.present, a.total)
    );
    const topSubject = sortedByPct[0];
    if (topSubject && topSubject.total > 0) {
      const topPct = calculatePercentage(topSubject.present, topSubject.total);
      list.push({
        type: "achievement",
        title: `Distinction in ${topSubject.name}`,
        description: `${topSubject.name} holds your highest record at ${topPct}% (${topSubject.present}/${topSubject.total} lectures). You have ${calculateSafeBunks(topSubject.present, topSubject.total, topSubject.targetPercentage)} safe bunks available in this course.`,
        icon: Award,
      });
    }

    // 3. Vulnerable Subjects needing attention
    const vulnerable = subjects.filter((s) => {
      const pct = calculatePercentage(s.present, s.total);
      return pct < s.targetPercentage;
    });

    if (vulnerable.length > 0) {
      vulnerable.forEach((sub) => {
        const req = calculateRequiredLectures(
          sub.present,
          sub.total,
          sub.targetPercentage
        );
        const curPct = calculatePercentage(sub.present, sub.total);
        list.push({
          type: "warning",
          title: `Action Required: ${sub.name}`,
          description: `Current attendance is ${curPct}%, below the ${sub.targetPercentage}% target. Attend the next ${req} consecutive lecture${req > 1 ? "s" : ""} to return to safety.`,
          icon: AlertTriangle,
        });
      });
    } else {
      // If no vulnerable subject, check subjects close to the edge (safeBunks <= 1)
      const borderline = subjects.filter((s) => {
        const safe = calculateSafeBunks(s.present, s.total, s.targetPercentage);
        return safe <= 1;
      });

      if (borderline.length > 0) {
        borderline.forEach((sub) => {
          list.push({
            type: "info",
            title: `Borderline Margin: ${sub.name}`,
            description: `You have only ${calculateSafeBunks(sub.present, sub.total, sub.targetPercentage)} safe bunk remaining in ${sub.name}. Missing the next class will risk dropping below your ${sub.targetPercentage}% target.`,
            icon: Flame,
          });
        });
      }
    }

    // 4. General Wisdom
    list.push({
      type: "info",
      title: "Semester Attendance Strategy",
      description:
        "Consistent attendance early in the academic term maximizes safe bunk margins during exam preparation and project submission deadlines.",
      icon: Sparkles,
    });

    return list;
  }, [stats, subjects]);

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

      <div className="pb-4 border-b border-[#142834]">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#E7C56D]" />
          <h3 className="font-cinzel text-xl sm:text-2xl font-bold tracking-wider text-[#E7C56D]">
            ACADEMIC INSIGHTS & SIGNALS
          </h3>
        </div>
        <p className="text-xs text-[#AFC3CF] font-serif mt-1">
          Automated academic intelligence generated from your live attendance telemetry
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
        {insights.map((item, idx) => {
          const Icon = item.icon;
          const isSafe = item.type === "safe";
          const isWarning = item.type === "warning";
          const isAchievement = item.type === "achievement";

          const cardBorder = isSafe
            ? "border-emerald-500/40 bg-[#041d1a]/80"
            : isWarning
            ? "border-rose-500/40 bg-[#240c14]/80"
            : isAchievement
            ? "border-[#E7C56D]/40 bg-[#1e170a]/80"
            : "border-[#1b3b48] bg-[#040f19]/80";

          const iconColor = isSafe
            ? "text-emerald-400"
            : isWarning
            ? "text-rose-400"
            : isAchievement
            ? "text-[#E7C56D]"
            : "text-[#48D1CC]";

          return (
            <div
              key={idx}
              className={`p-4 rounded-xl border ${cardBorder} flex items-start gap-3.5 shadow-sm`}
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#020509]/60 border border-white/10 ${iconColor}`}
              >
                <Icon className="w-4.5 h-4.5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-cinzel text-sm font-bold text-[#D6D9D4]">{item.title}</h4>
                <p className="text-xs text-[#AFC3CF] font-serif leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
