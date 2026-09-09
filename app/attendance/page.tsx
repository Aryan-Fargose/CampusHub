"use client";

import React, { useState, useEffect, useRef } from "react";
import { Header } from "@/components/layout/Header";
import { AttendanceBackground } from "@/components/attendance/AttendanceBackground";
import { AttendanceHero } from "@/components/attendance/AttendanceHero";
import { AttendanceOverview } from "@/components/attendance/AttendanceOverview";
import { SubjectCard } from "@/components/attendance/SubjectCard";
import { SubjectDetailModal } from "@/components/attendance/SubjectDetailModal";
import { SubjectModal } from "@/components/attendance/SubjectModal";
import { BunkCalculator } from "@/components/attendance/BunkCalculator";
import { AttendanceHistory } from "@/components/attendance/AttendanceHistory";
import { AttendanceInsights } from "@/components/attendance/AttendanceInsights";
import { useAttendance } from "@/lib/useAttendance";
import { mockCurrentUser } from "@/lib/mockData";
import { SubjectAttendance } from "@/types/attendance";
import { Plus, BookOpen, RotateCcw } from "lucide-react";
import { animate, stagger } from "animejs";

export default function AttendancePage() {
  const {
    isLoaded,
    subjects,
    records,
    targetPercentage,
    overallStats,
    setTargetPercentage,
    markPresent,
    markAbsent,
    addSubject,
    editSubject,
    removeSubject,
    removeRecord,
    resetAll,
  } = useAttendance();

  // Active view tab: "all" (full dashboard) | "calculator" | "history" | "insights"
  const [activeSection, setActiveSection] = useState<string>("all");

  // Modal states
  const [selectedSubjectForDetail, setSelectedSubjectForDetail] =
    useState<SubjectAttendance | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [subjectToEdit, setSubjectToEdit] = useState<SubjectAttendance | null>(null);

  // Keep selectedSubjectForDetail in sync with latest state
  const activeSubject = selectedSubjectForDetail
    ? subjects.find((s) => s.id === selectedSubjectForDetail.id) || null
    : null;

  // Staggered entrance animation with anime.js
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoaded) return;

    try {
      // Smooth reveal of cards on page load
      animate(".attendance-anim-card", {
        opacity: [0, 1],
        translateY: [20, 0],
        delay: stagger(60, { start: 100 }),
        ease: "outQuad",
        duration: 600,
      });
    } catch {
      // Fallback gracefully if animation context is restricted
    }
  }, [isLoaded, activeSection]);

  const handleOpenAddModal = () => {
    setSubjectToEdit(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (subject: SubjectAttendance) => {
    setSelectedSubjectForDetail(null);
    setSubjectToEdit(subject);
    setIsAddModalOpen(true);
  };

  const handleSaveSubject = (data: {
    id?: string;
    name: string;
    code?: string;
    professor?: string;
    targetPercentage: number;
    present: number;
    absent: number;
  }) => {
    if (data.id) {
      editSubject(data.id, data);
    } else {
      addSubject({
        name: data.name,
        code: data.code,
        professor: data.professor,
        targetPercentage: data.targetPercentage,
        initialPresent: data.present,
        initialAbsent: data.absent,
      });
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden bg-[#020509] text-[#f1ede4]">
      {/* 
        1. Cinematic Castle & Study Chamber Background
        Zero fog, zero haze, crisp and unblurred.
      */}
      <AttendanceBackground />

      {/* 
        2. Main Header (z-50)
      */}
      <Header user={mockCurrentUser} />

      {/* 
        3. Main Attendance Chamber UI
      */}
      <main
        ref={containerRef}
        className="relative z-10 mx-auto w-full max-w-7xl flex-1 px-4 sm:px-8 py-4 sm:py-6 flex flex-col gap-6 sm:gap-8"
      >
        {/* Attendance Hero: "ATTENDANCE" + "EVERY LECTURE LEAVES A TRACE" */}
        <AttendanceHero
          onAddSubject={handleOpenAddModal}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />

        {/* Dynamic Section Rendering */}
        {activeSection === "all" && (
          <>
            {/* Section 1: Overview Card with Big Radial Gauge */}
            <div className="attendance-anim-card">
              <AttendanceOverview
                stats={overallStats}
                onTargetChange={setTargetPercentage}
              />
            </div>

            {/* Section 2: Individual Subjects Grid */}
            <div className="attendance-anim-card space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 px-1">
                <div>
                  <h2 className="font-cinzel text-lg sm:text-xl font-bold tracking-wider text-[#E7C56D] flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#48D1CC]" />
                    COURSE REGISTRY ({subjects.length})
                  </h2>
                  <p className="text-xs text-[#AFC3CF] font-serif">
                    Tap [ PRESENT ] or [ ABSENT ] to record immediately &bull; Tap card for deep statistics
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleOpenAddModal}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#071922] hover:bg-[#0c2432] border border-[#48D1CC]/50 text-xs font-mono font-semibold text-[#48D1CC] hover:text-white transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Course</span>
                  </button>
                </div>
              </div>

              {/* Grid of Subject Cards */}
              {subjects.length === 0 ? (
                <div className="p-8 rounded-2xl bg-[#040f19]/80 border border-[#1b3b48] text-center space-y-3">
                  <p className="text-sm font-serif text-[#AFC3CF]">
                    You haven&apos;t enrolled any academic subjects yet.
                  </p>
                  <button
                    type="button"
                    onClick={handleOpenAddModal}
                    className="px-4 py-2 rounded-lg bg-[#09222c] border border-[#48D1CC] text-xs font-cinzel text-[#48D1CC] hover:text-white"
                  >
                    + Enroll First Subject
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                  {subjects.map((subject) => (
                    <SubjectCard
                      key={subject.id}
                      subject={subject}
                      onMarkPresent={markPresent}
                      onMarkAbsent={markAbsent}
                      onOpenDetail={(sub) => setSelectedSubjectForDetail(sub)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Section 3 & 4: Two-column Desktop Layout (Bunk Calculator & History) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
              <div className="attendance-anim-card lg:col-span-7">
                <BunkCalculator
                  subjects={subjects}
                  defaultTarget={targetPercentage}
                />
              </div>

              <div className="attendance-anim-card lg:col-span-5">
                <AttendanceHistory
                  records={records}
                  subjects={subjects}
                  onDeleteRecord={removeRecord}
                />
              </div>
            </div>

            {/* Section 5: Academic Insights */}
            <div className="attendance-anim-card">
              <AttendanceInsights stats={overallStats} subjects={subjects} />
            </div>
          </>
        )}

        {/* Tab Filter: Bunk Calculator Only */}
        {activeSection === "calculator" && (
          <div className="attendance-anim-card max-w-4xl mx-auto w-full">
            <BunkCalculator
              subjects={subjects}
              defaultTarget={targetPercentage}
            />
          </div>
        )}

        {/* Tab Filter: History Only */}
        {activeSection === "history" && (
          <div className="attendance-anim-card max-w-4xl mx-auto w-full">
            <AttendanceHistory
              records={records}
              subjects={subjects}
              onDeleteRecord={removeRecord}
            />
          </div>
        )}

        {/* Tab Filter: Insights Only */}
        {activeSection === "insights" && (
          <div className="attendance-anim-card max-w-4xl mx-auto w-full">
            <AttendanceInsights stats={overallStats} subjects={subjects} />
          </div>
        )}

        {/* Bottom Utility Bar: Demo Reset */}
        <div className="flex items-center justify-between pt-6 border-t border-[#142834]/80 text-xs text-[#9BA9AF]">
          <span className="font-serif">
            CampusHub &bull; Ravenclaw Academic Archive &bull; Real-time Local Persistence
          </span>
          <button
            type="button"
            onClick={resetAll}
            title="Reset to default engineering courses"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#030911] border border-[#142834] hover:border-amber-500/40 text-[11px] font-mono text-[#9BA9AF] hover:text-amber-300 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3 text-amber-400" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </main>

      {/* 
        Modals
      */}
      {/* 1. Subject Detail Modal */}
      <SubjectDetailModal
        subject={activeSubject}
        records={records}
        onClose={() => setSelectedSubjectForDetail(null)}
        onMarkPresent={markPresent}
        onMarkAbsent={markAbsent}
        onEditSubject={handleOpenEditModal}
        onDeleteSubject={removeSubject}
        onDeleteRecord={removeRecord}
      />

      {/* 2. Add / Edit Subject Modal */}
      <SubjectModal
        isOpen={isAddModalOpen}
        subjectToEdit={subjectToEdit}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveSubject}
      />
    </div>
  );
}
