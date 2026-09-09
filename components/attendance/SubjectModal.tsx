"use client";

import React, { useState } from "react";
import { SubjectAttendance } from "@/types/attendance";
import { X, Save, Plus } from "lucide-react";

interface SubjectModalProps {
  isOpen: boolean;
  subjectToEdit: SubjectAttendance | null;
  onClose: () => void;
  onSave: (data: {
    id?: string;
    name: string;
    code?: string;
    professor?: string;
    targetPercentage: number;
    present: number;
    absent: number;
  }) => void;
}

interface SubjectModalContentProps {
  subjectToEdit: SubjectAttendance | null;
  onClose: () => void;
  onSave: SubjectModalProps["onSave"];
}

const SubjectModalContent: React.FC<SubjectModalContentProps> = ({
  subjectToEdit,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState(subjectToEdit?.name || "");
  const [code, setCode] = useState(subjectToEdit?.code || "");
  const [professor, setProfessor] = useState(subjectToEdit?.professor || "");
  const [targetPercentage, setTargetPercentage] = useState(
    subjectToEdit?.targetPercentage || 75
  );
  const [present, setPresent] = useState(subjectToEdit?.present || 0);
  const [absent, setAbsent] = useState(subjectToEdit?.absent || 0);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please provide a subject name.");
      return;
    }

    onSave({
      id: subjectToEdit?.id,
      name: name.trim(),
      code: code.trim() || undefined,
      professor: professor.trim() || undefined,
      targetPercentage: Number(targetPercentage) || 75,
      present: Math.max(0, Number(present) || 0),
      absent: Math.max(0, Number(absent) || 0),
    });

    onClose();
  };

  const targetPresets = [70, 75, 80, 85, 90];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg rounded-2xl p-6 sm:p-7 backdrop-blur-xl border border-[#48D1CC]/40 shadow-[0_20px_50px_rgba(0,0,0,0.9)] select-none text-[#D6D9D4]"
        style={{
          backgroundColor: "rgba(4, 15, 25, 0.95)",
        }}
      >
        {/* Corner Ornaments */}
        <span className="absolute top-2 left-2.5 text-xs text-[#48D1CC]/50">⌜</span>
        <span className="absolute top-2 right-2.5 text-xs text-[#48D1CC]/50">⌝</span>
        <span className="absolute bottom-2 left-2.5 text-xs text-[#48D1CC]/50">⌞</span>
        <span className="absolute bottom-2 right-2.5 text-xs text-[#48D1CC]/50">⌟</span>

        <div className="flex items-center justify-between pb-3 border-b border-[#142834]">
          <h3 className="font-cinzel text-xl font-bold text-[#E7C56D]">
            {subjectToEdit ? "Edit Subject Curriculum" : "Enroll New Subject"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-lg bg-[#07131e] border border-[#1b3b48] text-[#9BA9AF] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {error && (
            <div className="p-2.5 rounded-lg bg-rose-950/60 border border-rose-500/40 text-xs text-rose-300">
              {error}
            </div>
          )}

          {/* Subject Name */}
          <div>
            <label className="block text-xs font-mono uppercase text-[#AFC3CF] mb-1">
              Subject Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Operating Systems"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg bg-[#02070e] border border-[#1b3b48] focus:border-[#48D1CC] text-sm text-[#D6D9D4] placeholder-[#4f6472] outline-none transition-colors"
            />
          </div>

          {/* Code & Professor */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono uppercase text-[#AFC3CF] mb-1">
                Course Code (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. CS-401"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#02070e] border border-[#1b3b48] focus:border-[#48D1CC] text-sm text-[#D6D9D4] placeholder-[#4f6472] outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase text-[#AFC3CF] mb-1">
                Instructor (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Prof. Vance"
                value={professor}
                onChange={(e) => setProfessor(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#02070e] border border-[#1b3b48] focus:border-[#48D1CC] text-sm text-[#D6D9D4] placeholder-[#4f6472] outline-none transition-colors"
              />
            </div>
          </div>

          {/* Target Percentage */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-mono uppercase text-[#AFC3CF]">
                Target Attendance %
              </label>
              <span className="font-cinzel text-sm font-bold text-[#48D1CC]">
                {targetPercentage}%
              </span>
            </div>

            <div className="flex items-center gap-2 mb-2">
              {targetPresets.map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => setTargetPercentage(pct)}
                  className={`px-2.5 py-1 text-xs font-mono rounded cursor-pointer transition-all ${
                    targetPercentage === pct
                      ? "bg-[#0c2e36] text-[#48D1CC] font-bold border border-[#48D1CC]/60 shadow-[0_0_8px_rgba(72,209,204,0.3)]"
                      : "bg-[#02070e] border border-[#1b3b48] text-[#9BA9AF] hover:text-[#D6D9D4]"
                  }`}
                >
                  {pct}%
                </button>
              ))}
            </div>

            <input
              type="range"
              min="50"
              max="95"
              step="1"
              value={targetPercentage}
              onChange={(e) => setTargetPercentage(Number(e.target.value))}
              className="w-full accent-[#48D1CC] cursor-pointer"
            />
          </div>

          {/* Initial Present & Absent Classes */}
          <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-[#02070e] border border-[#1b3b48]">
            <div>
              <label className="block text-[11px] font-mono uppercase text-emerald-400 mb-1">
                Classes Attended (Present)
              </label>
              <input
                type="number"
                min="0"
                value={present}
                onChange={(e) => setPresent(Math.max(0, parseInt(e.target.value, 10) || 0))}
                className="w-full px-3 py-1.5 rounded-lg bg-[#040f19] border border-emerald-500/30 focus:border-emerald-400 text-sm font-mono text-emerald-300 outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono uppercase text-rose-400 mb-1">
                Classes Missed (Absent)
              </label>
              <input
                type="number"
                min="0"
                value={absent}
                onChange={(e) => setAbsent(Math.max(0, parseInt(e.target.value, 10) || 0))}
                className="w-full px-3 py-1.5 rounded-lg bg-[#040f19] border border-rose-500/30 focus:border-rose-400 text-sm font-mono text-rose-300 outline-none"
              />
            </div>
          </div>

          {/* Calculated Preview */}
          <div className="flex items-center justify-between text-xs px-2 text-[#9BA9AF] font-mono">
            <span>
              Total: <strong className="text-[#D6D9D4]">{present + absent}</strong> lectures
            </span>
            <span>
              Calculated:{" "}
              <strong className="text-[#48D1CC]">
                {present + absent === 0
                  ? "100%"
                  : `${Math.round((present / (present + absent)) * 1000) / 10}%`}
              </strong>
            </span>
          </div>

          {/* Submit */}
          <div className="pt-3 border-t border-[#142834] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-serif text-[#AFC3CF] hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-[#0c2e36] to-[#093d3f] border border-[#48D1CC] text-[#D6D9D4] hover:text-white text-xs font-cinzel font-bold tracking-wider shadow-[0_0_15px_rgba(72,209,204,0.3)] hover:shadow-[0_0_20px_rgba(72,209,204,0.5)] transition-all cursor-pointer"
            >
              {subjectToEdit ? <Save className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              <span>{subjectToEdit ? "SAVE CHANGES" : "ENROLL SUBJECT"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const SubjectModal: React.FC<SubjectModalProps> = ({
  isOpen,
  subjectToEdit,
  onClose,
  onSave,
}) => {
  if (!isOpen) return null;

  return (
    <SubjectModalContent
      key={subjectToEdit?.id ?? "new_subject"}
      subjectToEdit={subjectToEdit}
      onClose={onClose}
      onSave={onSave}
    />
  );
};
