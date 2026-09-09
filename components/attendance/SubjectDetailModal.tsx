"use client";

import React, { useState } from "react";
import { SubjectAttendance, AttendanceRecord } from "@/types/attendance";
import {
  calculatePercentage,
  calculateSafeBunks,
  calculateRequiredLectures,
  getAttendanceStatus,
} from "@/lib/attendanceStorage";
import {
  X,
  Check,
  Trash2,
  Edit3,
  History,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";

interface SubjectDetailModalProps {
  subject: SubjectAttendance | null;
  records: AttendanceRecord[];
  onClose: () => void;
  onMarkPresent: (subjectId: string) => void;
  onMarkAbsent: (subjectId: string) => void;
  onEditSubject: (subject: SubjectAttendance) => void;
  onDeleteSubject: (subjectId: string) => void;
  onDeleteRecord: (recordId: string) => void;
}

export const SubjectDetailModal: React.FC<SubjectDetailModalProps> = ({
  subject,
  records,
  onClose,
  onMarkPresent,
  onMarkAbsent,
  onEditSubject,
  onDeleteSubject,
  onDeleteRecord,
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!subject) return null;

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

  const subjectRecords = records.filter((r) => r.subjectId === subject.id);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-5 sm:p-7 backdrop-blur-xl border border-[#48D1CC]/40 shadow-[0_20px_50px_rgba(0,0,0,0.9)] select-none text-[#D6D9D4]"
        style={{
          backgroundColor: "rgba(4, 15, 25, 0.95)",
        }}
      >
        {/* Corner Ornaments */}
        <span className="absolute top-2 left-2.5 text-xs text-[#48D1CC]/50">⌜</span>
        <span className="absolute top-2 right-2.5 text-xs text-[#48D1CC]/50">⌝</span>
        <span className="absolute bottom-2 left-2.5 text-xs text-[#48D1CC]/50">⌞</span>
        <span className="absolute bottom-2 right-2.5 text-xs text-[#48D1CC]/50">⌟</span>

        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#142834]">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-[#E7C56D]">
                {subject.name}
              </h3>
              {subject.code && (
                <span className="font-mono text-xs text-[#48D1CC] px-2 py-0.5 rounded bg-[#09222c] border border-[#1b3b48]">
                  {subject.code}
                </span>
              )}
            </div>
            {subject.professor && (
              <p className="mt-1 text-xs text-[#AFC3CF] font-serif italic">
                Instructor: {subject.professor}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-lg bg-[#07131e] border border-[#1b3b48] text-[#9BA9AF] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Big Percentage & Health Summary */}
        <div className="my-6 grid grid-cols-1 sm:grid-cols-12 gap-5 items-center p-4 rounded-xl bg-[#02070e]/80 border border-[#1b3b48]/70">
          <div className="sm:col-span-5 text-center sm:text-left">
            <span className="font-cinzel text-5xl font-bold tracking-tight text-[#FFF5D6] drop-shadow-[0_0_12px_rgba(231,197,109,0.3)]">
              {percentage}%
            </span>
            <div className="mt-1 flex items-center justify-center sm:justify-start gap-2">
              <span
                className={`px-2.5 py-0.5 rounded text-xs font-cinzel font-bold tracking-wider uppercase border ${
                  status === "safe"
                    ? "bg-emerald-950/70 text-emerald-300 border-emerald-500/40"
                    : status === "warning"
                    ? "bg-amber-950/70 text-amber-300 border-amber-500/40"
                    : "bg-rose-950/70 text-rose-300 border-rose-500/40"
                }`}
              >
                {status}
              </span>
              <span className="text-xs text-[#9BA9AF] font-mono">
                Target: {subject.targetPercentage}%
              </span>
            </div>
          </div>

          <div className="sm:col-span-7 space-y-2 text-xs font-serif text-[#AFC3CF]">
            {percentage >= subject.targetPercentage ? (
              <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-emerald-200">
                <div className="font-semibold text-emerald-300 flex items-center gap-1.5 font-cinzel">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  SAFE TO BUNK: {safeBunks} LECTURES
                </div>
                <p className="mt-1 text-[11px] leading-relaxed">
                  You can safely miss the next {safeBunks} lecture{safeBunks === 1 ? "" : "s"} and your attendance will stay at or above {subject.targetPercentage}%.
                </p>
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-500/30 text-rose-200">
                <div className="font-semibold text-rose-300 flex items-center gap-1.5 font-cinzel">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  ATTEND NEXT {requiredLectures} LECTURES
                </div>
                <p className="mt-1 text-[11px] leading-relaxed">
                  You are below target. You must attend {requiredLectures} consecutive lecture{requiredLectures === 1 ? "" : "s"} without missing to reach {subject.targetPercentage}%.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="p-3 rounded-xl bg-[#030d17] border border-[#1b3b48] text-center">
            <span className="text-[10px] uppercase font-mono text-[#9BA9AF]">Attended</span>
            <div className="font-cinzel text-2xl font-bold text-emerald-400">{subject.present}</div>
          </div>
          <div className="p-3 rounded-xl bg-[#030d17] border border-[#1b3b48] text-center">
            <span className="text-[10px] uppercase font-mono text-[#9BA9AF]">Missed</span>
            <div className="font-cinzel text-2xl font-bold text-rose-400">{subject.absent}</div>
          </div>
          <div className="p-3 rounded-xl bg-[#030d17] border border-[#1b3b48] text-center">
            <span className="text-[10px] uppercase font-mono text-[#9BA9AF]">Total</span>
            <div className="font-cinzel text-2xl font-bold text-[#D6D9D4]">{subject.total}</div>
          </div>
        </div>

        {/* Quick Action Controls */}
        <div className="p-4 rounded-xl bg-[#020509]/80 border border-[#1b3b48] mb-6">
          <h4 className="text-xs font-cinzel font-bold text-[#AFC3CF] uppercase tracking-wider mb-3">
            Quick Attendance Action
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => onMarkPresent(subject.id)}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[#092d24] hover:bg-[#0d3f32] active:bg-[#124d43] border border-emerald-500/50 text-emerald-300 font-mono font-bold text-xs tracking-wider transition-all cursor-pointer shadow-[0_0_12px_rgba(16,185,129,0.2)]"
            >
              <Check className="w-4 h-4 text-emerald-400" />
              <span>MARK PRESENT (+1)</span>
            </button>

            <button
              type="button"
              onClick={() => onMarkAbsent(subject.id)}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[#2e0e15] hover:bg-[#40131d] active:bg-[#521926] border border-rose-500/50 text-rose-300 font-mono font-bold text-xs tracking-wider transition-all cursor-pointer shadow-[0_0_12px_rgba(244,63,94,0.2)]"
            >
              <X className="w-4 h-4 text-rose-400" />
              <span>MARK ABSENT (+1)</span>
            </button>
          </div>
        </div>

        {/* Subject History Log */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-cinzel text-xs font-bold uppercase tracking-wider text-[#AFC3CF] flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-[#48D1CC]" />
              Subject Log History ({subjectRecords.length})
            </h4>
          </div>

          {subjectRecords.length === 0 ? (
            <p className="text-xs text-[#9BA9AF] font-serif italic py-4 text-center">
              No recent attendance actions recorded for this subject yet.
            </p>
          ) : (
            <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
              {subjectRecords.map((rec) => (
                <div
                  key={rec.id}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-[#030911] border border-[#142834] text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                        rec.status === "present"
                          ? "bg-emerald-950 border border-emerald-500/50 text-emerald-300"
                          : "bg-rose-950 border border-rose-500/50 text-rose-300"
                      }`}
                    >
                      {rec.status === "present" ? "✓" : "✕"}
                    </span>
                    <div>
                      <span className="font-mono text-[#D6D9D4]">{rec.date}</span>
                      <span className="ml-2 text-[10px] text-[#9BA9AF] uppercase font-mono">
                        {rec.status}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onDeleteRecord(rec.id)}
                    title="Undo/Delete entry"
                    className="p-1 rounded text-[#9BA9AF] hover:text-rose-400 hover:bg-rose-950/30 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Actions: Edit Subject & Delete Subject */}
        <div className="pt-4 border-t border-[#142834] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onEditSubject(subject)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#081822] border border-[#1b3b48] hover:border-[#48D1CC] text-xs font-serif text-[#AFC3CF] hover:text-white transition-all cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#48D1CC]" />
              <span>Edit Subject Data</span>
            </button>
          </div>

          <div>
            {showDeleteConfirm ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-rose-300 font-serif">Confirm delete?</span>
                <button
                  type="button"
                  onClick={() => {
                    onDeleteSubject(subject.id);
                    onClose();
                  }}
                  className="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-700 text-white font-mono text-xs cursor-pointer"
                >
                  Yes, Delete
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-2 py-1 text-xs text-[#9BA9AF] hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-serif text-rose-400/80 hover:text-rose-300 hover:bg-rose-950/20 transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Subject</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
