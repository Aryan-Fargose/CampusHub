"use client";

import React, { useState } from "react";
import { AttendanceRecord, SubjectAttendance } from "@/types/attendance";
import { History, Trash2, Calendar, Check, X } from "lucide-react";

interface AttendanceHistoryProps {
  records: AttendanceRecord[];
  subjects: SubjectAttendance[];
  onDeleteRecord: (recordId: string) => void;
}

export const AttendanceHistory: React.FC<AttendanceHistoryProps> = ({
  records,
  subjects,
  onDeleteRecord,
}) => {
  const [subjectFilter, setSubjectFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredRecords = records.filter((rec) => {
    if (subjectFilter !== "all" && rec.subjectId !== subjectFilter) {
      return false;
    }
    if (statusFilter !== "all" && rec.status !== statusFilter) {
      return false;
    }
    return true;
  });

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

      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#142834]">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-[#E7C56D]" />
            <h3 className="font-cinzel text-xl sm:text-2xl font-bold tracking-wider text-[#E7C56D]">
              ATTENDANCE CHRONICLE
            </h3>
          </div>
          <p className="text-xs text-[#AFC3CF] font-serif mt-1">
            Chronological audit trail &bull; {records.length} total logged sessions
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Subject Filter */}
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-[#02070e] border border-[#1b3b48] focus:border-[#48D1CC] text-xs font-serif text-[#D6D9D4] outline-none cursor-pointer"
          >
            <option value="all">All Subjects</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-[#02070e] border border-[#1b3b48] focus:border-[#48D1CC] text-xs font-serif text-[#D6D9D4] outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="present">✓ Present Only</option>
            <option value="absent">✕ Absent Only</option>
          </select>
        </div>
      </div>

      {/* History Timeline Stream */}
      <div className="mt-5">
        {filteredRecords.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#9BA9AF] font-serif italic">
            No attendance entries match the current filter selection.
          </div>
        ) : (
          <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1.5">
            {filteredRecords.map((rec) => {
              const isPresent = rec.status === "present";
              return (
                <div
                  key={rec.id}
                  className="group relative flex items-center justify-between p-3 sm:p-3.5 rounded-xl bg-[#030911]/80 hover:bg-[#061320] border border-[#142834] hover:border-[#48D1CC]/50 transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    {/* Status Icon Orb */}
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        isPresent
                          ? "bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                          : "bg-rose-950/80 border border-rose-500/50 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.2)]"
                      }`}
                    >
                      {isPresent ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <X className="w-4 h-4 text-rose-400" />
                      )}
                    </div>

                    {/* Record Info */}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-cinzel text-sm font-semibold text-[#D6D9D4] group-hover:text-white transition-colors">
                          {rec.subjectName}
                        </span>
                        <span
                          className={`text-[10px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${
                            isPresent
                              ? "bg-emerald-950/50 text-emerald-300 border-emerald-500/30"
                              : "bg-rose-950/50 text-rose-300 border-rose-500/30"
                          }`}
                        >
                          {rec.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#9BA9AF] font-mono mt-0.5">
                        <Calendar className="w-3 h-3 text-[#48D1CC]" />
                        <span>{rec.date}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions: Delete/Undo */}
                  <button
                    type="button"
                    onClick={() => onDeleteRecord(rec.id)}
                    title="Undo & recalculate attendance"
                    className="p-1.5 rounded-lg text-[#9BA9AF] hover:text-rose-400 hover:bg-rose-950/30 opacity-60 group-hover:opacity-100 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
